import React, { useState, useEffect } from 'react';
import { 
  Terminal, Wallet, BookOpen, Github, 
  Code, ChevronRight, Activity, 
  CheckCircle, PlayCircle, Award, Layout, ChevronLeft,
  Menu, BrainCircuit, Loader2, Sparkles,
  ArrowRight, Database, FileText, AlertTriangle, ExternalLink,
  Home, UserPlus, FileInput, Star, Dna, Gem, Hash, Zap
} from 'lucide-react';

// -----------------------------------------------------------------------------
// 课程数据配置
// -----------------------------------------------------------------------------
const GITHUB_USERNAME = "beihaili";
const GITHUB_REPO = "Get-Started-with-Web3";
const GITHUB_BRANCH = "main"; 

const getRawBaseUrl = (path) => `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}/`;
const getRawUrl = (path) => `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

const COURSE_DATA = [
  {
    id: 'module-1',
    title: 'Web3 快速入门',
    icon: BookOpen,
    color: 'text-blue-400',
    lessons: [
      { 
        id: '1-1', 
        title: '创建第一个 Web3 身份', 
        path: 'zh/Web3QuickStart/01_FirstWeb3Identity', 
        fallbackContent: `# 正在连接 GitHub...\n\n如果长时间未加载，请检查网络连接。`
      },
      { 
        id: '1-2', 
        title: '体验第一笔交易', 
        path: 'zh/Web3QuickStart/02_FirstWeb3Transaction', 
        fallbackContent: `# Loading...`
      },
      { 
        id: '1-3', 
        title: '体验第一个 DApp', 
        path: 'zh/Web3QuickStart/03_FirstWeb3Dapp', 
        fallbackContent: `# Loading...`
      },
      {
        id: '1-4',
        title: '常用 Web3 网站',
        path: 'zh/Web3QuickStart/04_UsefulWeb3Sites',
        fallbackContent: `# Loading...`
      },
      {
        id: '1-5',
        title: '发行你的第一个代币',
        path: 'zh/Web3QuickStart/05_LaunchYourFirstToken',
        fallbackContent: `# Loading...`
      },
      {
        id: '1-6',
        title: 'Web3 安全基础',
        path: 'zh/Web3QuickStart/06_Web3Security',
        fallbackContent: `# Loading...`
      }
    ]
  },
  {
    id: 'module-2',
    title: '比特币基础',
    icon: Activity, 
    color: 'text-orange-400',
    lessons: [
      { id: '2-1', title: '密码学基础', path: 'zh/GetStartedWithBitcoin/01_Cryptography', fallbackContent: '# Loading...' },
      { id: '2-2', title: '比特币概览', path: 'zh/GetStartedWithBitcoin/02_Overview', fallbackContent: '# Loading...' },
      { id: '2-3', title: '比特币交易结构', path: 'zh/GetStartedWithBitcoin/03_BitcoinTx', fallbackContent: '# Loading...' },
      { id: '2-4', title: '多重签名 (MultiSig)', path: 'zh/GetStartedWithBitcoin/04_MultiSig', fallbackContent: '# Loading...' },
      { id: '2-5', title: '隔离见证 (SegWit)', path: 'zh/GetStartedWithBitcoin/05_SegWit', fallbackContent: '# Loading...' },
      { id: '2-6', title: '数据结构', path: 'zh/GetStartedWithBitcoin/08_DataStructure', fallbackContent: '# Loading...' },
      { id: '2-7', title: 'P2P 协议', path: 'zh/GetStartedWithBitcoin/10_P2PProtocol', fallbackContent: '# Loading...' },
      { id: '2-8', title: '工作量证明 (PoW)', path: 'zh/GetStartedWithBitcoin/12_ProofOfWork', fallbackContent: '# Loading...' },
      { id: '2-9', title: '难度调整机制', path: 'zh/GetStartedWithBitcoin/13_DifficultyAdjustment', fallbackContent: '# Loading...' },
      { id: '2-10', title: '比特币钱包', path: 'zh/GetStartedWithBitcoin/15_BitcoinWallet', fallbackContent: '# Loading...' },
    ]
  },
  {
    id: 'module-3',
    title: 'Web3 深度思考',
    icon: BrainCircuit, 
    color: 'text-purple-400',
    lessons: [
      { id: '3-1', title: 'Web3 基本原则', path: 'zh/Web3Thoughts/01_Principles', fallbackContent: '# Loading...' },
      { id: '3-2', title: '为什么区块链是必须的', path: 'zh/Web3Thoughts/02_WhyBlockchainIsNecessary', fallbackContent: '# Loading...' },
      { id: '3-3', title: '比特币上最酷的交易', path: 'zh/Web3Thoughts/03_TheCoolestTransactionOnBitcoin', fallbackContent: '# Loading...' },
    ]
  }
];

