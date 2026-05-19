# The Major L2 Ecosystem Compared

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> The Ethereum L2 ecosystem is thriving — each major Rollup has carved out its own niche in architecture, ecosystem building, and growth strategy. This lesson takes a deep look at five leading L2s: Arbitrum, Optimism, Base, zkSync, and StarkNet, so you can build a complete picture of the landscape.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Arbitrum](#arbitrum)
- [Optimism](#optimism)
- [Base](#base)
- [zkSync](#zksync)
- [StarkNet](#starknet)
- [2026 Update: Blobs, PeerDAS, and L2 Risk Tiers](#2026-update-blobs-peerdas-and-l2-risk-tiers)
- [Comprehensive L2 Comparison](#comprehensive-l2-comparison)
- [Summary](#summary)
- [Further Reading](#further-reading)

## Arbitrum

### Architecture

Arbitrum is developed by Offchain Labs and currently holds the highest TVL of any Ethereum L2. It uses Optimistic Rollup technology.

**Core technical stack:**

- **ArbOS**: Arbitrum's operating system layer, running on L2. Manages transaction execution, Gas metering, and cross-chain communication.
- **Nitro upgrade (August 2022)**: rewrote the core execution engine in Go, directly compiling the core of Geth (the Ethereum client).

```text
Nitro Architecture:

User transaction → Sequencer
                       │
                       ▼
              Geth execution engine (modified)
                       │
                       ▼
             WASM state transition function
                       │
                       ▼
  Fraud proof: re-executes disputed steps on L1 using WASM
```

**What Nitro improved:**
- Transaction fees reduced by **5–10x**
- EVM compatibility elevated from "EVM-compatible" to "near-equivalent"
- Fraud proofs use WASM — more efficient and more secure

### Arbitrum's Multi-Chain Strategy

Arbitrum is not just a single chain; it has evolved into a full ecosystem:

| Chain | Type | Role | Characteristics |
|-------|------|------|-----------------|
| Arbitrum One | Optimistic Rollup | General DeFi / dApps | Highest TVL, richest ecosystem |
| Arbitrum Nova | AnyTrust (Validium variant) | Gaming and social | Ultra-low fees, data managed by a DAC |
| Arbitrum Orbit | L3 framework | Custom app-chains | Lets projects deploy their own L3 |

### Ecosystem Highlights

Arbitrum's DeFi ecosystem is the most vibrant of any L2:

- **GMX**: a decentralized perpetuals exchange and the first L2-native DeFi protocol to achieve large-scale success. Supports up to 50x leverage on BTC, ETH, and other assets, renowned for minimal slippage.
- **Camelot**: Arbitrum-native DEX with a dual-AMM model (volatile pool + stable pool), supporting custom fee tiers and NFT staking.
- **Pendle**: yield tokenization protocol that lets users trade future yield. Saw massive success on Arbitrum.
- **Radiant Capital**: cross-chain lending protocol that uses LayerZero for cross-chain liquidity.

**On-chain data (early 2025 reference):**
- Daily transactions: ~1–2 million
- Unique addresses: over 20 million
- DeFi protocols: 500+

### Governance: ARB Token

ARB is Arbitrum's governance token (airdropped March 2023). Holders vote in the Arbitrum DAO, which manages a multi-billion-dollar treasury used for ecosystem development and technical upgrades.

## Optimism

### Architecture

Optimism is developed by OP Labs. It also uses Optimistic Rollup, but differs from Arbitrum in important technical details.

**Bedrock upgrade (June 2023)** — Optimism's major technical overhaul:

```text
Bedrock Architecture:

Execution Layer:     Modified Geth (op-geth)
                          │
Derivation Layer:    op-node (derives L2 state from L1)
                          │
Batch Submission:    Batcher (batches L2 data to L1)
                          │
Fault Proof:         Dispute resolution (cannon + op-program)
```

Bedrock's core design philosophy is **Minimal Diff** — reuse as much of the Ethereum client code as possible, and only modify what is necessary. This means:
- Any Ethereum EIP upgrade can be integrated quickly.
- The security audit surface is smaller.
- Developer experience is nearly identical to Ethereum.

### OP Stack and the Superchain Vision

OP Stack is Optimism's most strategically significant innovation — a **modular, open-source L2 tech stack**.

```text
OP Stack Modular Architecture:

┌─────────────────────────────────┐
│       Application Layer (DApps)  │
├─────────────────────────────────┤
│       Execution Layer (op-geth)  │
├─────────────────────────────────┤
│      Derivation Layer (op-node)  │
├─────────────────────────────────┤
│     Settlement Layer (L1 contracts)  │
├─────────────────────────────────┤
│  Data Availability Layer (L1 Blob / Alt-DA) │
└─────────────────────────────────┘
```

The **Superchain vision** is for all OP Stack-based L2s to form an **interconnected network of chains**:

- Shared security (all anchored to Ethereum L1)
- Native cross-chain messaging
- Shared upgrades and maintenance
- A positive-sum network effect flywheel

More than 30 chains have already deployed on OP Stack, including Base, Zora, Mode, and Worldchain.

### OP Token and RetroPGF

Optimism's governance and incentive model is distinctive:

- **OP token**: governance token used to vote in the Token House.
- **Citizens' House**: a second governance body composed of soulbound-token holders.
- **RetroPGF (Retroactive Public Goods Funding)**: contribute first, get rewarded later — not upfront grants.

RetroPGF's guiding idea: "If you create something valuable for the ecosystem, the community will eventually reward you." This mechanism encourages long-termism and public goods development.

## Base

### Coinbase's L2 Strategy

Base is an L2 built by Coinbase (the largest compliant U.S. exchange, a publicly listed company) on top of OP Stack. It launched in August 2023 and quickly became one of the top L2s.

**Why did Coinbase build an L2?**

```text
Coinbase's Web3 strategy:

Old path:  User → Coinbase App → centralized trading
  Problem: user assets are custodied by Coinbase — not real Web3

New path:  User → Coinbase Wallet → Base L2 → on-chain DeFi
  Benefit: users control their assets, with low fees and a great experience
```

**Base's unique advantages:**

1. **Coinbase user funnel**: Coinbase has over 100 million registered users who can be guided onto Base at low cost.
2. **Fiat on-ramp**: Coinbase's compliant fiat channels let users buy assets on Base directly.
3. **Brand trust**: as a public company, Coinbase's backing gives Base mainstream credibility.
4. **Developer integration**: deep integration with Coinbase developer tools.

### Base and OP Stack

Base is one of the Superchain's core members:

- Base contributes a portion of its sequencer revenue to the Optimism Collective.
- In return, Base benefits from continuous OP Stack upgrades and security guarantees.
- A win-win: Base gets the technology, Optimism gets the ecosystem and revenue.

### Base Ecosystem

Base is known for social and consumer-facing applications:

- **Friend.tech**: social token trading platform that triggered a wave of attention in 2023.
- **Farcaster ecosystem**: decentralized social protocol, with many apps deployed on Base.
- **Aerodrome**: Base's largest DEX, forked from Velodrome (Optimism's top DEX).
- **mint.fun / Zora ecosystem**: NFT minting and creator economy.

**Base has no native token** — Coinbase has explicitly stated that Base will not have a native token. This means Base incentives come from the protocol level, not token speculation.

## zkSync

### The zkEVM Approach

zkSync is developed by Matter Labs and is one of the most closely watched ZK Rollups. zkSync Era (mainnet launched March 2023) is its flagship product.

**zkSync Era's technical characteristics:**

```text
Compilation pipeline:

Solidity / Vyper source code
       │
       ▼
  Solc / Vyper compiler
       │
       ▼
    Yul (intermediate representation)
       │
       ▼
  zkSync compiler (LLVM-based)
       │
       ▼
  zkEVM bytecode
```

This compilation path makes zkSync a **Type 4 zkEVM** — high-level language compatible, but with different bytecode. Most Solidity code deploys directly, but some low-level operations (inline assembly, certain opcodes) may need adjustment.

### Native Account Abstraction

One of zkSync's major innovations is **protocol-level native account abstraction**:

On Ethereum, there are two account types:
- **EOA (Externally Owned Account)**: controlled by a private key — the standard wallet.
- **Contract account**: controlled by code.

Ethereum's ERC-4337 implements account abstraction at the application layer. zkSync does it at the protocol layer — **every account is a smart contract account**.

This enables:
- **Gas sponsorship**: projects can pay Gas fees on behalf of users (Paymaster mechanism).
- **Social recovery**: lose your private key, recover your account via trusted contacts.
- **Batched transactions**: sign once, execute multiple transactions (e.g., approve + swap together).
- **Arbitrary signature schemes**: not limited to ECDSA — use Passkeys, face recognition, or any other scheme.

### ZK Token

The ZK token was airdropped in June 2024, but the airdrop generated controversy due to allegations of unfair distribution — a large number of Sybil-attack addresses received tokens. It became a cautionary tale for L2 airdrop strategy.

## StarkNet

### StarkEx vs StarkNet

StarkWare has developed two products that are easy to confuse:

| Property | StarkEx | StarkNet |
|----------|---------|----------|
| Type | App-specific Rollup | General-purpose Rollup |
| Clients | dYdX v3, Immutable X, Sorare | Any developer |
| Data mode | ZK Rollup or Validium (selectable) | ZK Rollup |
| Smart contracts | No custom contracts | Cairo contracts supported |
| Launch | 2020 | 2022 (Alpha) |

StarkEx has processed over **$500 billion** in cumulative volume and hundreds of millions of transactions, proving the reliability of the STARK proof system.

### The Cairo Language

StarkNet's defining characteristic — and its most debated — is the use of its own programming language, **Cairo**, rather than Solidity.

```cairo
// Cairo example: a simple counter contract
#[starknet::contract]
mod Counter {
    #[storage]
    struct Storage {
        count: u128,
    }

    #[external(v0)]
    fn increment(ref self: ContractState) {
        let current = self.count.read();
        self.count.write(current + 1);
    }

    #[external(v0)]
    fn get_count(self: @ContractState) -> u128 {
        self.count.read()
    }
}
```

**Why Cairo instead of Solidity?**

Cairo is designed specifically for the STARK proof system:
- Every computation step can be efficiently proven.
- Compiles to Sierra (Safe Intermediate Representation), then to CASM (Cairo Assembly).
- Proof generation is several times faster than Solidity-transpiled approaches.

**Drawback**: developers must learn a new language. DeFi protocols cannot be ported directly from Ethereum, which has slowed ecosystem growth.

### StarkNet's Technical Advantages

1. **STARK proofs**: no trusted setup required, quantum-resistant, transparent.
2. **Recursive proofs**: one proof can verify another, dramatically reducing L1 verification costs.
3. **SHARP (Shared Prover)**: multiple applications share a prover, amortizing proving costs.
4. **Volition mode** (planned): users can choose whether their data is stored on L1 or off-chain.

### STRK Token

The STRK token launched in February 2024 and is used for Gas fees and governance. StarkNet Gas can be paid in either ETH or STRK — a relatively distinctive design.

## 2026 Update: Blobs, PeerDAS, and L2 Risk Tiers

The introduction of Blobs in the 2024 Dencun upgrade fundamentally changed the L2 cost structure. The 2025 Pectra upgrade increased Blob capacity, and the Fusaka upgrade (late 2025) introduced PeerDAS, making further Blob scaling more sustainable. Understanding L2s in 2026 means looking beyond TVL and fees — you also need to examine data availability, sequencer design, proof systems, and upgrade permissions.

### Blob Economics: Why L2s Became Cheap

Rollups need to publish transaction data to Ethereum so anyone can reconstruct the L2 state. Previously, much of this data lived in expensive `calldata`. EIP-4844's Blobs gave Rollups a dedicated data channel.

```text
L2 transaction fee
  = L2 execution cost
  + L1 data publication cost
  + sequencer operations and margin
  + congestion premium
```

Blobs reduce the "L1 data publication cost" component. With Pectra raising the target Blob capacity, L2s are less likely to see fee spikes from data space shortages under normal conditions. But Blobs are still a market resource — if multiple Rollups congest simultaneously, fees will rise.

### PeerDAS: Scaling Without Sacrificing Node Accessibility

Fusaka's PeerDAS addresses the problem that "more Blobs = heavier burden on full nodes." It allows nodes to participate in validation via data availability sampling — no single node needs to download all Blob data.

What this means for L2:

- Blob throughput can continue increasing.
- Ordinary node bandwidth and hardware requirements won't scale linearly.
- Low L2 fees have a better chance of being sustained long-term.
- Rollup scaling depends more on Ethereum's DA capacity and less on centralized data layers.

### OP Superchain and the App-Chain Trend

OP Stack is no longer just Optimism mainnet — it is a reusable Rollup technology stack. Base, Zora, Mode, and Worldchain all follow this path.

The core Superchain idea:

- Multiple chains share OP Stack.
- Upgrades, governance, and infrastructure are unified where possible.
- Cross-chain messaging and asset movement become smoother over time.
- Apps can choose to become their own dedicated chain rather than competing on a shared general-purpose L2.

This creates a new question for users: not "Ethereum vs some L2," but "how do I safely operate across a set of chains sharing the same tech stack?"

### Base: The Consumer L2

Base's strength is not technical innovation — it's distribution:

- Coinbase's user funnel provides fiat on-ramps and mainstream user access.
- OP Stack gives it the full Superchain ecosystem.
- Farcaster, social apps, creator economy, meme tokens, and micropayments are all active.
- No native token removes the "interact just for the airdrop" narrative.

Two key questions to track with Base:
1. How it converts centralized-exchange users into self-custodial on-chain users.
2. How it progressively decentralizes its sequencer, governance, data publication, and revenue model.

### ZK Rollup: Strong Tech, but Ecosystem and Compatibility Still Challenges

zkSync, StarkNet, Scroll, and Polygon zkEVM all belong to the ZK path, but they differ significantly in developer experience, EVM compatibility, proving costs, and ecosystem strategy.

ZK Rollup advantages:

- Validity proofs provide faster state correctness guarantees.
- Withdrawal wait times can theoretically be shorter than Optimistic Rollup.
- Well-suited for complex computation, privacy, gaming, and high-frequency applications over the long term.

Challenges:

- Proof systems are complex — hard to audit and implement.
- Developer tooling and EVM compatibility need sustained refinement.
- Cold-starting an ecosystem is harder than with the OP Stack path.
- Upgrade keys and centralized provers remain phase-specific risks.

### Alt-DA, Validium, and the Difference from Rollup

Many low-fee chains use data availability solutions outside Ethereum — Celestia, EigenDA, Avail, or custom DACs. These can dramatically reduce fees, but the security assumptions differ.

| Type | Where data lives | Advantage | Risk |
|------|------------------|-----------|------|
| Rollup | Ethereum L1 Blob / calldata | Inherits Ethereum DA security | Higher cost |
| Validium | Off-chain DA or committee | Lower fees, higher throughput | Harder user exit if data unavailable |
| Optimium / Alt-DA Rollup | Third-party DA layer | Cost and scalability trade-off | Depends on additional DA network security |

Don't just look at "low fees." Ask: if the operator acts maliciously or the DA layer goes down, can users exit independently?

### A Risk Framework for Choosing an L2

When using or researching an L2, check these seven questions:

1. **Data availability**: is transaction data published to Ethereum, a third-party DA layer, or a committee?
2. **Proof system**: is the fraud proof or validity proof actually live in production?
3. **Sequencer**: is there a single sequencer? Is there a decentralization roadmap?
4. **Exit path**: can users force-exit to L1?
5. **Upgrade permissions**: are contracts upgradeable? What is the multisig or governance timelock?
6. **Bridge security**: what risks does the official bridge carry vs. third-party bridges?
7. **Ecosystem quality**: is TVL driven by real application demand, or short-term incentive farming?

This framework matters more than "which L2 is cheapest."

## Comprehensive L2 Comparison

### Technical Comparison

| Dimension | Arbitrum | Optimism | Base | zkSync Era | StarkNet |
|-----------|----------|----------|------|-----------|----------|
| Type | Optimistic Rollup | Optimistic Rollup | Optimistic Rollup | ZK Rollup | ZK Rollup |
| EVM compatibility | High (Nitro) | High (Bedrock) | High (OP Stack) | Medium (Type 4) | None (Cairo) |
| Account abstraction | ERC-4337 | ERC-4337 | ERC-4337 | Native | Native |
| Withdrawal time | 7 days | 7 days | 7 days | ~1 hour | ~hours |
| Proof system | Fraud proofs | Fraud proofs | Fraud proofs | ZK-SNARK | ZK-STARK |

### Ecosystem Data (early 2025 reference)

| Metric | Arbitrum | Optimism | Base | zkSync Era | StarkNet |
|--------|----------|----------|------|-----------|----------|
| TVL order of magnitude | $10B+ | $5B+ | $5B+ | $500M+ | $200M+ |
| Daily transactions | 1–2M | 0.5–1M | 2–4M | 0.1–0.5M | 0.1–0.3M |
| DeFi protocols | 500+ | 200+ | 300+ | 100+ | 50+ |
| Native token | ARB | OP | None | ZK | STRK |
| Governance model | DAO | Bicameral | Coinbase-led | DAO | Foundation-led |

> Note: these figures are reference values; actual data fluctuates with the market. See [L2Beat](https://l2beat.com/) for the latest.

### How to Choose an L2?

For different user types:

- **Heavy DeFi users**: Arbitrum (richest DeFi ecosystem)
- **Fee-conscious users**: Base or Arbitrum (extremely low cost after EIP-4844)
- **Mainstream / new users**: Base (Coinbase on-ramp, best UX)
- **Developers (fast deployment)**: Arbitrum / Base / Optimism (full EVM compatibility)
- **Developers (cutting-edge tech)**: zkSync / StarkNet (native ZK capabilities)
- **Gaming projects**: Arbitrum Nova / StarkNet (optimized for high-frequency, low-value transactions)

## Summary

1. **Arbitrum leads in TVL and DeFi ecosystem depth.** The Nitro upgrade delivers near-native Ethereum compatibility, and protocols like GMX demonstrate what L2-native DeFi can achieve.
2. **Optimism's OP Stack and Superchain strategy** transformed it from a single L2 into an L2 technology provider — its influence far exceeds its own chain's TVL.
3. **Base leverages Coinbase's user base and regulatory standing** to become the fastest-growing L2, with a strong focus on social and consumer applications.
4. **zkSync and StarkNet represent two paths for ZK Rollup** — zkSync pursues EVM compatibility, StarkNet builds its own Cairo ecosystem. Both lead in innovations like native account abstraction.
5. **The L2 landscape is still evolving rapidly.** Competition across technology, ecosystem, and governance will continue driving maturity in the Ethereum scaling ecosystem.

## Further Reading

- [L2Beat: Layer 2 Data Dashboard](https://l2beat.com/)
- [Arbitrum Documentation](https://docs.arbitrum.io/)
- [Optimism Documentation](https://docs.optimism.io/)
- [Base Documentation](https://docs.base.org/)
- [zkSync Documentation](https://docs.zksync.io/)
- [StarkNet Documentation](https://docs.starknet.io/)
- [Vitalik: The different types of ZK-EVMs](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)
- [The Block: Layer 2 Data Dashboard](https://www.theblock.co/data/scaling-solutions)
