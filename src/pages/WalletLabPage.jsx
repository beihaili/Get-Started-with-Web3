import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  KeyRound,
  Network,
  PenLine,
  RefreshCcw,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { buildSiteUrl } from '../config/siteConfig';
import { useWalletLab } from '../features/wallet-lab/useWalletLab';

const scopeIconClass = 'w-5 h-5 text-cyan-500 dark:text-cyan-300 shrink-0';

const statusLabelKeys = {
  idle: 'statusIdle',
  discovering: 'statusDiscovering',
  connecting: 'statusConnecting',
  connected: 'statusConnected',
  switching: 'statusSwitching',
  signing: 'statusSigning',
};

function getStatusLabelKey(status) {
  return statusLabelKeys[status] || 'statusIdle';
}

export default function WalletLabPage() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const canonicalUrl = buildSiteUrl(`/${lang}/labs/wallet`);
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = buildSiteUrl(`/${altLang}/labs/wallet`);
  const walletLab = useWalletLab();
  const isBusy = ['discovering', 'connecting', 'switching', 'signing'].includes(walletLab.status);

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

      <main className="container mx-auto px-4 py-12 max-w-6xl">
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

        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-8">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-300 mb-3">
                  <ShieldCheck className="w-4 h-4" />
                  {t('walletLab.labSafetyLabel')}
                </div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {t('walletLab.interactiveTitle')}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {t(`walletLab.${getStatusLabelKey(walletLab.status)}`)}
                </span>
                <button
                  type="button"
                  onClick={walletLab.refreshProviders}
                  disabled={walletLab.status === 'discovering'}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  {t('walletLab.refreshWallets')}
                </button>
              </div>
            </div>

            {walletLab.errorKey && (
              <div className="mb-5 flex items-start gap-3 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 text-sm text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{t(`walletLab.${walletLab.errorKey}`)}</p>
              </div>
            )}

            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  {t('walletLab.detectedWalletsTitle')}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {t('walletLab.detectedWalletsCount', { count: walletLab.providers.length })}
                </span>
              </div>

              {walletLab.providers.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                  <Wallet className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {t('walletLab.noWalletTitle')}
                  </p>
                  <p className="mt-2 px-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t('walletLab.noWalletBody')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {walletLab.providers.map((provider) => (
                    <button
                      type="button"
                      key={provider.id}
                      onClick={() => walletLab.selectProvider(provider.id)}
                      aria-pressed={provider.id === walletLab.selectedProviderId}
                      className={`w-full flex items-center justify-between gap-4 rounded-md border px-4 py-3 text-left transition-colors ${
                        provider.id === walletLab.selectedProviderId
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-cyan-400'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block font-semibold text-slate-900 dark:text-white">
                          {provider.info.name}
                        </span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
                          {provider.info.rdns}
                        </span>
                      </span>
                      {provider.id === walletLab.selectedProviderId && (
                        <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-6">
              {!walletLab.connected ? (
                <button
                  type="button"
                  onClick={walletLab.connect}
                  disabled={walletLab.providers.length === 0 || isBusy}
                  className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-md bg-cyan-600 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  {t('walletLab.connectWallet')}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('walletLab.connectedWallet')}
                      </p>
                      <p className="mt-1 text-slate-950 dark:text-white">
                        {walletLab.activeProviderName}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('walletLab.connectedAccount')}
                      </p>
                      <p className="mt-1 font-mono text-slate-950 dark:text-white">
                        {walletLab.accountPreview}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('walletLab.connectedNetwork')}
                      </p>
                      <p className="mt-1 text-slate-950 dark:text-white">
                        {walletLab.activeChainLabel}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                      {t('walletLab.switchNetworkTitle')}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {walletLab.allowedChains.map((chain) => (
                        <button
                          type="button"
                          key={chain.chainId}
                          onClick={() => walletLab.switchChain(chain.chainId)}
                          disabled={isBusy || walletLab.chainId === chain.chainId}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                        >
                          <Network className="w-4 h-4" />
                          {chain.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                      {t('walletLab.signTitle')}
                    </h3>
                    <button
                      type="button"
                      onClick={walletLab.signMessage}
                      disabled={isBusy}
                      className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-md bg-slate-950 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      <KeyRound className="w-4 h-4" />
                      {t('walletLab.signMessage')}
                    </button>

                    {walletLab.signature && (
                      <div className="mt-4 rounded-md border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-4">
                        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                          {t('walletLab.signedResultTitle')}
                        </p>
                        <p className="mt-2 font-mono text-sm text-emerald-900 dark:text-emerald-100 break-all">
                          {walletLab.signaturePreview}
                        </p>
                        <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-slate-600 dark:text-slate-300">
                          {walletLab.signedMessage}
                        </pre>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={walletLab.disconnect}
                    disabled={isBusy}
                    className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('walletLab.disconnectWallet')}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-4">
              {t('walletLab.scopeTitle')}
            </h2>
            <ul className="space-y-4 mb-6">
              {scopeItems.map(({ key, icon: Icon }) => (
                <li key={key} className="flex items-start gap-3 text-slate-700 dark:text-slate-200">
                  <Icon className={scopeIconClass} />
                  <span>{t(`walletLab.${key}`)}</span>
                </li>
              ))}
            </ul>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <h2 className="text-lg font-bold text-slate-950 dark:text-white mb-3">
                {t('walletLab.conceptsTitle')}
              </h2>
              <div className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                <p>{t('walletLab.conceptEip6963')}</p>
                <p>{t('walletLab.conceptSigning')}</p>
                <p>{t('walletLab.conceptDisconnect')}</p>
              </div>
            </div>
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
