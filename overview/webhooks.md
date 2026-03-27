---
description: Webhooks for real-time PayOrder updates and event delivery.
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

{% hint style="info" %}
Your webhook endpoint must be publicly accessible and respond with a 2xx status code within 30 seconds to be considered successful.
{% endhint %}

{% hint style="info" %}
When you configure a webhook, you subscribe using uppercase event identifiers such as `ORDER_CREATED` and `ORDER_COMPLETED`. The delivered JSON payload uses lowercase `payorder_*` values in the `type` field, such as `payorder_created` and `payorder_completed`.
{% endhint %}

***

### Webhook Events

Use the following subscription events when creating or updating a webhook:

<table><thead><tr><th width="240">Subscription Event</th><th width="220">Payload <code>type</code></th><th width="320">Key Fields</th><th>Description</th></tr></thead><tbody><tr><td><code>ORDER_CREATED</code></td><td><code>payorder_created</code></td><td><code>payorder_id</code>, <code>status</code>, <code>metadata?</code></td><td>Triggered when a new PayOrder is created.</td></tr><tr><td><code>ORDER_AWAITING_PAYMENT</code></td><td><code>payorder_started</code></td><td><code>payorder_id</code>, <code>status</code>, <code>metadata?</code>, <code>payment_data</code></td><td>Triggered when the PayOrder is ready and awaiting payment from the user.</td></tr><tr><td><code>ORDER_CONFIRMING</code></td><td><code>payorder_confirming</code></td><td><code>payorder_id</code>, <code>status</code>, <code>metadata?</code>, <code>payment_data</code></td><td>Triggered when payment has been received and is being confirmed on-chain.</td></tr><tr><td><code>ORDER_EXECUTING</code></td><td><code>payorder_executing</code></td><td><code>payorder_id</code>, <code>status</code>, <code>metadata?</code>, <code>payment_data</code></td><td>Triggered when CoinVoyage starts executing the destination transfer or contract call.</td></tr><tr><td><code>ORDER_COMPLETED</code></td><td><code>payorder_completed</code></td><td><code>payorder_id</code>, <code>status</code>, <code>metadata?</code>, <code>payment_data</code></td><td>Triggered when the PayOrder completes successfully.</td></tr><tr><td><code>ORDER_ERROR</code></td><td><code>payorder_error</code></td><td><code>payorder_id</code>, <code>status</code>, <code>metadata?</code>, <code>message</code></td><td>Triggered when an error occurs during PayOrder processing.</td></tr><tr><td><code>ORDER_REFUNDED</code></td><td><code>payorder_refunded</code></td><td><code>payorder_id</code>, <code>status</code>, <code>metadata?</code>, <code>refund_tx_hash</code>, <code>refund_address</code></td><td>Triggered when funds are refunded to the user.</td></tr><tr><td><code>ORDER_EXPIRED</code></td><td><code>payorder_expired</code></td><td><code>payorder_id</code>, <code>status</code></td><td>Triggered when a PayOrder expires before payment is received.</td></tr></tbody></table>

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
