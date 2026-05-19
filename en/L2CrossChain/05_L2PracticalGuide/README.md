# L2 Practical Guide

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Four lessons of theory — now it's time to act. This lesson walks you step by step through bridging assets to L2, configuring your wallet, using DeFi, and using real Gas fee data to help you make the best chain-selection decisions.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Bridging Assets from Ethereum to L2](#bridging-assets-from-ethereum-to-l2)
- [Adding L2 Networks to MetaMask](#adding-l2-networks-to-metamask)
- [Using DeFi on L2](#using-defi-on-l2)
- [Gas Fee Comparison](#gas-fee-comparison)
- [Chain Selection Strategy](#chain-selection-strategy)
- [Common Pitfalls on L2](#common-pitfalls-on-l2)
- [Summary](#summary)
- [Further Reading](#further-reading)

## Bridging Assets from Ethereum to L2

We'll use the Arbitrum official bridge as a concrete example of how to move ETH from Ethereum mainnet to Arbitrum One.

### Using the Arbitrum Official Bridge

**Step 1: Go to the official bridge**

Open [bridge.arbitrum.io](https://bridge.arbitrum.io/) and connect your MetaMask wallet.

> **Security reminder**: Always confirm you are on the official URL. Phishing sites are one of the most common causes of asset loss. Bookmark the official bridge address in your browser.

**Step 2: Choose the direction and amount**

```text
Bridge interface:

From: Ethereum Mainnet
  └── Select token: ETH
  └── Enter amount: 0.1 ETH (start small for testing)

To: Arbitrum One
  └── Estimated received amount is shown automatically

Estimated costs:
  └── L1 Gas fee: ~$3–15 (depends on mainnet congestion)
  └── Bridge time: ~10–15 minutes
```

**Step 3: Confirm the transaction**

MetaMask will pop up a transaction confirmation window showing:

- Transaction amount
- Estimated Gas fee
- Target contract address (verify it is the Arbitrum official bridge contract)

Click confirm, then wait for Ethereum mainnet to finalize the transaction.

**Step 4: Wait for funds to arrive**

```text
Bridge progress:

L1 → L2 (deposit direction):
  Ethereum confirmation (~2 min) → Arbitrum confirmation (~10 min)
  Total: ~10–15 minutes

L2 → L1 (withdrawal direction):
  Initiate on Arbitrum → 7-day challenge period → Ethereum confirmation
  Total: ~7 days
```

Deposits (L1→L2) typically take 10–15 minutes. Withdrawals (L2→L1) require the full 7-day challenge period — this is an intentional security property of Optimistic Rollup.

### Using Third-Party Bridges for Faster Withdrawals

If you cannot wait 7 days, third-party bridges offer fast withdrawals:

| Bridge                   | Withdrawal Time | Fee        | Best For               |
| ------------------------ | --------------- | ---------- | ---------------------- |
| Arbitrum Official Bridge | 7 days          | Gas only   | Large amounts, no rush |
| Hop Protocol             | 5–20 minutes    | 0.04–0.1%  | Mid-range amounts      |
| Across Protocol          | 1–5 minutes     | 0.06–0.12% | Speed priority         |
| Stargate (LayerZero)     | 1–10 minutes    | 0.06%      | Multi-chain needs      |

Third-party bridges work by pre-positioning liquidity on L1. You send assets to the bridge on L2; the bridge immediately releases equivalent funds to you on L1. The bridge later reclaims the assets through the official bridge after the 7-day period.

## Adding L2 Networks to MetaMask

Most L2 networks are not supported by MetaMask by default and must be added manually.

### Method 1: One-Click via ChainList

The easiest method is [chainlist.org](https://chainlist.org/):

1. Connect MetaMask
2. Search for the network name
3. Click **Add to MetaMask**
4. Approve in the MetaMask popup

### Method 2: Manual Configuration

If you prefer to configure manually (or want to verify parameters yourself), here are the network parameters for all major L2s:

**Arbitrum One**

```text
Network Name:  Arbitrum One
RPC URL:       https://arb1.arbitrum.io/rpc
Chain ID:      42161
Currency:      ETH
Block Explorer: https://arbiscan.io
```

**Optimism**

```text
Network Name:  OP Mainnet
RPC URL:       https://mainnet.optimism.io
Chain ID:      10
Currency:      ETH
Block Explorer: https://optimistic.etherscan.io
```

**Base**

```text
Network Name:  Base
RPC URL:       https://mainnet.base.org
Chain ID:      8453
Currency:      ETH
Block Explorer: https://basescan.org
```

**zkSync Era**

```text
Network Name:  zkSync Era Mainnet
RPC URL:       https://mainnet.era.zksync.io
Chain ID:      324
Currency:      ETH
Block Explorer: https://explorer.zksync.io
```

**StarkNet**

> Note: StarkNet uses a different account model and cannot be added to MetaMask directly. You need a dedicated wallet: **Argent X** or **Braavos**.

```text
Argent X:  https://www.argent.xyz/argent-x/
Braavos:   https://braavos.app/
```

### Method 3: Auto-Add via DApp Prompt

When you visit a DApp on L2, it will usually prompt you to switch networks. Click the **Switch Network** button in that prompt and MetaMask will add the configuration automatically.

> **Security reminder**: Regardless of which method you use, always verify the RPC URL and Chain ID. A malicious RPC can spoof your displayed balance (it cannot steal assets, but it causes confusion). Use only RPC nodes listed in official documentation.

## Using DeFi on L2

We'll walk through swapping tokens on Uniswap on Arbitrum as a hands-on example.

### Step 1: Ensure you have ETH for Gas

On Arbitrum, Gas is paid in ETH. Make sure your Arbitrum account holds some ETH:

- Simple transfer: ~$0.001–0.01
- DEX swap: ~$0.01–0.10
- Complex contract interaction: ~$0.05–0.30

Keep at least 0.001 ETH (~$3–5) as a Gas reserve.

### Step 2: Open Uniswap

1. Go to [app.uniswap.org](https://app.uniswap.org/)
2. Connect MetaMask
3. **Switch to the Arbitrum network** — click the network selector in the top-right corner and select Arbitrum

```text
Uniswap multi-chain support:

Ethereum    ✓  (most expensive Gas)
Arbitrum    ✓  (recommended — deep liquidity)
Optimism    ✓
Base        ✓  (recommended — lowest fees)
Polygon     ✓
BNB Chain   ✓
```

### Step 3: Execute the swap

For example, swapping 0.01 ETH for USDC:

```text
Swap interface:

You pay:     0.01 ETH
You receive: ~30 USDC (based on live price)

Transaction details:
├── Rate:           1 ETH ≈ 3000 USDC
├── Price impact:   <0.01% (sufficient liquidity)
├── Minimum out:    29.85 USDC (0.5% slippage protection)
├── Route:          ETH → WETH → USDC (direct path)
└── Estimated Gas:  $0.03
```

Click **Swap** → confirm in MetaMask → wait a few seconds → done.

### Step 4: Verify the transaction

After the swap, inspect it on a block explorer:

- Arbitrum: [arbiscan.io](https://arbiscan.io/)
- Optimism: [optimistic.etherscan.io](https://optimistic.etherscan.io/)
- Base: [basescan.org](https://basescan.org/)

Enter your wallet address to see all transactions, including the hash, tokens sent/received, Gas cost, and status.

### Other Common DeFi Operations

| Operation        | Recommended Protocol (Arbitrum) | Typical Gas |
| ---------------- | ------------------------------- | ----------- |
| Token swap       | Uniswap, Camelot                | $0.01–0.10  |
| Lending          | Aave, Radiant                   | $0.05–0.20  |
| Perpetuals       | GMX, Vertex                     | $0.05–0.30  |
| Liquidity mining | Camelot, Pendle                 | $0.05–0.30  |
| NFT trading      | Treasure Marketplace            | $0.01–0.10  |

## Gas Fee Comparison

The following data reflects the same operations across chains after the EIP-4844 upgrade (reference values):

### ETH Transfer

| Chain       | Gas Fee       | Confirmation Time |
| ----------- | ------------- | ----------------- |
| Ethereum L1 | $0.50–5.00    | 12 seconds        |
| Arbitrum    | $0.001–0.01   | 0.3 seconds       |
| Optimism    | $0.001–0.01   | 2 seconds         |
| Base        | $0.0005–0.005 | 2 seconds         |
| zkSync Era  | $0.001–0.01   | seconds           |

### Uniswap Swap

| Chain       | Gas Fee     | Confirmation Time |
| ----------- | ----------- | ----------------- |
| Ethereum L1 | $3–30       | 12 seconds        |
| Arbitrum    | $0.01–0.10  | 0.3 seconds       |
| Optimism    | $0.01–0.10  | 2 seconds         |
| Base        | $0.005–0.05 | 2 seconds         |
| zkSync Era  | $0.02–0.15  | seconds           |

### Key Takeaway

```text
Gas cost reduction (L2 vs L1):

Simple transfer:   100–500x cheaper
DEX swap:          100–300x cheaper
Complex contract:   50–200x cheaper

Bottom line: L2 makes DeFi viable for small-capital users again
  L1: $100 operation + $30 Gas = 30% overhead
  L2: $100 operation + $0.05 Gas = 0.05% overhead
```

> Note: these figures are reference values. Actual Gas fees fluctuate with network congestion and ETH price. Use [l2fees.info](https://l2fees.info/) for real-time comparisons.

## Chain Selection Strategy

Different use cases call for different chains. Here is a practical decision framework:

### Scenario 1: DeFi Trading (Large Amounts)

```text
Recommended: Arbitrum
Reasons:
  ├── Deepest DeFi liquidity, lowest slippage
  ├── All major protocols present: GMX, Aave, Uniswap
  ├── High-volume DEX pools mean better prices
  └── Best for trades $1,000+
```

### Scenario 2: DeFi Trading (Small Amounts / High Frequency)

```text
Recommended: Base
Reasons:
  ├── Lowest Gas fees
  ├── Coinbase users can deposit fiat directly
  ├── Aerodrome and other native DEXes growing rapidly
  └── Best for $10–1,000 trades and frequent activity
```

### Scenario 3: NFTs and Social Apps

```text
Recommended: Base or Arbitrum Nova
Reasons:
  ├── Base: Farcaster ecosystem, mint.fun
  ├── Arbitrum Nova: designed for low-value, high-frequency activity
  └── Both offer near-zero Gas — ideal for frequent mints and social interactions
```

### Scenario 4: Developers Deploying a DApp

```text
EVM compatibility first: Arbitrum / Optimism / Base
  └── Deploy Solidity directly — full toolchain compatibility

ZK-native capabilities: zkSync / StarkNet
  └── If the project needs ZK proofs or native account abstraction

Multi-chain deployment: OP Stack or Arbitrum Orbit
  └── If the project needs its own app-chain
```

### Scenario 5: Long-Term Asset Holding (Large Amounts)

```text
Recommended: Ethereum L1
Reasons:
  ├── Highest security
  ├── No dependency on any L2's correct operation
  └── Best for "cold storage" of large holdings

Second choice: Arbitrum / Optimism (via official bridge)
  └── If you need to earn DeFi yield on L2
```

### Chain Selection Decision Tree

```text
What do you want to do?
│
├── Hold large assets long-term → Ethereum L1
│
├── Active DeFi trading
│   ├── Large amounts ($1,000+) → Arbitrum
│   └── Small amounts / high frequency → Base
│
├── NFTs / social apps → Base
│
├── Develop a DApp
│   ├── EVM compatibility needed → Arbitrum / Base
│   └── ZK capabilities needed → zkSync / StarkNet
│
└── Cross-chain activity
    ├── L1 ↔ L2 → Official bridge (safest)
    └── L2 ↔ L2 → Across / Stargate (fastest)
```

## Common Pitfalls on L2

### Pitfall 1: Wrapped Token Confusion

```text
The same "USDC" may exist in multiple versions:

On Arbitrum:
  USDC (native)  = issued by Circle via CCTP             ✓ Recommended
  USDC.e (bridged) = bridged from L1 via Arbitrum bridge ⚠ Legacy version

How to tell them apart:
  └── Check the token contract address — confirm it is the Circle official deployment
  └── USDC.e has a different contract address from native USDC
```

Many DeFi protocols support both USDC versions, but their liquidity pools are separate. Always confirm which version you are using.

### Pitfall 2: Running Out of Gas

```text
Common mistake:
  User swaps all ETH for USDC
  → No ETH left to pay Gas
  → Cannot do anything (including swapping back to ETH)

Solutions:
  1. Always keep 0.002+ ETH as a Gas reserve
  2. Use DApps that support Paymaster (common on zkSync)
  3. Withdraw ETH directly from an exchange to L2
```

### Pitfall 3: Sequencer Single Point of Failure

Most L2 sequencers currently run in a centralized configuration:

```text
What happens if the sequencer goes down:

1. No new transactions can be submitted (L2 pauses)
2. Existing funds are not affected
3. Users can exit funds via L1 "force-inclusion" mechanism
   (complex, but available as a last resort)

Real examples:
  - Arbitrum experienced ~1 hour of downtime due to sequencer failure
  - All major L2s are actively working toward sequencer decentralization
```

### Pitfall 4: Misjudging Cross-Chain Timing

```text
Actual wait times when withdrawing from L2 to L1:

Optimistic Rollup (Arbitrum / Optimism / Base):
  Official bridge:      7 days (not "approximately" — strictly 7 days)
  Third-party bridge:   1–20 minutes

ZK Rollup (zkSync / StarkNet):
  Official bridge:      minutes to hours (depends on proof generation)
  Typical experience:   15–60 minutes
```

### Pitfall 5: Unstable RPC Nodes

```text
Problem:  Public RPC nodes can become congested or unresponsive
Symptoms: Stuck transactions, incorrect balance display, connection failures

Solutions:
  1. Add backup RPC nodes in MetaMask
  2. Use professional RPC services: Alchemy, Infura, QuickNode
  3. Arbitrum recommended RPCs:
     - https://arb1.arbitrum.io/rpc     (official)
     - https://arbitrum-one.publicnode.com  (public backup)
     - Private Alchemy / Infura node    (most stable)
```

### Pitfall 6: Token Approval Management Across Chains

```text
Problem:  Using DeFi across many chains generates large numbers of token approvals
Risk:     If a protocol is exploited, your approved tokens may be drained

Best practices:
  1. Use Revoke.cash to audit and revoke approvals
  2. Prefer "exact approval" amounts over unlimited approvals
  3. Periodically clean up approvals for protocols you no longer use
  4. Check each chain separately — approvals do not transfer across chains
```

## Summary

1. **The official bridge is the safest bridging method** (using Arbitrum Bridge as an example): L1→L2 takes ~10 minutes, L2→L1 requires 7 days; third-party bridges are faster but introduce additional trust assumptions.
2. **Adding L2 networks to MetaMask** has three methods: ChainList one-click (easiest), manual parameter entry (most control), DApp auto-prompt (most convenient).
3. **DeFi on L2 already feels close to Web2** — swapping on Uniswap on Arbitrum costs $0.01–0.10 in Gas and confirms in seconds.
4. **Gas fees on L2 are 100–500x lower than L1**, making DeFi viable for users with smaller capital.
5. **Chain selection**: large DeFi positions on Arbitrum, small/frequent activity on Base, long-term holdings on L1, cutting-edge development on zkSync/StarkNet.
6. **Watch out for common pitfalls**: wrapped token confusion, forgetting to reserve Gas, sequencer risk, cross-chain timing assumptions, unstable RPC nodes, and token approval management.

## Further Reading

- [Arbitrum Bridge Official Guide](https://bridge.arbitrum.io/)
- [ChainList: One-Click Network Addition](https://chainlist.org/)
- [L2Fees: Real-Time Gas Fee Comparison](https://l2fees.info/)
- [Revoke.cash: Token Approval Manager](https://revoke.cash/)
- [DefiLlama: Multi-Chain DeFi Data](https://defillama.com/)
- [Uniswap Official Documentation](https://docs.uniswap.org/)
- [MetaMask: How to Add a Custom Network](https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/)
