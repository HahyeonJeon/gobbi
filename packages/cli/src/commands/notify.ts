/**
 * gobbi notify — Hook notification command router.
 *
 * Subcommands map Claude Code hook JSON payloads to human-readable notification
 * messages and dispatch via sendNotifications. All hook-dispatch subcommands
 * are silent on success — they must not produce stdout that breaks the hook
 * chain. The user-facing `configure` verb is exempt from that rule (it is
 * invoked manually, not from a hook subprocess) and renders to stdout/stderr
 * normally with conventional CLI exit codes.
 *
 * Subcommands:
 *   send [--title "Title"]                       Send a plain-text message from stdin
 *   attention                                    Map NotificationEvent payload to attention message
 *   error                                        Map StopFailure payload to error message
 *   completion                                   Map Stop payload to completion message (with loop guard)
 *   session                                      Map SessionStart/SessionEnd payload to lifecycle message
 *   subagent                                     Map SubagentStop payload to subagent message
 *   configure --enable <event> | --disable <event> | --status
 *                                                Manage gobbi-owned hook entries in
 *                                                `.claude/settings.json` with a strict
 *                                                trust boundary (only entries whose
 *                                                command starts with `gobbi ` are
 *                                                touched; other tools' entries are
 *                                                read-only).
 */

import path from 'node:path';

import {
  isGobbiOwnedHook,
  readClaudeSettings,
  writeClaudeSettings,
  type ClaudeSettings,
  type ClaudeSettingsEventBlock,
  type ClaudeSettingsHookEntry,
  type ClaudeSettingsHookGroup,
} from '../lib/claude-settings-io.js';
import { getRepoRoot } from '../lib/repo.js';
import { HOOK_TRIGGER_ENUM } from '../lib/settings-validator.js';
import { readStdin, readStdinJson } from '../lib/stdin.js';

import type { HookTrigger } from '../lib/settings.js';

// ---------------------------------------------------------------------------
// Usage strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi notify <subcommand> [options]

Subcommands:
  send [--title "Title"]   Send a plain-text message from stdin
  attention                Map NotificationEvent payload to attention message
  error                    Map StopFailure payload to error message
  completion               Map Stop payload to completion message (with loop guard)
  session                  Map SessionStart/SessionEnd payload to lifecycle message
  subagent                 Map SubagentStop payload to subagent message
  configure                Manage .claude/settings.json hook entries
                             --enable <event>    add gobbi hook entry
                             --disable <event>   remove gobbi-owned hook entry
                             --status            print table of gobbi-owned entries

Options:
  --help    Show this help message`;
import { sendNotifications } from '../lib/notify.js';

import type { NotifyOptions } from '../lib/notify.js';
import type { NotifyEvent } from '../lib/settings.js';

// ---------------------------------------------------------------------------
// Hook payload shapes
// ---------------------------------------------------------------------------

interface AttentionPayload {
  session_id?: string;
  notification_type?: string;
  cwd?: string;
}

interface ErrorPayload {
  session_id?: string;
  error_type?: string;
  cwd?: string;
}

interface CompletionPayload {
  session_id?: string;
  cwd?: string;
  stop_hook_active?: boolean | string;
}

interface SessionPayload {
  session_id?: string;
  hook_event_name?: string;
  cwd?: string;
  source?: string;
}

interface SubagentPayload {
  session_id?: string;
  agent_type?: string;
  cwd?: string;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function projectName(cwd: string): string {
  return path.basename(cwd);
}

function sessionPrefix(sessionId: string): string {
  return sessionId.slice(0, 8);
}

/**
 * Build a NotifyOptions object omitting undefined properties.
 * Required because exactOptionalPropertyTypes forbids passing `undefined`
 * for optional string properties.
 */
function buildOptions(
  sessionId: string | undefined,
  projectDir: string | undefined,
): NotifyOptions {
  return {
    ...(sessionId !== undefined ? { sessionId } : {}),
    ...(projectDir !== undefined ? { projectDir } : {}),
  };
}

// ---------------------------------------------------------------------------
// Top-level router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi notify`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runNotify(args: string[]): Promise<void> {
  const subcommand = args[0];

  // The `configure` verb is the user-facing exception to the
  // "hooks-must-be-silent" rule: it runs interactively from a shell, so
  // it owns its own try/catch + exit-code discipline below. Routed
  // outside the silencing try-block so its errors are surfaced.
  if (subcommand === 'configure') {
    await runNotifyConfigure(args.slice(1));
    return;
  }

  try {
    switch (subcommand) {
      case 'send':
        await runNotifySend(args.slice(1));
        break;
      case 'attention':
        await runNotifyAttention();
        break;
      case 'error':
        await runNotifyError();
        break;
      case 'completion':
        await runNotifyCompletion();
        break;
      case 'session':
        await runNotifySession();
        break;
      case 'subagent':
        await runNotifySubagent();
        break;
      case '--help':
        console.log(USAGE);
        break;
      case undefined:
        console.log(USAGE);
        break;
      default:
        // Unknown subcommand — exit silently; hooks must not produce output
        break;
    }
  } catch {
    // Notification failures must never break the hook chain
  }
}

