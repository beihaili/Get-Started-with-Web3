/**
 * 徽章系统模块入口
 * 导出所有徽章相关的组件和数据
 */

// 徽章数据
export {
  BADGE_PROTOCOL,
  ACHIEVEMENT_BADGES,
  SPECIAL_BADGES,
  PLATFORM_LAUNCH_DATE,
  getAllBadges,
  getBadgeById,
  shouldUnlockBadge,
} from './badgeData';

// 徽章组件
export { default as BadgeCard } from './components/BadgeCard';
export { default as BadgeFloatingAnimation } from './components/BadgeFloatingAnimation';
