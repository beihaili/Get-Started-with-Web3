import React, { useState } from 'react';
import { Loader2, ChevronLeft, Dna, Gem } from 'lucide-react';
import { styles } from '../../config/styles.js';

const Web3OracleInner = () => {
  const [status, setStatus] = useState('idle'); // idle, signing, revealed
  const [fortune, setFortune] = useState(null);

  const fortunes = [
    {
      rarity: 'Common',
      color: 'text-slate-400',
      border: 'border-slate-500',
      bg: 'bg-slate-500/20',
      text: '今天的 Gas 费平平无奇，适合潜心学习 Solidity。',
    },
    {
      rarity: 'Uncommon',
      color: 'text-green-400',
      border: 'border-green-500',
      bg: 'bg-green-500/20',
      text: '牛市在心中。保持耐心，HODL 住手中的优质资产。',
    },
    {
      rarity: 'Rare',
      color: 'text-cyan-400',
      border: 'border-cyan-500',
      bg: 'bg-cyan-500/20',
      text: '链上数据显示今日适合交互。去尝试一个新的 DApp 吧！',
    },
    {
      rarity: 'Epic',
      color: 'text-purple-400',
      border: 'border-purple-500',
      bg: 'bg-purple-500/20',
      text: '灵感涌现！今天是你部署第一个智能合约的黄道吉日。',
    },
    {
      rarity: 'Legendary',
      color: 'text-yellow-400',
      border: 'border-yellow-500',
      bg: 'bg-yellow-500/20',
      text: '✨ 传说级运势！你可能会发现下一个 Alpha 项目的线索。',
    },
  ];

  const handleConsult = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('请先安装 MetaMask 钱包来体验此功能！');
      return;
    }

    setStatus('signing');
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      const msg = `Asking the Web3 Oracle for guidance on ${new Date().toLocaleDateString()}`;

      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [msg, account],
      });

      const lastChar = signature.slice(-1);
      const index = lastChar.charCodeAt(0) % fortunes.length;

      setTimeout(() => {
        setFortune(fortunes[index]);
        setStatus('revealed');
      }, 800);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const reset = () => {
    setStatus('idle');
    setFortune(null);
  };

  return (
    <div
      className={`${styles.glassCard} p-8 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[300px] group`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>

      {status === 'idle' && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute -inset-4 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
            <div className="w-20 h-20 bg-slate-900 border-2 border-purple-500/50 rounded-full flex items-center justify-center relative z-10 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
              <Gem className="w-10 h-10 text-purple-400 animate-bounce-slow" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Web3 每日预言机</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              利用你的钱包签名作为熵源 (Entropy)，
              <br />
              生成今日专属的链上运势。
            </p>
          </div>
          <button
            onClick={handleConsult}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold rounded-full transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20 flex items-center gap-2 mx-auto"
          >
            <Dna className="w-4 h-4" />
            签名以抽取运势
          </button>
          <p className="text-[10px] text-slate-500">
            * 安全提示：此操作仅请求签名，不涉及任何 Gas 费用或交易。
          </p>
        </div>
      )}

      {status === 'signing' && (
        <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          <p className="text-purple-200 font-mono text-sm animate-pulse">等待钱包签名确认...</p>
        </div>
      )}

      {status === 'revealed' && fortune && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500 w-full">
          <div
            className={`inline-block px-3 py-1 rounded-full border ${fortune.border} ${fortune.bg} ${fortune.color} text-xs font-bold tracking-widest uppercase mb-2`}
          >
            {fortune.rarity} Drop
          </div>
          <h3 className="text-3xl font-black text-white leading-tight">{fortune.text}</h3>
          <div className="pt-6 border-t border-slate-800/50 w-full">
            <button
              onClick={reset}
              className="text-slate-500 hover:text-white text-sm flex items-center gap-2 mx-auto transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> 再次尝试
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const Web3Oracle = React.memo(Web3OracleInner);
