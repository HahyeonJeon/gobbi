/**
 * Memorization-step `session.json` writer + `project.json` upsert.
 *
 * Mirrors the post-commit dispatch shape of `step-readme-writer.ts`: the
 * engine's `appendEventAndUpdateState` calls into this module ONLY when the
 * committed event is a `workflow.step.exit` for the `'memorization'` step.
 * The writer reads the init-time `session.json` stub for the 6 carry-forward
 * fields (`schemaVersion`, `sessionId`, `projectId`, `createdAt`,
 * `gobbiVersion`, `task`), runs `aggregateSessionJson` to materialise the
 * full telemetry shape (steps[] + iterations[] + agents[] + calls[]), and
 * writes the result back atomically. The companion `project.json.sessions[]`
 * row is upserted by `sessionId` so the cross-session memory projection
 * picks up the new finished session immediately.
 *
 * # Async contract
 *
 * `aggregateSessionJson` walks per-subagent JSONL transcripts (see
 * `lib/json-memory.ts:1279-1322`), so the writer is necessarily async.
 * The engine's post-commit dispatch awaits it; failures are caught at the
 * call site and surface as a single-line stderr — they MUST NOT mask the
 * accepted state transition (lock 39, mirrored from `writeStepReadmeForExit`).
 *
 * # Stub vs. complete (lock 43)
 *
 * The init-time stub carries no `steps[]` field. Readers infer state from
 * field presence — there is no `status` discriminator. This writer rebuilds
 * the file with `steps[]` populated, leaving the 6 stub-required fields
 * untouched. The schema validator in `lib/json-memory.ts::writeSessionJson`
 * rejects malformed bytes before they hit disk, so a partial-aggregator
 * failure cannot corrupt the on-disk shape.
 *
 * # Idempotency
 *
 * Re-firing the writer (e.g., a feedback-loop rewind that re-emits
 * memorization STEP_EXIT) overwrites `session.json` with the freshly
 * aggregated bytes. The `project.json.sessions[]` upsert is keyed by
 * `sessionId` — duplicates are replaced, not appended.
 *
 * # finishedAt
 *
 * Memorization-time `finishedAt` is `null`: `workflow.finish` /
 * `workflow.abort` lands AFTER memorization commits, so the aggregator
 * cannot observe the closing event. The post-Handoff sweep (T-2a.9.unified)
 * is responsible for the post-finish refresh; this writer's contract is
 * "write the best-effort snapshot at memorization-exit".
 */

import { sep } from 'node:path';

import {
  aggregateSessionJson,
  projectJsonPath,
  readSessionJson,
  sessionJsonPath,
  upsertProjectSession,
  writeSessionJson,
  type SessionJson,
} from '../lib/json-memory.js';
import type { ReadStore } from './store.js';

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Arguments for {@link writeSessionJsonAtMemorizationExit}. The engine
 * supplies `sessionDir` + `store` from the committed transaction context;
 * the rest derive from {@link readSessionJson} on the init-time stub.
 *
 * `repoRoot` is required because both `sessionJsonPath` and `projectJsonPath`
 * compose paths off the repo root rather than the session directory — the
 * session directory is internal to the repo's `.gobbi/projects/<name>/`
 * layout but the paths-helpers expect the workspace anchor explicitly.
 *
 * `finishedAt` is exposed so tests can pin the value; production callers
 * leave it unset and the aggregator returns `null` (memorization fires
 * before `workflow.finish`).
 */
export interface SessionJsonMemorizationExitArgs {
  readonly sessionDir: string;
  readonly store: ReadStore;
  readonly finishedAt?: string | null;
}

/**
 * Build a fully-populated `SessionJson` and write it (atomically) to
 * `<sessionDir>/session.json`, then upsert the corresponding row into
 * `<repoRoot>/.gobbi/projects/<projectName>/project.json::sessions[]`.
 *
 * Returns the absolute file path that was written, or `null` when the
 * init-time stub is absent (the session predates the JSON pivot, or the
 * caller fired this writer outside an initialised session). Throws on
 * downstream failure so the engine's post-commit catch can log and move
 * on — never throws from within the engine's transaction itself.
 */
