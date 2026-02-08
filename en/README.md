# Get Started With Web3 — English

[![GitHub stars](https://img.shields.io/github/stars/beihaili/Get-Started-with-Web3)](https://github.com/beihaili/Get-Started-with-Web3/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/beihaili/Get-Started-with-Web3)](https://github.com/beihaili/Get-Started-with-Web3/network/members)
[![GitHub issues](https://img.shields.io/github/issues/beihaili/Get-Started-with-Web3)](https://github.com/beihaili/Get-Started-with-Web3/issues)
[![GitHub license](https://img.shields.io/github/license/beihaili/Get-Started-with-Web3)](https://github.com/beihaili/Get-Started-with-Web3/blob/main/LICENSE)
[![Contributors](https://img.shields.io/github/contributors/beihaili/Get-Started-with-Web3)](https://github.com/beihaili/Get-Started-with-Web3/graphs/contributors)

[**中文版**](../zh/) | English

**The most systematic open-source Bitcoin & Web3 learning platform.** 27 structured tutorials covering everything from Web3 basics to Bitcoin's underlying architecture.

**Online learning platform:** https://beihaili.github.io/Get-Started-with-Web3/

> **Translation Status:** English translations are in progress. The primary content is in Chinese. Contributions to translations are welcome!

---

## Learning Path

Recommended order: **Web3 Quick Start first** -> **then Bitcoin Technical Deep Dive**.

Developers with programming experience can jump directly to the Bitcoin series.

---

## 1. Web3 Quick Start (6 Tutorials)

Start from zero. No programming background required.

| # | Topic | Key Content |
|---|-------|-------------|
| 01 | [Create Your First Web3 Identity](Web3QuickStart/01_FirstWeb3Identity/README.MD) | Wallet setup, address creation, seed phrase backup |
| 02 | [Make Your First Web3 Transaction](Web3QuickStart/02_FirstWeb3Transaction/README.MD) | Transfers, gas fees, transaction confirmation |
| 03 | [Build Your First Web3 DApp](Web3QuickStart/03_FirstWeb3Dapp/README.MD) | Wallet connection, smart contract interaction |
| 04 | [Useful Web3 Websites](Web3QuickStart/04_UsefulWeb3Sites/README.MD) | Block explorers, DeFi tools, information aggregators |
| 05 | [Launch Your First Token](Web3QuickStart/05_LaunchYourFirstToken/README.MD) | Complete ERC-20 token launch process |
| 06 | [Web3 Security Guide](Web3QuickStart/06_Web3Security/README.MD) | Scam identification, asset protection, security best practices |

---

## 2. Bitcoin Technical Deep Dive (21 Tutorials)

Organized by a **5-layer technical architecture**, from cryptographic foundations to ecosystem applications.

```
  Application Layer (15-21)    Wallets, RPC, Script, Ordinals, DeFi
  Consensus Layer  (12-14)     Proof of Work, difficulty adjustment, forks & BIPs
  Network Layer    (09-11)     Bitcoin Core, P2P protocol, network security
  Data Layer       (03-08)     Transactions, multisig, SegWit, Taproot
  Cryptography     (01-02)     Hash functions, digital signatures, ECC, HD wallets
```

> Full architecture diagram and study guide: [Bitcoin Technical Architecture Overview](GetStartedWithBitcoin/README.md)

### Layer 1: Cryptographic Foundations

| # | Topic | Key Content |
|---|-------|-------------|
| 01 | [Cryptography Fundamentals](GetStartedWithBitcoin/01_Cryptography/README.MD) | Hash functions, digital signatures, elliptic curves, HD wallets |
| 02 | [Bitcoin Overview](GetStartedWithBitcoin/02_Overview/README.MD) | Bitcoin's essence, decentralization philosophy |

### Layer 2: Data Layer

| # | Topic | Key Content |
|---|-------|-------------|
| 03 | [Bitcoin Transaction Basics](GetStartedWithBitcoin/03_BitcoinTx/README.MD) | UTXO model, transaction structure & validation |
| 04 | [Multi-Signature Transactions](GetStartedWithBitcoin/04_MultiSig/README.MD) | Multisig mechanisms, security models |
| 05 | [Segregated Witness (SegWit)](GetStartedWithBitcoin/05_SegWit/README.MD) | Transaction data reorganization, capacity optimization |
| 06 | [Taproot Upgrade](GetStartedWithBitcoin/06_Taproot/README.MD) | Schnorr signatures, MAST, privacy improvements |
| 07 | [Advanced Transactions](GetStartedWithBitcoin/07_AdvancedTransactions/README.MD) | Timelocks, complex scripts |
| 08 | [Blockchain Data Structure](GetStartedWithBitcoin/08_DataStructure/README.MD) | Block structure, Merkle trees |

### Layer 3: Network Layer

| # | Topic | Key Content |
|---|-------|-------------|
| 09 | [Bitcoin Core Nodes](GetStartedWithBitcoin/09_BitcoinCore/README.MD) | Running nodes, network participation |
| 10 | [P2P Network Protocol](GetStartedWithBitcoin/10_P2PProtocol/README.MD) | Peer discovery, data propagation & sync |
| 11 | [Network Security](GetStartedWithBitcoin/11_NetworkSecurity/README.MD) | Attack types & defense, privacy protection |

### Layer 4: Consensus Layer

| # | Topic | Key Content |
|---|-------|-------------|
| 12 | [Proof of Work & Mining](GetStartedWithBitcoin/12_ProofOfWork/README.md) | Mining algorithms, hardware evolution, mining pools |
| 13 | [Difficulty Adjustment](GetStartedWithBitcoin/13_DifficultyAdjustment/README.MD) | Dynamic difficulty adjustment, economic incentive balance |
| 14 | [Forks & BIP Process](GetStartedWithBitcoin/14_ForksBIPs/README.MD) | Soft forks vs hard forks, protocol upgrades |

### Layer 5: Application Layer

| # | Topic | Key Content |
|---|-------|-------------|
| 15 | [Bitcoin Wallets](GetStartedWithBitcoin/15_BitcoinWallet/README.MD) | Wallet types, key management |
| 16 | [Bitcoin RPC Development](GetStartedWithBitcoin/16_BitcoinRPC/README.MD) | RPC interface, system integration |
| 17 | [Low-Fee Broadcasting Tool](GetStartedWithBitcoin/17_BitcoinLowFeeBroadcast/README.MD) | Fee optimization, practical tool development |
| 18 | [Bitcoin Script System](GetStartedWithBitcoin/18_BitcoinScript/README.MD) | Stack-based scripting, conditional payments |
| 19 | [Bitcoin Scaling & Governance](GetStartedWithBitcoin/19_BitcoinGovernance/README.MD) | Layer 2, Lightning Network, governance |
| 20 | [Ordinals & Ecosystem Innovation](GetStartedWithBitcoin/20_Ordinals/README.MD) | Inscriptions, BRC-20, NFTs |
| 21 | [DeFi Cross-Chain](GetStartedWithBitcoin/21_DeFiCrossChain/README.MD) | Cross-chain protocols, decentralized finance |

---

## 3. Web3 Thoughts

| Topic | Description |
|-------|-------------|
| [Web3 Principles](Web3Thoughts/01_Principles/README.MD) | Core Web3 ideals and values |
| [Why Blockchain is Necessary](Web3Thoughts/02_WhyBlockchainIsNecessary/README.MD) | Notes on *The Sovereign Individual* |
| [Bitcoin Easter Eggs](Web3Thoughts/03_TheCoolestTransactionOnBitcoin/README.MD) | Hidden gems in the b10c...eb5d transaction |

## 4. Web3 Career

| Topic | Description |
|-------|-------------|
| [Career Opportunities & Interview Tips](Web3WorkOpportunities/README.md) | Web3 job hunting and preparation |

---

## Contributing

We welcome contributions of all kinds:

| Type | Description |
|------|-------------|
| **Content Review** | Review tutorials for technical accuracy |
| **Translation** | Help translate Chinese tutorials to English |
| **Code Examples** | Write runnable companion code |
| **Platform Development** | Improve the React learning platform (React 19 + Vite + Tailwind CSS) |

### How to Contribute

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-contribution`)
3. Commit your changes (`git commit -m 'Add your contribution'`)
4. Push and open a Pull Request

---

## Community

- **Twitter**: [@bhbtc1337](https://twitter.com/bhbtc1337)
- **WeChat Group**: [Join here](https://forms.gle/QMBwL6LwZyQew1tX8)
- **GitHub Issues**: [Report issues](https://github.com/beihaili/Get-Started-with-Web3/issues)

## License

This project is licensed under the [MIT License](../LICENSE).

---

<div align="center">
  <strong>Let's build the best open-source Bitcoin & Web3 learning resource together!</strong>
</div>
