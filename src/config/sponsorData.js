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
    address: '0xC896E7c0aD9A8F9C787b5BBEdCEebA259c912d72',
    network: 'Ethereum / Base / Polygon',
  },
  {
    chain: 'BTC',
    address: '1GihPqLkjJNK2fzCMSicc9mLapKeGy3Vv1',
    network: 'Bitcoin',
  },
];

/** 赞助商（按等级分类，留空供未来使用） */
export const SPONSORS = { gold: [], silver: [], bronze: [] };

/** 联盟推广链接（留空供未来使用） */
export const AFFILIATE_LINKS = [];
