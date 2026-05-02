/**
 * Notification dispatch for gobbi — sends messages to Slack, Telegram, Discord,
 * and Desktop channels.
 *
 * ## Channel gating
 *
 *   1. `resolveSettings({repoRoot, sessionId})` produces the cascaded
 *      {@link NotifySettings} shape for the current session.
 *   2. For each channel `{slack, telegram, discord, desktop}`:
 *      - Skip when `notify.<channel>.enabled !== true`.
 *      - Skip when `channelMatchesEvent(channel.events, event) === false`.
 *        Inverted-events semantic per ideation §3.2 / §6.3:
 *          - `events` field **absent** → fire on ALL events
 *          - `events: []` (empty array) → fire on NO events (channel silent)
 *          - `events: [...]` (non-empty) → fire only if `event` is listed
 *      - Skip when credentials / routing are absent (silent no-op;
 *        misconfiguration is an operator concern, not a runtime error).
 *   3. Channels fire concurrently via `Promise.allSettled` — a failure in one
 *      channel never blocks others and never propagates to the caller.
 *
 * ## Two dispatch entry points
 *
 *   - {@link sendNotifications}`(title, message, event, options)` —
 *     workflow-internal callers; filters by `notify.<channel>.events`
 *     ({@link NotifyEvent}).
 *   - {@link dispatchHookNotify}`(payload, eventName, options)` — hook
 *     callers; filters by `notify.<channel>.triggers`
 *     ({@link HookTrigger}). Issue #219 (Phase 2 of PR-FIN-1d) extended
 *     `renderHookMessage` to cover all 28 {@link HookTrigger} values, so
 *     any hook caller that reaches `dispatchHookNotify` with a matching
 *     trigger filter dispatches. The Tier-A/Tier-B dispatch policy
 *     (per-event flooding control) is enforced upstream by the stub
 *     allow-list in `commands/hook/_stub.ts::STUB_DISPATCH_EVENTS`.
 *
 * The two filters are independent — `dispatchHookNotify` does not consult
 * `events`, and `sendNotifications` does not consult `triggers`. Both
 * delegate per-channel credential resolution and concurrent dispatch to
 * the shared {@link dispatchToChannels} helper.
 *
 * ## Non-secret routing
 *
 * `slack.channel`, `telegram.chatId`, and `discord.webhookName` are non-secret
 * routing hints persisted in `settings.json`. Credentials (`SLACK_BOT_TOKEN`,
 * `TELEGRAM_BOT_TOKEN`, `DISCORD_WEBHOOK_URL`, `SLACK_USER_ID`,
 * `TELEGRAM_CHAT_ID`) stay in `.claude/.env` and are read via `process.env`
 * only when the channel is enabled. Routing fields that are `null` or absent
 * delegate to the legacy env-var form so existing setups keep working until
 * a user moves routing into config. Slack `channel` accepts either a
 * channel id (`C…`) or a user id (`U…`) — the Slack API takes either.
 *
 * ## Desktop channel
 *
 * Desktop is gated entirely by `notify.desktop.enabled` in the cascade. The
 * legacy `NOTIFY_DESKTOP` env-only gate is removed: operators opt in via
 * `gobbi config set notify.desktop.enabled true` at whichever level fits
 * their setup.
 */

import { execFile } from 'node:child_process';
import { mkdir, appendFile } from 'node:fs/promises';
import { join } from 'node:path';

import { resolveSettings } from './settings-io.js';
import type {
  ChannelBase,
  HookTrigger,
  NotifyEvent,
  NotifySettings,
} from './settings.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NotifyOptions {
  /** Session id for cascade resolution. Required to read session-level config. */
  readonly sessionId?: string;
  /** Repo root used as the cascade's anchor. When absent, the cascade is
   *  skipped and no channel fires — protects hook callers that never set
   *  `CLAUDE_PROJECT_DIR`. */
  readonly projectDir?: string;
}

// ---------------------------------------------------------------------------
// Event-filter helper (exported for tests)
// ---------------------------------------------------------------------------