// ---------------------------------------------------------------------------
// send
// ---------------------------------------------------------------------------

async function runNotifySend(args: string[]): Promise<void> {
  // Parse --title option manually to avoid any stdout from parseArgs errors
  let title = 'Claude Code';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--title' && i + 1 < args.length) {
      const next = args[i + 1];
      if (next !== undefined) {
        title = next;
      }
      break;
    }
  }

  const message = await readStdin();

  // Exit silently when stdin is not piped or message is empty
  if (message === null || message.trim() === '') {
    return;
  }

  const projectDir = process.env['CLAUDE_PROJECT_DIR'];
  const sessionId = process.env['CLAUDE_SESSION_ID'];

  // `send` is the generic manual entry point — no dedicated NotifyEvent maps
  // to "user invoked `gobbi notify send` directly". `'error'` is the closest
  // catch-all; users wanting silence can set `events: []` on their channels.
  const event: NotifyEvent = 'error';
  await sendNotifications(title, message.trim(), event, buildOptions(sessionId, projectDir));
}

// ---------------------------------------------------------------------------
// attention
// ---------------------------------------------------------------------------

async function runNotifyAttention(): Promise<void> {
  const payload = await readStdinJson<AttentionPayload>();
  if (payload === null) return;

  const sessionId = payload.session_id ?? 'unknown';
  const notificationType = payload.notification_type ?? 'unknown';
  const cwd = payload.cwd ?? 'unknown';
  const project = projectName(cwd);

  let msg: string;
  switch (notificationType) {
    case 'permission_prompt':
      msg = `Waiting for permission approval in ${project}.`;
      break;
    case 'idle_prompt':
      msg = `Session idle — waiting for your input in ${project}.`;
      break;
    case 'elicitation_dialog':
      msg = `MCP server needs your input in ${project}.`;
      break;
    default:
      msg = `Needs attention in ${project} (${notificationType}).`;
      break;
  }

  const message = `${msg} Session \`${sessionPrefix(sessionId)}\`.`;
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];

  // Attention hooks (permission prompt, idle prompt, MCP elicitation) are
  // user-attention signals — closest NotifyEvent is `error`.
  await sendNotifications(
    'Attention Needed',
    message,
    'error',
    buildOptions(sessionId, projectDir),
  );
}

// ---------------------------------------------------------------------------
// error
// ---------------------------------------------------------------------------

