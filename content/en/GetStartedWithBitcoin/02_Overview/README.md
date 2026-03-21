# Lesson 02: Bitcoin Overview

![status](https://img.shields.io/badge/status-complete-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2025--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-beginner-brightgreen)

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
- [What Is Bitcoin?](#what-is-bitcoin)
- [What Is the Value of Bitcoin?](#what-is-the-value-of-bitcoin)
- [How Does the Bitcoin System Work?](#how-does-the-bitcoin-system-work)
- [FAQ](#faq)
- [Conclusion](#conclusion)

## Introduction

When you first hear about Bitcoin, you might feel curious, confused, or even skeptical. That's completely normal! Every revolutionary innovation that changes the world faces these challenges in its early days. Just like the early days of the Internet, few people could foresee how it would reshape our world.

Bitcoin is the most successful application of blockchain, bar none. In this introductory article, we will explore the basic concepts of Bitcoin, its sources of value, and how it changes our understanding of money and value.

In this chapter, we'll learn what Bitcoin is, what value it holds, and how it works. Bitcoin is a vast topic, and I'll only provide a brief introduction here, aiming to give beginners a comprehensive foundational understanding. Throughout the article, I'll reference articles by others as extended reading and references.

## What Is Bitcoin?

> "Bitcoin is something entirely new. Like the Internet, Bitcoin has brand-new underlying technology, operating principles, and upper-layer applications. Nothing like it has ever existed in history. Explaining Bitcoin to ordinary people is as difficult as explaining the Internet to people in the 1980s." — Jiang Zhuoer

The mysterious figure Satoshi Nakamoto published a paper titled "Bitcoin: A Peer-to-Peer Electronic Cash System" in 2008. In just 9 pages, it outlined the concept of Bitcoin.

- From a design perspective, Bitcoin was designed as electronic cash with the characteristics of decentralization, verifiability, immutability, and unforgeability. Like real cash, Bitcoin prevents double-spending, is easy to verify for authenticity, and provides a degree of anonymity.
- Bitcoin's most important property is decentralization. Unlike traditional sovereign currencies, Bitcoin has no centralized issuing authority. Bitcoin issuance and management are implemented through algorithms — specifically, through consensus mechanisms. It is this decentralized nature that makes Bitcoin unique, giving it certain store-of-value properties, earning it the nickname "digital gold." Bitcoin's total supply is capped at 21 million, and the annual mining output is determined by the algorithm, making it extremely difficult to tamper with.

For extended reading, I strongly recommend Jiang Zhuoer's article "What Is Bitcoin," which is arguably the best Bitcoin introduction article in the Chinese-speaking world, striving to build a basic Bitcoin framework for readers in a short time from multiple perspectives.

## What Is the Value of Bitcoin?

> "Bitcoin is the first time in human history that technology has been used to achieve the inviolability of private property." — Li Xiaolai

Perspectives on Bitcoin's value generally fall into two categories:

- Bitcoin's value comes from its store-of-value properties, including decentralization, fixed total supply that cannot be inflated, and a degree of anonymity.
- Bitcoin's value comes from its utility, including transaction payments, cross-border remittances, and micro-transactions.

The author tends to agree with the first viewpoint. Here are some supporting statements:

> "Bitcoin, for the first time, guarantees at the technical level that a currency cannot be over-issued."

> "Bitcoin's core application is store of value, and its future goal is to become people's first choice for savings." — ahr999

> "Bitcoin realizes Hayek's theory of currency competition."

Here are some statements supporting the second viewpoint:

> "Bitcoin's value comes from its utility, namely transaction payments." — Jiang Zhuoer

For extended reading, I strongly recommend ahr999's "Hoarding Bitcoin" series.
ahr999's articles are rich in emotion, telling us about Bitcoin's value from a missionary's perspective.

> "What I write is either something I've always believed in or something I've personally experienced. It's the experience and thinking I want to share, and also all the emotion I've poured into Bitcoin." — ahr999

## How Does the Bitcoin System Work?

The Bitcoin system is a publicly verifiable ledger. Bitcoin was designed to be a kind of digital cash, possessing all the advantages of paper money while avoiding the centralization and difficulty of online use inherent in fiat currencies. Below, we'll understand how the Bitcoin system works, why it was designed this way, and what its pros and cons are, by comparing three tiers: the paper money system, the bank account system, and the Bitcoin system.

### How the Paper Money System Works

The government issues paper money, and its value is backed by the government, which can control the money supply by printing more.
Alice wants to give Bob 100 dollars in cash. The process is as follows:

1. Alice checks her wallet and finds she has a 100-dollar bill
2. Alice gives Bob the 100-dollar bill
3. Bob receives the bill, checks its security features to verify its authenticity, and puts it in his wallet

As we can see, the foundation of trust comes from government backing. During the transaction, Alice and Bob don't need to rely on or notify any third party — they only need to verify the bill's authenticity.
The problems are:

1. It depends on physical delivery of cash, making electronic and remote transactions difficult
2. It depends on government backing — the government can control the money supply by printing more

### How the Bank Account System Works

The bank's personal account system is a centralized ledger system, where the bank is responsible for maintaining the ledger and guaranteeing account authenticity.
Alice wants to transfer 100 dollars to Bob. The process is as follows:

1. Alice initiates a transfer request to the bank
2. The bank checks Alice's account balance and confirms she has 100 dollars
3. The bank transfers 100 dollars from Alice's account to Bob's account

As we can see, the foundation of trust comes from the bank. During the transaction, Alice and Bob must rely on the bank.
The problems are:

1. It depends on the bank — you must assume the bank is an honest, non-malicious third party
2. The bank may stop services for various reasons, resulting in frozen accounts
3. The bank may go bankrupt for various reasons, resulting in lost funds

### How the Bitcoin System Works

The Bitcoin system is a decentralized ledger system where the ledger is public and anyone can view all transaction records.
Alice wants to transfer 100 bitcoins to Bob. The process is as follows:

1. Alice initiates a transfer request, signs the transaction with her private key (think of it as a password), and broadcasts it to the Bitcoin network.
2. Bitcoin network nodes propagate Alice's transaction, with each node independently verifying whether Alice's transaction signature is correct (for details, see public-key cryptography), and upon passing, recording the transaction in their own ledger.
3. Through the Proof of Work mechanism, a node is randomly selected as the block-producing node, which packages Alice's transaction into a block and adds it to the blockchain.
4. Other nodes verify the block's validity, and if verification passes, they add the block to their own blockchain.
5. After 6 block confirmations, Bob can confirm he has received 100 bitcoins.

As we can see, the foundation of trust comes from public-key cryptography and the assumption that most nodes operate honestly based on economic incentives.

1. Compared to the paper money system, the Bitcoin system enables electronic and remote transactions while retaining the advantage of not requiring a third party during the transaction.
2. Compared to the bank account system, the Bitcoin system doesn't require reliance on a bank, doesn't require assuming the bank is honest, and doesn't need to worry about service interruptions or bankruptcy. However, Bitcoin also has drawbacks, such as slow transaction speeds and high fees.

For extended reading, I strongly recommend the book *Mastering Bitcoin*. Andreas Antonopoulos provides a detailed and comprehensive explanation of Bitcoin's operating principles from a technical developer's perspective.

> "This book is intended primarily for coders. If you can use a programming language, this book will teach you how cryptographic currencies work, how to use them, and how to develop software that works with them. The first few chapters are also suitable as an in-depth introduction for non-coders — those trying to understand the inner workings of Bitcoin and cryptocurrencies."

## Bitcoin Historical Timeline

Bitcoin has experienced countless milestone events from its birth to today. Below is a detailed historical timeline to help you understand Bitcoin's development trajectory.

| Date | Event | Significance |
|------|-------|-------------|
| October 31, 2008 | Satoshi Nakamoto publishes the whitepaper "Bitcoin: A Peer-to-Peer Electronic Cash System" | The concept of Bitcoin is formally proposed for the first time |
| January 3, 2009 | Satoshi Nakamoto mines the Genesis Block (Block 0) | The Bitcoin network officially launches; the block contains a Times headline |
| January 12, 2009 | First Bitcoin transaction: Satoshi sends 10 BTC to Hal Finney | Bitcoin's first peer-to-peer transfer |
| May 22, 2010 | Laszlo Hanyecz buys two pizzas for 10,000 BTC | Bitcoin's first real-world commercial transaction, later known as "Bitcoin Pizza Day" |
| July 2010 | Mt.Gox exchange founded | The first major Bitcoin exchange, ushering in the exchange era |
| February 2011 | Bitcoin price reaches $1 for the first time | Bitcoin achieves parity with the US dollar for the first time |
| November 28, 2012 | **First halving**: Block reward drops from 50 BTC to 25 BTC | Bitcoin's deflationary mechanism takes effect for the first time |
| November 2013 | Bitcoin price surpasses $1,000 for the first time | Bitcoin begins to enter the mainstream consciousness |
| February 2014 | Mt.Gox exchange hacked, declares bankruptcy | Industry security wake-up call, driving improved exchange security standards |
| 2015 | Ethereum mainnet launches | Smart contract platform emerges, expanding the blockchain ecosystem |
| July 9, 2016 | **Second halving**: Block reward drops from 25 BTC to 12.5 BTC | Supply continues to tighten, price subsequently enters a bull market |
| August 1, 2017 | Bitcoin Cash (BCH) hard fork | A major event in the block size debate |
| December 2017 | Bitcoin price approaches $20,000; CME launches Bitcoin futures | Wall Street formally enters the Bitcoin market |
| 2018 | Crypto market undergoes a major correction | "Crypto winter" filters out the true builders |
| May 11, 2020 | **Third halving**: Block reward drops from 12.5 BTC to 6.25 BTC | Kicks off a new bull market cycle |
| October 2020 | PayPal announces support for buying and selling Bitcoin | A traditional payment giant embraces Bitcoin |
| February 2021 | Tesla announces purchase of $1.5 billion in Bitcoin | A landmark event in public companies holding Bitcoin at scale |
| June 2021 | El Salvador makes Bitcoin legal tender | The world's first country to adopt Bitcoin as legal currency |
| November 2021 | Bitcoin price reaches all-time high of approximately $69,000 | Bull market peak driven by institutional adoption |
| November 2021 | Taproot upgrade activated | Improves privacy and smart contract capabilities |
| January 2023 | Ordinals protocol released | Bitcoin NFT ecosystem begins to flourish |
| January 2024 | US SEC approves spot Bitcoin ETF | A milestone fusion of traditional finance and Bitcoin |
| April 20, 2024 | **Fourth halving**: Block reward drops from 6.25 BTC to 3.125 BTC | The most recent halving, further tightening supply |
| December 2024 | Bitcoin price surpasses $100,000 | New high driven by continued institutional buying and ETF inflows |

> **Tip**: Every major event in Bitcoin's history has validated its design philosophy to some degree. Understanding history not only helps you grasp Bitcoin but also keeps you rational in the face of market volatility.

## Supply Mechanism Explained

Bitcoin's total supply of 21 million is one of its most core economic features. Bitcoin gradually releases new coins through a "block reward halving" mechanism, halving approximately every 4 years (210,000 blocks).

### Halving Schedule

| Halving | Approx. Year | Block Height | Block Reward (BTC) | Daily Output (BTC) | Cumulative Supply (approx.) | % Mined |
|---------|-------------|-------------|-------------------|-------------------|---------------------------|---------|
| Initial | 2009 | 0 | 50 | 7,200 | 0 | 0% |
| 1st | 2012 | 210,000 | 25 | 3,600 | 10,500,000 | 50.0% |
| 2nd | 2016 | 420,000 | 12.5 | 1,800 | 15,750,000 | 75.0% |
| 3rd | 2020 | 630,000 | 6.25 | 900 | 18,375,000 | 87.5% |
| 4th | 2024 | 840,000 | 3.125 | 450 | 19,687,500 | 93.75% |
| 5th | ~2028 | 1,050,000 | 1.5625 | 225 | 20,343,750 | 96.875% |
| 6th | ~2032 | 1,260,000 | 0.78125 | 112.5 | 20,671,875 | 98.4375% |
| ... | ... | ... | ... | ... | ... | ... |
| Final | ~2140 | 6,930,000 | 0 | 0 | 21,000,000 | 100% |

> **Important Note**: By around 2140, all bitcoins will have been mined. At that point, miners' income will depend entirely on transaction fees. This is also an important topic in discussions about Bitcoin's long-term security model.

### The Significance of Supply Scarcity

- **Deflationary property**: Unlike fiat currencies, Bitcoin's supply decreases over time, making it a deflationary asset
- **Predictability**: Anyone can precisely calculate Bitcoin's supply at any point in time
- **Lost bitcoins**: An estimated 3-4 million bitcoins are permanently inaccessible due to lost private keys, so actual circulating supply is far less than the total
- **Stock-to-Flow ratio**: After each halving, Bitcoin's stock-to-flow ratio increases dramatically, theoretically driving up scarcity value

## Comparison with Traditional Finance

One of the best ways to understand Bitcoin is to compare it with familiar traditional financial instruments.

| Dimension | Bitcoin | Traditional Bank Deposits | Gold |
|-----------|---------|--------------------------|------|
| **Issuing body** | None (algorithmic issuance) | Central bank | Natural output (mining) |
| **Supply cap** | 21 million | Unlimited (can be increased) | Earth's reserves are limited but exact amount unknown |
| **Inflation/Deflation** | Deflationary (halving mechanism) | Inflationary (central bank monetary policy) | Slow inflation (~1.5% mined annually) |
| **Transaction speed** | ~10 min/block confirmation | Instant to days (cross-border) | Physical delivery takes time |
| **Transaction fees** | Variable ($1-$50+) | Low or free (domestic) / High (cross-border) | High transport and storage costs |
| **Storage method** | Digital storage (private key) | Bank account | Physical safekeeping / vault |
| **Portability** | Extremely high (mnemonic is all you need) | Dependent on banking system | Low (physically heavy) |
| **Divisibility** | Smallest unit: 1 satoshi = 0.00000001 BTC | Smallest unit: $0.01 | Difficult to divide precisely |
| **Censorship resistance** | High (permissionless) | Low (government can freeze) | Medium (physical is hard to seize but regulatable) |
| **Privacy** | Pseudonymous (addresses are public but not directly linked to identity) | Low (real-name system) | High (physical transactions are anonymous) |
| **Uptime** | 24/7/365 year-round | Business hours on weekdays | Depends on market trading hours |
| **Entry barrier** | No barrier (just need Internet) | Requires ID and bank approval | Requires physical purchase channel |
| **History** | Since 2009 | Hundreds of years | Thousands of years |
| **Volatility** | High | Very low | Low to medium |

> **Tip**: There is no perfect asset class. Bitcoin's advantages lie in decentralization and digital scarcity, but its price volatility is also higher than traditional assets. Reasonable asset allocation should be based on individual risk tolerance.

## Halving Cycle Explained

The Bitcoin halving cycle is not just a technical event — it's an economic cycle that affects the entire crypto market.

### Economic Impact of Halvings

Each halving means miners receive 50% less in block rewards, directly impacting Bitcoin's supply side:

1. **Supply shock**: The daily amount of newly mined Bitcoin is halved; if demand remains constant or grows, the price should theoretically rise
2. **Miner cost pressure**: Halved rewards mean sharply reduced miner income; inefficient miners may be forced to exit, and network hashrate may temporarily decline
3. **Market expectations**: Halving events are highly predictable, and the market typically prices them in advance

### Market Performance Around Past Halvings

| Halving Date | Price at Halving (approx.) | Highest Price Within 1 Year After (approx.) | Increase |
|-------------|---------------------------|---------------------------------------------|----------|
| November 2012 | $12 | $1,100 | ~9,000% |
| July 2016 | $650 | $2,500 | ~285% |
| May 2020 | $8,700 | $64,000 | ~636% |
| April 2024 | $64,000 | $108,000+ | ~69%+ |

> **Important Note**: Historical data does not represent future performance. The market environment is different for each halving; do not blindly rely on historical patterns for investment decisions.

### Four Phases of the Halving Cycle

The Bitcoin market cycle can typically be divided into four phases:

1. **Accumulation phase**: 12-18 months before halving, price oscillates at the bottom, smart money starts positioning
2. **Uptrend phase**: 6-18 months after halving, the supply tightening effect gradually manifests, price enters a major upswing
3. **Mania phase**: Late bull market, market sentiment is extremely optimistic, price may rise parabolically
4. **Correction phase**: After the bubble bursts, a deep pullback of 50-80% from the peak, entering a bear market

## Bitcoin Ecosystem Participants

Bitcoin is not just a digital currency — it's an ecosystem maintained by multiple participants. Understanding each participant's role helps you comprehend the Bitcoin network more completely.

### Miners

Miners are the core maintainers of the Bitcoin network. They contribute computing resources to:

- **Verify transactions**: Check the validity of each transaction (correct signatures, sufficient balance)
- **Package blocks**: Bundle verified transactions into new blocks
- **Compete for block production**: Compete for the right to produce blocks through Proof of Work (PoW), earning block rewards and transaction fees
- **Secure the network**: The massive hashrate makes attacking the Bitcoin network prohibitively expensive

Currently, Bitcoin miners are concentrated in regions with cheap electricity, using specialized ASIC mining machines. Major mining pools include Foundry USA, AntPool, F2Pool, ViaBTC, and others.

### Full Node Operators

Full nodes are computers running complete Bitcoin software and storing the entire blockchain:

- **Independent verification**: Full nodes independently verify every transaction and block, trusting no third party
- **Store the ledger**: Preserve the complete transaction history from the Genesis Block to the present (~600+ GB)
- **Propagate transactions**: Receive and relay new transactions and blocks
- **Enforce consensus**: "Vote" on the network's direction by running Bitcoin protocol rules

> **Tip**: Running a full node is the best way to participate in Bitcoin's decentralized governance. Even if you're not a miner, running a full node means you're helping maintain the network's decentralization and security.

### Developers

Bitcoin's core developer community is responsible for maintaining and improving the Bitcoin protocol:

- **Bitcoin Core**: Bitcoin's reference implementation, maintained by hundreds of open-source contributors
- **Protocol upgrades**: Major upgrades like SegWit and Taproot go through rigorous community discussion and testing
- **BIP process**: Bitcoin Improvement Proposals (BIPs) are the standardized process for protocol changes
- **Auditing and security**: Developers continuously audit the code to ensure robust network operation

### Exchanges

Exchanges are the bridge connecting Bitcoin to the traditional financial world:

- **Fiat on-ramp**: Allow users to buy and sell Bitcoin using fiat currency
- **Price discovery**: Exchange order books are the primary mechanism for Bitcoin price formation
- **Liquidity**: Provide sufficient liquidity to make large transactions possible
- **Derivatives**: Offer futures, options, and other financial derivatives

Major exchanges include Binance, Coinbase, OKX, Kraken, and others.

> **Important Note**: Exchanges are fundamentally centralized custodial institutions. Storing Bitcoin on an exchange long-term means giving up control of your private keys. Remember: `Not Your Keys, Not Your Coins`.

### Regular Users

Regular users are the ultimate beneficiaries and users of the Bitcoin ecosystem:

- **Holders (HODLers)**: Hold Bitcoin long-term as a store of value
- **Traders**: Buy and sell during market volatility
- **Payment users**: Use Bitcoin for everyday payments (via the Lightning Network and similar solutions)
- **Developers/Entrepreneurs**: Build new applications and services on Bitcoin

The Bitcoin network's value ultimately derives from its user count and usage frequency — the **network effect**.

## Bitcoin vs. Traditional Assets

| Dimension | Bitcoin | Gold | Fiat Currency (USD) |
|-----------|---------|------|---------------------|
| **Supply cap** | 21 million, hardcoded | Earth's reserves are limited but minable | Unlimited, central banks can print endlessly |
| **Inflation mechanism** | Halves every 4 years, gradually deflationary | Annual production ~1.5%-2% | Varies by country's monetary policy |
| **Divisibility** | 1 BTC = 100 million satoshis | Physically difficult to divide | Smallest unit is a cent |
| **Portability** | Only need a private key to carry any amount | Heavy, inconvenient for large amounts | Electronic transfers are convenient; cash is not |
| **Verification cost** | Anyone can run a node to verify | Requires specialized equipment | Depends on banking system |
| **Cross-border transfer** | 10-60 minutes, no borders | Physical transport is time-consuming | 1-5 business days, subject to regulation |
| **Censorship resistance** | Cannot be frozen by a single entity | Can be confiscated by government | Accounts can be frozen |
| **Storage cost** | Nearly zero | Safe/vault fees | Bank accounts may have maintenance fees |
| **History** | Since 2009 (~16 years) | Thousands of years | Hundreds of years |

> **Tip**: Bitcoin is often called "digital gold," but it far surpasses gold in divisibility, portability, and verifiability.

## Bitcoin Halving Cycle In-Depth

The halving mechanism is the core of Bitcoin's economic model. Every 210,000 blocks produced (~4 years), the block reward halves:

| Halving | Time | Block Height | Block Reward | New BTC per Period | Cumulative Supply |
|---------|------|-------------|-------------|-------------------|------------------|
| Initial | 2009.01 | 0 | 50 BTC | 10,500,000 | 10,500,000 |
| 1st | 2012.11 | 210,000 | 25 BTC | 5,250,000 | 15,750,000 |
| 2nd | 2016.07 | 420,000 | 12.5 BTC | 2,625,000 | 18,375,000 |
| 3rd | 2020.05 | 630,000 | 6.25 BTC | 1,312,500 | 19,687,500 |
| 4th | 2024.04 | 840,000 | 3.125 BTC | 656,250 | 20,343,750 |
| 5th | ~2028 | 1,050,000 | 1.5625 BTC | 328,125 | 20,671,875 |
| ... | ... | ... | ... | ... | ... |
| Final | ~2140 | — | 0 BTC | 0 | 21,000,000 |

**Economic Impact of Halvings**:

- **Supply shock**: Halved miner output means 50% less new supply entering the market
- **Historical price trend**: After each of the first four halvings, Bitcoin reached an all-time high within 12-18 months
- **Miner game theory**: After halving, inefficient miners exit; network hashrate temporarily drops then gradually recovers
- **Long-term deflation**: Current annual inflation rate is already below 1%, far lower than most fiat currencies

> **Note**: History does not guarantee the future. Price increases after halvings are not guaranteed. Invest cautiously.

## Bitcoin Ecosystem Participants

The Bitcoin ecosystem is collaboratively maintained by multiple roles:

### Miners
- Secure the network through computational power
- Package transactions and compete for block production
- Earn block rewards and transaction fees
- Major pools: Foundry USA, Antpool, F2Pool, ViaBTC

### Full Node Operators
- Independently verify all transactions and blocks
- Store the complete blockchain data (600+ GB)
- Enforce consensus rules, rejecting invalid blocks
- Approximately 20,000+ full nodes globally

### Developers
- Maintain core clients like Bitcoin Core
- Drive protocol upgrades through BIPs (Bitcoin Improvement Proposals)
- Develop wallets, explorers, and ecosystem tools
- Core contributors include hundreds of volunteer developers

### Exchanges and Service Providers
- Provide fiat-to-Bitcoin exchange channels
- Offer custody, lending, and financial services
- Serve as the primary entry point for regular users to access Bitcoin

### Regular Users
- Use Bitcoin for storing value and making payments
- Run light nodes or use SPV wallets
- Give the Bitcoin network value through holding and usage

## FAQ

#### What is the main difference between Bitcoin and traditional currencies (like USD)?

The main differences between Bitcoin and traditional currencies are:

1. **Issuance mechanism**: Bitcoin is issued through algorithms and network operation, free from any central authority; traditional currencies are issued by central banks
2. **Supply cap**: Bitcoin's total supply is fixed at 21 million and cannot be increased outside the protocol; traditional currencies can be printed at government discretion
3. **Transaction mechanism**: Bitcoin transacts directly through a peer-to-peer network without intermediaries; traditional currencies typically require financial intermediaries like banks

#### What is Proof of Work?

Proof of Work (PoW) is the consensus algorithm used by the Bitcoin network, which ensures system security through competitive computation.

#### Do I need to mine to get Bitcoin?

No. The main ways to acquire Bitcoin are:

1. **Exchange purchase**: Buy Bitcoin with fiat currency on exchanges like Binance or OKX
2. **Peer-to-peer trading**: Acquire Bitcoin directly from other holders through P2P transactions
3. **Accept as payment**: Provide goods or services and accept Bitcoin as payment

While mining is one way to obtain Bitcoin, due to increasing mining difficulty, it now requires significant professional equipment and low-cost electricity to be profitable.

## Conclusion

Learning about Bitcoin is a necessary journey for every Web3 beginner. Bitcoin brings us not just a new type of currency, but a completely new financial paradigm — one where value can be securely exchanged and stored without trusting centralized institutions.

Bitcoin's design philosophy is simple and elegant, yet it solves a fundamental challenge in the history of human finance. As Satoshi Nakamoto inscribed in the first block: "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks" — Bitcoin's creation was a rebellion against the flaws of centralized financial systems, a revolution granting ordinary people financial autonomy.

<div align="center"> <img src="./img/1.png" width = 600 /> </div>

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">Home</a> |
<a href="https://twitter.com/bhbtc1337">Follow the Author</a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">Join the Community</a>
</div>
