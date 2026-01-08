# Deployment Guide

## Prerequisites

- WeChat DevTools installed.
- A CloudBase environment created for the mini program.
- Cloud payment configuration (sub-mch-id) ready.

## Steps

1. Open the project directory in WeChat DevTools.
2. Set the CloudBase environment in the IDE.
3. Deploy cloud functions:
   - Right-click each function under `cloudfunctions/` and select **Deploy and Install Dependencies**.
4. Create collections and indexes in the CloudBase database as defined in `docs/SCHEMA.md`.
5. Insert initial documents:
   - `content/landing` with `sections` array.
   - `content/subscribe_templates` with template IDs.
6. Configure CloudPay with `SUB_MCH_ID` and ensure `cloud.openapi.cloudPay.unifiedOrder` is enabled.

## Environment Variables

- `SUB_MCH_ID`: sub merchant id for payment.

## Smoke Test

- Open the mini program.
- Submit an order and verify the order appears in `orders`.
- Log in as admin and update the status to `FULFILLING`.
