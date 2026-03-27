# 主流 L2 生态对比

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 中级 - yellow)

> 💡 当前以太坊 L2 生态百花齐放，各大 Rollup 在技术架构、生态建设和发展策略上各有千秋。本课深入对比 Arbitrum、Optimism、Base、zkSync 和 StarkNet 五大主流 L2，帮你建立全面的生态认知。
>
> 欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)
>
> 进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> 文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)

## 目录

- [Arbitrum](#arbitrum)
- [Optimism](#optimism)
- [Base](#base)
- [zkSync](#zksync)
- [StarkNet](#starknet)
- [各 L2 综合对比](# 各 - l2 - 综合对比)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

## Arbitrum

### 技术架构

Arbitrum 由 Offchain Labs 团队开发，是目前 TVL 最高的以太坊 L2，采用 Optimistic Rollup 技术。

** 核心技术栈 **：

- **ArbOS**：Arbitrum 的操作系统层，运行在 L2 上，负责管理交易执行、Gas 计量和跨链通信
- **Nitro 升级（2022.8）**：用 Go 语言重写了核心执行引擎，直接编译 Geth（以太坊客户端）的核心代码

```
Nitro 架构:

用户交易 → Sequencer（排序器）
               │
               ▼
         Geth 执行引擎 (修改版)
               │
               ▼
       WASM 状态转换函数
               │
               ▼
    欺诈证明：使用 WASM 在 L1 上重新执行有争议的步骤
```

**Nitro 带来的改进 **：
- 交易费用降低 **5-10 倍 **
- 与以太坊的兼容性从 EVM 兼容提升到 "几乎等价"
- 欺诈证明使用 WASM，更高效也更安全

### Arbitrum 的多链战略

Arbitrum 不只是一条链，它已发展为一个生态系统：

| 链 | 类型 | 定位 | 特点 |
|---|------|------|------|
| Arbitrum One | Optimistic Rollup | 通用 DeFi/dApp | TVL 最高，生态最丰富 |
| Arbitrum Nova | AnyTrust (Validium 变体) | 游戏和社交 | 超低费用，数据由 DAC 管理 |
| Arbitrum Orbit | L3 框架 | 自定义应用链 | 允许项目部署自己的 L3 |

### 生态亮点

Arbitrum 的 DeFi 生态是所有 L2 中最繁荣的：

- **GMX**：去中心化永续合约交易所，首个在 L2 上大规模成功的原生 DeFi 协议。允许用户以最高 50x 杠杆交易 BTC、ETH 等资产，以极低的滑点著称
- **Camelot**：Arbitrum 原生 DEX，采用独特的双 AMM 模型（波动性资产池 + 稳定资产池），支持自定义费率和 NFT 质押
- **Pendle**：收益代币化协议，允许用户交易未来收益，在 Arbitrum 上获得巨大成功
- **Radiant Capital**：全链借贷协议，基于 LayerZero 实现跨链流动性

** 链上数据（截至 2025 年初）**：
- 日均交易量：约 100-200 万笔
- 独立地址数：超过 2000 万
- DeFi 协议数：500+

### 治理：ARB 代币

ARB 是 Arbitrum 的治理代币（2023 年 3 月空投），持有者可以参与 Arbitrum DAO 的治理投票。DAO 管理着约数十亿美元的资金池，用于生态发展和技术升级。

## Optimism

### 技术架构

Optimism 由 OP Labs 开发，同样采用 Optimistic Rollup，但与 Arbitrum 在技术细节上有重要差异。

**Bedrock 升级（2023.6）**——Optimism 的重大技术革新：

```
Bedrock 架构:

Execution Layer:     修改版 Geth（op-geth）
                        │
Derivation Layer:    op-node（从 L1 推导 L2 状态）
                        │
Batch Submission:    Batcher（将 L2 数据批量提交到 L1）
                        │
Fault Proof:         争议解决机制（cannon + op-program）
```

Bedrock 的核心设计理念是 ** 最小化差异（Minimal Diff）**—— 尽可能复用以太坊客户端代码，只做必要的修改。这意味着：
- 以太坊的任何 EIP 升级都能快速集成
- 安全审计范围更小
- 开发者体验与以太坊几乎一致

### OP Stack 和 Superchain 愿景

OP Stack 是 Optimism 最具战略意义的创新 —— 一个 ** 模块化的开源 L2 技术栈 **。

```
OP Stack 模块化架构:

┌─────────────────────────────────┐
│         应用层 (DApps)            │
├─────────────────────────────────┤
│      执行层 (op-geth)            │
├─────────────────────────────────┤
│    推导层 (op-node)              │
├─────────────────────────────────┤
│    结算层 (L1 合约)              │
├─────────────────────────────────┤
│  数据可用性层 (L1 Blob / Alt-DA) │
└─────────────────────────────────┘
```

**Superchain 的愿景 ** 是让所有基于 OP Stack 的 L2 形成一个 ** 互联互通的链网络 **：

- 共享安全性（都以以太坊 L1 为锚点）
- 原生跨链消息传递
- 共享升级和维护
- 网络效应的正向循环

目前基于 OP Stack 部署的链已超过 30 条，包括 Base、Zora、Mode、Worldchain 等。

### OP 代币与 RetroPGF

Optimism 的治理和激励机制独具特色：

- **OP 代币 **：治理代币，参与 Token House 投票
- **Citizens' House**：灵魂绑定代币持有者组成的另一个治理机构
- **RetroPGF（Retroactive Public Goods Funding）**：追溯性公共物品资助机制 —— 先做贡献，后获奖励

RetroPGF 的理念是："如果你为生态做了有价值的事，社区会回过头来奖励你。" 这种机制鼓励长期主义和公共物品建设。

## Base

### Coinbase 的 L2 战略

Base 是 Coinbase（美国最大的合规交易所，上市公司）基于 OP Stack 构建的 L2。2023 年 8 月上线，迅速成长为顶级 L2 之一。

** 为什么 Coinbase 要做 L2？**

```
Coinbase 的 Web3 战略:

传统路线：用户 → Coinbase App → 中心化交易
   缺点：用户资产由 Coinbase 托管，不是真正的 Web3

新路线：用户 → Coinbase Wallet → Base L2 → 链上 DeFi
   优势：用户掌握自己的资产，同时享受低费用和好体验
```

**Base 的独特优势 **：

1. **Coinbase 用户导入 **：Coinbase 拥有超过 1 亿注册用户，可以低成本地将这些用户引导到 Base
2. ** 法币入金通道 **：Coinbase 的合规法币通道让用户可以直接购买 Base 上的资产
3. ** 品牌信任 **：作为上市公司，Coinbase 的背书给 Base 带来了主流用户的信任
4. ** 开发者友好 **：与 Coinbase 开发者工具深度整合

### Base 与 OP Stack 的关系

Base 是 Superchain 的核心成员之一：

- Base 将部分排序器收入贡献给 Optimism Collective
- 反过来，Base 享受 OP Stack 的持续升级和安全保障
- 这是一个双赢模式 ——Base 获得技术，Optimism 获得生态和资金

### Base 生态特色

Base 以社交和消费级应用著称：

- **Friend.tech**：社交代币交易平台，曾在 2023 年引发热潮
- **Farcaster 生态 **：去中心化社交协议，其中大量应用部署在 Base 上
- **Aerodrome**：Base 上最大的 DEX，forked from Velodrome（Optimism 上的 DEX）
- **mint.fun/ Zora 生态 **：NFT Mint 和创作者经济

**Base 没有发行代币 **——Coinbase 明确表示 Base 不会有原生代币，这使得 Base 的激励主要来自协议层面而非代币投机。

## zkSync

### zkEVM 方案

zkSync 由 Matter Labs 开发，是最受关注的 ZK Rollup 之一。zkSync Era（主网 2023.3 上线）是其旗舰产品。

**zkSync Era 的技术特点 **：

```
编译流程:

Solidity / Vyper 源代码
       │
       ▼
    Solc / Vyper 编译器
       │
       ▼
     Yul (中间表示)
       │
       ▼
   zkSync 编译器 (LLVM-based)
       │
       ▼
   zkEVM 字节码
```

这种编译方式意味着 zkSync 是 **Type 4 zkEVM**—— 高级语言兼容但字节码不同。大部分 Solidity 代码可以直接部署，但某些底层操作（如内联汇编、特定操作码）可能需要调整。

### 原生账户抽象

zkSync 的一大创新是 ** 协议级别的原生账户抽象（Native Account Abstraction）**：

在以太坊上，有两种账户：
- **EOA（外部拥有账户）**：由私钥控制，就是普通钱包
- ** 合约账户 **：由代码控制

以太坊的 ERC-4337 通过在应用层实现账户抽象，但 zkSync 在协议层就做了 ——** 每个账户都是智能合约账户 **。

这带来的好处：
- **Gas 代付 **：项目方可以替用户支付 Gas 费（Paymaster 机制）
- ** 多签恢复 **：丢失私钥后可以通过社交恢复找回账户
- ** 批量交易 **：一次签名执行多笔交易（比如同时 approve + swap）
- ** 任意签名验证 **：不限于 ECDSA，可以用任何签名方案（Passkey、面部识别等）

### zkSync 代币

ZK 代币于 2024 年 6 月空投，但空投方案因涉嫌不公平分配（大量女巫攻击地址获得空投）而引发社区争议。这成为了 L2 空投策略中的一个反面教材。

## StarkNet

### StarkEx vs StarkNet

StarkWare 公司开发了两套产品，容易混淆：

| 特性 | StarkEx | StarkNet |
|------|---------|----------|
| 类型 | 应用专用 Rollup（App-specific） | 通用 Rollup（General-purpose） |
| 客户 | dYdX v3, Immutable X, Sorare | 任何开发者 |
| 数据模式 | ZK Rollup 或 Validium（可选） | ZK Rollup |
| 智能合约 | 不支持自定义合约 | 支持 Cairo 合约 |
| 上线时间 | 2020 年 | 2022 年（Alpha） |

StarkEx 已经为其客户处理了超过 **5000 亿美元 ** 的交易量和数亿笔交易，证明了 STARK 证明系统的可靠性。

### Cairo 语言

StarkNet 的最大特色（也是争议点）是使用自己的编程语言 **Cairo**，而非 Solidity。

```cairo
// Cairo 示例：一个简单的计数器合约
#[starknet::contract]
mod Counter {
    #[storage]
    struct Storage {
        count: u128,
    }

    #[external (v0)]
    fn increment (ref self: ContractState) {
        let current = self.count.read ();
        self.count.write (current + 1);
    }

    #[external (v0)]
    fn get_count (self: @ContractState) -> u128 {
        self.count.read ()
    }
}
```

** 为什么选择 Cairo 而非 Solidity？**

Cairo 是专门为 STARK 证明系统设计的语言：
- 每一步计算都天然可以被高效地生成证明
- 编译为 Sierra（Safe Intermediate Representation），然后再编译为 CASM（Cairo Assembly）
- 性能比用 Solidity 转译的方式高出数倍

** 缺点 **：开发者需要学习新语言，生态的 DeFi 协议无法直接从以太坊移植，这减缓了生态发展速度。

### StarkNet 的技术优势

1. **STARK 证明 **：不需要可信设置，量子抗性，证明具有透明性
2. ** 递归证明（Recursive Proofs）**：可以用一个证明来验证另一个证明，极大降低 L1 验证成本
3. **SHARP（Shared Prover）**：多个应用可以共享证明器，分摊证明成本
4. **Volition 模式 **（规划中）：用户可以选择数据存储在 L1 还是链下

### STRK 代币

STRK 代币于 2024 年 2 月上线，用于支付 Gas 费和治理。StarkNet 的 Gas 可以用 ETH 或 STRK 支付，这是一个相对独特的设计。

## 各 L2 综合对比

### 技术对比

| 维度 | Arbitrum | Optimism | Base | zkSync Era | StarkNet |
|------|----------|----------|------|-----------|----------|
| 类型 | Optimistic Rollup | Optimistic Rollup | Optimistic Rollup | ZK Rollup | ZK Rollup |
| EVM 兼容性 | 高（Nitro） | 高（Bedrock） | 高（OP Stack） | 中（Type 4） | 无（Cairo） |
| 账户抽象 | ERC-4337 | ERC-4337 | ERC-4337 | 原生 | 原生 |
| 提款时间 | 7 天 | 7 天 | 7 天 | 约 1 小时 | 约数小时 |
| 证明系统 | 欺诈证明 | 欺诈证明 | 欺诈证明 | ZK-SNARK | ZK-STARK |

### 生态数据对比（2025 年初参考值）

| 指标 | Arbitrum | Optimism | Base | zkSync Era | StarkNet |
|------|----------|----------|------|-----------|----------|
| TVL 量级 | $10B+ | $5B+ | $5B+ | $500M+ | $200M+ |
| 日交易量 | 100-200 万笔 | 50-100 万笔 | 200-400 万笔 | 10-50 万笔 | 10-30 万笔 |
| DeFi 协议数 | 500+ | 200+ | 300+ | 100+ | 50+ |
| 原生代币 | ARB | OP | 无 | ZK | STRK |
| 治理模式 | DAO | 双院制 | Coinbase 主导 | DAO | 基金会主导 |

> 注意：以上数据为参考值，实际数据会随市场变化。请查阅 [L2Beat](https://l2beat.com/) 获取最新数据。

### 如何选择 L2？

对于不同类型的用户：

- **DeFi 重度用户 **：Arbitrum（最丰富的 DeFi 生态）
- ** 追求低费用 **：Base 或 Arbitrum（EIP-4844 后成本极低）
- ** 主流 / 新手用户 **：Base（Coinbase 入金通道，用户体验最好）
- ** 开发者（快速部署）**：Arbitrum / Base / Optimism（完全 EVM 兼容）
- ** 开发者（前沿技术）**：zkSync / StarkNet（ZK 原生能力）
- ** 游戏项目 **：Arbitrum Nova / StarkNet（针对高频低价值交易优化）

## 总结

1. **Arbitrum 是目前 TVL 和 DeFi 生态最强的 L2**，Nitro 升级带来了接近以太坊原生的兼容性，GMX 等原生协议展现了 L2 DeFi 的潜力
2. **Optimism 的 OP Stack 和 Superchain 战略 ** 使其从单一 L2 转型为 L2 技术提供商，影响力远超自身链的 TVL
3. **Base 依托 Coinbase 的用户基础和合规优势 **，成为增长最快的 L2，以社交和消费级应用见长
4. **zkSync 和 StarkNet 代表 ZK Rollup 的两种路径 **——zkSync 追求 EVM 兼容，StarkNet 选择自建 Cairo 生态；两者在原生账户抽象等方面引领创新
5. **L2 格局仍在快速演变 **，各链在技术、生态和治理上的竞争将持续推动以太坊扩容生态的成熟

## 延伸阅读

- [L2Beat: Layer 2 数据全景](https://l2beat.com/)
- [Arbitrum 官方文档](https://docs.arbitrum.io/)
- [Optimism 官方文档](https://docs.optimism.io/)
- [Base 官方文档](https://docs.base.org/)
- [zkSync 官方文档](https://docs.zksync.io/)
- [StarkNet 官方文档](https://docs.starknet.io/)
- [Vitalik: The different types of ZK-EVMs](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)
- [The Block: Layer 2 数据面板](https://www.theblock.co/data/scaling-solutions)
