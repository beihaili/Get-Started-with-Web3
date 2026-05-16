import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

const loadSponsorComponents = async (sponsors) => {
  vi.resetModules();
  vi.doMock('../../config/sponsorData', () => ({
    SPONSORS: sponsors,
  }));

  const { default: SponsorSection } = await import('../SponsorSection');
  const { default: SponsorBanner } = await import('../SponsorBanner');
  return { SponsorSection, SponsorBanner };
};

describe('Sponsor components', () => {
  afterEach(() => {
    cleanup();
    vi.doUnmock('../../config/sponsorData');
  });

  it('renders SponsorSection empty state', async () => {
    const { SponsorSection } = await loadSponsorComponents({
      gold: [],
      silver: [],
      bronze: [],
    });

    render(<SponsorSection />);

    expect(screen.getByText('sponsor.title')).toBeInTheDocument();
    expect(screen.getByText('sponsor.noSponsors')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /sponsor.becomeSponsor/i })).toHaveAttribute(
      'href',
      'https://github.com/sponsors/beihaili'
    );
  });

  it('renders sponsor names and logos by tier', async () => {
    const { SponsorSection } = await loadSponsorComponents({
      gold: [{ name: 'Gold Labs', url: 'https://gold.example', logo: '/gold.svg' }],
      silver: [{ name: 'Silver DAO', url: 'https://silver.example' }],
      bronze: [{ name: 'Bronze Guild', url: 'https://bronze.example' }],
    });

    render(<SponsorSection />);

    expect(screen.getByAltText('Gold Labs')).toHaveAttribute('src', '/gold.svg');
    expect(screen.getByRole('link', { name: 'Silver sponsor: Silver DAO' })).toHaveAttribute(
      'href',
      'https://silver.example'
    );
    expect(screen.getByRole('link', { name: 'Bronze sponsor: Bronze Guild' })).toHaveAttribute(
      'href',
      'https://bronze.example'
    );
  });

  it('does not render SponsorBanner without gold sponsors', async () => {
    const { SponsorBanner } = await loadSponsorComponents({
      gold: [],
      silver: [{ name: 'Silver DAO', url: 'https://silver.example' }],
      bronze: [],
    });

    const { container } = render(<SponsorBanner />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders SponsorBanner gold sponsor links', async () => {
    const { SponsorBanner } = await loadSponsorComponents({
      gold: [{ name: 'Gold Labs', url: 'https://gold.example', logo: '/gold.svg' }],
      silver: [],
      bronze: [],
    });

    render(<SponsorBanner />);

    expect(screen.getByLabelText('Sponsors')).toBeInTheDocument();
    expect(screen.getByText('sponsor.poweredBy')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Gold Labs/i })).toHaveAttribute(
      'href',
      'https://gold.example'
    );
    expect(screen.getByAltText('Gold Labs')).toHaveAttribute('src', '/gold.svg');
  });
});
