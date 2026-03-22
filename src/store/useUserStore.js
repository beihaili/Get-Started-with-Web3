import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COURSE_DATA } from '../config/courseData';
import {
  ACHIEVEMENT_BADGES,
  SPECIAL_BADGES,
  PLATFORM_LAUNCH_DATE,
} from '../features/badges/badgeData';

/**
 * @module useUserStore
 * @description User state management.
 * Tracks learning progress, badges, experience points (XP), and study streaks.
 */

/**
 * @typedef {Object} BadgeMetadata
 * @property {string} moduleId - The module associated with the badge.
 * @property {number} timestamp - When the badge was earned.
 */

/**
 * @typedef {Object} ModuleProgress
 * @property {number} completed - Number of completed lessons in the module.
 * @property {number} total - Total number of lessons in the module.
 * @property {number} percentage - Percentage of completion.
 */

/**
 * @typedef {Object} QuizScore
 * @property {number} score - Correct answers.
 * @property {number} total - Total questions.
 * @property {boolean} isPerfect - Whether it was a perfect score.
 */

/**
 * @typedef {Object} UserState
 * @property {Object.<string, boolean>} progress - Map of completed lesson IDs.
 * @property {Object.<string, BadgeMetadata>} earnedBadges - Map of earned badge IDs.
 * @property {number} totalExperience - Total XP earned.
 * @property {string} userTitle - Current user title (rank).
 * @property {number} studyStreak - Current consecutive days studied.
 * @property {string|null} lastStudyDate - Last date the user studied.
 * @property {Object.<string, QuizScore>} quizScores - History of quiz scores.
 * @property {number|null} firstActivityTimestamp - First time the user ever logged activity.
 * @property {function(string): void} markLessonComplete - Mark a lesson as completed.
 * @property {function(string): boolean} getLessonProgress - Check if a lesson is completed.
 * @property {function(string[]): ModuleProgress} getModuleProgress - Calculate module progress.
 * @property {function(string, string, Object): void} earnBadge - Award a badge to the user.
 * @property {function(string): boolean} hasBadge - Check if the user has a badge.
 * @property {function(): number} getBadgeCount - Total count of earned badges.
 * @property {function(number): void} addExperience - Add XP to the user.
 * @property {function(): void} updateUserTitle - Recalculate title based on total XP.
 * @property {function(string, number, number): void} recordQuizScore - Save quiz results.
 * @property {function(string): void} checkModuleBadges - Check if all lessons in a module are completed to award a badge.
 * @property {function(): void} checkSpecialBadges - Check conditions for special achievements (speed runner, etc.).
 * @property {function(): void} updateStudyStreak - Maintain the daily study streak.
 */

/**
 * @type {import('zustand').UseBoundStore<import('zustand').StoreApi<UserState>>}
 */
