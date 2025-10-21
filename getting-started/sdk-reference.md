---
description: Production-ready SDK for CoinVoyage integration.
---

# CoinVoyage PayKit SDK reference

The [`@coin-voyage/paykit`](https://www.npmjs.com/package/@coin-voyage/paykit) SDK offers client-side and server-side functionality that abstracts the integration of the API, while also exporting UI components. This SDK reduce the amount of boilerplate code you need and lets you easily integrate payment and deposit flow into your web application.

***

#### Install CoinVoyage PayKit

Use your preferred package manager to install CoinVoyage PayKit.&#x20;

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

#### PayKitProvider

The `PayKitProvider` is required if you want to utilize the [PayButton](sdk-reference.md#paybutton) and [usePayStatus](sdk-reference.md#usepaystatus). It wraps the client application and tracks the state of the PayOrder flow.&#x20;

```tsx
"use client"

import { PayKitProvider, WalletProvider } from "@coin-voyage/paykit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PayKitProvider
          apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY!}
          debugMode={true}
          mode="light"
          onConnect={({ address, chainId, connectorId, type }) => {
            console.log(`Connected to ${chainId} with ${connectorId} (${type}) at ${address}`)
          }}
          environment="production"
        >
          {children}
        </PayKitProvider>
      </WalletProvider>
    </QueryClientProvider>
  )
}
```



**PayKitProvider Configuration Options**

The `PayKitProvider`  accepts the following configuration parameters:

<table><thead><tr><th width="218.4000244140625">Option</th><th width="146.5999755859375">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>apiKey</code></td><td>Yes</td><td>API Key of the organization, acquired in the developers tab of the <a href="https://dashboard.coinvoyage.io/developers">dashboard</a>.</td></tr><tr><td><code>customTheme</code></td><td>No</td><td>Gives you the flexibility to modify the PayKit modal styling. See also <a href="sdk-reference.md#themes-and-customization">Themes &#x26; customisation</a></td></tr><tr><td><code>environment</code></td><td>No</td><td><p>Environment to connect to:</p><ul><li>production (default)</li><li>development</li></ul><p>The development environment exposes additional testnet chains. </p></td></tr><tr><td><code>debugMode</code></td><td>No</td><td>Will log debug logs into the console, helpful when integrating. </td></tr><tr><td><code>mode</code></td><td>No</td><td>"light", "dark"  or "auto" </td></tr><tr><td><code>onConnect</code></td><td>No</td><td>Callback triggered upon connection of a new wallet.</td></tr><tr><td><code>onConnectValidation</code></td><td>No</td><td>Allows you to pass a custom function that is run upon connecting of a wallet.</td></tr><tr><td><code>onDisconnect</code></td><td>No</td><td>Callback triggered upon disconnect of a wallet.</td></tr><tr><td><code>options</code></td><td>No</td><td><p>Multiple options to modify PayKit modal, including:</p><ul><li>add a disclaimer</li><li>control display language</li><li>hide tooltips</li></ul><p>and more</p></td></tr><tr><td><code>theme</code></td><td>No</td><td><p>Select a predefined styling for the PayKit modal, options include:</p><p></p><ul><li>auto</li><li>web95</li><li>retro</li><li>soft</li><li>midnight</li><li>minimal</li><li>rounded</li><li>nouns</li></ul></td></tr></tbody></table>

#### WalletProvider

The `WalletProvider` wraps the `PayKitProvider` , and is required if you want to utilize the [PayButton](sdk-reference.md#paybutton) and [usePayStatus](sdk-reference.md#usepaystatus). It facilitates the configuration of specific chain types, such as setting a specific `rpcUrl`  or adding additional wallet connectors.&#x20;

```tsx
"use client"

import { PayKitProvider, WalletProvider } from "@coin-voyage/paykit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider config={{
          evm: {
            coinbase: {
              appName: "My App"
            },
            walletConnect: {
              projectId: "your-project-id",
            }
          },
          solana: {
            rpcUrl: "my-solana-rpc-url",
            walletConfiguration: {
              wallets: [customWalletAdapter()],
            }
          },
          utxo: {
            lazy: true
          },
        }}
      >
        <PayKitProvider {...}>
          {children}
        </PayKitProvider>
      </WalletProvider>
    </QueryClientProvider>
  )
}
```

**WalletProvider Configuration Options**

The `WalletProvider` accepts the following configuration parameters:

<table><thead><tr><th width="218.4000244140625">Option</th><th width="146.5999755859375">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>config</code></td><td>No</td><td>Object that contains chain type specific configurations.</td></tr><tr><td><code>config.evm</code></td><td>No</td><td><p>Configuration for EVM chain types. Allows configuration of wallets, connectors, and other evm specific properties.</p><p></p><p>Also includes options to configure <code>WalletConnect</code>, <code>Coinbase Wallet</code> and <code>MetaMask</code></p></td></tr><tr><td><code>config.solana</code></td><td>No</td><td>Configuration of the Solana chain. Set a custom <code>rpcUrl</code> and configure wallet adapters. </td></tr><tr><td><code>config.sui</code></td><td>No</td><td>Configuration of the Sui chain. Set a custom <code>rpcUrl</code> and configure wallet adapters. </td></tr><tr><td><code>config.utxo</code></td><td>No</td><td>Configuration of UTXO chain types. Allows configuration of wallet connectors and few additional options.</td></tr></tbody></table>

#### PayButton

todo





#### ApiClient

the API client is the easiest way to interact with the CoinVoyage backend. It allows you to safely create payOrders on the server.

```tsx
import { ApiClient } from "@coin-voyage/paykit/server";

export const apiClient = (apiKey: string) => ApiClient({
   apiKey,
   environment: "development",
});
```

`apiKey` <mark style="color:red;">\*</mark> <mark style="color:$info;">string</mark>

API Key of the organization, acquired in the developers tab of the [dashboard](https://dashboard.coinvoyage.io/developers).

***

`environment`  <mark style="color:$info;">production | development</mark>

Environment to connect to, defaults to `production`



**ApiClient functions**

API client exposes the following functions in order to interact with the backend:



**`getPayOrder`**&#x20;

todo



**`generateAuthorizationSignature`**

Generates an authorization signature, required by several API routes. API secret can be obtained in the developer tab on the [dashboard](https://dashboard.coinvoyage.io/developers).&#x20;

```tsx
const apiSecret = "..." // 

const signature = apiClient.generateAuthorizationSignature(apiSecret)
```



**`createDepositPayOrder`**&#x20;

You may either perform this operation on the **client** or **server**. Executing this operation on the **server** ensures that users cannot perform malicious actions.

Creating a deposit pay order on the server is **not required**. The same result can be achieved by passing the required properties directly to the `PayKitProvider` on the **client side**. This provides flexibility where changes to the pay order are made upon property changes. &#x20;

```tsx
import { ApiClient, ChainId } from "@coin-voyage/paykit/server";

const payOrder = await apiClient.createDepositPayOrder({
    destination_currency: {
        address: null,
        chain_id: ChainId.SUI
    },
    receiving_address: '0xYourReceivingAddressHere',
    destination_amount: "10"
})
```

**`createSalePayOrder`**

**`createRefundPayOrder`**

**`payOrderQuote`**&#x20;

**`payOrderPaymentDetails`**



#### usePayStatus

todo



#### Themes & Customization

todo
