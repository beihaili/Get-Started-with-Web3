import React, { useMemo, useState } from 'react';
import { AlertTriangle, Fuel, HelpCircle, RefreshCw } from 'lucide-react';
import {
  DEFAULT_BASE_FEE_GWEI,
  DEFAULT_ETH_USD,
  calculateGasFee,
  fetchBaseFeeGwei,
  fetchEthUsd,
} from '../../utils/gasFee.js';

const copy = {
  en: {
    title: 'Gas Fee Calculator',
    badge: 'EIP-1559',
    description:
      'Estimate how base fee, priority tip, and max fee cap shape an Ethereum transaction cost.',
    refresh: 'Refresh live data',
    refreshing: 'Refreshing...',
    liveSuccess: 'Live data refreshed.',
    rpcError: 'Could not refresh the base fee. Using the current estimate.',
    priceRateLimited: 'ETH/USD source is rate limited. Using cached or default USD estimate.',
    priceFallback: 'ETH/USD source failed. Using cached or default USD estimate.',
    defaults: 'Offline defaults are active until live data is refreshed.',
    warning: 'Max fee is below base fee + priority tip; the transaction may be delayed.',
    underBase: 'Max fee is below the base fee; the transaction is unlikely to be included.',
    gasLimit: 'Gas limit',
    priorityTip: 'Priority tip',
    maxFee: 'Max fee',
    baseFee: 'Base fee',
    effectiveGasPrice: 'Effective gas price',
    totalEth: 'Total cost',
    totalUsd: 'USD estimate',
    ethUsd: 'ETH/USD',
    tooltips: {
      gasLimit: 'Maximum gas units the transaction is allowed to consume.',
      priorityTip: 'Extra gwei paid to validators as the priority fee.',
      maxFee: 'Maximum gwei per gas you are willing to pay, including base fee and tip.',
    },
  },
  zh: {
    title: 'Gas 费用计算器',
    badge: 'EIP-1559',
    description: '估算基础费、优先小费和最大费用上限如何影响一笔以太坊交易成本。',
    refresh: '刷新实时数据',
    refreshing: '正在刷新...',
    liveSuccess: '实时数据已刷新。',
    rpcError: '无法刷新基础费，继续使用当前估算值。',
    priceRateLimited: 'ETH/USD 数据源被限流，继续使用缓存或默认美元估值。',
    priceFallback: 'ETH/USD 数据源失败，继续使用缓存或默认美元估值。',
    defaults: '刷新实时数据前，当前使用离线默认值。',
    warning: '最大费用低于基础费 + 优先小费，交易可能延迟。',
    underBase: '最大费用低于基础费，交易大概率不会被打包。',
    gasLimit: 'Gas 上限',
    priorityTip: '优先小费',
    maxFee: '最大费用',
    baseFee: '基础费',
    effectiveGasPrice: '有效 Gas 价格',
    totalEth: '总成本',
    totalUsd: '美元估算',
    ethUsd: 'ETH/USD',
    tooltips: {
      gasLimit: '这笔交易最多允许消耗的 gas 单位。',
      priorityTip: '额外支付给验证者的小费，单位是 gwei。',
      maxFee: '你愿意支付的每 gas 最高价格，包含基础费和小费。',
    },
  },
};

const formatGwei = (value) => `${value.toFixed(2)} gwei`;
const formatEth = (value) => `${value.toFixed(8)} ETH`;
const formatUsd = (value) => `$${value.toFixed(2)}`;

const FieldLabel = ({ label, tooltip }) => (
  <span className="mb-1 flex items-center gap-1 text-xs font-medium text-slate-400">
    {label}
    <span title={tooltip} aria-label={`${label} help`} className="text-slate-500">
      <HelpCircle className="h-3.5 w-3.5" />
    </span>
  </span>
);

const Metric = ({ label, value, tone = 'default' }) => {
  const toneClass =
    tone === 'accent'
      ? 'border-cyan-500/30 text-cyan-200'
      : tone === 'warning'
        ? 'border-amber-400/40 text-amber-200'
        : 'border-slate-800 text-slate-200';

  return (
    <div className={`rounded-lg border bg-slate-950/70 p-3 ${toneClass}`}>
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="font-mono text-sm">{value}</div>
    </div>
  );
};

