# How DeFi Lending Protocols Work

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Lending is one of the core primitives of DeFi. This lesson explains how Aave and Compound work, why DeFi lending is overcollateralized, how health factors and liquidations protect the system, how interest rates are calculated, and why flash loans are possible.

## Table of Contents

- [DeFi Lending vs Bank Lending](#defi-lending-vs-bank-lending)
- [How Aave and Compound Work](#how-aave-and-compound-work)
- [Overcollateralization and Health Factor](#overcollateralization-and-health-factor)
- [Liquidations](#liquidations)
- [Interest Rate Models](#interest-rate-models)
- [Flash Loans](#flash-loans)
- [Common Use Cases](#common-use-cases)
- [Risk Management Checklist](#risk-management-checklist)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## DeFi Lending vs Bank Lending

Lending is simple in concept:

```text
depositors supply assets -> borrowers borrow assets -> borrowers pay interest -> depositors earn interest
```

The difference is how risk is managed.

| Dimension | Bank lending | DeFi lending |
|-----------|--------------|--------------|
| Identity | Real-world identity and credit score | Wallet address |
| Approval | Manual or institutional underwriting | Smart contract rules |
| Collateral | Can be unsecured or partially secured | Usually overcollateralized |
| Interest rate | Set by bank policy and markets | Algorithmic supply and demand |
| Service hours | Banking hours and batch settlement | 24/7 |
| Default handling | Legal collection and credit reporting | Automatic liquidation |
| Transparency | Internal books | On-chain positions and reserves |

In traditional finance, a bank can lend without full collateral because it knows who the borrower is and can pursue them legally. In DeFi, the protocol usually does not know who you are. It protects lenders by requiring collateral worth more than the borrowed asset.

## How Aave and Compound Work

Aave and Compound are the most important DeFi lending protocols. Their designs differ, but the core flow is similar.

```text
Lender deposits USDC
        |
        v
Liquidity pool smart contract
        |
        v
Borrower deposits ETH collateral and borrows USDC
```

Basic flow:

1. Lenders deposit assets into a pool.
2. Borrowers deposit collateral.
3. Borrowers borrow assets within risk limits.
4. Borrowers pay interest.
5. Lenders earn interest from borrowers.
6. Liquidators repay unsafe debt and receive discounted collateral.

### Deposit Tokens

When you deposit into a lending protocol, you usually receive a receipt token.

In Aave:

```text
Deposit 1,000 USDC -> receive 1,000 aUSDC
Interest accrues -> aUSDC balance increases over time
Redeem aUSDC -> receive underlying USDC
```

In Compound:

```text
Deposit 1,000 USDC -> receive cUSDC
cUSDC amount stays mostly fixed
Exchange rate rises over time
Redeem cUSDC -> receive more USDC than you deposited
```

The user experience differs, but the accounting goal is the same: depositors receive a tokenized claim on the pool plus accrued interest.

### Aave vs Compound

| Feature | Aave | Compound |
|---------|------|----------|
| Deposit token | aToken | cToken |
| Interest modes | Variable and some stable-rate designs depending on market/version | Mainly variable |
| Flash loans | Major feature | Supported in newer designs |
| Governance token | AAVE | COMP |
| Deployments | Ethereum and multiple L2s | Ethereum, Base, and other deployments |
| Risk model | Asset-specific parameters | Asset-specific parameters |

For learners, the important point is not which protocol is larger today. It is that lending protocols turn deposits, collateral, interest, liquidations, and risk parameters into transparent on-chain markets.

## Overcollateralization and Health Factor

### Loan-to-Value

LTV means loan-to-value. It defines how much you can borrow against collateral.

Example:

```text
ETH collateral value: $10,000
ETH max LTV: 80%
Maximum borrow: $8,000
```

Different assets have different LTVs because they have different volatility and liquidity.

Stable assets may receive higher LTVs. Volatile or thinly traded assets receive lower LTVs.

### Liquidation Threshold

The liquidation threshold is the collateral value level at which a position can be liquidated.

A position can be safe at opening and unsafe later because:

- Collateral price falls.
- Borrowed asset price rises.
- Interest accrues.
- Risk parameters change.

### Health Factor

The health factor summarizes position safety:

```text
Health Factor = weighted collateral liquidation value / borrowed value
```

Interpretation:

```text
HF > 1     position is not liquidatable
HF = 1     liquidation boundary
HF < 1     position can be liquidated
```

Example:

```text
Collateral:
5 ETH * $2,000 = $10,000

Liquidation threshold:
82.5%

Debt:
5,000 USDC

Health factor:
($10,000 * 82.5%) / $5,000 = 1.65
```

If ETH falls to $1,210:

```text
Collateral:
5 ETH * $1,210 = $6,050

Health factor:
($6,050 * 82.5%) / $5,000 = 0.998
```

The position can now be liquidated.

Practical habit:

```text
Keep HF comfortably above 1.
Many conservative users target HF > 2.
```

## Liquidations

Liquidation is the mechanism that protects lenders when collateral becomes insufficient.

Liquidation flow:

1. A bot monitors all lending positions.
2. It finds a position with health factor below 1.
3. The bot repays part of the borrower's debt.
4. The bot receives part of the borrower's collateral at a discount.
5. The borrower's position becomes safer or is closed.

Example:

```text
Borrower:
Collateral = 5 ETH worth $6,000
Debt = 5,000 USDC
HF < 1

Liquidator:
Repays 2,500 USDC
Receives ETH worth 2,500 USDC plus a liquidation bonus
```

Liquidators are economically motivated. They keep the system healthy because profitable liquidations pay them.

This creates an ecosystem:

- Monitoring bots.
- MEV searchers.
- Private transaction relays.
- Liquidation dashboards.
- Automation tools such as DeFi Saver.

For borrowers, liquidation is not a bug. It is the cost of taking leverage in a transparent collateral system.

## Interest Rate Models

DeFi lending rates are usually calculated from utilization.

```text
Utilization = total borrowed / total supplied
```

If utilization is low:

- There is plenty of liquidity.
- Borrowing should be cheap.
- Deposit yield is lower.

If utilization is high:

- Liquidity is scarce.
- Borrowing should become expensive.
- Deposit yield rises to attract supply.

Many markets use a kinked curve:

```text
Borrow rate
  ^
  |                           /
  |                         /
  |                       /
  |                     /
  |       low slope   /
  |------------------/
  |
  +--------------------------------> utilization
                 optimal point
```

Simplified model:

```javascript
function borrowRate(utilization) {
  const optimal = 0.80;
  const base = 0.01;
  const slope1 = 0.04;
  const slope2 = 0.75;

  if (utilization <= optimal) {
    return base + (utilization / optimal) * slope1;
  }

  const excess = (utilization - optimal) / (1 - optimal);
  return base + slope1 + excess * slope2;
}
```

The steep section after the optimal point is intentional. It encourages:

- Borrowers to repay.
- Depositors to supply more liquidity.
- The market to return to a usable liquidity level.

## Flash Loans

A flash loan lets a user borrow without collateral, as long as the loan is repaid inside the same transaction.

This works because blockchain transactions are atomic:

```text
If every step succeeds -> transaction commits.
If any required step fails -> the whole transaction reverts.
```

Flash loan lifecycle:

```text
1. Borrow 1,000,000 USDC from Aave.
2. Use it for arbitrage, liquidation, collateral swap, or another strategy.
3. Repay 1,000,000 USDC plus fee before the transaction ends.
4. If repayment fails, the whole transaction reverts.
```

From the lending protocol's perspective:

```text
Either it gets repaid plus fee, or the loan never happened.
```

### Common Flash Loan Uses

Arbitrage:

```text
ETH price on DEX A = $2,000
ETH price on DEX B = $2,020

Borrow USDC -> buy ETH on A -> sell ETH on B -> repay -> keep spread
```

Self-liquidation:

```text
Borrow stablecoin -> repay your debt -> withdraw collateral -> sell part of collateral -> repay flash loan
```

Collateral swap:

```text
Replace ETH collateral with WBTC collateral in one transaction.
```

Flash loans are also used in attacks. They give attackers temporary capital to manipulate weak oracles, thin liquidity, and broken accounting logic.

## Common Use Cases

### Leveraged Long

```text
1. Deposit ETH.
2. Borrow USDC.
3. Buy more ETH with USDC.
4. Deposit more ETH.
```

This increases ETH exposure. It also increases liquidation risk.

### Stablecoin Yield

```text
1. Deposit stablecoins into a lending market.
2. Earn variable interest from borrowers.
3. Monitor utilization and protocol risk.
```

Stablecoin yield is not risk-free. Risks include smart contract bugs, depegs, oracle issues, and governance changes.

### Liquidity Without Selling

Some users borrow stablecoins against ETH instead of selling ETH. This can preserve upside exposure, but the position can be liquidated if ETH falls.

### Collateral Management

Advanced users move collateral across protocols, chains, and assets to optimize capital efficiency. This adds operational and bridge risk.

## Risk Management Checklist

Before borrowing:

- [ ] Understand the collateral asset and debt asset.
- [ ] Check LTV and liquidation threshold.
- [ ] Keep health factor well above 1.
- [ ] Understand how oracle prices are sourced.
- [ ] Avoid borrowing against highly volatile collateral near maximum LTV.
- [ ] Know liquidation penalties.
- [ ] Track interest rate changes.
- [ ] Test withdrawals with small amounts first.
- [ ] Consider automation, but do not fully trust it.
- [ ] Do not use borrowed stablecoins in another risky loop unless you understand the full stack.

## Summary

Key takeaways:

1. DeFi lending replaces credit checks with overcollateralization.
2. Deposit tokens represent a claim on supplied assets plus interest.
3. Health factor is the main borrower safety metric.
4. Liquidations protect lenders and create incentives for monitoring bots.
5. Interest rates are driven by utilization.
6. Flash loans are possible because transactions are atomic.
7. Lending protocols are powerful, but leverage can liquidate users quickly.

## Further Reading

- [Aave Documentation](https://docs.aave.com/developers/)
- [Aave Risk Parameters](https://docs.aave.com/risk/)
- [Compound Whitepaper](https://compound.finance/documents/Compound.Whitepaper.pdf)
- [DeFi Saver](https://defisaver.com/)
- [Aave Flash Loans](https://docs.aave.com/developers/guides/flash-loans)
- [Paradigm - A Primer on Liquidations](https://www.paradigm.xyz/2020/04/a-primer-on-liquidations)

