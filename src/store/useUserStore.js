import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { COURSE_DATA } from '../config/courseData';
import {
  ACHIEVEMENT_BADGES,
  SPECIAL_BADGES,
  PLATFORM_LAUNCH_DATE,
} from '../features/badges/badgeData';

/**
 * 用户状态管理
 * 管理学习进度、徽章、经验值等用户相关数据
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

      getLessonProgress: (lessonId) => {
        const { progress } = get();
        return progress[lessonId] || false;
      },

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

      hasBadge: (badgeId) => {
        const { earnedBadges } = get();
        return !!earnedBadges[badgeId];
      },

      getBadgeCount: () => {
        const { earnedBadges } = get();
        return Object.keys(earnedBadges).length;
      },

      // Actions - 经验值和头衔
      addExperience: (amount) => {
        const { totalExperience } = get();
        set({ totalExperience: totalExperience + amount });
        get().updateUserTitle();
      },

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
