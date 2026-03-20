/**
 * 赞助和捐赠相关配置
 * 包含捐赠链接、加密货币钱包地址、赞助商信息
 */

/** 法币/平台捐赠渠道 */
export const DONATION_LINKS = [
  {
    name: 'Buy Me a Coffee',
    url: 'https://buymeacoffee.com/beihai',
    icon: 'Coffee',
  },
  {
    name: 'GitHub Sponsors',
    url: 'https://github.com/sponsors/beihaili',
    icon: 'Heart',
  },
];

/** 加密货币钱包地址 */
export const CRYPTO_WALLETS = [
  {
    chain: 'ETH',
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18',
    network: 'Ethereum / Base / Polygon',
  },
  {
    chain: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    network: 'Bitcoin',
  },
];

/** 赞助商（按等级分类，留空供未来使用） */
export const SPONSORS = { gold: [], silver: [], bronze: [] };

/** 联盟推广链接（留空供未来使用） */
export const AFFILIATE_LINKS = [];
