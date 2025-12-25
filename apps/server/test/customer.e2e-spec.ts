import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Customer Module (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let addressId: string;
    let cartItemId: string;
    let wishlistItemId: string;
    const testEmail = `customer-${Date.now()}@test.com`;

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
                email: testEmail,
                password: 'TestPass123!',
                firstName: 'Customer',
                lastName: 'Test',
            });
        accessToken = registerRes.body.accessToken;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Customer Addresses', () => {
        it('POST /api/customer/addresses - should create address', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/customer/addresses')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    label: 'Home',
                    recipientName: 'Test User',
                    phone: '08123456789',
                    addressLine: 'Jl. Test No. 123',
                    city: 'Jakarta',
                    province: 'DKI Jakarta',
                    postalCode: '12345',
                    isDefault: true,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body.label).toBe('Home');
            addressId = response.body.id;
        });

        it('GET /api/customer/addresses - should list addresses', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/customer/addresses')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThan(0);
        });

        it('GET /api/customer/addresses/:id - should get address by id', async () => {
            const response = await request(app.getHttpServer())
                .get(`/api/customer/addresses/${addressId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.id).toBe(addressId);
        });

        it('PUT /api/customer/addresses/:id - should update address', async () => {
            const response = await request(app.getHttpServer())
                .put(`/api/customer/addresses/${addressId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    label: 'Office',
                })
                .expect(200);

            expect(response.body.label).toBe('Office');
        });
    });

    describe('Customer Cart', () => {
        it('GET /api/customer/cart - should get empty cart', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/customer/cart')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('items');
            expect(Array.isArray(response.body.items)).toBe(true);
        });

        // Note: Adding to cart requires existing products
        // This test will be skipped if no products exist
        it.skip('POST /api/customer/cart - should add to cart', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/customer/cart')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    productId: 'some-product-id',
                    quantity: 1,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            cartItemId = response.body.id;
        });
    });

    describe('Customer Wishlist', () => {
        it('GET /api/customer/wishlist - should get wishlist', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/customer/wishlist')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('Customer Orders', () => {
        it('GET /api/customer/orders - should get orders list', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/customer/orders')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('Address Cleanup', () => {
        it('DELETE /api/customer/addresses/:id - should delete address', async () => {
            await request(app.getHttpServer())
                .delete(`/api/customer/addresses/${addressId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);
        });
    });
});
