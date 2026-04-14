import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Wallet, ArrowUpRight, Copy, Check } from 'lucide-react';
import { DONATION_LINKS, CRYPTO_WALLETS, AFFILIATE_LINKS } from '../config/sponsorData';

/**
 * 璧炲姪灞曠ず缁勪欢锛氶〉闈㈠睍绀烘墦璧忛摼鎺ュ拰鍔犲瘑閽卞寘鍦板潃
 * 閽卞寘鍦板潃鏀寔涓€閿鍒? */
const DonationSection = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto mb-16">
      <h2 className="text-2xl font-bold text-white text-center mb-2">{t('donation.title')}</h2>
      <p className="text-slate-400 text-center text-sm mb-8">{t('donation.subtitle')}</p>

      {/* 鎵撹祻閾炬帴 */}
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

      {/* 鑱旂洘閾炬帴 */}
      {AFFILIATE_LINKS.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {AFFILIATE_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener sponsored noreferrer"
              className="flex items-center gap-3 p-4 bg-slate-800 border border-slate-700
                hover:border-yellow-500/40 rounded-xl transition-all hover:scale-105 group"
            >
              <div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500
                  flex items-center justify-center shrink-0"
              >
                <ArrowUpRight className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold group-hover:text-yellow-400 transition-colors">
                  {link.nameZh} {link.name}
                </div>
                <div className="text-slate-400 text-xs">{link.descriptionZh}</div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* 鍔犲瘑閽卞寘鍦板潃 鈥?鏀寔澶嶅埗 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Wallet className="w-4 h-4" />
          <span>{t('donation.cryptoLabel')}</span>
        </div>
        {CRYPTO_WALLETS.map((wallet) => (
          <WalletRow key={wallet.chain} wallet={wallet} />
        ))}
      </div>
    </div>
  );
};

/**
 * 鍗曡閽卞寘鍦板潃缁勪欢锛氭樉绀洪摼鍚?+ 缃戠粶 + 鍦板潃 + 澶嶅埗鎸夐挳
 */
const WalletRow = ({ wallet }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(wallet.address);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = wallet.address;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  return (
    <div className="flex items-start gap-3 p-4 bg-slate-800 border border-slate-700 rounded-xl">
      <div
        className="px-2.5 py-1 bg-slate-700 rounded-md text-xs font-mono font-bold
          text-cyan-400 shrink-0 mt-0.5"
      >
        {wallet.chain}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-slate-400 mb-1">{wallet.network}</div>
        <div className="font-mono text-xs text-slate-200 break-all">{wallet.address}</div>
      </div>
      <button
        onClick={handleCopy}
        aria-label={copied ? 'Copied!' : `Copy ${wallet.chain} address`}
        title={copied ? 'Copied!' : `Copy ${wallet.chain} address`}
        className={[
          'shrink-0 p-1.5 rounded-md transition-all',
          copied
            ? 'bg-green-500/20 text-green-400'
            : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'
        ].join(' ')}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default DonationSection;
