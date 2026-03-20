import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Award, ArrowLeft, Share2 } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { BadgeCard, ACHIEVEMENT_BADGES, SPECIAL_BADGES } from '../features/badges';
import ShareCard from '../components/ShareCard';

/**
 * 徽章收藏页面
 * 使用重构后的徽章系统模块
 */
const BadgeCollectionPage = () => {
  const { lang } = useParams();
  const { earnedBadges, totalExperience, userTitle } = useUserStore();
  const [showShareCard, setShowShareCard] = useState(false);

  const totalBadges = Object.keys(ACHIEVEMENT_BADGES).length + Object.keys(SPECIAL_BADGES).length;
  const earnedBadgeCount = Object.keys(earnedBadges).length;
  const completionRate = ((earnedBadgeCount / totalBadges) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-950">
      <title>徽章收藏馆 | Web3 Starter</title>
      <meta name="description" content="Web3 学习平台徽章收藏，查看已获得的学习成就徽章" />
      <meta property="og:title" content="徽章收藏馆 | Web3 Starter" />
      <link
        rel="canonical"
        href={`https://beihaili.github.io/Get-Started-with-Web3/${lang}/badges`}
      />
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/${lang}/dashboard`}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回主页</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-slate-400">头衔</div>
              <div className="font-bold text-cyan-400">{userTitle}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-400">经验值</div>
              <div className="font-bold text-purple-400">{totalExperience} XP</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            🏆 徽章收藏馆
          </h1>
          <p className="text-slate-400 text-lg">
            收集率：{completionRate}% ({earnedBadgeCount}/{totalBadges})
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {earnedBadgeCount === 0 ? (
          <div className="max-w-2xl mx-auto text-center p-12 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
            <Award className="w-24 h-24 mx-auto mb-6 text-slate-600" />
            <h2 className="text-2xl font-bold text-white mb-4">还没有获得徽章</h2>
            <p className="text-slate-400 mb-6">完成课程学习，解锁精美徽章和丰厚奖励！</p>
            <Link
              to={`/${lang}/dashboard`}
              className="inline-block px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors font-medium"
            >
              开始学习
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
              {Object.values(ACHIEVEMENT_BADGES).map((badge) => {
                const earnedData = earnedBadges[badge.id];
                return (
                  <BadgeCard
                    key={badge.id}
                    badge={badge}
                    earned={!!earnedData}
                    earnedData={earnedData}
                    progress={0}
                  />
                );
              })}
            </div>

            {/* Special Badges */}
            <div className="max-w-6xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">特殊成就</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.values(SPECIAL_BADGES).map((badge) => {
                  const earnedData = earnedBadges[badge.id];
                  return (
                    <BadgeCard
                      key={badge.id}
                      badge={badge}
                      earned={!!earnedData}
                      earnedData={earnedData}
                      progress={0}
                    />
                  );
                })}
              </div>
            </div>

            <div className="max-w-4xl mx-auto p-8 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
              <div className="grid grid-cols-3 gap-4 text-center mb-6">
                <div>
                  <div className="text-3xl font-bold text-cyan-400">{earnedBadgeCount}</div>
                  <div className="text-sm text-slate-400">已获得</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-400">
                    {totalBadges - earnedBadgeCount}
                  </div>
                  <div className="text-sm text-slate-400">未解锁</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400">{completionRate}%</div>
                  <div className="text-sm text-slate-400">完成度</div>
                </div>
              </div>
              <button
                onClick={() => setShowShareCard(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium"
              >
                <Share2 className="w-4 h-4" />
                分享学习成就
              </button>
            </div>
          </>
        )}
      </div>

      {showShareCard && <ShareCard onClose={() => setShowShareCard(false)} />}
    </div>
  );
};

export default BadgeCollectionPage;
