/**
 * State-based active-session detection — scans both the legacy flat layout
 * (`.gobbi/sessions/<id>/`) AND every project's sessions dir
 * (`.gobbi/projects/<name>/sessions/<id>/`) and returns the subset whose
 * `state.json.currentStep` is NOT a terminal value.
 *
 * Note: forward-slash-star sequences inside code spans in this docblock
 * are avoided deliberately — a literal `*\/` inside a `/** ... *\/` block
 * closes the block and cascades TS parser errors far from the cause. See
 * the `_typescript` skill's note on the JSDoc terminator trap.
 *
 * ## Why a separate helper from `gotcha/promote.ts#findActiveSessions`
 *
 * The `promote.ts` helper uses **heartbeat-TTL** semantics — a session is
 * active if its most recent `session.heartbeat` event is within the
 * 60-minute TTL and no `workflow.finish` event exists. That semantic is the
 * right choice for the promotion guard (it matches the abandoned-session
 * TTL documented in `v050-session.md`) but wrong for the wipe guard, which
 * must protect any session whose persisted state is mid-flight regardless
 * of whether a heartbeat is fresh.
 *
 * The two helpers coexist: `findActiveSessions` (heartbeat-mode) is
 * consumed by `gobbi gotcha promote`; `findStateActiveSessions`
 * (state-mode) is consumed by `gobbi maintenance wipe-legacy-sessions`.
 * Callers pick the helper whose semantic matches the guard they are
 * implementing.
 *
 * ## Why raw-string `currentStep` reads (not `isValidState`)
 *
 * Per the v0.5.0 Pass-2 `plan-remediation.md` §"W3.3 wipe order vs W4
 * rename" (Arch F3), using `isValidState` for state-mode detection is
 * unsafe across the `'plan'` → `'planning'` rename: after W4 lands,
 * `VALID_STEPS` no longer contains `'plan'`, so `isValidState` would
 * classify legacy sessions with `currentStep: 'plan'` as invalid → wipe
 * would treat them as inactive → live sessions destroyed.
 *
 * The fix is defensive: read `state.json` with `JSON.parse`, treat
 * `currentStep` as a raw `string`, and compare against the **terminal**
 * set (`'done' | 'error'`) rather than the **active** set. Any value
 * outside that terminal set — including both pre-rename `'plan'` and
 * post-rename `'planning'` — is classified as active-to-protect.
 * Malformed or missing `state.json` files are also classified as active:
 * err on the side of protecting, never destroying.
 *
 * @see `.gobbi/sessions/35742566-.../plan/plan-remediation.md`
 *      §W3.3 wipe order vs W4 rename (Arch F3)
 * @see `commands/gotcha/promote.ts` — heartbeat-mode sibling helper
 * @see `workflow/state.ts` — `WorkflowStep` union (not consumed here)
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { isRecord, isString } from './guards.js';
import {
  projectsRoot,
  sessionsRoot,
  workspaceRoot,
} from './workspace-paths.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

/**
 * The set of terminal `currentStep` values. A session whose
 * `state.json.currentStep` is one of these is treated as INACTIVE — safe to
 * wipe. Every other value (including unreadable / missing state) is
 * ACTIVE — must be protected.
 *
 * Kept as a module-local `ReadonlySet<string>` rather than imported from
 * `workflow/state.ts` on purpose: we never narrow to `WorkflowStep` here
 * (see file header — Arch F3 rationale for raw-string reads).
 *
 * ## Intentional divergence from `workflow/state.ts::TERMINAL_STEPS`
 *
 * `TERMINAL_STEPS` in `workflow/state.ts` contains only `'done'` — its
 * predicate is "no further transitions are legal from this step". It
 * deliberately OMITS `'error'` because `workflow.resume` can transition
 * a session out of `'error'` (see `workflow/transitions.ts`).
 *
 * `TERMINAL_CURRENT_STEPS` answers a different question — "is this
 * session wipe-safe?" — and therefore INCLUDES `'error'`. An errored
 * session is wipe-safe even though the state machine allows resuming
 * from it: the operator running `gobbi maintenance wipe-legacy-sessions`
 * is asking "can the directory be deleted" not "can the workflow still
 * progress". These two predicates are independent by design; adding a
 * new terminal state to `TERMINAL_STEPS` does NOT automatically add it
 * here, and vice versa.
 */
export const TERMINAL_CURRENT_STEPS: ReadonlySet<string> = new Set<string>([
  'done',
  'error',
]);

/**
 * One active (not-terminal) session returned by
 * {@link findStateActiveSessions}.
 *
 *   - `sessionId`      — the directory name
 *   - `sessionDir`     — absolute path to the session directory
 *   - `projectName`    — the owning project name, or `null` for sessions
 *                        living under the legacy flat layout
 *                        (`.gobbi/sessions/<id>/`).
 *   - `currentStep`    — the raw string value read from `state.json`, or
 *                        `null` when the file is missing / malformed /
 *                        unreadable. A `null` value still classifies the
 *                        session as active (protect by default).
 */
