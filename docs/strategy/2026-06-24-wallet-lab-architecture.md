# Wallet Lab Architecture

**Date:** 2026-06-24  
**Owner:** beihai + Codex  
**Status:** Pre-dependency design note  
**Roadmap package:** Wallet lab design

## Progress

- 2026-06-24: Dependency-free route scaffold shipped for `/en/labs/wallet` and `/zh/labs/wallet`, with i18n, sitemap, prerender, and static rendering tests.

## Goal

Add a small educational wallet lab that helps learners understand modern wallet interoperability without turning the main site into a production dApp starter kit.

The first lab should answer four learner questions:

1. What wallet am I connected with?
2. Which chain am I on?
3. What does switching networks feel like?
4. What is the difference between signing a message and sending a transaction?

## Non-Goals

- No mainnet transactions.
- No token transfer, approve, swap, bridge, yield, or mint flow.
- No production authentication.
- No backend session storage.
- No analytics event may include a raw wallet address, signature, signed message, or transaction payload.
- No global wallet provider should wrap the whole app before the lab proves it needs that scope.

## Route Shape

Recommended route:

```text
/labs/wallet
```

The route should be clearly labeled as a lab. It should live outside the core course reader so the main curriculum remains lightweight.

Suggested files for the future implementation:

```text
src/pages/WalletLabPage.jsx
src/features/wallet-lab/
src/features/wallet-lab/components/
src/features/wallet-lab/config/
src/features/wallet-lab/__tests__/
```

## Stack Decision

Default recommendation: **wagmi + viem + RainbowKit**.

Why:

- `wagmi` and `viem` are common in current React EVM examples.
- `viem` exposes Ethereum actions in a way that is useful for teaching.
- RainbowKit gives learners a recognizable wallet-selection UI without forcing the project to design a wallet modal first.
- EIP-6963 can still be taught conceptually even if the library handles provider discovery internally.

Alternative: **Reown AppKit**.

Use Reown AppKit instead if a concrete Reown / WalletConnect collaboration becomes active, or if the educational goal shifts toward WalletConnect sessions and multi-wallet infrastructure.

Do not install either stack until the implementation PR is ready to include tests and a browser smoke path.

## MVP Behavior

The first runnable wallet lab should support:

- Connect wallet.
- Disconnect wallet.
- Display connected status.
- Display shortened account address.
- Display current chain name and chain ID.
- Switch between a small allowlist of safe networks, such as Ethereum mainnet read-only context and Sepolia.
- Sign a plain educational message.
- Show the signed message result locally with a warning that signing is not the same as logging in.

The first version should not send transactions. A future version can add read-only contract calls or balance reads if the privacy and RPC behavior are clear.

## EIP-6963 Teaching Angle

The lab should explain that EIP-6963 exists because multiple injected wallet extensions can conflict when every wallet competes for `window.ethereum`.

The lab UI does not need to implement raw EIP-6963 events in v1 if RainbowKit or Reown abstracts discovery. The lesson should still name:

- provider discovery,
- wallet selection,
- reverse-DNS wallet identifiers,
- provider imitation risk,
- wallet fingerprinting considerations.

## Privacy And Analytics Rules

Allowed analytics:

- `wallet_lab_open`
- `wallet_lab_connect_click`
- `wallet_lab_disconnect_click`
- `wallet_lab_sign_click`
- `wallet_lab_network_switch_click`

Disallowed analytics payloads:

- raw address,
- signature,
- signed message,
- ENS name,
- transaction hash,
- wallet provider object,
- full chain RPC URL.

If address context is ever needed, send only a coarse boolean such as `connected: true`.

## Test Plan

Before a wallet dependency PR can merge, it should include:

- Component test for disconnected state.
- Component test for connected mock state.
- Component test for sign-message success and failure states.
- Config helper tests for allowed chains and displayed labels.
- Browser smoke on desktop and mobile.
- Console check for no uncaught wallet-provider errors when no wallet extension exists.

## Verification Commands

Expected implementation verification:

```bash
npm test
npm run lint
npm run build
```

If route-level i18n strings are added, also verify the affected namespace tests. If AI artifacts or course metadata change in the same PR, run:

```bash
npm run ai:index
npm run ai:publish
npm run ai:verify
```

## First Implementation Slice

The next implementation PR should:

1. Add route scaffolding and copy without dependencies.
2. Add a feature flag or placeholder state for "wallet stack not installed yet."
3. Add tests for static route rendering.
4. Only then install the chosen wallet stack in a follow-up PR.
