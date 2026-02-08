import React, { useState, useEffect } from 'react';
import { Hash } from 'lucide-react';
import { styles } from '../../config/styles.js';

const HashVisualizerInner = () => {
  const [input, setInput] = useState('Web3');
  const [hash, setHash] = useState('');

  useEffect(() => {
    let h = 0xdeadbeef;
    for (let i = 0; i < input.length; i++) h = Math.imul(h ^ input.charCodeAt(i), 2654435761);
    const fake =
      ((h ^ (h >>> 16)) >>> 0).toString(16).padStart(8, '0') + input.length.toString(16) + 'f2a9';
    setHash('0x' + fake.repeat(4).substring(0, 32) + '...');
  }, [input]);

  return (
    <div className={`${styles.glassCard} p-6 rounded-2xl`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-white flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-400" /> 哈希可视化
        </h3>
        <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 rounded">
          Immutable
        </span>
      </div>
      <div className="space-y-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-sm rounded px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors focus:shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          placeholder="Input data..."
        />
        <div className="w-full bg-black border border-slate-800 text-green-400 font-mono text-xs p-3 rounded break-all shadow-inner h-12 flex items-center transition-all duration-300 hover:border-green-500/50">
          {hash}
        </div>
      </div>
      <p className="text-xs text-slate-400 mt-4">
        区块链不可篡改的基石。修改任意一个字符，哈希指纹都会完全改变（雪崩效应）。
      </p>
    </div>
  );
};

export const HashVisualizer = React.memo(HashVisualizerInner);
