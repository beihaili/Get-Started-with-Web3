import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, ExternalLink } from 'lucide-react';
import { COURSE_DATA } from '../config/courseData';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';

/**
 * SEO-friendly articles index page.
 * Lists all 37 lessons grouped by module with colored module headers.
 * Each lesson links to the reader page via /:lang/learn/:moduleId/:lessonId.
 */
const ArticlesPage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();

  const totalLessons = COURSE_DATA.reduce((sum, mod) => sum + mod.lessons.length, 0);

  const canonicalUrl = `https://beihaili.github.io/Get-Started-with-Web3/${lang}/articles`;
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = `https://beihaili.github.io/Get-Started-with-Web3/${altLang}/articles`;

  return (
    <div className="min-h-screen bg-slate-950">
      <SeoHead
        title={t('articles.pageTitle')}
        description={t('articles.pageDesc')}
        url={canonicalUrl}
        type="webpage"
        lang={lang}
        alternateUrl={alternateUrl}
      />

      {/* Top nav bar */}
      <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/${lang}`}
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('nav.backToHome')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Page header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
            <BookOpen className="w-4 h-4" />
            <span>{t('articles.lessonCount', { count: totalLessons })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            {t('articles.heading')}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">{t('articles.subheading')}</p>
        </div>

        {/* Module sections */}
        <div className="space-y-12">
          {COURSE_DATA.map((module) => {
            const ModuleIcon = module.icon;
            return (
              <section key={module.id} aria-labelledby={`module-${module.id}`}>
                {/* Module header */}
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} text-white flex-shrink-0`}
                  >
                    <ModuleIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2
                      id={`module-${module.id}`}
                      className={`text-xl font-bold bg-gradient-to-r ${module.color} bg-clip-text text-transparent`}
                    >
                      {module.title}
                    </h2>
                    <p className="text-slate-500 text-sm">
                      {t('articles.moduleCount', { count: module.lessons.length })}
                    </p>
                  </div>
                </div>

                {/* Lesson cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pl-1">
                  {module.lessons.map((lesson) => {
                    // Derive lessonId: use numeric part relative to module (e.g., lesson.id = '2-3' → lessonId = '2-3')
                    const lessonPath = `/${lang}/learn/${module.id}/${lesson.id}`;
                    return (
                      <Link
                        key={lesson.id}
                        to={lessonPath}
                        className="group flex items-start gap-3 p-4 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 hover:border-slate-600 rounded-xl transition-all duration-200"
                      >
                        {/* Lesson number badge */}
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-md bg-gradient-to-br ${module.color} text-white text-xs font-bold flex-shrink-0 mt-0.5`}
                        >
                          {lesson.id.split('-').pop()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <span className="text-slate-200 group-hover:text-white text-sm font-medium leading-snug line-clamp-2 transition-colors">
                            {lesson.title}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-1 transition-colors" />
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ArticlesPage;
