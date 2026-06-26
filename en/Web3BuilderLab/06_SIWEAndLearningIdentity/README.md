# SIWE and Learning Identity Lab

> Sign-In with Ethereum is not just "sign any message." ERC-4361 standardizes what a wallet sign-in message should contain, so users, wallets, and relying parties can reason about domain, nonce, expiration, and replay risk.

Last reviewed: 2026-06-25

## Table of Contents

- [Why SIWE Belongs in a Learning Platform](#why-siwe-belongs-in-a-learning-platform)
- [What ERC-4361 Standardizes](#what-erc-4361-standardizes)
- [The Message Fields](#the-message-fields)
- [Nonce and Replay Risk](#nonce-and-replay-risk)
- [Domain, URI, and Phishing](#domain-uri-and-phishing)
- [Why a Static Site Is Not Production Auth](#why-a-static-site-is-not-production-auth)
- [Hands-On Lab](#hands-on-lab)
- [Learning Identity and Credentials](#learning-identity-and-credentials)
- [Checklist](#checklist)
- [Further Reading](#further-reading)

## Why SIWE Belongs in a Learning Platform

A wallet address can represent a learner, but a connected wallet is still not a login session.

SIWE helps answer a narrower question:

> Did this wallet sign this specific authentication message for this specific relying party and time window?

That distinction matters for learning identity. A future course platform might ask a learner to prove wallet control before attaching a badge, certificate, or verifiable credential to that wallet. But the proof must be bounded:

- Which site requested the signature?
- Which address signed?
- Which chain context is the message bound to?
- Which nonce prevents replay?
- When was the message issued?
- When does it expire?
- What session was created after verification?

This lesson and `/labs/siwe` demo show the message anatomy only. They do not create a production account system.

## What ERC-4361 Standardizes

[ERC-4361](https://eips.ethereum.org/EIPS/eip-4361) defines Sign-In with Ethereum as an off-chain authentication message format. The standard is Final and describes how Ethereum accounts authenticate to off-chain services by signing a structured plaintext message.

The standard uses the ERC-191 signed data flow for externally owned accounts. A wallet should show a user-readable message before signing, and the relying party must check both the signature and the message contents.

## The Message Fields

A SIWE message usually includes:

| Field        | Why it matters                                                       |
| ------------ | -------------------------------------------------------------------- |
| `domain`     | The site asking for the signature                                    |
| `address`    | The Ethereum account signing the message                             |
| `statement`  | A human-readable explanation of the request                          |
| `URI`        | The resource or app surface being signed into                        |
| `Version`    | `1` for ERC-4361                                                     |
| `Chain ID`   | The EIP-155 chain context                                            |
| `Nonce`      | A random value used to prevent replay                                |
| `Issued At`  | When the message was created                                         |
| `Expiration` | Optional, but important for reducing how long a signature is useful  |
| `Resources`  | Optional links or resources the relying party may resolve separately |

The lab constructs a message with these fields and asks the wallet to sign it with `personal_sign`.

## Nonce and Replay Risk

A nonce is not decorative. It is the main defense against someone reusing an old valid signature.

In production:

1. The server creates a fresh nonce.
2. The frontend puts that nonce in the SIWE message.
3. The wallet signs the message.
4. The server verifies the signature and consumes the nonce.
5. The same nonce cannot be used again.

The static lab can generate a fresh nonce in the browser, but that is only educational. A browser-generated nonce is not trusted by a server unless the server issued and stored it first.

## Domain, URI, and Phishing

The `domain` and `URI` tell the wallet and relying party where the request came from. Wallets can compare the message domain with the actual requesting origin to detect suspicious prompts.

This matters because a malicious page could ask a user to sign text that looks like another site. A production wallet or relying party should reject mismatched origins, except for clearly marked local development cases.

## Why a Static Site Is Not Production Auth

GitHub Pages cannot complete production SIWE alone because it has no trusted backend.

A production SIWE relying party needs:

- Server-issued nonce storage.
- Signature verification.
- Replay protection.
- Session creation and invalidation.
- ERC-1271 handling for contract wallets.
- Clear privacy rules for ENS or profile lookups.

The `/labs/siwe` page therefore says exactly what it does: compose a message, ask a wallet to sign it, and inspect fields locally. It does not claim that the learner has logged in.

## Hands-On Lab

Open:

- English: `/en/labs/siwe`
- Chinese: `/zh/labs/siwe`

Try this flow:

1. Connect an injected EVM wallet.
2. Read the domain, URI, nonce, issued-at, and expiration fields.
3. Refresh the nonce and observe which fields change.
4. Sign the message.
5. Inspect the local checks.

The local checks confirm:

- Domain matches the current page.
- Address matches the connected wallet.
- Nonce has the required shape.
- Expiration is still in the future.
- Signature has the expected 65-byte hex shape.

Those checks are not enough for production authentication. They are a learning aid.

## Learning Identity and Credentials

The useful idea is not "wallet equals account." The useful idea is:

> A learner can prove control of a wallet for a specific purpose and time window.

That proof could later become one input to:

- Learning progress backup.
- Badge claiming.
- Certificate issuance.
- Verifiable credential presentation.
- Sponsor-safe impact reporting.

But each of those systems needs its own architecture. A course badge, an NFT certificate, a soulbound credential, and an offchain verifiable credential have different privacy and revocation tradeoffs.

## Checklist

After this lesson, you should be able to explain:

- Why connecting a wallet is not the same as signing in.
- Which fields appear in an ERC-4361 SIWE message.
- Why nonce and expiration reduce replay risk.
- Why static sites cannot provide production SIWE sessions alone.
- How SIWE can connect to learning identity without promising a real account system.

## Further Reading

- [ERC-4361: Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361)
- [ERC-191: Signed Data Standard](https://eips.ethereum.org/EIPS/eip-191)
- [ERC-1271: Standard Signature Validation Method for Contracts](https://eips.ethereum.org/EIPS/eip-1271)
- [SIWE hosted-auth decision note](https://github.com/beihaili/Get-Started-with-Web3/blob/main/docs/strategy/2026-06-25-siwe-learning-identity-decision.md)
