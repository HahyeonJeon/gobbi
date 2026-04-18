/**
 * Shared workflow types — consumed by both state.ts and reducer.ts.
 *
 * This module exists to avoid circular dependencies: state.ts cannot
 * import from reducer.ts (and vice versa), but both need the reducer
 * result type. Type-only imports are erased at runtime, so this module
 * introduces no dependency cycle risk.
 */

import type { WorkflowState } from './state.js';
import type { Event } from './events/index.js';

// ---------------------------------------------------------------------------
// Reducer result — returned by the reduce function
// ---------------------------------------------------------------------------

export type ReducerResult =
  | { readonly ok: true; readonly state: WorkflowState }
  | { readonly ok: false; readonly error: string };

// ---------------------------------------------------------------------------
// Reduce function signature — accepted by deriveState/resolveState
//
// The optional `ts` carries the event's wall-clock timestamp (EventRow.ts
// during replay; the engine's `effectiveTs` at runtime). It is a separate
// argument rather than a field on `Event` because the `Event` discriminated
// union describes the on-wire data payload only — `ts` is a row-level
// attribute assigned by the store. Reducer cases that need a timestamp
// (per L13: `stepStartedAt` on STEP_EXIT + RESUME) read it from this
// argument; cases that do not are unaffected.
// ---------------------------------------------------------------------------

export type ReduceFn = (
  state: WorkflowState,
  event: Event,
  ts?: string,
) => ReducerResult;
