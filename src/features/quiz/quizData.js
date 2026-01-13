/**
 * 测验题库数据
 * 从原App.jsx迁移 (lines 1982-2104)
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
  ],
};
