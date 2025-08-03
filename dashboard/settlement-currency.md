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

# Settlement Currency

### Settlement Currency

The [Settlement](https://dashboard.coinvoyage.io/settlement) tab lets you define which **currency your payouts will be settled in**, regardless of the crypto asset the user pays with.&#x20;

<figure><img src="../.gitbook/assets/image (4).png" alt=""><figcaption></figcaption></figure>

When a payment is received in any supported cryptocurrency (e.g., BTC, ETH, SOL), CoinVoyage performs an automatic conversion and settlement to the configured asset and chain (e.g., USDT on Tron, ETH on Arbitrum).

Merchants can configure **multiple settlement currencies across different chains**. CoinVoyage optimizes settlement routing by selecting the path with the **best quote** (maximized output, minimized gas fees).&#x20;

All settlements are non-custodial and executed on-chain.
