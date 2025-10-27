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

# Quickstart

### Quickstart

This guide will get you set up and ready to use CoinVoyage within minutes.

#### Install Package

To get started using **CoinVoyage**, import `@coin-voyage/paykit` into your project.

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

Head over to [CoinVoyage Dashboard ](https://dashboard.coinvoyage.io/) and create an organization. Under the `Developer` section you’ll find a API key generated tied to the organization. Once you have an `COIN_VOYAGE_API_KEY` the next section shows you a basic implementation.

{% hint style="info" %}
Users need to create an API key if they haven’t already. You can do so by visiting the [CoinVoyage Dashboard](https://dashboard.coinvoyage.io/developers).
{% endhint %}

<figure><img src="../.gitbook/assets/coinvoyage (4).png" alt=""><figcaption></figcaption></figure>

#### Usage <a href="#usage" id="usage"></a>

Now that you have your app configured, you can use the `PayButton` component to allow users to complete a payment or make a deposit to any of their wallets.

Here is an example of basic usage:

#### Example: add `DepositButton` component

```tsx
"use client"
 
import { PayButton, PayKitProvider, WalletProvider } from "@coin-voyage/paykit"
import { ChainId } from "@coin-voyage/paykit/server"
import type { WalletConfiguration } from "@coin-voyage/paykit/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
 
const queryClient = new QueryClient()
 
export function DepositButton() {
  if (!process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY) {
    throw new Error("NEXT_PUBLIC_COIN_VOYAGE_API_KEY is required")
  }
 
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PayKitProvider apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY}>
          <PayButton
            intent="Deposit to SUI"
            toChain={ChainId.SUI} // Deposit to SUI
            toAddress="0xYourSUIWalletAddress" // SUI deposit address
            toAmount={10} // Deposit 10 SUI
            toToken={undefined} // undefined for NATIVE currency
 
            style={{
              width: "100%",
              borderRadius: "0.375rem",
            }}
 
            onPaymentStarted={(event) => {
              console.log("Payment is being processed")
            }}
            onPaymentCompleted={(event) => {
              console.log("Payment Completed")
            }}
        />
        </PayKitProvider>
      </WalletProvider>
    </QueryClientProvider>
  )
}

```

For more examples, check out the [CoinVoyage Demo](https://example.coinvoyage.io/) or find code examples on our [github](https://github.com/coin-voyage/examples)
