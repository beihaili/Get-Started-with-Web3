# Lesson 17: Bitcoin Development Tools

![status](https://img.shields.io/badge/Status-Completed-success)
![author](https://img.shields.io/badge/Author-Beihaili-blue)
![date](https://img.shields.io/badge/Date-2024--07-orange)
![difficulty](https://img.shields.io/badge/Difficulty-Intermediate-yellow)

> 💡 Bitcoin network fees constantly fluctuate. When fee rates are at their lowest, it's the perfect time to consolidate "dust" UTXOs in your wallet or even send some "time capsule" transactions. This tutorial will guide you through building a powerful tool that can broadcast **arbitrarily low fee rate** transactions through your own full node.

> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the discussion group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Introduction: Why Send Low-Fee Transactions?](#introduction-why-send-low-fee-transactions)
- [Prerequisites](#prerequisites)
- [Core Principle: Configuring Your Local Node](#core-principle-configuring-your-local-node)
- [Multi-Node Broadcasting & Practical Experience](#multi-node-broadcasting--practical-experience)
- [Security Considerations](#security-considerations)
- [Summary](#summary)
- [Fee Rate Estimation Strategies](#fee-rate-estimation-strategies)
- [RBF (Replace-By-Fee) Detailed Example](#rbf-replace-by-fee-detailed-example)
- [CPFP (Child-Pays-For-Parent) Detailed Example](#cpfp-child-pays-for-parent-detailed-example)
- [UTXO Consolidation Practical Guide](#utxo-consolidation-practical-guide)
- [Transaction Acceleration Service Comparison](#transaction-acceleration-service-comparison)
- [FAQ](#faq)

## Introduction: Why Send Low-Fee Transactions?

Have you ever noticed your Bitcoin wallet full of small, scattered transaction outputs (UTXOs)? These are commonly called "transaction dust." During low-fee periods, we can do some very meaningful things:
- **Consolidate UTXOs**: When fees rise in the future, pre-consolidated UTXOs let you use fewer inputs, paying lower total fees.
- **Improve wallet performance**: Managing many UTXOs burdens wallet software.
- **Seize low-fee windows**: Consolidating during historically low fee periods offers the best cost efficiency.
- **Send "time capsules"**: Broadcast a transaction at minimal cost, waiting for a future moment to be confirmed.

## Prerequisites

- **Bitcoin Core**: Installed and fully synced (**wallet functionality must be enabled**).
- **Python**: `Python 3.8` or higher.
- **Dependencies**:
  ```bash
  pip install python-bitcoinrpc
  ```

## Core Principle: Configuring Your Local Node

To broadcast a transaction with an extremely low fee (e.g., `0.1 sat/vB`), the most reliable and Bitcoin-native method is configuring and using your own full node. This approach, championed by developers like Peter Todd, gives you complete autonomy.

### Step 1: Modify `bitcoin.conf`

1. Locate your `bitcoin.conf` file:
    - **macOS**: `~/Library/Application Support/Bitcoin/`
    - **Linux**: `~/.bitcoin/`
    - **Windows**: `%APPDATA%\Bitcoin\`
2. Add or modify:
    ```ini
    # Set the minimum relay fee your node will accept (units: BTC/kB)
    # 0.000001 BTC/kB equals 0.1 sat/vByte
    minrelaytxfee=0.00000100

    # Ensure wallet functionality is enabled
    disablewallet=0
    ```
3. **Restart Bitcoin Core**.

### Step 2: Write the `low_fee_broadcaster.py` Script

This script's core logic:
1. **Connect to node**: Via RPC to local Bitcoin Core.
2. **Create empty transaction**: Containing only the target address and amount.
3. **Auto-fund matching**: Call `fundrawtransaction` with your desired fee rate (e.g., `0.1 sat/vB`). Bitcoin Core automatically selects UTXOs, calculates exact fees, and creates change.
4. **Sign transaction**: `signrawtransactionwithwallet`.
5. **Local broadcast**: `sendrawtransaction` — your node accepts and relays it.

### Step 3: Run the Script

```bash
# Send 0.00001 BTC at 0.1 sat/vB to a specified address
python3 02_GetStartedWithBitcoin/05_BitcoinUTXOConsolidator/low_fee_broadcaster.py \
--rpc-user your_rpc_user \
--rpc-password 'your_rpc_password' \
--recipient bc1... \
--amount 0.00001 \
--fee-rate 0.1
```

**Success showcase**: We successfully broadcast a `0.1 sat/vB` transaction!

- **Transaction ID**: `4168dadc0759b4daa2134b6791a87370f112b937ee787ce31638f4b3bf04884a`
- **View details**: [https://mempool.space/tx/4168dadc0759b4daa2134b6791a87370f112b937ee787ce31638f4b3bf04884a](https://mempool.space/tx/4168dadc0759b4daa2134b6791a87370f112b937ee787ce31638f4b3bf04884a)

## Multi-Node Broadcasting & Practical Experience

- **Multi-node advantage**: Running multiple geographically distributed full nodes significantly improves low-fee transaction propagation speed and coverage across the network.
- **Acceleration and confirmation**: Even extremely low-fee transactions can be confirmed when the network isn't congested or when certain mining pools fill blocks with low-fee transactions. Low-fee transactions are essentially "lottery tickets" requiring patience.
- **UTXOs won't be permanently locked**: After broadcasting, the relevant UTXOs are temporarily locked. But spending those UTXOs with a normal-fee transaction (RBF) will replace the old one.
- **Advanced tip**: Users with the capability should try multi-node distributed broadcasting for even better results.

## Security Considerations

- ⚠️ **Private key security**: Ensure your `wallet.dat` and RPC credentials are safe. Never expose the RPC port to the public internet.
- 🧪 **Test first**: Strongly recommend testing on `Testnet` or `Regtest` first.
- **Amount thresholds**: Set thresholds carefully during large-scale UTXO consolidation to avoid mistakes.

## Summary

Congratulations! You've mastered how to configure your own full node to gain autonomy over broadcasting arbitrarily low-fee transactions — a true embodiment of Bitcoin's decentralization spirit.

## 📖 Fee Rate Estimation Strategies

### 🔑 Fee Priority and Confirmation Time

| Priority | Fee Range (sat/vB) | Expected Confirmation | Use Case |
|----------|-------------------|----------------------|----------|
| **Ultra-high** | 100+ | Next block (~10 min) | Urgent transfers, time-sensitive purchases |
| **High** | 50-100 | 1-2 blocks (10-20 min) | Moderately urgent |
| **Medium** | 20-50 | 3-6 blocks (30-60 min) | Daily transactions |
| **Low** | 10-20 | 6-24 blocks (1-4 hrs) | Non-urgent transfers |
| **Economy** | 5-10 | 1-3 days | Non-urgent, cost-saving |
| **Ultra-low** | 1-5 | Days to weeks | UTXO consolidation, time capsules |
| **Extreme low** | 0.1-1 | Weeks to months (not guaranteed) | Experimental, fun |

### 🔑 Fee Estimation Methods

1. **mempool.space real-time view**: Visit [mempool.space](https://mempool.space/)
2. **Bitcoin Core RPC query**:
   ```bash
   # Recommended fee for confirmation within 6 blocks (unit: BTC/kB)
   bitcoin-cli estimatesmartfee 6
   # Within 1 block
   bitcoin-cli estimatesmartfee 1
   # Within 144 blocks (~1 day)
   bitcoin-cli estimatesmartfee 144
   ```
3. **Third-party API**:
   ```bash
   curl -s https://mempool.space/api/v1/fees/recommended
   # Returns: {"fastestFee":25,"halfHourFee":20,"hourFee":15,"economyFee":8,"minimumFee":5}
   ```

> 💡 **Tip**: Bitcoin fees fluctuate noticeably throughout the day. Rates are typically lower during UTC early morning (Asia daytime, Americas nighttime) and higher during UTC afternoon/evening (Americas daytime). Weekends are usually cheaper than weekdays.

### 🔑 Factors Affecting Transaction Fees

Total fee = Fee rate (sat/vB) × Transaction size (vB). Size depends on:

| Factor | Impact | Notes |
|--------|--------|-------|
| **Input count** | Each adds ~57-148 vB | More inputs = larger tx = higher fee |
| **Output count** | Each adds ~31-43 vB | More outputs = higher fee |
| **Address type** | Different sizes | SegWit addresses save space vs. Legacy |
| **Script complexity** | Multisig is larger | 2-of-3 multisig costs more than single-sig |

Per-input size comparison by address type:

| Address Type | Prefix | Per-Input Size (approx.) | Savings |
|-------------|--------|------------------------|---------|
| Legacy (P2PKH) | `1...` | 148 vB | Baseline |
| Compatible SegWit (P2SH-P2WPKH) | `3...` | 91 vB | ~38% |
| Native SegWit (P2WPKH) | `bc1q...` | 68 vB | ~54% |
| Taproot (P2TR) | `bc1p...` | 57.5 vB | ~61% |

## 📖 RBF (Replace-By-Fee) Detailed Example

**RBF** allows you to replace an unconfirmed transaction with a higher-fee version — Bitcoin's built-in "acceleration" mechanism.

### 🔑 Prerequisites
- Original transaction must have **RBF signal** set (nSequence < 0xfffffffe)
- Most modern wallets enable RBF by default
- Bitcoin Core enables RBF by default (`-walletrbf=1`)

### 🔑 RBF via Bitcoin Core CLI

**Step 1: Send initial low-fee transaction**
```bash
bitcoin-cli -named sendtoaddress \
  address="bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  amount=0.001 \
  fee_rate=5
# Returns txid, e.g.: a1b2c3d4e5f6...
```

**Step 2: Bump the fee with RBF**
```bash
# Method 1: Simple bumpfee
bitcoin-cli bumpfee "a1b2c3d4e5f6..."

# Method 2: Specify new fee rate
bitcoin-cli -named bumpfee \
  txid="a1b2c3d4e5f6..." \
  options='{"fee_rate": 25}'

# Method 3: Specify target confirmation blocks
bitcoin-cli -named bumpfee \
  txid="a1b2c3d4e5f6..." \
  options='{"conf_target": 3}'
```

> ⚠️ **Important**: When replacing via RBF, the new transaction's total fee must be higher (not just the rate). Each replacement generates a new TXID.

## 📖 CPFP (Child-Pays-For-Parent) Detailed Example

**CPFP** is another acceleration method: create a new child transaction spending the unconfirmed parent's output with a high fee, incentivizing miners to include both.

### 🔑 CPFP vs. RBF Comparison

| Aspect | RBF | CPFP |
|--------|-----|------|
| **Operator** | Sender | Receiver or sender (via change) |
| **Prerequisite** | Original tx must have RBF signal | None |
| **Principle** | Replaces original tx | Child tx incentivizes parent packaging |
| **Fee efficiency** | Higher (replace, not add) | Lower (additional tx fee needed) |
| **TXID** | Original TXID changes | Original TXID preserved |

### 🔑 CPFP Steps

**Scenario**: Alice sends Bob a 1 sat/vB transaction that remains unconfirmed.

```bash
# Bob finds unconfirmed UTXOs
bitcoin-cli listunspent 0 0

# Calculate required child tx fee rate to achieve desired combined rate
# Then spend the unconfirmed output with a high fee
bitcoin-cli -named sendtoaddress \
  address="bc1q_bob_another_address" \
  amount=0.00099 \
  fee_rate=46
```

## 📖 UTXO Consolidation Practical Guide

### 🔑 When to Consolidate

| Situation | Need? | Notes |
|-----------|-------|-------|
| 50+ small UTXOs in wallet | **Yes** | Many small UTXOs cause huge fees during high-rate periods |
| Each UTXO < 10,000 sat | **Strongly recommended** | These "dust" UTXOs may cost more to spend than they're worth |
| Network fees at historic lows | **Best timing** | Lowest consolidation cost |
| Expecting future large transfers | **Yes** | Pre-consolidation saves significant future fees |

### 🔑 Consolidation Cost Analysis (100 UTXOs → 1, Native SegWit)

| Fee Rate (sat/vB) | Tx Size (~vB) | Total Fee (sat) | Total Fee (BTC) | USD Cost (BTC=$100k) |
|-------------------|---------------|-----------------|-----------------|---------------------|
| 1 | 6,881 | 6,881 | 0.00006881 | $6.88 |
| 5 | 6,881 | 34,405 | 0.00034405 | $34.41 |
| 10 | 6,881 | 68,810 | 0.00068810 | $68.81 |
| 50 | 6,881 | 344,050 | 0.00344050 | $344.05 |

### 🔑 Consolidation via Bitcoin Core

```bash
# 1. List current UTXOs
bitcoin-cli listunspent

# 2. Get a new receiving address
bitcoin-cli getnewaddress "" "bech32"

# 3. Send entire balance to new address (auto-selects all UTXOs)
bitcoin-cli -named sendtoaddress \
  address="bc1q_your_new_address" \
  amount=0 \
  subtractfeefromamount=true \
  fee_rate=2
```

### 💡 Strategy Tips
1. **Batch consolidation**: For 500+ UTXOs, consolidate 100-200 at a time.
2. **Selective consolidation**: Prioritize smallest UTXOs; leave large ones alone.
3. **Privacy note**: Consolidation links all UTXOs to one address, reducing privacy.
4. **Regular maintenance**: Build a habit of consolidating during low-fee periods.

## 📖 Transaction Acceleration Service Comparison

### 🔑 Major Acceleration Services

| Service | Provider | Cost | Mechanism | Notes |
|---------|----------|------|-----------|-------|
| **ViaBTC Accelerator** | ViaBTC Pool | Free/Paid | Pool priority packaging | Free tier limited per hour |
| **BTC.com Accelerator** | BTC.com | Paid | Pool priority packaging | Supports BTC and BCH |
| **MARA Slipstream** | Marathon Digital | Free to submit | Accepts non-standard txs | Good for low-fee/special txs |
| **mempool.space Acceleration** | mempool.space | Paid | Via partner mining pools | Intuitive interface |

**Priority order**: RBF first → CPFP second → Acceleration services as last resort.

> 💡 **Tip**: The best strategy is planning ahead — always enable RBF, choose appropriate fee rates based on urgency, and keep change outputs available for CPFP. Prevention is better than cure.

## FAQ

#### ❓ Is this tool safe?
As long as your RPC interface isn't exposed publicly and your private keys are secure, the script is safe. It interacts with your own node via standard RPC to create and sign transactions — private keys never leave your node.

#### ❓ Why modify `minrelaytxfee`?
Each Bitcoin node has a "relay fee" threshold. Transactions below this threshold are rejected. The default is usually `1 sat/vB`. By lowering it to `0.1 sat/vB`, we tell our node: "Hey, these ultra-low-fee transactions are acceptable — please broadcast them."

#### ❓ Can a `0.1 sat/vB` transaction actually be confirmed?
**Yes, but patience is needed.** It's been broadcast and is floating in the vast mempool ocean. When the network isn't congested or when mining pools want to fill blocks, it will be confirmed. This may take days, weeks, or longer — that's the charm of "time capsules."

#### ❓ Will low-fee transactions permanently lock UTXOs?
No. After broadcasting, UTXOs are temporarily locked, but spending them with a normal-fee transaction (RBF) directly replaces the old one. You can experiment freely without worrying about permanent lockup.

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 Back to Home</a> |
<a href="https://twitter.com/bhbtc1337">🐦 Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">🗣️ Join the Discussion</a>
</div>
