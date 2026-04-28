/**
 * Shared generic-stub body for the 23 hook events that do NOT carry
 * non-trivial workflow logic in PR-FIN-1b. The body reads stdin best-
 * effort (so a piped JSON payload doesn't deadlock the parent if Claude
 * Code refuses to flush), reserves the slot for PR-FIN-1d's notify
 * dispatch wiring with a TODO marker, and exits 0.
 *
 * The 23 stub callers are paper-thin (one import + one tail call) so
 * PR-FIN-1d can swap any of them to a per-event body without touching
 * the dispatcher in `commands/hook.ts`.
 */

import { readStdinJson } from '../../lib/stdin.js';

/**
 * Run the generic hook-stub body for event `eventName`. The event name
 * is the Claude Code canonical PascalCase identifier (e.g.,
 * `'SessionEnd'`, `'UserPromptSubmit'`) — used by PR-FIN-1d's notify
 * dispatch to look up which channels are subscribed via
 * `notify.{slack,telegram,discord,desktop}.triggers`.
 *
 * Behavior:
 *
 *   1. Drain stdin best-effort. `readStdinJson` returns `null` on TTY
 *      (no piped input), empty stdin, or unparseable JSON — none of
 *      which are errors here.
 *   2. TODO(PR-FIN-1d) — dispatch notify channels whose `triggers`
 *      include `eventName`. The drained `payload` will feed the
 *      dispatch's template substitution.
 *   3. Exit 0. Hooks must NEVER block Claude Code; even if dispatch
 *      logic were to throw, the catch in the caller (or the absence of
 *      throw paths in this body) keeps the process zero-exiting.
 *
 * Note: `void payload` and `void eventName` deliberately mark the
 * variables as intentionally unused at compile time so `noUnusedLocals`
 * (if it ever lands) doesn't fire false positives. PR-FIN-1d removes
 * both `void` markers when it consumes the values.
 */
export async function runGenericHookStub(eventName: string): Promise<void> {
  const payload = await readStdinJson<unknown>();
  // TODO(PR-FIN-1d) — dispatch notify channels for `eventName`. The
  // drained payload is the source of template variables; the channel
  // settings live at notify.<channel>.triggers in the resolved cascade.
  void payload;
  void eventName;
}