/**
 * Inverted-events semantic from ideation §3.2. A channel fires on `event`
 * when the channel's `events` field is **absent** (fire on all) or when it
 * is a **non-empty** list that includes `event`. `events: []` silences the
 * channel entirely.
 */
export function channelMatchesEvent(
  channelEvents: readonly NotifyEvent[] | undefined,
  event: NotifyEvent,
): boolean {
  if (channelEvents === undefined) return true;
  if (channelEvents.length === 0) return false;
  return channelEvents.includes(event);
}

/**
 * Mirror of {@link channelMatchesEvent} for the Claude Code hook side.
 *
 * Locked Round-3 §F4 contract (the `enabled === true` precondition is
 * applied by the caller; this helper only decides the `triggers` arm):
 *
 *   - `triggers === undefined` → fire on all hook events
 *   - `triggers.length === 0`  → silent (explicit empty list)
 *   - `triggers.includes(eventName)` → fire
 *   - otherwise → silent
 *
 * Independent of {@link channelMatchesEvent} — `dispatchHookNotify` does
 * not consult the `events` filter and `sendNotifications` does not consult
 * `triggers`.
 */
export function triggersMatch(
  channelTriggers: readonly HookTrigger[] | undefined,
  eventName: HookTrigger,
): boolean {
  if (channelTriggers === undefined) return true;
  if (channelTriggers.length === 0) return false;
  return channelTriggers.includes(eventName);
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Truncate text to maxChars. If truncated, appends "... [truncated]".
 */
function truncateMsg(text: string, maxChars: number): string {
  const suffix = '... [truncated]';
  if (text.length > maxChars) {
    const keep = maxChars - suffix.length;
    return text.slice(0, keep) + suffix;
  }
  return text;
}

/**
 * Append a failure entry to ~/.claude/notification-failures.log.
 * Creates the directory if it doesn't exist. Never throws — logging must not
 * crash the caller.
 */
async function logFailure(channel: string, details: string): Promise<void> {
  try {
    const homeDir = process.env['HOME'] ?? process.env['USERPROFILE'] ?? '';
    const logDir = join(homeDir, '.claude');
    const logPath = join(logDir, 'notification-failures.log');

    await mkdir(logDir, { recursive: true });

    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace('T', ' ')
      .replace(/\.\d{3}Z$/, '');
    const line = `${timestamp} ${channel}_FAIL: ${details}\n`;

    await appendFile(logPath, line, 'utf8');
  } catch {
    // Silently ignore — log failure must never propagate
  }
}

/**
 * Parse an integer from an env var, returning the fallback when absent or invalid.
 */
function envInt(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined) return fallback;
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

// ---------------------------------------------------------------------------
// Channel dispatchers
// ---------------------------------------------------------------------------

async function sendSlack(
  title: string,
  message: string,
  token: string,
  destination: string,
): Promise<void> {
  const maxChars = envInt('SLACK_MAX_CHARS', 3500);
  const rawText = `*${title}*\n${message}`;
  const text = truncateMsg(rawText, maxChars);

  let response: Response;
  try {
    response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ channel: destination, text }),
    });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : String(err);
    await logFailure('SLACK', `fetch error: ${details}`);
    return;
  }

  let json: unknown;
  try {
    json = (await response.json()) as unknown;
  } catch {
    await logFailure('SLACK', 'failed to parse response JSON');
    return;
  }

  if (
    typeof json === 'object' &&
    json !== null &&
    'ok' in json &&
    (json as Record<string, unknown>)['ok'] === false
  ) {
    await logFailure('SLACK', JSON.stringify(json));
  }
}

async function sendTelegram(
  title: string,
  message: string,
  token: string,
  chatId: string,
): Promise<void> {
  const maxChars = envInt('TELEGRAM_MAX_CHARS', 3900);
  const rawText = `<b>${title}</b>\n${message}`;
  const text = truncateMsg(rawText, maxChars);

  let response: Response;
  try {
    response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
    });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : String(err);
    await logFailure('TELEGRAM', `fetch error: ${details}`);
    return;
  }

  if (!response.ok) {
    await logFailure('TELEGRAM', `HTTP ${response.status}`);
  }
}

