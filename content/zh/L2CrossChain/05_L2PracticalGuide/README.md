# L2 实操指南

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 中级 - yellow)

> 💡 学了前面四课的理论，现在该动手实操了。本课手把手教你如何把资产桥接到 L2、配置网络、使用 DeFi，并通过真实的 Gas 费对比帮你做出最优的选链决策。
>
> 欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)
>
> 进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> 文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> 购买 BTC / ETH / USDT 等加密货币推荐 [币安](https://www.binance.com/zh-CN)[注册链接](https://www.bsmkweb.cc/register?ref=39797374)

## 目录

- [将资产从以太坊桥接到 L2](# 将资产从以太坊桥接到 - l2)
- [MetaMask 添加 L2 网络配置](#metamask - 添加 - l2 - 网络配置)
- [在 L2 上使用 DeFi](# 在 - l2 - 上使用 - defi)
- [Gas 费对比实测](#gas - 费对比实测)
- [选链策略](# 选链策略)
- [L2 上的常见坑和注意事项](#l2 - 上的常见坑和注意事项)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

## 将资产从以太坊桥接到 L2

我们以 Arbitrum 官方桥为例，演示如何将 ETH 从以太坊主网桥接到 Arbitrum One。

### 使用 Arbitrum 官方桥

** 步骤 1：访问官方桥 **

打开 [bridge.arbitrum.io](https://bridge.arbitrum.io/)，连接你的 MetaMask 钱包。

> ⚠️ ** 安全提醒 **：务必确认你访问的是官方网址。钓鱼网站是最常见的资产损失原因之一。建议将官方桥网址加入浏览器书签。

** 步骤 2：选择桥接方向和金额 **

```
界面操作:

From: Ethereum Mainnet
  └── 选择代币: ETH
  └── 输入金额: 0.1 ETH (建议先用小额测试)

To: Arbitrum One
  └── 自动显示将收到的金额

预估费用:
  └── L1 Gas 费：约 $3-15 (取决于主网拥堵程度)
  └── 桥接时间：约 10-15 分钟
```

** 步骤 3：确认交易 **

MetaMask 会弹出交易确认窗口，显示：
- 交易金额
- Gas 费预估
- 目标合约地址（确认是 Arbitrum 官方桥合约）

点击确认后，等待以太坊主网确认交易。

** 步骤 4：等待到账 **

```
桥接进度:

L1 → L2 (存款方向):
  以太坊确认 (~2 分钟) → Arbitrum 确认 (~10 分钟)
  总计：约 10-15 分钟

L2 → L1 (提款方向):
  Arbitrum 发起 → 7 天挑战期 → 以太坊确认
  总计：约 7 天
```

存款（L1→L2）通常只需 10-15 分钟。但提款（L2→L1）需要等待 7 天挑战期 —— 这是 Optimistic Rollup 的安全特性。

### 使用第三方桥加速提款

如果你不想等 7 天，可以使用第三方桥进行快速提款：

| 桥 | 提款时间 | 手续费 | 适合 |
|----|---------|--------|------|
| Arbitrum 官方桥 | 7 天 | 仅 Gas 费 | 不急的大额 |
| Hop Protocol | 5-20 分钟 | 0.04-0.1% | 中等金额 |
| Across Protocol | 1-5 分钟 | 0.06-0.12% | 快速需求 |
| Stargate (LayerZero) | 1-10 分钟 | 0.06% | 多链需求 |

第三方桥的原理通常是：流动性提供者在 L1 上预先放置了资金，你在 L2 把资产交给桥，桥在 L1 上立即（或快速）释放对应的资金给你。桥在 7 天后通过官方桥取回资产。

## MetaMask 添加 L2 网络配置

大部分 L2 网络不是 MetaMask 默认支持的，需要手动添加。

### 方法一：通过 ChainList 一键添加

最简单的方式是访问 [chainlist.org](https://chainlist.org/)：

1. 连接 MetaMask
2. 搜索你要添加的网络名称
3. 点击 "Add to MetaMask"
4. MetaMask 弹出确认窗口，点击 "批准"

### 方法二：手动添加网络参数

如果你更喜欢手动配置（或想验证参数的正确性），以下是各主流 L2 的网络参数：

**Arbitrum One**

```
网络名称: Arbitrum One
RPC URL: https://arb1.arbitrum.io/rpc
链 ID: 42161
货币符号: ETH
区块浏览器: https://arbiscan.io
```

**Optimism**

```
网络名称: OP Mainnet
RPC URL: https://mainnet.optimism.io
链 ID: 10
货币符号: ETH
区块浏览器: https://optimistic.etherscan.io
```

**Base**

```
网络名称: Base
RPC URL: https://mainnet.base.org
链 ID: 8453
货币符号: ETH
区块浏览器: https://basescan.org
```

**zkSync Era**

```
网络名称: zkSync Era Mainnet
RPC URL: https://mainnet.era.zksync.io
链 ID: 324
货币符号: ETH
区块浏览器: https://explorer.zksync.io
```

**StarkNet**

> 注意：StarkNet 使用不同的账户体系，不能通过 MetaMask 直接添加。你需要使用专用钱包如 **Argent X** 或 **Braavos**。

```
Argent X 下载: https://www.argent.xyz/argent-x/
Braavos 下载: https://braavos.app/
```

### 方法三：通过项目官网自动添加

访问 L2 上的 DApp 时，通常会提示你切换到对应网络。点击提示中的 "切换网络" 按钮，MetaMask 会自动添加网络配置。

> ⚠️ ** 安全提醒 **：无论使用哪种方式添加网络，都要验证 RPC URL 和链 ID 是否正确。恶意的 RPC 可以伪造余额信息（虽然无法盗取资产，但会造成混淆）。建议使用官方文档中列出的 RPC 节点。

## 在 L2 上使用 DeFi

我们以在 Arbitrum 上使用 Uniswap 进行代币交换为例。

### 步骤 1：确保你有足够的 ETH 用于 Gas

在 Arbitrum 上，Gas 费用 ETH 支付。确保你的 Arbitrum 账户中有一些 ETH：
- 普通转账：约 $0.001-0.01
- DEX 交换：约 $0.01-0.10
- 复杂合约交互：约 $0.05-0.30

建议至少准备 0.001 ETH（约 $3-5）作为 Gas 储备。

### 步骤 2：访问 Uniswap

1. 打开 [app.uniswap.org](https://app.uniswap.org/)
2. 连接 MetaMask
3. ** 切换到 Arbitrum 网络 **—— 点击右上角的网络选择器，选择 Arbitrum

```
Uniswap 多链支持:

以太坊 ✅  (Gas 最贵)
Arbitrum ✅  (推荐 - 流动性深)
Optimism ✅
Base ✅  (推荐 - 费用最低)
Polygon ✅
BNB Chain ✅
```

### 步骤 3：执行代币交换

假设我们要把 0.01 ETH 换成 USDC：

```
交换界面:

You pay:  0.01 ETH
You receive: ~30 USDC (根据实时价格)

交易详情:
├── 汇率: 1 ETH ≈ 3000 USDC
├── 价格影响: <0.01% (流动性充足)
├── 最低收到: 29.85 USDC (0.5% 滑点保护)
├── 路由: ETH → WETH → USDC (直接路径)
└── 预估 Gas: $0.03
```

点击 "Swap" → MetaMask 确认 → 等待几秒钟 → 交易完成。

### 步骤 4：验证交易

交易完成后，你可以在区块浏览器上查看详情：
- Arbitrum: [arbiscan.io](https://arbiscan.io/)
- Optimism: [optimistic.etherscan.io](https://optimistic.etherscan.io/)
- Base: [basescan.org](https://basescan.org/)

在浏览器中输入你的钱包地址，可以看到所有交易记录，包括：
- 交易哈希
- 发送 / 接收的代币数量
- Gas 费用
- 交易状态

### 其他常见 DeFi 操作

| 操作 | 推荐平台 (Arbitrum) | 典型 Gas 费 |
|------|---------------------|-------------|
| 代币交换 | Uniswap, Camelot | $0.01-0.10 |
| 借贷 | Aave, Radiant | $0.05-0.20 |
| 永续合约 | GMX, Vertex | $0.05-0.30 |
| 流动性挖矿 | Camelot, Pendle | $0.05-0.30 |
| NFT 交易 | Treasure Marketplace | $0.01-0.10 |

## Gas 费对比实测

以下是同一类操作在不同链上的 Gas 费对比（EIP-4844 升级后的数据，仅供参考）：

### ETH 转账

| 链 | Gas 费 | 确认时间 |
|----|--------|---------|
| 以太坊 L1 | $0.50-5.00 | 12 秒 |
| Arbitrum | $0.001-0.01 | 0.3 秒 |
| Optimism | $0.001-0.01 | 2 秒 |
| Base | $0.0005-0.005 | 2 秒 |
| zkSync Era | $0.001-0.01 | 数秒 |

### Uniswap 交换

| 链 | Gas 费 | 确认时间 |
|----|--------|---------|
| 以太坊 L1 | $3-30 | 12 秒 |
| Arbitrum | $0.01-0.10 | 0.3 秒 |
| Optimism | $0.01-0.10 | 2 秒 |
| Base | $0.005-0.05 | 2 秒 |
| zkSync Era | $0.02-0.15 | 数秒 |

### 关键发现

```
Gas 费降幅 (L2 vs L1):

简单转账：降低 100-500 倍
DEX 交换：降低 100-300 倍
复杂合约：降低 50-200 倍

结论: L2 让 DeFi 对小资金用户重新变得可行
  - L1: 100 美元操作，Gas 30 美元 (30% 损耗)
  - L2: 100 美元操作，Gas 0.05 美元 (0.05% 损耗)
```

> 注意：以上数据为参考值。实际 Gas 费会随网络拥堵程度和 ETH 价格波动。建议使用 [l2fees.info](https://l2fees.info/) 查看实时 Gas 费对比。

## 选链策略

不同的使用场景适合不同的链。以下是一个实用的选链决策框架：

### 场景 1：DeFi 交易（大额）

```
推荐: Arbitrum
原因:
  ├── DeFi 流动性最深，滑点最低
  ├── GMX, Aave, Uniswap 等主流协议都在
  ├── 交易量大的 DEX 池意味着更好的价格
  └── 适合 $1000+ 的交易
```

### 场景 2：DeFi 交易（小额 / 高频）

```
推荐: Base
原因:
  ├── Gas 费最低
  ├── Coinbase 用户可直接入金
  ├── Aerodrome 等本地 DEX 流动性增长快
  └── 适合 $10-1000 的交易和频繁操作
```

### 场景 3：NFT 和社交应用

```
推荐: Base 或 Arbitrum Nova
原因:
  ├── Base: Farcaster 生态、mint.fun
  ├── Arbitrum Nova: 专为低价值高频操作设计
  └── 两者 Gas 费都极低，适合频繁 Mint 和社交互动
```

### 场景 4：开发者部署 DApp

```
EVM 兼容优先: Arbitrum / Optimism / Base
  └── Solidity 代码可以直接部署，工具链完全兼容

ZK 原生能力: zkSync / StarkNet
  └── 如果项目需要 ZK 证明能力或原生账户抽象

多链部署：使用 OP Stack 或 Arbitrum Orbit
  └── 如果项目需要自己的应用链
```

### 场景 5：大额资产长期持有

```
推荐：以太坊 L1
原因:
  ├── 安全性最高
  ├── 不依赖任何 L2 的正确运行
  └── 适合 "冷存储" 大额资产

次选: Arbitrum / Optimism (通过官方桥)
  └── 如果需要在 L2 上参与 DeFi 收益
```

### 选链决策流程图

```
你要做什么？
│
├── 长期持有大额资产 → 以太坊 L1
│
├── 活跃 DeFi 交易
│   ├── 大额 ($1000+) → Arbitrum
│   └── 小额 / 高频 → Base
│
├── NFT / 社交 → Base
│
├── 开发 DApp
│   ├── 需要 EVM 兼容 → Arbitrum / Base
│   └── 需要 ZK 能力 → zkSync / StarkNet
│
└── 跨链需求
    ├── L1↔L2 → 官方桥 (最安全)
    └── L2↔L2 → Across / Stargate (最快)
```

## L2 上的常见坑和注意事项

### 坑 1：包装代币混淆

```
同一个 "USDC" 可能有多个版本:

Arbitrum:
  USDC (原生) = Circle 通过 CCTP 发行 ✅ 推荐
  USDC.e (桥接) = 通过 Arbitrum 官方桥从 L1 桥接 ⚠️ 旧版本

如何区分:
  └── 查看代币合约地址，确认是否是 Circle 官方部署
  └── USDC.e 的合约地址与原生 USDC 不同
```

很多 DeFi 协议同时支持两种 USDC，但流动性池不同。使用时注意选择正确的版本。

### 坑 2：忘记留 Gas 费

```
常见错误:
  用户把所有 ETH 都换成了 USDC
  → 没有 ETH 支付 Gas 费
  → 无法进行任何操作（包括换回 ETH）

解决方案:
  1. 总是保留 0.002+ ETH 作为 Gas 储备
  2. 使用支持 Paymaster 的 DApp（zkSync 上较常见）
  3. 从交易所直接提 ETH 到 L2
```

### 坑 3：排序器单点风险

目前大部分 L2 的排序器都是中心化运行的：

```
排序器故障时会发生什么:

1. 无法提交新交易（L2 暂停）
2. 现有资金不受影响
3. 可以通过 L1 的 "强制包含" 机制提取资金（但操作复杂）

实际案例:
  - Arbitrum 曾因排序器故障停机约 1 小时
  - 所有 L2 都在推进排序器去中心化
```

### 坑 4：跨链时间预估不准

```
从 L2 提款到 L1 的实际等待时间:

Optimistic Rollup (Arbitrum/Optimism/Base):
  官方桥: 7 天（不是大约，是严格的 7 天）
  第三方桥: 1-20 分钟

ZK Rollup (zkSync/StarkNet):
  官方桥：几分钟到几小时（取决于证明生成）
  实际体验：通常 15-60 分钟
```

### 坑 5：RPC 节点不稳定

```
问题：公共 RPC 节点有时会拥堵或不稳定
症状：交易卡住、余额显示错误、无法连接网络

解决方案:
  1. 在 MetaMask 中添加备用 RPC 节点
  2. 使用专业 RPC 服务: Alchemy, Infura, QuickNode
  3. Arbitrum 推荐 RPC:
     - https://arb1.arbitrum.io/rpc (官方)
     - https://arbitrum-one.publicnode.com (公共)
     - Alchemy/Infura 的私有节点 (最稳定)
```

### 坑 6：不同链上的 Token 授权管理

```
问题：在多条链上使用 DeFi，会产生大量 token 授权
风险：如果某个协议被攻击，你授权的 token 可能被盗

管理建议:
  1. 使用 Revoke.cash 检查和撤销授权
  2. 尽量使用 "精确授权" 而非 "无限授权"
  3. 定期清理不再使用的协议授权
  4. 每条链都要单独检查！
```

## 总结

1. ** 官方桥是最安全的桥接方式 **（以 Arbitrum Bridge 为例），L1→L2 约 10 分钟，L2→L1 需要 7 天；第三方桥可以加速但需要信任额外方
2. **MetaMask 添加 L2 网络 ** 有三种方式：ChainList 一键添加（最简单）、手动配置参数（最可控）、DApp 自动提示（最方便）
3. **L2 上使用 DeFi 的体验已接近 Web2**——Uniswap 在 Arbitrum 上交换仅需 $0.01-0.10 Gas 费和几秒钟确认时间
4. **Gas 费对比 **：L2 相比 L1 降低了 100-500 倍，让小资金用户也能参与 DeFi
5. ** 选链策略 **：大额 DeFi 选 Arbitrum，小额 / 高频选 Base，长期持有选 L1，开发前沿选 zkSync/StarkNet
6. ** 注意常见坑 **：包装代币混淆、忘记留 Gas 费、排序器风险、跨链时间预估、RPC 不稳定、Token 授权管理

## 延伸阅读

- [Arbitrum Bridge 官方指南](https://bridge.arbitrum.io/)
- [ChainList: 一键添加网络](https://chainlist.org/)
- [L2Fees: 实时 Gas 费对比](https://l2fees.info/)
- [Revoke.cash: Token 授权管理](https://revoke.cash/)
- [DefiLlama: 多链 DeFi 数据](https://defillama.com/)
- [Uniswap 官方文档](https://docs.uniswap.org/)
- [MetaMask 官方指南：自定义网络](https://support.metamask.io/networks-and-sidechains/managing-networks/how-to-add-a-custom-network-rpc/)
