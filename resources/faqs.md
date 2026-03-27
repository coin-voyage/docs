---
layout:
  width: default
  title:
    visible: false
  description:
    visible: false
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: true
---

# FAQs

Common questions about testing, authentication, and the CoinVoyage payment flow.

## How do I test CoinVoyage payments before going live?

You can test both **Deposit** and **Sale** flows using our [example site](https://example.coinvoyage.io/).

Create an account in the [CoinVoyage Dashboard](../dashboard/index.md), copy your **API Key** and **API Secret**, and add them to the example site. That connects the demo flow to your organization.

## Where do I find my API Key and Secret?

In the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/):

* Navigate to **Developer** -> **API Keys**
* Create a new key, then store both the **API Key** and **Secret** securely.

## What's the difference between a Deposit and a Sale?

* **Deposit**: Send funds to a wallet address you control. For example, fund your Sui wallet with native SUI while paying with USDC on mainnet.
* **Sale**: A merchant or organization creates an order for the user to fulfill. The user's funds are routed to the configured [**settlement wallet**](../dashboard/index.md#settlement-currencies). This mode requires a server-side **Authorization** signature generated from your API secret.

## How do I generate the Authorization signature?

If you're using the [**CoinVoyage PayKit SDK**](../overview/sdk-reference.md#apiclient), use the built-in method:

```typescript
const signature = apiClient.generateAuthorizationSignature(
  process.env.COIN_VOYAGE_API_SECRET!,
  "POST",
  "/pay-orders"
);
```

The signature is an HMAC-SHA256 hash computed over `method + path + timestamp`. The `method` and `path` must match the request exactly.

When directly implementing the API, you can create it like this:

```typescript
import { createHmac } from "crypto";

function generateAuthorizationSignature(
  apiKey: string,
  apiSecret: string,
  method: string,
  path: string
): string {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const data = `${method}${path}${timestamp}`;
  const signature = createHmac("sha256", apiSecret).update(data).digest("hex");

  return `APIKey=${apiKey},signature=${signature},timestamp=${timestamp}`;
}
```

Run this only on the server. Never expose your API secret in client-side code.

## Where can I view transaction history?

A transaction overview and detailed transaction pages are available in the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/) under **Transactions**.
