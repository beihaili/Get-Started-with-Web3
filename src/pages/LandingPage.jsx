import { Link } from 'react-router-dom';
import { Rocket, BookOpen, Award, Users, Star, GitBranch } from 'lucide-react';
import { ParticleBackground } from '../components/animations';
import { MouseSpotlight } from '../components/animations';
import { HashVisualizer } from '../components/interactive';
import { WalletSimulator } from '../components/interactive';
import { COURSE_DATA } from '../config/courseData';
import { useUserStore } from '../store/useUserStore';

/**
 * 着陆页（首页）
 */
const LandingPage = () => {
  const { totalExperience, userTitle, progress, studyStreak } = useUserStore();
  const totalLessons = COURSE_DATA.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = Object.keys(progress).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <title>Get Started with Web3 - 从入门到精通</title>
      <meta
        name="description"
        content="中文世界最系统的比特币与 Web3 学习平台。从零基础到深入原理，一站式掌握区块链核心技术。"
      />
      <meta property="og:title" content="Get Started with Web3 - 从入门到精通" />
      <link rel="canonical" href="https://beihaili.github.io/Get-Started-with-Web3/" />
      <ParticleBackground />
      <MouseSpotlight />

      <main className="container mx-auto px-4 py-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
            <span className="text-cyan-400 text-sm font-medium">
              {totalLessons} 讲系统化教程 · 开源免费
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Get Started
            <br />
            with Web3
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            中文世界最系统的比特币与 Web3 学习平台。从零基础到深入原理，一站式掌握区块链核心技术。
          </p>
          {studyStreak > 0 && (
            <div className="inline-block mb-4 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <span className="text-orange-400 text-sm font-medium">
                🔥 连续学习 {studyStreak} 天
              </span>
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-cyan-500/20"
            >
              开始学习
            </Link>
            <a
              href="https://github.com/beihaili/Get-Started-with-Web3"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all hover:scale-105 border border-slate-700 flex items-center gap-2"
            >
              <GitBranch className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400">{COURSE_DATA.length}</div>
              <div className="text-sm text-slate-400">课程模块</div>
            </div>
            <div className="text-center border-x border-slate-700">
              <div className="text-3xl font-bold text-blue-400">{totalLessons}</div>
              <div className="text-sm text-slate-400">总课程数</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-sm text-slate-400">技术架构层</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <Link
            to="/dashboard"
            className="group p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl hover:border-cyan-500/40 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <Rocket className="w-12 h-12 text-cyan-400 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-2">开始学习</h3>
              <p className="text-slate-400">探索 Web3 和比特币课程</p>
              {completedCount > 0 && (
                <div className="mt-3 text-xs text-cyan-400">
                  已完成 {completedCount}/{totalLessons} 讲
                </div>
              )}
            </div>
          </Link>

          <Link
            to="/badges"
            className="group p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl hover:border-purple-500/40 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <Award className="w-12 h-12 text-purple-400 mb-4 group-hover:animate-pulse" />
              <h3 className="text-xl font-bold text-white mb-2">我的徽章</h3>
              <p className="text-slate-400">查看学习成就</p>
              {totalExperience > 0 && (
                <div className="mt-3 text-xs text-purple-400">
                  {userTitle} · {totalExperience} XP
                </div>
              )}
            </div>
          </Link>

          <a
            href="https://github.com/beihaili/Get-Started-with-Web3"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl hover:border-blue-500/40 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">GitHub</h3>
              <p className="text-slate-400">查看源代码与贡献</p>
            </div>
          </a>
        </div>

        {/* Interactive Demos */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">互动体验</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <HashVisualizer />
            <WalletSimulator />
          </div>
        </div>

        {/* Learning Path */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white text-center mb-8">学习路径</h2>
          <div className="space-y-3">
            {COURSE_DATA.map((module, idx) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to="/dashboard"
                  className="flex items-center gap-4 p-4 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl hover:border-cyan-500/30 transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${module.color} flex items-center justify-center shrink-0`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold truncate">{module.title}</h3>
                    <p className="text-slate-400 text-sm">{module.lessons.length} 讲</p>
                  </div>
                  <span className="text-slate-500 group-hover:text-cyan-400 transition-colors text-sm">
                    {idx === 0 ? '新手推荐' : `第 ${idx + 1} 阶段`} →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Community */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">加入社区</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://twitter.com/bhbtc1337"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-white text-sm transition-all hover:scale-105"
            >
              <Users className="w-4 h-4 text-cyan-400" />
              Twitter @bhbtc1337
            </a>
            <a
              href="https://github.com/beihaili/Get-Started-with-Web3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-white text-sm transition-all hover:scale-105"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              Star on GitHub
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-500 text-sm border-t border-slate-800 pt-8">
          <p>MIT License | 开源 Web3 教育平台</p>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
