import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SponsorSection from '../SponsorSection';
import SponsorBanner from '../SponsorBanner';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock sponsorData with empty tiers by default
vi.mock('../../config/sponsorData', () => ({
  SPONSORS: { gold: [], silver: [], bronze: [] },
}));

describe('SponsorSection', () => {
  it('should render without crashing', () => {
    const { container } = render(<SponsorSection />);
    expect(container).toBeTruthy();
  });

  it('should render the section title', () => {
    render(<SponsorSection />);
    expect(screen.getByText('sponsor.title')).toBeInTheDocument();
  });

  it('should show Become Sponsor CTA when no sponsors exist', () => {
    render(<SponsorSection />);
    const cta = screen.getByText('sponsor.becomeSponsor');
    expect(cta).toBeInTheDocument();
    expect(cta.closest('a')).toHaveAttribute('href', 'https://github.com/sponsors/beihaili');
  });

  it('should have correct link attributes on CTA', () => {
    render(<SponsorSection />);
    const link = screen.getByText('sponsor.becomeSponsor').closest('a');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render gold tier with aria-label when gold sponsors exist', () => {
    vi.doMock('../../config/sponsorData', () => ({
      SPONSORS: { gold: [{ name: 'TestGold', url: 'https://test.com', logo: null }], silver: [], bronze: [] },
    }));
    const { rerender } = render(<SponsorSection />);
    rerender(<SponsorSection />);
    // Just check it renders without error
    expect(screen.getByText('TestGold')).toBeInTheDocument();
  });
});

describe('SponsorBanner', () => {
  it('should render without crashing', () => {
    const { container } = render(<SponsorBanner />);
    expect(container).toBeTruthy();
  });

  it('should return null when no gold sponsors exist', () => {
    const { container } = render(<SponsorBanner />);
    expect(container.firstChild).toBeNull();
  });
});
