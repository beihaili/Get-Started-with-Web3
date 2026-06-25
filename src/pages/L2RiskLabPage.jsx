import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  GitBranch,
  Layers3,
  ListChecks,
  MessageSquare,
  Network,
  Route,
  ShieldAlert,
  Timer,
} from 'lucide-react';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { buildSiteUrl } from '../config/siteConfig';
import {
  AMOUNT_LARGE,
  AMOUNT_MEDIUM,
  AMOUNT_SMALL,
  BRIDGE_EXTERNAL_VALIDATOR,
  BRIDGE_GENERAL_MESSAGE,
  BRIDGE_LIQUIDITY_NETWORK,
  BRIDGE_NATIVE_OPTIMISTIC,
  BRIDGE_NATIVE_ZK,
  DEFAULT_L2_RISK_FORM,
  DIRECTION_DEPOSIT,
  DIRECTION_MESSAGE,
  DIRECTION_WITHDRAW,
  INTEGRATION_EMBEDDED,
  INTEGRATION_LINKOUT,
  SEQUENCER_DEGRADED,
  SEQUENCER_NORMAL,
  buildL2RiskSimulation,
} from '../features/l2-risk-lab/l2RiskSimulator';

const bridgeOptions = [
  BRIDGE_NATIVE_OPTIMISTIC,
  BRIDGE_NATIVE_ZK,
  BRIDGE_EXTERNAL_VALIDATOR,
  BRIDGE_GENERAL_MESSAGE,
  BRIDGE_LIQUIDITY_NETWORK,
];

const directionOptions = [DIRECTION_DEPOSIT, DIRECTION_WITHDRAW, DIRECTION_MESSAGE];
const amountOptions = [AMOUNT_SMALL, AMOUNT_MEDIUM, AMOUNT_LARGE];
const sequencerOptions = [SEQUENCER_NORMAL, SEQUENCER_DEGRADED];
const integrationOptions = [INTEGRATION_LINKOUT, INTEGRATION_EMBEDDED];

const levelStyles = {
  low: 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300',
  medium: 'bg-sky-100 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300',
  high: 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300',
  critical: 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300',
};

