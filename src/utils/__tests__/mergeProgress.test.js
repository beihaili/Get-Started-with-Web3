import { describe, expect, it } from 'vitest';
import { mergeProgress } from '../mergeProgress';

describe('mergeProgress', () => {
  it('keeps existing progress when incoming data is empty', () => {
    const existing = {
      progress: { 'module-1-1-1': true },
      earnedBadges: { starter: { moduleId: 'module-1', timestamp: 10 } },
      totalExperience: 300,
      userTitle: 'Web3 学徒',
      studyStreak: 3,
      lastStudyDate: 'Fri May 15 2026',
      quizScores: { '1-1': { score: 2, total: 3, isPerfect: false } },
      firstActivityTimestamp: 100,
    };

    expect(mergeProgress(existing, {})).toEqual(existing);
  });

  it('uses incoming progress when existing data is empty', () => {
    const incoming = {
      progress: { 'module-2-2-1': true },
      earnedBadges: { bitcoin: { moduleId: 'module-2', timestamp: 20 } },
      totalExperience: 500,
      userTitle: 'Web3 学徒',
      studyStreak: 2,
      lastStudyDate: 'Thu May 14 2026',
      quizScores: { '2-1': { score: 3, total: 3, isPerfect: true } },
      firstActivityTimestamp: 50,
    };

    expect(mergeProgress({}, incoming)).toEqual(incoming);
  });

  it('merges partial overlap using the more advanced value per field', () => {
    const existing = {
      progress: { 'module-1-1-1': true },
      earnedBadges: { starter: { moduleId: 'module-1', timestamp: 10 } },
      totalExperience: 700,
      userTitle: 'Web3 学徒',
      studyStreak: 2,
      lastStudyDate: 'Thu May 14 2026',
      quizScores: {
        '1-1': { score: 2, total: 3, isPerfect: false },
      },
      firstActivityTimestamp: 100,
    };
    const incoming = {
      progress: { 'module-1-1-1': true, 'module-2-2-1': true },
      earnedBadges: {
        starter: { moduleId: 'module-1', timestamp: 30 },
        bitcoin: { moduleId: 'module-2', timestamp: 20 },
      },
      totalExperience: 900,
      userTitle: 'Web3 进阶者',
      studyStreak: 4,
      lastStudyDate: 'Fri May 15 2026',
      quizScores: {
        '1-1': { score: 3, total: 3, isPerfect: true },
        '2-1': { score: 1, total: 3, isPerfect: false },
      },
      firstActivityTimestamp: 80,
    };

    expect(mergeProgress(existing, incoming)).toEqual({
      progress: { 'module-1-1-1': true, 'module-2-2-1': true },
      earnedBadges: {
        starter: { moduleId: 'module-1', timestamp: 30 },
        bitcoin: { moduleId: 'module-2', timestamp: 20 },
      },
      totalExperience: 900,
      userTitle: 'Web3 进阶者',
      studyStreak: 4,
      lastStudyDate: 'Fri May 15 2026',
      quizScores: {
        '1-1': { score: 3, total: 3, isPerfect: true },
        '2-1': { score: 1, total: 3, isPerfect: false },
      },
      firstActivityTimestamp: 80,
    });
  });

  it('keeps the longest streak and newest study date when streak timestamps conflict', () => {
    const existing = {
      studyStreak: 8,
      lastStudyDate: 'Wed May 13 2026',
    };
    const incoming = {
      studyStreak: 5,
      lastStudyDate: 'Fri May 15 2026',
    };

    expect(mergeProgress(existing, incoming)).toMatchObject({
      studyStreak: 8,
      lastStudyDate: 'Fri May 15 2026',
    });
  });
});
