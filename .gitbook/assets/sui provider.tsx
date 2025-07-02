'use client'

import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit"

export function SuiProvider({ children }: { children: React.ReactNode }) {
    return (
        <SuiClientProvider
            networks={{
                mainnet: { url: "https://fullnode.mainnet.sui.io:443" },
                devnet: { url: "https://fullnode.devnet.sui.io:443" },
            }}
            defaultNetwork={"mainnet"}
        >
            <WalletProvider storageKey="your-sui-provider" autoConnect={true}>{children}</WalletProvider>
        </SuiClientProvider>
    )
}