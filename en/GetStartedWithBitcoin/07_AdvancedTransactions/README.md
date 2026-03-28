# Lesson 07: Advanced Transaction Applications

![status](https://img.shields.io/badge/status-complete-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-advanced-red)

> Getting started with `Web3` on your own is no easy task. As someone who recently entered the Web3 space, I've put together the simplest and most intuitive `Web3` beginner's guide. By integrating quality resources from the open-source community, I aim to guide everyone from beginner to expert in Web3. Updated 1-3 lessons per week.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the discussion group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC/ETH/USDT: [Binance](https://www.binance.com/zh-CN) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Introduction](#introduction)
- [Complex Transaction Type Analysis](#complex-transaction-type-analysis)
- [Address Format Evolution](#address-format-evolution)
- [Advanced Transaction Applications](#advanced-transaction-applications)
- [Hands-On: Advanced Transactions](#hands-on-advanced-transactions)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction

In previous chapters, we learned about multisig, SegWit, Taproot, and Ordinals — all core technologies. Now, we'll dive deep into Bitcoin's advanced transaction applications, including complex transaction types, address format evolution, and various advanced transaction scenarios.

This chapter covers the advanced features of Bitcoin's transaction system. These technologies provide the Bitcoin ecosystem with powerful extensibility and flexibility, laying a solid foundation for Layer 2 solutions and other innovative applications.

## Complex Transaction Type Analysis

### OP_RETURN Output (Custom Data Storage)

**Important note**: OP_RETURN is a special type of transaction **output**!

```json
{
  "value": 0.00000000,
  "n": 3,
  "scriptPubKey": {
    "asm": "OP_RETURN 48656c6c6f20426974636f696e",
    "hex": "6a0d48656c6c6f20426974636f696e",
    "type": "nulldata"
  }
}
```

**Analysis**:
- **This is a standard transaction output**, structurally identical to a P2PKH output.
- `value`: 0 BTC (no value transfer, dedicated to data storage).
- `n`: 3 (this is the 4th output of the transaction, indexed from 0).
- **scriptPubKey**: The locking script, here of type OP_RETURN.
- `48656c6c6f20426974636f696e` decodes to "Hello Bitcoin."
- This output **cannot be spent** — the data is permanently stored on the blockchain.

### Bitcoin Transaction Structure Overview

```
Bitcoin Transaction = {
  Transaction Metadata: {
    version: Transaction version
    locktime: Lock time
  }

  Input Array: [
    { txid, vout, scriptSig, sequence },
    { txid, vout, scriptSig, sequence },
    ...
  ]

  Output Array: [                    <- OP_RETURN goes here!
    { value, scriptPubKey },         <- Regular P2PKH output
    { value, scriptPubKey },         <- Multisig P2SH output
    { value, scriptPubKey },         <- OP_RETURN output (data storage)
    ...
  ]
}
```

> **This is how custom data is stored!**
>
> **Common uses**:
> - **Messages**: Attach text messages to transfers
> - **Tags**: Record transaction purpose or category
> - **Document hashes**: Store file hashes as proof of existence
> - **Art**: Some early blockchain art projects
>
> **Limitations**:
> - Maximum **80 bytes** of data
> - Requires a small fee
> - Once on-chain, data cannot be modified or deleted

#### Real-World Case Analysis

Let's look at a real OP_RETURN transaction:

```
Transaction ID: 4b72a223b2d45ea382...
OP_RETURN data: "The blockchain will remember this moment forever! Happy New Year 2024!"
```

The sender of this transaction paid a small fee to permanently record this New Year's greeting on the Bitcoin blockchain. Anyone can view this message through a block explorer, and it will exist on the blockchain forever.

### Other Complex Transaction Types

#### 1. Multi-Output Transactions

```
A single transaction with multiple outputs:
- Main output: Payment to recipient
- Change output: Return to sender
- Data output: OP_RETURN for storing information
- Fee output: Payment to miner
```

#### 2. Batch Transactions

```
Enterprise-level use cases:
- Payroll: One transaction pays multiple employees
- Dividend distribution: Distribute returns to multiple shareholders
- Airdrops: Send tokens to multiple addresses
```

## Address Format Evolution

### Bitcoin Address Format History

| Format | Address Example | Script Type | Characteristics |
|--------|----------------|-------------|----------------|
| Legacy (P2PKH) | 1BoatSLRH... | P2PKH | Original format, best compatibility |
| Script (P2SH) | 3AnNyxwq... | P2SH | Supports multisig and complex features |
| SegWit (Bech32) | bc1q40x77y... | P2WPKH | Lowest fees, most efficient |
| Taproot (Bech32m) | bc1p5d7rj... | P2TR | Latest format, best privacy |

### Technical Evolution Comparison

```
Bitcoin address format evolution:

Legacy (2009):
Address: 1abc...
Features: Basic functionality, larger size

P2SH (2012):
Address: 3abc...
Features: Supports multisig, but poor privacy

SegWit (2017):
Address: bc1qabc...
Features: Reduced fees, solved malleability

Taproot (2021):
Address: bc1pabc...
Features: Best privacy + efficiency + smart contracts
```

### Adoption Statistics

```
Taproot adoption rate:

November 2021 (activation): 0%
2022: 5-10%
2023: 15-25%
2024: 30-40%

Growth drivers:
- Increasing wallet support
- Exchange adoption
- BRC-20 uses Taproot (Ordinals)
- Still in gradual adoption
```

### Address Format Conversion

#### From Legacy to SegWit

```python
def convert_legacy_to_segwit(legacy_address):
    """Convert a Legacy address to a SegWit address"""

    # 1. Extract public key hash from Legacy address
    pubkey_hash = decode_base58(legacy_address)

    # 2. Create SegWit address
    segwit_address = encode_bech32(pubkey_hash, "bc", 0)

    return segwit_address
```

#### From SegWit to Taproot

```python
def convert_segwit_to_taproot(segwit_address):
    """Convert a SegWit address to a Taproot address"""

    # 1. Extract public key hash from SegWit address
    pubkey_hash = decode_bech32(segwit_address)

    # 2. Create Taproot internal key
    internal_key = create_taproot_internal_key(pubkey_hash)

    # 3. Generate Taproot address
    taproot_address = create_taproot_address(internal_key)

    return taproot_address
```

## Advanced Transaction Applications

### 1. Time-Locked Transactions

Bitcoin supports time-based transaction locking:

#### Absolute Timelock (Locktime)
```json
{
  "locktime": 700000,  // Block height or timestamp
  //... other transaction data
}
```

#### Relative Timelock (CheckSequenceVerify)
```
OP_PUSHDATA 144    // Lock for 144 blocks (~24 hours)
OP_CHECKSEQUENCEVERIFY
```

#### Practical Application Scenarios

```
Timelock applications:
1. Will execution: Take effect after a specified time
2. Scheduled payments: Automatically release funds on schedule
3. Escrow services: Automatic release upon expiration
4. Dispute resolution: Provide a time window for disputing parties
```

### 2. Hash Time-Locked Contracts (HTLC)

The foundational building block of the Lightning Network:

```
OP_IF
    OP_HASH160 <hash> OP_EQUALVERIFY
    <pubkey> OP_CHECKSIG
OP_ELSE
    <timeout> OP_CHECKLOCKTIMEVERIFY OP_DROP
    <pubkey> OP_CHECKSIG
OP_ENDIF
```

#### How HTLC Works

```
HTLC flow:
1. Alice creates an HTLC, locking Bitcoin
2. Bob provides the preimage to unlock
3. Or Alice reclaims the funds after timeout

Application scenarios:
- Lightning Network payments
- Cross-chain atomic swaps
- Conditional payments
```

### 3. Atomic Swaps

Core technology for cross-chain transactions:

```
Alice's Bitcoin locking script:
- Provide the preimage of a secret + Bob's signature
- Or Alice can reclaim after timeout

Bob's Litecoin locking script:
- Provide the preimage of the same secret + Alice's signature
- Or Bob can reclaim after timeout
```

#### Atomic Swap Implementation

```python
def create_atomic_swap(secret_hash, recipient_pubkey, timeout):
    """Create an atomic swap script"""

    script = f"""
    OP_IF
        OP_HASH160 {secret_hash} OP_EQUALVERIFY
        {recipient_pubkey} OP_CHECKSIG
    OP_ELSE
        {timeout} OP_CHECKLOCKTIMEVERIFY OP_DROP
        {sender_pubkey} OP_CHECKSIG
    OP_ENDIF
    """

    return script
```

### 4. Conditional Payments

Condition-based smart payments:

```
Condition types:
- Time conditions: Pay after a specific time
- Signature conditions: Specific signers must agree
- Hash conditions: Provide the preimage of a specific hash
- Multi-conditions: Combine multiple conditions
```

### 5. Batch Transactions

Enterprise-level batch operations:

```python
def create_batch_transaction(recipients):
    """Create a batch transaction"""

    outputs = {}
    for recipient in recipients:
        outputs[recipient["address"]] = recipient["amount"]

    # Create a transaction with multiple outputs
    raw_tx = bitcoin_rpc("createrawtransaction", [inputs, outputs])
    return raw_tx
```

## Hands-On: Advanced Transactions

### Creating a Multisig Address

```python
import requests
import json

def bitcoin_rpc(method, params=[]):
    url = "http://localhost:8332"
    headers = {'content-type': 'application/json'}

    payload = {
        "method": method,
        "params": params,
        "jsonrpc": "2.0",
        "id": 0,
    }

    response = requests.post(url, data=json.dumps(payload), headers=headers, auth=('user', 'password'))
    return response.json()

def create_multisig_address():
    # 1. Generate public keys (example)
    pubkeys = [
        "03a1b2c3d4e5f6...",  # Public Key 1
        "03b1c2d3e4f5a6...",  # Public Key 2
        "03c1d2e3f4a5b6..."   # Public Key 3
    ]

    # 2. Create a 2-of-3 multisig address
    result = bitcoin_rpc("createmultisig", [2, pubkeys])

    print(f"Multisig Address: {result['result']['address']}")
    print(f"Redeem Script: {result['result']['redeemScript']}")

    return result['result']

# Execute multisig address creation
multisig_info = create_multisig_address()
```

### Creating a SegWit Transaction

```python
def create_segwit_transaction():
    # 1. Select a SegWit UTXO
    inputs = [
        {
            "txid": "your_segwit_utxo_txid",
            "vout": 0
        }
    ]

    # 2. Create SegWit outputs
    outputs = {
        "bc1qsegwit_address_here": 0.001,  # SegWit address
        "bc1qchange_address": 0.0089       # Change
    }

    # 3. Create raw transaction
    raw_tx = bitcoin_rpc("createrawtransaction", [inputs, outputs])

    # 4. Sign (SegWit automatically handles witness data)
    signed_tx = bitcoin_rpc("signrawtransactionwithwallet", [raw_tx['result']])

    # 5. Broadcast
    if signed_tx['result']['complete']:
        txid = bitcoin_rpc("sendrawtransaction", [signed_tx['result']['hex']])
        print(f"SegWit transaction sent: {txid['result']}")

    return txid['result']
```

### Creating a Taproot Transaction

```python
def create_taproot_transaction():
    # 1. Generate Taproot key pair
    internal_key = generate_taproot_key()

    # 2. Create Taproot address
    taproot_address = create_taproot_address(internal_key)

    # 3. Build the transaction
    inputs = [{"txid": "previous_utxo", "vout": 0}]
    outputs = {
        taproot_address: 0.001,
        "change_address": 0.0089
    }

    # 4. Create and sign the transaction
    raw_tx = bitcoin_rpc("createrawtransaction", [inputs, outputs])
    signed_tx = bitcoin_rpc("signrawtransactionwithwallet", [raw_tx['result']])

    return signed_tx['result']['hex']
```

### Monitoring Complex Transactions

```python
def analyze_transaction(txid):
    """Analyze transaction types and characteristics"""

    # Get transaction details
    tx_info = bitcoin_rpc("getrawtransaction", [txid, True])

    # Analyze input types
    input_types = []
    for vin in tx_info['result']['vin']:
        if 'witness' in vin:
            input_types.append("SegWit/Taproot")
        else:
            input_types.append("Legacy")

    # Analyze output types
    output_types = []
    for vout in tx_info['result']['vout']:
        script_type = vout['scriptPubKey']['type']
        output_types.append(script_type)

    # Analyze transaction features
    features = {
        "input_types": input_types,
        "output_types": output_types,
        "is_segwit": any("witness" in vin for vin in tx_info['result']['vin']),
        "has_op_return": any("nulldata" in vout['scriptPubKey']['type'] for vout in tx_info['result']['vout']),
        "size": len(tx_info['result']['hex']) // 2,
        "weight": calculate_weight(tx_info['result'])
    }

    return features

def calculate_weight(tx):
    """Calculate transaction weight"""

    # Base size
    base_size = len(tx['hex']) // 2

    # Witness size
    witness_size = 0
    for vin in tx['vin']:
        if 'witness' in vin:
            for witness_item in vin['witness']:
                witness_size += len(witness_item) // 2

    # Weight calculation
    weight = base_size * 4 + witness_size

    return weight
```

### Creating an OP_RETURN Transaction

```python
def create_op_return_transaction(message):
    """Create a transaction with OP_RETURN"""

    # 1. Prepare inputs
    inputs = [{"txid": "your_utxo_txid", "vout": 0}]

    # 2. Prepare outputs
    outputs = {
        "change_address": 0.0099,  # Change
        "data": message            # OP_RETURN data
    }

    # 3. Create transaction
    raw_tx = bitcoin_rpc("createrawtransaction", [inputs, outputs])

    # 4. Sign and broadcast
    signed_tx = bitcoin_rpc("signrawtransactionwithwallet", [raw_tx['result']])

    if signed_tx['result']['complete']:
        txid = bitcoin_rpc("sendrawtransaction", [signed_tx['result']['hex']])
        return txid['result']

    return None
```

## FAQ

### How to choose the right address format?

```
Recommendations:

Legacy address:
- Best compatibility
- Higher fees
- Doesn't support new features

P2SH address:
- Supports multisig
- Good compatibility
- Poor privacy

SegWit address:
- Lowest fees
- Highest efficiency
- Solves malleability
- Requires wallet support

Taproot address:
- Best privacy
- Highest efficiency
- Latest features
- Adoption still growing
```

### How secure are time-locked transactions?

```
Security considerations:
- Based on blockchain timestamps
- Immutable
- Automatic execution
- Time must be set correctly
- Network congestion may have an impact
```

### What's the difference between HTLC and atomic swaps?

```
HTLC vs. Atomic Swaps:

HTLC:
- Single-chain conditional payment
- Lightning Network foundation
- Simple conditions

Atomic Swaps:
- Cross-chain exchange
- Built on HTLC
- Complex coordination
```

### How to verify the authenticity of an Inscription?

```python
def verify_inscription(witness_data):
    """Verify the authenticity of an Inscription"""

    # 1. Parse witness data
    signature = witness_data[0]
    internal_key = witness_data[1]
    merkle_proof = witness_data[2]
    script_data = witness_data[3:]

    # 2. Verify Merkle path
    if not verify_merkle_proof(merkle_proof, script_data):
        return False

    # 3. Verify Ordinals format
    if (script_data[0] == "OP_0" and
        script_data[1] == "OP_IF" and
        script_data[3] == "6f7264"):  # "ord"
        return True

    return False
```

### How does Taproot achieve privacy?

Taproot enhances privacy through the following methods:

1. **Script path hiding**: Only the script actually used is revealed when spending.
2. **Signature aggregation**: Multiple signatures look like a single signature.
3. **Address uniformity**: All Taproot addresses have the same format.
4. **Condition hiding**: Complex conditions are hidden in the Merkle tree.

## Conclusion

Through this chapter, you've mastered Bitcoin's advanced transaction features:

- **Complex transaction types**: Understood OP_RETURN and various special outputs.
- **Address format evolution**: Recognized the trajectory of Bitcoin's technical development.
- **Advanced transaction applications**: Learned timelocks, HTLC, atomic swaps, and more.
- **Hands-on practice**: Acquired skills for creating and managing advanced transactions.

These technologies not only enhance Bitcoin's functionality and efficiency but also lay a solid foundation for Layer 2 solutions (like the Lightning Network), DeFi applications, and other innovations.

### The Significance of Technical Evolution

**From Simple to Complex:**
```
2009: Basic P2PKH transactions
2012: P2SH multisig support
2017: SegWit efficiency improvements
2021: Taproot privacy enhancements
2023: Ordinals digital assets
```

**From Singular to Diverse:**
```
Originally: Pure currency transfers
Now: Smart contracts, digital assets, privacy protection
Future: Even more innovative applications
```

### Future Outlook

Bitcoin's technical evolution continues:

1. **Layer 2 development**: Lightning Network, Liquid, etc.
2. **Privacy technology**: CoinJoin, Taproot, etc.
3. **Smart contracts**: More complex scripting capabilities.
4. **Digital assets**: Ordinals, BRC-20, etc.
5. **Cross-chain technology**: Atomic swaps, etc.

### Learning Recommendations

1. **Practice first**: Create different types of transactions hands-on.
2. **Stay current**: Track Bitcoin's latest technical developments.
3. **Understand principles**: Deeply understand the design philosophy behind each technology.
4. **Safety first**: Thoroughly test on testnet before using mainnet.

In the next chapter, "Bitcoin Scaling and Governance," we'll dive deep into Bitcoin's historical technical debates, upgrade mechanisms, and community governance, understanding how these technologies were born and evolved through intense discussions.

> **Bitcoin's Philosophy**: These technical upgrades embody Bitcoin's core values: decentralization, security, privacy, and scalability, while maintaining backward compatibility and progressive development.

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">Home</a> |
<a href="https://twitter.com/bhbtc1337">Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">Join the Community</a>
</div>
