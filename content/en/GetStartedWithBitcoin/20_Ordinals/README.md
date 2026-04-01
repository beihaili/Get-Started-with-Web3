# Lesson 20: Ordinals and Ecosystem Innovation

![status](https://img.shields.io/badge/Status-Completed-success)
![author](https://img.shields.io/badge/Author-beihaili-blue)
![date](https://img.shields.io/badge/Date-2025--06-orange)
![difficulty](https://img.shields.io/badge/Difficulty-Intermediate-yellow)

> 💡 Imagine if every grain of sand could be engraved with a unique mark, turning it into a one-of-a-kind artwork. The Bitcoin Ordinals protocol is that kind of magic — it lets every satoshi in the Bitcoin network carry data, becoming a digital "collectible."
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Introduction: Why Engrave on Satoshis?](#introduction-why-engrave-on-satoshis)
- [Ordinals Protocol Fundamentals](#ordinals-protocol-fundamentals)
- [Inscriptions Technical Details](#inscriptions-technical-details)
- [Taproot Script Path Storage](#taproot-script-path-storage)
- [Digital Asset Applications](#digital-asset-applications)
- [BRC-20 Token Standard](#brc-20-token-standard)
- [Hands-on: Creating an Inscription](#hands-on-creating-an-inscription)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction: Why Engrave on Satoshis?

Have you ever collected coins? Each coin has a year, a design, and even special commemorative significance. Some antique coins have become extremely valuable because of their historical worth.

Now imagine: if you could "engrave" on every satoshi (Bitcoin's smallest unit) — inscribing images, text, or even mini-games — wouldn't those satoshis become special?

This is the essence of the Ordinals protocol:
- 🎨 **Turn satoshis into canvases**: "Inscribe" various data onto satoshis.
- 🔢 **Number every satoshi**: Each one gets a unique ID.
- 💎 **Create scarcity**: Some satoshis become valuable due to special attributes.
- 🎪 **Enrich the Bitcoin ecosystem**: From "digital gold" to "digital collectibles."

## Ordinals Protocol Fundamentals

### 🎯 What Are Ordinals?

Ordinals is an innovative protocol on Bitcoin that allows creating unique digital assets on the blockchain. It uses Bitcoin's smallest unit, the satoshi, to "inscribe" data — each satoshi can carry additional information.

### 📝 Core Concepts

#### Satoshi Numbering

```
Total Bitcoin supply: 21,000,000 BTC
1 BTC = 100,000,000 satoshis
Total satoshis: 2,100,000,000,000,000

Ordinals assigns a unique number to each satoshi:
- First satoshi: Number 0
- Second satoshi: Number 1
- ...
- Last satoshi: Number 2,099,999,999,999,999
```

#### Rarity Levels

```
Rarity classification:
- Common: Any satoshi
- Uncommon: First satoshi of each block
- Rare: First satoshi of each difficulty adjustment period
- Epic: First satoshi of each halving epoch
- Legendary: First satoshi of each cycle
- Mythic: First satoshi of the genesis block
```

### 🔧 Technical Principles

#### Basic Workflow
```
1. Select target satoshi
2. Create a transaction containing data
3. Inscribe data onto that satoshi
4. The satoshi carries data as it circulates on the blockchain
```

#### Data Storage Method
```
Traditional methods:
- OP_RETURN: 80-byte limit
- Direct script: Expensive

Ordinals method:
- Uses Taproot script paths
- Data stored in witness
- Larger data capacity
- Better privacy
```

## Inscriptions Technical Details

Ordinals uses Taproot's script path feature to store data:

```json
{
  "vin": [
    {
      "witness": [
        "signature",
        "public key",
        "OP_0",
        "OP_IF",
        "OP_PUSHBYTES_3 6f7264",
        "OP_PUSHNUM_1",
        "OP_PUSHBYTES_9 746578742f68746d6c",
        "OP_0",
        "OP_PUSHDATA2 <HTML data>",
        "OP_ENDIF"
      ]
    }
  ]
}
```

### 🔧 Why Taproot for Data Storage?

#### Traditional Method Limitations

**OP_RETURN**: ❌ Obviously a "data storage" transaction, ❌ 80-byte limit, ❌ Expensive, ❌ Poor privacy.

**Direct script**: ❌ Script size limits, ❌ Very expensive, ❌ Inflexible.

#### Taproot's Elegant Solution

**Core idea: "Hide" data in the witness**

| Method | Cost | Privacy | Data Size | Flexibility |
|--------|------|---------|-----------|------------|
| OP_RETURN | High | Poor | 80 bytes | Low |
| Direct script | Very high | Poor | Limited | Low |
| **Taproot** | **Low** | **Good** | **Large** | **High** |

### 🌳 Merkle Root Explained

Taproot addresses have two spending paths:
1. **Key path**: Sign directly with the internal public key (most common).
2. **Script path**: Use script conditions + Merkle proof.

The Merkle tree allows proving a specific script is valid without revealing all scripts — only the used script and its path proof are needed. This is more efficient (fewer bytes), more private (other scripts stay hidden), and cheaper.

## Digital Asset Applications

### 🎨 Digital Art (NFTs)
- Data permanently stored on Bitcoin blockchain
- Truly decentralized
- Immutable
- Scarcity guaranteed

### 🏷️ Domain Names (.sats)
- Based on Ordinals protocol, stored via Taproot
- Supports subdomains, transferable/tradeable

### 📄 Document Storage
- Copyright proof, timestamps, document certification, legal document storage
- Permanent, immutable, decentralized verification

## BRC-20 Token Standard

### 🪙 What Is BRC-20?

BRC-20 is a fungible token standard built on the Ordinals protocol, similar to Ethereum's ERC-20.

#### Token Operations

**Deploy:**
```json
{
  "p": "brc-20",
  "op": "deploy",
  "tick": "PEPE",
  "max": "21000000",
  "lim": "1000"
}
```

**Mint:**
```json
{
  "p": "brc-20",
  "op": "mint",
  "tick": "PEPE",
  "amt": "1000"
}
```

**Transfer:**
```json
{
  "p": "brc-20",
  "op": "transfer",
  "tick": "PEPE",
  "amt": "100"
}
```

### 📊 Market Impact
Notable BRC-20 tokens: PEPE (meme coin), ORDI (Ordinals ecosystem token), and others.

**Advantages**: Based on Bitcoin security, fully decentralized, no smart contracts needed, low fees.

## Hands-on: Creating an Inscription

### 🛠️ Environment Setup

```bash
# Clone Ordinals project
git clone https://github.com/ordinals/ord.git
cd ord

# Build and install
cargo build --release
sudo cp target/release/ord /usr/local/bin/

# Configure Bitcoin Core (bitcoin.conf)
txindex=1
server=1
rpcuser=your_username
rpcpassword=your_password
```

### 📝 Create a Text Inscription

```bash
# Create text to inscribe
echo "Hello Bitcoin! This is my first inscription." > inscription.txt

# Inscribe onto a satoshi
ord wallet inscribe inscription.txt --fee-rate 5
```

### 🖼️ Create an Image Inscription

```bash
# Supported formats: PNG, JPEG, GIF, WebP
# Recommended size: under 4 MB
ord wallet inscribe inscription_image.png --fee-rate 5
```

### 🔗 Create an HTML Inscription

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Bitcoin Inscription</title>
    <style>
        body {
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Hello Bitcoin!</h1>
        <p>This is my first HTML inscription on Bitcoin blockchain.</p>
        <p>Created with ❤️ using Ordinals protocol</p>
    </div>
</body>
</html>
```

```bash
ord wallet inscribe inscription.html --fee-rate 5
```

### 🔍 View and Manage Inscriptions

```bash
# List all inscriptions
ord wallet inscriptions

# Transfer an inscription
ord wallet send <address> <inscription_id>

# View in browser: https://ordinals.com/inscription/<inscription_id>
```

## FAQ

### ❓ Does Ordinals change Bitcoin's nature?
**No!** It doesn't change consensus rules, doesn't add new opcodes — it's purely a data storage method, fully compatible with the existing network.

### ❓ How are Inscriptions different from NFTs?
**Inscriptions**: Data stored directly on the Bitcoin blockchain, truly decentralized, immutable, based on satoshi numbering.
**Traditional NFTs**: Data usually stored on IPFS or elsewhere, dependent on smart contracts, potentially modifiable, based on token IDs.

### ❓ Are BRC-20 tokens safe?
Based on Bitcoin's security, no smart contracts needed, simple and transparent code. **But**: It's a new standard still evolving — choose projects carefully and be aware of price volatility risk.

### ❓ How are Inscription fees calculated?
Fees comprise: base transaction fee + data storage fee + network congestion premium. Affected by data size, network congestion, and priority settings.

## Conclusion

Through this chapter, you've gained deep understanding of Ordinals and Inscriptions technology:
- **Technical principles**: How Taproot stores data.
- **Applications**: Digital art, domains, document storage.
- **BRC-20**: Bitcoin's token standard.
- **Practical operations**: Creating and managing Inscriptions.

Ordinals opens new application domains for Bitcoin, making it not just a payment network but a digital asset platform. It demonstrates Bitcoin technology's flexibility and innovation potential.

> 🌟 **Significance**: Ordinals embodies the Bitcoin community's innovative spirit — opening new possibilities while preserving Bitcoin's core values, making Bitcoin truly the cornerstone of digital assets.

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 Back to Home</a> |
<a href="https://twitter.com/bhbtc1337">🐦 Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 Join the Discussion</a>
</div>
