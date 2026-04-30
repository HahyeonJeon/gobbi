/**
 * gobbi workflow resume — append a `workflow.resume` event and emit the
 * compiled resume prompt for the target step.
 *
 * Resolves the active session, validates that the current state is `error`,
 * validates the `--target` against the known active-step set, then either:
 *
 *   - (default) appends a single `workflow.resume` event via
 *     `appendEventAndUpdateState`, or
 *
 *   - (`--force-memorization`) detects the pathway, builds a
 *     {@link PriorErrorSnapshot}, and atomically appends BOTH a
 *     `decision.eval.skip` (carrying the snapshot for CP11 reversibility)
 *     AND a `workflow.resume` targeting `memorization` inside ONE raw
 *     `store.transaction(...)` call. The two appends either both land or
 *     neither does.
 *
 * After either branch, `resolveWorkflowState` refreshes the on-disk state,
 * `compileResumePrompt` builds the CompiledPrompt, and the `.text` is
 * written to stdout.
 *
 * ## Exit codes
 *
 *   0  success — event appended and prompt emitted
 *   1  runtime failure (invalid target, missing event store, resume from
 *      non-error state)
 *   2  argv parsing error (missing --target, unknown flag)
 */

import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { EventStore } from '../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../workflow/engine.js';
import { createResume } from '../../workflow/events/workflow.js';
import {
  createEvalSkip,
  type PriorErrorSnapshot,
} from '../../workflow/events/decision.js';
import type { WorkflowState } from '../../workflow/state.js';
import {
  compileResumePrompt,
  detectPathway,
} from '../../specs/errors.js';
import { resolvePartitionKeys, resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Valid resume targets
//
// The reducer's `workflow.resume` case (`workflow/reducer.ts:177-193`)
// rejects any target that is not in `ACTIVE_STEPS`. The CLI mirrors that
// rule up-front so operators see a clear error-message path instead of
// relying on the reducer-rejection audit event for typos.
// ---------------------------------------------------------------------------

/**
 * The six active steps `--target` may name. Mirrors `ACTIVE_STEPS` from
 * `workflow/state.ts` — kept in sync via the reducer's post-append
 * validation. The CLI check is a fast-fail gate; the reducer is the
 * authoritative gate.
 */
const VALID_TARGETS: ReadonlySet<string> = new Set<string>([
  'ideation',
  'ideation_eval',
  'planning',
  'planning_eval',
  'execution',
  'execution_eval',
  'memorization',
]);

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow resume --target <step> [options]

Resume a workflow from the error state into a named target step. Appends a
workflow.resume event (plus an atomic decision.eval.skip when
--force-memorization is set) and emits the compiled resume prompt to stdout.

Required:
  --target <step>        The step to resume into (ideation / ideation_eval /
                         planning / planning_eval / execution / execution_eval /
                         memorization). \`error\` is rejected.

Options:
  --force-memorization   Skip remaining work and resume into memorization
                         regardless of the pathway. Atomically appends both
                         decision.eval.skip (with the pathway snapshot for
                         CP11 reversibility) and workflow.resume under one
                         store transaction.
  --session-id <id>      Override the active session id (defaults to
                         CLAUDE_SESSION_ID or the single session under
                         .gobbi/sessions/ if only one exists)
  --json                 Reserved — structured output variant
  --help, -h             Show this help message

Exit codes:
  0   success — event appended and prompt emitted
  1   runtime failure (invalid target, missing event store, resume from
      non-error state)
  2   argv parsing error (missing --target, unknown flag)`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  target: { type: 'string' },
  'force-memorization': { type: 'boolean', default: false },
  'session-id': { type: 'string' },
  json: { type: 'boolean', default: false },
} as const;

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Overrides consumed by {@link runResumeWithOptions}. Exposed for tests
 * only; the CLI entry point {@link runResume} never passes overrides.
 */
export interface ResumeOverrides {
  /** Override the session directory; when set, --session-id / env are ignored. */
  readonly sessionDir?: string;
}

export async function runResume(args: string[]): Promise<void> {
  await runResumeWithOptions(args);
}

