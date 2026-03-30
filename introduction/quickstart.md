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
  tags:
    visible: true
---

# Quickstart

This guide gets you from installation to a working CoinVoyage payment button in a few minutes.

## 1. Install the SDK

Install `@coin-voyage/paykit` and its React Query peer dependency.

{% tabs %}
{% tab title="npm" %}
```sh
npm i @coin-voyage/paykit @tanstack/react-query@^5.90.6
```
{% endtab %}

{% tab title="pnpm" %}
```sh
pnpm add @coin-voyage/paykit @tanstack/react-query@^5.90.6
```
{% endtab %}

{% tab title="yarn" %}
```sh
yarn add @coin-voyage/paykit @tanstack/react-query@^5.90.6
```
{% endtab %}

{% tab title="bun" %}
```sh
bun add @coin-voyage/paykit @tanstack/react-query@^5.90.6
```
{% endtab %}
{% endtabs %}

## 2. Create an API Key

Open the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/) and create an organization if you do not already have one.

Then go to **Developers** and create an API key for that organization. For client-side SDK usage, expose the public key as `NEXT_PUBLIC_COIN_VOYAGE_API_KEY`.

{% hint style="info" %}
Keep your API secret on the server. Only the public API key belongs in client-side code.
{% endhint %}

<figure><img src="../.gitbook/assets/developers-api-keys (1).png" alt="CoinVoyage dashboard - Developers"><figcaption></figcaption></figure>

## 3. Add the Providers

Wrap your app with `QueryClientProvider`, `WalletProvider`, and `PayKitProvider`.

```tsx
"use client";

import { PayKitProvider, WalletProvider } from "@coin-voyage/paykit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY) {
    throw new Error("NEXT_PUBLIC_COIN_VOYAGE_API_KEY is required");
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PayKitProvider apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY}>
          {children}
        </PayKitProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
```

## 4. Render a Payment Button

Use `PayButton` to launch the CoinVoyage payment flow.

```tsx
"use client";

import { PayButton } from "@coin-voyage/paykit";
import { ChainId } from "@coin-voyage/paykit/server";

export function DepositButton() {
  return (
    <PayButton
      intent="Deposit to SUI"
      toChain={ChainId.SUI}
      toAddress="0xYourSUIWalletAddress"
      toAmount={10}
      toToken={undefined}
      style={{
        width: "100%",
        borderRadius: "0.375rem",
      }}
      onPaymentStarted={() => {
        console.log("Payment started");
      }}
      onPaymentCompleted={() => {
        console.log("Payment completed");
      }}
    />
  );
}
```

## Next Steps

* See the [SDK Reference](../overview/sdk-reference.md) for all provider, button, and API client options.
* Use the [example site](https://example.coinvoyage.io/) to test live flows against your organization.
* Browse the [example repository](https://github.com/coin-voyage/examples) for integration patterns.
