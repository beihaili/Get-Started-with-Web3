import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Code2,
  Gauge,
  KeyRound,
  Layers3,
  Route,
  ShieldAlert,
  WalletCards,
  XCircle,
} from 'lucide-react';
import SeoHead from '../components/SeoHead';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { buildSiteUrl } from '../config/siteConfig';
import {
  AA_ACTION_BATCH,
  AA_ACTION_SESSION_KEY,
  AA_ACTION_TRANSFER,
  AA_DEFAULT_FORM,
  AA_MODE_EIP_7702,
  AA_MODE_SMART_ACCOUNT,
  buildUserOperationSimulation,
  formatAddressPreview,
} from '../features/account-abstraction-lab/userOperationSimulator';

const modeOptions = [
  {
    value: AA_MODE_SMART_ACCOUNT,
    titleKey: 'modeSmartTitle',
    descKey: 'modeSmartDesc',
    icon: WalletCards,
  },
  {
    value: AA_MODE_EIP_7702,
    titleKey: 'mode7702Title',
    descKey: 'mode7702Desc',
    icon: KeyRound,
  },
];

const actionOptions = [
  {
    value: AA_ACTION_BATCH,
    titleKey: 'actionBatchTitle',
    descKey: 'actionBatchDesc',
  },
  {
    value: AA_ACTION_TRANSFER,
    titleKey: 'actionTransferTitle',
    descKey: 'actionTransferDesc',
  },
  {
    value: AA_ACTION_SESSION_KEY,
    titleKey: 'actionSessionTitle',
    descKey: 'actionSessionDesc',
  },
];

const statusStyles = {
  pass: {
    icon: CheckCircle2,
    className: 'text-emerald-700 dark:text-emerald-300',
    labelKey: 'statusPass',
  },
  warning: {
    icon: AlertTriangle,
    className: 'text-amber-700 dark:text-amber-300',
    labelKey: 'statusWarning',
  },
  fail: {
    icon: XCircle,
    className: 'text-red-700 dark:text-red-300',
    labelKey: 'statusFail',
  },
};

function NumberField({ id, label, value, min, max, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
        {label}
      </span>
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </label>
  );
}

function AddressField({ id, label, value, onChange }) {
  return (
    <label htmlFor={id} className="block">
      <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
        {label}
      </span>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        spellCheck="false"
        className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 font-mono text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
    </label>
  );
}

