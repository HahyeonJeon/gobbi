/**
 * Artifact selector — selects prior-step artifacts from the session directory
 * for inclusion in the current step's compiled prompt.
 *
 * Given a session directory (e.g. `.gobbi/sessions/{id}/` or a task note
 * directory) and the current step's identifier, `selectPriorArtifacts()`
 * returns the ordered list of authoritative prior-step artifacts the caller
 * may inline into the prompt. Each returned entry is a lightweight reference
 * (path + metadata) — the artifact's body is NOT read into memory here; that
 * happens downstream in A.4's assembly where budget allocation decides what
 * survives the window.
 *
 * ## Scope — productive step directories only
 *
 * `StepId` enumerates the five top-level directories that appear under a
 * session root per `v050-session.md` §Session Directory Structure:
 * `ideation/`, `plan/`, `execution/`, `evaluation/`, `memorization/`. These
 * are the "productive" steps — each step writes authoritative artifacts
 * into its own flat directory.
 *
 * The v0.5.0 state machine (`v050-state-machine.md`) has additional
 * state-level identifiers that do NOT correspond to their own session
 * directory:
 *
 * - `ideation_eval`, `plan_eval`, `execution_eval` — all three evaluation
 *   state-machine steps share the single `evaluation/` directory (see
 *   `specs/index.json`: every `*_eval` entry points at `evaluation/spec.json`).
 *   Callers transitioning out of an eval state should pass the productive
 *   step that the eval step follows (`ideation` / `plan` / `execution`) as
 *   `currentStep`; the selector will include the shared `evaluation/` files
 *   once that step is crossed. A separate `selectEvalArtifacts()` sibling
 *   may be added later if a caller needs to read the `evaluation/` dir
 *   directly mid-loop — see the handoff note in the PR A eval report.
 * - `research` is a substate of Ideation (`spec.json meta.substates` lists
 *   it), not a separate top-level step. Research artifacts are written to
 *   `ideation/` alongside the other ideation output and are surfaced via
 *   `currentStep: 'ideation'`'s discovery descriptor (+ `includeSources`).
 *
 * ## Discovery rules
 *
 * Per `v050-prompts.md` §Fresh Context Per Task and `v050-session.md`
 * §Artifact Filename Versioning:
 *
 * - Ideation → `ideation.md` is authoritative. `innovative.md` / `best.md`
 *   are source inputs (only included when `includeSources: true`).
 * - Plan → `plan.md` is authoritative.
 * - Execution → `execution.md` is authoritative (absent mid-workflow is OK).
 *   Per-subtask files under `execution/subtasks/` are out of scope for the
 *   default selection — the caller can opt in separately.
 * - Evaluation → every `*.md` at the top of `evaluation/` is authoritative
 *   (one file per perspective).
 * - Memorization → `memorization.md` is authoritative.
 *
 * Filename-versioning (from `workflow/artifacts.ts`): when the feedback loop
 * sends the workflow back through a step, artifacts gain a `-rN` suffix. The
 * selector picks the HIGHEST round per base name via `latestRound()`. Earlier
 * rounds remain on disk for audit but are not surfaced in active prompts.
 *
 * The selector returns available artifacts in prior-step order, most-
 * authoritative first within each step. The caller (A.4's assembly +
 * A.5's budget allocator) decides how many to actually inline.
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import {
  artifactFilename,
  latestRound,
} from '../workflow/artifacts.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * Closed union of workflow step identifiers that participate in prior-step
 * artifact selection. Each value corresponds to ONE flat top-level directory
 * under a session root — `ideation/`, `plan/`, `execution/`, `evaluation/`,
 * `memorization/` — per `v050-session.md` §Session Directory Structure.
 *
 * `StepId` is deliberately NARROWER than the state-machine step identifiers
 * in `specs/index.json`. Callers using `ideation_eval` / `plan_eval` /
 * `execution_eval` must map those to productive steps before calling the
 * selector: all three eval steps share the flat `evaluation/` directory,
 * and research lives inside `ideation/` as an Ideation substate. See the
 * module header for the mapping rationale.
 *
 * A.7 (Ideation spec) does not use this selector — Ideation is the first
 * step and has no prior artifacts.
 */
export type StepId =
  | 'ideation'
  | 'plan'
  | 'execution'
  | 'evaluation'
  | 'memorization';

/**
 * Role a selected artifact plays in its source step:
 *
 * - `authoritative` — the step's synthesis output (e.g. `plan.md`). Default
 *   inclusion target.
 * - `source` — a source input that fed the synthesis (e.g. `innovative.md`).
 *   Only surfaced when the caller passes `includeSources: true`.
 */
