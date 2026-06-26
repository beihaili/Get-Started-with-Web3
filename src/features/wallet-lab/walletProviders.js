const EIP6963_REQUEST_EVENT = 'eip6963:requestProvider';
const EIP6963_ANNOUNCE_EVENT = 'eip6963:announceProvider';

function getProviderName(provider) {
  if (provider?.isMetaMask) {
    return 'Browser injected wallet';
  }

  return 'Browser injected wallet';
}

function createProviderRecord({ id, name, rdns, provider, source }) {
  return {
    id,
    info: {
      name: name || 'Injected wallet',
      rdns: rdns || id,
    },
    provider,
    source,
  };
}

function addProvider(providerMap, record) {
  if (!record?.provider?.request) {
    return;
  }

  providerMap.set(record.id, record);
}

export function normalizeProviderAnnouncement(detail) {
  if (!detail?.provider?.request) {
    return null;
  }

  const info = detail.info || {};
  const id = info.rdns || info.uuid || info.name || 'eip6963-wallet';

  return createProviderRecord({
    id,
    name: info.name,
    rdns: info.rdns || info.uuid,
    provider: detail.provider,
    source: 'eip6963',
  });
}

export function getInjectedProviderRecords(target) {
  const injectedProvider = target?.ethereum;

  if (!injectedProvider) {
    return [];
  }

  const injectedProviders = Array.isArray(injectedProvider.providers)
    ? injectedProvider.providers
    : [injectedProvider];

  return injectedProviders
    .filter((provider) => provider?.request)
    .map((provider, index) =>
      createProviderRecord({
        id: `window.ethereum.${index}`,
        name: getProviderName(provider),
        rdns: `window.ethereum.${index}`,
        provider,
        source: 'window.ethereum',
      })
    );
}

export async function discoverWalletProviders({ target, timeoutMs = 80 } = {}) {
  const browserTarget = target || (typeof window !== 'undefined' ? window : undefined);

  if (!browserTarget?.addEventListener || !browserTarget?.dispatchEvent) {
    return [];
  }

  const providers = new Map();

  const handleProviderAnnouncement = (event) => {
    addProvider(providers, normalizeProviderAnnouncement(event.detail));
  };

  browserTarget.addEventListener(EIP6963_ANNOUNCE_EVENT, handleProviderAnnouncement);
  browserTarget.dispatchEvent(new Event(EIP6963_REQUEST_EVENT));

  await new Promise((resolve) => {
    setTimeout(resolve, timeoutMs);
  });

  browserTarget.removeEventListener(EIP6963_ANNOUNCE_EVENT, handleProviderAnnouncement);

  getInjectedProviderRecords(browserTarget).forEach((record) => {
    addProvider(providers, record);
  });

  return Array.from(providers.values());
}
