import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DonationSection from '../DonationSection';
import { DONATION_LINKS, CRYPTO_WALLETS } from '../../config/sponsorData';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe('DonationSection', () => {
  it('should render without crashing', () => {
    const { container } = render(<DonationSection />);
    expect(container).toBeTruthy();
  });

  it('should render all donation links with correct URLs', () => {
    render(<DonationSection />);
    DONATION_LINKS.forEach((link) => {
      const anchor = screen.getByText(link.name).closest('a');
      expect(anchor).toBeInTheDocument();
      expect(anchor).toHaveAttribute('href', link.url);
      expect(anchor).toHaveAttribute('target', '_blank');
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('should render all crypto wallet addresses fully (not truncated)', () => {
    render(<DonationSection />);
    CRYPTO_WALLETS.forEach((wallet) => {
      const addressEl = screen.getByText(wallet.address);
      expect(addressEl).toBeInTheDocument();
      // Verify full address is shown (not truncated) 鈥?check it's the exact string with no ellipsis
      expect(addressEl.textContent).toBe(wallet.address);
      expect(addressEl.textContent.length).toBeGreaterThan(30);
    });
  });

  it('should render wallet chain labels', () => {
    render(<DonationSection />);
    CRYPTO_WALLETS.forEach((wallet) => {
      expect(screen.getByText(wallet.chain)).toBeInTheDocument();
    });
  });

  it('should render wallet network labels', () => {
    render(<DonationSection />);
    CRYPTO_WALLETS.forEach((wallet) => {
      expect(screen.getByText(wallet.network)).toBeInTheDocument();
    });
  });

  it('should have at least 2 donation link anchors', () => {
    render(<DonationSection />);
    const anchors = screen.getAllByRole('link');
    // At least the 2 donation links should be present
    expect(anchors.length).toBeGreaterThanOrEqual(2);
  });
});
