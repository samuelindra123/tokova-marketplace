import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    decimal,
    integer,
    jsonb,
    pgEnum,
    index,
    uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============ ENUMS ============

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'VENDOR', 'CUSTOMER']);

export const vendorStatusEnum = pgEnum('vendor_status', [
    'PENDING',
    'APPROVED',
    'REJECTED',
    'SUSPENDED',
]);

export const productStatusEnum = pgEnum('product_status', [
    'DRAFT',
    'ACTIVE',
    'INACTIVE',
]);

export const orderStatusEnum = pgEnum('order_status', [
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
    'PENDING',
    'PAID',
    'FAILED',
    'REFUNDED',
]);

export const orderItemStatusEnum = pgEnum('order_item_status', [
    'PENDING',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
]);

export const payoutStatusEnum = pgEnum('payout_status', [
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
]);

// ============ TABLES ============

export const users = pgTable(
    'users',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        email: varchar('email', { length: 255 }).notNull().unique(),
        password: varchar('password', { length: 255 }).notNull(),
        role: userRoleEnum('role').notNull().default('CUSTOMER'),
        isVerified: boolean('is_verified').notNull().default(false),
        isActive: boolean('is_active').notNull().default(true),
        verificationToken: varchar('verification_token', { length: 255 }),
        resetPasswordToken: varchar('reset_password_token', { length: 255 }),
        resetPasswordExpires: timestamp('reset_password_expires'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('users_email_idx').on(table.email),
        index('users_role_idx').on(table.role),
    ],
);

export const vendors = pgTable(
    'vendors',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        storeName: varchar('store_name', { length: 255 }).notNull().unique(),
        storeSlug: varchar('store_slug', { length: 255 }).notNull().unique(),
        description: text('description'),
        logo: varchar('logo', { length: 500 }),
        banner: varchar('banner', { length: 500 }),
        status: vendorStatusEnum('status').notNull().default('PENDING'),
        commissionRate: decimal('commission_rate', { precision: 5, scale: 2 })
            .notNull()
            .default('10.00'),
        bankInfo: jsonb('bank_info'),
        phone: varchar('phone', { length: 20 }),
        address: text('address'),
        storeNameChangedAt: timestamp('store_name_changed_at'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('vendors_store_slug_idx').on(table.storeSlug),
        index('vendors_status_idx').on(table.status),
        index('vendors_user_id_idx').on(table.userId),
    ],
);

export const customers = pgTable(
    'customers',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        firstName: varchar('first_name', { length: 100 }),
        lastName: varchar('last_name', { length: 100 }),
        phone: varchar('phone', { length: 20 }),
        avatar: varchar('avatar', { length: 500 }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [index('customers_user_id_idx').on(table.userId)],
);

export const categories = pgTable(
    'categories',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        name: varchar('name', { length: 255 }).notNull(),
        slug: varchar('slug', { length: 255 }).notNull().unique(),
        parentId: uuid('parent_id'),
        image: varchar('image', { length: 500 }),
        isActive: boolean('is_active').notNull().default(true),
        sortOrder: integer('sort_order').notNull().default(0),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('categories_slug_idx').on(table.slug),
        index('categories_parent_id_idx').on(table.parentId),
    ],
);

export const products = pgTable(
    'products',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        vendorId: uuid('vendor_id')
            .notNull()
            .references(() => vendors.id, { onDelete: 'cascade' }),
        categoryId: uuid('category_id').references(() => categories.id, {
            onDelete: 'set null',
        }),
        name: varchar('name', { length: 255 }).notNull(),
        slug: varchar('slug', { length: 255 }).notNull().unique(),
        description: text('description'),
        price: decimal('price', { precision: 12, scale: 2 }).notNull(),
        salePrice: decimal('sale_price', { precision: 12, scale: 2 }),
        stock: integer('stock').notNull().default(0),
        status: productStatusEnum('status').notNull().default('DRAFT'),
        attributes: jsonb('attributes'),
        rating: decimal('rating', { precision: 3, scale: 2 }).default('0.00'),
        reviewCount: integer('review_count').notNull().default(0),
        weight: decimal('weight', { precision: 10, scale: 2 }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('products_slug_idx').on(table.slug),
        index('products_vendor_id_idx').on(table.vendorId),
        index('products_category_id_idx').on(table.categoryId),
        index('products_status_idx').on(table.status),
    ],
);

