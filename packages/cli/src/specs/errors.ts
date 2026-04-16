/**
 * Error-state prompt compilers — dispatcher + 4 pathway-specific compilers
 * (Crash, Timeout, FeedbackCap, InvalidTransition).
 *
 * Skeleton file — PR D (subtasks D.1–D.3) populates this module with the
 * `ErrorPathway` discriminated union, `detectPathway(state, store)` helper,
 * and the four pathway-specific compilers. The `compileErrorPrompt` export
 * exists here as a stub so A.4's `index.ts` barrel has a stable import
 * target; PR D replaces the body.
 */

export const __todoErrors: unique symbol = Symbol('todo.errors');

export function compileErrorPrompt(): never {
  throw new Error('not implemented — populated in PR D');
}