export const useUserStore = create(
  persist(
    (set, get) => ({
      // 学习进度 { lessonId: true }
      progress: {},

      // 徽章系统 { badgeId: { moduleId, timestamp, ... } }
      earnedBadges: {},

      // 经验值系统
      totalExperience: 0,
      userTitle: '新手探索者',

      // 学习连续天数
      studyStreak: 0,
      lastStudyDate: null,

      // 测验成绩 { lessonId: { score, total, isPerfect } }
      quizScores: {},

      // 首次学习时间戳
      firstActivityTimestamp: null,

      // Actions - 学习进度
      /**
       * @param {string} lessonId - ID of the completed lesson.
       */
      markLessonComplete: (lessonId) => {
        const { progress, totalExperience, firstActivityTimestamp } = get();

        // 如果课程还未完成，增加经验值
        if (!progress[lessonId]) {
          set({
            progress: { ...progress, [lessonId]: true },
            totalExperience: totalExperience + 100,
            firstActivityTimestamp: firstActivityTimestamp || Date.now(),
          });

          // 更新学习连续天数
          get().updateStudyStreak();

          // 检查是否解锁新头衔
          get().updateUserTitle();

          // 检查特殊徽章
          get().checkSpecialBadges();
        }
      },

      /**
       * @param {string} lessonId - ID of the lesson.
       * @returns {boolean} True if the lesson is completed.
       */
      getLessonProgress: (lessonId) => {
        const { progress } = get();
        return progress[lessonId] || false;
      },

      /**
       * @param {string[]} lessonIds - List of lesson IDs in the module.
       * @returns {ModuleProgress} Completion statistics.
       */
      getModuleProgress: (lessonIds) => {
        const { progress } = get();
        const completed = lessonIds.filter((id) => progress[id]).length;
        return {
          completed,
          total: lessonIds.length,
          percentage: lessonIds.length > 0 ? (completed / lessonIds.length) * 100 : 0,
        };
      },

      // Actions - 徽章系统
      /**
       * @param {string} badgeId - ID of the badge to award.
       * @param {string} moduleId - Associated module ID.
       * @param {Object} [metadata={}] - Additional data for the badge.
       */
      earnBadge: (badgeId, moduleId, metadata = {}) => {
        const { earnedBadges, totalExperience } = get();

        if (!earnedBadges[badgeId]) {
          set({
            earnedBadges: {
              ...earnedBadges,
              [badgeId]: {
                moduleId,
                timestamp: Date.now(),
                ...metadata,
              },
            },
            totalExperience: totalExperience + 200, // 徽章奖励经验值
          });
        }
      },

      /**
       * @param {string} badgeId - ID of the badge to check.
       * @returns {boolean} True if earned.
       */
      hasBadge: (badgeId) => {
        const { earnedBadges } = get();
        return !!earnedBadges[badgeId];
      },

      /**
       * @returns {number} The count of earned badges.
       */
      getBadgeCount: () => {
        const { earnedBadges } = get();
        return Object.keys(earnedBadges).length;
      },

      // Actions - 经验值和头衔
      /**
       * @param {number} amount - Amount of XP to add.
       */
      addExperience: (amount) => {
        const { totalExperience } = get();
        set({ totalExperience: totalExperience + amount });
        get().updateUserTitle();
      },

      /**
       * Recalculates the user rank title based on total XP.
       */
      updateUserTitle: () => {
        const { totalExperience } = get();
        let newTitle = '新手探索者';

        if (totalExperience >= 10000) {
          newTitle = 'Web3 大师';
        } else if (totalExperience >= 5000) {
          newTitle = 'Web3 专家';
        } else if (totalExperience >= 2000) {
          newTitle = 'Web3 进阶者';
        } else if (totalExperience >= 500) {
          newTitle = 'Web3 学徒';
        }

        set({ userTitle: newTitle });
      },

      // Actions - 测验成绩
      /**
       * @param {string} lessonId - ID of the lesson.
       * @param {number} score - Current score.
       * @param {number} total - Total questions.
       */
      recordQuizScore: (lessonId, score, total) => {
        const { quizScores } = get();
        set({
          quizScores: {
            ...quizScores,
            [lessonId]: { score, total, isPerfect: score === total },
          },
        });

        // 检查特殊徽章
        get().checkSpecialBadges();
      },

      // Actions - 徽章自动检测
      /**
       * @param {string} moduleId - ID of the module to check.
       */
      checkModuleBadges: (moduleId) => {
        const { progress, earnedBadges } = get();
        const moduleData = COURSE_DATA.find((m) => m.id === moduleId);
        if (!moduleData) return;

        const badge = ACHIEVEMENT_BADGES[moduleId];
        if (!badge) return;

        // 已有该徽章则跳过
        if (earnedBadges[badge.id]) return;

        // 检查模块所有课程是否完成
        const allCompleted = moduleData.lessons.every(
          (lesson) => progress[`${moduleId}-${lesson.id}`]
        );

        if (allCompleted) {
          get().earnBadge(badge.id, moduleId);
        }
      },

      /**
       * Checks conditions for special performance-based badges.
       */
      checkSpecialBadges: () => {
        const { progress, quizScores, firstActivityTimestamp, earnedBadges } = get();

        // 获取所有课程的 lessonKey 列表
        const allLessonKeys = COURSE_DATA.flatMap((m) => m.lessons.map((l) => `${m.id}-${l.id}`));
        const allLessonIds = COURSE_DATA.flatMap((m) => m.lessons.map((l) => l.id));
        const allCompleted = allLessonKeys.every((key) => progress[key]);

        // speed-runner: 24 小时内完成所有课程
        if (
          !earnedBadges[SPECIAL_BADGES['speed-runner'].id] &&
          allCompleted &&
          firstActivityTimestamp &&
          Date.now() - firstActivityTimestamp < 24 * 60 * 60 * 1000
        ) {
          get().earnBadge(SPECIAL_BADGES['speed-runner'].id, 'special');
        }

        // perfectionist: 所有课程测验满分
        if (!earnedBadges[SPECIAL_BADGES.perfectionist.id]) {
          const allPerfect =
            allLessonIds.length > 0 &&
            allLessonIds.every((id) => quizScores[id]?.isPerfect === true);
          if (allPerfect) {
            get().earnBadge(SPECIAL_BADGES.perfectionist.id, 'special');
          }
        }

        // early-adopter: 在平台上线后第一周内开始学习
        if (
          !earnedBadges[SPECIAL_BADGES['early-adopter'].id] &&
          firstActivityTimestamp &&
          firstActivityTimestamp < PLATFORM_LAUNCH_DATE + 7 * 24 * 60 * 60 * 1000
        ) {
          get().earnBadge(SPECIAL_BADGES['early-adopter'].id, 'special');
        }
      },

      // Actions - 学习连续天数
      /**
       * Updates the daily study streak.
       */
      updateStudyStreak: () => {
        const { lastStudyDate, studyStreak } = get();
        const today = new Date().toDateString();

        if (lastStudyDate !== today) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toDateString();

          // 如果上次学习是昨天，增加连续天数
          if (lastStudyDate === yesterdayStr) {
            set({ studyStreak: studyStreak + 1, lastStudyDate: today });
          } else {
            // 否则重置为1
            set({ studyStreak: 1, lastStudyDate: today });
          }
        }
      },
    }),
    {
      name: 'web3-user-store', // localStorage key
      partialize: (state) => ({
        progress: state.progress,
        earnedBadges: state.earnedBadges,
        totalExperience: state.totalExperience,
        userTitle: state.userTitle,
        studyStreak: state.studyStreak,
        lastStudyDate: state.lastStudyDate,
        quizScores: state.quizScores,
        firstActivityTimestamp: state.firstActivityTimestamp,
      }),
    }
  )
);