export async function runResumeWithOptions(
  args: string[],
  overrides: ResumeOverrides = {},
): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  try {
    const parsed = parseArgs({
      args,
      options: PARSE_OPTIONS,
      allowPositionals: false,
    });
    values = parsed.values;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi workflow resume: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const target = typeof values.target === 'string' ? values.target : undefined;
  if (target === undefined || target === '') {
    process.stderr.write(
      `gobbi workflow resume: missing required flag --target <step>\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (target === 'error' || !VALID_TARGETS.has(target)) {
    process.stderr.write(
      `gobbi workflow resume: invalid --target "${target}" — expected one of ` +
        `${Array.from(VALID_TARGETS).join(', ')}\n`,
    );
    process.exit(1);
  }

  const forceMemorization = values['force-memorization'] === true;

  const sessionDir =
    overrides.sessionDir ??
    resolveSessionDir(
      typeof values['session-id'] === 'string' ? values['session-id'] : undefined,
    );
  if (sessionDir === null) {
    process.stderr.write(
      `gobbi workflow resume: could not resolve an active session directory. ` +
        `Set CLAUDE_SESSION_ID or pass --session-id.\n`,
    );
    process.exit(1);
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    process.stderr.write(`gobbi workflow resume: no event store at ${dbPath}\n`);
    process.exit(1);
  }

  const sessionId = sessionDirName(sessionDir);
  const partitionKeys = resolvePartitionKeys(sessionDir);
  const store = new EventStore(dbPath, partitionKeys);
  try {
    const state = resolveWorkflowState(sessionDir, store, sessionId);

    if (state.currentStep !== 'error') {
      process.stderr.write(
        `gobbi workflow resume: cannot resume from non-error state ` +
          `(currentStep=${state.currentStep})\n`,
      );
      process.exit(1);
    }

    // Detect pathway once — used in both branches. The detector runs on
    // the PRE-resume state (still in `error`) because that's the evidence
    // the resume prompt recaps. Running after the resume event lands
    // would (a) fail the detector's error-state pre-condition, and (b)
    // bury the triggering event under the new `workflow.resume` event's
    // seq so the classifier would fall through to Crash.
    let pathway;
    try {
      pathway = detectPathway(state, store);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`gobbi workflow resume: ${message}\n`);
      process.exit(1);
    }

    // Compile the resume prompt on the PRE-resume state + pre-append store
    // for the same reason as above — the resume prompt recaps the pathway
    // that triggered the error, and that evidence is only detectable before
    // the `workflow.resume` event raises the resume-boundary seq.
    const effectiveTarget = forceMemorization ? 'memorization' : target;
    const prompt = compileResumePrompt(state, store, {
      targetStep: effectiveTarget,
    });

    if (forceMemorization) {
      const witnessSeqs: number[] = [];
      if (pathway.kind === 'timeout') {
        witnessSeqs.push(pathway.timeoutEventSeq);
      } else if (pathway.kind === 'invalidTransition') {
        witnessSeqs.push(pathway.invalidTransitionEventSeq);
      } else if (pathway.kind === 'feedbackCap') {
        for (const h of pathway.verdictHistory) witnessSeqs.push(h.verdictSeq);
      } else if (pathway.kind === 'crash') {
        witnessSeqs.push(...pathway.lastEventSeqs);
        if (pathway.heartbeatEventSeq !== null) {
          witnessSeqs.push(pathway.heartbeatEventSeq);
        }
      }
      // Unknown pathway has no witness seqs — empty array is correct.

      const priorError: PriorErrorSnapshot = {
        pathway,
        capturedAt: new Date().toISOString(),
        stepAtError: state.currentStep,
        witnessEventSeqs: witnessSeqs,
      };

      // Atomic two-event append. Per research Area 7, raw
      // `store.transaction(...)` guarantees both events land or neither —
      // `appendEventAndUpdateState` opens its own transaction per call and
      // is not a safe substitute here. Post-PR-FIN-2a-ii the engine no
      // longer projects `state.json`; workflow state is derived on demand
      // via `deriveState(...)` from workspace `state.db` events.
      const skipEvent = createEvalSkip({
        step: 'memorization',
        priorError,
      });
      const resumeEvent = createResume({
        targetStep: 'memorization',
        fromError: true,
      });

      const ts = new Date().toISOString();
      try {
        store.transaction(() => {
          store.append({
            ts,
            type: skipEvent.type,
            step: state.currentStep,
            data: JSON.stringify(skipEvent.data),
            actor: 'cli',
            parent_seq: null,
            idempotencyKind: 'system',
            sessionId,
          });
          store.append({
            ts,
            type: resumeEvent.type,
            step: state.currentStep,
            data: JSON.stringify(resumeEvent.data),
            actor: 'cli',
            parent_seq: null,
            idempotencyKind: 'system',
            sessionId,
          });
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        process.stderr.write(`gobbi workflow resume: ${message}\n`);
        process.exit(1);
      }

      // No state.json refresh required.
      //
      // Pre-PR-FIN-2a-ii this branch had to call `backupState` +
      // `writeState` to keep `<sessionDir>/state.json` in sync with the
      // event log after the raw transaction (CV-9 in the v0.5.0
      // adversarial review campaign, issue #163). PR-FIN-2a-ii retired
      // the per-session `state.json` projection entirely — every
      // subsequent reader (`workflow status / next / guard`) calls
      // `resolveWorkflowState` which now pure-derives from workspace
      // `state.db` events, so the two appended events above are
      // immediately visible.
    } else {
      const resumeEvent = createResume({
        targetStep: target,
        fromError: true,
      });

      try {
        await appendEventAndUpdateState(
          store,
          sessionDir,
          state,
          resumeEvent,
          'cli',
          sessionId,
          'system',
        );
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        process.stderr.write(`gobbi workflow resume: ${message}\n`);
        process.exit(1);
      }
    }

    process.stdout.write(prompt.text);
    if (!prompt.text.endsWith('\n')) process.stdout.write('\n');
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sessionDirName(dir: string): string {
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}
