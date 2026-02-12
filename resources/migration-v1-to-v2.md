---
description: Migrate from v1 to v2
layout:
  width: default
  title:
    visible: true
  description:
    visible: true
  tableOfContents:
    visible: true
  outline:
    visible: true
  pagination:
    visible: true
  metadata:
    visible: false
---

# Migrate from v1 to v2

This guide covers the breaking changes and new features when upgrading from CoinVoyage API v1 to v2.

If you're using the CoinVoyage Paykit SDK, update to the latest version which handles V2 automatically.

{% tabs %}
{% tab title="npm" %}

```sh
npm i @coin-voyage/paykit@2 @tanstack/react-query@^5.90.6
```

{% endtab %}

{% tab title="pnpm" %}

```sh
pnpm add @coin-voyage/paykit@2 @tanstack/react-query@^5.90.6
```

{% endtab %}

{% tab title="yarn" %}

```sh
yarn add @coin-voyage/paykit@2 @tanstack/react-query@^5.90.6
```

{% endtab %}

{% tab title="bun" %}

```sh
bun add @coin-voyage/paykit@2 @tanstack/react-query@^5.90.6
```

{% endtab %}
{% endtabs %}

---

## Overview of Changes

| Description                | V1                           | V2                                       |
| -------------------------- | ---------------------------- | ---------------------------------------- |
| Base URL                   | `https://api.coinvoyage.io/` | `https://api.coinvoyage.io/v2/`          |
| List Orders Endpoint       | -                            | `GET /pay-orders`                        |
| Process Endpoint           | Available (deprecated)       | Removed                                  |
| Response Structure changes | Flat fields                  | Nested `payment` & `fulfillment` objects |
| Event Types                | `order_*` events             | `payorder_*` events with `PaymentData`   |

---

## Changes

### 1. Removed Endpoint: `/pay-orders/{payorder_id}/process`

The deprecated `process` endpoint has been removed in V2. Payment processing now happens automatically when funds are detected in the deposit address.

---

### 2. Response Structure Changes

#### PayOrderResponse

Many top-level fields have been moved into nested objects. The old fields are still present for backwards compatibility but **deprecated**.

**V1 Response (flat structure):**

```json
{
  "id": "cm5h7ubkp0000v450cwvq6kc7",
  "mode": "DEPOSIT",
  "status": "PENDING",
  "source_currency": { ... },
  "source_amount": { ... },
  "destination_currency": { ... },
  "destination_amount": { ... },
  "deposit_address": "0x...",
  "receiving_address": "0x...",
  "refund_address": "0x..."
}
```

**V2 Response (nested structure):**

```json
{
  "id": "cm5h7ubkp0000v450cwvq6kc7",
  "created_at": "2025-01-15T10:30:00Z",
  "updated_at": "2025-01-15T10:35:00Z",
  "organization_id": "org_123",
  "mode": "DEPOSIT",
  "status": "PENDING",
  "payment": {
    "src": {
      "total": { "ui_amount": 0.1, "raw_amount": "100000000000000000", "value_usd": 250 },
      "base": { ... },
      "fees": { ... },
      "gas": { ... }
    },
    "dst": { ... },
    "deposit_address": "0x...",
    "receiving_address": "0x...",
    "refund_address": "0x...",
    "expires_at": "2025-01-15T11:00:00Z"
  },
  "fulfillment": {
    "asset": { ... },
    "fiat": "USD",
    "amount": { ... },
    "rate_usd": "1.0",
    "receiving_address": "0x..."
   }
}
```

#### Migration Path

| V1 Field               | V2 Field                              |
| ---------------------- | ------------------------------------- |
| `source_currency`      | `payment.src` (with currency details) |
| `source_amount`        | `payment.src.total`                   |
| `destination_currency` | `payment.dst` (with currency details) |
| `destination_amount`   | `payment.dst.currency_amount`         |
| `deposit_address`      | `payment.deposit_address`             |
| `receiving_address`    | `payment.receiving_address`           |
| `refund_address`       | `payment.refund_address`              |
| `expires_at`           | `payment.expires_at`                  |

---

### 3. Amount Fields Use String for BigInt

To prevent precision loss with large numbers, raw amounts are now returned as strings.

**V1:**

```json
{
  "raw_amount": 100000000000000000
}
```

**V2:**

```json
{
  "raw_amount": "100000000000000000"
}
```

Update your code to parse `raw_amount` as a string/BigInt instead of a number.

---

### 4. Quote Response Changes

The quote endpoint now returns more detailed fee breakdowns.

**V1 Quote Response:**

```json
{
  "currency_amount": {
    "ui_amount": 0.1,
    "raw_amount": 100000000000000000,
    "value_usd": 250
  }
}
```

