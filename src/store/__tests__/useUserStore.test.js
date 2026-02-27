import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from '../useUserStore';

// Reset store state before each test
beforeEach(() => {
  useUserStore.setState({
    progress: {},
    earnedBadges: {},
    totalExperience: 0,
    userTitle: '新手探索者',
    studyStreak: 0,
    lastStudyDate: null,
    quizScores: {},
    firstActivityTimestamp: null,
  });
});

describe('markLessonComplete', () => {
  it('marks a lesson as complete and adds 100 XP', () => {
    useUserStore.getState().markLessonComplete('1-1');

    const state = useUserStore.getState();
    expect(state.progress['1-1']).toBe(true);
    expect(state.totalExperience).toBe(100);
  });

  it('does not add XP on duplicate calls', () => {
    useUserStore.getState().markLessonComplete('1-1');
    useUserStore.getState().markLessonComplete('1-1');

    expect(useUserStore.getState().totalExperience).toBe(100);
  });

  it('accumulates XP across multiple lessons', () => {
    useUserStore.getState().markLessonComplete('1-1');
    useUserStore.getState().markLessonComplete('1-2');
    useUserStore.getState().markLessonComplete('1-3');

    expect(useUserStore.getState().totalExperience).toBe(300);
    expect(useUserStore.getState().progress['1-1']).toBe(true);
    expect(useUserStore.getState().progress['1-2']).toBe(true);
    expect(useUserStore.getState().progress['1-3']).toBe(true);
  });
});

describe('getModuleProgress', () => {
  it('returns 0% for no completed lessons', () => {
    const result = useUserStore.getState().getModuleProgress(['1-1', '1-2']);
    expect(result.percentage).toBe(0);
    expect(result.completed).toBe(0);
    expect(result.total).toBe(2);
  });

  it('returns 50% for half completed lessons', () => {
    useUserStore.getState().markLessonComplete('1-1');
    const result = useUserStore.getState().getModuleProgress(['1-1', '1-2']);
    expect(result.percentage).toBe(50);
    expect(result.completed).toBe(1);
  });

  it('returns 100% for all completed lessons', () => {
    useUserStore.getState().markLessonComplete('1-1');
    useUserStore.getState().markLessonComplete('1-2');
    const result = useUserStore.getState().getModuleProgress(['1-1', '1-2']);
    expect(result.percentage).toBe(100);
    expect(result.completed).toBe(2);
  });

  it('handles empty lesson array', () => {
    const result = useUserStore.getState().getModuleProgress([]);
    expect(result.percentage).toBe(0);
    expect(result.total).toBe(0);
  });
});

describe('earnBadge', () => {
  it('earns a badge and adds 200 XP', () => {
    useUserStore.getState().earnBadge('badge-1', 'module-1');

    const state = useUserStore.getState();
    expect(state.earnedBadges['badge-1']).toBeDefined();
    expect(state.earnedBadges['badge-1'].moduleId).toBe('module-1');
    expect(state.totalExperience).toBe(200);
  });

  it('does not award duplicate badges', () => {
    useUserStore.getState().earnBadge('badge-1', 'module-1');
    useUserStore.getState().earnBadge('badge-1', 'module-1');

    expect(useUserStore.getState().totalExperience).toBe(200);
    expect(useUserStore.getState().getBadgeCount()).toBe(1);
  });
});

describe('updateUserTitle', () => {
  it('starts as 新手探索者 at 0 XP', () => {
    expect(useUserStore.getState().userTitle).toBe('新手探索者');
  });

  it('becomes Web3 学徒 at 500 XP', () => {
    useUserStore.setState({ totalExperience: 500 });
    useUserStore.getState().updateUserTitle();
    expect(useUserStore.getState().userTitle).toBe('Web3 学徒');
  });

  it('becomes Web3 进阶者 at 2000 XP', () => {
    useUserStore.setState({ totalExperience: 2000 });
    useUserStore.getState().updateUserTitle();
    expect(useUserStore.getState().userTitle).toBe('Web3 进阶者');
  });

  it('becomes Web3 专家 at 5000 XP', () => {
    useUserStore.setState({ totalExperience: 5000 });
    useUserStore.getState().updateUserTitle();
    expect(useUserStore.getState().userTitle).toBe('Web3 专家');
  });

  it('becomes Web3 大师 at 10000 XP', () => {
    useUserStore.setState({ totalExperience: 10000 });
    useUserStore.getState().updateUserTitle();
    expect(useUserStore.getState().userTitle).toBe('Web3 大师');
  });
});

