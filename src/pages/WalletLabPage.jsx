import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  Network,
  PenLine,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { buildSiteUrl } from '../config/siteConfig';

const scopeIconClass = 'w-5 h-5 text-cyan-500 dark:text-cyan-300';

export default function WalletLabPage() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const canonicalUrl = buildSiteUrl(`/${lang}/labs/wallet`);
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = buildSiteUrl(`/${altLang}/labs/wallet`);

  const scopeItems = [
    { key: 'scopeConnect', icon: Wallet },
    { key: 'scopeNetwork', icon: Network },
    { key: 'scopeSwitch', icon: CheckCircle2 },
    { key: 'scopeSign', icon: PenLine },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SeoHead
        title={t('walletLab.pageTitle')}
        description={t('walletLab.pageDesc')}
        url={canonicalUrl}
        type="webpage"
        lang={lang}
        alternateUrl={alternateUrl}
      />

      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/${lang}`}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('walletLab.backHome')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-5xl">
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-sm font-semibold mb-6">
            <Wallet className="w-4 h-4" />
            {t('walletLab.eyebrow')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-4">
            {t('walletLab.heading')}
          </h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-3xl">
            {t('walletLab.subheading')}
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 mb-8">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-2">
                  {t('walletLab.statusTitle')}
                </h2>
                <p className="text-slate-600 dark:text-slate-300 leading-7">
                  {t('walletLab.statusBody')}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-4">
              {t('walletLab.scopeTitle')}
            </h2>
            <ul className="space-y-4">
              {scopeItems.map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                  <Icon className={scopeIconClass} />
                  <span>{t(`walletLab.${key}`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-3">
              {t('walletLab.privacyTitle')}
            </h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">
              {t('walletLab.privacyBody')}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-3">
              {t('walletLab.nextTitle')}
            </h2>
            <p className="text-sm leading-7 text-slate-600 dark:text-slate-300 mb-4">
              {t('walletLab.nextBody')}
            </p>
            <a
              href="https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/strategy/2026-06-24-wallet-lab-architecture.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300 hover:text-cyan-500 transition-colors"
            >
              {t('walletLab.architectureLink')}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
