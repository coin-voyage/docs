---
title: Webhooks for real-time PayOrder event notifications
description: Configure webhook endpoints to receive real-time PayOrder lifecycle events from CoinVoyage, including signed payloads, retries, and event types.
---

# Webhooks

### Introduction

Webhooks let you receive real-time notifications about PayOrder lifecycle changes in your application. When a PayOrder changes status, CoinVoyage sends a `POST` request to your configured webhook endpoint with the event details.

**Setting Up Webhooks**

You can register and manage webhook endpoints in the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/developers) under the **Developers** section:

1. Navigate to **Developers** -> **Webhooks**
2. Click **Add Webhook**
3. Enter your webhook endpoint URL (must be HTTPS in production)
4. Select the events you want to subscribe to
5. Save your webhook and securely store the **Webhook Secret**

> [!NOTE]
Your webhook endpoint must be publicly accessible and respond with a 2xx status code within 30 seconds to be considered successful.

> [!NOTE]
When you configure a webhook, you subscribe using uppercase event identifiers such as `ORDER_CREATED` and `ORDER_COMPLETED`. The delivered JSON payload uses lowercase `payorder_*` values in the `type` field, such as `payorder_created` and `payorder_completed`.

***

### Webhook Events

Use the following subscription events when creating or updating a webhook:


| Subscription Event | Payload `type` | Key Fields | Description |
| --- | --- | --- | --- |
| `ORDER_CREATED` | `payorder_created` | `payorder_id`, `status`, `metadata?` | Triggered when a new PayOrder is created. |
| `ORDER_AWAITING_PAYMENT` | `payorder_started` | `payorder_id`, `status`, `metadata?`, `payment_data` | Triggered when the PayOrder is ready and awaiting payment from the user. |
| `ORDER_CONFIRMING` | `payorder_confirming` | `payorder_id`, `status`, `metadata?`, `payment_data` | Triggered when payment has been received and is being confirmed on-chain. |
| `ORDER_EXECUTING` | `payorder_executing` | `payorder_id`, `status`, `metadata?`, `payment_data` | Triggered when CoinVoyage starts executing the destination transfer or contract call. |
| `ORDER_COMPLETED` | `payorder_completed` | `payorder_id`, `status`, `metadata?`, `payment_data` | Triggered when the PayOrder completes successfully. |
| `ORDER_ERROR` | `payorder_error` | `payorder_id`, `status`, `metadata?`, `message` | Triggered when an error occurs during PayOrder processing. |
| `ORDER_REFUNDED` | `payorder_refunded` | `payorder_id`, `status`, `metadata?`, `refund_tx_hash`, `refund_address` | Triggered when funds are refunded to the user. |
| `ORDER_EXPIRED` | `payorder_expired` | `payorder_id`, `status` | Triggered when a PayOrder expires before payment is received. |


***

### Event Payload Structure

Each webhook delivery contains the following base structure:

```json
{
  "id": "event_123456",
  "type": "payorder_completed",
  "status": "COMPLETED",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... },
  "payment_data": { ... }
}
```

Additional top-level fields may be present depending on the event type.

**`PaymentData` structure** (included in `payorder_started`, `payorder_confirming`, `payorder_executing`, and `payorder_completed` events):

```json
{
  "src": { "total": { ... }, "base": { ... }, "fees": { ... }, "gas": { ... } },
  "dst": { "currency": { ... }, "currency_amount": { ... } },
  "deposit_address": "0x...",
  "receiving_address": "0x...",
  "refund_address": "0x...",
  "source_tx_hash": "0x...",
  "destination_tx_hash": "0x...",
  "refund_tx_hash": "0x...",
  "execution": [ { "provider": "...", "status": "...", ... } ],
  "expires_at": "2025-01-15T11:00:00Z"
}
```

**Event-Specific Fields**

**`payorder_created`**

```json
{
  "type": "payorder_created",
  "status": "PENDING",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... }
}
```

**`payorder_started`**

```json
{
  "type": "payorder_started",
  "status": "AWAITING_PAYMENT",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... },
  "payment_data": { ... }
}
```

**`payorder_confirming`**

```json
{
  "type": "payorder_confirming",
  "status": "AWAITING_CONFIRMATION",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... },
  "payment_data": { ... }
}
```

**`payorder_executing`**

```json
{
  "type": "payorder_executing",
  "status": "EXECUTING_ORDER",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... },
  "payment_data": { ... }
}
```

**`payorder_completed`**

```json
{
  "type": "payorder_completed",
  "status": "COMPLETED",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... },
  "payment_data": { ... }
}
```

**`payorder_error`**

```json
{
  "type": "payorder_error",
  "status": "FAILED",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... },
  "message": "Error description"
}
```

**`payorder_refunded`**

```json
{
  "type": "payorder_refunded",
  "status": "REFUNDED",
  "payorder_id": "po_abcdef123456",
  "metadata": { ... },
  "refund_tx_hash": "0xghi789...",
  "refund_address": "0x1234567890abcdef..."
}
```

**`payorder_expired`**

```json
{
  "type": "payorder_expired",
  "status": "EXPIRED",
  "payorder_id": "po_abcdef123456"
}
```

***

### Handling webhook events

This example shows how to verify webhook signatures and handle incoming events by reading the payload `type`.

Next.js example

```typescript
"use server";

import { createHmac } from "crypto";

const webhookSecret = process.env.COIN_VOYAGE_WEBHOOK_SECRET!;

export const POST = async (req: Request) => {
  const rawBody = await req.text();
  const signature = req.headers.get("CoinVoyage-Webhook-Signature");

  const hmac = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("base64");

  if (!signature || signature !== hmac) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const event = JSON.parse(rawBody) as {
    type: string;
    payorder_id: string;
    status: string;
  };

  switch (event.type) {
    case "payorder_completed":
      console.log("PayOrder completed", event.payorder_id);
      break;
    case "payorder_refunded":
      console.log("PayOrder refunded", event.payorder_id);
      break;
    case "payorder_expired":
      console.log("PayOrder expired", event.payorder_id);
      break;
    default:
      console.log("Unhandled webhook", event.type, event.payorder_id);
  }

  return new Response("Webhook Received", {
    status: 200,
  });
};
```

Make sure to:

* Verify the raw request body before parsing JSON
* Implement proper error handling
* Use HTTPS in production
* Store the webhook secret securely
