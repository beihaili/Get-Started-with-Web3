import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { resetGasFeeCacheForTests } from '../../../utils/gasFee';
import { GasFeeCalculator } from '../GasFeeCalculator';

afterEach(() => {
  vi.restoreAllMocks();
  resetGasFeeCacheForTests();
});

describe('GasFeeCalculator', () => {
  it('renders an offline EIP-1559 estimate without waiting for network data', () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    render(<GasFeeCalculator lang="en" />);

    expect(screen.getByRole('heading', { name: 'Gas Fee Calculator' })).toBeInTheDocument();
    expect(screen.getByText('20.00 gwei')).toBeInTheDocument();
    expect(screen.getByText('21.50 gwei')).toBeInTheDocument();
    expect(screen.getByText('0.00045150 ETH')).toBeInTheDocument();
    expect(screen.getByText('$1.35')).toBeInTheDocument();
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('updates totals and warns when max fee is below base fee plus priority tip', () => {
    render(<GasFeeCalculator lang="en" />);

    fireEvent.change(screen.getByLabelText('Max fee'), { target: { value: '21' } });

    expect(
      screen.getByText('Max fee is below base fee + priority tip; the transaction may be delayed.')
    ).toBeInTheDocument();
    expect(screen.getByText('21.00 gwei')).toBeInTheDocument();
    expect(screen.getByText('0.00044100 ETH')).toBeInTheDocument();
  });

  it('refreshes live base fee and ETH price when data sources respond', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            result: { baseFeePerGas: ['0x6fc23ac00'] },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ethereum: { usd: 3500 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    render(<GasFeeCalculator lang="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh live data' }));

    expect(await screen.findByText('30.00 gwei')).toBeInTheDocument();
    expect(screen.getByText('$2.32')).toBeInTheDocument();
    expect(screen.getByText('Live data refreshed.')).toBeInTheDocument();
  });

  it('shows a visible RPC error when the base-fee refresh fails', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('RPC unavailable', { status: 503 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ethereum: { usd: 3500 } }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );

    render(<GasFeeCalculator lang="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh live data' }));

    await waitFor(() => {
      expect(
        screen.getByText('Could not refresh the base fee. Using the current estimate.')
      ).toBeInTheDocument();
    });
    expect(screen.getByText('20.00 gwei')).toBeInTheDocument();
  });

  it('degrades gracefully when the ETH price source is rate limited', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            result: { baseFeePerGas: ['0x6fc23ac00'] },
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
      )
      .mockResolvedValueOnce(new Response('Rate limited', { status: 429 }));

    render(<GasFeeCalculator lang="en" />);
    fireEvent.click(screen.getByRole('button', { name: 'Refresh live data' }));

    expect(await screen.findByText('30.00 gwei')).toBeInTheDocument();
    expect(
      screen.getByText('ETH/USD source is rate limited. Using cached or default USD estimate.')
    ).toBeInTheDocument();
    expect(screen.getByText('$3000.00')).toBeInTheDocument();
  });
});
