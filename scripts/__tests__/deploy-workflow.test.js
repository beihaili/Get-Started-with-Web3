import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

describe('deploy workflow PR feedback', () => {
  it('posts an updatable PR comment with a build artifact link', async () => {
    const workflow = await readFile(path.join(projectRoot, '.github/workflows/deploy.yml'), 'utf8');

    expect(workflow).toContain("if: github.event_name == 'pull_request'");
    expect(workflow).toContain('actions/upload-artifact@v4');
    expect(workflow).toContain('path: ./dist');
    expect(workflow).toContain('GITHUB_RUN_ID');
    expect(workflow).toContain('/actions/runs/');
    expect(workflow).toContain('<!-- pr-preview-artifact-link -->');
    expect(workflow).toContain('github.rest.issues.listComments');
    expect(workflow).toContain('github.rest.issues.updateComment');
    expect(workflow).toContain('github.rest.issues.createComment');
  });
});
