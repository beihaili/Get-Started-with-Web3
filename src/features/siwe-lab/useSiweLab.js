import { useCallback, useEffect, useMemo, useState } from 'react';
import { discoverWalletProviders } from '../wallet-lab/walletProviders';
import { normalizeChainId } from '../wallet-lab/walletLabUtils';
import {
  DEFAULT_SIWE_STATEMENT,
  buildSiweMessage,
  createSiweNonce,
  createSiweTimestamps,
  formatSiweAccountPreview,
  formatSiweChainLabel,
  formatSiweSignaturePreview,
  getSiweErrorKey,
  inspectSiweResult,
} from './siweUtils';

const STATUS_IDLE = 'idle';
const STATUS_DISCOVERING = 'discovering';
const STATUS_CONNECTING = 'connecting';
const STATUS_CONNECTED = 'connected';
const STATUS_SIGNING = 'signing';
const STATUS_SIGNED = 'signed';

function getCurrentContext() {
  if (typeof window === 'undefined') {
    return {
      domain: 'bhbtc.xyz',
      uri: 'https://bhbtc.xyz/labs/siwe',
    };
  }

  const origin = window.location.origin || 'https://bhbtc.xyz';

  return {
    domain: window.location.host || 'bhbtc.xyz',
    uri: `${origin}/labs/siwe`,
  };
}

function createFreshMessageFields() {
  return {
    nonce: createSiweNonce(),
    ...createSiweTimestamps(),
  };
}

function getProviderDisplayName(providerRecord) {
  return providerRecord?.info?.name || 'Injected wallet';
}

export function useSiweLab() {
  const [providers, setProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [status, setStatus] = useState(STATUS_IDLE);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [statement, setStatement] = useState(DEFAULT_SIWE_STATEMENT);
  const [messageFields, setMessageFields] = useState(() => createFreshMessageFields());
  const [signature, setSignature] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [inspection, setInspection] = useState(null);
  const [errorKey, setErrorKey] = useState('');

  const selectedProvider = useMemo(
    () => providers.find((provider) => provider.id === selectedProviderId) || providers[0] || null,
    [providers, selectedProviderId]
  );
  const connected = Boolean(account && selectedProvider);
  const context = useMemo(() => getCurrentContext(), []);

  const refreshProviders = useCallback(async () => {
    setErrorKey('');
    setStatus((currentStatus) =>
      currentStatus === STATUS_CONNECTED || currentStatus === STATUS_SIGNED
        ? currentStatus
        : STATUS_DISCOVERING
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

    return () => clearTimeout(discoveryTimer);
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
      setInspection(null);
      setStatus(nextAccount ? STATUS_CONNECTED : STATUS_IDLE);
    };

    const handleChainChanged = (nextChainId) => {
      setChainId(normalizeChainId(nextChainId));
      setSignature('');
      setSignedMessage('');
      setInspection(null);
    };

    provider.on('accountsChanged', handleAccountsChanged);
    provider.on('chainChanged', handleChainChanged);

    return () => {
      provider.removeListener?.('accountsChanged', handleAccountsChanged);
      provider.removeListener?.('chainChanged', handleChainChanged);
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
      setInspection(null);
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
    setInspection(null);

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
      setMessageFields(createFreshMessageFields());
      setStatus(STATUS_CONNECTED);
    } catch (error) {
      setErrorKey(getSiweErrorKey(error));
      setStatus(STATUS_IDLE);
    }
  }, [selectedProvider]);

  const disconnect = useCallback(() => {
    setAccount('');
    setChainId('');
    setSignature('');
    setSignedMessage('');
    setInspection(null);
    setErrorKey('');
    setStatus(STATUS_IDLE);
  }, []);

  const refreshNonce = useCallback(() => {
    setMessageFields(createFreshMessageFields());
    setSignature('');
    setSignedMessage('');
    setInspection(null);
    setStatus((currentStatus) =>
      currentStatus === STATUS_SIGNED ? STATUS_CONNECTED : currentStatus
    );
  }, []);

  const messagePreview = useMemo(() => {
    if (!connected) {
      return '';
    }

    try {
      return buildSiweMessage({
        ...context,
        address: account,
        statement,
        chainId,
        ...messageFields,
        resources: ['https://bhbtc.xyz/ai/manifest.json'],
      });
    } catch {
      return '';
    }
  }, [account, chainId, connected, context, messageFields, statement]);

  const signSiweMessage = useCallback(async () => {
    if (!connected || !selectedProvider?.provider?.request) {
      setErrorKey('errorNoConnection');
      return;
    }

    let message;
    try {
      message = buildSiweMessage({
        ...context,
        address: account,
        statement,
        chainId,
        ...messageFields,
        resources: ['https://bhbtc.xyz/ai/manifest.json'],
      });
    } catch {
      setErrorKey('errorInvalidMessage');
      return;
    }

    setStatus(STATUS_SIGNING);
    setErrorKey('');
    setSignature('');
    setSignedMessage(message);
    setInspection(null);

    try {
      const nextSignature = await selectedProvider.provider.request({
        method: 'personal_sign',
        params: [message, account],
      });
      const normalizedSignature = typeof nextSignature === 'string' ? nextSignature : '';

      setSignature(normalizedSignature);
      setInspection(
        inspectSiweResult({
          message,
          signature: normalizedSignature,
          expectedAddress: account,
          expectedDomain: context.domain,
        })
      );
      setStatus(STATUS_SIGNED);
    } catch (error) {
      setSignedMessage('');
      setErrorKey(getSiweErrorKey(error));
      setStatus(STATUS_CONNECTED);
    }
  }, [account, chainId, connected, context, messageFields, selectedProvider, statement]);

  return {
    account,
    accountPreview: formatSiweAccountPreview(account),
    activeChainLabel: formatSiweChainLabel(chainId),
    activeProviderName: getProviderDisplayName(selectedProvider),
    chainId,
    connect,
    connected,
    context,
    disconnect,
    errorKey,
    expirationTime: messageFields.expirationTime,
    inspection,
    issuedAt: messageFields.issuedAt,
    messagePreview,
    nonce: messageFields.nonce,
    providers,
    refreshNonce,
    refreshProviders,
    selectProvider,
    selectedProviderId: selectedProvider?.id || '',
    setStatement,
    signSiweMessage,
    signature,
    signaturePreview: formatSiweSignaturePreview(signature),
    signedMessage,
    statement,
    status,
  };
}
