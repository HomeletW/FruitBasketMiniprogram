# Database Schema

## Collections

### `orders`

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | string | Auto-generated document id. |
| `openid` | string | WeChat user openid. |
| `basketName` | string | Display name of the basket. |
| `message` | string | Gift note. |
| `deliveryDate` | string | ISO date string. |
| `contactName` | string | Recipient name. |
| `contactPhone` | string | Recipient phone. |
| `address` | string | Delivery address. |
| `amount` | number | Amount in cents. |
| `status` | string | Order status (see lifecycle). |
| `statusHistory` | array | Ordered status transitions. |
| `auditLogs` | array | Audit events for user/admin actions. |
| `payment` | object | CloudPay response payload. |
| `paymentError` | string | Payment error message, if any. |
| `createdAt` | string | ISO timestamp. |
| `updatedAt` | string | ISO timestamp. |

**Indexes**
- Compound index on `openid` + `createdAt` for `getMyOrders`.
- Single-field index on `createdAt` for admin listing.

**Access rules**
- Users: read/update own orders only (by `openid`).
- Admins: read/update all orders.

### `admins`

| Field | Type | Notes |
| --- | --- | --- |
| `username` | string | Admin username. |
| `passwordHash` | string | SHA-256 hash. |
| `salt` | string | Password salt. |
| `token` | string | Active admin token. |
| `tokenExpiresAt` | string | ISO timestamp. |
| `auditLogs` | array | Login history. |
| `lastLoginAt` | string | ISO timestamp. |

**Indexes**
- Unique index on `username`.
- Index on `token`.

**Access rules**
- Admins only; deny direct client access (use cloud functions).

### `content`

| Field | Type | Notes |
| --- | --- | --- |
| `_id` | string | Content key (e.g., `landing`, `subscribe_templates`). |
| `sections` | array | Landing highlights. |
| `updatedAt` | string | ISO timestamp. |
| `updatedBy` | string | Admin username. |
| `auditLogs` | array | Content update history. |

**Indexes**
- Index on `_id` for fast lookups.

**Access rules**
- Read: public.
- Write: admin only.

### `notify_logs` (optional)

| Field | Type | Notes |
| --- | --- | --- |
| `type` | string | Notification type (order_created, order_status). |
| `status` | string | SENT / FAILED / SKIPPED. |
| `templateId` | string | Template id. |
| `openid` | string | Recipient openid. |
| `error` | string | Error message, if any. |
| `createdAt` | string | ISO timestamp. |

**Indexes**
- Index on `createdAt` for audits.

**Access rules**
- Admin only.

## Order Lifecycle FSM

```
CREATED -> PAID -> FULFILLING -> COMPLETED
CREATED -> CANCELED
PAID -> CANCELED
COMPLETED -> REFUNDED
```

- User cancellations allowed in `CREATED` and `PAID`.
- Admin can move through the lifecycle using `adminUpdateOrderStatus`.

## Audit Logging

- `orders.auditLogs` capture user/admin actions.
- `orders.statusHistory` tracks each transition with timestamp and actor.
- `content.auditLogs` records admin content updates.
