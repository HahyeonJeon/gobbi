/**
 * gobbi hook subagent-stop — SubagentStop hook entrypoint.
 *
 * Replaces the direct `gobbi workflow capture-subagent` registration.
 * Reads the stdin JSON payload once, passes it through to
 * `runCaptureSubagentWithOptions` via the `payload` override.
 *
 * ## Hook contract
 *
 * Observational hook — always exits 0. capture-subagent's
 * implementation already silently no-ops on any failure path; this
 * wrapper preserves those semantics.
 *
 * @see `commands/workflow/capture-subagent.ts` — body invoked here.
 */

import { dispatchHookNotify, type NotifyOptions } from '../../lib/notify.js';
import { readStdinJson } from '../../lib/stdin.js';
import { runCaptureSubagentWithOptions } from '../workflow/capture-subagent.js';

export async function runHookSubagentStop(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(USAGE);
    return;
  }

  // Read stdin ONCE in the hook entrypoint.
  const payload = await readStdinJson<unknown>();

  try {
    await runCaptureSubagentWithOptions(args, { payload });

    // PR-FIN-1d.3 — dispatch notify channels whose `triggers` include
    // 'SubagentStop'. Silent-on-failure inside; the try/catch is
    // defense-in-depth for the hook contract.
    const options: NotifyOptions = {
      ...(typeof (payload as { session_id?: unknown })?.session_id === 'string'
        ? { sessionId: (payload as { session_id: string }).session_id }
        : {}),
      ...(process.env['CLAUDE_PROJECT_DIR'] !== undefined
        ? { projectDir: process.env['CLAUDE_PROJECT_DIR'] }
        : {}),
    };
    await dispatchHookNotify(payload, 'SubagentStop', options);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi hook subagent-stop: ${message}\n`);
  }
}

const USAGE = `Usage: gobbi hook subagent-stop

SubagentStop hook entrypoint. Reads the Claude Code SubagentStop payload
on stdin, extracts the subagent's final output from its JSONL transcript,
writes an artifact file under .gobbi/projects/<name>/sessions/<id>/artifacts/,
and appends exactly one delegation.complete or delegation.fail event.

Observational hook — always exits 0.

This command is meant to be invoked by Claude Code, not by humans
directly.
`;
