import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Products Module - Public Endpoints (e2e)', () => {
    let app: INestApplication;

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

    describe('GET /api/products', () => {
        it('should list products (public)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products')
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should support pagination', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products?page=1&limit=5')
                .expect(200);

            expect(response.body.meta).toHaveProperty('page', 1);
            expect(response.body.meta).toHaveProperty('limit', 5);
        });

        it('should support search', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products?search=test')
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });

        it('should support sorting', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products?sortBy=price_asc')
                .expect(200);

            expect(response.body).toHaveProperty('data');
        });
    });

    describe('GET /api/products/categories', () => {
        it('should list categories (public)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products/categories')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /api/products/stores', () => {
        it('should list stores (public)', async () => {
            const response = await request(app.getHttpServer())
                .get('/api/products/stores')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
        });
    });
});
