import { Link } from 'react-router-dom';
import { ArrowLeft, Award, TrendingUp, BookOpen, Flame, Search } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useSearchStore } from '../store/useSearchStore';
import { COURSE_DATA } from '../config/courseData';
import { Web3Oracle } from '../components/interactive';

/**
 * 仪表板页面
 * 显示课程列表和学习进度
 */
const DashboardPage = () => {
  const { totalExperience, userTitle, progress, studyStreak, getLessonProgress } = useUserStore();
  const openSearch = useSearchStore((s) => s.openSearch);

  const progressCount = Object.keys(progress).length;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={openSearch}
              className="flex items-center gap-2 px-3 py-1.5 text-slate-500 hover:text-slate-300 bg-slate-800 border border-slate-700 rounded-lg text-sm transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>搜索课程</span>
              <kbd className="ml-1 px-1.5 py-0.5 bg-slate-700 rounded text-xs">⌘K</kbd>
            </button>
            <Link
              to="/badges"
              className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors"
            >
              <Award className="w-5 h-5" />
              <span>我的徽章</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="mb-8 p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">学习概览</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">经验值</p>
                <p className="text-white text-xl font-bold">{totalExperience} XP</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">头衔</p>
                <p className="text-white text-xl font-bold">{userTitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">已完成课程</p>
                <p className="text-white text-xl font-bold">{progressCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">连续学习</p>
                <p className="text-white text-xl font-bold">{studyStreak} 天</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Modules */}
        <div className="space-y-6">
          {COURSE_DATA.map((module) => {
            const Icon = module.icon;
            const completedCount = module.lessons.filter((lesson) =>
              getLessonProgress(`${module.id}-${lesson.id}`)
            ).length;
            const progressPercent = ((completedCount / module.lessons.length) * 100).toFixed(0);

            return (
              <div
                key={module.id}
                className="p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl"
              >
                {/* Module Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full bg-gradient-to-br ${module.color} flex items-center justify-center`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{module.title}</h3>
                      <p className="text-slate-400">{module.lessons.length} 讲课程</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-cyan-400">{progressPercent}%</div>
                    <div className="text-sm text-slate-400">
                      {completedCount}/{module.lessons.length}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${module.color} transition-all duration-500`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Lessons */}
                <div className="space-y-2">
                  {module.lessons.map((lesson) => {
                    const isCompleted = getLessonProgress(`${module.id}-${lesson.id}`);
                    return (
                      <Link
                        key={lesson.id}
                        to={`/learn/${module.id}/${lesson.id}`}
                        className={`block p-4 bg-slate-800/40 border rounded-lg transition-all ${
                          isCompleted
                            ? 'border-green-500/30 bg-green-500/5'
                            : 'border-slate-700/30 hover:border-cyan-500/40 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`${isCompleted ? 'text-green-400' : 'text-white'}`}>
                            {lesson.title}
                          </span>
                          {isCompleted ? (
                            <span className="text-green-400">✓</span>
                          ) : (
                            <span className="text-cyan-400">→</span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Web3 Oracle */}
        <div className="mt-8">
          <Web3Oracle />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
