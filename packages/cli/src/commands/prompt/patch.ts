/**
 * gobbi prompt patch — apply an RFC 6902 patch to a per-step `spec.json`.
 *
 * Wave C.1.6 (issue #156). Operator-only (synthesis lock 3); the
 * orchestrator never mutates prompts mid-session. Atomic across SQLite
 * (event row + prompt_patches projection row) and the filesystem
 * (JSONL append + temp+rename spec.json overwrite).
 *
 * # Validation pipeline (synthesis §9.2 fail-fast ladder)
 *
 *   1. Parse patch JSON. Reject non-array roots (RFC 6902 §3).
 *   2. JSON-shape check every op (op + path required, op enum closed).
 *   3. Test-op merge logic (synthesis §9.2 step 3, Overall F-7 fix):
 *      - No `test` op anywhere → synthesize `{op:'test', path:'/version',
 *        value:1}` at index 0; warn on stderr.
 *      - Operator-authored `test` op already at index 0 testing
 *        `/version` → keep as-is, no synthesis.
 *      - Operator-authored `test` op(s) elsewhere or testing other paths
 *        → prepend the synthesized `/version` test; preserve operator's
 *        tests in their original positions.
 *   4. Resolve baseline. Read on-disk `spec.json`, compute `pre_hash`.
 *      If `--baseline <hash>` is supplied, refuse unless on-disk hash
 *      matches. Otherwise (no --baseline) refuse if the on-disk
 *      `pre_hash` ≠ the last patch row's `post_hash` (Overall F-5 fix
 *      via Planning routed-resolution).
 *   5. Simulate via `fast-json-patch::applyPatch` on a deep clone.
 *   6. Schema-validate the candidate via `validateStepSpec`.
 *   7. Compile-test the candidate via `assembly.compile()` (synthetic
 *      deterministic state).
 *   8. Compute post_hash.
 *   9. If --validate-only or --dry-run: print + exit 0, no writes.
 *   10. Commit phase: ONE SQLite IMMEDIATE transaction wraps the event
 *       row + prompt_patches projection row INSERT (Wave C.1.6 R1 /
 *       Architecture F-1 fix — both writes share one connection so a
 *       SIGKILL between them rolls both back). After the SQL commits,
 *       JSONL append → atomic temp+rename spec.json.
 *
 * # Crash recovery
 *
 *   - Crash inside the SQL transaction: BEGIN IMMEDIATE rolls back —
 *     no events row, no prompt_patches row. Next run re-applies cleanly.
 *   - Crash after SQL commit, before JSONL append: events + projection
 *     rows exist. Re-running the same patch hits the events idempotency
 *     dedup; the patch.ts dedup-hit branch surfaces the existing
 *     projection row and exits 0. The operator runs `gobbi prompt
 *     rebuild` to materialize the missing JSONL line + spec.json.
 *   - Crash after JSONL append, before spec.json rename: JSONL has the
 *     entry, DB has the row, spec.json is stale. Next `gobbi prompt
 *     patch` invocation detects (`pre_hash` of on-disk spec ≠ last
 *     patch row's post_hash) and refuses with the rebuild diagnostic.
 *
 * # Source vs. installed CLI
 *
 * Patches the source `packages/cli/src/specs/<step>/spec.json`, NOT
 * the bundled `dist/`. Operators on the installed CLI cannot patch
 * installed prompts; they patch the source repo and rebuild.
 */