async function sendDiscord(title: string, message: string, webhookUrl: string): Promise<void> {
  const maxChars = envInt('DISCORD_MAX_CHARS', 1900);
  // Discord renders markdown; bolding the title mirrors the Slack formatting.
  const rawText = `**${title}**\n${message}`;
  const text = truncateMsg(rawText, maxChars);

  let response: Response;
  try {
    response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text }),
    });
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : String(err);
    await logFailure('DISCORD', `fetch error: ${details}`);
    return;
  }

  // Discord returns 204 No Content on success; any non-2xx is a failure.
  if (!response.ok) {
    await logFailure('DISCORD', `HTTP ${response.status}`);
  }
}

async function sendDesktop(title: string, message: string): Promise<void> {
  const maxChars = envInt('DESKTOP_MAX_CHARS', 250);
  const truncated = truncateMsg(message, maxChars);

  return new Promise<void>((resolve) => {
    if (process.platform === 'linux') {
      execFile('notify-send', [title, truncated], (_err, _stdout, _stderr) => {
        resolve();
      });
    } else if (process.platform === 'darwin') {
      const script = `display notification "${truncated}" with title "${title}"`;
      execFile('osascript', ['-e', script], (_err, _stdout, _stderr) => {
        resolve();
      });
    } else {
      resolve();
    }
  });
}

// ---------------------------------------------------------------------------
// Per-channel dispatch
// ---------------------------------------------------------------------------

/**
 * Iterate the four channels in fixed order (slack → telegram → discord →
 * desktop), apply the caller-supplied `predicate` to each, and dispatch the
 * channel-specific send when the predicate returns `true` AND the
 * channel-specific credentials / routing are present.
 *
 * The predicate owns filter semantics — `enabled === true`, the inverted
 * `events` filter, the `triggers` filter, or any composition the caller
 * needs. This helper is indifferent to which gate the predicate models;
 * its job is to apply the per-channel credential resolution and push to
 * the concurrent task list.
 *
 * Channel-specific behavior is unchanged from the original inline form:
 *
 *   - **slack** — token from `SLACK_BOT_TOKEN`; destination from
 *     `notify.slack.channel` if a non-empty string, else `SLACK_USER_ID`
 *     env. Skipped when token or destination is absent.
 *   - **telegram** — token from `TELEGRAM_BOT_TOKEN`; chat id from
 *     `notify.telegram.chatId` if a non-empty string, else
 *     `TELEGRAM_CHAT_ID` env. Skipped when token or chat id is absent.
 *   - **discord** — webhook URL from `DISCORD_WEBHOOK_URL`. Skipped when
 *     the URL is absent. `webhookName` is recorded for future named-webhook
 *     routing but is not used to select a target today.
 *   - **desktop** — no credential gate; only the predicate.
 *
 * All four channels fire concurrently via `Promise.allSettled` so that a
 * failure in one never blocks the others. Never throws — errors land in
 * `~/.claude/notification-failures.log` via the per-channel send helpers.
 *
 * @internal — exported for tests; production callers use `sendNotifications`.
 */
