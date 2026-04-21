/**
 * Notification dispatch for gobbi — sends messages to Slack, Telegram, and Desktop.
 *
 * Channel gating is controlled by env vars (credentials) AND per-session config.db
 * config (notify.slack / notify.telegram). All channels fire concurrently via
 * Promise.allSettled so a failure in one never blocks the others.
 *
 * This module replaces the notify-send.sh shell script.
 */

import { execFile } from 'node:child_process';
import { mkdir, appendFile } from 'node:fs/promises';
import { join } from 'node:path';
import { resolveSettings } from './settings-io.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface NotifyOptions {
  sessionId?: string;
  projectDir?: string;
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

async function sendSlack(title: string, message: string, token: string, userId: string): Promise<void> {
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
      body: JSON.stringify({ channel: userId, text }),
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

async function sendTelegram(title: string, message: string, token: string, chatId: string): Promise<void> {
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
 * Send a notification to all configured channels.
 *
 * Channel gating:
 * - Slack: requires config.db session notify.slack === true AND SLACK_BOT_TOKEN + SLACK_USER_ID
 * - Telegram: requires config.db session notify.telegram === true AND TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
 * - Desktop: requires NOTIFY_DESKTOP === "true"
 *
 * Returns immediately (without sending) when message is empty.
 * Never throws — all errors are logged to ~/.claude/notification-failures.log.
 */
export async function sendNotifications(
  title: string,
  message: string,
  options?: NotifyOptions,
): Promise<void> {
  if (message.trim() === '') return;

  // Read env vars
  const slackToken = process.env['SLACK_BOT_TOKEN'];
  const slackUserId = process.env['SLACK_USER_ID'];
  const telegramToken = process.env['TELEGRAM_BOT_TOKEN'];
  const telegramChatId = process.env['TELEGRAM_CHAT_ID'];
  const notifyDesktop = process.env['NOTIFY_DESKTOP'];

  // Read cascade-resolved notify preferences. Default safe-silent on any
  // resolution failure so a malformed settings.json does not crash the
  // notification pipeline. Wave D.1b replaces this stub with full per-channel
  // dispatch keyed on the inverted events semantic (absent = all; [] = none;
  // [...] = exactly listed).
  let allowSlack = false;
  let allowTelegram = false;

  const projectDir = options?.projectDir;
  const sessionId = options?.sessionId;

  if (projectDir !== undefined) {
    try {
      const resolved = resolveSettings({
        repoRoot: projectDir,
        ...(sessionId !== undefined ? { sessionId } : {}),
      });
      allowSlack = resolved.notify?.slack?.enabled === true;
      allowTelegram = resolved.notify?.telegram?.enabled === true;
    } catch {
      // Silently skip — notification permission read failure must not crash
    }
  }

  // Build list of active channel promises
  const tasks: Promise<void>[] = [];

  if (allowSlack && slackToken !== undefined && slackUserId !== undefined) {
    tasks.push(sendSlack(title, message, slackToken, slackUserId));
  }

  if (allowTelegram && telegramToken !== undefined && telegramChatId !== undefined) {
    tasks.push(sendTelegram(title, message, telegramToken, telegramChatId));
  }

  if (notifyDesktop === 'true') {
    tasks.push(sendDesktop(title, message));
  }

  await Promise.allSettled(tasks);
}
