export const PROGRESS_EXPORT_VERSION = 1;

const PROGRESS_EXPORT_FIELDS = [
  'progress',
  'earnedBadges',
  'totalExperience',
  'userTitle',
  'studyStreak',
  'lastStudyDate',
  'quizScores',
  'firstActivityTimestamp',
];

export function buildProgressExport(state, exportedAt = new Date()) {
  const data = PROGRESS_EXPORT_FIELDS.reduce((snapshot, field) => {
    snapshot[field] = state[field] ?? null;
    return snapshot;
  }, {});

  return {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: exportedAt.toISOString(),
    data,
  };
}

export function getProgressExportFileName(exportedAt = new Date()) {
  return `web3-progress-${exportedAt.toISOString().slice(0, 10)}.json`;
}

export function downloadProgressExport(state, exportedAt = new Date()) {
  const payload = buildProgressExport(state, exportedAt);
  const fileName = getProgressExportFileName(exportedAt);
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);

  return { fileName, payload };
}
