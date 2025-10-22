---
description: Webhooks for real-time PayOrder updates and event delivery.
---

# Webhooks

### Introduction

Webhooks allow you to receive real-time notifications about PayOrder events in your application. When a PayOrder changes status (e.g., payment received, completed, or refunded), CoinVoyage will send an HTTP POST request to your configured webhook endpoint with the event details.

**Setting Up Webhooks**

You can register and manage webhook endpoints in the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/developers) under the **Developers** section:

1. Navigate to **Developers** → **Webhooks**
2. Click **Add Webhook**
3. Enter your webhook endpoint URL (must be HTTPS in production)
4. Select the events you want to subscribe to
5. Save your webhook and securely store the **Webhook Secret**

{% hint style="info" %}
Your webhook endpoint must be publicly accessible and respond with a 2xx status code within 30 seconds to be considered successful.
{% endhint %}

---

### Webhook Events

CoinVoyage sends the following webhook events to track the PayOrder lifecycle:

<table><thead><tr><th width="280">Event Type</th><th>Description</th></tr></thead><tbody><tr><td><code>ORDER_CREATED</code></td><td>Triggered when a new PayOrder is created. This is the initial state when an order is first registered in the system.</td></tr><tr><td><code>ORDER_AWAITING_PAYMENT</code></td><td>Triggered when the PayOrder is ready and awaiting payment from the user. The deposit address is available at this stage.</td></tr><tr><td><code>ORDER_CONFIRMING</code></td><td>Triggered when payment has been received and is being confirmed on the blockchain. Includes the source transaction hash.</td></tr><tr><td><code>ORDER_EXECUTING</code></td><td>Triggered when the payment is confirmed and the order is being executed (processing the destination transfer or contract call).</td></tr><tr><td><code>ORDER_COMPLETED</code></td><td>Triggered when the PayOrder is successfully completed. The destination transaction hash is included in the payload.</td></tr><tr><td><code>ORDER_ERROR</code></td><td>Triggered when an error occurs during PayOrder processing. Includes error details and status information.</td></tr><tr><td><code>ORDER_REFUNDED</code></td><td>Triggered when funds are refunded to the user (e.g., if a destination call reverts). Includes the refund transaction hash and address.</td></tr></tbody></table>

---

### Event Payload Structure

Each webhook event contains the following structure:

```typescript
{
  "id": "event_123456",
  "type": "payorder_completed",
  "payorder_id": "po_abcdef123456",
  // Additional fields depending on event type
}
```

**Event-Specific Fields**

**`ORDER_CREATED`**

```typescript
{
  "type": "payorder_created",
  "payorder_id": "po_abcdef123456"
}
```

**`ORDER_AWAITING_PAYMENT`**

```typescript
{
  "type": "payorder_started",
  "payorder_id": "po_abcdef123456",
  "chain_id": 1,
  "chain": "Ethereum"
}
```

**`ORDER_CONFIRMING`**

```typescript
{
  "type": "payorder_confirming",
  "payorder_id": "po_abcdef123456",
  "chain_id": 1,
  "chain": "Ethereum",
  "source_transaction_hash": "0xabc123..."
}
```

**`ORDER_EXECUTING`**

```typescript
{
  "type": "payorder_executing",
  "payorder_id": "po_abcdef123456"
}
```

**`ORDER_COMPLETED`**

```typescript
{
  "type": "payorder_completed",
  "payorder_id": "po_abcdef123456",
  "chain_id": 101,
  "chain": "Solana",
  "destination_tx_hash": "0xdef456..."
}
```

**`ORDER_ERROR`**

```typescript
{
  "type": "payorder_error",
  "payorder_id": "po_abcdef123456",
  "message": "Error description",
  "status": "FAILED"
}
```

**`ORDER_REFUNDED`**

```typescript
{
  "type": "payorder_refunded",
  "payorder_id": "po_abcdef123456",
  "refund_tx_hash": "0xghi789...",
  "refund_address": "0x1234567890abcdef..."
}
```

---

### Handling webhook events

This example shows how to verify webhook signatures and handle incoming events.

NextJS Example

```typescript
"use server";

import { createHmac } from "crypto";

const webhookSecret = process.env.COIN_VOYAGE_WEBHOOK_SECRET!;

export const POST = async (req: Request) => {
  const rawBody = await req.text();
  const signature = req.headers.get("CoinVoyage-Webhook-Signature") as string;

  const hmac = createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("base64");

  if (signature !== hmac) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  console.log("Webhook Received");
  return new Response("Webhook Received", {
    status: 200,
  });
};
```

Make sure to:

- Replace 'your_webhook_secret' with your actual webhook secret
- Implement proper error handling
- Use HTTPS in production
- Store the webhook secret securely
