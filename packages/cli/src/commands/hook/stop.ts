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

import { dispatchHookNotify, type NotifyOptions } from '../../lib/notify.js';
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

    // PR-FIN-1d.3 — dispatch notify channels whose `triggers` include 'Stop'.
    // `dispatchHookNotify` is silent on internal failure; the surrounding
    // try/catch is defense-in-depth so the hook contract (always exit 0)
    // holds even if a future regression makes it throw.
    const options: NotifyOptions = {
      ...(typeof (payload as { session_id?: unknown })?.session_id === 'string'
        ? { sessionId: (payload as { session_id: string }).session_id }
        : {}),
      ...(process.env['CLAUDE_PROJECT_DIR'] !== undefined
        ? { projectDir: process.env['CLAUDE_PROJECT_DIR'] }
        : {}),
    };
    await dispatchHookNotify(payload, 'Stop', options);
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