export const productImages = pgTable(
    'product_images',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        productId: uuid('product_id')
            .notNull()
            .references(() => products.id, { onDelete: 'cascade' }),
        url: varchar('url', { length: 500 }).notNull(),
        isPrimary: boolean('is_primary').notNull().default(false),
        sortOrder: integer('sort_order').notNull().default(0),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [index('product_images_product_id_idx').on(table.productId)],
);

export const orders = pgTable(
    'orders',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
        customerId: uuid('customer_id')
            .notNull()
            .references(() => customers.id, { onDelete: 'cascade' }),
        subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
        shippingCost: decimal('shipping_cost', { precision: 12, scale: 2 })
            .notNull()
            .default('0.00'),
        discount: decimal('discount', { precision: 12, scale: 2 })
            .notNull()
            .default('0.00'),
        total: decimal('total', { precision: 12, scale: 2 }).notNull(),
        status: orderStatusEnum('status').notNull().default('PENDING'),
        paymentStatus: paymentStatusEnum('payment_status')
            .notNull()
            .default('PENDING'),
        paymentMethod: varchar('payment_method', { length: 50 }),
        paymentId: varchar('payment_id', { length: 255 }),
        shippingAddress: jsonb('shipping_address').notNull(),
        notes: text('notes'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        uniqueIndex('orders_order_number_idx').on(table.orderNumber),
        index('orders_customer_id_idx').on(table.customerId),
        index('orders_status_idx').on(table.status),
    ],
);

export const orderItems = pgTable(
    'order_items',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        orderId: uuid('order_id')
            .notNull()
            .references(() => orders.id, { onDelete: 'cascade' }),
        productId: uuid('product_id')
            .notNull()
            .references(() => products.id, { onDelete: 'cascade' }),
        vendorId: uuid('vendor_id')
            .notNull()
            .references(() => vendors.id, { onDelete: 'cascade' }),
        productName: varchar('product_name', { length: 255 }).notNull(),
        productImage: varchar('product_image', { length: 500 }),
        price: decimal('price', { precision: 12, scale: 2 }).notNull(),
        quantity: integer('quantity').notNull(),
        subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
        status: orderItemStatusEnum('status').notNull().default('PENDING'),
        trackingNumber: varchar('tracking_number', { length: 100 }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        index('order_items_order_id_idx').on(table.orderId),
        index('order_items_vendor_id_idx').on(table.vendorId),
    ],
);

export const vendorPayouts = pgTable(
    'vendor_payouts',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        vendorId: uuid('vendor_id')
            .notNull()
            .references(() => vendors.id, { onDelete: 'cascade' }),
        amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
        commission: decimal('commission', { precision: 12, scale: 2 }).notNull(),
        netAmount: decimal('net_amount', { precision: 12, scale: 2 }).notNull(),
        status: payoutStatusEnum('status').notNull().default('PENDING'),
        bankInfo: jsonb('bank_info'),
        notes: text('notes'),
        processedAt: timestamp('processed_at'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        index('vendor_payouts_vendor_id_idx').on(table.vendorId),
        index('vendor_payouts_status_idx').on(table.status),
    ],
);

export const reviews = pgTable(
    'reviews',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        productId: uuid('product_id')
            .notNull()
            .references(() => products.id, { onDelete: 'cascade' }),
        customerId: uuid('customer_id')
            .notNull()
            .references(() => customers.id, { onDelete: 'cascade' }),
        orderItemId: uuid('order_item_id').references(() => orderItems.id, {
            onDelete: 'set null',
        }),
        rating: integer('rating').notNull(),
        comment: text('comment'),
        images: jsonb('images'),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        index('reviews_product_id_idx').on(table.productId),
        index('reviews_customer_id_idx').on(table.customerId),
    ],
);

export const addresses = pgTable(
    'addresses',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        customerId: uuid('customer_id')
            .notNull()
            .references(() => customers.id, { onDelete: 'cascade' }),
        label: varchar('label', { length: 50 }).notNull(),
        recipientName: varchar('recipient_name', { length: 255 }).notNull(),
        phone: varchar('phone', { length: 20 }).notNull(),
        addressLine: text('address_line').notNull(),
        city: varchar('city', { length: 100 }).notNull(),
        province: varchar('province', { length: 100 }).notNull(),
        postalCode: varchar('postal_code', { length: 10 }).notNull(),
        isDefault: boolean('is_default').notNull().default(false),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [index('addresses_customer_id_idx').on(table.customerId)],
);