**V2 Quote Response:**

```json
{
  "total": {
    "ui_amount": 0.105,
    "raw_amount": "105000000000000000",
    "value_usd": 262.5
  },
  "base": {
    "ui_amount": 0.1,
    "raw_amount": "100000000000000000",
    "value_usd": 250
  },
  "fees": {
    "custom_fee": {
      "raw_amount": "1000000",
      "ui_amount": 1.0,
      "ui_amount_display": "1.0",
      "value_usd": 13.45
    },
    "protocol_fee": {
      "raw_amount": "2000000",
      "ui_amount": 2.0,
      "ui_amount_display": "2.0",
      "value_usd": 26.90
    },
    "total_fee": {
      "raw_amount": "3000000",
      "ui_amount": 3.0,
      "ui_amount_display": "3.0",
      "value_usd": 39.35
    }
  },
  "gas": {
    "ui_amount": 0.002,
    "raw_amount": "2000000000000000",
    "value_usd": 5
  }
}
```

---

### 5. Event Types Updated

Event types have been restructured in V2. All events now include `metadata`, and most events include a `payment_data` field with the full nested payment structure.

**V2 Event Types:**

| Event Type                  | Key Fields                                    |
| --------------------------- | --------------------------------------------- |
| `payorder_created`          | `payorder_id`, `metadata?`                    |
| `payorder_started`          | `payorder_id`, `metadata?`, `payment_data`    |
| `payorder_confirming`       | `payorder_id`, `metadata?`, `payment_data`    |
| `payorder_executing`        | `payorder_id`, `metadata?`, `payment_data`    |
| `payorder_completed`        | `payorder_id`, `metadata?`, `payment_data`    |
| `payorder_error`            | `payorder_id`, `metadata?`, `message`, `status` |
| `payorder_refunded`         | `payorder_id`, `metadata?`, `refund_tx_hash`, `refund_address` |

**`PaymentData` structure** (included in `started`, `confirming`, `executing`, and `completed` events):

```json
{
  "src": { "total": { ... }, "base": { ... }, "fees": { ... }, "gas": { ... } },
  "dst": { "currency": { ... }, "currency_amount": { ... } },
  "deposit_address": "0x...",
  "receiving_address": "0x...",
  "refund_address": "0x...",
  "source_tx_hash": "0x...",
  "destination_tx_hash": "0x...",
  "refund_tx_hash": "0x...",
  "execution": [ { "provider": "...", "status": "...", ... } ],
  "expires_at": "2025-01-15T11:00:00Z"
}
```

**Update your event listeners** to use the new event type names and handle the updated payload structure.

---

## New Features in V2

### 1. List Pay Orders

New endpoint to retrieve all pay orders for your organization.

```http
GET /v2/pay-orders
```

**Query Parameters:**

- `limit` - Number of results (default: 20)
- `offset` - Pagination offset
- `status` - Filter by status

**Response:**

```json
{
  "data": [
    { "id": "...", "status": "COMPLETED", ... },
    { "id": "...", "status": "PENDING", ... }
  ],
  "total": 150,
  "limit": 20,
  "offset": 0
}
```

---

### 2. Quote Breakdown Transparency

V2 exposes quote breakdown information directly in responses:

- `payment.src.base` - Base quote in source currency
- `payment.src.fee` - Breakdown of fees in source currency
- `payment.src.gas` - Gas costs for the transaction
- `payment.src.total` - Sum of above

---

---

### 3. Multi-Provider Execution Tracking

V2 supports tracking execution across multiple providers:

```json
{
  "payment": {
    "execution": [
      {
        "provider": "provider_a",
        "status": "COMPLETED",
        "gas_fee": { ... },
        "price_impact": 0.001
      }
    ]
  }
}
```

---

## Deprecated Fields

The following fields are deprecated in V2 and will be removed in a future version. Migrate to the new field locations:

| Deprecated Field           | Use Instead                   |
| -------------------------- | ----------------------------- |
| `source_currency`          | `payment.src`                 |
| `source_amount`            | `payment.src.total`           |
| `destination_currency`     | `payment.dst`                 |
| `destination_amount`       | `payment.dst.currency_amount` |
| `deposit_address` (root)   | `payment.deposit_address`     |
| `receiving_address` (root) | `payment.receiving_address`   |
| `refund_address` (root)    | `payment.refund_address`      |
| `expires_at` (root)        | `payment.expires_at`          |

---

## Need Help?

- Check the [API Reference](api-reference.md) for complete V2 documentation
- Contact [Support](support.md) for migration assistance
- Review [FAQs](faqs.md) for common questions
