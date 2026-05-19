import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buildAnalyticsPagePayload, trackPageView } from '../analytics';

describe('analytics utilities', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    document.title = 'Get Started with Web3';
  });

  it('builds GA page_view payloads with the deployed base path and canonical location', () => {
    expect(
      buildAnalyticsPagePayload(
        { pathname: '/en/dashboard', search: '?utm_source=x', hash: '#progress' },
        {
          basePath: '/Get-Started-with-Web3/',
          siteBaseUrl: 'https://beihaili.github.io/Get-Started-with-Web3',
        }
      )
    ).toMatchObject({
      page_path: '/Get-Started-with-Web3/en/dashboard?utm_source=x#progress',
      page_location:
        'https://beihaili.github.io/Get-Started-with-Web3/en/dashboard?utm_source=x#progress',
      page_title: 'Get Started with Web3',
    });
  });

  it('sends a page_view event when gtag is available', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);

    const sent = trackPageView(
      { pathname: '/zh/learn/module-1/1-1', search: '', hash: '' },
      {
        basePath: '/Get-Started-with-Web3/',
        siteBaseUrl: 'https://beihaili.github.io/Get-Started-with-Web3',
      }
    );

    expect(sent).toBe(true);
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/Get-Started-with-Web3/zh/learn/module-1/1-1',
        page_location: 'https://beihaili.github.io/Get-Started-with-Web3/zh/learn/module-1/1-1',
      })
    );
  });

  it('does not throw when analytics scripts are blocked or unavailable', () => {
    vi.stubGlobal('gtag', undefined);

    expect(trackPageView({ pathname: '/en', search: '', hash: '' })).toBe(false);
  });
});
