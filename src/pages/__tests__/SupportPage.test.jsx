import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
    vi.unstubAllGlobals();
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
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

  it('tracks support page donation clicks', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    renderSupportPage();

    fireEvent.click(screen.getByRole('link', { name: /Buy Me a Coffee/i }));

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'support_link_click',
      expect.objectContaining({
        event_category: 'monetization',
        support_type: 'donation',
        link_name: 'Buy Me a Coffee',
        placement: 'support_page',
      })
    );
  });

  it('tracks support page wallet copy intent without sending wallet addresses', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    renderSupportPage();

    fireEvent.click(screen.getByRole('button', { name: /Ethereum \/ Base \/ Polygon/ }));

    await waitFor(() =>
      expect(gtag).toHaveBeenCalledWith(
        'event',
        'wallet_address_copy',
        expect.objectContaining({
          event_category: 'monetization',
          wallet_chain: 'ETH',
          wallet_network: 'Ethereum / Base / Polygon',
          placement: 'support_page',
        })
      )
    );

    const walletPayload = gtag.mock.calls.find((call) => call[1] === 'wallet_address_copy')?.[2];
    expect(walletPayload).not.toHaveProperty('wallet_address');
    expect(walletPayload).not.toHaveProperty('address');
  });
});
