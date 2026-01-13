import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useEffect } from 'react';

/**
 * 课程阅读页面
 * 显示课程内容和学习进度
 * TODO: 从原App.jsx迁移Markdown渲染器和AI助教
 */
const ReaderPage = () => {
  const { moduleId, lessonId } = useParams();
  const { markLessonComplete, getLessonProgress } = useUserStore();

  const lessonKey = `${moduleId}-${lessonId}`;
  const isCompleted = getLessonProgress(lessonKey);

  useEffect(() => {
    // 页面滚动到顶部
    window.scrollTo(0, 0);
  }, [moduleId, lessonId]);

  const handleMarkComplete = () => {
    markLessonComplete(lessonKey);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回课程</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">
              {moduleId} / 第 {lessonId} 讲
            </span>

            {isCompleted ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-sm font-medium">已完成</span>
              </div>
            ) : (
              <button
                onClick={handleMarkComplete}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium"
              >
                标记为已完成
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="p-8 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
          <div className="mb-8">
            <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
              <span className="text-cyan-400 text-sm font-medium">
                {moduleId === 'web3-quickstart' ? 'Web3 快速入门' : '比特币技术入门'}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">第 {lessonId} 讲</h1>
          </div>

          {/* Placeholder Content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-300 leading-relaxed mb-4">
              这是课程内容的占位符页面。完整的课程内容渲染功能将在下一阶段实现。
            </p>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg mt-6">
              <p className="text-blue-400 text-sm">
                <strong>开发状态：</strong> 路由系统和状态管理已就绪。 下一步将迁移 Markdown
                渲染器和课程内容加载功能。
              </p>
            </div>

            <div className="mt-8 space-y-2">
              <h3 className="text-xl font-bold text-white">技术验证：</h3>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                <li>✅ React Router 路由参数正常工作</li>
                <li>✅ Zustand 状态管理可以读写</li>
                <li>✅ 课程完成状态持久化</li>
                <li>✅ 页面导航和返回功能正常</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-8 border-t border-slate-700">
            <button className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
              ← 上一讲
            </button>
            <button className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors ml-auto">
              下一讲 →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;
