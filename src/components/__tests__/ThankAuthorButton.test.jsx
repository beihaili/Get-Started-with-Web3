import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ThankAuthorButton from '../ThankAuthorButton';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const labels = {
        'thankAuthor.message': 'Support the author',
        'thankAuthor.buttonText': 'Buy Me a Coffee',
      };
      return labels[key] || key;
    },
  }),
}));

describe('ThankAuthorButton analytics', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it('tracks lesson support CTA clicks', () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);
    render(<ThankAuthorButton />);

    fireEvent.click(screen.getByRole('link', { name: /Buy Me a Coffee/i }));

    expect(gtag).toHaveBeenCalledWith(
      'event',
      'support_link_click',
      expect.objectContaining({
        event_category: 'monetization',
        support_type: 'donation',
        link_name: 'Buy Me a Coffee',
        placement: 'lesson_thank_author',
      })
    );
  });
});
