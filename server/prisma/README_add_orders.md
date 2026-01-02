# Orders Feature Implementation

This document describes the Orders feature for the TechPack application.

## Database Schema Changes

Added two new tables to the Prisma schema:

### Order Model

- `id`: Unique identifier (UUID)
- `userId`: Reference to User who placed the order
- `orderNumber`: Unique order reference number
- Customer Information (firstName, lastName, email, phone)
- Shipping Address (address, city, state, zipCode, country)
- Order Totals (subtotal, tax, total)
- `status`: Order status (pending, confirmed, shipped, delivered)
- `createdAt`, `updatedAt`: Timestamps
- Relation to OrderItems

### OrderItem Model

- `id`: Unique identifier (UUID)
- `orderId`: Reference to Order
- `productId`: Reference to Product
- Product Information (name, slug, price)
- `quantity`: Number of items ordered
- `downloadLink`: URL to the downloadable zip file for this product

## Running the Migration

To apply the database migration:

```bash
cd server
npx prisma migrate deploy
```

Or to develop with the migration:

```bash
npx prisma migrate dev --name add_orders
```

## API Endpoints

### Create Order (POST)

```
POST /api/orders
Headers: Authorization: Bearer <token>
Body: {
  items: [],
  customerInfo: { firstName, lastName, email, phone },
  shippingAddress: { address, city, state, zipCode, country },
  subtotal: number,
  tax: number,
  total: number
}
```

### Get User Orders (GET)

```
GET /api/orders
Headers: Authorization: Bearer <token>
```

### Get Order Details (GET)

```
GET /api/orders/:orderId
Headers: Authorization: Bearer <token>
```

## Frontend Features

### My Orders Page (`/my-orders`)

- Displays all user orders in table format
- Shows order number, date, total, and status
- Expandable order details with shipping information and order items
- Download zip file button for each product in the order

### Checkout Flow

After successful order placement:

1. Order is created in the database
2. User's cart is cleared
3. User is redirected to My Orders page
4. Toast notification confirms order placement

## Important Notes

1. The `downloadLink` field in OrderItem should be populated when the order is created with the product's download link from the Product model
2. Download links should point to S3 or your file hosting service
3. The status field can be updated by admin users (future feature)

## Testing the Feature

1. Login to the application
2. Add products to cart
3. Go to checkout page
4. Fill in shipping details
5. Place order
6. You will be redirected to My Orders page
7. Click "View Details" to see order information
8. Click "📥 Download Zip" to download the product file
