/**
 * Unit tests for `lib/notify.ts` — the per-channel dispatcher + the inverted
 * `events` filter helper.
 *
 * Two layers:
 *
 *   1. `channelMatchesEvent` — pure function over the `events` array.
 *      Exhaustively cover the three-case semantic from ideation §3.2:
 *      absent → all, `[]` → none, `[...]` → filtered.
 *
 *   2. `sendNotifications` — integration with the cascade + per-channel
 *      gating. Each test writes a minimal `.gobbi/settings.json` to a tmp
 *      dir, stubs `globalThis.fetch` with a `mock()` that records every
 *      outbound URL, and asserts which channels fired based on the settings
 *      alone. Desktop is exercised by enabling it and asserting the
 *      function returns without throwing — the `execFile` side-effect is
 *      out of process and the test only needs to prove the enable gate
 *      runs and no HTTP side-channel fires.
 *
 * Test scope per Wave D.1b briefing:
 *
 *   - Channel skipped when `enabled: false` or absent.
 *   - Channel fires when `enabled: true` and `events` field is absent (fires-all).
 *   - Channel fires only on listed events when `events` is non-empty.
 *   - Channel silent when `events: []`.
 *   - `triggers` field is ignored (schema-only — presence does not cause dispatch).
 *   - Credentials read from env vars when a channel is enabled.
 *   - Desktop channel gates entirely on config, not env.
 *
 * The tests manipulate `process.env` around each case and restore in
 * `afterEach` — no session-id env leakage, no global fetch pollution.
 */

import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  channelMatchesEvent,
  sendNotifications,
  type NotifyOptions,
} from '../notify.js';
import type { NotifyEvent, Settings } from '../settings.js';

// ===========================================================================
// channelMatchesEvent — pure function
// ===========================================================================

describe('channelMatchesEvent', () => {
  test('field absent → fires on ALL events', () => {
    expect(channelMatchesEvent(undefined, 'workflow.start')).toBe(true);
    expect(channelMatchesEvent(undefined, 'error')).toBe(true);
    expect(channelMatchesEvent(undefined, 'subagent.complete')).toBe(true);
  });

  test('empty array → fires on NO events', () => {
    expect(channelMatchesEvent([], 'workflow.start')).toBe(false);
    expect(channelMatchesEvent([], 'error')).toBe(false);
  });

  test('non-empty array → fires only when event is listed', () => {
    const events: readonly NotifyEvent[] = ['workflow.start', 'error'];
    expect(channelMatchesEvent(events, 'workflow.start')).toBe(true);
    expect(channelMatchesEvent(events, 'error')).toBe(true);
    expect(channelMatchesEvent(events, 'subagent.complete')).toBe(false);
    expect(channelMatchesEvent(events, 'workflow.complete')).toBe(false);
  });

  test('singleton list', () => {
    expect(channelMatchesEvent(['error'], 'error')).toBe(true);
    expect(channelMatchesEvent(['error'], 'workflow.start')).toBe(false);
  });
});

// ===========================================================================
// sendNotifications — integration
// ===========================================================================

// Representative env-var keys the dispatcher reads. Stashing them into a
// dedicated list keeps the per-test env scrub honest: any new env var must
// be added here or the scrub leaks across tests.
const MANAGED_ENV_KEYS = [
  'SLACK_BOT_TOKEN',
  'SLACK_USER_ID',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'DISCORD_WEBHOOK_URL',
  'NOTIFY_DESKTOP',
] as const;

interface FetchCall {
  readonly url: string;
  readonly init: RequestInit | undefined;
}

let tmpRoot: string;
let calls: FetchCall[];
let savedFetch: typeof globalThis.fetch;
const savedEnv: Partial<Record<(typeof MANAGED_ENV_KEYS)[number], string>> = {};

