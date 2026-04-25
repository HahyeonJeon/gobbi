/**
 * gobbi workflow transition — emit a workflow-progression event.
 *
 * Positional keyword argument maps to a workflow event via an explicit
 * inline table. Each keyword corresponds to one event factory in
 * `workflow/events/*`; the handler builds the event, calls
 * `appendEventAndUpdateState`, and prints a one-line summary of the new
 * state.
 *
 * ## Keyword → event mapping
 *
 *   COMPLETE              → workflow.step.exit (step taken from state.currentStep)
 *   PASS                  → decision.eval.verdict (verdict: 'pass')
 *   REVISE                → decision.eval.verdict (verdict: 'revise')
 *   ESCALATE              → decision.eval.verdict (verdict: 'escalate')
 *   SKIP                  → workflow.step.skip
 *   TIMEOUT               → workflow.step.timeout
 *   FINISH                → workflow.finish
 *   ABORT                 → workflow.abort
 *   RESUME <target>       → workflow.resume (targetStep is the positional
 *                                             following RESUME)
 *
 * ## Idempotency
 *
 *   - `--tool-call-id <id>` → `'tool-call'` formula
 *     (`${sessionId}:${toolCallId}:${eventType}`).
 *   - Otherwise → `'system'` formula (`${sessionId}:${timestampMs}:${eventType}`).
 *
 * PR C does NOT introduce the `'counter'` kind — Wave 8 (C.7) adds it when
 * `stop` lands and heartbeats can collide on timestamp alone.
 *
 * ## Exit semantics
 *
 *   - `0` — the event was accepted by the reducer and state was written.
 *           (Duplicate-idempotency events also exit 0: the command was a
 *           no-op because the event was already committed.)
 *   - `1` — the reducer rejected the event (invalid transition for the
 *           current state), or session resolution / store open failed.
 *   - `2` — argv parsing failed (unknown flag, missing required positional,
 *           unknown keyword).
 */

