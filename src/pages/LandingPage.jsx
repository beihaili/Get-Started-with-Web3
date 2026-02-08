import { Link } from 'react-router-dom';
import { Rocket, BookOpen, Award } from 'lucide-react';

/**
 * 着陆页（首页）
 * TODO: 从原App.jsx迁移完整的Landing页面内容
 */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Get Started with Web3
          </h1>
          <p className="text-xl text-slate-300">你的 Web3 和区块链学习之旅从这里开始</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Link
            to="/dashboard"
            className="group p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl hover:border-cyan-500/40 transition-all hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <Rocket className="w-12 h-12 text-cyan-400 mb-4 group-hover:animate-bounce" />
              <h3 className="text-xl font-bold text-white mb-2">开始学习</h3>
              <p className="text-slate-400">探索 Web3 和比特币课程</p>
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
              <p className="text-slate-400">查看源代码</p>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-slate-500 text-sm">
          <p>MIT License | 开源 Web3 教育平台</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
