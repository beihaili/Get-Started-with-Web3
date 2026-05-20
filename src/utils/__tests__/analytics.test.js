import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildAnalyticsEventPayload,
  buildAnalyticsPagePayload,
  trackAnalyticsEvent,
  trackPageView,
} from '../analytics';

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

  it('builds custom engagement event payloads with page context and safe metadata', () => {
    expect(
      buildAnalyticsEventPayload(
        {
          event_category: 'engagement',
          cta_id: 'github_star',
          destination_url: 'https://github.com/beihaili/Get-Started-with-Web3',
          query: undefined,
          nested: { unsafe: true },
          search_results_count: 8,
        },
        {
          location: { pathname: '/en', search: '?utm_source=release', hash: '' },
          basePath: '/Get-Started-with-Web3/',
          siteBaseUrl: 'https://beihaili.github.io/Get-Started-with-Web3',
        }
      )
    ).toMatchObject({
      event_category: 'engagement',
      cta_id: 'github_star',
      destination_url: 'https://github.com/beihaili/Get-Started-with-Web3',
      search_results_count: 8,
      page_path: '/Get-Started-with-Web3/en?utm_source=release',
      page_location: 'https://beihaili.github.io/Get-Started-with-Web3/en?utm_source=release',
    });
  });

  it('drops non-primitive custom analytics metadata instead of serializing it', () => {
    const payload = buildAnalyticsEventPayload({
      event_category: 'engagement',
      nested: { unsafe: true },
      list: ['unsafe'],
    });

    expect(payload).not.toHaveProperty('nested');
    expect(payload).not.toHaveProperty('list');
  });

  it('sends custom analytics events when gtag is available', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);

    const sent = trackAnalyticsEvent(
      'cta_click',
      {
        event_category: 'conversion',
        cta_id: 'support_page',
      },
      {
        location: { pathname: '/en/support', search: '', hash: '' },
      }
    );

    expect(sent).toBe(true);
    expect(gtag).toHaveBeenCalledWith(
      'event',
      'cta_click',
      expect.objectContaining({
        event_category: 'conversion',
        cta_id: 'support_page',
        page_path: '/Get-Started-with-Web3/en/support',
      })
    );
  });
});
