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
 * ## `triggers` is schema-only this Pass
 *
 * `notify.<channel>.triggers` (a `readonly HookTrigger[]`) is reserved in the
 * schema for future Claude Code hook-registration wiring. This dispatcher
 * does not read it — the hook-registration side wires triggers separately,
 * once that Pass lands. Leaving the field unread today means opting into a
 * trigger does not silently short-circuit the `events` filter.
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
import type { NotifyEvent, NotifySettings } from './settings.js';

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

  const tasks: Promise<void>[] = [];

  // ---- slack ----
  const slack = notify?.slack;
  if (slack?.enabled === true && channelMatchesEvent(slack.events, event)) {
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
  if (telegram?.enabled === true && channelMatchesEvent(telegram.events, event)) {
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
  if (discord?.enabled === true && channelMatchesEvent(discord.events, event)) {
    const webhookUrl = process.env['DISCORD_WEBHOOK_URL'];
    if (webhookUrl !== undefined && webhookUrl !== '') {
      tasks.push(sendDiscord(title, message, webhookUrl));
    }
  }

  // ---- desktop ----
  // No credential/env gate — desktop only needs the local notifier binary.
  // `notify.desktop.enabled === true` is the sole authorization.
  const desktop = notify?.desktop;
  if (desktop?.enabled === true && channelMatchesEvent(desktop.events, event)) {
    tasks.push(sendDesktop(title, message));
  }

  await Promise.allSettled(tasks);
}