import {
  existsSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { applyPatch, deepClone, validate } from 'fast-json-patch';
import type { Operation } from 'fast-json-patch';

import { Database } from 'bun:sqlite';

import {
  compile,
  type CompileInput,
  type CompilePredicateRegistry,
  type DynamicContext,
} from '../../specs/assembly.js';
import { defaultBudgetAllocator } from '../../specs/budget.js';
import { validateStepSpec } from '../../specs/_schema/v1.js';
import {
  STEP_SPEC_SCHEMA_ID,
} from '../../specs/_schema/v1.js';
import type { StepSpec } from '../../specs/types.js';
import { initialState } from '../../workflow/state.js';
import type { WorkflowStep } from '../../workflow/state.js';
import { defaultPredicates } from '../../workflow/predicates.js';
import { EventStore } from '../../workflow/store.js';
import {
  appendPromptEvolutionEntry,
  buildGenesisEntry,
  contentHash,
} from '../../lib/prompt-evolution.js';
import type { PromptEvolutionEntry } from '../../lib/prompt-evolution.js';
import { canonicalize } from '../../lib/canonical-json.js';
import { getRepoRoot } from '../../lib/repo.js';
import { workspaceRoot } from '../../lib/workspace-paths.js';
import {
  PROMPT_ID_VALUES,
  ensurePromptEvolutionDir,
  isPromptId,
  promptEvolutionPath,
  resolveProjectName,
  specJsonPath,
  type PromptId,
} from './paths.js';

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi prompt patch <prompt-id> --patch <json-patch-file> [options]

Apply an RFC 6902 patch to a per-step spec.json. Operator-only — the
orchestrator never mutates prompts mid-session.

Arguments:
  <prompt-id>             One of: ${PROMPT_ID_VALUES.join(', ')}.

Options:
  --patch <file>          Path to a JSON file containing an RFC 6902 ops
                          array. Required.
  --baseline <hash>       Refuse to apply unless the on-disk spec's
                          pre_hash matches this content address. When
                          omitted: refuse if the on-disk pre_hash does
                          not match the last patch row's post_hash.
  --dry-run               Run the full validation pipeline but commit
                          nothing. Prints the synthesized JSONL line +
                          hashes and exits 0.
  --validate-only         Synonym for --dry-run.
  --allow-no-parent       Permit a fresh-chain (no genesis line yet)
                          to bootstrap. Implies a synthesized genesis
                          line written before this patch's line.
  --help, -h              Show this help message.

Notes:
  - Patches the source packages/cli/src/specs/<prompt-id>/spec.json —
    NOT the bundled dist/. Operators on the installed CLI cannot patch
    installed prompts.
  - Atomic. SQL transaction (event row + prompt_patches projection row)
    runs before any filesystem write. spec.json is written via
    temp+rename so partial-write SIGKILL leaves the on-disk file
    intact.`;

// ---------------------------------------------------------------------------
// Public entry
// ---------------------------------------------------------------------------

export async function runPromptPatch(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  let positionals: string[];
  let patchFile: string | undefined;
  let baseline: string | undefined;
  let dryRun: boolean;
  let validateOnly: boolean;
  let allowNoParent: boolean;

  try {
    const parsed = parseArgs({
      args,
      allowPositionals: true,
      options: {
        patch: { type: 'string' },
        baseline: { type: 'string' },
        'dry-run': { type: 'boolean', default: false },
        'validate-only': { type: 'boolean', default: false },
        'allow-no-parent': { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
    });
    positionals = parsed.positionals;
    patchFile = parsed.values.patch;
    baseline = parsed.values.baseline;
    dryRun = parsed.values['dry-run'] === true;
    validateOnly = parsed.values['validate-only'] === true;
    allowNoParent = parsed.values['allow-no-parent'] === true;
  } catch (err) {
    process.stderr.write(
      `gobbi prompt patch: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  const promptIdArg = positionals[0];
  if (promptIdArg === undefined) {
    process.stderr.write(`gobbi prompt patch: missing <prompt-id>\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  if (!isPromptId(promptIdArg)) {
    process.stderr.write(
      `gobbi prompt patch: invalid prompt-id '${promptIdArg}' ` +
        `(valid: ${PROMPT_ID_VALUES.join(', ')})\n`,
    );
    process.exit(1);
  }
  const promptId: PromptId = promptIdArg;

  if (patchFile === undefined) {
    process.stderr.write(`gobbi prompt patch: --patch <file> is required\n`);
    process.exit(2);
  }

  await runPromptPatchOnFiles({
    promptId,
    patchFile,
    baseline,
    dryRun: dryRun || validateOnly,
    allowNoParent,
  });
}

// ---------------------------------------------------------------------------
// Core implementation (separated from argv parsing for testability)
// ---------------------------------------------------------------------------

export interface PromptPatchInputs {
  readonly promptId: PromptId;
  readonly patchFile: string;
  readonly baseline?: string | undefined;
  readonly dryRun: boolean;
  readonly allowNoParent: boolean;
}

export interface PromptPatchResult {
  readonly committed: boolean;
  readonly patchId: string;
  readonly preHash: string;
  readonly postHash: string;
  readonly opCount: number;
  readonly eventSeq: number | null; // null on dry-run
  readonly synthesizedTestOp: boolean;
}

export async function runPromptPatchOnFiles(
  inputs: PromptPatchInputs,
): Promise<PromptPatchResult> {
  // ----- 1. Parse + 2. shape-check the patch JSON ------------------------
  if (!existsSync(inputs.patchFile)) {
    process.stderr.write(
      `gobbi prompt patch: patch file not found: ${inputs.patchFile}\n`,
    );
    process.exit(1);
  }
  let opsRaw: unknown;
  try {
    opsRaw = JSON.parse(readFileSync(inputs.patchFile, 'utf8'));
  } catch (err) {
    process.stderr.write(
      `gobbi prompt patch: patch file is not valid JSON: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(1);
  }
  if (!Array.isArray(opsRaw)) {
    process.stderr.write(
      `gobbi prompt patch: patch file root must be a JSON array of RFC 6902 ops (got ${typeof opsRaw})\n`,
    );
    process.exit(1);
  }
  const operatorOps = opsRaw as Operation[];

  // RFC 6902 shape via fast-json-patch::validate.
  // `validate(ops)` returns a PatchError if invalid, or undefined if OK.
  const validationError = validate(operatorOps);
  if (validationError !== undefined) {
    process.stderr.write(
      `gobbi prompt patch: RFC 6902 validation failed: ${validationError.message}\n`,
    );
    process.exit(1);
  }

  // ----- 3. Test-op merge (synthesis §9.2 step 3 / Overall F-7) ----------
  const { mergedOps, synthesizedTestOp } = mergeTestOp(operatorOps);
  if (synthesizedTestOp) {
    process.stderr.write(
      `gobbi prompt patch: synthesized {op:'test', path:'/version', value:1} at index 0; ` +
        `the universal floor test ensures the patch refuses to apply on a non-v1 spec.\n`,
    );
  }

  // ----- 4. Load on-disk spec, compute pre_hash, baseline check ----------
  const specPath = specJsonPath(inputs.promptId);
  if (!existsSync(specPath)) {
    process.stderr.write(
      `gobbi prompt patch: source spec not found: ${specPath}\n`,
    );
    process.exit(1);
  }
  const specRaw: unknown = JSON.parse(readFileSync(specPath, 'utf8'));
  const preHash = contentHash(specRaw);

  if (inputs.baseline !== undefined && inputs.baseline !== preHash) {
    process.stderr.write(
      `gobbi prompt patch: --baseline ${inputs.baseline} does not match on-disk pre_hash ${preHash}; ` +
        `refusing to apply against a stale spec.\n`,
    );
    process.exit(1);
  }

  const projectName = resolveProjectName();

  // Open the workspace state.db. The `gobbi prompt` commands run from
  // the main tree per the gotcha at `gobbi-workflow-cli-from-main-tree.md`,
  // so the workspace `state.db` lives at `<repoRoot>/.gobbi/state.db`.
  const repoRoot = getRepoRoot();
  const stateDbPath = join(workspaceRoot(repoRoot), 'state.db');

  // No-baseline guard (Overall F-5 routed-resolution): if the on-disk
  // spec's pre_hash does not match the last patch row's post_hash, the
  // operator authored against a stale spec or a crash-recovery is
  // pending. Refuse with the rebuild diagnostic.
  if (inputs.baseline === undefined && existsSync(stateDbPath) && !inputs.dryRun) {
    const lastPostHash = readLastPostHash(stateDbPath, inputs.promptId);
    if (lastPostHash !== null && lastPostHash !== preHash) {
      process.stderr.write(
        `gobbi prompt patch: on-disk spec.json pre_hash ${preHash} does not match the last patch row's post_hash ${lastPostHash}. ` +
          `This usually means the spec was hand-edited, or a prior \`gobbi prompt patch\` crashed mid-write. ` +
          `Run \`gobbi prompt rebuild ${inputs.promptId}\` to restore the spec to the chain head, or pass --baseline ${preHash} to override.\n`,
      );
      process.exit(1);
    }
  }

  // ----- 5. Simulate the patch on a deep clone --------------------------
  let candidate: unknown;
  try {
    const result = applyPatch(deepClone(specRaw), mergedOps);
    candidate = result.newDocument;
  } catch (err) {
    process.stderr.write(
      `gobbi prompt patch: applyPatch failed: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(1);
  }

  // ----- 6. Schema-validate the candidate -------------------------------
  const validationResult = validateStepSpec(candidate);
  if (!validationResult.ok) {
    process.stderr.write(
      `gobbi prompt patch: candidate spec fails schema validation:\n` +
        `${JSON.stringify(validationResult.errors, null, 2)}\n`,
    );
    process.exit(1);
  }
  const validatedSpec = validationResult.value;

  // ----- 7. Compile-test the candidate ----------------------------------
  try {
    compileSpecForTest(validatedSpec, inputs.promptId);
  } catch (err) {
    process.stderr.write(
      `gobbi prompt patch: candidate spec fails assembly.compile() smoke test: ${err instanceof Error ? err.message : String(err)}\n`,
    );
    process.exit(1);
  }

  // ----- 8. Compute post_hash + patch_id --------------------------------
  const postHash = contentHash(candidate);
  const patchId = contentHash(mergedOps);

  // ----- 9. Dry-run / validate-only -------------------------------------
  const result: PromptPatchResult = {
    committed: false,
    patchId,
    preHash,
    postHash,
    opCount: mergedOps.length,
    eventSeq: null,
    synthesizedTestOp,
  };
  if (inputs.dryRun) {
    printPatchSummary(result);
    return result;
  }

  // ----- 10. Commit phase ----------------------------------------------
  const ts = new Date().toISOString();
  const sessionId = `prompt-patch-${ts}`;

  // Open the EventStore — auto-applies v5+v6+v7 schema.
  let store: EventStore;
  try {
    store = new EventStore(stateDbPath, {
      sessionId,
      projectId: projectName,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes('SQLITE_BUSY')) {
      process.stderr.write(
        `gobbi prompt patch: another \`gobbi prompt\` invocation holds the write lock; retry.\n`,
      );
      process.exit(1);
    }
    throw err;
  }

  let eventSeq: number;
  try {
    // Genesis-line bootstrap: if the chain has no rows for this prompt,
    // we synthesize a genesis line from the on-disk pre-patch spec
    // before the new patch's line. This matches synthesis §7's
    // "every JSONL has a genesis line" invariant.
    ensurePromptEvolutionDir(projectName, inputs.promptId);
    const jsonlPath = promptEvolutionPath(projectName, inputs.promptId);

    let parentPatchId: string | null = null;
    let parentSeq: number | null = null;
    if (!existsSync(jsonlPath)) {
      if (!inputs.allowNoParent) {
        // Without an explicit opt-in, refuse. Synthesizing a genesis
        // line silently could mask a missing-jsonl drift bug.
        store.close();
        process.stderr.write(
          `gobbi prompt patch: no JSONL chain found at ${jsonlPath}. ` +
            `Pass --allow-no-parent to bootstrap a fresh chain by synthesizing a genesis line from the current spec.json.\n`,
        );
        process.exit(1);
      }
      // Synthesize genesis from the pre-patch spec. Atomic — event +
      // projection share one transaction (Wave C.1.6 R1, Architecture
      // F-1 fix).
      //
      // The events idempotency `contentId` is namespaced by `promptId`
      // (Architecture F-4 fix, Wave C.1.6 R1): the same RFC 6902 ops
      // array applied across two prompts (e.g., the same `add /`
      // synthesized from two different baseline specs) must produce
      // two distinct event rows, not one. Without the prefix the
      // events table would dedup at the second `gobbi prompt patch`
      // and the projection insert would be skipped.
      const genesisPatchId = contentHash([
        { op: 'add', path: '', value: specRaw },
      ]);
      const genesisContentId = `${inputs.promptId}:${genesisPatchId}`;
      // `genesisEntryRef` is captured inside the projection callback so
      // the post-callback code can append the JSONL line and read the
      // projection seq without re-querying. TypeScript's flow analysis
      // narrows the closure-mutated locals to `never`, so we capture
      // the type explicitly here.
      let genesisEntryRef: PromptEvolutionEntry | null = null as
        | PromptEvolutionEntry
        | null;
      let genesisProjectionSeq: number | null = null as number | null;
      const genesisEvent = store.appendWithProjection(
        {
          ts,
          type: 'prompt.patch.applied',
          actor: 'operator',
          idempotencyKind: 'content',
          contentId: genesisContentId,
          sessionId,
          data: JSON.stringify({
            promptId: inputs.promptId,
            patchId: genesisPatchId,
            parentPatchId: null,
            preHash: contentHash({}),
            postHash: preHash,
            opCount: 1,
            schemaId: STEP_SPEC_SCHEMA_ID,
            appliedBy: 'operator',
          }),
        },
        (db, row) => {
          const genesisEntry = buildGenesisEntry({
            promptId: inputs.promptId,
            baselineSpec: specRaw,
            ts,
            schemaId: STEP_SPEC_SCHEMA_ID,
            eventSeq: row.seq,
          });
          insertPromptPatchRowOnDb(db, {
            sessionId,
            projectId: projectName,
            promptId: inputs.promptId,
            parentSeq: null,
            eventSeq: row.seq,
            patchId: genesisEntry.patchId,
            patchJson: canonicalize(genesisEntry.ops),
            preHash: genesisEntry.preHash,
            postHash: genesisEntry.postHash,
            appliedAt: Date.parse(ts),
          });
          genesisEntryRef = genesisEntry;
          genesisProjectionSeq = readPatchSeqByEventSeqOnDb(db, row.seq);
        },
      );
      if (genesisEvent !== null) {
        const genesisEntry: PromptEvolutionEntry | null = genesisEntryRef;
        if (genesisEntry === null) {
          throw new Error(
            'unreachable: appendWithProjection succeeded but genesis entry was not captured',
          );
        }
        // Use the shared `appendPromptEvolutionEntry` helper rather
        // than rebuilding the JSONL-line stringification at the call
        // site (Wave C.1.6 R1 / Overall F-2 fix). One source of truth
        // for the wire shape — `lib/prompt-evolution.ts`.
        appendPromptEvolutionEntry(jsonlPath, genesisEntry);
        parentPatchId = genesisEntry.patchId;
        parentSeq = genesisProjectionSeq;
      } else {
        // Genesis event was deduped (someone else just wrote it). Read
        // back the existing genesis row and continue. Note: the
        // projection row's `patch_id` column stores the raw patch hash
        // (NOT the events idempotency `contentId`, which is namespaced
        // by promptId per Architecture F-4).
        const dedupedSeq = readPatchSeqByContent(
          store,
          inputs.promptId,
          genesisPatchId,
        );
        if (dedupedSeq === null) {
          throw new Error(
            'unreachable: genesis event existed but no projection row found',
          );
        }
        parentSeq = dedupedSeq.seq;
        parentPatchId = dedupedSeq.patchId;
      }
    } else {
      // Chain exists — link to the last row.
      const last = readLastPatch(store, inputs.promptId);
      if (last !== null) {
        parentPatchId = last.patchId;
        parentSeq = last.seq;
      }
    }

    // Append the operator's patch as event + projection row inside one
    // SQLite IMMEDIATE transaction. A SIGKILL between the events INSERT
    // and the prompt_patches INSERT rolls both back rather than leaving
    // an orphan event row (Wave C.1.6 R1 / Architecture F-1 fix).
    //
    // The events idempotency `contentId` is namespaced by `promptId`
    // (Architecture F-4 fix, Wave C.1.6 R1): a byte-identical RFC 6902
    // ops array applied across two prompts (e.g., a generic
    // `add /meta/notes` op meaningful for both `ideation` and
    // `planning`) must produce two distinct event rows. Without the
    // prefix the second invocation would dedup at the events table
    // and skip the projection write entirely.
    const eventContentId = `${inputs.promptId}:${patchId}`;
    const eventRow = store.appendWithProjection(
      {
        ts,
        type: 'prompt.patch.applied',
        actor: 'operator',
        idempotencyKind: 'content',
        contentId: eventContentId,
        sessionId,
        data: JSON.stringify({
          promptId: inputs.promptId,
          patchId,
          parentPatchId,
          preHash,
          postHash,
          opCount: mergedOps.length,
          schemaId: STEP_SPEC_SCHEMA_ID,
          appliedBy: 'operator',
        }),
      },
      (db, row) => {
        insertPromptPatchRowOnDb(db, {
          sessionId,
          projectId: projectName,
          promptId: inputs.promptId,
          parentSeq,
          eventSeq: row.seq,
          patchId,
          patchJson: canonicalize(mergedOps),
          preHash,
          postHash,
          appliedAt: Date.parse(ts),
        });
      },
    );

    if (eventRow === null) {
      // Cross-session content dedup hit — the same patch was already
      // applied. Surface the originating session.
      store.close();
      const existing = readPatchByContent(stateDbPath, inputs.promptId, patchId);
      if (existing !== null) {
        process.stderr.write(
          `gobbi prompt patch: patch ${patchId} was already applied (originating session: ${existing.session_id}). No new rows written.\n`,
        );
        process.exit(0);
      }
      process.stderr.write(
        `gobbi prompt patch: event idempotency dedup hit but projection row not found — possible store corruption.\n`,
      );
      process.exit(1);
    }
    eventSeq = eventRow.seq;

    // JSONL append (after SQL transaction commits; crash-recovery
    // covered by F-5 diagnostic on next run). Uses the shared
    // `appendPromptEvolutionEntry` helper so the JSONL wire shape
    // lives in one place (Wave C.1.6 R1 / Overall F-2 fix).
    const entry: PromptEvolutionEntry = {
      v: 1,
      ts,
      promptId: inputs.promptId,
      patchId,
      parentPatchId,
      preHash,
      postHash,
      ops: mergedOps,
      validationStatus: 'passed',
      appliedBy: 'operator',
      eventSeq: eventRow.seq,
      schemaId: STEP_SPEC_SCHEMA_ID,
    };
    appendPromptEvolutionEntry(jsonlPath, entry);

    // Atomic spec.json write (temp+rename).
    const tmp = `${specPath}.tmp`;
    writeFileSync(tmp, canonicalize(candidate) + '\n', { encoding: 'utf8' });
    renameSync(tmp, specPath);
  } finally {
    store.close();
  }

  const finalResult: PromptPatchResult = { ...result, committed: true, eventSeq };
  printPatchSummary(finalResult);
  return finalResult;
}

