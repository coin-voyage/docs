# FAQs

### **How do I test CoinVoyage payments before going live?**

You can test both **Deposit** and **Sale** flows using our demo site:\
&#x20;[https://example.coinvoyage.io](https://example.coinvoyage.io)

Just create an account on the CoinVoyage Dashboard, get your **API Key** and **Secret**, and plug them into the demo to simulate real payment flows.



### **Where do I find my API Key and Secret?**

In the CoinVoyage Dashboard:

* Navigate to **Developer** → **API Keys**
* Create a new key, then store both the **API Key** and **Secret** securely.



### **What’s the difference between a Deposit and a Sale?**

* **Deposit**: Direct crypto payment to your wallet. No authentication required.
* **Sale**: Crypto collected by CoinVoyage and settled to your chosen wallet. Requires signature authentication using your API Key & Secret.



### **Why do I get a 500 error on a Sale?**

A `500 Internal Server Error` usually indicates:

* Missing or invalid **Authorization** header for Sale requests.
* Invalid **payload** (e.g., missing settlement account).
* Internal issues that can be clarified by checking the response body or API logs.

Refer to [Broken link](broken-reference "mention") for required parameters.



### **How do I generate the Authorization signature?**

For `mode=SALE`, you must add the `Authorization` header:

1. Concatenate: `APIKey + APISecret + Timestamp`
2. Hash with **SHA‑512**
3. Send header as:

```sql
Authorization: APIKey=...,signature=...,timestamp=...
```

See SDK examples in our docs for Node.js & Python.



### **My Solana transactions aren’t broadcasting,why?**

Public Solana RPC endpoints (like `rpc.ankr.com`) often **do not allow broadcasting** transactions.\
Use a **private RPC** (for example via QuickNode) to ensure your transactions reach the network and finalize successfully.



### **Where can I view transaction history?**

Log in to your Dashboard and go to **Transactions**