/**
 * Install a `fetch` mock that records every invocation and returns a 200
 * OK JSON response shaped like a Slack success body. Discord and Telegram
 * both accept non-2xx → failure-log; a uniform 200 keeps the happy path
 * simple and failures testable via a separate mock installation.
 */
function installFetchMock(): void {
  calls = [];
  const fake = mock(async (url: string | URL | Request, init?: RequestInit) => {
    const urlStr = typeof url === 'string' ? url : url instanceof URL ? url.toString() : url.url;
    calls.push({ url: urlStr, init });
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });
  globalThis.fetch = fake as unknown as typeof globalThis.fetch;
}

/**
 * Write a minimal `.gobbi/settings.json` at the workspace tier of `tmpRoot`.
 * Every test in this file operates at workspace scope — the session tier
 * is tested separately via the `sessionId` param.
 *
 * The helper auto-injects the fresh-install `projects` block when a test
 * fixture omits it — `projects` is required by the unified schema
 * (additive from gobbi-memory Pass 2), but every notify fixture in this
 * file is testing NOTIFY behaviour, not projects resolution, so defaulting
 * here keeps per-test noise down. Tests that want to exercise a specific
 * `projects` shape can still supply one explicitly.
 */
function writeWorkspaceSettings(settings: Omit<Settings, 'projects'> & Partial<Pick<Settings, 'projects'>>): void {
  const dir = join(tmpRoot, '.gobbi');
  mkdirSync(dir, { recursive: true });
  const hydrated: Settings = {
    ...settings,
    projects: settings.projects ?? { active: null, known: [] },
  };
  writeFileSync(join(dir, 'settings.json'), `${JSON.stringify(hydrated, null, 2)}\n`, 'utf8');
}

function baseOptions(): NotifyOptions {
  return { projectDir: tmpRoot };
}

beforeEach(() => {
  tmpRoot = mkdtempSync(join(tmpdir(), 'notify-test-'));
  savedFetch = globalThis.fetch;
  for (const key of MANAGED_ENV_KEYS) {
    const current = process.env[key];
    if (current !== undefined) {
      savedEnv[key] = current;
    } else {
      delete savedEnv[key];
    }
    delete process.env[key];
  }
  installFetchMock();
});

afterEach(() => {
  rmSync(tmpRoot, { recursive: true, force: true });
  globalThis.fetch = savedFetch;
  for (const key of MANAGED_ENV_KEYS) {
    const prev = savedEnv[key];
    if (prev === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = prev;
    }
  }
});

// ---------------------------------------------------------------------------
// Bailouts — no dispatch when preconditions fail
// ---------------------------------------------------------------------------

