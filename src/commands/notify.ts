/**
 * gobbi notify — Hook notification command router.
 *
 * Subcommands map Claude Code hook JSON payloads to human-readable notification
 * messages and dispatch via sendNotifications. All subcommands are silent on
 * success — they must not produce stdout that breaks the hook chain.
 *
 * Subcommands:
 *   send [--title "Title"]   Send a plain-text message from stdin
 *   attention                Map NotificationEvent payload to attention message
 *   error                    Map StopFailure payload to error message
 *   completion               Map Stop payload to completion message (with loop guard)
 *   session                  Map SessionStart/SessionEnd payload to lifecycle message
 *   subagent                 Map SubagentStop payload to subagent message
 */

import path from 'path';

import { readStdin, readStdinJson } from '../lib/stdin.js';
import { sendNotifications } from '../lib/notify.js';

import type { NotifyOptions } from '../lib/notify.js';

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
function buildOptions(sessionId: string | undefined, projectDir: string | undefined): NotifyOptions {
  const opts: NotifyOptions = {};
  if (sessionId !== undefined) opts.sessionId = sessionId;
  if (projectDir !== undefined) opts.projectDir = projectDir;
  return opts;
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

  await sendNotifications(title, message.trim(), buildOptions(sessionId, projectDir));
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

  await sendNotifications('Attention Needed', message, buildOptions(sessionId, projectDir));
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

  await sendNotifications('Error Alert', message, buildOptions(sessionId, projectDir));
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

  await sendNotifications('Task Complete', message, buildOptions(sessionId, projectDir));
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
      await sendNotifications('Session Started', message, buildOptions(sessionId, projectDir));
      break;
    }
    case 'SessionEnd': {
      const message = `Session ended in ${project}. Session \`${sessionPrefix(sessionId)}\`.`;
      await sendNotifications('Session Ended', message, buildOptions(sessionId, projectDir));
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

  await sendNotifications('Subagent Done', message, buildOptions(sessionId, projectDir));
}
