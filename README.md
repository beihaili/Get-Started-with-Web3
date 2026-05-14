# Get Started with Web3

[![GitHub stars](https://img.shields.io/github/stars/beihaili/Get-Started-with-Web3)](https://github.com/beihaili/Get-Started-with-Web3/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/beihaili/Get-Started-with-Web3)](https://github.com/beihaili/Get-Started-with-Web3/network/members)
[![License: MIT](https://img.shields.io/github/license/beihaili/Get-Started-with-Web3)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Deploy](https://github.com/beihaili/Get-Started-with-Web3/actions/workflows/deploy.yml/badge.svg)](https://github.com/beihaili/Get-Started-with-Web3/actions/workflows/deploy.yml)

<div align="center">
  <img src="./logo.png" alt="Get Started with Web3 Logo" width="900" />
</div>

<div align="center">
  <strong>An open-source, bilingual, AI-native Web3 curriculum for beginners, builders, and agents.</strong><br/>
  <em>11 modules, 58 lessons, AI Tutor, badges, SEO prerendering, llms.txt, and a read-only MCP server.</em>
</div>

<br/>

<div align="center">
  <a href="https://beihaili.github.io/Get-Started-with-Web3/">Live Site</a> &nbsp;|&nbsp;
  <a href="https://beihaili.github.io/Get-Started-with-Web3/en/articles">All Articles</a> &nbsp;|&nbsp;
  <a href="https://beihaili.github.io/Get-Started-with-Web3/llms.txt">llms.txt</a> &nbsp;|&nbsp;
  <a href="README.zh.md">中文说明</a> &nbsp;|&nbsp;
  <a href="https://twitter.com/bhbtc1337">Twitter</a>
</div>

---

## Why This Exists

Web3 is hard to learn because beginner tutorials, protocol docs, security warnings, and builder examples are scattered everywhere. This project turns that mess into a structured learning path that can be read by humans and queried by AI agents.

If this repo helps you learn or teach Web3, please [star the project](https://github.com/beihaili/Get-Started-with-Web3) so more learners can find it.

## Who This Is For

| Audience        | Use this project to                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| **Beginners**   | Create a wallet, make a first transaction, avoid common scams, and understand the core Web3 workflow.      |
| **Builders**    | Move from concepts to DApps, smart contracts, block explorers, Bitcoin RPC, DeFi, L2, and DAO tooling.     |
| **Researchers** | Review Bitcoin, Ethereum, DeFi, L2, DAO, bridge, and stablecoin concepts in one curriculum.                |
| **AI agents**   | Search, read, cite, and compose course context through `llms.txt`, JSON artifacts, and a local MCP server. |
| **Sponsors**    | Support open-source Web3 education and reach learners before they choose their default tools.              |

## What Is Inside

| Area            | Current status                                                                |
| --------------- | ----------------------------------------------------------------------------- |
| Course modules  | 11 modules                                                                    |
| Lessons         | 58 lessons in the React course map                                            |
| AI-native index | 106 indexed bilingual lesson entries                                          |
| Glossary        | 45 Web3 terms                                                                 |
| Languages       | Chinese first, English in progress                                            |
| App features    | AI Tutor, search, quizzes, badges, XP, dark/light mode, PWA/offline support   |
| Agent surfaces  | `llms.txt`, AI manifest, content index, local read-only MCP server            |
| Monetization    | Donations, affiliate disclosure, sponsor kit, future x402-ready tool metadata |

## Live Site

Use the hosted learning platform:

**https://beihaili.github.io/Get-Started-with-Web3/**

Public AI entrypoints:

- [llms.txt](https://beihaili.github.io/Get-Started-with-Web3/llms.txt)
- [AI manifest](https://beihaili.github.io/Get-Started-with-Web3/ai/manifest.json)
- [AI content index](https://beihaili.github.io/Get-Started-with-Web3/ai/content-index.json)

## Course Map

| Module                               | Lessons | Focus                                                                                               |
| ------------------------------------ | ------: | --------------------------------------------------------------------------------------------------- |
| Web3 Quick Start                     |       7 | Wallets, first transaction, DApp interaction, useful tools, token launch, security, CEX basics      |
| Bitcoin: Cryptography and Data Layer |       8 | Hashing, signatures, transactions, multisig, SegWit, Taproot, data structures                       |
| Bitcoin: Network and Consensus Layer |       6 | Bitcoin Core, P2P, network security, proof-of-work, difficulty, forks and BIPs                      |
| Bitcoin: Application Layer           |       7 | Wallets, RPC development, low-fee broadcast, Bitcoin Script, governance, Ordinals, cross-chain DeFi |
| Web3 Deep Thinking                   |       3 | Principles, sovereignty, blockchain necessity, Bitcoin cultural references                          |
| Web3 Ecosystem and Tools             |       6 | DeFi, Ethereum, Layer 2, emerging chains, AI x Web3, practical tools                                |
| Web3 Builder Lab                     |       4 | ERC-20 deployment, first DApp, block explorer reading, smart contract security                      |
| DeFi Deep Dive                       |       5 | DeFi architecture, AMMs, lending, stablecoins, risks                                                |
| Cross-Chain and Layer 2              |       5 | Scaling, rollups, L2 ecosystems, bridges, practical L2 usage                                        |
| DAO and Decentralized Governance     |       5 | DAO basics, governance design, DAO tooling, case studies, challenges                                |
| Ethereum and Smart Accounts          |       2 | Post-Pectra/Fusaka Ethereum, account abstraction, smart wallets                                     |

## Quick Start

```bash
git clone https://github.com/beihaili/Get-Started-with-Web3.git
cd Get-Started-with-Web3
npm install
npm run dev
```

The dev server starts at `http://localhost:5173/Get-Started-with-Web3/`.

Useful commands:

```bash
npm run build      # production build, OG images, sitemap, prerender
npm test           # Vitest suite
npm run lint       # ESLint
npm run ai:verify  # verify public AI entrypoints and x402 metadata
```

## AI Agents and MCP

This repository exposes a machine-readable content layer for AI agents:

```bash
npm run ai:index   # regenerate ai/manifest.json, ai/content-index.json, ai/llms.txt
npm run ai:publish # copy AI artifacts into public/
npm run ai:verify  # verify public AI entrypoints and x402 metadata
npm run mcp:web3   # start the local read-only stdio MCP server
```

Example agent workflow:

```bash
npm run mcp:web3
```

Then connect an MCP client and use:

- `search_web3_content` to find relevant lessons and glossary entries.
- `read_web3_lesson` to read a lesson with citations.
- `get_learning_path` to get role-based beginner, builder, researcher, or investor paths.
- `lookup_web3_glossary` to explain Web3 terms.
- `compose_web3_context` to build a bounded context pack with citations.
- `list_monetizable_tools` to inspect future x402-ready paid-tool metadata.

Local MCP tools are read-only. They do not enforce payment, sign transactions, or perform chain operations. x402 fields are reserved metadata for future hosted paid tools.

## Tech Stack

- **Frontend:** React 19 + Vite + Tailwind CSS
- **State:** Zustand
- **Routing:** React Router
- **Content:** Markdown in `zh/` and `en/`
- **Rendering:** react-markdown + remark-gfm + rehype-raw
- **AI Tutor:** Gemini with user-provided API key
- **Agent layer:** `@modelcontextprotocol/sdk`, generated JSON artifacts, `llms.txt`
- **SEO:** sitemap generation, OG image generation, prerendering
- **Testing:** Vitest + happy-dom + Testing Library
- **CI/CD:** GitHub Actions to GitHub Pages

## Contributing

Good first contributions:

- Fix outdated or unclear lesson content.
- Proofread English translations.
- Add quiz questions or glossary entries.
- Improve accessibility, mobile UX, or tests.
- Add examples, diagrams, and case studies.

Start here:

- [Contributing guide](CONTRIBUTING.md)
- [Open good first issues](https://github.com/beihaili/Get-Started-with-Web3/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
- [All issues](https://github.com/beihaili/Get-Started-with-Web3/issues)

## Support and Sponsorship

This project keeps learning content free. Support helps fund maintenance, translation, new lessons, and AI-native tooling.

- **GitHub Sponsors:** [github.com/sponsors/beihaili](https://github.com/sponsors/beihaili)
- **Buy Me a Coffee:** [buymeacoffee.com/beihaili](https://buymeacoffee.com/beihaili)
- **Sponsor kit:** [docs/strategy/2026-05-14-sponsor-kit.md](docs/strategy/2026-05-14-sponsor-kit.md)
- **ETH / EVM:** `0xb7Cd29C78B97cdf0A6e6FFC9268d43eDc3eCa649`
- **BTC:** `1GihPqLkjJNK2fzCMSicc9mLapKeGy3Vv1`
- **Binance:** [Register with referral link](https://www.bsmkweb.cc/register?ref=39797374) (20% fee rebate)

Some outbound links may be affiliate or sponsor links and are disclosed where used.

## Community

- **Twitter/X:** [@bhbtc1337](https://twitter.com/bhbtc1337)
- **WeChat group:** [Apply via Google Form](https://forms.gle/QMBwL6LwZyQew1tX8)
- **GitHub Issues:** [Ask questions and give feedback](https://github.com/beihaili/Get-Started-with-Web3/issues)

## Contributors

<a href="https://github.com/beihaili/Get-Started-with-Web3/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=beihaili/Get-Started-with-Web3" />
</a>

## License

[MIT License](LICENSE) — free to use, modify, and distribute.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=beihaili/Get-Started-with-Web3&type=Date)](https://star-history.com/#beihaili/Get-Started-with-Web3&Date)
