import React, { useState, useEffect } from 'react';
import { 
  Terminal, Shield, Cpu, Zap, Github, 
  Code, ChevronRight, CheckCircle, PlayCircle, Award, Layout, ChevronLeft,
  Menu, MessageCircle, Sparkles,
  ArrowRight, Database, AlertTriangle, ExternalLink
} from 'lucide-react';

// Import modular components
import { MouseSpotlight, ParticleBackground, Confetti } from './components/animations/index.js';
import { Web3Oracle, WalletSimulator, HashVisualizer } from './components/interactive/index.js';
import { COURSE_DATA, getRawBaseUrl, getRawUrl } from './config/courseData.js';
import { styles } from './config/styles.js';

// Simplified components that would be separated later
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
        <button onClick={handleClose} className="absolute top-2 right-2 text-slate-500 hover:text-white">
          <span className="w-4 h-4">×</span>
        </button>
        
        <div className="flex gap-3 items-start relative z-10">
          <div className="bg-yellow-500/20 p-2 rounded-lg shrink-0 animate-bounce">
            <span className="w-6 h-6 text-yellow-400">⭐</span>
          </div>
          <div>
            <h4 className="font-bold text-white text-sm mb-1">喜欢这个教程吗？</h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              如果内容对你有帮助，请帮我们在 GitHub 上点一颗星 ⭐ 
              这是对开源作者最大的鼓励！
            </p>
            <a 
              href="https://github.com/beihaili/GetStartedWithWeb3" 
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

// Simplified MarkdownRenderer 
const MarkdownRenderer = ({ content, basePath }) => {
  const parseInline = (text) => {
    if (!text) return null;
    
    // Basic markdown parsing - simplified version
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl md:text-4xl font-black text-white mt-12 mb-8">{line.slice(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl md:text-3xl font-bold text-white mt-10 mb-6">{line.slice(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl md:text-2xl font-bold text-cyan-400 mt-8 mb-4 flex items-center gap-2"><ChevronRight className="w-5 h-5"/>{line.slice(4)}</h3>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-4 text-slate-300 leading-7">{line}</p>;
      }
    });
  };

  return <div className="font-sans text-base">{parseInline(content)}</div>;
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

