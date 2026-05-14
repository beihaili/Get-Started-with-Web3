# DeFi Core Concepts and Architecture

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> DeFi replaces financial intermediaries with smart contracts. This lesson explains what DeFi is, how it differs from traditional finance, why composability matters, how TVL should be interpreted, and how the DeFi stack is organized.

## Table of Contents

- [What DeFi Is](#what-defi-is)
- [Traditional Finance vs DeFi](#traditional-finance-vs-defi)
- [Smart Contracts as Financial Protocols](#smart-contracts-as-financial-protocols)
- [Composability: Money Legos](#composability-money-legos)
- [TVL: A Useful but Limited Metric](#tvl-a-useful-but-limited-metric)
- [Core Advantages of DeFi](#core-advantages-of-defi)
- [The DeFi Technology Stack](#the-defi-technology-stack)
- [A Short History of DeFi](#a-short-history-of-defi)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## What DeFi Is

DeFi means **Decentralized Finance**. It is a collection of financial services built on public blockchains and executed by smart contracts.

Traditional finance depends on institutions:

- Banks hold deposits and issue loans.
- Brokers route orders.
- Exchanges match buyers and sellers.
- Clearing houses settle trades.
- Custodians hold assets.

DeFi moves many of these rules into code. Instead of asking a bank to approve a loan or an exchange to match your order, you interact with a smart contract that applies the same rules to everyone.

A simple analogy:

```text
Traditional finance: a bank branch with staff, business hours, and approval processes.
DeFi: a vending machine that runs 24/7 and follows public rules written in code.
```

This does not mean DeFi is automatically safer. It changes the trust model. You trust smart contract code, oracle data, governance, bridges, wallet security, and market liquidity instead of a single financial institution.

## Traditional Finance vs DeFi

| Dimension | Traditional finance | DeFi |
|-----------|---------------------|------|
| Access | Bank account, identity checks, geography, credit score | Wallet address and network access |
| Business hours | Usually limited by banking hours | 24/7/365 |
| Transparency | Internal ledgers are private | Transactions and many contracts are public |
| Settlement | Often days for cross-border flows | Seconds to minutes depending on chain |
| Custody | Institutions hold assets | Users can self-custody assets |
| Intermediaries | Banks, brokers, clearing houses | Smart contracts and validators |
| Innovation | Permissioned and slow | Open-source and composable |
| Support | Customer service and legal remedies | Mostly self-service and risk management |

Example: sending dollar value internationally.

Traditional path:

1. Log into a bank or payment app.
2. Provide identity and transfer details.
3. Pay transfer fees and FX spread.
4. Wait for banking and correspondent networks.
5. Recipient receives funds after settlement.

DeFi path:

1. Hold a stablecoin such as USDC.
2. Send it to the recipient address.
3. Pay network fees.
4. Recipient receives tokens after confirmation.

The DeFi path is faster and more open, but it also requires correct addresses, wallet safety, chain selection, and stablecoin risk awareness.

## Smart Contracts as Financial Protocols

The core innovation of DeFi is that financial rules can be enforced by smart contracts.

In traditional finance, a financial agreement is usually enforced by contracts, courts, compliance systems, and institutions. In DeFi, the agreement is often deployed as code.

Simplified lending example:

```solidity
// Simplified teaching example. Do not use in production.
contract SimpleLending {
    mapping(address => uint256) public deposits;
    mapping(address => uint256) public borrows;

    function deposit() external payable {
        deposits[msg.sender] += msg.value;
    }

    function borrow(uint256 amount) external {
        require(deposits[msg.sender] * 100 / amount >= 150, "Not enough collateral");
        borrows[msg.sender] += amount;
        payable(msg.sender).transfer(amount);
    }
}
```

The example is intentionally incomplete, but it shows the idea:

- Rules are public.
- Execution is deterministic.
- Anyone can interact with the contract if they meet the requirements.
- The protocol does not need to know your name.

Real protocols add many more components: token accounting, interest rates, oracle prices, liquidation rules, access controls, pausing mechanisms, upgrade paths, risk parameters, and governance.

## Composability: Money Legos

Composability means that different DeFi protocols can connect to each other like building blocks.

This works because many protocols share:

- The same blockchain execution environment.
- Common token standards such as ERC-20.
- Public smart contract interfaces.
- Atomic transactions that can call multiple contracts.

Example strategy:

```text
1. Stake ETH through Lido and receive stETH.
2. Deposit stETH into Aave as collateral.
3. Borrow USDC against that collateral.
4. Deposit USDC into a stablecoin pool.
5. Stake the LP position in another rewards protocol.
```

This stack can create multiple yield sources:

- ETH staking yield.
- Lending and borrowing spreads.
- DEX trading fees.
- Governance token rewards.

The same property also creates systemic risk. If one base layer fails, higher layers can fail with it. A depeg, oracle failure, bridge exploit, or liquidation cascade can travel through many protocols quickly.

## TVL: A Useful but Limited Metric

TVL means **Total Value Locked**. It estimates how much value is deposited in a protocol or ecosystem.

Why people use it:

- It shows rough protocol scale.
- It helps compare ecosystems.
- It reflects user trust and capital depth.
- It helps estimate liquidity for trading or borrowing.

Why it can mislead:

1. **TVL is not revenue.** A large pool may earn little fee income.
2. **TVL can be recursive.** The same asset can be counted across stacked positions.
3. **TVL moves with token prices.** ETH price rising can increase TVL without new deposits.
4. **TVL ignores risk.** A protocol can have high TVL and weak controls.
5. **TVL can be incentive-driven.** Temporary rewards can attract mercenary capital.

Use TVL with other metrics:

- Protocol revenue.
- Active users.
- Trading volume.
- Borrow utilization.
- Audit history.
- Governance controls.
- Oracle and bridge dependencies.

For current data, use dashboards such as [DefiLlama](https://defillama.com/).

## Core Advantages of DeFi

### Permissionless Access

Anyone with a compatible wallet can interact with a public protocol. This expands access to users who may not have easy access to banks or brokerages.

### Transparency

Transactions, contract addresses, token balances, and many protocol rules are visible on-chain. Users and researchers can audit flows directly instead of relying only on institutional reports.

### Borderless Settlement

DeFi protocols are global by default. A user in one country and a user in another can interact with the same liquidity pool under the same contract rules.

### Composability

Developers can build on existing protocols instead of starting from scratch. This speeds up innovation and makes new products possible.

### Non-Custodial Design

Many DeFi protocols let users keep control of their assets until they choose to deposit into a contract. This is different from handing funds to a centralized exchange or bank.

### Automation

Smart contracts can enforce rules continuously. Interest accrues, collateral is checked, liquidations happen, and trades settle without manual back-office operations.

## The DeFi Technology Stack

DeFi can be viewed in layers:

```text
┌────────────────────────────────────┐
│ Frontend UI                         │  Websites, wallets, dashboards
├────────────────────────────────────┤
│ Aggregators                         │  1inch, Zapper, DeBank
├────────────────────────────────────┤
│ Protocols                           │  Uniswap, Aave, Maker/Sky
├────────────────────────────────────┤
│ Assets                              │  ETH, ERC-20s, stablecoins, NFTs
├────────────────────────────────────┤
│ Settlement layer                    │  Ethereum, Arbitrum, Base
└────────────────────────────────────┘
```

Settlement layer:

- Provides execution, finality, and security assumptions.
- Ethereum is the main settlement layer for DeFi.
- L2 networks such as Arbitrum, Optimism, and Base provide cheaper execution with different trust assumptions.

Asset layer:

- ERC-20 tokens are the main unit of DeFi.
- Stablecoins such as USDC, USDT, DAI, and USDS are core settlement assets.
- NFTs and tokenized real-world assets can also become collateral or financial primitives.

Protocol layer:

- DEXs, lending markets, stablecoin protocols, derivatives, vaults, liquid staking, and bridges.

Aggregator layer:

- Finds better routes, combines protocols, and gives users a single interface.

Frontend layer:

- The website or app users interact with.
- A frontend can be compromised even when the smart contracts are safe, so contract address verification still matters.

## A Short History of DeFi

| Year | Milestone | Why it mattered |
|------|-----------|-----------------|
| 2017 | MakerDAO and DAI | Early decentralized stablecoin system |
| 2018 | Uniswap V1 | Popularized AMMs for on-chain trading |
| 2020 | Compound liquidity mining | Started DeFi Summer and token incentives |
| 2020 | Yearn Finance | Made yield aggregation mainstream |
| 2021 | Uniswap V3 | Introduced concentrated liquidity |
| 2022 | Terra/UST collapse | Showed systemic risk in algorithmic stablecoins |
| 2023 | Real yield narrative | Shifted focus toward sustainable protocol revenue |
| 2024 | RWA growth | Brought Treasury bills and tokenized assets on-chain |
| 2025-2026 | Stablecoin regulation | Moved stablecoins toward regulated payment infrastructure |

## Summary

Key takeaways:

1. DeFi uses smart contracts to provide financial services without traditional intermediaries.
2. It changes the trust model rather than removing trust completely.
3. Composability is DeFi's superpower and one of its largest systemic risk sources.
4. TVL is useful, but it must be evaluated with revenue, users, security, and risk controls.
5. The DeFi stack includes settlement layers, assets, protocols, aggregators, and frontends.

The next lessons go deeper into AMMs, lending markets, stablecoins, and risk management.

## Further Reading

- [Ethereum.org - DeFi](https://ethereum.org/en/defi/)
- [DefiLlama](https://defillama.com/)
- [The Defiant](https://thedefiant.io/)
- [Finematics - DeFi videos](https://www.youtube.com/c/Finematics)

