"use client"

import { PayButton } from "@coin-voyage/paykit"
import { ChainId } from "@coin-voyage/paykit/server"
import { useState } from "react"
import { Solana } from "./icons"

export default function DepositFunds() {
  const [amount, setAmount] = useState("")
  const [account, setAccount] = useState("")

  return (
    <div className="bg-gray-50">
      <div className="p-8 max-w-sm flex flex-col gap-4">
        <div className="flex flex-col space-y-1.5">
          <h2 className="text-lg font-medium text-gray-900">Deposit Funds</h2>
          <div className="text-sm text-gray-500">Make a deposit into your solana account.</div>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm/6 font-medium text-gray-700">Amount</label>
          <div className="relative mt-2">
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Solana height={20} width={20} />
            </div>
            <input
              id="amount"
              name="amount"
              type="number"
              min={0}
              className="block w-full rounded-md bg-white pr-6 pl-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              placeholder="0.00"
              value={amount}
              onChange={(e) => {
                const rawValue = e.target.value.trim()

                // Prevent entering invalid characters
                if (rawValue === "" || isNaN(Number(rawValue))) {
                  setAmount("");
                  return;
                }

                setAmount(parseFloat(rawValue).toString());
              }}
            />
          </div>
        </div>

        <div>
          <label htmlFor="account" className="block text-sm/6 font-medium text-gray-700">Solana Account</label>
          <input
            id="account"
            name="account"
            className="block w-full rounded-md bg-white mt-2 px-3 py-2 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            value={account}
            onChange={(e) => {
              setAccount(e.target.value)
            }}
          />
        </div>

        <PayButton
          intent="Deposit"
          toAddress={account}
          toAmount={amount}
          toChain={ChainId.SOL}
          disabled={!amount || !account}

          mode="dark"
          // style={{
          //   width: "100%",
          //   borderRadius: "0.375rem",
          // }}

          onPaymentCreationError={(event) => {
            console.error(event.errorMessage)
          }}
          onPaymentBounced={(event) => {
            console.error("Payment Bounced")
          }}
          onPaymentStarted={(event) => {
            console.log("Payment Pending", {
              description: "Your payment is being processed.",
            })
          }}
          onPaymentCompleted={(event) => {
            console.log("Payment Completed", {
              description: "Your payment was successful.",
            })
          }}
        />
      </div>
    </div>
  )
}

