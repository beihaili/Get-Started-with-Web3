import { X } from 'lucide-react';
import BadgeCard from './BadgeCard';
import { ACHIEVEMENT_BADGES } from '../badgeData';

/**
 * 徽章收藏馆组件
 * 从原App.jsx迁移 (lines 693-760)
 */
const BadgeCollection = ({ earnedBadges, onClose }) => {
  const totalBadges = Object.keys(ACHIEVEMENT_BADGES).length;
  const earnedCount = Object.keys(earnedBadges).length;
  const completionRate = ((earnedCount / totalBadges) * 100).toFixed(1);

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
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
            return <BadgeCard key={badge.id} badge={badge} earned={isEarned} progress={0} />;
          })}
        </div>

        {/* 统计信息 */}
        <div className="border-t border-slate-700 pt-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-cyan-400">{earnedCount}</div>
              <div className="text-sm text-slate-400">已获得</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{totalBadges - earnedCount}</div>
              <div className="text-sm text-slate-400">未解锁</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{completionRate}%</div>
              <div className="text-sm text-slate-400">完成度</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeCollection;
