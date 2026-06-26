# Wallet Interoperability and Signing Lab

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--06-orange)
![difficulty](https://img.shields.io/badge/difficulty-intermediate-yellow)

> Wallet connection is more than one button. A modern DApp needs to handle multi-wallet discovery, network context, chain switching, message signing, and privacy boundaries. This lesson explains the `/labs/wallet` experience piece by piece.

Last reviewed: 2026-06-25

## Table of Contents

- [Why Wallet Interoperability Matters](#why-wallet-interoperability-matters)
- [What the Lab Does](#what-the-lab-does)
- [What EIP-6963 Solves](#what-eip-6963-solves)
- [What an EIP-1193 Provider Is](#what-an-eip-1193-provider-is)
- [Connecting Is Not Logging In](#connecting-is-not-logging-in)
- [Message Signing Is Not a Transaction](#message-signing-is-not-a-transaction)
- [Why Chain Switching Needs an Allowlist](#why-chain-switching-needs-an-allowlist)
- [Privacy and Analytics Boundaries](#privacy-and-analytics-boundaries)
- [Try the Lab](#try-the-lab)
- [Learning Checklist](#learning-checklist)
- [Further Reading](#further-reading)

---

## Why Wallet Interoperability Matters

Many tutorials compress wallet UX into:

```text
Click Connect Wallet -> get an address -> use the DApp
```

Real products have more moving parts:

- A user may install multiple wallet extensions.
- Different wallets may inject different providers.
- The page needs to know the current chain ID.
- The user may need to switch to a supported network.
- Message signing, transaction signing, and transaction sending are separate actions.
- Addresses, signatures, and provider objects should not be sent to analytics casually.

The Get Started with Web3 Wallet Lab is not a production wallet framework. It is a small educational surface that makes those moving parts observable.

## What the Lab Does

Open the lab:

- English: `/en/labs/wallet`
- Chinese: `/zh/labs/wallet`

The current MVP supports:

| Capability                | Learning goal                                          | Risk boundary                               |
| ------------------------- | ------------------------------------------------------ | ------------------------------------------- |
| Discover injected wallets | See which EVM wallet providers exist in the browser    | Do not collect wallet fingerprints          |
| Connect wallet            | Understand that `eth_requestAccounts` returns accounts | Do not send raw addresses to analytics      |
| Show network              | Understand chain ID and chain name                     | Do not auto-add unknown RPC settings        |
| Switch network            | Try allowlisted `wallet_switchEthereumChain`           | Do not guide bridging or asset movement     |
| Sign message              | Distinguish message signing from transactions          | Do not create sessions or upload signatures |

If the browser has no wallet extension, the page shows a safe empty state. That is part of the lesson: a good DApp should explain what is missing instead of crashing or failing silently.

## What EIP-6963 Solves

Older browser wallets usually exposed their provider through `window.ethereum`. If a user installed multiple wallets, each wallet competed for the same global slot:

```text
Wallet A injects window.ethereum
Wallet B also injects window.ethereum
The last wallet to load wins
```

That means the page may not know which wallet the user intended to use.

[EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) is a Final Interface standard for discovering multiple injected wallet providers through window events. It defines two key events:

```text
eip6963:requestProvider
eip6963:announceProvider
```

The page listens for `announceProvider`, then dispatches `requestProvider`. Wallets respond by announcing themselves. The DApp can then show wallet choices instead of blindly using one global `window.ethereum`.

Provider info commonly includes:

| Field  | Meaning                                            | Caution                                |
| ------ | -------------------------------------------------- | -------------------------------------- |
| `uuid` | A unique provider ID for the current page lifetime | Not a user identity                    |
| `name` | Human-readable wallet name                         | Can still be imitated                  |
| `icon` | Wallet icon URI                                    | SVG icons must not execute scripts     |
| `rdns` | Reverse-DNS wallet identifier                      | Self-attested; not strong verification |

The lab first listens for EIP-6963 announcements. If none are available, it falls back to `window.ethereum`.

## What an EIP-1193 Provider Is

[EIP-1193](https://eips.ethereum.org/EIPS/eip-1193) is a Final Ethereum Provider JavaScript API standard. It defines how a DApp talks to a wallet provider. For frontend developers, the central operation is:

```js
await provider.request({
  method: 'eth_requestAccounts',
});
```

Common methods:

| Method                       | Purpose                           | Used by this lab |
| ---------------------------- | --------------------------------- | ---------------- |
| `eth_requestAccounts`        | Ask the user to expose accounts   | Yes              |
| `eth_chainId`                | Read current network chain ID     | Yes              |
| `wallet_switchEthereumChain` | Ask the wallet to switch networks | Yes              |
| `personal_sign`              | Ask the user to sign a message    | Yes              |
| `eth_sendTransaction`        | Send a transaction                | No               |

This is why the lab can stay dependency-free: it teaches the provider API directly before adding wagmi, RainbowKit, Reown AppKit, or another abstraction.

## Connecting Is Not Logging In

Connecting a wallet only exposes an account address and gives the current page permission to call some wallet capabilities. It does not automatically mean:

- The user has completed production authentication.
- A server has verified a nonce.
- A long-lived session exists.
- The user approved any transaction or token allowance.

Production Sign-In with Ethereum requires server-issued nonces, signature verification, replay protection, and session management. A static GitHub Pages app cannot complete that trust loop by itself.

## Message Signing Is Not a Transaction

The lab signs an educational message like this:

```text
Get Started with Web3 Wallet Lab
Domain: bhbtc.xyz
Purpose: Learn wallet message signing. No transaction, payment, or login session is created.
Issued At: ...
```

The goal is to observe the wallet prompt and the returned signature.

It does not:

- Send a transaction.
- Move assets.
- Approve tokens.
- Create a production login session.
- Upload the signature to a server.

Still read every signing prompt carefully. Real phishing pages often exploit users who sign without reading the message.

## Why Chain Switching Needs an Allowlist

The lab only switches between a small set of networks:

- Ethereum Mainnet learning context.
- Sepolia Testnet learning context.

That restraint matters. A DApp should not ask users to switch to arbitrary networks, and it should not silently add unknown RPC settings. Network choice affects:

- Where assets live.
- Transaction fees.
- Whether contract addresses are correct.
- RPC and block explorer trust.
- Whether the user may confuse testnet and mainnet.

For an educational lab, an allowlist is safer than "support every chain."

## Privacy and Analytics Boundaries

Wallet Lab allows coarse events such as:

- Opening the lab.
- Clicking connect.
- Clicking switch network.
- Clicking sign message.

It must not send:

- Raw wallet addresses.
- ENS names.
- Signatures.
- Full signed messages.
- Provider objects.
- Transaction payloads.

If the project ever needs connection context, it should send a coarse boolean such as `connected: true`, not an address.

## Try the Lab

1. Open `/en/labs/wallet`.
2. If you have no wallet extension, read the empty state.
3. If you have an EVM wallet, connect it.
4. Check the wallet name, shortened account, and network label.
5. Switch to Sepolia.
6. Sign the learning message.
7. Confirm that the page shows only a signature preview, not the full signature.
8. Disconnect locally and observe the cleared state.

Questions to ask:

- If multiple wallets are installed, can the page list more than one option?
- Does the wallet prompt clearly say that no login session is created?
- If the wallet rejects a network switch, what should the page explain?
- Why is local disconnect different from revoking permissions inside the wallet UI?

## Learning Checklist

After this lesson, you should be able to explain:

- Why EIP-6963 is better than relying on a single `window.ethereum` in multi-wallet browsers.
- What the EIP-1193 provider `request()` method does.
- The difference between connecting, message signing, transaction signing, and sending a transaction.
- Why chain switching should use an allowlist.
- Why raw addresses and signatures should not enter analytics.
- Why a static site should not claim production authentication.

## Further Reading

- [EIP-6963: Multi Injected Provider Discovery](https://eips.ethereum.org/EIPS/eip-6963)
- [EIP-1193: Ethereum Provider JavaScript API](https://eips.ethereum.org/EIPS/eip-1193)
- [Wallet Lab architecture note](https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/strategy/2026-06-24-wallet-lab-architecture.md)
- [Sign-In with Ethereum / ERC-4361](https://eips.ethereum.org/EIPS/eip-4361)
