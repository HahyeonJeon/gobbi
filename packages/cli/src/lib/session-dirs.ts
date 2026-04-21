/**
 * Lazy step-subdir creator — see `.claude/project/gobbi/design/v050-features/gobbi-memory/README.md` §Layout.
 *
 * Creates `<sessionDir>/<step>/` and `<sessionDir>/<step>/rawdata/` on demand
 * and returns the step directory path. Idempotent by construction — both
 * `mkdirSync` calls use `{ recursive: true }`, which is a no-op when the
 * directories already exist. Callers hit this helper from artifact-writing
 * code paths (e.g. `commands/workflow/capture-subagent.ts`) so the step
 * subdirs materialise on first write rather than eagerly at session init.
 *
 * The `step` parameter is typed as the narrow `StepId` union from
 * `specs/artifact-selector.ts` — `'ideation' | 'plan' | 'execution' |
 * 'evaluation' | 'memorization'`. Callers holding a wider `WorkflowStep`
 * (which includes `idle`, `ideation_eval`, etc.) must narrow before
 * invoking.
 */

import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

import type { StepId } from '../specs/artifact-selector.js';

/**
 * Ensure the per-step subdir and its `rawdata/` child exist under the given
 * session directory. Returns the step directory path
 * (`<sessionDir>/<step>`).
 *
 * @param sessionDir Absolute path to the session directory
 *   (`.gobbi/sessions/<session-id>`).
 * @param step The narrow step identifier — one of the five productive
 *   steps. See {@link StepId}.
 * @returns Absolute path to the per-step directory (does not include
 *   `rawdata/`).
 */
export function ensureSessionStepDir(
  sessionDir: string,
  step: StepId,
): string {
  const stepDir = join(sessionDir, step);
  mkdirSync(stepDir, { recursive: true });
  mkdirSync(join(stepDir, 'rawdata'), { recursive: true });
  return stepDir;
}
