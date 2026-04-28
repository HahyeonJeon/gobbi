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
 * Convert a PascalCase event name to its kebab-case CLI subcommand
 * form. Used purely for `--help` output so the rendered usage line
 * matches what users actually type at the shell.
 *
 *   'SessionEnd'      → 'session-end'
 *   'UserPromptSubmit' → 'user-prompt-submit'
 *   'PostToolUse'     → 'post-tool-use'
 */
function pascalToKebab(name: string): string {
  return name.replace(/[A-Z]/g, (c, i) => (i === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`));
}

/**
 * Run the generic hook-stub body for event `eventName`. The event name
 * is the Claude Code canonical PascalCase identifier (e.g.,
 * `'SessionEnd'`, `'UserPromptSubmit'`) — used by PR-FIN-1d's notify
 * dispatch to look up which channels are subscribed via
 * `notify.{slack,telegram,discord,desktop}.triggers`.
 *
 * Behavior:
 *
 *   1. If `args` includes `--help` / `-h`, print a generic stub usage
 *      line and return. This brings the 23 stub handlers in line with
 *      the 5 non-trivial handlers (`runHookSessionStart` etc.) which
 *      each render a `--help` block.
 *   2. Drain stdin best-effort. `readStdinJson` returns `null` on TTY
 *      (no piped input), empty stdin, or unparseable JSON — none of
 *      which are errors here.
 *   3. TODO(PR-FIN-1d) — dispatch notify channels whose `triggers`
 *      include `eventName`. The drained `payload` will feed the
 *      dispatch's template substitution.
 *   4. Exit 0. Hooks must NEVER block Claude Code; even if dispatch
 *      logic were to throw, the catch in the caller (or the absence of
 *      throw paths in this body) keeps the process zero-exiting.
 *
 * Note: `void payload` and `void eventName` deliberately mark the
 * variables as intentionally unused at compile time so `noUnusedLocals`
 * (if it ever lands) doesn't fire false positives. PR-FIN-1d removes
 * both `void` markers when it consumes the values.
 */
export async function runGenericHookStub(eventName: string, args: string[] = []): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    const subcommand = pascalToKebab(eventName);
    process.stdout.write(
      `Usage: gobbi hook ${subcommand}\n\n` +
        `Generic stub handler for the ${eventName} hook event. Drains stdin\n` +
        `and exits 0. Notify dispatch is deferred to PR-FIN-1d.\n`,
    );
    return;
  }
  const payload = await readStdinJson<unknown>();
  // TODO(PR-FIN-1d) — dispatch notify channels for `eventName`. The
  // drained payload is the source of template variables; the channel
  // settings live at notify.<channel>.triggers in the resolved cascade.
  void payload;
  void eventName;
}
