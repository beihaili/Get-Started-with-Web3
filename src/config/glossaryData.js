export const GLOSSARY_DATA = [
  {
    term: '区块链 (Blockchain)',
    definition: '一种去中心化的分布式账本技术，通过密码学手段保证数据不可篡改和可追溯。',
    category: '基础概念',
  },
  {
    term: '钱包 (Wallet)',
    definition:
      '管理私钥和公钥的工具，用于签名交易和接收加密资产。并不真正"存储"资产，资产在链上。',
    category: '基础概念',
  },
  {
    term: '私钥 (Private Key)',
    definition: '一串随机生成的数字，是控制链上资产的唯一凭证。永远不要分享你的私钥。',
    category: '密码学',
  },
  {
    term: '公钥 (Public Key)',
    definition: '从私钥通过椭圆曲线算法派生的密钥，可公开分享，用于验证签名和生成地址。',
    category: '密码学',
  },
  {
    term: '助记词 (Seed Phrase)',
    definition: '12 或 24 个英文单词组成的短语，是钱包私钥的可读备份。丢失助记词 = 丢失资产。',
    category: '密码学',
  },
  {
    term: '哈希 (Hash)',
    definition: '将任意长度数据映射为固定长度摘要的函数。比特币使用 SHA-256，不可逆。',
    category: '密码学',
  },
  {
    term: 'UTXO',
    definition:
      'Unspent Transaction Output，比特币的余额模型。你的"余额"是所有未花费交易输出的总和。',
    category: '比特币',
  },
  {
    term: '工作量证明 (PoW)',
    definition: '矿工通过消耗算力竞争出块权的共识机制，比特币网络的核心安全保障。',
    category: '比特币',
  },
  {
    term: 'Taproot',
    definition: '比特币 2021 年的重大升级，引入 Schnorr 签名和 MAST，提升隐私和智能合约能力。',
    category: '比特币',
  },
  {
    term: '隔离见证 (SegWit)',
    definition: '将交易签名数据移出主区块，增加有效容量并修复交易延展性问题。',
    category: '比特币',
  },
  {
    term: '智能合约 (Smart Contract)',
    definition:
      '部署在区块链上的自动执行程序，满足条件自动触发，无需中间人。以太坊是最大的智能合约平台。',
    category: '以太坊',
  },
  {
    term: 'Gas',
    definition: '以太坊网络中衡量计算工作量的单位。每笔交易都需要消耗 Gas，以 ETH 支付。',
    category: '以太坊',
  },
  {
    term: 'ERC-20',
    definition: '以太坊上最常见的同质化代币标准，定义了 transfer、approve 等通用接口。',
    category: '以太坊',
  },
  {
    term: 'ERC-721',
    definition: '非同质化代币 (NFT) 标准，每个代币唯一且不可互换。',
    category: '以太坊',
  },
  {
    term: 'DeFi',
    definition: 'Decentralized Finance，去中心化金融。通过智能合约提供借贷、交易、保险等金融服务。',
    category: 'DeFi',
  },
  {
    term: 'AMM',
    definition:
      'Automated Market Maker，自动做市商。用算法替代传统订单簿来提供流动性，如 Uniswap。',
    category: 'DeFi',
  },
  {
    term: '流动性挖矿 (Yield Farming)',
    definition: '向 DeFi 协议提供流动性以获取代币奖励的行为。高收益伴随高风险。',
    category: 'DeFi',
  },
  {
    term: '钓鱼攻击 (Phishing)',
    definition: '通过伪造网站、空投等方式诱骗用户签署恶意交易或泄露私钥。Web3 最常见的攻击方式。',
    category: '安全',
  },
  {
    term: '授权 (Approve)',
    definition: '允许智能合约代你转移代币。恶意授权是常见的资金损失来源，需定期检查和撤销。',
    category: '安全',
  },
  {
    term: '区块浏览器 (Block Explorer)',
    definition: '查看区块链上所有交易、地址、区块信息的工具。如 Etherscan、Mempool.space。',
    category: '工具',
  },,

  {
    term: `MEV（最大可提取值）`,
    definition: `Maximal Extractable Value，矿工/验证者在区块内通过重组交易顺序可提取的最大价值总和。包括三明治攻击、冰冻糖浆等策略。`,
    category: `DeFi`,
  },

  {
    term: `EIP-4844 / Blob`,
    definition: `以太坊 Danksharding 升级的第一步（Proto-Danksharding），引入 blob 携带额外数据，大幅降低 L2 交易费用（降幅可达 10-100x）。`,
    category: `以太坊`,
  },

  {
    term: `Intents（意图）`,
    definition: `用户表达"想要的结果"而非执行步骤，由求解器自动寻找最优路径执行。Anoma 和 CowSwap 是典型代表。`,
    category: `DeFi`,
  },

  {
    term: `账户抽象 / ERC-4337`,
    definition: `将以太坊账户从 EOA 升级为智能合约账户，支持自定义验证逻辑、社交恢复、多签钱包等复杂功能。`,
    category: `以太坊`,
  },

  {
    term: `隐秘地址（Stealth Address）`,
    definition: `一种隐私协议，用户每次接收资产时使用临时一次性地址，查看者无法将接收方与真实身份关联。`,
    category: `隐私`,
  },

  {
    term: `Rollup（对比侧链）`,
    definition: `Rollup 将交易执行搬到链下但将数据提交到 L1，享有 L1 安全性；侧链自有共识，安全性低于 Rollup。`,
    category: `L2`,
  },

  {
    term: `数据可用性（DA）`,
    definition: `Data Availability，确保区块数据对所有验证者可见。Celestia 和 Ethereum Danksharding 是两种主流 DA 解决方案。`,
    category: `L2`,
  },

  {
    term: `再质押 / EigenLayer`,
    definition: `EigenLayer 允许 ETH 质押者将已质押的 ETH 再次用于其他中间件的安保，实现质押复用并获得额外收益。`,
    category: `DeFi`,
  },

  {
    term: `流动性质押代币（LST）`,
    definition: `Liquid Staking Token，质押 ETH 后获得的流动性凭证（如 stETH），可二次参与 DeFi 收益，同时保留质押收益权。`,
    category: `DeFi`,
  },

  {
    term: `空投耕种（Airdrop Farming）`,
    definition: `用户通过主动使用协议、执行特定操作来最大化获得未来空投代币的概率。`,
    category: `DeFi`,
  }
];

export const GLOSSARY_CATEGORIES = [
  '基础概念',
  '密码学',
  '比特币',
  '以太坊',
  'DeFi',
  '安全',
  '工具',
];
