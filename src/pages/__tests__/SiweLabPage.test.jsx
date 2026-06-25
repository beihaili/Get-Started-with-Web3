import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SiweLabPage from '../SiweLabPage';
import LanguageProvider from '../../i18n/LanguageProvider';
import i18n from '../../i18n';
import { loadI18nSections } from '../../i18n/namespaceLoaders';

const VALID_SIGNATURE =
  '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

async function prepareSiweLabTranslations(language = 'en') {
  await i18n.changeLanguage(language);
  await loadI18nSections(i18n, ['siweLab'], language);
}

function renderSiweLabPage(initialEntry = '/en/labs/siwe') {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/:lang/labs/siwe"
          element={
            <LanguageProvider>
              <SiweLabPage />
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
  signature = VALID_SIGNATURE,
  signError,
} = {}) {
  const listeners = new Map();
  const provider = {
    request: vi.fn(async ({ method }) => {
      if (method === 'eth_requestAccounts') {
        return [address];
      }

      if (method === 'eth_chainId') {
        return chainId;
      }

      if (method === 'personal_sign') {
        if (signError) {
          throw signError;
        }
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

describe('SiweLabPage', () => {
  beforeEach(async () => {
    Object.defineProperty(window, 'ethereum', {
      configurable: true,
      value: undefined,
    });
    await prepareSiweLabTranslations('en');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders a safe disconnected state without requiring a wallet extension', async () => {
    renderSiweLabPage();

    expect(screen.getByRole('heading', { name: 'SIWE Learning Identity Lab' })).toBeInTheDocument();
    expect(await screen.findByText('No injected wallet detected')).toBeInTheDocument();
    expect(screen.getByText('Not production authentication')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Connect wallet' })).toBeDisabled();
  });

  it('connects a wallet and composes a SIWE message preview', async () => {
    installMockInjectedWallet();

    renderSiweLabPage();

    expect(await screen.findByText('Browser injected wallet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Connect wallet' }));

    expect(await screen.findByText('0x1234...5678')).toBeInTheDocument();
    expect(screen.getByText('Ethereum Mainnet (1)')).toBeInTheDocument();
    expect(screen.getByText('Message preview')).toBeInTheDocument();
    expect(screen.getByText(/wants you to sign in with your Ethereum account/)).toBeInTheDocument();
    expect(screen.getByText(/Nonce:/)).toBeInTheDocument();
    expect(screen.getByText(/Expiration Time:/)).toBeInTheDocument();
  });

  it('signs a SIWE message and shows local inspection checks', async () => {
    const { provider, address } = installMockInjectedWallet();

    renderSiweLabPage();

    expect(await screen.findByText('Browser injected wallet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Connect wallet' }));
    expect(await screen.findByText('0x1234...5678')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sign SIWE message' }));

    expect(await screen.findByText('Local SIWE inspection')).toBeInTheDocument();
    expect(screen.getByText('Domain matches this page')).toBeInTheDocument();
    expect(screen.getByText('Address matches connected wallet')).toBeInTheDocument();
    expect(screen.getByText('Signature has standard 65-byte hex shape')).toBeInTheDocument();

    await waitFor(() =>
      expect(provider.request).toHaveBeenCalledWith({
        method: 'personal_sign',
        params: [expect.stringContaining('Nonce:'), address],
      })
    );
  });

  it('shows a wallet rejection error without keeping a signed result', async () => {
    installMockInjectedWallet({ signError: { code: 4001 } });

    renderSiweLabPage();

    expect(await screen.findByText('Browser injected wallet')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Connect wallet' }));
    expect(await screen.findByText('0x1234...5678')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Sign SIWE message' }));

    expect(await screen.findByText('The wallet request was rejected.')).toBeInTheDocument();
    expect(screen.queryByText('Local SIWE inspection')).not.toBeInTheDocument();
  });
});
