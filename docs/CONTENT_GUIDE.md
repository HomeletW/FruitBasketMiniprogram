# Content Update Guide

## Landing Highlights

Update the `content/landing` document using the admin dashboard or CloudBase console.

Example payload:

```json
{
  "sections": ["Seasonal fruits", "Hand-crafted baskets", "Same-day delivery"]
}
```

## Subscribe Message Templates

Add template IDs to `content/subscribe_templates`:

```json
{
  "orderCreated": "TEMPLATE_ID_1",
  "orderStatus": "TEMPLATE_ID_2"
}
```

These template IDs are used by `createOrderAndPay` and `adminUpdateOrderStatus` to send notifications.
