import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 用户状态管理
 * 管理钱包连接、学习进度、徽章、经验值等用户相关数据
 */
export const useUserStore = create(
  persist(
    (set, get) => ({
      // 钱包状态
      address: '',
      connected: false,

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

      // Actions - 钱包连接
      connectWallet: (walletAddress) =>
        set({
          address: walletAddress,
          connected: true,
        }),

      disconnectWallet: () =>
        set({
          address: '',
          connected: false,
        }),

      // Actions - 学习进度
      markLessonComplete: (lessonId) => {
        const { progress, totalExperience } = get();

        // 如果课程还未完成，增加经验值
        if (!progress[lessonId]) {
          set({
            progress: { ...progress, [lessonId]: true },
            totalExperience: totalExperience + 100,
          });

          // 更新学习连续天数
          get().updateStudyStreak();

          // 检查是否解锁新头衔
          get().updateUserTitle();
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

      // Reset user data
      resetUserData: () =>
        set({
          progress: {},
          earnedBadges: {},
          totalExperience: 0,
          userTitle: '新手探索者',
          studyStreak: 0,
          lastStudyDate: null,
        }),
    }),
    {
      name: 'web3-user-store', // localStorage key
      partialize: (state) => ({
        address: state.address,
        connected: state.connected,
        progress: state.progress,
        earnedBadges: state.earnedBadges,
        totalExperience: state.totalExperience,
        userTitle: state.userTitle,
        studyStreak: state.studyStreak,
        lastStudyDate: state.lastStudyDate,
      }),
    }
  )
);
