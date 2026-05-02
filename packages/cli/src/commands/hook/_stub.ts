/**
 * Shared generic-stub body for the 25 hook events that do NOT carry
 * non-trivial workflow logic in PR-FIN-1b. The body reads stdin best-
 * effort (so a piped JSON payload doesn't deadlock the parent if Claude
 * Code refuses to flush), routes the Tier-A events through
 * `dispatchHookNotify`, and exits 0. Tier-B events keep the silent-no-op
 * shape — their rich-message templates exist in `lib/notify.ts` but
 * default-stub dispatch is suppressed to avoid flooding from per-tool /
 * per-file / per-prompt-expansion fan-out.
 *
 * Counts: the {@link HookTrigger} union has 28 values. Three are bespoke
 * handlers (`Stop`, `SubagentStop`, `SessionStart`) and live in their own
 * files; the remaining 25 use this generic stub. Of those 25, 15 are
 * Tier-A (dispatched) and 10 are Tier-B (template-only).
 *
 * The 25 stub callers are paper-thin (one import + one tail call) so a
 * future per-event body can replace any of them without touching the
 * dispatcher in `commands/hook.ts`.
 */

import { dispatchHookNotify, type NotifyOptions } from '../../lib/notify.js';
import type { HookTrigger } from '../../lib/settings.js';
import { readStdinJson } from '../../lib/stdin.js';

/**
 * Tier-A dispatch allow-list — events that the generic stub dispatches
 * via `dispatchHookNotify`. The 3 bespoke handlers (`Stop`,
 * `SubagentStop`, `SessionStart`) live in their own files and call
 * `dispatchHookNotify` directly, so they are not listed here.
 *
 * Tier-B events (10 high-frequency events: `UserPromptExpansion`,
 * `PreToolUse`, `PostToolUse`, `PostToolUseFailure`, `PostToolBatch`,
 * `FileChanged`, `CwdChanged`, `InstructionsLoaded`, `Elicitation`,
 * `ElicitationResult`) have rendered templates in
 * `lib/notify.ts::renderHookMessage` but are excluded from default
 * dispatch — flooding risk. A bespoke handler can call
 * `dispatchHookNotify` directly to opt them in.
 *
 * Issue #219 wired rich messages for all 28 hook events, then split the
 * stub-dispatch policy along the Tier-A / Tier-B axis above.
 */
const STUB_DISPATCH_EVENTS: ReadonlySet<HookTrigger> = new Set<HookTrigger>([
  // Original Phase-1 cohort (PR-FIN-1d.3) — coarse session lifecycle +
  // attention-needed prompts + compaction lead-in.
  'SessionEnd',
  'UserPromptSubmit',
  'Notification',
  'PreCompact',
  // Tier-A (issue #219) — coarse-grained events safe to fire on every
  // occurrence without flooding.
  'StopFailure',
  'PermissionRequest',
  'PermissionDenied',
  'SubagentStart',
  'TaskCreated',
  'TaskCompleted',
  'TeammateIdle',
  'PostCompact',
  'WorktreeCreate',
  'WorktreeRemove',
  'ConfigChange',
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
 *      line and return. This brings the 25 stub handlers in line with
 *      the 3 bespoke handlers (`runHookSessionStart` etc.) which each
 *      render a `--help` block.
 *   2. Drain stdin best-effort. `readStdinJson` returns `null` on TTY
 *      (no piped input), empty stdin, or unparseable JSON — none of
 *      which are errors here.
 *   3. If `eventName` is in `STUB_DISPATCH_EVENTS` (Tier-A), derive
 *      `options` defensively from the payload's `session_id` and the
 *      ambient `$CLAUDE_PROJECT_DIR`, then call `dispatchHookNotify`.
 *      Tier-B events covered by this stub no-op silently — their
 *      templates exist for completeness but per-event flooding policy
 *      keeps them off the default dispatch path.
 *   4. Exit 0. Hooks must NEVER block Claude Code; the surrounding
 *      try/catch swallows any throw from `readStdinJson`,
 *      `dispatchHookNotify`, or any future regression in this body and
 *      writes a kebab-cased `gobbi hook <event>: <message>` line to
 *      stderr. The defense is redundant with `dispatchHookNotify`'s
 *      own top-level catch but protects against unhandled rejections
 *      from synchronous throws in the options-derivation path or a
 *      future regression in `readStdinJson` that lets an I/O error
 *      escape its current `null`-on-failure contract.
 */
export async function runGenericHookStub(eventName: string, args: string[] = []): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    const subcommand = pascalToKebab(eventName);
    process.stdout.write(
      `Usage: gobbi hook ${subcommand}\n\n` +
        `Generic stub handler for the ${eventName} hook event. Drains stdin,\n` +
        `dispatches a rich-message notification when ${eventName} is in the\n` +
        `STUB_DISPATCH_EVENTS allow-list (Tier-A), and exits 0.\n`,
    );
    return;
  }
  try {
    const payload = await readStdinJson<unknown>();
    if (STUB_DISPATCH_EVENTS.has(eventName as HookTrigger)) {
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
    // Tier-B events: the 10 hook events with templates but excluded from
    // STUB_DISPATCH_EVENTS intentionally do not dispatch through the
    // generic stub (high-frequency flooding risk). A bespoke handler can
    // call `dispatchHookNotify` directly to opt them in.
  } catch (err) {
    process.stderr.write(
      `gobbi hook ${pascalToKebab(eventName)}: ${err instanceof Error ? err.message : String(err)}\n`,
    );
  }
}
