import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Loader2, Share2 } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';
import { useContentStore } from '../store/useContentStore';
import { useEffect, useState } from 'react';
import { MarkdownRenderer } from '../features/content';
import { AiTutor } from '../features/ai-tutor';
import { MultiQuiz, QUIZ_BANK } from '../features/quiz';
import { COURSE_DATA } from '../config/courseData';
import ShareCard from '../components/ShareCard';

/**
 * 课程阅读页面
 * 显示课程内容、Markdown渲染、AI助教
 */
const ReaderPage = () => {
  const { moduleId, lessonId } = useParams();
  const { markLessonComplete, getLessonProgress } = useUserStore();
  const { fetchLessonContent } = useContentStore();

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [basePath, setBasePath] = useState('');
  const [showShareCard, setShowShareCard] = useState(false);

  const lessonKey = `${moduleId}-${lessonId}`;
  const isCompleted = getLessonProgress(lessonKey);

  // 查找当前课程信息
  const currentModule = COURSE_DATA.find((m) => m.id === moduleId);
  const currentLesson = currentModule?.lessons.find((l) => l.id === lessonId);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!currentLesson) {
      setError('课程不存在');
      setLoading(false);
      return;
    }

    // 加载课程内容
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const lessonContent = await fetchLessonContent(currentLesson.path);
        setContent(lessonContent || currentLesson.fallbackContent || '# 内容加载中...');

        // 设置图片基础路径
        const pathParts = currentLesson.path.split('/');
        const base = pathParts.slice(0, -1).join('/') + '/';
        setBasePath(`/Get-Started-with-Web3/${base}`);
      } catch (err) {
        console.error('Failed to load lesson:', err);
        setError(err.message);
        setContent(currentLesson.fallbackContent || '# 内容加载失败');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [moduleId, lessonId, currentLesson, fetchLessonContent]);

  const handleMarkComplete = () => {
    markLessonComplete(lessonKey);
  };

  // 查找上一讲和下一讲
  const currentLessonIndex = currentModule?.lessons.findIndex((l) => l.id === lessonId) ?? -1;
  const prevLesson = currentLessonIndex > 0 ? currentModule.lessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < (currentModule?.lessons.length ?? 0) - 1
      ? currentModule.lessons[currentLessonIndex + 1]
      : null;

  // Check if all lessons in this module are completed
  const { getModuleProgress } = useUserStore();
  const moduleLessonKeys = currentModule?.lessons.map((l) => `${moduleId}-${l.id}`) || [];
  const moduleProgress = getModuleProgress(moduleLessonKeys);
  const isModuleComplete = moduleProgress.percentage === 100;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <nav
        aria-label="课程导航"
        className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回课程</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">{currentModule?.title}</span>

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
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="p-8 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mb-4" />
              <p className="text-slate-400">加载课程内容中...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">
                <strong>加载失败：</strong> {error}
              </p>
            </div>
          ) : (
            <>
              {/* Lesson Title */}
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                  <span className="text-cyan-400 text-sm font-medium">{currentModule?.title}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {currentLesson?.title}
                </h1>
              </div>

              {/* Markdown Content */}
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={content} basePath={basePath} />
              </div>

              {/* Quiz Section */}
              {QUIZ_BANK[lessonId] && (
                <div className="mt-8 pt-8 border-t border-slate-700">
                  <MultiQuiz lessonId={lessonId} onPass={handleMarkComplete} />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-slate-700">
                {prevLesson ? (
                  <Link
                    to={`/learn/${moduleId}/${prevLesson.id}`}
                    className="px-4 sm:px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    ← <span className="hidden sm:inline">上一讲</span>
                    <span className="sm:hidden">上一</span>
                  </Link>
                ) : (
                  <div className="px-4 sm:px-6 py-2 bg-slate-800/50 text-slate-600 rounded-lg cursor-not-allowed text-sm sm:text-base">
                    ← <span className="hidden sm:inline">上一讲</span>
                    <span className="sm:hidden">上一</span>
                  </div>
                )}

                {nextLesson ? (
                  <Link
                    to={`/learn/${moduleId}/${nextLesson.id}`}
                    className="px-4 sm:px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors ml-auto text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">下一讲</span>
                    <span className="sm:hidden">下一</span> →
                  </Link>
                ) : (
                  <div className="px-4 sm:px-6 py-2 bg-slate-800/50 text-slate-600 rounded-lg cursor-not-allowed ml-auto text-sm sm:text-base">
                    <span className="hidden sm:inline">下一讲</span>
                    <span className="sm:hidden">下一</span> →
                  </div>
                )}
              </div>
              {/* Module completion banner */}
              {isModuleComplete && (
                <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl text-center">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {currentModule?.title} 全部完成！
                  </h3>
                  <p className="text-slate-400 mb-4">恭喜你完成了本模块的所有课程</p>
                  <button
                    onClick={() => setShowShareCard(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    分享学习成就
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* AI Tutor */}
      <AiTutor lessonContext={content} />

      {showShareCard && <ShareCard onClose={() => setShowShareCard(false)} />}
    </div>
  );
};

export default ReaderPage;
