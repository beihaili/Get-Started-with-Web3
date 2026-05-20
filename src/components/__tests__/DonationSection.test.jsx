import { beforeEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DonationSection from '../DonationSection';
import { DONATION_LINKS, CRYPTO_WALLETS, AFFILIATE_LINKS } from '../../config/sponsorData';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('DonationSection', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      configurable: true,
    });
  });

  it('renders donation links with their URLs', () => {
    render(<DonationSection />);

    expect(screen.getByText('donation.disclosure')).toBeInTheDocument();

    for (const link of DONATION_LINKS) {
      expect(screen.getByRole('link', { name: new RegExp(link.name, 'i') })).toHaveAttribute(
        'href',
        link.url
      );
      expect(screen.getByText(link.url)).toBeInTheDocument();
    }
  });

  it('renders affiliate links when configured', () => {
    render(<DonationSection />);

    for (const link of AFFILIATE_LINKS) {
      expect(screen.getByRole('link', { name: new RegExp(link.name, 'i') })).toHaveAttribute(
        'href',
        link.url
      );
      expect(screen.getByRole('link', { name: new RegExp(link.name, 'i') })).toHaveAttribute(
        'rel',
        expect.stringContaining('sponsored')
      );
      expect(screen.getByText(link.descriptionZh)).toBeInTheDocument();
    }
  });

  it('renders complete wallet addresses', () => {
    render(<DonationSection />);

    for (const wallet of CRYPTO_WALLETS) {
      expect(screen.getByText(wallet.chain)).toBeInTheDocument();
      expect(screen.getByText(wallet.network)).toBeInTheDocument();
      expect(screen.getByText(wallet.address)).toBeInTheDocument();
    }
  });

  it('tracks donation link clicks without blocking navigation', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    render(<DonationSection />);

    fireEvent.click(screen.getByRole('link', { name: /Buy Me a Coffee/i }));

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'support_link_click',
      expect.objectContaining({
        event_category: 'monetization',
        support_type: 'donation',
        link_name: 'Buy Me a Coffee',
        placement: 'landing_donation_section',
      })
    );
  });

  it('tracks wallet copy intent without sending the wallet address', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    render(<DonationSection />);

    fireEvent.click(screen.getByRole('button', { name: /Ethereum/ }));

    await waitFor(() =>
      expect(gtag).toHaveBeenCalledWith(
        'event',
        'wallet_address_copy',
        expect.objectContaining({
          event_category: 'monetization',
          wallet_chain: 'ETH',
          wallet_network: 'Ethereum / Base / Polygon',
          placement: 'landing_donation_section',
        })
      )
    );

    const walletPayload = gtag.mock.calls.find((call) => call[1] === 'wallet_address_copy')?.[2];
    expect(walletPayload).not.toHaveProperty('wallet_address');
    expect(walletPayload).not.toHaveProperty('address');
  });
});
