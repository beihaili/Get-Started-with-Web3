# 第20讲：Ordinals与生态创新

![status](https://img.shields.io/badge/状态-已完成-success)
![author](https://img.shields.io/badge/作者-beihaili-blue)
![date](https://img.shields.io/badge/日期-2025--06-orange)
![difficulty](https://img.shields.io/badge/难度-中级-yellow)

> 💡 想象一下，如果每一粒沙子都能刻上独特的标记，成为独一无二的艺术品。比特币Ordinals协议就是这样的魔法，它让比特币网络中的每一聪都能承载数据，变成数字世界的"收藏品"。

## 目录

- [前言](#前言)
- [Ordinals协议基础](#ordinals协议基础)
- [Inscriptions技术详解](#inscriptions技术详解)
- [Taproot脚本路径存储](#taproot脚本路径存储)
- [数字资产应用](#数字资产应用)
- [BRC-20代币标准](#brc-20代币标准)
- [实战演练：创建Inscription](#实战演练创建inscription)
- [常见问题](#常见问题)
- [结语](#结语)

## 前言：为什么要在聪上刻字？

你有没有收藏过硬币？每枚硬币背后都有年份、图案、甚至特殊的纪念意义。有些古币因为历史价值变得非常珍贵。

现在想象一下：如果你能在每一聪（比特币的最小单位）上"刻字"，让它承载图片、文字、甚至小游戏，这些聪是不是也会变得特别？

这就是Ordinals协议的精髓：
- 🎨 **让聪变成画布**：在聪上"铭刻"各种数据
- 🔢 **给聪编号**：每个聪都有独特的身份证
- 💎 **创造稀缺性**：有些聪因为特殊属性变得珍贵
- 🎪 **丰富比特币生态**：从"数字黄金"到"数字收藏品"

### 💡 思考一下
在学习Ordinals之前，先想想：
- 如果你有一聪比特币，你会在上面刻什么？
- 为什么有些邮票比面值贵几千倍？
- 如何在不改变比特币本质的情况下，给它增加新功能？

## Ordinals协议基础

### 🎯 什么是Ordinals？

Ordinals是比特币上的一个创新协议，允许在比特币区块链上创建独特的数字资产。它利用比特币的最小单位"聪"（satoshi）来"铭刻"数据，每个聪都可以携带额外的信息。

### 📝 核心概念

#### 聪（Satoshi）编号

```
比特币总量：21,000,000 BTC
1 BTC = 100,000,000 聪
总聪数：2,100,000,000,000,000 聪

Ordinals为每个聪分配唯一编号：
- 第一个聪：编号 0
- 第二个聪：编号 1
- ...
- 最后一个聪：编号 2,099,999,999,999,999
```

#### 稀有度等级

```
稀有度分类：
- 普通：任何聪
- 不常见：第一个聪（编号0）
- 稀有：每个区块的第一个聪
- 史诗：每个难度调整周期的第一个聪
- 传奇：每个减半周期的第一个聪
- 神话：创世区块的第一个聪
```

### 🔧 技术原理

#### 基本工作流程

```
1. 选择目标聪
2. 创建包含数据的交易
3. 将数据铭刻到该聪上
4. 聪携带数据在区块链上流通
```

#### 数据存储方式

```
传统方法：
- OP_RETURN：80字节限制
- 直接脚本：费用昂贵

Ordinals方法：
- 使用Taproot脚本路径
- 数据存储在witness中
- 更大的数据容量
- 更好的隐私性
```

## Inscriptions技术详解

### 📝 Inscriptions技术详解

#### 基本原理

```
传统比特币交易：
输入 → 输出（转移价值）

Ordinals交易：
输入 → 输出（转移价值 + 铭刻数据）
```

#### 技术实现

Ordinals使用Taproot的脚本路径功能来存储数据：

```json
{
  "vin": [
    {
      "witness": [
        "签名",
        "公钥", 
        "OP_0",
        "OP_IF",
        "OP_PUSHBYTES_3 6f7264",  // "ord"
        "OP_PUSHNUM_1",
        "OP_PUSHBYTES_9 746578742f68746d6c",  // "text/html"
        "OP_0",
        "OP_PUSHDATA2 <HTML数据>",
        "OP_ENDIF"
      ]
    }
  ]
}
```

### 🔧 Taproot脚本路径存储数据详解

#### 1. Taproot的基本结构

Taproot地址有两种花费方式：

```
Taproot地址 = 内部公钥 (Internal Key) + Merkle树根 (Merkle Root)

花费方式：
1. 密钥路径：直接使用内部公钥签名（最常见）
2. 脚本路径：使用脚本条件 + 脚本路径证明
```

#### 2. 脚本路径的工作原理

```
传统P2SH多签：
地址 = Hash(脚本)
花费时：提供脚本 + 签名

Taproot脚本路径：
地址 = Hash(内部公钥 + Merkle树根)
花费时：提供脚本路径证明 + 脚本 + 签名
```

### 🤔 为什么要用Taproot存储数据？

#### 1. 传统方法的局限性

**OP_RETURN方法的问题**：
```
❌ 明显的"数据存储"交易
❌ 80字节限制
❌ 费用较高
❌ 隐私性差（一看就知道是数据存储）
```

**直接写在脚本中的问题**：
```
❌ 脚本大小限制
❌ 费用昂贵
❌ 不够灵活
```

#### 2. Taproot的巧妙解决方案

**核心思想：把数据"藏"在witness中**

```
传统交易结构：
交易 = {
  输入: [签名, 公钥],
  输出: [地址, 金额]
}

Taproot交易结构：
交易 = {
  输入: [简化的引用],
  输出: [地址, 金额],
  witness: [签名, 公钥, 脚本路径证明, 数据脚本]  ← 数据藏在这里！
}
```

#### 3. 为什么这样设计更好？

| 方法 | 费用 | 隐私性 | 数据大小 | 灵活性 |
|------|------|--------|----------|--------|
| OP_RETURN | 高 | 差 | 80字节 | 低 |
| 直接脚本 | 很高 | 差 | 有限 | 低 |
| **Taproot** | **低** | **好** | **大** | **高** |

### 🌳 Merkle根的作用详解

#### 1. 什么是Merkle根？

想象一个**文件柜系统**：

```
文件柜 = 多个抽屉
每个抽屉 = 多个文件夹
每个文件夹 = 多个文件

Merkle根 = 整个文件柜的"目录索引"
```

#### 2. 为什么需要Merkle根？

**问题**：如何在不暴露所有脚本的情况下，证明某个脚本是有效的？

**解决方案**：Merkle树

```
传统方法（暴露所有脚本）：
地址 = Hash(脚本1 + 脚本2 + 脚本3 + ...)
问题：需要提供所有脚本，数据量大

Merkle树方法（只暴露需要的脚本）：
地址 = Hash(内部公钥 + Merkle根)
花费时：只提供需要的脚本 + 路径证明
```

#### 3. Merkle树的工作原理

**简单类比**：

```
假设你有4个文件：A, B, C, D

传统方法：
Hash(A + B + C + D) = 根哈希
需要提供：A, B, C, D（全部文件）

Merkle树方法：
Level 2: Hash(A+B), Hash(C+D)
Level 1: Hash(Hash(A+B) + Hash(C+D)) = 根哈希
需要提供：A + 路径证明（证明A在树中）
```

#### 4. 实际应用场景

**场景1：只使用脚本1**
```javascript
// 花费时只需要提供：
witness = [
    signature,
    internalKey,
    "script1",           // 实际脚本
    "Hash34",           // 路径证明（证明script1在左子树）
    "Hash12"            // 路径证明（证明script1在右子树）
]
```

**场景2：只使用脚本3**
```javascript
// 花费时只需要提供：
witness = [
    signature,
    internalKey, 
    "script3",           // 实际脚本
    "Hash12",           // 路径证明（证明script3在右子树）
    "Hash34"            // 路径证明（证明script3在左子树）
]
```

### 🎯 为什么这样设计更高效？

#### 1. 数据大小对比

```
传统方法（暴露所有脚本）：
地址 = Hash(脚本1 + 脚本2 + 脚本3 + 脚本4)
witness大小 = 脚本1 + 脚本2 + 脚本3 + 脚本4 = 4个脚本

Merkle树方法：
地址 = Hash(内部公钥 + Merkle根)
witness大小 = 脚本1 + 2个哈希值 = 1个脚本 + 2个哈希
```

#### 2. 隐私性对比

```
传统方法：
- 地址暴露了所有可能的脚本
- 任何人都知道你有4个脚本

Merkle树方法：
- 地址只暴露Merkle根
- 花费时只暴露实际使用的脚本
- 其他脚本保持隐私
```

#### 3. 费用对比

```
传统方法：
费用 = (脚本1 + 脚本2 + 脚本3 + 脚本4) × 费率

Merkle树方法：
费用 = (脚本1 + 2个哈希) × 费率
```

## 数字资产应用

### 🎨 数字艺术

#### NFT特性

```
Ordinals NFT特点：
✅ 真正的去中心化
✅ 数据永久存储在比特币区块链上
✅ 不可篡改
✅ 稀缺性保证
```

#### 艺术创作示例

```
艺术家可以：
1. 创建数字艺术作品
2. 选择特定的聪进行铭刻
3. 作品永久保存在比特币区块链上
4. 通过聪的转移进行交易
```

### 🏷️ 域名系统

#### .sats域名

```
.sats域名特点：
- 基于Ordinals协议
- 使用Taproot存储域名数据
- 支持子域名
- 可转让和交易
```

#### 域名应用

```
应用场景：
- 个人品牌
- 企业标识
- 数字身份
- 去中心化网站
```

### 📄 文档存储

#### 存在性证明

```
使用场景：
- 版权证明
- 时间戳服务
- 文档认证
- 法律文件存储
```

#### 技术优势

```
优势：
✅ 永久存储
✅ 不可篡改
✅ 时间戳证明
✅ 去中心化验证
```

## BRC-20代币标准

### 🪙 什么是BRC-20？

BRC-20是基于Ordinals协议的同质化代币标准，类似于以太坊的ERC-20标准。

#### 基本概念

```
BRC-20特点：
- 基于Ordinals协议
- 使用JSON格式定义代币
- 支持铸造、转移、授权操作
- 完全去中心化
```

#### 代币操作

```
主要操作：
1. Deploy：部署代币合约
2. Mint：铸造代币
3. Transfer：转移代币
4. Approve：授权操作
```

### 🔧 技术实现

#### 部署代币

```json
{
  "p": "brc-20",
  "op": "deploy",
  "tick": "PEPE",
  "max": "21000000",
  "lim": "1000"
}
```

**参数说明**：
- `p`: 协议标识（brc-20）
- `op`: 操作类型（deploy）
- `tick`: 代币符号
- `max`: 最大供应量
- `lim`: 单次铸造限制

#### 铸造代币

```json
{
  "p": "brc-20",
  "op": "mint",
  "tick": "PEPE",
  "amt": "1000"
}
```

**参数说明**：
- `op`: 操作类型（mint）
- `tick`: 代币符号
- `amt`: 铸造数量

#### 转移代币

```json
{
  "p": "brc-20",
  "op": "transfer",
  "tick": "PEPE",
  "amt": "100"
}
```

**参数说明**：
- `op`: 操作类型（transfer）
- `tick`: 代币符号
- `amt`: 转移数量

### 📊 市场影响

#### 成功案例

```
知名BRC-20代币：
- PEPE：迷因币代表
- ORDI：Ordinals生态代币
- MEME：社区代币
- BONK：狗狗币风格代币
```

#### 技术优势

```
BRC-20优势：
✅ 基于比特币安全性
✅ 完全去中心化
✅ 无需智能合约
✅ 低费用
```

## 实战演练：创建Inscription

### 🛠️ 环境准备

#### 安装Ordinals客户端

```bash
# 克隆Ordinals项目
git clone https://github.com/ordinals/ord.git
cd ord

# 编译安装
cargo build --release

# 安装到系统路径
sudo cp target/release/ord /usr/local/bin/
```

#### 配置Bitcoin Core

```bash
# 确保Bitcoin Core支持Taproot
# 在bitcoin.conf中添加：
txindex=1
server=1
rpcuser=your_username
rpcpassword=your_password
```

### 📝 创建文本Inscription

#### 创建文本文件

```bash
# 创建要铭刻的文本
echo "Hello Bitcoin! This is my first inscription." > inscription.txt
```

#### 铭刻到聪上

```bash
# 创建Inscription
ord wallet inscribe inscription.txt --fee-rate 5

# 输出示例：
# {
#   "inscriptions": [
#     {
#       "inscription_id": "abc123...",
#       "inscription_number": 12345,
#       "sat": 123456789
#     }
#   ]
# }
```

### 🖼️ 创建图片Inscription

#### 准备图片文件

```bash
# 支持的格式：PNG, JPEG, GIF, WebP
# 建议大小：小于4MB
cp my_image.png inscription_image.png
```

#### 铭刻图片

```bash
# 铭刻图片
ord wallet inscribe inscription_image.png --fee-rate 5

# 查看铭刻结果
ord wallet inscriptions
```

### 🔗 创建HTML Inscription

#### 创建HTML文件

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Bitcoin Inscription</title>
    <style>
        body { 
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Hello Bitcoin!</h1>
        <p>This is my first HTML inscription on Bitcoin blockchain.</p>
        <p>Created with ❤️ using Ordinals protocol</p>
    </div>
</body>
</html>
```

#### 铭刻HTML

```bash
# 保存为HTML文件
cat > inscription.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>My Bitcoin Inscription</title>
    <style>
        body { 
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            font-family: Arial, sans-serif;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Hello Bitcoin!</h1>
        <p>This is my first HTML inscription on Bitcoin blockchain.</p>
        <p>Created with ❤️ using Ordinals protocol</p>
    </div>
</body>
</html>
EOF

# 铭刻HTML
ord wallet inscribe inscription.html --fee-rate 5
```

### 🪙 创建BRC-20代币

#### 部署代币

```bash
# 创建部署JSON
cat > deploy.json << 'EOF'
{
  "p": "brc-20",
  "op": "deploy",
  "tick": "MYTOKEN",
  "max": "1000000",
  "lim": "100"
}
EOF

# 铭刻部署交易
ord wallet inscribe deploy.json --fee-rate 5
```

#### 铸造代币

```bash
# 创建铸造JSON
cat > mint.json << 'EOF'
{
  "p": "brc-20",
  "op": "mint",
  "tick": "MYTOKEN",
  "amt": "100"
}
EOF

# 铭刻铸造交易
ord wallet inscribe mint.json --fee-rate 5
```

### 🔍 查看和管理Inscription

#### 查看钱包中的Inscription

```bash
# 列出所有Inscription
ord wallet inscriptions

# 查看特定Inscription详情
ord wallet inscription <inscription_id>
```

#### 转移Inscription

```bash
# 转移Inscription到新地址
ord wallet send <address> <inscription_id>
```

#### 查看Inscription内容

```bash
# 在浏览器中查看
# 访问：https://ordinals.com/inscription/<inscription_id>

# 或者使用命令行
ord wallet inscription <inscription_id> --output -
```

## 常见问题

### ❓ Ordinals是否改变了比特币的本质？

**答案**：没有！

```
Ordinals特点：
✅ 不改变比特币共识规则
✅ 不增加新的操作码
✅ 只是数据存储方式
✅ 完全兼容现有网络
```

### ❓ Inscription和NFT有什么区别？

```
Inscription vs NFT：

Inscription：
- 数据直接存储在比特币区块链上
- 真正的去中心化
- 不可篡改
- 基于聪的编号系统

传统NFT：
- 数据通常存储在IPFS或其他地方
- 依赖智能合约
- 可能被修改
- 基于代币ID
```

### ❓ BRC-20代币是否安全？

```
安全性分析：
✅ 基于比特币安全性
✅ 无需智能合约
✅ 代码简单透明
✅ 社区验证

注意事项：
⚠️ 新标准，仍在发展中
⚠️ 需要谨慎选择项目
⚠️ 价格波动风险
```

### ❓ 如何选择合适的聪进行铭刻？

```
选择策略：
1. 普通聪：费用最低
2. 稀有聪：收藏价值高
3. 特殊编号：个人意义
4. 区块高度：纪念意义
```

### ❓ Inscription的费用如何计算？

```
费用组成：
- 基础交易费用
- 数据存储费用
- 网络拥堵费用

影响因素：
- 数据大小
- 网络拥堵程度
- 优先级设置
```

### ❓ 如何保护Inscription安全？

```
安全建议：
1. 使用硬件钱包
2. 备份私钥
3. 验证交易
4. 使用可信工具
5. 定期检查余额
```

## 结语

通过本章的学习，你已经深入了解了Ordinals协议和Inscriptions技术的核心价值：

- **技术原理**：理解了如何利用Taproot技术存储数据
- **应用场景**：掌握了数字艺术、域名、文档存储等应用
- **BRC-20标准**：认识了比特币上的代币标准
- **实战操作**：学会了创建和管理Inscription的方法

Ordinals技术为比特币开辟了新的应用领域，让比特币不仅是一个支付网络，更成为了一个数字资产平台。它展示了比特币技术的灵活性和创新潜力。

> 🌟 **Ordinals的意义**：Ordinals技术体现了比特币社区的创新精神，在保持比特币核心价值的同时，为其开辟了新的应用可能性，让比特币真正成为了数字资产的基石。

---

<div align="center">
<a href="https://github.com/beihaili/Get-Started-with-Web3">🏠 返回主页</a> | 
<a href="https://twitter.com/bhbtc1337">🐦 关注作者</a> | 
<a href="https://forms.gle/QMBwL6LwZyQew1tX8">📝 加入交流群</a>
</div>