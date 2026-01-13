import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Star, Trophy } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

/**
 * 徽章收藏页面
 * 显示用户获得的所有徽章
 * TODO: 从原App.jsx迁移完整的徽章系统
 */
const BadgeCollectionPage = () => {
  const { earnedBadges, getBadgeCount, totalExperience, userTitle } = useUserStore();

  const badgeCount = getBadgeCount();

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回课程</span>
          </Link>

          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">{badgeCount} 个徽章</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Summary */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-md border border-purple-500/30 rounded-xl">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Star className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">{userTitle}</h2>
              <p className="text-purple-300">经验值：{totalExperience} XP</p>
            </div>
          </div>
        </div>

        {/* Badge Grid */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white mb-4">我的徽章</h3>
        </div>

        {badgeCount === 0 ? (
          <div className="p-12 text-center bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
            <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">还没有徽章</p>
            <p className="text-slate-500 mt-2">完成课程开始收集徽章吧！</p>
            <Link
              to="/dashboard"
              className="inline-block mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              开始学习
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Object.entries(earnedBadges).map(([badgeId, badge]) => (
              <div
                key={badgeId}
                className="p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl hover:border-purple-500/40 transition-all hover:scale-105"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-white font-bold text-center mb-2">{badgeId}</h4>
                <p className="text-slate-400 text-sm text-center">{badge.moduleId}</p>
                <p className="text-slate-500 text-xs text-center mt-2">
                  {new Date(badge.timestamp).toLocaleDateString('zh-CN')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Development Status */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-400 text-sm">
            <strong>开发状态：</strong> 徽章系统基础框架已就绪。
            完整的徽章设计和解锁动画将在下一阶段实现。
          </p>
        </div>
      </div>
    </div>
  );
};

export default BadgeCollectionPage;