import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { EventStore } from '../../workflow/store.js';
import type { IdempotencyKind } from '../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../workflow/engine.js';
import type { Event } from '../../workflow/events/index.js';
import {
  createStepExit,
  createStepSkip,
  createStepTimeout,
  createFinish,
  createAbort,
  createResume,
} from '../../workflow/events/workflow.js';
import { createEvalVerdict } from '../../workflow/events/decision.js';
import type { WorkflowState } from '../../workflow/state.js';
import { resolvePartitionKeys, resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Keyword union — single source of truth.
// ---------------------------------------------------------------------------

/**
 * Every keyword accepted as the positional argument. `RESUME` is the only
 * keyword that takes a second positional (the resume target step).
 */
export const TRANSITION_KEYWORDS = [
  'COMPLETE',
  'PASS',
  'REVISE',
  'ESCALATE',
  'SKIP',
  'TIMEOUT',
  'FINISH',
  'ABORT',
  'RESUME',
] as const;

export type TransitionKeyword = (typeof TRANSITION_KEYWORDS)[number];

const KEYWORD_SET: ReadonlySet<string> = new Set<string>(TRANSITION_KEYWORDS);

function isTransitionKeyword(value: string): value is TransitionKeyword {
  return KEYWORD_SET.has(value);
}

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow transition <KEYWORD> [<target>] [options]

Append a workflow-progression event and advance state.

Keywords:
  COMPLETE                      workflow.step.exit (step from state)
  PASS | REVISE | ESCALATE      decision.eval.verdict
  SKIP                          workflow.step.skip
  TIMEOUT                       workflow.step.timeout
  FINISH                        workflow.finish
  ABORT                         workflow.abort
  RESUME <target>               workflow.resume (requires active target step)

Options:
  --loop-target <step>          REVISE only — the loopTarget on EvalVerdictData
  --reason <text>               Optional reason string (ABORT carries it)
  --tool-call-id <id>           Use 'tool-call' idempotency kind; without this,
                                'system' (timestamp-based) is used
  --session-id <id>             Override the active session id
  --json                        Emit a structured JSON result on stdout
  --help, -h                    Show this help message

Exit codes:
  0   event accepted (including idempotency dedupe — no-op)
  1   reducer rejected the event or session could not be resolved
  2   argv / keyword parsing error`;

const PARSE_OPTIONS = {
  help: { type: 'boolean', short: 'h', default: false },
  'loop-target': { type: 'string' },
  reason: { type: 'string' },
  'tool-call-id': { type: 'string' },
  'session-id': { type: 'string' },
  json: { type: 'boolean', default: false },
} as const;

// ---------------------------------------------------------------------------
// Output shape
// ---------------------------------------------------------------------------

/**
 * Structured result emitted by `--json`. Also built for the human renderer
 * so both paths see the same snapshot of "what happened."
 */
export interface TransitionResult {
  readonly keyword: TransitionKeyword;
  readonly eventType: string;
  readonly persisted: boolean;
  readonly idempotencyKind: IdempotencyKind;
  readonly state: {
    readonly currentStep: string;
    readonly currentSubstate: string | null;
    readonly feedbackRound: number;
  };
  /** Last event seq after the append. `null` when the event was deduplicated. */
  readonly lastSeq: number | null;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Overrides consumed by {@link runTransitionWithOptions}. Exposed for tests
 * only; the CLI entry point {@link runTransition} never passes overrides.
 */
export interface TransitionOverrides {
  /** Override the session directory; when set, --session-id / env are ignored. */
  readonly sessionDir?: string;
}

export async function runTransition(args: string[]): Promise<void> {
  await runTransitionWithOptions(args);
}

export async function runTransitionWithOptions(
  args: string[],
  overrides: TransitionOverrides = {},
): Promise<void> {
  let values: ReturnType<typeof parseArgs>['values'];
  let positionals: readonly string[];
  try {
    const parsed = parseArgs({
      args,
      options: PARSE_OPTIONS,
      allowPositionals: true,
    });
    values = parsed.values;
    positionals = parsed.positionals;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi workflow transition: ${message}\n`);
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }

  if (values.help === true) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  const rawKeyword = positionals[0];
  if (rawKeyword === undefined) {
    process.stderr.write(
      `gobbi workflow transition: missing keyword (expected one of ${TRANSITION_KEYWORDS.join(', ')})\n`,
    );
    process.stderr.write(`${USAGE}\n`);
    process.exit(2);
  }
  if (!isTransitionKeyword(rawKeyword)) {
    process.stderr.write(
      `gobbi workflow transition: unknown keyword "${rawKeyword}" (expected one of ${TRANSITION_KEYWORDS.join(', ')})\n`,
    );
    process.exit(2);
  }
  const keyword: TransitionKeyword = rawKeyword;

  const sessionDir =
    overrides.sessionDir ??
    resolveSessionDir(
      typeof values['session-id'] === 'string' ? values['session-id'] : undefined,
    );
  if (sessionDir === null) {
    process.stderr.write(
      `gobbi workflow transition: could not resolve an active session directory. ` +
        `Set CLAUDE_SESSION_ID or pass --session-id.\n`,
    );
    process.exit(1);
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    process.stderr.write(`gobbi workflow transition: no event store at ${dbPath}\n`);
    process.exit(1);
  }

  const toolCallId =
    typeof values['tool-call-id'] === 'string' ? values['tool-call-id'] : undefined;
  const loopTarget =
    typeof values['loop-target'] === 'string' ? values['loop-target'] : undefined;
  const reason = typeof values.reason === 'string' ? values.reason : undefined;
  const emitJson = values.json === true;

  const sessionId = sessionDirName(sessionDir);
  const partitionKeys = resolvePartitionKeys(sessionDir);
  const store = new EventStore(dbPath, partitionKeys);
  try {
    const state = resolveWorkflowState(sessionDir, store, sessionId);

    let event: Event;
    try {
      event = buildEvent(keyword, state, positionals, { loopTarget, reason });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`gobbi workflow transition: ${message}\n`);
      process.exit(2);
    }

    const idempotencyKind: IdempotencyKind =
      toolCallId !== undefined ? 'tool-call' : 'system';

    let result;
    try {
      result = appendEventAndUpdateState(
        store,
        sessionDir,
        state,
        event,
        'cli',
        sessionId,
        idempotencyKind,
        toolCallId,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      process.stderr.write(`gobbi workflow transition: ${message}\n`);
      process.exit(1);
    }

    // Post-append — derive last seq for the summary. When the append was
    // deduplicated (`persisted === false`) the state is unchanged; report
    // the existing last seq so operators see "nothing landed" without a
    // spurious null.
    const lastRow = store.last(event.type);
    const lastSeq =
      result.persisted && lastRow !== null ? lastRow.seq : null;

    const out: TransitionResult = {
      keyword,
      eventType: event.type,
      persisted: result.persisted,
      idempotencyKind,
      state: {
        currentStep: result.state.currentStep,
        currentSubstate: result.state.currentSubstate,
        feedbackRound: result.state.feedbackRound,
      },
      lastSeq,
    };

    if (emitJson) {
      process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
    } else {
      process.stdout.write(renderHuman(out));
    }
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Event construction — inline mapping table.
// ---------------------------------------------------------------------------

interface BuildOverrides {
  readonly loopTarget?: string | undefined;
  readonly reason?: string | undefined;
}

/**
 * Translate a keyword + positional arg + flag bag into the typed Event that
 * the reducer consumes.
 *
 * Exported for unit tests so the mapping can be exercised without booting
 * a store.
 *
 * Throws when a required positional is missing (RESUME needs a target) or
 * when a flag combination is invalid (REVISE with loopTarget on a keyword
 * other than REVISE is rejected upstream). The caller translates the throw
 * into an exit code.
 */
export function buildEvent(
  keyword: TransitionKeyword,
  state: WorkflowState,
  positionals: readonly string[],
  overrides: BuildOverrides = {},
): Event {
  switch (keyword) {
    case 'COMPLETE':
      return createStepExit({ step: state.currentStep });

    case 'PASS':
      return createEvalVerdict({ verdict: 'pass' });

    case 'REVISE': {
      const data: {
        verdict: 'revise';
        loopTarget?: string | undefined;
      } = { verdict: 'revise' };
      if (overrides.loopTarget !== undefined) {
        data.loopTarget = overrides.loopTarget;
      }
      return createEvalVerdict(data);
    }

    case 'ESCALATE':
      return createEvalVerdict({ verdict: 'escalate' });

    case 'SKIP':
      return createStepSkip({ step: state.currentStep });

    case 'TIMEOUT':
      // Manual timeout (operator-triggered). Automated heartbeat timeouts
      // land in C.7 with measured elapsedMs; a manual TIMEOUT exists so the
      // CLI can drive the error-state path deterministically from a shell.
      // The 0/0 defaults are intentional — a human has no meaningful
      // elapsed-millisecond count to attach, and the reducer only reads
      // `step` to gate the transition.
      return createStepTimeout({
        step: state.currentStep,
        elapsedMs: 0,
        configuredTimeoutMs: 0,
      });

    case 'FINISH':
      return createFinish({});

    case 'ABORT': {
      const data: { reason?: string | undefined } = {};
      if (overrides.reason !== undefined) {
        data.reason = overrides.reason;
      }
      return createAbort(data);
    }

    case 'RESUME': {
      const target = positionals[1];
      if (target === undefined || target === '') {
        throw new Error(
          `RESUME requires a target step as the second positional (e.g. "gobbi workflow transition RESUME ideation")`,
        );
      }
      return createResume({
        targetStep: target,
        // PR D distinguishes resume sources; PR C infers fromError from
        // the current step since resume is only valid from `error` per the
        // reducer guard at `reducer.ts:177-187`.
        fromError: state.currentStep === 'error',
      });
    }

    default:
      return assertNever(keyword);
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled transition keyword: ${JSON.stringify(value)}`);
}

// ---------------------------------------------------------------------------
// Human rendering
// ---------------------------------------------------------------------------

function renderHuman(result: TransitionResult): string {
  const lines: string[] = [];
  lines.push(
    `Event: ${result.eventType} (keyword: ${result.keyword}, idempotency: ${result.idempotencyKind})`,
  );
  const substate =
    result.state.currentSubstate === null ? '-' : result.state.currentSubstate;
  lines.push(`Step: ${result.state.currentStep} (substate: ${substate})`);
  lines.push(`Feedback round: ${result.state.feedbackRound}`);
  if (result.persisted) {
    lines.push(`Seq: ${result.lastSeq ?? '-'}`);
  } else {
    lines.push(`Seq: - (deduplicated — no state change)`);
  }
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function sessionDirName(dir: string): string {
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}
