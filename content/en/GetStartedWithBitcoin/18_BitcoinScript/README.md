# Lesson 18: Bitcoin Script System

![status](https://img.shields.io/badge/Status-Completed-success)
![author](https://img.shields.io/badge/Author-beihaili-blue)
![date](https://img.shields.io/badge/Date-2025--09-orange)
![difficulty](https://img.shields.io/badge/Difficulty-Intermediate-yellow)

> 💡 Imagine Bitcoin is a vending machine — you can not only insert coins to buy things but also set various conditions: "only two people turning keys simultaneously can open it," "only usable at a specific time," "must enter the correct password." This is the power of Bitcoin Script — making digital currency programmable.
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Introduction: Bitcoin's Programmable Money DNA](#introduction-bitcoins-programmable-money-dna)
- [Script Language Design Philosophy](#script-language-design-philosophy)
- [Opcode System Explained](#opcode-system-explained)
- [Common Script Patterns](#common-script-patterns)
- [Advanced Script Applications](#advanced-script-applications)
- [Script Security Analysis](#script-security-analysis)
- [Workshop: Writing Bitcoin Scripts](#workshop-writing-bitcoin-scripts)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction: Bitcoin's Programmable Money DNA

Many think Bitcoin is merely "digital cash," but Bitcoin has been programmable since birth. Bitcoin Script is Bitcoin's built-in scripting language, making Bitcoin not just a transfer tool but a programmable digital contract platform.

**Real-world analogies:**
- **Checks**: Can set payee, amount, expiration date.
- **Trusts**: Can set complex fund release conditions.
- **Safe deposit boxes**: Can require multiple keys simultaneously.

**Bitcoin Script capabilities:**
- **Conditional payments**: Funds spendable only when specific conditions are met.
- **Multisignature**: Requires multiple signatures to move funds.
- **Timelocks**: Funds usable only after a specific time.
- **Complex logic**: Combine multiple conditions to create smart contracts.

## Script Language Design Philosophy

### Core Design Principles

```python
class BitcoinScriptDesign:
    def __init__(self):
        self.design_principles = {
            "Determinism": {
                "principle": "Same input produces same output",
                "implementation": "No random number generators allowed",
                "purpose": "Ensure all nodes produce identical results",
                "example": "Cannot access current time as a variable"
            },
            "Simplicity": {
                "principle": "Keep the language simple and verifiable",
                "implementation": "Limited set of opcodes",
                "purpose": "Reduce implementation errors and security vulnerabilities",
                "example": "Only ~100 opcodes"
            },
            "Security": {
                "principle": "Prioritize security over features",
                "implementation": "Dangerous operations disabled",
                "purpose": "Protect network from attacks",
                "example": "Multiplication and string operations disabled"
            },
            "Non-Turing-complete": {
                "principle": "No infinite loops supported",
                "implementation": "No loop structures",
                "purpose": "Prevent infinite execution consuming resources",
                "example": "Cannot write infinite loop programs"
            }
        }

    def script_limitations(self):
        """Script limitation details"""
        return {
            "Disabled opcodes": [
                "OP_CAT: String concatenation (security risk)",
                "OP_SUBSTR: Substring extraction",
                "OP_MUL: Multiplication",
                "OP_RSHIFT: Right bit shift"
            ],
            "Execution limits": [
                "Max script size: 10,000 bytes",
                "Max stack size: 1,000 items",
                "Max opcode count: 201",
                "Max signature verifications: 20"
            ],
            "Design considerations": [
                "Prevent DoS attacks",
                "Ensure fast verification",
                "Maintain network stability",
                "Guarantee forward compatibility"
            ]
        }
```

### Stack-Based Execution Model

```python
class BitcoinScriptStack:
    def __init__(self):
        self.stack = []
        self.alt_stack = []

    def execute_opcode(self, opcode):
        """Execute a specific opcode"""
        if opcode == 'OP_DUP':
            # Duplicate top stack element
            self.stack.append(self.stack[-1])
        elif opcode == 'OP_HASH160':
            # SHA256 + RIPEMD160 hash
            data = self.stack.pop()
            hash_result = self.hash160(data)
            self.stack.append(hash_result)
        elif opcode == 'OP_EQUALVERIFY':
            # Verify top two elements are equal; continue if so, fail if not
            a = self.stack.pop()
            b = self.stack.pop()
            if a != b:
                raise Exception("EQUALVERIFY failed")
        elif opcode == 'OP_CHECKSIG':
            # Verify digital signature
            pubkey = self.stack.pop()
            signature = self.stack.pop()
            result = self.verify_signature(signature, pubkey)
            self.stack.append(b'\x01' if result else b'\x00')

    def demonstrate_p2pkh_execution(self):
        """Demonstrate P2PKH script execution"""
        print("📝 P2PKH Script Execution Demo:")
        print("=" * 40)

        # scriptSig: <signature> <pubkey>
        print("Step 1: Execute input script")
        print("Action: Push signature and public key")
        self.stack = [b'signature', b'pubkey']

        # scriptPubKey: OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG
        print("Step 2: Execute output script")
        print("OP_DUP — Duplicate top element")
        print("OP_HASH160 — Hash the top element")
        print("Push target pubkey hash")
        print("OP_EQUALVERIFY — Verify hashes match")
        print("OP_CHECKSIG — Verify digital signature")
        print("✅ Script execution successful")
```

## Opcode System Explained

### Opcode Categories

```python
def bitcoin_opcodes_reference():
    """Bitcoin opcode reference manual"""
    return {
        "Constants": {
            "OP_0 (OP_FALSE)": "Push empty byte array",
            "OP_1 - OP_16": "Push numbers 1-16",
            "OP_1NEGATE": "Push -1",
            "OP_PUSHDATA1-4": "Push data of various lengths"
        },
        "Stack operations": {
            "OP_DUP": "Duplicate top element",
            "OP_DROP": "Remove top element",
            "OP_SWAP": "Swap top two elements",
            "OP_ROT": "Rotate top three elements left",
            "OP_PICK": "Copy nth element to top",
            "OP_ROLL": "Move nth element to top"
        },
        "Arithmetic": {
            "OP_ADD": "Addition",
            "OP_SUB": "Subtraction",
            "OP_1ADD": "Add 1",
            "OP_1SUB": "Subtract 1",
            "OP_NEGATE": "Negate",
            "OP_ABS": "Absolute value",
            "OP_MIN": "Minimum",
            "OP_MAX": "Maximum"
        },
        "Logic": {
            "OP_NOT": "Logical NOT",
            "OP_BOOLAND": "Logical AND",
            "OP_BOOLOR": "Logical OR",
            "OP_EQUAL": "Equality comparison",
            "OP_EQUALVERIFY": "Equality verify (script fails if not equal)",
            "OP_LESSTHAN": "Less than",
            "OP_GREATERTHAN": "Greater than"
        },
        "Cryptographic": {
            "OP_RIPEMD160": "RIPEMD160 hash",
            "OP_SHA256": "SHA256 hash",
            "OP_HASH160": "SHA256 + RIPEMD160",
            "OP_HASH256": "Double SHA256",
            "OP_CHECKSIG": "Verify ECDSA signature",
            "OP_CHECKMULTISIG": "Verify multisignature"
        },
        "Conditional": {
            "OP_IF": "Conditional branch start",
            "OP_NOTIF": "Inverse conditional branch",
            "OP_ELSE": "Else branch",
            "OP_ENDIF": "End conditional branch",
            "OP_VERIFY": "Verify top is true"
        },
        "Timelocking": {
            "OP_CHECKLOCKTIMEVERIFY": "Verify absolute locktime",
            "OP_CHECKSEQUENCEVERIFY": "Verify relative locktime"
        }
    }
```

## Common Script Patterns

### Standard Script Types

```python
def standard_script_patterns():
    """Standard script pattern analysis"""
    return {
        "P2PKH (Pay-to-Public-Key-Hash)": {
            "locking_script": "OP_DUP OP_HASH160 <pubkey_hash> OP_EQUALVERIFY OP_CHECKSIG",
            "unlocking_script": "<signature> <pubkey>",
            "pros": "Simple, secure, good privacy",
            "address_format": "Addresses starting with 1"
        },
        "P2SH (Pay-to-Script-Hash)": {
            "locking_script": "OP_HASH160 <script_hash> OP_EQUAL",
            "unlocking_script": "<sig1> <sig2> ... <redeemScript>",
            "pros": "Supports complex scripts, shifts complexity to spender",
            "address_format": "Addresses starting with 3"
        },
        "P2WPKH (Pay-to-Witness-PubkeyHash)": {
            "locking_script": "OP_0 <pubkey_hash>",
            "witness_data": "<signature> <pubkey>",
            "pros": "Lower fees, fixes malleability",
            "address_format": "Addresses starting with bc1q"
        },
        "P2TR (Pay-to-Taproot)": {
            "locking_script": "OP_1 <taproot_output>",
            "spending": "Key path or script path",
            "pros": "Best privacy, high efficiency, powerful features",
            "address_format": "Addresses starting with bc1p"
        }
    }
```

## Advanced Script Applications

### Atomic Swap Script (HTLC)

```python
class AtomicSwapScript:
    def create_htlc_script(self):
        """Create Hash Time-Locked Contract (HTLC)"""
        htlc_script = """
        OP_IF
            OP_HASH160 <hash_lock> OP_EQUALVERIFY
            <alice_pubkey> OP_CHECKSIG
        OP_ELSE
            <locktime> OP_CHECKLOCKTIMEVERIFY OP_DROP
            <bob_pubkey> OP_CHECKSIG
        OP_ENDIF
        """
        return {
            "script": htlc_script.strip(),
            "conditions": {
                "Condition 1": "Alice provides the secret preimage to spend immediately",
                "Condition 2": "After timeout, Bob can reclaim the funds"
            },
            "security": [
                "Either swap succeeds completely or rolls back entirely",
                "No scenario where one party gains at the other's expense",
                "Timelock prevents funds from being locked forever"
            ]
        }
```

### Payment Channel Script

```python
class PaymentChannelScript:
    def funding_transaction_script(self):
        """Funding transaction script"""
        # 2-of-2 multisig locks funds
        return "OP_2 <alice_pubkey> <bob_pubkey> OP_2 OP_CHECKMULTISIG"

    def commitment_transaction_script(self):
        """Commitment transaction script (revocable)"""
        return """
        OP_IF
            <bob_pubkey> OP_CHECKSIGVERIFY
        OP_ELSE
            144 OP_CHECKSEQUENCEVERIFY OP_DROP
            <alice_pubkey> OP_CHECKSIG
        OP_ENDIF
        """
        # Immediate spend: Bob can spend with revocation key (penalty)
        # Delayed spend: Alice must wait 144 blocks
```

### Custom Script Scenarios

```python
class BitcoinScriptBuilder:
    def build_escrow_script(self):
        """Build escrow script — 2-of-3 multisig among buyer, seller, arbitrator"""
        return ["OP_2", "buyer_key", "seller_key", "arbitrator_key", "OP_3", "OP_CHECKMULTISIG"]

    def build_digital_will_script(self):
        """Build digital will — owner can use anytime; heir can use after 1 year of inactivity"""
        return [
            "OP_IF",
                "<owner_pubkey>", "OP_CHECKSIG",
            "OP_ELSE",
                "52560", "OP_CHECKSEQUENCEVERIFY", "OP_DROP",  # ~1 year in blocks
                "<heir_pubkey>", "OP_CHECKSIG",
            "OP_ENDIF"
        ]
```

## FAQ

### ❓ Why isn't Bitcoin Script Turing-complete?
**Design considerations:** Prevents infinite loops (DoS attacks), ensures bounded execution time, reduces implementation complexity, and guarantees consensus consistency across all nodes.

### ❓ Can Bitcoin Script implement smart contracts?
**Yes, but with limitations:**
- **Can implement**: Multisig wallets, timelocked payments, hash-locked conditional payments, escrow, atomic swaps, payment channels.
- **Cannot implement**: Complex state management, dynamic data storage, external data feeds (oracles), complex computation, loops/recursion.
- **vs. Ethereum**: Bitcoin Script is simple, secure, limited; Ethereum Solidity is Turing-complete, powerful, complex.

### ❓ How to debug Bitcoin scripts?
- **Bitcoin Core testnet**: Validate scripts in a test environment.
- **Script simulators**: Simulate execution offline.
- **Stack tracing**: Record stack state at each step.
- **Unit testing**: Write test cases to verify logic.

### ❓ Do ordinary users need to learn Bitcoin Script?
- **Normal transfers**: Not at all — wallets handle it automatically.
- **Multisig**: Basic understanding helpful, but tools exist.
- **Advanced applications**: Lightning Network, atomic swaps — good to understand.
- **Developers**: Essential foundational skill.

## Conclusion

Bitcoin Script is the core of Bitcoin's programmability, achieving a clever balance between security and functionality:

### 🏛️ Design Philosophy
- **Security first**: Willing to limit features to ensure security.
- **Simple and reliable**: Achieving reliability through simplicity.
- **Deterministic execution**: Ensuring network consensus consistency.
- **Extensible**: Adding new features through soft forks.

### 🔧 Technical Features
- **Stack-based execution**: Simple, efficient execution model.
- **Limited opcodes**: Carefully selected operation set.
- **Conditional logic**: Supports complex payment conditions.
- **Cryptography integration**: Built-in signature and hash operations.

### 🚀 Practical Value
Mastering Bitcoin Script enables you to: understand Bitcoin transactions at the lowest level, design complex payment conditions and smart contracts, analyze and audit script security, and develop Layer 2 applications.

> 🌟 **Code practice**: Complete script examples for this chapter: [script_examples.py](./script_examples.py)

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 Back to Home</a> |
<a href="https://twitter.com/bhbtc1337">🐦 Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 Join the Discussion</a>
</div>
