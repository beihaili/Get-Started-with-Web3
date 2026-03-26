import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, Share2, Award, Wrench } from 'lucide-react';
import ThankAuthorButton from '../components/ThankAuthorButton';
import { useUserStore } from '../store/useUserStore';
import { useContentStore } from '../store/useContentStore';
import { useEffect, useState } from 'react';
import { MarkdownRenderer } from '../features/content';
import { AiTutor } from '../features/ai-tutor';
import { MultiQuiz, QUIZ_BANK } from '../features/quiz';
import { COURSE_DATA } from '../config/courseData';
import ShareCard from '../components/ShareCard';
import SponsorBanner from '../components/SponsorBanner';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import MobileNav from '../components/MobileNav';
import SeoHead from '../components/SeoHead';
import ContentSkeleton from '../components/ContentSkeleton';
import ScrollToTop from '../components/ScrollToTop';
import { estimateReadingTime } from '../utils/readingTime';

/**
 * 课程阅读页面
 * 显示课程内容、Markdown渲染、AI助教
 */
const ReaderPage = () => {
  const { lang, moduleId, lessonId } = useParams();
  const { t } = useTranslation();
  const { markLessonComplete, getLessonProgress, recordQuizScore, checkModuleBadges } =
    useUserStore();
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
      setError(t('reader.courseNotFound'));
      setLoading(false);
      return;
    }

    // 加载课程内容
    const loadContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const lessonContent = await fetchLessonContent(lang, currentLesson.path);
        setContent(lessonContent || currentLesson.fallbackContent || t('reader.loadingFallback'));

        // 设置图片基础路径 (includes lang prefix for correct asset resolution)
        const pathParts = currentLesson.path.split('/');
        const base = pathParts.slice(0, -1).join('/') + '/';
        setBasePath(`/Get-Started-with-Web3/${lang}/${base}`);
      } catch (err) {
        console.error('Failed to load lesson:', err);
        setError(err.message);
        setContent(currentLesson.fallbackContent || t('reader.loadFailedFallback'));
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [lang, moduleId, lessonId, currentLesson, fetchLessonContent, t]);

  const handleMarkComplete = (score, total) => {
    if (score !== undefined && total !== undefined) {
      recordQuizScore(lessonId, score, total);
    }
    markLessonComplete(lessonKey);
    checkModuleBadges(moduleId);
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

  const pageTitle = currentLesson
    ? `${currentLesson.title} | ${currentModule?.title} | Web3 Starter`
    : 'Web3 Starter';
  const pageDescription = currentLesson
    ? `${currentLesson.title} - ${currentModule?.title} ${t('reader.pageDescSuffix')}`
    : 'Web3 Starter';
  const canonicalUrl = `https://beihaili.github.io/Get-Started-with-Web3/${lang}/learn/${moduleId}/${lessonId}`;

  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = `https://beihaili.github.io/Get-Started-with-Web3/${altLang}/learn/${moduleId}/${lessonId}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SeoHead
        title={pageTitle}
        description={pageDescription}
        url={canonicalUrl}
        type="article"
        moduleTitle={currentModule?.title}
        lang={lang}
        alternateUrl={alternateUrl}
      />
      {/* Header */}
      <nav
        aria-label={t('reader.navLabel')}
        className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/${lang}/dashboard`}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('nav.backToCourses')}</span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-slate-500 dark:text-slate-400 text-sm">
                {currentModule?.title}
              </span>

              {isCompleted ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-medium">
                    {t('reader.completed')}
                  </span>
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {t('reader.markComplete')}
                </button>
              )}
              <ThemeToggle />
              <LanguageSwitcher />
            </div>
            {/* Mobile: mark-complete button stays visible + hamburger */}
            <div className="flex sm:hidden items-center gap-2">
              {isCompleted ? (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
              ) : (
                <button
                  onClick={handleMarkComplete}
                  className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  {t('reader.markComplete')}
                </button>
              )}
              <MobileNav
                items={[
                  {
                    label: t('nav.backToCourses'),
                    to: `/${lang}/dashboard`,
                    icon: <ArrowLeft className="w-4 h-4" />,
                  },
                  {
                    label: t('nav.badges'),
                    to: `/${lang}/badges`,
                    icon: <Award className="w-4 h-4" />,
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          {loading ? (
            <ContentSkeleton />
          ) : error ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">
                <strong>{t('reader.loadFailedStrong')}</strong> {error}
              </p>
            </div>
          ) : (
            <>
              {/* Lesson Title */}
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4">
                  <span className="text-cyan-400 text-sm font-medium">{currentModule?.title}</span>
                </div>
                {!loading && content && (
                  <span className="text-slate-500 dark:text-slate-400 text-sm">
                    {t('reader.readingTime', { minutes: estimateReadingTime(content, lang) })}
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                  {currentLesson?.title}
                </h1>
              </div>

              {/* Lab CTA */}
              {currentLesson?.labUrl && (
                <div className="mb-8">
                  <a
                    href={`${currentLesson.labUrl}/generate`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t('reader.startLab')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all"
                  >
                    <Wrench className="w-4 h-4" />
                    {t('reader.startLab')}
                  </a>
                </div>
              )}

              {/* Sponsor Banner (gold tier only, null if no gold sponsors) */}
              <SponsorBanner />

              {/* Markdown Content */}
              <div className="prose dark:prose-invert max-w-none">
                <MarkdownRenderer content={content} basePath={basePath} />
              </div>

              {/* Quiz Section */}
              {QUIZ_BANK[lessonId] && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <MultiQuiz lessonId={lessonId} onPass={handleMarkComplete} />
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                {prevLesson ? (
                  <Link
                    to={`/${lang}/learn/${moduleId}/${prevLesson.id}`}
                    className="px-4 sm:px-6 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg transition-colors text-sm sm:text-base"
                  >
                    ← <span className="hidden sm:inline">{t('reader.prevLessonFull')}</span>
                    <span className="sm:hidden">{t('reader.prevLesson')}</span>
                  </Link>
                ) : (
                  <div className="px-4 sm:px-6 py-2 bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 rounded-lg cursor-not-allowed text-sm sm:text-base">
                    ← <span className="hidden sm:inline">{t('reader.prevLessonFull')}</span>
                    <span className="sm:hidden">{t('reader.prevLesson')}</span>
                  </div>
                )}

                {nextLesson ? (
                  <Link
                    to={`/${lang}/learn/${moduleId}/${nextLesson.id}`}
                    className="px-4 sm:px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors ml-auto text-sm sm:text-base"
                  >
                    <span className="hidden sm:inline">{t('reader.nextLessonFull')}</span>
                    <span className="sm:hidden">{t('reader.nextLesson')}</span> →
                  </Link>
                ) : (
                  <div className="px-4 sm:px-6 py-2 bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 rounded-lg cursor-not-allowed ml-auto text-sm sm:text-base">
                    <span className="hidden sm:inline">{t('reader.nextLessonFull')}</span>
                    <span className="sm:hidden">{t('reader.nextLesson')}</span> →
                  </div>
                )}
              </div>
              {/* Thank author CTA */}
              <ThankAuthorButton />
              {/* Module completion banner */}
              {isModuleComplete && (
                <div className="mt-8 p-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {t('reader.moduleCompleteTitle', { moduleTitle: currentModule?.title })}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">
                    {t('reader.moduleCompleteDesc')}
                  </p>
                  <button
                    onClick={() => setShowShareCard(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all font-medium"
                  >
                    <Share2 className="w-4 h-4" />
                    {t('reader.shareAchievement')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* AI Tutor */}
      <AiTutor lessonContext={content} />

      <ScrollToTop />
      {showShareCard && <ShareCard onClose={() => setShowShareCard(false)} />}
    </div>
  );
};

export default ReaderPage;
