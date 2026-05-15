import { useState } from 'react';
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../store/useUserStore';
import { downloadProgressExport } from '../utils/progressExport';

const ProgressExport = () => {
  const { t } = useTranslation();
  const [exportStarted, setExportStarted] = useState(false);

  const handleExport = () => {
    downloadProgressExport(useUserStore.getState());
    setExportStarted(true);
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        onClick={handleExport}
        className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-700 transition-colors hover:border-cyan-500/50 hover:bg-cyan-500/15 dark:text-cyan-300"
      >
        <Download className="h-4 w-4" />
        <span>{t('dashboard.exportProgress')}</span>
      </button>
      {exportStarted && (
        <p className="text-xs text-slate-500 dark:text-slate-400" role="status">
          {t('dashboard.exportStarted')}
        </p>
      )}
    </div>
  );
};

export default ProgressExport;
