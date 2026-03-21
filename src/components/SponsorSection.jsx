import { useTranslation } from 'react-i18next';
import { Heart } from 'lucide-react';
import { SPONSORS } from '../config/sponsorData';

/**
 * 赞助商展示区块（首页）
 * 按等级（金/银/铜）分层显示赞助商 Logo；
 * 若暂无赞助商则展示 "成为赞助商" CTA。
 */
const SponsorSection = () => {
  const { t } = useTranslation();

  const hasAny =
    SPONSORS.gold.length > 0 || SPONSORS.silver.length > 0 || SPONSORS.bronze.length > 0;

  return (
    <div className="max-w-3xl mx-auto mb-16">
      <h2 className="text-2xl font-bold text-white text-center mb-2">{t('sponsor.title')}</h2>

      {hasAny ? (
        <div className="space-y-8 mt-8">
          {/* Gold tier */}
          {SPONSORS.gold.length > 0 && (
            <TierRow sponsors={SPONSORS.gold} size="large" ring="ring-yellow-400/40" label="Gold" />
          )}

          {/* Silver tier */}
          {SPONSORS.silver.length > 0 && (
            <TierRow
              sponsors={SPONSORS.silver}
              size="medium"
              ring="ring-slate-400/40"
              label="Silver"
            />
          )}

          {/* Bronze tier */}
          {SPONSORS.bronze.length > 0 && (
            <TierRow
              sponsors={SPONSORS.bronze}
              size="small"
              ring="ring-orange-700/40"
              label="Bronze"
            />
          )}
        </div>
      ) : (
        /* No sponsors yet — show CTA */
        <div className="mt-6 flex flex-col items-center gap-4 p-8 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl text-center">
          <p className="text-slate-400 text-sm">{t('sponsor.noSponsors')}</p>
          <a
            href="https://github.com/sponsors/beihaili"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500
              hover:from-pink-500 hover:to-orange-400 text-white font-bold rounded-full
              transition-all hover:scale-105 shadow-lg shadow-pink-500/20"
          >
            <Heart className="w-4 h-4" />
            {t('sponsor.becomeSponsor')}
          </a>
        </div>
      )}
    </div>
  );
};

/**
 * 单个等级的赞助商列表行
 * @param {object[]} sponsors - 赞助商数组，每项含 name、url、logo（可选）
 * @param {'large'|'medium'|'small'} size - 显示尺寸
 * @param {string} ring - Tailwind ring 颜色类
 * @param {string} label - 等级标签（仅用于辅助文字）
 */
const TierRow = ({ sponsors, size, ring, label }) => {
  const sizeClasses = {
    large: 'h-14 px-6 text-base font-bold',
    medium: 'h-10 px-5 text-sm font-semibold',
    small: 'h-8 px-4 text-xs font-medium',
  };

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {sponsors.map((sponsor) => (
        <a
          key={sponsor.name}
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} sponsor: ${sponsor.name}`}
          className={`flex items-center justify-center rounded-xl
            bg-slate-800 border border-slate-700 ring-1 ${ring}
            hover:border-cyan-500/40 transition-all hover:scale-105
            ${sizeClasses[size]}`}
        >
          {sponsor.logo ? (
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="h-full object-contain max-w-[160px]"
            />
          ) : (
            <span className="text-slate-200">{sponsor.name}</span>
          )}
        </a>
      ))}
    </div>
  );
};

export default SponsorSection;