describe('updateStudyStreak', () => {
  it('sets streak to 1 on first study', () => {
    useUserStore.getState().updateStudyStreak();

    const state = useUserStore.getState();
    expect(state.studyStreak).toBe(1);
    expect(state.lastStudyDate).toBe(new Date().toDateString());
  });

  it('does not increment streak on same day', () => {
    useUserStore.getState().updateStudyStreak();
    useUserStore.getState().updateStudyStreak();

    expect(useUserStore.getState().studyStreak).toBe(1);
  });

  it('increments streak on consecutive day', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    useUserStore.setState({
      studyStreak: 3,
      lastStudyDate: yesterday.toDateString(),
    });

    useUserStore.getState().updateStudyStreak();
    expect(useUserStore.getState().studyStreak).toBe(4);
  });

  it('resets streak after a gap', () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    useUserStore.setState({
      studyStreak: 5,
      lastStudyDate: twoDaysAgo.toDateString(),
    });

    useUserStore.getState().updateStudyStreak();
    expect(useUserStore.getState().studyStreak).toBe(1);
  });
});

describe('getLessonProgress', () => {
  it('returns false for incomplete lesson', () => {
    expect(useUserStore.getState().getLessonProgress('1-1')).toBe(false);
  });

  it('returns true for completed lesson', () => {
    useUserStore.getState().markLessonComplete('1-1');
    expect(useUserStore.getState().getLessonProgress('1-1')).toBe(true);
  });
});

describe('recordQuizScore', () => {
  it('stores quiz score correctly', () => {
    useUserStore.getState().recordQuizScore('1-1', 3, 3);

    const state = useUserStore.getState();
    expect(state.quizScores['1-1']).toEqual({ score: 3, total: 3, isPerfect: true });
  });

  it('marks non-perfect score correctly', () => {
    useUserStore.getState().recordQuizScore('1-1', 2, 3);

    const state = useUserStore.getState();
    expect(state.quizScores['1-1'].isPerfect).toBe(false);
  });

  it('overwrites previous score for same lesson', () => {
    useUserStore.getState().recordQuizScore('1-1', 2, 3);
    useUserStore.getState().recordQuizScore('1-1', 3, 3);

    const state = useUserStore.getState();
    expect(state.quizScores['1-1'].isPerfect).toBe(true);
  });
});

describe('firstActivityTimestamp', () => {
  it('sets firstActivityTimestamp on first markLessonComplete', () => {
    useUserStore.getState().markLessonComplete('1-1');

    const state = useUserStore.getState();
    expect(state.firstActivityTimestamp).toBeGreaterThan(0);
  });

  it('does not overwrite firstActivityTimestamp on subsequent calls', () => {
    useUserStore.getState().markLessonComplete('1-1');
    const first = useUserStore.getState().firstActivityTimestamp;

    useUserStore.getState().markLessonComplete('1-2');
    const second = useUserStore.getState().firstActivityTimestamp;

    expect(second).toBe(first);
  });
});

describe('checkModuleBadges', () => {
  it('awards badge when all module lessons are complete', () => {
    // module-5 has 3 lessons: 5-1, 5-2, 5-3
    useUserStore.getState().markLessonComplete('module-5-5-1');
    useUserStore.getState().markLessonComplete('module-5-5-2');
    useUserStore.getState().markLessonComplete('module-5-5-3');

    useUserStore.getState().checkModuleBadges('module-5');

    const state = useUserStore.getState();
    expect(state.earnedBadges['web3-philosopher']).toBeDefined();
  });

  it('does not award badge when module is incomplete', () => {
    useUserStore.getState().markLessonComplete('module-5-5-1');

    useUserStore.getState().checkModuleBadges('module-5');

    const state = useUserStore.getState();
    expect(state.earnedBadges['web3-philosopher']).toBeUndefined();
  });
});

describe('checkSpecialBadges', () => {
  it('awards early-adopter badge if first activity is within launch week', () => {
    // Set firstActivityTimestamp to platform launch date + 1 day
    const { PLATFORM_LAUNCH_DATE } = require('../../features/badges/badgeData');
    useUserStore.setState({
      firstActivityTimestamp: PLATFORM_LAUNCH_DATE + 1000,
    });

    useUserStore.getState().checkSpecialBadges();

    const state = useUserStore.getState();
    expect(state.earnedBadges['early-adopter']).toBeDefined();
  });

  it('does not award early-adopter badge if first activity is after launch week', () => {
    const { PLATFORM_LAUNCH_DATE } = require('../../features/badges/badgeData');
    useUserStore.setState({
      firstActivityTimestamp: PLATFORM_LAUNCH_DATE + 8 * 24 * 60 * 60 * 1000,
    });

    useUserStore.getState().checkSpecialBadges();

    const state = useUserStore.getState();
    expect(state.earnedBadges['early-adopter']).toBeUndefined();
  });
});
