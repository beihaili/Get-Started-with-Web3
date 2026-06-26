import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, Share2, Award, Wrench, List, X } from 'lucide-react';
import ThankAuthorButton from '../components/ThankAuthorButton';
import { useUserStore } from '../store/useUserStore';
import { useContentStore } from '../store/useContentStore';
import { useCallback, useEffect, useRef, useState } from 'react';
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
import { useSwipe } from '../hooks/useSwipe';
import { buildSiteUrl } from '../config/siteConfig';
import { trackAnalyticsEvent } from '../utils/analytics';

function getFocusableElements(container) {
  if (!container) {
    return [];
  }

  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

/**
 * 课程阅读页面
 * 显示课程内容、Markdown渲染、AI助教
 */
const ReaderPage = () => {
  const { lang, moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { markLessonComplete, getLessonProgress, recordQuizScore, checkModuleBadges } =
    useUserStore();
  const { fetchLessonContent, basePath: publicBasePath } = useContentStore();

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [basePath, setBasePath] = useState('');
  const [imageMetadata, setImageMetadata] = useState({});
  const [imageMetadataBase, setImageMetadataBase] = useState('');
  const [showShareCard, setShowShareCard] = useState(false);
  const [isLessonDrawerOpen, setIsLessonDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const closeDrawerButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const lessonKey = `${moduleId}-${lessonId}`;
  const isCompleted = getLessonProgress(lessonKey);

  // 查找当前课程信息
  const currentModule = COURSE_DATA.find((m) => m.id === moduleId);
  const currentLesson = currentModule?.lessons.find((l) => l.id === lessonId);
  const isExternalLab = currentLesson?.labUrl?.startsWith('http');
  const labHref = currentLesson?.labUrl
    ? isExternalLab
      ? `${currentLesson.labUrl}/generate`
      : `/${lang}${currentLesson.labUrl}`
    : '';

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!currentLesson) {
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
        const base = `${currentLesson.path.replace(/\/+$/, '')}/`;
        setBasePath(`${publicBasePath}content/${lang}/${base}`);
        setImageMetadataBase(`${lang}/${base}`);

        try {
          const metadataResponse = await fetch(`${publicBasePath}content/image-metadata.json`);
          setImageMetadata(metadataResponse.ok ? await metadataResponse.json() : {});
        } catch (metadataError) {
          console.warn('Failed to load image metadata:', metadataError);
          setImageMetadata({});
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
        setError(err.message);
        setContent(currentLesson.fallbackContent || t('reader.loadFailedFallback'));
        setImageMetadata({});
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [lang, moduleId, lessonId, currentLesson, fetchLessonContent, publicBasePath, t]);

  const handleMarkComplete = (score, total) => {
    trackAnalyticsEvent('lesson_complete', {
      event_category: 'learning',
      language: lang,
      module_id: moduleId,
      lesson_id: lessonId,
      completion_source: score !== undefined && total !== undefined ? 'quiz' : 'manual',
      quiz_score: score,
      quiz_total: total,
    });

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

  const navigateToLesson = useCallback(
    (lesson) => {
      if (!lesson) {
        return;
      }

      setIsLessonDrawerOpen(false);
      navigate(`/${lang}/learn/${moduleId}/${lesson.id}`);
    },
    [lang, moduleId, navigate]
  );

  const swipeHandlers = useSwipe({
    onSwipeLeft: () => navigateToLesson(nextLesson),
    onSwipeRight: () => navigateToLesson(prevLesson),
  });

  useEffect(() => {
    if (!isLessonDrawerOpen) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement;
    const focusTimer = window.setTimeout(() => closeDrawerButtonRef.current?.focus(), 0);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLessonDrawerOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [isLessonDrawerOpen]);

  const handleDrawerKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements(drawerRef.current);
    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  };

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
  const canonicalUrl = buildSiteUrl(`/${lang}/learn/${moduleId}/${lessonId}`);

  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = buildSiteUrl(`/${altLang}/learn/${moduleId}/${lessonId}`);
  const displayLoading = currentLesson ? loading : false;
  const displayError = currentLesson ? error : t('reader.courseNotFound');

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
            <div className="hidden md:flex items-center gap-4">
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
            <div className="flex md:hidden items-center gap-2">
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
              <button
                onClick={() => setIsLessonDrawerOpen(true)}
                aria-label={t('reader.openLessonList')}
                className="p-2 rounded-lg border border-slate-200 bg-white/80 text-slate-600 transition-colors hover:text-cyan-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:text-cyan-400"
              >
                <List className="w-5 h-5" />
              </button>
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

      {isLessonDrawerOpen && (
        <div className="z-40 md:hidden" style={{ position: 'fixed', inset: 0 }}>
          <div
            className="bg-black/50"
            style={{ position: 'absolute', inset: 0 }}
            onClick={() => setIsLessonDrawerOpen(false)}
          />
          <aside
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('reader.lessonListLabel', { moduleTitle: currentModule?.title })}
            onKeyDown={handleDrawerKeyDown}
            className="flex flex-col border-r border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: '20rem',
              maxWidth: '86vw',
            }}
          >
            <div className="flex items-start justify-between gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-cyan-500">
                  {t('reader.lessonList')}
                </p>
                <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">
                  {currentModule?.title}
                </h2>
              </div>
              <button
                ref={closeDrawerButtonRef}
                onClick={() => setIsLessonDrawerOpen(false)}
                aria-label={t('reader.closeLessonList')}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="min-h-0 flex-1 overflow-y-auto p-3" aria-label={t('reader.lessonList')}>
              {currentModule?.lessons.map((lesson) => {
                const active = lesson.id === lessonId;

                return (
                  <Link
                    key={lesson.id}
                    to={`/${lang}/learn/${moduleId}/${lesson.id}`}
                    onClick={() => setIsLessonDrawerOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-lg px-3 py-3 text-sm transition-colors ${
                      active
                        ? 'bg-cyan-500/10 text-cyan-700 ring-1 ring-cyan-500/20 dark:text-cyan-300'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`}
                  >
                    {lesson.title}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl" {...swipeHandlers}>
        <div className="p-8 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-xl">
          {displayLoading ? (
            <ContentSkeleton />
          ) : displayError ? (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400">
                <strong>{t('reader.loadFailedStrong')}</strong> {displayError}
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
                    href={labHref}
                    target={isExternalLab ? '_blank' : undefined}
                    rel={isExternalLab ? 'noopener noreferrer' : undefined}
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
                <MarkdownRenderer
                  content={content}
                  basePath={basePath}
                  imageMetadata={imageMetadata}
                  imageMetadataBase={imageMetadataBase}
                  lang={lang}
                />
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
