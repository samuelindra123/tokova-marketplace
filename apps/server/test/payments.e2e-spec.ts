import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Payment Module (e2e)', () => {
    let app: INestApplication;
    let customerToken: string;
    let vendorToken: string = ''; // Initialize for skipped tests
    const customerEmail = `payment-customer-${Date.now()}@test.com`;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        await app.init();

        // Register and login customer
        const registerRes = await request(app.getHttpServer())
            .post('/api/auth/register/customer')
            .send({
                email: customerEmail,
                password: 'PaymentTest123!',
                firstName: 'Payment',
                lastName: 'Customer',
            });
        customerToken = registerRes.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /api/payments/config', () => {
        it('should get Stripe publishable key (public)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/payments/config')
                .expect(200);

            expect(response.body).toHaveProperty('publishableKey');
        });
    });

    describe('Customer Payment Endpoints', () => {
        it('POST /api/payments/checkout/:orderId - should require valid order', async () => {
            // Use a valid UUID format even if order doesn't exist
            await request(app.getHttpServer())
                .post('/api/payments/checkout/00000000-0000-0000-0000-000000000000')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(404); // Order not found
        });

        it('should reject without authentication', async () => {
            await request(app.getHttpServer())
                .post('/api/payments/checkout/00000000-0000-0000-0000-000000000000')
                .expect(401);
        });
    });

    describe('Vendor Payment Endpoints', () => {
        it.skip('GET /api/payments/vendor/onboarding - should get onboarding link', async () => {
            // Requires approved vendor
            const response = await request(app.getHttpServer())
                .get('/api/payments/vendor/onboarding')
                .set('Authorization', `Bearer ${vendorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('url');
        });

        it.skip('GET /api/payments/vendor/account-status - should get account status', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/payments/vendor/account-status')
                .set('Authorization', `Bearer ${vendorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('isOnboarded');
        });
    });

    describe('Webhook Endpoint', () => {
        it('POST /api/payments/webhook - should reject invalid signature', async () => {
            await request(app.getHttpServer())
                .post('/api/payments/webhook')
                .set('stripe-signature', 'invalid-signature')
                .send({})
                .expect(400);
        });
    });

    describe('Admin Payout Endpoints', () => {
        it('POST /api/payments/admin/payouts/:id/process - should require admin role', async () => {
            // Customer trying to access admin endpoint
            await request(app.getHttpServer())
                .post('/api/payments/admin/payouts/some-payout-id/process')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403); // Forbidden
        });
    });
});
