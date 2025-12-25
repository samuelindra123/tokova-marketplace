import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Admin Module (e2e)', () => {
    let app: INestApplication;
    let adminToken: string;
    let customerToken: string;
    let categoryId: string;

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

        // Create customer for access control testing
        const customerRes = await request(app.getHttpServer())
            .post('/api/auth/register/customer')
            .send({
                email: `admin-test-customer-${Date.now()}@test.com`,
                password: 'AdminTest123!',
                firstName: 'Admin',
                lastName: 'Test',
            });
        customerToken = customerRes.body.accessToken;

        // Note: In real scenario, you'd have an admin user seeded in DB
        // For testing, we use customer to verify access is denied
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Admin Access Control', () => {
        it('GET /api/admin/dashboard - should deny customer access', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403);
        });

        it('GET /api/admin/vendors - should deny customer access', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/vendors')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403);
        });

        it('GET /api/admin/categories - should deny customer access', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/categories')
                .set('Authorization', `Bearer ${customerToken}`)
                .expect(403);
        });

        it('should deny unauthenticated access', async () => {
            await request(app.getHttpServer())
                .get('/api/admin/dashboard')
                .expect(401);
        });
    });

    // The following tests require actual admin user
    // Skip these and run manually with admin credentials
    describe('Admin Dashboard (requires admin)', () => {
        it.skip('GET /api/admin/dashboard - should get statistics', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/dashboard')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('totalVendors');
            expect(response.body).toHaveProperty('totalCustomers');
            expect(response.body).toHaveProperty('totalProducts');
            expect(response.body).toHaveProperty('totalOrders');
            expect(response.body).toHaveProperty('totalRevenue');
        });
    });

    describe('Admin Vendors (requires admin)', () => {
        it.skip('GET /api/admin/vendors - should list vendors', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/vendors')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
        });

        it.skip('PUT /api/admin/vendors/:id/status - should update vendor status', async () => {
            const response = await request(app.getHttpServer())
                .put('/api/admin/vendors/some-vendor-id/status')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    status: 'APPROVED',
                })
                .expect(200);

            expect(response.body).toHaveProperty('message');
        });
    });

    describe('Admin Categories (requires admin)', () => {
        it.skip('POST /api/admin/categories - should create category', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/admin/categories')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: `Test Category ${Date.now()}`,
                    sortOrder: 0,
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            categoryId = response.body.id;
        });

        it.skip('GET /api/admin/categories - should list categories', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/admin/categories')
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });

        it.skip('PUT /api/admin/categories/:id - should update category', async () => {
            const response = await request(app.getHttpServer())
                .put(`/api/admin/categories/${categoryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    name: 'Updated Category Name',
                })
                .expect(200);

            expect(response.body.name).toBe('Updated Category Name');
        });

        it.skip('DELETE /api/admin/categories/:id - should delete category', async () => {
            await request(app.getHttpServer())
                .delete(`/api/admin/categories/${categoryId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .expect(200);
        });
    });
});
