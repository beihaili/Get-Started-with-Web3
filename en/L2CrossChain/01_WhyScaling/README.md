# Why Scaling Is Needed

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> The blockchain trilemma is one of the core challenges of public-chain design: decentralization, security, and scalability cannot all be maximized at the same time. This lesson reviews Ethereum's congestion history, the competing scaling paths, and why Rollups became the center of Ethereum's scaling roadmap.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [The Blockchain Trilemma](#the-blockchain-trilemma)
- [Ethereum's History of Gas Wars](#ethereums-history-of-gas-wars)
- [The Real User Experience and Cost of On-chain Congestion](#the-real-user-experience-and-cost-of-on-chain-congestion)
- [Competing Scaling Paths](#competing-scaling-paths)
- [Ethereum's Rollup-centric Roadmap](#ethereums-rollup-centric-roadmap)
- [Summary](#summary)
- [Further Reading](#further-reading)

## The Blockchain Trilemma

In 2017, Ethereum founder Vitalik Buterin introduced a concept that still shapes blockchain design today: the **blockchain trilemma**. It says that a blockchain system cannot perfectly optimize all three properties at once:

- **Decentralization**: the network is run by many independent nodes, with no single controller.
- **Security**: the network can resist attacks, and transactions cannot be tampered with.
- **Scalability**: the network can process many transactions with high throughput and low latency.

You can picture it as an equilateral triangle. A blockchain can usually prioritize two sides, but not all three perfectly:

```text
        Decentralization
             /\
            /  \
           /    \
          /  ?   \
         /________\
   Security      Scalability
```

**Different chains make different trade-offs:**

| Blockchain             | Decentralization | Security | Scalability            | Strategy                                             |
| ---------------------- | ---------------- | -------- | ---------------------- | ---------------------------------------------------- |
| Bitcoin                | High             | High     | Low, about 7 TPS       | Sacrifices speed for security and decentralization   |
| Ethereum, before Merge | High             | High     | Low, about 15 TPS      | Similar trade-off to Bitcoin                         |
| Solana                 | Medium           | Medium   | High, thousands of TPS | Higher hardware requirements reduce decentralization |
| BSC                    | Low              | Medium   | High                   | Fewer validators, weaker decentralization            |
| EOS                    | Low              | Medium   | High                   | 21 supernodes, highly centralized                    |

Ethereum chose to prioritize **decentralization and security**. Anyone should be able to run a full node on ordinary hardware. That choice strictly limits Ethereum mainnet throughput to roughly 15 transactions per second.

Why not simply increase block size or shorten block time? Because doing so would:

1. Raise the hardware requirements for running a node and reduce the number of nodes.
2. Increase network propagation delay and weaken security.
3. Cause blockchain data to grow faster, making it harder for ordinary users to store the full ledger.

This is why scaling is difficult. It is not a simple technical optimization. It is a fundamental design constraint.

## Ethereum's History of Gas Wars

Ethereum's low throughput has been exposed again and again during bull markets. Several events became turning points.

### 2017: CryptoKitties Congested Ethereum

In November 2017, an NFT cat-breeding game called CryptoKitties suddenly became popular. At peak usage, it consumed about 25% of Ethereum's network traffic. Transactions backed up, Gas fees rose sharply, and even ordinary transfers could take hours.

This was the first time Ethereum struggled because "too many people were using it."

### 2020: DeFi Summer and Gas Fee Mania

In the summer of 2020, DeFi created even more severe congestion:

```text
Timeline:
June -> Compound launched liquidity mining, Gas fees reached 50-100 Gwei
August -> SushiSwap's "vampire attack", Gas fees rose above 500 Gwei
September -> food tokens appeared, including YAM, SUSHI, and KIMCHI; peak Gas fees exceeded 700 Gwei
```

A simple Uniswap swap went from costing a few cents to costing 50-200 dollars. Ordinary users could not participate. DeFi became a "whale game."

### 2021: NFT Mint Peaks

The situation became even more extreme in 2021:

- **Bored Ape Yacht Club mint**: Gas fees rose above 2000 Gwei.
- **Otherside virtual land mint, April 2022**: a single transaction could cost more than 5000 dollars in Gas, and the whole network was almost unusable for hours. Users burned about **175 million dollars** worth of ETH on Gas fees alone.

These events showed the core problem clearly: Ethereum mainnet's roughly 15 TPS throughput cannot support global decentralized applications by itself.

### The Economics Behind Gas Fee Spikes

Ethereum's Gas mechanism is essentially an **auction market**. When block space is scarce:

```text
Block capacity limit, about 30M Gas
|-- Transaction A: willing to pay 100 Gwei, included
|-- Transaction B: willing to pay 80 Gwei, included
|-- Transaction C: willing to pay 50 Gwei, waiting
|-- Transaction D: willing to pay 30 Gwei, waiting
`-- Transaction E: willing to pay 10 Gwei, may never be included
```

EIP-1559 introduced the base fee mechanism, making Gas pricing more predictable, but it **did not increase throughput**. Block space remains a scarce resource.

## The Real User Experience and Cost of On-chain Congestion

What does on-chain congestion mean for ordinary users?

**Scenario 1: Small DeFi actions become uneconomical**

Suppose you have 100 USDC and want to swap it for ETH on Uniswap:

- Mainnet Gas fee during peak demand: about 50 dollars
- Transaction size: 100 dollars
- Gas as a share of the transaction: **50%**

Your trade loses half its value before it even starts. Small users are pushed out by the "Gas threshold."

**Scenario 2: Time-sensitive actions are delayed**

Many DeFi actions are time-sensitive:

- Liquidation protection: if your lending position is close to liquidation, a collateral top-up can be delayed because the Gas bid is too low.
- Arbitrage windows: price differences disappear quickly, and high Gas makes small arbitrage infeasible.
- NFT mints: popular mints become Gas wars where the highest Gas bidder wins.

**Scenario 3: MEV problems get worse**

Congestion also worsens **MEV, or maximal extractable value**. Miners or validators can:

- Reorder transactions, also known as front-running.
- Insert their own transactions before and after yours, also known as a sandwich attack.
- Execute an arbitrage opportunity before you can.

According to Flashbots statistics, more than **600 million dollars** of MEV has been extracted on Ethereum since 2020.

## Competing Scaling Paths

The blockchain community proposed several scaling approaches. They can be roughly grouped into four categories.

### Option 1: Larger Blocks

**Core idea:** increase each block's capacity so each block can hold more transactions.

**Representative projects:**

- **BCH, Bitcoin Cash**: expanded Bitcoin's 1 MB block size to 32 MB.
- **BSV, Bitcoin SV**: pursued an even more aggressive large-block strategy, theoretically reaching GB-scale blocks.
- **Solana**: combines high-performance hardware requirements with short block times.

**Advantages:** simple and direct, with no need for complex protocol design.

**Drawbacks:**

- Node operating costs increase, and ordinary users cannot easily run full nodes.
- Centralization risk increases because only large data centers may be able to maintain the network.
- BCH and BSV show that larger blocks alone did not deliver the adoption many supporters expected.

### Option 2: Sharding

**Core idea:** split one chain into many parallel "shard chains," each processing a subset of transactions.

```text
Original chain: [all transactions] -> processed by one chain

After sharding:
  [Shard 0: transactions A, B, C] -> processed in parallel
  [Shard 1: transactions D, E, F] -> processed in parallel
  [Shard 2: transactions G, H, I] -> processed in parallel
```

**Ethereum once planned 64 shards**, but later abandoned execution sharding and moved toward data sharding, or Danksharding, to provide cheaper data availability for Rollups.

**Why execution sharding was abandoned:**

- Cross-shard communication is extremely complex.
- Atomic transactions are difficult to guarantee.
- The development cycle was too long, while Rollup solutions were already maturing.

### Option 3: Sidechains

**Core idea:** create independent blockchains that communicate with the main chain through bridges.

**Representative project:** Polygon PoS, originally Matic Network.

**Characteristics:**

- Has its own consensus mechanism and validator set.
- Does not fully inherit Ethereum mainnet security.
- Offers high speed and low fees, but uses different trust assumptions.

### Option 4: Layer 2 Rollups

**Core idea:** execute transactions outside the main chain, but submit transaction data back to the main chain so the system can inherit main-chain security.

This is the path Ethereum ultimately chose. Its key insight is to **move computation off-chain, while keeping data and proofs on-chain**. This increases throughput without giving up security and decentralization.

The next lesson explains Rollups in detail.

## Ethereum's Rollup-centric Roadmap

In October 2020, Vitalik published the landmark article [A Rollup-centric Ethereum Roadmap](https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698), which formally established Ethereum's scaling strategy.

**Core idea:** Ethereum mainnet no longer tries to become a high-throughput execution layer itself. Instead, it becomes the **settlement layer and data availability layer** for Rollups.

```text
Ethereum scaling roadmap:

Phase 1: The Merge, completed in September 2022
  `-- PoW -> PoS, reducing energy consumption and preparing for later upgrades

Phase 2: Surge, scaling, in progress
  |-- EIP-4844 Proto-Danksharding, completed in March 2024
  |   `-- Introduced Blobs, reducing Rollup data costs by about 90%
  |-- Full Danksharding, planned
  |   `-- Full data sharding to further increase data availability capacity
  `-- Rollup ecosystem development, in progress
      `-- Arbitrum, Optimism, zkSync, StarkNet, and others

Phase 3: Scourge, anti-MEV, planned
  `-- PBS, proposer-builder separation, and MEV Burn

Phase 4: Verge, verification optimization, planned
  `-- Verkle Trees, reducing node storage requirements

Phase 5: Purge, simplification, planned
  `-- Historical data expiry, reducing node burden

Phase 6: Splurge, final improvements, planned
  `-- Various improvements and optimizations
```

**The key shifts in this roadmap:**

1. **Execution moves from L1 to L2:** most future user activity will happen on Rollups.
2. **L1 focuses on settlement and data availability:** Ethereum mainnet becomes the "trust anchor."
3. **EIP-4844 is a key milestone:** Blob data greatly reduces Rollup data publishing costs.

EIP-4844 had an immediate effect. Before the upgrade, Rollups often spent about 90% of their operating cost on publishing data to L1. After the upgrade, that cost fell by about **90-95%**, which directly lowered user Gas fees:

| Action       | Before upgrade, Arbitrum | After upgrade, Arbitrum |
| ------------ | ------------------------ | ----------------------- |
| ETH transfer | $0.15-0.30               | $0.001-0.01             |
| Uniswap swap | $0.30-0.80               | $0.01-0.05              |
| NFT mint     | $0.50-1.50               | $0.02-0.10              |

## Summary

1. The **blockchain trilemma** is the fundamental framework for understanding scaling: decentralization, security, and scalability cannot all be optimized at the same time.
2. Ethereum's **Gas wars**, including DeFi Summer and NFT mints, exposed the serious limits of roughly 15 TPS throughput and priced out small users.
3. There are several scaling paths: larger blocks are simple but weaken decentralization; sharding is powerful but complex and slow to develop; sidechains trade away some security; Rollups inherit L1 security.
4. Ethereum chose a **Rollup-centric roadmap**: L1 focuses on settlement and data availability, while L2 handles execution.
5. **EIP-4844** introduced Blobs, reducing Rollup costs by more than 90% and making low-cost DeFi access more practical for ordinary users.

## Further Reading

- [Vitalik: A Rollup-centric Ethereum Roadmap](https://ethereum-magicians.org/t/a-rollup-centric-ethereum-roadmap/4698)
- [Vitalik: Why sharding is great](https://vitalik.eth.limo/general/2021/04/07/sharding.html)
- [EIP-4844: Shard Blob Transactions](https://eips.ethereum.org/EIPS/eip-4844)
