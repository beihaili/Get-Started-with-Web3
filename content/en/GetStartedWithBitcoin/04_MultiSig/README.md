# Lesson 04: Multisignature Transactions

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

- [Introduction](#introduction)
- [Multisig Fundamentals](#multisig-fundamentals)
- [Multisig Technical Principles](#multisig-technical-principles)
- [P2SH Multisig](#p2sh-multisig)
- [Enterprise Application Scenarios](#enterprise-application-scenarios)
- [Hands-On: Creating a Multisig Wallet](#hands-on-creating-a-multisig-wallet)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction

In the previous chapter "Bitcoin Transaction Fundamentals," we learned about the basic composition of Bitcoin transactions, the UTXO model, and P2PKH transactions. Now, we'll dive deep into an important feature of the Bitcoin transaction system: Multisignature (MultiSig).

Multisig is an important milestone in Bitcoin's technical development. It not only enhances security but also provides enterprises and institutions with more flexible fund management solutions. This chapter will explain the principles, implementation, and practical applications of multisig in detail.

## Multisig Fundamentals

### What Is Multisig?

Multisignature (MultiSig) is a mechanism that requires multiple private key signatures to spend funds, similar to a bank's joint account or a company's financial approval process.

### Signature Requirements for Different Transaction Types

#### P2PKH (Pay to Public Key Hash) - Single Signature Transaction
```
Previous transaction output: OP_DUP OP_HASH160 <Alice's Public Key Hash> OP_EQUALVERIFY OP_CHECKSIG
Current transaction input: <Alice's Signature> <Alice's Public Key>
```
- **Only 1 signature required**: Because the previous transaction specified "pay to Alice's public key hash"
- **Unlock condition**: Provide the correct public key and corresponding private key signature
- **Use case**: Personal wallet transfers

#### Multisig Transaction - Requires Multiple Signatures
```
Previous transaction output: OP_2 <PubKey1> <PubKey2> <PubKey3> OP_3 OP_CHECKMULTISIG (2-of-3 multisig)
Current transaction input: OP_0 <Signature1> <Signature2> <Redeem Script>
```
- **Requires multiple signatures**: Because the previous transaction specified "requires any 2 signatures out of 3 public keys"
- **Unlock condition**: Must provide a sufficient number of valid signatures
- **Use case**: Enterprise fund management, escrow services, enhanced security

#### Why Do Signature Requirements Differ?

| Transaction Type | Previous TX Locking Condition | Signatures Required | Reason |
|-----------------|-------------------------------|-------------------|--------|
| P2PKH | Pay to a single public key hash | 1 signature | Funds belong to one person |
| 2-of-3 multisig | Requires 2 out of 3 public keys | 2 signatures | Funds require multi-party control |
| 3-of-5 multisig | Requires 3 out of 5 public keys | 3 signatures | Higher security requirements |

> **Key Understanding**: The signature requirement is determined by **the previous transaction's output script**, not arbitrarily chosen!

### Visual Explanation

Think of Bitcoin as a smart safe:

**Regular Safe (P2PKH)**:
```
Someone previously sent Alice a safe labeled: "Only Alice's key can open this"
Now Alice wants to use the money inside — she just needs her key (private key signature)
```

**Multisig Safe (MultiSig)**:
```
Someone previously sent a company a safe labeled: "Requires any 2 of the CEO, CFO, or CTO's keys to open"
Now the company wants to use the money — 2 people must use their keys simultaneously (2 private key signatures)
```

**Key Point**: The safe's unlock rules are **set by the sender when creating the safe**. The recipient must follow the rules to unlock it!

## Multisig Technical Principles

### Deep Dive: Why Does Multisig Need OP_0?

This is one of Bitcoin's most famous technical debts!

**Historical Background**

When Satoshi Nakamoto originally implemented multisig verification, a small mistake was made:

```javascript
// Simplified version of Bitcoin's multisig verification logic
bool CheckMultiSig() {
    //... signature verification logic ...

    // Bug: pops one extra element
    stack.pop();  // This line shouldn't exist

    // Verification result
    return isValid;
}
```

**Solution: Add OP_0**

To compensate for this extra pop operation, a "shim" must be placed on top of the stack:

```
Actual required stack:
[OP_0] [Signature2] [Signature1] [PubKey1] [PubKey2] [PubKey3] [2] [3] [OP_CHECKMULTISIG]
 ^
 This OP_0 is the "shim" that gets consumed by the buggy extra pop
```

**Why Not Fix This Bug?**

1. **Backward compatibility**: Fixing it would invalidate all historical multisig transactions.
2. **Consensus rules**: All nodes must maintain identical verification logic.
3. **Historical cost**: The risk of fixing it far outweighs the benefits.

> **Fun Fact**: This OP_0 still exists in every single multisig transaction to this day, a permanent imprint of Bitcoin's history!

### Multisig Transaction Example

#### Example 1: Multisig Transaction Input
```json
{
  "txid": "b2c3d4e5f6a7...(truncated)",
  "vout": 1,
  "scriptSig": {
    "asm": "OP_0 3045022100a1b2c3...(Signature 1) 3044022067c8d9...(Signature 2)",
    "hex": "00483045022100a1b2c3...473044022067c8d9..."
  },
  "sequence": 4294967295
}
```

**Analysis**:
- `OP_0`: A special multisig requirement (a known Bitcoin bug that requires an extra 0).
- Contains two digital signatures, satisfying the 2-of-3 multisig requirement.
- The previous transaction for this input specified that 2 out of 3 public key signatures are needed.

## P2SH Multisig

### P2SH Output (Supports Complex Scripts)
```json
{
  "value": 0.05000000,
  "n": 1,
  "scriptPubKey": {
    "asm": "OP_HASH160 1234567890abcdef...(20-byte script hash) OP_EQUAL",
    "hex": "a9141234567890abcdef...87",
    "type": "scripthash",
    "address": "3AnNyxwqnDUP7r3jKFaLWcqwYBdXjTPoBe"
  }
}
```

**Analysis**:
- P2SH address starting with `3`.
- Can contain multisig, timelocks, and other complex conditions.
- The script hash hides the actual complex script, improving privacy.

### P2SH vs. Native Multisig

| Property | Native Multisig | P2SH Multisig |
|----------|----------------|---------------|
| **Address format** | Starts with 1 | Starts with 3 |
| **Script visibility** | Script fully exposed | Script hash hidden |
| **Privacy** | Lower | Higher |
| **Compatibility** | Supported by all nodes | Requires P2SH support |
| **Fees** | Higher | Lower |

## Enterprise Application Scenarios

### 1. Corporate Fund Management

```
Typical configuration: 3-of-5 multisig
Participants:
- CEO (primary decision maker)
- CFO (finance lead)
- CTO (technology lead)
- Board Member A
- Board Member B

Use cases:
- Large fund transfers require 3-person approval
- Prevents single points of failure
- Enhanced security
```

### 2. Escrow Services

```
Typical configuration: 2-of-3 multisig
Participants:
- User (fund owner)
- Escrow service provider
- Third-party arbitrator

Use cases:
- User retains partial control
- Escrow provider offers professional management
- Third party intervenes in disputes
```

### 3. Family Finance Management

```
Typical configuration: 2-of-2 multisig
Participants:
- Spouse A
- Spouse B

Use cases:
- Joint management of family funds
- Both parties must agree to spend
- Enhanced family financial security
```

### 4. Cold Wallet Backup

```
Typical configuration: 2-of-3 multisig
Participants:
- Primary wallet
- Backup Wallet A
- Backup Wallet B

Use cases:
- Prevents single points of failure
- Multiple backup protection
- Disaster recovery
```

## Hands-On: Creating a Multisig Wallet

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

### Multisig Transaction Signing Flow

```python
def sign_multisig_transaction(raw_tx, private_keys, redeem_script):
    """
    Sign a multisig transaction
    """

    # 1. Sign with the first private key
    signed_tx1 = bitcoin_rpc("signrawtransaction", [raw_tx, [{"txid": "prev_txid", "vout": 0, "scriptPubKey": "script", "redeemScript": redeem_script}], [private_keys[0]]])

    # 2. Sign with the second private key
    signed_tx2 = bitcoin_rpc("signrawtransaction", [signed_tx1['result']['hex'], [{"txid": "prev_txid", "vout": 0, "scriptPubKey": "script", "redeemScript": redeem_script}], [private_keys[1]]])

    return signed_tx2['result']['hex']

def broadcast_multisig_transaction(signed_tx):
    """
    Broadcast a multisig transaction
    """

    result = bitcoin_rpc("sendrawtransaction", [signed_tx])
    return result['result']
```

### Multisig Wallet Management Tool

```python
class MultiSigWallet:
    def __init__(self, pubkeys, required_signatures):
        self.pubkeys = pubkeys
        self.required_signatures = required_signatures
        self.address = None
        self.redeem_script = None

    def create_wallet(self):
        """Create a multisig wallet"""
        result = bitcoin_rpc("createmultisig", [self.required_signatures, self.pubkeys])
        self.address = result['result']['address']
        self.redeem_script = result['result']['redeemScript']
        return self.address

    def create_transaction(self, outputs):
        """Create a multisig transaction"""
        inputs = [{"txid": "previous_utxo", "vout": 0}]
        raw_tx = bitcoin_rpc("createrawtransaction", [inputs, outputs])
        return raw_tx['result']

    def sign_transaction(self, raw_tx, private_key):
        """Sign a transaction"""
        # Implement signing logic
        pass

    def broadcast_transaction(self, signed_tx):
        """Broadcast a transaction"""
        return bitcoin_rpc("sendrawtransaction", [signed_tx])

# Usage example
pubkeys = ["pubkey1", "pubkey2", "pubkey3"]
wallet = MultiSigWallet(pubkeys, 2)
address = wallet.create_wallet()
print(f"Multisig Address: {address}")
```

## FAQ

### How secure is multisig?

Multisig is more secure than single-signature:

```
Security comparison:

Single-signature risks:
- Private key lost -> Funds permanently lost
- Private key leaked -> Funds stolen

2-of-3 multisig security:
- 1 key lost -> Can still use the other 2
- 1 key leaked -> Attacker still needs another key
- Attacker must obtain 2 keys simultaneously to steal funds
```

### How to choose the right multisig configuration?

| Scenario | Recommended Config | Reason |
|----------|-------------------|--------|
| Personal backup | 2-of-2 | Simple and effective |
| Family finances | 2-of-2 | Requires mutual consent |
| Corporate funds | 2-of-3 or 3-of-5 | Balances security and convenience |
| Escrow service | 2-of-3 | User + provider + arbitrator |
| High security | 3-of-5 or 4-of-7 | Higher security requirements |

### How are multisig transaction fees calculated?

Multisig transaction fees are typically higher than single-signature transactions:

```
Fee comparison:
- Single-signature transaction: ~225 bytes
- 2-of-3 multisig: ~400 bytes
- 3-of-5 multisig: ~500 bytes

Reasons for higher fees:
- More signature data needed
- Redeem script takes up space
- More complex verification logic
```

### How to recover a multisig wallet?

Recovering a multisig wallet requires:

1. **Gather necessary information**:
   - Redeem script
   - Sufficient private keys
   - Transaction history

2. **Rebuild the wallet**:
   ```python
   def recover_multisig_wallet(redeem_script, private_keys):
       # Rebuild wallet using redeem script and private keys
       pass
   ```

3. **Verify funds**:
   - Check UTXO status
   - Verify signing permissions

### What about multisig wallet privacy?

Multisig wallet privacy:

**Advantages**:
- Unified address format (P2SH)
- Script hash hides actual logic

**Disadvantages**:
- Larger transaction size, easier to identify
- Number of signatures reveals multisig configuration

**Improvements**:
- Use Taproot multisig (covered in the next chapter)
- Mix different address types

## Conclusion

Through this chapter, you've mastered the core concepts and technical principles of multisig transactions:

- **Fundamental concepts**: Understood the nature and advantages of multisig
- **Technical principles**: Gained deep knowledge of multisig implementation
- **Application scenarios**: Learned how to choose the right multisig configuration
- **Hands-on practice**: Acquired skills for creating and managing multisig wallets

Multisig is an important milestone in Bitcoin's technical development. It not only enhances security but also provides enterprises and institutions with more flexible fund management solutions.

In the next chapter, "Segregated Witness (SegWit) Technology," we'll learn about another important Bitcoin upgrade: how SegWit solves the transaction malleability problem and improves network efficiency.

> **The Significance of Multisig**: Multisig technology embodies an important Bitcoin principle: achieving decentralized trust mechanisms through technology, making multi-party collaboration secure and reliable.

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">Home</a> |
<a href="https://twitter.com/bhbtc1337">Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">Join the Community</a>
</div>
