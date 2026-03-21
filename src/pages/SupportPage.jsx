import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Wallet, Coffee, ArrowLeft, Star } from 'lucide-react';
import { DONATION_LINKS, CRYPTO_WALLETS, SPONSORS } from '../config/sponsorData';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';

/**
 * 支持页面 — 展示捐赠渠道、加密货币钱包地址和赞助商信息
 */
const SupportPage = () => {
  const { lang } = useParams();
  const { t } = useTranslation();

  const siteUrl = 'https://beihaili.github.io/Get-Started-with-Web3/';
  const canonicalUrl = `${siteUrl}${lang}/support`;
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = `${siteUrl}${altLang}/support`;

  // 判断是否有任何赞助商
  const hasSponsors =
    SPONSORS.gold.length > 0 || SPONSORS.silver.length > 0 || SPONSORS.bronze.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <SeoHead
        title={t('support.pageTitle')}
        description={t('support.pageDesc')}
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

      <main className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Page heading */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 mb-6 shadow-lg shadow-pink-500/20">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            {t('support.pageTitle')}
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">{t('support.pageDesc')}</p>
        </div>

        {/* Section 1: Donation platforms */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-5">
            <Coffee className="w-5 h-5 text-pink-400" />
            {t('support.donationTitle')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {DONATION_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-5 bg-slate-900/60 border border-slate-700/50
                  hover:border-pink-500/40 rounded-xl transition-all hover:scale-[1.02] group"
              >
                <div
                  className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-500 to-orange-500
                    flex items-center justify-center shrink-0 shadow-md shadow-pink-500/20"
                >
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold group-hover:text-pink-400 transition-colors">
                    {link.name}
                  </div>
                  <div className="text-slate-400 text-xs truncate">{link.url}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Section 2: Crypto wallets */}
        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-5">
            <Wallet className="w-5 h-5 text-cyan-400" />
            {t('support.cryptoTitle')}
          </h2>
          <div className="space-y-3">
            {CRYPTO_WALLETS.map((wallet) => (
              <div
                key={wallet.chain}
                className="flex items-start gap-4 p-5 bg-slate-900/60 border border-slate-700/50 rounded-xl"
              >
                <div
                  className="px-3 py-1.5 bg-slate-800 rounded-lg text-sm font-mono font-bold
                    text-cyan-400 shrink-0 border border-slate-700"
                >
                  {wallet.chain}
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 mb-1">{wallet.network}</div>
                  <div className="font-mono text-sm text-slate-200 break-all">{wallet.address}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Sponsors */}
        <section className="mb-12">
          <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-5">
            <Star className="w-5 h-5 text-yellow-400" />
            {t('support.sponsorsTitle')}
          </h2>
          {hasSponsors ? (
            <div className="space-y-6">
              {SPONSORS.gold.length > 0 && (
                <div>
                  <div className="text-yellow-400 text-sm font-semibold mb-3">Gold</div>
                  <div className="grid gap-3">
                    {SPONSORS.gold.map((s) => (
                      <div
                        key={s.name}
                        className="p-4 bg-slate-900/60 border border-yellow-500/30 rounded-xl text-white"
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {SPONSORS.silver.length > 0 && (
                <div>
                  <div className="text-slate-300 text-sm font-semibold mb-3">Silver</div>
                  <div className="grid gap-3">
                    {SPONSORS.silver.map((s) => (
                      <div
                        key={s.name}
                        className="p-4 bg-slate-900/60 border border-slate-400/30 rounded-xl text-white"
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {SPONSORS.bronze.length > 0 && (
                <div>
                  <div className="text-orange-400 text-sm font-semibold mb-3">Bronze</div>
                  <div className="grid gap-3">
                    {SPONSORS.bronze.map((s) => (
                      <div
                        key={s.name}
                        className="p-4 bg-slate-900/60 border border-orange-500/30 rounded-xl text-white"
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500 bg-slate-900/40 border border-dashed border-slate-700 rounded-xl">
              {t('support.noSponsors')}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default SupportPage;
