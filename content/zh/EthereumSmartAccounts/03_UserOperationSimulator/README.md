# UserOperation 模拟器与账户抽象实践

> 账户抽象真正变清楚，往往是从看见系统里流动的那个对象开始。ERC-4337 不是让用户直接发一笔普通以太坊交易，而是让应用准备 `UserOperation`，交给 Bundler，再由 Bundler 提交给 `EntryPoint`。

Last reviewed: 2026-06-25

## 目录

- [为什么需要这个实验](#为什么需要这个实验)
- [ERC-4337 心智模型](#erc-4337-心智模型)
- [UserOperation 字段拆解](#useroperation-字段拆解)
- [Bundler、EntryPoint 与 Paymaster](#bundlerentrypoint-与-paymaster)
- [智能账户与恢复](#智能账户与恢复)
- [EIP-7702 委托 EOA](#eip-7702-委托-eoa)
- [安全与赞助风险](#安全与赞助风险)
- [动手实验](#动手实验)
- [检查清单](#检查清单)
- [延伸阅读](#延伸阅读)

## 为什么需要这个实验

上一讲解释了智能账户和账户抽象概念。这一讲把它们变成一个可操作对象。

目标不是连接真实 Bundler，也不是申请真实 Gas 赞助。目标是回答：

- 现代 `UserOperation` 里有哪些字段？
- 哪个角色负责验证账户？
- Paymaster 放在哪一步？
- 首次部署智能账户和 EIP-7702 委托 EOA 有什么不同？
- 为什么“免 Gas”本质上仍然是策略和安全问题？

模拟器只在本地运行。它生成的是带伪 calldata 和占位签名的教学草案，避免学习者误把它当成可直接发送的真实操作。

## ERC-4337 心智模型

[ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) 在不改变以太坊共识规则的前提下实现账户抽象。用户不再直接发送普通交易，而是由应用准备一个 `UserOperation`。

简化流程如下：

1. 用户表达意图：转账、批量调用、安装权限或恢复账户。
2. 应用组装 `UserOperation`。
3. 账户按照自己的验证规则签名。
4. Bundler 在接受操作前先模拟。
5. Bundler 把一组操作提交给 `EntryPoint`。
6. `EntryPoint` 验证、执行、退还未用 Gas，并支付 Bundler beneficiary。

关键变化是：验证逻辑从固定的 EOA 协议规则，移动到了账户代码中。

## UserOperation 字段拆解

现代 ERC-4337 会把账户部署、calldata、Gas 限制、费用、Paymaster 字段和签名字段分开。链下 JSON-RPC 形状和链上 `PackedUserOperation` 的精确打包方式不同，但学习者可以先理解这个形状：

| 字段 | 含义 |
| --- | --- |
| `sender` | 发起操作的智能账户或委托 EOA |
| `nonce` | 防重放和排序；ERC-4337 支持 key + sequence 模式 |
| `factory` / `factoryData` | 可选的首次智能账户部署，或 EIP-7702 标记路径 |
| `callData` | 账户自定义的执行 payload |
| `callGasLimit` | 主执行调用预留的 Gas |
| `verificationGasLimit` | 账户验证预留的 Gas |
| `preVerificationGas` | 补偿 Bundler 前置开销的 Gas |
| `maxFeePerGas` / `maxPriorityFeePerGas` | 类似 EIP-1559 的费用上限 |
| `paymaster` 和 Paymaster gas/data 字段 | 可选的赞助或替代付费策略 |
| `signature` | 由账户定义的授权数据 |

签名在这里是抽象的。智能账户可以使用 ECDSA、多签、Passkey、Session Key 模块、Guardian 恢复或其他方案。

## Bundler、EntryPoint 与 Paymaster

Bundler 不只是转发器。它在模拟阶段承担“未付费计算”的风险，因此必须保护自己不被无效或恶意操作消耗资源。

最小心智模型：

- **Bundler：** 监听 UserOperation mempool，模拟操作，构建交易并提交。
- **EntryPoint：** 共享合约，负责调用账户验证和执行。
- **Paymaster：** 按策略同意代付 Gas 的合约或服务。
- **Factory：** 当 `sender` 尚不存在时部署新的智能账户。

[ERC-7562](https://eips.ethereum.org/EIPS/eip-7562) 之所以重要，是因为验证代码可能被滥用。它描述了账户抽象验证范围规则，用来保护节点免受未付费计算带来的拒绝服务攻击。

## 智能账户与恢复

智能账户能让钱包更像真实产品：

- 把多个动作打包到一次确认流程里。
- 为新用户赞助 Gas。
- 用 guardian 或延迟窗口做账户恢复。
- 支持带时间、合约、函数和金额限制的 Session Key。
- 在不迁移所有资产的情况下轮换 signer。

但可编程账户也扩大了风险边界。恢复模块、Session Key 模块、插件系统，都会成为账户安全模型的一部分。

## EIP-7702 委托 EOA

[EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) 允许 EOA 通过授权流程设置代码委托。实际效果是：一个已有地址可以获得接近智能账户的行为，而不必把资产迁移到新的合约账户地址。

模拟器把它表示为：

- 一个普通 `UserOperation` 草案。
- 位于 `UserOperation` 外部的 `eip7702Auth` 对象。
- 用户必须信任的 delegate 合约地址。
- 对撤销机制和钓鱼风险的明确提醒。

这很强，因为它降低迁移成本；也很敏感，因为不安全的 delegate 可能影响账户后续行为。

## 安全与赞助风险

账户抽象改善 UX，但不会消除安全设计。

| 功能 | UX 收益 | 风险问题 |
| --- | --- | --- |
| Paymaster | 用户可能不需要原生 Gas | 谁付费？额度多少？滥用时如何处理？ |
| Session Key | 减少重复签名 | 是否限制时间、目标、函数和金额？ |
| 恢复模块 | 设备丢失时更容易恢复 | Guardian 或延迟窗口会不会被社工攻击？ |
| EIP-7702 委托 | EOA 保留地址历史 | Delegate 合约是否可信、可撤销？ |
| Bundler 依赖 | 提交路径更顺滑 | 单一 Bundler 审查或故障时怎么办？ |

不要只说“免 Gas”，必须说明谁付费、有什么策略门槛、失败时用户会看到什么。

## 动手实验

打开：

- English: `/en/labs/account-abstraction`
- 中文: `/zh/labs/account-abstraction`

建议按这个顺序操作：

1. 从默认 ERC-4337 智能账户模式开始。
2. 对比批量操作、转账操作和 Session Key 操作。
3. 切换“首次使用时部署账户”，观察 `factory` / `factoryData`。
4. 切换“使用 Paymaster”，观察赞助字段和警告。
5. 切到 EIP-7702 模式，观察 `eip7702Auth` 对象。
6. 把 sender 改成非法地址，观察本地检查失败。

模拟器输出不是生产 payload。它使用伪 calldata、占位签名和示例地址，帮助学习者先理解结构，再接触真实基础设施。

## 检查清单

学完这一讲后，你应该能解释：

- `UserOperation` 和普通以太坊交易有什么不同。
- 为什么 Bundler 接受操作前必须模拟。
- `EntryPoint`、Factory、Paymaster 和 Smart Account 分别负责什么。
- 为什么 Paymaster 赞助需要策略、预算和防滥用设计。
- EIP-7702 委托 EOA 与部署新智能账户有什么不同。
- 为什么账户抽象改善 UX 的同时也扩大了安全边界。

## 延伸阅读

- [ERC-4337: Account Abstraction Using Alt Mempool](https://eips.ethereum.org/EIPS/eip-4337)
- [EIP-7702: Set Code for EOAs](https://eips.ethereum.org/EIPS/eip-7702)
- [ERC-7562: Account Abstraction Validation Scope Rules](https://eips.ethereum.org/EIPS/eip-7562)
- [ERC-4337 documentation](https://docs.erc4337.io/core-standards/erc-4337.html)