async function runNotifyError(): Promise<void> {
  const payload = await readStdinJson<ErrorPayload>();
  if (payload === null) return;

  const sessionId = payload.session_id ?? 'unknown';
  const errorType = payload.error_type ?? 'unknown';
  const cwd = payload.cwd ?? 'unknown';
  const project = projectName(cwd);

  let message: string;
  switch (errorType) {
    case 'rate_limit':
      message = `Rate limited. Session paused in ${project}.`;
      break;
    case 'authentication_failed':
      message = `Authentication failed in ${project}. Check your API key.`;
      break;
    case 'billing_error':
      message = `Billing error in ${project}. Check your account.`;
      break;
    case 'server_error':
      message = `API server error in ${project}. Try again later.`;
      break;
    case 'max_output_tokens':
      message = `Output token limit reached in ${project}.`;
      break;
    default:
      message = `Error (${errorType}) in ${project}.`;
      break;
  }

  const projectDir = process.env['CLAUDE_PROJECT_DIR'];

  await sendNotifications(
    'Error Alert',
    message,
    'error',
    buildOptions(sessionId, projectDir),
  );
}

// ---------------------------------------------------------------------------
// completion
// ---------------------------------------------------------------------------

async function runNotifyCompletion(): Promise<void> {
  const payload = await readStdinJson<CompletionPayload>();
  if (payload === null) return;

  // CRITICAL: guard against infinite loop — stop_hook_active can be boolean
  // true or the string "true" depending on how the hook runner serialises it
  const stopHookActive = payload.stop_hook_active;
  if (stopHookActive === true || stopHookActive === 'true') {
    return;
  }

  const sessionId = payload.session_id ?? 'unknown';
  const cwd = payload.cwd ?? 'unknown';
  const project = projectName(cwd);

  const message = `Session \`${sessionPrefix(sessionId)}\` finished in ${project}.`;
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];

  await sendNotifications(
    'Task Complete',
    message,
    'workflow.complete',
    buildOptions(sessionId, projectDir),
  );
}

// ---------------------------------------------------------------------------
// session
// ---------------------------------------------------------------------------

async function runNotifySession(): Promise<void> {
  const payload = await readStdinJson<SessionPayload>();
  if (payload === null) return;

  const sessionId = payload.session_id ?? 'unknown';
  const hookEventName = payload.hook_event_name ?? 'unknown';
  const cwd = payload.cwd ?? 'unknown';
  const project = projectName(cwd);

  const projectDir = process.env['CLAUDE_PROJECT_DIR'];

  switch (hookEventName) {
    case 'SessionStart': {
      const source = payload.source ?? 'unknown';
      const message = `Session started (${source}) in ${project}. Session \`${sessionPrefix(sessionId)}\`.`;
      await sendNotifications(
        'Session Started',
        message,
        'workflow.start',
        buildOptions(sessionId, projectDir),
      );
      break;
    }
    case 'SessionEnd': {
      const message = `Session ended in ${project}. Session \`${sessionPrefix(sessionId)}\`.`;
      await sendNotifications(
        'Session Ended',
        message,
        'workflow.complete',
        buildOptions(sessionId, projectDir),
      );
      break;
    }
    default:
      // Unknown event — exit silently
      break;
  }
}

// ---------------------------------------------------------------------------
// subagent
// ---------------------------------------------------------------------------

async function runNotifySubagent(): Promise<void> {
  const payload = await readStdinJson<SubagentPayload>();
  if (payload === null) return;

  const sessionId = payload.session_id ?? 'unknown';
  const agentType = payload.agent_type ?? 'unknown';
  const cwd = payload.cwd ?? 'unknown';
  const project = projectName(cwd);

  const message = `Subagent (${agentType}) finished in ${project}. Session \`${sessionPrefix(sessionId)}\`.`;
  const projectDir = process.env['CLAUDE_PROJECT_DIR'];

  await sendNotifications(
    'Subagent Done',
    message,
    'subagent.complete',
    buildOptions(sessionId, projectDir),
  );
}

// ---------------------------------------------------------------------------
// configure — manage .claude/settings.json hook entries
// ---------------------------------------------------------------------------

const CONFIGURE_USAGE = `Usage: gobbi notify configure <mode>

Modes (exactly one required):
  --enable  <event>   Add a gobbi hook entry to .claude/settings.json for <event>
  --disable <event>   Remove a gobbi-owned hook entry from .claude/settings.json
  --status            Print a table of currently configured gobbi-owned entries

Trust boundary: only entries whose command starts with the literal 'gobbi '
(note trailing space) are read or modified. Entries written by other tools
(e.g., claude-trace) or by the user manually are left untouched and do not
appear in --status output.

Exit codes:
  0  success
  2  argument error or unknown event name`;

