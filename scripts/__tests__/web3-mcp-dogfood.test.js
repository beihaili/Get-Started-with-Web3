import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { runDogfood } from '../dogfood-web3-mcp.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

describe('web3 MCP dogfood', () => {
  it('answers realistic learning questions through MCP tools', async () => {
    const report = await runDogfood({
      projectRoot,
      log: () => {},
    });

    expect(report.ok).toBe(true);
    expect(report.checks.every((check) => check.ok)).toBe(true);
    expect(report.checks.map((check) => check.name)).toEqual(
      expect.arrayContaining([
        'search smart contract security',
        'search stablecoin risk lesson',
        'compose bitcoin rpc context',
        'builder learning path',
        'researcher learning path',
        'investor learning path',
        'read smart account lesson',
        'monetizable metadata',
      ])
    );
  }, 30000);
});
