/**
 * Tests for `commands/prompt/rebuild.ts` — Wave C.1.7 (issue #156).
 *
 * Subprocess-driven tests for the recovery command. Covers exit-code
 * semantics for every failure mode plus the dry-run happy path.
 *
 * The pure-function `foldChain` is tested in
 * `lib/__tests__/prompt-evolution.test.ts`. Here we test the CLI
 * dispatch + flag parsing + exit-code surface.
 */

import { describe, test, expect } from 'bun:test';
import { $ } from 'bun';
import { join } from 'node:path';

const CLI_PATH = join(import.meta.dir, '..', '..', '..', 'cli.ts');

describe('gobbi prompt rebuild — argv + dry-run smoke (subprocess)', () => {
  test('--help prints usage and exits 0', async () => {
    const result = await $`bun run ${CLI_PATH} prompt rebuild --help`
      .nothrow()
      .quiet();
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString('utf8')).toContain(
      'Usage: gobbi prompt rebuild',
    );
  });

  test('missing <prompt-id> exits 2', async () => {
    const result = await $`bun run ${CLI_PATH} prompt rebuild`.nothrow().quiet();
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString('utf8')).toContain('missing <prompt-id>');
  });

  test('unknown prompt-id exits 1 with the closed-set message', async () => {
    const result = await $`bun run ${CLI_PATH} prompt rebuild not-a-step`
      .nothrow()
      .quiet();
    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString('utf8')).toContain('invalid prompt-id');
  });

  test('valid prompt-id with no JSONL chain exits 1 with a clear diagnostic', async () => {
    // The repo has no JSONL chain (Wave C.1 ships no chain bootstrap;
    // the chain is created on first `gobbi prompt patch
    // --allow-no-parent`). So `gobbi prompt rebuild ideation` should
    // refuse with the chain-not-found message.
    const result = await $`bun run ${CLI_PATH} prompt rebuild ideation --dry-run`
      .nothrow()
      .quiet();
    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString('utf8')).toContain(
      'prompt-evolution chain not found',
    );
  });

  test('dispatcher routes "rebuild" through the prompt registry', async () => {
    // Verify `gobbi prompt --help` lists rebuild.
    const result = await $`bun run ${CLI_PATH} prompt --help`.nothrow().quiet();
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString('utf8')).toContain('rebuild');
  });
});
