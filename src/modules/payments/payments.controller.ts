import * as common from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import { Public, CurrentUser, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';

@ApiTags('Payments')
@common.Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Public()
    @common.Get('config')
    @ApiOperation({ summary: 'Get Stripe publishable key' })
    getConfig() {
        return this.paymentsService.getPublishableKey();
    }

    // ============ CUSTOMER ENDPOINTS ============

    @common.Post('checkout/:orderId')
    @ApiBearerAuth()
    @common.UseGuards(RolesGuard)
    @Roles('CUSTOMER')
    @ApiOperation({ summary: 'Create checkout session for order' })
    async createCheckoutSession(
        @CurrentUser('id') userId: string,
        @common.Param('orderId') orderId: string,
    ) {
        return this.paymentsService.createCheckoutSession(userId, orderId);
    }

    @common.Post('verify/:orderId')
    @ApiBearerAuth()
    @common.UseGuards(RolesGuard)
    @Roles('CUSTOMER')
    @ApiOperation({ summary: 'Verify payment status for order (call after Stripe redirect)' })
    async verifyPaymentStatus(
        @CurrentUser('id') userId: string,
        @common.Param('orderId') orderId: string,
    ) {
        return this.paymentsService.verifyPaymentStatus(userId, orderId);
    }

    // ============ VENDOR ENDPOINTS ============

    @common.Get('vendor/onboarding')
    @ApiBearerAuth()
    @common.UseGuards(RolesGuard)
    @Roles('VENDOR')
    @ApiOperation({ summary: 'Get Stripe Connect onboarding link' })
    async getVendorOnboardingLink(@CurrentUser('id') userId: string) {
        return this.paymentsService.getVendorOnboardingLink(userId);
    }

    @common.Get('vendor/account-status')
    @ApiBearerAuth()
    @common.UseGuards(RolesGuard)
    @Roles('VENDOR')
    @ApiOperation({ summary: 'Get vendor Stripe account status' })
    async getVendorAccountStatus(@CurrentUser('id') userId: string) {
        return this.paymentsService.getVendorAccountStatus(userId);
    }

    // ============ ADMIN ENDPOINTS ============

    @common.Post('admin/payouts/:payoutId/process')
    @ApiBearerAuth()
    @common.UseGuards(RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Process vendor payout' })
    async processVendorPayout(@common.Param('payoutId') payoutId: string) {
        return this.paymentsService.processVendorPayout(payoutId);
    }

    // ============ WEBHOOK ============

    @Public()
    @common.Post('webhook')
    @ApiOperation({ summary: 'Handle Stripe webhooks' })
    async handleWebhook(
        @common.Req() req: common.RawBodyRequest<Request>,
        @common.Headers('stripe-signature') signature: string,
    ) {
        return this.paymentsService.handleWebhook(req.rawBody!, signature);
    }
}
