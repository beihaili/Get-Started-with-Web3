import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Download, CheckCircle } from 'lucide-react';
import { useUserStore } from '../store/useUserStore';

/**
 * Progress Export component.
 * Allows users to download their learning progress as a JSON file.
 * Exposes: completed lessons, quiz scores, earned badges, XP, streak, title.
 * Does NOT export API keys or secrets.
 */
const ProgressExport = () => {
  const { t } = useTranslation();
  const [exported, setExported] = useState(false);

  const { totalExperience, userTitle, progress, studyStreak, earnedBadges, quizScores, firstActivityTimestamp } =
    useUserStore();

  const handleExport = () => {
    // Build safe export payload (no secrets, no API keys)
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        totalExperience,
        userTitle,
        progress: Object.keys(progress).filter((k) => progress[k]),
        studyStreak,
        earnedBadges: Object.keys(earnedBadges),
        quizScores,
        firstActivityTimestamp,
      },
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().split('T')[0];
    const filename = `web3-progress-${date}.json`;

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <button
      onClick={handleExport}
      aria-label={t('dashboard.exportProgress')}
      title={t('dashboard.exportProgress')}
      className={[
        'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
        'border',
        exported
          ? 'border-green-500/40 bg-green-500/10 text-green-400'
          : 'border-slate-600 bg-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 hover:bg-slate-700'
      ].join(' ')}
    >
      {exported ? (
        <>
          <CheckCircle className="w-4 h-4" />
          {t('dashboard.exportDone')}
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          {t('dashboard.exportProgress')}
        </>
      )}
    </button>
  );
};

export default ProgressExport;