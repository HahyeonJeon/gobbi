/**
 * gobbi workflow guard — PreToolUse hook handler.
 *
 * Reads a Claude Code PreToolUse JSON payload on stdin, resolves the active
 * session's workflow state, evaluates the pre-computed guard matcher for
 * the `(currentStep, tool_name)` pair, evaluates the matching predicates
 * against state, and returns a JSON response on stdout describing the
 * permission decision.
 *
 * ## Hotpath discipline
 *
 *   1. Singleton `EventStore` per process (opens SQLite with WAL +
 *      synchronous=NORMAL + busy_timeout via the `EventStore` constructor
 *      in `workflow/store.ts`).
 *   2. Pre-computed matcher map (see `workflow/guards.ts::DEFAULT_MATCHER`)
 *      — O(1) lookup per invocation. Built once at module load.
 *   3. State read via `resolveWorkflowState` — hits `state.json` in the
 *      common path, falls back to SQLite replay only on corruption.
 *   4. Predicate evaluation is an in-memory registry lookup, O(state size).
 *   5. Synchronous event writes — `appendEventAndUpdateState` commits the
 *      audit event inside the same transaction that observed the deny.
 *      Research decision: async stdout-first with post-flush event write
 *      is rejected because guard is security-critical audit; the event
 *      must be committed before the decision is returned.
 *
 * ## Exit code contract
 *
 * > **ALWAYS exit 0.** A non-zero exit suppresses the JSON output per the
 * > Claude Code hook contract; the decision is then ignored and the tool
 * > call proceeds with default permission.
 *
 * Every failure path — missing session, invalid stdin, store-open error —
 * returns `permissionDecision: 'allow'` (fail-open). Guards cannot gate
 * what they cannot read; failing closed would deadlock the orchestrator.
 *
 * ## Evaluation semantics
 *
 *   - `deny`  — short-circuits. Emits `guard.violation` before stdout.
 *   - `warn`  — accumulates `additionalContext`, emits `guard.warn`, and
 *               continues to the next matching guard.
 *   - `allow` — short-circuits with `permissionDecision: 'allow'`. No
 *               event is emitted (explicit allow is still "no audit
 *               finding").
 *
 * ## References
 *
 * @see `.claude/project/gobbi/design/v050-hooks.md` §Guard Hook Mechanics
 * @see `.claude/project/gobbi/design/v050-state-machine.md` §Guard Specification
 * @see .claude/project/gobbi/note/20260416-2225-…/research/research.md §Wave 6
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { readStdinJson } from '../../lib/stdin.js';
import { EventStore } from '../../workflow/store.js';
import {
  appendEventAndUpdateState,
  resolveWorkflowState,
} from '../../workflow/engine.js';
import {
  createGuardViolation,
  createGuardWarn,
} from '../../workflow/events/guard.js';
import { defaultPredicates } from '../../workflow/predicates.js';
import {
  DEFAULT_MATCHER,
  buildReason,
  type Guard,
  type GuardMatcher,
} from '../../workflow/guards.js';
import type { WorkflowState, WorkflowStep } from '../../workflow/state.js';
import { resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Hook payload shape
// ---------------------------------------------------------------------------

/**
 * Subset of the Claude Code PreToolUse JSON payload that this command cares
 * about. Additional fields (`tool_call_id`, `agent_id`, etc.) are read via
 * optional index access; the type keeps the mandatory ones strict.
 *
 * Source: `v050-hooks.md:19–33`.
 */
interface PreToolUsePayload {
  readonly tool_name: string;
  readonly session_id?: string;
  readonly tool_call_id?: string;
  readonly agent_id?: string;
  readonly tool_input?: unknown;
}

