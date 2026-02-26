import { Rocket, Brain, Crown, Shield, Globe, Flame, Target, Calendar, Layers } from 'lucide-react';

/**
 * EWP-721 (Education Web3 Protocol) - 学习徽章协议
 */
export const BADGE_PROTOCOL = {
  name: 'EWP-721',
  version: '1.0.0',
  description: 'Education Web3 Protocol for Learning Achievement Badges',
  standard: 'Non-Fungible Achievement Tokens',
};

/**
 * 成就徽章数据结构
 */
export const ACHIEVEMENT_BADGES = {
  'module-1': {
    id: 'web3-pioneer',
    name: 'Web3 Pioneer',
    title: '先锋开拓者',
    description: '完成 Web3 快速入门模块，踏出去中心化世界的第一步',
    icon: Rocket,
    rarity: 'Common',
    color: 'from-blue-500 to-cyan-500',
    glowColor: 'shadow-blue-500/50',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    requirement: '完成 Web3 快速入门的所有 6 个课程',
    rewards: {
      title: '🚀 Web3 探索者',
      experience: 100,
      unlockedFeatures: ['AI 助教高级模式', 'Web3 每日预言机'],
      nextBadgeHint: '继续学习比特币密码学与数据层知识',
    },
  },
  'module-2': {
    id: 'bitcoin-data-master',
    name: 'Bitcoin Data Master',
    title: '比特币数据层大师',
    description: '掌握密码学基础和比特币数据层核心概念',
    icon: Shield,
    rarity: 'Rare',
    color: 'from-orange-500 to-yellow-500',
    glowColor: 'shadow-orange-500/50',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    requirement: '完成比特币密码学与数据层的所有 8 个课程',
    rewards: {
      title: '🛡️ 密码学探索者',
      experience: 200,
      unlockedFeatures: ['高级哈希可视化器'],
      nextBadgeHint: '继续学习网络与共识层知识',
    },
  },
  'module-3': {
    id: 'bitcoin-network-expert',
    name: 'Bitcoin Network Expert',
    title: '比特币网络专家',
    description: '深入理解比特币网络协议和共识机制',
    icon: Globe,
    rarity: 'Rare',
    color: 'from-green-500 to-emerald-500',
    glowColor: 'shadow-green-500/50',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    requirement: '完成比特币网络与共识层的所有 6 个课程',
    rewards: {
      title: '🌐 网络协议专家',
      experience: 200,
      unlockedFeatures: ['比特币网络实时数据'],
      nextBadgeHint: '继续学习应用层知识',
    },
  },
  'module-4': {
    id: 'bitcoin-builder',
    name: 'Bitcoin Builder',
    title: '比特币应用开发者',
    description: '掌握比特币应用开发技能，从钱包到脚本到跨链',
    icon: Brain,
    rarity: 'Epic',
    color: 'from-purple-500 to-pink-500',
    glowColor: 'shadow-purple-500/50',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    requirement: '完成比特币应用层的所有 7 个课程',
    rewards: {
      title: '🧠 比特币全栈开发者',
      experience: 300,
      unlockedFeatures: ['高级 RPC 工具', 'Script 调试器'],
      nextBadgeHint: '进入深度思考模块，解锁最终徽章',
    },
  },
  'module-5': {
    id: 'web3-philosopher',
    name: 'Web3 Philosopher',
    title: 'Web3 哲学家',
    description: '洞察 Web3 的本质，理解去中心化的深层意义',
    icon: Crown,
    rarity: 'Legendary',
    color: 'from-indigo-500 to-purple-500',
    glowColor: 'shadow-indigo-500/50',
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-500/10',
    requirement: '完成 Web3 深度思考的所有 3 个哲学课程',
    rewards: {
      title: '👑 Web3 思想家',
      experience: 300,
      unlockedFeatures: ['AI 哲学对话模式', 'Web3 未来趋势预测'],
      nextBadgeHint: '继续学习 Web3 生态与实用工具',
    },
  },
  'module-6': {
    id: 'web3-ecosystem-explorer',
    name: 'Web3 Ecosystem Explorer',
    title: 'Web3 生态探索者',
    description: '掌握 DeFi、以太坊、新兴公链和 AI+Web3 等多元生态知识',
    icon: Layers,
    rarity: 'Epic',
    color: 'from-teal-500 to-emerald-500',
    glowColor: 'shadow-teal-500/50',
    borderColor: 'border-teal-500',
    bgColor: 'bg-teal-500/10',
    requirement: '完成 Web3 生态与实用工具的所有 6 个课程',
    rewards: {
      title: '🌍 Web3 生态专家',
      experience: 300,
      unlockedFeatures: ['多链生态数据看板', 'DeFi 收益计算器'],
      nextBadgeHint: '恭喜完成所有模块！你已成为真正的 Web3 Builder',
    },
  },
};

/**
 * 特殊成就徽章
 */
export const SPECIAL_BADGES = {
  'speed-runner': {
    id: 'speed-runner',
    name: 'Speed Runner',
    title: '学习冲刺者',
    description: '在 24 小时内完成整个学习路径',
    icon: Flame,
    rarity: 'Epic',
    color: 'from-red-500 to-orange-500',
    glowColor: 'shadow-red-500/50',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-500/10',
    condition: 'complete_all_within_24h',
  },
  perfectionist: {
    id: 'perfectionist',
    name: 'Perfectionist',
    title: '完美主义者',
    description: '所有测验均获得满分',
    icon: Target,
    rarity: 'Epic',
    color: 'from-green-500 to-emerald-500',
    glowColor: 'shadow-green-500/50',
    borderColor: 'border-green-500',
    bgColor: 'bg-green-500/10',
    condition: 'perfect_scores_all_tests',
  },
  'early-adopter': {
    id: 'early-adopter',
    name: 'Early Adopter',
    title: '早期采用者',
    description: '在平台上线后第一周内注册学习',
    icon: Calendar,
    rarity: 'Rare',
    color: 'from-indigo-500 to-blue-500',
    glowColor: 'shadow-indigo-500/50',
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-500/10',
    condition: 'registered_within_first_week',
  },
};

/**
 * 获取所有徽章（包括成就徽章和特殊徽章）
 */
export const getAllBadges = () => {
  return {
    ...ACHIEVEMENT_BADGES,
    ...SPECIAL_BADGES,
  };
};

/**
 * 根据ID获取徽章
 */
export const getBadgeById = (badgeId) => {
  const allBadges = getAllBadges();
  return Object.values(allBadges).find((badge) => badge.id === badgeId);
};

/**
 * 检查徽章是否应该解锁（基于模块完成情况）
 */
export const shouldUnlockBadge = (moduleId, moduleProgress) => {
  const badge = ACHIEVEMENT_BADGES[moduleId];
  if (!badge) return false;

  // 检查模块的所有课程是否完成
  return moduleProgress?.allCompleted === true;
};