/**
 * Canonical default timeouts (in seconds) per Claude Code event, mirroring
 * `plugins/gobbi/hooks/hooks.json` so `--enable <event>` writes the same
 * timeout the plugin distribution would. Events not listed fall back to 5
 * seconds — the same default the plugin uses for its short-running stubs.
 */
const CANONICAL_HOOK_TIMEOUTS: Readonly<Partial<Record<HookTrigger, number>>> = {
  SessionStart: 15,
  SessionEnd: 10,
  Stop: 10,
  StopFailure: 10,
  PostToolUse: 30,
  PostToolUseFailure: 10,
  PostToolBatch: 10,
  SubagentStop: 60,
  PreCompact: 10,
  PostCompact: 10,
};

const DEFAULT_HOOK_TIMEOUT = 5;

/**
 * Convert a PascalCase event name to its kebab-case CLI subcommand
 * form. Mirrors `commands/hook/_stub.ts::pascalToKebab` so the canonical
 * `gobbi hook <kebab>` command string the configurer writes matches what
 * the hook dispatcher actually responds to.
 *
 *   'SessionEnd'       → 'session-end'
 *   'UserPromptSubmit' → 'user-prompt-submit'
 *   'PostToolUse'      → 'post-tool-use'
 */
function eventToKebab(name: string): string {
  return name.replace(/[A-Z]/g, (c, i) => (i === 0 ? c.toLowerCase() : `-${c.toLowerCase()}`));
}

/** The canonical `gobbi hook <kebab>` command string for an event. */
function gobbiHookCommandFor(event: HookTrigger): string {
  return `gobbi hook ${eventToKebab(event)}`;
}

/** Strict membership check against the exported HOOK_TRIGGER_ENUM. */
function isHookTrigger(value: string): value is HookTrigger {
  return (HOOK_TRIGGER_ENUM as readonly string[]).includes(value);
}

interface ConfigureArgs {
  readonly mode: 'enable' | 'disable' | 'status';
  readonly event: HookTrigger | null;
}

/**
 * Parse `gobbi notify configure` argv. Manual-style parsing (matching the
 * `runNotifySend` precedent) keeps argv-error surfacing under our control:
 * `parseArgs` would print to stdout/stderr on bad input, and we want a
 * single canonical error path.
 *
 * Rejects multiple-mode invocations (`--enable X --disable Y` together)
 * because they would silently round-trip the file twice and confuse users.
 */
function parseConfigureArgs(args: readonly string[]): ConfigureArgs | { readonly error: string } {
  let mode: 'enable' | 'disable' | 'status' | null = null;
  let event: string | null = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--enable' || arg === '--disable') {
      if (mode !== null) {
        return {
          error:
            `gobbi notify configure: only one of --enable, --disable, --status may be given`,
        };
      }
      mode = arg === '--enable' ? 'enable' : 'disable';
      const next = args[i + 1];
      if (next === undefined || next.startsWith('--')) {
        return { error: `gobbi notify configure: ${arg} requires an event name` };
      }
      event = next;
      i++;
      continue;
    }
    if (arg === '--status') {
      if (mode !== null) {
        return {
          error:
            `gobbi notify configure: only one of --enable, --disable, --status may be given`,
        };
      }
      mode = 'status';
      continue;
    }
    if (arg === '--help' || arg === '-h') {
      // Treated as an explicit error from the parse layer so the caller
      // can decide whether to print usage to stdout (success path) or
      // stderr (error path). We surface it as the usage text.
      return { error: CONFIGURE_USAGE };
    }
    return { error: `gobbi notify configure: unknown argument '${arg}'` };
  }

  if (mode === null) {
    return {
      error:
        `gobbi notify configure: one of --enable, --disable, --status is required`,
    };
  }

  if (mode === 'status') {
    return { mode: 'status', event: null };
  }

  // mode is 'enable' or 'disable' — event must be present and valid.
  if (event === null) {
    return { error: `gobbi notify configure: --${mode} requires an event name` };
  }
  if (!isHookTrigger(event)) {
    const valid = (HOOK_TRIGGER_ENUM as readonly string[]).join(', ');
    return {
      error:
        `gobbi notify configure: unknown event '${event}'. Valid events: ${valid}`,
    };
  }

  return { mode, event };
}

