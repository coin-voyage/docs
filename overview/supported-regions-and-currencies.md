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
  tags:
    visible: true
---

# Supported regions & currencies

### Supported Regions & Currencies

&#x20;

CoinVoyage settles crypto into the fiat currencies your customers actually use. We currently support off-ramps in four fiat currencies spanning North America, Europe, and Latin America, with new rails added on a rolling basis.

&#x20;

| Currency       | Symbol | Payment rail       | Settlement                                 |
| -------------- | ------ | ------------------ | ------------------------------------------ |
| US Dollar      | `USD`  | ACH, Wire          | ACH 1–3 business days · Wire same-day      |
| Euro           | `EUR`  | SEPA, SEPA Instant | 0–1 business day · Instant where available |
| Brazilian Real | `BRL`  | Pix                | Instant, 24/7                              |
| Mexican Peso   | `MXN`  | SPEI               | Minutes, 24/7                              |

&#x20;Currency details

### USD
**Rails:** ACH, Wire

* **Settlement.** ACH credits typically settle in 1–3 US business days. Wires settle the same day during banking hours.
* **Coverage.** All US states **except New York** for new customers. Businesses incorporated in New York but operating primarily out of another state may still qualify on a case by case basis  contact support.
* **Recipient info required.** Routing + account number (ACH) or full wire instructions, plus SSN (individuals) or EIN (businesses).

### EUR
**Rails:** SEPA, SEPA Instant

* **Settlement.** 0–1 business day across the SEPA zone. SEPA Instant is used automatically where the recipient bank supports it.
* **Coverage.** All 36 SEPA jurisdictions, including the EU, EEA (Iceland, Liechtenstein, Norway), Switzerland, Monaco, San Marino, Andorra, the United Kingdom, and Vatican City.
* **Recipient info required.** IBAN and BIC (where required by the bank).

> [!WARNING]
**MiCA notice for EEA residents.** Per the EU's Markets in Crypto-Assets regulation, USDT is not available to users resident in the EEA. Use **USDC** or **EURC** as the stablecoin leg for EEA off-ramps.

### BRL
**Rail:** Pix

* **Settlement.** Instant, 24/7 via Pix.
* **Coverage.** Brazil.
* **Recipient info required.** A valid Pix key — CPF, CNPJ, email, phone number, or random key, plus the matching CPF (individuals) or CNPJ (businesses) for KYC.

### MXN
**Rail:** SPEI

* **Settlement.** Typically a few minutes, SPEI runs 24/7 at most participating banks.
* **Coverage.** Mexico.
* **Recipient info required.** 18-digit CLABE; RFC and Mexican government-issued ID for individuals, or CSF (Constancia de Situación Fiscal) for businesses.

#### Country availability

CoinVoyage onboards individuals and businesses globally, with the exceptions listed below.

#### Not currently supported

We are unable to onboard customers resident or registered in:

Afghanistan, Belarus, Cuba, Democratic Republic of the Congo, Gaza Strip, Iran, Iraq, Lebanon, Libya, Myanmar, North Korea, Russian Federation, Somalia, South Sudan, Sudan, Syria, Ukrainian Territories (Crimea, Donetsk, Luhansk), Venezuela, West Bank, Yemen.

#### KYC & compliance

All off-ramp activity is subject to KYC and AML screening. Verification scales with transaction volume:

* Small flows can complete with a single hosted KYC link (ID + selfie).
* Larger flows or business accounts require additional documentation: proof of address, beneficial ownership disclosures, and source of funds attestation where applicable.

{/* TODO: The KYC API reference link below points to a broken GitBook page (/broken/pages/fbc5fe9ecfdcc7c09a250f159b3daea02ee40181). The correct destination could not be determined; restore the link once the target page is available. */}

> [!NOTE]
See the KYC API reference for the programmatic flow.

### On the roadmap

We're actively expanding rail coverage. Currencies in active integration:

* **GBP** — Faster Payments (United Kingdom)
* **COP** — Bre-B / domestic bank transfer (Colombia)
* Additional APAC currencies under evaluation&#x20;
