# Web3 Exchange Guide — Centralized Exchange (CEX) Comprehensive Guide

![status](https://img.shields.io/badge/Status-Completed-success)
![author](https://img.shields.io/badge/Author-beihaili-blue)
![date](https://img.shields.io/badge/Date-2025--06-orange)
![difficulty](https://img.shields.io/badge/Difficulty-Beginner-brightgreen)

> 💡 Teaching yourself `Web3` isn't easy. As someone who recently got started with Web3, I've put together the simplest and most straightforward beginner's tutorial. By integrating quality open-source community resources, I hope to guide everyone from beginner to expert in Web3. Updated 1-3 lessons per week.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)

## 📖 Introduction

> "Centralized exchanges are the first stop for most people entering the crypto world, and the most important bridge connecting fiat currency and cryptocurrency."

Welcome to Lesson 7 of the Web3 Quick Start series — the Centralized Exchange (CEX) Comprehensive Guide!

If you've completed the previous lessons, you already understand wallets, on-chain transactions, DApps, and security fundamentals. But in practice, the **very first step** for most users to access cryptocurrency is through a centralized exchange. Whether converting fiat to crypto or performing daily trading, CEXes play an indispensable role.

In the Web3 world, while decentralization is the core philosophy, **centralized exchanges remain the most mature and convenient entry point today**. Understanding how CEXes work and learning to use them safely is a required course for every Web3 beginner.

🚀 **Important Note**: This lesson is for educational purposes only and does not constitute investment advice. Cryptocurrency trading involves risk — please make sure you fully understand the risks before trading.

### 🎯 Learning Objectives

After completing this lesson, you will be able to:
- ✅ Understand how centralized exchanges work, and the core differences between CEX and DEX
- ✅ Master the complete KYC identity verification process and key considerations
- ✅ Learn basic spot trading operations: order placement, chart reading, and order management
- ✅ Confidently perform deposits and withdrawals, avoiding asset loss from selecting the wrong network
- ✅ Build a comprehensive security framework for your exchange account

## 📚 Exchange Types Compared: CEX vs DEX

Before diving into CEX, let's understand the differences between the two main exchange types.

### 🏦 What Is a Centralized Exchange (CEX)?

A **Centralized Exchange (CEX)**, as the name suggests, is a cryptocurrency trading platform operated by a centralized company or organization. It works similarly to a traditional stock exchange:

```
User registers → Completes identity verification (KYC) → Deposits funds → Trades on the platform
```

**Key CEX characteristics**:
- **Custodial**: The exchange holds user assets on their behalf
- **Matching engine**: The exchange matches buy and sell orders
- **Fiat on-ramp**: Supports bank transfers, credit cards, and other fiat payment methods
- **Customer support**: Provides human customer service

### 🌐 What Is a Decentralized Exchange (DEX)?

A **Decentralized Exchange (DEX)** runs entirely on the blockchain, executing trades automatically through smart contracts with no intermediary.

**Key DEX characteristics**:
- **Non-custodial**: Users control their own private keys and assets
- **Automated Market Maker (AMM)**: Trades through liquidity pools rather than order books
- **Permissionless**: Anyone can use it without registration
- **Fully transparent**: All transactions are verifiable on-chain

### 📊 Detailed Comparison

| Dimension | CEX (Centralized Exchange) | DEX (Decentralized Exchange) |
|----------|---------------------------|------------------------------|
| **Operator** | Company/Organization | Smart contracts run autonomously |
| **Asset Custody** | Exchange holds assets | Users hold their own assets |
| **Registration** | KYC identity verification required | Just connect a wallet |
| **Fiat On-Ramp** | Supports bank/credit card | Usually not supported |
| **Trading Speed** | Extremely fast (milliseconds) | Depends on block confirmation time |
| **Trading Fees** | Lower (0.02%-0.1%) | Higher (includes gas fees) |
| **Trading Depth** | Deep, low slippage | Depends on liquidity pool size |
| **Security Risk** | Exchange hack/rug pull | Smart contract vulnerabilities |
| **Privacy** | Low (real-name system) | High (anonymous trading) |
| **Token Variety** | Curated, relatively fewer | Anyone can list, many more |
| **Customer Support** | Human support available | Usually none |
| **Regulatory Compliance** | Regulated by various countries | Currently less regulated |
| **Best For** | Beginners, large-volume traders | Experienced DeFi users |
| **Examples** | Binance, OKX, Coinbase | Uniswap, dYdX, Jupiter |

> 💡 **Tip**: For Web3 beginners, we recommend **starting with a CEX** to learn basic trading operations, then gradually exploring DEXes. The two aren't mutually exclusive — they're complementary tools.

### 🤔 When to Use CEX vs DEX?

**Recommended CEX scenarios**:
```
💰 Fiat on-ramp/off-ramp (buying or selling crypto for fiat)
📈 Large-volume trades (good liquidity, low slippage)
🔄 Frequent trading (fast execution, low fees)
🆕 Getting started (user-friendly interface, customer support)
```

**Recommended DEX scenarios**:
```
🔐 Want full control over your assets
🪙 Trading newly launched or niche tokens
🌾 Participating in DeFi farming and liquidity provision
🕵️ Prioritizing trading privacy
```

## 🔐 KYC Process Explained

### What Is KYC?

**KYC (Know Your Customer)** is a compliance process required by financial institutions to prevent money laundering, terrorist financing, and other illegal activities. On centralized exchanges, KYC is a mandatory step.

### 📋 Verification Levels

Most exchanges divide KYC into multiple levels, with different trading permissions at each level:

| Level | Required Information | Trading Access | Withdrawal Limit |
|-------|---------------------|---------------|-----------------|
| **Level 0** | Email registration only | Browse market data | No withdrawals |
| **Level 1** | Name + ID number | Small trades | Low (e.g., 2 BTC/day) |
| **Level 2** | ID photo + facial recognition | Full trading access | Medium (e.g., 100 BTC/day) |
| **Level 3** | Address proof + video verification | Advanced features + large trades | High/Unlimited |

> ⚠️ **Note**: Different exchanges may have different verification levels and limits. The above is just a common pattern — please refer to your specific exchange's requirements.

### 📝 Complete KYC Process

**Step 1: Prepare Documents**
```
📄 Valid ID document (national ID / passport / driver's license)
📱 Phone number (for receiving verification codes)
📧 Email address (we recommend using a dedicated email)
🖥️ Stable internet connection
📷 Clear document photos (pay attention to lighting and angle)
```

**Step 2: Submit Basic Information**
```
1. Register and log in to the exchange
2. Navigate to "Identity Verification" or "KYC Verification"
3. Fill in your real name, nationality, and ID number
4. Fill in your residential address (some exchanges require this)
```

**Step 3: Upload Document Photos**
```
1. Take a photo of the front of your ID → Ensure all corners are visible and text is clear
2. Take a photo of the back of your ID → Same clarity requirements
3. Some exchanges require a selfie holding your ID
```

**Step 4: Facial Recognition**
```
1. Follow the prompts to complete a face scan
2. Perform actions as instructed (blinking, turning head, etc.)
3. Ensure good lighting and a clean background
```

**Step 5: Wait for Review**
```
⏰ Typical review time: a few minutes to 24 hours
📧 You'll be notified of the result by email or in-app notification
❌ If rejected, check photo quality and resubmit
```

> ⚠️ **Note**: Don't submit repeatedly during the review period — just wait patiently. Frequent submissions may extend the review time.

### 🔒 KYC Privacy Considerations

KYC means providing extensive personal information to the exchange. Here are some privacy protection tips:

**Information Security Tips**:
- **Choose reputable exchanges**: Major exchanges typically have better data protection
- **Use a dedicated email**: Don't use an email tied to your daily social accounts
- **Watch for data breaches**: Regularly check whether the exchange has had any breach incidents
- **Don't overshare**: Only provide the minimum information the exchange requires
- **Enable all security features**: 2FA, login alerts, etc.

> 💡 **Tip**: If privacy is a top concern, consider using DEXes for some trading. However, if you need fiat on/off-ramps, CEX KYC is typically unavoidable.

## 📊 Spot Trading Basics

### What Is Spot Trading?

**Spot Trading** is the most basic form of trading — buying or selling cryptocurrency at the current market price with immediate settlement. Unlike futures/margin trading, spot trading **involves no borrowing or leverage**, making it more suitable for beginners.

```
🔰 Beginner advice: Master spot trading first — don't rush into futures/leverage trading!
Leveraged trading can result in losses exceeding your principal, carrying extremely high risk.
```

### 📈 Order Types Explained

When trading on an exchange, you need to understand several basic order types:

#### 1. Market Order

**Definition**: An order that executes immediately at the best available market price.

```
📌 Characteristics:
✅ Fastest execution
✅ Simplest operation
❌ No control over execution price
❌ May experience slippage in low-liquidity conditions

📌 Best for:
- When you need to buy/sell quickly
- High-volume, highly liquid trading pairs
```

**Example**:
```
You want to buy 0.1 BTC
Current best market ask: $65,000
Place a market order → Executes immediately at around $65,000

Note: The actual execution price may vary slightly — that's "slippage"
```

#### 2. Limit Order

**Definition**: Set a target price; the order only executes when the market price reaches or is better than your specified price.

```
📌 Characteristics:
✅ Precise control over execution price
✅ Lower fees when order sits waiting (Maker rate)
❌ May not execute (price might never reach your limit)
❌ Requires patience

📌 Best for:
- When you have a clear target buy/sell price
- When you're not in a hurry and willing to wait for a good price
```

**Example**:
```
Current BTC price: $65,000
You think $60,000 is a good buying price
Place a limit buy order: Price $60,000, Quantity 0.1 BTC
→ The order sits in the order book waiting
→ When BTC drops to $60,000, it auto-executes
→ If BTC never drops to this price, the order won't fill
```

#### 3. Stop-Loss Order

**Definition**: When the price falls to a set trigger price, the order automatically sells to limit losses.

```
📌 Characteristics:
✅ Automatic execution — no need to watch the market 24/7
✅ Effectively limits downside risk
❌ May be triggered by flash crashes (false breakdowns)
❌ Executes at market price after triggering — actual price may be below stop price

📌 Best for:
- Setting a maximum loss threshold after opening a position
- When you can't monitor the market around the clock
```

**Example**:
```
You bought 0.1 BTC at $65,000
Set a stop-loss order: Trigger price $62,000
→ If BTC drops to $62,000, the system auto-sells
→ Maximum loss is approximately $300 (not accounting for slippage)
```

#### 4. OCO Order (One Cancels the Other)

**Definition**: Simultaneously sets a take-profit and stop-loss — when one triggers, the other is automatically canceled.

```
📌 Example:
Buy price: $65,000
Take-profit: $70,000 (profit $500)
Stop-loss: $62,000 (loss $300)
→ Whichever triggers first, the other auto-cancels
```

### 📉 K-Line (Candlestick) Chart Basics

Candlestick charts are the most commonly used charts in trading. Beginners should learn the basics of reading them.

**Basic candlestick structure**:
```
    ┃  ← Upper wick (high price)
   ┏┻┓
   ┃  ┃ ← Body (between open and close price)
   ┗┳┛
    ┃  ← Lower wick (low price)

🟢 Bullish candle (green/hollow): Close > Open → Price went up
🔴 Bearish candle (red/filled): Close < Open → Price went down
```

> ⚠️ **Note**: Color conventions for up/down vary by region. In mainland China, red typically means up and green means down, but most international exchanges use green for up and red for down. Check your exchange's color settings before trading.

**Common candlestick time frames**:
```
📊 1min / 5min / 15min → Ultra short-term trading
📊 1hr / 4hr           → Short-term trading
📊 Daily / Weekly      → Medium to long-term analysis
📊 Monthly             → Long-term trend analysis
```

> 💡 **Tip**: As a beginner, focus on **daily and weekly** charts to identify major trends. Don't get obsessed with minute-level short-term trading — frequent trading often leads to greater losses.

### 📖 Understanding the Order Book

The order book is one of the exchange's core components, showing all pending buy and sell orders.

**Order book structure**:
```
Sell Orders (Ask/Sell) — Listed from low to high
──────────────────────────────────
  Price          Quantity       Cumulative
  $65,050      0.52 BTC     3.21 BTC
  $65,040      0.81 BTC     2.69 BTC
  $65,030      1.15 BTC     1.88 BTC
  $65,020      0.73 BTC     0.73 BTC
═══════════════════════════════════════
  Last Price: $65,015
═══════════════════════════════════════
  $65,010      0.45 BTC     0.45 BTC
  $65,000      1.20 BTC     1.65 BTC
  $64,990      0.98 BTC     2.63 BTC
  $64,980      0.67 BTC     3.30 BTC
──────────────────────────────────
Buy Orders (Bid/Buy) — Listed from high to low
```

**Key terms**:
- **Best Bid**: The highest buy price — $65,010 in the example
- **Best Ask**: The lowest sell price — $65,020 in the example
- **Spread**: The gap between best bid and best ask — $10 in the example
- **Depth**: Total order volume at a given price level

> 💡 **Tip**: A smaller spread indicates better liquidity for that trading pair. Major pairs (like BTC/USDT) typically have very small spreads, while less popular pairs may have larger ones.

## 💸 Deposits and Withdrawals

### 📥 Deposits (Sending Crypto to the Exchange)

**What is a deposit?**
A deposit is transferring cryptocurrency from your personal wallet to your exchange account to trade on the exchange.

**Complete deposit process**:

**Step 1: Get the Deposit Address**
```
1. Log in to the exchange and go to "Assets" or "Wallet"
2. Click "Deposit"
3. Select the token to deposit (e.g., USDT)
4. Select the correct network (this step is critical!)
5. Copy the deposit address provided by the exchange
```

**Step 2: Select the Correct Network**

> ⚠️ **Warning**: This is the most critical step! Selecting the wrong network may result in permanent asset loss!

The same token may exist on multiple chains. When depositing, you must ensure **both the sender and receiver are on the same network**.

**Common Network Comparison**:

| Network | Chain | Fee | Speed | Use Case |
|---------|-------|-----|-------|----------|
| **ERC-20** | Ethereum | Higher ($1-$50+) | ~5 min | Large transfers |
| **TRC-20** | Tron | Very low (~$1) | ~3 min | Small/daily transfers |
| **BEP-20** | BSC (BNB Chain) | Low (~$0.1) | ~1 min | Daily transfers |
| **Arbitrum** | Arbitrum One | Low (~$0.1-$0.5) | ~1 min | Ethereum L2 transfers |
| **Optimism** | OP Mainnet | Low (~$0.1-$0.5) | ~1 min | Ethereum L2 transfers |
| **SOL** | Solana | Very low (<$0.01) | ~1 sec | Fast transfers |

**Practical example**:
```
Scenario: Deposit 100 USDT from MetaMask to Binance

1. On Binance, select deposit USDT
2. Select network: TRC-20 (low fees)
3. Copy the deposit address: TXyz...abc
4. Open MetaMask and switch to the Tron network
5. Send 100 USDT to the above address
6. Wait for transaction confirmation
```

> ⚠️ **Warning**: Always do a **small test transfer** first! When sending to a new address for the first time, send a small amount (e.g., 1 USDT), confirm it arrives, then send the larger amount.

**Step 3: Wait for Confirmations**

Blockchain transactions require a certain number of block confirmations before the funds appear:

| Token/Network | Confirmations Required | Estimated Time |
|--------------|----------------------|---------------|
| BTC | 1-3 confirmations | 10-30 minutes |
| ETH (ERC-20) | 12-64 confirmations | 3-15 minutes |
| USDT (TRC-20) | 20 confirmations | ~1-3 minutes |
| BNB (BEP-20) | 15 confirmations | ~1 minute |
| SOL | 1 confirmation | ~seconds |

### 📤 Withdrawals (Sending Crypto from the Exchange)

**What is a withdrawal?**
A withdrawal is transferring cryptocurrency from your exchange account to your personal wallet — achieving "control over your own assets."

**Complete withdrawal process**:

**Step 1: Prepare for Withdrawal**
```
1. Ensure your wallet address is correct
2. Confirm the target wallet supports the token and network
3. Check if the exchange has withdrawal limits
4. Ensure you've completed the required KYC level
```

**Step 2: Execute the Withdrawal**
```
1. Go to "Assets" → "Withdraw"
2. Select the token and network
3. Paste the target address (double-check it!)
4. Enter the withdrawal amount
5. Review the fee and actual amount to receive
6. Complete security verification (email + phone + 2FA)
7. Confirm submission
```

**Step 3: Confirm Receipt**
```
1. Check the withdrawal record on the exchange and get the transaction hash
2. View the transaction status on a block explorer
3. Confirm assets have arrived in the target wallet
```

> ⚠️ **Warning**: Always **verify the withdrawal address character by character**! Some malware replaces cryptocurrency addresses in the clipboard, so after pasting, make sure to check the **first few and last few characters** of the address.

### 💰 Fee Breakdown

**Exchange fees consist of three main parts**:

| Fee Type | Description | Range |
|---------|------------|-------|
| **Trading Fee** | Charged per trade | 0.02% - 0.1% |
| **Deposit Fee** | Usually free | Most exchanges don't charge |
| **Withdrawal Fee** | Covers on-chain gas costs | Varies by token and network |

**How to reduce fees**:
```
💡 Hold the exchange's platform token (e.g., BNB) for fee discounts
💡 Increase trading volume tier for lower VIP rates
💡 Use limit orders (Maker rates are usually lower than Taker)
💡 Choose lower-fee networks for withdrawals
```

## 🛡️ Exchange Security

### 🔐 Two-Factor Authentication (2FA) Setup

**2FA (Two-Factor Authentication)** is one of the most important measures for protecting your account. Even if your password is leaked, an attacker still needs the second factor to log in.

**Common 2FA methods**:

| 2FA Method | Security Level | Recommendation |
|-----------|---------------|---------------|
| **Google Authenticator** | High | ⭐⭐⭐⭐⭐ Strongly recommended |
| **Hardware Key (YubiKey)** | Highest | ⭐⭐⭐⭐⭐ Recommended for large accounts |
| **SMS Verification** | Medium | ⭐⭐⭐ Vulnerable to SIM swap attacks |
| **Email Verification** | Medium | ⭐⭐⭐ Email security is a prerequisite |

**Setting up Google Authenticator**:
```
1. Download the Google Authenticator app (iOS/Android)
2. Enable 2FA in the exchange's security settings
3. Scan the QR code provided by the exchange
4. Enter the 6-digit code shown in the app to complete binding
5. ⚠️ Be sure to back up the recovery key! You'll need it if you lose your phone
```

> ⚠️ **Warning**: Make sure to **back up your 2FA recovery key**! If your phone is lost or damaged without a backup, you may be unable to access your account. We recommend writing the recovery key on paper and storing it safely.

### 📋 Withdrawal Whitelist

The **withdrawal whitelist** feature restricts withdrawals to only pre-approved addresses. Even if your account is compromised, attackers cannot withdraw funds to their own addresses.

**Setup recommendations**:
```
✅ Enable the withdrawal whitelist feature
✅ Only add addresses you've personally verified
✅ Set a 24-hour cooling period for adding new addresses
✅ Regularly review addresses on the whitelist
```

### 🔑 API Key Management

If you use trading bots or third-party tools, you may need to create API keys.

**API key security tips**:
```
🔐 Only grant necessary permissions (e.g., view and trade only — no withdrawals)
🔐 Set IP whitelisting to restrict API access to specific IPs
🔐 Regularly rotate API keys
🔐 Never expose API keys in public code repositories
🔐 Never share API keys with others
```

> ⚠️ **Warning**: When creating API keys, **never enable the "Allow Withdrawals" permission** unless you fully understand the risks and have robust security measures in place.

### 🔍 How to Choose a Safe Exchange

**Key factors for evaluating exchange security**:

| Dimension | Safe Exchange Traits | Red Flags |
|-----------|---------------------|-----------|
| **Track Record** | 3+ years operating, no major incidents | Newly established, anonymous team |
| **Regulatory Compliance** | Holds licenses in multiple jurisdictions | No compliance qualifications |
| **Proof of Reserves** | Regularly publishes Proof of Reserves (PoR) | Refuses to disclose asset status |
| **Security Tech** | Hot/cold wallet separation, multi-sig | Opaque security measures |
| **Insurance Fund** | Has a security fund (e.g., SAFU) | No compensation guarantees |
| **Audit Reports** | Third-party audit reports publicly available | Refuses audits |
| **Community Reputation** | Good user reviews | Numerous complaints and disputes |

> 💡 **Tip**: Check exchange rankings and trust scores on [CoinGecko](https://www.coingecko.com/en/exchanges) or [CoinMarketCap](https://coinmarketcap.com/rankings/exchanges/) for a comprehensive overview.

### 🏗️ Security Setup Checklist

After registering a new exchange account, complete the following security setup:

- [ ] Set a strong password (16+ characters with uppercase, lowercase, numbers, and special characters)
- [ ] Bind Google Authenticator (2FA)
- [ ] Enable login notifications (email/SMS)
- [ ] Enable withdrawal whitelist
- [ ] Set an anti-phishing code
- [ ] Bind your phone number
- [ ] Set a fund password (different from login password)
- [ ] Disable unnecessary API permissions
- [ ] Review and close inactive API keys
- [ ] Enable device management and regularly review login devices

## 🏛️ Major Exchange Comparison

Here's a comprehensive comparison of major centralized exchanges to help you choose the right platform:

| Dimension | Binance | OKX | Coinbase | Kraken | Bybit |
|-----------|---------|-----|----------|--------|-------|
| **Founded** | 2017 | 2017 | 2012 | 2011 | 2018 |
| **HQ Location** | Global | Seychelles | USA | USA | Dubai |
| **Supported Tokens** | 400+ | 300+ | 250+ | 200+ | 300+ |
| **Spot Fees** | 0.1% | 0.1% | 0.4%-0.6% | 0.16%-0.26% | 0.1% |
| **Fiat On-Ramp** | Multiple methods | Multiple methods | Supported (mainly USD) | Multiple methods | P2P supported |
| **Futures Trading** | Yes | Yes | Limited | Yes | Yes |
| **Platform Token** | BNB | OKB | None | None | None |
| **Chinese Support** | Yes | Yes | No | Limited | Yes |
| **App Experience** | Excellent | Excellent | Excellent | Good | Excellent |
| **Web3 Wallet** | Yes | Yes (feature-rich) | Yes | No | No |
| **Security Fund** | SAFU Fund | Yes | Insurance coverage | Yes | Yes |
| **Regulatory** | Multi-country licenses | Multi-country licenses | US-listed company | Multi-country licenses | Multi-country licenses |
| **Best For** | Global users | Asian users | US users | US/EU users | Futures traders |

> ⚠️ **Note**: The above information may change over time — please refer to each exchange's official website for the latest details. Regulatory policies for crypto exchanges vary by country and region. Ensure the exchange you use is legally compliant in your jurisdiction.

### 🌟 Exchange Highlights

**Binance**:
```
✅ World's largest exchange with the highest volume and liquidity
✅ Extensive token selection with fast new listings
✅ Mature BNB ecosystem (BNB Chain, Launchpad)
✅ SAFU security fund provides extra protection
⚠️ May have access restrictions in some regions
```

**OKX**:
```
✅ Very powerful Web3 wallet with multi-chain support
✅ Professional yet user-friendly trading interface
✅ High DeFi and NFT integration
✅ Excellent Chinese language support
⚠️ Some advanced features have a learning curve
```

**Coinbase**:
```
✅ US NASDAQ-listed company with strongest compliance
✅ Clean interface, very beginner-friendly
✅ Strong brand trust in the US market
⚠️ Trading fees are relatively higher
⚠️ Fewer tokens, slower listing speed
```

**Kraken**:
```
✅ Established US/EU exchange with excellent security track record
✅ Has never experienced a major security incident
✅ Supports multiple fiat on/off-ramps
⚠️ Limited Chinese interface and support
⚠️ App experience is relatively average
```

**Bybit**:
```
✅ Excellent futures trading experience
✅ Smooth trading interface with low latency
✅ Fast new token listings
⚠️ Primarily focused on futures trading
⚠️ Spot trading depth is relatively weaker
```

> 💡 **Tip**: Beginners should start by registering on one or two major exchanges — no need to open accounts everywhere. As you gain experience, expand to other platforms based on your needs.

## ❓ FAQ

### Q1: Which exchange should a beginner start with?

**A1**: Consider the following factors when choosing:
- **Your region**: Ensure the exchange is legally available where you are
- **Language support**: If English isn't your strong suit, prioritize exchanges with your language
- **Deposit methods**: Confirm the exchange supports convenient deposit methods for you
- **General recommendation**: For Asian users, Binance and OKX are the most popular choices; for US users, Coinbase and Kraken are the top compliant options

### Q2: Are assets safe on exchanges? Could they get hacked or rug-pull?

**A2**: Exchanges do carry some risk:
- There have been historical cases of exchange hacks (e.g., 2014 Mt.Gox, 2022 FTX collapse)
- Top exchanges typically have security funds and insurance to handle emergencies
- **Best practice**: Don't keep all your assets on an exchange long-term. After trading, move large amounts to your own cold wallet
- Remember Web3's core principle: **"Not your keys, not your coins"**

### Q3: What if I selected the wrong network for a deposit?

**A3**: This is one of the most common beginner mistakes:
- If the chains are incompatible (e.g., sending ERC-20 USDT to a BTC address), assets are likely **permanently lost**
- If it's a different format on the same chain (e.g., sending to a contract address instead of an EOA), you may be able to contact exchange support for recovery
- **Prevention**: Always verify that the token and network match before depositing — make it a habit to do **small test transfers**

### Q4: Why hasn't my deposit arrived yet?

**A4**: Common reasons for delayed deposits:
- **Insufficient confirmations**: Different tokens require different numbers of confirmations — be patient
- **Exchange wallet maintenance**: Exchanges occasionally perform maintenance, causing delays
- **Network congestion**: During high congestion (e.g., Ethereum gas spikes), confirmation speeds slow down
- **Resolution**: Copy the transaction hash and check the status on the corresponding block explorer. If confirmed on-chain but not credited by the exchange, contact support

### Q5: What's the difference between spot and futures trading? Which should beginners choose?

**A5**: There's a fundamental difference:
- **Spot trading**: Use your own money to buy and sell — losses can't exceed your principal. If you buy $1,000 of BTC, you can lose at most $1,000
- **Futures trading**: Use leverage to amplify positions, with options to go long or short. 10x leverage means a 10% adverse price move could liquidate your entire margin
- **Strong recommendation**: Beginners should **absolutely start with spot trading**. Consider futures only after at least 3-6 months of trading experience. Many beginners suffer significant losses in futures trading

### Q6: How do I avoid phishing attacks on exchanges?

**A6**: Key measures to prevent phishing:
- **Set an anti-phishing code**: The exchange will display your code in every official email — emails without it are fake
- **Bookmark official URLs**: Add the exchange's official website to your browser bookmarks and always access it through bookmarks
- **Beware of fake support**: Official support will never proactively ask for your password or verification codes
- **Check URLs**: Watch for tiny differences in domain names (e.g., b1nance.com impersonating binance.com)
- **Verify download sources**: Only download exchange apps from the official website or official app stores

### Q7: Why do some small exchanges have extremely low or even zero fees?

**A7**: Exercise extreme caution:
- Ultra-low fees may be a marketing tactic to attract users, with potential increases later
- Some unknown small exchanges may carry **rug-pull risk**
- Low fees don't equal low total cost — also consider slippage, withdrawal fees, etc.
- **Recommendation**: It's better to pay slightly more in fees and use a safe, reliable major exchange

### Q8: Are exchange "earn" and "staking" products reliable?

**A8**: It depends:
- **Flexible savings**: Usually lends your assets out for interest — relatively lower risk but lower returns
- **Fixed-term savings**: Cannot withdraw during the lock period — slightly higher returns
- **High-yield products**: Be extremely cautious with anything promising abnormally high APY
- **Recommendation**: As a beginner, focus on learning spot trading — don't be lured by high-yield products while ignoring the risks

## 📝 Practical Operations Cheat Sheet

### Beginner Getting Started Path

```
📌 Recommended order of operations:

Step 1: Choose an exchange → Register an account
Step 2: Complete KYC identity verification
Step 3: Set up all security measures (2FA, anti-phishing code, etc.)
Step 4: Make a small deposit (recommend starting with 50-100 USDT to practice)
Step 5: Make your first trade on the spot market
Step 6: Learn to read candlestick charts and order books
Step 7: Gradually increase your activity as you become comfortable
Step 8: Learn to withdraw to your own wallet
```

### Exchange Terminology Quick Reference

| Term | English | Meaning |
|------|---------|---------|
| Place Order | Place Order | Submit a buy/sell order |
| Take Order | Take Order | Execute immediately at market price |
| Make Order | Make Order | Place a limit order to provide liquidity |
| Slippage | Slippage | Difference between expected and actual execution price |
| Depth | Depth | Order volume at various price levels in the order book |
| Volume | Volume | Total trading amount over a time period |
| Long / Bull | Long / Bull | Betting on price increase |
| Short / Bear | Short / Bear | Betting on price decrease |
| Fiat | Fiat | Traditional currency (e.g., USD, EUR) |
| Stablecoin | Stablecoin | Crypto pegged to fiat (e.g., USDT) |
| Liquidity | Liquidity | Ease of buying and selling an asset |
| Liquidation | Liquidation | Forced position closure due to insufficient margin |

## 📝 Conclusion

Congratulations on completing the centralized exchange lesson! CEXes are the first stop for most people entering the Web3 world. Mastering exchange operations will lay a solid foundation for your future exploration of DeFi, NFTs, and the broader Web3 landscape.

### 🎊 You've Now Mastered

- ✅ Core differences and respective advantages of CEX vs DEX
- ✅ The complete KYC identity verification process
- ✅ Basic spot trading operations and order types
- ✅ Safe deposit and withdrawal procedures
- ✅ A comprehensive exchange account security framework
- ✅ Characteristics and selection criteria for major exchanges

### 🚀 Next Steps

1. **Hands-on practice**: Choose an exchange, register, complete KYC, and practice with small amounts
2. **Security review**: Revisit Lesson 06 "Security & Scam Prevention Guide" to build comprehensive security awareness
3. **Explore DEX**: After becoming comfortable with CEX, try trading on DEXes like Uniswap
4. **Keep learning**: Follow industry developments and continuously improve your trading skills and risk awareness

### 🔮 Core Reminders

When using exchanges, remember:
- **Security first**: Enable all security settings — don't cut corners
- **Start small**: Begin with amounts you can afford to lose
- **Keep learning**: The crypto market moves fast — maintain a learning habit
- **Trade rationally**: Don't let market emotions control you — make a trading plan and stick to it

**May your Web3 trading journey be safe, rational, and rewarding!**

---

## 🔗 Community and Resources

Welcome to join our learning community to discuss Web3 knowledge together:

- 🐦 **Twitter**: [@bhbtc1337](https://twitter.com/bhbtc1337)
- 📂 **GitHub**: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
- 💬 **Issues**: [Questions & Discussions](https://github.com/beihaili/Get-Started-with-Web3/issues)

---

**Next Lesson Preview:** More exciting Web3 content coming soon!

> 📝 **This tutorial is continuously updated.** If you have suggestions or find errors, please submit an Issue or PR!
