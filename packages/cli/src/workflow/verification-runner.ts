/**
 * Post-subagent-stop verification runner — the E.3 orchestrator that composes
 * project-config lookup (E.5), command dispatch (E.4 scheduler), digest
 * computation, and event-store writes (PR A engine) into a single entry
 * point called from `gobbi workflow next` (post-compile, pre-return).
 *
 * ## What it does
 *
 *   1. Loads `.gobbi/project-config.json` via {@link loadProjectConfig}. On
 *      a missing / not-yet-initialised file the loader returns defaults, so
 *      the runner never throws for the "no config" case.
 *   2. For each `ActiveSubagent` in `state.activeSubagents`, iterates each
 *      `commandKind` listed in `verification.runAfterSubagentStop` in array
 *      order. A kind with no configured command (`null` slot) or not
 *      declared in the kind set is silently skipped.
 *   3. Calls {@link SyncScheduler}.run with per-task timeout + policy, hashes
 *      the captured stdout/stderr via `Bun.CryptoHasher`, and emits a
 *      `verification.result` event through {@link appendEventAndUpdateState}
 *      with composite `toolCallId = `${subagentId}:${commandKind}`` (L4).
 *   4. On gate-policy non-zero exit OR timeout, stops subsequent commands
 *      for THIS subagent (L17 fail-fast). `inform` failures do NOT
 *      short-circuit. Fail-fast is scoped per-subagent — a sibling
 *      subagent's verification list still runs.
 *
 * ## Design anchors
 *
 * - **Composite idempotency key** (L4): `${subagentId}:${commandKind}`
 *   passed as `toolCallId` under the `'tool-call'` kind. Re-running verify
 *   for the same subagent+kind dedups at `store.append`'s ON CONFLICT.
 * - **Digest policy** (ideation §2): on pass — hash-only (zero-byte stream
 *   slice). On fail/timeout — hash + first 4KB of stdout, hash + first 4KB
 *   of stderr. Full captures are NOT embedded in the event store; they
 *   live out-of-band when `--verbose-verification` is enabled (future).
 * - **Engine wrapper, NEVER raw `store.append`** (project gotcha: code-edits
 *   `store.append takes a full AppendInput`): production writes always go
 *   through {@link appendEventAndUpdateState} — it builds the AppendInput,
 *   runs the compound transaction, wraps the audit-emit for reducer
 *   rejections, and updates `state.verificationResults` via the reducer.
 * - **L8 minimal surface**: returns `readonly VerificationOutcome[]` — no
 *   AsyncIterable, no lifecycle hooks. The fail-fast is materialised by
 *   NOT invoking the scheduler for skipped commands, so the returned array
 *   length equals the number of commands actually executed, not the input
 *   length.
 *
 * ## Scope
 *
 * This module does NOT:
 *   - Gate workflow state transitions on verification outcomes (inform-only
 *     per design; E.8 verification-block compiler surfaces outcomes into
 *     prompts).
 *   - Compile prompts (E.8's job).
 *   - Own AbortController lifecycle — the caller passes a signal in or the
 *     runner fabricates an un-aborted signal so `scheduler.run` receives a
 *     stable `AbortSignal` every time.
 */

import path from 'node:path';

import type { EventStore } from './store.js';
import type { WorkflowState } from './state.js';
import type {
  VerificationCommandKind,
  VerificationPolicy,
  VerificationResultData,
} from './events/verification.js';
import { createVerificationResult } from './events/verification.js';
import type {
  VerificationOutcome,
  VerificationTask,
} from './verification-scheduler.js';
import { SyncScheduler } from './verification-scheduler.js';
import { appendEventAndUpdateState } from './engine.js';
import { loadProjectConfig, type ProjectConfig, type CommandSlot } from '../lib/project-config.js';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/**
 * On-fail stream slice length — first 4KB of stdout / stderr embedded into
 * the digest string alongside the SHA-256 hash. Ideation §2 locks 4KB as
 * the cap: large enough to contain a typical typecheck / lint error banner,
 * small enough that a runaway log does not bloat the event store.
 */