describe('sendNotifications — bailouts', () => {
  test('empty message → no fetch, no throw', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: true } },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('Title', '   ', 'error', baseOptions());
    expect(calls.length).toBe(0);
  });

  test('missing projectDir → no fetch, no throw', async () => {
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('Title', 'body', 'error', {});
    expect(calls.length).toBe(0);
  });

  test('malformed settings.json → no fetch, no throw', async () => {
    const dir = join(tmpRoot, '.gobbi');
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'settings.json'), '{ this is not json', 'utf8');
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('Title', 'body', 'error', baseOptions());
    expect(calls.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Enabled gate
// ---------------------------------------------------------------------------

describe('sendNotifications — enabled gate', () => {
  test('channel skipped when enabled: false', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: false } },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(0);
  });

  test('channel skipped when notify section absent', async () => {
    writeWorkspaceSettings({ schemaVersion: 1 });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('T', 'm', 'error', baseOptions());
    // DEFAULTS seed every channel to `enabled: false, events: []` — even with
    // a sparse settings.json the cascade resolves to all-disabled. Zero calls.
    expect(calls.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// events filter
// ---------------------------------------------------------------------------

describe('sendNotifications — events filter', () => {
  test('channelMatchesEvent on an absent events field fires for every NotifyEvent', () => {
    // The "events absent → fire all" semantic is validated at the helper
    // layer. Via the full cascade it is unreachable today: DEFAULTS seeds
    // `events: []` for every channel, and `deepMerge` does not erase a
    // base key the overlay omits. Keeping the assertion at the helper
    // layer documents the semantic without encoding an impossible disk
    // shape into a test fixture.
    expect(channelMatchesEvent(undefined, 'error')).toBe(true);
    expect(channelMatchesEvent(undefined, 'workflow.start')).toBe(true);
  });

  test('events: [] → channel silent', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: true, events: [] } },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(0);
  });

  test('events: [listed] → fires on listed event only', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: true, events: ['error', 'workflow.start'] } },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(1);

    calls.length = 0;
    await sendNotifications('T', 'm', 'subagent.complete', baseOptions());
    expect(calls.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// triggers field — schema-only
// ---------------------------------------------------------------------------

describe('sendNotifications — triggers ignored', () => {
  test('triggers presence does NOT cause dispatch when events: [] silences', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: {
        slack: {
          enabled: true,
          events: [],
          // triggers is schema-only — must not override the events silencer.
          triggers: ['Stop', 'SessionEnd'],
        },
      },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('T', 'm', 'workflow.complete', baseOptions());
    expect(calls.length).toBe(0);
  });

  test('triggers is ignored when deciding whether to dispatch', async () => {
    // Channel has `events` explicitly listed — the filter passes for
    // `step.start`. The `triggers` field names a Claude Code hook event,
    // which is unrelated to `step.start`; the dispatcher must not consult
    // it (schema-only until the hook-registration Pass lands). If the
    // dispatcher wrongly treated triggers as a second gate, the call
    // would still be silent because `'step.start'` is not a HookTrigger.
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: {
        slack: {
          enabled: true,
          events: ['step.start'],
          triggers: ['PreToolUse'],
        },
      },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('T', 'm', 'step.start', baseOptions());
    expect(calls.length).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Credentials
// ---------------------------------------------------------------------------

describe('sendNotifications — credentials', () => {
  // Fixture note: DEFAULTS seed `events: []` on every channel (silent
  // until the user opts in). Every test that expects a channel to fire
  // MUST override `events` with a non-empty list; `deepMerge` preserves
  // DEFAULTS keys the overlay omits, so a missing `events` overlay
  // resolves to `[]` and silences the channel.
  test('slack fires when enabled and token + destination present', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: true, events: ['error'] } },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('Title', 'body', 'error', baseOptions());
    expect(calls.length).toBe(1);
    const call = calls[0];
    expect(call?.url).toBe('https://slack.com/api/chat.postMessage');
    const headers = call?.init?.headers as Record<string, string> | undefined;
    expect(headers?.['Authorization']).toBe('Bearer xoxb-token');
  });

  test('slack silent when token missing even though enabled', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: true, events: ['error'] } },
    });
    process.env['SLACK_USER_ID'] = 'U123';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(0);
  });

  test('slack silent when destination missing (no config channel, no env user id)', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: true, events: ['error'] } },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(0);
  });

  test('slack routes to config channel when set, ignoring env user id', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { slack: { enabled: true, events: ['error'], channel: 'C-CONFIG' } },
    });
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U-ENV';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(1);
    const body = calls[0]?.init?.body;
    const parsed = JSON.parse(typeof body === 'string' ? body : '{}') as Record<string, unknown>;
    expect(parsed['channel']).toBe('C-CONFIG');
  });

  test('telegram fires when enabled and credentials present', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { telegram: { enabled: true, events: ['error'] } },
    });
    process.env['TELEGRAM_BOT_TOKEN'] = 'tg-token';
    process.env['TELEGRAM_CHAT_ID'] = '-100';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(1);
    expect(calls[0]?.url).toBe('https://api.telegram.org/bottg-token/sendMessage');
  });

  test('telegram routes to config chatId when set', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { telegram: { enabled: true, events: ['error'], chatId: '-CONFIG' } },
    });
    process.env['TELEGRAM_BOT_TOKEN'] = 'tg-token';
    process.env['TELEGRAM_CHAT_ID'] = '-ENV';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(1);
    const body = calls[0]?.init?.body;
    const parsed = JSON.parse(typeof body === 'string' ? body : '{}') as Record<string, unknown>;
    expect(parsed['chat_id']).toBe('-CONFIG');
  });

  test('discord fires when enabled and webhook URL env present', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { discord: { enabled: true, events: ['error'] } },
    });
    process.env['DISCORD_WEBHOOK_URL'] = 'https://discord.com/api/webhooks/fake';

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(1);
    expect(calls[0]?.url).toBe('https://discord.com/api/webhooks/fake');
  });

  test('discord silent when webhook URL missing even though enabled', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { discord: { enabled: true, events: ['error'] } },
    });

    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Desktop — config-gated, no env
