/**
 * Tests for `lib/prompt-evolution.ts` — Wave C.1.4 (issue #156).
 *
 * Covers the two halves of the JSONL evolution log discipline:
 *
 *   (a) Writer side — `appendJsonlSync`, `buildGenesisEntry`,
 *       `ensureGenesis`, `appendPromptEvolutionEntry`. Genesis line
 *       shape per synthesis §7; every line ends with `\n`; existing-file
 *       guard for ensureGenesis idempotency.
 *
 *   (b) Reader side — `foldChain`. Folds genesis-only chains, multi-
 *       patch chains, asserts byte-equal to the on-disk spec, and
 *       refuses corrupt chains (parent linkage broken, postHash drift,
 *       malformed JSONL line, RFC 6902 op fail).
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  appendJsonlSync,
  appendPromptEvolutionEntry,
  buildGenesisEntry,
  contentHash,
  ensureGenesis,
  foldChain,
} from '../prompt-evolution.js';
import type { PromptEvolutionEntry } from '../prompt-evolution.js';
import { canonicalize } from '../canonical-json.js';

// ---------------------------------------------------------------------------
// Test scaffolding
// ---------------------------------------------------------------------------

let testDir: string;

beforeEach(() => {
  testDir = mkdtempSync(join(tmpdir(), 'gobbi-prompt-evolution-'));
});

afterEach(() => {
  rmSync(testDir, { recursive: true, force: true });
});

const BASELINE_SPEC = {
  $schema: 'https://gobbi.dev/schemas/step-spec/v1.json',
  version: 1,
  meta: { description: 'baseline', substates: [] },
};

const SCHEMA_ID = 'https://gobbi.dev/schemas/step-spec/v1.json';

// ---------------------------------------------------------------------------
// contentHash
// ---------------------------------------------------------------------------

describe('contentHash', () => {
  test('returns a sha256: hex digest with stable prefix', () => {
    const out = contentHash({ a: 1 });
    expect(out).toMatch(/^sha256:[a-f0-9]{64}$/);
  });

  test('same input produces the same digest', () => {
    expect(contentHash({ a: 1 })).toBe(contentHash({ a: 1 }));
  });

  test('different input produces different digest', () => {
    expect(contentHash({ a: 1 })).not.toBe(contentHash({ a: 2 }));
  });

  test('hash is over canonicalize() bytes — insertion-order matters', () => {
    // Different insertion-order objects produce different hashes.
    expect(contentHash({ a: 1, b: 2 })).not.toBe(contentHash({ b: 2, a: 1 }));
  });
});

// ---------------------------------------------------------------------------
// appendJsonlSync
// ---------------------------------------------------------------------------

describe('appendJsonlSync', () => {
  test('writes one line ending with \\n on a fresh file', () => {
    const path = join(testDir, 'a.jsonl');
    appendJsonlSync(path, '{"k":1}');
    expect(readFileSync(path, 'utf8')).toBe('{"k":1}\n');
  });

  test('appends a second line preserving the prior content', () => {
    const path = join(testDir, 'a.jsonl');
    appendJsonlSync(path, '{"k":1}');
    appendJsonlSync(path, '{"k":2}');
    expect(readFileSync(path, 'utf8')).toBe('{"k":1}\n{"k":2}\n');
  });

  test('parsed back, both lines round-trip', () => {
    const path = join(testDir, 'a.jsonl');
    appendJsonlSync(path, JSON.stringify({ a: 1 }));
    appendJsonlSync(path, JSON.stringify({ a: 2 }));
    const lines = readFileSync(path, 'utf8').split('\n').filter((l) => l);
    expect(lines.map((l) => JSON.parse(l))).toEqual([{ a: 1 }, { a: 2 }]);
  });
});

// ---------------------------------------------------------------------------
// buildGenesisEntry / ensureGenesis
// ---------------------------------------------------------------------------

describe('buildGenesisEntry', () => {
  test('produces a parentPatchId=null entry with the baseline spec as a single add op at root path', () => {
    const entry = buildGenesisEntry({
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    expect(entry.parentPatchId).toBeNull();
    expect(entry.ops).toEqual([
      { op: 'add', path: '', value: BASELINE_SPEC },
    ]);
    expect(entry.appliedBy).toBe('operator');
    expect(entry.validationStatus).toBe('passed');
    expect(entry.v).toBe(1);
  });

  test('preHash hashes the empty-object baseline (genesis convention)', () => {
    const entry = buildGenesisEntry({
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    expect(entry.preHash).toBe(contentHash({}));
  });

  test('postHash hashes the baseline spec', () => {
    const entry = buildGenesisEntry({
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    expect(entry.postHash).toBe(contentHash(BASELINE_SPEC));
  });

  test('patchId hashes the canonicalized ops array', () => {
    const entry = buildGenesisEntry({
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    expect(entry.patchId).toBe(
      contentHash([{ op: 'add', path: '', value: BASELINE_SPEC }]),
    );
  });
});

describe('ensureGenesis', () => {
  test('writes the genesis line to a fresh path', () => {
    const path = join(testDir, 'ideation.jsonl');
    expect(existsSync(path)).toBe(false);

    const entry = ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    expect(existsSync(path)).toBe(true);
    const raw = readFileSync(path, 'utf8');
    const parsed = JSON.parse(raw.trim()) as PromptEvolutionEntry;
    expect(parsed.patchId).toBe(entry.patchId);
    expect(parsed.parentPatchId).toBeNull();
  });

  test('idempotent — re-running on an existing file does NOT append a duplicate line', () => {
    const path = join(testDir, 'ideation.jsonl');
    const first = ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    const second = ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 99,
    });

    // Same returned shape (computed from inputs, not from file read).
    expect(second.patchId).toBe(first.patchId);

    // File has exactly one line.
    const raw = readFileSync(path, 'utf8');
    expect(raw.split('\n').filter((l) => l).length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// appendPromptEvolutionEntry
// ---------------------------------------------------------------------------

describe('appendPromptEvolutionEntry', () => {
  test('appends a non-genesis entry as a new line', () => {
    const path = join(testDir, 'ideation.jsonl');
    ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    const genesis = buildGenesisEntry({
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    const ops = [{ op: 'replace' as const, path: '/version', value: 1 }];
    const next: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:01:00Z',
      promptId: 'ideation',
      patchId: contentHash(ops),
      parentPatchId: genesis.patchId,
      preHash: genesis.postHash,
      postHash: contentHash({ ...BASELINE_SPEC, version: 1 }),
      ops,
      validationStatus: 'passed',
      appliedBy: 'operator',
      eventSeq: 2,
      schemaId: SCHEMA_ID,
    };

    appendPromptEvolutionEntry(path, next);

    const lines = readFileSync(path, 'utf8').split('\n').filter((l) => l);
    expect(lines.length).toBe(2);
    expect(JSON.parse(lines[1]!).parentPatchId).toBe(genesis.patchId);
  });
});

// ---------------------------------------------------------------------------
// foldChain — replay-equivalence smoke
// ---------------------------------------------------------------------------

describe('foldChain', () => {
  test('genesis-only chain folds back to the baseline spec byte-equal', () => {
    const path = join(testDir, 'ideation.jsonl');
    ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    const result = foldChain(path);
    expect(result.entryCount).toBe(1);
    expect(canonicalize(result.spec)).toBe(canonicalize(BASELINE_SPEC));
    expect(result.lastPostHash).toBe(contentHash(BASELINE_SPEC));
  });

  test('multi-patch chain folds to the same spec the patches produce when applied in sequence', () => {
    const path = join(testDir, 'ideation.jsonl');
    const genesis = ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    // Patch 1 — change description.
    const ops1 = [
      { op: 'replace' as const, path: '/meta/description', value: 'updated' },
    ];
    const intermediate = { ...BASELINE_SPEC, meta: { ...BASELINE_SPEC.meta, description: 'updated' } };
    const entry1: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:01:00Z',
      promptId: 'ideation',
      patchId: contentHash(ops1),
      parentPatchId: genesis.patchId,
      preHash: genesis.postHash,
      postHash: contentHash(intermediate),
      ops: ops1,
      validationStatus: 'passed',
      appliedBy: 'operator',
      eventSeq: 2,
      schemaId: SCHEMA_ID,
    };
    appendPromptEvolutionEntry(path, entry1);

    // Patch 2 — add a new field.
    const ops2 = [{ op: 'add' as const, path: '/meta/note', value: 'hello' }];
    const finalSpec = { ...intermediate, meta: { ...intermediate.meta, note: 'hello' } };
    const entry2: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:02:00Z',
      promptId: 'ideation',
      patchId: contentHash(ops2),
      parentPatchId: entry1.patchId,
      preHash: entry1.postHash,
      postHash: contentHash(finalSpec),
      ops: ops2,
      validationStatus: 'passed',
      appliedBy: 'operator',
      eventSeq: 3,
      schemaId: SCHEMA_ID,
    };
    appendPromptEvolutionEntry(path, entry2);

    const result = foldChain(path);
    expect(result.entryCount).toBe(3);
    expect(canonicalize(result.spec)).toBe(canonicalize(finalSpec));
  });

  test('refuses a chain whose genesis carries a non-null parentPatchId', () => {
    const path = join(testDir, 'ideation.jsonl');
    const broken: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:00:00Z',
      promptId: 'ideation',
      patchId: 'sha256:fake',
      parentPatchId: 'sha256:not-null',
      preHash: contentHash({}),
      postHash: contentHash(BASELINE_SPEC),
      ops: [{ op: 'add', path: '', value: BASELINE_SPEC }],
      validationStatus: 'passed',
      appliedBy: 'operator',
      eventSeq: 1,
      schemaId: SCHEMA_ID,
    };
    appendJsonlSync(path, JSON.stringify(broken));

    expect(() => foldChain(path)).toThrow(/genesis line must have parentPatchId=null/);
  });

  test('refuses a chain whose subsequent line breaks parent linkage', () => {
    const path = join(testDir, 'ideation.jsonl');
    const genesis = ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    const orphan: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:01:00Z',
      promptId: 'ideation',
      patchId: 'sha256:orphan',
      parentPatchId: 'sha256:wrong-parent',
      preHash: genesis.postHash,
      postHash: genesis.postHash,
      ops: [],
      validationStatus: 'passed',
      appliedBy: 'operator',
      eventSeq: 2,
      schemaId: SCHEMA_ID,
    };
    appendPromptEvolutionEntry(path, orphan);

    expect(() => foldChain(path)).toThrow(/parentPatchId=.*does not match prior/);
  });

  test('refuses a chain whose declared postHash drifts from the computed one', () => {
    const path = join(testDir, 'ideation.jsonl');
    const genesis = buildGenesisEntry({
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    // Mutate postHash to a wrong value.
    const broken = { ...genesis, postHash: 'sha256:wrong' };
    appendJsonlSync(path, JSON.stringify(broken));

    expect(() => foldChain(path)).toThrow(/postHash mismatch/);
  });

  test('refuses a chain with malformed JSONL', () => {
    const path = join(testDir, 'ideation.jsonl');
    writeFileSync(path, 'not-json\n');
    expect(() => foldChain(path)).toThrow();
  });

  test('refuses a missing file with a clear diagnostic', () => {
    const path = join(testDir, 'never-existed.jsonl');
    expect(() => foldChain(path)).toThrow(/file not found/);
  });

  test('refuses an empty file with a clear diagnostic', () => {
    const path = join(testDir, 'empty.jsonl');
    writeFileSync(path, '');
    expect(() => foldChain(path)).toThrow(/file is empty/);
  });

  test('refuses a chain with an unknown promptId enum value', () => {
    const path = join(testDir, 'ideation.jsonl');
    const genesis = buildGenesisEntry({
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    const malformed = { ...genesis, promptId: 'unknown-step' };
    appendJsonlSync(path, JSON.stringify(malformed));
    expect(() => foldChain(path)).toThrow(/promptId is not a valid prompt-id/);
  });

  test('refuses a chain whose RFC 6902 op fails to apply', () => {
    const path = join(testDir, 'ideation.jsonl');
    const genesis = ensureGenesis({
      path,
      promptId: 'ideation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    // RFC 6902 `test` op deliberately set to a failing value.
    const ops = [{ op: 'test' as const, path: '/version', value: 999 }];
    const bogus: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:01:00Z',
      promptId: 'ideation',
      patchId: contentHash(ops),
      parentPatchId: genesis.patchId,
      preHash: genesis.postHash,
      postHash: genesis.postHash,
      ops,
      validationStatus: 'passed',
      appliedBy: 'operator',
      eventSeq: 2,
      schemaId: SCHEMA_ID,
    };
    appendPromptEvolutionEntry(path, bogus);

    expect(() => foldChain(path)).toThrow(/applyPatch failed/);
  });
});
