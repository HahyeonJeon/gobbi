/**
 * gobbi hook post-tool-use — PostToolUse hook entrypoint.
 *
 * Replaces the direct `gobbi workflow capture-planning` registration on
 * the `ExitPlanMode` matcher. The plugin manifest still declares the
 * matcher (so this entrypoint only fires when Claude Code's PostToolUse
 * fires for `ExitPlanMode`), but the entrypoint additionally checks
 * `tool_name` defensively — a future per-repo override that registers
 * this command without a matcher should still no-op for non-ExitPlanMode
 * tools.
 *
 * ## Hook contract
 *
 * Observational hook — always exits 0. capture-planning's
 * implementation already silently no-ops on any failure path; this
 * wrapper preserves those semantics.
 *
 * @see `commands/workflow/capture-planning.ts` — body invoked here.
 */

import { readStdinJson } from '../../lib/stdin.js';
import { isRecord, isString } from '../../lib/guards.js';
import { runCapturePlanningWithOptions } from '../workflow/capture-planning.js';

export async function runHookPostToolUse(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(USAGE);
    return;
  }

  // Read stdin ONCE in the hook entrypoint. Pass the parsed payload
  // through to capture-planning so it does not re-read.
  const payload = await readStdinJson<unknown>();

  try {
    // Defensive matcher check — only invoke capture-planning when the
    // payload's `tool_name` is `ExitPlanMode`. The plugin manifest
    // already gates registration to that matcher, but a per-repo
    // override might broaden it. capture-planning itself is safe to
    // call for any tool (it returns early when `tool_input.plan` is
    // missing), but skipping the call entirely keeps the hot path
    // lean for non-matching tools.
    if (isRecord(payload) && isString(payload['tool_name']) && payload['tool_name'] === 'ExitPlanMode') {
      await runCapturePlanningWithOptions(args, { payload });
    }

    // TODO(PR-FIN-1d) — dispatch notify for PostToolUse triggers.
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi hook post-tool-use: ${message}\n`);
  }
}

const USAGE = `Usage: gobbi hook post-tool-use

PostToolUse hook entrypoint. Reads the Claude Code PostToolUse payload on
stdin and (for ExitPlanMode invocations) persists tool_input.plan to the
session's planning/plan.md, emitting an artifact.write event.

Observational hook — always exits 0.

This command is meant to be invoked by Claude Code, not by humans
directly.
`;
