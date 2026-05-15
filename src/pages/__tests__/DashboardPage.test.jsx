import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DashboardPage from '../DashboardPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import { useUserStore } from '../../store/useUserStore';
import { buildProgressExport } from '../../utils/progressExport';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';

async function prepareDashboardTranslations() {
  await i18n.changeLanguage('en');
  await loadI18nSections(i18n, ['dashboard'], 'en');
}

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

function createProgressFile(payload, name = 'web3-progress.json') {
  return new File([JSON.stringify(payload)], name, {
    type: 'application/json',
  });
}

function uploadImportFile(file) {
  fireEvent.change(screen.getByLabelText('Import progress file'), {
    target: { files: [file] },
  });
}

describe('DashboardPage progress export', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    await prepareDashboardTranslations();

    localStorage.clear();
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

describe('DashboardPage progress import', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(async () => {
    await prepareDashboardTranslations();

    useUserStore.setState({
      progress: {},
      earnedBadges: {},
      totalExperience: 0,
      userTitle: '新手探索者',
      studyStreak: 0,
      lastStudyDate: null,
      quizScores: {},
      firstActivityTimestamp: null,
    });
  });

  it('shows a friendly error for invalid JSON files', async () => {
    const invalidFile = new File(['{not json'], 'broken.json', { type: 'application/json' });

    renderDashboard();
    uploadImportFile(invalidFile);

    expect(
      await screen.findByText('Could not read this progress file. Choose a valid JSON export.')
    ).toBeInTheDocument();
    expect(useUserStore.getState().progress).toEqual({});
  });

  it('rejects unsupported export versions with an inline error', async () => {
    renderDashboard();
    uploadImportFile(createProgressFile({ version: 999, data: {} }));

    expect(
      await screen.findByText('This progress file uses an unsupported version.')
    ).toBeInTheDocument();
    expect(useUserStore.getState().progress).toEqual({});
  });

  it('imports an exported progress snapshot when local progress is empty', async () => {
    const exportedState = {
      progress: { 'module-1-1-1': true },
      earnedBadges: { starter: { moduleId: 'module-1', timestamp: 1778812000000 } },
      totalExperience: 1200,
      userTitle: 'Web3 学徒',
      studyStreak: 4,
      lastStudyDate: 'Fri May 15 2026',
      quizScores: { '1-1': { score: 3, total: 3, isPerfect: true } },
      firstActivityTimestamp: 1778810000000,
    };
    const file = createProgressFile(buildProgressExport(exportedState));

    renderDashboard();
    uploadImportFile(file);

    expect(await screen.findByText('Progress imported.')).toBeInTheDocument();
    expect(useUserStore.getState()).toMatchObject(exportedState);
  });

  it('prompts for merge when local progress exists and applies the merge choice', async () => {
    useUserStore.setState({
      progress: { 'module-1-1-1': true },
      earnedBadges: {},
      totalExperience: 500,
      userTitle: 'Web3 学徒',
      studyStreak: 2,
      lastStudyDate: 'Thu May 14 2026',
      quizScores: {},
      firstActivityTimestamp: 1778800000000,
    });
    const incoming = {
      progress: { 'module-2-2-1': true },
      earnedBadges: { bitcoin: { moduleId: 'module-2', timestamp: 1778812000000 } },
      totalExperience: 900,
      userTitle: 'Web3 进阶者',
      studyStreak: 1,
      lastStudyDate: 'Fri May 15 2026',
      quizScores: { '2-1': { score: 3, total: 3, isPerfect: true } },
      firstActivityTimestamp: 1778790000000,
    };

    renderDashboard();
    uploadImportFile(createProgressFile(buildProgressExport(incoming)));

    expect(await screen.findByRole('dialog', { name: 'Import progress' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Merge' }));

    expect(await screen.findByText('Progress merged.')).toBeInTheDocument();
    expect(useUserStore.getState()).toMatchObject({
      progress: { 'module-1-1-1': true, 'module-2-2-1': true },
      earnedBadges: { bitcoin: { moduleId: 'module-2', timestamp: 1778812000000 } },
      totalExperience: 900,
      userTitle: 'Web3 进阶者',
      studyStreak: 2,
      lastStudyDate: 'Fri May 15 2026',
      quizScores: { '2-1': { score: 3, total: 3, isPerfect: true } },
      firstActivityTimestamp: 1778790000000,
    });
  });
});
