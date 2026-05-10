# AI-Native MCP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build generated AI-native content artifacts and a local read-only MCP server for Get-Started-with-Web3.

**Architecture:** A deterministic Node.js indexer writes `ai/manifest.json`, `ai/content-index.json`, and `ai/llms.txt`. Pure content-service functions power both tests and the MCP server. The local MCP server uses stdio and the official TypeScript MCP SDK, with future x402 pricing exposed as metadata only.

**Tech Stack:** Node.js ESM, Vitest, Fuse.js-style simple scoring, `@modelcontextprotocol/sdk`, `zod`.

---

## File Structure

- Create `scripts/ai-content-core.mjs`: shared pure functions for Markdown extraction, course flattening, search, reading lessons, context composition, and x402 metadata.
- Create `scripts/generate-ai-index.mjs`: CLI wrapper that writes generated artifacts under `ai/`.
- Create `scripts/web3-mcp-server.mjs`: stdio MCP server registering read-only tools/resources/prompts.
- Create `scripts/__tests__/ai-content-core.test.js`: unit tests for index generation and service behavior.
- Create `scripts/__tests__/web3-mcp-server.test.js`: stdio MCP smoke test.
- Modify `package.json`: add `ai:index`, `mcp:web3`, and MCP dependencies.
- Create generated artifacts: `ai/manifest.json`, `ai/content-index.json`, `ai/llms.txt`.
- Create/update `AGENTS.md`: document the new AI-native/MCP layer.

## Tasks

### Task 1: Add Failing Tests for AI Content Core

- [ ] Create `scripts/__tests__/ai-content-core.test.js`.
- [ ] Assert that `buildAiIndex()` returns repo metadata, two languages, modules, lessons, citations, and tool pricing metadata.
- [ ] Assert that `searchContent()` finds Bitcoin/RPC content and returns citations.
- [ ] Assert that `readLesson()` reads a Chinese and English lesson.
- [ ] Assert that `composeContext()` returns bounded excerpts with citations.
- [ ] Run `npx vitest run scripts/__tests__/ai-content-core.test.js`; expected failure is module not found.

### Task 2: Implement AI Content Core

- [ ] Create `scripts/ai-content-core.mjs`.
- [ ] Import `COURSE_DATA` and `GLOSSARY_DATA`.
- [ ] Read Markdown from `zh/` and `en/`, accepting both `README.md` and `README.MD`.
- [ ] Extract title, excerpt, headings, code block count, word/character count, local path, GitHub URL, and site URL.
- [ ] Implement search, lesson read, glossary lookup, learning-path, context composition, and x402 tool metadata.
- [ ] Run the Task 1 test; expected pass.

### Task 3: Generate AI Artifacts

- [ ] Create `scripts/generate-ai-index.mjs`.
- [ ] Add `npm run ai:index`.
- [ ] Run `npm run ai:index`.
- [ ] Verify `ai/manifest.json`, `ai/content-index.json`, and `ai/llms.txt` exist and contain no placeholder strings.

### Task 4: Add MCP Server and Smoke Test

- [ ] Install `@modelcontextprotocol/sdk` and `zod`.
- [ ] Create `scripts/__tests__/web3-mcp-server.test.js` that starts the server over stdio and calls `search_web3_content`.
- [ ] Create `scripts/web3-mcp-server.mjs`.
- [ ] Register tools: `search_web3_content`, `read_web3_lesson`, `get_learning_path`, `lookup_web3_glossary`, `compose_web3_context`, and `list_monetizable_tools`.
- [ ] Register resources: `web3://manifest` and `web3://content-index`.
- [ ] Register prompts: `web3_lesson_tutor` and `web3_builder_plan`.
- [ ] Add `npm run mcp:web3`.
- [ ] Run MCP smoke test; expected pass.

### Task 5: Documentation and Full Verification

- [ ] Create/update `AGENTS.md` with the AI-native layer and commands.
- [ ] Run `npm run ai:index`.
- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `git status --short` and inspect changed files.
