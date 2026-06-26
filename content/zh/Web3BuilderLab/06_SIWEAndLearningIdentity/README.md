# SIWE 与学习身份实验

> Sign-In with Ethereum 不是“随便签一段消息”。ERC-4361 规范化了钱包登录消息应该包含什么，让用户、钱包和 relying party 可以围绕 domain、nonce、expiration 和 replay risk 做出判断。

Last reviewed: 2026-06-25

## 目录

- [为什么学习平台需要 SIWE](#为什么学习平台需要-siwe)
- [ERC-4361 标准化了什么](#erc-4361-标准化了什么)
- [消息字段](#消息字段)
- [Nonce 与重放风险](#nonce-与重放风险)
- [Domain、URI 与钓鱼风险](#domainuri-与钓鱼风险)
- [为什么静态站点不是生产级认证](#为什么静态站点不是生产级认证)
- [动手实验](#动手实验)
- [学习身份与凭证](#学习身份与凭证)
- [学习检查清单](#学习检查清单)
- [延伸阅读](#延伸阅读)

## 为什么学习平台需要 SIWE

钱包地址可以代表一个学习者，但连接钱包仍然不是登录会话。

SIWE 回答的是一个更窄的问题：

> 这个钱包是否为这个 relying party、这个时间窗口、这条认证消息完成了签名？

这对学习身份很重要。未来的课程平台可能希望学习者在领取徽章、证书或 verifiable credential 前证明自己控制某个钱包。但这个证明必须有边界：

- 哪个站点发起了签名请求？
- 哪个地址签名？
- 消息绑定到哪个链上下文？
- 哪个 nonce 防止重放？
- 消息何时签发？
- 何时过期？
- 验证后创建了什么 session？

本课和 `/labs/siwe` demo 只展示消息结构，不创建生产级账户系统。

## ERC-4361 标准化了什么

[ERC-4361](https://eips.ethereum.org/EIPS/eip-4361) 把 Sign-In with Ethereum 定义为一种链下认证消息格式。该标准处于 Final 状态，描述了以太坊账户如何通过签名结构化纯文本消息来认证到链下服务。

对于 EOA，标准使用 ERC-191 signed data flow。钱包应该在签名前展示用户可读的消息，relying party 则必须同时检查签名和消息内容。

## 消息字段

一条 SIWE 消息通常包含：

| 字段         | 作用                                          |
| ------------ | --------------------------------------------- |
| `domain`     | 请求签名的网站                                |
| `address`    | 签名的以太坊账户                              |
| `statement`  | 用户可读的请求说明                            |
| `URI`        | 正在登录或授权的资源 / 应用入口               |
| `Version`    | ERC-4361 中为 `1`                             |
| `Chain ID`   | EIP-155 链上下文                              |
| `Nonce`      | 用于防重放的随机值                            |
| `Issued At`  | 消息创建时间                                  |
| `Expiration` | 可选，但能减少签名可被利用的时间窗口          |
| `Resources`  | 可选资源链接，由 relying party 另行解释或解析 |

实验页会构造包含这些字段的消息，并通过 `personal_sign` 请求钱包签名。

## Nonce 与重放风险

Nonce 不是装饰字段。它是防止旧签名被重复使用的关键机制。

生产环境中：

1. 服务器创建 fresh nonce。
2. 前端把 nonce 放入 SIWE 消息。
3. 钱包签名消息。
4. 服务器验证签名并消耗 nonce。
5. 同一个 nonce 不能再次使用。

静态实验页可以在浏览器里生成 fresh nonce，但这只是教学演示。浏览器生成的 nonce 不能替代服务器签发并存储的可信 nonce。

## Domain、URI 与钓鱼风险

`domain` 和 `URI` 告诉钱包与 relying party：这个请求来自哪里。钱包可以把消息里的 domain 与真实请求 origin 做比较，从而识别可疑弹窗。

这很重要，因为恶意页面可能诱导用户签署看起来像另一个站点的文本。生产钱包或 relying party 应该拒绝 origin 不匹配的请求，除非是明确标注的本地开发场景。

## 为什么静态站点不是生产级认证

GitHub Pages 不能单独完成生产级 SIWE，因为它没有可信后端。

生产级 SIWE relying party 需要：

- 服务端签发并存储 nonce。
- 验证签名。
- 防重放。
- 创建和失效化 session。
- 处理 ERC-1271 合约钱包签名。
- 为 ENS 或 profile 查询设定清晰隐私规则。

因此 `/labs/siwe` 页面只声称自己做三件事：构造消息、请求钱包签名、本地检查字段。它不会声称学习者已经完成真实登录。

## 动手实验

打开：

- 中文：`/zh/labs/siwe`
- English：`/en/labs/siwe`

尝试这个流程：

1. 连接一个注入式 EVM 钱包。
2. 阅读 domain、URI、nonce、issued-at 和 expiration 字段。
3. 刷新 nonce，观察哪些字段变化。
4. 签名消息。
5. 查看本地检查结果。

本地检查会确认：

- Domain 与当前页面一致。
- Address 与已连接钱包一致。
- Nonce 形态符合要求。
- Expiration 仍在未来。
- Signature 符合常见 65 字节十六进制形态。

这些检查不足以完成生产认证。它们只是学习辅助。

## 学习身份与凭证

真正有用的不是“钱包等于账户”，而是：

> 学习者可以在特定目的和时间窗口内证明自己控制某个钱包。

这个证明未来可以成为以下系统的输入之一：

- 学习进度备份。
- 徽章领取。
- 证书签发。
- Verifiable credential 展示。
- Sponsor-safe impact reporting。

但每一种系统都需要自己的架构设计。课程徽章、NFT certificate、soulbound credential 和 offchain verifiable credential 在隐私、撤销和可迁移性上都不一样。

## 学习检查清单

完成本课后，你应该能解释：

- 为什么连接钱包不等于登录。
- ERC-4361 SIWE 消息包含哪些字段。
- 为什么 nonce 和 expiration 能降低重放风险。
- 为什么静态站点不能单独提供生产级 SIWE session。
- SIWE 如何连接到学习身份，但不能直接承诺真实账户系统。

## 延伸阅读

- [ERC-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)
- [ERC-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191)
- [ERC-1271: Standard Signature Validation Method for Contracts](https://eips.ethereum.org/EIPS/eip-1271)
- [SIWE hosted-auth decision note](https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/strategy/2026-06-25-siwe-learning-identity-decision.md)
