# Rollup 原理详解

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 中级 - yellow)

> 💡 Rollup 是以太坊扩容的核心技术方案。本课深入解析 Optimistic Rollup 和 ZK Rollup 两大流派的工作原理，对比它们在安全模型、性能和 EVM 兼容性上的差异，并探讨数据可用性的关键挑战。
>
> 欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)
>
> 进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> 文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)

## 目录

- [什么是 Rollup](# 什么是 - rollup)
- [Optimistic Rollup 原理](#optimistic-rollup - 原理)
- [ZK Rollup 原理](#zk-rollup - 原理)
- [Optimistic vs ZK 详细对比](#optimistic-vs-zk - 详细对比)
- [数据可用性问题](# 数据可用性问题)
- [Validium 和 Volition 模式](#validium - 和 - volition - 模式)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

## 什么是 Rollup

Rollup（卷叠）是一种 Layer 2 扩容方案，核心思想用一句话概括：** 把计算搬到链下，把数据留在链上 **。

想象一个类比：你在公司做项目，如果每个细节都要请示 CEO（以太坊主网），效率会非常低。Rollup 的做法是 —— 你在自己的办公室（L2）独立完成工作，只把最终的工作报告和关键证据（交易数据和证明）提交给 CEO 审核。

具体来说，Rollup 的工作流程如下：

```
1. 用户在 L2 上提交交易
   ↓
2. Rollup 排序器（Sequencer）收集交易，打包成批次（Batch）
   ↓
3. 排序器在 L2 上执行这些交易，更新 L2 状态
   ↓
4. 将交易数据 + 状态证明提交到以太坊 L1
   ↓
5. L1 上的 Rollup 合约验证 / 存储数据
   ↓
6. 一旦 L1 确认，L2 交易获得以太坊级别的安全保障
```

** 为什么这能扩容？**

- ** 计算压缩 **：L1 不需要重新执行每笔交易，只需验证证明或等待挑战期
- ** 数据压缩 **：Rollup 对交易数据进行高效编码，例如一笔 ETH 转账在 L1 上需要约 110 字节，而 Rollup 批量提交只需约 12 字节
- ** 批量摊销 **：固定的 L1 提交成本被批次内所有交易分摊

目前 Rollup 有两大技术流派：**Optimistic Rollup** 和 **ZK Rollup**，它们的区别在于如何向 L1 证明 L2 状态的正确性。

## Optimistic Rollup 原理

### 核心理念：乐观假设 + 欺诈证明

Optimistic Rollup 的名字来源于它的核心假设 ——** 乐观地假设所有提交的状态都是正确的 **，除非有人提出异议。

这就像法律系统中的 "无罪推定"—— 你被假定为无罪，直到有人拿出证据证明你有罪。

### 工作流程详解

```
排序器提交状态根到 L1
     │
     ▼
┌─────────────────────────────┐
│     7 天挑战窗口开始          │
│                             │
│  任何人都可以提交欺诈证明     │
│                             │
│  ├── 无人挑战 → 状态被确认 ✅ │
│  │                          │
│  └── 有人挑战 → 触发裁决 ⚠️  │
│       ├── 挑战成功 → 状态回滚 │
│       └── 挑战失败 → 状态确认 │
└─────────────────────────────┘
```

** 关键角色：**

1. ** 排序器（Sequencer）**：收集用户交易、排序、执行并提交状态到 L1
2. ** 验证者（Validator/Challenger）**：监控排序器提交的状态，发现错误时提交欺诈证明
3. **L1 裁决合约 **：在链上重新执行有争议的交易步骤，判定谁是对的

### 欺诈证明的具体机制

当验证者发现排序器提交了错误的状态时，会触发交互式证明过程：

```
步骤 1: 验证者指出 "从第 N 步到第 M 步的状态转换是错的"
步骤 2: 二分查找 —— 双方不断缩小争议范围
步骤 3: 最终定位到单个执行步骤
步骤 4: L1 合约重新执行这一步，判定对错

示例：
排序器声称: State_100 → [执行 1000 笔交易] → State_200
验证者声称: State_100 → [执行 1000 笔交易] → State_201

通过二分:
  范围 1-1000 → 范围 500-1000 → 范围 750-1000 → ... → 第 873 步

L1 重新执行第 873 步，得出正确结果
```

** 为什么需要 7 天挑战期？**

这是一个安全边际。虽然大多数欺诈可以在几分钟内被发现，但 7 天的窗口确保：
- 即使大部分验证者暂时离线，仍有足够时间发现和响应
- 在极端网络情况（如以太坊 L1 拥堵）下仍然安全
- 只需要 ** 一个 ** 诚实的验证者就能保证安全 —— 这就是所谓的 **1-of-N 信任假设 **

** 缺点 **：从 L2 提款到 L1 需要等待 7 天挑战期结束。不过第三方流动性桥可以提供 "快速提款" 服务（收取一定手续费）。

## ZK Rollup 原理

### 核心理念：零知识证明 + 有效性证明

ZK Rollup 采用完全不同的策略 —— 不是乐观假设，而是每次提交状态时都 ** 附带一个数学证明 **，证明状态转换是正确的。

"零知识证明" 这个名字听起来神秘，但核心概念并不复杂：

> ** 零知识证明 **：向别人证明你知道某个信息，但不透露这个信息本身。

经典类比：假设你是色盲，我要向你证明两个球颜色不同，但不告诉你具体是什么颜色。
- 你把两个球藏在背后，随机（或不）交换它们，然后拿出来问我 "你换了吗？"
- 我每次都能正确回答。重复多次后，你就可以确信这两个球确实不同 —— 即使你不知道颜色。

### ZK Rollup 工作流程

```
1. 排序器收集并执行 L2 交易
   ↓
2. 证明者（Prover）生成 ZK 证明
・输入：旧状态 + 交易列表
・输出：新状态 + 有效性证明（ZK-SNARK 或 ZK-STARK）
   ↓
3. 将新状态根 + ZK 证明 + 压缩交易数据提交到 L1
   ↓
4. L1 验证合约验证 ZK 证明
・验证计算量很小（O (1) 或 O (log n)）
・验证通过 → 状态立即确认 ✅
・验证失败 → 状态被拒绝 ❌
```

** 关键优势：提交即确认 **

ZK Rollup 不需要挑战期，因为数学证明本身就保证了正确性。这意味着：
- 从 L2 提款到 L1 可以在证明被验证后立即完成（通常几分钟到几小时）
- 安全性基于数学，而非经济博弈

### ZK 证明的两大流派

| 特性 | ZK-SNARK | ZK-STARK |
|------|----------|----------|
| 全称 | Succinct Non-interactive Argument of Knowledge | Scalable Transparent Argument of Knowledge |
| 证明大小 | 极小（约 200-300 字节） | 较大（约 45-200 KB） |
| 验证时间 | 极快（恒定时间） | 较快（对数时间） |
| 可信设置 | 需要（一次性仪式） | 不需要（透明） |
| 量子抗性 | 无 | 有 |
| 代表项目 | zkSync, Scroll, Polygon zkEVM | StarkNet, StarkEx |

**ZK 证明生成的挑战 **：

生成 ZK 证明是计算密集型操作。证明一个包含数千笔交易的批次，可能需要：
- 强大的 GPU/FPGA/ASIC 硬件
- 数分钟到数十分钟的计算时间
- 大量内存（数十到数百 GB）

这也是为什么 ZK Rollup 的技术实现比 Optimistic Rollup 更复杂、发展更慢。

## Optimistic vs ZK 详细对比

| 维度 | Optimistic Rollup | ZK Rollup |
|------|-------------------|-----------|
| ** 安全模型 ** | 欺诈证明（1-of-N 信任假设） | 有效性证明（数学保证） |
| ** 提款时间 ** | 7 天挑战期 | 即时（证明验证后） |
| **EVM 兼容性 ** | 优秀（接近原生兼容） | 改善中（zkEVM 各有不同） |
| ** 计算成本 ** | L2 执行便宜，L1 只在挑战时计算 | ZK 证明生成成本高 |
| **L1 数据成本 ** | 较高（需要完整交易数据用于欺诈证明） | 较低（状态差异 + 证明即可） |
| ** 技术成熟度 ** | 较成熟（2021 年开始大规模使用） | 快速追赶中 |
| ** 主要项目 ** | Arbitrum, Optimism, Base | zkSync, StarkNet, Scroll, Polygon zkEVM |
| ** 适合场景 ** | 通用 DeFi/dApp | 高频交易、支付、注重快速终局性的场景 |

### 关于 zkEVM 的兼容性分级

Vitalik 提出了 zkEVM 的兼容性分类：

```
Type 1: 完全等价于以太坊（最慢的证明速度）
  └── 目标：Scroll, Taiko

Type 2: 完全等价于 EVM（稍快）
  └── 目标：Scroll, Polygon zkEVM

Type 2.5: 等价于 EVM，但 Gas 成本不同
  └── 大部分 zkEVM 的实际状态

Type 3: 接近 EVM 等价（更快的证明速度）
  └── 可能需要少量代码修改

Type 4: 高级语言等价（最快的证明速度，但需要转译）
  └── 目标：zkSync Era (Solidity → Yul → zkEVM)
  └── StarkNet (Cairo 原生)
```

Type 编号越小越兼容，但证明生成越慢。随着硬件和算法进步，Type 1 zkEVM 正在变得越来越可行。

## 数据可用性问题

Rollup 将交易数据发布到 L1，但这些数据的存储方式至关重要。

### 为什么数据可用性（DA）很重要？

数据可用性确保任何人都可以：
1. 验证 L2 状态的正确性
2. 在排序器故障时重建 L2 状态
3. 强制将资金从 L2 提取到 L1（逃生舱机制）

如果数据不可用，用户的资金可能被永久锁定在 L2 上。

### Calldata vs Blob（EIP-4844）

在 EIP-4844 之前，Rollup 将数据存储在以太坊交易的 `calldata` 中：

```
EIP-4844 之前:
Rollup 交易 → calldata（永久存储在以太坊状态中）
成本：每字节 16 Gas（非零字节）
问题：与其他以太坊交易竞争同一个 Gas 市场

EIP-4844 之后:
Rollup 交易 → Blob（临时存储，约 18 天后自动删除）
成本：独立的 Blob Gas 市场，远低于 calldata
好处: Rollup 数据不再与 L1 交易竞争区块空间
```

**Blob 的关键特性 **：

- ** 临时存储 **：Blob 数据在约 18 天后从共识层删除（但保留承诺值）
- **KZG 承诺 **：使用 Kate-Zaverucha-Goldberg 多项式承诺方案，可以在不下载全部数据的情况下验证数据的可用性
- ** 独立费用市场 **：Blob Gas 有自己的 baseFee 和供需动态

EIP-4844 每个区块支持最多 6 个 Blob（目标 3 个），每个 Blob 约 128 KB。未来的 Full Danksharding 计划将 Blob 数量提升到每个区块 64 个甚至更多。

### 成本影响实测

```
Arbitrum 上一笔 Uniswap 交换的成本分解:

EIP-4844 之前:
  L2 执行费: $0.02
  L1 数据费: $0.40 (占 95%)
  总计: $0.42

EIP-4844 之后:
  L2 执行费: $0.02
  L1 数据费: $0.005 (占 20%)
  总计: $0.025

降幅：约 94%
```

## Validium 和 Volition 模式

除了标准的 Rollup，还有两种变体模式，它们在数据可用性上做出了不同的选择：

### Validium

**Validium = ZK 有效性证明 + 链下数据 **

```
标准 ZK Rollup:
  执行：链下 ✅
  证明: ZK 证明提交到 L1 ✅
  数据：发布到 L1 ✅ (最安全但最贵)

Validium:
  执行：链下 ✅
  证明: ZK 证明提交到 L1 ✅
  数据：存储在链下（由数据可用性委员会 DAC 管理）⚠️
```

** 优点 **：
- 极低的交易成本（不需要在 L1 发布数据）
- 高吞吐量
- 适合游戏、社交等对安全性要求稍低的场景

** 缺点 **：
- 数据可用性依赖 DAC 的诚实性
- 如果 DAC 集体作恶或下线，用户可能无法提取资金
- 安全性低于标准 Rollup

** 代表项目 **：StarkEx（dYdX v3, Immutable X, Sorare）

### Volition

**Volition = 用户自主选择数据存储位置 **

```
Volition 模式:
  用户 A: "我的交易很重要" → 数据发布到 L1 (Rollup 模式)
  用户 B: "我只是玩游戏" → 数据存储在链下 (Validium 模式)
```

每个用户（甚至每笔交易）可以自行选择安全级别：
- 高价值 DeFi 操作 → 选择 Rollup 模式，享受完整的 L1 安全性
- 低价值游戏操作 → 选择 Validium 模式，享受更低的费用

** 代表项目 **：zkSync Era（支持 Validium 模式）、StarkNet（规划中）

### 模式对比

| 特性 | Rollup | Validium | Volition |
|------|--------|----------|---------|
| 数据位置 | L1 链上 | 链下 (DAC) | 用户选择 |
| 安全级别 | 最高 | 中等 | 灵活 |
| 交易成本 | 较高 | 最低 | 取决于选择 |
| 适用场景 | DeFi、高价值操作 | 游戏、NFT | 混合应用 |
| 信任假设 | 仅信任 L1 | 信任 DAC | 用户自定义 |

## 总结

1. **Rollup 的核心原理 ** 是 "链下执行，链上验证"—— 在 L2 处理交易，将数据和证明提交回 L1 以继承其安全性
2. **Optimistic Rollup** 采用 "乐观假设 + 欺诈证明" 模型，7 天挑战期确保安全，EVM 兼容性好，目前生态最成熟
3. **ZK Rollup** 用数学证明保证正确性，无需挑战期即可确认，但证明生成成本高、zkEVM 兼容性仍在演进中
4. ** 数据可用性是核心挑战 **——EIP-4844 引入 Blob 将 Rollup 数据成本降低约 94%，Full Danksharding 将进一步扩容
5. **Validium 和 Volition** 在安全性和成本之间提供了更多选择，适合不同场景的灵活需求

## 延伸阅读

- [Vitalik: An Incomplete Guide to Rollups](https://vitalik.eth.limo/general/2021/01/05/rollup.html)
- [Vitalik: The different types of ZK-EVMs](https://vitalik.eth.limo/general/2022/08/04/zkevm.html)
- [Ethereum.org: Optimistic Rollups](https://ethereum.org/en/developers/docs/scaling/optimistic-rollups/)
- [Ethereum.org: ZK Rollups](https://ethereum.org/en/developers/docs/scaling/zk-rollups/)
- [EIP-4844 详解](https://www.eip4844.com/)
- [L2Beat: Rollup 风险评估](https://l2beat.com/)
- [Delphi Digital: The Complete Guide to Rollups](https://members.delphidigital.io/reports/the-complete-guide-to-rollups/)
