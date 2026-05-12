# AMMs and Decentralized Exchanges

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Automated market makers made on-chain trading practical. This lesson explains order books, AMMs, the constant product formula, liquidity pools, LP tokens, slippage, impermanent loss, and the difference between Uniswap V2 and V3.

## Table of Contents

- [Order Books vs AMMs](#order-books-vs-amms)
- [The Constant Product Formula](#the-constant-product-formula)
- [Liquidity Pools and LP Tokens](#liquidity-pools-and-lp-tokens)
- [Slippage and Price Impact](#slippage-and-price-impact)
- [Impermanent Loss](#impermanent-loss)
- [Uniswap V2 vs V3](#uniswap-v2-vs-v3)
- [Major DEX Models](#major-dex-models)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## Order Books vs AMMs

Before AMMs, most exchanges used order books.

### Order Book Model

In an order book, buyers and sellers post prices and quantities:

```text
Asks                         Bids
$2,010 - 5 ETH               $1,990 - 3 ETH
$2,005 - 10 ETH              $1,985 - 8 ETH
$2,001 - 2 ETH               $1,980 - 15 ETH

Spread = best ask - best bid
```

When a bid crosses an ask, the exchange matches the order.

This works well on centralized servers because they can process many orders, cancellations, and updates per second. It is harder on Ethereum mainnet because every order action costs gas and must be included on-chain.

### AMM Model

An AMM replaces order matching with a liquidity pool and a pricing formula.

Instead of waiting for another trader:

- You trade against a smart contract.
- The contract holds two or more tokens.
- The price is calculated from the pool balances.
- Anyone can provide liquidity and earn fees.

Analogy:

```text
Order book: a marketplace where buyers and sellers negotiate.
AMM: an automated exchange machine that always quotes a price.
```

| Dimension | Order book | AMM |
|-----------|------------|-----|
| Pricing | Buyers and sellers place orders | Formula calculates price |
| Liquidity source | Market makers and traders | Liquidity providers |
| Counterparty | Another trader | Smart contract pool |
| Best environment | High-speed servers | Smart contracts |
| Examples | Coinbase, Binance, NYSE | Uniswap, Curve, Balancer |

## The Constant Product Formula

Uniswap popularized the constant product market maker:

```text
x * y = k
```

Where:

- `x` is the amount of token A in the pool.
- `y` is the amount of token B in the pool.
- `k` is the constant product when no liquidity is added or removed.

Example ETH/USDC pool:

```text
Initial state:
x = 100 ETH
y = 200,000 USDC
k = 100 * 200,000 = 20,000,000

Implied price:
200,000 / 100 = 2,000 USDC per ETH
```

Now a trader wants to buy 1 ETH:

```text
ETH after trade:
100 - 1 = 99 ETH

To keep x * y = k:
99 * y' = 20,000,000
y' = 202,020.20 USDC

Trader pays:
202,020.20 - 200,000 = 2,020.20 USDC
```

The effective price is higher than the initial 2,000 USDC per ETH because the trade itself moves the pool ratio.

### Price Curve

```text
USDC reserve
  ^
  |  \
  |    \
  |      \
  |        \      x * y = k
  |          \
  |            \
  +----------------------> ETH reserve
```

The curve means the pool never reaches exactly zero for either asset. The more one side is bought, the more expensive it becomes.

### Fees

Uniswap V2 charges 0.3% on swaps. Uniswap V3 supports multiple fee tiers such as 0.01%, 0.05%, 0.3%, and 1%.

Fees are added to the pool and increase the value represented by liquidity providers. In simplified terms:

```text
k after fees > k before fees
```

Fees are the main income source for LPs, but they must be compared with impermanent loss and active management costs.

## Liquidity Pools and LP Tokens

A liquidity pool is a smart contract that holds assets for a trading pair or a basket of assets.

Example:

```text
ETH/USDC pool:
- Holds ETH
- Holds USDC
- Lets traders swap between ETH and USDC
- Pays fees to liquidity providers
```

### Providing Liquidity

In a simple V2-style pool:

1. Prepare both tokens at the current pool ratio.
2. Deposit both tokens into the pool.
3. Receive LP tokens.
4. Earn a share of trading fees.
5. Burn LP tokens later to withdraw your share.

Example:

```text
Pool price: 1 ETH = 2,000 USDC
You deposit: 1 ETH + 2,000 USDC
You receive: LP tokens representing your pool share
```

### What LP Tokens Represent

LP tokens are claims on a percentage of the pool. They are not fixed claims on the exact assets you deposited.

If the pool balance changes because of trades, your withdrawal mix changes too.

LP tokens can also be composable:

- They can be transferred.
- They can be staked in reward contracts.
- They can be used as collateral in some protocols.
- They can become a risk transmission path if reused across protocols.

## Slippage and Price Impact

Slippage is the difference between expected price and executed price.

It comes from two sources:

1. **Price impact:** your own trade changes the pool ratio.
2. **State changes before execution:** other transactions alter the pool before yours is mined.

Core rule:

```text
The larger your trade relative to the pool, the larger the price impact.
```

Example ETH/USDC pool:

```text
Small trade:
Buy 0.1 ETH -> low price impact

Medium trade:
Buy 10 ETH -> noticeable price impact

Large trade:
Buy 50 ETH from a 100 ETH pool -> severe price impact
```

This is why large traders use aggregators such as 1inch or Matcha. Aggregators can split a trade across multiple pools and DEXs.

### Slippage Protection

Most DEX interfaces let users set maximum slippage, such as 0.5%.

If execution would be worse than that limit, the transaction reverts.

Slippage protection helps defend against:

- Fast market moves.
- Stale quotes.
- Sandwich attacks.
- Low-liquidity pools.

Too much slippage tolerance is dangerous. Too little may cause normal trades to fail.

## Impermanent Loss

Impermanent loss is the difference between:

```text
value from providing liquidity
vs
value from simply holding the two assets
```

It appears when the relative price of the two assets changes.

Example:

```text
You start with:
1 ETH + 2,000 USDC
ETH price = 2,000 USDC
Total value = $4,000

Later:
ETH price = 4,000 USDC
```

If you held:

```text
1 ETH * $4,000 + 2,000 USDC = $6,000
```

In a constant product pool, arbitrage pushes the pool price to the market price. Your share now contains less ETH and more USDC:

```text
Approximate LP position:
0.707 ETH + 2,828 USDC

Value:
0.707 * $4,000 + $2,828 = $5,656
```

Difference:

```text
$6,000 - $5,656 = $344
```

That difference is impermanent loss before fees.

### Impermanent Loss Formula

For a 50/50 constant product pool, if the price changes by ratio `r`:

```text
IL = 2 * sqrt(r) / (1 + r) - 1
```

| Price change | Impermanent loss |
|--------------|------------------|
| 1.25x | about 0.6% |
| 1.5x | about 2.0% |
| 2x | about 5.7% |
| 3x | about 13.4% |
| 5x | about 25.5% |

The loss is symmetric for equivalent up or down moves. A 2x move and a 50% drop produce the same IL magnitude.

It is called "impermanent" because if the price returns to the original ratio, the loss disappears. If you withdraw while prices are different, it becomes realized.

The practical question for LPs:

```text
Do fees and rewards exceed impermanent loss and management costs?
```

## Uniswap V2 vs V3

### Uniswap V2

V2 spreads liquidity across all possible prices from zero to infinity.

That makes LPing simple:

- Deposit both assets.
- Receive ERC-20 LP tokens.
- Earn fees passively.

But most liquidity sits where it will never be used.

```text
V2 liquidity:
price range = 0 to infinity
capital efficiency = low
management complexity = low
```

### Uniswap V3

V3 introduced concentrated liquidity. LPs choose a price range.

Example:

```text
ETH/USDC current price: $2,000
LP range: $1,800 to $2,200
```

Within that range, capital is much deeper than it would be in V2. Outside that range, the position becomes fully one asset and stops earning swap fees until price returns or the LP rebalances.

| Feature | Uniswap V2 | Uniswap V3 |
|---------|------------|------------|
| Liquidity range | Full price range | LP chooses range |
| LP token | Fungible ERC-20 | NFT position |
| Management | More passive | More active |
| Capital efficiency | Lower | Higher |
| Risk | Simpler IL profile | Range and rebalancing risk |

V3 made LPing more like active market making. It also created a category of LP management protocols that automate range selection and rebalancing.

## Major DEX Models

| DEX | Main focus | Model |
|-----|------------|-------|
| Uniswap | General-purpose token swaps | Constant product and concentrated liquidity |
| Curve | Stablecoins and pegged assets | StableSwap curve |
| Balancer | Weighted multi-asset pools | Weighted constant product |
| PancakeSwap | BNB Chain and multi-chain retail flow | CPMM and V3-style pools |
| Trader Joe | Avalanche and multi-chain liquidity | Liquidity Book |
| Raydium | Solana liquidity | Hybrid AMM and order book integration |

Curve deserves special attention because it is optimized for assets that should trade near the same value, such as USDC/USDT/DAI. Its StableSwap curve provides lower slippage near the peg than a simple constant product pool.

## Summary

Key takeaways:

1. AMMs made on-chain trading practical by replacing order matching with formulas.
2. The constant product formula `x * y = k` is simple, robust, and foundational.
3. LP tokens represent pool share, not a fixed claim on deposited token amounts.
4. Slippage grows when trade size is large relative to pool depth.
5. Impermanent loss is the main risk LPs must compare against fees.
6. Uniswap V3 improves capital efficiency but requires more active management.

## Further Reading

- [Uniswap V2 Whitepaper](https://uniswap.org/whitepaper.pdf)
- [Uniswap V3 Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
- [Curve StableSwap Paper](https://curve.fi/files/stableswap-paper.pdf)
- [Revert Finance](https://revert.finance/)
- [Impermanent Loss Calculator](https://dailydefi.org/tools/impermanent-loss-calculator/)

