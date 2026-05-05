---
title: "CoinVoyage changelog: SDK, API, and platform updates"
description: Release notes for @coin-voyage/paykit, the CoinVoyage API, and platform changes, listed by version with new features, fixes, and breaking changes.
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

# Changelog

All notable changes to CoinVoyage SDK, API, and platform behavior are documented here.

> [!NOTE]
Entries below are ordered by release date, newest first. `2.0.0` marks the v2 migration release.

***

## @coin-voyage/paykit [2.4.1] - 2026-04-08

### Added

* **Partial payment terminal state**: Added `PARTIAL_PAYMENT` to represent PayOrders that receive an insufficient amount and end in a terminal partial-payment state.
* **Partial payment event type**: Added `PayOrderPartialPaymentEvent` so you can handle partial-payment outcomes explicitly in your event flows.

***

## @coin-voyage/paykit [2.4.0] - 2026-04-04

### Added

* **Stripe onramp integration**: Added full Stripe fiat-to-crypto onramp support, including geo-blocking.
* **Payment steps model**: Added `PaymentSteps` to track granular payment progress such as onramp, swap, and delivery.
* **Payment methods endpoint**: Added `GET /pay-orders/:payorder_id/payment-methods` to fetch available payment methods for a PayOrder.
* **Organization settings in PayOrder responses**: Added an `Organization.settings` JSON field and now return `settings` in `GET /pay-orders` and `GET /pay-orders/:payorder_id` responses.
* **Hosted pay page URL**: Added `hosted_url` to `GET /pay-orders` and `GET /pay-orders/:payorder_id` responses.

### Changed

* **Webhook payload coverage**: `payorder_error` and `payorder_refunded` events now include the full `payment_data` object.
* **PayKit payment handling**: Updated the widget to consume `payment_data.steps`, support organization settings, and expose location-aware payment method options.
* **SDK request and response models**: Added `metadata` support to `ClaimFeesRequest` and `SwapQuoteRequest`, updated order event types and `ClaimFeeResponse`, and expanded `ApiClient` to accept `Opts`.
* **EVM prefunding flow**: Improved prefunding across CCTP, Direct, Relay, and Uniswap providers with better gas estimation, prefund calculation, and error handling.

### Fixed

* **Webhook subscription filtering**: Fixed webhook deliveries so they respect each subscriber's registered event types.
* **Payment state persistence**: Improved orchestrator handling of `payment_data` so the correct exchange state is always persisted.
* **Refund PayOrder client flow**: Fixed `createRefundPayOrder` handling in `ApiClient`.
* **WalletConnect desktop routing**: Fixed desktop WalletConnect flows to route through the QR flow correctly.

### Removed

* **Deprecated PayOrder response fields**: Removed the deprecated `RequestData` / `request` field from `PayOrderResponse`.
* **Legacy transaction hash aliases**: Removed `SourceTransactionHash` and `DestinationTransactionHash` alias fields.

***

## @coin-voyage/paykit [2.0.0] - 2026-01-28

### Added

* **List Pay Orders endpoint**: Added `GET /pay-orders` to retrieve all pay orders for your organization with pagination and status filtering.
* **Quote breakdown transparency**: Quotes now expose detailed fee breakdowns including `base`, `fees`, `gas`, and `total`.
* **Multi-provider execution tracking**: Added `payment.execution` to track execution status across multiple providers.
* **ApiClient constructor options**: Added `sessionId` and `version`.
* **Dedicated PayOrder helpers**: Added `createDepositPayOrder()` and `createSalePayOrder()` for clearer intent.

### Changed

* **API base URL**: Updated to `https://api.coinvoyage.io/v2/`.
* **Response structure**: Flat fields moved into nested `payment` and `fulfillment` objects.
* **BigInt handling**: `raw_amount` fields now return strings instead of numbers to prevent precision loss.
* **Authorization signature**: `generateAuthorizationSignature()` now uses HMAC-SHA256 and requires `method` and `path`.
* **Sale and refund authorization**: `createSalePayOrder()` and `createRefundPayOrder()` now accept `apiSecret` directly instead of a pre-generated signature.
* **Webhook event naming**: Webhook subscriptions use uppercase `ORDER_*` identifiers, while delivered payloads use lowercase `payorder_*` values in the `type` field.

### Removed

* **Process endpoint**: `/pay-orders/:payorder_id/process` was removed. Payment processing now happens automatically when funds are detected.

### Deprecated

* **Top-level response fields**: `source_currency`, `source_amount`, `destination_currency`, `destination_amount`, `deposit_address`, `receiving_address`, `refund_address`, and `expires_at` are deprecated. Use the corresponding nested fields in `payment` and `fulfillment` instead.

> [!NOTE]
See the [Migration Guide](migration-guide-v1-to-v2.md) for detailed upgrade instructions.

***

## @coin-voyage/paykit [0.1.25] - 2025-11-04

### Added

* **Phantom wallet (EVM)**: Users can now connect an EVM wallet through Phantom.

***

## @coin-voyage/paykit [0.1.24] - 2025-10-29

### Added

* **German localization**: Display the PayKit modal in German by specifying the `de-DE` language.

### Changed

* **ApiClient responses**: All ApiClient methods now return `APIResponse&lt;T&gt;` for a more consistent response shape.

***

## @coin-voyage/paykit [0.1.23] - 2025-10-21

### Changed

* **WalletProvider props**: Updated property names and nesting structure.

***

## @coin-voyage/paykit [0.1.22] - 2025-10-17

### Added

* **Stable Testnet network support**: Added support for Stable Testnet.

***

## Versioning

CoinVoyage follows [Semantic Versioning](https://semver.org/):

* **MAJOR** - Incompatible API changes
* **MINOR** - Backward-compatible functionality
* **PATCH** - Backward-compatible bug fixes

***

## Categories Explained

* **Added** - New features, endpoints, or capabilities
* **Changed** - Modifications to existing functionality
* **Deprecated** - Features that still work but will be removed in a future version
* **Removed** - Features that have been fully removed
* **Fixed** - Bug fixes and corrections
* **Security** - Vulnerability patches and security improvements
