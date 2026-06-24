import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import WalletLabPage from '../WalletLabPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';

async function prepareWalletLabTranslations(language = 'en') {
  await i18n.changeLanguage(language);
  await loadI18nSections(i18n, ['walletLab'], language);
}

function renderWalletLabPage(initialEntry = '/en/labs/wallet') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/labs/wallet"
          element={
            <LanguageProvider>
              <WalletLabPage />
            </LanguageProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

function installMockInjectedWallet({
  address = '0x1234567890abcdef1234567890abcdef12345678',
  chainId = '0x1',
  signature = '0xabcdefabcdefabcdefabcdefabcdefabcdef',
} = {}) {
  let currentChainId = chainId;
  const listeners = new Map();
  const provider = {
    request: vi.fn(async ({ method, params }) => {
      if (method === 'eth_requestAccounts') {
        return [address];
      }

      if (method === 'eth_chainId') {
        return currentChainId;
      }

      if (method === 'wallet_switchEthereumChain') {
        currentChainId = params[0].chainId;
        listeners.get('chainChanged')?.forEach((listener) => listener(currentChainId));
        return null;
      }

      if (method === 'personal_sign') {
        return signature;
      }

      throw new Error(`Unexpected wallet method: ${method}`);
    }),
    on: vi.fn((eventName, listener) => {
      const eventListeners = listeners.get(eventName) || [];
      eventListeners.push(listener);
      listeners.set(eventName, eventListeners);
    }),
    removeListener: vi.fn((eventName, listener) => {
      const eventListeners = listeners.get(eventName) || [];
      listeners.set(
        eventName,
        eventListeners.filter((eventListener) => eventListener !== listener)
      );
    }),
    isMetaMask: true,
  };

  Object.defineProperty(window, 'ethereum', {
    configurable: true,
    value: provider,
  });

  return { provider, address, signature };
}

describe('WalletLabPage', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'ethereum', {
      configurable: true,
      value: undefined,
    });
    await prepareWalletLabTranslations('en');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a safe empty state without requiring a wallet extension', async () => {
    renderWalletLabPage();

    expect(
      screen.getByRole('heading', { name: 'Wallet Interoperability Lab' })
    ).toBeInTheDocument();
    expect(await screen.findByText('No injected wallet detected')).toBeInTheDocument();
    expect(screen.getByText('Connect and disconnect wallet')).toBeInTheDocument();
    expect(
      screen.getByText('Sign one educational message and inspect the result locally')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect wallet' })).toBeDisabled();
  });

  it('shows the analytics privacy boundary', () => {
    renderWalletLabPage();

    expect(screen.getByText('Privacy boundary')).toBeInTheDocument();
    expect(screen.getByText(/never sends raw wallet addresses/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction payloads to analytics/i)).toBeInTheDocument();
  });

  it('connects, switches networks, and signs a local message through an injected wallet', async () => {
    const { provider, address, signature } = installMockInjectedWallet();

    renderWalletLabPage();

    expect(await screen.findByText('Browser injected wallet')).toBeInTheDocument();
    expect(screen.getByText('1 detected')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Connect wallet' }));

    expect(await screen.findByText('0x1234...5678')).toBeInTheDocument();
    expect(screen.queryByText(address)).not.toBeInTheDocument();
    expect(screen.getByText('Ethereum Mainnet (1)')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sepolia Testnet' }));

    expect(await screen.findByText('Sepolia Testnet (11155111)')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sign learning message' }));

    expect(await screen.findByText('Signature returned locally')).toBeInTheDocument();
    expect(screen.getByText('0xabcdefabcd...cdefabcdef')).toBeInTheDocument();
    expect(screen.queryByText(signature)).not.toBeInTheDocument();

    await waitFor(() =>
      expect(provider.request).toHaveBeenCalledWith({
        method: 'personal_sign',
        params: [expect.stringContaining('No transaction, payment, or login session'), address],
      })
    );
  });
});
