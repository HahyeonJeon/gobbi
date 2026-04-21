/**
 * Verification event category — 1 event type tracking post-subagent
 * verification-command outcomes (lint, test, typecheck, build, format, custom).
 *
 * Events: result
 *
 * Introduced by v0.5.0 Phase 2 PR E (issue #81). Payload shape follows the
 * ideation-locked VerificationResultData contract: it carries the subagent
 * that was verified, the command that ran, its exit-code + duration, the
 * per-event policy recorded at dispatch time (`inform` vs `gate`), and
 * digests of stdout/stderr. Full stream capture lives on-disk via the
 * runner; the event payload stays lean.
 *
 * The composite idempotency key `${subagentId}:${commandKind}` (locked in
 * ideation §3 L4) is consumed by the `appendEventAndUpdateState` wrapper in
 * E.3 — the factory here only assembles the typed event; the event-store
 * caller supplies the idempotency fields. Without the composite key, lint
 * and test events from the same subagent would collide on
 * `(sessionId, toolCallId, type)` and the later write would be silently
 * dropped by `ON CONFLICT DO NOTHING`.
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const VERIFICATION_EVENTS = {
  RESULT: 'verification.result',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const VERIFICATION_EVENT_TYPES = new Set<string>(
  Object.values(VERIFICATION_EVENTS),
);

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type VerificationEventType =
  typeof VERIFICATION_EVENTS[keyof typeof VERIFICATION_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

/**
 * The closed set of verification command kinds recognised by the
 * verification-block compiler (`specs/verification-block.ts`). The
 * `verification.*` config section and `verification-runner.ts` were removed
 * in Pass 3 finalization (Wave B, `f9b3925`) — this union type is retained
 * because `VerificationResultData` events can still be written by external
 * callers and rendered by the compiler.
 *
 * `custom` is a sink for project-defined one-off commands.
 */
export type VerificationCommandKind =
  | 'lint'
  | 'test'
  | 'typecheck'
  | 'build'
  | 'format'
  | 'custom';

/**
 * The two-valued verification policy recorded per-event. `gate` means the
 * verdict-window compiler treats a non-zero exit as a gate failure that
 * must resolve before the workflow advances; `inform` is advisory-only.
 * Policy is recorded on the event itself so replay reconstructs the exact
 * semantics even if the project config changes later.
 */
export type VerificationPolicy = 'inform' | 'gate';

/**
 * Payload for `verification.result` events.
 *
 * - `subagentId` links back to the `delegation.spawn` event via
 *   `parent_seq`; forms half of the composite idempotency key.
 * - `command` is the literal command line that ran (after any shell
 *   substitutions in project-config have resolved); logged verbatim for
 *   forensic replay.
 * - `commandKind` is the normalised dispatch key matching
 *   `project-config.verification.commands.<kind>`; forms the other half of
 *   the composite idempotency key.
 * - `exitCode` is the raw process exit-code; negative values encode
 *   signal-death: `-1` = SIGTERM (graceful deadline hit), `-2` = SIGKILL
 *   (hard deadline hit after 2s grace). See E.4 scheduler contract.
 * - `durationMs` is the wall-clock span from spawn to reap.
 * - `policy` is the per-event recorded policy (see `VerificationPolicy`).
 * - `timedOut` is `true` iff the scheduler fired its timeout — redundant
 *   with `exitCode < 0` but easier to predicate on.
 * - `stdoutDigest` / `stderrDigest` are stable hashes of the captured
 *   streams. Capture policy: hash-only on pass; first 4KB stderr + 2KB
 *   stdout + hash on fail; full capture only under the
 *   `--verbose-verification` flag. Digests round-trip through JSON
 *   cleanly and let the prompt compiler diff run-to-run without
 *   embedding raw stream bytes in the event log.
 * - `timestamp` is the ISO-8601 Z wall clock at reap time.
 */
export interface VerificationResultData {
  readonly subagentId: string;
  readonly command: string;
  readonly commandKind: VerificationCommandKind;
  readonly exitCode: number;
  readonly durationMs: number;
  readonly policy: VerificationPolicy;
  readonly timedOut: boolean;
  readonly stdoutDigest: string;
  readonly stderrDigest: string;
  readonly timestamp: string;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

export type VerificationEvent = {
  readonly type: typeof VERIFICATION_EVENTS.RESULT;
  readonly data: VerificationResultData;
};

// ---------------------------------------------------------------------------
// 6. Type guard — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isVerificationEvent(
  event: { type: string },
): event is VerificationEvent {
  return VERIFICATION_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createVerificationResult(
  data: VerificationResultData,
): VerificationEvent {
  return { type: VERIFICATION_EVENTS.RESULT, data };
}
