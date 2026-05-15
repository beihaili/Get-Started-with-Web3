import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/useUserStore';
import {
  isProgressDataEmpty,
  mergeProgress,
  normalizeProgressData,
  parseProgressImportPayload,
  ProgressImportError,
} from '../utils/mergeProgress';

function readFileText(file) {
  if (typeof file.text === 'function') {
    return file.text();
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

const ProgressImport = () => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [errorKey, setErrorKey] = useState(null);
  const [statusKey, setStatusKey] = useState(null);
  const [pendingProgress, setPendingProgress] = useState(null);

  const clearMessages = () => {
    setErrorKey(null);
    setStatusKey(null);
  };

  const applyImport = (mode, incoming = pendingProgress) => {
    if (!incoming) return;

    const currentProgress = normalizeProgressData(useUserStore.getState());
    const nextProgress = mode === 'merge' ? mergeProgress(currentProgress, incoming) : incoming;

    useUserStore.setState(nextProgress);
    setPendingProgress(null);
    setStatusKey(mode === 'merge' ? 'dashboard.importMerged' : 'dashboard.imported');
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    clearMessages();

    try {
      const text = await readFileText(file);
      const parsed = parseProgressImportPayload(JSON.parse(text));
      const currentProgress = normalizeProgressData(useUserStore.getState());

      if (isProgressDataEmpty(currentProgress)) {
        applyImport('replace', parsed);
      } else {
        setPendingProgress(parsed);
      }
    } catch (error) {
      const key =
        error instanceof ProgressImportError && error.code === 'unsupported-version'
          ? 'dashboard.importUnsupportedVersion'
          : 'dashboard.importInvalidJson';
      setPendingProgress(null);
      setErrorKey(key);
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        className="sr-only"
        aria-label={t('dashboard.importFileLabel')}
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:border-purple-500/50 hover:bg-purple-500/15 dark:text-purple-300"
      >
        <Upload className="h-4 w-4" />
        <span>{t('dashboard.importProgress')}</span>
      </button>
      {errorKey && (
        <p className="max-w-xs text-xs text-rose-500 dark:text-rose-300" role="alert">
          {t(errorKey)}
        </p>
      )}
      {statusKey && (
        <p className="text-xs text-slate-500 dark:text-slate-400" role="status">
          {t(statusKey)}
        </p>
      )}
      {pendingProgress && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="progress-import-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
        >
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <h3
              id="progress-import-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {t('dashboard.importDialogTitle')}
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {t('dashboard.importDialogDesc')}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setPendingProgress(null);
                  setStatusKey('dashboard.importCanceled');
                }}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                {t('dashboard.importCancel')}
              </button>
              <button
                type="button"
                onClick={() => applyImport('replace')}
                className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-500/15 dark:text-rose-300"
              >
                {t('dashboard.importReplace')}
              </button>
              <button
                type="button"
                onClick={() => applyImport('merge')}
                className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-500/15 dark:text-cyan-300"
              >
                {t('dashboard.importMerge')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressImport;