export type ArtifactRole = 'authoritative' | 'source';

/**
 * One selected artifact reference. `filePath` is the absolute on-disk path;
 * downstream code reads the body fresh when it decides to inline. `round`
 * carries the filename-versioning round number: `0` for unsuffixed files and
 * `N` for `-rN` suffixed files. `preview` is an optional short excerpt
 * intended for logging — it is NOT the full body.
 */
export interface SelectedArtifact {
  readonly stepId: StepId;
  readonly filePath: string;
  readonly role: ArtifactRole;
  readonly round: number;
  readonly preview?: string;
}

/**
 * `selectPriorArtifacts()` input. `sessionDir` is the absolute path to the
 * session directory (e.g. `.gobbi/sessions/{id}/` or a task note directory
 * that uses the same layout). `currentStep` identifies where the workflow
 * is right now; the selector returns artifacts from the steps that precede
 * it, in canonical order.
 */
export interface SelectorOptions {
  readonly sessionDir: string;
  readonly currentStep: StepId;
  readonly includeSources?: boolean;
  /**
   * Future knob: cap the number of rounds returned per base name. A.9
   * currently returns only the latest round (`1`); this field is reserved
   * so later callers can page through earlier rounds without a signature
   * change. Values other than 1 are not yet honored.
   */
  readonly maxRoundsPerStep?: number;
}

// ---------------------------------------------------------------------------
// Canonical workflow ordering
// ---------------------------------------------------------------------------

/**
 * Canonical step ordering used for prior-step discovery. Reflects the five
 * flat top-level session directories listed in `v050-session.md` §Session
 * Directory Structure — one `StepId` per productive directory.
 *
 * This is intentionally not a 1:1 mirror of `specs/index.json` state-machine
 * steps: `*_eval` ids all map to the shared `evaluation/` directory, and
 * `research` is not a directory (it is an Ideation substate whose artifacts
 * live inside `ideation/`).
 */
const STEP_ORDER: readonly StepId[] = [
  'ideation',
  'plan',
  'execution',
  'evaluation',
  'memorization',
] as const;

/**
 * Return the ordered list of steps that come BEFORE `currentStep` in the
 * canonical workflow order. For the first step (`ideation`), returns `[]`.
 *
 * Exposed publicly for the benefit of callers (A.4 assembly, test code)
 * that need the same ordering contract the selector uses internally.
 */
export function getStepOrder(currentStep: StepId): readonly StepId[] {
  const idx = STEP_ORDER.indexOf(currentStep);
  if (idx <= 0) return [];
  return STEP_ORDER.slice(0, idx);
}

// ---------------------------------------------------------------------------
// Per-step discovery configuration
// ---------------------------------------------------------------------------

/**
 * Base name → role mapping for a step. Each entry names a file (without
 * extension) that `latestRound()` looks up in the step directory. The
 * extension is fixed to `md` for every Phase 1/2 artifact.
 */
interface NamedArtifact {
  readonly baseName: string;
  readonly role: ArtifactRole;
}

/**
 * Per-step discovery descriptor. `named` lists artifacts with known base
 * names (subject to filename versioning). `collectMarkdown` is a flag for
 * steps like Evaluation where every `*.md` file at the step root is
 * authoritative (one file per perspective) — base names are not known in
 * advance so we enumerate the directory.
 */
interface StepDiscovery {
  readonly stepId: StepId;
  readonly subdir: string;
  readonly named: readonly NamedArtifact[];
  readonly collectMarkdown?: boolean;
}

/**
 * Discovery configuration per step. Kept out of `StepSpec.meta` because it
 * describes READ-TIME selection (what to inline), not WRITE-TIME expectations
 * (what the step produces). `meta.expectedArtifacts` is the write-time
 * counterpart.
 */
const DISCOVERY: Readonly<Record<StepId, StepDiscovery>> = {
  ideation: {
    stepId: 'ideation',
    subdir: 'ideation',
    named: [
      { baseName: 'ideation', role: 'authoritative' },
      { baseName: 'innovative', role: 'source' },
      { baseName: 'best', role: 'source' },
    ],
  },
  plan: {
    stepId: 'plan',
    subdir: 'plan',
    named: [{ baseName: 'plan', role: 'authoritative' }],
  },
  execution: {
    stepId: 'execution',
    subdir: 'execution',
    named: [{ baseName: 'execution', role: 'authoritative' }],
  },
  evaluation: {
    stepId: 'evaluation',
    subdir: 'evaluation',
    named: [],
    collectMarkdown: true,
  },
  memorization: {
    stepId: 'memorization',
    subdir: 'memorization',
    named: [{ baseName: 'memorization', role: 'authoritative' }],
  },
};

