import { useState, useEffect } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

/**
 * Merkle Tree Builder — Interactive visualization
 * - 4~8 leaf input strings
 * - SHA-256 via Web Crypto API (no external deps)
 * - Visual tree: leaves → root, abbreviated hash (8 chars), full on hover
 */
const MerkleTreeBuilder = ({ defaultValues = ['a', 'b', 'c', 'd'] }) => {
  const [inputs, setInputs] = useState(defaultValues);
  const [tree, setTree] = useState(null);
  const [hovered, setHovered] = useState(null);

  // SHA-256 via Web Crypto API
  const sha256 = async (str) => {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  };

  // Build merkle tree from leaf string values
  const buildTree = async (values) => {
    if (!values || values.length === 0) return [];
    // Pad to even count
    let leaves = await Promise.all(values.map(async (v) => ({ hash: await sha256(String(v)), raw: String(v) })));
    const levels = [leaves];
    while (leaves.length > 1) {
      const next = [];
      for (let i = 0; i < leaves.length; i += 2) {
        const l = leaves[i];
        const r = leaves[i + 1] || leaves[i]; // duplicate if odd
        const hash = await sha256(l.hash + r.hash);
        next.push({ hash, left: l, right: r });
      }
      leaves = next;
      levels.push(leaves);
    }
    return levels;
  };

  useEffect(() => {
    buildTree(inputs).then(setTree);
  }, []);

  const updateInput = (idx, val) => {
    const next = [...inputs];
    next[idx] = val;
    setInputs(next);
  };

  const addInput = () => {
    if (inputs.length >= 8) return;
    setInputs([...inputs, `leaf${inputs.length + 1}`]);
  };

  const removeInput = (idx) => {
    if (inputs.length <= 2) return;
    setInputs(inputs.filter((_, i) => i !== idx));
  };

  const rebuild = () => {
    buildTree(inputs).then(setTree);
  };

  const reset = () => {
    setTree(null);
    setInputs(defaultValues);
  };

  const abbreviate = (h) => h.slice(0, 8);

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-white font-bold flex items-center gap-2">
          <span className="text-lg">🌲</span> Merkle Tree Builder
        </h4>
        {tree && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> 重置
          </button>
        )}
      </div>

      <p className="text-slate-400 text-sm mb-4">输入字符串，构建 Merkle 树并可视化展示哈希计算过程。</p>

      {/* Input list */}
      <div className="flex flex-col gap-2 mb-4">
        {inputs.map((val, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-slate-500 text-xs font-mono w-16 shrink-0">Leaf {idx + 1}</span>
            <input
              type="text"
              value={val}
              onChange={(e) => updateInput(idx, e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 text-slate-200 rounded px-3 py-1.5 text-sm font-mono focus:border-cyan-400 focus:outline-none"
            />
            {inputs.length > 2 && (
              <button
                onClick={() => removeInput(idx)}
                className="text-slate-500 hover:text-red-400 transition-colors p-1"
                aria-label={`Remove leaf ${idx + 1}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={rebuild}
          className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" /> 构建树
        </button>
        {inputs.length < 8 && (
          <button
            onClick={addInput}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 px-4 rounded-lg transition-colors text-sm"
          >
            <Plus className="w-4 h-4" /> 添加节点
          </button>
        )}
      </div>

      {/* Tree visualization */}
      {tree && (
        <div className="mt-6 overflow-x-auto">
          <div className="flex flex-col items-center gap-4 min-w-max">
            {[...tree].reverse().map((level, li) => {
              const isRoot = li === 0;
              const isLeaf = li === tree.length - 1;
              const levelLabel = isRoot ? 'Root (Merkle Root)' : isLeaf ? 'Leaves' : `Level ${tree.length - 1 - li}`;
              return (
                <div key={li} className="flex flex-col items-center">
                  <div className="text-xs text-slate-500 font-mono mb-1.5">{levelLabel}</div>
                  <div className="flex items-center gap-4">
                    {level.map((node, ni) => {
                      const h = node.hash;
                      const isHov = hovered === h;
                      return (
                        <div key={ni} className="flex flex-col items-center">
                          <div
                            className={[
                              'px-3 py-2 rounded-lg border font-mono text-xs cursor-default transition-all max-w-[140px] truncate',
                              isRoot ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' :
                              isLeaf ? 'bg-green-500/10 border-green-500/30 text-green-200' :
                              'bg-slate-700 border-slate-600 text-slate-300'
                            ].join(' ')}
                            onMouseEnter={() => setHovered(h)}
                            onMouseLeave={() => setHovered(null)}
                            title={h}
                          >
                            {isLeaf ? `${node.raw.slice(0, 6)}…` : ''} {abbreviate(h)}
                          </div>
                          {isHov && (
                            <div className="mt-1 px-2 py-1 bg-slate-900 border border-slate-500 rounded text-xs font-mono text-slate-200 whitespace-nowrap z-10 shadow-xl">
                              {h}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {li < tree.length - 1 && (
                    <div className="w-px h-4 bg-slate-600 mt-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default MerkleTreeBuilder;
