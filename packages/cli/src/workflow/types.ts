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
// ---------------------------------------------------------------------------

export type ReduceFn = (state: WorkflowState, event: Event) => ReducerResult;
