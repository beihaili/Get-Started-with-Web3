# DeFi 风险与安全

![status](https://img.shields.io/badge/ 状态 - 已完成 - success)
![author](https://img.shields.io/badge/ 作者 - beihaili-blue)
![date](https://img.shields.io/badge/ 日期 - 2025--06-orange)
![difficulty](https://img.shields.io/badge/ 难度 - 中级 - yellow)

> 💡 DeFi 给你前所未有的金融自由，同时也把安全责任完全交到了你手上。本课将系统性地梳理 DeFi 领域的主要风险类型，结合真实攻击案例，帮助你建立完整的风险认知框架和个人安全实践体系。
>
> 欢迎关注我的推特：[@bhbtc1337](https://twitter.com/bhbtc1337)
>
> 进入微信交流群请填表：[表格链接](https://forms.gle/QMBwL6LwZyQew1tX8)
>
> 文章开源在 GitHub：[Get-Started-with-Web3](https://github.com/beihaili/Get-Started-with-Web3)
>
> 购买 BTC / ETH / USDT 等加密货币推荐 [币安](https://www.binance.com/zh-CN)[注册链接](https://www.bsmkweb.cc/register?ref=39797374)

## 目录

- [DeFi 风险全景图](#defi - 风险全景图)
- [智能合约风险](# 智能合约风险)
- [闪电贷攻击案例](# 闪电贷攻击案例)
- [预言机操纵攻击](# 预言机操纵攻击)
- [跑路风险：Rug Pull](# 跑路风险 rug-pull)
- [其他常见风险](# 其他常见风险)
- [如何评估 DeFi 协议安全性](# 如何评估 - defi - 协议安全性)
- [个人安全实践清单](# 个人安全实践清单)
- [总结](# 总结)
- [延伸阅读](# 延伸阅读)

---

## DeFi 风险全景图

根据 Chainalysis 和 DeFi Llama 的数据，2021-2024 年 DeFi 领域因黑客攻击和欺诈造成的损失超过 **$100 亿 **。

```
DeFi 风险分类：

┌─────────────────────────────────────────────────┐
│                  DeFi 风险                       │
├──────────┬──────────┬──────────┬────────────────┤
│ 技术风险  │ 经济风险  │ 治理风险  │ 操作风险        │
│          │          │          │                │
│ 合约漏洞  │ 闪电贷攻击│ 治理攻击  │ 私钥泄露        │
│ 后门代码  │ 预言机操纵│ 管理员密钥│ 钓鱼攻击        │
│ 逻辑错误  │ MEV 提取 │ 代币集中  │ 授权过度        │
│ 重入攻击  │ 清算级联  │ 提案操纵  │ 假 Token       │
│ 跨链桥漏洞│ 脱锚风险  │ 紧急权限  │ 恶意合约交互     │
└──────────┴──────────┴──────────┴────────────────┘
```

下面我们逐一深入分析最重要的几类风险。

## 智能合约风险

智能合约一旦部署到区块链上就无法修改（除非有升级机制），这意味着代码中的任何漏洞都会成为永久的安全隐患。

### 重入攻击（Reentrancy Attack）

重入攻击是 DeFi 历史上最经典的攻击类型，2016 年 The DAO 事件就是因此导致以太坊硬分叉。

```solidity
// 漏洞代码示意
contract VulnerableVault {
    mapping (address => uint256) public balances;

    function withdraw () external {
        uint256 amount = balances [msg.sender];
        // 先转账（此时攻击者合约的 receive/fallback 被触发）
        (bool success, ) = msg.sender.call {value: amount}("");
        require (success);
        // 后更新余额 —— 但攻击者在上面转账时已经重新调用了 withdraw！
        balances [msg.sender] = 0;  // 太晚了！
    }
}

// 攻击合约
contract Attacker {
    VulnerableVault vault;

    function attack () external payable {
        vault.deposit {value: 1 ether}();
        vault.withdraw ();
    }

    // 在收到 ETH 时被自动触发
    receive () external payable {
        if (address (vault).balance >= 1 ether) {
            vault.withdraw ();  // 再次调用 withdraw！余额还没更新！
        }
    }
}
```

** 防御方式 **：使用 "检查 - 生效 - 交互"（Checks-Effects-Interactions）模式，或使用 OpenZeppelin 的 `ReentrancyGuard`。

### 真实案例：Euler Finance 攻击（2023 年 3 月）

- ** 损失 **：$1.97 亿
- ** 漏洞 **：捐赠函数（donateToReserves）和清算逻辑的交互存在缺陷
- ** 过程 **：攻击者利用闪电贷 + 捐赠功能制造了一个 "坏账" 仓位，然后自己清算这个仓位获利
- ** 结局 **：攻击者在协议团队和社区的谈判压力下，最终归还了所有资金。这是 DeFi 历史上最大的 "归还" 事件

### 后门与特权函数

有些协议在合约中保留了管理员特权函数，比如：

```solidity
// 危险的特权函数示例
contract DangerousToken {
    address public owner;

    // 管理员可以随时铸造任意数量的代币
    function mint (address to, uint256 amount) external {
        require (msg.sender == owner);
        _mint (to, amount);  // 无限印钞机
    }

    // 管理员可以阻止任何人转账
    function pause () external {
        require (msg.sender == owner);
        _paused = true;  // 所有人的资金被锁定
    }

    // 管理员可以修改关键参数
    function setFee (uint256 newFee) external {
        require (msg.sender == owner);
        fee = newFee;  // 可以设成 100%，吞掉所有交易金额
    }
}
```

这些功能在正常情况下用于协议管理，但如果管理员密钥被盗或项目方本身就是恶意的，后果不堪设想。

## 闪电贷攻击案例

闪电贷让攻击者可以在 ** 零成本 ** 的情况下借出数亿美元来操纵市场。

### 案例一：bZx 攻击（2020 年 2 月）

这是 DeFi 历史上第一次引人注目的闪电贷攻击：

```
攻击步骤（简化）：

1. 从 dYdX 闪电贷借出 10,000 ETH
2. 将 5,500 ETH 存入 Compound 作为抵押品
3. 从 Compound 借出 112 WBTC
4. 将 1,300 ETH 存入 bZx Fulcrum 开 5x 做空 ETH/BTC
   → 这个操作通过 Kyber → Uniswap 买入大量 WBTC
   → 推高了 Uniswap 上 WBTC 的价格
5. 在 Uniswap 上卖出之前从 Compound 借来的 112 WBTC
   → 以被操纵的高价卖出，获利
6. 偿还所有闪电贷
7. 利润：约 $350,000（一笔交易！）
```

### 案例二：Pancake Bunny 攻击（2021 年 5 月）

- ** 损失 **：$4,500 万
- ** 手法 **：
  1. 闪电贷借出大量 BNB
  2. 通过 PancakeSwap 操纵 BUNNY/BNB 池的价格
  3. 在被操纵的价格下获取大量 BUNNY
  4. 抛售 BUNNY 获利
  5. 归还闪电贷

### 为什么闪电贷攻击如此有效？

```
传统金融中的价格操纵：
- 需要大量自有资金（数亿美元）
- 操纵持续时间长，容易被监管发现
- 法律风险极高

DeFi 中通过闪电贷：
- 零自有资金需要
- 一笔交易内完成，无法被 "中途阻止"
- 匿名执行，追责困难
- 可以同时跨多个协议操作
```

## 预言机操纵攻击

DeFi 协议需要知道资产的 "外部价格"（如 ETH 的美元价格），而这些价格数据由 ** 预言机（Oracle）** 提供。如果预言机数据被操纵，协议的所有基于价格的计算都会出错。

### 预言机的类型

```
链上预言机（On-chain Oracle）：
  → 直接从 DEX 池子读取价格（如 Uniswap TWAP）
  → 风险：池子可以被操纵（特别是小池子）

链下预言机（Off-chain Oracle）：
  → 从链下数据源获取价格（如 Chainlink）
  → 更安全，但引入了链下信任假设

混合方案：
  → 多数据源聚合 + 异常值过滤
  → Chainlink 使用多个独立节点 + 中位数聚合
```

### 案例：Mango Markets 攻击（2022 年 10 月）

这是 Solana 上最大的 DeFi 攻击之一：

```
攻击步骤：

1. 攻击者 Avraham Eisenberg 用两个账户
2. 账户 A：大量买入 MNGO 永续合约（做多）
3. 账户 B：在现货市场大量买入 MNGO 代币
   → MNGO 现货价格从 $0.03 暴涨到 $0.91（30 倍！）
4. 由于 Mango 使用的预言机跟踪现货价格
   → 账户 A 的做多仓位价值暴涨
   → 账户 A 的 "抵押品"（浮盈）变得巨大
5. 用 "抵押品" 从 Mango Markets 借出 $1.16 亿的各种资产
6. 攻击者带着借出的资产离开
7. MNGO 价格回落，Mango Markets 剩余资金不足以覆盖债务

损失：$1.16 亿
后续：Eisenberg 被 FBI 逮捕，面临商品操纵和欺诈指控
```

### 安全的预言机实践

主流 DeFi 协议现在普遍采用 Chainlink 等去中心化预言机网络：

```
Chainlink 预言机的安全设计：

多节点聚合：     20+ 个独立节点提供价格
中位数计算：     取所有报价的中位数，排除异常值
偏差阈值触发：   价格偏差超过阈值（如 1%）时强制更新
心跳周期：       即使价格不变也定期更新
声誉系统：       节点有质押物，报价异常会被惩罚
```

## 跑路风险：Rug Pull

Rug Pull（"抽地毯"）是指项目方在筹集了大量资金后突然带着资金消失。这是 DeFi 中最常见的欺诈形式。

### 常见的 Rug Pull 类型

**1. 流动性抽取 **

```
过程：
1. 项目方创建新代币 SCAM
2. 在 DEX 上创建 SCAM/ETH 流动性池
3. 通过虚假宣传吸引用户买入 SCAM
4. 代币价格上涨
5. 项目方撤出所有流动性（卖出所有 ETH）
6. SCAM 价格归零，买入者血本无归
```

**2. 铸造无限代币 **

```
过程：
1. 项目方在合约中保留 mint 函数
2. 吸引用户买入代币后
3. 铸造天量新代币
4. 在市场上抛售
5. 价格崩盘
```

**3. 假项目 **

```
过程：
1. 抄袭知名项目的前端和品牌
2. 修改合约地址指向自己的恶意合约
3. 用户以为在使用正规协议，实际上资金被盗
```

### 真实案例：Squid Game Token（2021 年）

- 借势 "鱿鱼游戏" 热度发行代币
- 短短几天从 $0.01 涨到 $2,861
- 合约中设置了 "反抛售" 机制 —— 用户只能买不能卖
- 项目方最终清空流动性，带走约 $340 万
- 代币价格瞬间从 $2,861 跌到 $0

### 红旗信号 checklist

```
以下信号出现越多，项目越可能是 Rug Pull：

🚩 匿名团队，无法验证身份
🚩 合约未开源或未经审计
🚩 代币分配严重集中（前 10 地址持有 >50%）
🚩 流动性未锁定（LP Token 在项目方手中）
🚩 合约中有可疑的特权函数（无限 mint、暂停交易等）
🚩 承诺不切实际的高收益（日化 1%、年化 1000%+）
🚩 营销大于产品（只有 Telegram/Discord 炒作，没有实际产品）
🚩 抄袭其他项目的白皮书和网站
🚩 没有 timelock 或多签来限制管理员权限
🚩 项目突然加速推出，催促用户 "抓紧上车"
```

## 其他常见风险

### MEV（最大可提取价值）

矿工 / 验证者可以通过重新排列交易顺序来获取额外利润。

** 三明治攻击（Sandwich Attack）**：
```
原始交易：用户想用 USDC 买 ETH

攻击者操作：
1. 在用户交易前插入一笔买入 ETH 的交易 → 推高价格
2. 用户的交易以更高的价格成交（支付了更多 USDC）
3. 在用户交易后插入一笔卖出 ETH 的交易 → 攻击者获利

用户损失：多支付的价差
攻击者利润：价差收入 - Gas 费
```

** 防护 **：使用 Flashbots Protect RPC 或设置较低的滑点容忍度。

### 跨链桥风险

跨链桥是 DeFi 中损失最惨重的攻击目标：

| 事件 | 日期 | 损失 |
|------|------|------|
| Ronin Bridge (Axie Infinity) | 2022.03 | $6.25 亿 |
| Wormhole | 2022.02 | $3.26 亿 |
| Nomad | 2022.08 | $1.90 亿 |
| Harmony Horizon | 2022.06 | $1.00 亿 |

跨链桥之所以风险高，是因为它们持有大量锁定资产，而多链验证的复杂性又增加了攻击面。

### 治理攻击

```
攻击思路：
1. 通过闪电贷借出大量治理代币
2. 用借来的投票权通过恶意提案（如转走金库资金）
3. 归还闪电贷

防御：
- 投票权锁定期（借来的代币无法立即投票）
- 提案执行延时（timelock）
- 多签机制
```

## 如何评估 DeFi 协议安全性

在使用任何 DeFi 协议之前，建议做以下尽职调查：

### 安全评估清单

```
1. 审计报告
   □ 是否经过知名安全公司审计？（Trail of Bits, OpenZeppelin,
     Consensys Diligence, Certora, Spearbit）
   □ 审计了几次？最近一次是什么时候？
   □ 审计发现的问题是否已修复？
   □ 审计报告是否公开可下载？

2. 代码质量
   □ 合约代码是否开源并在 Etherscan 上验证？
   □ 代码是否有良好的测试覆盖率？
   □ 是否使用了经过验证的库（如 OpenZeppelin）？

3. 运营安全
   □ 管理员密钥是否使用多签（如 Gnosis Safe）？
   □ 关键操作是否有 timelock（如 48 小时延迟）？
   □ 是否有紧急暂停机制？
   □ 升级机制是否受到适当限制？

4. 经济安全
   □ TVL 有多少？运行了多长时间？
   □ 代币分配是否合理？
   □ 收益来源是什么？是否可持续？
   □ 是否依赖代币激励来维持 TVL？

5. 团队与社区
   □ 团队成员是否公开实名？
   □ 团队成员有什么背景和经验？
   □ 社区是否活跃？开发者是否持续更新？
   □ 是否有 Bug Bounty 计划？

6. 第三方评估
   □ DeFi Safety 评分（defisafety.com）
   □ Rekt.news 是否报道过安全事件
   □ 是否有保险协议覆盖（如 Nexus Mutual）
```

### 实用工具

| 工具 | 用途 | 链接 |
|------|------|------|
| DeFi Safety | 协议安全评分 | defisafety.com |
| DeBank | 查看地址的 DeFi 持仓 | debank.com |
| Etherscan | 合约代码验证和交易追踪 | etherscan.io |
| Token Sniffer | 检测代币合约是否有可疑代码 | tokensniffer.com |
| Revoke.cash | 检查和撤销代币授权 | revoke.cash |
| DeFi Llama | TVL 数据和协议信息 | defillama.com |
| Rekt News | DeFi 攻击事件数据库 | rekt.news |

## 个人安全实践清单

### 资金管理

```
1. 分散资金
   → 不同协议、不同链、不同钱包
   → 大额资金使用硬件钱包
   → "热" 钱包只放日常操作需要的金额

2. 先小额测试
   → 第一次使用新协议时，先用小金额测试完整流程
   → 确认一切正常后再投入更多资金
   → "如果失去这笔钱你不会心痛" 是好的测试金额

3. 设置止损意识
   → DeFi 借贷保持健康因子 > 2
   → LP 仓位定期检查无常损失
   → 设定心理价位和退出策略
```

### 授权管理

```
4. 最小化授权
   → 不要给协议 "无限授权"（Unlimited Approve）
   → 只授权你需要交易的金额
   → 定期用 revoke.cash 检查和撤销不需要的授权

5. 合约交互前检查
   → 使用区块链浏览器确认合约地址正确
   → 不要点击不明链接或扫描不明二维码
   → 签名前仔细阅读交易内容
```

### 信息安全

```
6. 保护私钥
   → 永远不要在线存储助记词
   → 不要截图、不要放在云盘
   → 物理备份（钢板、纸张）存放在安全位置

7. 警惕社工攻击
   → 没有任何正规项目会私信要求你转账
   → 不要下载来路不明的钱包或 DApp
   → Discord/Telegram 中的 "客服"99% 是骗子

8. 使用安全工具
   → 硬件钱包（Ledger, Trezor）用于大额资产
   → 浏览器插件（Wallet Guard, Pocket Universe）用于交易预警
   → 独立的浏览器用于 DeFi 操作
```

### 持续学习

```
9. 关注安全动态
   → 订阅 Rekt.news 了解最新攻击事件
   → 关注安全研究者的推特
   → 加入协议的安全公告频道

10. 了解你使用的协议
    → 阅读文档，理解机制
    → 知道风险点在哪里
    → 了解协议的应急方案
```

## 总结

1. **DeFi 风险是多层次的 **：技术漏洞、经济攻击、治理风险和操作失误都可能导致资金损失，2021-2024 年累计损失超 $100 亿
2. ** 闪电贷和预言机操纵 ** 是最常见的攻击向量，几乎零成本就能发起数亿美元规模的攻击
3. **Rug Pull 仍然是散户最大的威胁 **，学会识别红旗信号是保护自己的第一步
4. ** 评估协议安全性需要系统化方法 **：审计报告、代码质量、运营安全、经济模型和团队背景缺一不可
5. ** 个人安全实践的核心 **：分散资金、小额测试、最小化授权、保护私钥 —— 这些看似简单的习惯能避免绝大多数损失

记住 DeFi 世界的一条金律：**"Not your keys, not your coins"（不是你的密钥，就不是你的资产）。** 但更重要的是：**"DYOR — Do Your Own Research"（做好自己的研究）。**

## 延伸阅读

- [Rekt News - DeFi 攻击事件排行榜](https://rekt.news/leaderboard/)
- [Immunefi - Bug Bounty 平台](https://immunefi.com)
- [DeFi Safety - 协议安全评分](https://defisafety.com)
- [Revoke.cash - 授权管理工具](https://revoke.cash)
- [SlowMist - 区块链安全审计](https://www.slowmist.com)
- [Chainalysis - 加密犯罪报告](https://www.chainalysis.com/crypto-crime-report/)
- [OpenZeppelin - 智能合约安全最佳实践](https://docs.openzeppelin.com/learn/)
