# Build Your First DApp

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> This lab builds a minimal React DApp that connects a wallet and reads contract data. The goal is to understand the frontend architecture behind most EVM applications: wallet connection, chain configuration, contract ABI, reads, writes, and user state.

## Table of Contents

- [What a DApp Is](#what-a-dapp-is)
- [Architecture Overview](#architecture-overview)
- [Create the Project](#create-the-project)
- [Configure wagmi](#configure-wagmi)
- [Wrap the App With Providers](#wrap-the-app-with-providers)
- [Implement Wallet Connection](#implement-wallet-connection)
- [Read Contract Data](#read-contract-data)
- [Production Checklist](#production-checklist)
- [Common Questions](#common-questions)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## What a DApp Is

A DApp is an application whose critical state or execution logic lives on a blockchain or smart contract system. The frontend may still be a normal web app, but user actions often require wallet signatures and on-chain transactions.

A simple DApp usually has:

- A web frontend.
- Wallet connection.
- RPC access to one or more chains.
- Contract ABIs and addresses.
- Read calls for public data.
- Write calls for user actions.
- Transaction status handling.

The key difference from a normal web app is ownership. Users sign with their own wallets; the application does not hold their private keys.

## Architecture Overview

Modern EVM frontends often look like this:

```text
React UI
  |
  v
wagmi hooks
  |
  v
viem client
  |
  v
RPC provider
  |
  v
Smart contracts on Ethereum / L2
```

Important libraries:

| Library | Role |
|---------|------|
| React | UI framework |
| Vite | Fast local dev server and build tool |
| wagmi | React hooks for wallets, chains, reads, and writes |
| viem | TypeScript-first Ethereum RPC and ABI toolkit |
| RainbowKit or ConnectKit | Optional wallet connection UI |

This lab uses wagmi and viem directly so you can understand the core pieces.

## Create the Project

Create a Vite React app:

```bash
npm create vite@latest first-dapp -- --template react
cd first-dapp
npm install
```

Install Web3 dependencies:

```bash
npm install wagmi viem @tanstack/react-query
```

The basic structure:

```text
src/
  App.jsx
  main.jsx
  wagmi.js
```

## Configure wagmi

Create `src/wagmi.js`:

```js
import { http, createConfig } from 'wagmi';
import { mainnet, sepolia, base, arbitrum } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [mainnet, sepolia, base, arbitrum],
  connectors: [injected()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
  },
});
```

Core ideas:

- `chains` defines the networks your DApp supports.
- `connectors` defines wallet connection methods.
- `transports` defines how reads and transactions reach RPC nodes.

For production, use reliable RPC endpoints instead of public defaults.

## Wrap the App With Providers

Update `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './wagmi';
import App from './App.jsx';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
```

The provider pattern makes wallet state and query cache available to every component.

## Implement Wallet Connection

Update `src/App.jsx`:

```jsx
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';

export default function App() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();

  if (!isConnected) {
    return (
      <main style={{ padding: 32, fontFamily: 'system-ui' }}>
        <h1>First DApp</h1>
        <p>Connect your wallet to continue.</p>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            disabled={isPending}
            onClick={() => connect({ connector })}
            style={{ marginRight: 8 }}
          >
            Connect {connector.name}
          </button>
        ))}
      </main>
    );
  }

  return (
    <main style={{ padding: 32, fontFamily: 'system-ui' }}>
      <h1>First DApp</h1>
      <p>
        Connected: <code>{address}</code>
      </p>
      <p>Current chain ID: {chainId}</p>

      <div>
        {chains.map((chain) => (
          <button key={chain.id} onClick={() => switchChain({ chainId: chain.id })}>
            Switch to {chain.name}
          </button>
        ))}
      </div>

      <button onClick={() => disconnect()} style={{ marginTop: 16 }}>
        Disconnect
      </button>
    </main>
  );
}
```

Run:

```bash
npm run dev
```

Open the local URL, connect MetaMask or another injected wallet, and switch networks.

## Read Contract Data

To read a contract, you need:

- Contract address.
- ABI.
- Function name.
- Chain.

Example: read USDT total supply on Ethereum mainnet.

```jsx
import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';

const erc20Abi = [
  {
    type: 'function',
    name: 'totalSupply',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'decimals',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ type: 'uint8' }],
  },
];

const usdt = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

export function TokenSupply() {
  const { data: decimals } = useReadContract({
    address: usdt,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  const { data: totalSupply, isLoading, error } = useReadContract({
    address: usdt,
    abi: erc20Abi,
    functionName: 'totalSupply',
  });

  if (isLoading) return <p>Loading token supply...</p>;
  if (error) return <p>Failed to read contract: {error.message}</p>;

  return (
    <p>
      USDT total supply:{' '}
      <strong>{decimals !== undefined ? formatUnits(totalSupply, decimals) : String(totalSupply)}</strong>
    </p>
  );
}
```

Then render `<TokenSupply />` inside `App`.

Important: contract reads are free for the user because they do not create transactions. They still depend on RPC availability.

## Production Checklist

Before shipping a real DApp:

- Use explicit supported chains and show unsupported-network states.
- Use reliable RPC providers with fallback.
- Show pending, success, failure, and rejected-signature states.
- Simulate transactions before asking users to sign.
- Make approvals visible and avoid unlimited approvals by default.
- Keep contract addresses in a typed config file.
- Verify contract source on block explorers.
- Add monitoring for RPC failures and transaction reverts.

## Common Questions

### Why does MetaMask not open?

Common reasons:

- The browser extension is not installed.
- The DApp runs in an unsupported browser.
- A previous wallet popup is already open.
- The user rejected connection and the app did not reset state.

### Why does data not update after switching networks?

Make sure your query depends on the active chain and contract address. Some contracts exist only on specific chains. The same address on another chain may be empty or a different contract.

### Should I use RainbowKit?

For production, yes, a wallet connection UI library can save time and improve compatibility. For learning, writing the basic connection flow yourself helps you understand what the library abstracts.

### How do I deploy the frontend?

For a static Vite DApp:

```bash
npm run build
```

Then deploy `dist/` to Vercel, Netlify, Cloudflare Pages, GitHub Pages, or another static hosting service.

## Summary

You learned how to:

- Create a Vite React DApp.
- Configure wagmi and viem.
- Connect and disconnect wallets.
- Switch networks.
- Read contract data with an ABI.
- Think through production states and wallet UX.

The next lab focuses on reading block explorers so you can inspect what your DApp actually does on-chain.

## Further Reading

- [wagmi Documentation](https://wagmi.sh/)
- [viem Documentation](https://viem.sh/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [EIP-1193 Provider API](https://eips.ethereum.org/EIPS/eip-1193)