// ---------------------------------------------------------------------------
// Directory listing — wraps `readdir` so a missing directory returns [] rather
// than throwing. Missing step directories are a normal mid-workflow condition.
// ---------------------------------------------------------------------------

async function safeReaddir(path: string): Promise<readonly string[]> {
  try {
    const entries = await readdir(path);
    return entries;
  } catch (err: unknown) {
    if (isNodeENOENT(err) || isNodeENOTDIR(err)) return [];
    throw err;
  }
}

function isNodeENOENT(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === 'ENOENT'
  );
}

function isNodeENOTDIR(err: unknown): boolean {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as { code: unknown }).code === 'ENOTDIR'
  );
}

// ---------------------------------------------------------------------------
// Per-step artifact discovery
// ---------------------------------------------------------------------------

/**
 * Discover authoritative/source artifacts for one prior step. Returns the
 * in-step ordered list (authoritative first, then sources in descriptor
 * order). Missing step directory or missing authoritative file → empty list.
 */
async function discoverStepArtifacts(
  sessionDir: string,
  step: StepId,
  includeSources: boolean,
): Promise<readonly SelectedArtifact[]> {
  const discovery = DISCOVERY[step];
  const stepDir = join(sessionDir, discovery.subdir);
  const files = await safeReaddir(stepDir);
  if (files.length === 0) return [];

  const out: SelectedArtifact[] = [];

  // Named artifacts first — each subject to filename-versioning.
  for (const entry of discovery.named) {
    if (entry.role === 'source' && !includeSources) continue;
    const round = latestRound(files, entry.baseName);
    if (round < 0) continue; // No matching file — skip gracefully.
    const filename = artifactFilename(entry.baseName, 'md', round);
    out.push({
      stepId: step,
      filePath: join(stepDir, filename),
      role: entry.role,
      round,
    });
  }

  // Evaluation-style collection: every `*.md` at the step root is
  // authoritative. Skip any file already surfaced via `named` (unlikely for
  // evaluation today but keeps the contract composable).
  if (discovery.collectMarkdown === true) {
    const seen = new Set(out.map((a) => a.filePath));
    const mdFiles = files
      .filter((f) => f.endsWith('.md'))
      .slice()
      .sort((a, b) => a.localeCompare(b));
    for (const filename of mdFiles) {
      const full = join(stepDir, filename);
      if (seen.has(full)) continue;
      // Evaluation perspective files do not (currently) use the -rN suffix;
      // treat each file as round 0 unless its basename ends in `-rN`.
      const round = detectRoundFromFilename(filename);
      out.push({
        stepId: step,
        filePath: full,
        role: 'authoritative',
        round,
      });
    }
  }

  return out;
}

/**
 * Extract a trailing `-rN` round suffix from a filename. Returns `N` when
 * present, `0` otherwise. Used for evaluation-style markdown enumeration
 * where there is no known base name.
 */
function detectRoundFromFilename(filename: string): number {
  const match = /-r(\d+)\.md$/.exec(filename);
  if (match === null) return 0;
  const digits = match[1];
  if (digits === undefined) return 0;
  return parseInt(digits, 10);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Select prior-step artifacts for the current step's compiled prompt.
 *
 * Returns a flat ordered list:
 *
 *   [step1.authoritative, step1.source*, step2.authoritative, ...]
 *
 * where source entries only appear when `includeSources: true`. Steps are
 * ordered per `getStepOrder(currentStep)`. Missing step directories and
 * missing authoritative files are skipped without error.
 *
 * The returned list is an ORDERED AVAILABILITY LIST — it is up to A.4's
 * assembly + A.5's budget allocator to decide which entries actually land
 * in the compiled prompt. This function does no token accounting and reads
 * no artifact bodies.
 */
export async function selectPriorArtifacts(
  options: SelectorOptions,
): Promise<readonly SelectedArtifact[]> {
  const includeSources = options.includeSources === true;
  const priorSteps = getStepOrder(options.currentStep);

  const out: SelectedArtifact[] = [];
  for (const step of priorSteps) {
    const artifacts = await discoverStepArtifacts(
      options.sessionDir,
      step,
      includeSources,
    );
    out.push(...artifacts);
  }
  return out;
}
