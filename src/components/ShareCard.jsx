import { useRef, useState, useCallback } from 'react';
import { Download, X, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useUserStore } from '../store/useUserStore';
import { ACHIEVEMENT_BADGES } from '../features/badges';

const ShareCard = ({ onClose }) => {
  const cardRef = useRef(null);
  const [generating, setGenerating] = useState(false);
  const { earnedBadges, totalExperience, userTitle, studyStreak } = useUserStore();

  const earnedBadgeList = Object.entries(earnedBadges)
    .map(([, data]) => {
      const badge = Object.values(ACHIEVEMENT_BADGES).find(
        (b) => b.id === data.moduleId || ACHIEVEMENT_BADGES[data.moduleId]?.id === b.id
      );
      // Also try matching by the key directly
      return badge || ACHIEVEMENT_BADGES[data.moduleId];
    })
    .filter(Boolean);

  const totalBadges = Object.keys(ACHIEVEMENT_BADGES).length;
  const earnedCount = Object.keys(earnedBadges).length;

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const link = document.createElement('a');
      link.download = 'web3-achievement.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleShareTwitter = useCallback(() => {
    const text = `I earned ${earnedCount} badge${earnedCount > 1 ? 's' : ''} and ${totalExperience} XP on Get Started with Web3! 🚀\n\nJoin me and learn blockchain from scratch:`;
    const url = 'https://beihaili.github.io/Get-Started-with-Web3/';
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  }, [earnedCount, totalExperience]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors"
          aria-label="关闭"
        >
          <X className="w-4 h-4" />
        </button>

        {/* The card to capture */}
        <div
          ref={cardRef}
          className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-700"
        >
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-white text-xl font-bold">Get Started with Web3</h2>
                <p className="text-blue-100 text-sm mt-1">Learning Achievement Card</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{totalExperience}</div>
                <div className="text-blue-100 text-xs">XP</div>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-lg font-bold text-white">{userTitle}</div>
                <div className="text-sm text-slate-400">
                  {studyStreak > 0 ? `${studyStreak} 天连续学习` : '开始学习之旅'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">
                  {earnedCount}/{totalBadges}
                </div>
                <div className="text-xs text-slate-400">徽章收集</div>
              </div>
            </div>

            {/* Badges earned */}
            {earnedBadgeList.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-5">
                {earnedBadgeList.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${badge.color} bg-opacity-20`}
                      style={{
                        background: `linear-gradient(135deg, rgba(6,182,212,0.15), rgba(139,92,246,0.15))`,
                      }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                      <span className="text-sm text-white font-medium">{badge.title}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>学习进度</span>
                <span>{((earnedCount / totalBadges) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  style={{ width: `${(earnedCount / totalBadges) * 100}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                beihaili.github.io/Get-Started-with-Web3
              </span>
              <span className="text-xs text-slate-500">
                {new Date().toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons (outside card capture area) */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleDownload}
            disabled={generating}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-800 text-white rounded-lg transition-colors font-medium"
          >
            <Download className="w-4 h-4" />
            {generating ? '生成中...' : '保存图片'}
          </button>
          <button
            onClick={handleShareTwitter}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
          >
            <Share2 className="w-4 h-4" />
            分享到 Twitter
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
