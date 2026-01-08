# Admin Usage Guide

## Login

1. Navigate to `/pages/admin-login/index` (hidden entry).
2. Enter the admin username/password.
3. The admin token is stored in local storage for API calls.

## Order Management

- Use the **Orders** section in the dashboard to update order status.
- Valid transitions follow the FSM documented in `docs/SCHEMA.md`.

## View Order Detail

- The admin dashboard lists orders; detailed inspection can be done via `adminGetOrderDetail` in CloudBase console.

## Security Notes

- Store admin credentials only in the `admins` collection.
- Rotate admin tokens by re-login.
