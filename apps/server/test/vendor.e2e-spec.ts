import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Vendor Module (e2e)', () => {
    let app: INestApplication;
    let vendorToken: string;
    let adminToken: string;
    let productId: string;
    let vendorId: string;
    const vendorEmail = `vendor-${Date.now()}@test.com`;
    const adminEmail = `admin-${Date.now()}@test.com`;

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

        // Register vendor
        await request(app.getHttpServer())
            .post('/api/auth/register/vendor')
            .send({
                email: vendorEmail,
                password: 'VendorPass123!',
                storeName: `Test Store ${Date.now()}`,
                description: 'Test vendor store',
                phone: '08123456789',
            });

        // Note: In real scenario, admin would approve vendor first
        // For testing, we login to get vendorId
        const loginRes = await request(app.getHttpServer())
            .post('/api/auth/login')
            .send({
                email: vendorEmail,
                password: 'VendorPass123!',
            });

        // Vendor might not be approved yet, so we skip if login fails
        if (loginRes.status === 200) {
            vendorToken = loginRes.body.accessToken;
        }
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Vendor Registration', () => {
        it('POST /api/auth/register/vendor - should register vendor', async () => {
            const uniqueEmail = `vendor-new-${Date.now()}@test.com`;

            const response = await request(app.getHttpServer())
                .post('/api/auth/register/vendor')
                .send({
                    email: uniqueEmail,
                    password: 'VendorPass123!',
                    storeName: `New Store ${Date.now()}`,
                    description: 'New vendor store',
                    phone: '08987654321',
                })
                .expect(201);

            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Registration successful');
        });

        it('should fail with duplicate store name', async () => {
            const storeName = `Duplicate Store ${Date.now()}`;

            // First registration
            await request(app.getHttpServer())
                .post('/api/auth/register/vendor')
                .send({
                    email: `vendor1-${Date.now()}@test.com`,
                    password: 'VendorPass123!',
                    storeName: storeName,
                    description: 'First store',
                    phone: '08111111111',
                });

            // Second registration with same store name
            await request(app.getHttpServer())
                .post('/api/auth/register/vendor')
                .send({
                    email: `vendor2-${Date.now()}@test.com`,
                    password: 'VendorPass123!',
                    storeName: storeName,
                    description: 'Second store',
                    phone: '08222222222',
                })
                .expect(409);
        });
    });

    // The following tests require approved vendor
    describe('Vendor Store (requires approval)', () => {
        it.skip('GET /api/vendor/store - should get store profile', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/vendor/store')
                .set('Authorization', `Bearer ${vendorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('storeName');
        });

        it.skip('PUT /api/vendor/store - should update store profile', async () => {
            const response = await request(app.getHttpServer())
                .put('/api/vendor/store')
                .set('Authorization', `Bearer ${vendorToken}`)
                .send({
                    description: 'Updated description',
                })
                .expect(200);

            expect(response.body.description).toBe('Updated description');
        });
    });

    describe('Vendor Products (requires approval)', () => {
        it.skip('POST /api/vendor/products - should create product', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/vendor/products')
                .set('Authorization', `Bearer ${vendorToken}`)
                .send({
                    name: 'Test Product',
                    description: 'Test product description',
                    price: 100000,
                    stock: 10,
                    sku: `SKU-${Date.now()}`,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            productId = response.body.id;
        });

        it.skip('GET /api/vendor/products - should list products', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/vendor/products')
                .set('Authorization', `Bearer ${vendorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(Array.isArray(response.body.data)).toBe(true);
        });
    });

    describe('Vendor Orders (requires approval)', () => {
        it.skip('GET /api/vendor/orders - should list orders', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/vendor/orders')
                .set('Authorization', `Bearer ${vendorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });

        it.skip('GET /api/vendor/analytics - should get analytics', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/vendor/analytics')
                .set('Authorization', `Bearer ${vendorToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('totalSales');
        });
    });
});
