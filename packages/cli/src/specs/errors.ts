/**
 * Error-state prompt compilers — dispatcher + 4 pathway-specific compilers
 * (Crash, Timeout, FeedbackCap, InvalidTransition).
 *
 * Skeleton file — PR D (subtasks D.1–D.3) populates this module with the
 * `ErrorPathway` discriminated union, `detectPathway(state, store)` helper,
 * and the four pathway-specific compilers. The `compileErrorPrompt` export
 * exists here as a stub so A.4's `index.ts` barrel has a stable import
 * target; PR D replaces the body.
 *
 * ## Forward-pinned signatures
 *
 * `compileErrorPrompt` and `compileUnknownErrorPrompt` both declare their
 * full parameter list in PR C — even though the bodies still throw. The
 * typed signatures pin the contract PR D must fulfil: PR D only swaps the
 * throw for a real body, callers never change. The `compileUnknownErrorPrompt`
 * stub is not wired into a runtime path yet; PR D's pathway dispatcher will
 * switch on error pathways and call the right compiler. PR C only lands the
 * typed shell.
 */

import type { WorkflowState } from '../workflow/state.js';
import type { EventStore } from '../workflow/store.js';
import type { CompiledPrompt } from './types.js';

export const __todoErrors: unique symbol = Symbol('todo.errors');

/**
 * Compile a prompt for the workflow's `error` step. PR C wires this at the
 * `gobbi workflow next` error branch; the body still throws until PR D
 * replaces it with pathway-specific rendering.
 *
 * Typed as `never` so callers can `await compileErrorPrompt(...)` in a
 * branch without TypeScript inferring `CompiledPrompt`. When PR D lands it
 * will return `CompiledPrompt` and every call site composes naturally.
 */
export function compileErrorPrompt(
  _state: WorkflowState,
  _store: EventStore,
): never {
  throw new Error('not implemented — populated in PR D');
}

/**
 * Compile the "unknown / unclassified" error pathway prompt — the fallback
 * when PR D's `detectPathway(state, store)` cannot attribute the error to
 * one of the four known pathways (Crash, Timeout, FeedbackCap,
 * InvalidTransition).
 *
 * PR C lands the typed shell only. PR D replaces the body; callers observe
 * no signature change.
 */
export function compileUnknownErrorPrompt(
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error('not implemented — populated in PR D (error compilers)');
}
