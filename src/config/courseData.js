import { BookOpen, BrainCircuit, Shield, Globe, Cpu, Layers } from 'lucide-react';

// GitHub 配置
export const GITHUB_USERNAME = 'beihaili';
export const GITHUB_REPO = 'Get-Started-with-Web3';
export const GITHUB_BRANCH = 'main';

export const getRawBaseUrl = (path) =>
  `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}/`;
export const getRawUrl = (path) =>
  `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

const FALLBACK = '# 正在加载内容...\n\n请稍候，如果长时间未加载请检查网络连接后刷新页面。';

// 课程数据配置
export const COURSE_DATA = [
  {
    id: 'module-1',
    title: 'Web3 快速入门',
    icon: BookOpen,
    color: 'from-blue-400 to-cyan-400',
    lessons: [
      {
        id: '1-1',
        title: '创建第一个 Web3 身份',
        path: 'zh/Web3QuickStart/01_FirstWeb3Identity',
        fallbackContent: FALLBACK,
      },
      {
        id: '1-2',
        title: '体验第一笔交易',
        path: 'zh/Web3QuickStart/02_FirstWeb3Transaction',
        fallbackContent: FALLBACK,
      },
      {
        id: '1-3',
        title: '体验第一个 DApp',
        path: 'zh/Web3QuickStart/03_FirstWeb3Dapp',
        fallbackContent: FALLBACK,
      },
      {
        id: '1-4',
        title: '常用 Web3 网站',
        path: 'zh/Web3QuickStart/04_UsefulWeb3Sites',
        fallbackContent: FALLBACK,
      },
      {
        id: '1-5',
        title: '发行你的第一个代币',
        path: 'zh/Web3QuickStart/05_LaunchYourFirstToken',
        fallbackContent: FALLBACK,
      },
      {
        id: '1-6',
        title: 'Web3 安全基础',
        path: 'zh/Web3QuickStart/06_Web3Security',
        fallbackContent: FALLBACK,
      },
      {
        id: '1-7',
        title: 'Web3 交易所入门',
        path: 'zh/Web3QuickStart/07_Web3CEX',
        fallbackContent: FALLBACK,
      },
    ],
  },
  {
    id: 'module-2',
    title: '比特币技术 — 密码学与数据层',
    icon: Shield,
    color: 'from-orange-400 to-yellow-400',
    lessons: [
      {
        id: '2-1',
        title: '第01讲 密码学基础',
        path: 'zh/GetStartedWithBitcoin/01_Cryptography',
        fallbackContent: FALLBACK,
      },
      {
        id: '2-2',
        title: '第02讲 比特币概览',
        path: 'zh/GetStartedWithBitcoin/02_Overview',
        fallbackContent: FALLBACK,
      },
      {
        id: '2-3',
        title: '第03讲 比特币交易结构',
        path: 'zh/GetStartedWithBitcoin/03_BitcoinTx',
        fallbackContent: FALLBACK,
      },
      {
        id: '2-4',
        title: '第04讲 多重签名 (MultiSig)',
        path: 'zh/GetStartedWithBitcoin/04_MultiSig',
        fallbackContent: FALLBACK,
      },
      {
        id: '2-5',
        title: '第05讲 隔离见证 (SegWit)',
        path: 'zh/GetStartedWithBitcoin/05_SegWit',
        fallbackContent: FALLBACK,
      },
      {
        id: '2-6',
        title: '第06讲 Taproot 升级详解',
        path: 'zh/GetStartedWithBitcoin/06_Taproot',
        fallbackContent: FALLBACK,
      },
      {
        id: '2-7',
        title: '第07讲 高级交易应用',
        path: 'zh/GetStartedWithBitcoin/07_AdvancedTransactions',
        fallbackContent: FALLBACK,
      },
      {
        id: '2-8',
        title: '第08讲 区块链数据结构',
        path: 'zh/GetStartedWithBitcoin/08_DataStructure',
        fallbackContent: FALLBACK,
      },
    ],
  },
  {
    id: 'module-3',
    title: '比特币技术 — 网络与共识层',
    icon: Globe,
    color: 'from-green-400 to-emerald-400',
    lessons: [
      {
        id: '3-1',
        title: '第09讲 比特币核心节点',
        path: 'zh/GetStartedWithBitcoin/09_BitcoinCore',
        fallbackContent: FALLBACK,
      },
      {
        id: '3-2',
        title: '第10讲 P2P 网络协议',
        path: 'zh/GetStartedWithBitcoin/10_P2PProtocol',
        fallbackContent: FALLBACK,
      },
      {
        id: '3-3',
        title: '第11讲 网络安全',
        path: 'zh/GetStartedWithBitcoin/11_NetworkSecurity',
        fallbackContent: FALLBACK,
      },
      {
        id: '3-4',
        title: '第12讲 工作量证明与挖矿',
        path: 'zh/GetStartedWithBitcoin/12_ProofOfWork',
        fallbackContent: FALLBACK,
      },
      {
        id: '3-5',
        title: '第13讲 难度调整算法',
        path: 'zh/GetStartedWithBitcoin/13_DifficultyAdjustment',
        fallbackContent: FALLBACK,
      },
      {
        id: '3-6',
        title: '第14讲 分叉机制与 BIP 流程',
        path: 'zh/GetStartedWithBitcoin/14_ForksBIPs',
        fallbackContent: FALLBACK,
      },
    ],
  },
  {
    id: 'module-4',
    title: '比特币技术 — 应用层',
    icon: Cpu,
    color: 'from-purple-400 to-pink-400',
    lessons: [
      {
        id: '4-1',
        title: '第15讲 比特币钱包',
        path: 'zh/GetStartedWithBitcoin/15_BitcoinWallet',
        fallbackContent: FALLBACK,
      },
      {
        id: '4-2',
        title: '第16讲 比特币 RPC 应用开发',
        path: 'zh/GetStartedWithBitcoin/16_BitcoinRPC',
        fallbackContent: FALLBACK,
      },
      {
        id: '4-3',
        title: '第17讲 低费率广播工具',
        path: 'zh/GetStartedWithBitcoin/17_BitcoinLowFeeBroadcast',
        fallbackContent: FALLBACK,
      },
      {
        id: '4-4',
        title: '第18讲 Bitcoin Script 脚本系统',
        path: 'zh/GetStartedWithBitcoin/18_BitcoinScript',
        fallbackContent: FALLBACK,
      },
      {
        id: '4-5',
        title: '第19讲 比特币扩容与治理',
        path: 'zh/GetStartedWithBitcoin/19_BitcoinGovernance',
        fallbackContent: FALLBACK,
      },
      {
        id: '4-6',
        title: '第20讲 Ordinals 与生态创新',
        path: 'zh/GetStartedWithBitcoin/20_Ordinals',
        fallbackContent: FALLBACK,
      },
      {
        id: '4-7',
        title: '第21讲 DeFi 跨链',
        path: 'zh/GetStartedWithBitcoin/21_DeFiCrossChain',
        fallbackContent: FALLBACK,
      },
    ],
  },
  {
    id: 'module-5',
    title: 'Web3 深度思考',
    icon: BrainCircuit,
    color: 'from-indigo-400 to-purple-400',
    lessons: [
      {
        id: '5-1',
        title: 'Web3 基本原则',
        path: 'zh/Web3Thoughts/01_Principles',
        fallbackContent: FALLBACK,
      },
      {
        id: '5-2',
        title: '为什么区块链是必须的',
        path: 'zh/Web3Thoughts/02_WhyBlockchainIsNecessary',
        fallbackContent: FALLBACK,
      },
      {
        id: '5-3',
        title: '比特币上最酷的交易',
        path: 'zh/Web3Thoughts/03_TheCoolestTransactionOnBitcoin',
        fallbackContent: FALLBACK,
      },
    ],
  },
  {
    id: 'module-6',
    title: 'Web3 生态与实用工具',
    icon: Layers,
    color: 'from-teal-400 to-emerald-400',
    lessons: [
      {
        id: '6-1',
        title: 'DeFi 去中心化金融',
        path: 'zh/其它学习资源整理/DeFi',
        fallbackContent: FALLBACK,
      },
      {
        id: '6-2',
        title: '以太坊生态概览',
        path: 'zh/其它学习资源整理/Etherum',
        fallbackContent: FALLBACK,
      },
      {
        id: '6-3',
        title: 'Layer 2 扩容技术',
        path: 'zh/其它学习资源整理/Layer2',
        fallbackContent: FALLBACK,
      },
      {
        id: '6-4',
        title: '新兴公链生态 (Solana/Sui/Aptos)',
        path: 'zh/其它学习资源整理/新兴公链生态',
        fallbackContent: FALLBACK,
      },
      {
        id: '6-5',
        title: 'AI + Web3 融合',
        path: 'zh/其它学习资源整理/AI_Web3',
        fallbackContent: FALLBACK,
      },
      {
        id: '6-6',
        title: 'Web3 实用工具大全',
        path: 'zh/其它学习资源整理/实用工具',
        fallbackContent: FALLBACK,
      },
    ],
  },
];