export async function writeSessionJsonAtMemorizationExit(
  args: SessionJsonMemorizationExitArgs,
): Promise<string | null> {
  const { sessionDir, store, finishedAt } = args;

  const { repoRoot, projectName, sessionId } =
    deriveSessionLocation(sessionDir);

  const stubPath = sessionJsonPath(repoRoot, projectName, sessionId);
  const stub = readSessionJson(stubPath);
  if (stub === null) {
    // No stub on disk — nothing to populate. This branch should not fire
    // in normal flow (init writes the stub before the first event), but it
    // keeps the writer resilient to misuse: the engine's post-commit
    // dispatch logs and continues.
    return null;
  }

  const populated: SessionJson = await aggregateSessionJson({
    store,
    sessionId: stub.sessionId,
    projectId: stub.projectId,
    createdAt: stub.createdAt,
    gobbiVersion: stub.gobbiVersion,
    task: stub.task,
    ...(finishedAt !== undefined ? { finishedAt } : {}),
  });

  writeSessionJson(stubPath, populated);

  // Upsert the project-level sessions[] row. `task` carries through from
  // the stub; `finishedAt` mirrors what we just wrote into session.json so
  // the two artifacts agree on closure state.
  upsertProjectSession({
    path: projectJsonPath(repoRoot, projectName),
    entry: {
      sessionId: stub.sessionId,
      createdAt: stub.createdAt,
      finishedAt: populated.finishedAt,
      task: stub.task,
    },
    projectName,
    projectId: stub.projectId,
  });

  return stubPath;
}

// ---------------------------------------------------------------------------
// Path derivation — extract repo root + project name from session dir
// ---------------------------------------------------------------------------

/**
 * Decompose an absolute session directory of the canonical shape
 * `<repoRoot>/.gobbi/projects/<projectName>/sessions/<sessionId>` into the
 * three parts the json-memory path helpers consume directly.
 *
 * Mirrors the path-segment heuristic in
 * `step-readme-writer.ts::projectNameFromSessionDir`: the `'sessions'`
 * segment is the anchor; the segment two before it is `'projects'`, and
 * the segment between them is the project name. The session id is the
 * trailing segment.
 *
 * Throws when the path does not match the canonical layout — this is a
 * caller-bug surface, not user data, so failing loudly is correct
 * (the engine's post-commit catch turns the throw into a stderr line).
 */
function deriveSessionLocation(sessionDir: string): {
  readonly repoRoot: string;
  readonly projectName: string;
  readonly sessionId: string;
} {
  const parts = sessionDir.split(sep);
  // Trailing-slash safety — drop empty segments.
  const segments = parts.filter((segment) => segment.length > 0);

  // Reverse-walk: `<sessionId>` is last, `'sessions'` second-last,
  // `<projectName>` third-last, `'projects'` fourth-last, `'.gobbi'`
  // fifth-last. Anything before that is the repo root.
  const sessionsIdx = segments.lastIndexOf('sessions');
  if (sessionsIdx < 3) {
    throw new Error(
      `session-json-writer: cannot derive project layout from sessionDir ${sessionDir}`,
    );
  }
  if (segments[sessionsIdx - 2] !== 'projects') {
    throw new Error(
      `session-json-writer: expected 'projects' segment at depth ${sessionsIdx - 2} in ${sessionDir}`,
    );
  }
  if (segments[sessionsIdx - 3] !== '.gobbi') {
    throw new Error(
      `session-json-writer: expected '.gobbi' segment at depth ${sessionsIdx - 3} in ${sessionDir}`,
    );
  }

  const projectName = segments[sessionsIdx - 1];
  const sessionId = segments[sessionsIdx + 1];
  if (projectName === undefined || projectName.length === 0) {
    throw new Error(
      `session-json-writer: missing project name segment in ${sessionDir}`,
    );
  }
  if (sessionId === undefined || sessionId.length === 0) {
    throw new Error(
      `session-json-writer: missing session id segment in ${sessionDir}`,
    );
  }

  // Re-build the repo root from the segments preceding `.gobbi`. Preserve
  // the absolute-path leading separator on POSIX so the caller can pass
  // the result back into the path helpers without losing the root.
  const rootSegments = segments.slice(0, sessionsIdx - 3);
  const isAbsolute = sessionDir.startsWith(sep);
  const repoRoot =
    rootSegments.length === 0
      ? isAbsolute
        ? sep
        : '.'
      : (isAbsolute ? sep : '') + rootSegments.join(sep);

  return { repoRoot, projectName, sessionId };
}
