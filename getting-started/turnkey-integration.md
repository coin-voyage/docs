---
description: >-
  To get started using Coin Voyage, import @coin-voyage/paykit into your
  project.
---

# Turnkey Integration

### Step 1: Create CoinVoyage Account

* Sign up at [CoinVoyage Dashboard](https://dashboard.coinvoyage.io)
* Create an Organization in your dashboard

<figure><img src="../.gitbook/assets/coinvoyage (1).png" alt=""><figcaption></figcaption></figure>

### Step 2: Get API Key

* Navigate to the Developer section in your dashboard
* Find your API key generated tied to the organization
* Copy your COIN\_VOYAGE\_API\_KEY

<figure><img src="../.gitbook/assets/coinvoyage (4).png" alt=""><figcaption></figcaption></figure>

### Step 3: Install Required Packages

{% tabs %}
{% tab title="npm" %}
```sh
npm i @coin-voyage/paykit @tanstack/react-query@^5.80.2
```
{% endtab %}

{% tab title="pnpm" %}
```sh
pnpm add @coin-voyage/paykit @tanstack/react-query@^5.80.2
```
{% endtab %}

{% tab title="yarn" %}
```sh
yarn add @coin-voyage/paykit @tanstack/react-query@^5.80.2
```
{% endtab %}

{% tab title="bun" %}
```sh
bun add @coin-voyage/paykit @tanstack/react-query@^5.80.2
```
{% endtab %}
{% endtabs %}

### &#x20;

### Step 4: Set Up Environment Variables

Create .env.local file in your project root:

```
// NEXT_PUBLIC_COIN_VOYAGE_API_KEY=your_api_key_here
```



### Step 5: Basic Implementation Options

```typescript
// typescript
"use client";
import { PayButton, PayKitProvider, WalletProvider } from "@coin-voyage/paykit";
import { ChainId } from "@coin-voyage/paykit/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function SimplePayButton() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PayKitProvider apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY}>
          <PayButton
            intent="Pay with Crypto"
            toChain={ChainId.ETH}
            toAddress="0xYourWalletAddress"
            toAmount={0.01}
            onPaymentCompleted={(event) => {
              console.log("Payment successful!");
            }}
          />
        </PayKitProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

```



### Step 6: Supported Blockchain Networks

Available ChainId options:

* ChainId.ETH - Ethereum
* ChainId.SUI - SUI Network
* ChainId.SOL - Solana
* ChainId.BTC - Bitcoin
* And more...



### Step 7: Event Handlers

Key events you can handle:

```typescript
// typescript
<PayButton
  // ... other props
  onPaymentStarted={(event) => {
    // Show loading state
  }}
  onPaymentCompleted={(event) => {
    // Handle successful payment
  }}
  onPaymentBounced={(event) => {
    // Handle failed payment
  }}
  onPaymentCreationError={(event) => {
    // Handle errors
  }}
/>

```



### Step 8: Framework Compatibility

* ✅ Next.js (App Router & Pages Router)
* ✅ React
* ✅ Remix
* ✅ Vite
* ✅ Any React-based framework



### Step 9: Styling Options

```typescript
// typescript
<PayButton
  mode="dark" // or "light"
  style={{
    width: "100%",
    borderRadius: "8px",
    backgroundColor: "#custom-color"
  }}
/>

```



### &#x20;Step 10: Production Deployment

* Ensure your .env.local variables are set in your hosting platform
* For Vercel: Add environment variables in project settings
* For other platforms: Configure environment variables accordingly

This integration allows any website to accept crypto payments with just a few lines of code