const FAIL_STREAM_SLICE_BYTES = 4 * 1024;

/**
 * Closed set of `VerificationCommandKind` literals — used to filter out
 * user-supplied `runAfterSubagentStop` entries that do not match a known
 * kind. ajv's project-config schema only validates shape (min-length
 * string), not membership; guarding here keeps the runner's loop from
 * emitting events with an off-schema `commandKind`.
 */
const COMMAND_KINDS: ReadonlySet<VerificationCommandKind> = new Set<VerificationCommandKind>([
  'lint',
  'test',
  'typecheck',
  'build',
  'format',
  'custom',
]);

function isCommandKind(value: string): value is VerificationCommandKind {
  return COMMAND_KINDS.has(value as VerificationCommandKind);
}

// ---------------------------------------------------------------------------
// Digest helper
// ---------------------------------------------------------------------------

/**
 * Build the `{stdout,stderr}Digest` string recorded on the event. Shape:
 *
 *   - pass  → `sha256:<64-hex>`
 *   - fail  → `sha256:<64-hex>;slice:<utf8 first 4KB>`
 *
 * The prefix scheme lets downstream consumers split on `;slice:` without
 * false positives — `sha256:` hex never contains a literal semicolon. On
 * fail, the slice is UTF-8-decoded with `toString('utf8')` which is lossy
 * for binary streams but acceptable for the documented consumer
 * (verification-block prompt — human-readable).
 */
function computeDigest(bytes: Buffer, failure: boolean): string {
  const hasher = new Bun.CryptoHasher('sha256');
  hasher.update(bytes);
  const hash = hasher.digest('hex');
  if (!failure) {
    return `sha256:${hash}`;
  }
  const slice = bytes.subarray(0, FAIL_STREAM_SLICE_BYTES).toString('utf8');
  return `sha256:${hash};slice:${slice}`;
}

// ---------------------------------------------------------------------------
// Repo root resolution
//
// Session directories live at `<repoRoot>/.gobbi/sessions/<sessionId>` (see
// `runInitWithOptions` in commands/workflow/init.ts). The runner derives
// repoRoot deterministically from sessionDir rather than calling
// `getRepoRoot()` so tests can drive it into a tmpdir without mutating git
// state, and concurrent sessions in different worktrees each resolve to
// their own config.
// ---------------------------------------------------------------------------

function repoRootFromSessionDir(sessionDir: string): string {
  return path.resolve(sessionDir, '..', '..', '..');
}

// ---------------------------------------------------------------------------
// Single-command execution
// ---------------------------------------------------------------------------

interface RunOneCommandArgs {
  readonly store: EventStore;
  readonly sessionDir: string;
  readonly sessionId: string;
  readonly state: WorkflowState;
  readonly subagentId: string;
  readonly commandKind: VerificationCommandKind;
  readonly slot: CommandSlot;
  readonly repoRoot: string;
  readonly scheduler: SyncScheduler;
  readonly signal: AbortSignal;
  readonly timestamp: string;
}

interface RunOneCommandResult {
  readonly outcome: VerificationOutcome;
  readonly nextState: WorkflowState;
  readonly policy: VerificationPolicy;
}

