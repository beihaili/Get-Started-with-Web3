import { describe, it, expect, afterEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import MultiQuiz from '../MultiQuiz';
import i18n from '../../../i18n';
import { loadI18nSections } from '../../../i18n/namespaceLoaders';

describe('MultiQuiz localization', () => {
  afterEach(async () => {
    await i18n.changeLanguage('zh');
  });

  it('renders English question copy when the current language is English', async () => {
    await i18n.changeLanguage('en');
    await loadI18nSections(i18n, ['quiz'], 'en');

    render(<MultiQuiz lessonId="8-2" onPass={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Start Challenge/i }));

    expect(screen.getByText(/What does AMM stand for/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Market Maker/i)).toBeInTheDocument();
  });

  it('supports keyboard navigation for answers', async () => {
    await i18n.changeLanguage('en');
    await loadI18nSections(i18n, ['quiz'], 'en');

    render(<MultiQuiz lessonId="8-2" onPass={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Start Challenge/i }));

    const optionGroup = screen.getByRole('radiogroup');
    const options = screen.getAllByRole('radio');

    expect(options[0]).toHaveAttribute('tabindex', '0');

    fireEvent.keyDown(optionGroup, { key: 'ArrowDown' });
    await waitFor(() => expect(options[1]).toHaveFocus());

    fireEvent.keyDown(optionGroup, { key: ' ' });
    expect(options[1]).toHaveAttribute('aria-checked', 'true');

    fireEvent.keyDown(optionGroup, { key: 'ArrowUp' });
    await waitFor(() => expect(options[0]).toHaveFocus());
  });
});
