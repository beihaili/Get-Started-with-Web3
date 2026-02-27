# 使用 Web3 的第一个 DApp

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 初级 - brightgreen)

> 💡 自学入门 `Web3` 不是一件容易的事，作为一个刚刚入门 Web3 的新人，梳理一下最简单直观的 `Web3` 小白入门教程。整合开源社区优质资源，为大家从入门到精通 Web3 指路。每周更新 1-3 讲。
> 
> 欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)
> 
> 
> 进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)
> 
> 文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
> 
> 购买 BTC / ETH / USDT 等加密货币推荐 [币安](https://www.binance.com/zh-CN)[注册链接](https://accounts.marketwebb.me/register?ref=39797374)

## 目录

- [前言](# 前言)
- [DApp 是什么](#dapp - 是什么)
- [运行 DApp 的流程](# 运行 - dapp - 的流程)
- [使用 Web3 的第一个 DApp](# 使用 - web3 - 的第一个 - dapp)
- [常见问题](# 常见问题)
- [总结](# 总结)

## 前言

还记得第一次使用手机应用时的惊喜和喜悦吗？每一个新应用都代表着一个新世界的打开。在 Web3 世界中，这些应用被称为「DApps」（去中心化应用），它们有着异曲同工的力量 —— 能够彻底改变金融、社交和其他领域的运作方式。

今天，我们将一起探索如何使用您的第一个 Web3 DApp！对于 Web3 新手来说，这将是一次从「观察者」转变为「参与者」的重要转变。不需要编程技能，只需要动动手指，就能进入这个新世界的核心。

## DApp 是什么

DApp 是 `Decentralized Application` 的缩写，中文翻译为去中心化应用。DApp 是一种基于区块链的应用，它的运行不依赖于中心化的服务器，而是依赖于区块链网络。DApp 的运行结果会被写入区块链中，所有人都可以通过区块链查询到交易的执行结果。DApp 的应用场景广泛，可应用于：

- ** 去中心化金融 **：著名的有 Uniswap、Compound、Aave、Synthetix、MakerDAO、Yearn Finance、Curve Finance、Balancer 等。
- ** 去中心化社交 **：著名的有 Damus、Lens Protocol 等。
- **NFT**：著名的有 OpenSea、Rarible、SuperRare 等。
- ** 其他 **：治理、投票，著名的有 Snapshot、Gnosis 等。

## 运行 DApp 的流程

运行 DApp 的流程如下：

1. 开发者创建一个区块链钱包，并获得一些以太币来支付交易费用。
2. 开发者编写 DApp 的智能合约，并使用 Solidity 编程语言进行编码。
3. 开发者部署智能合约到以太坊网络中，例如通过 Remix 或 Truffle 等工具。
4. 开发者创建一个前端应用程序来与智能合约进行交互，例如使用 React 或 AngularJS 等工具。
5. 专业用户和开发者可以通过 web3 库连接前端应用程序和以太坊网络，以便与智能合约进行交互。
6. 普通用户通过前端应用程序与智能合约进行交互，例如提交交易或查询数据。

作为快速入门，本文仅介绍第 6 步，即普通用户通过前端应用程序与智能合约进行交互。第 1-5 步的内容将在后续的文章中介绍。

## 使用 Web3 的第一个 DApp

这里以 [Uniswap](https://uniswap.org/) 为例，介绍如何使用 Web3 的第一个 DApp。

1. 打开 [Uniswap](https://app.uniswap.org/#/swap)，点击 `MetaMask` 选择 `Görli 测试网络`。点击 `Connect to a wallet`，选择 `MetaMask`，然后点击 `Connect`。
   <div align="center"> <img src="./img/1.png" width="400" /> </div>

2. 点击 `Select a token`，选择 `ETH`，然后点击 `Select`。点击 `Select a token`，选择 `USDC`，然后点击 `Select`。
   P.S. 现在 `Görli 测试网络` 上的 ETH 通过 [LayerZero 跨链桥](https://testnetbridge.com/) 可以兑换真 ETH，所以测试网 ETH 价格很高 hhh。
   <div align="center"> <img src="./img/2.png" width="400" /> </div>

3. 输入希望交换的金额 `0.0001`，然后点击 `Swap`。点击 `Confirm Swap`，然后点击 `Swap`。
   <div align="center"> <img src="./img/3.png" width="400" /> </div>

4. 这时交易已经被提交到以太坊网络中，等待被打包。点击 `View on Etherscan`，然后点击 `View`。
   <div align="center"> <img src="./img/4.png" width="800" /> </div>

5. 交易成功上链，可以在 [以太坊区块浏览器](https://goerli.etherscan.io/) 中查询到交易的执行结果。
   <div align="center"> <img src="./img/5.png" width="800" /> </div>

## 📖 DApp 分类概览

Web3 世界中的 DApp 数量庞大、种类繁多。下面按照主要类别整理了各领域的代表性项目，帮助你快速了解 DApp 生态全貌。

### 🔑 DApp 主要类别

| 类别 | 说明 | 代表项目 | 所在链 |
|------|------|----------|--------|
| **DEX（去中心化交易所）** | 无需中介即可交换代币 | Uniswap, SushiSwap, Curve, 1inch | Ethereum, L2s |
| ** 借贷协议 ** | 去中心化的借贷市场 | Aave, Compound, MakerDAO, Morpho | Ethereum, L2s |
| ** 流动性质押 ** | 质押 ETH 获得流动性代币 | Lido, Rocket Pool, Frax ETH | Ethereum |
| ** 收益聚合 ** | 自动优化 DeFi 收益 | Yearn Finance, Beefy, Convex | 多链 |
| **NFT 市场 ** | 创建和交易数字收藏品 | OpenSea, Blur, Magic Eden, Rarible | Ethereum, Solana |
| ** 链游（GameFi）** | 边玩边赚的区块链游戏 | Axie Infinity, StepN, Illuvium, Big Time | 多链 |
| ** 去中心化社交 ** | 用户拥有数据的社交平台 | Lens Protocol, Farcaster, Nostr | Polygon, 多链 |
| **DAO 治理 ** | 去中心化的组织管理 | Snapshot, Tally, Aragon, Gnosis Safe | Ethereum |
| ** 跨链桥 ** | 在不同区块链间转移资产 | Stargate, Across, Wormhole, LayerZero | 多链 |
| ** 预言机 ** | 将链外数据引入链上 | Chainlink, Pyth Network, API3 | 多链 |

### 💡 DeFi 核心协议数据（参考）

| 协议 | 类型 | TVL 量级 | 支持链数 | 特点 |
|------|------|----------|----------|------|
| **Lido** | 流动性质押 | $200 亿 + | 1 | ETH 质押龙头 |
| **Aave** | 借贷 | $150 亿 + | 10+ | 多链借贷龙头 |
| **Uniswap** | DEX | $50 亿 + | 10+ | AMM 模式开创者 |
| **MakerDAO** | 稳定币 / 借贷 | $80 亿 + | 1 | DAI 稳定币发行者 |
| **Curve** | 稳定币 DEX | $20 亿 + | 10+ | 稳定币兑换效率最高 |

> 💡 ** 小贴士 **：TVL（Total Value Locked，总锁仓价值）是衡量 DeFi 协议规模的重要指标。你可以在 [DefiLlama](https://defillama.com/) 网站实时查看各协议的 TVL 排名。

## 📖 Uniswap 实操示例

Uniswap 是最经典的 DEX（去中心化交易所），掌握 Uniswap 的使用方法后，你就能使用大多数 DEX。

### 🔑 详细操作步骤

** 第一步：连接钱包 **

1. 访问 [app.uniswap.org](https://app.uniswap.org)
2. 点击右上角 **Connect Wallet**
3. 选择 **MetaMask**
4. MetaMask 弹窗出现，点击 **Connect**（连接）
5. 确认连接后，右上角会显示你的钱包地址

** 第二步：选择交易对和网络 **

1. 点击顶部的网络选择器，确认你在正确的网络上
   - 以太坊主网：Gas 费较高，适合大额交易
   - Arbitrum/Optimism/Base：Gas 费低，适合小额学习
2. 在 **You pay** 栏选择要卖出的代币（如 ETH）
3. 在 **You receive** 栏选择要买入的代币（如 USDC）

** 第三步：设置交易参数 **

1. 输入要兑换的数量
2. 点击右上角齿轮图标设置 **Slippage tolerance**（滑点容忍度）：
   ```
   滑点设置建议：
   - 主流代币（ETH, USDC 等）：0.5% 即可
   - 中等流动性代币：1-3%
   - 低流动性代币：5% 甚至更高（需谨慎）
   ```
3. 查看交易详情：
   - **Rate**：兑换比率
   - **Price Impact**：你的交易对价格的影响（< 1% 为正常）
   - **Minimum received**：考虑滑点后你最少会收到的数量
   - **Network fee**：预估的 Gas 费用

** 第四步：确认交易 **

1. 点击 **Swap** 按钮
2. MetaMask 弹窗显示交易详情
3. 确认 Gas 费合理后，点击 **Confirm**
4. 等待交易被区块链确认（通常 15 秒到几分钟）
5. 交易成功后可在 MetaMask 或区块浏览器中查看

> ⚠️ ** 重要提示 **：如果你是第一次交易某个代币，Uniswap 会先要求你进行一笔 **Approve**（授权）交易，允许 Uniswap 合约使用你的代币。这笔授权交易本身也需要 Gas 费。

### 🔑 Uniswap 高级功能

| 功能 | 说明 | 适合人群 |
|------|------|----------|
| **Swap** | 代币兑换 | 所有用户 |
| **Pool** | 提供流动性赚取手续费 | 进阶用户 |
| **Limit** | 限价单交易 | 有交易经验的用户 |
| **Send** | 兑换后直接发送到其他地址 | 有转账需求的用户 |

## 📖 Aave 借贷实操示例

Aave 是最大的去中心化借贷协议，允许你存入资产赚取利息，或抵押资产借出其他代币。

### 🔑 核心概念

| 概念 | 说明 |
|------|------|
| **Supply（存款）** | 将资产存入 Aave 赚取利息 |
| **Borrow（借款）** | 抵押资产后借出其他代币 |
| **APY（年化收益率）** | 存款的年化利息收益 |
| **APR（年化利率）** | 借款的年化利息成本 |
| **Health Factor（健康因子）** | 衡量借款安全性的指标，> 1 为安全 |
| **LTV（贷款价值比）** | 可借金额与抵押品价值的比率 |
| **Liquidation（清算）** | 当健康因子 < 1 时，抵押品会被强制出售 |

### 🔑 存款操作步骤

1. 访问 [app.aave.com](https://app.aave.com)
2. 连接 MetaMask 钱包
3. 选择要存入的资产（如 ETH）
4. 输入存款金额
5. 点击 **Supply**，在 MetaMask 中确认交易
6. 存款成功后会收到 **aToken**（如 aETH），代表你的存款凭证
7. aToken 会随时间自动增值，代表你在持续赚取利息

### 🔑 借款操作步骤

1. 首先完成存款（作为抵押品）
2. 在 Dashboard 中找到想借的资产
3. 点击 **Borrow**
4. 选择利率模式：
   - **Variable Rate**（浮动利率）：利率随市场变化
   - **Stable Rate**（稳定利率）：利率相对固定（并非所有资产都支持）
5. 输入借款金额
6. ** 密切关注 Health Factor**：
   ```
   Health Factor 安全区间：
   > 2.0  ：非常安全
   1.5-2.0：安全
   1.0-1.5：需要警惕，考虑还款或追加抵押
   < 1.0  ：触发清算！抵押品将被拍卖
   ```
7. 确认交易，借款到账

> ⚠️ ** 重要提示 **：DeFi 借贷有清算风险！当你的抵押品价值下跌或借款资产价格上涨时，Health Factor 会下降。如果 Health Factor 降到 1 以下，你的抵押品将被清算，可能损失大部分资产。建议始终保持 Health Factor > 1.5，并设置价格提醒。

### 💡 Aave 实用数据查看

- ** 存款 APY**：在 Aave 首页可以看到每种资产的存款利率
- ** 借款 APR**：同样在首页查看借款利率
- ** 你的仓位 **：Dashboard 页面展示你的存款、借款和 Health Factor
- ** 历史利率 **：可以在 [Aave 官方统计页面](https://aave.com/) 查看历史利率变化

## 📖 交易授权 UI 解读

当你在 DApp 中进行操作时，MetaMask 会弹出确认窗口。学会阅读这些信息至关重要。

### 🔑 MetaMask 弹窗关键信息

```
┌─────────────────────────────────────┐
│           MetaMask 通知              │
│                                     │
│  🦊 metamask.io                     │
│                                     │
│  [DApp 名称] 请求执行以下操作：       │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ 合约地址：0x1234...5678      │    │ ← 检查是否为官方合约
│  │ 函数：approve ()              │    │ ← 操作类型
│  │ 支出上限：115792...（无限制）  │    │ ← 注意授权额度！
│  └─────────────────────────────┘    │
│                                     │
│  预估 Gas 费：$2.50                  │
│  ┌─────────┐  ┌─────────────┐      │
│  │  拒绝   │  │   确认      │      │
│  └─────────┘  └─────────────┘      │
└─────────────────────────────────────┘
```

### 🔑 需要关注的关键项目

| 检查项 | 说明 | 风险等级 |
|--------|------|----------|
| ** 请求来源 ** | 确认 DApp 网址正确 | 高 |
| ** 合约地址 ** | 与官方公布的合约地址对比 | 高 |
| ** 操作类型 ** | approve = 授权，transfer = 转账 | 高 |
| ** 授权额度 ** | 无限额度 vs 精确额度 | 中 |
| **Gas 费 ** | 是否合理，异常高的 Gas 可能有问题 | 中 |
| ** 接收地址 ** | 转账时确认收款地址正确 | 高 |

### 🔑 常见交易类型解读

| MetaMask 显示 | 含义 | 注意事项 |
|--------------|------|----------|
| **Approve** | 授权 DApp 使用你的代币 | 建议设置精确额度，而非无限 |
| **Transfer** | 直接转账代币 | 确认收款地址和金额 |
| **Swap** | 代币兑换 | 检查滑点设置和最低接收量 |
| **Supply/Deposit** | 存入资产到协议 | 确认协议合约地址正确 |
| **Borrow** | 从协议中借款 | 注意 Health Factor |
| **Claim** | 领取奖励 | 确认是否为官方领取页面 |

> ⚠️ ** 重要提示 **：如果 MetaMask 弹窗中的 Gas 费异常高（比平时高几十倍），** 不要确认 **！这可能意味着交易会失败但仍会消耗 Gas，或者你在与恶意合约交互。

## 📖 Gas 费优化技巧

Gas 费是使用以太坊 DApp 时最大的成本之一。学会优化 Gas 费可以为你节省大量资金。

### 🔑 理解 Gas 费组成

```
以太坊 Gas 费 = Gas Used × (Base Fee + Priority Fee)

- Gas Used：交易消耗的计算量（由交易复杂度决定）
- Base Fee：基础费率（由网络拥堵程度决定，自动调整）
- Priority Fee：小费（给验证者的额外奖励，影响确认速度）
```

### 🔑 Gas 费优化策略

| 策略 | 节省幅度 | 难度 | 说明 |
|------|----------|------|------|
| ** 选择低峰时段 ** | 30-70% | 简单 | UTC 凌晨（亚洲早上）费率通常最低 |
| ** 使用 L2 网络 ** | 90-99% | 简单 | Arbitrum、Optimism、Base 等 |
| ** 批量操作 ** | 20-40% | 中等 | 多个操作合并为一笔交易 |
| ** 设置精确授权 ** | 间接节省 | 简单 | 避免未来需要撤销无限授权 |
| **Gas Token** | 10-20% | 高级 | 在 Gas 低时存储，高时消耗 |

### 🔑 以太坊 L2 Gas 费对比

| 网络 | 简单转账费用 | Swap 费用 | 确认时间 | 安全性 |
|------|-------------|----------|----------|--------|
| **Ethereum L1** | $1-50 | $5-100+ | ~12 秒 | 最高 |
| **Arbitrum** | $0.01-0.5 | $0.05-1 | ~1 秒 | 高（Optimistic Rollup） |
| **Optimism** | $0.01-0.5 | $0.05-1 | ~2 秒 | 高（Optimistic Rollup） |
| **Base** | $0.001-0.1 | $0.01-0.5 | ~2 秒 | 高（Optimistic Rollup） |
| **zkSync Era** | $0.01-0.3 | $0.05-0.5 | ~5 分钟 | 高（ZK Rollup） |
| **Polygon** | $0.001-0.01 | $0.01-0.05 | ~2 秒 | 中（侧链） |

> 💡 ** 小贴士 **：如果你是新手学习 DApp 操作，强烈建议先在 L2 网络（如 Arbitrum 或 Base）上练习。Gas 费通常只需几美分，即使操作失误也不会有太大损失。将 ETH 从 L1 转到 L2 可以使用官方跨链桥或第三方桥（如 Stargate）。

### 🔑 实时查看 Gas 费工具

- **ETH Gas Station**：[ethgasstation.info](https://ethgasstation.info/) — 以太坊 Gas 费实时监控
- **Blocknative Gas Estimator**：浏览器插件，实时显示 Gas 费
- **Ultrasound.money**：[ultrasound.money](https://ultrasound.money/) — 以太坊燃烧和 Gas 数据

## 📖 DApp 安全注意事项

DApp 的世界充满机遇，但也充满风险。以下是保护自己安全的关键知识。

### 🔑 使用 DApp 前的安全检查清单

| 检查项目 | 如何验证 | 重要性 |
|----------|---------|--------|
| ** 智能合约是否经过审计 ** | 查看项目官网的 Audit 报告 | 极高 |
| ** 项目是否开源 ** | 在 GitHub 上查看源代码 | 高 |
| **TVL 和用户量 ** | 在 DefiLlama 上查看数据 | 高 |
| ** 项目运营时间 ** | 运行越久，经历越多考验 | 中 |
| ** 社区声誉 ** | Twitter、Discord 社区活跃度 | 中 |
| ** 是否有保险 ** | 是否被 Nexus Mutual 等保险协议覆盖 | 中 |

### 🔑 Token 授权管理

当你使用 DApp 时，通常需要授权（Approve）DApp 合约使用你的代币。** 无限授权是最大的安全隐患之一 **。

** 使用 revoke.cash 管理授权 **：

1. 访问 [revoke.cash](https://revoke.cash/)
2. 连接你的钱包
3. 查看所有已授权的合约列表
4. 对于不再使用的 DApp，点击 **Revoke**（撤销）
5. 在 MetaMask 中确认撤销交易

** 授权管理建议 **：

```
推荐做法：
✅ 每次交易只授权需要的精确金额
✅ 每月检查一次授权列表
✅ 不再使用的 DApp 立即撤销授权
✅ 大额资产存放在不与 DApp 交互的钱包中

不推荐做法：
❌ 给所有 DApp 无限授权
❌ 长期不检查授权情况
❌ 在主钱包中进行高风险 DApp 交互
```

### 🔑 常见钓鱼手段与防范

| 钓鱼手段 | 表现形式 | 防范方法 |
|----------|---------|----------|
| ** 假冒网站 ** | 域名与官方网站极其相似 | 手动输入或使用书签访问 |
| ** 恶意空投 ** | 钱包中出现不明代币 | 不要尝试出售不明代币 |
| ** 假客服 ** | Discord/Telegram 中的「客服」私聊 | 官方客服不会主动私聊 |
| ** 虚假合约 ** | 合约地址与官方合约不同 | 从官方渠道获取合约地址 |
| ** 签名钓鱼 ** | 要求签名看似无害的消息 | 仔细阅读签名内容 |
| **Permit 钓鱼 ** | 利用 ERC-20 Permit 功能 | 不在不信任的网站上签名 |

> ⚠️ ** 重要提示 **：在 Web3 世界里，** 你是自己资产安全的唯一责任人 **。没有银行客服会帮你追回被盗资产，没有「忘记密码」可以点击。养成良好的安全习惯是在 Web3 世界长期生存的必要条件。

### 💡 新手安全实践建议

1. ** 分钱包策略 **：
   - ** 热钱包 **：小额资金，用于日常 DApp 交互
   - ** 冷钱包 **：大额资金，极少与 DApp 交互
2. ** 先小额测试 **：任何新的 DApp 先用小金额尝试
3. ** 保持怀疑 **：如果一个项目承诺「无风险高收益」，99% 是骗局
4. ** 关注安全资讯 **：关注 [rekt.news](https://rekt.news/) 了解最新的安全事件
5. ** 学习基础知识 **：理解智能合约的基本原理，有助于识别风险

## 常见问题

#### ❓ 什么是去中心化应用（DApp）和传统应用的主要区别？

DApp 与传统应用的主要区别在于：

1. ** 存储位置 **：DApp 的代码和数据存储在分布式的区块链上，而非中心化服务器。
2. ** 控制权 **：没有单一实体能够关闭或控制 DApp，因为它运行在去中心化网络上。
3. ** 透明性 **：DApp 的代码和交互完全公开透明，任何人都可以查看。
4. ** 手续费 **：使用 DApp 通常需要支付小额的加密货币作为 Gas 费用。

#### ❓ 为什么 Uniswap 被称为 Web3 领域的重要 DApp？

Uniswap 被称为 Web3 领域的重要 DApp 因为：

1. 它是第一个成功实现自动做市商（AMM）模式的去中心化交易所。
2. 没有订单簿，完全通过流动性池进行估值和交易。
3. 任何人都可以无需许可即添加代币和提供流动性。
4. 它引领了 DeFi（去中心化金融）这一重要领域的发展。

#### ❓ 我可以在测试网上使用 DApp 测试的代币有真实价值吗？

通常测试网代币没有真实价值，因为它们就是为了测试目的被创建的。然而，文章中提到一个特殊情况，现在 Görli 测试网上的 ETH 可以通过 LayerZero 跨链桥兑换真实的 ETH，所以这些测试网 ETH 确实有一定价值。但这是罕见的特殊情况，大多数测试网资产没有真实价值。

## 总结

今天，你在 Web3 旅程中迈出了重要的一步 —— 使用了第一个去中心化应用！想象一下，你刚刚在没有任何中间商的情况下完成了一笔加密货币的交换。这不仅仅是一个简单的操作，而是对传统金融系统的一次小小革命。

期待学习和实践更多的 DApp 吧！在下一篇文章中，我们将介绍更多 Web3 领域的有用网站，帮助你深入探索这个令人兴奋的新世界。传统金融系统打造了墙与门，而区块链打破了这些障碍，让你的财务自由真正掌握在自己手中。

恭喜你，现在你可以作为用户参与到几乎所有的区块链 DApp 应用了！🎉🎉🎉

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 返回主页 </a> | 
<a href="https://twitter.com/bhbtc1337">🐦 关注作者 </a> | 
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 加入交流群 </a>
</div>
