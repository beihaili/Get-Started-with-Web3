import React, { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { styles } from '../../config/styles.js';

const WalletSimulatorInner = () => {
  const [step, setStep] = useState(0);
  const handleConnect = () => {
    setStep(1);
    setTimeout(() => setStep(2), 1500);
  };

  return (
    <div className={`${styles.glassCard} p-6 rounded-2xl relative overflow-hidden group`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Wallet className="w-4 h-4 text-cyan-400" /> 钱包模拟器
        </h3>
        <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 rounded">
          Interactive
        </span>
      </div>
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 h-32 flex flex-col justify-center items-center relative">
        {step === 0 && (
          <button
            onClick={handleConnect}
            className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 hover:shadow-lg shadow-orange-500/20"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              className="w-5 h-5"
              alt="MetaMask"
            />
            Connect
          </button>
        )}
        {step === 1 && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            <span className="text-xs text-slate-400">Requesting signature...</span>
          </div>
        )}
        {step === 2 && (
          <div className="w-full animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Connected
              </span>
              <span className="text-xs text-slate-500">ETH Mainnet</span>
            </div>
            <div className="bg-slate-900 rounded p-2 mb-2">
              <div className="text-[10px] text-slate-500 uppercase">Address</div>
              <div className="text-xs text-cyan-300 font-mono truncate">0x71C...9A23</div>
            </div>
            <button
              onClick={() => setStep(0)}
              className="text-[10px] text-slate-500 hover:text-white underline w-full text-center"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-4">
        体验 DApp 如何请求用户授权。你的私钥永远不会离开你的设备。
      </p>
    </div>
  );
};

export const WalletSimulator = React.memo(WalletSimulatorInner);
