/**
 * gobbi workflow capture-advancement — PostToolUse(Bash) hook handler.
 *
 * Reads a Claude Code PostToolUse JSON payload on stdin (fired for the
 * `Bash` tool whose command starts with `gobbi workflow transition`),
 * appends one `step.advancement.observed` audit-only event to the
 * per-session event store. The Stop-hook missed-advancement consumer
 * (future PR) reads these events to decide whether to inject a "you
 * forgot to call transition" reminder.
 *
 * ## Hook contract
 *
 * > **Observational hook — no permissionDecision, always exit 0.**
 *
 * PostToolUse cannot block the tool call. Every failure path silently
 * no-ops and the helper always exits cleanly. The canonical outcome is
 * the `step.advancement.observed` event row; stdout is intentionally
 * empty.
 *
 * ## Architectural fence — bypass the reducer
 *
 * `step.advancement.observed` is audit-only and MUST NOT enter the
 * reducer. This module commits via `store.append()` directly, NEVER
 * through `appendEventAndUpdateState`. See
 * `workflow/events/step-advancement.ts:30-41` and gotcha
 * `state-db-redesign.md` §1 for the full rationale. The TypeScript
 * surface enforces the bypass (`StepAdvancementEvent` is not a member of
 * the reducer's `Event` union); this module additionally names the
 * invariant in a comment at the call site.
 *
 * ## Settings gate
 *
 * The emitter is dormant by default. `workflow.observability.advancement.enabled`
 * (PR-CFM-C T4) gates the entire path — when the resolved cascade does
 * not yield `enabled === true`, the helper returns immediately with no
 * event write. Operators flip the flag via `gobbi config set` to
 * activate the audit data stream.
 *
 * @see `commands/workflow/capture-planning.ts` — sibling pattern (audit
 *      event without a settings gate; productive event flows through
 *      the reducer instead).
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { readStdinJson } from '../../lib/stdin.js';
import { isRecord, isString } from '../../lib/guards.js';
import { getRepoRoot } from '../../lib/repo.js';
import { resolveSettings } from '../../lib/settings-io.js';
import { EventStore } from '../../workflow/store.js';
import { createStepAdvancementObserved } from '../../workflow/events/step-advancement.js';
import { resolvePartitionKeys, resolveSessionDir } from '../session.js';

// ---------------------------------------------------------------------------
// Hook payload shape
// ---------------------------------------------------------------------------

/**
 * Subset of the PostToolUse JSON payload this command reads. The matcher
 * narrows the input to `tool_name === 'Bash'` invocations whose
 * `tool_input.command` starts with `gobbi workflow transition`. Anything
 * else is a silent no-op.
 *
 * Source: `v050-hooks.md` §PostToolUse.
 */
interface PostToolUsePayload {
  readonly tool_name?: string;
  readonly session_id?: string;
  readonly tool_call_id?: string;
  readonly tool_input?: {
    readonly command?: string;
  };
}

function asPayload(value: unknown): PostToolUsePayload {
  if (!isRecord(value)) return {};
  const out: Record<string, unknown> = {};
  if (isString(value['tool_name'])) out['tool_name'] = value['tool_name'];
  if (isString(value['session_id'])) out['session_id'] = value['session_id'];
  if (isString(value['tool_call_id'])) {
    out['tool_call_id'] = value['tool_call_id'];
  }
  const toolInput = value['tool_input'];
  if (isRecord(toolInput)) {
    const ti: Record<string, unknown> = {};
    if (isString(toolInput['command'])) ti['command'] = toolInput['command'];
    out['tool_input'] = ti;
  }
  return out as PostToolUsePayload;
}

/**
 * Defensive matcher — the plugin manifest already gates registration to
 * `tool_name === 'Bash'`, but a per-repo override might broaden it.
 * Returns `true` only when both the tool name AND the command prefix
 * match, so a Bash invocation that shells out to anything other than
 * `gobbi workflow transition` is a silent no-op.
 *
 * The regex tolerates leading whitespace (so `"  gobbi workflow transition COMPLETE"`
 * matches) and uses `\b` to ensure `transition` is a complete token —
 * `gobbi workflow transitionx` would NOT match.
 */
const TRANSITION_COMMAND_RE = /^\s*gobbi\s+workflow\s+transition\b/;