const GasFeeCalculatorInner = ({ lang = 'en' }) => {
  const text = copy[lang] || copy.en;
  const [gasLimit, setGasLimit] = useState('21000');
  const [priorityTip, setPriorityTip] = useState('1.5');
  const [maxFee, setMaxFee] = useState('40');
  const [baseFeeGwei, setBaseFeeGwei] = useState(DEFAULT_BASE_FEE_GWEI);
  const [ethUsd, setEthUsd] = useState(DEFAULT_ETH_USD);
  const [status, setStatus] = useState(text.defaults);
  const [messages, setMessages] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const estimate = useMemo(
    () =>
      calculateGasFee({
        gasLimit,
        baseFeeGwei,
        priorityTipGwei: priorityTip,
        maxFeeGwei: maxFee,
        ethUsd,
      }),
    [baseFeeGwei, ethUsd, gasLimit, maxFee, priorityTip]
  );

  const refreshLiveData = async () => {
    setIsRefreshing(true);
    const nextMessages = [];

    const [baseFeeResult, priceResult] = await Promise.allSettled([
      fetchBaseFeeGwei(),
      fetchEthUsd(),
    ]);

    if (baseFeeResult.status === 'fulfilled') {
      setBaseFeeGwei(baseFeeResult.value);
    } else {
      nextMessages.push({ tone: 'error', text: text.rpcError });
    }

    if (priceResult.status === 'fulfilled') {
      setEthUsd(priceResult.value.value);

      if (priceResult.value.source === 'rate-limit') {
        nextMessages.push({ tone: 'warning', text: text.priceRateLimited });
      } else if (priceResult.value.source === 'fallback') {
        nextMessages.push({ tone: 'warning', text: text.priceFallback });
      }
    } else {
      nextMessages.push({ tone: 'warning', text: text.priceFallback });
    }

    setMessages(nextMessages);
    setStatus(nextMessages.length === 0 ? text.liveSuccess : text.defaults);
    setIsRefreshing(false);
  };

  const warningText = estimate.isUnderBaseFee
    ? text.underBase
    : estimate.isCapped
      ? text.warning
      : null;

  return (
    <section className="my-8 rounded-lg border border-slate-700/70 bg-slate-900/70 p-5 shadow-xl sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold text-white">
            <Fuel className="h-5 w-5 text-cyan-400" />
            {text.title}
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{text.description}</p>
        </div>
        <span className="w-fit rounded border border-cyan-400/30 px-2 py-1 font-mono text-xs text-cyan-300">
          {text.badge}
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-3">
          <label className="block">
            <FieldLabel label={text.gasLimit} tooltip={text.tooltips.gasLimit} />
            <input
              type="number"
              min="0"
              step="1000"
              aria-label={text.gasLimit}
              value={gasLimit}
              onChange={(event) => setGasLimit(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-200 outline-none transition-colors focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <FieldLabel label={text.priorityTip} tooltip={text.tooltips.priorityTip} />
            <input
              type="number"
              min="0"
              step="0.1"
              aria-label={text.priorityTip}
              value={priorityTip}
              onChange={(event) => setPriorityTip(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-200 outline-none transition-colors focus:border-cyan-400"
            />
          </label>

          <label className="block">
            <FieldLabel label={text.maxFee} tooltip={text.tooltips.maxFee} />
            <input
              type="number"
              min="0"
              step="0.1"
              aria-label={text.maxFee}
              value={maxFee}
              onChange={(event) => setMaxFee(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-slate-200 outline-none transition-colors focus:border-cyan-400"
            />
          </label>

          <button
            type="button"
            onClick={refreshLiveData}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 px-3 py-2 text-sm font-medium text-cyan-200 transition-colors hover:bg-cyan-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? text.refreshing : text.refresh}
          </button>
        </div>

        <div className="space-y-3 rounded-lg border border-slate-800 bg-slate-950/70 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Metric label={text.baseFee} value={formatGwei(baseFeeGwei)} />
            <Metric
              label={text.effectiveGasPrice}
              value={formatGwei(estimate.effectiveGasPriceGwei)}
              tone="accent"
            />
            <Metric label={text.totalEth} value={formatEth(estimate.totalEth)} />
            <Metric label={text.totalUsd} value={formatUsd(estimate.totalUsd)} />
            <Metric label={text.ethUsd} value={formatUsd(ethUsd)} />
          </div>

          {warningText && (
            <div className="flex items-start gap-2 rounded-lg border border-amber-400/40 bg-amber-500/10 p-3 text-sm text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{warningText}</span>
            </div>
          )}

          <p className="text-sm text-slate-400">{status}</p>
          {messages.map((message) => (
            <p
              key={message.text}
              className={`text-sm ${message.tone === 'error' ? 'text-red-300' : 'text-amber-200'}`}
            >
              {message.text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};

export const GasFeeCalculator = React.memo(GasFeeCalculatorInner);
