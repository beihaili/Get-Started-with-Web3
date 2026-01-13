import { useEffect } from 'react';

/**
 * 徽章解锁动画组件
 * 从原App.jsx迁移 (lines 613-690)
 */
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
        <div
          className={`absolute -inset-20 bg-gradient-to-r ${badge.color} opacity-20 rounded-full blur-3xl animate-pulse`}
        />

        {/* 主内容 */}
        <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-12 border border-white/10 text-center max-w-md">
          {/* 顶部装饰 */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div
              className={`px-6 py-2 rounded-full bg-gradient-to-r ${badge.color} text-white font-bold text-sm`}
            >
              🎉 成就解锁！
            </div>
          </div>

          {/* 徽章图标 */}
          <div className="mb-6">
            <div
              className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center shadow-2xl ${badge.glowColor} animate-bounce-slow`}
            >
              <Icon className="w-16 h-16 text-white" />
            </div>
          </div>

          {/* 徽章信息 */}
          <h2 className="text-3xl font-black text-white mb-2">{badge.title}</h2>
          <p className={`text-lg ${badge.color} mb-4 font-semibold`}>{badge.name}</p>
          <p className="text-slate-300 leading-relaxed mb-6">{badge.description}</p>

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
                <p className="text-xs text-slate-400">💡 {badge.rewards.nextBadgeHint}</p>
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

export default BadgeUnlockAnimation;
