# Rollup Principles Explained

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Rollup is the core scaling technology for Ethereum. This lesson takes a deep look at how Optimistic Rollup and ZK Rollup work, compares their security models, performance, and EVM compatibility, and examines the critical challenge of data availability.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [What Is a Rollup](#what-is-a-rollup)
- [Optimistic Rollup Explained](#optimistic-rollup-explained)
- [ZK Rollup Explained](#zk-rollup-explained)
- [Optimistic vs ZK: A Detailed Comparison](#optimistic-vs-zk-a-detailed-comparison)
- [The Data Availability Problem](#the-data-availability-problem)
- [Validium and Volition](#validium-and-volition)
- [Summary](#summary)
- [Further Reading](#further-reading)

## What Is a Rollup

A Rollup is a Layer 2 scaling solution. Its core idea can be summarized in one sentence: **move computation off-chain, keep data on-chain**.

Think of it like working at a company. If you had to check with the CEO (Ethereum mainnet) for every small decision, nothing would get done. Rollup's approach: you work independently in your own office (L2), and only submit your final report and key evidence (transaction data and proofs) to the CEO for review.

In practice, the Rollup workflow looks like this:

```text
1. User submits a transaction on L2
   ↓
2. Rollup Sequencer collects transactions, bundles them into a batch
   ↓
3. Sequencer executes the transactions on L2, updating L2 state
   ↓
4. Transaction data + state proof is submitted to Ethereum L1
   ↓
5. The Rollup contract on L1 verifies / stores the data
   ↓
6. Once L1 confirms, L2 transactions receive Ethereum-level security
```

**Why does this scale?**

- **Computation compression**: L1 does not re-execute every transaction — it only verifies a proof or waits out the challenge period.
- **Data compression**: Rollup encodes transaction data efficiently. An ETH transfer takes about 110 bytes on L1, but only about 12 bytes when batch-submitted via a Rollup.
- **Batch amortization**: the fixed L1 submission cost is spread across all transactions in the batch.

There are two major Rollup approaches: **Optimistic Rollup** and **ZK Rollup**. The difference is in how they prove the correctness of L2 state to L1.

## Optimistic Rollup Explained

### Core Idea: Optimistic Assumption + Fraud Proofs

The name comes from the central assumption: **optimistically assume all submitted states are correct**, unless someone raises a challenge.

This is like the legal principle of "innocent until proven guilty" — you are assumed innocent until someone presents evidence otherwise.

### How It Works

```text
Sequencer submits a state root to L1
     │
     ▼
┌─────────────────────────────────┐
│     7-day challenge window opens │
│                                  │
│  Anyone can submit a fraud proof │
│                                  │
│  ├── No challenge → state confirmed ✅ │
│  │                                │
│  └── Challenge raised → adjudication ⚠️  │
│       ├── Challenge succeeds → state rolled back │
│       └── Challenge fails → state confirmed │
└─────────────────────────────────┘
```

**Key roles:**

1. **Sequencer**: collects user transactions, orders them, executes them, and submits the resulting state to L1.
2. **Validator / Challenger**: monitors submitted states, and submits a fraud proof if it detects an error.
3. **L1 adjudication contract**: re-executes the disputed transaction steps on-chain to determine who is correct.

### How Fraud Proofs Work

When a validator finds that the sequencer submitted an incorrect state, an interactive proving process begins:

```text
Step 1: Validator claims "the state transition from step N to step M is wrong"
Step 2: Binary search — both parties narrow down the disputed range
Step 3: The dispute is pinpointed to a single execution step
Step 4: The L1 contract re-executes that step and determines the correct result

Example:
Sequencer claims: State_100 → [execute 1000 txs] → State_200
Validator claims:  State_100 → [execute 1000 txs] → State_201

Binary search:
  range 1-1000 → range 500-1000 → range 750-1000 → ... → step 873

L1 re-executes step 873 and produces the correct result.
```

**Why is the challenge period 7 days?**

This is a safety margin. Most fraud can be detected within minutes, but the 7-day window ensures:
- Even if most validators are temporarily offline, there is enough time to detect and respond.
- The system remains secure under extreme network conditions (such as L1 congestion).
- Only **one** honest validator is needed to guarantee security — this is the **1-of-N trust assumption**.

**Drawback**: withdrawing from L2 to L1 requires waiting for the 7-day challenge period to end. Third-party liquidity bridges can offer "fast withdrawal" services for a small fee.

## ZK Rollup Explained

### Core Idea: Zero-Knowledge Proofs + Validity Proofs

ZK Rollup takes a completely different approach. Instead of making an optimistic assumption, every state submission includes **a mathematical proof** that the state transition is correct.

"Zero-knowledge proof" sounds mysterious, but the core concept is straightforward:

> **Zero-knowledge proof**: prove to someone that you know a piece of information, without revealing the information itself.

A classic analogy: suppose you are color-blind and I want to prove two balls are different colors without telling you which colors they are.
- You hide both balls behind your back, optionally swap them, then bring them out and ask "did you swap?"
- I answer correctly every time. After many rounds, you can be convinced the balls are indeed different — even though you don't know the colors.

### ZK Rollup Workflow

```text
1. Sequencer collects and executes L2 transactions
   ↓
2. Prover generates a ZK proof
   · Input:  old state + transaction list
   · Output: new state + validity proof (ZK-SNARK or ZK-STARK)
   ↓
3. New state root + ZK proof + compressed transaction data submitted to L1
   ↓
4. L1 verifier contract validates the ZK proof
   · Verification is cheap (O(1) or O(log n))
   · Verification passes → state confirmed immediately ✅
   · Verification fails  → state rejected ❌
```

**Key advantage: instant finality**

ZK Rollup needs no challenge period, because the mathematical proof itself guarantees correctness. This means:
- Withdrawals from L2 to L1 can complete as soon as the proof is verified (typically minutes to a few hours).
- Security is grounded in mathematics, not economic game theory.

### Two Flavors of ZK Proof

| Property | ZK-SNARK | ZK-STARK |
|----------|----------|----------|
| Full name | Succinct Non-interactive Argument of Knowledge | Scalable Transparent Argument of Knowledge |
| Proof size | Very small (~200-300 bytes) | Larger (~45-200 KB) |
| Verification time | Very fast (constant time) | Fast (logarithmic time) |
| Trusted setup | Required (one-time ceremony) | Not required (transparent) |
| Quantum resistance | No | Yes |
| Representative projects | zkSync, Scroll, Polygon zkEVM | StarkNet, StarkEx |

**The challenge of proof generation:**

Generating a ZK proof is computationally intensive. Proving a batch of thousands of transactions may require:
- Powerful GPU / FPGA / ASIC hardware
- Minutes to tens of minutes of computation
- Large amounts of memory (tens to hundreds of GB)

This is why ZK Rollup is technically more complex and has developed more slowly than Optimistic Rollup.

## Optimistic vs ZK: A Detailed Comparison

| Dimension | Optimistic Rollup | ZK Rollup |
|-----------|-------------------|-----------|
| **Security model** | Fraud proofs (1-of-N trust) | Validity proofs (mathematical guarantee) |
| **Withdrawal time** | 7-day challenge period | Instant (after proof verification) |
| **EVM compatibility** | Excellent (near-native) | Improving (varies by zkEVM type) |
| **Computation cost** | L2 execution is cheap; L1 only computes during challenges | ZK proof generation is expensive |
| **L1 data cost** | Higher (full tx data needed for fraud proofs) | Lower (state diff + proof only) |
| **Maturity** | More mature (large-scale use since 2021) | Catching up fast |
| **Main projects** | Arbitrum, Optimism, Base | zkSync, StarkNet, Scroll, Polygon zkEVM |
| **Best fit** | General DeFi / dApps | High-frequency trading, payments, fast-finality use cases |

### zkEVM Compatibility Types

Vitalik proposed a classification for zkEVM compatibility:

```text
Type 1: Fully equivalent to Ethereum (slowest proof generation)
  └── Target: Scroll, Taiko

Type 2: Fully EVM-equivalent (slightly faster)
  └── Target: Scroll, Polygon zkEVM

Type 2.5: EVM-equivalent but with different Gas costs
  └── The practical state of most zkEVMs today

Type 3: Close to EVM-equivalent (faster proofs)
  └── Minor code changes may be needed

Type 4: High-level language equivalent (fastest proofs, but requires transpilation)
  └── Target: zkSync Era (Solidity → Yul → zkEVM)
  └── StarkNet (native Cairo)
```

The lower the type number, the more compatible — but the slower the proof generation. As hardware and algorithms improve, Type 1 zkEVMs are becoming increasingly practical.

## The Data Availability Problem

Rollups publish transaction data to L1, but how that data is stored matters enormously.

### Why Data Availability (DA) Matters

Data availability ensures that anyone can:
1. Verify the correctness of the L2 state.
2. Reconstruct the L2 state if the sequencer fails.
3. Force-withdraw funds from L2 to L1 (the "escape hatch" mechanism).

If data is unavailable, user funds could be permanently locked on L2.

### Calldata vs Blobs (EIP-4844)

Before EIP-4844, Rollups stored data in the `calldata` of Ethereum transactions:

```text
Before EIP-4844:
Rollup tx → calldata (permanently stored in Ethereum state)
Cost: 16 Gas per non-zero byte
Problem: competes with other Ethereum transactions in the same Gas market

After EIP-4844:
Rollup tx → Blob (temporary storage, deleted after ~18 days)
Cost: separate Blob Gas market, far cheaper than calldata
Benefit: Rollup data no longer competes with L1 transactions for block space
```

**Key properties of Blobs:**

- **Temporary storage**: Blob data is deleted from the consensus layer after ~18 days (the KZG commitment is retained).
- **KZG commitments**: the Kate-Zaverucha-Goldberg polynomial commitment scheme allows verifying data availability without downloading all the data.
- **Separate fee market**: Blob Gas has its own baseFee and supply/demand dynamics.

EIP-4844 supports up to 6 Blobs per block (target: 3), each about 128 KB. Future full Danksharding plans to raise this to 64 or more Blobs per block.

### Cost Impact in Practice

```text
Cost breakdown for a Uniswap swap on Arbitrum:

Before EIP-4844:
  L2 execution fee: $0.02
  L1 data fee:      $0.40  (95% of total)
  Total:            $0.42

After EIP-4844:
  L2 execution fee: $0.02
  L1 data fee:      $0.005 (20% of total)
  Total:            $0.025

Reduction: ~94%
```

## Validium and Volition

Beyond standard Rollups, two variant modes make different trade-offs on data availability:

### Validium

**Validium = ZK validity proof + off-chain data**

```text
Standard ZK Rollup:
  Execution: off-chain ✅
  Proof:     ZK proof submitted to L1 ✅
  Data:      published to L1 ✅  (safest, most expensive)

Validium:
  Execution: off-chain ✅
  Proof:     ZK proof submitted to L1 ✅
  Data:      stored off-chain (managed by a Data Availability Committee, DAC) ⚠️
```

**Advantages:**
- Very low transaction costs (no need to publish data to L1).
- High throughput.
- Suitable for games, social apps, and other use cases with lower security requirements.

**Drawbacks:**
- Data availability depends on the DAC's honesty.
- If the DAC acts maliciously or goes offline, users may not be able to withdraw funds.
- Lower security than a standard Rollup.

**Representative projects:** StarkEx (dYdX v3, Immutable X, Sorare)

### Volition

**Volition = user-chosen data storage location**

```text
Volition mode:
  User A: "This transaction is important" → data published to L1 (Rollup mode)
  User B: "I'm just playing a game"       → data stored off-chain (Validium mode)
```

Each user (even each individual transaction) can choose its own security level:
- High-value DeFi operations → Rollup mode, full L1 security.
- Low-value in-game actions → Validium mode, lower fees.

**Representative projects:** zkSync Era (Validium mode supported), StarkNet (planned)

### Mode Comparison

| Property | Rollup | Validium | Volition |
|----------|--------|----------|---------|
| Data location | On L1 | Off-chain (DAC) | User's choice |
| Security level | Highest | Medium | Flexible |
| Transaction cost | Higher | Lowest | Depends on choice |
| Best fit | DeFi, high-value ops | Games, NFTs | Hybrid apps |
| Trust assumption | L1 only | Trust DAC | User-defined |

## Summary

1. **Rollup's core principle** is "execute off-chain, verify on-chain" — transactions are processed on L2, and data and proofs are submitted back to L1 to inherit its security.
2. **Optimistic Rollup** uses an "optimistic assumption + fraud proof" model. The 7-day challenge period ensures safety, EVM compatibility is excellent, and the ecosystem is the most mature today.
3. **ZK Rollup** uses mathematical proofs to guarantee correctness, enabling instant confirmation without a challenge period — but proof generation is expensive and zkEVM compatibility is still evolving.
4. **Data availability is the core challenge** — EIP-4844's Blobs reduced Rollup data costs by ~94%; full Danksharding will push this further.
5. **Validium and Volition** offer additional trade-offs between security and cost, meeting flexible needs across different use cases.

## Further Reading

- [Vitalik: An Incomplete Guide to Rollups](https://vitalik.eth.limo/general/2021/01/05/rollup.html)
- [Vitalik: The different types of ZK-EVMs](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)
- [Ethereum.org: Optimistic Rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)
- [Ethereum.org: ZK Rollups](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)
- [EIP-4844 Overview](https://www.eip4844.com/)
- [L2Beat: Rollup Risk Assessment](https://l2beat.com/)
- [Delphi Digital: The Complete Guide to Rollups](https://members.delphidigital.io/reports/the-complete-guide-to-rollups/)
