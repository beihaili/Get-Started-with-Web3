import { useState, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeToggle from '../components/ThemeToggle';
import SeoHead from '../components/SeoHead';
import { GLOSSARY_DATA, GLOSSARY_CATEGORIES } from '../config/glossaryData';

/**
 * Category color mapping for pill buttons and term tags.
 * Each category gets a distinct color pair for visual differentiation.
 */
const CATEGORY_COLORS = {
  基础概念: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  密码学: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  比特币: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  以太坊: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  DeFi: 'bg-green-500/10 text-green-400 border-green-500/20',
  安全: 'bg-red-500/10 text-red-400 border-red-500/20',
  工具: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

/**
 * GlossaryPage — searchable, filterable Web3/Bitcoin glossary.
 * Users can search by term/definition and filter by category.
 */
const GlossaryPage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(null);

  // Filter terms by search query and active category
  const filteredTerms = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return GLOSSARY_DATA.filter((item) => {
      const matchesCategory = !activeCategory || item.category === activeCategory;
      const matchesSearch =
        !query ||
        item.term.toLowerCase().includes(query) ||
        item.definition.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const siteUrl = 'https://beihaili.github.io/Get-Started-with-Web3/';
  const canonicalUrl = `${siteUrl}${lang}/glossary`;
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = `${siteUrl}${altLang}/glossary`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SeoHead
        title={`${t('glossary.title')} | Web3 Starter`}
        description={t('glossary.subtitle', { count: GLOSSARY_DATA.length })}
        url={canonicalUrl}
        type="webpage"
        lang={lang}
        alternateUrl={alternateUrl}
      />

      {/* Top nav bar */}
      <div className="sticky top-0 z-20 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to={`/${lang}`}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('nav.backToHome')}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-3">
            {t('glossary.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {t('glossary.subtitle', { count: GLOSSARY_DATA.length })}
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('glossary.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === null
                ? 'bg-cyan-500 text-white border-cyan-500'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            {t('glossary.all')}
          </button>
          {GLOSSARY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-white border-cyan-500'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Term cards */}
        {filteredTerms.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredTerms.map((item) => (
              <div
                key={item.term}
                className="p-5 bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 rounded-xl hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {item.term}
                  </h3>
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLORS[item.category] || ''}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400 dark:text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg">{t('glossary.noResults')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default GlossaryPage;
