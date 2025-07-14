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
* **Sale**: Cryptocurrency is routed through CoinVoyage and sent directly to your **settlement wallet**. This mode requires a **signature-based Authorization header** using your API Key & Secret for added security.



### **How do I generate the Authorization signature?**

If you're using the **CoinVoyage PayKit package**, there's a built-in method to generate the required signature:

```typescript
const signature = apiClient.generateAuthorizationSignature(process.env.COIN_VOYAGE_API_SECRET);

```

Example: [GitHub – Pay Order Action](https://github.com/coin-voyage/examples/blob/main/nextjs-app/src/actions/pay-order.ts)



### **Where can I view transaction history?**

Log in to your Dashboard and go to **Transactions**