function isPreToolUsePayload(value: unknown): value is PreToolUsePayload {
  if (value === null || typeof value !== 'object') return false;
  const rec = value as Record<string, unknown>;
  if (typeof rec['tool_name'] !== 'string') return false;
  if (rec['session_id'] !== undefined && typeof rec['session_id'] !== 'string') {
    return false;
  }
  if (
    rec['tool_call_id'] !== undefined &&
    typeof rec['tool_call_id'] !== 'string'
  ) {
    return false;
  }
  if (rec['agent_id'] !== undefined && typeof rec['agent_id'] !== 'string') {
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Response shape
// ---------------------------------------------------------------------------

/**
 * Permission decision values per `v050-hooks.md:38–45`. Guards emit
 * `'allow'` or `'deny'`; `'ask'` is reserved for human-in-the-loop flows
 * this command does not yet trigger; `'defer'` lets the next hook decide.
 */
type PermissionDecision = 'allow' | 'deny' | 'ask' | 'defer';

interface HookSpecificOutput {
  readonly permissionDecision: PermissionDecision;
  readonly permissionDecisionReason?: string;
  readonly additionalContext?: string;
}

interface HookResponse {
  readonly hookSpecificOutput: HookSpecificOutput;
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

function emitAllow(additionalContext?: string): void {
  const output: HookSpecificOutput = {
    permissionDecision: 'allow',
    ...(additionalContext !== undefined && additionalContext !== ''
      ? { additionalContext }
      : {}),
  };
  const response: HookResponse = { hookSpecificOutput: output };
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

function emitDeny(reason: string): void {
  const response: HookResponse = {
    hookSpecificOutput: {
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  };
  process.stdout.write(`${JSON.stringify(response)}\n`);
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export interface GuardOverrides {
  /** Override the session directory; when set, `session_id` / env are ignored. */
  readonly sessionDir?: string;
  /** Override the guard matcher — tests pass fixtures here. */
  readonly matcher?: GuardMatcher;
  /** Seed the payload directly (skips stdin). Tests-only. */
  readonly payload?: unknown;
}

export async function runGuard(args: string[]): Promise<void> {
  await runGuardWithOptions(args);
}

/**
 * Testable entry point. Accepts the same CLI args as {@link runGuard} but
 * allows overrides for the session directory, matcher, and payload so
 * tests can exercise the command without touching real stdin.
 */
export async function runGuardWithOptions(
  args: string[],
  overrides: GuardOverrides = {},
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Acquire payload ------------------------------------------------
  // Fail-open on every parse/shape failure: emit allow, log nothing, exit 0.
  // A hook that blocks ambiguous input deadlocks the orchestrator.
  const rawPayload =
    overrides.payload !== undefined
      ? overrides.payload
      : await readStdinJson<unknown>();
  if (!isPreToolUsePayload(rawPayload)) {
    emitAllow();
    return;
  }
  const payload: PreToolUsePayload = rawPayload;

  // --- 2. Resolve session ------------------------------------------------
  // `session_id` from the payload takes priority over env — hooks may fire
  // before the orchestrator sets CLAUDE_SESSION_ID. Falls back to the
  // single-session heuristic in `resolveSessionDir` when nothing explicit.
  const sessionDir =
    overrides.sessionDir ?? resolveSessionDir(payload.session_id);
  if (sessionDir === null) {
    emitAllow();
    return;
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    emitAllow();
    return;
  }

  // --- 3. Open store + read state ----------------------------------------
  const sessionId = payload.session_id ?? sessionDirName(sessionDir);
  let store: EventStore;
  try {
    store = new EventStore(dbPath);
  } catch {
    // Malformed DB on disk — fail open. The reducer / append path will
    // report the drift the next time a writeable command touches the
    // store.
    emitAllow();
    return;
  }

  try {
    let state: WorkflowState;
    try {
      state = resolveWorkflowState(sessionDir, store, sessionId);
    } catch {
      emitAllow();
      return;
    }

    // --- 4. Matcher + predicate evaluation -------------------------------
    const matcher = overrides.matcher ?? DEFAULT_MATCHER;
    const matched = matcher.match(state.currentStep, payload.tool_name);
    if (matched.length === 0) {
      emitAllow();
      return;
    }

    const warns: string[] = [];
    for (const guard of matched) {
      const predicate = defaultPredicates[guard.predicate];
      if (!predicate(state)) continue;

      switch (guard.effect) {
        case 'deny': {
          const reason = buildReason(guard, state.currentStep);
          writeViolationEvent(store, sessionDir, state, guard, payload);
          emitDeny(reason);
          return;
        }
        case 'warn': {
          writeWarnEvent(store, sessionDir, state, guard, payload);
          warns.push(buildReason(guard, state.currentStep));
          continue;
        }
        case 'allow': {
          // Explicit allow short-circuits. Any already-accumulated warns
          // from earlier guards in the chain are surfaced alongside the
          // allow so the orchestrator still receives the advisory context.
          emitAllow(warns.length > 0 ? warns.join('\n') : undefined);
          return;
        }
        default:
          return assertNever(guard);
      }
    }

    emitAllow(warns.length > 0 ? warns.join('\n') : undefined);
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Event emission
// ---------------------------------------------------------------------------

function writeViolationEvent(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  guard: Guard,
  payload: PreToolUsePayload,
): void {
  const event = createGuardViolation({
    guardId: guard.id,
    toolName: payload.tool_name,
    reason: guard.reason,
    step: state.currentStep,
    timestamp: new Date().toISOString(),
  });
  const { kind, toolCallId } = idempotencyFor(payload);
  // The hook must exit 0 even if the append fails — the primary duty is
  // returning a decision. Swallow errors, keep the audit attempt, but do
  // NOT leak a non-zero exit.
  try {
    appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      event,
      'hook',
      state.sessionId,
      kind,
      toolCallId,
    );
  } catch {
    // Audit-best-effort — decision has already been computed.
  }
}

function writeWarnEvent(
  store: EventStore,
  sessionDir: string,
  state: WorkflowState,
  guard: Guard & { readonly effect: 'warn' },
  payload: PreToolUsePayload,
): void {
  const event = createGuardWarn({
    guardId: guard.id,
    toolName: payload.tool_name,
    reason: guard.reason,
    step: state.currentStep,
    timestamp: new Date().toISOString(),
    severity: 'warning',
    code: guard.code,
  });
  const { kind, toolCallId } = idempotencyFor(payload);
  try {
    appendEventAndUpdateState(
      store,
      sessionDir,
      state,
      event,
      'hook',
      state.sessionId,
      kind,
      toolCallId,
    );
  } catch {
    // Best-effort audit.
  }
}

interface IdempotencyChoice {
  readonly kind: 'tool-call' | 'system';
  readonly toolCallId: string | undefined;
}

/**
 * Pick the idempotency formula for the guard's event append. The hook
 * contract guarantees a `tool_call_id` on every PreToolUse payload in
 * practice, but we tolerate its absence by falling back to the timestamp-
 * based `'system'` formula. A retry with the same `tool_call_id` dedupes
 * at the store's `UNIQUE(idempotency_key) DO NOTHING` boundary.
 */
function idempotencyFor(payload: PreToolUsePayload): IdempotencyChoice {
  if (typeof payload.tool_call_id === 'string' && payload.tool_call_id !== '') {
    return { kind: 'tool-call', toolCallId: payload.tool_call_id };
  }
  return { kind: 'system', toolCallId: undefined };
}

// ---------------------------------------------------------------------------
// Misc helpers
// ---------------------------------------------------------------------------

function sessionDirName(dir: string): string {
  const parts = dir.split(/[\\/]+/);
  return parts[parts.length - 1] ?? dir;
}

function assertNever(value: never): never {
  throw new Error(`Unhandled guard effect: ${JSON.stringify(value)}`);
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow guard

PreToolUse hook handler. Reads the Claude Code hook payload on stdin,
evaluates the guard matcher for the active session's current step + the
tool named in the payload, and writes a hookSpecificOutput response to
stdout.

Hook contract — this command:
  - ALWAYS exits 0 (a non-zero exit suppresses the JSON response).
  - Fails OPEN (permissionDecision: 'allow') on any parse, session, or
    store error. Guards cannot gate what they cannot read.
  - Commits audit events (guard.violation / guard.warn) synchronously
    before returning the decision.

This command is meant to be invoked by Claude Code, not by humans
directly. See .claude/project/gobbi/design/v050-hooks.md for the hook
registration / payload shape.`;

/**
 * Re-exported for the workflow dispatcher registration in
 * `commands/workflow.ts`.
 */
export { USAGE as GUARD_USAGE };

// ---------------------------------------------------------------------------
// Test-only latency sanity helper
// ---------------------------------------------------------------------------

/**
 * Soft latency ceiling for the integration / reality-check test. The
 * research budget document targets 3–5ms p50, ≤8ms p99; a strict assertion
 * at that level would flake under CI noise. 100ms is the sanity ceiling
 * intended only to catch order-of-magnitude regressions (e.g. someone
 * spawning a subprocess on the hotpath).
 *
 * @internal
 */
export const LATENCY_SANITY_CEILING_MS = 100;
