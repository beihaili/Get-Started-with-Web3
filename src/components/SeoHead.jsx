import { useEffect } from 'react';

/**
 * Manages document <head> meta tags and JSON-LD structured data.
 * Props: title, description, url, type ('article'|'webpage'), ogImage, lang, alternateUrl, moduleTitle
 */
export default function SeoHead({
  title,
  description,
  url,
  type = 'article',
  ogImage,
  lang,
  alternateUrl,
  moduleTitle,
}) {
  useEffect(() => {
    document.title = title;

    const setMeta = (name, content) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(name.startsWith('og:') ? 'property' : 'name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title);
    setMeta('og:description', description);
    setMeta('og:url', url);
    if (ogImage) setMeta('og:image', ogImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Hreflang
    if (alternateUrl && lang) {
      const altLang = lang === 'en' ? 'zh' : 'en';
      let hreflang = document.querySelector(`link[hreflang="${altLang}"]`);
      if (!hreflang) {
        hreflang = document.createElement('link');
        hreflang.setAttribute('rel', 'alternate');
        hreflang.setAttribute('hreflang', altLang);
        document.head.appendChild(hreflang);
      }
      hreflang.setAttribute('href', alternateUrl);
    }

    // JSON-LD
    let jsonLd = document.querySelector('script[data-seo-head]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      jsonLd.setAttribute('data-seo-head', 'true');
      document.head.appendChild(jsonLd);
    }

    const data =
      type === 'article'
        ? {
            '@context': 'https://schema.org',
            '@type': 'Article',
            name: title,
            description,
            url,
            ...(moduleTitle && { isPartOf: { '@type': 'Course', name: moduleTitle } }),
          }
        : { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url };

    jsonLd.textContent = JSON.stringify(data);
  }, [title, description, url, type, ogImage, lang, alternateUrl, moduleTitle]);

  return null;
}
