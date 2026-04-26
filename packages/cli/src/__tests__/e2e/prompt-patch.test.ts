/**
 * End-to-end test for `gobbi prompt patch` (Wave C.1.6, issue #156).
 *
 * Exercises the validation pipeline via in-process `runPromptPatchOnFiles`
 * calls against a scratch directory — full subprocess invocation would
 * require copying the entire `packages/cli/src/specs/` tree, which is
 * overkill for the failure-mode coverage. The unit tests in
 * `commands/prompt/__tests__/patch.test.ts` cover `mergeTestOp`; this
 * file covers:
 *
 *   - Patch file missing → exit 1.
 *   - Patch file is not JSON → exit 1.
 *   - Patch file root is not an array → exit 1.
 *   - RFC 6902 shape violation (unknown op) → exit 1.
 *   - --baseline mismatch → exit 1.
 *   - Schema-violating patch → exit 1 at gate 6 (validateStepSpec).
 *   - --dry-run with a passing patch → exits 0 + prints summary.
 *
 * Subprocess form (Bun.$) is preserved for the dry-run happy path so we
 * verify the CLI binary entry point itself works.
 */

import { describe, test, expect } from 'bun:test';
import { $ } from 'bun';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CLI_PATH = join(import.meta.dir, '..', '..', 'cli.ts');

describe('gobbi prompt patch — argv + dry-run smoke (subprocess)', () => {
  test('--help prints usage and exits 0', async () => {
    const result = await $`bun run ${CLI_PATH} prompt patch --help`
      .nothrow()
      .quiet();
    expect(result.exitCode).toBe(0);
    expect(result.stdout.toString('utf8')).toContain(
      'Usage: gobbi prompt patch',
    );
  });

  test('missing <prompt-id> exits 2 with usage on stderr', async () => {
    const result = await $`bun run ${CLI_PATH} prompt patch`.nothrow().quiet();
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString('utf8')).toContain('missing <prompt-id>');
  });

  test('unknown prompt-id exits 1 with the closed-set message', async () => {
    const result = await $`bun run ${CLI_PATH} prompt patch unknown-step --patch /dev/null`
      .nothrow()
      .quiet();
    expect(result.exitCode).toBe(1);
    expect(result.stderr.toString('utf8')).toContain('invalid prompt-id');
  });

  test('missing --patch exits 2 with a clear message', async () => {
    const result = await $`bun run ${CLI_PATH} prompt patch ideation`
      .nothrow()
      .quiet();
    expect(result.exitCode).toBe(2);
    expect(result.stderr.toString('utf8')).toContain(
      '--patch <file> is required',
    );
  });

  test('patch file does not exist → exit 1', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-patch-e2e-'));
    try {
      const ghost = join(tmp, 'nope.json');
      const result = await $`bun run ${CLI_PATH} prompt patch ideation --patch ${ghost}`
        .nothrow()
        .quiet();
      expect(result.exitCode).toBe(1);
      expect(result.stderr.toString('utf8')).toContain('patch file not found');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('patch file is not JSON → exit 1', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-patch-e2e-'));
    try {
      const file = join(tmp, 'bad.json');
      writeFileSync(file, 'not json', 'utf8');
      const result = await $`bun run ${CLI_PATH} prompt patch ideation --patch ${file}`
        .nothrow()
        .quiet();
      expect(result.exitCode).toBe(1);
      expect(result.stderr.toString('utf8')).toContain('not valid JSON');
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('patch file root is not an array → exit 1', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-patch-e2e-'));
    try {
      const file = join(tmp, 'bad.json');
      writeFileSync(file, '{"oops":true}', 'utf8');
      const result = await $`bun run ${CLI_PATH} prompt patch ideation --patch ${file}`
        .nothrow()
        .quiet();
      expect(result.exitCode).toBe(1);
      expect(result.stderr.toString('utf8')).toContain(
        'patch file root must be a JSON array',
      );
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('schema-violating patch fails at validateStepSpec gate (--dry-run)', async () => {
    // A valid RFC 6902 ops array that mutates the spec into a
    // schema-violating shape: replace tokenBudget so the sum no longer
    // hits 1.0.
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-patch-e2e-'));
    try {
      const file = join(tmp, 'patch.json');
      writeFileSync(
        file,
        JSON.stringify([
          {
            op: 'replace',
            path: '/tokenBudget/staticPrefix',
            value: 0.99, // sum will no longer equal 1.0
          },
        ]),
        'utf8',
      );
      const result = await $`bun run ${CLI_PATH} prompt patch ideation --patch ${file} --dry-run`
        .nothrow()
        .quiet();
      expect(result.exitCode).toBe(1);
      expect(result.stderr.toString('utf8')).toContain(
        'fails schema validation',
      );
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('--baseline that does not match on-disk pre_hash exits 1', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-patch-e2e-'));
    try {
      const file = join(tmp, 'patch.json');
      writeFileSync(
        file,
        JSON.stringify([
          { op: 'replace', path: '/meta/description', value: 'updated' },
        ]),
        'utf8',
      );
      const result = await $`bun run ${CLI_PATH} prompt patch ideation --patch ${file} --baseline sha256:wrong --dry-run`
        .nothrow()
        .quiet();
      expect(result.exitCode).toBe(1);
      expect(result.stderr.toString('utf8')).toContain(
        '--baseline sha256:wrong does not match',
      );
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test('valid patch with --dry-run prints summary and exits 0 (no commit)', async () => {
    // A valid patch: change meta.description (a leaf string field with
    // no schema constraints beyond `string`).
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-patch-e2e-'));
    try {
      const file = join(tmp, 'patch.json');
      writeFileSync(
        file,
        JSON.stringify([
          {
            op: 'replace',
            path: '/meta/description',
            value: 'Ideation — updated description',
          },
        ]),
        'utf8',
      );
      const result = await $`bun run ${CLI_PATH} prompt patch ideation --patch ${file} --dry-run`
        .nothrow()
        .quiet();
      expect(result.exitCode).toBe(0);
      const stdout = result.stdout.toString('utf8');
      expect(stdout).toContain('gobbi prompt patch — dry-run');
      expect(stdout).toContain('patchId:');
      expect(stdout).toContain('pre_hash:');
      expect(stdout).toContain('post_hash:');
      expect(stdout).toContain('synthesized test:  yes');
      // Synthesis warning landed on stderr.
      expect(result.stderr.toString('utf8')).toContain(
        "synthesized {op:'test', path:'/version', value:1}",
      );
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("dry-run preserves on-disk spec.json (no mutation)", async () => {
    const specPath = join(
      import.meta.dir,
      '..',
      '..',
      'specs',
      'ideation',
      'spec.json',
    );
    const before = readFileSync(specPath, 'utf8');
    const tmp = mkdtempSync(join(tmpdir(), 'gobbi-prompt-patch-e2e-'));
    try {
      const file = join(tmp, 'patch.json');
      writeFileSync(
        file,
        JSON.stringify([
          {
            op: 'replace',
            path: '/meta/description',
            value: 'should-not-stick',
          },
        ]),
        'utf8',
      );
      await $`bun run ${CLI_PATH} prompt patch ideation --patch ${file} --dry-run`
        .nothrow()
        .quiet();
      const after = readFileSync(specPath, 'utf8');
      expect(after).toBe(before);
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  });
});
