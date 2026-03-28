# DAO 工具生态

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 中级 - yellow)

> 💡 本课将全面介绍 DAO 工具生态中的核心产品。从多签钱包到一键建 DAO 平台，从治理合约框架到贡献追踪工具，你将掌握运营一个 DAO 所需要的完整工具箱，并学会如何根据实际需求进行工具选型。
>
> 欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)
>
> 进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> 文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> 购买 BTC / ETH / USDT 等加密货币推荐 [币安](https://www.binance.com/zh-CN)[注册链接](https://www.bsmkweb.cc/register?ref=39797374)

## 目录

- [Safe（Gnosis Safe）：多签钱包](#safegnosis-safe 多签钱包)
- [Aragon：一键创建 DAO](#aragon 一键创建 - dao)
- [OpenZeppelin Governor：治理合约框架](#openzeppelin-governor 治理合约框架)
- [Nouns Builder：Nouns 模式 DAO 创建工具](#nouns-buildernouns - 模式 - dao - 创建工具)
- [国库管理工具](# 国库管理工具)
- [贡献追踪工具](# 贡献追踪工具)
- [工具选型指南](# 工具选型指南)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

---

## Safe（Gnosis Safe）：多签钱包

[Safe](https://safe.global/)（原名 Gnosis Safe）是 Web3 世界中最重要的基础设施之一，也是绝大多数 DAO 管理国库资金的标配工具。

### 什么是多签钱包

多签钱包（Multi-Signature Wallet）要求 ** 多个签名者中的指定数量 ** 共同批准才能执行交易。例如一个 3/5 多签意味着 5 个签名者中需要至少 3 个人批准交易才能执行。

这类似于银行的联名账户：取款需要多位账户持有人的签字确认。

### Safe 的核心功能

1. ** 资产管理 **：安全存储和管理 ETH、ERC-20 代币、NFT 等各类资产
2. ** 多签审批 **：自定义签名者和阈值（如 3/5、4/7 等）
3. ** 交易队列 **：待审批的交易排队显示，签名者依次签名
4. ** 交易模拟 **：在执行前预览交易效果
5. ** 模块系统 **：支持扩展功能（如支出限额、定期支付等）
6. ** 多链支持 **：以太坊、Arbitrum、Optimism、Polygon、Base 等

### Safe 的使用规模

截至 2025 年，Safe 的数据令人印象深刻：

- ** 管理资产总额 **：超过 1000 亿美元
- ** 已创建 Safe 数量 **：超过 900 万个
- ** 累计交易数 **：超过 5000 万笔
- ** 使用 Safe 的知名项目 **：Uniswap、Aave、Lido、ENS、Gnosis 等

### 创建 Safe 的基本步骤

1. 访问 [app.safe.global](https://app.safe.global/)
2. 连接钱包并选择网络
3. 设置 Safe 名称
4. 添加签名者地址（Owners）
5. 设置确认阈值（如 3/5）
6. 部署 Safe 合约（需要 Gas 费）

### Safe 在 DAO 中的典型用途

```
DAO 治理投票通过
    ↓
时间锁等待期结束
    ↓
Safe 多签执行
    ↓
资金从国库转出 / 合约参数更新
```

许多 DAO 的治理提案最终执行权掌握在一个 Safe 多签中。例如，一个 DAO 的时间锁合约可能将 Safe 设为执行者，这样治理通过的提案需要经过多签确认才能最终执行。

### Safe 的安全最佳实践

- ** 签名者多样性 **：避免所有签名者来自同一个团队或地域
- ** 合理的阈值 **：太低不安全，太高影响效率（推荐 60-70% 的比例）
- ** 硬件钱包签名 **：签名者应使用 Ledger 或 Trezor 等硬件钱包
- ** 定期轮换 **：不活跃的签名者应被替换

---

## Aragon：一键创建 DAO

[Aragon](https://aragon.org/) 是最老牌的 DAO 创建和管理平台之一，提供了无需编码即可创建 DAO 的工具。

### Aragon 的核心产品

#### Aragon App

这是 Aragon 的主要产品，用户可以通过图形界面创建和管理 DAO：

- ** 创建 DAO**：选择治理模板、设置参数、部署合约
- ** 提案管理 **：创建、投票和执行治理提案
- ** 资金管理 **：管理 DAO 国库，发起转账
- ** 成员管理 **：添加 / 移除成员，管理权限

#### Aragon OSx

这是 Aragon 的底层协议框架，为开发者提供了模块化的 DAO 构建工具：

```solidity
// Aragon OSx 的插件架构示例
// DAO 由核心合约 + 可插拔的插件组成

// 核心 DAO 合约
contract DAO {
    // 权限管理
    function grant (address _where, address _who, bytes32 _permissionId) external;
    // 执行操作
    function execute (bytes32 _callId, Action [] calldata _actions) external;
}

// 投票插件（可替换）
contract TokenVotingPlugin {
    function createProposal (...) external returns (uint256);
    function vote (uint256 _proposalId, VoteOption _option) external;
}
```

### 使用 Aragon 创建 DAO 的流程

1. 访问 [app.aragon.org](https://app.aragon.org/)
2. 连接钱包，选择网络（以太坊、Polygon、Arbitrum 等）
3. 选择治理类型：
   - **Token Voting**：基于 ERC-20 代币的投票治理
   - **Multisig**：多签治理
4. 配置治理参数：
   - 最低参与率（Quorum）
   - 最低通过率（Approval）
   - 投票时长
5. 创建或导入治理代币
6. 设置初始成员
7. 审核并部署

### Aragon 的优势与局限

** 优势 **：
- 无需编码，5 分钟即可创建 DAO
- 模块化架构，可按需添加功能
- 久经验证，已被数千个 DAO 使用
- 完善的前端界面和文档

** 局限 **：
- 定制化程度有限（相比直接编写合约）
- 部分高级功能需要开发者介入
- Gas 费较高（部署多个合约）

---

## OpenZeppelin Governor：治理合约框架

[OpenZeppelin Governor](https://docs.openzeppelin.com/contracts/5.x/governance) 是目前使用最广泛的链上治理智能合约框架。Compound 的 GovernorBravo 是它的前身，OpenZeppelin 对其进行了标准化和模块化改进。

### Governor 合约架构

```
Governor（核心合约）
├── GovernorVotes（投票权来源：ERC-20Votes / ERC-721Votes）
├── GovernorCountingSimple（计票方式：赞成 / 反对 / 弃权）
├── GovernorVotesQuorumFraction（法定人数：总供应量的百分比）
├── GovernorTimelockControl（时间锁集成）
└── GovernorSettings（投票延迟、投票期、提案门槛）
```

### 部署一个基本的 Governor 合约

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract MyGovernor is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl
{
    constructor (
        IVotes _token,
        TimelockController _timelock
    )
        Governor ("MyGovernor")
        // 投票延迟：1 天（7200 个区块）
        // 投票期：1 周（50400 个区块）
        // 提案门槛：0（任何代币持有者都可以提案）
        GovernorSettings (7200, 50400, 0)
        GovernorVotes (_token)
        // 法定人数：总供应量的 4%
        GovernorVotesQuorumFraction (4)
        GovernorTimelockControl (_timelock)
    {}
}
```

### Governor 的关键参数

| 参数 | 含义 | 典型值 |
|------|------|--------|
| `votingDelay` | 提案创建到投票开始的延迟 | 1 天（7200 区块） |
| `votingPeriod` | 投票持续时间 | 1 周（50400 区块） |
| `proposalThreshold` | 提案者需要的最低代币数 | 0 - 100,000 |
| `quorumNumerator` | 法定人数比例 | 4%（总供应量） |
| `timelockDelay` | 时间锁等待期 | 48 小时 |

### 使用 Governor 的项目

Governor（或其前身 GovernorBravo）被许多知名项目使用：

- **Compound**：GovernorBravo 的发明者
- **Uniswap**：使用 GovernorBravo
- **ENS DAO**：使用 OpenZeppelin Governor
- **Gitcoin**：使用 OpenZeppelin Governor
- **Arbitrum DAO**：使用定制的 Governor

---

## Nouns Builder：Nouns 模式 DAO 创建工具

[Nouns Builder](https://nouns.build/) 是由 Zora 团队开发的 DAO 创建工具，让任何人都可以创建 Nouns 模式的 DAO。

### Nouns 模式是什么

Nouns DAO 创造了一种独特的治理模式：

1. ** 每日拍卖 **：每天自动拍卖一个 NFT
2. **NFT = 治理权 **：每个 NFT 代表一票投票权
3. ** 拍卖收入 = 国库 **：所有拍卖收入进入 DAO 国库
4. ** 持续增长 **：随着时间推移，成员和国库不断增长

这种模式的巧妙之处在于：它将 ** 资金筹集和治理权分配 ** 统一在了一个简单的机制中。

### Nouns Builder 的功能

- ** 自定义 NFT**：上传 NFT 的各个组件（头部、身体、配件等），系统自动生成随机组合
- ** 拍卖参数设置 **：拍卖持续时间、最低出价、保留价格等
- ** 治理配置 **：投票延迟、投票期、法定人数、提案门槛
- ** 创始人分配 **：设置创始人的 NFT 分配比例（如每 10 个 NFT 中有 1 个分配给创始人）

### 适用场景

- 想要创建一个持续增长的社区 DAO
- 希望通过 NFT 拍卖来筹集和管理资金
- 青睐 CC0（无版权保留）文化和开放参与

---

## 国库管理工具

DAO 国库通常管理着大量资金，需要专业的工具来确保安全和效率。

### Parcel

[Parcel](https://parcel.money/) 是一个面向 DAO 的财务管理平台：

- ** 批量支付 **：一次性向多个地址发送代币
- ** 薪资管理 **：设置定期支付，管理贡献者薪酬
- ** 预算追踪 **：按类别追踪国库支出
- ** 会计报告 **：生成财务报告，满足合规需求
- ** 多签集成 **：与 Safe 无缝集成

### Utopia Labs

[Utopia Labs](https://www.utopialabs.com/) 专注于 DAO 的运营和支付：

- ** 支付流程 **：从提案到支付的完整流程管理
- ** 贡献者管理 **：维护贡献者目录和支付信息
- ** 多币种支持 **：支持 ETH、稳定币、治理代币等多种支付方式
- **Tax 工具 **：帮助贡献者处理税务相关事宜

### Llama

[Llama](https://llama.xyz/) 提供 DAO 的链上治理和资金管理框架：

- ** 角色和权限 **：细粒度的权限控制系统
- ** 策略引擎 **：自定义审批流程和操作策略
- ** 链上执行 **：所有操作都在链上完成，完全透明

### Hedgey Finance

[Hedgey](https://hedgey.finance/) 专注于代币锁仓和释放：

- **Token Vesting**：为团队、投资者设置代币锁仓计划
- **Token Lockups**：代币时间锁定
- ** 治理集成 **：锁仓中的代币仍可用于治理投票

---

## 贡献追踪工具

如何公平地衡量和奖励贡献者是 DAO 运营中的核心挑战。以下工具试图解决这个问题。

### Coordinape

[Coordinape](https://coordinape.com/) 是一个去中心化的贡献评估和奖励分配工具。

** 工作原理 **：

1. ** 创建 Circle**：DAO 创建一个 Coordinape Circle（圈子）
2. ** 分配 GIVE**：每个成员每轮获得固定数量的 GIVE 代币（如 100 个）
3. ** 互相评价 **：成员将自己的 GIVE 分配给他们认为做出了贡献的其他成员
4. ** 奖励结算 **：根据每个成员收到的 GIVE 比例，分配这一轮的奖励资金

```
示例：
某轮 DAO 拨款 10,000 USDC 作为贡献者奖励

Alice 收到 300 GIVE（占总 GIVE 的 30%）→ 获得 3,000 USDC
Bob 收到 200 GIVE（占总 GIVE 的 20%）→ 获得 2,000 USDC
Carol 收到 150 GIVE（占总 GIVE 的 15%）→ 获得 1,500 USDC
...
```

** 优势 **：
- 完全由同伴评估，去中心化
- 简单直观，易于操作
- 能捕捉难以量化的贡献（如社区氛围、知识分享）

### SourceCred

[SourceCred](https://sourcecred.io/) 使用算法自动计算贡献者的贡献值。

** 工作原理 **：

- 分析 GitHub 代码提交、Discord 消息、Discourse 帖子等数据
- 使用 PageRank 类似的算法计算每个人的 "Cred" 分数
- 高 Cred 分数意味着更高的贡献度和更多的奖励

** 优势 **：
- 自动化，减少人为偏见
- 基于实际行为数据
- 持续追踪，不是一次性评估

** 局限 **：
- 难以衡量所有类型的贡献
- 可能被刻意刷量操纵
- 需要将各种数据源集成

### Guild.xyz

[Guild.xyz](https://guild.xyz/) 提供基于角色的社区访问控制：

- **Token-gated 访问 **：持有特定代币才能进入特定频道
- ** 角色管理 **：根据链上行为自动分配角色
- ** 跨平台 **：支持 Discord、Telegram、GitHub 等
- ** 贡献证明 **：完成特定任务可获得 NFT 或角色

---

## 工具选型指南

不同规模和类型的 DAO 需要不同的工具组合。以下是一个选型参考：

### 小型 DAO（< 50 人，< 100 万美元国库）

| 需求 | 推荐工具 | 理由 |
|------|---------|------|
| 资金管理 | Safe（3/5 多签） | 安全、可靠、免费 |
| 投票治理 | Snapshot | 零 Gas 费，简单易用 |
| 沟通协作 | Discord + Notion | 成本低，上手快 |
| 贡献追踪 | Coordinape | 适合小团队互评 |

### 中型 DAO（50-500 人，100 万 - 1 亿美元国库）

| 需求 | 推荐工具 | 理由 |
|------|---------|------|
| 资金管理 | Safe（4/7 多签）+ Parcel | 增加签名者，专业财务管理 |
| 投票治理 | Snapshot + Governor | 混合治理，重大决策上链 |
| DAO 框架 | Aragon 或 Nouns Builder | 标准化治理流程 |
| 贡献追踪 | Coordinape + Guild.xyz | 结合同伴评估和角色管理 |

### 大型 DAO（> 500 人，> 1 亿美元国库）

| 需求 | 推荐工具 | 理由 |
|------|---------|------|
| 资金管理 | Safe + Llama + Hedgey | 细粒度权限控制和代币管理 |
| 投票治理 | Governor + Tally + Snapshot | 完整的链上链下治理体系 |
| 委托系统 | Tally 委托功能 | 提高投票参与率 |
| 财务透明 | Parcel + 链上仪表盘 | 专业财务报告和实时数据 |
| 贡献追踪 | 多工具组合 | 不同工作流使用不同工具 |

### 选型核心原则

1. ** 安全第一 **：国库安全是最高优先级，多签是底线
2. ** 从简单开始 **：初期不需要复杂的链上治理，Snapshot + Safe 足够
3. ** 渐进升级 **：随着 DAO 成长，逐步引入更多工具
4. ** 可组合性 **：选择能与其他工具良好集成的产品
5. ** 社区驱动 **：选择社区活跃、持续维护的工具

---

## 总结

1. **Safe（多签钱包）** 是 DAO 国库管理的基石，几乎所有 DAO 都在使用，管理着超过 1000 亿美元的资产
2. **Aragon 和 Nouns Builder** 提供了无需编码即可创建 DAO 的能力，降低了准入门槛
3. **OpenZeppelin Governor** 是链上治理的行业标准，被 Compound、Uniswap 等顶级项目验证
4. ** 国库管理工具 **（Parcel、Llama）和 ** 贡献追踪工具 **（Coordinape、SourceCred）解决了 DAO 运营中的实际痛点
5. ** 工具选型应遵循 **「安全第一、从简开始、渐进升级」的原则

---

## 延伸阅读

- [Safe 官网](https://safe.global/)
- [Aragon 官网](https://aragon.org/)
- [OpenZeppelin Governor 文档](https://docs.openzeppelin.com/contracts/5.x/governance)
- [Nouns Builder](https://nouns.build/)
- [Coordinape 文档](https://docs.coordinape.com/)
- [SourceCred 文档](https://sourcecred.io/docs/)
- [Guild.xyz](https://guild.xyz/)
- [DAO 工具全景图 (DAO Tooling Landscape)](https://www.daomasters.xyz/)
