/**
 * gobbi hook stop — Stop hook entrypoint.
 *
 * Replaces the direct `gobbi workflow stop` registration. Reads the stdin
 * JSON payload once, passes it through to `runStopWithOptions` via the
 * `payload` override.
 *
 * ## Hook contract
 *
 * Observational hook — always exits 0. The stop body's reentrance guard
 * (`stop_hook_active === true`) is the first action it takes after
 * receiving the payload; this wrapper does not need its own reentrance
 * check.
 *
 * @see `commands/workflow/stop.ts` — body invoked here.
 */

import { readStdinJson } from '../../lib/stdin.js';
import { runStopWithOptions } from '../workflow/stop.js';

export async function runHookStop(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(USAGE);
    return;
  }

  // Read stdin ONCE in the hook entrypoint.
  const payload = await readStdinJson<unknown>();

  try {
    await runStopWithOptions(args, { payload });

    // TODO(PR-FIN-1d) — dispatch notify for Stop triggers.
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi hook stop: ${message}\n`);
  }
}

const USAGE = `Usage: gobbi hook stop

Stop hook entrypoint. Reads the Claude Code Stop payload on stdin,
resolves the active session, and writes a session.heartbeat event under
the 'counter' idempotency kind so same-millisecond repeats both persist.

Observational hook — always exits 0.

This command is meant to be invoked by Claude Code, not by humans
directly.
`;
