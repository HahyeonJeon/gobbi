/**
 * gobbi hook pre-tool-use — PreToolUse hook entrypoint.
 *
 * Replaces the direct `gobbi workflow guard` registration. Reads the
 * stdin JSON payload once, passes it through to `runGuardWithOptions`
 * via the `payload` override so guard does not re-read stdin (which
 * would already be drained).
 *
 * ## Hook contract
 *
 * Always exit 0. The guard implementation already enforces fail-open
 * semantics on every error path — see `commands/workflow/guard.ts`
 * §"Hotpath discipline". This wrapper preserves those semantics.
 *
 * @see `commands/workflow/guard.ts` — body invoked here.
 */

import { readStdinJson } from '../../lib/stdin.js';
import { GUARDS } from '../../workflow/guards.js';
import { runGuardWithOptions } from '../workflow/guard.js';

export async function runHookPreToolUse(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(USAGE);
    return;
  }

  // Stub gate: registry is empty (workflow/guards.ts:117). Drain stdin
  // for broken-pipe safety, then exit 0. Falls through to the real guard
  // body the moment GUARDS gains entries — no source edit needed.
  const payload = await readStdinJson<unknown>();
  if (GUARDS.length === 0) {
    return;
  }

  try {
    await runGuardWithOptions(args, { payload });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi hook pre-tool-use: ${message}\n`);
  }
}

const USAGE = `Usage: gobbi hook pre-tool-use

PreToolUse hook entrypoint. Reads the Claude Code PreToolUse payload on
stdin, evaluates the guard matcher for the active session's current step
+ the tool named in the payload, and writes a hookSpecificOutput JSON
response to stdout.

This command is meant to be invoked by Claude Code, not by humans
directly.
`;
