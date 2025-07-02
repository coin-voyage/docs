import type { Metadata } from "next"
import { Providers } from "../providers/providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Coin Voyage Next.js Example",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main className="space-y-4 mx-auto max-w-2xl p-8 lg:max-w-7xl">
            {props.children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
