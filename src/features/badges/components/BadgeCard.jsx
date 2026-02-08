import { CheckCircle } from 'lucide-react';
import BadgeFloatingAnimation from './BadgeFloatingAnimation';

/**
 * 单个徽章卡片组件
 * 从原App.jsx迁移 (lines 509-610)
 */
const BadgeCard = ({ badge, earned = false, earnedData, onClick, progress = 0 }) => {
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
      <div
        className={`
        absolute -inset-2 rounded-3xl transition-opacity duration-300 blur-xl
        ${earned ? `bg-gradient-to-r ${badge.color} opacity-30` : 'opacity-0'}
        group-hover:opacity-50
      `}
      />

      {/* 主卡片 */}
      <div
        className={`
        relative bg-slate-900/80 backdrop-blur-md rounded-2xl p-6
        border-2 transition-all duration-300
        ${earned ? `${badge.borderColor} ${badge.glowColor}` : 'border-slate-700'}
        hover:border-opacity-100 hover:shadow-2xl
      `}
      >
        {/* 稀有度标签 */}
        <div
          className={`
          absolute -top-2 left-1/2 transform -translate-x-1/2
          px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase
          ${earned ? `${badge.bgColor} ${badge.color}` : 'bg-slate-700 text-slate-400'}
          border
        `}
        >
          {badge.rarity}
        </div>

        {/* 进度条 (未获得的徽章) */}
        {!earned && progress > 0 && (
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="#334155" strokeWidth="2" fill="none" />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#06b6d4"
                  strokeWidth="2"
                  fill="none"
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
            <div
              className={`
              w-20 h-20 rounded-full flex items-center justify-center mb-4
              ${earned ? `bg-gradient-to-r ${badge.color} shadow-2xl ${badge.glowColor}` : 'bg-slate-800'}
              transition-all duration-500
            `}
            >
              <Icon className={`w-10 h-10 ${earned ? 'text-white' : 'text-slate-500'}`} />
            </div>
          </BadgeFloatingAnimation>

          <h3 className={`text-lg font-bold ${earned ? 'text-white' : 'text-slate-400'}`}>
            {badge.title}
          </h3>
          <p className={`text-sm ${earned ? 'text-slate-300' : 'text-slate-500'}`}>{badge.name}</p>
        </div>

        {/* 描述 */}
        <p className={`text-sm leading-relaxed ${earned ? 'text-slate-300' : 'text-slate-500'}`}>
          {badge.description}
        </p>

        {/* 解锁条件 */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-500">📋 {badge.requirement}</p>
        </div>

        {/* 获得时间 (仅已获得的徽章) */}
        {earned && (
          <div className="mt-2">
            <p className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              已获得{' '}
              {earnedData?.timestamp
                ? `• ${new Date(earnedData.timestamp).toLocaleDateString()}`
                : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
