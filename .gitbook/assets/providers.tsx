"use client"

import { PayKitProvider, WalletProvider } from "@coin-voyage/paykit"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React from "react"
import { SolanaProvider } from "./solana-provider"
import { SuiProvider } from "./sui-provider"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  if (!process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY) {
    throw new Error("NEXT_PUBLIC_COIN_VOYAGE_API_KEY is required")
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SuiProvider>
        <SolanaProvider>
          <WalletProvider>
            <PayKitProvider apiKey={process.env.NEXT_PUBLIC_COIN_VOYAGE_API_KEY}>
              {children}
            </PayKitProvider>
          </WalletProvider>
        </SolanaProvider>
      </SuiProvider>
    </QueryClientProvider>
  )
}
