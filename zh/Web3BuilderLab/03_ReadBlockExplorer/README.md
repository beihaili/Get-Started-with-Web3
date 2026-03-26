# 如何阅读区块浏览器

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 初级 - brightgreen)

> 💡 区块浏览器是每个 Web3 用户的必备工具 —— 它就像区块链世界的 "搜索引擎"，让你能够查看、验证链上发生的一切。本文将手把手教你如何读懂 Etherscan 和 Mempool.space 上的每一个字段，从此不再对链上数据感到陌生。
>
> 欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)
>
> 进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> 文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)

## 目录

- [前言](# 前言)
- [什么是区块浏览器](# 什么是区块浏览器)
- [实战一：在 Etherscan 上阅读一笔 ETH 交易](# 实战一在 - etherscan - 上阅读一笔 - eth - 交易)
- [实战二：在 Mempool.space 上阅读一笔比特币交易](# 实战二在 - mempoolspace - 上阅读一笔比特币交易)
- [查看智能合约](# 查看智能合约)
- [追踪钱包和鲸鱼](# 追踪钱包和鲸鱼)
- [常见问题](# 常见问题)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

## 前言

在 Web2 的世界里，你在淘宝买了东西，可以在「我的订单」里查看物流信息；你在银行转了账，可以在手机 App 里看到交易记录。那么在 Web3 的世界里，你发起了一笔链上交易，怎么确认它成功了？你想知道某个地址持有多少代币，去哪里查？

答案就是 ——** 区块浏览器（Block Explorer）**。

区块链的核心特性之一是 ** 公开透明 **：所有交易、所有余额、所有合约代码，全部公开记录在链上。区块浏览器就是帮你把这些原始数据变成人类可读信息的工具。学会使用区块浏览器，你就掌握了 Web3 世界最强大的 "事实核查" 能力。

无论你是检查自己的交易是否到账、验证项目方是否说了谎、还是追踪巨鲸的资金动向，区块浏览器都是你的第一选择。**"Don't trust, verify"**（不要相信，去验证）—— 这句话是 Web3 世界的核心精神，而区块浏览器就是让你去验证的工具。

## 什么是区块浏览器

### 定义

区块浏览器是一种 Web 应用，它连接区块链节点，读取链上的所有公开数据，并以用户友好的方式展示出来。你可以把它理解为区块链的 "搜索引擎"—— 输入一个交易哈希（Transaction Hash）、一个钱包地址、一个区块号，它就能把相关信息清晰地呈现给你。

### 常见的区块浏览器

不同区块链有各自的浏览器，以下是最常用的几个：

| 区块链 | 浏览器 | 网址 |
|--------|--------|------|
| Ethereum | Etherscan | [etherscan.io](https://etherscan.io) |
| Bitcoin | Mempool.space | [mempool.space](https://mempool.space) |
| Bitcoin | Blockchain.com | [blockchain.com/explorer](https://www.blockchain.com/explorer) |
| Solana | Solscan | [solscan.io](https://solscan.io) |
| Base | Basescan | [basescan.org](https://basescan.org) |
| Arbitrum | Arbiscan | [arbiscan.io](https://arbiscan.io) |
| Polygon | Polygonscan | [polygonscan.com](https://polygonscan.com) |
| BSC | BscScan | [bscscan.com](https://bscscan.com) |

> 💡 ** 小贴士 **：Etherscan 团队开发了一套浏览器框架，Basescan、Arbiscan、Polygonscan、BscScan 等都是基于同一套界面构建的，所以你学会了 Etherscan，其他 EVM 链的浏览器也基本会用了。

### 区块浏览器能做什么

- ** 查交易 **：查看一笔交易的详细信息 —— 谁发给谁、转了多少、花了多少 Gas
- ** 查地址 **：查看一个钱包地址的余额、历史交易、持有的代币
- ** 查合约 **：查看智能合约的源代码、读取合约状态、查看交互历史
- ** 查代币 **：查看某个代币的总供应量、持有人数、转账记录
- ** 查区块 **：查看某个区块包含的所有交易、出块时间、矿工 / 验证者信息

## 实战一：在 Etherscan 上阅读一笔 ETH 交易

现在让我们来实际操作。打开 [etherscan.io](https://etherscan.io)，我们用一笔真实的交易来学习。

### 查找交易

在 Etherscan 首页的搜索栏中，你可以输入以下内容来搜索：

- ** 交易哈希（Tx Hash）**：以 `0x` 开头的 66 位十六进制字符串
- ** 钱包地址 **：以 `0x` 开头的 42 位十六进制字符串
- ** 区块号 **：一个数字
- **ENS 域名 **：如 `vitalik.eth`

让我们搜索 Vitalik 的一笔交易来实战。在搜索栏中输入 `vitalik.eth`，然后在他的地址页面随意点击一笔交易，进入交易详情页。

### 逐字段解读交易详情

交易详情页是区块浏览器最核心的页面，包含以下关键字段：

#### Transaction Hash（交易哈希）

```
Transaction Hash: 0x5c50...4a3f
```

交易哈希是这笔交易在全网的 ** 唯一标识符 **，就像你的快递单号。它由交易内容经过哈希算法计算得出，任何人都不可能伪造。当你在 DApp 中发起交易后，通常会返回一个 Tx Hash，你可以用它在 Etherscan 上查询交易状态。

#### Status（状态）

交易状态有三种可能：

| 状态 | 含义 | 说明 |
|------|------|------|
| ✅ Success | 成功 | 交易已被确认并成功执行 |
| ❌ Failed | 失败 | 交易被矿工打包了，但执行过程中出错（如 Gas 不足、合约报错） |
| ⏳ Pending | 待处理 | 交易已广播但还未被打包进区块 |

> ⚠️ ** 注意 **：交易失败（Failed）也会消耗 Gas 费！因为矿工 / 验证者已经为你执行了计算，只是执行到中途失败了。这些计算资源已经消耗，所以 Gas 不会退还。

#### Block（区块号）

```
Block: 19234567
```

交易被打包进的区块编号。点击可以查看该区块的详情，包括区块中的所有交易、出块时间等。区块号越大，说明是越近期的交易。

#### Timestamp（时间戳）

```
Timestamp: 2 hrs 15 mins ago (Jan-15-2025 03:22:11 PM UTC)
```

交易被确认的时间。以太坊平均约 12 秒出一个区块，所以交易从发起到确认通常在几十秒到几分钟之间。

#### From（发送方）

```
From: 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

发起这笔交易的地址。在以太坊中，只有 EOA（外部拥有的账户，即普通钱包地址）才能发起交易，合约地址不能主动发起交易。

#### To（接收方）

```
To: 0x1234...abcd
```

交易的目标地址。它可能是：

- ** 另一个钱包地址 **：普通的 ETH 转账
- ** 合约地址 **：调用智能合约（如 Swap、Mint NFT 等）
- ** 空（Contract Creation）**：部署新合约

#### Value（转账金额）

```
Value: 1.5 ETH ($3,204.15)
```

本笔交易转移的 ETH 数量。如果是合约调用而不涉及 ETH 转账，这里会显示 `0 ETH`。Etherscan 会同时显示对应的美元价值。

#### Transaction Fee（交易手续费）

```
Transaction Fee: 0.00234 ETH ($5.01)
Gas Price: 25 Gwei
Gas Limit & Usage: 21,000 | 21,000 (100%)
```

Gas 费是以太坊交易的 "过路费"，由三个要素决定：

```
交易手续费 = Gas Price × Gas Used

其中：
- Gas Price（燃气价格）：你愿意为每单位 Gas 支付的价格，单位是 Gwei（1 Gwei = 0.000000001 ETH）
- Gas Limit（燃气上限）：你为这笔交易设定的最大 Gas 消耗量
- Gas Used（实际消耗）：交易实际使用的 Gas 数量
```

一笔简单的 ETH 转账固定消耗 21,000 Gas。合约交互会消耗更多，具体取决于合约逻辑的复杂程度。

> 💡 ** 小贴士 **：自从以太坊的 EIP-1559 升级后，Gas 费被分为 Base Fee（基础费，自动燃烧）和 Priority Fee（优先费，给验证者的小费）两部分。在 Etherscan 上你会看到 `Base Fee` 和 `Max Priority Fee` 两个字段。

#### Input Data（输入数据）

```
Input Data: 0x
```

如果是简单的 ETH 转账，Input Data 为空（`0x`）。如果是合约调用，这里会显示编码后的函数名和参数。例如：

```
Function: transfer (address to, uint256 value)

MethodID: 0xa9059cbb
[0]: 0000000000000000000000001234567890abcdef1234567890abcdef12345678
[1]: 0000000000000000000000000000000000000000000000000de0b6b3a7640000
```

Etherscan 会自动解码 Input Data，告诉你调用的是哪个函数、传了什么参数。这对分析合约交互非常有用。

## 实战二：在 Mempool.space 上阅读一笔比特币交易

学完以太坊的交易，我们来看看比特币的交易有什么不同。打开 [mempool.space](https://mempool.space)—— 这是目前最好用的比特币区块浏览器。

### 比特币 vs 以太坊：两种截然不同的模型

在深入交易详情之前，你需要理解一个核心区别：

| 特性 | 比特币（UTXO 模型） | 以太坊（账户模型） |
|------|---------------------|-------------------|
| 余额存储 | 由一堆 "未花费的交易输出"（UTXO）组成 | 直接存储在账户中 |
| 类比 | 像现金 —— 你有几张不同面额的纸币 | 像银行账户 —— 有一个余额数字 |
| 转账方式 | 选取若干 UTXO 作为输入，创建新的 UTXO 作为输出 | 直接从余额中扣减 |
| 找零 | 需要给自己找零（创建一个新 UTXO 回到自己地址） | 不需要，余额自动更新 |

举个形象的例子：你有一张 100 元纸币，想买一杯 30 元的咖啡。在比特币的世界里，你把这 100 元 "撕碎"，创造出 30 元给咖啡店、70 元找零给自己。原来的 100 元（UTXO）被花掉了，新产生了 30 元和 70 元两个新 UTXO。

### 解读比特币交易字段

在 Mempool.space 上搜索一笔交易后，你会看到以下关键信息：

#### Inputs（输入）

```
Inputs:
  bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh  →  0.05 BTC
```

输入就是 "你从哪里拿的钱"。一笔交易可以有多个输入（就像你用多张纸币付款），每个输入都指向之前某笔交易的一个未花费输出（UTXO）。

#### Outputs（输出）

```
Outputs:
  bc1q9h5yjqka...  →  0.03 BTC    ← 收款方
  bc1qxy2kgdyg...  →  0.0195 BTC  ← 找零，回到发送方
```

输出就是 "钱去了哪里"。通常有两个输出：一个是付款给收款方，另一个是找零回到自己。如果输入总额和输出总额之间有差额，那就是矿工手续费。

```
手续费 = 输入总额 - 输出总额
      = 0.05 - (0.03 + 0.0195)
      = 0.0005 BTC
```

#### Fee（手续费）

比特币的手续费计算方式与以太坊不同：

```
比特币手续费 = 费率（sat/vB）× 交易大小（vBytes）

其中：
- sat/vB：每虚拟字节的聪数（1 BTC = 100,000,000 sat）
- vBytes：交易数据的虚拟大小
```

费率越高，矿工越优先打包你的交易。在 Mempool.space 首页，你可以看到当前推荐的费率（低 / 中 / 高优先级）。

#### Confirmations（确认数）

```
Confirmations: 6
```

比特币平均约 10 分钟出一个区块。确认数表示你的交易被打包后，在它之上又叠加了多少个区块。一般认为 6 个确认后交易就几乎不可能被逆转了 —— 这就是比特币交易所常说的 "等待 6 个确认" 的原因。

#### Size / Weight（大小 / 权重）

```
Size: 225 bytes
Weight: 573 WU
Virtual Size: 144 vBytes
```

这反映了交易数据的大小。交易越复杂（更多输入输出），数据越大，需要的手续费也越多。

### SegWit 和 Taproot 交易的识别

在 Mempool.space 上，你可以通过地址前缀来识别交易类型：

| 地址前缀 | 类型 | 特点 |
|----------|------|------|
| `1...` | Legacy（传统） | 最老的格式，手续费最高 |
| `3...` | Nested SegWit（嵌套隔离见证） | 兼容性好，手续费较低 |
| `bc1q...` | Native SegWit（原生隔离见证） | 手续费更低，目前主流 |
| `bc1p...` | Taproot | 最新格式，支持更复杂的脚本，隐私性更好 |

> 💡 ** 小贴士 **：如果你使用比特币钱包，优先选择 `bc1q`（SegWit）或 `bc1p`（Taproot）地址，可以节省手续费。

## 查看智能合约

区块浏览器的另一个强大功能是查看智能合约。我们以最广泛使用的稳定币 USDT 为例。

### 打开 USDT 合约

在 Etherscan 搜索栏输入 USDT 的合约地址：

```
0xdAC17F958D2ee523a2206206994597C13D831ec7
```

你会进入合约的地址页面，这和普通钱包地址页面类似，但多了一个关键标签：**Contract**。

### Contract 标签页

点击 **Contract** 标签，你会看到几个子标签：

- **Code**：合约的 Solidity 源代码（如果已验证）
- **Read Contract**：读取合约的公开状态变量（不需要 Gas，不需要签名）
- **Write Contract**：调用合约的写入函数（需要连接钱包、消耗 Gas）

### 如何判断合约是否可信

| 标志 | 含义 |
|------|------|
| ✅ 绿色对勾 | 合约源代码已验证，你可以阅读实际部署的代码 |
| Contract 标签出现 | 说明这是一个合约地址，不是普通钱包 |
| Proxy Contract 标签 | 使用了代理模式（Proxy Pattern），实际逻辑在另一个合约中 |

> ⚠️ ** 注意 **：如果一个合约显示 "未验证"（没有绿色对勾），意味着你看不到它的源代码。与未验证的合约交互要格外谨慎，因为你不知道它内部到底做了什么。

### 读取合约状态：实操 Read Contract

在 USDT 合约的 **Read Contract** 页面，你可以直接查询链上数据。以下是几个有趣的查询：

#### 查询 USDT 总供应量

找到 `totalSupply` 函数，点击 **Query**，返回结果：

```
totalSupply: 59685326551082462   （单位是最小精度）
```

USDT 的精度是 6 位（`decimals = 6`），所以：

```
实际供应量 = 59685326551082462 / 10^6 ≈ 596.85 亿 USDT
```

#### 查询某地址的 USDT 余额

找到 `balanceOf` 函数，输入一个钱包地址，点击 **Query**：

```
balanceOf (0xF977814e90dA44bFA03b6295A0616a897441aceC)
返回: 2500000000000000   →  25 亿 USDT
```

你可以用这个方法验证任何地址的代币余额 —— 不需要对方告诉你，直接在链上查。

### Proxy 合约

很多现代合约使用代理模式（Proxy Pattern），这样可以在不更改合约地址的情况下升级逻辑。在 Etherscan 上，如果一个合约是 Proxy，你会看到两个标签：

- **Read as Proxy**：通过代理调用实际逻辑合约的读取函数
- **Write as Proxy**：通过代理调用实际逻辑合约的写入函数

点击 **Read as Proxy** 才能看到合约的完整功能。

## 追踪钱包和鲸鱼

区块浏览器不仅能查交易，还是追踪钱包和 "巨鲸"（持有大量加密货币的地址）的利器。

### 查看钱包信息

在 Etherscan 中搜索任意一个地址，你可以看到：

- **Balance（余额）**：该地址持有的 ETH 数量
- **Tokens（代币）**：持有的所有 ERC-20 代币和 NFT 列表
- **Transactions（交易记录）**：完整的交易历史
- **Internal Transactions（内部交易）**：合约调用产生的 ETH 转移
- **Token Transfers（代币转移）**：ERC-20 代币的转入转出记录

### Etherscan 的标签系统（Name Tags）

Etherscan 为许多已知地址添加了名称标签，让你一眼就能识别对方身份：

```
常见标签示例：
- Binance 14          → 币安交易所的热钱包
- Coinbase 2          → Coinbase 交易所的钱包
- Vitalik Buterin     → 以太坊创始人的个人钱包
- Uniswap V3: Router  → Uniswap 去中心化交易所的路由合约
- Tether: USDT        → USDT 稳定币的合约地址
```

这些标签是 Etherscan 团队和社区共同维护的。当你看到一个地址标注了 `Binance` 标签，说明该地址已被确认属于币安交易所。

### 实用追踪技巧

** 追踪巨鲸转账 **

如果你看到一个持有大量 ETH 或代币的地址频繁交易，可以关注它的动向。一些常用方法：

1. 在 Etherscan 地址页面，按时间排序查看最近的交易
2. 关注大额转入 / 转出，特别是与交易所地址的交互（转入交易所可能意味着准备卖出）
3. 查看 Token Transfers 标签，追踪代币的流向

** 确认项目方钱包 **

当一个新项目声称自己的合约地址是 `0x1234...`，你可以在 Etherscan 上验证：

- 合约是否已验证源代码？
- 合约的创建者（Creator）地址是什么？
- 合约的 Token Holders 分布是否合理？（如果一个地址持有 90% 的代币，那就要警惕了）
- 项目方的钱包是否有大量抛售记录？

> 💡 ** 小贴士 **：除了手动追踪，你还可以使用 [Arkham Intelligence](https://www.arkhamintelligence.com/)、[Nansen](https://www.nansen.ai/) 等专业的链上分析平台来追踪巨鲸和机构资金动向。

## 常见问题

### ❓ 交易一直 Pending 怎么办？

交易 Pending 通常意味着你设置的 Gas Price 太低，矿工 / 验证者不愿意优先打包你的交易。解决办法：

1. ** 加速（Speed Up）**：在 MetaMask 的 Activity 中找到 Pending 的交易，点击 Speed Up，提高 Gas Price
2. ** 取消（Cancel）**：发起一笔新交易，使用 ** 相同的 Nonce 值 ** 和更高的 Gas Price，目标地址设为自己，这样新交易会替换旧交易
3. ** 等待 **：如果不急，可以等待网络拥堵缓解，交易最终也会被打包

```
Nonce（交易序号）：每个地址发起的交易都有一个递增的序号。
如果 Nonce 为 5 的交易在 Pending，那么 Nonce 为 6、7、8... 的交易
都会被阻塞，直到 Nonce 5 被处理完毕。这就是 "交易卡住" 的原因。
```

### ❓ Gas 费到底怎么算的？

以太坊上的 Gas 费计算：

```
总费用 = Gas Used × (Base Fee + Priority Fee)

其中：
- Gas Used：交易实际消耗的计算量（ETH 转账固定 21,000）
- Base Fee：由网络自动决定，根据区块拥堵程度动态调整，费用被燃烧
- Priority Fee（小费）：你额外给验证者的激励，越高越优先被打包
```

不同操作的 Gas 消耗参考：

| 操作 | 大致 Gas 消耗 |
|------|--------------|
| ETH 转账 | 21,000 |
| ERC-20 代币转账 | 45,000 - 65,000 |
| Uniswap Swap | 120,000 - 200,000 |
| NFT Mint | 100,000 - 300,000 |
| 合约部署 | 500,000 - 5,000,000+ |

### ❓ Internal Transactions 是什么？

Internal Transactions（内部交易）是指智能合约在执行过程中产生的 ETH 转移。它们不是由用户直接发起的，而是合约代码中 `call`、`delegatecall` 等操作触发的。

例如：你在 Uniswap 上用 USDT 换 ETH，你发起的交易是调用 Uniswap Router 合约，但实际的 ETH 转入你钱包的操作是由合约内部完成的 —— 这就是一笔 Internal Transaction。

Internal Transactions 在普通的 Transactions 列表中看不到，你需要在地址页面点击 **Internal Transactions** 标签才能查看。

### ❓ 为什么有些合约显示 "未验证"？

合约部署到以太坊上时，链上只保存编译后的 ** 字节码（Bytecode）**，而不是源代码。合约开发者需要主动将源代码提交到 Etherscan 进行验证 ——Etherscan 会用相同的编译器和设置重新编译，确认生成的字节码与链上一致，然后才标记为 "已验证"。

未验证的可能原因：

- 开发者选择不公开源代码（可能是恶意合约）
- 开发者尚未完成验证流程
- 编译参数不匹配导致验证失败

> ⚠️ ** 安全建议 **：对于未验证的合约，你无法确认它的内部逻辑。在与任何合约交互之前（尤其是授权代币和转入资金），务必确认合约已经过验证，并且最好已经被安全审计。

### ❓ ERC-20 Approval 是什么？需要注意什么？

在 Token Transfers 记录中，你可能会看到 `Approve` 类型的交易。这是 ERC-20 代币的授权操作 —— 你授权某个合约可以从你的地址中转走一定数量的代币。

很多 DApp 在首次使用时会请求 "无限授权"（Unlimited Approval），这意味着该合约可以随时转走你地址中的 ** 所有 ** 该代币。如果合约有漏洞或被黑客攻击，你的代币就可能被盗。

** 防护措施 **：

1. 定期检查授权：访问 [revoke.cash](https://revoke.cash/) 或 [etherscan.io/tokenapprovalchecker](https://etherscan.io/tokenapprovalchecker)
2. 只授权需要的数量，避免无限授权
3. 用完后及时撤销不需要的授权

## 总结

区块浏览器是 Web3 用户的 ** 必备工具 **，它让区块链的透明性从理论变成现实。通过本文，你已经学会了：

- 在 **Etherscan** 上阅读以太坊交易的每个字段 —— 从 Tx Hash 到 Gas Fee 到 Input Data
- 在 **Mempool.space** 上理解比特币的 UTXO 模型，解读 Inputs / Outputs / Fee
- 查看和验证 ** 智能合约 **——Read Contract、判断 Proxy、识别未验证合约
- 追踪 ** 钱包和巨鲸 **—— 利用标签系统、分析持仓和资金流向

学会看区块浏览器，就是学会了 ** 验证链上事实 **。在 Web3 的世界里，任何人告诉你的信息，你都可以自己去链上核实。这就是 **"Don't trust, verify"** 的精神 —— 区块浏览器让每一个普通人都拥有了验证真相的能力。

## 延伸阅读

- [Etherscan 官方文档](https://docs.etherscan.io/) —— Etherscan API 和功能的详细文档
- [Mempool.space 指南](https://mempool.space/docs/faq) —— 比特币区块浏览器的使用指南
- [如何用 Dune Analytics 做链上分析](https://dune.com/docs/) —— 进阶：用 SQL 查询链上数据，制作可视化仪表盘
- [Arkham Intelligence](https://www.arkhamintelligence.com/) —— 专业的链上情报和地址标签平台
- [Tenderly](https://tenderly.co/) —— 高级合约调试工具，可以逐步追踪交易执行过程

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 返回主页 </a> |
<a href="https://twitter.com/bhbtc1337">🐦 关注作者 </a> |
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 加入交流群 </a>
</div>
