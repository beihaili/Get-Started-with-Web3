import { fireEvent, render, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RouteAnalytics from '../RouteAnalytics';

const TestNavigator = () => {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/en/dashboard?source=test')}>Go dashboard</button>;
};

describe('RouteAnalytics', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    document.title = 'Route Analytics Test';
  });

  it('tracks the first route and subsequent SPA navigation', async () => {
    const gtag = vi.fn();
    vi.stubGlobal('gtag', gtag);

    render(
      <MemoryRouter initialEntries={['/en']}>
        <RouteAnalytics />
        <Routes>
          <Route path="/en" element={<TestNavigator />} />
          <Route path="/en/dashboard" element={<TestNavigator />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(gtag).toHaveBeenCalledTimes(1));
    expect(gtag).toHaveBeenLastCalledWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/Get-Started-with-Web3/en',
      })
    );

    fireEvent.click(document.querySelector('button'));

    await waitFor(() => expect(gtag).toHaveBeenCalledTimes(2));
    expect(gtag).toHaveBeenLastCalledWith(
      'event',
      'page_view',
      expect.objectContaining({
        page_path: '/Get-Started-with-Web3/en/dashboard?source=test',
      })
    );
  });
});
