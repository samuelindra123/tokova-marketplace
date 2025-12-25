import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend, admin, and vendor
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3001',
      process.env.ADMIN_URL || 'http://localhost:5173',
      process.env.VENDOR_URL || 'http://localhost:3002',
      'http://localhost:5173', // Admin frontend
      'http://localhost:3000', // Customer frontend
      'http://localhost:3002', // Vendor frontend
    ],
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger/OpenAPI Document
  const config = new DocumentBuilder()
    .setTitle('Multivendor Marketplace API')
    .setDescription(`
## 🛒 Complete API for Multivendor E-commerce Marketplace

This API provides comprehensive endpoints for building a multivendor marketplace platform.

### 🔐 Authentication
All protected endpoints require a Bearer token in the Authorization header.

### 👥 User Roles
- **ADMIN** - Platform administrators
- **VENDOR** - Store owners and sellers  
- **CUSTOMER** - Shoppers and buyers

### 💳 Payment Integration
Integrated with Stripe Connect for multivendor payments, vendor onboarding, and automated payouts.

### 📧 Email Notifications
Automated emails via Mailgun for order confirmations, vendor approvals, password resets, etc.
    `)
    .setVersion('1.0.0')
    .setContact('API Support', 'https://marketplace.com', 'support@marketplace.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:4000', 'Development Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT access token',
      },
      'JWT-auth',
    )
    .addTag('Authentication', 'User authentication, registration, and password management')
    .addTag('Admin - Dashboard', 'Platform statistics and analytics')
    .addTag('Admin - Vendors', 'Vendor application management and moderation')
    .addTag('Admin - Categories', 'Product category management with tree structure')
    .addTag('Vendor - Store', 'Vendor store profile and settings')
    .addTag('Vendor - Products', 'Product listing, inventory, and management')
    .addTag('Vendor - Orders', 'Order fulfillment and tracking')
    .addTag('Customer - Cart', 'Shopping cart operations')
    .addTag('Customer - Orders', 'Order history and tracking')
    .addTag('Customer - Wishlist', 'Product wishlist management')
    .addTag('Customer - Addresses', 'Shipping address management')
    .addTag('Products', 'Public product catalog, search, and filtering')
    .addTag('Payments', 'Stripe payment processing and webhooks')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Scalar API Reference (Modern API Documentation)
  app.use(
    '/api/docs',
    apiReference({
      theme: 'purple',
      content: document,
    }),
  );

  // Also keep OpenAPI JSON endpoint for tooling
  SwaggerModule.setup('api/openapi', app, document, {
    jsonDocumentUrl: '/api/openapi.json',
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  console.log(`
🚀 Multivendor Marketplace API is running!
📍 API: http://localhost:${port}/api
📚 Docs (Scalar): http://localhost:${port}/api/docs
📄 OpenAPI JSON: http://localhost:${port}/api/openapi.json
  `);
}

bootstrap();

