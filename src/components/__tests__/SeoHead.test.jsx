import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import SeoHead from '../SeoHead';

describe('SeoHead', () => {
  it('should render JSON-LD structured data', async () => {
    render(
      <SeoHead
        title="Test"
        description="Desc"
        url="https://example.com"
        type="article"
        moduleTitle="Module"
      />
    );
    await waitFor(() => {
      const jsonLd = document.querySelector('script[type="application/ld+json"]');
      expect(jsonLd).toBeTruthy();
      const data = JSON.parse(jsonLd.textContent);
      expect(data['@type']).toBe('Article');
      expect(data.name).toBe('Test');
    });
  });

  it('should set document title', async () => {
    render(<SeoHead title="My Title" description="Desc" url="https://example.com" />);
    await waitFor(() => {
      expect(document.title).toBe('My Title');
    });
  });
});
