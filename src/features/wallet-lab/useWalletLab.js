import { useCallback, useEffect, useMemo, useState } from 'react';
import { discoverWalletProviders } from './walletProviders';
import {
  ALLOWED_WALLET_LAB_CHAINS,
  buildWalletLabMessage,
  formatChainLabel,
  formatSignaturePreview,
  getWalletErrorKey,
  normalizeChainId,
  shortenAddress,
} from './walletLabUtils';

const STATUS_IDLE = 'idle';
const STATUS_DISCOVERING = 'discovering';
const STATUS_CONNECTING = 'connecting';
const STATUS_CONNECTED = 'connected';
const STATUS_SWITCHING = 'switching';
const STATUS_SIGNING = 'signing';

function getCurrentDomain() {
  if (typeof window === 'undefined') {
    return 'bhbtc.xyz';
  }

  return window.location.host || 'bhbtc.xyz';
}

function getProviderDisplayName(providerRecord) {
  return providerRecord?.info?.name || 'Injected wallet';
}

export function useWalletLab() {
  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [status, setStatus] = useState(STATUS_IDLE);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [signature, setSignature] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [errorKey, setErrorKey] = useState('');

  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.id === selectedProviderId) || providers[0] || null,
    [providers, selectedProviderId]
  );

  const connected = Boolean(account && selectedProvider);

  const refreshProviders = useCallback(async () => {
    setErrorKey('');
    setStatus((currentStatus) =>
      currentStatus === STATUS_CONNECTED ? STATUS_CONNECTED : STATUS_DISCOVERING
    );

    const discoveredProviders = await discoverWalletProviders();

    setProviders(discoveredProviders);
    setSelectedProviderId((currentProviderId) => {
      if (discoveredProviders.some((provider) => provider.id === currentProviderId)) {
        return currentProviderId;
      }

      return discoveredProviders[0]?.id || '';
    });

    if (discoveredProviders.length === 0) {
      setErrorKey('errorNoWallet');
    }

    setStatus((currentStatus) =>
      currentStatus === STATUS_DISCOVERING ? STATUS_IDLE : currentStatus
    );
  }, []);

  useEffect(() => {
    const discoveryTimer = setTimeout(() => {
      refreshProviders();
    }, 0);

    return () => {
      clearTimeout(discoveryTimer);
    };
  }, [refreshProviders]);

  useEffect(() => {
    const provider = selectedProvider?.provider;

    if (!provider?.on) {
      return undefined;
    }

    const handleAccountsChanged = (accounts = []) => {
      const nextAccount = Array.isArray(accounts) ? accounts[0] || '' : '';
      setAccount(nextAccount);
      setSignature('');
      setSignedMessage('');
      setStatus(nextAccount ? STATUS_CONNECTED : STATUS_IDLE);
    };

    const handleChainChanged = (nextChainId) => {
      setChainId(normalizeChainId(nextChainId));
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      if (provider.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [selectedProvider]);

  const selectProvider = useCallback(
    (providerId) => {
      if (!providers.some((provider) => provider.id === providerId)) {
        return;
      }

      setSelectedProviderId(providerId);
      setAccount('');
      setChainId('');
      setSignature('');
      setSignedMessage('');
      setStatus(STATUS_IDLE);
      setErrorKey('');
    },
    [providers]
  );

  const connect = useCallback(async () => {
    if (!selectedProvider?.provider?.request) {
      setErrorKey('errorProviderUnavailable');
      return;
    }

    setStatus(STATUS_CONNECTING);
    setErrorKey('');
    setSignature('');
    setSignedMessage('');

    try {
      const accounts = await selectedProvider.provider.request({ method: 'eth_requestAccounts' });
      const nextAccount = Array.isArray(accounts) ? accounts[0] || '' : '';

      if (!nextAccount) {
        setErrorKey('errorNoAccount');
        setStatus(STATUS_IDLE);
        return;
      }

      const nextChainId = await selectedProvider.provider.request({ method: 'eth_chainId' });

      setAccount(nextAccount);
      setChainId(normalizeChainId(nextChainId));
      setStatus(STATUS_CONNECTED);
    } catch (error) {
      setErrorKey(getWalletErrorKey(error));
      setStatus(STATUS_IDLE);
    }
  }, [selectedProvider]);

  const disconnect = useCallback(() => {
    setAccount('');
    setChainId('');
    setSignature('');
    setSignedMessage('');
    setErrorKey('');
    setStatus(STATUS_IDLE);
  }, []);

  const switchChain = useCallback(
    async (nextChainId) => {
      if (!connected || !selectedProvider?.provider?.request) {
        setErrorKey('errorNoConnection');
        return;
      }

      const normalizedChainId = normalizeChainId(nextChainId);

      if (!normalizedChainId) {
        setErrorKey('errorGeneric');
        return;
      }

      setStatus(STATUS_SWITCHING);
      setErrorKey('');

      try {
        await selectedProvider.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: normalizedChainId }],
        });

        const confirmedChainId = await selectedProvider.provider.request({ method: 'eth_chainId' });
        setChainId(normalizeChainId(confirmedChainId) || normalizedChainId);
        setStatus(STATUS_CONNECTED);
      } catch (error) {
        setErrorKey(getWalletErrorKey(error));
        setStatus(STATUS_CONNECTED);
      }
    },
    [connected, selectedProvider]
  );

  const signMessage = useCallback(async () => {
    if (!connected || !selectedProvider?.provider?.request) {
      setErrorKey('errorNoConnection');
      return;
    }

    const message = buildWalletLabMessage({ domain: getCurrentDomain() });

    setStatus(STATUS_SIGNING);
    setErrorKey('');
    setSignature('');
    setSignedMessage(message);

    try {
      const nextSignature = await selectedProvider.provider.request({
        method: 'personal_sign',
        params: [message, account],
      });

      setSignature(typeof nextSignature === 'string' ? nextSignature : '');
      setStatus(STATUS_CONNECTED);
    } catch (error) {
      setSignedMessage('');
      setErrorKey(getWalletErrorKey(error));
      setStatus(STATUS_CONNECTED);
    }
  }, [account, connected, selectedProvider]);

  return {
    allowedChains: ALLOWED_WALLET_LAB_CHAINS,
    account,
    accountPreview: shortenAddress(account),
    activeChainLabel: formatChainLabel(chainId),
    activeProviderName: getProviderDisplayName(selectedProvider),
    chainId,
    connected,
    connect,
    disconnect,
    errorKey,
    providers,
    refreshProviders,
    selectProvider,
    selectedProviderId: selectedProvider?.id || '',
    signMessage,
    signature,
    signaturePreview: formatSignaturePreview(signature),
    signedMessage,
    status,
    switchChain,
  };
}
