import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Users } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';

const CACHE_KEY = 'gh_contributors_cache';
const API_URL = 'https://api.github.com/repos/beihaili/Get-Started-with-Web3/contributors';

/**
 * Fetches contributors from GitHub API with sessionStorage caching
 * to avoid hitting rate limits on page re-visits.
 */
async function fetchContributors() {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const res = await fetch(`${API_URL}?per_page=100`);
  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }
  const data = await res.json();
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
  return data;
}

/**
 * ContributorsPage — displays all GitHub contributors with avatar,
 * username, and contribution count in a responsive grid.
 */
const ContributorsPage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();

  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchContributors()
      .then((data) => {
        if (!cancelled) {
          setContributors(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const siteUrl = 'https://beihaili.github.io/Get-Started-with-Web3/';
  const canonicalUrl = `${siteUrl}${lang}/contributors`;
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = `${siteUrl}${altLang}/contributors`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SeoHead
        title={t('contributors.pageTitle')}
        description={t('contributors.pageDesc')}
        url={canonicalUrl}
        type="webpage"
        lang={lang}
        alternateUrl={alternateUrl}
      />

      {/* Top nav bar */}
      <div className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to={`/${lang}`}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('support.backHome')}
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Page heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 mb-6 shadow-lg shadow-cyan-500/20">
            <Users className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            {t('contributors.heading')}
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">{t('contributors.pageDesc')}</p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-500" />
            <p className="text-slate-400">{t('contributors.loading')}</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="text-center py-16 text-red-400 bg-slate-900/40 border border-dashed border-red-700/50 rounded-xl">
            {t('contributors.error')}
          </div>
        )}

        {/* Contributors grid */}
        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {contributors.map((contributor) => (
              <a
                key={contributor.id}
                href={contributor.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-3 p-5 bg-slate-900/60 border border-slate-700/50
                  hover:border-cyan-500/40 rounded-xl transition-all hover:scale-[1.03] group"
              >
                {/* Avatar */}
                <img
                  src={contributor.avatar_url}
                  alt={contributor.login}
                  className="w-16 h-16 rounded-full border-2 border-slate-700 group-hover:border-cyan-500/60 transition-colors"
                  loading="lazy"
                />
                {/* Username */}
                <span className="text-white font-semibold text-sm text-center truncate w-full group-hover:text-cyan-400 transition-colors">
                  {contributor.login}
                </span>
                {/* Contribution count */}
                <span className="text-xs text-slate-400">
                  {contributor.contributions} {t('contributors.contributions')}
                </span>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ContributorsPage;
