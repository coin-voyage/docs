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

### FAQs

#### **How do I test CoinVoyage payments before going live?**

You can test both **Deposit** and **Sale** flows using our [examples site](https://example.coinvoyage.io/)

Create an account on the [CoinVoyage Dashboard](../dashboard/index.md), copy your **API Key** and **Secret**, and add them into the examples site. Now your dashboard is hooked up to the example demo.



#### **Where do I find my API Key and Secret?**

In the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/):

* Navigate to **Developer** → **API Keys**
* Create a new key, then store both the **API Key** and **Secret** securely.



#### **What’s the difference between a Deposit and a Sale?**

* **Deposit**: send funds to a wallet address in your possession. For example, fund your sui wallet with native SUI while paying with USDC on mainnet.
* **Sale**: merchant or organization creates an order for the user to fulfill. The users funds are routed directly to the [**settlement wallet**](../dashboard/index.md#settlement-currencies). This mode can be securely executed on the client by via the usage of a **signature-based Authorization header**.



#### **How do I generate the Authorization signature?**

If you're using the [**CoinVoyage PayKit SDK**](../overview/sdk-reference.md#apiclient), there's a built-in method to generate the required signature:

```typescript
const signature = apiClient.generateAuthorizationSignature(process.env.COIN_VOYAGE_API_SECRET);
```

When directly implementing the API you can create it like so:

```typescript
generateAuthorizationSignature(apiKey: string, apiSecret: string): string {
  // Get the current timestamp as a string
  const timestamp = Math.floor(Date.now() / 1000).toString();

  // Create the data string
  const data = apiKey + apiSecret + timestamp;

  // Create a SHA-512 hash of the data
  const hash = createHash('sha512');
  hash.update(data);

  // Encode the hash as a hexadecimal string
  const signature = hash.digest('hex');

  // Format the final string
  return `APIKey=${apiKey},signature=${signature},timestamp=${timestamp}`;
}
```



#### **Where can I view transaction history?**

A transaction overview and specific transaction details can be found in the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/) and go to **Transactions**
