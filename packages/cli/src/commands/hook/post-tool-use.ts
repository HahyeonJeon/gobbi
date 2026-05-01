/**
 * gobbi hook post-tool-use — PostToolUse hook entrypoint.
 *
 * Single dispatcher for every PostToolUse matcher registered in the
 * plugin manifest. Two branches today:
 *
 *   1. `tool_name === 'ExitPlanMode'` → `capture-planning` (writes
 *      `planning/plan.md` and emits `artifact.write`).
 *   2. `tool_name === 'Bash'` AND command starts with
 *      `gobbi workflow transition` → `capture-advancement` (appends
 *      `step.advancement.observed` audit-only event when the
 *      `workflow.observability.advancement.enabled` gate is on; dormant
 *      otherwise).
 *
 * Each branch checks `tool_name` defensively — the plugin manifest
 * already gates registration via `matcher`, but a per-repo override
 * might broaden the registration. The defensive check keeps the hot
 * path lean for non-matching tools.
 *
 * ## Hook contract
 *
 * Observational hook — always exits 0. Both delegate handlers silently
 * no-op on any failure path; this wrapper preserves those semantics by
 * catching any thrown error and writing a one-line stderr diagnostic.
 *
 * @see `commands/workflow/capture-planning.ts`
 * @see `commands/workflow/capture-advancement.ts`
 */

import { readStdinJson } from '../../lib/stdin.js';
import { isRecord, isString } from '../../lib/guards.js';
import { runCapturePlanningWithOptions } from '../workflow/capture-planning.js';
import {
  isBashTransitionInvocation,
  runCaptureAdvancementWithOptions,
} from '../workflow/capture-advancement.js';

export async function runHookPostToolUse(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(USAGE);
    return;
  }

  // Read stdin ONCE in the hook entrypoint. Pass the parsed payload
  // through to each branch so it does not re-read.
  const payload = await readStdinJson<unknown>();

  try {
    // Branch 1 — ExitPlanMode → capture-planning.
    //
    // Defensive matcher check — only invoke capture-planning when the
    // payload's `tool_name` is `ExitPlanMode`. capture-planning itself
    // is safe to call for any tool (it returns early when
    // `tool_input.plan` is missing), but skipping the call entirely
    // keeps the hot path lean for non-matching tools.
    if (
      isRecord(payload) &&
      isString(payload['tool_name']) &&
      payload['tool_name'] === 'ExitPlanMode'
    ) {
      await runCapturePlanningWithOptions(args, { payload });
    }

    // Branch 2 — Bash + `gobbi workflow transition` → capture-advancement.
    //
    // The `isBashTransitionInvocation` matcher already checks both
    // `tool_name === 'Bash'` and the command prefix, so the dispatcher
    // can call it once and let the handler take it from there. The
    // handler is also safe to call unconditionally (it re-validates
    // every gate internally), but routing through the matcher here
    // keeps `gobbi hook post-tool-use` cheap for the common
    // non-matching Bash invocation.
    if (isBashTransitionInvocation(payload)) {
      await runCaptureAdvancementWithOptions(args, { payload });
    }

    // TODO(PR-FIN-1d) — dispatch notify for PostToolUse triggers.
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi hook post-tool-use: ${message}\n`);
  }
}

const USAGE = `Usage: gobbi hook post-tool-use

PostToolUse hook entrypoint. Reads the Claude Code PostToolUse payload on
stdin and dispatches to one of two handlers:

  - ExitPlanMode → capture-planning (writes planning/plan.md +
    artifact.write event).
  - Bash + 'gobbi workflow transition' → capture-advancement (appends
    step.advancement.observed audit-only event when the
    workflow.observability.advancement.enabled gate is on).

Observational hook — always exits 0.

This command is meant to be invoked by Claude Code, not by humans
directly.
`;
