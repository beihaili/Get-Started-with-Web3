import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SupportPage from '../SupportPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';

async function prepareSupportTranslations() {
  await i18n.changeLanguage('en');
  await loadI18nSections(i18n, ['support', 'donation'], 'en');
}

function renderSupportPage(initialEntry = '/en/support') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/support"
          element={
            <LanguageProvider>
              <SupportPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('SupportPage disclosures', () => {
  beforeEach(async () => {
    await prepareSupportTranslations();
  });

  it('shows trust, donation, crypto, affiliate, and sponsor disclosures', () => {
    renderSupportPage();

    expect(screen.getByText('Trust and disclosure')).toBeInTheDocument();
    expect(screen.getByText(/do not influence lesson conclusions/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Donation platforms are optional support channels/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Crypto tips are irreversible/i)).toBeInTheDocument();
    expect(screen.getByText(/Affiliate links may generate commission/i)).toBeInTheDocument();
    expect(screen.getByText(/Paid sponsor placements are disclosed/i)).toBeInTheDocument();
  });

  it('marks affiliate links as sponsored', () => {
    renderSupportPage();

    expect(screen.getByRole('link', { name: /Binance/i })).toHaveAttribute(
      'rel',
      expect.stringContaining('sponsored')
    );
  });
});
