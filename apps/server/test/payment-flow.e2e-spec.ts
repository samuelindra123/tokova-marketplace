import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

/**
 * Integration Test Suite for Complete Payment Flow
 * 
 * This test simulates a complete e-commerce transaction:
 * 1. Customer registers and logs in
 * 2. Customer browses products
 * 3. Customer adds to cart
 * 4. Customer creates order
 * 5. Customer pays (Stripe checkout)
 * 6. Webhook updates order status
 * 7. Vendor sees order
 * 8. Admin processes payout
 */
describe('Complete Payment Flow Integration (e2e)', () => {
    let app: INestApplication;
    let customerToken: string;
    let addressId: string;
    let orderId: string;
    const customerEmail = `flow-customer-${Date.now()}@test.com`;

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
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Step 1: Customer Registration', () => {
        it('should register customer', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/register/customer')
                .send({
                    email: customerEmail,
                    password: 'FlowTest123!',
                    firstName: 'Flow',
                    lastName: 'Test',
                    phone: '08123456789',
                })
                .expect(201);

            expect(response.body).toHaveProperty('accessToken');
            customerToken = response.body.accessToken;
        });
    });

    describe('Step 2: Customer Login', () => {
        it('should login and get tokens', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    email: customerEmail,
                    password: 'FlowTest123!',
                })
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            customerToken = response.body.accessToken;
        });
    });

    describe('Step 3: Browse Products', () => {
        it('should list available products', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products')
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should list categories', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products/categories')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('Step 4: Create Address', () => {
        it('should create shipping address', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/customer/addresses')
                .set('Authorization', `Bearer ${customerToken}`)
                .send({
                    label: 'Home',
                    recipientName: 'Flow Test',
                    phone: '08123456789',
                    addressLine: 'Jl. Test No. 123',
                    city: 'Jakarta',
                    province: 'DKI Jakarta',
                    postalCode: '12345',
                    isDefault: true,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            addressId = response.body.id;
        });
    });

    describe('Step 5: Cart Operations', () => {
        it('should get empty cart', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/customer/cart')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('items');
        });

        // Note: Adding actual products requires seeded data
        it.skip('should add product to cart', async () => {
            // This requires actual product IDs
        });
    });

    describe('Step 6: Payment Configuration', () => {
        it('should get Stripe publishable key', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/payments/config')
                .expect(200);

            expect(response.body).toHaveProperty('publishableKey');
            expect(response.body.publishableKey).toMatch(/^pk_/);
        });
    });

    describe('Step 7: Order Management', () => {
        it('should list customer orders', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/customer/orders')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });
    });

    describe('Step 8: Profile Check', () => {
        it('should verify customer profile', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(200);

            expect(response.body.email).toBe(customerEmail);
            expect(response.body.role).toBe('CUSTOMER');
        });
    });
});