export interface StateActiveSession {
  readonly sessionId: string;
  readonly sessionDir: string;
  readonly projectName: string | null;
  readonly currentStep: string | null;
}

/**
 * Layer tags used by {@link scanLayer} to label the sessions each scan
 * returns. Kept private; callers see the resolved `projectName` field on
 * {@link StateActiveSession}.
 */
type Layer =
  | { readonly kind: 'legacy-flat'; readonly root: string }
  | { readonly kind: 'project'; readonly root: string; readonly projectName: string };

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Scan both the legacy-flat layer (`.gobbi/sessions` entries) and the
 * per-project layer (`.gobbi/projects/<name>/sessions` entries) and return
 * every session whose `state.json.currentStep` is NOT in
 * {@link TERMINAL_CURRENT_STEPS}.
 *
 * Ordering: legacy-flat entries first (in `readdirSync` order), then each
 * project's sessions (projects listed in `readdirSync` order). Deterministic
 * across a single scan so test fixtures match.
 *
 * Missing directories degrade silently — a repo with no `.gobbi/` at all
 * returns `[]`. Unreadable session directories are skipped but logged via
 * the caller's own diagnostics (this helper is pure — it does not write).
 */
export function findStateActiveSessions(
  repoRoot: string,
): readonly StateActiveSession[] {
  const out: StateActiveSession[] = [];

  // --- Layer 1: legacy flat `.gobbi/sessions/` -----------------------------
  const legacyRoot = join(workspaceRoot(repoRoot), 'sessions');
  out.push(...scanLayer({ kind: 'legacy-flat', root: legacyRoot }));

  // --- Layer 2: per-project `.gobbi/projects/<name>/sessions/` ------------
  const projectsDir = projectsRoot(repoRoot);
  if (existsSync(projectsDir)) {
    let projects: string[];
    try {
      projects = readdirSync(projectsDir);
    } catch {
      projects = [];
    }
    for (const projectName of projects) {
      const projSessions = sessionsRoot(repoRoot, projectName);
      try {
        if (!statSync(projSessions).isDirectory()) continue;
      } catch {
        continue;
      }
      out.push(
        ...scanLayer({
          kind: 'project',
          root: projSessions,
          projectName,
        }),
      );
    }
  }

  return out;
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

/**
 * Enumerate the immediate children of `layer.root`, read each child's
 * `state.json` as raw JSON, and return entries whose `currentStep` is not
 * terminal. Missing / malformed state.json → treated as active (protect).
 */
function scanLayer(layer: Layer): readonly StateActiveSession[] {
  if (!existsSync(layer.root)) return [];

  let ids: string[];
  try {
    ids = readdirSync(layer.root);
  } catch {
    return [];
  }

  const out: StateActiveSession[] = [];
  for (const id of ids) {
    const sessionDir = join(layer.root, id);
    try {
      if (!statSync(sessionDir).isDirectory()) continue;
    } catch {
      continue;
    }

    const currentStep = readCurrentStepRaw(sessionDir);

    // Terminal → skip (inactive — safe to wipe).
    if (currentStep !== null && TERMINAL_CURRENT_STEPS.has(currentStep)) {
      continue;
    }

    const projectName = layer.kind === 'project' ? layer.projectName : null;
    out.push({
      sessionId: id,
      sessionDir,
      projectName,
      currentStep,
    });
  }
  return out;
}

/**
 * Read `<sessionDir>/state.json` and return the raw `currentStep` string.
 *
 *   - File missing    → `null` (classified as active by caller).
 *   - Invalid JSON    → `null`.
 *   - JSON parses but `currentStep` is not a string → `null`.
 *   - Otherwise       → the string value, verbatim, with no schema check.
 *
 * Deliberately does NOT call `isValidState` — see the file header for the
 * Arch F3 rationale. The raw string is sufficient for the terminal-set
 * comparison in {@link scanLayer}.
 *
 * Exported so callers outside this module that need to classify a single
 * session without invoking the full dual-layer scan (e.g., the wipe
 * command's inactive-session enumerator) can share the exact same
 * parsing discipline rather than reimplementing it. Duplicating the
 * chain risks the two reads drifting if the `state.json` shape evolves.
 */
export function readCurrentStepRaw(sessionDir: string): string | null {
  const statePath = join(sessionDir, 'state.json');
  if (!existsSync(statePath)) return null;

  let raw: string;
  try {
    raw = readFileSync(statePath, 'utf8');
  } catch {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (!isRecord(parsed)) return null;
  const step = parsed['currentStep'];
  if (!isString(step)) return null;
  return step;
}
