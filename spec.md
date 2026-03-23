# snakeymon-io

## Current State
- E-commerce app with card shop, cart, Stripe checkout, and admin panel
- OrderHistory type has: id, buyer, cardIds, totalPrice, createdAt
- No shipping address, no order status, no admin order management
- Admin panel has card inventory management only
- Success page shows generic confirmation

## Requested Changes (Diff)

### Add
- `ShippingAddress` type: name, email, street, city, state, zip, country
- `status` field on OrderHistory: `#pending | #printing | #shipped | #delivered`
- `shippingAddress` field on OrderHistory
- `trackingNumber` optional field on OrderHistory
- Backend: `placeOrderWithShipping(shippingAddress)` replacing or extending placeOrder
- Backend: `getAllOrders()` admin-only, returns all orders sorted by createdAt desc
- Backend: `updateOrderStatus(orderId, status, ?trackingNumber)` admin-only
- Frontend: Shipping address form shown at checkout (before payment or on success page)
- Frontend: `/orders` route - user's order history with status badges and tracking numbers
- Frontend: Admin panel "Orders" tab - list all orders, update status, mark as shipped with tracking number, print view button
- Frontend: Order tracking page at `/track/:orderId` - public lookup by order ID

### Modify
- AdminPanel: add "Orders" tab alongside inventory
- SuccessPage: show order ID and link to track order
- CartDrawer/checkout flow: collect shipping address before/during checkout

### Remove
- Nothing removed

## Implementation Plan
1. Update `OrderHistory` type in Motoko to include shippingAddress, status, trackingNumber
2. Add `ShippingAddress` type
3. Add `getAllOrders` (admin), `updateOrderStatus` (admin) functions
4. Update `placeOrder` to accept shipping address
5. Frontend: Add shipping address form in cart/checkout flow
6. Frontend: `/orders` page showing user's order history
7. Frontend: Admin Orders tab with full order list, status controls, print button
8. Frontend: Update SuccessPage with order ID and tracking link
9. Add routes for /orders
