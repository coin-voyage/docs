# Setup your own environment

## Prerequisites

Before you begin, make sure you have:

* [Node.js](https://nodejs.org/) version 20 or higher
* Coinvoyage API Key&#x20;



### Step 1: Install required dependencies

```sh
npm install @coin-voyage/paykit @tanstack/react-query
```

### Step 2: Generate your API key from your CoinVoyage dashboard at&#x20;

#### [https://dashboard.coinvoyage.com](https://dashboard.coinvoyage.com)

### Step 3: Add your API key to the .env.local file

```
NEXT_PUBLIC_COIN_VOYAGE_API_KEY=pk_your_actual_api_key_here
```

### Add a secret key for SALE PayOrders

```
COIN_VOYAGE_SECRET_KEY=...
```

### Step 4: Create a DepositButton component in app/components/DepositButton.tsx with the PayKit integration

```typescript
//typescript
"use client";

import { PayButton, PayKitProvider, WalletProvider } from "@coin-voyage/paykit";
import { ChainId } from "@coin-voyage/paykit/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

export default function DepositButton() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  useEffect(() => {
    const envApiKey = process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY;
    setApiKey(envApiKey || "");
  }, []);

  if (!apiKey) {
    return <div>Loading payment system...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <PayKitProvider apiKey={apiKey}>
          <PayButton
            intent="Deposit to SUI"
            toChain={ChainId.SUI}
            toAddress="0xYourWalletAddress" // Replace with your SUI wallet address
            toAmount={10}
            style={{ width: "100%", borderRadius: "0.375rem" }}
            onPaymentStarted={(event) => {
              console.log("Payment is being processed");
            }}
            onPaymentCompleted={(event) => {
              console.log("Payment Completed");
            }}
          />
        </PayKitProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
}

```

### Step 5: Import and use the DepositButton component in your main page (app/page.tsx)

<pre class="language-typescript"><code class="lang-typescript"><strong>//typescript
</strong>import DepositButton from "./components/DepositButton";

export default function Home() {
  return (
    &#x3C;main>
      &#x3C;h1>CoinVoyage Payment Demo&#x3C;/h1>
      &#x3C;DepositButton />
    &#x3C;/main>
  );
}

</code></pre>

### Step 6: Replace "0xYourWalletAddress" with your actual SUI wallet address in the DepositButton component

Restart your development server completely

<pre class="language-bash"><code class="lang-bash"><strong>bash
</strong>npm run dev

</code></pre>

