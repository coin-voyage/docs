---
description: Webhooks for real-time PayOrder updates and event delivery.
---

# Webhooks



#### Handling webhook events

This example shows how to verify webhook signatures and handle incoming events.

NextJS Example

```typescript
"use server";

import { createHmac } from "crypto";

const webhookSecret = process.env.COIN_VOYAGE_WEBHOOK_SECRET!;

export const POST = async (req: Request) => {
    const rawBody = await req.text();
    const signature = req.headers.get("CoinVoyage-Webhook-Signature") as string;

    const hmac = createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('base64');

    if (signature !== hmac) {
        return new Response("Unauthorized", {
            status: 401
        });
    }

    console.log("Webhook Received");
    return new Response("Webhook Received", {
        status: 200
    });
}
```

Make sure to:

* Replace 'your\_webhook\_secret' with your actual webhook secret
* Implement proper error handling
* Use HTTPS in production
* Store the webhook secret securely
