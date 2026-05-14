# Ethereum After Pectra and Fusaka

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Ethereum is no longer just “a smart contract chain.” It is becoming a modular network where L1 provides security, settlement, and data availability; Rollups handle most execution; and smart accounts improve user experience. This lesson uses the Pectra and Fusaka upgrades to rebuild the Ethereum mental model for 2026.

## Table of Contents

- [Why Ethereum Is Still Upgrading](#why-ethereum-is-still-upgrading)
- [From Dencun to Pectra to Fusaka](#from-dencun-to-pectra-to-fusaka)
- [What Pectra Changed](#what-pectra-changed)
- [What Fusaka Changed](#what-fusaka-changed)
- [Impact on Users](#impact-on-users)
- [Impact on Developers](#impact-on-developers)
- [Impact on L2s and Rollups](#impact-on-l2s-and-rollups)
- [Learning Checklist](#learning-checklist)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## Why Ethereum Is Still Upgrading

If you only think of Ethereum as “a chain that runs smart contracts,” it is hard to explain why it still needs major protocol upgrades. A better model is:

> Ethereum L1 provides minimal, credibly neutral, censorship-resistant settlement and data availability; most user activity moves to L2s, wallets, and application layers.

That means Ethereum upgrades are no longer only about “making L1 process more normal transactions per second.” They optimize four things at the same time:

1. **L1 security**: validators, nodes, clients, and protocol rules need to remain robust.
2. **L2 scalability**: Rollups need cheaper and higher-throughput data availability.
3. **User experience**: users should not be blocked by seed phrases, gas, bridging, and repeated approvals.
4. **Developer experience**: wallet, contract, L2, and infrastructure interfaces need to be clearer.

Pectra and Fusaka map directly to these themes: Pectra improves accounts, validators, and Blob capacity; Fusaka advances PeerDAS so Blob scaling can continue sustainably.

## From Dencun to Pectra to Fusaka

The upgrade timeline:

| Upgrade | Mainnet activation | Learning focus | Core ecosystem impact |
|---------|-------------------|----------------|-----------------------|
| Dencun | March 2024 | EIP-4844, Blobs, Proto-Danksharding | L2s gained a dedicated data lane and fees dropped significantly |
| Pectra | May 7, 2025 | EIP-7702, EIP-7251, higher Blob target | Smart account UX moved closer to EOAs, validator operations improved, L2 capacity increased |
| Fusaka | December 3, 2025 | PeerDAS, Blob scaling, execution and consensus improvements | Nodes no longer need to download every Blob, preparing Ethereum for higher Blob throughput |

Together they form a continuous story:

```text
Dencun: introduce Blobs so L2 data no longer has to crowd into calldata
Pectra: increase Blob capacity and bring smart account capabilities closer to EOAs
Fusaka: use PeerDAS to reduce the node burden of Blob scaling
```

These upgrades are not just protocol news. They affect application design, wallet UX, L2 costs, node operations, and security assumptions.

## What Pectra Changed

Pectra combines Prague on the execution layer and Electra on the consensus layer. It includes many EIPs, but learners and developers should focus on the following groups.

### EIP-7702: EOAs Can Gain Smart Account Capabilities

Ethereum accounts traditionally fall into two categories:

- **EOA**: a private-key-controlled user address, such as a MetaMask address.
- **Contract account**: an on-chain smart contract address controlled by code.

EOAs are simple but limited: every operation requires a signature, the account has no built-in permission system, native batching is not available, and applications cannot naturally pay gas for the user. Smart contract wallets solve many of these problems, but historically required a new contract wallet address, making asset and identity migration painful.

EIP-7702 lets an EOA set its account code to a delegation pointer through a new transaction type, allowing that address to execute according to smart account logic. This enables:

1. **Batch transactions**: for example, `approve + swap` can happen in one user action.
2. **Gas sponsorship**: applications, wallets, or third parties can pay gas for users.
3. **Permission reduction**: users can grant limited permissions to session keys or applications instead of exposing full account control.

It also introduces a new safety boundary: a user authorization may no longer mean “this one transfer,” but may affect how the account behaves in the future. Wallets must clearly show the delegated contract, code source, permission scope, and revocation path.

### EIP-7251: Validator Effective Balance Can Increase to 2048 ETH

Ethereum validators used to have an effective balance capped at 32 ETH. Large staking providers managing a lot of ETH had to run many validator instances.

Pectra raises the maximum effective balance to 2048 ETH. This does not raise the solo staking threshold to 2048 ETH. Instead, it lets a single validator carry a larger effective balance. Effects include:

- Large staking operators can consolidate validators and reduce operational complexity.
- The consensus layer has fewer signatures to propagate and aggregate.
- Rewards can accumulate on a larger effective balance without repeatedly splitting into 32 ETH chunks.

For ordinary users, the basic “32 ETH validator” concept remains. For staking infrastructure, it is an important operational improvement.

### Higher Blob Target: More Data Capacity for Rollups

Dencun introduced Blobs so Rollups could publish transaction data in a dedicated data format rather than expensive calldata. Pectra further increased the average Blob target from 3 to 6 per block and the maximum to 9.

This matters for L2s:

- A large part of L2 transaction cost comes from submitting data to L1.
- More Blob capacity means L2 data fees are less likely to spike during normal demand.
- Blobs still use a market. They are not a permanent guarantee of free transactions.

### Other Pectra Changes Worth Knowing

| Area | Representative EIP | Meaning |
|------|--------------------|---------|
| Validator exits | EIP-7002 | Allows validator exits through execution-layer withdrawal credentials, reducing dependency on hot validator keys |
| Validator deposits | EIP-6110 | Makes execution-to-consensus deposit handling more direct |
| BLS precompile | EIP-2537 | Makes on-chain BLS12-381 verification more efficient, helping staking, bridges, light clients, and ZK apps |
| Historical block hashes | EIP-2935 | Extends contract access to historical block hashes, useful for Rollups and future statelessness |
| Calldata pricing | EIP-7623 | Raises costs for data-heavy calldata, pushing L2s toward Blobs and limiting extreme block sizes |

## What Fusaka Changed

Fusaka combines Fulu and Osaka. Its core keyword is **PeerDAS**.

### PeerDAS: Nodes No Longer Need Every Blob

Blobs reduced L2 costs, but full nodes still needed to handle Blob data availability. If every node had to download every Blob as Blob counts increased, bandwidth and storage pressure would grow quickly.

PeerDAS changes the model:

```text
Before: every node downloads all Blob data
Now: each node samples and verifies part of Blob data
Goal: prove that data is available through data availability sampling
```

PeerDAS lets nodes handle a subset of Blob data, while enough available fragments allow the full data to be reconstructed through erasure coding. This allows Ethereum to increase Blob throughput without pushing full-node hardware requirements too high.

### BPO: Gradual Blob Parameter Changes

Fusaka also introduces the idea of Blob Parameter Only forks. Instead of requiring a full hard fork every time, Ethereum can adjust Blob target, maximum, and fee parameters through a narrower process.

For L2s, this is practical: if Blob demand grows quickly, the protocol can increase capacity more smoothly; if parameters are too aggressive, the network can observe and adjust in stages.

### Why Fusaka Matters to Users

Fusaka looks low-level, but it eventually affects everyday costs:

- Whether L2 transactions stay cheap.
- Whether Rollups can support more applications.
- Whether ordinary hardware can still run nodes.
- Whether Ethereum can scale without sacrificing decentralization.

In short: Pectra moves account UX and Blob capacity forward; Fusaka makes continued Blob scaling more sustainable.

## Impact on Users

### Your ETH Does Not Need an “Upgrade”

Around every Ethereum upgrade, phishing links appear claiming that users must “upgrade ETH,” “migrate wallets,” or “claim upgrade rewards.” Normal users do not need to migrate assets for protocol upgrades. Your ETH remains ETH, and your wallet address remains valid.

Treat these claims as high-risk by default:

- “Old ETH must be swapped for new ETH after Pectra”
- “Fusaka airdrop requires signature verification”
- “Sign this to make your wallet compatible with EIP-7702”
- “Activate smart account mode to receive a subsidy”

### Wallet UX Improves, but Signature Risk Becomes More Complex

Smart accounts and account abstraction can simplify many flows:

- One signature can complete multiple actions.
- New users can get gas sponsored by an application.
- Passkeys, social recovery, and limited keys become possible.
- Games, social apps, and consumer apps can feel closer to Web2.

But the risk is more complex. In the past, you mainly asked, “Will this transfer a token?” In the future, you must also ask, “Will this delegate my account to dangerous code?”

### L2 Fees Become More Stable, Not Permanently Free

Blob scaling reduces Rollup data cost, but L2 fees still have multiple parts:

```text
L2 total fee = L2 execution cost + L1 data publishing cost + sequencer strategy/profit + congestion premium
```

So:

- Base, Arbitrum, Optimism, and other L2s are usually cheaper than Ethereum mainnet.
- During popular airdrops, inscriptions, or trading bursts, L2 fees can still spike.
- Before using an L2, check bridge security, withdrawal delays, and application risk.

## Impact on Developers

### Do Not Assume EOAs Have No Code

After EIP-7702, EOAs can execute through delegated code. Some old checks become even less reliable:

```solidity
// Anti-pattern: trying to block contracts by checking code length
require(msg.sender.code.length == 0, "contracts not allowed");
```

This was already a weak security boundary. Now it is even more brittle. Prefer:

- Verify signatures, permissions, and business state explicitly.
- Do not use `tx.origin` as a security boundary.
- Handle callbacks, batching, and reentrancy normally.
- Test smart accounts, contract wallets, and delegated accounts.

### DApps Must Support More Wallet Capabilities

Modern DApps should expect:

- Users may come from EOAs, contract wallets, ERC-4337 smart accounts, or EIP-7702 delegated EOAs.
- A user may authorize a session key for low-risk actions.
- A Paymaster may sponsor gas.
- Wallets may batch multiple calls.

It helps to separate wallet integration into three layers:

1. **Signature layer**: Is the signature readable, simulatable, and revocable?
2. **Account layer**: Can the account batch calls, use modules, or enforce permission limits?
3. **Transaction layer**: Is the transaction sent by the user, a Bundler, or a sponsored service?

### L2 Development Requires Blob Economics

If you build on L2, do not only look at current gas price. Understand:

- Whether your app uses lots of calldata or state writes.
- How the L2 publishes transaction data to Ethereum.
- How Blob fees affect user costs during peaks.
- Whether there are extra trust assumptions such as alt-DA, validium mode, or centralized sequencers.

## Impact on L2s and Rollups

Rollups promise execution on L2 with security anchored to L1. To keep that promise, L2s must publish enough data to a trusted data availability layer so anyone can reconstruct state and verify behavior.

Blobs, Pectra, and Fusaka fit together like this:

```text
Blobs are the dedicated data lane for L2s
Pectra expands lane capacity
Fusaka reduces the burden of maintaining the lane
```

This pushes three changes:

1. **General-purpose Rollups become cheaper**: DeFi, social, gaming, NFT, and payment apps become more suitable for L2s.
2. **More app chains appear**: OP Stack, Arbitrum Orbit, ZK Stack, and similar frameworks keep expanding.
3. **Security differences matter more**: data availability, sequencers, proof systems, and governance keys become central risk factors.

When studying L2s, do not only ask “which chain has the lowest fee?” Ask:

- Where is data published?
- Is the sequencer centralized?
- Are fraud proofs or validity proofs live?
- Who controls upgrades?
- Can users really exit to L1?

## Learning Checklist

After this lesson, you should be able to answer:

- What problems do Dencun, Pectra, and Fusaka solve?
- Why do Blobs reduce L2 costs?
- Why is EIP-7702 related to account abstraction?
- Why does EIP-7251 not raise the solo staking threshold?
- How does PeerDAS reduce the node burden of Blob scaling?
- Why do users not need to “upgrade ETH” after protocol upgrades?
- Why should developers avoid `tx.origin` and account-type checks as security boundaries?
- What security factors matter when choosing an L2 besides fees?

## Summary

Pectra and Fusaka show Ethereum’s scaling direction clearly: L1 remains credibly neutral and verifiable, L2s handle most user transactions, and wallets/account abstraction hide complexity from users.

This does not make Ethereum mainnet unimportant. Its role becomes clearer: settlement, data availability, final security, and ecosystem coordination.

For learners in 2026, Ethereum knowledge needs at least four layers:

1. EVM and smart contracts.
2. L2s, Blobs, and data availability.
3. Smart accounts and wallet UX.
4. Protocol governance and security models.

The next lesson focuses on account abstraction: how ERC-4337, EIP-7702, Bundlers, Paymasters, and Session Keys change wallet usage.

## Further Reading

- [Ethereum.org: Pectra](https://ethereum.org/roadmap/pectra/)
- [Ethereum.org: Fusaka](https://ethereum.org/roadmap/fusaka/)
- [EIP-7702: Set Code for EOAs](https://eips.ethereum.org/EIPS/eip-7702)
- [EIP-7251: Increase the MAX_EFFECTIVE_BALANCE](https://eips.ethereum.org/EIPS/eip-7251)
- [EIP-7594: PeerDAS](https://eips.ethereum.org/EIPS/eip-7594)
- [Ethereum roadmap](https://ethereum.org/roadmap/)
