import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DonationSection from '../DonationSection';
import { DONATION_LINKS, CRYPTO_WALLETS, AFFILIATE_LINKS } from '../../config/sponsorData';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('DonationSection', () => {
  it('renders donation links with their URLs', () => {
    render(<DonationSection />);

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
});
