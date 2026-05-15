import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import { useUserStore } from '../../store/useUserStore';
import '../../i18n';

function renderDashboard(initialEntry = '/en/dashboard') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/dashboard"
          element={
            <LanguageProvider>
              <DashboardPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('DashboardPage progress export', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    useUserStore.setState({
      progress: { 'module-1-1-1': true, 'module-2-2-1': true },
      earnedBadges: {
        starter: { moduleId: 'module-1', timestamp: 1778812000000 },
      },
      totalExperience: 1200,
      userTitle: 'Web3 学徒',
      studyStreak: 4,
      lastStudyDate: 'Fri May 15 2026',
      quizScores: {
        '1-1': { score: 3, total: 3, isPerfect: true },
      },
      firstActivityTimestamp: 1778810000000,
    });
  });

  it('downloads a parseable JSON progress snapshot with today in the filename', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T09:30:00.000Z'));

    const createdUrls = [];
    vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      createdUrls.push(blob);
      return 'blob:progress-export';
    });
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});

    const clickedLinks = [];
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const element = originalCreateElement(tagName, options);
      if (tagName.toLowerCase() === 'a') {
        vi.spyOn(element, 'click').mockImplementation(() => {
          clickedLinks.push({
            download: element.download,
            href: element.href,
          });
        });
      }
      return element;
    });

    renderDashboard();
    fireEvent.click(screen.getByRole('button', { name: /export progress/i }));

    expect(clickedLinks).toEqual([
      {
        download: 'web3-progress-2026-05-15.json',
        href: 'blob:progress-export',
      },
    ]);

    const exportedText = await createdUrls[0].text();
    const exportedJson = JSON.parse(exportedText);

    expect(exportedJson).toMatchObject({
      version: 1,
      exportedAt: '2026-05-15T09:30:00.000Z',
      data: {
        progress: { 'module-1-1-1': true, 'module-2-2-1': true },
        earnedBadges: {
          starter: { moduleId: 'module-1', timestamp: 1778812000000 },
        },
        totalExperience: 1200,
        userTitle: 'Web3 学徒',
        studyStreak: 4,
        lastStudyDate: 'Fri May 15 2026',
        quizScores: {
          '1-1': { score: 3, total: 3, isPerfect: true },
        },
        firstActivityTimestamp: 1778810000000,
      },
    });

    expect(screen.getByText('Progress export started.')).toBeInTheDocument();
  });
});