function OptionButton({ selected, onClick, title, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-md border p-4 text-left transition-colors ${
        selected
          ? 'border-fuchsia-500 bg-fuchsia-50 dark:bg-fuchsia-950/30'
          : 'border-slate-200 dark:border-slate-700 hover:border-fuchsia-400'
      }`}
    >
      <span className="block font-bold text-slate-950 dark:text-white">{title}</span>
      {description && (
        <span className="mt-2 block text-sm leading-6 text-slate-500 dark:text-slate-400">
          {description}
        </span>
      )}
    </button>
  );
}

function KeyList({ title, icon: Icon, items, t }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
      <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white mb-3">
        <Icon className="w-4 h-4 text-fuchsia-500" />
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((key) => (
          <li key={key} className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="mt-0.5 w-4 h-4 text-emerald-500 shrink-0" />
            <span>{t(`l2RiskLab.${key}`)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function L2RiskLabPage() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const [form, setForm] = useState(DEFAULT_L2_RISK_FORM);
  const simulation = useMemo(() => buildL2RiskSimulation(form), [form]);
  const canonicalUrl = buildSiteUrl(`/${lang}/labs/l2-risk`);
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = buildSiteUrl(`/${altLang}/labs/l2-risk`);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SeoHead
        title={t('l2RiskLab.pageTitle')}
        description={t('l2RiskLab.pageDesc')}
        url={canonicalUrl}
        type="webpage"
        lang={lang}
        alternateUrl={alternateUrl}
      />

      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/${lang}`}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('l2RiskLab.backHome')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-300 text-sm font-semibold mb-6">
            <Network className="w-4 h-4" />
            {t('l2RiskLab.eyebrow')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-4">
            {t('l2RiskLab.heading')}
          </h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-3xl">
            {t('l2RiskLab.subheading')}
          </p>
        </section>

        <section className="grid xl:grid-cols-[0.95fr_1.05fr] gap-6 mb-8">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                <ShieldAlert className="w-4 h-4" />
                {t('l2RiskLab.demoOnlyLabel')}
              </div>
              <h2 className="text-2xl font-bold text-slate-950 dark:text-white mb-6">
                {t('l2RiskLab.scenarioTitle')}
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                    {t('l2RiskLab.bridgeTypeTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {bridgeOptions.map((bridgeType) => (
                      <OptionButton
                        key={bridgeType}
                        selected={form.bridgeType === bridgeType}
                        onClick={() => updateForm('bridgeType', bridgeType)}
                        title={t(`l2RiskLab.${bridgeType}.title`)}
                        description={t(`l2RiskLab.${bridgeType}.desc`)}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                      {t('l2RiskLab.directionTitle')}
                    </h3>
                    <div className="space-y-2">
                      {directionOptions.map((direction) => (
                        <OptionButton
                          key={direction}
                          selected={form.direction === direction}
                          onClick={() => updateForm('direction', direction)}
                          title={t(`l2RiskLab.direction.${direction}`)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                      {t('l2RiskLab.amountTitle')}
                    </h3>
                    <div className="space-y-2">
                      {amountOptions.map((amountBand) => (
                        <OptionButton
                          key={amountBand}
                          selected={form.amountBand === amountBand}
                          onClick={() => updateForm('amountBand', amountBand)}
                          title={t(`l2RiskLab.amount.${amountBand}`)}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                      {t('l2RiskLab.sequencerTitle')}
                    </h3>
                    <div className="space-y-2">
                      {sequencerOptions.map((sequencerStatus) => (
                        <OptionButton
                          key={sequencerStatus}
                          selected={form.sequencerStatus === sequencerStatus}
                          onClick={() => updateForm('sequencerStatus', sequencerStatus)}
                          title={t(`l2RiskLab.sequencer.${sequencerStatus}`)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                      {t('l2RiskLab.integrationTitle')}
                    </h3>
                    <div className="space-y-2">
                      {integrationOptions.map((integrationStyle) => (
                        <OptionButton
                          key={integrationStyle}
                          selected={form.integrationStyle === integrationStyle}
                          onClick={() => updateForm('integrationStyle', integrationStyle)}
                          title={t(`l2RiskLab.integration.${integrationStyle}`)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {t(`l2RiskLab.${simulation.titleKey}`)}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t(`l2RiskLab.${simulation.descriptionKey}`)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                    levelStyles[simulation.level]
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" />
                  {t(`l2RiskLab.level.${simulation.level}`, { score: simulation.score })}
                </span>
              </div>

              {simulation.modifiers.length > 0 && (
                <div className="mt-5 rounded-md border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-amber-950 dark:text-amber-100 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    {t('l2RiskLab.modifierTitle')}
                  </h3>
                  <ul className="space-y-2 text-sm leading-6 text-amber-900 dark:text-amber-100">
                    {simulation.modifiers.map((modifier) => (
                      <li key={modifier.key}>
                        {t(`l2RiskLab.${modifier.key}`, { points: modifier.points })}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <KeyList
                title={t('l2RiskLab.finalityTitle')}
                icon={Timer}
                items={simulation.finalityKeys}
                t={t}
              />
              <KeyList
                title={t('l2RiskLab.trustTitle')}
                icon={Layers3}
                items={simulation.trustKeys}
                t={t}
              />
              <KeyList
                title={t('l2RiskLab.messageTitle')}
                icon={MessageSquare}
                items={simulation.messageKeys}
                t={t}
              />
              <KeyList
                title={t('l2RiskLab.failureTitle')}
                icon={GitBranch}
                items={simulation.failureKeys}
                t={t}
              />
            </div>

            <KeyList
              title={t('l2RiskLab.checklistTitle')}
              icon={ListChecks}
              items={simulation.checklistKeys}
              t={t}
            />
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 mb-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white mb-4">
            <Route className="w-5 h-5 text-fuchsia-500" />
            {t('l2RiskLab.comparisonTitle')}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-2 pr-4 font-semibold">{t('l2RiskLab.tableBridge')}</th>
                  <th className="py-2 pr-4 font-semibold">{t('l2RiskLab.tableBaseRisk')}</th>
                  <th className="py-2 pr-4 font-semibold">{t('l2RiskLab.tableTrust')}</th>
                  <th className="py-2 pr-4 font-semibold">{t('l2RiskLab.tableFailure')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {simulation.comparison.map((item) => (
                  <tr key={item.bridgeType}>
                    <td className="py-3 pr-4 font-semibold text-slate-950 dark:text-white">
                      {t(`l2RiskLab.${item.titleKey}`)}
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                      {t(`l2RiskLab.level.${item.level}`, { score: item.baseScore })}
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                      {t(`l2RiskLab.${item.primaryTrustKey}`)}
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                      {t(`l2RiskLab.${item.primaryFailureKey}`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-amber-950 dark:text-amber-100 mb-3">
            <ShieldAlert className="w-5 h-5" />
            {t('l2RiskLab.boundaryTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm leading-6 text-amber-900 dark:text-amber-100">
            <p>{t('l2RiskLab.boundaryNoAssets')}</p>
            <p>{t('l2RiskLab.boundaryNoRanking')}</p>
            <p>{t('l2RiskLab.boundaryCredential')}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
