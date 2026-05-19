# Cross-Chain Bridges and Interoperability

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> In a multi-chain ecosystem, cross-chain bridges are critical infrastructure connecting different blockchains. This lesson explains how bridges work, their trust models, and the leading protocols — and walks through major security incidents to build your risk awareness for cross-chain operations.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Why Cross-Chain Matters](#why-cross-chain-matters)
- [How Cross-Chain Bridges Work](#how-cross-chain-bridges-work)
- [Bridge Trust Models](#bridge-trust-models)
- [Leading Cross-Chain Protocols](#leading-cross-chain-protocols)
- [Bridge Security Incidents](#bridge-security-incidents)
- [Cross-Chain Security Best Practices](#cross-chain-security-best-practices)
- [Summary](#summary)
- [Further Reading](#further-reading)

## Why Cross-Chain Matters

### The Multi-Chain Reality

Before 2020, Ethereum was nearly the only blockchain with an active DeFi ecosystem. Today the landscape looks completely different:

```text
Current multi-chain ecosystem:

Ethereum L1 ──── Arbitrum
    │            Optimism
    │            Base
    │            zkSync
    │            StarkNet
    │
Bitcoin ──── Lightning Network
    │        Stacks
    │
Solana
    │
BNB Chain
    │
Avalanche
    │
Polygon PoS
    │
Cosmos ecosystem ── Osmosis, Celestia, dYdX v4 ...
```

Liquidity and users are scattered across dozens of chains, creating three core problems:

1. **Liquidity fragmentation**: the same token has different liquidity depths on different chains. Uniswap has the deepest ETH/USDC liquidity on Ethereum, but much shallower pools on Arbitrum.
2. **Fragmented user experience**: a user with ETH on Arbitrum who wants to participate in a project on Base must first "move" their assets.
3. **Developer dilemma**: should a DApp deploy on one chain or many? How do you manage the cost and complexity of multi-chain deployments?

**Cross-chain bridges are the infrastructure that solves these problems** — they let assets and information flow between different blockchains.

### The Core Challenge of Cross-Chain

Cross-chain is hard because blockchains are **inherently isolated systems**. Each chain can only verify its own state; it cannot directly read state from other chains.

Think of it like an international wire transfer: a bank in Mexico cannot directly access the U.S. banking system — it needs an intermediary like SWIFT to relay information and settle funds. Cross-chain bridges are the blockchain world's "SWIFT."

## How Cross-Chain Bridges Work

There are three core bridge mechanisms:

### Mode 1: Lock-and-Mint

The most common bridge pattern:

```text
Source chain (Ethereum)               Target chain (Arbitrum)
       │                                      │
       │  1. User sends 1 ETH                │
       │     to the bridge contract           │
       │                                      │
       │  2. Bridge contract locks 1 ETH      │
       │     ┌──────────┐                    │
       │     │  1 ETH   │ (locked)           │
       │     └──────────┘                    │
       │                                      │
       │  ──── bridge verification ──────▶   │
       │                                      │
       │                           3. Target chain mints
       │                              1 wETH (wrapped)
       │                                      │
       │                           4. wETH sent to user
```

**Redeeming is the reverse**: the user burns wETH on the target chain, and the bridge releases the locked ETH on the source chain.

**Key point**: tokens on the target chain are "wrapped" versions whose value depends entirely on the original assets locked in the bridge contract. If the bridge is exploited and the locked assets are stolen, the wrapped tokens become worthless.

### Mode 2: Burn-and-Mint

Used for natively multi-chain tokens (e.g., USDC's CCTP protocol):

```text
Source chain                          Target chain
       │                                      │
       │  1. Burn 100 USDC                   │
       │     (true burn, not a lock)          │
       │                                      │
       │  ──── attestation ──────▶           │
       │                                      │
       │                           2. Mint 100 USDC
       │                              (native token, not wrapped)
```

**Advantage**: no locked-asset security risk; the target chain holds native tokens, not wrapped versions.

**Prerequisite**: the token issuer must have minting authority on multiple chains. Circle's CCTP (Cross-Chain Transfer Protocol) for USDC is the canonical example of this model.

### Mode 3: Atomic Swap

Requires no intermediary — cryptography ensures both sides either complete simultaneously or neither does:

```text
Alice (has 1 ETH on Ethereum)    Bob (has 3000 USDC on Arbitrum)

Step 1: Alice generates a secret S, computes hash H = hash(S)
Step 2: Alice creates an HTLC on Ethereum:
        "If Bob provides S within 24h, give him 1 ETH"
Step 3: Bob creates an HTLC on Arbitrum:
        "If Alice provides S within 12h, give her 3000 USDC"
Step 4: Alice uses S to claim the 3000 USDC on Arbitrum
        (S is now public)
Step 5: Bob uses the revealed S to claim the 1 ETH on Ethereum

Timeout protection: if either party does not cooperate,
                    funds are automatically returned after timeout
```

HTLC (Hash Time-Locked Contract) guarantees atomicity, but user experience is poor — both parties must be online simultaneously.

## Bridge Trust Models

The security of a bridge depends on its trust model. Bridges can be grouped into four trust tiers:

### Tier 1: Native Bridge

**Trusted entity**: L1 validator set (highest trust)

```text
Ethereum ↔ Rollup official bridges:

Ethereum L1
  │
  ├── Arbitrum official bridge: asset security guaranteed by Ethereum consensus
  ├── Optimism official bridge: fraud proofs + 7-day challenge period
  └── zkSync official bridge:  ZK proofs + L1 verification
```

**Characteristics:**
- Security is equivalent to L1 itself
- Usually the slowest (Optimistic Rollup requires a 7-day withdrawal period)
- Limited functionality — only supports L1 ↔ L2 transfers

### Tier 2: Light-Client Verification Bridge

**Trusted entity**: cryptographic proofs (high trust)

The bridge runs a light client of the source chain on the target chain, confirming transactions by verifying block headers and Merkle proofs.

**Representative project**: IBC (the Cosmos ecosystem's cross-chain protocol)

IBC is the most mature light-client bridge in existence:
- Two chains run each other's light clients.
- Relayers carry messages, but cannot forge them.
- Security is grounded in cryptography, not trust in the relayer.

### Tier 3: Optimistic Verification Bridge

**Trusted entity**: at least one honest validator (medium trust)

Similar to Optimistic Rollup — assume cross-chain messages are correct and allow a challenge window.

**Representative project**: Connext (now Everclear)

### Tier 4: External Validation Bridge

**Trusted entity**: multisig committee or Oracle network (lower trust)

A set of external validators (typically a multisig wallet or Oracle nodes) collectively confirms the validity of cross-chain messages.

```text
External validation bridge:

Source chain tx → Validator A ✅
                  Validator B ✅  → threshold reached → execute on target chain
                  Validator C ✅
                  Validator D ❌  (offline)
```

**Characteristics:**
- Fast (no challenge period or proof generation required)
- Security depends on validator honesty and count
- If validators are compromised or collude, assets can be stolen

### Trust Model Comparison

| Type | Security | Speed | Cost | Examples |
|------|----------|-------|------|---------|
| Native bridge | Highest (= L1) | Slowest | Medium | Rollup official bridges |
| Light client | High (cryptographic) | Faster | Higher | IBC |
| Optimistic validation | Medium (1-of-N assumption) | Faster | Medium | Connext |
| External validation | Lower (multisig / Oracle) | Fastest | Lowest | Early Multichain |

## Leading Cross-Chain Protocols

### LayerZero

LayerZero is one of the most closely watched cross-chain messaging protocols today.

**Core design:**

```text
LayerZero Architecture:

Source app → LayerZero Endpoint (source chain)
                    │
                    ├── DVN (Decentralized Verifier Network)
                    │    └── validates cross-chain messages
                    │
                    ├── Executor
                    │    └── executes messages on the target chain
                    │
                    └── Configurable security
                         └── apps choose their own DVN combination

LayerZero Endpoint (target chain) → Target app
```

**Key improvements in V2:**
- **DVN (Decentralized Verifier Networks)**: replaces V1's Oracle + Relayer model.
- **App-configurable security**: each application selects the DVNs it trusts.
- **Executor separation**: message verification and execution are decoupled for greater flexibility.

**Coverage**: supports 50+ chains, making it one of the broadest cross-chain protocols.

**ZRO token**: airdropped June 2024, used for governance and protocol fees.

### Wormhole

Wormhole started as a Solana-Ethereum bridge and has since expanded into a general cross-chain messaging protocol.

**Core mechanism:**

```text
Wormhole Guardian Network:

19 Guardian nodes (run by reputable validators)
   │
   ├── Observe cross-chain messages on the source chain
   │
   ├── Each Guardian signs to confirm
   │
   └── 2/3 supermajority reached (13/19) → VAA (Verified Action Approval) generated
                                               │
                                               ▼
                                    Target chain verifies VAA and executes
```

**Characteristics:**
- Guardians run by institutions including Jump Crypto and Staked.
- Fast (typically 1–5 minutes).
- Security depends on Guardian honesty and operational security.
- Suffered a $320M exploit in 2022 (detailed below).

**W token**: launched April 2024.

### Axelar

Axelar positions itself as "the full-stack interoperability layer for Web3."

**Core technology:**

- Built on the **Cosmos SDK** as a PoS chain — Axelar itself is a blockchain dedicated to cross-chain work.
- **Validator set**: secured by staking and slashing, like other PoS chains.
- **GMP (General Message Passing)**: supports arbitrary cross-chain messages, not just asset transfers.

```text
Axelar and the Cosmos relationship:

Cosmos Hub ─── IBC ─── Axelar Network ─── Gateway contracts ─── EVM chains
                              │
                              └── validators run light clients for all connected chains
```

**Unique advantage**: bridges the Cosmos ecosystem and the EVM ecosystem, filling the gap between the two largest blockchain communities.

### Connext (now Everclear)

Connext uses a distinctive "chain abstraction" philosophy:

**Core design:**
- **Intent-based**: the user expresses "I want to convert token A on chain X into token B on chain Y."
- **Router network**: liquidity providers pre-position funds on each chain.
- **Optimistic verification**: uses an optimistic mechanism to validate cross-chain messages.

```text
User intent: "Move 1 ETH from Arbitrum to Base"

Router network:
  Router A (Arbitrum): has ETH liquidity
  Router B (Base):     has ETH liquidity

Flow:
  1. User locks 1 ETH on Arbitrum
  2. Router B immediately releases 1 ETH to the user on Base (minus fee)
  3. Router B later reclaims the locked ETH from Arbitrum after verification
```

**Advantage**: excellent UX (near-instant), but requires routers to pre-fund liquidity.

## Bridge Security Incidents

Cross-chain bridges are hackers' favorite targets for one simple reason — bridge contracts hold enormous amounts of locked assets, and a single exploit can yield massive profit.

### Ronin Bridge: $625M (March 2022)

**Background**: Ronin is the sidechain for Axie Infinity (a Play-to-Earn game).

**Attack walkthrough:**
```text
Ronin Bridge security model:
  9 validators, 5-of-9 multisig controls the bridge

Attacker (North Korean Lazarus Group):
  1. Used social engineering (spear-phishing disguised as a recruiter)
     to obtain private keys for 4 validators
  2. Used a legacy Axie DAO approval to obtain a 5th signature
  3. Controlled 5/9 — enough to withdraw any amount from the bridge
  4. Drained 173,600 ETH + 25.5M USDC ≈ $625M

Root cause:
  - 4 of the 9 validators were run by the same entity (Sky Mavis)
  - The attack went undetected for 6 days
    (discovered only when users couldn't withdraw)
```

**Lesson**: validator diversity matters more than validator count; anomalous withdrawals need real-time monitoring.

### Wormhole: $320M (February 2022)

**Attack type**: smart contract vulnerability

```text
Vulnerability details:
  Wormhole's Solana-side contract had a signature verification flaw:

  Normal flow: user locks ETH on Ethereum → Guardian confirms
               → Solana mints wETH

  Attack flow:
  1. Attacker crafted a fake "Guardian signature verification" instruction
  2. Exploited a bug in Solana's secp256k1 signature verification precompile
  3. Bypassed Guardian signature checks entirely
  4. Minted 120,000 wETH from thin air on Solana (worth $320M)
  5. Bridged a portion back to Ethereum to redeem real ETH
```

**Aftermath**: Jump Crypto (Wormhole's primary backer) covered the $320M shortfall out of pocket.

### Nomad: $190M (August 2022)

**Attack type**: smart contract misconfiguration — and the most unusual thing about this incident is that it became a "crowd robbery."

```text
Vulnerability:
  Nomad initialized the Merkle root to 0x00 during an upgrade.
  This caused every message to validate as "valid."

Attack spread:
  1. One hacker discovered the bug and began draining funds
  2. Others saw the attack transactions on-chain
  3. The exploit was trivially easy: just copy the attacker's transaction,
     change the recipient address
  4. Hundreds of addresses joined the drain
  5. ~$190M was extracted by hundreds of different addresses
```

This incident was dubbed "the first decentralized bank robbery" — anyone could participate by copy-pasting a transaction.

### Attack Summary

| Incident | Date | Loss | Attack Type | Root Cause |
|----------|------|------|-------------|-----------|
| Ronin Bridge | March 2022 | $625M | Private key theft | Concentrated validators + social engineering |
| Wormhole | February 2022 | $320M | Contract vulnerability | Signature verification bypass |
| Nomad | August 2022 | $190M | Misconfiguration | Merkle root initialized to zero |
| Harmony Horizon | June 2022 | $100M | Private key theft | 2-of-5 multisig — threshold too low |
| Multichain | July 2023 | $126M | Insider | CEO controlled all private keys |

Cross-chain bridge exploits caused over **$2 billion** in losses in 2022 alone.

## Cross-Chain Security Best Practices

Based on the incidents above, here is what an ordinary user should keep in mind when using bridges:

### 1. Prefer Official Bridges

```text
Security tiers (highest to lowest):

1. Rollup official bridges (Arbitrum Bridge, OP Bridge)
   └── Security equivalent to L1, but slow

2. Circle CCTP (native USDC cross-chain)
   └── Operated by the USDC issuer, Burn-and-Mint model

3. Established third-party bridges (Stargate, Across, Hop)
   └── Protocols with long track records

4. Newer / niche bridges
   └── Use with caution — check audit reports first
```

### 2. Split Large Transfers

Don't move all your assets through a single bridge in one transaction:
- Test with a small amount first to confirm the bridge works.
- Transfer the remainder only after confirming receipt.
- Consider using different bridges to spread risk.

### 3. Check the Bridge's Security Status

Before using any bridge, verify:
- **Audit reports**: has it been audited by a reputable security firm?
- **TVL trend**: is TVL stable or growing? A sudden drop can be a warning sign.
- **Bug bounty**: does the project have an active bounty program?
- **L2Beat risk assessment**: L2Beat provides detailed security scores for bridges.

### 4. Understand Wrapped Token Risk

```text
Not all "USDC" is the same:

Native USDC on Ethereum (issued by Circle)       = real USDC
USDC.e via Arbitrum's official bridge             = bridged wrapped USDC
Native USDC on Arbitrum (via Circle CCTP)         = real USDC
USDC via a small third-party bridge               = security depends on that bridge
```

Make sure the tokens you hold come from a trusted bridge or native issuance.

### 5. Monitor Approvals and Interactions

- Regularly review the token approvals you've granted to bridge contracts (use Revoke.cash).
- After bridging, revoke the approval if you no longer intend to use that bridge.
- Don't leave assets sitting in bridge contracts long-term.

## Summary

1. **Cross-chain is a fundamental need in the multi-chain ecosystem.** Liquidity fragmentation, user experience gaps, and developer complexity all require bridges to solve.
2. **Three core mechanisms**: Lock-and-Mint (most common), Burn-and-Mint (most secure, but requires issuer support), Atomic Swap (trustless, but poor UX).
3. **Trust model tiers from highest to lowest**: Native bridge > Light-client verification > Optimistic validation > External validation. Security and speed are almost always a trade-off.
4. **Bridges are high-value attack targets.** Ronin ($625M), Wormhole ($320M), and Nomad ($190M) show that bridge security design is critical.
5. **Users should default to official bridges and proven protocols**, split large transfers, and check audit reports and security assessments before using anything new.

## Further Reading

- [Vitalik: Why the future will be multi-chain, but not cross-chain](https://old.reddit.com/r/ethereum/comments/rwojtk/ama_we_are_the_efs_research_team_pt_7_07_january/hrngyk8/)
- [L2Beat: Bridges Risk Assessment](https://l2beat.com/bridges/risk)
- [LayerZero Documentation](https://docs.layerzero.network/)
- [Wormhole Documentation](https://docs.wormhole.com/)
- [Axelar Documentation](https://docs.axelar.dev/)
- [Rekt News: Cross-chain bridge incident archive](https://rekt.news/)
- [Chainalysis: Cross-chain Bridge Hacks](https://www.chainalysis.com/blog/cross-chain-bridge-hacks-2022/)
