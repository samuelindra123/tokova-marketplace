import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth Module (e2e)', () => {
    let app: INestApplication;
    let accessToken: string;
    let refreshToken: string;
    const testEmail = `test-${Date.now()}@test.com`;
    const testPassword = 'TestPassword123!';

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

    describe('POST /api/auth/register/customer', () => {
        it('should register a new customer', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/register/customer')
                .send({
                    email: testEmail,
                    password: testPassword,
                    firstName: 'Test',
                    lastName: 'User',
                    phone: '08123456789',
                })
                .expect(201);

            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;
        });

        it('should fail with duplicate email', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/register/customer')
                .send({
                    email: testEmail,
                    password: testPassword,
                    firstName: 'Test',
                    lastName: 'User',
                })
                .expect(409);
        });

        it('should fail with invalid email format', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/register/customer')
                .send({
                    email: 'invalid-email',
                    password: testPassword,
                    firstName: 'Test',
                    lastName: 'User',
                })
                .expect(400);
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login successfully', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: testPassword,
                })
                .expect(200);

            expect(response.body).toHaveProperty('user');
            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
            expect(response.body.user.email).toBe(testEmail);
            accessToken = response.body.accessToken;
            refreshToken = response.body.refreshToken;
        });

        it('should fail with wrong password', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: 'wrongpassword',
                })
                .expect(401);
        });

        it('should fail with non-existent email', async () => {
            await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    email: 'nonexistent@test.com',
                    password: testPassword,
                })
                .expect(401);
        });
    });

    describe('GET /api/auth/me', () => {
        it('should get current user profile', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('email', testEmail);
            expect(response.body).toHaveProperty('role', 'CUSTOMER');
        });

        it('should fail without token', async () => {
            await request(app.getHttpServer())
                .get('/api/auth/me')
                .expect(401);
        });

        it('should fail with invalid token', async () => {
            await request(app.getHttpServer())
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);
        });
    });

    describe('POST /api/auth/refresh-token', () => {
        it('should refresh access token', async () => {
            const response = await request(app.getHttpServer())
                .post('/api/auth/refresh-token')
                .set('Authorization', `Bearer ${refreshToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('accessToken');
            expect(response.body).toHaveProperty('refreshToken');
        });
    });

    describe('POST /api/auth/change-password', () => {
        it('should change password', async () => {
            const newPassword = 'NewPassword456!';

            await request(app.getHttpServer())
                .post('/api/auth/change-password')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    currentPassword: testPassword,
                    newPassword: newPassword,
                })
                .expect(200);

            // Login with new password
            await request(app.getHttpServer())
                .post('/api/auth/login')
                .send({
                    email: testEmail,
                    password: newPassword,
                })
                .expect(200);
        });
    });
});
