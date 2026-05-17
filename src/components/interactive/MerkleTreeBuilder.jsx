import React, { useEffect, useMemo, useState } from 'react';
import { GitBranch, Plus, Trash2 } from 'lucide-react';
import { abbreviateHash, buildMerkleTree } from '../../utils/merkleTree.js';

const MIN_TRANSACTIONS = 4;
const MAX_TRANSACTIONS = 8;

const defaultTransactions = [
  'Alice pays Bob 0.25 BTC',
  'Bob pays Carol 0.10 BTC',
  'Carol pays Dave 0.05 BTC',
  'Dave pays Erin 0.02 BTC',
];

const copy = {
  en: {
    title: 'Merkle Tree Builder',
    badge: 'SHA-256',
    description: 'Edit transactions and watch the tree recompute up to one tamper-evident root.',
    add: 'Add transaction',
    remove: 'Remove transaction',
    transaction: 'Transaction',
    root: 'Root',
    level: 'Level',
    leaves: 'Leaves',
    rootHash: 'Root hash',
    nodeHash: 'Node hash',
    fullHash: 'Full hash',
    calculating: 'Calculating tree...',
  },
  zh: {
    title: 'Merkle 树构建器',
    badge: 'SHA-256',
    description: '编辑交易列表，观察它们如何逐层哈希成一个可防篡改的根节点。',
    add: '添加交易',
    remove: '删除交易',
    transaction: '交易',
    root: '根节点',
    level: '层级',
    leaves: '叶子节点',
    rootHash: '根哈希',
    nodeHash: '节点哈希',
    fullHash: '完整哈希',
    calculating: '正在计算树...',
  },
};

const getInitialTransactions = (initialTransactions) => {
  const source = initialTransactions?.length ? initialTransactions : defaultTransactions;
  const clamped = source.slice(0, MAX_TRANSACTIONS);

  while (clamped.length < MIN_TRANSACTIONS) {
    clamped.push(defaultTransactions[clamped.length]);
  }

  return clamped;
};

const MerkleTreeBuilderInner = ({ initialTransactions, lang = 'en' }) => {
  const text = copy[lang] || copy.en;
  const [transactions, setTransactions] = useState(() =>
    getInitialTransactions(initialTransactions)
  );
  const [levels, setLevels] = useState([]);
  const [selectedHash, setSelectedHash] = useState('');
  const displayLevels = useMemo(() => levels.slice().reverse(), [levels]);
  const isCalculating = levels.length === 0;

  useEffect(() => {
    let cancelled = false;

    buildMerkleTree(transactions).then((treeLevels) => {
      if (!cancelled) {
        setLevels(treeLevels);
        setSelectedHash(treeLevels.at(-1)?.[0]?.hash || '');
      }
    });

    return () => {
      cancelled = true;
    };
  }, [transactions]);

  const updateTransaction = (index, value) => {
    setTransactions((current) =>
      current.map((transaction, transactionIndex) =>
        transactionIndex === index ? value : transaction
      )
    );
  };

  const addTransaction = () => {
    setTransactions((current) => {
      if (current.length >= MAX_TRANSACTIONS) return current;
      return [...current, `tx-${current.length + 1}: new payment`];
    });
  };

  const removeTransaction = (index) => {
    setTransactions((current) => {
      if (current.length <= MIN_TRANSACTIONS) return current;
      return current.filter((_, transactionIndex) => transactionIndex !== index);
    });
  };

  return (
    <section className="my-8 rounded-lg border border-slate-700/70 bg-slate-900/70 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-white">
            <GitBranch className="h-5 w-5 text-orange-400" />
            {text.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{text.description}</p>
        </div>
        <span className="w-fit rounded border border-orange-400/30 px-2 py-1 font-mono text-xs text-orange-300">
          {text.badge}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="min-w-0 flex-1">
                <span className="mb-1 block text-xs font-medium text-slate-400">
                  {text.transaction} {index + 1}
                </span>
                <input
                  aria-label={`${text.transaction} ${index + 1}`}
                  value={transaction}
                  onChange={(event) => updateTransaction(index, event.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-xs text-slate-200 outline-none transition-colors focus:border-orange-400"
                />
              </label>
              <button
                type="button"
                onClick={() => removeTransaction(index)}
                disabled={transactions.length <= MIN_TRANSACTIONS}
                aria-label={`${text.remove} ${index + 1}`}
                className="mt-5 rounded-lg border border-slate-700 p-2 text-slate-400 transition-colors hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-700 disabled:hover:text-slate-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addTransaction}
            disabled={transactions.length >= MAX_TRANSACTIONS}
            className="inline-flex items-center gap-2 rounded-lg border border-orange-400/40 px-3 py-2 text-sm font-medium text-orange-200 transition-colors hover:bg-orange-500/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
            {text.add}
          </button>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          {isCalculating ? (
            <p className="text-sm text-slate-400">{text.calculating}</p>
          ) : (
            <div className="space-y-4">
              {displayLevels.map((level, displayIndex) => {
                const sourceLevelIndex = levels.length - displayIndex - 1;
                const isRoot = displayIndex === 0;
                const isLeaves = sourceLevelIndex === 0;
                const label = isRoot
                  ? text.root
                  : isLeaves
                    ? text.leaves
                    : `${text.level} ${sourceLevelIndex}`;

                return (
                  <div key={sourceLevelIndex}>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {level.map((node, nodeIndex) => {
                        const shortHash = abbreviateHash(node.hash);
                        const hashLabel = isRoot ? text.rootHash : text.nodeHash;

                        return (
                          <button
                            key={`${sourceLevelIndex}-${nodeIndex}`}
                            type="button"
                            title={node.hash}
                            aria-label={`${hashLabel} ${shortHash}`}
                            onClick={() => setSelectedHash(node.hash)}
                            className={`rounded-lg border px-3 py-2 font-mono text-xs transition-colors ${
                              isRoot
                                ? 'border-orange-400/50 bg-orange-500/10 text-orange-200'
                                : 'border-slate-700 bg-slate-900 text-cyan-200 hover:border-cyan-400/60'
                            }`}
                          >
                            {shortHash}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {selectedHash && (
            <div className="mt-4 rounded-lg border border-slate-800 bg-black/40 p-3">
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {text.fullHash}
              </div>
              <p className="break-all font-mono text-xs text-green-300">{selectedHash}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const MerkleTreeBuilder = React.memo(MerkleTreeBuilderInner);
