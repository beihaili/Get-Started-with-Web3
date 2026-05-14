# DeFi Risks and Security

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> DeFi gives users direct access to financial protocols, but it also gives users direct responsibility for risk. This lesson builds a practical risk framework covering smart contract bugs, flash loan attacks, oracle manipulation, rug pulls, MEV, bridge risk, governance attacks, protocol due diligence, and personal security habits.

## Table of Contents

- [The DeFi Risk Map](#the-defi-risk-map)
- [Smart Contract Risk](#smart-contract-risk)
- [Flash Loan Attacks](#flash-loan-attacks)
- [Oracle Manipulation](#oracle-manipulation)
- [Rug Pulls](#rug-pulls)
- [Other Common Risks](#other-common-risks)
- [How to Evaluate a DeFi Protocol](#how-to-evaluate-a-defi-protocol)
- [Personal Security Checklist](#personal-security-checklist)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## The DeFi Risk Map

DeFi risk is not one thing. It is a stack of risks:

```text
DeFi risk categories

Technical risk:
- smart contract bugs
- upgrade bugs
- bridge bugs
- oracle integration bugs

Economic risk:
- flash loan attacks
- oracle manipulation
- MEV extraction
- liquidation cascades
- depeg events

Governance risk:
- admin keys
- malicious proposals
- token concentration
- emergency powers
- weak timelocks

Operational risk:
- phishing
- private key loss
- malicious approvals
- fake tokens
- compromised frontends
- wrong chain or wrong address
```

Good DeFi risk management means asking:

```text
What can fail?
Who can change the rules?
Where is the liquidity?
What external systems does this protocol depend on?
How do I exit if conditions change?
```

## Smart Contract Risk

Smart contracts can hold large amounts of value. If the code is wrong, attackers can exploit the rules directly.

### Reentrancy

Reentrancy happens when a contract makes an external call before updating its own state.

Vulnerable pattern:

```solidity
// Simplified vulnerable example.
contract VulnerableVault {
    mapping(address => uint256) public balances;

    function withdraw() external {
        uint256 amount = balances[msg.sender];

        // External call before state update.
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // Too late. Attacker may have reentered already.
        balances[msg.sender] = 0;
    }
}
```

Defense:

- Use Checks-Effects-Interactions.
- Update state before external calls.
- Use OpenZeppelin `ReentrancyGuard` where appropriate.
- Consider callback behavior in ERC-777, ERC-721, ERC-1155, and custom tokens.

### Logic Bugs

Some of the largest DeFi losses were not caused by simple syntax mistakes. They came from subtle interactions between functions.

Example pattern:

```text
function A updates accounting
function B relies on old accounting assumption
attacker combines A and B in a way designers did not expect
```

This is why protocols need:

- Unit tests.
- Fuzz tests.
- Invariant tests.
- Manual review.
- External audits.
- Bug bounties.

### Admin and Upgrade Risk

Many protocols are upgradeable or have admin controls.

Powerful admin functions may include:

- Minting tokens.
- Pausing transfers.
- Changing fees.
- Upgrading implementations.
- Changing oracle addresses.
- Sweeping funds.
- Listing collateral.
- Changing risk parameters.

These controls can be necessary, but they create trust assumptions.

Safer patterns:

- Multisig for admin keys.
- Timelock before major changes.
- Public announcements.
- On-chain governance for high-impact changes.
- Limited emergency powers.

## Flash Loan Attacks

Flash loans let attackers borrow huge amounts of capital for one transaction. This makes weak economic assumptions exploitable.

The flash loan itself is not the vulnerability. The vulnerability is usually:

- Thin liquidity.
- Bad oracle design.
- Broken accounting.
- Missing slippage checks.
- Protocols trusting spot prices.

Simplified attack pattern:

```text
1. Borrow a large amount through a flash loan.
2. Use the capital to move a DEX price.
3. Make another protocol read the manipulated price.
4. Borrow, mint, redeem, or liquidate at the wrong valuation.
5. Repay the flash loan.
6. Keep the profit.
```

### bZx-style Lesson

Early DeFi attacks showed that protocols could be manipulated by moving prices in a single transaction. Attackers used borrowed capital to distort liquidity pools and extract profit before the transaction ended.

Lesson:

```text
If a protocol trusts a price that can be moved inside one transaction, flash loans make the attack cheap.
```

### Pancake Bunny-style Lesson

Yield protocols that mint rewards based on manipulable pool values are vulnerable. If a reward calculation uses a DEX spot price without robust checks, attackers can distort the price, mint excessive rewards, then dump them.

Defense:

- Use robust oracle sources.
- Avoid single-pool spot prices.
- Add TWAPs or external price feeds.
- Add caps and sanity checks.
- Test against hostile one-transaction flows.

## Oracle Manipulation

DeFi protocols need asset prices. Oracles provide those prices.

Oracle types:

```text
On-chain spot price:
reads directly from a DEX pool
fast but easy to manipulate if liquidity is thin

On-chain TWAP:
time-weighted average price from a DEX
harder to manipulate but slower

Off-chain oracle network:
multiple nodes report prices from external markets
more robust but introduces oracle-network trust assumptions

Hybrid:
combines multiple sources, sanity checks, and fallback rules
```

### Mango Markets Lesson

The Mango Markets attack showed how manipulated market prices can be used to inflate collateral value, borrow assets, and leave the protocol with bad debt.

High-level pattern:

```text
1. Build a large position in an illiquid asset.
2. Push up the asset price.
3. Oracle reports inflated value.
4. Use inflated collateral to borrow real assets.
5. Price falls back, leaving bad debt.
```

### Safer Oracle Practices

- Use multiple independent data sources.
- Use median aggregation.
- Use heartbeat updates.
- Use deviation thresholds.
- Check stale price conditions.
- Add max price movement guards.
- Avoid listing illiquid assets as high-LTV collateral.
- Simulate oracle failure and delayed updates.

## Rug Pulls

A rug pull happens when project insiders attract users and then drain value.

Common types:

### Liquidity Pull

```text
1. Team creates token.
2. Team creates DEX pool with token and ETH.
3. Marketing attracts buyers.
4. Token price rises.
5. Team removes liquidity.
6. Buyers are left with illiquid tokens.
```

### Unlimited Mint

```text
1. Token contract has owner-only mint function.
2. Users buy token.
3. Owner mints huge supply.
4. Owner sells into liquidity.
5. Price collapses.
```

### Honeypot Token

```text
Users can buy.
Users cannot sell.
Only insiders can exit.
```

### Fake Protocol Frontend

Attackers copy a real website and replace contract addresses with malicious contracts. Users think they are interacting with a known protocol, but they are signing approvals or transactions to attacker contracts.

### Rug Pull Red Flags

- Anonymous team with no credible history.
- Contract not verified.
- No audit or only a low-quality audit.
- Token supply concentrated in a few wallets.
- LP tokens not locked or controlled by the team.
- Admin can mint, pause, blacklist, or change fees freely.
- Unrealistic APY.
- Marketing stronger than product.
- Copied whitepaper or website.
- No multisig or timelock.
- Users are pressured to buy quickly.

## Other Common Risks

### MEV and Sandwich Attacks

MEV means maximum extractable value. Validators, builders, searchers, or bots can profit from transaction ordering.

Sandwich attack:

```text
1. User submits a large swap.
2. Attacker buys before the user, moving the price.
3. User trade executes at a worse price.
4. Attacker sells after the user.
5. Attacker captures the spread.
```

Defenses:

- Use lower slippage tolerance.
- Avoid thin pools.
- Use private transaction routes where appropriate.
- Split large trades.
- Use aggregators that account for price impact.

### Bridge Risk

Bridges are among the highest-risk parts of crypto because they hold large pooled assets and connect different trust domains.

Bridge risks include:

- Validator key compromise.
- Message verification bugs.
- Light-client bugs.
- Liquidity pool insolvency.
- Wrapped asset depeg.
- Governance or admin takeover.

Large bridge incidents such as Ronin, Wormhole, Nomad, and Harmony Horizon showed that bridge failures can be catastrophic.

Practical habit:

```text
Bridge only what you need.
Do not treat bridged assets as equivalent across all chains.
Understand which bridge issued the asset you hold.
```

### Governance Attacks

Governance controls protocol parameters and treasuries.

Attack pattern:

```text
1. Acquire or borrow governance power.
2. Pass a malicious proposal.
3. Drain treasury or change protocol rules.
4. Exit before community can react.
```

Defenses:

- Voting delay.
- Timelock before execution.
- Quorum requirements.
- Delegation monitoring.
- Emergency veto for extreme cases.
- Limits on what governance can change quickly.

### Stablecoin Depeg Risk

Many DeFi positions assume stablecoins are worth $1. If a stablecoin depegs:

- Lending collateral values change.
- LP pools become imbalanced.
- Borrowers can be liquidated.
- Yield strategies can break.
- Wrapped and bridged versions may diverge.

Never assume all "dollars" are the same.

## How to Evaluate a DeFi Protocol

Before using a protocol, review these areas.

### Audit and Code

- Is the code verified on block explorers?
- Are audits public?
- Who performed the audit?
- Were critical findings fixed?
- Was the deployed commit audited?
- Is there a bug bounty?
- Are tests and documentation public?

### Operational Security

- Are admin keys controlled by a multisig?
- Is there a timelock?
- Who can pause the protocol?
- Who can upgrade contracts?
- Can admins freeze or sweep funds?
- Are parameter changes visible on-chain?

### Economic Design

- Where does yield come from?
- Is TVL supported by real demand or token incentives?
- Are oracles robust?
- Are listed collateral assets liquid?
- Can flash loans manipulate accounting?
- What happens in a large market move?

### Governance

- Who owns governance tokens?
- Are proposals active and reviewed?
- Can insiders pass proposals alone?
- Is there a delay before execution?
- Are emergency powers documented?

### Team and Ecosystem

- Is the team known?
- Is development active?
- Are docs clear?
- Is the community mostly technical or mostly hype?
- Have there been incidents before?

### Useful Tools

| Tool | Use |
|------|-----|
| Etherscan | Contract code, transactions, holders |
| DeBank | Wallet DeFi positions |
| Revoke.cash | Token approval review and revoke |
| DefiLlama | TVL, stablecoins, protocol data |
| Token Sniffer | Token contract risk signals |
| Rekt | Incident history |
| Immunefi | Bug bounty programs |
| DeFi Safety | Protocol process reviews |

## Personal Security Checklist

### Wallet Separation

- Use a hardware wallet for long-term holdings.
- Use a separate hot wallet for new DApps.
- Keep only operating funds in the active wallet.
- Do not connect cold storage to unknown sites.

### Test Small

- Send a small test transfer before a large transfer.
- Try a small deposit and withdrawal before committing size.
- Confirm the chain, token, contract, and recipient address.

### Approval Hygiene

- Avoid unlimited approvals when possible.
- Revoke unused approvals.
- Understand Permit and Permit2 signatures.
- Do not sign messages you do not understand.
- Be cautious with "gasless" approvals.

### Transaction Review

- Read wallet prompts carefully.
- Confirm the contract address from official docs.
- Use block explorers.
- Be suspicious of urgent links from Discord, Telegram, X, or email.
- Do not trust frontends blindly.

### Private Key Security

- Never type seed phrases into websites.
- Do not store seed phrases in cloud drives or screenshots.
- Keep offline backups.
- Consider metal backups for large holdings.
- Do not share screen while wallet popups or seed material are visible.

### Ongoing Monitoring

- Follow protocol announcements.
- Watch health factor for lending positions.
- Watch stablecoin depeg events.
- Track bridge and oracle incidents.
- Exit when assumptions change.

## Summary

Key takeaways:

1. DeFi risk includes technical, economic, governance, and operational layers.
2. Smart contract audits reduce risk but do not eliminate it.
3. Flash loans expose weak economic assumptions.
4. Oracle design is central to lending, derivatives, stablecoins, and vaults.
5. Rug pulls often show warning signs before collapse.
6. Bridges and governance are major systemic risk surfaces.
7. Personal security habits prevent many avoidable losses.

DeFi's basic rule is:

```text
Do your own research, but also size positions as if your research can be wrong.
```

## Further Reading

- [Rekt Leaderboard](https://rekt.news/leaderboard/)
- [Immunefi](https://immunefi.com/)
- [DeFi Safety](https://defisafety.com/)
- [Revoke.cash](https://revoke.cash/)
- [OpenZeppelin Learn](https://docs.openzeppelin.com/learn/)
- [Chainalysis Crypto Crime Reports](https://www.chainalysis.com/crypto-crime-report/)
- [SlowMist](https://www.slowmist.com/)

