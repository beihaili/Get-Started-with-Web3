# Governance Mechanism Design

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> This lesson dives deep into the design and implementation of DAO governance mechanisms. From basic token voting to advanced quadratic voting, from on-chain governance to off-chain signals, you will understand the trade-offs of each approach and trace a governance proposal through its complete lifecycle.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [Token Voting](#token-voting)
- [Delegated Voting](#delegated-voting)
- [Timelocks](#timelocks)
- [On-Chain vs Off-Chain Governance](#on-chain-vs-off-chain-governance)
- [Snapshot: Off-Chain Voting Tool](#snapshot-off-chain-voting-tool)
- [Tally: On-Chain Governance Interface](#tally-on-chain-governance-interface)
- [The Proposal Lifecycle](#the-proposal-lifecycle)
- [Quadratic Voting](#quadratic-voting)
- [Other Voting Mechanisms](#other-voting-mechanisms)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## Token Voting

Token voting is the most common DAO governance mechanism. The core logic is simple: **One Token, One Vote (1T1V)**.

### How It Works

Each address that holds governance tokens has a voting weight equal to the number of tokens it holds. For example:

- Alice holds 1,000 UNI → she has 1,000 votes
- Bob holds 100 UNI → he has 100 votes

Votes are typically cast as one of three choices: **For**, **Against**, or **Abstain**.

### Voting Thresholds

Most DAOs set two key thresholds:

1. **Quorum**: A proposal needs a minimum total vote count to be valid. Uniswap, for example, requires at least 40 million UNI (4% of supply) to participate.
2. **Approval Threshold**: The For votes must exceed a defined ratio. Simple majority (>50%) is standard; some critical decisions require a supermajority (>66%).

### Advantages of 1T1V

- **Simple and intuitive**: Rules are clear and easy to implement.
- **Aligned incentives**: Holding more tokens means bearing more risk, which motivates good decisions.
- **Sybil resistance**: Voting power is based on tokens, not addresses, so creating multiple wallets does not increase influence.
- **Composability**: Integrates well with DeFi (e.g., staked tokens can still vote).

### Disadvantages of 1T1V

- **Plutocratic**: Whales have vastly more voting power than ordinary users, which can produce oligarchic governance.
- **Voter apathy**: Small holders feel their vote is irrelevant, which depresses participation.
- **Short-termism**: Tokens can be sold at any time; holders may prioritize short-term gain.
- **Flash-loan attacks**: An attacker can borrow a large amount of governance tokens within a single transaction to sway a vote.

### Vote Snapshots

To prevent token transfers during the voting window from affecting results, most governance systems use a **snapshot mechanism**: at the time a proposal is created, the current block height is recorded and token balances at that block determine each address's voting weight.

```solidity
// OpenZeppelin Governor: querying voting power
// Balance is queried at the snapshot block, not the current block
function getVotes(address account, uint256 blockNumber)
    public view returns (uint256)
{
    return token.getPastVotes(account, blockNumber);
}
```

---

## Delegated Voting

Delegated voting addresses voter apathy and the lack of expertise in token-holder bases.

### What It Is

Token holders can **delegate** their voting power to another address, which votes on their behalf. This mirrors **representative democracy** in the real world.

```text
Token holder A (100 votes) --delegate--> Delegate X
Token holder B (200 votes) --delegate--> Delegate X
Token holder C (50 votes)  --delegate--> Delegate Y

Delegate X holds 300 votes
Delegate Y holds 50 votes
```

### Key Properties

- **Revocable at any time**: Delegators can reclaim their voting power or switch delegates whenever they choose.
- **No token transfer**: Only voting power is delegated; tokens stay in the original wallet.
- **Self-delegation**: Holders can delegate to themselves. Many governance contracts require self-delegation before voting is possible.
- **Transitive delegation**: Some systems allow delegates to re-delegate, but most do not, to avoid complexity.

### Advantages

1. **Higher participation**: Inactive holders still influence governance indirectly.
2. **Specialization**: Delegates are typically community leaders or researchers who study proposals in depth.
3. **Lower barrier**: Ordinary users do not need to research every proposal.
4. **Better quorum**: Delegation aggregates voting power, making quorum easier to reach.

### Notable Delegates

In major DAOs like Uniswap, Compound, and Aave, well-known delegates include:

- **a16z**: The investment firm holds and exercises voting power in multiple DAOs.
- **Blockchain@Columbia**: University blockchain clubs acting as delegates.
- **Independent researchers**: Penn Blockchain, Stanford Blockchain Club, and others.

In Uniswap governance, the top 20 delegates typically control more than 60% of all votes cast.

### Delegating in Practice

Using Uniswap as an example:

```solidity
// Call delegate() on the UNI token contract
// Transfer voting power to a specified address
uni.delegate(delegateAddress);

// Self-delegate (activate your own voting power)
uni.delegate(msg.sender);
```

On governance frontends like Tally, delegation is a simple UI action — no manual contract interaction needed.

---

## Timelocks

A timelock is a critical security mechanism in DAO governance. It inserts a **mandatory waiting period** between a vote passing and the proposal actually being executed.

### Why Timelocks Matter

Imagine a scenario: a malicious proposal passes (perhaps through a flash loan or an extremely short voting window). Without a timelock, it executes immediately and users have no chance to react. A timelock provides an **exit window**:

- Users can **withdraw funds** before execution if they discover a problem.
- The community can **organize opposition** (e.g., submit a new proposal to cancel the pending one).
- Security researchers can **inspect the proposal** content before it runs.

### Timelock Workflow

```text
Vote passes --> Proposal enters Timelock queue --> Waiting period (e.g. 48 hours) --> Execution window --> Proposal executes
```

### Typical Timelock Configurations

| DAO | Timelock Duration | Notes |
|-----|-------------------|-------|
| Compound | 48 hours | Standard configuration |
| Uniswap | At least 2 days | Configurable |
| MakerDAO | 48 hours | Bypassable in emergencies |
| Aave | 24 hours (short lock) | Long lock for major changes |

### OpenZeppelin TimelockController Example

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/TimelockController.sol";

// Create a 48-hour timelock
// minDelay: 172800 seconds = 48 hours
// proposers: addresses that can queue operations (typically the Governor contract)
// executors: addresses that can execute (set to address(0) to allow anyone)
TimelockController timelock = new TimelockController(
    172800,     // minimum delay in seconds
    proposers,  // proposer list
    executors,  // executor list
    admin       // admin address
);
```

### Emergency Actions

Some DAOs include an **emergency action** mechanism that allows bypassing the timelock under specific conditions (e.g., an active protocol attack). This typically requires a higher vote threshold or multisig approval.

---

## On-Chain vs Off-Chain Governance

DAO governance can be split into **on-chain** and **off-chain** approaches, each with distinct trade-offs.

### On-Chain Governance

**Definition**: Voting and execution both occur on the blockchain. A passing vote directly triggers smart contract operations.

**Examples**: Compound Governor, OpenZeppelin Governor, Tally

**Advantages**:
- Vote results are immutable and fully transparent.
- Passed proposals execute automatically without human intervention.
- Binding: voting is deciding.

**Disadvantages**:
- Every vote requires gas, which adds cost.
- The process is slow (block confirmation times apply).
- Changing governance parameters itself requires governance.

### Off-Chain Governance

**Definition**: Voting occurs off-chain (usually via cryptographic signatures rather than transactions). Results require a separate mechanism to execute on-chain.

**Examples**: Snapshot, Discourse forum polls

**Advantages**:
- **Zero gas**: Uses EIP-712 signatures instead of on-chain transactions.
- Better UX and lower participation barrier.
- Flexible — voting parameters can be adjusted quickly.

**Disadvantages**:
- Results are not binding on-chain; a multisig or other mechanism must execute them.
- A gap exists between "signal" and "execution."
- Theoretically centralized risk (Snapshot's servers).

### Hybrid Mode (Recommended Practice)

Most mature DAOs use a **hybrid governance model**:

```text
1. Forum discussion (Discourse / Commonwealth)  --> informal, collects opinions
2. Temperature check (Snapshot)                 --> off-chain vote, tests community sentiment
3. Formal proposal (on-chain Governor)          --> binding on-chain vote
4. Timelock waiting period                      --> security buffer
5. Execution                                    --> smart contract auto-executes
```

This model minimizes participation cost while ensuring the final decision is enforceable on-chain.

---

## Snapshot: Off-Chain Voting Tool

[Snapshot](https://snapshot.org/) is the most popular off-chain governance platform, used by more than 20,000 projects.

### How Snapshot Works

1. **Space creation**: A DAO creates its own governance space on Snapshot.
2. **Voting strategy**: Defines how voting power is calculated (ERC-20 balance, NFT holdings, LP tokens, etc.).
3. **Proposal creation**: Eligible members create proposals, set a voting window, and define options.
4. **Signature voting**: Users vote by signing with their wallet — no transaction, zero gas.
5. **Result tallying**: After the window closes, the strategy computes the final result.

### Core Features

- **Zero gas**: Voting uses EIP-712 signatures, no on-chain transaction required.
- **Multi-chain support**: Ethereum, Polygon, Arbitrum, Optimism, and more.
- **Flexible voting strategies**: Supports token balances, NFT ownership, LP positions, and combined strategies.
- **Multiple vote types**: Single choice, multiple choice, ranked-choice, weighted, and more.
- **IPFS storage**: Voting data is stored on IPFS for decentralization.

### Voting Strategy Example

```json
{
  "name": "erc20-balance-of",
  "network": "1",
  "params": {
    "address": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    "symbol": "UNI",
    "decimals": 18
  }
}
```

### Limitations

- Results have no on-chain binding force; a multisig team must execute them manually.
- Relies on Snapshot's centralized servers (though data lives on IPFS).
- Cannot directly trigger smart contract operations.

---

## Tally: On-Chain Governance Interface

[Tally](https://www.tally.xyz/) is the most popular frontend for on-chain governance, providing a user-friendly interface for OpenZeppelin Governor and similar contracts.

### Main Features

1. **Proposal browser**: View all active and historical proposals.
2. **Voting**: Cast on-chain votes directly from the interface.
3. **Delegation management**: View and manage voting power delegation.
4. **Delegate leaderboard**: See voting records and token holdings of each delegate.
5. **DAO analytics**: Treasury balance, voter turnout, participation trends.

### Tally vs Snapshot

| Feature | Tally | Snapshot |
|---------|-------|----------|
| Vote type | On-chain | Off-chain |
| Gas cost | Required | Zero |
| Binding | Yes (auto-executes) | No (manual execution) |
| Contract support | Governor, GovernorBravo | Custom strategies |
| Best for | Final decisions | Temperature checks, signal votes |

### Steps to Participate on Tally

1. Connect your wallet to Tally.
2. Navigate to your DAO's page.
3. If you haven't delegated yet, delegate your voting power to yourself or a representative.
4. Browse active proposals and read the content.
5. Click the vote button and choose For / Against / Abstain.
6. Confirm the transaction (gas fee required).

---

## The Proposal Lifecycle

A governance proposal typically moves through six distinct stages from conception to execution.

### Stage 1: Discussion

- **Platform**: Discord, Discourse forums, Commonwealth
- **Purpose**: Float the idea, collect feedback, iterate on the design
- **Duration**: Usually 3–7 days
- **Participants**: Any community member

### Stage 2: Temperature Check

- **Platform**: Snapshot (off-chain vote)
- **Purpose**: Gauge community sentiment before spending on-chain voting resources
- **Threshold**: Low participation requirements
- **Duration**: Usually 3–5 days

### Stage 3: Formal Proposal

- **Platform**: On-chain (Governor contract)
- **Requirement**: The proposer must hold a minimum token threshold (Uniswap requires 2.5M UNI of voting power)
- **Content**: Includes specific contract call parameters
- **Duration**: Voting delay period (e.g., 2 days) + voting period (e.g., 7 days)

### Stage 4: Voting

- **Mechanism**: On-chain token-weighted vote
- **Options**: For / Against / Abstain
- **Conditions**: Must meet quorum and the approval threshold
- **Duration**: Usually 5–7 days

### Stage 5: Timelock

- **Purpose**: Safety buffer — lets opponents exit positions before execution
- **Duration**: Usually 24–48 hours
- **Cancellation**: Can be cancelled if a serious problem is discovered

### Stage 6: Execution

- **Trigger**: Anyone can call the `execute` function
- **Effect**: The smart contract automatically carries out the operations defined in the proposal
- **Irreversible**: Once executed, the operation is on-chain and cannot be rolled back

### Full Lifecycle Diagram

```text
Forum discussion (3-7 days)
    |
    v
Snapshot temperature check (3-5 days)
    |
    v
Formal on-chain proposal
    |
    v
Voting delay (1-2 days)
    |
    v
Voting period (5-7 days)
    |  [quorum reached + approval threshold met]
    v
Timelock waiting period (24-48 hours)
    |
    v
Execution
```

---

## Quadratic Voting

Quadratic Voting (QV) is an innovative mechanism designed to reduce the outsized influence of large token holders.

### How It Works

In quadratic voting, the **cost** of votes grows as the **square** of the number of votes cast:

| Votes cast | Token cost |
|------------|------------|
| 1 vote | 1 token |
| 2 votes | 4 tokens |
| 3 votes | 9 tokens |
| 4 votes | 16 tokens |
| 10 votes | 100 tokens |

Formula: **cost = votes²**

### Why Quadratic Voting Is Fairer

Under 1T1V:
- A whale holding 1,000,000 tokens = 1,000,000 votes
- A small holder with 1 token = 1 vote
- Power ratio: 1,000,000×

Under quadratic voting:
- A whale holding 1,000,000 tokens = 1,000 votes (√1,000,000)
- A small holder with 1 token = 1 vote
- Power ratio: 1,000×

Quadratic voting substantially narrows the gap between large and small holders, better reflecting broad community consensus rather than the will of a few.

### Real-World Applications

- **Gitcoin Grants**: Uses quadratic funding (QF), the capital-allocation variant of QV, to distribute grants.
- **Optimism RetroPGF**: Applies a similar mechanism for public goods funding.
- **Some DAO temperature checks**: Snapshot supports quadratic voting as a configurable strategy.

### Challenges

- **Sybil attacks**: An attacker can create multiple addresses to evade the quadratic cost, so QV must be paired with identity verification (Gitcoin Passport, Proof of Humanity, etc.).
- **Complexity**: Many users struggle to understand how quadratic voting works.
- **Token semantics**: Defining what "spending" tokens means in practice varies by system.

---

## Other Voting Mechanisms

Beyond the mainstream mechanisms above, several innovative approaches are worth knowing.

### Conviction Voting

- **Principle**: Voting power accumulates over time; the longer you continuously vote on a proposal, the more weight your vote carries.
- **Characteristics**: Favors long-term participants; reduces manipulation by sudden influxes of capital.
- **Used by**: 1Hive, Gardens

### Optimistic Governance

- **Principle**: Proposals pass by default unless a challenge is raised within a defined window.
- **Advantages**: Dramatically improves governance efficiency and reduces voting fatigue.
- **Used by**: Parts of Optimism Collective's governance flow

### Holographic Consensus

- **Principle**: A prediction market filters proposals; only proposals that a market "backs" advance to a vote.
- **Advantages**: Reduces the volume of proposals requiring a vote, improving signal-to-noise ratio.
- **Used by**: DAOstack

### Rage Quit

- **Principle**: Members who oppose a passed proposal can exit the DAO before execution and withdraw their proportional share of the treasury.
- **Purpose**: Protects minority rights; prevents tyranny of the majority.
- **Used by**: Moloch DAO and its forks

---

## Summary

1. **Token voting (1T1V)** is the most fundamental governance mechanism — simple but prone to plutocracy and voter apathy.
2. **Delegated voting** improves participation and expertise through a representative model; it is the most effective tool against voter apathy.
3. **Timelocks** provide a security buffer, giving users time to exit before a malicious proposal executes.
4. **Hybrid on-chain/off-chain governance** is current best practice: use Snapshot for temperature checks, use Governor for final binding decisions.
5. **Quadratic voting** and other innovations are exploring fairer governance models, but still face challenges like Sybil resistance.

---

## Further Reading

- [Snapshot](https://snapshot.org/)
- [Tally](https://www.tally.xyz/)
- [OpenZeppelin Governor Documentation](https://docs.openzeppelin.com/contracts/5.x/governance)
- [Vitalik Buterin: Moving beyond coin voting governance](https://vitalik.eth.limo/general/2021/08/16/voting3.html)
- [Quadratic Voting explained (RadicalxChange)](https://www.radicalxchange.org/concepts/plural-voting/)
- [Compound Governance Documentation](https://compound.finance/governance)
- [Moloch DAO: Rage Quit mechanism](https://molochdao.com/)
