/**
 * Replay-equivalence CI gate (Wave C.1.6, synthesis §7 + §10
 * innovative addition #4).
 *
 * The CQRS invariant: folding the JSONL evolution chain in memory and
 * canonicalize-hashing the result must equal `contentHash(<on-disk
 * spec.json>)`. Drift here means either the JSONL is corrupt or
 * `spec.json` was hand-edited — both detectable rather than silent.
 *
 * Scope of this CI gate (Wave C.1):
 *
 *   - For every prompt-id whose `<repoRoot>/.gobbi/projects/<project>/
 *     prompt-evolution/<prompt-id>.jsonl` exists, fold the chain via
 *     `lib/prompt-evolution.ts::foldChain` and assert
 *     `contentHash(folded) === contentHash(<on-disk spec.json>)`.
 *
 *   - Skips silently when the chain file is absent — the chain is
 *     bootstrapped on first `gobbi prompt patch <prompt-id>
 *     --allow-no-parent` invocation. A prompt-id that has never been
 *     patched produces no JSONL chain (synthesis §11 deferral 5: the
 *     bundled `dist/` semantics). The on-disk spec.json IS the
 *     baseline in that case.
 *
 *   - The `synthetic in-memory chain` describe block at the bottom
 *     (Wave C.1.6 R1 / Innovative F-8 + Overall F-11 fix) replaces
 *     the prior pass's vacuous `expect(true).toBe(true)` placeholder.
 *     A 3-line synthetic JSONL (genesis + 2 patches) is folded and
 *     byte-compared to a hand-derived spec; a hand-edited divergent
 *     spec is shown to fail. This locks the contract end-to-end at
 *     CI time, independent of any on-disk JSONL chain existing.
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

import {
  appendPromptEvolutionEntry,
  buildGenesisEntry,
  contentHash,
  ensureGenesis,
  foldChain,
} from '../../lib/prompt-evolution.js';
import type { PromptEvolutionEntry } from '../../lib/prompt-evolution.js';
import { canonicalize } from '../../lib/canonical-json.js';
import {
  PROMPT_ID_VALUES,
  promptEvolutionPath,
  resolveProjectName,
} from '../../commands/prompt/paths.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const SPECS_ROOT = resolve(HERE, '..');

const SCHEMA_ID = 'https://gobbi.dev/schemas/step-spec/v1.json';

describe('replay equivalence — JSONL chain fold ≡ on-disk spec.json', () => {
  for (const promptId of PROMPT_ID_VALUES) {
    test(`${promptId}.jsonl folds to byte-equal on-disk spec.json (or skips when chain absent)`, () => {
      const projectName = resolveProjectName();
      const jsonlPath = promptEvolutionPath(projectName, promptId);
      if (!existsSync(jsonlPath)) {
        // Chain not yet bootstrapped — vacuous pass. The on-disk
        // spec.json IS the baseline; nothing to compare against.
        // The synthetic-chain describe block below locks the contract
        // end-to-end regardless of whether any on-disk chain exists.
        expect(true).toBe(true);
        return;
      }

      const folded = foldChain(jsonlPath);

      const specPath = join(SPECS_ROOT, promptId, 'spec.json');
      expect(existsSync(specPath)).toBe(true);
      const specRaw: unknown = JSON.parse(readFileSync(specPath, 'utf8'));

      const foldedHash = contentHash(folded.spec);
      const onDiskHash = contentHash(specRaw);

      // Byte-equal under the canonicalize() convention. If this fails,
      // either the JSONL is corrupt (a patch row's postHash drifted
      // and the fold produced a wrong spec, which foldChain would
      // already have thrown on) or spec.json was hand-edited after
      // the chain was last patched (operator should run
      // `gobbi prompt rebuild <prompt-id>` to restore). The diagnostic
      // names which side drifted by including both hashes.
      expect(foldedHash).toBe(onDiskHash);
    });
  }
});

// ---------------------------------------------------------------------------
// Synthetic in-memory chain — Wave C.1.6 R1 (Innovative F-8 / Overall F-11)
//
// The on-disk-chain tests above are gated by chain bootstrap (the file
// must exist on disk for any contract to be locked). The synthetic
// describe block below builds an in-memory chain (genesis + 2 patches)
// in a tmp directory and exercises the actual fold-and-compare invariant
// independently of repo state. This makes the replay-equivalence
// contract testable at CI time on a fresh checkout.
// ---------------------------------------------------------------------------

describe('replay equivalence — synthetic in-memory chain (Wave C.1.6 R1)', () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), 'gobbi-replay-equiv-'));
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  // A small stand-in for a real spec.json — same shape, no schema
  // validation (the replay-equivalence contract is byte-for-byte
  // equality of the canonicalized fold and the on-disk file; the
  // spec's schema validity is a separate concern handled by
  // `validateStepSpec` at write time).
  const BASELINE_SPEC = {
    $schema: SCHEMA_ID,
    version: 1,
    meta: { description: 'synthetic baseline', substates: [] },
  } as const;

  /**
   * Build a 3-entry synthetic chain:
   *   - genesis line carrying the full BASELINE_SPEC.
   *   - patch 1: `replace /meta/description` to `'updated'`.
   *   - patch 2: `add /meta/note` with value `'hello'`.
   * Returns the path and the final folded spec for byte-equality
   * comparison.
   */
  function seedSyntheticChain(promptId: 'ideation' | 'planning'): {
    readonly jsonlPath: string;
    readonly finalSpec: Record<string, unknown>;
  } {
    const jsonlPath = join(tmpDir, `${promptId}.jsonl`);

    const genesis = ensureGenesis({
      path: jsonlPath,
      promptId,
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00.000Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    const ops1 = [
      { op: 'replace' as const, path: '/meta/description', value: 'updated' },
    ];
    const intermediate = {
      ...BASELINE_SPEC,
      meta: { ...BASELINE_SPEC.meta, description: 'updated' },
    };
    const entry1: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:01:00.000Z',
      promptId,
      patchId: contentHash(ops1),
      parentPatchId: genesis.patchId,
      preHash: genesis.postHash,
      postHash: contentHash(intermediate),
      ops: ops1,
      appliedBy: 'operator',
      eventSeq: 2,
      schemaId: SCHEMA_ID,
    };
    appendPromptEvolutionEntry(jsonlPath, entry1);

    const ops2 = [
      { op: 'add' as const, path: '/meta/note', value: 'hello' },
    ];
    const finalSpec = {
      ...intermediate,
      meta: { ...intermediate.meta, note: 'hello' },
    };
    const entry2: PromptEvolutionEntry = {
      v: 1,
      ts: '2026-04-26T00:02:00.000Z',
      promptId,
      patchId: contentHash(ops2),
      parentPatchId: entry1.patchId,
      preHash: entry1.postHash,
      postHash: contentHash(finalSpec),
      ops: ops2,
      appliedBy: 'operator',
      eventSeq: 3,
      schemaId: SCHEMA_ID,
    };
    appendPromptEvolutionEntry(jsonlPath, entry2);

    return { jsonlPath, finalSpec };
  }

  test('positive — folded chain byte-equals the hand-derived final spec', () => {
    const { jsonlPath, finalSpec } = seedSyntheticChain('ideation');

    const folded = foldChain(jsonlPath);
    expect(folded.entryCount).toBe(3);

    const foldedHash = contentHash(folded.spec);
    const finalHash = contentHash(finalSpec);
    expect(foldedHash).toBe(finalHash);

    // Byte-equality under canonicalize() — the strongest form of the
    // replay-equivalence contract.
    expect(canonicalize(folded.spec)).toBe(canonicalize(finalSpec));
  });

  test('negative — a hand-edited divergent spec fails the byte-equality assertion', () => {
    const { jsonlPath, finalSpec } = seedSyntheticChain('planning');

    const folded = foldChain(jsonlPath);
    // Simulate the operator hand-editing the on-disk spec to a
    // semantically-different value. The replay-equivalence contract
    // MUST detect this drift.
    const handEdited = {
      ...finalSpec,
      meta: { ...(finalSpec['meta'] as Record<string, unknown>), note: 'tampered' },
    };

    const foldedHash = contentHash(folded.spec);
    const tamperedHash = contentHash(handEdited);

    expect(foldedHash).not.toBe(tamperedHash);
    expect(canonicalize(folded.spec)).not.toBe(canonicalize(handEdited));
  });

  test('negative — postHash drift in the JSONL itself is caught at fold time', () => {
    // This is the corruption mode foldChain catches BEFORE the
    // replay-equivalence comparator runs. Build a chain whose entry's
    // declared postHash disagrees with the canonicalized result.
    const jsonlPath = join(tmpDir, 'evaluation.jsonl');
    const genesis = buildGenesisEntry({
      promptId: 'evaluation',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00.000Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });
    // Mutate postHash to a wrong value — foldChain catches this.
    const broken = { ...genesis, postHash: 'sha256:wrong' };
    appendPromptEvolutionEntry(jsonlPath, broken as PromptEvolutionEntry);

    expect(() => foldChain(jsonlPath)).toThrow(/postHash mismatch/);
  });

  test('positive — single-genesis chain folds to the baseline byte-equal', () => {
    // The minimum-size chain. Locks the genesis-only invariant
    // (`add /` op materializes the baseline; no further ops).
    const jsonlPath = join(tmpDir, 'memorization.jsonl');
    ensureGenesis({
      path: jsonlPath,
      promptId: 'memorization',
      baselineSpec: BASELINE_SPEC,
      ts: '2026-04-26T00:00:00.000Z',
      schemaId: SCHEMA_ID,
      eventSeq: 1,
    });

    const folded = foldChain(jsonlPath);
    expect(folded.entryCount).toBe(1);
    expect(canonicalize(folded.spec)).toBe(canonicalize(BASELINE_SPEC));
    expect(contentHash(folded.spec)).toBe(contentHash(BASELINE_SPEC));
  });
});
