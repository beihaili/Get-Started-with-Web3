/**
 * 测验题库数据
 * 覆盖全部 36 课 × 5 题 = 180 题 + 5 默认题 = 185 题
 */

export const QUIZ_BANK = {
  '1-1': [
    // 创建第一个 Web3 身份
    {
      question: '什么是Web3钱包的最重要特征？',
      options: [
        '由中心化公司托管私钥',
        '用户完全控制自己的私钥',
        '需要银行账户验证',
        '只能存储比特币',
      ],
      correctAnswer: 1,
      explanation: 'Web3钱包的核心特征是用户拥有并控制自己的私钥，这体现了去中心化的本质。',
    },
    {
      question: '助记词（Seed Phrase）的主要作用是什么？',
      options: ['用来设置密码', '恢复和备份钱包', '加密交易数据', '验证身份信息'],
      correctAnswer: 1,
      explanation: '助记词是钱包的主密钥，可以用来恢复钱包中的所有账户和资产。',
    },
    {
      question: '在创建Web3身份时，以下哪个做法是最安全的？',
      options: [
        '将助记词截图保存在手机',
        '把助记词写在纸上离线保存',
        '用邮件发送给自己',
        '保存在云盘中',
      ],
      correctAnswer: 1,
      explanation: '助记词应该离线保存，写在纸上是最安全的方式，避免网络攻击和设备丢失的风险。',
    },
    {
      question: '标准的 BIP-39 助记词通常由多少个单词组成？',
      options: ['6 个', '12 个或 24 个', '8 个', '32 个'],
      correctAnswer: 1,
      explanation:
        'BIP-39 标准助记词通常为 12 个或 24 个英文单词，从 2048 个单词的词表中生成，提供足够的安全性。',
    },
    {
      question: '以下哪个不是常见的 Web3 钱包？',
      options: ['MetaMask', 'Phantom', '支付宝', 'Trust Wallet'],
      correctAnswer: 2,
      explanation:
        '支付宝是传统中心化支付工具，不是 Web3 钱包。MetaMask、Phantom 和 Trust Wallet 都是流行的去中心化钱包。',
    },
  ],
  '1-2': [
    // 体验第一笔交易
    {
      question: '在进行Web3交易时，Gas费的作用是什么？',
      options: ['交易手续费', '钱包维护费', '网络会员费', '身份验证费'],
      correctAnswer: 0,
      explanation: 'Gas费是支付给矿工/验证者的交易手续费，用于激励他们处理和确认交易。',
    },
    {
      question: '什么情况下Web3交易可能会失败？',
      options: ['Gas费设置过低', '网络拥堵', '智能合约执行失败', '以上都有可能'],
      correctAnswer: 3,
      explanation: 'Gas费不足、网络拥堵、合约错误等都可能导致交易失败，这是区块链的特性。',
    },
    {
      question: '交易确认通常需要多长时间？',
      options: ['立即完成', '几分钟到几小时不等', '总是24小时', '1秒钟'],
      correctAnswer: 1,
      explanation: '交易确认时间取决于网络拥堵程度和Gas费设置，通常从几分钟到几小时不等。',
    },
    {
      question: '以太坊交易中的 Nonce 值代表什么？',
      options: ['交易金额', '该地址发送交易的序号', 'Gas 费上限', '区块编号'],
      correctAnswer: 1,
      explanation:
        'Nonce 是该地址发送交易的计数器，从 0 开始递增，用于防止重放攻击并确保交易按顺序执行。',
    },
    {
      question: '区块链交易一旦被确认后，以下哪项描述是正确的？',
      options: [
        '可以联系客服撤销',
        '只要支付额外费用就能取消',
        '无法被撤销或修改',
        '等待 24 小时后可以回滚',
      ],
      correctAnswer: 2,
      explanation:
        '区块链交易一旦被确认就不可逆转，这是区块链不可篡改性的体现，因此发送前务必仔细核实地址和金额。',
    },
  ],
  '1-3': [
    // 体验第一个 DApp
    {
      question: 'DApp的全称是什么？',
      options: [
        'Digital Application',
        'Decentralized Application',
        'Data Application',
        'Dynamic Application',
      ],
      correctAnswer: 1,
      explanation: 'DApp代表去中心化应用(Decentralized Application)，运行在区块链网络上。',
    },
    {
      question: 'DApp与传统App的主要区别是什么？',
      options: ['DApp更快', 'DApp不需要网络', 'DApp运行在区块链上', 'DApp更便宜'],
      correctAnswer: 2,
      explanation: 'DApp的核心特点是运行在区块链网络上，具有去中心化、不可篡改等特性。',
    },
    {
      question: '使用DApp时为什么需要连接钱包？',
      options: ['支付开发者', '证明身份和授权交易', '下载应用', '获取网络权限'],
      correctAnswer: 1,
      explanation: '连接钱包可以证明用户身份，并授权DApp代表用户执行区块链交易。',
    },
    {
      question: '以下哪个是 DApp 的典型应用场景？',
      options: ['传统银行转账', '去中心化交易所（DEX）和借贷协议', '安装操作系统', '编辑本地文档'],
      correctAnswer: 1,
      explanation:
        'DEX 和借贷协议是 DApp 最常见的应用场景，它们通过智能合约实现无需中介的金融服务。',
    },
    {
      question: '连接 DApp 时给予"无限授权"可能带来什么风险？',
      options: [
        '降低交易速度',
        '增加 Gas 费',
        '恶意合约可以转走你授权的所有代币',
        '导致钱包地址泄露',
      ],
      correctAnswer: 2,
      explanation:
        '无限授权意味着智能合约可以无限额转走你授权的代币，如果合约存在漏洞或是恶意的，资产可能被盗。',
    },
  ],
  '1-4': [
    // 常用 Web3 网站
    {
      question: '区块链浏览器的主要功能是什么？',
      options: ['浏览网页', '查看链上交易、地址和区块信息', '下载区块链软件', '购买加密货币'],
      correctAnswer: 1,
      explanation: '区块链浏览器是查看链上数据的工具，可以查询交易记录、地址余额和区块详情。',
    },
    {
      question: '为什么建议同时使用多个加密货币行情网站？',
      options: ['价格更便宜', '交叉验证数据准确性', '可以获得空投', '注册有优惠'],
      correctAnswer: 1,
      explanation: '不同网站的数据来源和更新速度不同，交叉验证能获得更准确的市场信息。',
    },
    {
      question: 'DefiLlama 主要提供什么类型的数据？',
      options: ['社交媒体分析', 'DeFi 协议的 TVL（总锁仓量）数据', 'NFT 交易记录', '矿池算力分布'],
      correctAnswer: 1,
      explanation: 'DefiLlama 是 DeFi 领域的重要数据平台，主要提供各协议的 TVL 和收益信息。',
    },
    {
      question: 'Etherscan 是哪条区块链的浏览器？',
      options: ['比特币', '以太坊', 'Solana', 'Cosmos'],
      correctAnswer: 1,
      explanation:
        'Etherscan 是以太坊上最常用的区块链浏览器，可以查看交易详情、合约代码和地址余额等信息。',
    },
    {
      question: 'CoinMarketCap 和 CoinGecko 网站的主要用途是什么？',
      options: [
        '发行新代币',
        '查看加密货币市值、价格和交易量等市场数据',
        '管理私钥',
        '运行挖矿程序',
      ],
      correctAnswer: 1,
      explanation:
        'CoinMarketCap 和 CoinGecko 是最流行的加密市场数据网站，提供各种加密货币的实时价格、市值排名和交易量数据。',
    },
  ],
  '1-5': [
    // 发行你的第一个代币
    {
      question: '在 Pump.fun 上发行代币最少需要多少 SOL？',
      options: ['1 SOL', '0.02 SOL', '10 SOL', '0.5 SOL'],
      correctAnswer: 1,
      explanation: '在 Pump.fun 上发行代币的费用仅需约 0.02 SOL，极大降低了发币门槛。',
    },
    {
      question: 'Pump.fun 平台使用什么机制管理代币流动性？',
      options: ['订单簿撮合', '自动债券曲线（Bonding Curve）', '中心化做市商', '人工定价'],
      correctAnswer: 1,
      explanation: 'Pump.fun 使用自动债券曲线管理流动性，买入量增加价格上升，卖出量增加价格下降。',
    },
    {
      question: '代币发行后，以下哪项信息无法修改？',
      options: ['社交媒体链接', '代币名称和符号', '社区评论', '代币描述的外部链接'],
      correctAnswer: 1,
      explanation: '代币的基本信息（名称和符号）在链上发行后不可更改，这是区块链不可篡改性的体现。',
    },
    {
      question: '债券曲线（Bonding Curve）的价格特征是什么？',
      options: [
        '价格始终固定不变',
        '买入越多价格越高，卖出越多价格越低',
        '价格完全随机波动',
        '只能上涨不能下跌',
      ],
      correctAnswer: 1,
      explanation:
        '债券曲线是一种数学定价模型，代币价格随供应量变化：买入增多价格上升，卖出增多价格下降。',
    },
    {
      question: '在 Pump.fun 上发行代币时，最重要的安全注意事项是什么？',
      options: [
        '选择好看的代币图标',
        '了解智能合约风险和代币归零的可能性',
        '尽量多买自己发行的代币',
        '在社交媒体上大力推广',
      ],
      correctAnswer: 1,
      explanation:
        '发行和购买代币存在极高风险，大部分代币可能归零，参与前必须了解智能合约风险并只投入能承受损失的金额。',
    },
  ],
  '1-6': [
    // Web3 安全基础
    {
      question: 'Web3 安全与传统互联网安全的最大区别是什么？',
      options: ['Web3 更安全', '交易不可逆且没有中央机构保护', '不需要密码', '黑客更少'],
      correctAnswer: 1,
      explanation:
        'Web3 交易一旦确认无法撤销，且没有银行等中央机构帮你追回损失，安全完全由自己负责。',
    },
    {
      question: '以下哪个工具可以用来检查和撤销代币授权？',
      options: ['MetaMask', 'Revoke.cash', 'Etherscan', 'CoinMarketCap'],
      correctAnswer: 1,
      explanation: 'Revoke.cash 是专门用于查看和撤销代币授权的安全工具，建议定期检查。',
    },
    {
      question: '钱包分级管理策略中，大额资产应该存放在哪里？',
      options: ['交易所账户', '浏览器插件钱包', '冷钱包（离线存储）', '手机热钱包'],
      correctAnswer: 2,
      explanation: '大额资产应使用冷钱包离线存储，安全等级最高，避免网络攻击风险。',
    },
    {
      question: '以下哪种是常见的 Web3 钓鱼攻击方式？',
      options: [
        '通过电话推销加密货币',
        '伪造知名项目官网诱骗用户签署恶意交易',
        '在交易所内部攻击',
        '破解区块链网络',
      ],
      correctAnswer: 1,
      explanation:
        '钓鱼攻击通常伪造与知名项目极其相似的网站，诱骗用户连接钱包并签署恶意交易，从而转走用户资产。',
    },
    {
      question: '在签署区块链交易前，最重要的安全习惯是什么？',
      options: [
        '检查网络是否畅通',
        '仔细阅读交易内容，确认授权范围和目标地址',
        '确保 Gas 费最低',
        '使用 VPN 连接',
      ],
      correctAnswer: 1,
      explanation:
        '签署交易前务必仔细核对交易内容和授权范围，盲目签名是 Web3 中最常见的资产丢失原因之一。',
    },
  ],
  '1-7': [
    // Web3 交易所入门
    {
      question: 'CEX（中心化交易所）与 DEX（去中心化交易所）的核心区别是什么？',
      options: [
        'CEX 手续费更高',
        'CEX 由公司运营并托管用户资产，DEX 通过智能合约实现无托管交易',
        'DEX 只能交易比特币',
        'CEX 不需要注册账户',
      ],
      correctAnswer: 1,
      explanation:
        'CEX 由中心化公司运营，用户将资产托管给交易所；DEX 通过智能合约运行，用户始终控制自己的资产。',
    },
    {
      question: '在交易所充值加密货币时，最重要的注意事项是什么？',
      options: [
        '选择手续费最低的网络',
        '确保充值地址和网络（链）都选择正确',
        '尽量一次性充值大额',
        '只在白天操作',
      ],
      correctAnswer: 1,
      explanation:
        '充值时必须确认地址和网络都正确，选错网络（如将 ERC-20 代币发到 TRC-20 地址）可能导致资产永久丢失。',
    },
    {
      question: '以下哪项不是交易所账户安全的推荐做法？',
      options: [
        '启用 Google Authenticator 两步验证（2FA）',
        '设置提币地址白名单',
        '将所有资产长期存放在交易所',
        '使用独立的邮箱注册交易所账户',
      ],
      correctAnswer: 2,
      explanation:
        '交易所可能被黑客攻击或出现运营风险，大额资产应转移到自己控制私钥的钱包中，"Not your keys, not your coins"。',
    },
    {
      question: 'KYC（Know Your Customer）在交易所中指的是什么？',
      options: [
        '一种加密货币名称',
        '交易所要求用户完成身份认证的流程',
        '一种交易策略',
        '钱包的安全等级',
      ],
      correctAnswer: 1,
      explanation:
        'KYC 即"了解你的客户"，是中心化交易所为遵守反洗钱法规要求用户提交身份证明的认证流程。',
    },
    {
      question: '限价单和市价单的主要区别是什么？',
      options: [
        '限价单手续费更高',
        '限价单指定成交价格，市价单以当前最优价格立即成交',
        '市价单无法执行',
        '两者没有区别',
      ],
      correctAnswer: 1,
      explanation:
        '限价单让你设定期望的买入或卖出价格，只在达到该价格时成交；市价单则以当前市场最优价格立即成交。',
    },
  ],
  '2-1': [
    // 密码学基础
    {
      question: 'SHA-256算法的主要特点是什么？',
      options: ['可逆加密', '单向哈希函数', '对称加密', '私钥生成'],
      correctAnswer: 1,
      explanation: 'SHA-256是单向哈希函数，输入任意数据都产生固定长度的哈希值，且不可逆。',
    },
    {
      question: '在比特币中，公钥和私钥的关系是？',
      options: ['公钥是私钥的两倍', '公钥由私钥生成', '私钥由公钥生成', '两者无关'],
      correctAnswer: 1,
      explanation: '在椭圆曲线加密中，公钥是通过私钥和椭圆曲线运算生成的，私钥是随机数。',
    },
    {
      question: '数字签名的作用是什么？',
      options: ['加密数据', '证明身份和防篡改', '生成地址', '挖矿算法'],
      correctAnswer: 1,
      explanation: '数字签名用于证明消息来自私钥持有者，并确保消息在传输中未被篡改。',
    },
    {
      question: '比特币使用的椭圆曲线算法名称是什么？',
      options: ['RSA-2048', 'secp256k1', 'Ed25519', 'AES-256'],
      correctAnswer: 1,
      explanation:
        '比特币使用 secp256k1 椭圆曲线进行公钥密码学运算，该曲线在安全性和计算效率之间取得了平衡。',
    },
    {
      question: '哈希函数的"雪崩效应"指的是什么？',
      options: [
        '输入不变输出也不变',
        '输入的微小变化会导致输出完全不同',
        '输出长度随输入增大',
        '多个输入产生相同输出',
      ],
      correctAnswer: 1,
      explanation:
        '雪崩效应是指输入哪怕只改变一个比特，哈希输出也会发生巨大变化，这保证了哈希函数的安全性。',
    },
  ],
  '2-2': [
    // 比特币概览
    {
      question: '比特币的总供应量是多少？',
      options: ['2100万枚', '1亿枚', '无限制', '5000万枚'],
      correctAnswer: 0,
      explanation: '比特币的总供应量被硬编码为2100万枚，这是通过减半机制实现的稀缺性。',
    },
    {
      question: '比特币网络大约多久产生一个新区块？',
      options: ['1分钟', '10分钟', '1小时', '24小时'],
      correctAnswer: 1,
      explanation: '比特币网络的目标是每10分钟产生一个新区块，通过难度调整来维持这个时间。',
    },
    {
      question: '比特币使用的共识机制是什么？',
      options: ['权益证明(PoS)', '工作量证明(PoW)', '委托权益证明(DPoS)', '权威证明(PoA)'],
      correctAnswer: 1,
      explanation: '比特币使用工作量证明(PoW)共识机制，矿工需要解决数学难题来获得记账权。',
    },
    {
      question: '比特币白皮书的作者署名是什么？',
      options: ['Vitalik Buterin', '中本聪（Satoshi Nakamoto）', 'Hal Finney', 'Nick Szabo'],
      correctAnswer: 1,
      explanation:
        '比特币白皮书《Bitcoin: A Peer-to-Peer Electronic Cash System》由中本聪于 2008 年发表，其真实身份至今未知。',
    },
    {
      question: '比特币区块奖励减半大约每几年发生一次？',
      options: ['每 1 年', '每 2 年', '每 4 年', '每 10 年'],
      correctAnswer: 2,
      explanation:
        '比特币每 210,000 个区块（约 4 年）进行一次区块奖励减半，从最初的 50 BTC 逐步减少。',
    },
  ],
  '2-3': [
    // 比特币交易结构
    {
      question: '比特币使用什么模型来追踪余额？',
      options: ['账户余额模型', 'UTXO（未花费交易输出）模型', '数据库记录模型', '智能合约状态模型'],
      correctAnswer: 1,
      explanation: 'UTXO 模型类似于现金系统，每笔交易消耗旧的 UTXO 并创建新的 UTXO。',
    },
    {
      question: '1 BTC 等于多少聪（satoshi）？',
      options: ['1000 聪', '100 万聪', '1 亿聪', '10 亿聪'],
      correctAnswer: 2,
      explanation: '聪是比特币的最小单位，1 BTC = 100,000,000 聪（1亿聪）。',
    },
    {
      question: '比特币交易验证的四层检查不包括以下哪项？',
      options: ['格式验证', 'UTXO 存在性检查', '用户身份证验证', '脚本验证（密码学证明）'],
      correctAnswer: 2,
      explanation: '比特币是无许可系统，不需要身份证验证，而是通过密码学签名验证所有权。',
    },
    {
      question: 'UTXO 模型与账户余额模型相比有什么优势？',
      options: ['更容易理解', '支持并行验证交易且隐私性更好', '存储空间更小', '交易速度更快'],
      correctAnswer: 1,
      explanation:
        'UTXO 模型中每笔交易独立验证，天然支持并行处理；且每次交易可使用新地址，增强了隐私性。',
    },
    {
      question: '比特币交易中的"找零"是什么意思？',
      options: [
        '退回多余的手续费',
        '将 UTXO 中超出支付金额的部分返回到自己的新地址',
        '交易所退款',
        '矿工返还的奖励',
      ],
      correctAnswer: 1,
      explanation:
        '由于 UTXO 必须整体花费，如果 UTXO 金额大于需要支付的金额，多余部分会作为找零发送到自己控制的新地址。',
    },
  ],
  '2-4': [
    // 多重签名
    {
      question: '2-of-3 多重签名的含义是什么？',
      options: [
        '需要 2 个区块确认和 3 个节点验证',
        '3 个私钥持有者中需要 2 个签名才能花费资金',
        '交易需要 2 到 3 分钟确认',
        '需要支付 2/3 的手续费',
      ],
      correctAnswer: 1,
      explanation:
        'M-of-N 多重签名中，M 表示所需签名数，N 表示总私钥数，2-of-3 即 3 人中需 2 人签名。',
    },
    {
      question: '比特币多重签名交易中为什么需要 OP_0？',
      options: [
        '用于加密数据',
        '这是 OP_CHECKMULTISIG 的一个历史 Bug 导致的',
        '用于标记交易版本',
        '用于计算手续费',
      ],
      correctAnswer: 1,
      explanation: 'OP_CHECKMULTISIG 存在一个历史 Bug，会多弹出一个栈元素，因此需要 OP_0 占位。',
    },
    {
      question: 'P2SH 多重签名地址以什么字符开头？',
      options: ['1', '3', 'bc1q', 'bc1p'],
      correctAnswer: 1,
      explanation: 'P2SH（Pay-to-Script-Hash）地址以 3 开头，它将复杂的多签脚本隐藏在哈希中。',
    },
    {
      question: '多重签名技术最常见的应用场景是什么？',
      options: ['加速交易确认', '企业资金管理和安全托管', '降低交易手续费', '增加匿名性'],
      correctAnswer: 1,
      explanation:
        '多重签名广泛用于企业资金管理（如 3-of-5 签名保护公司金库）、安全托管和联合账户等场景。',
    },
    {
      question: '比特币标准多重签名最多支持多少个公钥？',
      options: ['3 个', '7 个', '15 个', '无限制'],
      correctAnswer: 2,
      explanation:
        '比特币标准多重签名最多支持 15 个公钥（15-of-15），这是由 OP_CHECKMULTISIG 的脚本大小限制决定的。',
    },
  ],
  '2-5': [
    // 隔离见证
    {
      question: '隔离见证（SegWit）主要解决了比特币的什么问题？',
      options: ['私钥安全性', '交易延展性和区块容量', '挖矿难度', '节点同步速度'],
      correctAnswer: 1,
      explanation: 'SegWit 将签名数据（见证）分离出来，解决了交易延展性问题并提高了区块有效容量。',
    },
    {
      question: 'SegWit 升级后区块的最大权重限制是多少？',
      options: ['1 MB', '2 MB', '4,000,000 权重单位', '8 MB'],
      correctAnswer: 2,
      explanation:
        'SegWit 引入了权重概念，区块最大 4,000,000 权重单位，基础数据占 4 单位/字节，见证数据占 1 单位/字节。',
    },
    {
      question: '原生 SegWit 地址使用什么编码格式？',
      options: ['Base58', 'Bech32', 'Hex', 'Base64'],
      correctAnswer: 1,
      explanation: '原生 SegWit 地址（bc1q 开头）使用 Bech32 编码，比 Base58 更高效且不易出错。',
    },
    {
      question: '交易延展性（Transaction Malleability）问题指的是什么？',
      options: [
        '交易金额可以被篡改',
        '交易 ID 可以在不改变交易内容的情况下被修改',
        '交易可以被取消',
        '交易地址可以被伪造',
      ],
      correctAnswer: 1,
      explanation:
        '交易延展性指签名数据的轻微修改会导致交易哈希（TXID）改变，而交易实际内容不变，SegWit 通过分离签名数据解决了此问题。',
    },
    {
      question: 'SegWit 升级是通过什么方式激活的？',
      options: ['硬分叉', '软分叉（向后兼容）', '中心化决定', '全网投票'],
      correctAnswer: 1,
      explanation:
        'SegWit 是通过软分叉激活的，向后兼容意味着未升级的旧节点仍然可以验证 SegWit 交易。',
    },
  ],
  '2-6': [
    // Taproot 升级
    {
      question: 'Schnorr 签名相比 ECDSA 签名的主要优势是什么？',
      options: [
        '更长的密钥',
        '支持签名聚合，多个签名合并为一个',
        '需要更多计算资源',
        '只支持单签名',
      ],
      correctAnswer: 1,
      explanation:
        'Schnorr 签名支持签名聚合，多方签名可以合并为一个 64 字节签名，节省空间并保护隐私。',
    },
    {
      question: 'Taproot 升级在哪一年正式激活？',
      options: ['2017 年', '2019 年', '2021 年', '2023 年'],
      correctAnswer: 2,
      explanation: 'Taproot 于 2021 年 11 月在区块高度 709,632 正式激活，通过 Speedy Trial 机制。',
    },
    {
      question: 'MAST（默克尔化抽象语法树）的主要作用是什么？',
      options: ['加快交易确认', '隐藏未使用的脚本条件以保护隐私', '增加区块大小', '降低挖矿难度'],
      correctAnswer: 1,
      explanation: 'MAST 将脚本条件组织成默克尔树，只需揭示实际执行的路径，保护了其他条件的隐私。',
    },
    {
      question: 'Taproot 地址以什么字符开头？',
      options: ['1', '3', 'bc1q', 'bc1p'],
      correctAnswer: 3,
      explanation:
        'Taproot 地址以 bc1p 开头，使用 Bech32m 编码（Bech32 的改进版），是目前最先进的比特币地址格式。',
    },
    {
      question: 'Taproot 升级对比特币隐私性的改善体现在哪里？',
      options: [
        '隐藏交易金额',
        '单签和多签交易在链上看起来完全相同',
        '隐藏发送方地址',
        '加密交易数据',
      ],
      correctAnswer: 1,
      explanation:
        '通过 Schnorr 签名聚合和 MAST，Taproot 使单签、多签和复杂脚本交易在链上看起来完全一致，大幅提升隐私性。',
    },
  ],
  '2-7': [
    // 高级交易应用
    {
      question: 'OP_RETURN 输出最多可以存储多少字节的数据？',
      options: ['20 字节', '40 字节', '80 字节', '256 字节'],
      correctAnswer: 2,
      explanation: 'OP_RETURN 允许在比特币交易中嵌入最多 80 字节的任意数据，该输出不可花费。',
    },
    {
      question: 'HTLC（哈希时间锁合约）是哪项技术的核心？',
      options: ['冷钱包', '闪电网络', '多重签名', '矿池'],
      correctAnswer: 1,
      explanation: 'HTLC 通过哈希锁和时间锁的组合实现条件支付，是闪电网络和原子交换的核心技术。',
    },
    {
      question: '比特币地址格式的演进顺序是什么？',
      options: [
        'bc1p → bc1q → 3 → 1',
        '1（P2PKH）→ 3（P2SH）→ bc1q（SegWit）→ bc1p（Taproot）',
        'bc1q → 1 → 3 → bc1p',
        '3 → 1 → bc1p → bc1q',
      ],
      correctAnswer: 1,
      explanation:
        '比特币地址从早期的 1 开头（P2PKH），到 3 开头（P2SH），再到 bc1q（SegWit）和 bc1p（Taproot）。',
    },
    {
      question: 'OP_RETURN 输出有什么特殊之处？',
      options: ['可以被花费', '标记为不可花费，不会进入 UTXO 集合', '必须包含签名', '只能存储数字'],
      correctAnswer: 1,
      explanation:
        'OP_RETURN 输出被标记为可证明不可花费（provably unspendable），不会进入 UTXO 集合，避免了 UTXO 膨胀。',
    },
    {
      question: 'HTLC 中的"时间锁"组件的作用是什么？',
      options: [
        '加速交易确认',
        '如果接收方未在规定时间内提供哈希原像，资金自动退回发送方',
        '锁定交易手续费',
        '限制每天的交易次数',
      ],
      correctAnswer: 1,
      explanation:
        '时间锁确保了安全性：如果接收方不在限定时间内用哈希原像领取资金，发送方可以在超时后取回资金。',
    },
  ],
  '2-8': [
    // 区块链数据结构
    {
      question: '哈希指针与普通指针的区别是什么？',
      options: [
        '哈希指针更快',
        '哈希指针同时存储地址和数据的哈希值，可检测篡改',
        '普通指针更安全',
        '没有区别',
      ],
      correctAnswer: 1,
      explanation: '哈希指针不仅存储数据地址，还保存数据内容的哈希值，可以检测数据是否被篡改。',
    },
    {
      question: '默克尔树验证一笔交易的时间复杂度是多少？',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
      correctAnswer: 1,
      explanation: '默克尔树只需要从叶子到根的路径哈希（O(log n) 个），即可验证交易是否在区块中。',
    },
    {
      question: 'SPV（简化支付验证）轻节点只存储什么数据？',
      options: ['完整的交易列表', '所有区块的全部内容', '区块头信息', '智能合约代码'],
      correctAnswer: 2,
      explanation:
        'SPV 轻节点只存储区块头（约 80 字节），通过默克尔证明来验证交易，适合手机钱包等场景。',
    },
    {
      question: '比特币区块头中包含的默克尔根（Merkle Root）代表什么？',
      options: ['前一个区块的哈希', '该区块所有交易的摘要', '矿工的公钥', '当前网络难度'],
      correctAnswer: 1,
      explanation:
        '默克尔根是区块中所有交易经过默克尔树逐层哈希后得到的根哈希值，可以用来快速验证任意一笔交易是否包含在区块中。',
    },
    {
      question: '修改区块链中某个已确认区块的交易数据会导致什么？',
      options: [
        '只影响该区块',
        '该区块及其后所有区块的哈希都会改变，篡改会被立即发现',
        '不会有任何影响',
        '只影响下一个区块',
      ],
      correctAnswer: 1,
      explanation:
        '由于哈希指针的链式结构，修改任何一个区块的数据都会导致该区块及后续所有区块的哈希改变，使篡改立即可被检测。',
    },
  ],
  '3-1': [
    // 比特币核心节点
    {
      question: '运行比特币全节点需要多少存储空间？',
      options: ['10 GB', '100 GB', '660 GB 以上', '10 TB'],
      correctAnswer: 2,
      explanation: '比特币全节点需要存储完整的区块链数据，截至 2025 年已超过 660 GB。',
    },
    {
      question: '比特币全节点的核心价值是什么？',
      options: ['挖矿获取收益', '独立验证所有交易，无需信任第三方', '加速交易确认', '存储用户密码'],
      correctAnswer: 1,
      explanation: '全节点独立验证每一笔交易和每一个区块，体现了"Don\'t trust, verify"的精神。',
    },
    {
      question: '修剪模式（Pruned Mode）的节点有什么特点？',
      options: [
        '不验证交易',
        '下载并验证完整区块链后删除旧区块，只保留最近数据',
        '只连接少量节点',
        '不参与网络',
      ],
      correctAnswer: 1,
      explanation:
        '修剪模式验证完整区块链后删除旧数据，可将存储降至 2-10 GB 同时保持完整验证能力。',
    },
    {
      question: '比特币核心客户端（Bitcoin Core）的主要实现语言是什么？',
      options: ['Python', 'Java', 'C++', 'Rust'],
      correctAnswer: 2,
      explanation:
        'Bitcoin Core 主要使用 C++ 编写，从中本聪最初的代码发展至今，是比特币网络最广泛使用的节点实现。',
    },
    {
      question: '初始区块下载（IBD）过程中节点在做什么？',
      options: [
        '只下载区块头',
        '从网络下载并验证从创世区块到最新区块的所有数据',
        '只同步最近 100 个区块',
        '从中心化服务器获取数据快照',
      ],
      correctAnswer: 1,
      explanation:
        'IBD 过程中节点从头开始下载并验证整条区块链，确保每一笔交易和每一个区块都符合共识规则。',
    },
  ],
  '3-2': [
    // P2P 网络协议
    {
      question: '比特币网络的默认 P2P 端口号是多少？',
      options: ['80', '443', '8332', '8333'],
      correctAnswer: 3,
      explanation: '比特币网络使用 8333 端口进行 P2P 通信，8332 端口用于 RPC 接口。',
    },
    {
      question: '比特币节点默认发起多少个主动外连接？',
      options: ['3 个', '8 个', '32 个', '125 个'],
      correctAnswer: 1,
      explanation: '比特币节点默认主动连接 8 个外部节点，同时可以接受最多 125 个入站连接。',
    },
    {
      question: '新节点首次加入网络时通过什么方式发现其他节点？',
      options: ['手动输入 IP 地址', 'DNS 种子服务器查询', '广播搜索', '中心化注册表'],
      correctAnswer: 1,
      explanation: '新节点通过查询 9 个独立的 DNS 种子服务器来获取初始节点列表，确保去中心化发现。',
    },
    {
      question: '比特币 P2P 网络的拓扑结构属于什么类型？',
      options: ['星型网络', '环型网络', '非结构化的平等对等网络', '树型层级网络'],
      correctAnswer: 2,
      explanation:
        '比特币网络是非结构化的平等对等（peer-to-peer）网络，没有中心节点，每个节点地位平等。',
    },
    {
      question: '比特币节点之间的消息传播使用什么机制？',
      options: ['中心化广播', 'Gossip 协议（洪泛传播）', '直接点对点发送', '定时轮询服务器'],
      correctAnswer: 1,
      explanation:
        '比特币使用 Gossip 协议传播交易和区块，节点收到新信息后转发给相邻节点，像"八卦"一样扩散到全网。',
    },
  ],
  '3-3': [
    // 网络安全
    {
      question: '发动 51% 攻击大约需要多少资金？',
      options: ['100 万美元', '1 亿美元', '50 亿美元以上', '无法估算'],
      correctAnswer: 2,
      explanation: '51% 攻击需要超过 50 亿美元的设备投入加上每年约 6 亿美元电费，经济上极不划算。',
    },
    {
      question: '购买房产等大额交易通常需要多少个区块确认？',
      options: ['0 个', '1 个', '3 个', '6 个以上'],
      correctAnswer: 3,
      explanation: '大额交易建议等待 6 个以上区块确认（约 1 小时），每增加一个确认攻击成本翻倍。',
    },
    {
      question: '日蚀攻击（Eclipse Attack）的攻击方式是什么？',
      options: [
        '破解私钥',
        '用恶意节点包围目标节点使其与真实网络隔离',
        '修改区块链数据',
        '关闭矿机',
      ],
      correctAnswer: 1,
      explanation: '日蚀攻击通过让目标节点只连接攻击者控制的节点，使其无法获取真实的网络信息。',
    },
    {
      question: '51% 攻击能做到以下哪项？',
      options: [
        '修改比特币总供应量',
        '对自己的交易进行双重支付',
        '偷走任何人钱包中的比特币',
        '创造新的比特币',
      ],
      correctAnswer: 1,
      explanation:
        '51% 攻击者可以重组区块链实现双重支付（双花），但无法修改协议规则、偷走他人资产或凭空创造比特币。',
    },
    {
      question: '比特币网络防范日蚀攻击的主要机制有哪些？',
      options: [
        '加密所有通信数据',
        '限制单一 IP 段的连接数并随机选择出站连接',
        '要求所有节点注册身份',
        '关闭入站连接',
      ],
      correctAnswer: 1,
      explanation:
        'Bitcoin Core 通过限制来自同一 /16 子网的连接数量、随机选择出站连接等机制来抵御日蚀攻击。',
    },
  ],
  '3-4': [
    // 工作量证明与挖矿
    {
      question: '工作量证明（PoW）中"难以计算、易于验证"指的是什么？',
      options: [
        '挖矿设备难以购买',
        '找到有效哈希需要大量尝试，但验证结果只需一次计算',
        '矿工难以盈利',
        '区块难以传播',
      ],
      correctAnswer: 1,
      explanation: 'PoW 的核心是不对称性：矿工需要约 10^22 次尝试找到有效哈希，但验证只需一次。',
    },
    {
      question: '比特币挖矿硬件的演进顺序是什么？',
      options: [
        'ASIC → GPU → CPU → FPGA',
        'CPU → GPU → FPGA → ASIC',
        'GPU → CPU → ASIC → FPGA',
        'FPGA → ASIC → GPU → CPU',
      ],
      correctAnswer: 1,
      explanation: '挖矿硬件从通用 CPU 到 GPU，再到可编程 FPGA，最终发展为专用 ASIC 芯片。',
    },
    {
      question: '比特币区块奖励的减半周期是多少？',
      options: ['每 1 年', '每 2 年', '每 21 万个区块（约 4 年）', '每 10 年'],
      correctAnswer: 2,
      explanation:
        '比特币每 210,000 个区块（约 4 年）减半一次，从最初的 50 BTC 逐渐减少直至 2140 年归零。',
    },
    {
      question: '矿工在挖矿过程中不断改变的区块头字段是什么？',
      options: ['前一区块哈希', 'Nonce（随机数）', '版本号', '默克尔根'],
      correctAnswer: 1,
      explanation:
        '矿工通过不断改变 Nonce 值来尝试不同的区块头哈希，直到找到一个小于目标难度值的有效哈希。',
    },
    {
      question: '比特币矿池（Mining Pool）存在的主要原因是什么？',
      options: [
        '降低电费成本',
        '单个矿工获得区块奖励的概率太低，矿池可以稳定收益',
        '提高比特币价格',
        '中心化管理更高效',
      ],
      correctAnswer: 1,
      explanation:
        '单个矿工独立挖到区块的概率极低，矿池将多个矿工的算力汇聚，按贡献分配收益，使挖矿收入更加稳定。',
    },
  ],
  '3-5': [
    // 难度调整算法
    {
      question: '比特币难度调整的周期是多少？',
      options: ['每个区块', '每 2,016 个区块（约 14 天）', '每 1,000 个区块', '每 30 天'],
      correctAnswer: 1,
      explanation: '每 2,016 个区块进行一次难度调整，目标是将出块时间维持在平均 10 分钟。',
    },
    {
      question: '单次难度调整的最大变化幅度是多少？',
      options: ['2 倍', '4 倍', '10 倍', '无限制'],
      correctAnswer: 1,
      explanation: '为防止极端波动，单次调整最多上升 4 倍或下降至 1/4，保护网络稳定性。',
    },
    {
      question: '比特币 15 年运行以来的平均出块时间是多少？',
      options: ['8.5 分钟', '9.8 分钟', '10.0 分钟', '12.3 分钟'],
      correctAnswer: 1,
      explanation:
        '得益于难度调整机制，比特币 15 年来的平均出块时间为 9.8 分钟，非常接近 10 分钟目标。',
    },
    {
      question: '如果全网算力突然翻倍，在下一次难度调整前会发生什么？',
      options: ['出块时间不变', '出块时间会缩短为约 5 分钟', '网络会暂停', '区块大小会增加'],
      correctAnswer: 1,
      explanation:
        '在难度调整前，算力翻倍会导致出块速度加快约一倍（约 5 分钟/块），直到下一个难度调整周期将难度提高以恢复 10 分钟目标。',
    },
    {
      question: '难度调整机制对比特币网络安全性有什么作用？',
      options: [
        '降低手续费',
        '确保即使算力大幅变化也能维持稳定的出块速率和安全性',
        '增加区块容量',
        '加密交易数据',
      ],
      correctAnswer: 1,
      explanation:
        '难度调整保证了无论全网算力如何变化，出块时间始终保持在约 10 分钟，既维护了网络安全又确保了经济激励的可持续性。',
    },
  ],
  '3-6': [
    // 分叉机制与 BIP
    {
      question: '软分叉和硬分叉的核心区别是什么？',
      options: ['软分叉更快', '软分叉向后兼容，硬分叉不兼容', '硬分叉更安全', '软分叉需要更多算力'],
      correctAnswer: 1,
      explanation:
        '软分叉收紧规则、向后兼容，旧节点仍能验证；硬分叉修改规则、不兼容，可能导致链分裂。',
    },
    {
      question: '以下哪个是比特币历史上著名的争议性硬分叉？',
      options: ['SegWit', 'Taproot', 'Bitcoin Cash（BCH）', 'P2SH'],
      correctAnswer: 2,
      explanation: 'Bitcoin Cash 在 2017 年 8 月因区块大小争议从比特币硬分叉而来，形成了独立的链。',
    },
    {
      question: 'BIP 提案的三种分类是什么？',
      options: [
        '技术类、经济类、社会类',
        '标准跟踪类、信息类、流程类',
        '紧急类、普通类、建议类',
        '核心类、外围类、实验类',
      ],
      correctAnswer: 1,
      explanation: 'BIP 分为标准跟踪类（影响实现）、信息类（最佳实践）和流程类（治理流程）三种。',
    },
    {
      question: 'BIP 的全称是什么？',
      options: [
        'Bitcoin Investment Proposal',
        'Bitcoin Improvement Proposal',
        'Blockchain Integration Protocol',
        'Bitcoin Internal Process',
      ],
      correctAnswer: 1,
      explanation:
        'BIP（Bitcoin Improvement Proposal）是比特币改进提案，任何人都可以提交，是比特币协议升级的标准化流程。',
    },
    {
      question: '软分叉在什么条件下可以成功激活？',
      options: [
        '需要 100% 节点同意',
        '只需要多数算力支持即可，无需所有节点升级',
        '需要中本聪亲自批准',
        '需要所有交易所支持',
      ],
      correctAnswer: 1,
      explanation:
        '软分叉只需多数算力（通常要求 95% 信号支持）即可激活，未升级的旧节点仍然可以验证新区块。',
    },
  ],
  '4-1': [
    // 比特币钱包
    {
      question: '"Not Your Keys, Not Your Coins" 这句话强调了什么？',
      options: [
        '钱包密码的重要性',
        '只有自己掌握私钥才真正拥有比特币',
        '比特币价格波动大',
        '需要多个钱包',
      ],
      correctAnswer: 1,
      explanation: '这句话是比特币社区的核心信条，强调自主保管私钥是拥有比特币的唯一方式。',
    },
    {
      question: '比特币钱包实际存储的是什么？',
      options: ['比特币本身', '私钥和公钥对', '区块链数据', '交易手续费'],
      correctAnswer: 1,
      explanation: '钱包实际上存储的是密钥对（私钥和公钥），比特币本身记录在区块链上。',
    },
    {
      question: '热钱包和冷钱包的主要区别是什么？',
      options: [
        '热钱包更贵',
        '热钱包联网（便捷但风险高），冷钱包离线（安全但不便）',
        '冷钱包不能转账',
        '热钱包只支持以太坊',
      ],
      correctAnswer: 1,
      explanation: '热钱包始终联网方便日常使用，冷钱包离线保存适合大额长期存储，安全性更高。',
    },
    {
      question: 'HD 钱包（分层确定性钱包）的主要优势是什么？',
      options: [
        '交易速度更快',
        '只需一个种子即可生成无限的密钥对和地址',
        '手续费更低',
        '只能存储比特币',
      ],
      correctAnswer: 1,
      explanation:
        'HD 钱包从一个主种子派生出所有密钥对，只需备份一组助记词就能恢复所有地址和资产。',
    },
    {
      question: '以下哪种是硬件钱包的代表产品？',
      options: ['MetaMask', 'Ledger Nano', 'Phantom', 'Trust Wallet'],
      correctAnswer: 1,
      explanation:
        'Ledger Nano 是最知名的硬件冷钱包之一，将私钥存储在离线的安全芯片中，交易签名在设备内完成，大幅降低被盗风险。',
    },
  ],
  '4-2': [
    // 比特币 RPC
    {
      question: 'RPC（远程过程调用）在比特币中的作用是什么？',
      options: ['挖矿加速', '允许程序通过命令远程控制比特币节点', '管理私钥', '加密交易数据'],
      correctAnswer: 1,
      explanation: 'RPC 允许开发者通过编程方式与比特币节点交互，执行查询、创建交易等操作。',
    },
    {
      question: '比特币 RPC 的默认端口号是多少？',
      options: ['8333', '8332', '3000', '80'],
      correctAnswer: 1,
      explanation: '比特币核心的 RPC 接口默认使用 8332 端口，而 P2P 网络使用 8333 端口。',
    },
    {
      question: '以下哪个不是比特币 RPC 的常用命令类别？',
      options: [
        '区块链查询（getblockchaininfo）',
        '钱包操作（getbalance）',
        '社交媒体发布',
        '交易管理（createrawtransaction）',
      ],
      correctAnswer: 2,
      explanation: 'RPC 命令覆盖区块链查询、钱包操作和交易管理等功能，不涉及社交媒体。',
    },
    {
      question: '使用比特币 RPC 时需要配置什么安全凭证？',
      options: ['邮箱和手机号', 'rpcuser 和 rpcpassword（用户名和密码）', 'SSL 证书', '指纹识别'],
      correctAnswer: 1,
      explanation:
        'RPC 接口通过 bitcoin.conf 中配置的 rpcuser 和 rpcpassword 进行身份验证，防止未授权访问。',
    },
    {
      question: 'bitcoin-cli 工具的作用是什么？',
      options: [
        '挖矿软件',
        '比特币核心的命令行 RPC 客户端，用于与节点交互',
        '钱包图形界面',
        '区块链浏览器',
      ],
      correctAnswer: 1,
      explanation:
        'bitcoin-cli 是 Bitcoin Core 附带的命令行工具，封装了 RPC 调用，方便开发者和管理员直接在终端操作节点。',
    },
  ],
  '4-3': [
    // 低费率广播工具
    {
      question: 'UTXO 合并的主要目的是什么？',
      options: [
        '增加比特币数量',
        '在低费率时合并小额 UTXO 以降低未来交易成本',
        '加快交易速度',
        '隐藏交易记录',
      ],
      correctAnswer: 1,
      explanation: '在网络费率低的时候合并多个小额 UTXO，可以减少未来交易时的输入数量和费用。',
    },
    {
      question: 'RBF（Replace-By-Fee）机制的作用是什么？',
      options: [
        '取消已确认的交易',
        '用更高手续费的新交易替换未确认的旧交易',
        '退回交易费用',
        '加密交易数据',
      ],
      correctAnswer: 1,
      explanation: 'RBF 允许用户在交易未确认时提交一笔更高手续费的替换交易，加速确认。',
    },
    {
      question: '"时间胶囊交易"的含义是什么？',
      options: [
        '只能在未来某个时间使用',
        '以极低费率广播交易，等待网络空闲时确认',
        '加密的秘密交易',
        '定时自动发送交易',
      ],
      correctAnswer: 1,
      explanation: '时间胶囊交易指用极低的费率广播交易，耐心等待网络不拥堵时才被矿工打包确认。',
    },
    {
      question: 'CPFP（Child Pays for Parent）的工作原理是什么？',
      options: [
        '矿工免费加速交易',
        '创建一笔子交易花费未确认的父交易输出，并附带高手续费来激励矿工同时打包两笔交易',
        '向矿工直接转账',
        '回滚未确认的交易',
      ],
      correctAnswer: 1,
      explanation:
        'CPFP 通过创建一笔花费未确认 UTXO 的子交易，矿工为了获取子交易的高手续费会同时打包父交易。',
    },
    {
      question: '比特币交易手续费的计算依据是什么？',
      options: [
        '转账金额的百分比',
        '交易数据的大小（以虚拟字节 vByte 计算）',
        '固定金额',
        '发送方的钱包余额',
      ],
      correctAnswer: 1,
      explanation:
        '比特币手续费按交易的数据大小（vByte）计算，与转账金额无关，费率以 sat/vB（聪/虚拟字节）为单位。',
    },
  ],
  '4-4': [
    // Bitcoin Script
    {
      question: '比特币脚本为什么是非图灵完备的？',
      options: [
        '设计缺陷',
        '刻意设计：不支持循环以保证脚本一定会终止',
        '技术限制无法实现',
        '为了节省存储空间',
      ],
      correctAnswer: 1,
      explanation:
        '比特币脚本刻意设计为非图灵完备，禁止无限循环以确保每个脚本都能在有限时间内执行完成。',
    },
    {
      question: '比特币脚本的执行模型是什么？',
      options: ['寄存器模型', '基于栈的执行模型', '基于对象的模型', '事件驱动模型'],
      correctAnswer: 1,
      explanation: '比特币脚本使用基于栈的执行模型，数据被压入和弹出栈，栈顶非零即为执行成功。',
    },
    {
      question: '目前比特币中使用最广泛的标准脚本类型是什么？',
      options: [
        'P2PK（Pay-to-Public-Key）',
        'P2PKH（Pay-to-Public-Key-Hash）',
        'P2TR（Pay-to-Taproot）',
        'OP_RETURN',
      ],
      correctAnswer: 1,
      explanation: 'P2PKH 是最经典也是使用最广泛的脚本类型，约占比特币交易的 60%。',
    },
    {
      question: 'P2PKH 脚本在验证交易时需要提供什么？',
      options: [
        '只需要公钥',
        '需要公钥和对应私钥生成的数字签名',
        '只需要比特币地址',
        '需要矿工的授权',
      ],
      correctAnswer: 1,
      explanation:
        'P2PKH 验证时，花费者需要提供公钥和用对应私钥生成的数字签名，脚本验证签名有效且公钥哈希匹配。',
    },
    {
      question: '比特币脚本中 OP_DUP 和 OP_HASH160 的组合作用是什么？',
      options: [
        '加密交易数据',
        '复制栈顶的公钥并计算其哈希，用于与锁定脚本中的地址哈希比对',
        '删除无效交易',
        '生成新的比特币地址',
      ],
      correctAnswer: 1,
      explanation:
        '在 P2PKH 脚本中，OP_DUP 复制栈顶公钥，OP_HASH160 对其进行哈希运算，然后与脚本中预存的地址哈希进行比较。',
    },
  ],
  '4-5': [
    // 比特币扩容与治理
    {
      question: '2017 年比特币扩容之争中，"大区块派"和"小区块派"的核心分歧是什么？',
      options: [
        '挖矿算法选择',
        '直接增大区块大小 vs SegWit + Layer 2 方案',
        '是否使用 PoS 共识',
        '交易手续费定价',
      ],
      correctAnswer: 1,
      explanation:
        '大区块派主张直接增大区块容量，小区块派主张通过 SegWit 和二层网络来扩展，后者最终胜出。',
    },
    {
      question: 'UASF（用户激活软分叉）证明了什么？',
      options: [
        '矿工拥有最终决定权',
        '经济多数（用户和节点）可以推动协议升级',
        '开发者控制比特币',
        '交易所决定升级方向',
      ],
      correctAnswer: 1,
      explanation: 'UASF 表明即使没有矿工多数支持，经济多数（运行节点的用户）也能推动协议变更。',
    },
    {
      question: '比特币治理中，以下哪个群体不是核心参与者？',
      options: [
        '开发者（通过 BIP 提案）',
        '矿工（通过区块信号）',
        '中央银行',
        '经济节点（验证和转发交易）',
      ],
      correctAnswer: 2,
      explanation:
        '比特币的去中心化治理由开发者、矿工、经济节点和用户共同参与，没有中央银行的角色。',
    },
    {
      question: 'SegWit2x 提案为什么最终失败？',
      options: [
        '技术上无法实现',
        '缺乏足够的社区共识和用户支持，在争议中被放弃',
        '中本聪反对',
        '矿工全部拒绝',
      ],
      correctAnswer: 1,
      explanation:
        'SegWit2x 试图在 SegWit 之后进一步将区块大小增至 2MB，但由于社区反对和缺乏共识最终被取消。',
    },
    {
      question: '比特币"无领导者"的治理模式意味着什么？',
      options: [
        '没有人维护代码',
        '协议变更需要生态系统多方参与者的粗略共识，任何单一方都无法独自决定',
        '可以随意修改代码',
        '由最大矿池决定一切',
      ],
      correctAnswer: 1,
      explanation:
        '比特币没有 CEO 或董事会，协议变更需要开发者、矿工、节点运营者和用户之间达成粗略共识，这确保了去中心化。',
    },
  ],
  '4-6': [
    // Ordinals 与生态创新
    {
      question: 'Ordinals 协议的核心思想是什么？',
      options: [
        '增加比特币区块大小',
        '为每个聪（satoshi）赋予唯一编号',
        '创建新的比特币分叉',
        '替换比特币脚本系统',
      ],
      correctAnswer: 1,
      explanation:
        'Ordinals 为比特币的每个聪赋予唯一序号（0 到 2,099,999,999,999,999），使其具有唯一性。',
    },
    {
      question: 'Ordinals 铭文数据是通过什么技术存储在链上的？',
      options: [
        'OP_RETURN（最多 80 字节）',
        'Taproot 脚本路径的见证数据',
        '区块头',
        '交易手续费字段',
      ],
      correctAnswer: 1,
      explanation:
        '铭文利用 Taproot 脚本路径将数据嵌入见证数据中，容量远大于 OP_RETURN 的 80 字节限制。',
    },
    {
      question: 'BRC-20 代币标准使用什么格式定义代币操作？',
      options: ['智能合约字节码', 'JSON 文本', 'XML 文件', '二进制数据'],
      correctAnswer: 1,
      explanation:
        'BRC-20 使用 JSON 格式在 Ordinals 铭文中定义代币的 deploy、mint 和 transfer 操作。',
    },
    {
      question: 'Ordinals 协议中"稀有聪"（Rare Sats）的分类依据是什么？',
      options: [
        '聪的金额大小',
        '聪在特殊事件（如减半、新难度周期）中被挖出的时间',
        '聪所在交易的手续费',
        '随机抽取',
      ],
      correctAnswer: 1,
      explanation:
        'Ordinals 根据聪被挖出的时间点将其分为 common、uncommon、rare、epic、legendary、mythic 等稀有度等级。',
    },
    {
      question: 'Ordinals 铭文与传统 NFT（如以太坊 ERC-721）的最大区别是什么？',
      options: [
        '铭文更便宜',
        '铭文数据完全存储在链上，不依赖外部存储',
        '铭文可以修改',
        '传统 NFT 不能交易',
      ],
      correctAnswer: 1,
      explanation:
        'Ordinals 铭文将图片、文字等数据直接写入比特币区块链，而多数以太坊 NFT 的元数据存储在 IPFS 等链外系统。',
    },
  ],
  '4-7': [
    // DeFi 跨链
    {
      question: '闪电网络（Lightning Network）的主要特点是什么？',
      options: [
        '增加比特币区块大小',
        '通过支付通道实现毫秒级的链下微支付',
        '替换工作量证明共识',
        '只能用于大额交易',
      ],
      correctAnswer: 1,
      explanation: '闪电网络是 Layer 2 方案，通过支付通道实现链下即时微支付，确认速度达毫秒级。',
    },
    {
      question: '原子交换（Atomic Swap）使用什么机制保证跨链交易安全？',
      options: ['中心化交易所担保', 'HTLC（哈希时间锁合约）', '矿工投票', '智能合约审计'],
      correctAnswer: 1,
      explanation:
        '原子交换使用 HTLC 机制，通过相同的哈希秘密值在两条链上锁定资金，保证交易原子性。',
    },
    {
      question: 'RGB 协议与传统智能合约平台的最大区别是什么？',
      options: [
        'RGB 更快',
        'RGB 使用客户端验证，只有交易双方知道合约细节',
        'RGB 不在区块链上',
        'RGB 只支持 NFT',
      ],
      correctAnswer: 1,
      explanation: 'RGB 采用客户端验证模式，合约状态只由交易双方验证，保护了隐私且不增加链上负担。',
    },
    {
      question: '闪电网络中打开支付通道需要在链上进行什么操作？',
      options: [
        '注册账户',
        '创建一笔链上交易将资金锁入 2-of-2 多签地址',
        '向矿工支付特殊费用',
        '提交身份验证',
      ],
      correctAnswer: 1,
      explanation:
        '开通闪电通道需要一笔链上交易将资金存入双方的 2-of-2 多签地址，之后通道内的交易都在链下进行。',
    },
    {
      question: '原子交换的"原子性"指的是什么？',
      options: [
        '交易速度极快',
        '跨链交易要么完全成功，要么完全失败，不存在中间状态',
        '交易金额很小',
        '交易消耗的能量很少',
      ],
      correctAnswer: 1,
      explanation:
        '原子性意味着跨链交易要么双方都完成交换，要么双方都不执行，避免了一方得到资产而另一方未收到的风险。',
    },
  ],
  '5-1': [
    // Web3 基本原则
    {
      question: '文章建议的加密资产配置比例中，比特币应占多少？',
      options: ['30% 以上', '50% 以上', '80% 以上', '100%'],
      correctAnswer: 2,
      explanation: '文章建议将 80% 以上的加密资产配置为比特币作为长期核心，20% 以内参与其他项目。',
    },
    {
      question: '"比特币本位思维"的含义是什么？',
      options: [
        '只投资比特币',
        '用比特币作为衡量投资组合价值的基准单位',
        '把所有法币换成比特币',
        '在比特币网络上进行所有交易',
      ],
      correctAnswer: 1,
      explanation:
        '比特币本位思维指用 BTC 而非法币作为衡量投资价值的标准，因为法币数字可能具有欺骗性。',
    },
    {
      question: '最小化信任模型的核心原则是什么？',
      options: [
        '信任所有经过审计的项目',
        '只信任大型交易所',
        '默认不信任任何项目、机构和个人',
        '只信任知名人士的推荐',
      ],
      correctAnswer: 2,
      explanation: '在 Web3 世界中，信任需要通过时间和透明度来赢得，默认应对一切保持谨慎。',
    },
    {
      question: '"DYOR"（Do Your Own Research）在 Web3 中意味着什么？',
      options: [
        '只看新闻报道',
        '在投资或参与任何项目前独立研究其技术、团队和风险',
        '复制他人的投资组合',
        '只依赖 KOL 的推荐',
      ],
      correctAnswer: 1,
      explanation:
        'DYOR 是 Web3 社区的核心理念，强调在投入资金前必须独立研究项目的白皮书、技术细节和团队背景。',
    },
    {
      question: 'Web3 中的"永续学习"原则为什么重要？',
      options: [
        '为了赚更多钱',
        '因为行业变化极快，技术和生态不断演进需要持续更新认知',
        '学习可以获得代币奖励',
        '只是一种社交方式',
      ],
      correctAnswer: 1,
      explanation:
        'Web3 领域技术迭代迅速，新协议、新工具和新风险不断涌现，持续学习是保护资产和把握机遇的基础。',
    },
  ],
  '5-2': [
    // 为什么区块链是必须的
    {
      question: '《主权个人》一书在哪一年出版？',
      options: ['1987 年', '1997 年', '2007 年', '2009 年'],
      correctAnswer: 1,
      explanation: '《主权个人》于 1997 年出版，预见了加密货币和区块链技术的出现，被视为预言之书。',
    },
    {
      question: '根据《主权个人》，信息时代权力结构的变化趋势是什么？',
      options: [
        '更加中心化',
        '权力从中心化机构流向掌握信息技术的个体和网络',
        '政府权力加强',
        '企业垄断增加',
      ],
      correctAnswer: 1,
      explanation:
        '信息时代暴力成本上升，生产依赖无形资产，权力从中心化的民族国家流向去中心化的个体网络。',
    },
    {
      question: '区块链技术的五大必然性支柱不包括以下哪项？',
      options: ['财富保护需求', '智能合约执行', '提高网速', '个体主权的技术基础'],
      correctAnswer: 2,
      explanation:
        '五大支柱包括：财富保护、全球化、契约执行新范式、货币竞争和个体主权，不涉及网速。',
    },
    {
      question: '比特币作为"数字黄金"解决了什么传统金融问题？',
      options: [
        '网络延迟',
        '提供了不受任何单一政府或机构控制的财富存储方式',
        '降低了银行手续费',
        '提高了股票交易速度',
      ],
      correctAnswer: 1,
      explanation:
        '比特币作为去中心化的价值存储工具，为个人提供了独立于政府和银行的财富保护手段，特别是在货币贬值和资本管制的环境中。',
    },
    {
      question: '区块链对全球化的意义是什么？',
      options: [
        '增加国际航班数量',
        '实现无国界的价值转移和经济参与',
        '统一全球语言',
        '消除所有贸易壁垒',
      ],
      correctAnswer: 1,
      explanation:
        '区块链使任何有互联网连接的人都能参与全球经济，实现无国界、无许可的价值转移，打破传统金融的地理限制。',
    },
  ],
  '5-3': [
    // 比特币上最酷的交易
    {
      question: 'b10c...eb5d 这笔交易的特殊之处是什么？',
      options: [
        '金额最大的交易',
        '嵌入了大量技术、历史和文化彩蛋的艺术品级交易',
        '手续费最高的交易',
        '最早的比特币交易',
      ],
      correctAnswer: 1,
      explanation: '这笔交易包含了区块高度梗、时间戳梗、脚本类型全集、历史公钥致敬等多重彩蛋。',
    },
    {
      question: '这笔交易中数字 21000000 在 nSequence 字段中代表什么？',
      options: ['交易手续费', '比特币总供应量上限', '区块高度', '矿工 ID'],
      correctAnswer: 1,
      explanation: '21,000,000 代表比特币的总供应量上限 2100 万枚，是比特币最重要的经济参数之一。',
    },
    {
      question: '这笔交易包含了哪些比特币历史上的经典脚本类型？',
      options: [
        '只有 P2PKH',
        '从 P2PK 到 P2TR 几乎所有历史脚本类型',
        '只有 SegWit 脚本',
        '没有脚本类型',
      ],
      correctAnswer: 1,
      explanation:
        '交易覆盖了 P2PK、P2PKH、P2SH、P2WPKH、P2WSH、P2TR 等几乎所有比特币脚本类型的演进。',
    },
    {
      question: '这笔交易中使用了哪些历史人物的公钥来致敬？',
      options: [
        '只有中本聪',
        '包括中本聪、Hal Finney 等比特币早期贡献者',
        '没有使用任何历史公钥',
        '只有矿池运营者',
      ],
      correctAnswer: 1,
      explanation: '交易输出中使用了中本聪和 Hal Finney 等比特币先驱的公钥，向这些早期贡献者致敬。',
    },
    {
      question: '为什么说这笔交易是比特币技术的"活教科书"？',
      options: [
        '因为它金额很大',
        '因为它在一笔交易中展示了比特币脚本、地址格式和协议演进的完整历史',
        '因为它被写入了教材',
        '因为它是中本聪创建的',
      ],
      correctAnswer: 1,
      explanation:
        '这笔交易精心设计，将比特币从诞生到 Taproot 的所有关键技术升级浓缩在一起，堪称链上技术博物馆。',
    },
  ],
  '6-1': [
    // DeFi 去中心化金融
    {
      question: 'DeFi 中，TVL (Total Value Locked) 代表什么含义？',
      options: ['每日交易总量', '锁定在协议中的资产总价值', '年化收益率', '代币总供应量'],
      correctAnswer: 1,
      explanation:
        'TVL (Total Value Locked) 即总锁定价值，是衡量 DeFi 协议中锁定资产总价值的重要指标，反映了用户对协议的信任度和规模。',
    },
    {
      question: '以下哪个协议是以太坊流动性质押 (LSDFi) 领域 TVL 最高的？',
      options: ['Rocket Pool', 'Frax Ether', 'Lido', 'Coinbase cbETH'],
      correctAnswer: 2,
      explanation:
        'Lido 以超过 320 亿美元的 TVL 位居以太坊流动性质押龙头，远超第二名 Rocket Pool。',
    },
    {
      question: 'RWA (现实世界资产) 代币化的市场规模预计到 2030 年将达到多少？',
      options: ['1 万亿美元', '5 万亿美元', '16 万亿美元', '50 万亿美元'],
      correctAnswer: 2,
      explanation:
        'RWA 代币化市场规模预计到 2030 年将达到 16 万亿美元，BlackRock BUIDL、Ondo Finance 等是核心项目。',
    },
    {
      question: 'AMM（自动做市商）与传统订单簿交易的核心区别是什么？',
      options: [
        'AMM 手续费更高',
        'AMM 使用数学公式（如 x*y=k）和流动性池自动定价，无需买卖双方匹配',
        'AMM 只能交易稳定币',
        'AMM 需要中间人撮合',
      ],
      correctAnswer: 1,
      explanation:
        'AMM 通过恒定乘积公式等数学模型和流动性池实现自动定价和交易，消除了传统订单簿对买卖双方匹配的依赖。',
    },
    {
      question: '无常损失（Impermanent Loss）是什么？',
      options: [
        '交易手续费的损失',
        '向 AMM 流动性池提供流动性时，由于代币价格变化导致的潜在价值损失',
        '网络拥堵造成的损失',
        '黑客攻击的损失',
      ],
      correctAnswer: 1,
      explanation:
        '无常损失是流动性提供者面临的主要风险，当池中代币的价格比率发生变化时，LP 的资产价值可能低于简单持有。',
    },
  ],
  '6-2': [
    // 以太坊生态概览
    {
      question: '以太坊的 "The Merge"（合并）在何时完成？',
      options: ['2020 年 12 月', '2021 年 6 月', '2022 年 9 月', '2023 年 3 月'],
      correctAnswer: 2,
      explanation:
        '以太坊的 The Merge 于 2022 年 9 月完成，主网从工作量证明 (PoW) 转变为权益证明 (PoS)，能耗降低了 99.95%。',
    },
    {
      question: '要成为以太坊 PoS 验证者，最低需要质押多少 ETH？',
      options: ['1 ETH', '16 ETH', '32 ETH', '64 ETH'],
      correctAnswer: 2,
      explanation: '以太坊权益证明 (PoS) 机制要求验证者至少质押 32 个 ETH 才能参与网络验证。',
    },
    {
      question: '以太坊中外部账户 (EOA) 的特点是什么？',
      options: [
        '由智能合约代码控制',
        '包含合约代码',
        '只能被动响应调用',
        '由私钥控制，可以主动发起交易',
      ],
      correctAnswer: 3,
      explanation:
        '外部账户 (EOA) 由私钥控制，可以主动发起交易。而合约账户由智能合约代码控制，只能被动响应调用。',
    },
    {
      question: 'EIP-1559 升级对以太坊 Gas 费机制的主要改变是什么？',
      options: [
        '取消了 Gas 费',
        '引入了基础费用燃烧机制和小费机制，使费用更可预测',
        '固定了 Gas 价格',
        '只有矿工可以设置 Gas 费',
      ],
      correctAnswer: 1,
      explanation:
        'EIP-1559 将 Gas 费分为被燃烧的基础费和支付给验证者的小费，使费用估算更可预测并引入了 ETH 通缩机制。',
    },
    {
      question: '以太坊虚拟机（EVM）的主要作用是什么？',
      options: [
        '挖矿计算',
        '为智能合约提供统一的执行环境，确保所有节点得到相同结果',
        '存储用户数据',
        '管理网络连接',
      ],
      correctAnswer: 1,
      explanation:
        'EVM 是以太坊的核心组件，为智能合约提供了确定性的执行环境，确保全网所有节点执行合约后得到完全相同的结果。',
    },
  ],
  '6-3': [
    // Layer 2 扩容技术
    {
      question: 'Optimistic Rollups 的提款周期通常需要多长时间？',
      options: ['1 小时', '1 天', '7 天', '30 天'],
      correctAnswer: 2,
      explanation:
        'Optimistic Rollups 假设所有交易都是有效的，只在被质疑时才进行验证，因此提款需等待 7 天的挑战期。',
    },
    {
      question: '截至 2025 年 1 月，哪个 Layer 2 项目的 TVL 最高？',
      options: ['Optimism', 'Base', 'Arbitrum', 'zkSync Era'],
      correctAnswer: 2,
      explanation:
        '截至 2025 年 1 月，Arbitrum 以 150 亿美元的 TVL 排名第一，占 Layer 2 市场份额的 43.2%。',
    },
    {
      question: '以太坊主网 (Layer 1) 的 TPS 大约是多少？',
      options: ['约 15 TPS', '约 100 TPS', '约 1,000 TPS', '约 10,000 TPS'],
      correctAnswer: 0,
      explanation:
        '以太坊主网的 TPS 约为 15，远低于 Layer 2 的 2,000-10,000+ TPS，这正是 Layer 2 扩容方案存在的根本原因。',
    },
    {
      question: 'Optimistic Rollups 和 ZK Rollups 的核心区别是什么？',
      options: [
        '支持的代币种类不同',
        'Optimistic 假设交易有效通过欺诈证明纠错，ZK 用零知识证明数学验证正确性',
        '部署的区块链不同',
        '手续费的支付方式不同',
      ],
      correctAnswer: 1,
      explanation:
        'Optimistic Rollups 先乐观假设交易有效，通过争议期和欺诈证明纠错；ZK Rollups 为每批交易生成零知识证明，数学上保证正确性。',
    },
    {
      question: 'Layer 2 解决方案如何继承以太坊主网的安全性？',
      options: [
        '运行独立的共识机制',
        '将交易数据或证明提交到以太坊主网，由主网最终确认和保障安全',
        '使用相同的验证者集合',
        '共享 Gas 费池',
      ],
      correctAnswer: 1,
      explanation:
        'Layer 2 将压缩后的交易数据和/或有效性证明提交到以太坊主网，借助主网的去中心化和安全性来保障 L2 交易的最终确定性。',
    },
  ],
  '6-4': [
    // 新兴公链生态
    {
      question: 'Solana 区块链使用的独创性共识机制核心技术是什么？',
      options: ['权益证明 (PoS)', '历史证明 (PoH)', '委托权益证明 (DPoS)', '工作量证明 (PoW)'],
      correctAnswer: 1,
      explanation:
        'Solana 的核心创新是历史证明 (Proof of History, PoH)，通过创建历史记录证明来为交易排序，配合 PoS 共识实现 65,000+ 的高 TPS。',
    },
    {
      question: 'Aptos 和 Sui 都使用哪种编程语言进行智能合约开发？',
      options: ['Solidity', 'Rust', 'Move', 'Go'],
      correctAnswer: 2,
      explanation:
        'Aptos 和 Sui 都使用 Move 语言，以资源导向编程为特色，编译时保证资源不能被复制或丢弃，安全性更高。',
    },
    {
      question: '在新兴公链的 TPS 性能对比中，以下哪个公链的理论 TPS 最高？',
      options: ['Solana (65,000+)', 'Aptos (160,000+)', 'Sui (297,000+)', 'Cosmos (10,000+)'],
      correctAnswer: 2,
      explanation:
        'Sui 凭借 Narwhal & Bullshark 共识算法达到了 297,000+ 的 TPS，高于 Aptos 和 Solana。',
    },
    {
      question: 'Cosmos 生态的核心跨链通信协议是什么？',
      options: ['Wormhole', 'LayerZero', 'IBC（跨链通信协议）', 'Polkadot XCM'],
      correctAnswer: 2,
      explanation:
        'Cosmos 使用 IBC (Inter-Blockchain Communication) 协议实现生态内不同区块链之间的跨链资产转移和消息传递。',
    },
    {
      question: 'Solana 相比以太坊的主要优势和劣势分别是什么？',
      options: [
        '优势是更安全，劣势是更慢',
        '优势是交易速度快且费用低，劣势是网络稳定性和去中心化程度不及以太坊',
        '优势是更去中心化，劣势是费用更高',
        '优势和劣势都与以太坊完全相同',
      ],
      correctAnswer: 1,
      explanation:
        'Solana 以极高的 TPS 和极低的交易费用著称，但曾多次经历网络宕机，其验证者节点的硬件要求较高也限制了去中心化程度。',
    },
  ],
  '6-5': [
    // AI + Web3 融合
    {
      question: 'zkML (零知识机器学习) 的核心优势是什么？',
      options: [
        '加速 AI 模型训练速度',
        '在不暴露模型参数或训练数据的情况下证明 AI 模型的正确执行',
        '降低 AI 模型的存储成本',
        '提高 AI 模型的准确率',
      ],
      correctAnswer: 1,
      explanation:
        'zkML 结合零知识证明和机器学习，在不暴露模型参数或训练数据的情况下，通过数学保证证明 AI 模型的正确执行。',
    },
    {
      question: '根据 Vitalik Buterin 的框架，AI 在加密领域有几种角色？',
      options: ['两种', '三种', '四种', '五种'],
      correctAnswer: 2,
      explanation: '根据 Vitalik 的框架，AI 在 Crypto 中有四种角色：参与者、接口、规则和目标。',
    },
    {
      question: '去中心化 AI 基础设施项目 Render Network (RNDR) 主要提供什么服务？',
      options: ['去中心化数据存储', 'GPU 渲染和 AI 训练', '跨链通信协议', '隐私信用评估'],
      correctAnswer: 1,
      explanation:
        'Render Network 是去中心化 GPU 渲染网络，主要应用于 3D 渲染和 AI 模型训练，是去中心化计算基础设施的代表。',
    },
    {
      question: '去中心化 AI 训练面临的最大挑战是什么？',
      options: [
        '电费太高',
        '大模型训练需要大量 GPU 间通信，分布式网络的带宽和延迟成为瓶颈',
        '缺少训练数据',
        '法律不允许',
      ],
      correctAnswer: 1,
      explanation:
        '大模型训练需要 GPU 之间频繁交换梯度数据，去中心化网络中节点间的高延迟和低带宽是实现高效分布式训练的主要障碍。',
    },
    {
      question: 'AI 作为区块链"参与者"的典型应用是什么？',
      options: [
        '替代所有人类用户',
        'AI 交易机器人自主执行链上交易和 DeFi 策略',
        '编写区块链底层代码',
        '关闭智能合约',
      ],
      correctAnswer: 1,
      explanation:
        'AI 作为链上参与者，可以自主分析市场数据、执行交易策略和参与 DeFi 协议，是 AI+Web3 最直接的结合方式。',
    },
  ],
  '6-6': [
    // Web3 实用工具大全
    {
      question: 'Slither 是由哪个安全团队开发的智能合约静态分析工具？',
      options: ['OpenZeppelin', 'Certora', 'Trail of Bits', 'ConsenSys Diligence'],
      correctAnswer: 2,
      explanation:
        'Slither 是由 Trail of Bits 团队用 Python 开发的静态分析工具，能够检测 90+ 种漏洞类型。',
    },
    {
      question: '1inch DEX 聚合器支持多少条链和多少个 DEX？',
      options: [
        '5+ 条链，50+ DEX',
        '12+ 条链，200+ DEX',
        '20+ 条链，500+ DEX',
        '8+ 条链，100+ DEX',
      ],
      correctAnswer: 1,
      explanation: '1inch 支持 12+ 条区块链和 200+ 个 DEX，通过智能路由为用户寻找最优交易价格。',
    },
    {
      question: 'Foundry 开发工具链是用什么编程语言编写的？',
      options: ['JavaScript', 'Python', 'Rust', 'Go'],
      correctAnswer: 2,
      explanation:
        'Foundry 是用 Rust 编写的现代化 Solidity 开发工具链，具有极速编译、内置模糊测试等特点。',
    },
    {
      question: 'Hardhat 开发框架的主要编程语言是什么？',
      options: ['Python', 'JavaScript/TypeScript', 'Rust', 'Solidity'],
      correctAnswer: 1,
      explanation:
        'Hardhat 是基于 JavaScript/TypeScript 的以太坊开发框架，提供了编译、测试、部署智能合约的完整工具链。',
    },
    {
      question: 'OpenZeppelin 在 Web3 开发中扮演什么角色？',
      options: [
        '加密货币交易所',
        '提供经过安全审计的标准化智能合约库（如 ERC-20、ERC-721 实现）',
        '区块链浏览器',
        '去中心化存储服务',
      ],
      correctAnswer: 1,
      explanation:
        'OpenZeppelin 提供了业界标准的安全合约库，包括 ERC-20、ERC-721 等代币标准的参考实现，被大量项目采用。',
    },
  ],
  // 默认通用题目
  default: [
    {
      question: '区块链技术的核心特征是什么？',
      options: ['中心化管理', '去中心化和不可篡改', '高速交易', '免费使用'],
      correctAnswer: 1,
      explanation: '区块链的核心特征是去中心化和不可篡改，这使得它成为可信的分布式账本。',
    },
    {
      question: '什么是智能合约？',
      options: ['法律文件', '自动执行的代码', '合同模板', '交易记录'],
      correctAnswer: 1,
      explanation: '智能合约是部署在区块链上的自动执行代码，当条件满足时自动执行预定的操作。',
    },
    {
      question: 'Web3的核心理念是什么？',
      options: ['更快的网络', '用户拥有数据主权', '免费服务', '中心化管理'],
      correctAnswer: 1,
      explanation: 'Web3的核心理念是用户拥有自己的数据和资产，实现真正的数字主权。',
    },
    {
      question: '什么是去中心化（Decentralization）？',
      options: [
        '由单一公司控制系统',
        '系统不依赖单一中心节点，由分布在全球的参与者共同维护',
        '取消所有网络连接',
        '只在一个国家运行',
      ],
      correctAnswer: 1,
      explanation:
        '去中心化意味着没有单一控制点，系统由全球分布的节点共同维护，提高了抗审查性和可靠性。',
    },
    {
      question: '共识机制（Consensus Mechanism）解决的核心问题是什么？',
      options: [
        '提高交易速度',
        '在去中心化网络中，让互不信任的节点就数据状态达成一致',
        '降低存储成本',
        '加密用户数据',
      ],
      correctAnswer: 1,
      explanation:
        '共识机制解决了拜占庭将军问题，使分布在全球的节点在没有中心化协调者的情况下就区块链的状态达成一致。',
    },
  ],
};