export function isBashTransitionInvocation(payload: unknown): boolean {
  if (!isRecord(payload)) return false;
  const toolName = payload['tool_name'];
  if (!isString(toolName) || toolName !== 'Bash') return false;
  const toolInput = payload['tool_input'];
  if (!isRecord(toolInput)) return false;
  const command = toolInput['command'];
  if (!isString(command)) return false;
  return TRANSITION_COMMAND_RE.test(command);
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

export interface CaptureAdvancementOverrides {
  /** Override the resolved session directory (tests-only). */
  readonly sessionDir?: string;
  /** Seed the payload directly (tests-only). */
  readonly payload?: unknown;
  /**
   * Override the resolved repo root for `resolveSettings()` (tests-only).
   * When omitted, the helper derives repoRoot path-wise from `sessionDir`
   * (`<repoRoot>/.gobbi/projects/<name>/sessions/<id>`) and falls back to
   * `getRepoRoot()` if the derivation fails.
   */
  readonly repoRoot?: string;
}

export async function runCaptureAdvancement(args: string[]): Promise<void> {
  await runCaptureAdvancementWithOptions(args);
}

/**
 * Testable entry point — same behaviour as {@link runCaptureAdvancement}
 * but accepts overrides for session directory, repo root, and stdin
 * payload. The implementation walks every short-circuit gate in order:
 *
 *   1. `--help` / `-h` flag.
 *   2. `tool_name === 'Bash'` AND command starts with `gobbi workflow transition`.
 *   3. `session_id` present AND `tool_call_id` present.
 *   4. Session directory resolves AND `gobbi.db` exists.
 *   5. `workflow.observability.advancement.enabled === true` in the
 *      cascade. (Most operators leave this off; the gate keeps the
 *      emitter dormant.)
 *
 * Each gate failing returns silently. Past every gate, a single
 * `store.append()` writes the audit row. Best-effort try/catch wraps the
 * append — observational hooks never fail the tool call.
 */
export async function runCaptureAdvancementWithOptions(
  args: string[],
  overrides: CaptureAdvancementOverrides = {},
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // --- 1. Acquire payload ------------------------------------------------
  const rawPayload =
    overrides.payload !== undefined
      ? overrides.payload
      : await readStdinJson<unknown>();

  if (!isBashTransitionInvocation(rawPayload)) {
    return;
  }
  const payload = asPayload(rawPayload);

  // --- 2. Required scope keys --------------------------------------------
  const sessionId = payload.session_id;
  const toolCallId = payload.tool_call_id;
  if (sessionId === undefined || sessionId === '') return;
  if (toolCallId === undefined || toolCallId === '') return;

  // --- 3. Resolve session ------------------------------------------------
  const sessionDir =
    overrides.sessionDir ?? resolveSessionDir(sessionId);
  if (sessionDir === null) {
    return;
  }

  const dbPath = join(sessionDir, 'gobbi.db');
  if (!existsSync(dbPath)) {
    return;
  }

  // --- 4. Settings gate --------------------------------------------------
  // `resolveSettings({ repoRoot })` is SYNCHRONOUS — no `await`. The
  // signature requires `repoRoot`; tests pass an explicit override, the
  // production hook path falls back to `getRepoRoot()` (which uses
  // `git rev-parse`).
  const repoRoot = overrides.repoRoot ?? getRepoRoot();
  const partitionKeys = resolvePartitionKeys(sessionDir);
  let enabled = false;
  try {
    const settings = resolveSettings({
      repoRoot,
      sessionId,
      ...(partitionKeys.projectId !== null
        ? { projectName: partitionKeys.projectId }
        : {}),
    });
    enabled =
      settings.workflow?.observability?.advancement?.enabled === true;
  } catch {
    // Cascade read/parse failure → treat as disabled (observational hook
    // contract: never fail the tool call). The dormant default keeps
    // production paths fail-closed.
    return;
  }
  if (!enabled) {
    return;
  }

  // --- 5. Open store + read current step + emit -------------------------
  let store: EventStore;
  try {
    store = new EventStore(dbPath, {
      sessionId: partitionKeys.sessionId,
      projectId: partitionKeys.projectId,
    });
  } catch {
    return;
  }

  try {
    // Read the row-level `step` column from the most recent event. This
    // is a single indexed query (NOT a full reduce) so the hot path
    // stays cheap even when sessions accumulate thousands of rows.
    const lastRow = store.lastNAny(1)[0];
    const currentStep = lastRow?.step ?? 'idle';

    const event = createStepAdvancementObserved({
      step: currentStep,
      toolCallId,
      timestamp: new Date().toISOString(),
    });

    // ---------------------------------------------------------------
    // Architectural fence — `step.advancement.observed` is audit-only.
    //
    // NEVER route this event through `appendEventAndUpdateState`. The
    // reducer's `assertNever` would throw a plain `Error`, the
    // engine's audit-on-rejection branch would NOT fire (it expects
    // `ReducerRejectionError`), and the event would silently
    // disappear. See `workflow/events/step-advancement.ts:30-41` and
    // gotcha `state-db-redesign.md` §1.
    //
    // The TypeScript surface enforces the bypass —
    // `StepAdvancementEvent` is intentionally NOT a member of the
    // reducer's `Event` union — but we name the invariant here too
    // so future hook implementers don't try to "fix" the call by
    // widening anything.
    //
    // The `step` column is set at the row level (NOT only inside
    // `data`) so `lastNAny(1)[0]?.step` returns the actual current
    // step on subsequent reads.
    // ---------------------------------------------------------------
    try {
      store.append({
        ts: event.data.timestamp,
        type: event.type,
        step: currentStep,
        data: JSON.stringify(event.data),
        actor: 'hook',
        sessionId,
        idempotencyKind: 'tool-call',
        toolCallId,
      });
    } catch {
      // Best-effort — observational hooks always exit 0. Disk full,
      // WAL lock, SQLite busy: swallow the error so the tool call
      // succeeds.
    }
  } finally {
    store.close();
  }
}

// ---------------------------------------------------------------------------
// Help
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi workflow capture-advancement

PostToolUse hook handler for the Bash tool. Reads the Claude Code hook
payload on stdin and (when the Bash command starts with
\`gobbi workflow transition\`) appends one \`step.advancement.observed\`
audit-only event to the per-session event store.

The emitter is gated by \`workflow.observability.advancement.enabled\`
(default false). Flip the flag via \`gobbi config set\` to activate.

Observational hook — writes no permissionDecision and always exits 0.`;

export { USAGE as CAPTURE_ADVANCEMENT_USAGE };
