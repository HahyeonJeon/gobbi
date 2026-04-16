/**
 * Event type system — 6 categories, 20 event types.
 *
 * Re-exports all category modules and assembles top-level union types.
 */

// Re-export all categories
export * from './workflow.js';
export * from './delegation.js';
export * from './artifact.js';
export * from './decision.js';
export * from './guard.js';
export * from './session.js';

// Import const objects for ALL_EVENT_TYPES assembly
import { WORKFLOW_EVENTS } from './workflow.js';
import { DELEGATION_EVENTS } from './delegation.js';
import { ARTIFACT_EVENTS } from './artifact.js';
import { DECISION_EVENTS } from './decision.js';
import { GUARD_EVENTS } from './guard.js';
import { SESSION_EVENTS } from './session.js';

// Import category types for top-level unions
import type { WorkflowEvent, WorkflowEventType } from './workflow.js';
import type { DelegationEvent, DelegationEventType } from './delegation.js';
import type { ArtifactEvent, ArtifactEventType } from './artifact.js';
import type { DecisionEvent, DecisionEventType } from './decision.js';
import type { GuardEvent, GuardEventType } from './guard.js';
import type { SessionEvent, SessionEventType } from './session.js';

// ---------------------------------------------------------------------------
// Top-level Event union — discriminated on `type`
// ---------------------------------------------------------------------------

export type Event =
  | WorkflowEvent
  | DelegationEvent
  | ArtifactEvent
  | DecisionEvent
  | GuardEvent
  | SessionEvent;

// ---------------------------------------------------------------------------
// Top-level EventType union — all valid event type strings
// ---------------------------------------------------------------------------

export type EventType =
  | WorkflowEventType
  | DelegationEventType
  | ArtifactEventType
  | DecisionEventType
  | GuardEventType
  | SessionEventType;

// ---------------------------------------------------------------------------
// All event type values for validation
// ---------------------------------------------------------------------------

export const ALL_EVENT_TYPES: ReadonlySet<string> = new Set<string>([
  ...Object.values(WORKFLOW_EVENTS),
  ...Object.values(DELEGATION_EVENTS),
  ...Object.values(ARTIFACT_EVENTS),
  ...Object.values(DECISION_EVENTS),
  ...Object.values(GUARD_EVENTS),
  ...Object.values(SESSION_EVENTS),
]);

// ---------------------------------------------------------------------------
// Top-level type guard
// ---------------------------------------------------------------------------

export function isValidEventType(type: string): type is EventType {
  return ALL_EVENT_TYPES.has(type);
}
