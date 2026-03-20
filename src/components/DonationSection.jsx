import { Heart, Wallet } from 'lucide-react';
import { DONATION_LINKS, CRYPTO_WALLETS } from '../config/sponsorData';

/**
 * 捐赠区块（首页展示）
 * 显示捐赠渠道和加密货币钱包地址
 */
const DonationSection = () => {
  return (
    <div className="max-w-3xl mx-auto mb-16">
      <h2 className="text-2xl font-bold text-white text-center mb-2">支持本项目</h2>
      <p className="text-slate-400 text-center text-sm mb-8">
        本教程完全免费开源，如果对你有帮助，欢迎支持作者持续更新 ✨
      </p>

      {/* 捐赠渠道 */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        {DONATION_LINKS.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700
              hover:border-pink-500/40 rounded-xl transition-all hover:scale-105 group"
          >
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500
                flex items-center justify-center shrink-0"
            >
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-semibold group-hover:text-pink-400 transition-colors">
                {link.name}
              </div>
              <div className="text-slate-400 text-xs truncate max-w-[200px]">{link.url}</div>
            </div>
          </a>
        ))}
      </div>

      {/* 加密货币钱包 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Wallet className="w-4 h-4" />
          <span>加密货币打赏</span>
        </div>
        {CRYPTO_WALLETS.map((wallet) => (
          <div
            key={wallet.chain}
            className="flex items-start gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl"
          >
            <div
              className="px-2.5 py-1 bg-slate-700 rounded-md text-xs font-mono font-bold
                text-cyan-400 shrink-0 mt-0.5"
            >
              {wallet.chain}
            </div>
            <div className="min-w-0">
              <div className="text-xs text-slate-400 mb-1">{wallet.network}</div>
              <div className="font-mono text-xs text-slate-200 break-all">{wallet.address}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationSection;