// ---------------------------------------------------------------------------
// Test-op merge (synthesis §9.2 step 3, Overall F-7 fix)
// ---------------------------------------------------------------------------

interface MergeResult {
  readonly mergedOps: Operation[];
  readonly synthesizedTestOp: boolean;
}

export function mergeTestOp(operatorOps: ReadonlyArray<Operation>): MergeResult {
  const SYNTH: Operation = { op: 'test', path: '/version', value: 1 };

  // Find the first test op.
  const firstTestIndex = operatorOps.findIndex((op) => op.op === 'test');
  if (firstTestIndex < 0) {
    // Case 1 — no test op anywhere. Synthesize at index 0.
    return { mergedOps: [SYNTH, ...operatorOps], synthesizedTestOp: true };
  }
  const firstTest = operatorOps[firstTestIndex]!;
  if (
    firstTestIndex === 0 &&
    firstTest.op === 'test' &&
    'path' in firstTest &&
    firstTest.path === '/version'
  ) {
    // Case 2 — operator already authored test-at-index-0-on-/version.
    return { mergedOps: [...operatorOps], synthesizedTestOp: false };
  }
  // Case 3 — operator has test ops, but not at index 0 on /version.
  // Prepend the synth /version test; preserve operator's tests.
  return { mergedOps: [SYNTH, ...operatorOps], synthesizedTestOp: true };
}