// -----------------------------------------------------------------------------
// 样式配置
// -----------------------------------------------------------------------------
const styles = {
  glowText: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600",
  glassCard: "bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-xl transition-all duration-500 hover:scale-105 hover:bg-slate-800/80 hover:border-cyan-500/40",
  neonButton: "relative cursor-pointer group overflow-hidden px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold transition-all hover:scale-105 active:scale-95",
};

// -----------------------------------------------------------------------------
// 简化的组件（无Canvas/动态样式）
// -----------------------------------------------------------------------------
const WalletSimulator = () => {
  const [step, setStep] = useState(0); 
  const handleConnect = () => { setStep(1); setTimeout(() => setStep(2), 1500); };
  
  return (
    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2"><Wallet className="w-4 h-4 text-cyan-400"/> 钱包模拟器</h3>
        <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 rounded">Interactive</span>
      </div>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-32 flex flex-col justify-center items-center relative">
        {step === 0 && (
          <button onClick={handleConnect} className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105">
            <Wallet className="w-5 h-5" /> Connect Wallet
          </button>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            <span className="text-xs text-slate-400">Requesting signature...</span>
          </div>
        )}
        {step === 2 && (
          <div className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-green-400 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> Connected</span>
              <span className="text-xs text-slate-500">ETH Mainnet</span>
            </div>
            <div className="bg-slate-900 rounded p-2 mb-2">
              <div className="text-[10px] text-slate-500 uppercase">Address</div>
              <div className="text-xs text-cyan-300 font-mono truncate">0x71C...9A23</div>
            </div>
            <button onClick={() => setStep(0)} className="text-[10px] text-slate-500 hover:text-white underline w-full text-center">Disconnect</button>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-4">体验 DApp 如何请求用户授权。你的私钥永远不会离开你的设备。</p>
    </div>
  );
};

const HashVisualizer = () => {
  const [input, setInput] = useState('Web3');
  const [hash, setHash] = useState('');
  
  useEffect(() => {
    // 简单的哈希模拟（避免使用可能有问题的算法）
    let simpleHash = '0x';
    for(let i = 0; i < input.length; i++) {
      simpleHash += (input.charCodeAt(i) * 31 + i).toString(16).padStart(2, '0');
    }
    setHash(simpleHash.substring(0, 18) + '...');
  }, [input]);

  return (
    <div className={`${styles.glassCard} p-6 rounded-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2"><Hash className="w-4 h-4 text-purple-400"/> 哈希可视化</h3>
        <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 rounded">Immutable</span>
      </div>
      <div className="space-y-3">
        <input 
          type="text" 
          value={input} 
          onChange={e=>setInput(e.target.value)} 
          className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors" 
          placeholder="Input data..."
        />
        <div className="w-full bg-black border border-slate-800 text-green-400 font-mono text-xs p-3 rounded break-all shadow-inner h-12 flex items-center transition-all duration-300">
          {hash}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4">区块链不可篡改的基石。修改任意一个字符，哈希指纹都会完全改变。</p>
    </div>
  );
};

const Web3Oracle = () => {
  const [revealed, setRevealed] = useState(false);
  const [fortune] = useState({
    rarity: 'Epic', 
    color: 'text-purple-400', 
    border: 'border-purple-500', 
    bg: 'bg-purple-500/20', 
    text: "今天适合深入学习 Web3 技术！"
  });

  return (
    <div className={`${styles.glassCard} p-8 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[300px] group`}>
      {!revealed ? (
        <div className="space-y-6">
          <div className="w-20 h-20 bg-slate-900 border-2 border-purple-500/50 rounded-full flex items-center justify-center shadow-lg">
            <Gem className="w-10 h-10 text-purple-400" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Web3 每日预言机</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto mb-4">
              获取今日专属的学习建议
            </p>
            <button 
              onClick={() => setRevealed(true)}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-full transition-all transform hover:scale-105"
            >
              <Dna className="w-4 h-4 inline mr-2" />
              获取今日建议
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 w-full">
          <div className={`inline-block px-3 py-1 rounded-full border ${fortune.border} ${fortune.bg} ${fortune.color} text-xs font-bold tracking-widest uppercase`}>
            {fortune.rarity} Drop
          </div>
          <h3 className="text-2xl font-black text-white leading-tight">
            {fortune.text}
          </h3>
          <button 
            onClick={() => setRevealed(false)}
            className="text-slate-500 hover:text-white text-sm flex items-center gap-2 mx-auto transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> 再次尝试
          </button>
        </div>
      )}
    </div>
  );
};

const StarPrompt = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 p-4 rounded-xl shadow-2xl max-w-xs relative">
        <button onClick={() => setVisible(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white">
          <span className="text-sm">×</span>
        </button>
        <div className="flex gap-3 items-start">
          <div className="bg-yellow-500/20 p-2 rounded-lg shrink-0">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">喜欢这个教程吗？</h4>
            <p className="text-xs text-slate-400 mb-3">
              请在 GitHub 上点一颗星 ⭐ 
            </p>
            <a 
              href="https://github.com/beihaili/Get-Started-with-Web3" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-1.5 rounded-lg transition-colors"
            >
              <Github className="w-3 h-3" />
              去点 Star
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Markdown Renderer
// -----------------------------------------------------------------------------
const MarkdownRenderer = ({ content, basePath }) => {
  const parseInline = (text) => {
    if (!text) return null;
    
    // 简化的内联解析，避免复杂的正则表达式
    const parts = text.split(/(\[.*?\]\(.*?\)|\*\*.*?\*\*|`.*?`)/);
    
    return parts.map((part, index) => {
      if (!part) return null;
      
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">
            {linkMatch[1]} <ExternalLink className="w-3 h-3 inline" />
          </a>
        );
      }
      
      const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
      if (boldMatch) return <strong key={index} className="text-white font-bold">{boldMatch[1]}</strong>;
      
      const codeMatch = part.match(/^`(.*?)`$/);
      if (codeMatch) return <code key={index} className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono">{codeMatch[1]}</code>;

      return <span key={index}>{part}</span>;
    });
  };

  const lines = content.split('\n');
  const elements = [];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (line.startsWith('# ')) {
      elements.push(<h1 key={index} className="text-3xl md:text-4xl font-black text-white mt-12 mb-8 border-b border-slate-800 pb-4">{parseInline(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={index} className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">{parseInline(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={index} className="text-xl md:text-2xl font-bold text-cyan-400 mt-8 mb-4">{parseInline(line.slice(4))}</h3>);
    } else if (trimmed.match(/^[\*\-] /)) {
      elements.push(<div key={index} className="ml-4 flex items-start gap-3 mb-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0"></div><div className="flex-1">{parseInline(trimmed.substring(2))}</div></div>);
    } else {
      elements.push(<p key={index} className="mb-4 text-slate-300 leading-7">{parseInline(line)}</p>);
    }
  });

  return <div className="font-sans text-base">{elements}</div>;
};

// Simple Quiz Component
const SimpleQuiz = ({ onPass }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [passed, setPassed] = useState(false);

  const handlePass = () => {
    setPassed(true);
    onPass();
  };

  if (passed) {
    return (
      <div className="flex items-center justify-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-bold gap-2">
        <CheckCircle className="w-6 h-6" /> 课程已完成
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showQuiz ? (
        <button 
          onClick={() => setShowQuiz(true)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all"
        >
          开始课程测验 🧠
        </button>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="text-white font-bold mb-4">理解检查</h4>
          <p className="text-slate-300 mb-4">你已经阅读了本节内容。点击下方按钮标记为已完成：</p>
          <div className="flex gap-3">
            <button 
              onClick={handlePass}
              className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              ✅ 已理解，标记完成
            </button>
            <button 
              onClick={() => setShowQuiz(false)}
              className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              返回
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN APP COMPONENT
// -----------------------------------------------------------------------------
export default function App() {
  const [view, setView] = useState('landing');
  const [activeModule, setActiveModule] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [progress, setProgress] = useState({});
  const [gasPrice, setGasPrice] = useState(12);

  // Content Fetching State
  const [lessonContent, setLessonContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); 
  const [basePath, setBasePath] = useState('');

  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`web3_progress_${address}`);
      if (saved) setProgress(JSON.parse(saved));
    }
  }, [address]);

  // Fetch Content
  useEffect(() => {
    if (!activeLesson) return;
    
    if (!activeLesson.path) {
      setLessonContent(activeLesson.fallbackContent);
      setFetchError(null);
      return;
    }

    const fetchContent = async () => {
      setContentLoading(true);
      setFetchError(null);
      setBasePath(getRawBaseUrl(activeLesson.path));
      
      try {
        const url = getRawUrl(`${activeLesson.path}/README.MD`);
        const res = await fetch(url);
        if (res.ok) {
          const text = await res.text();
          setLessonContent(text);
        } else {
          setFetchError(url); 
          setLessonContent(activeLesson.fallbackContent);
        }
      } catch (err) {
        console.error(err);
        setLessonContent(activeLesson.fallbackContent);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [activeLesson]);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAddress(accounts[0]); 
        setConnected(true);
      } catch (err) { 
        alert("连接失败"); 
      }
    } else {
      setAddress('0x71C...9A23'); 
      setConnected(true); 
      alert("进入演示模式 (未检测到钱包)");
    }
  };

  const handleLessonPass = (lessonId) => {
    if (!connected) return alert("请先连接钱包以保存进度！");
    const newProgress = { ...progress, [lessonId]: true };
    setProgress(newProgress);
    localStorage.setItem(`web3_progress_${address}`, JSON.stringify(newProgress));
  };

  const totalLessons = COURSE_DATA.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = Object.keys(progress).length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);

  // Landing Page
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
        <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 pointer-events-none"></div>
        <StarPrompt />
        
        <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Code className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">Web3 Starter</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-slate-400">Gas:</span>
                <span className="font-bold text-green-400">{gasPrice} Gwei</span>
              </div>
              {connected ? (
                <button onClick={() => setView('dashboard')} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium border border-slate-700 flex items-center gap-2 transition-colors">
                  <Layout className="w-4 h-4" /> Dashboard
                </button>
              ) : (
                <button onClick={connectWallet} className="bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-colors">
                  <Wallet className="w-4 h-4" /> Connect
                </button>
              )}
            </div>
          </div>
        </nav>

        <section className="relative pt-40 pb-20 px-4 text-center max-w-5xl mx-auto z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-8">
            <Sparkles className="w-3 h-3" /> Web3 Education Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
             从 0x00 到 <br />
            <span className={styles.glowText}>Web3 Builder</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            开源、免费、实战导向。为你铺设最清晰的去中心化学习路径。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => { if (!connected) connectWallet(); setView('dashboard'); }} className={styles.neonButton}>
              <span className="relative z-10 flex items-center gap-2">Start Journey <ChevronRight className="w-4 h-4" /></span>
            </button>
            <a href="https://github.com/beihaili/Get-Started-with-Web3" target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full bg-slate-800/50 hover:bg-slate-800 text-white font-bold border border-slate-700 backdrop-blur transition-all flex items-center gap-2 justify-center hover:scale-105">
              <Github className="w-4 h-4" /> Star on GitHub
            </a>
          </div>
        </section>

        <section className="py-20 relative z-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px bg-slate-800 flex-1"></div>
               <span className="text-slate-500 text-sm font-mono uppercase tracking-widest">Interactive Features</span>
               <div className="h-px bg-slate-800 flex-1"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <WalletSimulator />
              <Web3Oracle />
              <HashVisualizer />
            </div>
          </div>
        </section>

        <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800 bg-slate-950 relative z-20">
          Built with React, Tailwind & Vite. Open Source Education.
        </footer>
      </div>
    );
  }

  // Dashboard & Reader
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen fixed md:relative z-20 hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setView('landing')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <Code className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">Web3 Starter</span>
        </div>

        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
               <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold">
                 {address ? address.slice(0,4) : 'V'}
               </div>
             </div>
             <div>
               <div className="text-xs text-slate-400">Builder ID</div>
               <div className="text-sm font-mono text-white font-bold truncate w-24">{address || 'Visitor'}</div>
             </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-400">
              <span>Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1">
          {COURSE_DATA.map((module) => (
            <div key={module.id} className="px-3">
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-2 flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${module.color.replace('text', 'bg')}`}></div> 
                {module.title}
              </div>
              <div className="space-y-0.5">
                {module.lessons.map((lesson) => {
                  const isCompleted = progress[lesson.id];
                  const isActive = activeLesson?.id === lesson.id;
                  return (
                    <button 
                      key={lesson.id} 
                      onClick={() => { setView('reader'); setActiveModule(module); setActiveLesson(lesson); }} 
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}
                    >
                      {isCompleted ? 
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : 
                        <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                      }
                      <span className="truncate text-left">{lesson.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-slate-950 relative">
        {view === 'dashboard' && (
          <div className="p-8 md:p-12 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Builder.</h2>
            <p className="text-slate-400 mb-8 flex items-center gap-2">
              <Terminal className="w-4 h-4"/> 
              System Ready. Continue your Web3 journey.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
               <div className={styles.glassCard + " p-6 rounded-2xl"}>
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-green-500/10 rounded-lg">
                     <CheckCircle className="w-6 h-6 text-green-500"/>
                   </div>
                   <span className="text-xs text-slate-500 font-mono">COMPLETED</span>
                 </div>
                 <div className="text-3xl font-black text-white">
                   {completedCount} <span className="text-sm font-normal text-slate-500">/ {totalLessons}</span>
                 </div>
               </div>
               <div className={styles.glassCard + " p-6 rounded-2xl"}>
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-cyan-500/10 rounded-lg">
                     <Activity className="w-6 h-6 text-cyan-500"/>
                   </div>
                   <span className="text-xs text-slate-500 font-mono">PROGRESS</span>
                 </div>
                 <div className="text-3xl font-black text-white">{progressPercentage}%</div>
               </div>
               <div className={styles.glassCard + " p-6 rounded-2xl relative overflow-hidden"}>
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-yellow-500/10 rounded-lg">
                     <Award className="w-6 h-6 text-yellow-500"/>
                   </div>
                   <span className="text-xs text-slate-500 font-mono">LEVEL</span>
                 </div>
                 <div className="text-3xl font-black text-white">
                   {progressPercentage === 100 ? 'Expert' : 'Learning'}
                 </div>
               </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-cyan-400" /> 继续学习
            </h3>
            <div className="grid gap-4">
              {COURSE_DATA.map(mod => {
                 const firstUnfinished = mod.lessons.find(l => !progress[l.id]);
                 if (!firstUnfinished) return null;
                 return (
                   <div 
                     key={mod.id} 
                     className="group bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 p-6 rounded-xl transition-all cursor-pointer flex justify-between items-center" 
                     onClick={() => { setView('reader'); setActiveModule(mod); setActiveLesson(firstUnfinished); }}
                   >
                      <div className="flex gap-4 items-center">
                        <div className={`w-12 h-12 rounded-lg ${mod.color.replace('text', 'bg')}/10 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                          <mod.icon className={`w-6 h-6 ${mod.color}`} />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{mod.title}</div>
                          <div className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {firstUnfinished.title}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                   </div>
                 )
              })}
              {progressPercentage === 100 && (
                <div className="text-center p-12 border border-dashed border-slate-700 rounded-xl text-slate-500">
                  🎉 所有任务已完成！继续探索 Web3 世界。
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'reader' && activeLesson && (
          <div className="max-w-4xl mx-auto px-6 py-12 relative">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 border-b border-slate-800 pb-4">
              <button 
                className="hover:text-cyan-400 flex items-center gap-1 transition-colors" 
                onClick={() => setView('dashboard')}
              >
                <ChevronLeft className="w-4 h-4" /> Dashboard
              </button>
              <span className="text-slate-700">/</span>
              <span>{activeModule?.title}</span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-300 font-bold">{activeLesson.title}</span>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-8 md:p-12 border border-slate-800/50 shadow-xl">
              {contentLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                  <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p>正在从 GitHub 加载内容...</p>
                </div>
              ) : fetchError ? (
                <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                   <div className="flex justify-center mb-4">
                     <AlertTriangle className="w-8 h-8 text-red-400" />
                   </div>
                   <h3 className="text-lg font-bold text-red-400 mb-2">内容加载失败</h3>
                   <p className="text-slate-400 text-sm mb-4">无法从 GitHub 获取文件，请稍后再试。</p>
                </div>
              ) : (
                <article className="prose prose-invert prose-lg max-w-3xl mx-auto mb-12">
                  <MarkdownRenderer content={lessonContent} basePath={basePath} />
                </article>
              )}

              <div className="border-t border-slate-800 pt-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px bg-slate-800 flex-1"></div>
                  <span className="text-slate-500 text-xs font-mono uppercase">课程测验</span>
                  <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                <SimpleQuiz onPass={() => handleLessonPass(activeLesson.id)} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}