/**
 * Top-level dispatcher for `gobbi notify configure`. Owns its own
 * exit-code discipline (0 success, 2 on argv/validation errors) and
 * is exempt from the hook-chain "always silent" rule because it is
 * invoked manually from a shell, not from a hook subprocess.
 */
async function runNotifyConfigure(args: readonly string[]): Promise<void> {
  const parsed = parseConfigureArgs(args);
  if ('error' in parsed) {
    process.stderr.write(`${parsed.error}\n`);
    process.exit(2);
  }

  const repoRoot = getRepoRoot();
  switch (parsed.mode) {
    case 'enable':
      // Narrowed by parseConfigureArgs: when mode === 'enable',
      // `event` is a non-null HookTrigger.
      if (parsed.event !== null) configureEnable(repoRoot, parsed.event);
      break;
    case 'disable':
      if (parsed.event !== null) configureDisable(repoRoot, parsed.event);
      break;
    case 'status':
      configureStatus(repoRoot);
      break;
  }
}

/**
 * Add a gobbi hook entry for `event` to `.claude/settings.json`.
 * Idempotent: if a gobbi-owned entry with the canonical command
 * already exists under `hooks[event]`, this is a no-op.
 *
 * The new block is unmatched (no top-level `matcher` field) so it
 * fires for every invocation of the event. Users who need a matcher
 * (e.g., the canonical `SessionStart` block uses
 * `'startup|resume|clear|compact'`) should hand-edit `.claude/settings.json`
 * — the trust boundary then keeps gobbi from clobbering their edit.
 */
function configureEnable(repoRoot: string, event: HookTrigger): void {
  const settings = readClaudeSettings(repoRoot);
  const command = gobbiHookCommandFor(event);
  const existing = settings.hooks?.[event] ?? [];

  // Idempotency: a gobbi-owned entry with the canonical command under
  // ANY block of `hooks[event]` is enough to short-circuit the write.
  for (const block of existing) {
    for (const entry of block.hooks) {
      if (isGobbiOwnedHook(entry) && entry.command === command) {
        return;
      }
    }
  }

  const newHookEntry: ClaudeSettingsHookEntry = {
    type: 'command',
    command,
    timeout: CANONICAL_HOOK_TIMEOUTS[event] ?? DEFAULT_HOOK_TIMEOUT,
  };
  const newBlock: ClaudeSettingsEventBlock = { hooks: [newHookEntry] };
  const nextHooksForEvent: readonly ClaudeSettingsEventBlock[] = [...existing, newBlock];

  const nextHooks: ClaudeSettingsHookGroup = {
    ...(settings.hooks ?? {}),
    [event]: nextHooksForEvent,
  };
  const nextSettings: ClaudeSettings = { ...settings, hooks: nextHooks };
  writeClaudeSettings(repoRoot, nextSettings);
}

/**
 * Remove the gobbi-owned canonical hook entry for `event` from
 * `.claude/settings.json`. Silent no-op if no such entry exists (idem-
 * potent when called twice or against a fresh repo).
 *
 * Trust boundary: only entries that pass {@link isGobbiOwnedHook} AND
 * carry the canonical `gobbi hook <kebab>` command for this event are
 * removed. Other gobbi commands the user wrote by hand and other
 * tools' entries are left intact. Blocks that become empty after
 * filtering are dropped; if `hooks[event]` becomes empty the key is
 * deleted; if `hooks` becomes empty the top-level key is deleted.
 *
 * If nothing changes the write is skipped — keeps the on-disk file
 * stable across no-op calls.
 */
