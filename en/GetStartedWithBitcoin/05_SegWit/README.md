# Lesson 05: Segregated Witness (SegWit) Technology

![status](https://img.shields.io/badge/status-complete-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Getting started with `Web3` on your own is no easy task. As someone who recently entered the Web3 space, I've put together the simplest and most intuitive `Web3` beginner's guide. By integrating quality resources from the open-source community, I aim to guide everyone from beginner to expert in Web3. Updated 1-3 lessons per week.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the discussion group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC/ETH/USDT: [Binance](https://www.binance.com/zh-CN) [Registration Link](https://accounts.marketwebb.me/register?ref=39797374)

## Table of Contents

- [Introduction: Why Did Bitcoin Need to "Slim Down"?](#introduction-why-did-bitcoin-need-to-slim-down)
- [Transaction Malleability: The Problem of Tampered Packages](#transaction-malleability-the-problem-of-tampered-packages)
- [Segregated Witness: A Clever Separation Technique](#segregated-witness-a-clever-separation-technique)
- [Weight System: Redefining Block "Size"](#weight-system-redefining-block-size)
- [Fee Optimization: Why SegWit Is Cheaper](#fee-optimization-why-segwit-is-cheaper)
- [Technical Implementation: Deep Dive into the SegWit Mechanism](#technical-implementation-deep-dive-into-the-segwit-mechanism)
- [Backward Compatibility: The Wisdom of a Soft Fork](#backward-compatibility-the-wisdom-of-a-soft-fork)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction: Why Did Bitcoin Need to "Slim Down"?

Imagine you run a delivery company, processing tens of thousands of packages daily, but your trucks have a weight limit. As business grows, you face two serious problems:

**Problem 1: Packages are too heavy**
- Each package is 50% goods and 50% various proof documents (receipts, signatures, ID copies, etc.)
- Transport efficiency is low and costs remain high
- Customers complain about expensive shipping

**Problem 2: Package tracking numbers are unstable**
- Package numbers are calculated based on the entire package contents
- Malicious actors can modify the format of proof documents (without affecting validity)
- This causes the tracking number to change, throwing the tracking system into chaos

This was the real situation Bitcoin faced in 2017:
- **Transaction congestion**: The 1 MB block limit caused network congestion
- **Fee spikes**: Fees surged from a few cents to tens of dollars
- **Transaction malleability**: Hindered development of technologies like the Lightning Network

Bitcoin needed a "weight-loss surgery," and that's the origin of Segregated Witness (SegWit).

## Transaction Malleability: The Problem of Tampered Packages

### What Is Transaction Malleability?

Imagine you ship a delivery package:

```
Package contents: A laptop
Package tracking number: ABC123 (calculated from the entire package contents)
Proof documents: Receipt, warranty card, invoice
```

**Malleability attack scenario:**
```
1. You: Ship the package, record tracking number ABC123
2. Malicious courier: Changes the font of the receipt (content unchanged, but appearance differs)
3. Result: Tracking number changes to XYZ789
4. You: Track using ABC123 -> Not found!
5. But: Package contents are completely unchanged, laptop safely delivered
```

**The actual Bitcoin situation:**
```
1. Alice: Sends a transaction, Transaction ID = A1B2C3...
2. Malicious node: Modifies the DER encoding format of the signature
3. Result: Transaction ID changes to D4E5F6...
4. Alice: Queries using A1B2C3 -> Not found!
5. But: The transfer succeeded, Bob received the Bitcoin
```

### The Harm of Malleability

**For regular users:**
- Transaction tracking becomes difficult
- Wallets display errors
- Poor user experience

**For developers:**
- Cannot rely on transaction IDs to build applications
- Lightning Network and other Layer 2 technologies cannot be implemented
- Smart contract functionality is limited

**The mathematical reason:**
```
Traditional TX ID = SHA256(Version + Inputs + Outputs + Locktime + Signature Data)
                                                              ^
                                                     The modifiable part
```

## Segregated Witness: A Clever Separation Technique

### Core Idea: Separate Proof from Content

Continuing the delivery company analogy, SegWit proposed a clever solution:

**SegWit's innovative packaging approach:**
```
Main package: [Laptop + Basic info]
Proof pouch: [Receipt + Signature + ID proof]

Tracking number: Calculated based on main package only
Benefits:
- Modified proof documents don't affect tracking number
- Main package is lighter, more efficient transport
- But everything is still there — no information lost
```

### SegWit Transaction Structure Comparison

**Traditional Transaction:**
```json
{
  "txid": "Calculated including the signature",
  "vin": [{
    "scriptSig": "Signature + Public Key + Other proofs" // Long proof data
  }],
  "vout": [...]
}
```

**SegWit Transaction:**
```json
{
  "txid": "Calculated WITHOUT witness data",
  "vin": [{
    "scriptSig": "Short witness program reference"
  }],
  "vout": [...],
  "witness": [
    ["Signature", "Public Key", "Other proofs"]  // Proof data is "segregated"
  ]
}
```

### What "Segregation" Really Means

**Important Clarification:**
- **Not deletion**: Witness data is still fully stored in the block
- **Not compression**: The data size itself hasn't changed
- **It's separation**: The way data is organized and computed has changed

**Analogy:**
```
Like redesigning the package format:
Before: [Goods + Proof documents] mixed together
After:  [Goods] + [Proof documents] packaged separately

Benefits:
- Goods tracking number is stable (Transaction ID is stable)
- Proof documents use "economy shipping" (Lower fees)
- Overall transport efficiency improves (Increased capacity)
```

## Weight System: Redefining Block "Size"

### Why a New Metric?

SegWit introduced a brand new concept: **Weight**, redefining the "size" limit for blocks.

**Traditional limit:**
```
Maximum block size = 1,000,000 bytes
```

**SegWit's new rule:**
```
Maximum block weight = 4,000,000 weight units

Weight calculation formula:
Weight = (Base transaction data x 4) + (Witness data x 1)
```

### The Clever Design of the Weight System

**Design philosophy: Give different data different "prices"**

```
Base transaction data: 1 byte = 4 weight units (expensive)
Witness data: 1 byte = 1 weight unit (cheap)

Like airline baggage fees:
- Essentials (clothing): Normal price
- Non-essentials (gifts): Discounted price
```

**Practical calculation example:**
```
A simple SegWit transaction:
- Base data: 118 bytes x 4 = 472 weight
- Witness data: 107 bytes x 1 = 107 weight
- Total weight: 579 weight
- Equivalent size: 579 / 4 = 144.75 bytes

Compared to a traditional 225-byte transaction, savings of about 35%!
```

### Deep Dive: Weight Calculation Algorithm

**Complete weight calculation formula:**
```
For each transaction:

if (transaction has witness data):
    base_size = transaction_size - witness_data_size
    witness_size = witness_data_size
    weight = base_size x 4 + witness_size x 1
else:
    weight = transaction_size x 4

block_weight = sum(all transaction weights)
block_weight_limit = 4,000,000
```

**Virtual Size (vSize) concept:**
```
vSize = ceil(weight / 4)

Meaning: The equivalent traditional transaction size
Purpose: Fee calculation and capacity estimation
```

## Fee Optimization: Why SegWit Is Cheaper

### A Revolution in Fee Calculation

**Traditional fee calculation:**
```
Miner Fee = Transaction bytes x Fee rate (sat/byte)

Example: 225-byte transaction x 20 sat/byte = 4,500 sat
```

**SegWit fee calculation:**
```
Miner Fee = Virtual Size (vSize) x Fee rate (sat/vbyte)

Example: 579 weight / 4 = 145 vbytes x 20 sat/vbyte = 2,900 sat

Savings: 4,500 - 2,900 = 1,600 sat (35%)
```

### Savings Across Different Transaction Types

| Transaction Type | Traditional Size | SegWit Weight | vSize | Fee Savings |
|-----------------|-----------------|--------------|-------|-------------|
| Simple transfer | 225 bytes | 579 weight | 145 bytes | 35% |
| 2-of-3 multisig | 400 bytes | 1,312 weight | 328 bytes | 18% |
| Complex script | 500 bytes | 1,400 weight | 350 bytes | 30% |

**Long-term cumulative effect:**
- Individual users: Save tens of dollars annually in fees
- Enterprise users: Save thousands of dollars annually
- Network-wide: Save millions of dollars daily

## Technical Implementation: Deep Dive into the SegWit Mechanism

### Address Format Innovation

**Three SegWit address formats:**

| Format | Prefix | Full Name | Characteristics |
|--------|--------|-----------|----------------|
| P2WPKH | bc1q | Pay to Witness PubKey Hash | Native SegWit, most efficient |
| P2WSH | bc1q | Pay to Witness Script Hash | Native SegWit multisig |
| P2SH-P2WPKH | 3 | SegWit wrapped in P2SH | Compatible with legacy wallets |

### SegWit Transaction Structure Example

**Native SegWit Transaction (P2WPKH):**
```json
{
  "txid": "c3d4e5f6a7b8...",
  "vout": 0,
  "scriptSig": {
    "asm": "",
    "hex": ""
  },
  "witness": [
    "3045022100d1e2f3a4b5c6...",  // Signature
    "0279be667ef9dcbb..."          // Compressed public key
  ],
  "sequence": 4294967293
}
```

**Key observations:**
- **scriptSig is empty**: All proof data is in the witness
- **Witness data**: Contains signature and public key, but doesn't affect the transaction ID
- **Sequence value**: 4294967293 indicates RBF (Replace-By-Fee) support

### Deep Dive: Witness Script Execution

**P2WPKH script execution process:**
```
Traditional P2PKH required scripts:
scriptSig: [Signature] [Public Key]
scriptPubKey: OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG

SegWit P2WPKH simplified:
scriptSig: empty
scriptPubKey: OP_0 <pubkey_hash>
witness: [Signature] [Public Key]

At execution: witness data is treated as P2PKH script execution
```

**Security guarantees:**
- Same signature verification algorithm
- Same cryptographic security
- Only the data organization is different

### Transaction ID Calculation Change

**Technical comparison:**
```
Traditional TX ID calculation:
txid = SHA256(SHA256(complete transaction data))

SegWit TX ID calculation:
txid = SHA256(SHA256(transaction data - witness portion))

Result:
- Modifying witness data does not change txid
- Provides a stable foundation for Layer 2 technologies
- Solves the malleability problem
```

## Backward Compatibility: The Wisdom of a Soft Fork

### Why a Soft Fork?

The Bitcoin network has tens of thousands of nodes, and forcing everyone to upgrade simultaneously is impractical. SegWit achieved an elegant upgrade through a soft fork:

**The clever soft fork design:**
```
Old node sees a SegWit transaction:
"This transaction's output script is OP_0 <data>"
"I don't recognize this new format, but the protocol says this kind of transaction 'anyone can spend'"
"Since someone spent it, it must be valid. I accept it."

New node sees a SegWit transaction:
"This is a SegWit format. I need to verify the witness data"
"Signature is correct, public key matches — transaction is valid"
```

### Adoption Timeline Data

**SegWit adoption timeline:**
```
August 2017: SegWit activated (0% usage)
2018: ~15% usage
2019: ~40% usage
2020: ~60% usage
2024: ~80% usage
```

**Adoption barriers:**
- Wallet software needs updates
- User education and acceptance
- Exchange and service provider migration

### Compatibility Matrix

| Sender | Receiver | Compatible | Fee Efficiency |
|--------|----------|-----------|---------------|
| Legacy | Legacy | Yes | Normal |
| Legacy | SegWit | Yes | Normal |
| SegWit | Legacy | Yes | Partially optimized |
| SegWit | SegWit | Yes | Optimal |

## Practical Application Examples

### Creating a SegWit Address

```python
# Generate a native SegWit address
segwit_address = rpc.getnewaddress("", "bech32")
print(f"SegWit Address: {segwit_address}")

# Address characteristics: starts with bc1q, lowest fees
```

### SegWit Transaction Fee Comparison

```python
# Fee savings calculation
def calculate_fee_savings(traditional_size, segwit_weight, fee_rate):
    traditional_fee = traditional_size * fee_rate
    segwit_fee = (segwit_weight / 4) * fee_rate
    savings = traditional_fee - segwit_fee
    return savings, (savings / traditional_fee) * 100

# Example: Simple transfer
savings, percentage = calculate_fee_savings(225, 579, 20)
print(f"Fee Savings: {savings} sat ({percentage:.1f}%)")
```

## FAQ

### Is SegWit data really stored on the blockchain?

**Absolutely yes!** This is the most common misconception.

```
Misconception: SegWit stores signature data off-chain
Reality: All data is on-chain, only organized differently

Analogy:
What people wrongly think: A delivery package is split and part of it is lost
What actually happens: Repackaged, but everything is on the same truck
```

### Why is witness data "4x cheaper"?

**Design philosophy:**
```
Base transaction data (inputs/outputs): Core information, charged at full price
Witness data (signature proofs): Auxiliary information, discounted rate

Purpose:
1. Incentivize use of the SegWit format
2. Improve overall network efficiency
3. Leave room for future upgrades
```

**Mathematical logic:**
The weight system ensures:
- Legacy transactions: weight = size x 4 (no change)
- New transactions: weight = base x 4 + witness x 1 (better deal)

### How does SegWit solve the block capacity problem?

**Capacity increase mechanism:**
```
Theoretical maximum: 4 MB (if the block only contains witness data)
In practice: 1.7 - 2 MB (mixed transaction types)

Calculation example:
Traditional 1 MB block: ~4,400 transactions
SegWit block: ~6,900 transactions
Increase: ~55%
```

**Why not a 4x increase?**
- Not all transactions use SegWit
- SegWit transactions still have a base data portion
- Real-world mixed usage scenarios

### What impact does SegWit have on the Lightning Network?

**Key role:**
```
The Lightning Network needs:
- Stable transaction IDs to track channel state
- Pre-signed transactions immune to malleability attacks
- Secure fund custody mechanisms

SegWit provides:
- Transaction ID stability
- Fee reduction
- Capacity increase
- A foundation for Layer 2
```

**Technical dependency:**
```
Lightning Network Commitment Transactions:
- Must have stable transaction IDs
- Need to be pre-signed but broadcast later
- Any ID change would break the security model

SegWit solved this fundamental problem!
```

### How to migrate to SegWit?

**Migration strategy:**
```
Individual users:
1. Upgrade wallet software
2. Generate a SegWit address
3. Transfer funds to the SegWit address

Enterprise users:
1. Assess existing system compatibility
2. Validate in test environment
3. Migrate funds in batches
4. Update internal systems
```

**Migration benefits:**
- Immediately enjoy fee discounts
- Higher transaction priority
- Support for future new features

## Conclusion

SegWit technology showcases the Bitcoin community's wisdom and ability to solve complex technical challenges:

### Core Value

- **Problem solving**: Elegantly solved transaction malleability and capacity issues
- **Forward compatibility**: Paved the way for the Lightning Network, Taproot, and more
- **Economic benefit**: Reduced transaction costs for users
- **Technical demonstration**: Proved the viability of soft fork upgrades

### Design Philosophy

SegWit embodies several important design principles:
- **Incremental improvement**: Not a teardown-and-rebuild, but optimizing the existing system
- **Backward compatibility**: Ensuring network stability, avoiding splits
- **Economic incentives**: Driving technology adoption through fee advantages
- **Long-term vision**: Reserving room for future technical development

### Historical Significance

SegWit's successful activation proved that:
- Bitcoin can achieve major upgrades while maintaining decentralization
- The technical community can reach consensus and drive innovation
- Soft forks are an effective way to handle controversial upgrades

When you use a bc1-prefixed SegWit address, you're not just saving on fees — you're participating in a historic technical upgrade. Every SegWit transaction is a contribution to Bitcoin's technological progress.

In the Web3 world, SegWit represents this spirit: through clever technical innovation, we can continuously improve and optimize systems without sacrificing security or decentralization.

> **Complete Code Examples**: For all SegWit operation code implementations covered in this chapter, see: [segwit_examples.py](./segwit_examples.py)

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">Home</a> |
<a href="https://twitter.com/bhbtc1337">Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">Join the Community</a>
</div>
