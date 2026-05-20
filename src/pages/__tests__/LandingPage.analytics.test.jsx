import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import LandingPage from '../LandingPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';
import { useUserStore } from '../../store/useUserStore';

vi.mock('../../components/animations', () => ({
  MouseSpotlight: () => null,
  ParticleBackground: () => null,
}));

vi.mock('../../components/interactive', () => ({
  HashVisualizer: () => <div data-testid="hash-visualizer" />,
  WalletSimulator: () => <div data-testid="wallet-simulator" />,
}));

vi.mock('../../components/DonationSection', () => ({
  default: () => <section data-testid="donation-section" />,
}));

vi.mock('../../components/SponsorSection', () => ({
  default: () => <section data-testid="sponsor-section" />,
}));

async function prepareLandingTranslations() {
  await i18n.changeLanguage('en');
  await loadI18nSections(i18n, ['landing', 'support', 'donation', 'sponsor'], 'en');
}

function renderLandingPage() {
  render(
    <MemoryRouter initialEntries={['/en']}>
      <Routes>
        <Route
          path="/:lang"
          element={
            <LanguageProvider>
              <LandingPage />
            </LanguageProvider>
          }
        />
        <Route path="/:lang/dashboard" element={<div>dashboard route</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('LandingPage analytics', () => {
  beforeEach(async () => {
    vi.unstubAllGlobals();
    useUserStore.setState({
      progress: {},
      earnedBadges: {},
      totalExperience: 0,
      userTitle: 'New Explorer',
      studyStreak: 0,
      lastStudyDate: null,
      quizScores: {},
      firstActivityTimestamp: null,
    });
    await prepareLandingTranslations();
  });

  it('tracks the hero start-learning CTA', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    renderLandingPage();

    fireEvent.click(screen.getByRole('link', { name: 'Start Learning' }));

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'cta_click',
      expect.objectContaining({
        event_category: 'growth',
        cta_id: 'start_learning',
        placement: 'landing_hero',
        language: 'en',
      })
    );
  });

  it('tracks GitHub repository CTA clicks', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    renderLandingPage();

    fireEvent.click(screen.getAllByRole('link', { name: /GitHub/i })[0]);

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'cta_click',
      expect.objectContaining({
        event_category: 'growth',
        cta_id: 'github_repo',
        placement: 'landing_hero',
        destination_hostname: 'github.com',
      })
    );
  });

  it('tracks AI-native entrypoint clicks', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    renderLandingPage();

    fireEvent.click(screen.getByRole('link', { name: /llms.txt/i }));

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'ai_entrypoint_click',
      expect.objectContaining({
        event_category: 'ai_native',
        entrypoint: 'llms.txt',
        placement: 'landing_ai_agent_entry',
      })
    );
  });
});
