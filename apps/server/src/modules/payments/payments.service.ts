import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { eq, and } from 'drizzle-orm';
import { DATABASE_CONNECTION, type Database } from '../../database/database.module';
import * as schema from '../../database/schema';
import { MailService } from '../mail/mail.service';

@Injectable()
export class PaymentsService {
    private stripe: Stripe;
    private platformFeePercent: number;

    constructor(
        @Inject(DATABASE_CONNECTION) private db: Database,
        private configService: ConfigService,
        private mailService: MailService,
    ) {
        this.stripe = new Stripe(this.configService.get<string>('stripe.secretKey')!);
        this.platformFeePercent = this.configService.get<number>('stripe.platformFeePercent') || 10;
    }

    // ============ VENDOR ONBOARDING (Stripe Connect) ============

    /**
     * Create Stripe Connect account for vendor
     */
    async createVendorAccount(userId: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
            with: { user: true },
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        // Create Stripe Connect Express account
        const account = await this.stripe.accounts.create({
            type: 'express',
            email: vendor.user.email,
            metadata: {
                vendorId: vendor.id,
                userId: userId,
            },
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true },
            },
        });

        // Save Stripe account ID to vendor
        await this.db
            .update(schema.vendors)
            .set({
                bankInfo: {
                    ...(vendor.bankInfo as object || {}),
                    stripeAccountId: account.id,
                },
                updatedAt: new Date(),
            })
            .where(eq(schema.vendors.id, vendor.id));

        return { accountId: account.id };
    }

    /**
     * Get onboarding link for vendor to complete Stripe setup
     */
    async getVendorOnboardingLink(userId: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        const bankInfo = vendor.bankInfo as { stripeAccountId?: string } | null;
        let accountId = bankInfo?.stripeAccountId;

        // Create account if doesn't exist
        if (!accountId) {
            const result = await this.createVendorAccount(userId);
            accountId = result.accountId;
        }

        const frontendUrl = this.configService.get<string>('app.frontendUrl');

        const accountLink = await this.stripe.accountLinks.create({
            account: accountId,
            refresh_url: `${frontendUrl}/vendor/settings/payments?refresh=true`,
            return_url: `${frontendUrl}/vendor/settings/payments?success=true`,
            type: 'account_onboarding',
        });

        return { url: accountLink.url };
    }

    /**
     * Check if vendor has completed Stripe onboarding
     */
    async getVendorAccountStatus(userId: string) {
        const vendor = await this.db.query.vendors.findFirst({
            where: eq(schema.vendors.userId, userId),
        });

        if (!vendor) {
            throw new NotFoundException('Vendor not found');
        }

        const bankInfo = vendor.bankInfo as { stripeAccountId?: string } | null;
        if (!bankInfo?.stripeAccountId) {
            return { isOnboarded: false, accountId: null };
        }

        const account = await this.stripe.accounts.retrieve(bankInfo.stripeAccountId);

        return {
            isOnboarded: account.charges_enabled && account.payouts_enabled,
            accountId: account.id,
            chargesEnabled: account.charges_enabled,
            payoutsEnabled: account.payouts_enabled,
            detailsSubmitted: account.details_submitted,
        };
    }

    // ============ CUSTOMER PAYMENTS ============

    /**
     * Create checkout session for order payment
     */
    async createCheckoutSession(
        userId: string,
        orderId: string,
    ) {
        const customer = await this.db.query.customers.findFirst({
            where: eq(schema.customers.userId, userId),
            with: { user: true },
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        const order = await this.db.query.orders.findFirst({
            where: and(
                eq(schema.orders.id, orderId),
                eq(schema.orders.customerId, customer.id),
            ),
            with: {
                items: {
                    with: { vendor: true },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        if (order.paymentStatus === 'PAID') {
            throw new BadRequestException('Order already paid');
        }

        const frontendUrl = this.configService.get<string>('app.frontendUrl');

        // Build line items - using USD since prices are stored in USD
        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.productName,
                    images: item.productImage ? [item.productImage] : undefined,
                },
                unit_amount: Math.round(Number(item.price) * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Add shipping if applicable
        if (Number(order.shippingCost) > 0) {
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: 'Shipping' },
                    unit_amount: Math.round(Number(order.shippingCost) * 100),
                },
                quantity: 1,
            });
        }

        // Create Stripe Checkout Session
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: customer.user.email,
            line_items: lineItems,
            metadata: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                customerId: customer.id,
            },
            success_url: `${frontendUrl}/orders/${order.id}?payment=success`,
            cancel_url: `${frontendUrl}/orders/${order.id}?payment=cancelled`,
        });

        // Save payment ID to order
        await this.db
            .update(schema.orders)
            .set({
                paymentId: session.id,
                paymentMethod: 'stripe',
                updatedAt: new Date(),
            })
            .where(eq(schema.orders.id, orderId));

        return {
            sessionId: session.id,
            url: session.url,
        };
    }

    /**
     * Handle Stripe webhook events
     */
    async handleWebhook(payload: Buffer, signature: string) {
        const webhookSecret = this.configService.get<string>('stripe.webhookSecret');

        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret!);
        } catch (err) {
            throw new BadRequestException(`Webhook signature verification failed`);
        }

        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
                break;

            case 'payment_intent.succeeded':
                // Handle successful payment
                break;

            case 'payment_intent.payment_failed':
                await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
                break;

            case 'account.updated':
                // Handle vendor account updates
                break;
        }

        return { received: true };
    }

    private async handleCheckoutComplete(session: Stripe.Checkout.Session) {
        const orderId = session.metadata?.orderId;

        if (!orderId) return;

        const order = await this.db.query.orders.findFirst({
            where: eq(schema.orders.id, orderId),
            with: {
                customer: { with: { user: true } },
                items: { with: { vendor: true } },
            },
        });

        if (!order) return;

        // Update order status
        await this.db
            .update(schema.orders)
            .set({
                paymentStatus: 'PAID',
                status: 'PAID',
                paymentId: session.payment_intent as string,
                updatedAt: new Date(),
            })
            .where(eq(schema.orders.id, orderId));

        // Update order items
        await this.db
            .update(schema.orderItems)
            .set({ status: 'PROCESSING', updatedAt: new Date() })
            .where(eq(schema.orderItems.orderId, orderId));

        // Send confirmation email
        if (order.customer?.user?.email) {
            await this.mailService.sendOrderConfirmationEmail(
                order.customer.user.email,
                order.orderNumber,
                order.items.map((item) => ({
                    name: item.productName,
                    quantity: item.quantity,
                    price: Number(item.subtotal),
                })),
                Number(order.total),
            );
        }

        // Create vendor payouts (scheduled)
        await this.scheduleVendorPayouts(order.id);
    }

    private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
        const orderId = paymentIntent.metadata?.orderId;
        if (!orderId) return;

        await this.db
            .update(schema.orders)
            .set({
                paymentStatus: 'FAILED',
                updatedAt: new Date(),
            })
            .where(eq(schema.orders.id, orderId));
    }

    /**
     * Schedule payouts to vendors after successful payment
     */
    private async scheduleVendorPayouts(orderId: string) {
        const orderItems = await this.db.query.orderItems.findMany({
            where: eq(schema.orderItems.orderId, orderId),
            with: { vendor: true },
        });

        // Group by vendor
        const vendorTotals = new Map<string, number>();

        for (const item of orderItems) {
            const current = vendorTotals.get(item.vendorId) || 0;
            vendorTotals.set(item.vendorId, current + Number(item.subtotal));
        }

        // Create payout records
        for (const [vendorId, amount] of vendorTotals.entries()) {
            const vendor = await this.db.query.vendors.findFirst({
                where: eq(schema.vendors.id, vendorId),
            });

            const commissionRate = Number(vendor?.commissionRate || this.platformFeePercent);
            const commission = (amount * commissionRate) / 100;
            const netAmount = amount - commission;

            await this.db.insert(schema.vendorPayouts).values({
                vendorId,
                amount: amount.toString(),
                commission: commission.toString(),
                netAmount: netAmount.toString(),
                status: 'PENDING',
                bankInfo: vendor?.bankInfo,
            });
        }
    }

    // ============ ADMIN PAYOUTS ============

    /**
     * Process vendor payout via Stripe Connect
     */
    async processVendorPayout(payoutId: string) {
        const payout = await this.db.query.vendorPayouts.findFirst({
            where: eq(schema.vendorPayouts.id, payoutId),
            with: { vendor: true },
        });

        if (!payout) {
            throw new NotFoundException('Payout not found');
        }

        if (payout.status !== 'PENDING') {
            throw new BadRequestException('Payout is not pending');
        }

        const bankInfo = payout.vendor.bankInfo as { stripeAccountId?: string } | null;
        if (!bankInfo?.stripeAccountId) {
            throw new BadRequestException('Vendor has not completed Stripe onboarding');
        }

        try {
            // Create transfer to vendor's Stripe account
            const transfer = await this.stripe.transfers.create({
                amount: Math.round(Number(payout.netAmount) * 100), // Convert to cents
                currency: 'idr',
                destination: bankInfo.stripeAccountId,
                metadata: {
                    payoutId: payout.id,
                    vendorId: payout.vendorId,
                },
            });

            // Update payout status
            await this.db
                .update(schema.vendorPayouts)
                .set({
                    status: 'COMPLETED',
                    processedAt: new Date(),
                    notes: `Stripe transfer: ${transfer.id}`,
                    updatedAt: new Date(),
                })
                .where(eq(schema.vendorPayouts.id, payoutId));

            return { success: true, transferId: transfer.id };
        } catch (error) {
            await this.db
                .update(schema.vendorPayouts)
                .set({
                    status: 'FAILED',
                    notes: `Failed: ${error.message}`,
                    updatedAt: new Date(),
                })
                .where(eq(schema.vendorPayouts.id, payoutId));

            throw error;
        }
    }

    /**
     * Verify payment status for an order (called when user returns from Stripe)
     */
    async verifyPaymentStatus(userId: string, orderId: string) {
        const customer = await this.db.query.customers.findFirst({
            where: eq(schema.customers.userId, userId),
        });

        if (!customer) {
            throw new NotFoundException('Customer not found');
        }

        const order = await this.db.query.orders.findFirst({
            where: and(
                eq(schema.orders.id, orderId),
                eq(schema.orders.customerId, customer.id),
            ),
            with: {
                customer: { with: { user: true } },
                items: { with: { vendor: true } },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // If already paid, return current status
        if (order.paymentStatus === 'PAID') {
            return { status: 'PAID', updated: false };
        }

        // If no payment ID, nothing to verify
        if (!order.paymentId) {
            return { status: order.paymentStatus, updated: false };
        }

        try {
            // Retrieve the Stripe checkout session
            const session = await this.stripe.checkout.sessions.retrieve(order.paymentId);

            if (session.payment_status === 'paid') {
                // Update order status to paid
                await this.db
                    .update(schema.orders)
                    .set({
                        paymentStatus: 'PAID',
                        status: 'PROCESSING',
                        updatedAt: new Date(),
                    })
                    .where(eq(schema.orders.id, orderId));

                // Send confirmation email
                try {
                    await this.mailService.sendOrderConfirmationEmail(
                        order.customer.user.email,
                        order.orderNumber,
                        order.items.map((item) => ({
                            name: item.productName,
                            quantity: item.quantity,
                            price: Number(item.price),
                        })),
                        Number(order.total),
                    );
                } catch (emailErr) {
                    console.error('Failed to send order confirmation email:', emailErr);
                }

                return { status: 'PAID', updated: true };
            }

            return { status: order.paymentStatus, updated: false };
        } catch (err) {
            console.error('Error verifying Stripe session:', err);
            return { status: order.paymentStatus, updated: false };
        }
    }

    /**
     * Get Stripe publishable key for frontend
     */
    getPublishableKey() {
        return {
            publishableKey: this.configService.get<string>('stripe.publishableKey'),
        };
    }
}
