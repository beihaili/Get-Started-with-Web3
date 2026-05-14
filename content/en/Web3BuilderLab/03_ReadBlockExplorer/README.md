# How to Read a Block Explorer

![status](https://img.shields.io/badge/status-completed-success)
![author](https://img.shields.io/badge/author-beihaili-blue)
![date](https://img.shields.io/badge/date-2026--05-orange)
![difficulty](https://img.shields.io/badge/difficulty-beginner-brightgreen)

> A block explorer is the most important debugging tool in Web3. It tells you what actually happened on-chain, not what a website claimed happened. This lab teaches you how to read Ethereum transactions, Bitcoin transactions, smart contracts, approvals, and wallet activity.

## Table of Contents

- [What a Block Explorer Is](#what-a-block-explorer-is)
- [Read an Ethereum Transaction](#read-an-ethereum-transaction)
- [Read a Bitcoin Transaction](#read-a-bitcoin-transaction)
- [Inspect a Smart Contract](#inspect-a-smart-contract)
- [Track Wallets and Large Holders](#track-wallets-and-large-holders)
- [Approval and Token Transfer Safety](#approval-and-token-transfer-safety)
- [Common Questions](#common-questions)
- [Summary](#summary)
- [Further Reading](#further-reading)

---

## What a Block Explorer Is

A block explorer is a search engine for blockchain data. You can search:

- Transaction hashes.
- Wallet addresses.
- Contract addresses.
- Blocks.
- Tokens and NFTs.
- Event logs.
- Internal calls.
- Mempool and fee data.

Common explorers:

| Ecosystem | Explorer |
|-----------|----------|
| Ethereum | [Etherscan](https://etherscan.io/) |
| Base | [Basescan](https://basescan.org/) |
| Arbitrum | [Arbiscan](https://arbiscan.io/) |
| Optimism | [Optimistic Etherscan](https://optimistic.etherscan.io/) |
| BNB Chain | [BscScan](https://bscscan.com/) |
| Bitcoin | [mempool.space](https://mempool.space/) |
| Solana | [Solscan](https://solscan.io/) |

The explorer is not a wallet and not a source of truth by itself. It reads blockchain data and presents it in a human-friendly way.

## Read an Ethereum Transaction

Open a transaction hash on Etherscan. The most important fields:

| Field | Meaning | What to check |
|-------|---------|---------------|
| Transaction Hash | Unique transaction ID | Use this to share or debug the exact transaction |
| Status | Success, Fail, or Pending | Failed transactions still consume gas if they reached execution |
| Block | Block number where it was included | More confirmations mean lower reorg risk |
| From | Address that sent the transaction | Confirm this is your wallet or expected sender |
| To | Receiving address or contract | Contract address means the transaction called code |
| Value | Native ETH transferred | Many DApp calls have `0 ETH` value but still move tokens |
| Transaction Fee | Gas actually paid | Useful for cost tracking |
| Gas Price / Max Fee | Fee parameters | High settings do not always mean full amount was spent |
| Input Data | Encoded contract call | Critical for understanding DApp interactions |

### Token Transfers

Many Ethereum transactions do not show ETH movement but still move ERC-20 or NFT assets. Check:

- `ERC-20 Tokens Transferred`.
- `ERC-721 Tokens Transferred`.
- `ERC-1155 Tokens Transferred`.

If a transaction has `Value: 0 ETH` but token transfers show USDC or an NFT leaving your wallet, assets still moved.

### Logs and Events

Events are emitted by contracts and indexed by explorers. For ERC-20 transfers, the `Transfer` event is how explorers know token balances changed.

For developers, logs are essential for debugging. If a contract call succeeded but the frontend state looks wrong, check whether expected events were emitted.

## Read a Bitcoin Transaction

Bitcoin uses the UTXO model, not the account model.

Ethereum mental model:

```text
address balance increases or decreases
```

Bitcoin mental model:

```text
transactions consume old UTXOs and create new UTXOs
```

On mempool.space, check:

| Field | Meaning |
|-------|---------|
| Inputs | UTXOs being spent |
| Outputs | New UTXOs being created |
| Fee | Total satoshis paid to miners |
| Fee rate | sat/vB, the main confirmation priority signal |
| Size / vSize | Transaction weight and virtual size |
| Confirmation count | Whether the transaction is final enough for your use case |

### Change Output

A Bitcoin payment often creates a change output back to the sender. If you spend a 0.1 BTC UTXO to pay 0.03 BTC, the transaction may create:

- 0.03 BTC to recipient.
- 0.0699 BTC back to your change address.
- 0.0001 BTC fee.

Do not assume every output is a payment to someone else.

### SegWit and Taproot

Address prefixes help identify script types:

| Prefix | Type |
|--------|------|
| `1...` | Legacy P2PKH |
| `3...` | P2SH or wrapped SegWit |
| `bc1q...` | Native SegWit |
| `bc1p...` | Taproot |

SegWit and Taproot transactions are usually more fee-efficient than legacy transactions.

## Inspect a Smart Contract

Open a contract address on Etherscan. Important tabs:

- **Transactions**: external transactions involving the contract.
- **Internal Txns**: calls made by contracts during execution.
- **Token Transfers**: ERC-20 or NFT movement.
- **Contract**: source code, ABI, read/write functions.
- **Events**: raw emitted logs.

### Verified Source Code

A verified contract shows source code that matches deployed bytecode. This does not guarantee safety, but it is a basic transparency requirement.

Red flags:

- Contract is not verified.
- Contract uses a proxy but implementation is unclear.
- Owner has powerful mint, pause, blacklist, or upgrade permissions.
- Source code imports unknown libraries.
- The contract has very little transaction history but claims huge adoption.

### Read Contract

The `Read Contract` tab lets you call view functions without gas. Examples:

- `totalSupply()`.
- `balanceOf(address)`.
- `owner()`.
- `paused()`.
- `decimals()`.

### Write Contract

The `Write Contract` tab lets you send transactions directly. Be careful: using it bypasses a normal DApp UI. Only use it if you understand the function and parameters.

## Track Wallets and Large Holders

On an address page, you can inspect:

- ETH balance.
- Token balances.
- NFT holdings.
- Transaction history.
- Contract interactions.
- Labels and name tags.

Useful patterns:

- Check whether a project treasury address matches official docs.
- Watch vesting wallets and token unlock flows.
- Follow bridge inflows/outflows.
- Investigate phishing addresses.
- Check whether a “whale” wallet actually belongs to a known exchange or contract.

Do not overinterpret a single address. Many entities use multiple wallets, custodians, contracts, and exchange deposit addresses.

## Approval and Token Transfer Safety

ERC-20 approvals are one of the most important things to understand.

An approval means:

```text
owner allows spender to transfer up to amount of token
```

Risky patterns:

- Unlimited approvals to unknown contracts.
- Approvals signed on phishing sites.
- Permit or Permit2 signatures that grant spending power without an immediate transaction.
- Old approvals left active after using a DApp once.

Safety habits:

- Use [Revoke.cash](https://revoke.cash/) or DeBank to review approvals.
- Prefer limited allowances.
- Revoke approvals for DApps you no longer use.
- Keep large holdings in a wallet that does not connect to new sites.

## Common Questions

### What should I do if a transaction is pending?

Check fee rate, nonce, and network congestion. On EVM chains, a stuck low-nonce transaction can block later transactions from the same account. Use wallet “speed up” or “cancel” if supported.

### What does “Internal Transaction” mean?

It means a contract triggered another ETH transfer or contract call during execution. It is not a separate user-signed transaction, but it can still move value.

### Why did I pay gas for a failed transaction?

If the transaction was included in a block and then reverted, validators still spent computation executing it. Gas pays for attempted computation, not guaranteed success.

### Why does a contract show “Proxy”?

A proxy stores state and delegates logic to an implementation contract. This enables upgrades, but also introduces upgrade authority risk. Always inspect the implementation and admin permissions.

### Why does a token appear in my wallet that I never bought?

It may be spam, dusting, or a phishing lure. Do not visit links embedded in token names or NFT metadata. Do not interact with unknown tokens just because they appeared.

## Summary

You learned how to:

- Read Ethereum transaction fields.
- Understand token transfers and event logs.
- Read Bitcoin UTXO transactions.
- Inspect verified smart contracts and proxies.
- Track wallet activity.
- Recognize approval and explorer-based safety risks.

Block explorers are not optional tools. They are how builders, users, auditors, and researchers verify what happened on-chain.

## Further Reading

- [Etherscan](https://etherscan.io/)
- [mempool.space](https://mempool.space/)
- [Revoke.cash](https://revoke.cash/)
- [Ethereum JSON-RPC](https://ethereum.org/developers/docs/apis/json-rpc/)
- [Bitcoin Developer Documentation](https://developer.bitcoin.org/)
