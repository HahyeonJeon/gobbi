/**
 * gobbi workflow events — thin alias that delegates to `gobbi session events`.
 *
 * Both commands read from the same SQLite store (`gobbi.db`) under the
 * active session directory — `runSessionEvents` owns the heavy lifting
 * (session resolution, filters, row cap, JSON vs human output). This file
 * exists so the command is reachable inside the workflow namespace without
 * duplicating the implementation.
 *
 * Semantics: invoking `gobbi workflow events` is equivalent to invoking
 * `gobbi session events` with the current session scoped via
 * `CLAUDE_SESSION_ID` or the single-directory fallback — the same rules
 * `runSessionEvents` applies.
 *
 * See `commands/session.ts` for the full option matrix (--type, --since,
 * --json, --all).
 */

import { runSessionEvents } from '../session.js';

export async function runEvents(args: string[]): Promise<void> {
  // `runSessionEvents` is the single source of truth. Forward argv untouched
  // — its help text is already framed for machine consumers who don't care
  // whether the command was reached via `session` or `workflow`.
  await runSessionEvents(args);
}
