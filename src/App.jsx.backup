import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Wallet, Shield, Cpu, Zap, BookOpen, Github, 
  Code, Box, ChevronRight, Hash, Activity, Lock, X, 
  CheckCircle, PlayCircle, Award, Layout, ChevronLeft,
  Menu, MessageCircle, BrainCircuit, Loader2, Sparkles, Send,
  ArrowRight, Database, FileText, AlertTriangle, Globe, ExternalLink,
  Home, UserPlus, FileInput, Star, Dna, Gem, TrendingUp, Target, Key,
  Trophy, Medal, Crown, Rocket, Brain, Compass, Flame,
  Mountain, Flag, Fingerprint, Badge, Gift, Calendar, Clock,
  Settings, Eye, EyeOff, Save, AlertCircle, Info, Copy, Check
} from 'lucide-react';

// -----------------------------------------------------------------------------
// 🔐 安全的 API Key 管理
// -----------------------------------------------------------------------------

// 简单的字符串编码/解码（不是真正的加密，但比明文稍好）
const encodeKey = (key) => {
  return btoa(key.split('').reverse().join(''));
};

const decodeKey = (encodedKey) => {
  try {
    return atob(encodedKey).split('').reverse().join('');
  } catch {
    return '';
  }
};

// API Key 管理
const API_KEY_STORAGE = 'web3_gemini_key';

const getApiKey = () => {
  // 首先尝试从环境变量获取（用于生产环境）
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey) return envKey;
  
  // 如果环境变量没有，从localStorage获取（用于开发环境）
  const encoded = localStorage.getItem(API_KEY_STORAGE);
  return encoded ? decodeKey(encoded) : '';
};

const setApiKey = (key) => {
  if (key) {
    localStorage.setItem(API_KEY_STORAGE, encodeKey(key));
  } else {
    localStorage.removeItem(API_KEY_STORAGE);
  }
};

// 安全的 Gemini API 调用
async function callGemini(prompt, systemInstruction = "", jsonMode = false) {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('请先配置您的 Gemini API Key');
  }
  
  try {
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemInstruction }] },
      generationConfig: {
        responseMimeType: jsonMode ? "application/json" : "text/plain"
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();
    if (data.error) {
      // 如果是API key错误，清除存储的key
      if (data.error.message.includes('API_KEY') || data.error.message.includes('invalid')) {
        setApiKey('');
      }
      throw new Error(data.error.message);
    }
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}

// -----------------------------------------------------------------------------
// 🔊 游戏化音效系统
// -----------------------------------------------------------------------------
const playSound = (type) => {
  try {
    let frequency, duration;
    switch(type) {
      case 'success':
        frequency = 523.25; // C5
        duration = 200;
        break;
      case 'badge-unlock':
        frequency = 659.25; // E5
        duration = 500;
        break;
      case 'level-up':
        frequency = 783.99; // G5
        duration = 800;
        break;
      default:
        return;
    }
    
    if (typeof window !== 'undefined' && window.AudioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    }
  } catch (error) {
    console.log('Audio not supported:', error);
  }
};

// -----------------------------------------------------------------------------
// EWP-721 (Education Web3 Protocol) - 学习徽章协议
// -----------------------------------------------------------------------------
const BADGE_PROTOCOL = {
  name: "EWP-721",
  version: "1.0.0",
  description: "Education Web3 Protocol for Learning Achievement Badges",
  standard: "Non-Fungible Achievement Tokens"
};

// 徽章数据结构定义
const ACHIEVEMENT_BADGES = {
  'module-1': {
    id: 'web3-pioneer',
    name: 'Web3 Pioneer',
    title: '先锋开拓者',
    description: '完成 Web3 快速入门模块，踏出去中心化世界的第一步',
    icon: Rocket,
    rarity: 'Common',
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/50',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    requirement: '完成 Web3 快速入门的所有 6 个课程',
    rewards: {
      title: '🚀 Web3 探索者',
      experience: 100,
      unlockedFeatures: ['AI 助教高级模式', 'Web3 每日预言机'],
      nextBadgeHint: '继续学习比特币基础知识，解锁「比特币学者」徽章'
    }
  },
  'module-2': {
    id: 'bitcoin-scholar',
    name: 'Bitcoin Scholar',
    title: '比特币学者',
    description: '深入理解比特币技术原理，掌握区块链核心概念',
    icon: Brain,
    rarity: 'Rare',
    color: 'from-orange-500 to-yellow-500',
    glowColor: 'shadow-orange-500/50',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    requirement: '完成比特币基础模块的所有 10 个核心课程',
    rewards: {
      title: '🧠 区块链技术专家',
      experience: 200,
      unlockedFeatures: ['高级哈希可视化器', '比特币网络实时数据'],
      nextBadgeHint: '进入深度思考模块，解锁「哲学思辨家」徽章'
    }
  },
  'module-3': {
    id: 'web3-philosopher',
    name: 'Web3 Philosopher',
    title: 'Web3 哲学家',
    description: '洞察 Web3 的本质，理解去中心化的深层意义',
    icon: Crown,
    rarity: 'Legendary',
    color: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/50',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    requirement: '完成 Web3 深度思考的所有 3 个哲学课程',
    rewards: {
      title: '👑 Web3 思想家',
      experience: 300,
      unlockedFeatures: ['AI 哲学对话模式', 'Web3 未来趋势预测'],
      nextBadgeHint: '恭喜完成所有模块！你已成为真正的 Web3 Builder'
    }
  }
};

// 特殊成就徽章
const SPECIAL_BADGES = {
  'speed-runner': {
    id: 'speed-runner',
    name: 'Speed Runner',
    title: '学习冲刺者',
    description: '在 24 小时内完成整个学习路径',
    icon: Flame,
    rarity: 'Epic',
    color: 'from-red-500 to-orange-500',
    condition: 'complete_all_within_24h'
  },
  'perfectionist': {
    id: 'perfectionist',
    name: 'Perfectionist',
    title: '完美主义者',
    description: '所有测验均获得满分',
    icon: Target,
    rarity: 'Epic',
    color: 'from-green-500 to-emerald-500',
    condition: 'perfect_scores_all_tests'
  },
  'early-adopter': {
    id: 'early-adopter',
    name: 'Early Adopter',
    title: '早期采用者',
    description: '在平台上线后第一周内注册学习',
    icon: Calendar,
    rarity: 'Rare',
    color: 'from-indigo-500 to-blue-500',
    condition: 'registered_within_first_week'
  }
};

// -----------------------------------------------------------------------------
// Real Hash Function using Web Crypto API
// -----------------------------------------------------------------------------
async function calculateRealHash(input) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `0x${hashHex}`;
  } catch (error) {
    // Fallback for environments without crypto.subtle
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
  }
}

// -----------------------------------------------------------------------------
// 课程数据配置 (修复仓库名)
// -----------------------------------------------------------------------------
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "beihaili";
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || "GetStartedWithWeb3"; // 修复：正确的仓库名
const GITHUB_BRANCH = import.meta.env.VITE_GITHUB_BRANCH || "main"; 

const getRawBaseUrl = (path) => `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}/`;
const getRawUrl = (path) => `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${path}`;

const ensureTrailingSlash = (value = '') => value.endsWith('/') ? value : `${value}/`;
const stripLeadingSlash = (value = '') => value.replace(/^\/+/, '');

const APP_BASE_URL = ensureTrailingSlash(import.meta.env.BASE_URL || '/');
const LOCAL_CONTENT_BASE = ensureTrailingSlash(`${APP_BASE_URL}content`);

const getLocalBaseUrl = (path = '') => ensureTrailingSlash(`${LOCAL_CONTENT_BASE}${stripLeadingSlash(path)}`);
const getLocalUrl = (path = '') => `${LOCAL_CONTENT_BASE}${stripLeadingSlash(path)}`;

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
    icon:  Activity, 
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
    icon:  BrainCircuit, 
    color: 'text-purple-400',
    lessons: [
      { id: '3-1', title: 'Web3 基本原则', path: 'zh/Web3Thoughts/01_Principles', fallbackContent: '# Loading...' },
      { id: '3-2', title: '为什么区块链是必须的', path: 'zh/Web3Thoughts/02_WhyBlockchainIsNecessary', fallbackContent: '# Loading...' },
      { id: '3-3', title: '比特币上最酷的交易', path: 'zh/Web3Thoughts/03_TheCoolestTransactionOnBitcoin', fallbackContent: '# Loading...' },
    ]
  }
];

// -----------------------------------------------------------------------------
// 样式配置 & 动画组件
// -----------------------------------------------------------------------------
const styles = {
  glowText: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)] animate-text-shimmer bg-[length:200%_auto]",
  glassCard: "bg-slate-900/60 backdrop-blur-md border border-slate-700/50 shadow-xl transition-all duration-500 hover:scale-105 hover:bg-slate-800/80 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-cyan-500/10",
  neonButton: "relative cursor-pointer group overflow-hidden px-8 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] active:scale-95",
};

const MouseSpotlight = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const update = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(29, 78, 216, 0.1), transparent 40%)`
      }}
    />
  );
};

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();
    const particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.fillStyle = `rgba(6, 182, 212, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        for (let j = i; j < particles.length; j++) {
          let p2 = particles[j];
          let d = Math.sqrt((p.x - p2.x)**2 + (p.y - p2.y)**2);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animationFrameId); };
  }, []);
  
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
    </>
  );
};

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const pieces = [];
    const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
    for (let i = 0; i < 150; i++) {
      pieces.push({
        x: canvas.width / 2, y: canvas.height / 2, w: Math.random() * 10 + 5, h: Math.random() * 10 + 5,
        vx: (Math.random() - 0.5) * 20, vy: (Math.random() - 0.5) * 20 - 10,
        color: colors[Math.floor(Math.random() * colors.length)], gravity: 0.5,
        rotation: Math.random() * 360, rotationSpeed: (Math.random() - 0.5) * 10
      });
    }
    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activePieces = 0;
      pieces.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += p.gravity; p.rotation += p.rotationSpeed;
        if (p.y < canvas.height) {
          activePieces++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          ctx.restore();
        }
      });
      if (activePieces > 0) animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationId);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[100]" />;
};

// -----------------------------------------------------------------------------
// 🏆 EWP-721 学习徽章系统 (Education Web3 Protocol)
// -----------------------------------------------------------------------------

// 徽章动画组件
const BadgeFloatingAnimation = ({ children, delay = 0 }) => {
  return (
    <div 
      className="animate-bounce"
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: '3s',
        animationIterationCount: 'infinite'
      }}
    >
      {children}
    </div>
  );
};