// ---------------------------------------------------------------------------
// Compile smoke test
// ---------------------------------------------------------------------------

const FIXED_TIMESTAMP = '2026-04-26T12:00:00.000Z';
const GENEROUS_WINDOW = 200_000;
const predicates: CompilePredicateRegistry = defaultPredicates;

function compileSpecForTest(spec: StepSpec, promptId: PromptId): void {
  const currentStep: WorkflowStep = promptId as WorkflowStep;
  const state = {
    ...initialState(`session-patch-test-${promptId}`),
    currentStep,
  };
  const dynamic: DynamicContext = {
    timestamp: FIXED_TIMESTAMP,
    activeSubagentCount: 0,
    artifacts: [],
  };
  const input: CompileInput = {
    spec,
    state,
    dynamic,
    predicates,
    activeAgent: null,
  };
  // Call compile to verify the candidate spec passes the lint and
  // budget allocator. Result is discarded.
  compile(input, {
    allocator: defaultBudgetAllocator,
    contextWindowTokens: GENEROUS_WINDOW,
  });
}

// ---------------------------------------------------------------------------
// SQLite helpers — direct-SQL writes/reads against `prompt_patches`.
// EventStore handles `events`; this helper handles the projection table.
// ---------------------------------------------------------------------------

interface InsertPromptPatchArgs {
  readonly sessionId: string;
  readonly projectId: string | null;
  readonly promptId: PromptId;
  readonly parentSeq: number | null;
  readonly eventSeq: number;
  readonly patchId: string;
  readonly patchJson: string;
  readonly preHash: string;
  readonly postHash: string;
  readonly appliedAt: number;
}

