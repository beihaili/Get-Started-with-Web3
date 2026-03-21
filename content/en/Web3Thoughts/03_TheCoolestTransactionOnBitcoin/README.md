# A Guide to Blockchain Easter Eggs: What "Memes" Did b10c...eb5d Play?

> **In the Bitcoin world, some transactions are more than just transactions -- they are multi-layered Easter eggs of technology, history, and culture. This article walks you through all the hidden details behind the legendary Easter egg transaction b10c...eb5d.**

![](https://img.shields.io/badge/Author-CloseArk-blue)
![](https://img.shields.io/badge/Difficulty-Hardcore%20Deep%20Dive-red)
![](https://img.shields.io/badge/Category-Bitcoin%20Transactions-green)
![](https://img.shields.io/badge/Status-Archived-purple)

## Preface: When a Transaction Becomes Art

Every transaction on the blockchain is usually a simple transfer of funds. But within the Bitcoin ecosystem, occasionally some masterfully crafted "Easter egg transactions" appear -- leveraging protocol details, historical events, technical curiosities, and cultural memes to create artworks that belong to Bitcoin maximalists.

The b10c...eb5d transaction is exactly such a masterpiece.

---

## Core Easter Eggs at a Glance

| Easter Egg Type | Example | Description |
| :-------------: | :--------------------: | :------------------------------: |
| Block Height Meme | 850000 | Corresponds to the 850,000 BTC stolen from Mt.Gox |
| Timestamp Meme | 1231006505 | Genesis block timestamp |
| TXID Vanity | b10c0000...eb5d | A tribute to developer b10c |
| Witness Vanity | Multiple leading 0s | Rare low-difficulty hashes |
| Full Script Type Collection | P2PK ~ P2TR | Covers nearly all Bitcoin script types in history |
| Input Amount Easter Eggs | e.g., 6102, 1913, 2140 | Correspond to historical events and vulnerability IDs |
| Output Amount Easter Eggs | 576, 546, 582, etc. | Various dust limit boundary values |
| nSequence Easter Eggs | e.g., 20090103, 21000000 | Major Bitcoin milestone dates |
| Signature Length Grinding | 71 ~ 57 bytes | Achieved extreme compression via signature grinding |
| SIGHASH Full Collection | ALL, NONE, SINGLE, etc. | All signature hash modes used |
| OP_RETURN Easter Eggs | OP_PUSHNUM_1 ~ 16 | OP_RETURN packed with PUSH instructions |
| Public Key Mix | Compressed & Uncompressed | Early vs. modern public key format showcase |
| Historical Public Key Tributes | Hal Finney, vanity public keys, etc. | Multiple historical public key replicas |
| Merkle Tree Depth | 21-layer classic transactions | Rare Taproot Merkle Easter egg depth record |

---

## Detailed Appreciation

### 1. Embedding Historical Key Information

| Item | Content | Background |
| :---------------------- | :--- | :------------- |
| **850000** | Block height | Number of BTC stolen from Mt.Gox |
| **LockTime=1231006505** | Timestamp | Time the genesis block was mined |
| **b10c...eb5d** | TXID | Vanity TXID as b10c developer signature |

---

### 2. The Complete Script Type Collection: A Bitcoin Evolution Timeline

| Script Type | Origin | Description |
| :-------------- | :---------------- | :-------------------- |
| P2PK | Earliest era | 2009 early mining legacy |
| P2PKH | Mainstream adoption | "Bitcoin address" standard |
| P2SH | BIP16 | Introduced multisig, complex scripts |
| P2WPKH / P2WSH | BIP141 (SegWit) | New low-fee standard |
| P2TR | Taproot | Latest protocol upgrade |
| OP_RETURN | Memo purposes | Easter eggs, data embedding |
| SegWit v1 2-byte anchor | Ephemeral Anchors | Experimental minimal witness program |

---

### 3. The Stories Behind the Amounts

| Amount | Historical Reference | Description |
| :------------------ | :---------- | :----------- |
| 6102 | Ban on private gold ownership | U.S. Executive Order of 1933 |
| 1913 | Federal Reserve established | Birth of the U.S. dollar system |
| 2140 | Bitcoin's last halving | Bitcoin's ultimate deflation |
| 9001 | Dragon Ball meme | It's over 9000! |
| 5139 / 3220 / 17144 | Bitcoin security vulnerability IDs | System vulnerability retrospective |
| 8149 | SegWit implementation PR | GitHub code evolution |
| 19953 | Taproot implementation PR | Taproot soft fork implementation |

---

### 4. nSequence Fun Encoding

| Value | Source | Meaning |
| :------------------- | :------ | :---------------------------- |
| 20090103 | Genesis block date | |
| 20081031 | White paper publication date | |
| 19750504 | Satoshi's self-reported birthday | |
| 21000000 | Bitcoin total supply | |
| 0xdeadbeef | Magic number | Common debug symbol |
| 0xf9beb4d9 | Bitcoin network magic number | |
| 16 / 141 / 341 / 342 | BIP numbers | P2SH, SegWit, Taproot, Tapscript |

---

### 5. Signature Grinding & SIGHASH Full Achievement Unlocked

- Shortest signature length: 57 bytes.
- Signature grinding technique: signature grinding + special r-values.
- SIGHASH modes used: the full collection.

---

### 6. Cultural Easter Egg: The 5/7 Meme

- P2TR uses a 5-of-7 multisig structure as an Easter egg.
- Origin: A Facebook meme where someone rated the movie *Fight Club* as a perfect 5/7.

<div align="center">
  <img src="./img/57.jpg" style="zoom:42%;" />
</div>

---

### 7. Historical Public Key Memorial

- Genesis block coinbase public key.
- Block height 9 coinbase public key.
- Hal Finney's first transaction public key.
- First Taproot transaction vanity public key.
- White paper hash SHA-256 as the internal key.

---

### 8. Merkle Tree Depth 21 -- A Bitcoin History Museum

| Classic Transaction | Brief Description |
| :------------ | :------------- |
| Genesis Block | The starting point of Bitcoin |
| First Transaction | Satoshi -> Hal |
| Pizza Transaction | 10,000 BTC for pizza |
| BIP-30 Duplicate TXID | Protocol vulnerability |
| F2Pool Giant Transaction | Validation performance challenge |
| 291 BTC Astronomical Fee | Highest fee record |
| White Paper Embedded Transaction | Technology and belief |
| Rickroll | Easter egg culture |
| SHA1 Bounty Crack | Cryptography challenge |

(Partial list abbreviated)

---

## Summary: The True Bitcoin Hacker Spirit

> **"The b10c...eb5d transaction is like a grand Easter egg feast in Bitcoin history, condensing protocol history, vulnerability evolution, cultural memes, and cryptographic geek spirit into a single TXID."**

Beyond the technical details, it is more like a **cryptographic monument** written for all Bitcoiners -- a kind of romance that can only be fully appreciated by those who have earnestly studied the Bitcoin protocol and culture.

---

## References

- [b10c...eb5d played which "memes"?](https://justloseit.top/b10ceb5d%E7%8E%A9%E6%A2%97)
- [Analysis of 0xB10C's weird bitcoin transaction](https://stacker.news/items/593226)
- [Definitive explanation of my weird Bitcoin transaction](https://stacker.news/items/600187)
- [On anyone-can-spend Pay-to-Taproot outputs before activation](https://b10c.me/blog/007-spending-p2tr-pre-activation)
- [Ephemeral anchors](https://bitcoinops.org/en/topics/ephemeral-anchors)
- [Value overflow incident](https://en.bitcoin.it/wiki/Value_overflow_incident)
- [What does the special form of the base point of secp256k1 allow?](https://crypto.stackexchange.com/questions/60420/what-does-the-special-form-of-the-base-point-of-secp256k1-allow)
- [The Megatransaction: Why Does It Take 25 Seconds?](https://rusty.ozlabs.org/2015/07/08/the-megatransaction-why-does-it-take-25-seconds.html)

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 Back to Home</a> |
<a href="https://mempool.space/tx/b10c0000004da5a9d1d9b4ae32e09f0b3e62d21a5cce5428d4ad714fb444eb5d">🔗 View Full Transaction</a>
</div>