export const carts = pgTable(
    'carts',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        customerId: uuid('customer_id')
            .notNull()
            .references(() => customers.id, { onDelete: 'cascade' }),
        productId: uuid('product_id')
            .notNull()
            .references(() => products.id, { onDelete: 'cascade' }),
        quantity: integer('quantity').notNull().default(1),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (table) => [
        index('carts_customer_id_idx').on(table.customerId),
        uniqueIndex('carts_customer_product_idx').on(
            table.customerId,
            table.productId,
        ),
    ],
);

export const wishlists = pgTable(
    'wishlists',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        customerId: uuid('customer_id')
            .notNull()
            .references(() => customers.id, { onDelete: 'cascade' }),
        productId: uuid('product_id')
            .notNull()
            .references(() => products.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (table) => [
        index('wishlists_customer_id_idx').on(table.customerId),
        uniqueIndex('wishlists_customer_product_idx').on(
            table.customerId,
            table.productId,
        ),
    ],
);

// ============ RELATIONS ============

export const usersRelations = relations(users, ({ one }) => ({
    vendor: one(vendors, {
        fields: [users.id],
        references: [vendors.userId],
    }),
    customer: one(customers, {
        fields: [users.id],
        references: [customers.userId],
    }),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
    user: one(users, {
        fields: [vendors.userId],
        references: [users.id],
    }),
    products: many(products),
    orderItems: many(orderItems),
    payouts: many(vendorPayouts),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
    user: one(users, {
        fields: [customers.userId],
        references: [users.id],
    }),
    orders: many(orders),
    reviews: many(reviews),
    addresses: many(addresses),
    carts: many(carts),
    wishlists: many(wishlists),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
    parent: one(categories, {
        fields: [categories.parentId],
        references: [categories.id],
    }),
    children: many(categories),
    products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
    vendor: one(vendors, {
        fields: [products.vendorId],
        references: [vendors.id],
    }),
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id],
    }),
    images: many(productImages),
    reviews: many(reviews),
    carts: many(carts),
    wishlists: many(wishlists),
    orderItems: many(orderItems),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
    product: one(products, {
        fields: [productImages.productId],
        references: [products.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
    customer: one(customers, {
        fields: [orders.customerId],
        references: [customers.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    product: one(products, {
        fields: [orderItems.productId],
        references: [products.id],
    }),
    vendor: one(vendors, {
        fields: [orderItems.vendorId],
        references: [vendors.id],
    }),
}));

export const vendorPayoutsRelations = relations(vendorPayouts, ({ one }) => ({
    vendor: one(vendors, {
        fields: [vendorPayouts.vendorId],
        references: [vendors.id],
    }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
    product: one(products, {
        fields: [reviews.productId],
        references: [products.id],
    }),
    customer: one(customers, {
        fields: [reviews.customerId],
        references: [customers.id],
    }),
    orderItem: one(orderItems, {
        fields: [reviews.orderItemId],
        references: [orderItems.id],
    }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
    customer: one(customers, {
        fields: [addresses.customerId],
        references: [customers.id],
    }),
}));

export const cartsRelations = relations(carts, ({ one }) => ({
    customer: one(customers, {
        fields: [carts.customerId],
        references: [customers.id],
    }),
    product: one(products, {
        fields: [carts.productId],
        references: [products.id],
    }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
    customer: one(customers, {
        fields: [wishlists.customerId],
        references: [customers.id],
    }),
    product: one(products, {
        fields: [wishlists.productId],
        references: [products.id],
    }),
}));

// ============ TYPES ============

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Vendor = typeof vendors.$inferSelect;
export type NewVendor = typeof vendors.$inferInsert;
export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type VendorPayout = typeof vendorPayouts.$inferSelect;
export type NewVendorPayout = typeof vendorPayouts.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type Wishlist = typeof wishlists.$inferSelect;
export type NewWishlist = typeof wishlists.$inferInsert;
