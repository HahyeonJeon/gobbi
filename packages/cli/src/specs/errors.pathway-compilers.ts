/**
 * Per-pathway error-state prompt compilers.
 *
 * Skeleton file — D.1 lands typed declarations with throw bodies so D.2
 * can fill bodies without widening signatures. D.3's dispatcher
 * (`compileErrorPrompt` in `errors.ts`) calls into these via
 * `visitPathway`, so the 5 signatures are the contract Wave 2 and Wave 3
 * both depend on.
 *
 * Every compiler takes the narrowed pathway variant as its first argument
 * — `visitPathway` narrows at the call site via the mapped-type visitor
 * (see `errors.ts`), so compilers never re-discriminate internally.
 *
 * All bodies return a `CompiledPrompt` built via `buildErrorCompiledPrompt`
 * (see `errors.sections.ts`). D.2's job is to fill the bodies; this file's
 * surface is frozen in D.1.
 */

import type { WorkflowState } from '../workflow/state.js';
import type { EventStore } from '../workflow/store.js';
import type { CompiledPrompt } from './types.js';
import type {
  ErrorPathwayCrash,
  ErrorPathwayTimeout,
  ErrorPathwayFeedbackCap,
  ErrorPathwayInvalidTransition,
  ErrorPathwayUnknown,
} from './errors.js';

/**
 * Compile a Crash-pathway prompt. Body populated in D.2.
 */
export function compileCrashPrompt(
  _pathway: ErrorPathwayCrash,
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error(
    'compileCrashPrompt: body not wired — D.2 populates the pathway compilers',
  );
}

/**
 * Compile a Timeout-pathway prompt. Body populated in D.2.
 */
export function compileTimeoutPrompt(
  _pathway: ErrorPathwayTimeout,
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error(
    'compileTimeoutPrompt: body not wired — D.2 populates the pathway compilers',
  );
}

/**
 * Compile a FeedbackCap-pathway prompt. Body populated in D.2.
 */
export function compileFeedbackCapPrompt(
  _pathway: ErrorPathwayFeedbackCap,
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error(
    'compileFeedbackCapPrompt: body not wired — D.2 populates the pathway compilers',
  );
}

/**
 * Compile an InvalidTransition-pathway prompt. Body populated in D.2.
 */
export function compileInvalidTransitionPrompt(
  _pathway: ErrorPathwayInvalidTransition,
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error(
    'compileInvalidTransitionPrompt: body not wired — D.2 populates the pathway compilers',
  );
}

/**
 * Compile an Unknown-pathway prompt. Body populated in D.2.
 *
 * Note: this compiler is also re-exported from `errors.ts` as
 * `compileUnknownErrorPrompt` (PR C named it that for the initial stub);
 * D.2 keeps the alias wiring in `errors.ts`.
 */
export function compileUnknownPrompt(
  _pathway: ErrorPathwayUnknown,
  _state: WorkflowState,
  _store: EventStore,
): CompiledPrompt {
  throw new Error(
    'compileUnknownPrompt: body not wired — D.2 populates the pathway compilers',
  );
}
