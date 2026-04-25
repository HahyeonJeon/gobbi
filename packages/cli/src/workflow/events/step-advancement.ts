/**
 * Step-advancement (audit-only) event category — 1 event type.
 *
 * Events: `step.advancement.observed`
 *
 * Introduced by Wave A.1.3 (issue #146) to back the missed-advancement
 * safety net described in `.gobbi/projects/gobbi/design/v050-features/orchestration/README.md`
 * §3.5 / §6. The PostToolUse hook for `Bash` calls whose command starts
 * with `gobbi workflow transition` records one of these events; the Stop
 * hook then queries `events` for the most recent occurrence relative to
 * the last `workflow.step.exit` / `workflow.start` / `workflow.resume`
 * to decide whether to inject a "you forgot to call transition" reminder.
 *
 * ---
 *
 * # Architecture invariant — bypass the reducer
 *
 * `step.advancement.observed` is intentionally **not** a member of the
 * reducer-typed `Event` union. It is an audit-only / observability-only
 * event: state derives nothing from it, no transition fires from it, and
 * the reducer must never see it. Per NOTE-2 in the orchestration review
 * (Pass 4) and the gotcha at `state-db-redesign.md` §1, routing this
 * event through `appendEventAndUpdateState` would silently fail end-to-end:
 *
 *   1. `reducer.ts` uses `assertNever` to enforce exhaustiveness over the
 *      seven categories making up `Event`. An unknown event type reaches
 *      the `assertNever` branch and throws a plain `Error`.
 *   2. `engine.ts:~232`'s audit-on-rejection branch only fires when the
 *      thrown value is a `ReducerRejectionError` — a plain `Error` is
 *      treated as a filesystem-style failure and is NOT audited.
 *   3. The PostToolUse capture path (`capture-planning.ts:~177`) wraps
 *      the engine call in a best-effort try/catch that swallows the
 *      throw, so the event quietly disappears.
 *
 * The fix locked at design time: **commit via `store.append()` directly,
 * outside any `appendEventAndUpdateState` call**. The reducer stays pure;
 * this event never enters its switch. Hook implementers MUST call
 * `store.append()` directly and add a comment at the call site naming
 * this invariant — the type system enforces the bypass by giving
 * `StepAdvancementEvent` a separate, non-`Event`-assignable type.
 */

// ---------------------------------------------------------------------------
// 1. Const object — single source of truth for event type strings
// ---------------------------------------------------------------------------

export const STEP_ADVANCEMENT_EVENTS = {
  OBSERVED: 'step.advancement.observed',
} as const;

// ---------------------------------------------------------------------------
// 2. Set for type guard — values, NOT keys
// ---------------------------------------------------------------------------

const STEP_ADVANCEMENT_EVENT_TYPES = new Set<string>(
  Object.values(STEP_ADVANCEMENT_EVENTS),
);

// ---------------------------------------------------------------------------
// 3. Category union type — derived from the const object
// ---------------------------------------------------------------------------

export type StepAdvancementEventType =
  typeof STEP_ADVANCEMENT_EVENTS[keyof typeof STEP_ADVANCEMENT_EVENTS];

// ---------------------------------------------------------------------------
// 4. Per-event data interfaces
// ---------------------------------------------------------------------------

/**
 * Payload for `step.advancement.observed`.
 *
 * - `step` — the workflow step that was active when the
 *   `gobbi workflow transition` Bash invocation was observed. The Stop
 *   hook compares this against the current step at decision time so a
 *   late-arriving observation for a prior step does not silence the
 *   reminder for the current one.
 * - `toolCallId` — the PostToolUse payload's tool-call identifier.
 *   Doubles as the event-store idempotency-key seed via the `tool-call`
 *   formula (`${sessionId}:${toolCallId}:${type}`), which deduplicates
 *   across hook retries while preserving distinctness across distinct
 *   `gobbi workflow transition` invocations.
 * - `timestamp` — ISO-8601 wall clock at which the hook observed the
 *   PostToolUse event. Used for replay ordering and "≥ N turns since
 *   last advancement" checks in the Stop hook.
 */
export interface StepAdvancementObservedData {
  readonly step: string;
  readonly toolCallId: string;
  readonly timestamp: string;
}

// ---------------------------------------------------------------------------
// 5. Discriminated union for category events
// ---------------------------------------------------------------------------

/**
 * Audit-only event variant. Deliberately NOT a member of the top-level
 * `Event` union exported from `events/index.ts` — the reducer's
 * exhaustive switch must never see this type.
 *
 * Hook implementers narrow with {@link isStepAdvancementEvent} when
 * they need to type-guard a generic `{ type: string }` shape, then call
 * `store.append()` directly. There is no reducer branch and no engine
 * helper; that asymmetry is the architectural fence.
 */
export type StepAdvancementEvent = {
  readonly type: typeof STEP_ADVANCEMENT_EVENTS.OBSERVED;
  readonly data: StepAdvancementObservedData;
};

// ---------------------------------------------------------------------------
// 6. Type guards — Set.has() on values, NEVER `in` operator on keys
// ---------------------------------------------------------------------------

export function isStepAdvancementEvent(
  event: { type: string },
): event is StepAdvancementEvent {
  return STEP_ADVANCEMENT_EVENT_TYPES.has(event.type);
}

// ---------------------------------------------------------------------------
// 7. Factory functions
// ---------------------------------------------------------------------------

export function createStepAdvancementObserved(
  data: StepAdvancementObservedData,
): StepAdvancementEvent {
  return { type: STEP_ADVANCEMENT_EVENTS.OBSERVED, data };
}