// Main App Component
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
      return;
    }

    const fetchContent = async () => {
      setContentLoading(true);
      setFetchError(null);
      setBasePath(getRawBaseUrl(activeLesson.path));
      
      const tryFetch = async (filename) => {
        const path = `${activeLesson.path}/${filename}`;
        const url = getRawUrl(path);
        try {
          const res = await fetch(url);
          if (res.ok) {
            return await res.text();
          }
          return null;
        } catch (e) {
          return null;
        }
      };

      try {
        let text = await tryFetch('README.MD');
        if (!text) {
           text = await tryFetch('README.md');
        }
        if (!text) {
           text = await tryFetch('readme.md');
        }

        if (text) {
          setLessonContent(text);
        } else {
          const failedUrl = getRawUrl(`${activeLesson.path}/README.MD`);
          setFetchError(failedUrl); 
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

  // Simulate Gas Price
  useEffect(() => {
    const interval = setInterval(() => setGasPrice(p => Math.max(8, Math.min(50, p + Math.floor(Math.random() * 5) - 2))), 3000);
    return () => clearInterval(interval);
  }, []);

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
    setShowConfetti(true); 
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const totalLessons = COURSE_DATA.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const completedCount = Object.keys(progress).length;
  const progressPercentage = Math.round((completedCount / totalLessons) * 100);

  // Landing Page
  if (view === 'landing') {
    return (
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
              {connected ? (
                <button onClick={() => setView('dashboard')} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium border border-slate-700 flex items-center gap-2 transition-colors">
                  <Layout className="w-4 h-4" /> Dashboard
                </button>
              ) : (
                <button onClick={connectWallet} className="bg-white text-black hover:bg-slate-200 px-4 py-2 rounded-lg font-bold shadow-lg shadow-white/10 flex items-center gap-2 transition-colors">
                  <span className="w-4 h-4">💳</span> Connect
                </button>
              )}
            </div>
          </div>
        </nav>

        <section className="relative pt-40 pb-20 px-4 text-center max-w-5xl mx-auto z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-8">
            <Sparkles className="w-3 h-3" /> AI-Powered Web3 Education
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
             从 0x00 到 <br />
            <span className={styles.glowText}>Web3 Builder</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            开源、免费、实战导向。
            内置 <span className="text-cyan-400 font-bold">AI 助教</span> 与 <span className="text-cyan-400 font-bold">交互式演练</span>，
            为你铺设最清晰的去中心化学习路径。
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button onClick={() => { if (!connected) connectWallet(); setView('dashboard'); }} className={styles.neonButton}>
              <span className="relative z-10 flex items-center gap-2">Start Journey <ChevronRight className="w-4 h-4" /></span>
            </button>
            <a href="https://github.com/beihaili/GetStartedWithWeb3" target="_blank" rel="noreferrer" className="px-8 py-3 rounded-full bg-slate-800/50 hover:bg-slate-800 text-white font-bold border border-slate-700 backdrop-blur transition-all flex items-center gap-2 justify-center hover:scale-105">
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
              <WalletSimulator />
              <Web3Oracle />
              <HashVisualizer />
            </div>
          </div>
        </section>
        
        <section className="py-20 bg-slate-900/50 border-t border-slate-800 relative z-20">
           <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center text-white mb-12">为什么选择这个平台？</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {icon: Database, title: "链上进度存档", desc: "你的学习进度与钱包地址绑定，永久保存，如同链上资产般安全。"},
                  {icon: MessageCircle, title: "AI 助教支持", desc: "遇到不懂的概念？内置 AI 助教随时解答，并自动生成测验巩固知识。"},
                  {icon: Terminal, title: "实战代码演练", desc: "不仅仅是阅读。我们提供 Hardhat/Foundry 实战案例，带你编写真正的智能合约。"}
                ].map((item, i) => (
                  <div key={i} className={styles.glassCard + " p-8 rounded-2xl relative overflow-hidden group"}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <item.icon size={80} />
                    </div>
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                      <item.icon />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
           </div>
        </section>

        <footer className="py-8 text-center text-slate-600 text-sm border-t border-slate-800 bg-slate-950 relative z-20">
          Built with React, Tailwind & Gemini API. Open Source Education.
        </footer>
      </div>
    );
  }

  // Dashboard & Reader View (simplified)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex overflow-hidden">
      <Confetti active={showConfetti} />
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0 flex flex-col h-screen">
        <div className="p-6 border-b border-slate-800 flex items-center gap-2 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setView('landing')}>
          <div className="w-8 h-8 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Code className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">Web3 Starter</span>
        </div>

        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[2px]">
               <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                 <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="avatar" className="w-8 h-8 rounded-full" />
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
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
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
                      onClick={() => { 
                        setView('reader'); 
                        setActiveModule(module); 
                        setActiveLesson(lesson); 
                        window.scrollTo({top: 0}); 
                      }} 
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive 
                          ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/20' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0" /> 
                      ) : (
                        <PlayCircle className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-600'}`} />
                      )}
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
              System Ready. Continuation Protocol Initiated.
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
                     <Shield className="w-6 h-6 text-cyan-500"/>
                   </div>
                   <span className="text-xs text-slate-500 font-mono">STATUS</span>
                 </div>
                 <div className="text-3xl font-black text-white">{progressPercentage}%</div>
               </div>
               
               <div className={styles.glassCard + " p-6 rounded-2xl relative overflow-hidden"}>
                 <div className="absolute -right-4 -top-4 opacity-10">
                   <Award size={100} />
                 </div>
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-2 bg-yellow-500/10 rounded-lg">
                     <Award className="w-6 h-6 text-yellow-500"/>
                   </div>
                   <span className="text-xs text-slate-500 font-mono">RANK</span>
                 </div>
                 <div className="text-3xl font-black text-white">
                   {progressPercentage === 100 ? 'Solidity God' : 'Apprentice'}
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
                     className="group bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 p-6 rounded-xl transition-all cursor-pointer flex justify-between items-center relative overflow-hidden" 
                     onClick={() => { setView('reader'); setActiveModule(mod); setActiveLesson(firstUnfinished); }}
                   >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="flex gap-4 items-center relative z-10">
                        <div className={`w-12 h-12 rounded-lg ${mod.color.replace('text', 'bg')}/10 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                          <mod.icon className={`w-6 h-6 ${mod.color}`} />
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{mod.title}</div>
                          <div className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{firstUnfinished.title}</div>
                        </div>
                      </div>
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-600 transition-colors">
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                      </div>
                   </div>
                 )
              })}
              {progressPercentage === 100 && (
                <div className="text-center p-12 border border-dashed border-slate-700 rounded-xl text-slate-500">
                  🎉 所有任务已完成。Stay Hungry, Stay Foolish.
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'reader' && activeLesson && (
          <div className="max-w-4xl mx-auto px-6 py-12 relative">
            <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 border-b border-slate-800 pb-4">
              <button className="hover:text-cyan-400 flex items-center gap-1 transition-colors" onClick={() => setView('dashboard')}>
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
                  <Cpu className="w-10 h-10 text-cyan-400 animate-spin" />
                  <p>正在从 GitHub 抓取最新教程...</p>
                </div>
              ) : fetchError ? (
                <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-xl text-center">
                   <div className="flex justify-center mb-4">
                     <AlertTriangle className="w-8 h-8 text-red-400" />
                   </div>
                   <h3 className="text-lg font-bold text-red-400 mb-2">内容加载失败</h3>
                   <p className="text-slate-400 text-sm mb-4">无法从 GitHub 获取文件。请检查仓库路径是否正确。</p>
                   <div className="bg-black/30 p-3 rounded font-mono text-xs text-slate-500 break-all">{fetchError}</div>
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
                  <SimpleQuiz onPass={() => handleLessonPass(activeLesson.id)} />
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}