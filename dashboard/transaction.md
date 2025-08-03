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

# Transaction

### Transaction

The [**Transactions**](https://dashboard.coinvoyage.io/transactions) tab logs each crypto payment or settlement event processed via CoinVoyage.

<figure><img src="../.gitbook/assets/image (1).png" alt=""><figcaption></figcaption></figure>

* Use **search and filter** options to isolate specific transactions or orders.
* **Click any row** to view a full transaction detail page, including on-chain metadata, status, and associated hashes.
* The **top analytics summary** provides an overview of volume and activity trends.

Use this tab to monitor transaction flow, debug failed or pending payments, or confirm successful on-chain settlements.

#### Refunds

Refunds are initiated from the **Transaction Detail** view and executed as on-chain transactions tied to the original payment.&#x20;

<figure><img src="../.gitbook/assets/Screenshot 2025-08-03 144309.png" alt=""><figcaption></figcaption></figure>

* From a completed transaction, click **“Refund”** to launch the refund modal.
*   **Inputs Required**:

    * `refund_amount`: Supports partial or full refund in the settlement currency.
    * `refund_reason`: Required string for internal tracking.
    * `note`: Optional field for additional context.
    * `recipient_address`: Target wallet for refund.

    After clicking **Proceed**, the CoinVoyage widget will open, allowing you to select the currency for the refund and confirm the transaction.

<figure><img src="../.gitbook/assets/Screenshot 2025-08-03 144320 (2).png" alt=""><figcaption></figcaption></figure>

Once sent, refund status updates in real-time. All refund transactions are shown under the **“Refund Transactions”** section of the original payment.

{% hint style="info" %}
Note:

Refunds are executed **as a new on-chain transfer** and recorded as a linked child transaction under the original.


{% endhint %}
