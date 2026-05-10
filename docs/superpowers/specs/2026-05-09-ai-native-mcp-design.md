# AI-Native Content Index and MCP Design Spec

**Date**: 2026-05-09
**Status**: Approved for MVP implementation
**Author**: beihai + Codex

## Context

Get-Started-with-Web3 is already a bilingual Web3 learning platform with React pages, Markdown lessons, search, quizzes, glossary data, AI Tutor, donations, SEO build scripts, and an NFT certificate contract. The missing layer is a stable interface for AI agents. Today, agents can scrape files, but they cannot discover lessons, cite content, request a focused reading bundle, or distinguish free and future paid capabilities through a formal API.

## Goal

Build a local, read-only MCP server and AI-native content index so AI agents can search, read, cite, and compose Web3 learning content from this repository. The MVP must also expose payment metadata for future remote x402-paid tools without implementing live payment settlement.

## Non-Goals

- No remote hosted MCP endpoint in this MVP.
- No x402 verification, settlement, wallet signing, or facilitator integration in this MVP.
- No vector database or embedding service dependency.
- No modification to lesson Markdown content.
- No write-capable MCP tools.

## Architecture

The MVP has three layers:

1. **Index generation**: a Node.js script reads `COURSE_DATA`, `GLOSSARY_DATA`, and Markdown files under `zh/` and `en/`, then writes deterministic JSON and text artifacts under `ai/`.
2. **Content service**: reusable pure functions load the generated index, search lessons/glossary, read lessons, and compose citation-rich context bundles.
3. **Local MCP server**: a stdio MCP server exposes the content service as read-only tools/resources/prompts for local AI clients such as Codex, Claude Desktop, Cursor, and other MCP hosts.

The React application remains unchanged except for `package.json` scripts. The MCP layer depends on generated artifacts and repository files, not the browser runtime.

## Generated Artifacts

- `ai/manifest.json`: machine-readable service manifest with repository metadata, languages, module/lesson counts, artifact paths, tool catalog, and future x402 pricing metadata.
- `ai/content-index.json`: compact searchable index of modules, lessons, content excerpts, headings, code block counts, availability by language, and canonical citations.
- `ai/llms.txt`: plain-text entrypoint for crawlers and agents, pointing to the manifest, index, MCP command, and source URLs.

These artifacts are committed so agents can consume them without running build scripts, while `npm run ai:index` can regenerate them.

## MCP Surface

### Tools

- `search_web3_content`: search lesson titles, headings, excerpts, and glossary definitions.
- `read_web3_lesson`: read a lesson by `lang` plus `moduleId`/`lessonId` or content path.
- `get_learning_path`: return a role-based learning path for beginner, builder, researcher, or investor.
- `lookup_web3_glossary`: search glossary terms.
- `compose_web3_context`: return a bounded context pack with citations for a topic.
- `list_monetizable_tools`: expose future x402-ready paid-tool metadata.

### Resources

- `web3://manifest`: the generated manifest JSON.
- `web3://content-index`: the generated content index JSON.

### Prompts

- `web3_lesson_tutor`: prompt template for teaching a topic with citations from this repository.
- `web3_builder_plan`: prompt template for turning a Web3 build goal into a study and implementation path.

## x402 Readiness

The MVP adds payment metadata only:

- free tools are marked `x402.enabled: false`;
- future paid tools include `x402.enabled: true`, `priceUsd`, `network`, and `route`;
- no production code enforces payment yet.

This keeps local learning open while making the later remote MCP/x402 server a straightforward wrapper around the same content service.

## Error Handling

- Missing generated index files produce actionable CLI errors telling the user to run `npm run ai:index`.
- Missing lesson files return structured "not found" errors with the attempted path and available alternatives where possible.
- Search and compose tools cap result counts and excerpt lengths so MCP responses stay agent-friendly.

## Testing

- Unit tests cover index generation shape, lesson reading, search, context composition, glossary lookup, and x402 metadata.
- A smoke test starts the MCP server through the official SDK client over stdio and calls `search_web3_content`.
- Existing `npm test` and `npm run lint` must pass.

## Acceptance Criteria

1. `npm run ai:index` writes `ai/manifest.json`, `ai/content-index.json`, and `ai/llms.txt`.
2. `npm run mcp:web3` starts a local stdio MCP server without stdout noise.
3. MCP clients can list tools and call `search_web3_content`.
4. Agents can read at least one Chinese and one English lesson through `read_web3_lesson`.
5. `compose_web3_context` returns citations pointing to repository files and public lesson URLs.
6. Future paid tool metadata is discoverable without enforcing payment.
7. `npm test` and `npm run lint` pass.