/**
 * Run the `INSERT INTO prompt_patches ...` projection write on the
 * supplied `Database` handle. Used inside
 * {@link EventStore.appendWithProjection} so the projection row shares
 * the same transaction as the events row (Wave C.1.6 R1 /
 * Architecture F-1 fix). The caller MUST pass the handle obtained
 * from the projection callback — opening a separate `new Database(path)`
 * here would defeat the atomicity guarantee.
 */
function insertPromptPatchRowOnDb(
  db: Database,
  args: InsertPromptPatchArgs,
): void {
  db.run(
    `INSERT INTO prompt_patches (session_id, project_id, prompt_id, parent_seq, event_seq, patch_id, patch_json, pre_hash, post_hash, applied_at, applied_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      args.sessionId,
      args.projectId,
      args.promptId,
      args.parentSeq,
      args.eventSeq,
      args.patchId,
      args.patchJson,
      args.preHash,
      args.postHash,
      args.appliedAt,
      'operator',
    ],
  );
}

/**
 * Read the `prompt_patches.seq` for a given `event_seq` using the
 * supplied in-transaction `Database` handle. Co-located with
 * {@link insertPromptPatchRowOnDb} so the genesis-bootstrap path can
 * capture the projection row's seq inside the same transaction the
 * INSERT just landed in.
 */
function readPatchSeqByEventSeqOnDb(
  db: Database,
  eventSeq: number,
): number | null {
  interface Row {
    readonly seq: number;
  }
  const row = db
    .query<Row, [number]>(`SELECT seq FROM prompt_patches WHERE event_seq = ?`)
    .get(eventSeq);
  return row === null ? null : row.seq;
}

/**
 * Read the workspace state.db path from an EventStore. The path is
 * not exposed on the public surface — use a process-environment hint
 * via repoRoot resolution. For C.1 we already know the path
 * (`workspaceRoot(repoRoot)/state.db`) so this helper just restates
 * it.
 */
function stateDbPathFromStore(_store: EventStore): string {
  return join(workspaceRoot(getRepoRoot()), 'state.db');
}

interface LastPatchRow {
  readonly seq: number;
  readonly patchId: string;
  readonly postHash: string;
}

function readLastPatch(
  store: EventStore,
  promptId: PromptId,
): LastPatchRow | null {
  const db = new Database(stateDbPathFromStore(store), { readonly: true });
  try {
    interface Row {
      readonly seq: number;
      readonly patch_id: string;
      readonly post_hash: string;
    }
    const row = db
      .query<Row, [string]>(
        `SELECT seq, patch_id, post_hash FROM prompt_patches WHERE prompt_id = ? ORDER BY seq DESC LIMIT 1`,
      )
      .get(promptId);
    if (row === null) return null;
    return { seq: row.seq, patchId: row.patch_id, postHash: row.post_hash };
  } finally {
    db.close();
  }
}

function readLastPostHash(
  stateDbPath: string,
  promptId: PromptId,
): string | null {
  if (!existsSync(stateDbPath)) return null;
  const db = new Database(stateDbPath, { readonly: true });
  try {
    interface Row {
      readonly post_hash: string;
    }
    // Tolerate the prompt_patches table not yet existing (fresh
    // workspace, never opened by a v7 store).
    try {
      const row = db
        .query<Row, [string]>(
          `SELECT post_hash FROM prompt_patches WHERE prompt_id = ? ORDER BY seq DESC LIMIT 1`,
        )
        .get(promptId);
      return row === null ? null : row.post_hash;
    } catch {
      return null;
    }
  } finally {
    db.close();
  }
}

function readPatchSeqByContent(
  store: EventStore,
  promptId: PromptId,
  patchId: string,
): { seq: number; patchId: string } | null {
  const db = new Database(stateDbPathFromStore(store), { readonly: true });
  try {
    interface Row {
      readonly seq: number;
      readonly patch_id: string;
    }
    const row = db
      .query<Row, [string, string]>(
        `SELECT seq, patch_id FROM prompt_patches WHERE prompt_id = ? AND patch_id = ?`,
      )
      .get(promptId, patchId);
    return row === null ? null : { seq: row.seq, patchId: row.patch_id };
  } finally {
    db.close();
  }
}

function readPatchByContent(
  stateDbPath: string,
  promptId: PromptId,
  patchId: string,
): { session_id: string } | null {
  if (!existsSync(stateDbPath)) return null;
  const db = new Database(stateDbPath, { readonly: true });
  try {
    interface Row {
      readonly session_id: string;
    }
    const row = db
      .query<Row, [string, string]>(
        `SELECT session_id FROM prompt_patches WHERE prompt_id = ? AND patch_id = ?`,
      )
      .get(promptId, patchId);
    return row === null ? null : { session_id: row.session_id };
  } finally {
    db.close();
  }
}

// ---------------------------------------------------------------------------
// Pretty-print
// ---------------------------------------------------------------------------

function printPatchSummary(result: PromptPatchResult): void {
  const lines = [
    `gobbi prompt patch — ${result.committed ? 'committed' : 'dry-run'}`,
    `patchId:           ${result.patchId}`,
    `pre_hash:          ${result.preHash}`,
    `post_hash:         ${result.postHash}`,
    `op_count:          ${result.opCount}`,
    `synthesized test:  ${result.synthesizedTestOp ? 'yes' : 'no'}`,
  ];
  if (result.eventSeq !== null) {
    lines.push(`event_seq:         ${result.eventSeq}`);
  }
  process.stdout.write(`${lines.join('\n')}\n`);
}

// ---------------------------------------------------------------------------
// Re-export for tests
// ---------------------------------------------------------------------------

export { PROMPT_PATCH_USAGE };
const PROMPT_PATCH_USAGE = USAGE;
