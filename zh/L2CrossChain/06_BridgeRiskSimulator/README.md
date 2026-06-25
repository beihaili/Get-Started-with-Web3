# L2 与跨链桥风险模拟器

> 跨链桥不是一个简单的“转账按钮”。它背后是一组 finality 假设、合约、验证者、Relayer、流动性提供者、消息格式和失败路径。本实验帮助你在移动真实价值前先比较这些假设。

Last reviewed: 2026-06-25

## 目录

- [为什么桥风险需要模拟器](#为什么桥风险需要模拟器)
- [四个核心问题](#四个核心问题)
- [跨链路径类型](#跨链路径类型)
- [Finality 不等于 UI 确认](#finality-不等于-ui-确认)
- [消息传递与失败模式](#消息传递与失败模式)
- [动手实验](#动手实验)
- [凭证边界](#凭证边界)
- [检查清单](#检查清单)
- [延伸阅读](#延伸阅读)

## 为什么桥风险需要模拟器

很多学习者比较跨链桥时，首先看速度和费用。这有用，但远远不够。

一条跨链路径还隐藏着这些问题：

- 哪条链或哪个合约是信任锚？
- 谁能验证源链事件真实发生？
- 这条路径多久之后才算 final？
- 如果排序器、Relayer、验证者、流动性提供者或桥合约失败，会发生什么？
- 应用只是跳转到桥，还是把桥接流程嵌入自己的产品，并解释跨链消息？

`/labs/l2-risk` 模拟器把这些问题变成一个小型风险模型。它不会连接钱包、提交跨链交易、给桥排名，也不会建议你移动资产。

## 四个核心问题

使用任何跨链桥或跨链消息路径前，先问四个问题：

1. **Finality：** 源链事件什么时候才足够安全，可以被目标链执行？
2. **Trust：** 哪些合约、验证者、委员会、Prover、Relayer 或治理密钥必须正确运行？
3. **Message：** 这是资产转移、包装资产、流动性快速填充，还是任意应用 calldata？
4. **Failure：** 如果路径出错，谁能重试、退款、挑战、暂停或救援？

最安全的用户流程往往很朴素：读文档、小额测试、理解提款等待期，大额优先考虑规范路径。

## 跨链路径类型

[ethereum.org 的桥文档](https://ethereum.org/en/developers/docs/bridges/) 将桥分为多种类别，包括原生桥、外部验证桥、消息传递和流动性网络。模拟器采用类似的教学分类。

| 路径类型 | 常见好处 | 主要风险视角 |
| --- | --- | --- |
| Optimistic Rollup 原生桥 | L1 锚定较强 | 挑战期、watcher 可用性、升级密钥 |
| ZK Rollup 原生桥 | 基于有效性证明退出 | Prover 可用性、Verifier 漏洞、升级密钥 |
| 外部验证桥 | 快速、支持多链 | 验证者被攻破、包装资产记账 |
| 通用消息传递 | 支持应用级跨链动作 | Endpoint 配置、防重放、Relayer 延迟 |
| 流动性网络 / 快速桥 | 用户快速到账 | 流动性深度、Solver 结算、规范路径兜底 |

这不是排名。同一条路径可能适合一种场景，也可能不适合另一种场景。

## Finality 不等于 UI 确认

桥的 UI 可能显示“已提交”或“已到账”，但完整安全模型还没有结束。

例子：

- Optimistic Rollup 提款可能已经显示在界面上，但仍要等待挑战期。
- ZK Rollup 提款可能需要等待证明生成和验证。
- 快速桥可能让用户先到账，但流动性提供者稍后才结算。
- 通用消息可能在源链有效，但仍需要 Relayer 投递和目标应用执行。

Finality 是安全状态，不只是进度条。

## 消息传递与失败模式

跨链风险不只发生在资产桥。

当应用发送跨链消息时，漏洞可能出现在多个层次：

- Chain ID 或 endpoint 地址配置错误。
- 缺少防重放。
- 目标应用接受了来自不可信发送方的消息。
- Relayer 或 Executor 停止投递消息。
- 治理升级改变了消息验证方式。
- 排序器停机延迟打包或证明生成。

这就是为什么“内嵌桥接流程”会让应用本身变成风险面。如果应用替用户选择路径，应用也应该解释失败状态。

## 动手实验

打开：

- English: `/en/labs/l2-risk`
- 中文: `/zh/labs/l2-risk`

建议按这个顺序操作：

1. 从默认的 Optimistic Rollup 原生桥提款场景开始。
2. 切换到 ZK Rollup 原生桥，对比 finality 步骤。
3. 切换到外部验证桥，并把金额区间改为“大额”。
4. 切换排序器降级，观察可用性警告。
5. 将应用集成方式从跳转改为内嵌，观察应用如何进入风险面。
6. 在想象真实路径前，阅读检查清单。

风险分只是教学辅助，不是实时安全评级。

## 凭证边界

Phase 5 还要求项目连接学习身份和凭证，但不能过度承诺。

本仓库已经在 `contracts/` 下有一个 ERC-721 证书合约。这个合约只是一个可能设计，不是唯一凭证架构。

学习凭证可以有多种表示方式：

- ERC-721 证书。
- ERC-1155 多证书。
- 不可转让或 soulbound token。
- 链下签名证明。
- DID / Verifiable Credential。
- Attestation registry。

每种选择在隐私、撤销、成本、可移植性和信任模型上都不同。在改变任何合约前，凭证架构取舍需要先单独记录。

## 检查清单

学完这一讲后，你应该能解释：

- 为什么桥风险不只是费用和速度问题。
- Optimistic、ZK、外部验证、消息传递和流动性路径的 finality 差异。
- 为什么排序器停机可能变成用户可见风险。
- 为什么任意消息传递需要应用级防重放和 endpoint 检查。
- 为什么学习凭证不能默认等同于“发 NFT 证书”。

## 延伸阅读

- [ethereum.org: Bridges](https://ethereum.org/en/developers/docs/bridges/)
- [ethereum.org: Layer 2](https://ethereum.org/en/layer-2/)
- [L2BEAT Risk Framework](https://l2beat.com/scaling/risk)
- [W3C DID Core](https://www.w3.org/TR/did-core/)
- [W3C Verifiable Credentials Data Model 2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [Credential architecture tradeoff note](https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/strategy/2026-06-25-credential-architecture-tradeoff.md)
