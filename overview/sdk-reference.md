---
description: Production-ready SDK for CoinVoyage integration.
---

# SDK reference

The [`@coin-voyage/paykit`](https://www.npmjs.com/package/@coin-voyage/paykit) SDK offers client-side and server-side functionality that abstracts the integration of the API, while also exporting UI components. This SDK reduce the amount of boilerplate code you need and lets you easily integrate payment and deposit flow into your web application.

***

#### Install CoinVoyage PayKit

Use your preferred package manager to install CoinVoyage PayKit.

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





#### PayKitProvider

The `PayKitProvider` is required if you want to utilize the [PayButton](sdk-reference.md#paybutton) and [usePayStatus](sdk-reference.md#usepaystatus). It wraps the client application and tracks the state of the PayOrder flow.

```tsx
"use client";

import { PayKitProvider, WalletProvider } from "@coin-voyage/paykit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PayKitProvider
          apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY!}
          debugMode={true}
          mode="light"
          onConnect={({ address, chainId, connectorId, type }) => {
            console.log(
              `Connected to ${chainId} with ${connectorId} (${type}) at ${address}`
            );
          }}
          environment="production"
        >
          {children}
        </PayKitProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}
```

**PayKitProvider Configuration Options**

{% include "../.gitbook/includes/the-paykitprovider-allows-y....md" %}

The `PayKitProvider` accepts the following configuration parameters:

<table><thead><tr><th width="218.4000244140625">Option</th><th width="146.5999755859375">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>apiKey</code></td><td>Yes</td><td>API Key of the organization, acquired in the developers tab of the <a href="https://dashboard.coinvoyage.io/developers">dashboard</a>.</td></tr><tr><td><code>customTheme</code></td><td>No</td><td>Gives you the flexibility to modify the PayKit modal styling. See also <a href="sdk-reference.md#themes-and-customization">Themes &#x26; customisation</a></td></tr><tr><td><code>environment</code></td><td>No</td><td><p>Environment to connect to:</p><ul><li>production (default)</li><li>development</li></ul><p>The development environment exposes additional testnet chains.</p></td></tr><tr><td><code>debugMode</code></td><td>No</td><td>Will log debug logs into the console, helpful when integrating.</td></tr><tr><td><code>mode</code></td><td>No</td><td>"light", "dark" or "auto"</td></tr><tr><td><code>onConnect</code></td><td>No</td><td>Callback triggered upon connection of a new wallet.</td></tr><tr><td><code>onConnectValidation</code></td><td>No</td><td>Allows you to pass a custom function that is run upon connecting of a wallet.</td></tr><tr><td><code>onDisconnect</code></td><td>No</td><td>Callback triggered upon disconnect of a wallet.</td></tr><tr><td><code>options</code></td><td>No</td><td><p>Multiple options to modify PayKit modal, including:</p><ul><li>add a disclaimer</li><li>control display language</li><li>hide tooltips</li></ul><p>and more</p></td></tr><tr><td><code>theme</code></td><td>No</td><td><p>Select a predefined styling for the PayKit modal, options include:</p><ul><li>auto</li><li>web95</li><li>retro</li><li>soft</li><li>midnight</li><li>minimal</li><li>rounded</li><li>nouns</li></ul></td></tr></tbody></table>





#### WalletProvider

The `WalletProvider` wraps the `PayKitProvider` , and is required if you want to utilize the [PayButton](sdk-reference.md#paybutton) and [usePayStatus](sdk-reference.md#usepaystatus). It facilitates the configuration of specific chain types, such as setting a specific `rpcUrl` or adding additional wallet connectors.

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

<table><thead><tr><th width="218.4000244140625">Option</th><th width="146.5999755859375">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>config</code></td><td>No</td><td>Object that contains chain type specific configurations.</td></tr><tr><td><code>config.evm</code></td><td>No</td><td><p>Configuration for EVM chain types. Allows configuration of wallets, connectors, and other evm specific properties.</p><p>Also includes options to configure <code>WalletConnect</code>, <code>Coinbase Wallet</code> and <code>MetaMask</code></p></td></tr><tr><td><code>config.solana</code></td><td>No</td><td>Configuration of the Solana chain. Set a custom <code>rpcUrl</code> and configure wallet adapters.</td></tr><tr><td><code>config.sui</code></td><td>No</td><td>Configuration of the Sui chain. Set a custom <code>rpcUrl</code> and configure wallet adapters.</td></tr><tr><td><code>config.utxo</code></td><td>No</td><td>Configuration of UTXO chain types. Allows configuration of wallet connectors and few additional options.</td></tr></tbody></table>





#### PayButton

{% columns %}
{% column %}
UI component you can add to your application. The button comes in multiple themes and its style is customizable to your branding.

Clicking the button opens a modal that allows the user to select a payment methods in order to complete the pay order.
{% endcolumn %}

{% column %}
<figure><img src="../.gitbook/assets/pay_button (1).png" alt=""><figcaption></figcaption></figure>
{% endcolumn %}
{% endcolumns %}

<pre class="language-tsx" data-title="deposit-pay-button-example" data-overflow="wrap"><code class="lang-tsx">&#x3C;PayButton
    intent="Deposit"
    toAddress={"0xYourWalletToDepositInto"}
    toAmount={100}
    toChain={ChainId.ETH}
    toToken={"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"} // USDC
    
    mode="auto"
<strong>    style={{
</strong>       backgroundColor: "#CF276B",
       color: "white",
    }}
    onClose={() => {
       console.log("Modal Closed")
    }}
    onOpen={() => {
       console.log("Modal Opened")
    }}
    closeOnSuccess={true}

    onPaymentCreationError={(event) => {
       console.log(event.errorMessage)
    }}
    onPaymentBounced={() => {
       console.error("Payment Bounced")
    }}
    onPaymentStarted={() => {
       console.log("Payment Started", {
         description: "Your payment is being processed.",
       })
    }}
    onPaymentCompleted={() => {
       console.log("Payment Complete", {
         description: "Your payment was successful.",
       })
    }}
/>
</code></pre>

**PayButton Configuration Options**

The `PayButton` accepts the following configuration parameters:

<table><thead><tr><th width="250">Option</th><th width="120">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>payId</code></td><td>Conditional*</td><td>The payment ID, generated via the Coin Voyage API. Replaces the deposit parameters below. Use this to display a pay order created on the <strong>server</strong>, like a <code>SALE</code> pay order.</td></tr><tr><td><code>toChain</code></td><td>Conditional*</td><td>Destination chain ID. The chain to deposit to.</td></tr><tr><td><code>toToken</code></td><td>No</td><td>The destination token to receive. Specify the contract address of the token (ERC-20/SPL/...). Omitting (<code>undefined</code>) indicates the native token (ETH/SOL/SUI/...).</td></tr><tr><td><code>toAmount</code></td><td>Conditional*</td><td>The amount of destination token to receive.</td></tr><tr><td><code>toAddress</code></td><td>Conditional*</td><td>The recipient of the deposit. Must be an address on the <code>toChain</code>.</td></tr><tr><td><code>metadata</code></td><td>No</td><td>Metadata to attach to the deposit.</td></tr><tr><td><code>intent</code></td><td>No</td><td>The intent verb displayed on the button, such as "Pay", "Deposit", or "Purchase".</td></tr><tr><td><code>onPaymentCreationError</code></td><td>No</td><td>Callback triggered when invalid properties are used to create a deposit payOrder.</td></tr><tr><td><code>onPaymentStarted</code></td><td>No</td><td>Callback triggered when user sends payment and transaction is seen on chain.</td></tr><tr><td><code>onPaymentCompleted</code></td><td>No</td><td>Callback triggered when destination transfer or call completes successfully.</td></tr><tr><td><code>onPaymentBounced</code></td><td>No</td><td>Callback triggered when destination call reverts and funds are refunded.</td></tr><tr><td><code>onOpen</code></td><td>No</td><td>Callback triggered when the modal is opened.</td></tr><tr><td><code>onClose</code></td><td>No</td><td>Callback triggered when the modal is closed.</td></tr><tr><td><code>defaultOpen</code></td><td>No</td><td>Open the modal by default on component mount.</td></tr><tr><td><code>mode</code></td><td>No</td><td>Visual appearance mode: "light", "dark", or "auto".</td></tr><tr><td><code>theme</code></td><td>No</td><td>Named theme preset. See <a href="sdk-reference.md#themes-and-customization">Themes &#x26; customization</a> for available options.</td></tr><tr><td><code>customTheme</code></td><td>No</td><td>Custom theme object for advanced styling. See <a href="sdk-reference.md#themes-and-customization">Themes &#x26; customization</a> for details.</td></tr></tbody></table>

{% hint style="info" %}
**\*Required Parameters:** Either provide `payId` **OR** all three of `toAddress`, `toChain`, and `toAmount`. The `payId` approach is used for server-generated pay orders, while the direct parameters are used for client-side deposit flows.
{% endhint %}





#### PayButton.Custom

For advanced use cases where you need complete control over the button's appearance and behavior, use `PayButton.Custom`. This component provides a render prop pattern that gives you access to `show()` and `hide()` functions to control the payment modal.

**Usage**

```tsx
<PayButton.Custom
  payId={payId}
  onPaymentStarted={(event) => {
    console.log("Payment started", event);
  }}
  onPaymentCompleted={(event) => {
    console.log("Payment completed", event);
  }}
>
  {({ show, hide }) => (
    <button
      onClick={show}
      className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
    >
      Pay With Crypto
    </button>
  )}
</PayButton.Custom>
```

**PayButton.Custom Configuration Options**

The `PayButton.Custom` component accepts all the same configuration parameters as `PayButton` (payment props, callbacks, etc.), except for the styling options. Instead of `style`, `mode`, `theme`, `customTheme`, and `disabled`, it provides a `children` render prop:

<table><thead><tr><th width="250">Option</th><th width="120">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>children</code></td><td>Yes</td><td>A render function that receives <code>show</code> and <code>hide</code> functions to control the modal.</td></tr><tr><td><code>payId</code></td><td>Conditional*</td><td>The payment ID, generated via the Coin Voyage API.</td></tr><tr><td><code>toChain</code></td><td>Conditional*</td><td>Destination chain ID.</td></tr><tr><td><code>toToken</code></td><td>No</td><td>The destination token contract address or <code>undefined</code> for native token.</td></tr><tr><td><code>toAmount</code></td><td>Conditional*</td><td>The amount of destination token to receive.</td></tr><tr><td><code>toAddress</code></td><td>Conditional*</td><td>The recipient address on the destination chain.</td></tr><tr><td><code>metadata</code></td><td>No</td><td>Metadata to attach to the payment.</td></tr><tr><td><code>intent</code></td><td>No</td><td>The intent verb (not displayed on custom button).</td></tr><tr><td><code>onPaymentCreationError</code></td><td>No</td><td>Callback triggered when payment creation fails.</td></tr><tr><td><code>onPaymentStarted</code></td><td>No</td><td>Callback triggered when payment transaction is detected.</td></tr><tr><td><code>onPaymentCompleted</code></td><td>No</td><td>Callback triggered when payment completes successfully.</td></tr><tr><td><code>onPaymentBounced</code></td><td>No</td><td>Callback triggered when payment fails and is refunded.</td></tr><tr><td><code>onOpen</code></td><td>No</td><td>Callback triggered when modal opens.</td></tr><tr><td><code>onClose</code></td><td>No</td><td>Callback triggered when modal closes.</td></tr><tr><td><code>defaultOpen</code></td><td>No</td><td>Open the modal by default on mount.</td></tr></tbody></table>

**Render Props**

The `children` function receives an object with the following functions:

| Function | Description                                                                     |
| -------- | ------------------------------------------------------------------------------- |
| `show()` | Opens the payment modal. Call this from your custom button's `onClick` handler. |
| `hide()` | Closes the payment modal programmatically.                                      |

{% hint style="info" %}
**When to use PayButton.Custom:**

- You need complete control over button styling beyond CSS customization
- You want to integrate the payment modal into an existing design system
- You need to trigger the modal from multiple UI elements
- You want to programmatically control modal visibility
  {% endhint %}



#### ApiClient

The API client is the easiest way to interact with the CoinVoyage backend. It allows you to safely create PayOrders on the server and perform various payment-related operations.

**Initialization**

```tsx
import { ApiClient } from "@coin-voyage/paykit/server";

export const apiClient = (apiKey: string) =>
  ApiClient({
    apiKey,
    environment: "development",
  });
```

**Configuration Options**

<table><thead><tr><th width="200">Option</th><th width="120">Required?</th><th>Description</th></tr></thead><tbody><tr><td><code>apiKey</code></td><td>Yes</td><td>API Key of the organization, acquired in the developers tab of the <a href="https://dashboard.coinvoyage.io/developers">dashboard</a>.</td></tr><tr><td><code>environment</code></td><td>No</td><td>Environment to connect to: <code>production</code> (default) or <code>development</code>.</td></tr></tbody></table>

***

**API Response Structure**

All ApiClient methods return responses wrapped in an `APIResponse<T>` object that provides consistent error handling:

```tsx
interface APIResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
```

**Usage Pattern:**

```tsx
const { data, error } = await apiClient.someMethod();

if (error) {
  console.error("Operation failed:", error);
  // Handle error case
  return;
}

// Use data safely - TypeScript knows it's defined
console.log("Success:", data);
```

This pattern ensures you always handle both success and error cases explicitly, and TypeScript can properly type-check your code.

---

**ApiClient Methods**

The API client exposes the following methods to interact with the backend:

***

**`getPayOrder`**

Fetches a PayOrder by its ID. Retrieves a PayOrder object from the API using the provided payOrderId.

```tsx
const { data: payOrder, error } = await apiClient.getPayOrder(
  "pay-order-id-123"
);
```

**Parameters:**

* `payOrderId` (string): The unique identifier of the PayOrder.

**Returns:** `Promise<APIResponse<PayOrder>>` - The PayOrder object wrapped in an API response.

**Response Structure:**

```typescript
// Successful response
{ data: PayOrder }

// Error response
{
  error: {
    path: string,
    statusCode: number,
    status: string,
    message: string
  }
}
```

---

**`generateAuthorizationSignature`**

Generates an authorization signature for API requests that require enhanced security. This signature is required for creating `SALE` and `REFUND` PayOrders.

{% hint style="warning" %}
**Security Warning:** This function should only be run on the server. It uses the API secret, which must remain confidential. Never expose your API secret in client-side code.
{% endhint %}

```tsx
const apiSecret = process.env.COIN_VOYAGE_API_SECRET!;
const signature = apiClient.generateAuthorizationSignature(apiSecret);
```

The signature is a SHA-512 hash of the concatenated API key, secret, and timestamp, formatted as:

```
APIKey=<apiKey>,signature=<signature>,timestamp=<timestamp>
```

**Parameters:**

* `apiSecret` (string): The API secret obtained from the [dashboard](https://dashboard.coinvoyage.io/developers).

**Returns:** `string` - A formatted authorization string.

***

**`createPayOrder`**

Creates a PayOrder using a unified intent-based API. This method supports all PayOrder modes (DEPOSIT, SALE, REFUND) through a flexible intent structure.

You may perform this operation on either the **client** or **server**. Executing on the **server** ensures users cannot perform malicious actions.

{% hint style="info" %}
For SALE and REFUND modes, this method requires an authorization signature generated using `generateAuthorizationSignature`.
{% endhint %}

**Example: Deposit with token amount**

```tsx
import { ApiClient, ChainId } from "@coin-voyage/paykit/server";

const { data, error } = await apiClient.createPayOrder({
  intent: {
    asset: {
      chain_id: ChainId.SUI,
      address: null, // null for native token (SUI)
    },
    amount: {
      token_amount: 10, // 10 SUI
    },
    receiving_address: "0xYourReceivingAddressHere",
  },
  metadata: {
    items: [{ name: "Deposit to SUI wallet" }],
  },
});
```

**Example: Sale with fiat amount**

```tsx
const signature = apiClient.generateAuthorizationSignature(apiSecret);

const { data, error } = await apiClient.createPayOrder(
  {
    intent: {
      amount: {
        fiat: {
          amount: 200,
          unit: "USD",
        },
      },
    },
    metadata: {
      items: [
        {
          name: "t-shirt",
          description: "A nice t-shirt",
          image: "https://example.com/tshirt.jpg",
          quantity: 1,
          unit_price: 200,
          currency: "USD",
        },
      ],
    },
  },
  signature
);
```

**Parameters:**

* `params` (PayOrderParams): Parameters required to create a PayOrder
  * `intent` (PayOrderIntent): The intent of the order
    * `asset` (optional): Desired fulfillment asset with `chain_id` and `address` (null for native token)
    * `amount` (IntentAmount): Amount expected to fulfill the order
      * `token_amount` (optional): Token amount in human-readable format (e.g., 10 for 10 tokens)
      * `fiat` (optional): Fiat amount with `amount` and `unit` (e.g., "USD")
    * `receiving_address` (optional): Address to fulfill the order to. If not provided, a settlement address will be selected.
  * `metadata` (optional): Additional metadata for the PayOrder
* `signature` (string, optional): Authorization signature from `generateAuthorizationSignature` (required for SALE/REFUND modes)

**Returns:** `Promise<APIResponse<PayOrder>>` - The created PayOrder object wrapped in an API response.

{% hint style="warning" %}
**Amount validation:** You must provide either `token_amount` OR `fiat`, but not both. The amount must be greater than zero.
{% endhint %}

**Built-in Validation:**
The method automatically validates input parameters using Zod schemas. If validation fails, it returns an error response without making the API call:

```typescript
// Invalid input example - both amounts provided
const { error } = await apiClient.createPayOrder({
  intent: {
    amount: {
      token_amount: 10,
      fiat: { amount: 100, unit: "USD" }, // Error: only one allowed
    },
  },
});
// Returns: { error: { statusCode: 400, message: "Only one of fiat amount or token amount should be present." } }
```

***

**`createRefundPayOrder`**

Creates a PayOrder with mode `REFUND` for an existing PayOrder. This allows merchants to refund full or partial payments.

{% hint style="info" %}
This method requires an authorization signature generated using `generateAuthorizationSignature`.
{% endhint %}

```tsx
const signature = apiClient.generateAuthorizationSignature(apiSecret);

const { data: refundPayOrder, error } = await apiClient.createRefundPayOrder(
  "original-payorder-id",
  {
    intent: {
      amount: {
        fiat: {
          amount: 100,
          unit: "USD",
        },
      },
    },
    metadata: {
      refund: {
        reason: "Customer requested refund",
        refund_amount: 100,
        currency: "USD",
      },
    },
  },
  signature
);
```

**Parameters:**

* `payOrderId` (string): The unique identifier of the PayOrder to be refunded
* `params` (PayOrderParams): Parameters for the refund
  * `intent` (PayOrderIntent): The refund intent with amount
  * `metadata` (optional): Additional metadata including refund details
* `signature` (string): Authorization signature from `generateAuthorizationSignature`

**Returns:** `Promise<APIResponse<PayOrder>>` - Response object containing either the PayOrder data or error information.

***

**`payOrderQuote`**

Generates a PayOrder quote by providing wallet information and chain details. This returns available payment tokens with balances for the user's wallet.

```tsx
const { data: quote, error } = await apiClient.payOrderQuote("pay-order-id", {
  wallet_address: "0x1234...abcd",
  chain_type: ChainType.EVM,
  chain_id: 1, // Ethereum Mainnet
});
```

**Parameters:**

* `payOrderId` (string): The unique identifier of the PayOrder
* `params` (PayOrderQuoteParams): Quote request parameters
  * `wallet_address`: The user's wallet address
  * `chain_type`: The blockchain type (EVM, Solana, etc.)
  * `chain_id`: The specific chain ID

**Returns:** `Promise<APIResponse<PayOrderQuote[]>>` - Response object containing available payment options or error information.

***

**`payOrderPaymentDetails`**

Retrieves payment details for a specific PayOrder. This provides the information needed to complete the payment, including the destination address and amount.

```tsx
const { data: paymentDetails, error } = await apiClient.payOrderPaymentDetails({
  payorder_id: "12345",
  token_address: "0x1234567890abcdef1234567890abcdef12345678", // Optional
  chain_id: ChainId.ETH,
  refund_address: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
});
```

**Parameters:**

* `params` (PaymentDetailsParams):
  * `payorder_id`: The unique identifier of the PayOrder
  * `token_address` (optional): The token address of the source currency
  * `chain_id`: The blockchain network ID
  * `refund_address`: The address where funds will be refunded in case of failure

**Returns:** `Promise<APIResponse<PaymentDetails>>` - Response object containing payment details or error information.

***

**`processPayOrder`**

{% hint style="warning" %}
**Deprecated:** This function is deprecated and will be removed in future versions. The backend now automatically scans for incoming transactions.
{% endhint %}

Triggers the processing of a PayOrder by providing the transaction hash that represents the payment on the blockchain.

```tsx
await apiClient.processPayOrder("pay-order-id", "0xabcdef...");
```

**Parameters:**

* `payOrderId` (string): The unique identifier of the PayOrder
* `sourceTransactionHash` (string): The transaction hash representing the payment

**Returns:** `Promise<void>`

***

**`listPayOrders`**

Retrieves a paginated list of PayOrders for your organization.

```tsx
const { data, error } = await apiClient.listPayOrders({
  limit: 20,
  offset: 0,
  status: PayOrderStatus.COMPLETED,
});
```

**Parameters:**

* `params` (ListPayOrdersParams): Query parameters for filtering
  * `limit` (optional): Number of results to return (default: 20)
  * `offset` (optional): Pagination offset
  * `status` (optional): Filter by PayOrder status

**Returns:** `Promise<APIResponse<{ data: PayOrder[], total: number, limit: number, offset: number }>>` - Paginated list of PayOrders.

&#x20;

#### Types

The SDK exports several TypeScript types to help you work with PayOrders and related data.

***

**PayOrder**

The main PayOrder object returned from API methods.

```typescript
type PayOrder = {
  id: string
  mode: PayOrderMode
  status: PayOrderStatus
  metadata?: PayOrderMetadata
  deposit_tx_hash?: string
  receiving_tx_hash?: string
  refund_tx_hash?: string
  fulfillment: FulfillmentData
  payment?: PaymentData
}
```

<table><thead><tr><th width="200">Field</th><th width="180">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>id</code></td><td><code>string</code></td><td>Unique identifier for the PayOrder.</td></tr><tr><td><code>mode</code></td><td><code>PayOrderMode</code></td><td>The mode of the PayOrder (SALE, DEPOSIT, or REFUND).</td></tr><tr><td><code>status</code></td><td><code>PayOrderStatus</code></td><td>Current status of the PayOrder.</td></tr><tr><td><code>metadata</code></td><td><code>PayOrderMetadata</code></td><td>Optional metadata attached to the order.</td></tr><tr><td><code>deposit_tx_hash</code></td><td><code>string</code></td><td>Transaction hash of the user's deposit.</td></tr><tr><td><code>receiving_tx_hash</code></td><td><code>string</code></td><td>Transaction hash of the final transfer to the recipient.</td></tr><tr><td><code>refund_tx_hash</code></td><td><code>string</code></td><td>Transaction hash of the refund, if applicable.</td></tr><tr><td><code>fulfillment</code></td><td><code>FulfillmentData</code></td><td>Details about what the PayOrder will fulfill.</td></tr><tr><td><code>payment</code></td><td><code>PaymentData</code></td><td>Payment details including source, destination, and execution info.</td></tr></tbody></table>

***

**PayOrderMode**

Enum representing the mode of a PayOrder.

```typescript
enum PayOrderMode {
  SALE = "SALE",
  DEPOSIT = "DEPOSIT",
  REFUND = "REFUND",
}
```

<table><thead><tr><th width="150">Value</th><th>Description</th></tr></thead><tbody><tr><td><code>SALE</code></td><td>Merchant sale where payment is settled to the configured settlement currency.</td></tr><tr><td><code>DEPOSIT</code></td><td>Direct deposit to a specified address on a target chain.</td></tr><tr><td><code>REFUND</code></td><td>Refund of a previous PayOrder (full or partial).</td></tr></tbody></table>

***

**PayOrderStatus**

Enum representing all possible PayOrder statuses.

```typescript
enum PayOrderStatus {
  PENDING = "PENDING",
  FAILED = "FAILED",
  AWAITING_PAYMENT = "AWAITING_PAYMENT",
  AWAITING_CONFIRMATION = "AWAITING_CONFIRMATION",
  OPTIMISTIC_CONFIRMED = "OPTIMISTIC_CONFIRMED",
  EXECUTING_ORDER = "EXECUTING_ORDER",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
  REFUNDED = "REFUNDED",
}
```

<table><thead><tr><th width="250">Status</th><th>Description</th></tr></thead><tbody><tr><td><code>PENDING</code></td><td>PayOrder has been created but not yet ready for payment.</td></tr><tr><td><code>AWAITING_PAYMENT</code></td><td>PayOrder is ready and waiting for the user to send payment.</td></tr><tr><td><code>AWAITING_CONFIRMATION</code></td><td>Payment transaction detected, waiting for blockchain confirmation.</td></tr><tr><td><code>OPTIMISTIC_CONFIRMED</code></td><td>Transaction optimistically confirmed, execution can begin.</td></tr><tr><td><code>EXECUTING_ORDER</code></td><td>Payment is being processed and routed to the destination.</td></tr><tr><td><code>COMPLETED</code></td><td>PayOrder completed successfully. Funds delivered to recipient.</td></tr><tr><td><code>FAILED</code></td><td>PayOrder failed during processing.</td></tr><tr><td><code>EXPIRED</code></td><td>PayOrder expired before payment was received.</td></tr><tr><td><code>REFUNDED</code></td><td>Payment was refunded to the user's refund address.</td></tr></tbody></table>

***

**PayOrderMetadata**

Metadata that can be attached to a PayOrder. Supports structured item details, refund information, and custom fields.

```typescript
type PayOrderMetadata = {
  items?: Array<{
    name: string
    description?: string
    image?: string
    quantity?: number
    unit_price?: number
    currency?: string
  }>
  refund?: {
    name?: string
    reason?: string
    additional_info?: string
    refund_amount?: number
    currency?: string
  }
  // Plus up to 20 custom fields
  [key: string]: any
}
```

**Items Array**

<table><thead><tr><th width="150">Field</th><th width="120">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>name</code></td><td><code>string</code></td><td>Name of the item being purchased/donated/deposited.</td></tr><tr><td><code>description</code></td><td><code>string</code></td><td>Optional description of the item.</td></tr><tr><td><code>image</code></td><td><code>string</code></td><td>Optional URL to an image of the item.</td></tr><tr><td><code>quantity</code></td><td><code>number</code></td><td>Optional quantity (integer).</td></tr><tr><td><code>unit_price</code></td><td><code>number</code></td><td>Optional price per unit.</td></tr><tr><td><code>currency</code></td><td><code>string</code></td><td>Optional currency code for the price (e.g., "USD").</td></tr></tbody></table>

**Refund Object**

<table><thead><tr><th width="180">Field</th><th width="120">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>name</code></td><td><code>string</code></td><td>Optional name/label for the refund.</td></tr><tr><td><code>reason</code></td><td><code>string</code></td><td>Optional reason for the refund.</td></tr><tr><td><code>additional_info</code></td><td><code>string</code></td><td>Optional additional information.</td></tr><tr><td><code>refund_amount</code></td><td><code>number</code></td><td>Optional refund amount.</td></tr><tr><td><code>currency</code></td><td><code>string</code></td><td>Optional currency code for the refund amount.</td></tr></tbody></table>

**Custom Fields**

You can add up to 20 additional custom fields to the metadata object. Each custom field value must be a string with a maximum of 500 characters.

```typescript
const metadata: PayOrderMetadata = {
  items: [{ name: "Premium Plan" }],
  // Custom fields
  customer_id: "cust_12345",
  order_reference: "ORD-2024-001",
  campaign: "summer_sale",
}
```

***

**PayOrderParams**

Parameters for creating a PayOrder via the `createPayOrder` method.

```typescript
type PayOrderParams = {
  intent: PayOrderIntent
  metadata?: PayOrderMetadata
}
```

<table><thead><tr><th width="150">Field</th><th width="200">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>intent</code></td><td><code>PayOrderIntent</code></td><td>The intent of the order, specifying asset, amount, and destination.</td></tr><tr><td><code>metadata</code></td><td><code>PayOrderMetadata</code></td><td>Optional metadata to attach to the PayOrder.</td></tr></tbody></table>

***

**PayOrderIntent**

Defines the intent of a PayOrder, specifying what should be fulfilled.

```typescript
type PayOrderIntent = {
  asset?: CurrencyBase
  amount: IntentAmount
  receiving_address?: string
}
```

<table><thead><tr><th width="200">Field</th><th width="180">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>asset</code></td><td><code>CurrencyBase</code></td><td>Optional desired fulfillment asset with <code>chain_id</code> and <code>address</code>.</td></tr><tr><td><code>amount</code></td><td><code>IntentAmount</code></td><td>Amount expected to fulfill the order.</td></tr><tr><td><code>receiving_address</code></td><td><code>string</code></td><td>Optional address to fulfill to. If not provided, a settlement address will be selected.</td></tr></tbody></table>

***

**IntentAmount**

Specifies the amount for a PayOrder intent. Provide either `token_amount` OR `fiat`, but not both.

```typescript
type IntentAmount = {
  token_amount?: number
  fiat?: {
    amount: number
    unit: FiatCurrency
  }
}
```

<table><thead><tr><th width="180">Field</th><th width="180">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>token_amount</code></td><td><code>number</code></td><td>Token amount in human-readable format (e.g., 10 for 10 tokens). Must be greater than zero.</td></tr><tr><td><code>fiat</code></td><td><code>object</code></td><td>Fiat amount with <code>amount</code> (number, must be > 0) and <code>unit</code> (FiatCurrency, e.g., "USD").</td></tr></tbody></table>

***

**PaymentDetails**

Returned by `payOrderPaymentDetails`, contains payment information for completing a PayOrder.

```typescript
type PaymentDetails = {
  payorder_id: string
  status: PayOrderStatus
  data: PaymentData

  // Deprecated fields (use data.* instead)
  expires_at: Date           // Use data.expires_at
  refund_address: string     // Use data.refund_address
  deposit_address: string    // Use data.deposit_address
  receiving_address: string  // Use data.receiving_address
  source_currency: Currency  // Use data.src
  source_amount: CurrencyAmount    // Use data.src.currency_amount
  destination_currency: Currency   // Use data.dst
  destination_amount: CurrencyAmount // Use data.dst.currency_amount
}
```

<table><thead><tr><th width="220">Field</th><th width="180">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>payorder_id</code></td><td><code>string</code></td><td>The PayOrder identifier.</td></tr><tr><td><code>status</code></td><td><code>PayOrderStatus</code></td><td>Current status of the PayOrder.</td></tr><tr><td><code>data</code></td><td><code>PaymentData</code></td><td>Full payment data with source, destination, and execution details.</td></tr></tbody></table>

{% hint style="warning" %}
**Deprecated fields:** The top-level fields `expires_at`, `refund_address`, `deposit_address`, `receiving_address`, `source_currency`, `source_amount`, `destination_currency`, and `destination_amount` are deprecated. Use the corresponding fields in the `data` object instead.
{% endhint %}

***

**FulfillmentData**

Details about what the PayOrder will fulfill.

```typescript
type FulfillmentData = {
  asset?: Currency
  fiat?: FiatCurrency
  amount: CurrencyAmount
  rate_usd?: number
  receiving_address: string
}
```

<table><thead><tr><th width="200">Field</th><th width="180">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>asset</code></td><td><code>Currency</code></td><td>The target asset/token to receive.</td></tr><tr><td><code>fiat</code></td><td><code>FiatCurrency</code></td><td>The fiat currency for SALE orders.</td></tr><tr><td><code>amount</code></td><td><code>CurrencyAmount</code></td><td>The amount to fulfill.</td></tr><tr><td><code>rate_usd</code></td><td><code>number</code></td><td>USD exchange rate at time of creation.</td></tr><tr><td><code>receiving_address</code></td><td><code>string</code></td><td>Address that will receive the funds.</td></tr></tbody></table>

***

**PaymentData**

Payment details including source, destination, and execution tracking.

```typescript
type PaymentData = {
  src: QuoteWithCurrency
  dst: CurrencyWithAmount
  deposit_address: string
  receiving_address: string
  refund_address: string
  source_tx_hash?: string
  destination_tx_hash?: string
  refund_tx_hash?: string
  execution?: ExecutionStep[]
  expires_at: Date
}
```

<table><thead><tr><th width="220">Field</th><th width="180">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>src</code></td><td><code>QuoteWithCurrency</code></td><td>Source currency with quote breakdown (total, base, fee, gas).</td></tr><tr><td><code>dst</code></td><td><code>CurrencyWithAmount</code></td><td>Destination currency and amount.</td></tr><tr><td><code>deposit_address</code></td><td><code>string</code></td><td>Address where user should send payment.</td></tr><tr><td><code>receiving_address</code></td><td><code>string</code></td><td>Address that will receive the final funds.</td></tr><tr><td><code>refund_address</code></td><td><code>string</code></td><td>Address for refunds if payment fails.</td></tr><tr><td><code>source_tx_hash</code></td><td><code>string</code></td><td>Transaction hash of the deposit.</td></tr><tr><td><code>destination_tx_hash</code></td><td><code>string</code></td><td>Transaction hash of the final transfer.</td></tr><tr><td><code>refund_tx_hash</code></td><td><code>string</code></td><td>Transaction hash of any refund.</td></tr><tr><td><code>execution</code></td><td><code>ExecutionStep[]</code></td><td>Array of execution steps for multi-provider routing.</td></tr><tr><td><code>expires_at</code></td><td><code>Date</code></td><td>When the payment expires.</td></tr></tbody></table>

***

**CurrencyAmount**

Represents an amount in various formats.

```typescript
interface CurrencyAmount {
  ui_amount: number
  ui_amount_display: string
  raw_amount: string
  value_usd: number
}
```

<table><thead><tr><th width="200">Field</th><th width="120">Type</th><th>Description</th></tr></thead><tbody><tr><td><code>ui_amount</code></td><td><code>number</code></td><td>Human-readable amount (e.g., 1.5 for 1.5 ETH).</td></tr><tr><td><code>ui_amount_display</code></td><td><code>string</code></td><td>Formatted display string.</td></tr><tr><td><code>raw_amount</code></td><td><code>string</code></td><td>Raw amount as string (to prevent BigInt precision loss).</td></tr><tr><td><code>value_usd</code></td><td><code>number</code></td><td>USD value of the amount.</td></tr></tbody></table>

***

**ExecutionStep**

Represents a single step in multi-provider payment execution.

```typescript
type ExecutionStep = {
  id: string
  status: ProviderStatus
  provider: string
  receiver: string
  deposit_address: string
  source_tx_hash?: string | null
  destination_tx_hash?: string | null
  error?: unknown
  source_currency: CurrencyWithAmount
  destination_currency: CurrencyWithAmount
  gas_amount?: CurrencyAmount
  fee_plan?: FeePlan
  price_impact?: string
}

type ProviderStatus = "pending" | "executing" | "completed" | "error" | "cleaned_up"
```

***

**WebhookEventType**

Enum of webhook event types you can subscribe to.

```typescript
enum WebhookEventType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_AWAITING_PAYMENT = "ORDER_AWAITING_PAYMENT",
  ORDER_CONFIRMING = "ORDER_CONFIRMING",
  ORDER_EXECUTING = "ORDER_EXECUTING",
  ORDER_COMPLETED = "ORDER_COMPLETED",
  ORDER_ERROR = "ORDER_ERROR",
  ORDER_REFUNDED = "ORDER_REFUNDED"
}
```

<table><thead><tr><th width="260">Event Type</th><th>Description</th></tr></thead><tbody><tr><td><code>ORDER_CREATED</code></td><td>Fired when a new PayOrder is created.</td></tr><tr><td><code>ORDER_AWAITING_PAYMENT</code></td><td>Fired when a PayOrder is ready for payment.</td></tr><tr><td><code>ORDER_CONFIRMING</code></td><td>Fired when payment is detected and confirming.</td></tr><tr><td><code>ORDER_EXECUTING</code></td><td>Fired when payment execution begins.</td></tr><tr><td><code>ORDER_COMPLETED</code></td><td>Fired when PayOrder completes successfully.</td></tr><tr><td><code>ORDER_ERROR</code></td><td>Fired when an error occurs during processing.</td></tr><tr><td><code>ORDER_REFUNDED</code></td><td>Fired when a refund is processed.</td></tr></tbody></table>

For webhook configuration details, see the [Webhooks documentation](webhooks.md).

&#x20;

#### usePayStatus

A React hook that returns the current payment status and ID, or `undefined` if there is no active payment. This hook allows you to track the payment lifecycle in your application.

**Usage**

```tsx
import { usePayStatus } from "@coin-voyage/paykit";

function PaymentTracker() {
  const paymentStatus = usePayStatus();

  if (!paymentStatus) {
    return <div>No active payment</div>;
  }

  return (
    <div>
      <p>Payment ID: {paymentStatus.paymentId}</p>
      <p>Status: {paymentStatus.status}</p>

      {paymentStatus.status === "payment_pending" && (
        <p>Waiting for payment...</p>
      )}
      {paymentStatus.status === "payment_started" && (
        <p>Processing your payment...</p>
      )}
      {paymentStatus.status === "payment_completed" && (
        <p>✅ Payment successful!</p>
      )}
      {paymentStatus.status === "payment_bounced" && (
        <p>⚠️ Payment bounced - funds refunded</p>
      )}
      {paymentStatus.status === "payment_expired" && <p>Payment expired</p>}
      {paymentStatus.status === "payment_failed" && <p>❌ Payment failed</p>}
    </div>
  );
}
```

**Return Value**

Returns `{ paymentId: string; status: PaymentStatus } | undefined`

* `paymentId`: The unique identifier of the PayOrder
* `status`: The current payment status (see below)
* Returns `undefined` if there is no active payment

**Payment Status Values**

<table><thead><tr><th width="220">Status</th><th>Description</th></tr></thead><tbody><tr><td><code>payment_pending</code></td><td>The user has not paid yet. The PayOrder is awaiting payment.</td></tr><tr><td><code>payment_started</code></td><td>The user has paid and the payment is in progress. This status typically lasts a few seconds while the transaction is being confirmed.</td></tr><tr><td><code>payment_completed</code></td><td>The final call or transfer succeeded. Payment completed successfully.</td></tr><tr><td><code>payment_bounced</code></td><td>The final call or transfer reverted. Funds were sent to the payment's configured refund address on the destination chain.</td></tr><tr><td><code>payment_expired</code></td><td>The payment expired before the user paid.</td></tr><tr><td><code>payment_failed</code></td><td>The payment failed for some reason.</td></tr></tbody></table>

**Status Mapping**

The hook maps internal `PayOrderStatus` values to user-friendly `PaymentStatus` values:

* `AWAITING_PAYMENT`, `PENDING` → `payment_pending`
* `AWAITING_CONFIRMATION` → `payment_started`
* `EXECUTING_ORDER`, `COMPLETED` → `payment_completed`
* `REFUNDED` → `payment_bounced`
* `EXPIRED` → `payment_expired`
* `FAILED` → `payment_failed`





#### Themes & Customization

CoinVoyage PayKit offers extensive theming and customization options to match your brand and design preferences. You can choose from predefined themes or create custom themes using CSS variables.

***

**Using Predefined Themes**

Apply a theme to your PayKit modal by setting the `theme` prop on the `PayKitProvider` or `PayButton`:

```tsx
<PayKitProvider
  apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY!}
  theme="midnight"
  mode="auto"
>
  {children}
</PayKitProvider>
```

**Available Themes**

<table><thead><tr><th width="180">Theme Name</th><th>Description</th></tr></thead><tbody><tr><td><code>auto</code></td><td>Automatically adapts to system light/dark mode preferences (default).</td></tr><tr><td><code>web95</code></td><td>Retro Windows 95-inspired design with classic UI elements.</td></tr><tr><td><code>retro</code></td><td>Vintage aesthetic with nostalgic styling.</td></tr><tr><td><code>soft</code></td><td>Gentle, rounded design with soft colors and shadows.</td></tr><tr><td><code>midnight</code></td><td>Dark theme optimized for low-light environments.</td></tr><tr><td><code>minimal</code></td><td>Clean, minimalist design with reduced visual elements.</td></tr><tr><td><code>rounded</code></td><td>Emphasis on rounded corners and smooth edges.</td></tr><tr><td><code>nouns</code></td><td>Nouns DAO-inspired design with bold, playful elements.</td></tr></tbody></table>

***

**Mode Settings**

Control the light/dark appearance independently from themes:

```tsx
<PayKitProvider
  apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY!}
  mode="dark" // "light" | "dark" | "auto"
>
  {children}
</PayKitProvider>
```

**Mode Options**

* `light` - Force light mode
* `dark` - Force dark mode
* `auto` - Automatically adapt to system preferences (default)

***

**Custom Themes**

For advanced customization, use the `customTheme` prop to override specific CSS variables. This allows you to fine-tune colors, shadows, borders, and other visual properties.

```tsx
<PayKitProvider
  apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY!}
  customTheme={{
    "--ck-primary-button-background": "#CF276B",
    "--ck-primary-button-color": "#FFFFFF",
    "--ck-primary-button-border-radius": "12px",
    "--ck-body-background": "#1a1a1a",
    "--ck-body-color": "#ffffff",
    "--ck-modal-box-shadow": "0 8px 32px rgba(0, 0, 0, 0.4)",
  }}
>
  {children}
</PayKitProvider>
```

***

**Custom Theme Variables**

The `customTheme` object accepts CSS variable overrides organized by component:

**Connect Button**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-connectbutton-font-size</code></td><td>Font size for the connect button text</td></tr><tr><td><code>--ck-connectbutton-color</code></td><td>Text color of the connect button</td></tr><tr><td><code>--ck-connectbutton-background</code></td><td>Background color of the connect button</td></tr><tr><td><code>--ck-connectbutton-background-secondary</code></td><td>Secondary background color</td></tr><tr><td><code>--ck-connectbutton-hover-color</code></td><td>Text color on hover</td></tr><tr><td><code>--ck-connectbutton-hover-background</code></td><td>Background color on hover</td></tr><tr><td><code>--ck-connectbutton-active-color</code></td><td>Text color when active/pressed</td></tr><tr><td><code>--ck-connectbutton-active-background</code></td><td>Background color when active/pressed</td></tr><tr><td><code>--ck-connectbutton-balance-color</code></td><td>Text color for balance display</td></tr><tr><td><code>--ck-connectbutton-balance-background</code></td><td>Background color for balance display</td></tr><tr><td><code>--ck-connectbutton-balance-box-shadow</code></td><td>Box shadow for balance display</td></tr><tr><td><code>--ck-connectbutton-balance-hover-background</code></td><td>Balance background on hover</td></tr><tr><td><code>--ck-connectbutton-balance-hover-box-shadow</code></td><td>Balance box shadow on hover</td></tr><tr><td><code>--ck-connectbutton-balance-active-background</code></td><td>Balance background when active</td></tr><tr><td><code>--ck-connectbutton-balance-active-box-shadow</code></td><td>Balance box shadow when active</td></tr></tbody></table>

**Primary Button**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-primary-button-border-radius</code></td><td>Border radius for primary buttons</td></tr><tr><td><code>--ck-primary-button-color</code></td><td>Text color for primary buttons</td></tr><tr><td><code>--ck-primary-button-background</code></td><td>Background color for primary buttons</td></tr><tr><td><code>--ck-primary-button-box-shadow</code></td><td>Box shadow for primary buttons</td></tr><tr><td><code>--ck-primary-button-font-weight</code></td><td>Font weight for primary button text</td></tr><tr><td><code>--ck-primary-button-hover-color</code></td><td>Text color on hover</td></tr><tr><td><code>--ck-primary-button-hover-background</code></td><td>Background color on hover</td></tr><tr><td><code>--ck-primary-button-hover-box-shadow</code></td><td>Box shadow on hover</td></tr><tr><td><code>--ck-primary-button-active-background</code></td><td>Background color when active/pressed</td></tr></tbody></table>

**Secondary & Tertiary Buttons**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-secondary-button-border-radius</code></td><td>Border radius for secondary buttons</td></tr><tr><td><code>--ck-secondary-button-color</code></td><td>Text color for secondary buttons</td></tr><tr><td><code>--ck-secondary-button-background</code></td><td>Background color for secondary buttons</td></tr><tr><td><code>--ck-secondary-button-box-shadow</code></td><td>Box shadow for secondary buttons</td></tr><tr><td><code>--ck-secondary-button-font-weight</code></td><td>Font weight for secondary button text</td></tr><tr><td><code>--ck-secondary-button-hover-background</code></td><td>Background color on hover</td></tr><tr><td><code>--ck-tertiary-button-background</code></td><td>Background color for tertiary buttons</td></tr></tbody></table>

**Modal & Body**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-modal-box-shadow</code></td><td>Box shadow for the modal container</td></tr><tr><td><code>--ck-overlay-background</code></td><td>Background color for the modal overlay</td></tr><tr><td><code>--ck-body-color</code></td><td>Primary text color for modal content</td></tr><tr><td><code>--ck-body-color-muted</code></td><td>Muted/secondary text color</td></tr><tr><td><code>--ck-body-color-muted-hover</code></td><td>Muted text color on hover</td></tr><tr><td><code>--ck-body-background</code></td><td>Primary background color for modal body</td></tr><tr><td><code>--ck-body-background-transparent</code></td><td>Transparent background variant</td></tr><tr><td><code>--ck-body-background-secondary</code></td><td>Secondary background color</td></tr><tr><td><code>--ck-body-background-secondary-hover-background</code></td><td>Secondary background on hover</td></tr><tr><td><code>--ck-body-background-secondary-hover-outline</code></td><td>Outline color on hover</td></tr><tr><td><code>--ck-body-background-tertiary</code></td><td>Tertiary background color</td></tr><tr><td><code>--ck-body-action-color</code></td><td>Color for actionable elements</td></tr><tr><td><code>--ck-body-divider</code></td><td>Color for divider lines</td></tr><tr><td><code>--ck-body-divider-secondary</code></td><td>Secondary divider color</td></tr><tr><td><code>--ck-body-color-danger</code></td><td>Color for error/danger states</td></tr><tr><td><code>--ck-body-color-valid</code></td><td>Color for success/valid states</td></tr><tr><td><code>--ck-siwe-border</code></td><td>Border color for Sign-In with Ethereum elements</td></tr></tbody></table>

**Disclaimer**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-body-disclaimer-background</code></td><td>Background color for disclaimer sections</td></tr><tr><td><code>--ck-body-disclaimer-box-shadow</code></td><td>Box shadow for disclaimer sections</td></tr><tr><td><code>--ck-body-disclaimer-color</code></td><td>Text color for disclaimers</td></tr><tr><td><code>--ck-body-disclaimer-link-color</code></td><td>Link color in disclaimers</td></tr><tr><td><code>--ck-body-disclaimer-link-hover-color</code></td><td>Link color on hover</td></tr></tbody></table>

**Tooltips**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-tooltip-background</code></td><td>Background color for tooltips</td></tr><tr><td><code>--ck-tooltip-background-secondary</code></td><td>Secondary background for tooltips</td></tr><tr><td><code>--ck-tooltip-color</code></td><td>Text color for tooltips</td></tr><tr><td><code>--ck-tooltip-shadow</code></td><td>Shadow for tooltip containers</td></tr></tbody></table>

**Network Dropdown**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-dropdown-button-color</code></td><td>Text color for dropdown buttons</td></tr><tr><td><code>--ck-dropdown-button-box-shadow</code></td><td>Box shadow for dropdown buttons</td></tr><tr><td><code>--ck-dropdown-button-background</code></td><td>Background color for dropdown buttons</td></tr><tr><td><code>--ck-dropdown-button-hover-color</code></td><td>Text color on hover</td></tr><tr><td><code>--ck-dropdown-button-hover-background</code></td><td>Background color on hover</td></tr></tbody></table>

**QR Code**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-qr-dot-color</code></td><td>Color of QR code dots</td></tr><tr><td><code>--ck-qr-border-color</code></td><td>Border color around QR code</td></tr></tbody></table>

**Miscellaneous**

<table><thead><tr><th width="350">Variable</th><th>Description</th></tr></thead><tbody><tr><td><code>--ck-focus-color</code></td><td>Color for focused elements</td></tr><tr><td><code>--ck-spinner-color</code></td><td>Color for loading spinners</td></tr><tr><td><code>--ck-copytoclipboard-stroke</code></td><td>Stroke color for copy-to-clipboard icons</td></tr></tbody></table>

***

**Complete Custom Theme Example**

```tsx
<PayKitProvider
  apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY!}
  customTheme={{
    // Primary Button
    "--ck-primary-button-background": "#CF276B",
    "--ck-primary-button-color": "#FFFFFF",
    "--ck-primary-button-border-radius": "8px",
    "--ck-primary-button-hover-background": "#A01F54",

    // Modal
    "--ck-modal-box-shadow": "0 10px 40px rgba(0, 0, 0, 0.2)",
    "--ck-body-background": "#FFFFFF",
    "--ck-body-color": "#1A1A1A",
    "--ck-body-background-secondary": "#F5F5F5",

    // Colors
    "--ck-body-color-danger": "#DC2626",
    "--ck-body-color-valid": "#10B981",
    "--ck-body-action-color": "#3B82F6",

    // Buttons
    "--ck-secondary-button-background": "#E5E7EB",
    "--ck-secondary-button-color": "#374151",

    // QR Code
    "--ck-qr-dot-color": "#1A1A1A",
    "--ck-qr-border-color": "#E5E7EB",
  }}
>
  {children}
</PayKitProvider>
```

{% hint style="info" %}
**Tip:** You can combine a predefined `theme` with `customTheme` to override specific variables while maintaining the base theme's styling.
{% endhint %}
