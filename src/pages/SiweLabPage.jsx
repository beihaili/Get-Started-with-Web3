import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileSignature,
  KeyRound,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Wallet,
  XCircle,
} from 'lucide-react';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { buildSiteUrl } from '../config/siteConfig';
import { useSiweLab } from '../features/siwe-lab/useSiweLab';

const statusLabelKeys = {
  idle: 'statusIdle',
  discovering: 'statusDiscovering',
  connecting: 'statusConnecting',
  connected: 'statusConnected',
  signing: 'statusSigning',
  signed: 'statusSigned',
};

const checkLabelKeys = {
  domain: 'checkDomain',
  address: 'checkAddress',
  nonce: 'checkNonce',
  expiration: 'checkExpiration',
  signatureShape: 'checkSignatureShape',
};

function getStatusLabelKey(status) {
  return statusLabelKeys[status] || 'statusIdle';
}

export default function SiweLabPage() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const canonicalUrl = buildSiteUrl(`/${lang}/labs/siwe`);
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = buildSiteUrl(`/${altLang}/labs/siwe`);
  const siweLab = useSiweLab();
  const isBusy = ['discovering', 'connecting', 'signing'].includes(siweLab.status);

  const conceptItems = [
    { key: 'conceptNonce', icon: RefreshCcw },
    { key: 'conceptDomain', icon: ShieldCheck },
    { key: 'conceptExpiration', icon: Clock },
    { key: 'conceptSession', icon: ShieldAlert },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SeoHead
        title={t('siweLab.pageTitle')}
        description={t('siweLab.pageDesc')}
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
            <span>{t('siweLab.backHome')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6">
            <UserCheck className="w-4 h-4" />
            {t('siweLab.eyebrow')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-4">
            {t('siweLab.heading')}
          </h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-3xl">
            {t('siweLab.subheading')}
          </p>
        </section>

        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6 mb-8">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-300 mb-3">
                  <ShieldAlert className="w-4 h-4" />
                  {t('siweLab.demoOnlyLabel')}
                </div>
                <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                  {t('siweLab.interactiveTitle')}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {t(`siweLab.${getStatusLabelKey(siweLab.status)}`)}
                </span>
                <button
                  type="button"
                  onClick={siweLab.refreshProviders}
                  disabled={siweLab.status === 'discovering'}
                  className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" />
                  {t('siweLab.refreshWallets')}
                </button>
              </div>
            </div>

            {siweLab.errorKey && (
              <div className="mb-5 flex items-start gap-3 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 p-4 text-sm text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{t(`siweLab.${siweLab.errorKey}`)}</p>
              </div>
            )}

            <div className="border-t border-slate-200 dark:border-slate-800 pt-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  {t('siweLab.detectedWalletsTitle')}
                </h3>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {t('siweLab.detectedWalletsCount', { count: siweLab.providers.length })}
                </span>
              </div>

              {siweLab.providers.length === 0 ? (
                <div className="py-8 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                  <Wallet className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {t('siweLab.noWalletTitle')}
                  </p>
                  <p className="mt-2 px-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t('siweLab.noWalletBody')}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {siweLab.providers.map((provider) => (
                    <button
                      type="button"
                      key={provider.id}
                      onClick={() => siweLab.selectProvider(provider.id)}
                      aria-pressed={provider.id === siweLab.selectedProviderId}
                      className={`w-full flex items-center justify-between gap-4 rounded-md border px-4 py-3 text-left transition-colors ${
                        provider.id === siweLab.selectedProviderId
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
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
                      {provider.id === siweLab.selectedProviderId && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 mt-6 pt-6">
              {!siweLab.connected ? (
                <button
                  type="button"
                  onClick={siweLab.connect}
                  disabled={siweLab.providers.length === 0 || isBusy}
                  className="inline-flex w-full md:w-auto items-center justify-center gap-2 rounded-md bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  <Wallet className="w-4 h-4" />
                  {t('siweLab.connectWallet')}
                </button>
              ) : (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('siweLab.connectedWallet')}
                      </p>
                      <p className="mt-1 text-slate-950 dark:text-white">
                        {siweLab.activeProviderName}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('siweLab.connectedAccount')}
                      </p>
                      <p className="mt-1 font-mono text-slate-950 dark:text-white">
                        {siweLab.accountPreview}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('siweLab.connectedNetwork')}
                      </p>
                      <p className="mt-1 text-slate-950 dark:text-white">
                        {siweLab.activeChainLabel}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="siwe-statement"
                      className="block text-sm font-bold text-slate-950 dark:text-white mb-2"
                    >
                      {t('siweLab.statementLabel')}
                    </label>
                    <textarea
                      id="siwe-statement"
                      value={siweLab.statement}
                      onChange={(event) => siweLab.setStatement(event.target.value)}
                      rows={3}
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('siweLab.nonceLabel')}
                      </p>
                      <p className="mt-1 font-mono text-slate-950 dark:text-white">
                        {siweLab.nonce}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('siweLab.issuedAtLabel')}
                      </p>
                      <p className="mt-1 font-mono text-slate-950 dark:text-white">
                        {siweLab.issuedAt}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-500 dark:text-slate-400">
                        {t('siweLab.expirationLabel')}
                      </p>
                      <p className="mt-1 font-mono text-slate-950 dark:text-white">
                        {siweLab.expirationTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={siweLab.refreshNonce}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      {t('siweLab.refreshNonce')}
                    </button>
                    <button
                      type="button"
                      onClick={siweLab.signSiweMessage}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 rounded-md bg-slate-950 dark:bg-white px-5 py-2 text-sm font-bold text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      <KeyRound className="w-4 h-4" />
                      {t('siweLab.signMessage')}
                    </button>
                    <button
                      type="button"
                      onClick={siweLab.disconnect}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 rounded-md border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-rose-400 hover:text-rose-600 dark:hover:text-rose-300 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                    >
                      {t('siweLab.disconnectWallet')}
                    </button>
                  </div>

                  {siweLab.messagePreview && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                        {t('siweLab.messagePreviewTitle')}
                      </h3>
                      <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 text-xs leading-5 text-slate-700 dark:text-slate-300">
                        {siweLab.messagePreview}
                      </pre>
                    </div>
                  )}

                  {siweLab.signature && siweLab.inspection && (
                    <div className="rounded-md border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 p-4">
                      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
                        {t('siweLab.signedResultTitle')}
                      </p>
                      <p className="mt-2 font-mono text-sm text-emerald-900 dark:text-emerald-100 break-all">
                        {siweLab.signaturePreview}
                      </p>
                      <div className="mt-4 grid sm:grid-cols-2 gap-3">
                        {siweLab.inspection.checks.map((check) => (
                          <div
                            key={check.key}
                            className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200"
                          >
                            {check.ok ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-300" />
                            )}
                            {t(`siweLab.${checkLabelKeys[check.key]}`)}
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-sm leading-6 text-emerald-900 dark:text-emerald-100">
                        {t('siweLab.localInspectionNote')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-4">
                {t('siweLab.conceptsTitle')}
              </h2>
              <div className="space-y-4">
                {conceptItems.map(({ key, icon: Icon }) => (
                  <div key={key} className="flex gap-3">
                    <Icon className="w-5 h-5 text-emerald-500 dark:text-emerald-300 shrink-0 mt-0.5" />
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {t(`siweLab.${key}`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-6">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 mb-3">
                <FileSignature className="w-5 h-5" />
                <h2 className="text-xl font-bold">{t('siweLab.authBoundaryTitle')}</h2>
              </div>
              <p className="text-sm leading-6 text-amber-900 dark:text-amber-100">
                {t('siweLab.authBoundaryBody')}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white mb-3">
                {t('siweLab.learningIdentityTitle')}
              </h2>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                {t('siweLab.learningIdentityBody')}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
