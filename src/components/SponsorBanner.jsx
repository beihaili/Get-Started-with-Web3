import { useTranslation } from 'react-i18next';
import { SPONSORS } from '../config/sponsorData';

/**
 * 赞助商横幅（课程页，仅金牌赞助商）
 * 仅当 SPONSORS.gold 非空时渲染；否则返回 null。
 * 放置在课程正文 MarkdownRenderer 上方，保持低调。
 */
const SponsorBanner = () => {
  const { t } = useTranslation();
  const goldSponsors = SPONSORS.gold;

  // 无金牌赞助商时不渲染任何内容
  if (!goldSponsors || goldSponsors.length === 0) return null;

  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-3 px-4 py-2
        bg-slate-800/60 border border-slate-700/40 rounded-lg text-xs text-slate-400"
      aria-label="Sponsors"
    >
      <span className="shrink-0">{t('sponsor.poweredBy')}</span>
      {goldSponsors.map((sponsor) => (
        <a
          key={sponsor.name}
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-200 hover:text-cyan-400 transition-colors font-medium"
        >
          {sponsor.logo && (
            <img src={sponsor.logo} alt={sponsor.name} className="h-4 object-contain" />
          )}
          {sponsor.name}
        </a>
      ))}
    </div>
  );
};

export default SponsorBanner;