function configureDisable(repoRoot: string, event: HookTrigger): void {
  const settings = readClaudeSettings(repoRoot);
  const command = gobbiHookCommandFor(event);
  const existing = settings.hooks?.[event];
  if (existing === undefined || existing.length === 0) {
    return;
  }

  let modified = false;
  const filteredBlocks: ClaudeSettingsEventBlock[] = [];
  for (const block of existing) {
    const keptHooks: ClaudeSettingsHookEntry[] = [];
    for (const entry of block.hooks) {
      if (isGobbiOwnedHook(entry) && entry.command === command) {
        modified = true;
        continue;
      }
      keptHooks.push(entry);
    }
    if (keptHooks.length === 0) {
      // Dropped block (was either entirely gobbi-owned for this event
      // or empty to begin with — either way we shed it).
      continue;
    }
    if (keptHooks.length !== block.hooks.length) {
      filteredBlocks.push({ ...block, hooks: keptHooks });
    } else {
      filteredBlocks.push(block);
    }
  }

  if (!modified) {
    // Nothing matched the trust-boundary filter — silent no-op.
    return;
  }

  const nextHooks: Record<string, readonly ClaudeSettingsEventBlock[]> = {};
  for (const [key, value] of Object.entries(settings.hooks ?? {})) {
    if (key === event) continue;
    if (value !== undefined) nextHooks[key] = value;
  }
  if (filteredBlocks.length > 0) {
    nextHooks[event] = filteredBlocks;
  }

  const nextSettings: ClaudeSettings = { ...settings };
  if (Object.keys(nextHooks).length === 0) {
    // Strip the empty hooks key entirely so the on-disk file stays
    // minimal. The index signature on ClaudeSettings allows the
    // delete on a record-shape spread copy.
    delete (nextSettings as Record<string, unknown>).hooks;
  } else {
    (nextSettings as Record<string, unknown>).hooks = nextHooks;
  }
  writeClaudeSettings(repoRoot, nextSettings);
}

/**
 * Print a table of all 28 Claude Code events, indicating which ones
 * have a gobbi-owned canonical entry under `.claude/settings.json`.
 * Iteration order matches the canonical order in {@link HOOK_TRIGGER_ENUM}.
 *
 * Trust boundary: only entries the user invoked `--enable` for (or
 * that match the canonical `gobbi hook <kebab>` command shape) appear
 * in the table. Entries written by other tools — e.g., `claude-trace` —
 * are not listed; this command manages gobbi's own footprint and does
 * not survey the wider hooks block.
 */
function configureStatus(repoRoot: string): void {
  const settings = readClaudeSettings(repoRoot);
  const hooks = settings.hooks ?? {};

  const headerEvent = 'Event';
  // Width: longest 28-event identifier is 'PostToolUseFailure' (18). Add
  // padding so the column is visually aligned.
  const eventColumnWidth = Math.max(
    headerEvent.length,
    ...HOOK_TRIGGER_ENUM.map((e) => e.length),
  );
  const headerConfigured = 'Configured';
  // Width matches the header — 'yes'/'no' are both shorter.
  const configuredColumnWidth = headerConfigured.length;

  const lines: string[] = [];
  lines.push(
    `${headerEvent.padEnd(eventColumnWidth)}  ${headerConfigured.padEnd(configuredColumnWidth)}  Command`,
  );

  for (const event of HOOK_TRIGGER_ENUM) {
    const command = gobbiHookCommandFor(event);
    const blocks = hooks[event] ?? [];
    let configured = false;
    for (const block of blocks) {
      for (const entry of block.hooks) {
        if (isGobbiOwnedHook(entry) && entry.command === command) {
          configured = true;
          break;
        }
      }
      if (configured) break;
    }
    const yesNo = configured ? 'yes' : 'no';
    const cmdCell = configured ? command : '—';
    lines.push(
      `${event.padEnd(eventColumnWidth)}  ${yesNo.padEnd(configuredColumnWidth)}  ${cmdCell}`,
    );
  }

  process.stdout.write(`${lines.join('\n')}\n`);
}