export default function AccountAbstractionLabPage() {
  const { lang } = useParams();
  const { t } = useTranslation();
  const [form, setForm] = useState(AA_DEFAULT_FORM);
  const canonicalUrl = buildSiteUrl(`/${lang}/labs/account-abstraction`);
  const altLang = lang === 'en' ? 'zh' : 'en';
  const alternateUrl = buildSiteUrl(`/${altLang}/labs/account-abstraction`);
  const simulation = useMemo(() => buildUserOperationSimulation(form), [form]);
  const serializedOperation = useMemo(
    () =>
      JSON.stringify(
        {
          userOperation: simulation.userOperation,
          eip7702Auth: simulation.eip7702Auth,
        },
        null,
        2
      ),
    [simulation]
  );

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const setMode = (mode) => {
    setForm((current) => ({
      ...current,
      mode,
      needsDeployment: mode === AA_MODE_EIP_7702 ? false : current.needsDeployment,
    }));
  };

  const resetForm = () => setForm(AA_DEFAULT_FORM);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SeoHead
        title={t('accountAbstractionLab.pageTitle')}
        description={t('accountAbstractionLab.pageDesc')}
        url={canonicalUrl}
        type="webpage"
        lang={lang}
        alternateUrl={alternateUrl}
      />

      <div className="sticky top-0 z-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={`/${lang}`}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t('accountAbstractionLab.backHome')}</span>
          </Link>
          <LanguageSwitcher />
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        <section className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-700 dark:text-sky-300 text-sm font-semibold mb-6">
            <Layers3 className="w-4 h-4" />
            {t('accountAbstractionLab.eyebrow')}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-4">
            {t('accountAbstractionLab.heading')}
          </h1>
          <p className="text-lg leading-8 text-slate-600 dark:text-slate-300 max-w-3xl">
            {t('accountAbstractionLab.subheading')}
          </p>
        </section>

        <section className="grid xl:grid-cols-[0.95fr_1.05fr] gap-6 mb-8">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
                    <ShieldAlert className="w-4 h-4" />
                    {t('accountAbstractionLab.demoOnlyLabel')}
                  </div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {t('accountAbstractionLab.builderTitle')}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500 hover:text-sky-600 dark:hover:text-sky-300 transition-colors"
                >
                  {t('accountAbstractionLab.reset')}
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                    {t('accountAbstractionLab.modeTitle')}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {modeOptions.map((option) => {
                      const Icon = option.icon;
                      const selected = form.mode === option.value;

                      return (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => setMode(option.value)}
                          aria-pressed={selected}
                          className={`rounded-md border p-4 text-left transition-colors ${
                            selected
                              ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/30'
                              : 'border-slate-200 dark:border-slate-700 hover:border-sky-400'
                          }`}
                        >
                          <span className="flex items-center gap-2 font-bold text-slate-950 dark:text-white">
                            <Icon className="w-4 h-4 text-sky-500" />
                            {t(`accountAbstractionLab.${option.titleKey}`)}
                          </span>
                          <span className="block mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {t(`accountAbstractionLab.${option.descKey}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-950 dark:text-white mb-3">
                    {t('accountAbstractionLab.actionTitle')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {actionOptions.map((option) => {
                      const selected = form.action === option.value;

                      return (
                        <button
                          type="button"
                          key={option.value}
                          onClick={() => updateForm('action', option.value)}
                          aria-pressed={selected}
                          className={`rounded-md border p-4 text-left transition-colors ${
                            selected
                              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                              : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                          }`}
                        >
                          <span className="block font-bold text-slate-950 dark:text-white">
                            {t(`accountAbstractionLab.${option.titleKey}`)}
                          </span>
                          <span className="block mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            {t(`accountAbstractionLab.${option.descKey}`)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <AddressField
                    id="aa-sender"
                    label={t('accountAbstractionLab.senderLabel')}
                    value={form.sender}
                    onChange={(value) => updateForm('sender', value)}
                  />
                  <AddressField
                    id="aa-target"
                    label={t('accountAbstractionLab.targetLabel')}
                    value={form.target}
                    onChange={(value) => updateForm('target', value)}
                  />
                  {form.mode === AA_MODE_SMART_ACCOUNT && form.needsDeployment && (
                    <AddressField
                      id="aa-factory"
                      label={t('accountAbstractionLab.factoryLabel')}
                      value={form.factory}
                      onChange={(value) => updateForm('factory', value)}
                    />
                  )}
                  {form.mode === AA_MODE_EIP_7702 && (
                    <AddressField
                      id="aa-delegate"
                      label={t('accountAbstractionLab.delegateLabel')}
                      value={form.delegate}
                      onChange={(value) => updateForm('delegate', value)}
                    />
                  )}
                  {form.usePaymaster && (
                    <AddressField
                      id="aa-paymaster"
                      label={t('accountAbstractionLab.paymasterLabel')}
                      value={form.paymaster}
                      onChange={(value) => updateForm('paymaster', value)}
                    />
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 rounded-md border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.needsDeployment}
                      disabled={form.mode === AA_MODE_EIP_7702}
                      onChange={(event) => updateForm('needsDeployment', event.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-bold text-slate-950 dark:text-white">
                        {t('accountAbstractionLab.deployOptionTitle')}
                      </span>
                      {t('accountAbstractionLab.deployOptionDesc')}
                    </span>
                  </label>
                  <label className="flex items-start gap-3 rounded-md border border-slate-200 dark:border-slate-700 p-4 text-sm text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={form.usePaymaster}
                      onChange={(event) => updateForm('usePaymaster', event.target.checked)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block font-bold text-slate-950 dark:text-white">
                        {t('accountAbstractionLab.paymasterOptionTitle')}
                      </span>
                      {t('accountAbstractionLab.paymasterOptionDesc')}
                    </span>
                  </label>
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white mb-3">
                    <Gauge className="w-4 h-4 text-sky-500" />
                    {t('accountAbstractionLab.gasTitle')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <NumberField
                      id="aa-call-gas"
                      label={t('accountAbstractionLab.callGasLabel')}
                      value={form.callGasLimit}
                      min={21000}
                      max={2000000}
                      onChange={(value) => updateForm('callGasLimit', value)}
                    />
                    <NumberField
                      id="aa-verification-gas"
                      label={t('accountAbstractionLab.verificationGasLabel')}
                      value={form.verificationGasLimit}
                      min={50000}
                      max={2000000}
                      onChange={(value) => updateForm('verificationGasLimit', value)}
                    />
                    <NumberField
                      id="aa-pre-verification-gas"
                      label={t('accountAbstractionLab.preVerificationGasLabel')}
                      value={form.preVerificationGas}
                      min={21000}
                      max={500000}
                      onChange={(value) => updateForm('preVerificationGas', value)}
                    />
                    <NumberField
                      id="aa-max-fee"
                      label={t('accountAbstractionLab.maxFeeLabel')}
                      value={form.maxFeePerGasGwei}
                      min={1}
                      max={500}
                      onChange={(value) => updateForm('maxFeePerGasGwei', value)}
                    />
                    <NumberField
                      id="aa-priority-fee"
                      label={t('accountAbstractionLab.priorityFeeLabel')}
                      value={form.maxPriorityFeePerGasGwei}
                      min={0}
                      max={100}
                      onChange={(value) => updateForm('maxPriorityFeePerGasGwei', value)}
                    />
                    {form.action === AA_ACTION_SESSION_KEY && (
                      <NumberField
                        id="aa-session-minutes"
                        label={t('accountAbstractionLab.sessionMinutesLabel')}
                        value={form.sessionMinutes}
                        min={1}
                        max={1440}
                        onChange={(value) => updateForm('sessionMinutes', value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {t('accountAbstractionLab.resultTitle')}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {t('accountAbstractionLab.resultDesc')}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                    simulation.passed
                      ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                      : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                  }`}
                >
                  <BadgeCheck className="w-4 h-4" />
                  {simulation.passed
                    ? t('accountAbstractionLab.draftUsable')
                    : t('accountAbstractionLab.draftNeedsFix')}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="rounded-md border border-slate-200 dark:border-slate-700 p-4">
                  <p className="font-semibold text-slate-500 dark:text-slate-400">
                    {t('accountAbstractionLab.senderSummary')}
                  </p>
                  <p className="mt-1 font-mono text-slate-950 dark:text-white">
                    {formatAddressPreview(simulation.userOperation.sender)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 dark:border-slate-700 p-4">
                  <p className="font-semibold text-slate-500 dark:text-slate-400">
                    {t('accountAbstractionLab.maxCostSummary')}
                  </p>
                  <p className="mt-1 font-mono text-slate-950 dark:text-white">
                    {simulation.maxCostEth} ETH
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 dark:border-slate-700 p-4">
                  <p className="font-semibold text-slate-500 dark:text-slate-400">
                    {t('accountAbstractionLab.callDataSummary')}
                  </p>
                  <p className="mt-1 text-slate-950 dark:text-white">
                    {t(`accountAbstractionLab.${simulation.callDataLabelKey}`)}
                  </p>
                </div>
              </div>

              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white mb-3">
                <Route className="w-4 h-4 text-emerald-500" />
                {t('accountAbstractionLab.pipelineTitle')}
              </h3>
              <ol className="space-y-3 mb-6">
                {simulation.steps.map((stepKey, index) => (
                  <li
                    key={stepKey}
                    className="flex gap-3 rounded-md border border-slate-200 dark:border-slate-700 p-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-950 text-xs font-bold text-sky-700 dark:text-sky-300">
                      {index + 1}
                    </span>
                    <span className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {t(`accountAbstractionLab.${stepKey}`)}
                    </span>
                  </li>
                ))}
              </ol>

              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-950 dark:text-white mb-3">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                {t('accountAbstractionLab.checksTitle')}
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {simulation.checks.map((check) => {
                  const style = statusStyles[check.status] || statusStyles.warning;
                  const Icon = style.icon;

                  return (
                    <div
                      key={check.key}
                      className="rounded-md border border-slate-200 dark:border-slate-700 p-3"
                    >
                      <p className={`flex items-center gap-2 text-sm font-bold ${style.className}`}>
                        <Icon className="w-4 h-4" />
                        {t(`accountAbstractionLab.${style.labelKey}`)}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {t(`accountAbstractionLab.${check.key}`)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-slate-950 dark:text-white mb-3">
                <Code2 className="w-5 h-5 text-sky-500" />
                {t('accountAbstractionLab.jsonTitle')}
              </h2>
              <p className="mb-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {t('accountAbstractionLab.jsonDesc')}
              </p>
              <pre className="max-h-[34rem] overflow-auto rounded-md bg-slate-950 p-4 text-xs leading-5 text-slate-100">
                {serializedOperation}
              </pre>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-amber-950 dark:text-amber-100 mb-3">
            <AlertTriangle className="w-5 h-5" />
            {t('accountAbstractionLab.boundaryTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm leading-6 text-amber-900 dark:text-amber-100">
            <p>{t('accountAbstractionLab.boundaryNoNetwork')}</p>
            <p>{t('accountAbstractionLab.boundaryPaymaster')}</p>
            <p>{t('accountAbstractionLab.boundary7702')}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
