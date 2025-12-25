# Tokova Marketplace 🛍️

Tokova is a modern, full-stack multi-vendor e-commerce platform built with **NestJS** (Backend) and **Next.js** (Frontend). It features a robust ecosystem connecting Customers, Vendors, and Administrators in a seamless interface.

## 🚀 Features

### 🛒 Customer App
*   **User Accounts**: Register, Login, Profile Management.
*   **Product Discovery**: Search, Categories, Filters, Product Details.
*   **Shopping Experience**: Cart, Checkout, Wishlist.
*   **Order Management**: Order History, Tracking (Simulated).
*   **Support**: AI-powered Help Center (TokoBot), Contact Us Form.
*   **Policy Pages**: Terms, Privacy, Shipping, Returns.

### 🏪 Vendor App
*   **Store Management**: Setup store profile, logo, and banner.
*   **Product Management**: Create, Edit, Delete products with image uploads.
*   **Order Fulfillment**: View orders, update status (Process, Ship).
*   **Dashboard**: Real-time sales statistics and charts.
*   **Authentication**: Secure Vendor Registration and Login.

### 🛡️ Admin App
*   **Global Overview**: Dashboard with platform-wide metrics.
*   **User Management**: Manage Customers and Vendors.
*   **Content Moderation**: Approve/Reject Vendors and Products.
*   **System Settings**: Configure global parameters.

## 🛠️ Tech Stack

*   **Monorepo**: Managed workspace for all applications.
*   **Backend**: NestJS (TypeScript), TypeORM, PostgreSQL.
*   **Frontend (Customer & Vendor)**: Next.js 14 (App Router), Tailwind CSS.
*   **Frontend (Admin)**: React (Vite), Tailwind CSS.
*   **Email**: Mailgun integration for transactional emails.
*   **Database**: PostgreSQL.

---

## 📂 Project Structure

```bash
.
├── apps
│   ├── admin       # Admin Control Panel (React/Vite)
│   ├── customer    # Main Shopping Site (Next.js)
│   ├── server      # Backend API Gateway (NestJS)
│   └── vendor      # Seller Dashboard (Next.js)
└── ...
```

---

## ⚙️ Installation & Setup

### 1. Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   PostgreSQL Database

### 2. Clone Repository
```bash
git clone <repository_url>
cd tokova
```

### 3. Install Dependencies
Install dependencies for all workspaces:
```bash
npm install
```

### 4. Environment Configuration

You need to configure `.env` files for each application.

#### **Backend (`apps/server/.env`)**
Create this file in `apps/server/`:
```env
PORT=4000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=tokova
JWT_SECRET=your_jwt_secret
MAILGUN_API_KEY=your_mailgun_key
MAILGUN_DOMAIN=your_mailgun_domain
MAILGUN_FROM_EMAIL=noreply@tokova.com
```

#### **Customer App (`apps/customer/.env.local`)**
Create this file in `apps/customer/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

#### **Vendor App (`apps/vendor/.env.local`)**
Create this file in `apps/vendor/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_CUSTOMER_URL=http://localhost:3000
```

#### **Admin App (`apps/admin/.env`)**
Create this file in `apps/admin/`:
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 🏃‍♂️ Running the Applications

It is recommended to run each application in a separate terminal.

### 1. Backend Server
```bash
cd apps/server
npm run start:dev
```
*Server runs on: `http://localhost:4000`*

### 2. Customer App
```bash
cd apps/customer
npm run dev
```
*Customer App runs on: `http://localhost:3000`*

### 3. Vendor App
```bash
cd apps/vendor
npm run dev
```
*Vendor App runs on: `http://localhost:3002`* (default port might vary, check terminal)

### 4. Admin App
```bash
cd apps/admin
npm run dev
```
*Admin App runs on: `http://localhost:5173`* (default port might vary)

---

## 🛠️ Development Notes

*   **API Documentation**: The backend provides Swagger documentation (typically at `/api/docs` if enabled).
*   **Database Sync**: The backend uses TypeORM. Ensure your database is running before starting the server.
*   **Image Uploads**: Currently handled via local storage or specific cloud provider (check `UploadModule`).

---

## © License
Tokova Marketplace - All Rights Reserved.
