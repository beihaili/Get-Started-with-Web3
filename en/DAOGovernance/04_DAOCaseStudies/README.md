# Notable DAO Case Studies

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Theory needs cases to validate it. This lesson analyzes five of the most representative DAOs — MakerDAO, Uniswap DAO, ConstitutionDAO, Nouns DAO, and Lido DAO — distilling practical governance wisdom from their successes and failures.
>
> Follow me on Twitter: [@bhbtc1337](https://twitter.com/bhbtc1337)
>
> Join the WeChat group: [Form Link](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> Articles are open-sourced on GitHub: [Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> Recommended exchange for buying BTC / ETH / USDT: [Binance](https://www.binance.com/en) [Registration Link](https://www.bsmkweb.cc/register?ref=39797374)

## Table of Contents

- [MakerDAO: A Model for DeFi Governance](#makerdao-a-model-for-defi-governance)
- [Uniswap DAO: Governance of the Largest DeFi Protocol](#uniswap-dao-governance-of-the-largest-defi-protocol)
- [ConstitutionDAO: A Social Experiment in Crowdfunding](#constitutiondao-a-social-experiment-in-crowdfunding)
- [Nouns DAO: Daily Auctions and CC0 Culture](#nouns-dao-daily-auctions-and-cc0-culture)
- [Lido DAO: The Decentralization Challenge of a Staking Protocol](#lido-dao-the-decentralization-challenge-of-a-staking-protocol)
- [Governance Lessons from the Cases](#governance-lessons-from-the-cases)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## MakerDAO: A Model for DeFi Governance

### Background

MakerDAO is one of the earliest and most important DeFi protocols on Ethereum, founded in 2014. It operates DAI — a decentralized stablecoin that maintains a 1:1 peg to the US dollar through over-collateralization of crypto assets such as ETH.

As of 2025, MakerDAO (now rebranded as Sky) by the numbers:

- **Total DAI issued**: Has exceeded $10 billion
- **TVL (Total Value Locked)**: Consistently among the top DeFi protocols
- **MKR governance token market cap**: Billions of dollars
- **Operating history**: Over 10 years, through multiple extreme market events

### Governance Mechanism

MakerDAO uses the MKR token for governance, with one of the most complex and mature mechanisms in DeFi.

#### Dual Voting System

1. **Governance Poll**: Similar to a temperature check — gauges community sentiment. Votes are on-chain but do not directly trigger execution.

2. **Executive Vote**: A binding on-chain vote. When it passes, it modifies actual parameters in the Maker Protocol.

```text
Community discussion --> Governance Poll (signal) --> Executive Vote (binding) --> Parameter update
```

#### Emergency Shutdown

This is one of MakerDAO's most distinctive safety designs. When the system faces a serious threat (oracle failure, smart contract exploit), holders of sufficient MKR can trigger an **Emergency Shutdown**:

1. The system stops accepting new collateral deposits.
2. All DAI holders can redeem collateral at a 1 DAI = $1 rate.
3. All user assets are protected.

The shutdown trigger threshold is 50,000 MKR (roughly 5% of total supply) — high enough to ensure it is taken seriously, while preserving the emergency capability in extreme conditions.

#### Scope of Governance Decisions

MKR holders control the following key protocol parameters through governance:

- **Stability Fee**: The interest rate for borrowing DAI, which influences DAI supply/demand and its peg.
- **Liquidation Ratio**: The collateral-to-debt ratio at which a vault gets liquidated.
- **Collateral types**: Which assets are accepted as collateral (ETH, WBTC, USDC, etc.).
- **DAI Savings Rate (DSR)**: The interest rate paid to DAI holders.
- **Oracle selection**: Which price oracles the protocol trusts.

### MakerDAO's Governance Experience

**What worked**:
- Survived "Black Thursday" in March 2020 (ETH dropped 40%+ in a single day) and recovered.
- Governance mechanisms have iterated continuously, evolving from simple voting to multi-layer governance.
- Built a SubDAO structure (the Endgame Plan) to further decentralize governance power.

**Challenges**:
- Voter turnout has been persistently low; most MKR holders do not participate.
- Large holders (such as a16z and Paradigm) have disproportionate voting power.
- The "Endgame Plan" restructuring that began in 2023 has generated significant community controversy.

---

## Uniswap DAO: Governance of the Largest DeFi Protocol

### Background

Uniswap is the largest decentralized exchange (DEX) on Ethereum, founded by Hayden Adams in 2018. In September 2020, Uniswap launched the UNI governance token and formally opened DAO governance.

Key figures:
- **UNI total supply**: 1 billion
- **Treasury**: Billions of dollars in UNI tokens
- **Cumulative trading volume**: Over $2 trillion
- **Deployed chains**: Ethereum, Arbitrum, Optimism, Polygon, Base, BNB Chain, and more

### The Historic Airdrop

On September 17, 2020, Uniswap airdropped **400 UNI** to every address that had ever interacted with Uniswap V1 or V2. It remains one of the most famous airdrops in crypto history:

- **Airdrop recipients**: ~251,534 addresses
- **Each address received**: 400 UNI (worth ~$1,200 at launch; over $16,000 at peak)
- **Total airdropped**: 150 million UNI (15% of total supply)

The airdrop was both a thank-you to early users and a deliberate act of distributing governance power to actual protocol participants.

### Governance Architecture

Uniswap uses the GovernorBravo contract for on-chain governance:

| Parameter | Value | Notes |
|-----------|-------|-------|
| Proposal threshold | 2.5M UNI | Minimum voting power to submit a proposal |
| Quorum | 40M UNI | Minimum For votes for a proposal to pass |
| Voting period | ~7 days | Duration of the voting window |
| Timelock | At least 2 days | Waiting period between passage and execution |

### Notable Governance Proposals

#### 1. DeFi Education Fund

In 2021, Uniswap governance approved a proposal to allocate 1 million UNI (~$25 million at the time) to the DeFi Education Fund (DEF).

The proposal sparked major controversy:
- **Supporters** argued that funds were needed for DeFi policy advocacy and education.
- **Critics** questioned the transparency and necessity of the allocation.
- DEF immediately sold half the UNI for USDC after receiving the funds, intensifying criticism.

This case exposed a core DAO governance problem: **oversight and accountability for large treasury grants**.

#### 2. The Fee Switch

Uniswap currently routes all trading fees to liquidity providers (LPs). The community has debated multiple times whether to activate a **protocol fee switch** that would redirect a portion of fees to UNI holders.

The debate has gone through multiple rounds of discussion and votes:
- **Supporters**: UNI holders should benefit from the protocol's success.
- **Opponents**: Could reduce LP returns and hurt Uniswap's competitiveness.
- As of 2025, the fee switch question remains ongoing.

#### 3. Multi-Chain Deployments

Uniswap has used governance to decide where to deploy:
- 2022: Deployed to Polygon (the Polygon team offered $20 million in liquidity incentives)
- 2023: Deployed to Arbitrum and Optimism
- 2024–2025: Expanded to Base, BNB Chain, Avalanche, and others

### Uniswap's Governance Experience

**What worked**:
- The airdrop design was sound — it placed governance power in the hands of real users.
- Multi-chain deployment decisions were made through governance, demonstrating decentralized decision-making in practice.
- A delegate system was built out, improving voter participation.

**Challenges**:
- The proposal threshold (2.5M UNI) is extremely high; ordinary users cannot practically submit proposals.
- Voter turnout remains low.
- Oversight mechanisms for large treasury grants are underdeveloped.

---

## ConstitutionDAO: A Social Experiment in Crowdfunding

### What Happened

In November 2021, a group of crypto community members launched **ConstitutionDAO** with one goal: to bid on a copy of the **United States Constitution** (one of 13 surviving original prints) at a Sotheby's auction.

**Timeline**:

1. **November 11**: ConstitutionDAO is announced; crowdfunding begins.
2. **November 11–18**: Raises approximately **$47 million** in ETH over 7 days.
3. **November 18**: At the Sotheby's auction, ConstitutionDAO bids up to **$43 million**.
4. **November 18**: Citadel CEO Ken Griffin wins with a bid of **$43.2 million**.
5. **Late November**: ConstitutionDAO announces it lost; refund process begins.

### Participation Scale

- **Contributors**: Over 17,437 donors
- **Total raised**: ~$47 million (~11,613 ETH)
- **Average donation**: ~$206
- **Token**: PEOPLE (which later became a cultural meme token)

### Successes and Failures

**What worked**:

1. **Demonstrated DAO mobilization power**: Nearly $50 million raised in 7 days, fully decentralized.
2. **Lowered DAO's cognitive barrier**: Introduced many ordinary people to the concept of a DAO for the first time.
3. **Media impact**: Widely covered by CNN, BBC, The New York Times, and other mainstream outlets.
4. **Community cohesion**: Strangers from around the world united for a single shared purpose.

**Failures and lessons**:

1. **Exposed bidding strategy**: On-chain transparency meant competitors could see ConstitutionDAO's maximum bid capacity.
2. **Gas fee problem**: Each refund required paying gas (~$50–$100), making refunds uneconomical for small contributors.
3. **No legal entity**: Without a legal entity, the DAO could not directly hold a physical asset.
4. **No formal governance**: The entire process had no formal governance vote; decisions were made by a core team.

### The PEOPLE Token Aftermath

Despite losing the auction, ConstitutionDAO's token PEOPLE unexpectedly became a **cultural meme token**:

- Many holders chose not to claim refunds and kept their PEOPLE tokens.
- PEOPLE traded on secondary markets and at one point had a market cap exceeding $1 billion.
- It became a symbol of "DAO spirit" and decentralized culture.

---

## Nouns DAO: Daily Auctions and CC0 Culture

### Background

Nouns DAO launched in August 2021 and is an innovative experiment combining NFTs with DAO governance. Its core mechanism is elegantly simple: **one Noun NFT is auctioned every day, all auction proceeds go into the DAO treasury, and NFT holders vote on how the treasury is used**.

Each Noun is a 32×32 pixel avatar generated by randomly combining different head, body, and accessory components.

### Core Mechanism

#### Daily Auction

```text
A new Noun NFT is auto-generated each day --> 24-hour auction --> Highest bidder receives the NFT --> Bid amount enters the treasury
```

Auction rules:
- A new auction starts automatically every day.
- Each auction runs for 24 hours.
- Any bid placed in the final 5 minutes extends the auction by 5 minutes.
- 100% of auction revenue flows into the treasury.

#### Governance Rights

- Each Noun NFT = 1 vote
- Governance uses a modified Compound Governor
- Votes determine how treasury funds are allocated

#### Nounder Allocation

Every 10th Noun is automatically allocated to the Nounders (founding team) as long-term incentive. The founding team receives 10% of all NFTs rather than drawing funds directly from the treasury.

### Treasury Scale and Uses

Nouns DAO has accumulated over **30,000 ETH** in auction revenue (worth tens of millions of dollars). Treasury funds have been used for a wide variety of projects:

- **Brand promotion**: Nouns glasses appeared in a Super Bowl advertisement.
- **Public goods**: Funding open-source projects and educational content.
- **Cultural events**: Sponsoring music festivals and art exhibitions.
- **Ecosystem projects**: Supporting creative Nouns ecosystem initiatives.
- **Charitable giving**: Donations to nonprofit organizations.

### CC0 Culture

One of Nouns DAO's most influential ideas is **CC0 (Creative Commons Zero)** — a complete waiver of copyright:

- Anyone can use Nouns' brand, images, and code.
- No permission required, no fees.
- Derivative creation and free distribution are encouraged.

Paradoxically, this open IP strategy has *strengthened* the Nouns brand, spawning a large number of derivative projects (Lil Nouns, Nouns Builder, various Nouns-themed merchandise, and more).

### Governance Controversy

Nouns DAO's journey has not been without turbulence. In 2023, the DAO experienced a significant **Fork** event:

- A portion of members felt treasury funds were being deployed inefficiently.
- Using Nouns' built-in Fork mechanism, roughly 55% of Noun holders chose to exit.
- Those members withdrew approximately 27,000 ETH from the treasury when they forked.
- The event sparked broad discussion about governance efficiency and minority protections in DAOs.

### Nouns DAO's Experience

**Innovations**:
- The daily auction mechanism creates a continuous stream of funding and membership growth.
- The CC0 strategy proves that openness can be more valuable than exclusivity.
- The Fork mechanism gives minorities an exit right (similar to Moloch DAO's Rage Quit).

**Challenges**:
- High NFT prices create a high participation barrier (individual Nouns have sold for 100+ ETH).
- Treasury efficiency has been questioned.
- The Fork event exposed DAO fragility when deep disagreements arise.

---

## Lido DAO: The Decentralization Challenge of a Staking Protocol

### Background

Lido is the largest liquid staking protocol on Ethereum. Users deposit ETH into Lido and receive stETH (a liquid staking derivative), while Lido distributes the ETH across node operators who run validators.

Key figures:
- **Total ETH staked**: Has exceeded 30% of all ETH staked on Ethereum
- **stETH market cap**: Tens of billions of dollars
- **LDO governance token**: Used to govern Lido DAO

### Governance Mechanism

Lido DAO uses LDO tokens for governance, built on the Aragon framework:

- **Voting method**: LDO token-weighted voting
- **Platforms**: Snapshot (signal votes) + on-chain voting (binding)
- **Key decisions**: Node operator selection and management, protocol parameter adjustments, treasury allocation

### The Decentralization Dilemma

Lido faces a unique governance tension: **its success may threaten Ethereum's decentralization**.

#### The Problem

When Lido's staking share exceeds 33% of all ETH staked, Lido's collective set of node operators could theoretically exert disproportionate influence on the Ethereum network:

- 33% of stake can delay block finality.
- 50% enables censorship attacks.
- 66% can control network consensus.

#### Lido's Response

1. **Node operator diversification**: Lido does not run validators itself — it distributes staking across dozens of independent node operators.
2. **Dual Governance**: Introduces governance rights for stETH holders, not just LDO holders.
3. **Self-cap discussions**: The community has debated whether Lido should voluntarily cap its own staking share.
4. **Distributed Validator Technology (DVT)**: Advocates for a more decentralized validator architecture.

#### Community Debate

Lido's decentralization problem has generated broad discussion across the Ethereum community:

- **One camp**: Lido should self-impose limits to protect Ethereum's decentralization.
- **Another camp**: Limits are anti-competitive; the market should self-regulate.
- **Vitalik's position**: Has publicly expressed concern multiple times about any single staking protocol holding an outsized share.

### The Dual Governance Proposal

Lido's Dual Governance design is a significant governance innovation:

```text
Traditional model: LDO holders vote --> execute

Dual Governance:   LDO holders vote --> stETH holders can veto --> execute
```

This design gives actual protocol users (stETH holders) a **veto right**, preventing LDO whales from making decisions that harm user interests. It mirrors the logic of a **bicameral legislature** in the real world.

### Lido DAO's Experience

**What worked**:
- Created the largest ETH liquid staking market.
- Proactively addressed decentralization concerns by pushing governance reform.
- The Dual Governance innovation provides a reference design for other DAOs.

**Challenges**:
- LDO token distribution is insufficiently dispersed; a small number of large holders wield outsized influence.
- Staking concentration has not been fully resolved.
- Governance complexity increases as the protocol scales.

---

## Governance Lessons from the Cases

After analyzing these five DAOs, we can distill the following key governance insights.

### 1. Governance Power Distribution Defines a DAO's Character

- Uniswap's airdrop gave governance power to users → user-driven governance
- MakerDAO's MKR sits primarily with investors → investor-driven governance
- Nouns' daily auction → governance power goes to whoever is willing to pay

**Lesson**: The initial method of token/governance distribution has a decisive influence on a DAO's long-term governance culture.

### 2. Emergency Mechanisms Are Non-Negotiable

- MakerDAO's Emergency Shutdown protected the system during extreme market conditions.
- Nouns' Fork mechanism provided an orderly exit path when the community fractured.

**Lesson**: DAOs need more than routine governance flows — they also need contingency plans.

### 3. Transparency Is a Double-Edged Sword

- ConstitutionDAO's on-chain transparency let competitors see its maximum bid.
- But transparency is also the foundation of a DAO's credibility.

**Lesson**: Transparency builds trust, but certain scenarios (like competitive bidding) require privacy protections.

### 4. Legal Entity Matters

- ConstitutionDAO could not hold physical assets because it lacked a legal entity.
- More and more DAOs are choosing to register legal entities (e.g., Lido registered in the Cayman Islands).

**Lesson**: Pure on-chain governance cannot cover every scenario; interacting with the physical world requires legal identity.

### 5. Governance Is a Continuous Iteration Process

- MakerDAO evolved from simple voting to a SubDAO structure.
- Lido evolved from single-token governance to Dual Governance.
- No DAO's initial governance design was perfect.

**Lesson**: DAO governance mechanisms must be continuously adjusted and refined based on operational experience.

---

## Summary

1. **MakerDAO** demonstrates the complexity of DeFi protocol governance; its Emergency Shutdown and multi-layer voting system are models of governance design.
2. **Uniswap DAO** distributed governance power to users through a historic airdrop, but a high proposal threshold and low participation remain persistent challenges.
3. **ConstitutionDAO** proved the rapid mobilization power of DAOs, while exposing the problems of on-chain transparency and the absence of a legal entity.
4. **Nouns DAO** pioneered a new DAO model through daily auctions and CC0 strategy; the Fork event illustrated the value of minority protection mechanisms.
5. **Lido DAO's** Dual Governance proposal is an important exploration of protecting protocol users' interests, and serves as a warning about the impact of protocol concentration on the underlying network.

---

## Further Reading

- [MakerDAO Governance Forum](https://forum.makerdao.com/)
- [Uniswap Governance Portal](https://gov.uniswap.org/)
- [ConstitutionDAO retrospective (The Verge)](https://www.theverge.com/2021/11/18/22790282/constitutiondao-lost-auction-crypto-bid-sothebys-us-constitution)
- [Nouns DAO](https://nouns.wtf/)
- [Lido Governance Forum](https://research.lido.fi/)
- [Lido Dual Governance Proposal](https://research.lido.fi/t/dual-governance-design/)
- [a16z: DAO Governance Best Practices](https://a16zcrypto.com/posts/article/dao-governance-best-practices/)
