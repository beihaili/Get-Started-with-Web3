import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Award, TrendingUp } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

/**
 * 仪表板页面
 * 显示课程列表和学习进度
 * TODO: 从原App.jsx迁移完整的Dashboard内容
 */
const DashboardPage = () => {
  const { totalExperience, userTitle, progress } = useUserStore();

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

          <Link
            to="/badges"
            className="flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-colors"
          >
            <Award className="w-5 h-5" />
            <span>我的徽章</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* User Stats */}
        <div className="mb-8 p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
          <h2 className="text-2xl font-bold text-white mb-4">学习概览</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 text-sm">经验值</p>
                <p className="text-white text-xl font-bold">{totalExperience}</p>
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
          </div>
        </div>

        {/* Course Modules */}
        <div className="space-y-6">
          <CourseModule
            title="Web3 快速入门"
            description="6 讲快速入门课程"
            moduleId="web3-quickstart"
            lessons={[
              { id: '01', title: '创建你的第一个 Web3 身份' },
              { id: '02', title: '进行你的第一笔 Web3 交易' },
              { id: '03', title: '构建你的第一个 Web3 DApp' },
            ]}
          />

          <CourseModule
            title="比特币技术入门"
            description="22 讲系统化学习比特币技术"
            moduleId="bitcoin"
            lessons={[
              { id: '01', title: '密码学基础' },
              { id: '02', title: '比特币概述' },
              { id: '03', title: '比特币交易基础' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// Course Module Component
const CourseModule = ({ title, description, moduleId, lessons }) => {
  return (
    <div className="p-6 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 mb-4">{description}</p>

      <div className="space-y-2">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            to={`/learn/${moduleId}/${lesson.id}`}
            className="block p-4 bg-slate-800/40 border border-slate-700/30 rounded-lg hover:border-cyan-500/40 hover:bg-slate-800/60 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-white">
                第 {lesson.id} 讲：{lesson.title}
              </span>
              <span className="text-cyan-400">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
