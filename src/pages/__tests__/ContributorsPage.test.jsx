import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ContributorsPage from '../ContributorsPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';

async function prepareContributorsTranslations() {
  await i18n.changeLanguage('en');
  await loadI18nSections(i18n, ['contributors', 'support'], 'en');
}

function renderContributorsPage(initialEntry = '/en/contributors') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/contributors"
          element={
            <LanguageProvider>
              <ContributorsPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ContributorsPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  beforeEach(async () => {
    sessionStorage.clear();
    await prepareContributorsTranslations();

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        json: async () => [
          {
            id: 1,
            login: 'alice',
            avatar_url: 'https://example.com/alice.png',
            html_url: 'https://github.com/alice',
            contributions: 3,
          },
        ],
      }))
    );
  });

  it('shows the contributor spotlight CTA and contributor grid', async () => {
    renderContributorsPage();

    expect(screen.getByText('Monthly contributor spotlight')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pick a starter issue' })).toHaveAttribute(
      'href',
      expect.stringContaining('label%3A%22good%20first%20issue%22')
    );
    expect(screen.getByRole('link', { name: 'Read the ladder' })).toHaveAttribute(
      'href',
      expect.stringContaining('docs/community/contributor-ladder.md')
    );

    expect(await screen.findByText('alice')).toBeInTheDocument();
    expect(screen.getByText('3 contributions')).toBeInTheDocument();
  });
});
