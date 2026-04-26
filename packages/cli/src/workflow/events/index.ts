/**
 * Event type system — 9 categories, 24 event types.
 *
 * Re-exports all category modules and assembles top-level union types.
 *
 * ---
 *
 * # Two unions, two roles
 *
 * - `Event` — the **reducer-typed** union of state-affecting events
 *   (`workflow.*`, `delegation.*`, `artifact.*`, `decision.*`, `guard.*`,
 *   `session.*`, `verification.*`). Every member of this union flows
 *   through `reduce(state, event)` and may produce a new `WorkflowState`.
 *   The reducer's `assertNever` enforces exhaustiveness at compile time.
 *
 * - `AuditOnlyEvent` — the union of **observability-only** events that
 *   are persisted to `events` for audit / replay but MUST NOT enter the
 *   reducer. Hook implementers commit these via `store.append()` directly
 *   (bypassing `appendEventAndUpdateState`) per the invariant locked in
 *   `state-db-redesign.md` §1 and the orchestration design's NOTE-2.
 *
 * `EventType` and `ALL_EVENT_TYPES` cover the **wire-level union** of
 * everything the store may persist — both reducer-typed and audit-only
 * — so closed-enumeration assertions and `isValidEventType()` accept
 * any legitimate type string.
 */

// Re-export all categories
export * from './workflow.js';
export * from './delegation.js';
export * from './artifact.js';
export * from './decision.js';
export * from './guard.js';
export * from './session.js';
export * from './verification.js';
export * from './step-advancement.js';
export * from './prompt.js';

// Import const objects for ALL_EVENT_TYPES assembly
import { WORKFLOW_EVENTS } from './workflow.js';
import { DELEGATION_EVENTS } from './delegation.js';
import { ARTIFACT_EVENTS } from './artifact.js';
import { DECISION_EVENTS } from './decision.js';
import { GUARD_EVENTS } from './guard.js';
import { SESSION_EVENTS } from './session.js';
import { VERIFICATION_EVENTS } from './verification.js';
import { STEP_ADVANCEMENT_EVENTS } from './step-advancement.js';
import { PROMPT_EVENTS } from './prompt.js';

// Import category types for top-level unions
import type { WorkflowEvent, WorkflowEventType } from './workflow.js';
import type { DelegationEvent, DelegationEventType } from './delegation.js';
import type { ArtifactEvent, ArtifactEventType } from './artifact.js';
import type { DecisionEvent, DecisionEventType } from './decision.js';
import type { GuardEvent, GuardEventType } from './guard.js';
import type { SessionEvent, SessionEventType } from './session.js';
import type {
  VerificationEvent,
  VerificationEventType,
} from './verification.js';
import type {
  StepAdvancementEvent,
  StepAdvancementEventType,
} from './step-advancement.js';
import type { PromptEvent, PromptEventType } from './prompt.js';

// ---------------------------------------------------------------------------
// Reducer-typed Event union — discriminated on `type`
//
// Members are state-affecting: the reducer branches on them and the engine
// routes them through `appendEventAndUpdateState`. Audit-only categories
// (e.g. `StepAdvancementEvent`) are deliberately excluded — they live in
// `AuditOnlyEvent` below.
// ---------------------------------------------------------------------------

export type Event =
  | WorkflowEvent
  | DelegationEvent
  | ArtifactEvent
  | DecisionEvent
  | GuardEvent
  | SessionEvent
  | VerificationEvent;

// ---------------------------------------------------------------------------
// Audit-only Event union — `store.append()`-direct events
//
// These events bypass the reducer. The type-level separation is the
// architectural fence: code that handles `Event` cannot accidentally
// receive an audit-only event (and vice versa) without an explicit cast.
// ---------------------------------------------------------------------------

export type AuditOnlyEvent = StepAdvancementEvent | PromptEvent;

// ---------------------------------------------------------------------------
// Reducer-typed EventType union — all valid reducer event-type strings
// ---------------------------------------------------------------------------

export type EventType =
  | WorkflowEventType
  | DelegationEventType
  | ArtifactEventType
  | DecisionEventType
  | GuardEventType
  | SessionEventType
  | VerificationEventType;

// ---------------------------------------------------------------------------
// Audit-only EventType union — strings that MUST NOT reach the reducer
// ---------------------------------------------------------------------------

export type AuditOnlyEventType = StepAdvancementEventType | PromptEventType;

// ---------------------------------------------------------------------------
// Wire-level EventType union — every type string that may legitimately
// appear in the `events` table.
// ---------------------------------------------------------------------------

export type AnyEventType = EventType | AuditOnlyEventType;

// ---------------------------------------------------------------------------
// All event type values for validation — wire-level (reducer + audit-only)
// ---------------------------------------------------------------------------

export const ALL_EVENT_TYPES: ReadonlySet<string> = new Set<string>([
  ...Object.values(WORKFLOW_EVENTS),
  ...Object.values(DELEGATION_EVENTS),
  ...Object.values(ARTIFACT_EVENTS),
  ...Object.values(DECISION_EVENTS),
  ...Object.values(GUARD_EVENTS),
  ...Object.values(SESSION_EVENTS),
  ...Object.values(VERIFICATION_EVENTS),
  ...Object.values(STEP_ADVANCEMENT_EVENTS),
  ...Object.values(PROMPT_EVENTS),
]);

// ---------------------------------------------------------------------------
// Top-level type guard — accepts any wire-level event type string,
// including audit-only categories.
// ---------------------------------------------------------------------------

export function isValidEventType(type: string): type is AnyEventType {
  return ALL_EVENT_TYPES.has(type);
}
