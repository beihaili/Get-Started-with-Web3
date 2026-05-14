# Stablecoins: Models, Risks, Regulation, and Payments

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Stablecoins are the base currency of DeFi and one of the most important bridges between crypto and the real economy. This lesson explains fiat-backed, crypto-backed, algorithmic, and synthetic stablecoins, then covers UST/LUNA, USDC depeg risk, regulation, RWA reserves, and stablecoin payments.

## Table of Contents

- [Why Stablecoins Exist](#why-stablecoins-exist)
- [Three Stablecoin Models](#three-stablecoin-models)
- [Fiat-Backed Stablecoins: USDT and USDC](#fiat-backed-stablecoins-usdt-and-usdc)
- [Crypto-Backed Stablecoins: DAI and USDS](#crypto-backed-stablecoins-dai-and-usds)
- [Algorithmic Stablecoins](#algorithmic-stablecoins)
- [UST/LUNA: The Stablecoin Collapse That Changed DeFi](#ustluna-the-stablecoin-collapse-that-changed-defi)
- [2026 Update: Regulation, RWA, and On-Chain Payments](#2026-update-regulation-rwa-and-on-chain-payments)
- [How to Choose and Use Stablecoins](#how-to-choose-and-use-stablecoins)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## Why Stablecoins Exist

Bitcoin and ETH are powerful assets, but their prices can move 10% or more in a short period. That makes them difficult to use as a daily unit of account.

Stablecoins solve a practical problem:

```text
Create a blockchain-native asset that usually tracks a stable value, most commonly 1 USD.
```

Core uses:

1. Trading quote currency.
2. DeFi lending and borrowing asset.
3. Cross-border transfer rail.
4. Store of value during market volatility.
5. Payment and settlement unit.
6. Yield-bearing base asset in money markets.
7. Balance unit for wallets, bots, and AI agents.

Stablecoins started as exchange settlement tools. They are now becoming tokenized dollar infrastructure.

Market data changes quickly, so use real-time dashboards such as [DefiLlama Stablecoins](https://defillama.com/stablecoins) for current supply and chain distribution.

## Three Stablecoin Models

```text
Stablecoin models:

1. Fiat-backed
   Examples: USDT, USDC, PYUSD
   Backing: cash, bank deposits, Treasury bills, repos
   Main risk: issuer, reserve, bank, and regulatory risk

2. Crypto-backed
   Examples: DAI, USDS, LUSD
   Backing: on-chain collateral and sometimes RWA or centralized stablecoins
   Main risk: collateral volatility, liquidation, governance, oracle risk

3. Algorithmic or synthetic
   Examples: historical UST, FRAX variants, USDe-style synthetic dollars
   Backing: varies by design
   Main risk: reflexivity, hedging, liquidity, and mechanism failure
```

No model is risk-free. The right question is not "Which stablecoin is safe?" but:

```text
Safe against what?
For how long?
On which chain?
With what redemption path?
Under which legal regime?
```

## Fiat-Backed Stablecoins: USDT and USDC

### Basic Mechanism

Fiat-backed stablecoins are conceptually simple:

```text
Mint:
User sends $1 to issuer -> issuer mints 1 stablecoin

Redeem:
User returns 1 stablecoin -> issuer sends back $1
```

The peg is supported by arbitrage:

- If the stablecoin trades above $1, institutions can mint and sell it.
- If it trades below $1, institutions can buy and redeem it.

Retail users often cannot redeem directly, so actual peg strength depends on market liquidity, redemption access, issuer credibility, and banking rails.

### USDT

USDT, issued by Tether, is the largest and most widely used stablecoin across exchanges and many chains.

Strengths:

- Deep liquidity.
- Broad exchange support.
- Strong presence across many networks.
- Widely used in trading and emerging-market crypto flows.

Risks and debates:

- Reserve transparency has historically been questioned.
- Issuer and jurisdiction risk matter.
- The issuer can freeze addresses.
- Users rely on Tether's redemption and banking relationships.

### USDC

USDC, issued by Circle, is positioned as a more regulated and transparent dollar stablecoin.

Strengths:

- Strong compliance posture.
- Public reserve reporting.
- Common in DeFi, payments, and institutional flows.
- Deep integration with many wallets and applications.

Risk example:

In March 2023, Silicon Valley Bank failed while Circle held part of USDC reserves there. USDC briefly depegged before recovering after deposit protections were announced. The lesson was clear:

```text
Fiat-backed stablecoin risk ultimately includes banking risk.
```

### Core Tradeoff

| Benefit | Cost |
|---------|------|
| Simple peg design | Requires trust in issuer and banks |
| Strong liquidity | Addresses can be frozen |
| Easy integration with payments | Regulatory restrictions can affect access |
| Usually tight peg | Reserve composition and redemption matter |

Fiat-backed stablecoins are often the most useful, but they are not censorship-resistant bearer cash.

## Crypto-Backed Stablecoins: DAI and USDS

DAI was one of DeFi's most important decentralized stablecoins. It was created by MakerDAO and later became part of the Sky ecosystem, where USDS and SKY introduced a new brand and asset structure.

### Maker/Sky Vault Model

Simplified DAI minting flow:

```text
1. User deposits collateral, such as ETH, into a vault.
2. The protocol allows minting DAI up to a collateral ratio.
3. User can use DAI elsewhere.
4. To withdraw collateral, user repays DAI plus fees.
```

Example:

```text
Deposit ETH worth $3,000
Minimum collateral ratio: 150%
Maximum DAI mint: 2,000 DAI
Conservative user may mint only 1,000 to 1,500 DAI
```

### Peg Mechanisms

When DAI trades above $1:

- Borrowers can mint DAI and sell it.
- Supply rises.
- Price tends to fall.

When DAI trades below $1:

- Borrowers can buy cheaper DAI to repay debt.
- Demand rises.
- Price tends to recover.

Maker also uses tools such as:

- Stability fees.
- DAI Savings Rate.
- Peg Stability Module.
- Collateral onboarding.
- Governance-controlled risk parameters.

### PSM and the Decentralization Tradeoff

The Peg Stability Module lets users swap certain centralized stablecoins such as USDC into DAI at near 1:1.

Benefit:

- Stronger peg stability.
- Better liquidity.

Tradeoff:

- More exposure to centralized stablecoins.
- More regulatory and issuer dependency.

This makes the decentralization question more nuanced. Instead of asking whether DAI or USDS is "decentralized," ask:

- What backs it?
- How much backing is on-chain crypto vs RWA vs centralized stablecoins?
- Who controls risk parameters?
- Can collateral be frozen?
- What happens during extreme liquidations?

## Algorithmic Stablecoins

Algorithmic stablecoins try to maintain a peg through supply changes and incentives rather than full external collateral.

Basic idea:

```text
If price > $1:
increase supply -> push price down

If price < $1:
reduce supply -> push price up
```

The hard part is reducing supply during panic. If people no longer trust the system, incentives may stop working.

### Mint/Burn Reflexivity

Historical Terra UST used a mint/burn relationship with LUNA:

```text
Mint UST:
burn $1 worth of LUNA -> receive 1 UST

Redeem UST:
burn 1 UST -> receive $1 worth of LUNA
```

When confidence is high, the system can appear stable. When confidence breaks:

```text
UST depegs -> more LUNA minted for redemptions -> LUNA price falls -> more LUNA needed -> confidence collapses
```

That is a death spiral.

### Partial Collateral Designs

Some systems use partial collateral plus algorithmic controls. FRAX is the best-known example historically, though designs have changed over time as the market learned from UST.

Partial collateral improves resilience, but it still requires careful analysis:

- What is the collateral?
- Is it liquid in stress?
- Who controls parameters?
- What happens if confidence drops quickly?

## UST/LUNA: The Stablecoin Collapse That Changed DeFi

In May 2022, Terra's UST collapsed from a top stablecoin to near zero, destroying tens of billions of dollars in market value and triggering broader contagion.

Before the collapse:

- UST had a large supply.
- Anchor Protocol offered very high UST deposit yields.
- LUNA market capitalization supported redemption confidence.
- Many users treated UST as if it were equivalent to dollars.

Simplified timeline:

```text
1. Large UST withdrawals from Anchor.
2. UST selling pressure hits Curve and other markets.
3. UST trades below $1.
4. Arbitrage minting creates large amounts of LUNA.
5. LUNA price falls.
6. More LUNA must be minted to redeem the same UST value.
7. Confidence breaks.
8. UST and LUNA collapse together.
```

Main lessons:

1. High yield is not the same as safe yield.
2. Reflexive collateral can fail exactly when it is needed most.
3. Market capitalization is not a reserve.
4. Liquidity can vanish during panic.
5. Stablecoin risk can spread through lenders, funds, exchanges, and DeFi protocols.

UST is the reason many serious DeFi users now distinguish between:

- Fully reserved stablecoins.
- Overcollateralized stablecoins.
- Algorithmic stablecoins.
- Synthetic dollars.
- Yield-bearing dollar products.

## 2026 Update: Regulation, RWA, and On-Chain Payments

From 2024 to 2026, stablecoins moved from "crypto trading tools" toward regulated payment and settlement infrastructure.

### United States: GENIUS Act

The United States enacted the GENIUS Act on July 18, 2025, creating a federal framework for payment stablecoins. For learners, the important direction is:

- Issuers face clearer expectations around reserves, redemption, auditability, and supervision.
- Banks, payment companies, and fintech firms have stronger incentives to enter stablecoins.
- Dollar stablecoins are being treated as payment infrastructure, not only exchange liquidity.
- Compliance features such as freezes, sanctions controls, and identity requirements will remain important debates.

This improves clarity for regulated stablecoins, but it does not remove the tension between stability, compliance, privacy, and censorship resistance.

### European Union: MiCA

The EU Markets in Crypto-Assets Regulation, known as MiCA, applied rules for asset-referenced tokens and e-money tokens from June 30, 2024. Broader crypto-asset service provider rules applied from December 30, 2024.

Stablecoin impact:

- Issuers need authorization, governance, reserves, and disclosures.
- Exchanges may restrict stablecoins that do not meet regional requirements.
- Euro stablecoins and compliant dollar stablecoins have a clearer path.
- Global stablecoins face more regulatory scrutiny.

This is why users in different countries may see different stablecoin listings and services.

### RWA Reserves

Stablecoin reserves increasingly involve cash, short-term Treasury bills, repurchase agreements, tokenized money market funds, and other real-world assets.

RWA affects stablecoins in two ways:

1. Reserve income can become a major issuer revenue source.
2. Tokenized Treasuries and money funds can become DeFi collateral or yield assets.

RWA is not risk-free. It introduces:

- Custody risk.
- Legal enforcement risk.
- Banking risk.
- Audit risk.
- Liquidity risk.
- Jurisdiction risk.

### USDe and Synthetic Dollars

Ethena's USDe is often described as a synthetic dollar. It is not a simple 1:1 bank-reserve stablecoin and not a traditional overcollateralized stablecoin.

Its model generally relies on:

- Spot crypto collateral.
- Short derivatives positions.
- Custody and exchange infrastructure.
- Funding-rate-driven yield.

Questions to ask:

- Does the hedge remain effective in stress?
- What happens when funding turns negative?
- Which exchanges and custodians are involved?
- Can the product maintain liquidity during extreme volatility?

Do not treat a yield-bearing synthetic dollar as a bank deposit.

### Stablecoin Payments

Stablecoins are increasingly used for:

- Cross-border remittances.
- Freelance and contractor payments.
- Global business settlement.
- On-chain payroll.
- DeFi collateral and quote currency.
- Subscription and machine payments.
- Agent and bot wallet balances.

The payment question is not whether the token price goes up. It is:

- Can it transfer cheaply?
- Can it redeem reliably?
- Is there sufficient liquidity on the chosen chain?
- Are counterparties willing to accept it?
- Can it operate under the relevant compliance regime?

## How to Choose and Use Stablecoins

### Selection Framework

| Use case | Common choices | Main concern |
|----------|----------------|--------------|
| Trading | USDT, USDC | Liquidity and exchange support |
| DeFi deposits | USDC, DAI, USDS | Protocol and collateral risk |
| Decentralization preference | DAI, LUSD-style designs | Collateral mix and governance |
| Payment | USDC, USDT, PYUSD depending on region | Redemption and compliance |
| Large balances | Diversified basket | Issuer and chain concentration |
| Yield products | sUSDS, USDe-like products, lending deposits | Source of yield and tail risk |

### Safety Practices

- Do not hold all stablecoin exposure in one issuer or one chain.
- Check reserve reports and redemption terms.
- Understand freeze and blacklist capabilities.
- Be skeptical of high stablecoin yields.
- Avoid obscure bridged versions unless you understand the bridge.
- Use small test transfers when moving across chains.
- Separate long-term holdings from active DeFi wallets.
- Track depeg history, liquidity depth, and protocol dependencies.

## Summary

Key takeaways:

1. Stablecoins are the base currency of DeFi and on-chain payments.
2. Fiat-backed stablecoins are liquid and simple, but centralized.
3. Crypto-backed stablecoins are more transparent on-chain, but face collateral, liquidation, and governance risks.
4. Algorithmic stablecoins can fail through reflexive death spirals.
5. UST/LUNA proved that high yield and large market cap do not guarantee safety.
6. Regulation through frameworks such as the GENIUS Act and MiCA is making stablecoins more like financial infrastructure.
7. RWA and synthetic-dollar designs add new yield sources and new risks.

## Further Reading

- [DefiLlama Stablecoins](https://defillama.com/stablecoins)
- [U.S. Treasury statement on enactment of the GENIUS Act](https://home.treasury.gov/news/press-releases/sb0197)
- [U.S. Treasury proposed rule implementing GENIUS Act illicit finance requirements](https://home.treasury.gov/news/press-releases/sb0435)
- [EUR-Lex MiCA summary](https://eur-lex.europa.eu/EN/legal-content/summary/european-crypto-assets-regulation-mica.html)
- [Regulation (EU) 2023/1114 - MiCA](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32023R1114)
- [Circle Transparency](https://www.circle.com/en/transparency)
- [Tether Transparency](https://tether.to/en/transparency/)
- [Nansen - UST depeg analysis](https://www.nansen.ai/research/on-chain-forensics-demystifying-terrausd-de-peg)

