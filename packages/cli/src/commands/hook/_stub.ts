/**
 * Shared generic-stub body for the 23 hook events that do NOT carry
 * non-trivial workflow logic in PR-FIN-1b. The body reads stdin best-
 * effort (so a piped JSON payload doesn't deadlock the parent if Claude
 * Code refuses to flush), routes the 4 Phase-1 stub-using events
 * (`SessionEnd`, `UserPromptSubmit`, `Notification`, `PreCompact`)
 * through `dispatchHookNotify`, and exits 0. The remaining 19 events
 * keep the silent-no-op shape until the Phase-2 follow-up wires their
 * rich messages.
 *
 * The 23 stub callers are paper-thin (one import + one tail call) so
 * PR-FIN-1d can swap any of them to a per-event body without touching
 * the dispatcher in `commands/hook.ts`.
 */

import { dispatchHookNotify, type NotifyOptions } from '../../lib/notify.js';
import type { HookTrigger } from '../../lib/settings.js';
import { readStdinJson } from '../../lib/stdin.js';

/**
 * Phase-1 allow-list — the 4 events that use this generic stub AND have
 * a rich message template wired in PR-FIN-1d. The 3 bespoke handlers
 * (`Stop`, `SubagentStop`, `SessionStart`) live in their own files and
 * call `dispatchHookNotify` directly. Phase-2 events (the 21 remaining
 * `HookTrigger` values) intentionally do not dispatch in this PR; the
 * follow-up issue #<phase-2> tracks rich-message wiring for them.
 *
 * `dispatchHookNotify` is itself double-protected — for events outside
 * its rendered-template set it returns silently before invoking
 * `dispatchToChannels`. This allow-list keeps the intent explicit at
 * the stub layer and short-circuits the `resolveSettings` call for
 * Phase-2 events.
 */
const PHASE_1_STUB_EVENTS: ReadonlySet<HookTrigger> = new Set<HookTrigger>([
  'SessionEnd',
  'UserPromptSubmit',
  'Notification',
  'PreCompact',
]);

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
 * `'SessionEnd'`, `'UserPromptSubmit'`) — used by `dispatchHookNotify`
 * to look up which channels are subscribed via
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
 *   3. If `eventName` is in `PHASE_1_STUB_EVENTS`, derive `options`
 *      defensively from the payload's `session_id` and the ambient
 *      `$CLAUDE_PROJECT_DIR`, then call `dispatchHookNotify`. The 19
 *      Phase-2 events covered by this stub no-op silently — the
 *      follow-up issue #<phase-2> tracks rich-message wiring.
 *   4. Exit 0. Hooks must NEVER block Claude Code; the surrounding
 *      try/catch swallows any throw from `dispatchHookNotify` (or any
 *      future regression in this body) and writes a kebab-cased
 *      `gobbi hook <event>: <message>` line to stderr. The defense is
 *      redundant with `dispatchHookNotify`'s own top-level catch but
 *      protects against unhandled rejections from synchronous throws
 *      in the options-derivation path.
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
  try {
    if (PHASE_1_STUB_EVENTS.has(eventName as HookTrigger)) {
      const options: NotifyOptions = {
        ...(typeof (payload as { session_id?: unknown })?.session_id === 'string'
          ? { sessionId: (payload as { session_id: string }).session_id }
          : {}),
        ...(process.env['CLAUDE_PROJECT_DIR'] !== undefined
          ? { projectDir: process.env['CLAUDE_PROJECT_DIR'] }
          : {}),
      };
      await dispatchHookNotify(payload, eventName as HookTrigger, options);
    }
    // Phase-2 events: the 19 hook events not in PHASE_1_STUB_EVENTS
    // intentionally do not dispatch in this PR. The follow-up issue
    // tracks the rich-message wiring for the remaining events.
  } catch (err) {
    process.stderr.write(
      `gobbi hook ${pascalToKebab(eventName)}: ${err instanceof Error ? err.message : String(err)}\n`,
    );
  }
}
