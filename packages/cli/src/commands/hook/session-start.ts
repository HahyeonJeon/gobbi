/**
 * gobbi hook session-start — SessionStart hook entrypoint.
 *
 * Replaces direct invocation of `gobbi workflow init` from the plugin
 * manifest. The chain is:
 *
 *   1. Read stdin JSON (the SessionStart payload — `session_id`,
 *      `transcript_path`, `cwd`, `hook_event_name="SessionStart"`,
 *      `source` ∈ {startup, resume, compact}, ...).
 *   2. Set `process.env.CLAUDE_SESSION_ID` from the payload's `session_id`
 *      so in-process `runInitWithOptions` resolves the session id
 *      reliably without re-reading stdin.
 *   3. Call `runConfigEnv([], payload)` in-process — persists the parsed
 *      payload's CLAUDE_* fields + native env passthrough to
 *      `$CLAUDE_ENV_FILE`. After Claude Code sources that file, every
 *      subsequent command in the session inherits CLAUDE_SESSION_ID,
 *      CLAUDE_TRANSCRIPT_PATH, etc.
 *   4. Call `runInitWithOptions([])` in-process — initialises the
 *      session directory, ensures the settings cascade, opens the event
 *      store, emits the opening events. `runInitWithOptions` reads
 *      `process.env.CLAUDE_SESSION_ID` (set in step 2) so no flag is
 *      needed.
 *   5. TODO(PR-FIN-1d) — dispatch notify channels whose `triggers`
 *      include `'SessionStart'`.
 *   6. Exit 0 always (hooks must not block Claude Code).
 *
 * ## Stdin discipline
 *
 * Stdin is read exactly once, in this entrypoint. The parsed payload is
 * passed to `runConfigEnv` as a parameter (not re-piped). `runInitWithOptions`
 * does not read stdin at all — it parses CLI args and env. Re-reading
 * stdin from a sub-step would yield empty (the buffer is already
 * drained) and silently break the chain.
 *
 * ## Error containment
 *
 * The body wraps the chain in try/catch. Any sub-step failure surfaces
 * to stderr but does NOT propagate as a non-zero exit — Claude Code
 * treats a non-zero hook exit as a session abort and we'd lose the
 * session for a transient I/O hiccup. PR-FIN-1d's notify dispatch will
 * also live inside this catch boundary.
 */

import { readStdinJson } from '../../lib/stdin.js';
import {
  parseHookEnvPayload,
  runConfigEnv,
} from '../config.js';
import { runInitWithOptions } from '../workflow/init.js';

export async function runHookSessionStart(args: string[]): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(USAGE);
    return;
  }

  // --- 1. Read stdin once -----------------------------------------------
  // TTY (no piped input) yields `null`; treat that as an empty payload so
  // direct CLI invocation for testing doesn't error out. The chain still
  // runs — runConfigEnv will skip the env-file write (no managed keys),
  // and runInitWithOptions will fall back to the existing `$CLAUDE_SESSION_ID`
  // env or exit 2 with the standard remediation if neither is set.
  const raw = await readStdinJson<unknown>();
  const payload = parseHookEnvPayload(raw);

  try {
    // --- 2. Set CLAUDE_SESSION_ID for the in-process chain ---------------
    // `runInitWithOptions` calls `resolveSessionId(undefined)` which
    // checks `process.env.CLAUDE_SESSION_ID`. Setting it from the
    // payload's `session_id` avoids needing to thread `--session-id` as
    // an argv flag. The env file write in step 3 mirrors this so AFTER
    // Claude Code sources `$CLAUDE_ENV_FILE`, future invocations also
    // see the env var without our help.
    if (payload.session_id !== undefined && payload.session_id !== '') {
      process.env['CLAUDE_SESSION_ID'] = payload.session_id;
    }

    // --- 3. Persist env vars to $CLAUDE_ENV_FILE ------------------------
    // Pass the parsed payload directly so runConfigEnv doesn't try to
    // re-read stdin (which is now drained).
    await runConfigEnv([], payload);

    // --- 4. Initialise the session directory ----------------------------
    // No --session-id flag — runInitWithOptions reads from
    // process.env.CLAUDE_SESSION_ID we just set. Idempotent fast-path
    // means a re-fired SessionStart (resume / compact) is a silent no-op.
    await runInitWithOptions([]);

    // --- 5. Notify dispatch (PR-FIN-1d) ---------------------------------
    // TODO(PR-FIN-1d) — dispatch notify channels whose `triggers`
    // include 'SessionStart'. Will read the resolved settings cascade
    // and POST to whichever channels are configured.
  } catch (err) {
    // Hook contract: never propagate a non-zero exit. Surface the cause
    // on stderr for the operator, but keep the process zero-exiting so
    // Claude Code does not abort the session.
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`gobbi hook session-start: ${message}\n`);
  }
}

const USAGE = `Usage: gobbi hook session-start

SessionStart hook entrypoint. Reads the Claude Code SessionStart payload
on stdin, persists CLAUDE_* env vars to $CLAUDE_ENV_FILE via gobbi config
env, and initialises the workflow session via gobbi workflow init.

This command is meant to be invoked by Claude Code, not by humans
directly. See the plugin manifest at plugins/gobbi/hooks/hooks.json or
the per-repo .claude/settings.json hooks block.
`;