async function runOneCommand(
  args: RunOneCommandArgs,
): Promise<RunOneCommandResult> {
  const task: VerificationTask = {
    subagentId: args.subagentId,
    command: args.slot.command,
    commandKind: args.commandKind,
    cwd: args.repoRoot,
    timeoutMs: args.slot.timeoutMs,
    policy: args.slot.policy,
  };

  const outcome = await args.scheduler.run(task, args.signal);
  const failure = outcome.exitCode !== 0 || outcome.timedOut;

  const data: VerificationResultData = {
    subagentId: args.subagentId,
    command: args.slot.command,
    commandKind: args.commandKind,
    exitCode: outcome.exitCode,
    durationMs: outcome.durationMs,
    policy: args.slot.policy,
    timedOut: outcome.timedOut,
    stdoutDigest: computeDigest(outcome.stdoutBytes, failure),
    stderrDigest: computeDigest(outcome.stderrBytes, failure),
    timestamp: args.timestamp,
  };

  const event = createVerificationResult(data);
  const toolCallId = `${args.subagentId}:${args.commandKind}`;

  const appendResult = appendEventAndUpdateState(
    args.store,
    args.sessionDir,
    args.state,
    event,
    'hook',
    args.sessionId,
    'tool-call',
    toolCallId,
    null,
  );

  return {
    outcome,
    nextState: appendResult.state,
    policy: args.slot.policy,
  };
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Post-compile verification runner. Invoked from `compileCurrentStep` in
 * `commands/workflow/next.ts` after the prompt has been compiled.
 *
 * @param sessionDir   Session directory — `<repoRoot>/.gobbi/sessions/<id>`.
 * @param store        Open {@link EventStore} for the session's SQLite DB.
 * @param state        Current {@link WorkflowState} (usually freshly
 *                     resolved by the caller). The runner threads state
 *                     through each emission — `appendEventAndUpdateState`
 *                     returns the post-reduce state which feeds the next
 *                     call.
 * @param sessionId    Session id — used for the `AppendInput.sessionId`
 *                     idempotency field, matches `state.sessionId`.
 * @param abortSignal  Optional caller-supplied abort signal. If omitted,
 *                     the runner fabricates an un-aborted signal via a
 *                     fresh {@link AbortController} so the scheduler's
 *                     `signal: AbortSignal` contract is always satisfied.
 * @returns            The outcomes of the commands that actually ran — not
 *                     the full input length when fail-fast short-circuited.
 */
export async function runVerification(
  sessionDir: string,
  store: EventStore,
  state: WorkflowState,
  sessionId: string,
  abortSignal?: AbortSignal,
): Promise<readonly VerificationOutcome[]> {
  const repoRoot = repoRootFromSessionDir(sessionDir);

  let config: ProjectConfig;
  try {
    config = loadProjectConfig(repoRoot);
  } catch (err) {
    // A malformed project-config.json is a project-author error, not a
    // runner invariant violation. Surface it to stderr and return an empty
    // outcome list so `next` can still emit its compiled prompt — the
    // user sees the warning on the next invocation too until they fix the
    // config.
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(
      `gobbi workflow next: skipping verification — ${message}\n`,
    );
    return [];
  }

  const { runAfterSubagentStop, commands } = config.verification;
  if (runAfterSubagentStop.length === 0) return [];
  if (state.activeSubagents.length === 0) return [];

  const scheduler = new SyncScheduler();
  // Fabricate an un-aborted signal when the caller doesn't supply one.
  // Scheduler.run consumes `AbortSignal` unconditionally; a never-aborting
  // signal has zero runtime cost beyond the controller allocation.
  const signal = abortSignal ?? new AbortController().signal;

  const outcomes: VerificationOutcome[] = [];
  let currentState = state;

  for (const subagent of state.activeSubagents) {
    for (const kind of runAfterSubagentStop) {
      if (signal.aborted) return outcomes;
      if (!isCommandKind(kind)) continue;

      // Safe record read — `commands` is `VerificationCommands` whose keys
      // are the same literal union as `VerificationCommandKind`, so the
      // indexed read returns `CommandSlot | null`.
      const slot = commands[kind];
      if (slot === null) continue;

      const timestamp = new Date().toISOString();
      const { outcome, nextState, policy } = await runOneCommand({
        store,
        sessionDir,
        sessionId,
        state: currentState,
        subagentId: subagent.subagentId,
        commandKind: kind,
        slot,
        repoRoot,
        scheduler,
        signal,
        timestamp,
      });

      outcomes.push(outcome);
      currentState = nextState;

      // L17 fail-fast — gate policy + non-zero exit (or timeout) halts the
      // remaining commands for THIS subagent only. Sibling subagents in
      // `activeSubagents` still run their own list.
      if (
        policy === 'gate' &&
        (outcome.exitCode !== 0 || outcome.timedOut)
      ) {
        break;
      }
    }
  }

  return outcomes;
}