export async function dispatchToChannels(
  title: string,
  message: string,
  notify: NotifySettings | undefined,
  predicate: (channel: ChannelBase) => boolean,
): Promise<void> {
  const tasks: Promise<void>[] = [];

  // ---- slack ----
  const slack = notify?.slack;
  if (slack !== undefined && predicate(slack)) {
    const token = process.env['SLACK_BOT_TOKEN'];
    // Prefer config routing; fall back to legacy env var. `null` in config
    // is a terminate-delegation leaf — treated as "no destination", which
    // silences the channel until the operator sets one.
    const destination =
      typeof slack.channel === 'string' && slack.channel !== ''
        ? slack.channel
        : process.env['SLACK_USER_ID'];
    if (token !== undefined && destination !== undefined && destination !== '') {
      tasks.push(sendSlack(title, message, token, destination));
    }
  }

  // ---- telegram ----
  const telegram = notify?.telegram;
  if (telegram !== undefined && predicate(telegram)) {
    const token = process.env['TELEGRAM_BOT_TOKEN'];
    const chatId =
      typeof telegram.chatId === 'string' && telegram.chatId !== ''
        ? telegram.chatId
        : process.env['TELEGRAM_CHAT_ID'];
    if (token !== undefined && chatId !== undefined && chatId !== '') {
      tasks.push(sendTelegram(title, message, token, chatId));
    }
  }

  // ---- discord ----
  // `webhookName` is persisted for future named-webhook routing; today we
  // only support the single env-var webhook URL, so the field is read for
  // schema completeness but not used to select a target.
  const discord = notify?.discord;
  if (discord !== undefined && predicate(discord)) {
    const webhookUrl = process.env['DISCORD_WEBHOOK_URL'];
    if (webhookUrl !== undefined && webhookUrl !== '') {
      tasks.push(sendDiscord(title, message, webhookUrl));
    }
  }

  // ---- desktop ----
  // No credential/env gate — desktop only needs the local notifier binary.
  // The predicate is the sole authorization.
  const desktop = notify?.desktop;
  if (desktop !== undefined && predicate(desktop)) {
    tasks.push(sendDesktop(title, message));
  }

  await Promise.allSettled(tasks);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Send a notification to every channel that is enabled for `event` in the
 * cascaded `notify.*` settings. `event` drives the per-channel event filter
 * documented at the top of this module.
 *
 * Channel gating matrix:
 *
 *   - **slack** — `notify.slack.enabled === true` AND `SLACK_BOT_TOKEN`
 *     present AND a destination (`notify.slack.channel` in config, else
 *     `SLACK_USER_ID` env).
 *   - **telegram** — `notify.telegram.enabled === true` AND
 *     `TELEGRAM_BOT_TOKEN` present AND a chat id (`notify.telegram.chatId`
 *     in config, else `TELEGRAM_CHAT_ID` env).
 *   - **discord** — `notify.discord.enabled === true` AND
 *     `DISCORD_WEBHOOK_URL` present. `notify.discord.webhookName` is
 *     recorded for future routing but today the single-webhook env var is
 *     the only dispatch target.
 *   - **desktop** — `notify.desktop.enabled === true`. No env gate.
 *
 * Returns immediately (without sending) when `message` is empty, when
 * `options.projectDir` is absent (no cascade anchor), or when cascade
 * resolution throws. Never throws — all errors land in
 * `~/.claude/notification-failures.log`.
 */
export async function sendNotifications(
  title: string,
  message: string,
  event: NotifyEvent,
  options?: NotifyOptions,
): Promise<void> {
  if (message.trim() === '') return;

  const projectDir = options?.projectDir;
  const sessionId = options?.sessionId;

  // Without a repo root the cascade has no anchor — every channel defaults
  // to silent rather than dispatching under unknown config. Matches the
  // Pass-3 safe-silent stance.
  if (projectDir === undefined) return;

  let notify: NotifySettings | undefined;
  try {
    const resolved = resolveSettings({
      repoRoot: projectDir,
      ...(sessionId !== undefined ? { sessionId } : {}),
    });
    notify = resolved.notify;
  } catch {
    // Malformed settings.json must not crash the notification pipeline.
    return;
  }

  await dispatchToChannels(
    title,
    message,
    notify,
    (channel) => channel.enabled === true && channelMatchesEvent(channel.events, event),
  );
}

// ---------------------------------------------------------------------------
// Hook-side dispatch — dispatchHookNotify
// ---------------------------------------------------------------------------

/**
 * Fields the hook message templates may consult on the hook stdin
 * payload. All optional — `dispatchHookNotify` defaults missing fields to
 * `'unknown'` rather than throwing. Mirrors the typed payload shapes in
 * `commands/notify.ts` (`AttentionPayload`, `CompletionPayload`,
 * `SessionPayload`, `SubagentPayload`) but unioned into a single shape so
 * the renderer reads any field it needs without re-narrowing.
 */
interface HookPayloadFields {
  readonly sessionId: string;
  readonly cwd: string;
  readonly agentType: string;
  readonly notificationType: string;
  readonly source: string;
  readonly stopHookActive: boolean | string | undefined;
}

function projectName(cwd: string): string {
  // Mirror `commands/notify.ts::projectName` — basename of cwd or 'unknown'.
  if (cwd === '' || cwd === 'unknown') return 'unknown';
  const trimmed = cwd.replace(/[/\\]+$/, '');
  const idx = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
  return idx === -1 ? trimmed : trimmed.slice(idx + 1);
}

function sessionPrefix(sessionId: string): string {
  return sessionId.slice(0, 8);
}

/**
 * Defensively extract the fields hook message templates may consult from
 * an `unknown` hook payload. Each field defaults to `'unknown'` if missing
 * or wrongly typed; `stopHookActive` keeps its possibly-string shape because
 * the loop guard distinguishes `true` from `'true'`.
 */
function extractPayloadFields(payload: unknown): HookPayloadFields {
  const obj: Record<string, unknown> = typeof payload === 'object' && payload !== null
    ? (payload as Record<string, unknown>)
    : {};

  const sessionIdRaw = obj['session_id'];
  const cwdRaw = obj['cwd'];
  const agentTypeRaw = obj['agent_type'];
  const notificationTypeRaw = obj['notification_type'];
  const sourceRaw = obj['source'];
  const stopHookActiveRaw = obj['stop_hook_active'];

  const fields: HookPayloadFields = {
    sessionId: typeof sessionIdRaw === 'string' && sessionIdRaw !== '' ? sessionIdRaw : 'unknown',
    cwd: typeof cwdRaw === 'string' && cwdRaw !== '' ? cwdRaw : 'unknown',
    agentType: typeof agentTypeRaw === 'string' && agentTypeRaw !== '' ? agentTypeRaw : 'unknown',
    notificationType:
      typeof notificationTypeRaw === 'string' && notificationTypeRaw !== ''
        ? notificationTypeRaw
        : 'unknown',
    source: typeof sourceRaw === 'string' && sourceRaw !== '' ? sourceRaw : 'unknown',
    stopHookActive:
      typeof stopHookActiveRaw === 'boolean' || typeof stopHookActiveRaw === 'string'
        ? stopHookActiveRaw
        : undefined,
  };
  return fields;
}

/**
 * Render a hook event into a `(title, message)` pair, or `null` when the
 * event is a no-dispatch state (today, the only case is the `Stop`
 * loop guard returning `null` when `stop_hook_active` is truthy).
 *
 * Issue #219 extended this renderer to cover all 28 {@link HookTrigger}
 * values; the dispatch decision (which events actually fire through the
 * generic stub) is owned downstream by `STUB_DISPATCH_EVENTS` in
 * `commands/hook/_stub.ts` plus the per-channel `notify.<channel>.triggers`
 * filter applied by {@link dispatchHookNotify}.
 */
function renderHookMessage(
  eventName: HookTrigger,
  fields: HookPayloadFields,
): { readonly title: string; readonly message: string } | null {
  const project = projectName(fields.cwd);
  const prefix = sessionPrefix(fields.sessionId);

  switch (eventName) {
    case 'Stop': {
      // CRITICAL: loop-guard. `stop_hook_active` arrives as either boolean
      // `true` or the string `'true'` depending on hook serialiser; mirror
      // `commands/notify.ts::runNotifyCompletion`.
      const active = fields.stopHookActive;
      if (active === true || active === 'true') return null;
      return {
        title: 'Task Complete',
        message: `Session \`${prefix}\` finished in ${project}.`,
      };
    }
    case 'SubagentStop':
      return {
        title: 'Subagent Done',
        message: `Subagent (${fields.agentType}) finished in ${project}. Session \`${prefix}\`.`,
      };
    case 'SessionStart':
      return {
        title: 'Session Started',
        message: `Session started (${fields.source}) in ${project}. Session \`${prefix}\`.`,
      };
    case 'SessionEnd':
      return {
        title: 'Session Ended',
        message: `Session ended in ${project}. Session \`${prefix}\`.`,
      };
    case 'UserPromptSubmit':
      return {
        title: 'Prompt Submitted',
        message: `User prompt in ${project}. Session \`${prefix}\`.`,
      };
    case 'Notification': {
      // Mirror commands/notify.ts:188-224 — switch on notification_type.
      let body: string;
      switch (fields.notificationType) {
        case 'permission_prompt':
          body = `Waiting for permission approval in ${project}.`;
          break;
        case 'idle_prompt':
          body = `Session idle — waiting for your input in ${project}.`;
          break;
        case 'elicitation_dialog':
          body = `MCP server needs your input in ${project}.`;
          break;
        default:
          body = `Needs attention in ${project} (${fields.notificationType}).`;
          break;
      }
      return {
        title: 'Attention Needed',
        message: `${body} Session \`${prefix}\`.`,
      };
    }
    case 'PreCompact':
      return {
        title: 'Compacting',
        message: `Session \`${prefix}\` compacting in ${project}.`,
      };
    // ---- Tier A — rich-template events dispatched by the generic stub
    //      (see `commands/hook/_stub.ts::STUB_DISPATCH_EVENTS`).
    case 'StopFailure':
      return {
        title: 'Task Failed',
        message: `Session \`${prefix}\` failed in ${project}.`,
      };
    case 'PermissionRequest':
      return {
        title: 'Permission Requested',
        message: `Awaiting permission in ${project}. Session \`${prefix}\`.`,
      };
    case 'PermissionDenied':
      return {
        title: 'Permission Denied',
        message: `Permission denied in ${project}. Session \`${prefix}\`.`,
      };
    case 'SubagentStart':
      return {
        title: 'Subagent Started',
        message: `Subagent (${fields.agentType}) started in ${project}. Session \`${prefix}\`.`,
      };
    case 'TaskCreated':
      return {
        title: 'Task Created',
        message: `Task created in ${project}. Session \`${prefix}\`.`,
      };
    case 'TaskCompleted':
      return {
        title: 'Task Completed',
        message: `Task completed in ${project}. Session \`${prefix}\`.`,
      };
    case 'TeammateIdle':
      return {
        title: 'Teammate Idle',
        message: `Teammate idle in ${project}. Session \`${prefix}\`.`,
      };
    case 'PostCompact':
      return {
        title: 'Compact Done',
        message: `Session \`${prefix}\` compaction complete in ${project}.`,
      };
    case 'WorktreeCreate':
      return {
        title: 'Worktree Created',
        message: `Worktree created in ${project}. Session \`${prefix}\`.`,
      };
    case 'WorktreeRemove':
      return {
        title: 'Worktree Removed',
        message: `Worktree removed in ${project}. Session \`${prefix}\`.`,
      };
    case 'ConfigChange':
      return {
        title: 'Config Changed',
        message: `Config changed in ${project}. Session \`${prefix}\`.`,
      };
    // ---- Tier B — templates exist but the generic stub does NOT dispatch
    //      these by default (high-frequency / flooding risk). A bespoke
    //      handler can call `dispatchHookNotify` directly to opt them in.
    case 'UserPromptExpansion':
      return {
        title: 'Prompt Expanded',
        message: `User prompt expanded in ${project}. Session \`${prefix}\`.`,
      };
    case 'PreToolUse':
      return {
        title: 'Tool Use Started',
        message: `Tool use started in ${project}. Session \`${prefix}\`.`,
      };
    case 'PostToolUse':
      return {
        title: 'Tool Use Done',
        message: `Tool use done in ${project}. Session \`${prefix}\`.`,
      };
    case 'PostToolUseFailure':
      return {
        title: 'Tool Use Failed',
        message: `Tool use failed in ${project}. Session \`${prefix}\`.`,
      };
    case 'PostToolBatch':
      return {
        title: 'Tool Batch Done',
        message: `Tool batch done in ${project}. Session \`${prefix}\`.`,
      };
    case 'FileChanged':
      return {
        title: 'File Changed',
        message: `File changed in ${project}. Session \`${prefix}\`.`,
      };
    case 'CwdChanged':
      return {
        title: 'Directory Changed',
        message: `Working directory changed in ${project}. Session \`${prefix}\`.`,
      };
    case 'InstructionsLoaded':
      return {
        title: 'Instructions Loaded',
        message: `Instructions loaded in ${project}. Session \`${prefix}\`.`,
      };
    case 'Elicitation':
      return {
        title: 'Input Requested',
        message: `MCP elicitation requested in ${project}. Session \`${prefix}\`.`,
      };
    case 'ElicitationResult':
      return {
        title: 'Input Received',
        message: `MCP elicitation result in ${project}. Session \`${prefix}\`.`,
      };
  }
}

/**
 * Dispatch a Claude Code hook event to every channel whose `triggers`
 * filter matches `eventName`. Independent of {@link sendNotifications} —
 * this entry point is for hook callers and consults
 * `notify.<channel>.triggers`, never `events`.
 *
 * Filter contract (locked Round-3 §F4):
 *
 *   | `enabled` | `triggers` field   | Behavior            |
 *   |-----------|--------------------|---------------------|
 *   | `false`   | (any)              | skip                |
 *   | `true`    | absent             | fire                |
 *   | `true`    | `[]`               | skip                |
 *   | `true`    | non-empty list     | fire iff `eventName ∈ triggers` |
 *
 * All 28 {@link HookTrigger} values render a rich message body via
 * {@link renderHookMessage} (issue #219 closed the Phase-2 gap). The
 * dispatch decision for the generic stub is enforced at
 * `commands/hook/_stub.ts::STUB_DISPATCH_EVENTS`; bespoke handlers can
 * call this entry point directly to opt their event into dispatch
 * regardless of the stub policy. The `Stop` loop-guard branch returns
 * `null` from the renderer when `stop_hook_active` is truthy, which still
 * shortcuts the dispatch path before `dispatchToChannels`.
 *
 * **Hook contract:** never propagates a non-zero exit. The whole body is
 * wrapped in a top-level try/catch that swallows every throw silently —
 * including a thrown `resolveSettings` on malformed `settings.json`. The
 * caller (a hook handler) already has its own catch boundary and depends
 * on this function being a no-op on any internal failure.
 *
 * @param payload     The hook stdin JSON payload, narrowed defensively.
 * @param eventName   The {@link HookTrigger} that fired.
 * @param options     `{ sessionId, projectDir }` — `projectDir` absent
 *                    causes a silent no-op (no `resolveSettings` call).
 */
export async function dispatchHookNotify(
  payload: unknown,
  eventName: HookTrigger,
  options: NotifyOptions,
): Promise<void> {
  try {
    // Mirror sendNotifications: without a repo root the cascade has no
    // anchor — return silently before touching the cascade.
    const projectDir = options.projectDir;
    if (projectDir === undefined) return;

    const fields = extractPayloadFields(payload);
    const rendered = renderHookMessage(eventName, fields);
    // The `Stop` loop-guard returns null when `stop_hook_active` is
    // truthy; ending the dispatch silently before resolving settings.
    if (rendered === null) return;

    const sessionId = options.sessionId;
    let notify: NotifySettings | undefined;
    try {
      const resolved = resolveSettings({
        repoRoot: projectDir,
        ...(sessionId !== undefined ? { sessionId } : {}),
      });
      notify = resolved.notify;
    } catch {
      // Malformed settings.json must not crash the hook chain.
      return;
    }

    await dispatchToChannels(
      rendered.title,
      rendered.message,
      notify,
      (channel) => channel.enabled === true && triggersMatch(channel.triggers, eventName),
    );
  } catch {
    // Top-level containment — hook contract guarantees a no-op on any
    // internal failure. The caller (a hook handler) already has its own
    // try/catch boundary; no stderr write here, since duplicating the
    // failure log would noise up the hook chain.
  }
}