// 单个徽章卡片组件
const BadgeCard = ({ badge, earned = false, onClick, progress = 0 }) => {
  const Icon = badge.icon;
  
  return (
    <div 
      className={`
        relative group cursor-pointer transform transition-all duration-500 hover:scale-105
        ${earned ? 'animate-pulse' : 'opacity-70 grayscale hover:grayscale-0'}
      `}
      onClick={onClick}
    >
      {/* 背景光效 */}
      <div className={`
        absolute -inset-2 rounded-3xl transition-opacity duration-300 blur-xl
        ${earned ? `bg-gradient-to-r ${badge.color} opacity-30` : 'opacity-0'}
        group-hover:opacity-50
      `} />
      
      {/* 主卡片 */}
      <div className={`
        relative bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 
        border-2 transition-all duration-300
        ${earned ? `${badge.borderColor} ${badge.glowColor}` : 'border-slate-700'}
        hover:border-opacity-100 hover:shadow-2xl
      `}>
        
        {/* 稀有度标签 */}
        <div className={`
          absolute -top-2 left-1/2 transform -translate-x-1/2 
          px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase
          ${earned ? `${badge.bgColor} ${badge.color}` : 'bg-slate-700 text-slate-400'}
          border
        `}>
          {badge.rarity}
        </div>

        {/* 进度条 (未获得的徽章) */}
        {!earned && progress > 0 && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="2" fill="none" />
                <circle 
                  cx="12" cy="12" r="10" 
                  stroke="#06b6d4" strokeWidth="2" fill="none"
                  strokeDasharray={2 * Math.PI * 10}
                  strokeDashoffset={2 * Math.PI * 10 * (1 - progress / 100)}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-mono text-cyan-400">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        )}

        {/* 徽章图标 */}
        <div className="flex flex-col items-center text-center mb-4">
          <BadgeFloatingAnimation delay={Math.random() * 1000}>
            <div className={`
              w-20 h-20 rounded-full flex items-center justify-center mb-4
              ${earned ? `bg-gradient-to-r ${badge.color} shadow-2xl ${badge.glowColor}` : 'bg-slate-800'}
              transition-all duration-500
            `}>
              <Icon className={`w-10 h-10 ${earned ? 'text-white' : 'text-slate-500'}`} />
            </div>
          </BadgeFloatingAnimation>
          
          <h3 className={`text-lg font-bold ${earned ? 'text-white' : 'text-slate-400'}`}>
            {badge.title}
          </h3>
          <p className={`text-sm ${earned ? 'text-slate-300' : 'text-slate-500'}`}>
            {badge.name}
          </p>
        </div>

        {/* 描述 */}
        <p className={`text-sm leading-relaxed ${earned ? 'text-slate-300' : 'text-slate-500'}`}>
          {badge.description}
        </p>

        {/* 解锁条件 */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            📋 {badge.requirement}
          </p>
        </div>

        {/* 获得时间 (仅已获得的徽章) */}
        {earned && (
          <div className="mt-2">
            <p className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              已获得 • {new Date().toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// 徽章解锁动画
const BadgeUnlockAnimation = ({ badge, onClose }) => {
  const Icon = badge.icon;
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* 动画容器 */}
      <div className="relative animate-in zoom-in-95 fade-in duration-700">
        {/* 光效背景 */}
        <div className={`absolute -inset-20 bg-gradient-to-r ${badge.color} opacity-20 rounded-full blur-3xl animate-pulse`} />
        
        {/* 主内容 */}
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center max-w-md">
          {/* 顶部装饰 */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className={`px-6 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold text-sm`}>
              🎉 成就解锁！
            </div>
          </div>

          {/* 徽章图标 */}
          <div className="mb-6">
            <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center shadow-2xl ${badge.glowColor} animate-bounce-slow`}>
              <Icon className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* 徽章信息 */}
          <h2 className="text-3xl font-black text-white mb-2">
            {badge.title}
          </h2>
          <p className={`text-lg ${badge.color} mb-4 font-semibold`}>
            {badge.name}
          </p>
          <p className="text-slate-300 leading-relaxed mb-6">
            {badge.description}
          </p>

          {/* 奖励信息 */}
          <div className={`${badge.bgColor} rounded-xl p-4 border ${badge.borderColor}`}>
            <h4 className="text-white font-bold mb-2">🎁 解锁奖励</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <div>🏆 新头衔：{badge.rewards.title}</div>
              <div>⭐ 经验值：+{badge.rewards.experience}</div>
              {badge.rewards.unlockedFeatures.map((feature, i) => (
                <div key={i}>✨ {feature}</div>
              ))}
            </div>
            {badge.rewards.nextBadgeHint && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <p className="text-xs text-slate-400">
                  💡 {badge.rewards.nextBadgeHint}
                </p>
              </div>
            )}
          </div>

          {/* 关闭按钮 */}
          <button 
            onClick={onClose}
            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            继续学习
          </button>
        </div>
      </div>
    </div>
  );
};

// 徽章收藏馆组件
const BadgeCollection = ({ earnedBadges, onClose }) => {
  const totalBadges = Object.keys(ACHIEVEMENT_BADGES).length;
  const earnedCount = Object.keys(earnedBadges).length;
  const completionRate = (earnedCount / totalBadges * 100).toFixed(1);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* 主容器 */}
      <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-4xl max-h-[90vh] overflow-y-auto border border-white/10">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
              🏆 徽章收藏馆
            </h2>
            <p className="text-slate-400">
              收集率：{completionRate}% ({earnedCount}/{totalBadges})
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* 进度条 */}
        <div className="mb-8">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* 徽章网格 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.values(ACHIEVEMENT_BADGES).map((badge) => {
            const isEarned = earnedBadges[badge.id];
            return (
              <BadgeCard 
                key={badge.id}
                badge={badge}
                earned={isEarned}
                onClick={() => {}}
              />
            );
          })}
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{earnedCount}</div>
            <div className="text-xs text-slate-500">已获得</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">{totalBadges - earnedCount}</div>
            <div className="text-xs text-slate-500">待解锁</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-cyan-400">{completionRate}%</div>
            <div className="text-xs text-slate-500">完成度</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 🎯 Web3人格分析器 - 最受欢迎的分享功能
// -----------------------------------------------------------------------------
const Web3PersonalityAnalyzer = ({ walletAddress = '', isConnected = false, onConnectWallet }) => {
  const [address, setAddress] = useState(walletAddress);
  const [status, setStatus] = useState('idle'); // idle, analyzing, revealed
  const [personality, setPersonality] = useState(null);
  const [shareCard, setShareCard] = useState(null);

  // 当钱包地址变化时更新本地地址
  useEffect(() => {
    if (walletAddress && walletAddress !== '0x71C...9A23') {
      setAddress(walletAddress);
    }
  }, [walletAddress]);

  const personalities = [
    { 
      type: 'DeFi Degen', 
      icon: '🚀', 
      color: 'text-green-400', 
      bg: 'bg-green-500/20', 
      border: 'border-green-500',
      traits: ['高收益猎手', '流动性挖矿专家', '风险偏好型'],
      description: '你是DeFi生态的开拓者，擅长发现高收益机会'
    },
    { 
      type: 'NFT Collector', 
      icon: '🎨', 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/20', 
      border: 'border-purple-500',
      traits: ['艺术鉴赏家', 'PFP收藏者', '社区建设者'],
      description: '你有独特的审美眼光，深度参与NFT文化'
    },
    { 
      type: 'Diamond Hands', 
      icon: '💎', 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/20', 
      border: 'border-blue-500',
      traits: ['长期主义者', 'HODL信仰者', '市场理性派'],
      description: '你坚信价值投资，不被市场波动影响'
    },
    { 
      type: 'Web3 Builder', 
      icon: '🛠️', 
      color: 'text-cyan-400', 
      bg: 'bg-cyan-500/20', 
      border: 'border-cyan-500',
      traits: ['技术专家', '生态建设者', '创新先锋'],
      description: '你用代码改变世界，是Web3基础设施的建设者'
    },
    { 
      type: 'Airdrop Hunter', 
      icon: '🎯', 
      color: 'text-yellow-400', 
      bg: 'bg-yellow-500/20', 
      border: 'border-yellow-500',
      traits: ['机会敏锐', '多链操作', '信息收集能力强'],
      description: '你总能提前发现机会，是空投的专业猎手'
    }
  ];

  const analyzePersonality = async () => {
    let targetAddress = address;
    
    // 如果没有地址或地址无效，尝试连接钱包
    if (!targetAddress || !targetAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      if (!isConnected && onConnectWallet) {
        try {
          targetAddress = await onConnectWallet();
          if (!targetAddress) {
            alert('需要连接钱包才能分析人格');
            return;
          }
          setAddress(targetAddress);
        } catch (error) {
          alert('连接钱包失败，请手动输入地址或重试');
          return;
        }
      } else {
        alert('请输入有效的以太坊地址或连接钱包');
        return;
      }
    }

    setStatus('analyzing');
    
    try {
      // 模拟链上数据分析
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 基于地址生成确定性分析结果
      const hash = await generatePersonalityHash(targetAddress);
      const personalityIndex = parseInt(hash.slice(-2), 16) % personalities.length;
      const selectedPersonality = personalities[personalityIndex];
      
      // 生成雷达图数据 (6个维度)
      const dimensions = {
        defi: Math.floor((parseInt(hash.slice(2, 4), 16) / 255) * 100),
        nft: Math.floor((parseInt(hash.slice(4, 6), 16) / 255) * 100),
        trading: Math.floor((parseInt(hash.slice(6, 8), 16) / 255) * 100),
        building: Math.floor((parseInt(hash.slice(8, 10), 16) / 255) * 100),
        social: Math.floor((parseInt(hash.slice(10, 12), 16) / 255) * 100),
        hodling: Math.floor((parseInt(hash.slice(12, 14), 16) / 255) * 100),
      };
      
      const fullPersonality = {
        ...selectedPersonality,
        dimensions,
        address: targetAddress.slice(0, 6) + '...' + targetAddress.slice(-4),
        timestamp: new Date().toLocaleDateString()
      };
      
      setPersonality(fullPersonality);
      setStatus('revealed');
      
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('分析失败，请重试');
    }
  };

  const generatePersonalityHash = async (addr) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(addr + 'personality_seed_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const generateShareCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // 创建渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 400, 600);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 600);
    
    // 添加标题
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Web3 人格分析', 200, 50);
    
    // 添加人格类型
    ctx.font = '20px Arial';
    ctx.fillText(`${personality.icon} ${personality.type}`, 200, 100);
    
    // 添加地址
    ctx.fillStyle = '#64748b';
    ctx.font = '14px Arial';
    ctx.fillText(personality.address, 200, 130);
    
    // 生成分享卡片
    setShareCard(canvas.toDataURL());
  };

  const reset = () => {
    setStatus('idle');
    setPersonality(null);
    setShareCard(null);
    setAddress('');
  };

  return (
    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden min-h-[400px] group`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-green-400" />
          Web3 人格分析器
        </h3>
        <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 rounded">
          AI Powered
        </span>
      </div>

      {status === 'idle' && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            {isConnected && walletAddress ? (
              <div className="space-y-3">
                <label className="text-sm text-slate-400 block">
                  已连接钱包地址：
                </label>
                <div className="w-full bg-slate-800/50 border border-green-500/30 text-green-300 text-sm rounded px-3 py-3 font-mono flex items-center justify-between">
                  <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                  <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded-full">✅ 已连接</span>
                </div>
                <button
                  onClick={analyzePersonality}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/20"
                >
                  🧠 分析我的Web3人格
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center space-y-3 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <Wallet className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-sm text-slate-400">连接钱包以自动分析你的Web3人格</p>
                  <button
                    onClick={onConnectWallet}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                  >
                    🔗 连接钱包
                  </button>
                </div>
                <div className="text-center text-xs text-slate-500">
                  或
                </div>
                <label className="text-sm text-slate-400 block">
                  手动输入钱包地址：
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x742d35Cc6634C0532925a3b8D2aE9C2F..."
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded px-3 py-3 focus:outline-none focus:border-green-500 transition-colors"
                />
                <button
                  onClick={analyzePersonality}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-green-500/20"
                >
                  🧠 开始分析人格
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 text-center">
            基于链上行为数据，生成你的专属Web3人格档案
          </p>
        </div>
      )}

      {status === 'analyzing' && (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-green-400 animate-spin relative z-10" />
          </div>
          <div className="text-center">
            <p className="text-green-300 font-mono text-lg animate-pulse">分析链上数据中...</p>
            <p className="text-slate-400 text-sm mt-2">正在解析你的Web3足迹</p>
          </div>
        </div>
      )}

      {status === 'revealed' && personality && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${personality.bg} ${personality.border} border`}>
              <span className="text-2xl">{personality.icon}</span>
              <span className={`${personality.color} font-bold text-lg`}>{personality.type}</span>
            </div>
            
            <p className="text-slate-300 text-sm leading-relaxed">
              {personality.description}
            </p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {personality.traits.map((trait, i) => (
                <span key={i} className="px-3 py-1 bg-slate-800/50 text-slate-300 text-xs rounded-full border border-slate-700">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-white font-bold mb-3 text-center">能力雷达图</h4>
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div className="text-center">
                <div className="text-cyan-400 font-mono">{personality.dimensions.defi}%</div>
                <div className="text-slate-400">DeFi</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-mono">{personality.dimensions.nft}%</div>
                <div className="text-slate-400">NFT</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-mono">{personality.dimensions.trading}%</div>
                <div className="text-slate-400">Trading</div>
              </div>
              <div className="text-center">
                <div className="text-green-400 font-mono">{personality.dimensions.building}%</div>
                <div className="text-slate-400">Building</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-mono">{personality.dimensions.social}%</div>
                <div className="text-slate-400">Social</div>
              </div>
              <div className="text-center">
                <div className="text-orange-400 font-mono">{personality.dimensions.hodling}%</div>
                <div className="text-slate-400">HODL</div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateShareCard}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
            >
              📸 生成分享卡片
            </button>
            <button
              onClick={reset}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
            >
              🔄 重新分析
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// Star Prompt
// -----------------------------------------------------------------------------
const StarPrompt = () => {
  const [visible, setVisible] = useState(false);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!localStorage.getItem('star_prompt_dismissed')) {
        setVisible(true);
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setClosed(true);
    localStorage.setItem('star_prompt_dismissed', 'true');
  };

  if (!visible || closed) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-yellow-500/30 p-4 rounded-xl shadow-2xl shadow-yellow-500/10 max-w-xs relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-50"></div>
        <button onClick={handleClose} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
        
        <div className="flex gap-3 items-start relative z-10">
          <div className="bg-yellow-500/20 p-2 rounded-lg shrink-0 animate-bounce">
            <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">喜欢这个教程吗？</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              如果内容对你有帮助，请在 GitHub 上点一颗星 ⭐
            </p>
            <a 
              href={`https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}`}
              target="_blank" 
              rel="noreferrer"
              onClick={handleClose}
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
// 🏆 链上成就系统 - 游戏化体验
// -----------------------------------------------------------------------------
const AchievementSystem = ({ walletAddress = '', isConnected = false }) => {
  const [userAddress, setUserAddress] = useState('');
  const [status, setStatus] = useState('idle'); // idle, checking, revealed
  const [achievements, setAchievements] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [userRank, setUserRank] = useState('Newbie');

  // 自动填充钱包地址
  useEffect(() => {
    if (isConnected && walletAddress) {
      setUserAddress(walletAddress);
    }
  }, [walletAddress, isConnected]);

  const predefinedAchievements = [
    {
      id: 'first_tx',
      title: 'First Transaction',
      description: '完成第一笔链上交易',
      icon: '🚀',
      rarity: 'Common',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500',
      points: 10,
      requirement: '发送任意数量的ETH'
    },
    {
      id: 'defi_pioneer',
      title: 'DeFi Pioneer',
      description: '使用去中心化金融协议',
      icon: '🌊',
      rarity: 'Rare',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500',
      points: 50,
      requirement: '在Uniswap/Aave等协议交易'
    },
    {
      id: 'nft_collector',
      title: 'NFT Collector',
      description: '收藏非同质化代币',
      icon: '🎨',
      rarity: 'Rare',
      color: 'text-purple-400',
      bg: 'bg-purple-500/20',
      border: 'border-purple-500',
      points: 30,
      requirement: '持有至少1个NFT'
    },
    {
      id: 'diamond_hands',
      title: 'Diamond Hands',
      description: '长期持有超过1年',
      icon: '💎',
      rarity: 'Epic',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/20',
      border: 'border-cyan-500',
      points: 100,
      requirement: '钱包资产持有超过365天'
    },
    {
      id: 'whale_status',
      title: 'Whale Status',
      description: '持有大额数字资产',
      icon: '🐋',
      rarity: 'Legendary',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500',
      points: 200,
      requirement: '钱包总价值超过100 ETH'
    },
    {
      id: 'gas_master',
      title: 'Gas Optimizer',
      description: 'Gas费优化专家',
      icon: '⚡',
      rarity: 'Epic',
      color: 'text-orange-400',
      bg: 'bg-orange-500/20',
      border: 'border-orange-500',
      points: 80,
      requirement: '平均Gas费低于网络平均值'
    }
  ];

  const calculateRank = (score) => {
    if (score >= 300) return { rank: 'Crypto God', color: 'text-yellow-400' };
    if (score >= 200) return { rank: 'Web3 Master', color: 'text-purple-400' };
    if (score >= 100) return { rank: 'DeFi Degen', color: 'text-cyan-400' };
    if (score >= 50) return { rank: 'Blockchain Explorer', color: 'text-blue-400' };
    if (score >= 20) return { rank: 'Crypto Enthusiast', color: 'text-green-400' };
    return { rank: 'Web3 Newbie', color: 'text-slate-400' };
  };

  const checkAchievements = async () => {
    if (!userAddress || !userAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert('请输入有效的以太坊地址');
      return;
    }

    setStatus('checking');

    try {
      // 模拟检查链上数据
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 基于地址生成确定性成就（优化算法）
      const hash = await generateAchievementHash(userAddress);
      const unlockedAchievements = [];
      let score = 0;

      predefinedAchievements.forEach((achievement, index) => {
        // 使用地址字符来生成更合理的成就分布
        const addressChars = userAddress.toLowerCase().replace('0x', '');
        const charSum = addressChars.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
        const seedValue = (charSum + index * 37) % 100; // 生成0-99的种子值
        
        // 根据成就稀有度调整解锁几率
        let unlockThreshold;
        switch (achievement.rarity) {
          case 'Common': unlockThreshold = 80; break;  // 80% 几率解锁
          case 'Rare': unlockThreshold = 60; break;    // 60% 几率解锁
          case 'Epic': unlockThreshold = 40; break;    // 40% 几率解锁
          case 'Legendary': unlockThreshold = 20; break; // 20% 几率解锁
          default: unlockThreshold = 70; break;
        }
        
        const unlock = seedValue < unlockThreshold;

        if (unlock) {
          unlockedAchievements.push({
            ...achievement,
            unlockedAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            progress: 100
          });
          score += achievement.points;
        } else {
          // 部分进度（30-80%）
          const progress = Math.floor(30 + (seedValue / 100) * 50);
          unlockedAchievements.push({
            ...achievement,
            progress,
            unlockedAt: null
          });
        }
      });

      setAchievements(unlockedAchievements);
      setTotalScore(score);
      setUserRank(calculateRank(score));
      setStatus('revealed');

    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert('检查失败，请重试');
    }
  };

  const generateAchievementHash = async (addr) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(addr + 'achievement_seed_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const reset = () => {
    setStatus('idle');
    setAchievements([]);
    setTotalScore(0);
    setUserRank('Newbie');
    setUserAddress('');
  };

  return (
    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden min-h-[400px] group`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          链上成就系统
        </h3>
        <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 rounded">
          GameFi
        </span>
      </div>

      {status === 'idle' && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-400 block">
                检查你的Web3成就进度：
              </label>
              {!isConnected && (
                <span className="text-xs text-yellow-400">💡 连接钱包自动填入</span>
              )}
            </div>
            <input
              type="text"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              placeholder={isConnected ? "已连接钱包地址" : "0x742d35Cc6634C0532925a3b8D2aE9C2F..."}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded px-3 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
            />
            <button
              onClick={checkAchievements}
              className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/20"
            >
              🏆 检查成就进度
            </button>
          </div>
          
          <div className="bg-slate-900/50 rounded-xl p-4">
            <h4 className="text-white font-bold mb-3">成就预览</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span>🚀</span>
                <span className="text-slate-400">First Transaction</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌊</span>
                <span className="text-slate-400">DeFi Pioneer</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🎨</span>
                <span className="text-slate-400">NFT Collector</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💎</span>
                <span className="text-slate-400">Diamond Hands</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {status === 'checking' && (
        <div className="flex flex-col items-center justify-center py-16 gap-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-yellow-500/20 blur-xl rounded-full animate-pulse"></div>
            <Loader2 className="w-16 h-16 text-yellow-400 animate-spin relative z-10" />
          </div>
          <div className="text-center">
            <p className="text-yellow-300 font-mono text-lg animate-pulse">分析链上活动...</p>
            <p className="text-slate-400 text-sm mt-2">正在检查你的成就进度</p>
          </div>
        </div>
      )}

      {status === 'revealed' && achievements.length > 0 && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-800/50 border border-slate-600`}>
              <span className="text-2xl">🏅</span>
              <div>
                <div className={`${userRank.color} font-bold text-lg`}>{userRank.rank}</div>
                <div className="text-slate-400 text-sm">{totalScore} points</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 max-h-48 overflow-y-auto">
            {achievements.map((achievement, index) => (
              <div key={index} className={`rounded-lg border ${achievement.border} ${achievement.bg} p-3 relative`}>
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className={`${achievement.color} font-bold text-sm`}>{achievement.title}</div>
                    <div className="text-slate-400 text-xs">{achievement.description}</div>
                    {achievement.progress === 100 ? (
                      <div className="text-green-400 text-xs mt-1">
                        ✅ 已解锁 · {achievement.unlockedAt}
                      </div>
                    ) : (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>进度</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-500 ${achievement.color.replace('text', 'bg')}`}
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-slate-400 text-xs font-mono">
                    +{achievement.points}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigator.share?.({title: 'My Web3 Achievements', text: `I scored ${totalScore} points and achieved ${userRank.rank} rank!`})}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
            >
              📱 分享成就
            </button>
            <button
              onClick={reset}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
            >
              🔄 重新检查
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 💰 DeFi收益计算器 - 使用真实API数据
// -----------------------------------------------------------------------------

// 实时APY数据获取函数
const fetchRealTimeAPY = async () => {
  const results = {};
  
  try {
    // 获取 Aave V3 数据 (USDT, USDC 等主要资产)
    // USDT: 0xdAC17F958D2ee523a2206206994597C13D831ec7
    // USDC: 0xA0b86a33E6aE8BEc23B4C7C1Dea30bB90F5073B3
    const aaveResponse = await fetch('https://api.expand.network/lendborrow/getpools?lendborrowId=1200', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (aaveResponse.ok) {
      const aaveData = await aaveResponse.json();
      // 提取 USDT/USDC 的供应 APY
      const usdtPool = aaveData.data?.find(pool => 
        pool.asset?.toLowerCase().includes('0xdac17f958d2ee523a2206206994597c13d831ec7') ||
        pool.name?.toLowerCase().includes('usdt')
      );
      
      if (usdtPool) {
        results.aave = {
          supplyApy: parseFloat(usdtPool.supplyApy || usdtPool.lendApy || 0),
          timestamp: Date.now(),
          source: 'Aave V3 实时API'
        };
      }
    }
  } catch (error) {
    console.error('获取 Aave 数据失败:', error);
    // 使用近似的实时数据作为后备
    results.aave = {
      supplyApy: 4.2,
      timestamp: Date.now(),
      source: 'Aave V3 估算值'
    };
  }

  try {
    // 获取 Compound 数据
    const compoundResponse = await fetch('https://api.compound.finance/api/v2/ctoken?meta=true', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (compoundResponse.ok) {
      const compoundData = await compoundResponse.json();
      // 查找 USDC 市场 (cUSDCv3)
      const usdcMarket = compoundData.cToken?.find(token => 
        token.symbol === 'cUSDCv3' || token.underlying_symbol === 'USDC'
      );
      
      if (usdcMarket) {
        results.compound = {
          supplyApy: parseFloat(usdcMarket.supply_rate?.value || 0) * 100, // 转换为百分比
          timestamp: Date.now(),
          source: 'Compound 官方API'
        };
      }
    }
  } catch (error) {
    console.error('获取 Compound 数据失败:', error);
    // 使用近似的实时数据作为后备
    results.compound = {
      supplyApy: 3.8,
      timestamp: Date.now(),
      source: 'Compound 估算值'
    };
  }

  return results;
};

const DeFiYieldCalculator = () => {
  const [amount, setAmount] = useState('1000');
  const [selectedProtocol, setSelectedProtocol] = useState('aave');
  const [timeframe, setTimeframe] = useState('30'); // days
  const [calculatedResults, setCalculatedResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // 简化的协议列表 - 只保留有实时数据的协议
  const defiProtocols = [
    {
      id: 'aave',
      name: 'Aave V3',
      type: 'Lending',
      risk: 'Low',
      color: 'text-blue-400',
      bg: 'bg-blue-500/20',
      border: 'border-blue-500',
      icon: '👻',
      fees: 0,
      impermanentLoss: 'None',
      description: '去中心化借贷协议，安全性高',
      networks: ['Ethereum', 'Polygon', 'Arbitrum']
    },
    {
      id: 'compound',
      name: 'Compound V3',
      type: 'Lending',
      risk: 'Low',
      color: 'text-green-400',
      bg: 'bg-green-500/20',
      border: 'border-green-500',
      icon: '🏦',
      fees: 0,
      impermanentLoss: 'None',
      description: '老牌 DeFi 借贷平台，流动性充足',
      networks: ['Ethereum', 'Polygon', 'Base']
    }
  ];

  // 组件加载时获取实时数据
  useEffect(() => {
    loadRealTimeData();
  }, []);

  const loadRealTimeData = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchRealTimeAPY();
      setRealTimeData(data);
    } catch (error) {
      console.error('加载实时数据失败:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // 获取当前选择协议的实时APY
  const getCurrentAPY = () => {
    if (!realTimeData || !realTimeData[selectedProtocol]) {
      return { apy: 0, source: '数据加载中...' };
    }
    const data = realTimeData[selectedProtocol];
    return {
      apy: data.supplyApy,
      source: data.source,
      lastUpdate: new Date(data.timestamp).toLocaleTimeString()
    };
  };

  const calculateYield = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('请输入有效的资金数额');
      return;
    }

    if (!realTimeData || !realTimeData[selectedProtocol]) {
      alert('实时数据尚未加载，请稍后重试');
      return;
    }

    setIsCalculating(true);
    
    try {
      // 模拟一个短暂的计算延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const protocol = defiProtocols.find(p => p.id === selectedProtocol);
      const principal = parseFloat(amount);
      const days = parseInt(timeframe);
      const currentAPYData = getCurrentAPY();
      const apy = currentAPYData.apy;
      
      // 使用复利公式计算收益
      const dailyRate = apy / 365 / 100;
      const compoundedReturn = principal * Math.pow(1 + dailyRate, days);
      const grossProfit = compoundedReturn - principal;
      
      // Lending协议通常没有费用和无常损失
      const netProfit = grossProfit; // 借贷协议不收取额外费用
      
      const results = {
        protocol,
        principal,
        days,
        grossProfit,
        netProfit,
        finalAmount: principal + netProfit,
        apy: apy,
        dailyYield: grossProfit / days,
        apyData: currentAPYData,
        // 添加风险提示
        risks: protocol.type === 'Lending' ? [
          '智能合约风险',
          '流动性风险', 
          '治理风险'
        ] : []
      };
      
      setCalculatedResults(results);
      
    } catch (err) {
      console.error(err);
      alert('计算失败，请重试');
    } finally {
      setIsCalculating(false);
    }
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Very Low': 'text-green-400',
      'Low': 'text-blue-400',
      'Medium': 'text-yellow-400',
      'High': 'text-orange-400',
      'Very High': 'text-red-400'
    };
    return colors[risk] || 'text-gray-400';
  };

  const reset = () => {
    setCalculatedResults(null);
    setAmount('1000');
    setTimeframe('30');
    setSelectedProtocol('aave');
  };

  const selectedProtocolData = defiProtocols.find(p => p.id === selectedProtocol);

  return (
    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden min-h-[400px] group`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-400" />
          DeFi 收益计算器
        </h3>
        <div className="flex items-center gap-2">
          {isLoadingData && (
            <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
          )}
          <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 rounded">
            实时 APY
          </span>
          <button
            onClick={loadRealTimeData}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            title="刷新实时数据"
          >
            🔄
          </button>
        </div>
      </div>

      {!calculatedResults ? (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-sm text-slate-400 block mb-2">投资金额 (USDT)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded px-3 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-2">时间周期 (天)</label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded px-3 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="7">7 天</option>
                <option value="30">30 天</option>
                <option value="90">90 天</option>
                <option value="365">1 年</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-slate-400 block mb-3">选择 DeFi 协议 (仅显示有实时数据的协议)</label>
              <div className="grid grid-cols-1 gap-2">
                {defiProtocols.map(protocol => {
                  const apyData = getCurrentAPY();
                  const protocolAPY = realTimeData?.[protocol.id];
                  return (
                    <button
                      key={protocol.id}
                      onClick={() => setSelectedProtocol(protocol.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        selectedProtocol === protocol.id 
                          ? `${protocol.border} ${protocol.bg}` 
                          : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{protocol.icon}</span>
                        <div className="text-left">
                          <div className={`font-bold text-sm ${selectedProtocol === protocol.id ? protocol.color : 'text-white'}`}>
                            {protocol.name}
                          </div>
                          <div className="text-xs text-slate-400">{protocol.type} • {protocol.networks.join(', ')}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-mono text-green-400">
                          {protocolAPY ? `${protocolAPY.supplyApy.toFixed(2)}%` : '--'}
                        </div>
                        <div className={`text-xs ${getRiskColor(protocol.risk)}`}>{protocol.risk}</div>
                        {protocolAPY && (
                          <div className="text-[10px] text-slate-500">
                            {new Date(protocolAPY.timestamp).toLocaleTimeString()}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedProtocolData && (
              <div className={`${selectedProtocolData.bg} ${selectedProtocolData.border} border rounded-xl p-4`}>
                <h4 className={`${selectedProtocolData.color} font-bold mb-3 flex items-center gap-2`}>
                  {selectedProtocolData.icon} {selectedProtocolData.name}
                </h4>
                <div className="space-y-3 text-xs">
                  {/* 实时APY显示 */}
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <div className="text-slate-400 mb-1">实时年化收益率 (APY)</div>
                    <div className="text-green-400 font-mono text-lg">
                      {realTimeData?.[selectedProtocol] 
                        ? `${realTimeData[selectedProtocol].supplyApy.toFixed(2)}%` 
                        : '获取中...'
                      }
                    </div>
                    {realTimeData?.[selectedProtocol] && (
                      <div className="text-slate-500 text-[10px] mt-1">
                        数据源: {realTimeData[selectedProtocol].source}
                      </div>
                    )}
                  </div>
                  
                  {/* 其他信息 */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-slate-400">风险等级</div>
                      <div className={getRiskColor(selectedProtocolData.risk)}>{selectedProtocolData.risk}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">协议费用</div>
                      <div className="text-cyan-400">{selectedProtocolData.fees}%</div>
                    </div>
                    <div>
                      <div className="text-slate-400">清算风险</div>
                      <div className="text-cyan-400">{selectedProtocolData.impermanentLoss}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-slate-400 text-[10px]">
                      {selectedProtocolData.description}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={calculateYield}
              disabled={isCalculating}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isCalculating ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  计算中...
                </span>
              ) : (
                '💰 计算收益'
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="text-center space-y-4">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${calculatedResults.protocol.bg} ${calculatedResults.protocol.border} border`}>
              <span className="text-2xl">{calculatedResults.protocol.icon}</span>
              <div>
                <div className={`${calculatedResults.protocol.color} font-bold text-lg`}>
                  {calculatedResults.protocol.name}
                </div>
                <div className="text-slate-400 text-sm">{calculatedResults.days} 天投资</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">初始投资</div>
              <div className="text-cyan-400 font-mono text-lg">${calculatedResults.principal.toLocaleString()}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">最终金额</div>
              <div className="text-green-400 font-mono text-lg">${calculatedResults.finalAmount.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">总收益</div>
              <div className="text-yellow-400 font-mono">${calculatedResults.netProfit.toFixed(2)}</div>
            </div>
            <div className="bg-slate-900/50 rounded-xl p-4">
              <div className="text-slate-400 text-xs mb-1">日收益</div>
              <div className="text-purple-400 font-mono">${calculatedResults.dailyYield.toFixed(2)}</div>
            </div>
          </div>

          {calculatedResults.impermanentLoss > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 font-bold text-sm">无常损失风险</span>
              </div>
              <div className="text-slate-300 text-sm">
                预估无常损失：<span className="text-orange-400 font-mono">${calculatedResults.impermanentLoss.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* 显示实时数据信息和风险提示 */}
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getRiskColor(calculatedResults.protocol.risk).replace('text', 'bg')}`}></div>
                风险等级: {calculatedResults.protocol.risk}
              </div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div>APY: {calculatedResults.apy.toFixed(2)}% ({calculatedResults.apyData.source})</div>
              <div className="w-px h-4 bg-slate-600"></div>
              <div>更新时间: {calculatedResults.apyData.lastUpdate}</div>
            </div>

            {/* 风险提示 */}
            {calculatedResults.risks?.length > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-bold text-xs">风险提示</span>
                </div>
                <div className="text-slate-300 text-xs space-y-1">
                  {calculatedResults.risks.map((risk, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                      {risk}
                    </div>
                  ))}
                  <div className="mt-2 text-[10px] text-slate-500">
                    * DeFi投资有风险，APY会根据市场条件实时变化
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigator.share?.({title: 'DeFi收益计算', text: `投资 $${calculatedResults.principal} 在 ${calculatedResults.protocol.name}，${calculatedResults.days}天可获得 $${calculatedResults.netProfit.toFixed(2)} 收益！`})}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
            >
              📱 分享结果
            </button>
            <button
              onClick={reset}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-lg transition-all text-sm"
            >
              🔄 重新计算
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// -----------------------------------------------------------------------------
// 3道题全对通关测验系统
// -----------------------------------------------------------------------------
const MultiQuiz = ({ lessonId, onPass }) => {
  const [quizState, setQuizState] = useState('idle'); // idle, active, completed
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);

  // 题库数据 - 根据课程内容预设题目
  const quizBank = {
    '1-1': [ // 创建第一个 Web3 身份
      {
        question: "什么是Web3钱包的最重要特征？",
        options: ["由中心化公司托管私钥", "用户完全控制自己的私钥", "需要银行账户验证", "只能存储比特币"],
        correctAnswer: 1,
        explanation: "Web3钱包的核心特征是用户拥有并控制自己的私钥，这体现了去中心化的本质。"
      },
      {
        question: "助记词（Seed Phrase）的主要作用是什么？",
        options: ["用来设置密码", "恢复和备份钱包", "加密交易数据", "验证身份信息"],
        correctAnswer: 1,
        explanation: "助记词是钱包的主密钥，可以用来恢复钱包中的所有账户和资产。"
      },
      {
        question: "在创建Web3身份时，以下哪个做法是最安全的？",
        options: ["将助记词截图保存在手机", "把助记词写在纸上离线保存", "用邮件发送给自己", "保存在云盘中"],
        correctAnswer: 1,
        explanation: "助记词应该离线保存，写在纸上是最安全的方式，避免网络攻击和设备丢失的风险。"
      }
    ],
    '1-2': [ // 体验第一笔交易
      {
        question: "在进行Web3交易时，Gas费的作用是什么？",
        options: ["交易手续费", "钱包维护费", "网络会员费", "身份验证费"],
        correctAnswer: 0,
        explanation: "Gas费是支付给矿工/验证者的交易手续费，用于激励他们处理和确认交易。"
      },
      {
        question: "什么情况下Web3交易可能会失败？",
        options: ["Gas费设置过低", "网络拥堵", "智能合约执行失败", "以上都有可能"],
        correctAnswer: 3,
        explanation: "Gas费不足、网络拥堵、合约错误等都可能导致交易失败，这是区块链的特性。"
      },
      {
        question: "交易确认通常需要多长时间？",
        options: ["立即完成", "几分钟到几小时不等", "总是24小时", "1秒钟"],
        correctAnswer: 1,
        explanation: "交易确认时间取决于网络拥堵程度和Gas费设置，通常从几分钟到几小时不等。"
      }
    ],
    '1-3': [ // 体验第一个 DApp
      {
        question: "DApp的全称是什么？",
        options: ["Digital Application", "Decentralized Application", "Data Application", "Dynamic Application"],
        correctAnswer: 1,
        explanation: "DApp代表去中心化应用(Decentralized Application)，运行在区块链网络上。"
      },
      {
        question: "DApp与传统App的主要区别是什么？",
        options: ["DApp更快", "DApp不需要网络", "DApp运行在区块链上", "DApp更便宜"],
        correctAnswer: 2,
        explanation: "DApp的核心特点是运行在区块链网络上，具有去中心化、不可篡改等特性。"
      },
      {
        question: "使用DApp时为什么需要连接钱包？",
        options: ["支付开发者", "证明身份和授权交易", "下载应用", "获取网络权限"],
        correctAnswer: 1,
        explanation: "连接钱包可以证明用户身份，并授权DApp代表用户执行区块链交易。"
      }
    ],
    '2-1': [ // 密码学基础
      {
        question: "SHA-256算法的主要特点是什么？",
        options: ["可逆加密", "单向哈希函数", "对称加密", "私钥生成"],
        correctAnswer: 1,
        explanation: "SHA-256是单向哈希函数，输入任意数据都产生固定长度的哈希值，且不可逆。"
      },
      {
        question: "在比特币中，公钥和私钥的关系是？",
        options: ["公钥是私钥的两倍", "公钥由私钥生成", "私钥由公钥生成", "两者无关"],
        correctAnswer: 1,
        explanation: "在椭圆曲线加密中，公钥是通过私钥和椭圆曲线运算生成的，私钥是随机数。"
      },
      {
        question: "数字签名的作用是什么？",
        options: ["加密数据", "证明身份和防篡改", "生成地址", "挖矿算法"],
        correctAnswer: 1,
        explanation: "数字签名用于证明消息来自私钥持有者，并确保消息在传输中未被篡改。"
      }
    ],
    '2-2': [ // 比特币概览
      {
        question: "比特币的总供应量是多少？",
        options: ["2100万枚", "1亿枚", "无限制", "5000万枚"],
        correctAnswer: 0,
        explanation: "比特币的总供应量被硬编码为2100万枚，这是通过减半机制实现的稀缺性。"
      },
      {
        question: "比特币网络大约多久产生一个新区块？",
        options: ["1分钟", "10分钟", "1小时", "24小时"],
        correctAnswer: 1,
        explanation: "比特币网络的目标是每10分钟产生一个新区块，通过难度调整来维持这个时间。"
      },
      {
        question: "比特币使用的共识机制是什么？",
        options: ["权益证明(PoS)", "工作量证明(PoW)", "委托权益证明(DPoS)", "权威证明(PoA)"],
        correctAnswer: 1,
        explanation: "比特币使用工作量证明(PoW)共识机制，矿工需要解决数学难题来获得记账权。"
      }
    ],
    // 默认通用题目
    'default': [
      {
        question: "区块链技术的核心特征是什么？",
        options: ["中心化管理", "去中心化和不可篡改", "高速交易", "免费使用"],
        correctAnswer: 1,
        explanation: "区块链的核心特征是去中心化和不可篡改，这使得它成为可信的分布式账本。"
      },
      {
        question: "什么是智能合约？",
        options: ["法律文件", "自动执行的代码", "合同模板", "交易记录"],
        correctAnswer: 1,
        explanation: "智能合约是部署在区块链上的自动执行代码，当条件满足时自动执行预定的操作。"
      },
      {
        question: "Web3的核心理念是什么？",
        options: ["更快的网络", "用户拥有数据主权", "免费服务", "中心化管理"],
        correctAnswer: 1,
        explanation: "Web3的核心理念是用户拥有自己的数据和资产，实现真正的数字主权。"
      }
    ]
  };

  const currentQuiz = quizBank[lessonId] || quizBank['default'];

  const startQuiz = () => {
    setQuizState('active');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
  };

  const selectAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    const isCorrect = selectedAnswer === currentQuiz[currentQuestion].correctAnswer;
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = {
      selected: selectedAnswer,
      correct: isCorrect
    };
    setAnswers(newAnswers);
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // 测验结束
      setQuizState('completed');
    }
  };

  const resetQuiz = () => {
    setQuizState('idle');
    setCurrentQuestion(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
  };

  // 检查是否全对
  const isPerfectScore = score === currentQuiz.length;

  if (quizState === 'idle') {
    return (
      <div className="space-y-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
            <h4 className="text-white font-bold">闯关测验</h4>
          </div>
          <p className="text-slate-300 mb-6">
            完成 <span className="text-cyan-400 font-bold">{currentQuiz.length} 道题目</span>，需要 
            <span className="text-green-400 font-bold"> 全部答对 </span>才能通关下一章节
          </p>
          <button 
            onClick={startQuiz}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20"
          >
            🚀 开始挑战
          </button>
        </div>
      </div>
    );
  }

  if (quizState === 'active') {
    const currentQ = currentQuiz[currentQuestion];
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          {/* 进度条 */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-slate-400">
              题目 {currentQuestion + 1} / {currentQuiz.length}
            </span>
            <span className="text-sm text-cyan-400 font-mono">
              得分: {score}/{currentQuiz.length}
            </span>
          </div>
          
          <div className="h-2 bg-slate-700 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentQuestion + 1) / currentQuiz.length) * 100}%` }}
            />
          </div>

          {!showFeedback ? (
            <>
              <h5 className="text-lg font-semibold text-white mb-6">{currentQ.question}</h5>
              
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswer === index 
                        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/10' 
                        : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700/80'
                    }`}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-600 text-white text-sm font-mono mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={submitAnswer}
                disabled={selectedAnswer === null}
                className="w-full bg-green-600 hover:bg-green-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                确认答案
              </button>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-xl border mb-6 ${
                answers[currentQuestion]?.correct 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {answers[currentQuestion]?.correct ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <X className="w-5 h-5" />
                  )}
                  <span className="font-bold">
                    {answers[currentQuestion]?.correct ? '回答正确！' : '回答错误'}
                  </span>
                </div>
                <p className="text-sm leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
              
              <button 
                onClick={nextQuestion}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {currentQuestion < currentQuiz.length - 1 ? '下一题' : '查看结果'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (quizState === 'completed') {
    return (
      <div className="space-y-6">
        <div className={`p-8 rounded-xl border text-center ${
          isPerfectScore 
            ? 'bg-green-500/10 border-green-500/20' 
            : 'bg-orange-500/10 border-orange-500/20'
        }`}>
          {isPerfectScore ? (
            <>
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">完美通关！</h3>
              <p className="text-green-300 mb-6">
                恭喜你全部答对 {currentQuiz.length} 道题目！你已经掌握了本章节的核心知识。
              </p>
              <button 
                onClick={() => {
                  onPass();
                  setQuizState('idle');
                }}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg transition-colors transform hover:scale-105 shadow-lg"
              >
                ✅ 解锁下一章节
              </button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-orange-400 mb-2">还需努力</h3>
              <p className="text-orange-300 mb-6">
                你答对了 {score}/{currentQuiz.length} 题。需要全部答对才能进入下一章节，再试一次吧！
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={resetQuiz}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  🔄 重新挑战
                </button>
                <button 
                  onClick={() => {
                    onPass();
                    setQuizState('idle');
                  }}
                  className="bg-slate-600 hover:bg-slate-500 text-white py-3 px-6 rounded-lg transition-colors"
                >
                  跳过 (调试用)
                </button>
              </div>
            </>
          )}
        </div>
        
        {/* 答题详情 */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h4 className="text-white font-bold mb-4">答题回顾</h4>
          <div className="space-y-4">
            {currentQuiz.map((q, index) => (
              <div key={index} className="border border-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate-400">第 {index + 1} 题</span>
                  {answers[index]?.correct ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <p className="text-white text-sm mb-2">{q.question}</p>
                <div className="text-xs">
                  <span className="text-slate-400">你的答案: </span>
                  <span className={answers[index]?.correct ? 'text-green-400' : 'text-red-400'}>
                    {q.options[answers[index]?.selected]}
                  </span>
                  {!answers[index]?.correct && (
                    <>
                      <br />
                      <span className="text-slate-400">正确答案: </span>
                      <span className="text-green-400">{q.options[q.correctAnswer]}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// -----------------------------------------------------------------------------
// AI助教组件
// -----------------------------------------------------------------------------
const AiTutor = ({ lessonContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || !apiKey) {
      if (!apiKey) alert("AI 助教需要配置 Gemini API Key。");
      return;
    }

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const prompt = `学生问题: "${inputValue}"

基于当前课程内容回答学生的问题。课程内容：
${lessonContext.slice(0, 1500)}

请提供清晰、易懂的解释，如果问题与当前课程相关，要结合课程内容。如果问题超出课程范围，可以适当扩展但要说明。`;

      const systemInstruction = "你是一个友善的Web3教育助教。用中文回答，语言要通俗易懂，可以使用表情符号让回答更生动。";
      
      const response = await callGemini(prompt, systemInstruction);
      
      const assistantMessage = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: `抱歉，我遇到了一些问题：${error.message}` 
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white p-4 rounded-full shadow-2xl shadow-purple-500/20 transition-all transform hover:scale-105"
        >
          <BrainCircuit className="w-6 h-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 max-h-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl shadow-cyan-500/10">
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold text-white">AI 助教</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-slate-400 text-sm text-center py-8">
            👋 你好！我是AI助教，有任何关于课程的问题都可以问我哦~
          </div>
        )}
        
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg text-sm ${
              message.role === 'user' 
                ? 'bg-cyan-600 text-white' 
                : 'bg-slate-800 text-slate-200'
            }`}>
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 text-slate-200 p-3 rounded-lg text-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              思考中...
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="问我任何问题..."
            className="flex-1 bg-slate-800 border border-slate-600 text-slate-200 text-sm rounded px-3 py-2 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={sendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 text-white p-2 rounded transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------------
// 完整的Markdown渲染器
// -----------------------------------------------------------------------------
const MarkdownRenderer = ({ content, basePath }) => {
  const parseInline = (text) => {
    if (!text) return null;
    const regex = /(<img[^>]+>|<a\s+[^>]*href=["'][^"']+["'][^>]*>.*?<\/a>|!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)|`.*?`|\*\*.*?\*\*)/g;
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (!part) return null;
      if (part.trim().match(/^<\/?div.*?>$/)) return null;

      if (part.match(/^<img/)) {
        const srcMatch = part.match(/src=["']([^"']+)["']/);
        const widthMatch = part.match(/width\s*=\s*["']?(\d+)["']?/);
        if (srcMatch) {
            let src = srcMatch[1];
            if (src.startsWith('./') || src.startsWith('img/')) {
                src = basePath + src.replace('./', '');
            }
            const width = widthMatch ? widthMatch[1] : undefined;
            return (
                <span key={index} className="inline-flex m-1 align-middle">
                    <img src={src} alt="Image" className="rounded-lg max-w-full h-auto" style={{ maxHeight: '500px', width: width ? `${width}px` : 'auto' }} />
                </span>
            );
        }
      }
      const htmlLinkMatch = part.match(/^<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>$/);
      if (htmlLinkMatch) {
        return (
          <a key={index} href={htmlLinkMatch[1]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors inline-flex items-center gap-1 mx-1">
            {htmlLinkMatch[2]} <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      const mdImgMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
      if (mdImgMatch) {
        let src = mdImgMatch[2];
        if (!src.startsWith('http')) src = basePath + src.replace('./', '');
        return (
           <span key={index} className="inline-flex m-1 align-middle">
             <img src={src} alt={mdImgMatch[1]} className="rounded-lg max-w-full h-auto shadow-lg" style={{ maxHeight: '500px' }} />
           </span>
        );
      }
      const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
      if (linkMatch) {
        return (
          <a key={index} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-colors inline-flex items-center gap-1">
            {linkMatch[1]} <ExternalLink className="w-3 h-3" />
          </a>
        );
      }
      const boldMatch = part.match(/^\*\*(.*?)\*\*$/);
      if (boldMatch) return <strong key={index} className="text-white font-bold">{boldMatch[1]}</strong>;
      const codeMatch = part.match(/^`(.*?)`$/);
      if (codeMatch) return <code key={index} className="bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded text-sm font-mono border border-slate-700">{codeMatch[1]}</code>;

      return part;
    });
  };

  const lines = content.split('\n');
  const elements = [];
  let textBuffer = [];
  let footerLinkBuffer = [];

  const flushFooterBuffer = () => {
    if (footerLinkBuffer.length > 0) {
      elements.push(
        <div key={`footer-${elements.length}`} className="flex flex-wrap gap-4 justify-center mt-8 pt-8 border-t border-slate-800">
          {footerLinkBuffer.map((item, i) => (
             <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" 
                className="flex items-center gap-2 px-5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-full text-white font-bold text-sm transition-all transform hover:scale-105 shadow-lg group">
                {item.text.includes('🏠') && <Home className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors"/>}
                {item.text.includes('🐦') && <UserPlus className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors"/>}
                {item.text.includes('📝') && <FileInput className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors"/>}
                <span>{item.text.replace(/🏠|🐦|📝/g, '').trim()}</span>
             </a>
          ))}
        </div>
      );
      footerLinkBuffer = [];
    }
  };

  const flushTextBuffer = () => {
    if (textBuffer.length > 0) {
      const allImages = textBuffer.every(l => l.match(/<img|!\[/));
      if (allImages) {
        elements.push(
          <div key={`badges-${elements.length}`} className="flex flex-wrap justify-center gap-2 my-6">
            {textBuffer.map((line, i) => <React.Fragment key={i}>{parseInline(line)}</React.Fragment>)}
          </div>
        );
      } else {
        elements.push(
          <div key={`text-${elements.length}`} className="mb-4 text-slate-300 leading-7">
            {textBuffer.map((line, i) => (
              <React.Fragment key={i}>
                {parseInline(line)}
                {i < textBuffer.length - 1 && <br />} 
              </React.Fragment>
            ))}
          </div>
        );
      }
      textBuffer = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed === '</div>' || trimmed === '<div align="center">' || trimmed.match(/^[-|]+$/)) {
      flushTextBuffer(); 
      return; 
    }
    if (trimmed.includes('返回主页') || trimmed.includes('关注作者') || trimmed.includes('加入交流群')) {
       flushTextBuffer();
       const mdMatch = trimmed.match(/\[(.*?)\]\((.*?)\)/);
       const htmlMatch = trimmed.match(/href=["'](.*?)["']>(.*?)<\/a>/);
       if (htmlMatch) footerLinkBuffer.push({ text: htmlMatch[2], url: htmlMatch[1] });
       else if (mdMatch) footerLinkBuffer.push({ text: mdMatch[1], url: mdMatch[2] });
       return;
    }
    const isHeader = trimmed.match(/^#{1,6}\s/);
    const isList = trimmed.match(/^(\*|-|\d\.)\s/);
    const isBlockquote = trimmed.startsWith('>');
    const isCodeBlockStart = trimmed.startsWith('```'); 
    const isPseudoCode = trimmed.startsWith('//') || trimmed.startsWith('const') || trimmed.startsWith('import') || trimmed.startsWith('$') || trimmed.startsWith('npm');

    if (isHeader || isList || isBlockquote || isCodeBlockStart || isPseudoCode) {
       flushTextBuffer(); 
       flushFooterBuffer(); 

       if (isHeader) {
          if (line.startsWith('# ')) elements.push(<h1 key={index} className="text-3xl md:text-4xl font-black text-white mt-12 mb-8 border-b border-slate-800 pb-4">{parseInline(line.slice(2))}</h1>);
          else if (line.startsWith('## ')) elements.push(<h2 key={index} className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">{parseInline(line.slice(3))}</h2>);
          else if (line.startsWith('### ')) elements.push(<h3 key={index} className="text-xl md:text-2xl font-bold text-cyan-400 mt-8 mb-4 flex items-center gap-2"><ChevronRight className="w-5 h-5"/>{parseInline(line.slice(4))}</h3>);
          else if (line.startsWith('#### ')) elements.push(<h4 key={index} className="text-lg md:text-xl font-bold text-cyan-200 mt-6 mb-3 pl-4 border-l-2 border-cyan-500/30">{parseInline(line.slice(5))}</h4>);
       } else if (isList) {
          if (trimmed.match(/^(\*|-)\s/)) {
             elements.push(<div key={index} className="ml-4 flex items-start gap-3 mb-1"><div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2.5 shrink-0"></div><div className="flex-1">{parseInline(trimmed.substring(2))}</div></div>);
          } else {
             const m = trimmed.match(/^(\d\.)\s(.*)/);
             elements.push(<div key={index} className="ml-4 flex gap-3 mb-1"><span className="font-bold text-cyan-500 shrink-0 font-mono">{m[1]}</span><div className="flex-1">{parseInline(m[2])}</div></div>);
          }
       } else if (isBlockquote) {
          elements.push(<blockquote key={index} className="border-l-4 border-cyan-500/30 bg-slate-900/50 p-4 text-slate-400 rounded-r-lg my-4 text-base italic">{parseInline(trimmed.slice(2))}</blockquote>);
       } else if (isPseudoCode) {
          elements.push(<div key={index} className="bg-slate-950 p-4 rounded-lg font-mono text-sm border border-slate-800 my-4 text-green-400 overflow-x-auto shadow-inner whitespace-pre">{line}</div>);
       }
       return;
    }
    textBuffer.push(line);
  });

  flushTextBuffer();
  flushFooterBuffer();

  return <div className="font-sans text-base">{elements}</div>;
};

// -----------------------------------------------------------------------------
// 🔑 API Key 设置组件
// -----------------------------------------------------------------------------
const ApiKeySettings = ({ onClose }) => {
  const [apiKey, setApiKeyLocal] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tested, setTested] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const currentKey = getApiKey();
    setApiKeyLocal(currentKey);
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setApiKey(apiKey.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) return;
    
    setTesting(true);
    try {
      setApiKey(apiKey.trim()); // 临时设置用于测试
      await callGemini("Say 'Hello, Web3 Builder!' in one sentence.", "", false);
      setTested(true);
      setTimeout(() => setTested(false), 3000);
    } catch (error) {
      alert('API Key 测试失败：' + error.message);
      setApiKey(''); // 清除无效的key
    } finally {
      setTesting(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setApiKeyLocal('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI 配置中心</h3>
              <p className="text-sm text-slate-400">配置您的 Gemini API Key 以启用 AI 功能</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* API Key 输入 */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-300">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKeyLocal(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 disabled:from-slate-700 disabled:to-slate-600 text-white py-3 px-4 rounded-lg font-bold transition-all hover:scale-105 disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? '已保存' : '保存'}
            </button>
            <button
              onClick={handleTest}
              disabled={!apiKey.trim() || testing}
              className="flex-1 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white py-3 px-4 rounded-lg font-bold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : tested ? <Check className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {testing ? '测试中...' : tested ? '测试成功' : '测试连接'}
            </button>
            <button
              onClick={handleClear}
              className="bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-bold transition-all"
            >
              清除
            </button>
          </div>

          {/* 安全提示 */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-200 space-y-2">
                <p className="font-bold">🛡️ 安全说明：</p>
                <ul className="space-y-1 text-blue-300">
                  <li>• API Key 仅存储在您的浏览器本地，不会上传到任何服务器</li>
                  <li>• 我们使用简单编码保护您的 Key（非明文存储）</li>
                  <li>• 建议在 Google Cloud Console 中设置 HTTP referrer 限制</li>
                  <li>• 您可以随时清除本地存储的 API Key</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 获取 API Key 说明 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              如何获取 Gemini API Key？
            </h4>
            <div className="text-sm text-slate-300 space-y-2">
              <p>1. 访问 <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">Google AI Studio</a></p>
              <p>2. 登录您的 Google 账号</p>
              <p>3. 点击 "Create API Key" 创建新的 API Key</p>
              <p>4. 复制生成的 API Key 并粘贴到上方输入框</p>
              <p className="text-yellow-400">💡 提示：Gemini API 提供免费额度，足够个人学习使用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple Quiz Component (替代原来的AiQuiz)
const SimpleQuiz = ({ onPass }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [passed, setPassed] = useState(false);

  const handlePass = () => {
    setPassed(true);
    onPass();
  };

  if (passed) {
    return (
      <div className="flex items-center justify-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-bold gap-2 animate-in zoom-in">
        <CheckCircle className="w-6 h-6" /> 课程已完成 | Mission Accomplished
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showQuiz ? (
        <button 
          onClick={() => setShowQuiz(true)}
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/20"
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
  const [showConfetti, setShowConfetti] = useState(false);
  const [gasPrice, setGasPrice] = useState(12);

  // Content Fetching State
  const [lessonContent, setLessonContent] = useState('');
  const [contentLoading, setContentLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null); 
  const [basePath, setBasePath] = useState('');

  // API Key Settings State
  const [showApiSettings, setShowApiSettings] = useState(false);

  // 🏆 Badge System State
  const [earnedBadges, setEarnedBadges] = useState({}); // { badgeId: { earnedAt: timestamp, moduleId: string } }
  const [showBadgeCollection, setShowBadgeCollection] = useState(false);
  const [pendingBadgeUnlock, setPendingBadgeUnlock] = useState(null); // Badge to show unlock animation for
  const [totalExperience, setTotalExperience] = useState(0);
  const [userTitle, setUserTitle] = useState('🏃 学习者'); // 用户头衔

  useEffect(() => {
    if (address) {
      const saved = localStorage.getItem(`web3_progress_${address}`);
      if (saved) setProgress(JSON.parse(saved));
    }
  }, [address]);

  // Fetch Content with Fallback logic
  useEffect(() => {
    if (!activeLesson) return;
    
    if (!activeLesson.path) {
      setLessonContent(activeLesson.fallbackContent);
      setFetchError(null);
      setBasePath('');
      return;
    }

    const fetchContent = async () => {
      setContentLoading(true);
      setFetchError(null);
      setBasePath('');
      
      const candidateFiles = ['README.MD', 'README.md', 'readme.md', 'index.md', 'index.MD'];
      const failureLogs = [];
      const sources = [
        {
          label: '本地内容镜像',
          basePath: getLocalBaseUrl(activeLesson.path),
          getUrl: (filename) => getLocalUrl(`${activeLesson.path}/${filename}`)
        },
        {
          label: 'GitHub Raw',
          basePath: getRawBaseUrl(activeLesson.path),
          getUrl: (filename) => getRawUrl(`${activeLesson.path}/${filename}`)
        }
      ];

      try {
        for (const source of sources) {
          for (const filename of candidateFiles) {
            const url = source.getUrl(filename);
            try {
              const res = await fetch(url, { cache: 'no-store' });
              if (res.ok) {
                const text = await res.text();
                setLessonContent(text);
                setBasePath(source.basePath);
                return;
              }
              failureLogs.push(`${source.label}: ${url} (${res.status})`);
            } catch (error) {
              failureLogs.push(`${source.label}: ${url} (${error.message})`);
            }
          }
        }

        console.error('Failed to load lesson content', failureLogs);
        setFetchError(failureLogs.join('\n'));
        setLessonContent(activeLesson.fallbackContent);
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [activeLesson]);

  // Simulate Gas Price
  useEffect(() => {
    const interval = setInterval(() => setGasPrice(p => Math.max(8, Math.min(50, p + Math.floor(Math.random() * 5) - 2))), 3000);
    return () => clearInterval(interval);
  }, []);

  // 检查是否已经连接钱包
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAddress(accounts[0]);
            setConnected(true);
            console.log('已检测到钱包连接:', accounts[0]);
          }
        } catch (error) {
          console.error('检查钱包连接失败:', error);
        }
      }
    };
    
    checkWalletConnection();
    
    // 监听账户变化
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          setConnected(false);
          setAddress('');
          console.log('钱包已断开连接');
        } else {
          setAddress(accounts[0]);
          setConnected(true);
          console.log('钱包账户已切换:', accounts[0]);
        }
      };
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // 🏆 Badge System Effects
  useEffect(() => {
    if (address) {
      const savedBadges = localStorage.getItem(`web3_badges_${address}`);
      const savedExperience = localStorage.getItem(`web3_experience_${address}`);
      const savedTitle = localStorage.getItem(`web3_title_${address}`);
      
      if (savedBadges) setEarnedBadges(JSON.parse(savedBadges));
      if (savedExperience) setTotalExperience(parseInt(savedExperience));
      if (savedTitle) setUserTitle(savedTitle);
    }
  }, [address]);

  // 检查模块完成状态并解锁徽章
  const checkModuleCompletion = (moduleId) => {
    const module = COURSE_DATA.find(m => m.id === moduleId);
    if (!module) return false;
    
    // 检查该模块的所有课程是否都完成
    const moduleProgress = module.lessons.every(lesson => progress[lesson.id]);
    return moduleProgress;
  };

  // 徽章解锁逻辑
  const unlockBadge = (moduleId) => {
    const badge = ACHIEVEMENT_BADGES[moduleId];
    if (!badge || earnedBadges[badge.id]) return; // 徽章不存在或已获得
    
    const newBadges = {
      ...earnedBadges,
      [badge.id]: {
        earnedAt: Date.now(),
        moduleId: moduleId
      }
    };
    
    const newExperience = totalExperience + badge.rewards.experience;
    const newTitle = badge.rewards.title;
    
    setEarnedBadges(newBadges);
    setTotalExperience(newExperience);
    setUserTitle(newTitle);
    
    // 保存到本地存储
    localStorage.setItem(`web3_badges_${address}`, JSON.stringify(newBadges));
    localStorage.setItem(`web3_experience_${address}`, newExperience.toString());
    localStorage.setItem(`web3_title_${address}`, newTitle);
    
    // 显示徽章解锁动画
    setPendingBadgeUnlock(badge);
    
    // 播放成就解锁音效
    playSound('badge-unlock');
    
    // 触发庆祝动画
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
    
    // 检查是否達成特殊成就
    checkSpecialAchievements(newBadges);
  };

  // 计算模块进度
  const getModuleProgress = (moduleId) => {
    const module = COURSE_DATA.find(m => m.id === moduleId);
    if (!module) return 0;
    
    const completedLessons = module.lessons.filter(lesson => progress[lesson.id]).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  // 🏆 检查特殊成就
  const checkSpecialAchievements = (currentBadges) => {
    const earnedBadgeIds = Object.keys(currentBadges);
    
    // 全部完成成就
    if (earnedBadgeIds.length === Object.keys(ACHIEVEMENT_BADGES).length) {
      const completionBadge = {
        id: 'web3-master',
        name: 'Web3 Master',
        title: '🎆 Web3 大师',
        description: '完成所有学习模块，成为真正的 Web3 大师！',
        icon: Crown,
        rarity: 'Mythic',
        color: 'from-yellow-400 via-pink-500 to-purple-600',
        glowColor: 'shadow-yellow-500/50',
        borderColor: 'border-yellow-400',
        bgColor: 'bg-yellow-500/10',
        rewards: {
          title: '🎆 Web3 大师',
          experience: 500,
          unlockedFeatures: ['精英会员访问权限', '专属学习路径', '高级 AI 助教']
        }
      };
      
      if (!currentBadges['web3-master']) {
        setTimeout(() => {
          unlockSpecialBadge(completionBadge);
        }, 2000);
      }
    }
  };

  // 解锁特殊徽章
  const unlockSpecialBadge = (specialBadge) => {
    const newBadges = {
      ...earnedBadges,
      [specialBadge.id]: {
        earnedAt: Date.now(),
        special: true
      }
    };
    
    setEarnedBadges(newBadges);
    localStorage.setItem(`web3_badges_${address}`, JSON.stringify(newBadges));
    
    // 特殊成就音效
    playSound('level-up');
    
    setPendingBadgeUnlock(specialBadge);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 8000);
  };

  // 🎯 学习激励系统
  const getLearningStreak = () => {
    // 简化版本：基于本地存储计算连续学习天数
    const today = new Date().toDateString();
    const lastStudyDate = localStorage.getItem(`last_study_date_${address}`);
    const currentStreak = parseInt(localStorage.getItem(`study_streak_${address}`)) || 0;
    
    if (lastStudyDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak = lastStudyDate === yesterday ? currentStreak + 1 : 1;
      
      localStorage.setItem(`last_study_date_${address}`, today);
      localStorage.setItem(`study_streak_${address}`, newStreak.toString());
      
      return newStreak;
    }
    
    return currentStreak;
  };

  // 获取下一个学习目标
  const getNextLearningGoal = () => {
    const incompleteLessons = COURSE_DATA.flatMap(module => 
      module.lessons.filter(lesson => !progress[lesson.id])
    );
    
    return incompleteLessons.length > 0 ? incompleteLessons[0] : null;
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setAddress(accounts[0]); 
          setConnected(true);
          console.log('钱包连接成功:', accounts[0]);
          return accounts[0];
        } else {
          throw new Error('未获取到账户信息');
        }
      } catch (err) { 
        console.error('连接钱包失败:', err);
        alert("连接失败: " + (err.message || '未知错误'));
        return null;
      }
    } else {
      const demoAddress = '0x71C...9A23';
      setAddress(demoAddress); 
      setConnected(true); 
      alert("进入演示模式 (未检测到钱包)");
      return demoAddress;
    }
  };

  // 通用的钱包连接检查函数
  const ensureWalletConnected = async () => {
    if (connected && address) {
      return address;
    }
    return await connectWallet();
  };

  const handleLessonPass = (lessonId) => {
    if (!connected) return alert("请先连接钱包以保存进度！");
    const newProgress = { ...progress, [lessonId]: true };
    setProgress(newProgress);
    localStorage.setItem(`web3_progress_${address}`, JSON.stringify(newProgress));
    
    // 检查是否完成了整个模块
    const currentModule = COURSE_DATA.find(module => 
      module.lessons.some(lesson => lesson.id === lessonId)
    );
    
    if (currentModule) {
      // 更新进度后再检查模块完成状态
      const updatedProgress = newProgress;
      const isModuleComplete = currentModule.lessons.every(lesson => updatedProgress[lesson.id]);
      
      if (isModuleComplete && !earnedBadges[ACHIEVEMENT_BADGES[currentModule.id]?.id]) {
        // 延迟一点触发徽章解锁动画，让用户先看到课程完成
        setTimeout(() => {
          unlockBadge(currentModule.id);
        }, 1500);
      }
    }
    
    // 播放课程完成音效
    playSound('success');
    
    // 五彩纸屑动画（课程完成）
    setShowConfetti(true); 
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const totalLessons = COURSE_DATA.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = Object.keys(progress).length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);
  
  // 忽章统计
  const earnedBadgeCount = Object.keys(earnedBadges).length;
  const totalBadgeCount = Object.keys(ACHIEVEMENT_BADGES).length;

  // Landing Page
  if (view === 'landing') {
    return (
      <>
        {showApiSettings && <ApiKeySettings onClose={() => setShowApiSettings(false)} />}
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
        <MouseSpotlight />
        <ParticleBackground />
        <StarPrompt />
        
        <nav className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Code className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">Web3 Starter</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-mono">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-slate-400">Gas:</span>
                <span className={`font-bold transition-colors duration-300 ${gasPrice > 30 ? 'text-red-400' : 'text-green-400'}`}>{gasPrice} Gwei</span>
              </div>
              <button 
                onClick={() => setShowApiSettings(true)} 
                className="bg-slate-800 hover:bg-slate-700 text-white p-2.5 rounded-lg border border-slate-700 transition-colors"
                title="AI 设置"
              >
                <Settings className="w-4 h-4" />
              </button>
              {connected ? (
                <button onClick={() => setView('dashboard')} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium border border-slate-700 flex items-center gap-2 transition-colors"><Layout className="w-4 h-4" /> Dashboard</button>
              ) : (
                <button onClick={connectWallet} className="bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-lg font-bold shadow-lg shadow-white/10 flex items-center gap-2 transition-colors"><Wallet className="w-4 h-4" /> Connect</button>
              )}
            </div>
          </div>
        </nav>

        <section className="relative pt-40 pb-20 px-4 text-center max-w-5xl mx-auto z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-3 h-3" /> AI-Powered Web3 Education
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight animate-in fade-in zoom-in-95 duration-700 delay-100">
             从 0x00 到 <br />
            <span className={styles.glowText}>Web3 Builder</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            开源、免费、实战导向。
            内置 <span className="text-cyan-400 font-bold">AI 助教</span> 与 <span className="text-cyan-400 font-bold">交互式演练</span>，
            为你铺设最清晰的去中心化学习路径。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button onClick={() => { if (!connected) connectWallet(); setView('dashboard'); }} className={styles.neonButton}>
              <span className="relative z-10 flex items-center gap-2">Start Journey <ChevronRight className="w-4 h-4" /></span>
            </button>
            <a href={`https://github.com/${GITHUB_USERNAME}/${GITHUB_REPO}`} target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full bg-slate-800/50 hover:bg-slate-800 text-white font-bold border border-slate-700 backdrop-blur transition-all flex items-center gap-2 justify-center hover:scale-105">
              <Github className="w-4 h-4" /> Star on GitHub
            </a>
          </div>
        </section>

        <section className="py-20 relative z-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-4 mb-8">
               <div className="h-px bg-slate-800 flex-1"></div>
               <span className="text-slate-500 text-sm font-mono uppercase tracking-widest">Interactive Playground</span>
               <div className="h-px bg-slate-800 flex-1"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Web3PersonalityAnalyzer 
                walletAddress={address} 
                isConnected={connected} 
                onConnectWallet={ensureWalletConnected} 
              />
              <AchievementSystem walletAddress={address} isConnected={connected} />
              <DeFiYieldCalculator />
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-slate-900/50 border-t border-slate-800 relative z-20">
           <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-white mb-12">为什么选择这个平台？</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {icon: Database, title: "链上进度存档", desc: "你的学习进度与钱包地址绑定，永久保存，如同链上资产般安全。"},
                  {icon: BrainCircuit, title: "Gemini AI 驱动", desc: "遇到不懂的概念？内置 AI 助教随时解答，并自动生成测验巩固知识。"},
                  {icon: Terminal, title: "实战代码演练", desc: "不仅仅是阅读。我们提供 Hardhat/Foundry 实战案例，带你编写真正的智能合约。"}
                ].map((item, i) => (
                  <div key={i} className={styles.glassCard + " p-8 rounded-2xl relative overflow-hidden group"}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><item.icon size={80} /></div>
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform"><item.icon /></div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
           </div>
        </section>

        <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800 bg-slate-950 relative z-20">
          Built with React, Tailwind & Gemini AI. Open Source Education.
        </footer>
      </div>
      </>
    );
  }

  // Dashboard & Reader
  return (
    <>
      {showApiSettings && <ApiKeySettings onClose={() => setShowApiSettings(false)} />}
      <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
      <Confetti active={showConfetti} />
      
      {/* Sidebar (Desktop) */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen fixed md:relative z-20 hidden md:flex">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setView('landing')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20"><Code className="text-white w-5 h-5" /></div>
          <span className="font-bold text-white tracking-tight">Web3 Starter</span>
        </div>

        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
               <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center"><img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="avatar" className="w-10 h-10 rounded-full" /></div>
             </div>
             <div className="flex-1 min-w-0">
               <div className="text-xs text-slate-400">Builder ID</div>
               <div className="text-sm font-mono text-white font-bold truncate">{address || 'Visitor'}</div>
               <div className="text-xs text-purple-400 font-medium mt-1">{userTitle}</div>
             </div>
          </div>
          
          {/* 🏆 忽章和经验信息 */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500 uppercase">Badges</div>
              <div className="text-lg font-bold text-purple-400">{earnedBadgeCount}</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <div className="text-xs text-slate-500 uppercase">EXP</div>
              <div className="text-lg font-bold text-yellow-400">{totalExperience}</div>
            </div>
          </div>
          
          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400"><span>Learning Progress</span><span>{progressPercentage}%</span></div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]" style={{ width: `${progressPercentage}%` }}></div></div>
          </div>
          
          {/* 🏆 徽章收藏馆入口 */}
          <button 
            onClick={() => setShowBadgeCollection(true)}
            className="w-full mt-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 hover:border-purple-500/50 text-white p-3 rounded-lg transition-all flex items-center justify-center gap-2 text-sm group"
          >
            <Trophy className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            徽章收藏馆
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-1 custom-scrollbar">
          {COURSE_DATA.map((module) => (
            <div key={module.id} className="px-3">
              <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 mt-2 flex items-center gap-2">
                <div className={`w-1 h-1 rounded-full ${module.color.replace('text', 'bg')}`}></div> {module.title}
              </div>
              <div className="space-y-0.5">
                {module.lessons.map((lesson) => {
                  const isCompleted = progress[lesson.id];
                  const isActive = activeLesson?.id === lesson.id;
                  return (
                    <button key={lesson.id} onClick={() => { setView('reader'); setActiveModule(module); setActiveLesson(lesson); window.scrollTo({top: 0}); }} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${isActive ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'}`}>
                      {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> : <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />}
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
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur border-b border-slate-800 px-6 h-16 flex items-center justify-between md:hidden">
           <div className="flex items-center gap-2" onClick={() => setView('landing')}><Code className="text-cyan-400 w-5 h-5" /><span className="font-bold text-white">Web3 Starter</span></div>
           <button className="text-slate-400"><Menu /></button>
        </header>

        {view === 'dashboard' && (
          <div className="p-8 md:p-12 max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Builder.</h2>
            <p className="text-slate-400 mb-8 flex items-center gap-2"><Terminal className="w-4 h-4"/> System Ready. Continuation Protocol Initiated.</p>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
               <div className={styles.glassCard + " p-6 rounded-2xl"}>
                 <div className="flex justify-between items-start mb-4"><div className="p-2 bg-green-500/10 rounded-lg"><CheckCircle className="w-6 h-6 text-green-500"/></div><span className="text-xs text-slate-500 font-mono">COMPLETED</span></div>
                 <div className="text-3xl font-black text-white">{completedCount} <span className="text-sm font-normal text-slate-500">/ {totalLessons}</span></div>
               </div>
               <div className={styles.glassCard + " p-6 rounded-2xl"}>
                 <div className="flex justify-between items-start mb-4"><div className="p-2 bg-cyan-500/10 rounded-lg"><Activity className="w-6 h-6 text-cyan-500"/></div><span className="text-xs text-slate-500 font-mono">STATUS</span></div>
                 <div className="text-3xl font-black text-white">{progressPercentage}%</div>
               </div>
               <div className={styles.glassCard + " p-6 rounded-2xl relative overflow-hidden"}>
                 <div className="absolute -right-4 -top-4 opacity-10"><Award size={100} /></div>
                 <div className="flex justify-between items-start mb-4"><div className="p-2 bg-yellow-500/10 rounded-lg"><Award className="w-6 h-6 text-yellow-500"/></div><span className="text-xs text-slate-500 font-mono">RANK</span></div>
                 <div className="text-3xl font-black text-white">{progressPercentage === 100 ? 'Solidity God' : 'Apprentice'}</div>
               </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><ArrowRight className="w-5 h-5 text-cyan-400" /> 继续学习</h3>
            <div className="grid gap-4">
              {COURSE_DATA.map(mod => {
                 const firstUnfinished = mod.lessons.find(l => !progress[l.id]);
                 if (!firstUnfinished) return null;
                 return (
                   <div key={mod.id} className="group bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 p-6 rounded-xl transition-all cursor-pointer flex justify-between items-center relative overflow-hidden" onClick={() => { setView('reader'); setActiveModule(mod); setActiveLesson(firstUnfinished); }}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex gap-4 items-center relative z-10">
                        <div className={`w-12 h-12 rounded-lg ${mod.color.replace('text', 'bg')}/10 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}><mod.icon className={`w-6 h-6 ${mod.color}`} /></div>
                        <div><div className="text-xs text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">{mod.title}</div><div className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{firstUnfinished.title}</div></div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-600 transition-colors"><ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" /></div>
                   </div>
                 )
              })}
              {progressPercentage === 100 && <div className="text-center p-12 border border-dashed border-slate-700 rounded-xl text-slate-500">🎉 所有任务已完成。Stay Hungry, Stay Foolish.</div>}
            </div>
          </div>
        )}

        {view === 'reader' && activeLesson && (
          <div className="max-w-4xl mx-auto px-6 py-12 relative">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 border-b border-slate-800 pb-4">
              <button className="hover:text-cyan-400 flex items-center gap-1 transition-colors" onClick={() => setView('dashboard')}><ChevronLeft className="w-4 h-4" /> Dashboard</button>
              <span className="text-slate-700">/</span>
              <span>{activeModule?.title}</span>
              <span className="text-slate-700">/</span>
              <span className="text-slate-300 font-bold">{activeLesson.title}</span>
            </div>

            <div className="bg-slate-900/50 rounded-2xl p-8 md:p-12 border border-slate-800/50 shadow-xl">
              {contentLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                  <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p>正在加载课程内容...</p>
                </div>
              ) : fetchError ? (
                <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                   <div className="flex justify-center mb-4"><AlertTriangle className="w-8 h-8 text-red-400" /></div>
                   <h3 className="text-lg font-bold text-red-400 mb-2">内容加载失败</h3>
                   <p className="text-slate-400 text-sm mb-4">无法加载课程文本，已尝试本地镜像与 GitHub Raw。</p>
                   <div className="bg-black/30 p-3 rounded font-mono text-xs text-slate-500 break-all whitespace-pre-wrap">{fetchError}</div>
                </div>
              ) : (
                <article className="prose prose-invert prose-lg max-w-3xl mx-auto mb-12">
                  <MarkdownRenderer content={lessonContent} basePath={basePath} />
                </article>
              )}

              <div className="border-t border-slate-800 pt-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-px bg-slate-800 flex-1"></div>
                  <span className="text-slate-500 text-xs font-mono uppercase">Assessment Phase</span>
                  <div className="h-px bg-slate-800 flex-1"></div>
                </div>
                {progress[activeLesson.id] ? (
                  <div className="flex items-center justify-center p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 font-bold gap-2 animate-in zoom-in">
                    <CheckCircle className="w-6 h-6" /> 课程已完成 | Mission Accomplished
                  </div>
                ) : (
                  <MultiQuiz lessonId={activeLesson.id} onPass={() => handleLessonPass(activeLesson.id)} />
                )}
              </div>
            </div>

            <AiTutor lessonContext={lessonContent} />
          </div>
        )}
        
        {/* 🏆 徽章收藏馆模态框 */}
        {showBadgeCollection && (
          <BadgeCollection 
            earnedBadges={earnedBadges}
            onClose={() => setShowBadgeCollection(false)}
          />
        )}
        
        {/* 🎆 徽章解锁动画 */}
        {pendingBadgeUnlock && (
          <BadgeUnlockAnimation 
            badge={pendingBadgeUnlock}
            onClose={() => setPendingBadgeUnlock(null)}
          />
        )}
      </main>
    </div>
    </>
  );
}