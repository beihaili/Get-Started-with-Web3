const PROGRESS_FIELDS = {
  progress: {},
  earnedBadges: {},
  totalExperience: 0,
  userTitle: '新手探索者',
  studyStreak: 0,
  lastStudyDate: null,
  quizScores: {},
  firstActivityTimestamp: null,
};

export class ProgressImportError extends Error {
  constructor(code, message = code) {
    super(message);
    this.name = 'ProgressImportError';
    this.code = code;
  }
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function pickObject(value) {
  return isPlainObject(value) ? value : {};
}

function pickNumber(value, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function pickTimestamp(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function pickString(value, fallback = null) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function newerDateString(a, b) {
  const aTime = Date.parse(a || '');
  const bTime = Date.parse(b || '');

  if (Number.isNaN(aTime)) return pickString(b, null);
  if (Number.isNaN(bTime)) return pickString(a, null);
  return bTime > aTime ? b : a;
}

function mergeBadges(existing = {}, incoming = {}) {
  const merged = { ...existing };

  Object.entries(incoming).forEach(([badgeId, badge]) => {
    const current = merged[badgeId];
    const currentTimestamp = pickNumber(current?.timestamp, 0);
    const incomingTimestamp = pickNumber(badge?.timestamp, 0);

    if (!current || incomingTimestamp >= currentTimestamp) {
      merged[badgeId] = badge;
    }
  });

  return merged;
}

function quizScoreRank(score) {
  if (!score) return [-1, -1, 0];
  const total = pickNumber(score.total, 0);
  const rawScore = pickNumber(score.score, 0);
  const ratio = total > 0 ? rawScore / total : 0;
  return [score.isPerfect ? 1 : 0, ratio, rawScore];
}

function isBetterQuizScore(candidate, current) {
  const candidateRank = quizScoreRank(candidate);
  const currentRank = quizScoreRank(current);

  for (let i = 0; i < candidateRank.length; i += 1) {
    if (candidateRank[i] > currentRank[i]) return true;
    if (candidateRank[i] < currentRank[i]) return false;
  }
  return false;
}

function mergeQuizScores(existing = {}, incoming = {}) {
  const merged = { ...existing };

  Object.entries(incoming).forEach(([lessonId, score]) => {
    if (!merged[lessonId] || isBetterQuizScore(score, merged[lessonId])) {
      merged[lessonId] = score;
    }
  });

  return merged;
}

export function normalizeProgressData(data = {}) {
  return {
    progress: pickObject(data.progress),
    earnedBadges: pickObject(data.earnedBadges),
    totalExperience: pickNumber(data.totalExperience),
    userTitle: pickString(data.userTitle, PROGRESS_FIELDS.userTitle),
    studyStreak: pickNumber(data.studyStreak),
    lastStudyDate: pickString(data.lastStudyDate, null),
    quizScores: pickObject(data.quizScores),
    firstActivityTimestamp: pickTimestamp(data.firstActivityTimestamp),
  };
}

export function isProgressDataEmpty(data = {}) {
  const normalized = normalizeProgressData(data);

  return (
    Object.keys(normalized.progress).length === 0 &&
    Object.keys(normalized.earnedBadges).length === 0 &&
    Object.keys(normalized.quizScores).length === 0 &&
    normalized.totalExperience === 0 &&
    normalized.studyStreak === 0 &&
    !normalized.lastStudyDate &&
    !normalized.firstActivityTimestamp
  );
}

export function mergeProgress(existing = {}, incoming = {}) {
  const normalizedExisting = normalizeProgressData(existing);
  const normalizedIncoming = normalizeProgressData(incoming);

  if (isProgressDataEmpty(normalizedIncoming)) return normalizedExisting;
  if (isProgressDataEmpty(normalizedExisting)) return normalizedIncoming;

  const incomingHasHigherExperience =
    normalizedIncoming.totalExperience > normalizedExisting.totalExperience;

  return {
    progress: {
      ...normalizedExisting.progress,
      ...normalizedIncoming.progress,
    },
    earnedBadges: mergeBadges(normalizedExisting.earnedBadges, normalizedIncoming.earnedBadges),
    totalExperience: Math.max(
      normalizedExisting.totalExperience,
      normalizedIncoming.totalExperience
    ),
    userTitle: incomingHasHigherExperience
      ? normalizedIncoming.userTitle
      : normalizedExisting.userTitle,
    studyStreak: Math.max(normalizedExisting.studyStreak, normalizedIncoming.studyStreak),
    lastStudyDate: newerDateString(
      normalizedExisting.lastStudyDate,
      normalizedIncoming.lastStudyDate
    ),
    quizScores: mergeQuizScores(normalizedExisting.quizScores, normalizedIncoming.quizScores),
    firstActivityTimestamp:
      normalizedExisting.firstActivityTimestamp && normalizedIncoming.firstActivityTimestamp
        ? Math.min(
            normalizedExisting.firstActivityTimestamp,
            normalizedIncoming.firstActivityTimestamp
          )
        : normalizedExisting.firstActivityTimestamp || normalizedIncoming.firstActivityTimestamp,
  };
}

export function parseProgressImportPayload(payload) {
  if (!isPlainObject(payload)) {
    throw new ProgressImportError('invalid-json');
  }

  if (payload.version !== 1) {
    throw new ProgressImportError('unsupported-version');
  }

  if (!isPlainObject(payload.data)) {
    throw new ProgressImportError('invalid-json');
  }

  return normalizeProgressData(payload.data);
}
