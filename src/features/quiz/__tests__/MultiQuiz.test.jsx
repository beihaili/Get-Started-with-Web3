import { describe, it, expect, afterEach, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import MultiQuiz from '../MultiQuiz';
import i18n from '../../../i18n';

describe('MultiQuiz localization', () => {
  afterEach(async () => {
    await i18n.changeLanguage('zh');
  });

  it('renders English question copy when the current language is English', async () => {
    await i18n.changeLanguage('en');

    render(<MultiQuiz lessonId="8-2" onPass={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Start Challenge/i }));

    expect(screen.getByText(/What does AMM stand for/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Market Maker/i)).toBeInTheDocument();
  });
});
