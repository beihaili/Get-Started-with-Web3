import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WalletLabPage from '../WalletLabPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';

async function prepareWalletLabTranslations(language = 'en') {
  await i18n.changeLanguage(language);
  await loadI18nSections(i18n, ['walletLab'], language);
}

function renderWalletLabPage(initialEntry = '/en/labs/wallet') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/labs/wallet"
          element={
            <LanguageProvider>
              <WalletLabPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('WalletLabPage', () => {
  beforeEach(async () => {
    await prepareWalletLabTranslations('en');
  });

  it('renders the static wallet lab scaffold without requiring wallet dependencies', () => {
    renderWalletLabPage();

    expect(
      screen.getByRole('heading', { name: 'Wallet Interoperability Lab' })
    ).toBeInTheDocument();
    expect(screen.getByText(/Wallet dependencies are not installed yet/i)).toBeInTheDocument();
    expect(screen.getByText('Connect and disconnect wallet')).toBeInTheDocument();
    expect(
      screen.getByText('Sign one educational message and inspect the result locally')
    ).toBeInTheDocument();
  });

  it('shows the analytics privacy boundary', () => {
    renderWalletLabPage();

    expect(screen.getByText('Privacy boundary')).toBeInTheDocument();
    expect(screen.getByText(/must never send raw wallet addresses/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction payloads to analytics/i)).toBeInTheDocument();
  });
});
