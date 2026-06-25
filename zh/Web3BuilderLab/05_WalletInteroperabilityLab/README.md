# 钱包互操作与签名实验

![status](https://img.shields.io/badge/状态-已完成-success)
![author](https://img.shields.io/badge/作者-beihaili-blue)
![date](https://img.shields.io/badge/日期-2026--06-orange)
![difficulty](https://img.shields.io/badge/难度-中级-yellow)

> 钱包连接不是一个按钮那么简单。现代 DApp 需要处理多钱包发现、网络上下文、切链、消息签名和隐私边界。本课配套 `/labs/wallet` 实验页，帮你把这些机制拆开看清楚。

Last reviewed: 2026-06-25

## 目录

- [为什么要单独学习钱包互操作](#为什么要单独学习钱包互操作)
- [实验页能做什么](#实验页能做什么)
- [EIP-6963 解决了什么问题](#eip-6963-解决了什么问题)
- [EIP-1193 provider 是什么](#eip-1193-provider-是什么)
- [连接钱包不等于登录](#连接钱包不等于登录)
- [消息签名不等于交易](#消息签名不等于交易)
- [切链为什么需要 allowlist](#切链为什么需要-allowlist)
- [隐私和 analytics 边界](#隐私和-analytics-边界)
- [动手实验](#动手实验)
- [学习检查清单](#学习检查清单)
- [延伸阅读](#延伸阅读)

---

## 为什么要单独学习钱包互操作

很多入门教程会把钱包连接简化成：

```text
点击 Connect Wallet -> 拿到地址 -> 开始使用 DApp
```

真实产品里更复杂：

- 用户可能同时安装多个钱包扩展。
- 钱包可能注入不同的 provider。
- 页面需要知道当前 chain ID。
- 用户可能需要切换到应用支持的网络。
- 签名消息、签名交易和发送交易是不同动作。
- 地址、签名和 provider 对象都不应该随便发送到 analytics。

所以 Get Started with Web3 的 Wallet Lab 不把自己伪装成生产级钱包框架，而是把这些机制拆成可观察的小步骤。

## 实验页能做什么

打开实验页：

- 中文：`/zh/labs/wallet`
- English：`/en/labs/wallet`

当前 MVP 支持：

| 能力           | 学习目标                                         | 风险边界                   |
| -------------- | ------------------------------------------------ | -------------------------- |
| 发现注入式钱包 | 看见浏览器里有哪些 EVM 钱包 provider             | 不收集钱包指纹             |
| 连接钱包       | 理解 `eth_requestAccounts` 返回账户              | 不把原始地址发到 analytics |
| 显示网络       | 理解 chain ID 和网络名称                         | 不自动添加未知 RPC         |
| 切换网络       | 体验 allowlist 内的 `wallet_switchEthereumChain` | 不引导资产桥接或交易       |
| 签名消息       | 区分消息签名和交易签名                           | 不创建登录会话，不发送签名 |

如果浏览器没有钱包扩展，实验页会显示安全的空状态。这个空状态本身也是重要体验：优秀的 DApp 应该告诉用户缺少什么，而不是崩溃或静默失败。

## EIP-6963 解决了什么问题

早期浏览器钱包通常把 provider 注入到 `window.ethereum`。如果用户安装多个钱包，就会出现竞争：

```text
Wallet A 注入 window.ethereum
Wallet B 也注入 window.ethereum
最后加载的钱包覆盖前一个钱包
```

结果是页面未必知道用户真正想用哪个钱包。

[EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) 是 Final 的 Interface 标准，用 window events 发现多个注入式 wallet provider。它定义了两个关键事件：

```text
eip6963:requestProvider
eip6963:announceProvider
```

页面先监听 `announceProvider`，再发出 `requestProvider`。钱包收到请求后重新 announce 自己。这样 DApp 可以列出多个钱包，而不是盲目使用单一的 `window.ethereum`。

EIP-6963 的 provider info 通常包含：

| 字段   | 含义                                      | 注意                       |
| ------ | ----------------------------------------- | -------------------------- |
| `uuid` | 当前页面生命周期内区分 provider 的唯一 ID | 不等于用户身份             |
| `name` | 展示给用户的钱包名称                      | 仍可能被模仿               |
| `icon` | 钱包图标 URI                              | SVG 图标要避免执行脚本     |
| `rdns` | reverse-DNS 钱包标识                      | 自声明字段，不能当成强验证 |

实验页会优先监听 EIP-6963 announcement；如果没有可用 announcement，再 fallback 到 `window.ethereum`。

## EIP-1193 provider 是什么

[EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) 是 Final 的 Ethereum Provider JavaScript API 标准。它定义了 DApp 和钱包之间的基本通信方式。对前端来说，最核心的是：

```js
await provider.request({
  method: 'eth_requestAccounts',
});
```

常见方法包括：

| 方法                         | 用途                   | 实验页是否使用 |
| ---------------------------- | ---------------------- | -------------- |
| `eth_requestAccounts`        | 请求用户授权并返回账户 | 使用           |
| `eth_chainId`                | 读取当前网络 chain ID  | 使用           |
| `wallet_switchEthereumChain` | 请求钱包切换网络       | 使用           |
| `personal_sign`              | 请求用户签名一段消息   | 使用           |
| `eth_sendTransaction`        | 发送交易               | 不使用         |

这也是为什么实验页可以保持无依赖：它直接展示 provider API 的核心动作，而不先引入 wagmi、RainbowKit 或 Reown AppKit。

## 连接钱包不等于登录

连接钱包只是拿到一个账户地址，并获得当前页面调用部分钱包能力的权限。它不自动意味着：

- 用户已经完成生产级登录。
- 服务器已经验证 nonce。
- 页面拥有长期 session。
- 用户同意任何交易或授权。

生产级 Sign-In with Ethereum 需要服务器生成 nonce、验证签名、防重放、管理 session。静态 GitHub Pages 不能单独完成这个闭环。

## 消息签名不等于交易

实验页使用的是教学消息签名。签名内容类似：

```text
Get Started with Web3 Wallet Lab
Domain: bhbtc.xyz
Purpose: Learn wallet message signing. No transaction, payment, or login session is created.
Issued At: ...
```

这条消息的目的只是让你观察钱包弹窗和签名返回值。

它不会：

- 发送交易。
- 移动资产。
- 授权代币。
- 创建生产登录会话。
- 把签名上传到服务器。

看到签名弹窗时仍然要读清楚内容。真实钓鱼站经常利用用户“不看消息内容”的习惯。

## 切链为什么需要 allowlist

实验页只允许在小范围网络之间切换：

- Ethereum Mainnet 学习上下文。
- Sepolia Testnet 学习上下文。

原因很简单：DApp 不应该随便要求用户切到任意网络，更不应该自动添加未知 RPC。网络选择会影响：

- 资产所在链。
- 交易费用。
- 合约地址是否正确。
- 区块浏览器和 RPC 可信度。
- 用户是否可能误以为自己在测试网。

对于学习实验，allowlist 比“支持所有链”更安全。

## 隐私和 analytics 边界

Wallet Lab 的规则是：

允许记录粗粒度行为，例如：

- 打开实验页。
- 点击连接按钮。
- 点击切链按钮。
- 点击签名按钮。

不允许发送：

- 原始钱包地址。
- ENS 名称。
- 签名。
- 已签消息全文。
- provider 对象。
- 交易 payload。

如果未来需要统计连接状态，只能记录类似 `connected: true` 这样的粗粒度布尔值。

## 动手实验

1. 打开 `/zh/labs/wallet`。
2. 如果没有钱包扩展，先观察空状态文案。
3. 如果有 EVM 钱包，点击连接。
4. 查看页面展示的钱包名称、缩略地址和网络。
5. 尝试切换到 Sepolia。
6. 点击签名学习消息。
7. 确认页面只展示签名预览，不展示完整签名。
8. 点击本地断开，观察页面状态被清空。

思考：

- 如果你安装了多个钱包，页面是否能列出多个选项？
- 钱包弹窗里的签名消息是否清楚说明“不创建登录会话”？
- 如果钱包拒绝切链，页面是否应该解释原因？
- 为什么“本地断开”不能替代钱包自身的权限管理？

## 学习检查清单

完成本课后，你应该能解释：

- EIP-6963 为什么比单一 `window.ethereum` 更适合多钱包环境。
- EIP-1193 provider 的 `request()` 方法在 DApp 中扮演什么角色。
- 连接钱包、消息签名、交易签名、发送交易之间的区别。
- 为什么切链应该有 allowlist。
- 为什么 raw address 和 signature 不应该进入 analytics。
- 为什么静态站点不能声称自己完成了生产级登录。

## 延伸阅读

- [EIP-6963: Multi Injected Provider Discovery](https://eips.ethereum.org/EIPS/eip-6963)
- [EIP-1193: Ethereum Provider JavaScript API](https://eips.ethereum.org/EIPS/eip-1193)
- [Wallet Lab architecture note](https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/strategy/2026-06-24-wallet-lab-architecture.md)
- [Sign-In with Ethereum / ERC-4361](https://eips.ethereum.org/EIPS/eip-4361)
