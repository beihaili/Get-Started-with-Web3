import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchDialog from '../SearchDialog';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';
import { useSearchStore } from '../../store/useSearchStore';

async function prepareSearchTranslations() {
  await i18n.changeLanguage('en');
  await loadI18nSections(i18n, ['search'], 'en');
}

function renderSearchDialog() {
  render(
    <MemoryRouter initialEntries={['/en']}>
      <Routes>
        <Route
          path="/:lang"
          element={
            <LanguageProvider>
              <SearchDialog />
            </LanguageProvider>
          }
        />
        <Route path="/:lang/learn/:moduleId/:lessonId" element={<div>lesson route</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SearchDialog analytics', () => {
  beforeEach(async () => {
    vi.unstubAllGlobals();
    localStorage.clear();
    document.title = 'Search analytics test';
    useSearchStore.setState({
      isSearchOpen: true,
      searchQuery: '',
      searchResults: [],
      searchHistory: [],
      selectedResultIndex: 0,
    });
    await prepareSearchTranslations();
  });

  it('tracks search result selection without sending the raw query text', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);

    renderSearchDialog();

    const input = await screen.findByRole('textbox', { name: 'Search courses' });
    fireEvent.change(input, { target: { value: '交易' } });
    fireEvent.click(await screen.findByRole('option', { name: '体验第一笔交易' }));

    await waitFor(() =>
      expect(gtag).toHaveBeenCalledWith(
        'event',
        'search_result_select',
        expect.objectContaining({
          event_category: 'content_discovery',
          language: 'en',
          query_length: 2,
          module_id: 'module-1',
          lesson_id: '1-2',
          result_rank: 1,
        })
      )
    );

    const eventPayload = gtag.mock.calls.find((call) => call[1] === 'search_result_select')?.[2];
    expect(eventPayload).not.toHaveProperty('search_term');
    expect(eventPayload).not.toHaveProperty('query');
  });
});