// ---------------------------------------------------------------------------

describe('sendNotifications — desktop', () => {
  test('desktop fires when notify.desktop.enabled: true regardless of env', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { desktop: { enabled: true, events: ['error'] } },
    });
    // Legacy NOTIFY_DESKTOP env var is NOT set — proves the config gate stands alone.
    // The actual `execFile` side-effect is out-of-process; assert the call
    // returns cleanly and no HTTP fetch fires.
    await expect(sendNotifications('T', 'm', 'error', baseOptions())).resolves.toBeUndefined();
    expect(calls.length).toBe(0);
  });

  test('desktop does NOT fire when enabled: false, even if legacy env is "true"', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: { desktop: { enabled: false, events: ['error'] } },
    });
    // Legacy env var used to gate desktop; the new dispatcher must ignore it.
    // Spying on the underlying execFile would require DI; the observable
    // contract is "no side effects visible to the caller, no HTTP fetch",
    // which is what this test asserts.
    process.env['NOTIFY_DESKTOP'] = 'true';

    await expect(sendNotifications('T', 'm', 'error', baseOptions())).resolves.toBeUndefined();
    expect(calls.length).toBe(0);
  });

  test('desktop silent when events: [] (filter still applies — DEFAULTS behavior)', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      // Explicit `events: []` matches the DEFAULTS silencer but makes the
      // intent visible in the fixture.
      notify: { desktop: { enabled: true, events: [] } },
    });

    await expect(sendNotifications('T', 'm', 'error', baseOptions())).resolves.toBeUndefined();
    expect(calls.length).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Multi-channel
// ---------------------------------------------------------------------------

describe('sendNotifications — multi-channel', () => {
  test('independent channels fire independently based on their own gates', async () => {
    writeWorkspaceSettings({
      schemaVersion: 1,
      notify: {
        slack: { enabled: true, events: ['error'] },
        telegram: { enabled: true, events: ['workflow.complete'] },
        discord: { enabled: false },
        desktop: { enabled: false },
      },
    });
    process.env['SLACK_BOT_TOKEN'] = 'slack-token';
    process.env['SLACK_USER_ID'] = 'U1';
    process.env['TELEGRAM_BOT_TOKEN'] = 'tg-token';
    process.env['TELEGRAM_CHAT_ID'] = 'chat1';
    process.env['DISCORD_WEBHOOK_URL'] = 'https://discord.example/webhook';

    // error event: only slack (telegram filter misses, discord disabled)
    await sendNotifications('T', 'm', 'error', baseOptions());
    expect(calls.length).toBe(1);
    expect(calls[0]?.url).toBe('https://slack.com/api/chat.postMessage');

    calls.length = 0;
    // workflow.complete event: only telegram
    await sendNotifications('T', 'm', 'workflow.complete', baseOptions());
    expect(calls.length).toBe(1);
    expect(calls[0]?.url).toContain('api.telegram.org');
  });
});
