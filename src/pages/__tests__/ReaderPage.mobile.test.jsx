import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ReaderPage from '../ReaderPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';
import { useContentStore } from '../../store/useContentStore';
import { useUserStore } from '../../store/useUserStore';

const originalContentState = useContentStore.getState();

async function prepareReaderTranslations() {
  await i18n.changeLanguage('en');
  await loadI18nSections(
    i18n,
    ['reader', 'markdown', 'quiz', 'ai', 'thankAuthor', 'share', 'sponsor'],
    'en'
  );
}

function renderReader(initialEntry = '/en/learn/module-1/1-2') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/learn/:moduleId/:lessonId"
          element={
            <LanguageProvider>
              <ReaderPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ReaderPage mobile lesson drawer', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    useContentStore.setState(originalContentState);
  });

  beforeEach(async () => {
    await prepareReaderTranslations();
    localStorage.clear();
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
    useContentStore.setState({
      basePath: '/Get-Started-with-Web3/',
      fetchLessonContent: vi.fn().mockResolvedValue('# Mock lesson\n\nLesson body'),
    });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('opens a focusable mobile lesson drawer and closes it with Escape', async () => {
    renderReader();

    expect(await screen.findByRole('heading', { name: '体验第一笔交易' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open lesson list' }));

    const drawer = screen.getByRole('dialog', { name: 'Lessons in Web3 快速入门' });
    expect(within(drawer).getByRole('link', { name: /创建第一个 Web3 身份/ })).toBeInTheDocument();
    expect(within(drawer).getByRole('link', { name: /体验第一笔交易/ })).toHaveAttribute(
      'aria-current',
      'page'
    );

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Close lesson list' })).toHaveFocus()
    );

    const closeButton = screen.getByRole('button', { name: 'Close lesson list' });
    const drawerLinks = within(drawer).getAllByRole('link');
    const lastDrawerLink = drawerLinks[drawerLinks.length - 1];

    fireEvent.keyDown(drawer, { key: 'Tab', shiftKey: true });
    expect(lastDrawerLink).toHaveFocus();

    fireEvent.keyDown(drawer, { key: 'Tab' });
    expect(closeButton).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(
      screen.queryByRole('dialog', { name: 'Lessons in Web3 快速入门' })
    ).not.toBeInTheDocument();
  });

  it('uses horizontal swipes to move between lessons without changing the Prev/Next links', async () => {
    renderReader();

    expect(await screen.findByRole('heading', { name: '体验第一笔交易' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Previous Lesson/ })).toHaveAttribute(
      'href',
      '/en/learn/module-1/1-1'
    );
    expect(screen.getByRole('link', { name: /Next Lesson/ })).toHaveAttribute(
      'href',
      '/en/learn/module-1/1-3'
    );

    const reader = screen.getByRole('main');
    fireEvent.touchStart(reader, { touches: [{ clientX: 220, clientY: 120 }] });
    fireEvent.touchMove(reader, { touches: [{ clientX: 80, clientY: 125 }] });
    fireEvent.touchEnd(reader);

    expect(await screen.findByRole('heading', { name: '体验第一个 DApp' })).toBeInTheDocument();

    fireEvent.touchStart(reader, { touches: [{ clientX: 80, clientY: 125 }] });
    fireEvent.touchMove(reader, { touches: [{ clientX: 220, clientY: 120 }] });
    fireEvent.touchEnd(reader);

    expect(await screen.findByRole('heading', { name: '体验第一笔交易' })).toBeInTheDocument();
  });

  it('tracks lesson completion intent with lesson and module ids', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    renderReader();

    expect(await screen.findByRole('heading', { name: '体验第一笔交易' })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Mark as Complete' })[0]);

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'lesson_complete',
      expect.objectContaining({
        event_category: 'learning',
        language: 'en',
        module_id: 'module-1',
        lesson_id: '1-2',
        completion_source: 'manual',
      })
    );
  });
});
