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

# Changelog

All notable changes to CoinVoyage SDK, API, and Platform will be documented here.



***

## @coin-voyage/paykit \[2.0.0] - 2025-01-28

### Added

* **List Pay Orders endpoint**: New `GET /pay-orders` endpoint to retrieve all pay orders for your organization with pagination and status filtering.
* **Quote breakdown transparency**: Quotes now expose detailed fee breakdowns including `base`, `fee`, `gas`, and `total` amounts.
* **Multi-provider execution tracking**: Track execution status across multiple providers via `payment.execution` array.
* **ApiClient class instantiation**: ApiClient is now instantiated with `new ApiClient({...})` and supports new options `sessionId` and `version`.
* **Dedicated PayOrder methods**: New `createDepositPayOrder()` and `createSalePayOrder()` methods for clearer intent.

### Changed

* **API base URL**: Updated to `https://api.coinvoyage.io/v2/`.
* **Response structure**: Flat fields moved to nested `payment` and `fulfillment` objects for better organization.
* **BigInt handling**: `raw_amount` fields now return strings instead of numbers to prevent precision loss.
* **Authorization signature**: `generateAuthorizationSignature()` now uses HMAC-SHA256 and requires `method` and `path` parameters.
* **createSalePayOrder / createRefundPayOrder signature**: Now accepts `apiSecret` directly instead of a pre-generated signature.

### Removed

* **Process endpoint**: `/pay-orders/{payorder_id}/process` has been removed. Payment processing now happens automatically when funds are detected.

### Deprecated

* **Top-level response fields**: `source_currency`, `source_amount`, `destination_currency`, `destination_amount`, `deposit_address`, `receiving_address`, `refund_address`, and `expires_at` are deprecated. Use the corresponding fields in `payment` and `fulfillment` objects instead.

{% hint style="info" %}
See the [Migration Guide](migration-v1-to-v2.md) for detailed upgrade instructions.
{% endhint %}



***

## @coin-voyage/paykit \[0.1.25] - 2025-11-04

### Added

* **Phantom wallet (EVM)**: users can now also connect their EVM wallet via Phantom.



***

## @coin-voyage/paykit \[0.1.24] - 2025-10-29

### Added

* **German Localization**: display PayKit modal in German by specifying de-DE language.

### Changed

* **ApiClient API response**: all APIClient functions now return `APIResponse<T>` for a more uniform response.



***

## @coin-voyage/paykit \[0.1.23] - 2025-10-21

### Changed

* **WalletProvider props**: changed property names and nesting structure of the component.<br>

***

## @coin-voyage/paykit \[0.1.22] - 2025-10-17

### Added

* **Stable Testnet Network Support**: Added support for Stable Testnet. The upcoming chain of Tether.

***

## Versioning

CoinVoyage follows [Semantic Versioning](https://semver.org/):

* **MAJOR** version for incompatible API changes
* **MINOR** version for new functionality in a backward compatible manner
* **PATCH** version for backward compatible bug fixes

***

## Categories Explained

* **Added** - New features, endpoints, or capabilities
* **Changed** - Modifications to existing functionality
* **Deprecated** - Features that will be removed in future versions (but still work)
* **Removed** - Features that have been completely removed
* **Fixed** - Bug fixes and corrections
* **Security** - Vulnerability patches and security improvements
