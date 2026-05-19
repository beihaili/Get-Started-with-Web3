# Rollup Principles Explained

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Rollup is the core scaling technology in Ethereum's roadmap. This lesson explains how Optimistic Rollups and ZK Rollups work, compares their security models, performance, and EVM compatibility, and explores the key challenge of data availability.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [What Rollup Is](#what-rollup-is)
- [How Optimistic Rollups Work](#how-optimistic-rollups-work)
- [How ZK Rollups Work](#how-zk-rollups-work)
- [Optimistic vs ZK: Detailed Comparison](#optimistic-vs-zk-detailed-comparison)
- [The Data Availability Problem](#the-data-availability-problem)
- [Validium and Volition Modes](#validium-and-volition-modes)
- [Summary](#summary)
- [Further Reading](#further-reading)

## What Rollup Is

Rollup is a Layer 2 scaling solution. Its core idea can be summarized in one sentence: **move computation off-chain and keep data on-chain**.

Here is an analogy. Imagine you are working on a company project. If every detail has to be approved by the CEO, Ethereum mainnet, efficiency will be very low. A Rollup works differently: you complete the work in your own office, the L2, and submit only the final report and key evidence, transaction data and proofs, to the CEO for review.

More specifically, a Rollup works like this:

```text
1. Users submit transactions on L2
   |
   v
2. The Rollup sequencer collects transactions and packs them into a batch
   |
   v
3. The sequencer executes these transactions on L2 and updates the L2 state
   |
   v
4. Transaction data plus a state proof are submitted to Ethereum L1
   |
   v
5. The Rollup contract on L1 verifies or stores the data
   |
   v
6. Once L1 confirms it, the L2 transaction receives Ethereum-level security
```

**Why does this scale Ethereum?**

- **Computation compression**: L1 does not need to re-execute every transaction. It only verifies a proof or waits through a challenge period.
- **Data compression**: Rollups encode transaction data efficiently. For example, an ETH transfer needs about 110 bytes on L1, while a batched Rollup submission can need only about 12 bytes.
- **Batch amortization**: the fixed L1 submission cost is shared by every transaction in the batch.

Today there are two main Rollup families: **Optimistic Rollups** and **ZK Rollups**. Their difference is how they prove to L1 that the L2 state is correct.

## How Optimistic Rollups Work

### Core Idea: Optimistic Assumption Plus Fraud Proofs

Optimistic Rollups are named after their core assumption: they **optimistically assume that every submitted state is correct** unless someone disputes it.

This is similar to the "presumption of innocence" in legal systems: you are assumed innocent until someone provides evidence that proves otherwise.

### Detailed Workflow

```text
The sequencer submits a state root to L1
     |
     v
+-----------------------------------------+
|          7-day challenge window         |
|                                         |
|  Anyone can submit a fraud proof        |
|                                         |
|  |-- No challenge -> state confirmed    |
|  `-- Challenge -> adjudication begins   |
|       |-- Challenge succeeds -> rollback|
|       `-- Challenge fails -> confirmed  |
+-----------------------------------------+
```

**Key roles:**

1. **Sequencer**: collects user transactions, orders them, executes them, and submits the resulting state to L1.
2. **Validator or challenger**: monitors the state submitted by the sequencer and submits a fraud proof when an error is found.
3. **L1 adjudication contract**: re-executes the disputed transaction step on-chain and decides which side is correct.

### The Fraud Proof Mechanism

When a validator finds that the sequencer submitted an invalid state, it triggers an interactive proof process:

```text
Step 1: The validator says, "The state transition from step N to step M is wrong."
Step 2: Binary search - both sides narrow the disputed range again and again.
Step 3: The dispute is narrowed to one execution step.
Step 4: The L1 contract re-executes that step and decides the result.

Example:
Sequencer claims: State_100 -> [execute 1000 transactions] -> State_200
Validator claims: State_100 -> [execute 1000 transactions] -> State_201

Through bisection:
  Range 1-1000 -> range 500-1000 -> range 750-1000 -> ... -> step 873

L1 re-executes step 873 and gets the correct result.
```

**Why is a 7-day challenge period needed?**

It is a safety margin. Although most fraud can be detected within minutes, a 7-day window ensures that:

- Even if most validators are temporarily offline, there is still enough time to detect and respond.
- The system remains safe under extreme network conditions, such as Ethereum L1 congestion.
- Only **one** honest validator is needed to preserve safety. This is the so-called **1-of-N trust assumption**.

**Drawback:** withdrawing from L2 to L1 requires waiting for the 7-day challenge period to end. Third-party liquidity bridges can provide "fast withdrawals" for a fee.

## How ZK Rollups Work

### Core Idea: Zero-Knowledge Proofs Plus Validity Proofs

ZK Rollups take a completely different strategy. Instead of assuming correctness optimistically, they attach a **mathematical proof** every time they submit a state update, proving that the state transition is correct.

The name "zero-knowledge proof" sounds mysterious, but the core idea is simple:

> **Zero-knowledge proof**: proving to someone that you know a piece of information without revealing the information itself.

A classic analogy: suppose you are color-blind, and I want to prove that two balls have different colors without telling you what the colors are.

- You hide the two balls behind your back, randomly swap them or do not swap them, then show them and ask me, "Did you swap them?"
- I answer correctly every time. After many repetitions, you can be confident that the balls really are different, even though you still do not know their colors.

### ZK Rollup Workflow

```text
1. The sequencer collects and executes L2 transactions
   |
   v
2. The prover generates a ZK proof
   Input: old state + transaction list
   Output: new state + validity proof, ZK-SNARK or ZK-STARK
   |
   v
3. The new state root + ZK proof + compressed transaction data are submitted to L1
   |
   v
4. The L1 verifier contract verifies the ZK proof
   Verification cost is small, O(1) or O(log n)
   If verification passes -> state is confirmed immediately
   If verification fails -> state is rejected
```

**Key advantage: confirm on submission**

ZK Rollups do not need a challenge period because the mathematical proof itself guarantees correctness. This means:

- Withdrawals from L2 to L1 can complete as soon as the proof is verified, usually within minutes to hours.
- Security is based on mathematics, not economic games.

### The Two Main ZK Proof Families

| Property                | ZK-SNARK                                       | ZK-STARK                                   |
| ----------------------- | ---------------------------------------------- | ------------------------------------------ |
| Full name               | Succinct Non-interactive Argument of Knowledge | Scalable Transparent Argument of Knowledge |
| Proof size              | Extremely small, about 200-300 bytes           | Larger, about 45-200 KB                    |
| Verification time       | Extremely fast, constant time                  | Fast, logarithmic time                     |
| Trusted setup           | Required, one-time ceremony                    | Not required, transparent                  |
| Quantum resistance      | No                                             | Yes                                        |
| Representative projects | zkSync, Scroll, Polygon zkEVM                  | StarkNet, StarkEx                          |

**Challenges in generating ZK proofs:**

Generating ZK proofs is computationally intensive. Proving a batch with thousands of transactions may require:

- Powerful GPU, FPGA, or ASIC hardware.
- Minutes to tens of minutes of computation.
- Large amounts of memory, from tens to hundreds of GB.

This is why ZK Rollups are technically more complex than Optimistic Rollups and have developed more slowly.

## Optimistic vs ZK: Detailed Comparison

| Dimension              | Optimistic Rollup                                                | ZK Rollup                                                 |
| ---------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| **Security model**     | Fraud proofs, 1-of-N trust assumption                            | Validity proofs, mathematical guarantee                   |
| **Withdrawal time**    | 7-day challenge period                                           | Immediate after proof verification                        |
| **EVM compatibility**  | Excellent, close to native compatibility                         | Improving, different zkEVM designs vary                   |
| **Computation cost**   | L2 execution is cheap; L1 computes only during challenges        | ZK proof generation is expensive                          |
| **L1 data cost**       | Higher, because full transaction data is needed for fraud proofs | Lower, state diffs plus proof can be enough               |
| **Technical maturity** | More mature, large-scale usage since 2021                        | Catching up quickly                                       |
| **Major projects**     | Arbitrum, Optimism, Base                                         | zkSync, StarkNet, Scroll, Polygon zkEVM                   |
| **Best fit**           | General DeFi and dApps                                           | High-frequency trading, payments, fast-finality use cases |

### zkEVM Compatibility Levels

Vitalik proposed a classification for zkEVM compatibility:

```text
Type 1: fully equivalent to Ethereum, with the slowest proving speed
  `-- Target: Scroll, Taiko

Type 2: fully equivalent to the EVM, slightly faster
  `-- Target: Scroll, Polygon zkEVM

Type 2.5: equivalent to the EVM, but with different Gas costs
  `-- The practical state of many zkEVMs

Type 3: almost EVM-equivalent, with faster proving speed
  `-- May require small code changes

Type 4: high-level-language equivalent, with the fastest proving speed, but requires transpilation
  |-- Target: zkSync Era, Solidity -> Yul -> zkEVM
  `-- StarkNet, Cairo-native
```

The smaller the Type number, the stronger the compatibility, but the slower proof generation tends to be. As hardware and algorithms improve, Type 1 zkEVMs are becoming increasingly feasible.

## The Data Availability Problem

Rollups publish transaction data to L1, but how that data is stored is critical.

### Why Data Availability Matters

Data availability ensures that anyone can:

1. Verify that the L2 state is correct.
2. Rebuild the L2 state if the sequencer fails.
3. Force-withdraw funds from L2 back to L1, the "escape hatch" mechanism.

If data is unavailable, user funds may be permanently locked on L2.

### Calldata vs Blob, EIP-4844

Before EIP-4844, Rollups stored data in Ethereum transaction `calldata`:

```text
Before EIP-4844:
Rollup transaction -> calldata, permanently stored in Ethereum state
Cost: 16 Gas per byte for non-zero bytes
Problem: competes with other Ethereum transactions in the same Gas market

After EIP-4844:
Rollup transaction -> Blob, temporary storage, automatically deleted after about 18 days
Cost: independent Blob Gas market, much lower than calldata
Benefit: Rollup data no longer competes with L1 transactions for block space
```

**Key properties of Blobs:**

- **Temporary storage**: Blob data is removed from the consensus layer after about 18 days, while commitments are retained.
- **KZG commitments**: Kate-Zaverucha-Goldberg polynomial commitments make it possible to verify data availability without downloading all data.
- **Independent fee market**: Blob Gas has its own base fee and supply-demand dynamics.

EIP-4844 supports up to 6 Blobs per block, with a target of 3, and each Blob is about 128 KB. Future Full Danksharding plans to increase the number of Blobs per block to 64 or even more.

### Measured Cost Impact

```text
Cost breakdown for a Uniswap swap on Arbitrum:

Before EIP-4844:
  L2 execution fee: $0.02
  L1 data fee: $0.40, 95% of the total
  Total: $0.42

After EIP-4844:
  L2 execution fee: $0.02
  L1 data fee: $0.005, 20% of the total
  Total: $0.025

Reduction: about 94%
```

## Validium and Volition Modes

In addition to standard Rollups, there are two variant modes that make different choices around data availability.

### Validium

**Validium = ZK validity proof + off-chain data**

```text
Standard ZK Rollup:
  Execution: off-chain
  Proof: ZK proof submitted to L1
  Data: published to L1, safest but most expensive

Validium:
  Execution: off-chain
  Proof: ZK proof submitted to L1
  Data: stored off-chain, managed by a data availability committee, or DAC
```

**Advantages:**

- Extremely low transaction costs, because data does not need to be published to L1.
- High throughput.
- Suitable for games, social apps, and other scenarios with slightly lower security requirements.

**Drawbacks:**

- Data availability depends on the honesty of the DAC.
- If the DAC colludes maliciously or goes offline, users may be unable to withdraw funds.
- Security is lower than standard Rollups.

**Representative projects:** StarkEx, including dYdX v3, Immutable X, and Sorare.

### Volition

**Volition = users choose where data is stored**

```text
Volition mode:
  User A: "My transaction is important" -> data is published to L1, Rollup mode
  User B: "I am just playing a game" -> data is stored off-chain, Validium mode
```

Each user, or even each transaction, can choose its own security level:

- High-value DeFi operation -> choose Rollup mode and receive full L1 security.
- Low-value game operation -> choose Validium mode and receive lower fees.

**Representative projects:** zkSync Era, which supports Validium mode, and StarkNet, which has planned it.

### Mode Comparison

| Property         | Rollup                      | Validium       | Volition            |
| ---------------- | --------------------------- | -------------- | ------------------- |
| Data location    | On-chain L1                 | Off-chain, DAC | User choice         |
| Security level   | Highest                     | Medium         | Flexible            |
| Transaction cost | Higher                      | Lowest         | Depends on choice   |
| Best fit         | DeFi, high-value operations | Games, NFTs    | Hybrid applications |
| Trust assumption | Trust only L1               | Trust the DAC  | User-defined        |

## Summary

1. **Rollup's core principle** is "off-chain execution, on-chain verification": process transactions on L2, then submit data and proofs back to L1 to inherit its security.
2. **Optimistic Rollups** use an "optimistic assumption + fraud proof" model. A 7-day challenge period preserves safety, EVM compatibility is strong, and the ecosystem is currently the most mature.
3. **ZK Rollups** use mathematical proofs to guarantee correctness and can confirm without a challenge period, but proof generation is expensive and zkEVM compatibility is still evolving.
4. **Data availability is a core challenge**. EIP-4844 introduced Blobs and reduced Rollup data costs by about 94%. Full Danksharding will expand capacity further.
5. **Validium and Volition** provide more choices between security and cost, making them useful for different application scenarios.

## Further Reading

- [Vitalik: An Incomplete Guide to Rollups](https://vitalik.eth.limo/general/2021/01/05/rollup.html)
- [Vitalik: The different types of ZK-EVMs](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)
- [Ethereum.org: Optimistic Rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)
- [Ethereum.org: ZK Rollups](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)
- [EIP-4844 Explained](https://www.eip4844.com/)
- [L2Beat: Rollup Risk Assessment](https://l2beat.com/)
- [Delphi Digital: The Complete Guide to Rollups](https://members.delphidigital.io/reports/the-complete-guide-to-rollups/)
