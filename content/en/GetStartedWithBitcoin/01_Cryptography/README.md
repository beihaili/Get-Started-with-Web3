# Lesson 01: Bitcoin Cryptography Fundamentals

![status](https://img.shields.io/badge/status-complete-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-advanced-red)

> Imagine having a kind of magic that prevents anyone from forging your signature or secretly tampering with any data. That is the power of cryptography. Bitcoin is built on these "mathematical spells," bringing real-world security to the digital world.
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Introduction: Why Does Bitcoin Need Cryptography?](#introduction-why-does-bitcoin-need-cryptography)
- [Hash Functions: Digital Fingerprints](#hash-functions-digital-fingerprints)
- [Digital Signatures: Proving You Are You](#digital-signatures-proving-you-are-you)
- [Elliptic Curve Cryptography: The Magic of Mathematics](#elliptic-curve-cryptography-the-magic-of-mathematics)
- [Bitcoin Addresses: From Private Key to Receiving Address](#bitcoin-addresses-from-private-key-to-receiving-address)
- [HD Wallets: One Mnemonic to Manage All Assets](#hd-wallets-one-mnemonic-to-manage-all-assets)
- [Security Practices: How to Protect Your Keys](#security-practices-how-to-protect-your-keys)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction: Why Does Bitcoin Need Cryptography?

Imagine I hand you a slip of paper that says "Alice owes Bob 100 dollars." Would you believe it? Probably not, because:
- You don't know if Alice actually wrote it
- Bob might change "100" to "1,000"
- Anyone else could forge an identical note

These are the three fundamental challenges of the traditional digital world: **identity authentication, tamper prevention, and forgery prevention**.

As a digital currency, Bitcoin must solve these problems. But in the online world, with no banks, no governments, and no trusted authorities to vouch for things, what can we do?

The answer is: **use mathematics to create trust**.

Bitcoin relies on three "mathematical spells":
- **Hash functions**: Creating a unique "fingerprint" for every piece of data
- **Digital signatures**: Proving "I am indeed the one who sent this transaction"
- **Elliptic curve cryptography**: Creating mathematically unbreakable "locks"

Together, these mathematical tools create a trust system that requires no centralized institution.

## Hash Functions: Digital Fingerprints

### Why Do We Need Digital Fingerprints?

Every person has a unique fingerprint. In the digital world, we also need to create "digital fingerprints" for every piece of data. Bitcoin uses the SHA-256 hash function to accomplish this.

### The Magical Properties of Hash Functions

Think of a hash function as a "sausage-making machine": you put a whole pig in, and sausages come out. This process has several key properties:

1. **Any input, fixed-length output**: Whether you put in a piglet or an elephant, the sausages are always the same standard size
2. **Same input, same output**: The same pig always produces exactly the same sausages
3. **Tiny change, completely different result**: If the pig is missing a single hair, the resulting sausages are entirely different
4. **One-way and irreversible**: Looking at the sausages, you can never reconstruct what the original pig looked like

### Practical Applications in Bitcoin

**Scenario 1 - Block Linking (The Secret of Tamper Resistance)**

Imagine the blockchain as a series of boxes linked by chains:

```
Block A: [Transaction Data A] -> Hash A: abc123
Block B: [Transaction Data B + abc123] -> Hash B: def456
Block C: [Transaction Data C + def456] -> Hash C: ghi789
```

**Why is it tamper-proof?**
Suppose a hacker wants to modify a transaction in Block A:
1. After modifying Block A, Hash A becomes `xyz999` (remember: tiny change, completely different output)
2. But Block B still records the previous hash as `abc123` — it no longer matches!
3. The hacker must recalculate Block B to get a new Hash B
4. This in turn causes Block C's recorded previous hash to no longer match...
5. Result: to tamper with one block, you must recalculate **all subsequent blocks**

It's like dominoes — move one tile and the rest all fall!

**Scenario 2 - Proof of Work (Mining)**

```
Transaction Data + Random Number (Nonce) -> Hash Value
Goal: Find a random number such that the hash value starts with enough zeros
```

**Why is the answer so hard to find?**
Suppose we require the first 4 digits of the hash to be 0:
- Each attempt with a random number has a probability of 1/16^4 = 1/65,536 of starting with 0000
- On average, about 32,768 attempts are needed to find a qualifying answer
- If we require the first 6 digits to be 0, it takes 16 million attempts!
- Currently, Bitcoin requires the first 19 digits to be 0, requiring quadrillions of attempts

**Why is verification so simple?**
- The miner tells you: "Nonce = 12345678"
- You only need to compute once: Transaction Data + 12345678 -> Hash Value
- Check whether the hash meets the requirement — verified in 1 second

**Mathematical Essence:**
This is what cryptography calls a "trapdoor function":
- Forward computation (verification): Simple and fast
- Reverse computation (searching): Nearly impossible, only brute force works

## Digital Signatures: Proving You Are You

### Traditional World vs. Digital World

In real life, we use **handwritten signatures** to prove identity:
- Your signature is hard for others to perfectly imitate
- Each signature is slightly different, but has consistent characteristics
- A bank teller can verify authenticity by comparing samples

In the digital world, we need **digital signatures**:
- You "sign" with your private key, and no one can forge it
- Each signature is different, but all can be verified
- Anyone can verify the signature's authenticity using your public key

### Public and Private Keys: A Magical Pair of Keys

Digital signatures are based on a clever mathematical principle, like a pair of magic keys:

**Analogy: A Magic Seal**
- You have a **magic seal** (private key) — only you have it, and no one can take it
- This seal corresponds to a **verification template** (public key), which can be shared publicly
- After stamping with the magic seal, only the corresponding verification template can confirm "this was indeed stamped by you"

**How It Works:**
```
Private Key = Your magic seal (absolutely secret)
Public Key = The corresponding verification template (safe to share with anyone)

Signing process: Use the magic seal to "stamp" a message
Verification process: Use the verification template to check "was this stamp yours?"
```

**Key Point**: Even if someone has your verification template, they cannot forge your magic seal!

### The Actual Signing Process

**Step-by-Step Flow:**
```
1. You want to send: Transfer 1 BTC from Alice to Bob
2. Sign this message with your private key
3. Broadcast the message + signature to the network
4. Everyone verifies using your public key:
   - Valid signature = It was indeed sent by Alice
   - Invalid signature = Not sent by Alice, or the message was tampered with
```

**Deep Dive: ECDSA Digital Signature Algorithm**

Bitcoin uses the Elliptic Curve Digital Signature Algorithm (ECDSA). Here's the detailed process:

**Signature Generation:**
```
Input: Message M, Private Key d
1. Compute message hash: h = Hash(M)
2. Generate random number k (different for each signature)
3. Compute point on elliptic curve: (x, y) = k * G
4. Compute first part of signature: r = x mod n
5. Compute second part of signature: s = k^(-1)(h + r * d) mod n
Output: Signature (r, s)
```

**Verification Process:**
```
Input: Message M, Signature (r, s), Public Key P
1. Compute message hash: h = Hash(M)
2. Compute: u1 = h * s^(-1) mod n
3. Compute: u2 = r * s^(-1) mod n
4. Compute point on elliptic curve: (x', y') = u1 * G + u2 * P
5. Verify: Does r = x' mod n hold?
```

**Why is this secure?**
- Without private key d, one cannot compute the correct s value
- The random number k is different for each signature, so even the same message produces different signatures
- But during verification, the mathematical relationship ensures: only the correct private key can produce a signature that passes verification

## Elliptic Curve Cryptography: The Magic of Mathematics

### Why Choose Elliptic Curves?

You may have heard of RSA encryption, which is based on the difficulty of factoring large numbers. Bitcoin chose the more advanced elliptic curve cryptography for a simple reason: **same level of security, much shorter key lengths**.

```
Security Comparison:
RSA 2048 bits ~ Elliptic Curve 256 bits
Like locks of equal strength, but the elliptic curve key is smaller and lighter
```

### secp256k1: Bitcoin's Dedicated Curve

Bitcoin uses an elliptic curve called secp256k1, with a simple equation:
```
y^2 = x^3 + 7
```

It sounds simple, but the mathematical operations on this curve produce cryptographic strength sufficient to protect trillions of dollars in assets.

### The Magic of Elliptic Curves

Imagine the elliptic curve as a magical maze-like billiard table:

**Game Rules:**
- There is a fixed starting point G on the table (everyone knows it)
- You choose a secret number k (e.g., k = 12345) — this is your private key
- Following special "bounce rules," you bounce the ball k times, and it lands at point P
- P is your public key, which you can share with everyone

**Why is it secure?**
- Others can see starting point G and ending point P
- But figuring out how many times you bounced (the value of k) is like:
  - Seeing the final position of a billiard ball
  - Trying to reverse-engineer the entire game
  - This is mathematically nearly impossible!

**Real-World Significance:**
Even if all the world's computers worked together, it would take billions of years to crack a single private key.

**Deep Dive: Elliptic Curve Discrete Logarithm Problem (ECDLP)**

The security of elliptic curves is based on a mathematical hard problem:

**Elliptic Curve Point Addition:**
On the elliptic curve y^2 = x^3 + 7, a special "point addition" is defined:
```
P + Q = R (a three-point relationship on the elliptic curve)
```

**Scalar Multiplication:**
```
k * P = P + P + ... + P (P added k times)
For example: 3 * P = P + P + P
```

**The Mathematical Hard Problem:**
- **Forward is easy**: Given k and P, computing k * P is relatively easy
- **Reverse is hard**: Given P and k * P, finding k is nearly impossible

**Actual Parameters (secp256k1):**
- Private key k: 256-bit random number (approximately 10^77 possibilities)
- Public key P: A point on the elliptic curve
- Generator point G: A fixed standard point

**Security Analysis:**
- The best known attack algorithm (Pollard's rho) requires approximately sqrt(n) operations
- For a 256-bit curve, this requires approximately 2^128 operations
- That's about 10^38 operations — more than the number of atoms in the universe

## Bitcoin Addresses: From Private Key to Receiving Address

### Address Generation: The Art of Layered Cryptography

Going from a private key to a Bitcoin address requires multiple "mathematical transformations":

**Simplified Flow:**
```
Private Key -> Public Key -> Hash -> Encoding -> Address
```

**Detailed Technical Flow (P2PKH Address):**

**Step 1: Private Key Generation**
```
Private Key = 256-bit random number
Example: 0x18e14a7b6a307f426a94f8114701e7c8e774e7f9a47e2c2035db29a206321725
```

**Step 2: Public Key Computation**
```
Public Key Point = Private Key * G (elliptic curve scalar multiplication)
Compressed Public Key = Prefix (02/03) + X-coordinate (32 bytes)
Example: 0350863ad64a87ae8a2fe83c1af1a8403cb53f53e486d8511dad8a04887e5b2352
```

**Step 3: Public Key Hashing**
```
SHA-256(Public Key) -> 32-byte hash
RIPEMD-160(SHA-256 result) -> 20-byte public key hash
Example: 0x010966776006953d5567439e5e39f86a0d273bee
```

**Step 4: Add Network Version**
```
Mainnet P2PKH version prefix: 0x00
Versioned payload = 0x00 + Public Key Hash (20 bytes)
Example: 0x00010966776006953d5567439e5e39f86a0d273bee
```

**Step 5: Compute Checksum**
```
Double SHA-256(Versioned Payload) -> 32 bytes
Checksum = First 4 bytes
Example: 0x445c7a8007
```

**Step 6: Base58 Encoding**
```
Final Payload = Versioned Payload + Checksum
Base58 Encoding(Final Payload) = Bitcoin Address
Example: 16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM
```

### Why So Complex?

Each step adds another layer of protection to your wallet:

- **Steps 1-2 (Elliptic Curve)**: Generate a public key from the private key — foundational security
- **Step 3 (Hash Function)**: "Masks" the public key, providing an extra layer even if the public key is exposed
- **Step 4 (Checksum)**: Like the last digit of an ID number — entering a wrong address gets caught
- **Step 5 (Base58 Encoding)**: Converts raw bytes into human-readable characters (removing easily confused ones like 0, O, I, l)

It's like your house: a front gate, a security door, a room door, plus a house number so others can find you!

### Different Types of Addresses

Bitcoin has three main address formats:

| Format | Prefix | Characteristics |
|--------|--------|-----------------|
| P2PKH | 1 | The most basic address format |
| P2SH | 3 | Supports multisig and complex scripts |
| Bech32 | bc1 | SegWit address, lower fees |

## HD Wallets: One Mnemonic to Manage All Assets

### Pain Points of Traditional Wallets

Early Bitcoin wallets had a problem: each address corresponded to a single private key. If you wanted privacy protection (using a new address for each transaction), you'd need to back up many private keys.

It's like owning 100 houses and needing to carry 100 different keys.

### The Innovation of HD Wallets

Hierarchical Deterministic (HD) wallets solve this problem — like a magical "master key factory":

**The Magic:**
- **One seed** -> grows into **a large tree** (unlimited private keys)
- **12 mnemonic words** -> are that **seed**

**Analogy:**
- Traditional wallet: 100 houses need 100 different keys
- HD wallet: You have a key-making machine that can manufacture any number of keys on demand
- Backup: You only need to back up the machine's "recipe" (the mnemonic)

**Practical Result:** Lose your device? No problem — as long as you have the mnemonic, you can "manufacture" all the keys again!

**Deep Dive: BIP32 Key Derivation Algorithm**

The core of HD wallets is deterministic key derivation. Here's the technical implementation:

**Step 1: From Mnemonic to Seed**
```
Mnemonic -> PBKDF2-SHA512 -> 512-bit Seed
Parameters: 2,048 iterations, salt = "mnemonic" + optional passphrase
```

**Step 2: Generate Master Key**
```
Seed -> HMAC-SHA512(key="Bitcoin seed") -> 64-byte output
Master Private Key = First 32 bytes
Master Chain Code = Last 32 bytes
```

**Step 3: Child Key Derivation (CKD Function)**
For each level in the path, the child key derivation function is used:
```
Input: Parent Private Key, Parent Chain Code, Index i
If i >= 2^31 (hardened derivation):
    Data = 0x00 + Parent Private Key + i (4 bytes)
Else (normal derivation):
    Data = Parent Public Key + i (4 bytes)

Output = HMAC-SHA512(Parent Chain Code, Data)
Child Private Key = (First 32 bytes of output + Parent Private Key) mod n
Child Chain Code = Last 32 bytes of output
```

**Step 4: Path Explanation**
BIP44 standard path: m / 44' / coin' / account' / change / address
```
m/        - Master key
44'       - Hardened, BIP44 standard
coin'     - Hardened, 0 for Bitcoin
account'  - Hardened, account index
change    - 0 = receiving, 1 = change
address   - Address index
```

**Why Use Hardened Derivation?**
- **Security isolation**: Even if a child private key is leaked, other child keys cannot be derived
- **Privacy protection**: Cannot derive sibling public keys from a child public key

### Mnemonic: A Human-Readable Seed

```
Mnemonic Example:
abandon abandon abandon abandon abandon abandon
abandon abandon abandon abandon abandon about

These 12 simple English words contain all the information needed to generate the entire wallet
```

### Key Derivation: Organized Like a Family Tree

HD wallets organize all addresses as clearly as a family tree:

```
Wallet Owner (Master Seed)
  +-- Bitcoin Account (like the family name)
      +-- Receiving Address Family
      |   +-- 1st Receiving Address
      |   +-- 2nd Receiving Address
      |   +-- ...
      +-- Change Address Family
          +-- 1st Change Address
          +-- 2nd Change Address
          +-- ...
```

**Benefits:**
- **Orderly management**: Every address has a clear "ID" (path)
- **Privacy protection**: One set of addresses for receiving, another for change
- **Easy tracking**: Know the purpose and sequence of each address

## Security Practices: How to Protect Your Keys

### The Importance of Randomness

**Bad example**: Using your birthday or phone number as a private key
**Correct approach**: Use a cryptographically secure random number generator

```python
# Bad - Dangerous
private_key = hash("my birthday 19900101")

# Good - Secure
import secrets
private_key = secrets.randbelow(2**256)
```

**Deep Dive: Cryptographically Secure Random Numbers (CSPRNG)**

**Why are ordinary random numbers insecure?**
```python
import random
random.seed(12345)  # Predictable seed
for i in range(5):
    print(random.randint(1, 100))
# Output: 50, 15, 72, 61, 89
# Run again - output is exactly the same! An attacker can predict it
```

**Requirements for Cryptographically Secure Random Numbers:**
1. **Unpredictability**: Even knowing previous outputs, the next one cannot be predicted
2. **Non-reproducibility**: The same program should produce different results on multiple runs
3. **Statistical randomness**: Passes all standard randomness statistical tests

**Operating System Level Entropy Sources:**
```
Linux: /dev/urandom (recommended), /dev/random
Windows: CryptGenRandom API
macOS: arc4random family of functions

Entropy sources:
- Keyboard/mouse input time intervals
- Disk access time jitter
- Network packet arrival times
- Hardware noise (temperature sensors, fan speed, etc.)
```

**Secure Python Implementation:**
```python
import secrets
import os

# Method 1: secrets module (recommended)
secure_key = secrets.randbits(256)

# Method 2: os.urandom
random_bytes = os.urandom(32)  # 32 bytes = 256 bits
secure_key = int.from_bytes(random_bytes, 'big')

# Verify entropy quality
entropy_bits = len(os.urandom(1000)) * 8  # Should be close to 8000
```

### Private Key Storage Hierarchy

1. **Highest security**: Hardware wallets (Ledger, Trezor)
2. **High security**: Generated offline, paper backup
3. **Medium security**: Encrypted software wallets
4. **Low security**: Online wallets
5. **Extremely dangerous**: Screenshots, emails, plaintext cloud storage

### Mnemonic Management Principles

- **Physical backup**: Write it on a waterproof and fireproof metal plate
- **Multi-location storage**: Store copies in 2-3 separate secure locations
- **Regular checks**: Ensure backups are complete and readable
- **No digital storage**: Do not photograph or type into a computer
- **No network transmission**: Do not share via any network

## FAQ

### Can Bitcoin's cryptography be broken?

**Current state**: With current computing power, cracking a single Bitcoin private key would take billions of years
**Quantum computing threat**: Theoretically possible, but:
- Practical quantum computers are still very far away
- Bitcoin can upgrade to quantum-resistant encryption algorithms
- Other systems (banks, governments) face the same threat and will prioritize solutions

### Why can't lost private keys be recovered?

This is the trade-off of Bitcoin's decentralization:
- **No central server**: Nowhere to recover from
- **Mathematics is absolute**: Without the private key, ownership cannot be proven
- **This is also an advantage**: No one can freeze your assets

### What should I do if someone learns my mnemonic?

**Immediate action:**
1. Transfer funds to a new wallet immediately
2. Never use that mnemonic again
3. Check for any other information leaks

**Preventive measures:**
- Ensure a secure environment when generating mnemonics
- Make sure no one is watching during backup
- Regularly check for unusual fund activity

### Can one private key generate multiple addresses?

**Technically**: One private key generates only one corresponding address
**In practice**: HD wallets generate multiple private keys from one seed, each corresponding to a different address
**Privacy tip**: It is recommended to use a new address for each transaction

## Conclusion

Bitcoin's cryptography is not about showing off the beauty of mathematics, but about solving real-world problems:

**Core mission**: Creating trust in a trustless environment
**Tools**: Hash functions, digital signatures, elliptic curve cryptography
**Ultimate goal**: Letting you truly own your property

Once you understand these cryptographic principles, you'll see why Bitcoin is called "digital gold":
- Like gold, it has mathematical scarcity
- Like gold, it doesn't depend on any institution's credit
- Like gold, it can circulate freely around the world

But Bitcoin goes further than gold: it is a programmable, divisible, and remotely transferable digital asset.

In the Web3 world, cryptography protects not only our assets but is the technical foundation of freedom and decentralization. Every hash and every signature embodies the philosophy of "code is law."

> **Complete Code Examples**: For all cryptographic operation code implementations covered in this chapter, see: [crypto_examples.py](./crypto_examples.py)

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">Home</a> |
<a href="https://twitter.com/bhbtc1337">Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">Join the Community</a>
</div>
