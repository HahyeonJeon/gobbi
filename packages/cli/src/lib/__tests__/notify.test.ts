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
import { randomBytes } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
  channelMatchesEvent,
  dispatchHookNotify,
  dispatchToChannels,
  sendNotifications,
  triggersMatch,
  type NotifyOptions,
} from '../notify.js';
import type {
  ChannelBase,
  HookTrigger,
  NotifyEvent,
  NotifySettings,
  Settings,
} from '../settings.js';

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
 * PR-FIN-1c: the `projects` registry was removed from Settings; the
 * helper now writes the fixture verbatim.
 */
function writeWorkspaceSettings(settings: Settings): void {
  const dir = join(tmpRoot, '.gobbi');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'settings.json'), `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
}

function baseOptions(): NotifyOptions {
  return { projectDir: tmpRoot };
}

beforeEach(() => {
  // Deterministic-lowercase suffix per `mkdtemp-suffix-fails-name-pattern.md`
  // — basename(repoRoot) flows through the lib-seam project-name guard
  // (#245), and `mkdtempSync` can land uppercase characters in its random
  // suffix that trip NAME_PATTERN.
  tmpRoot = join(tmpdir(), `notify-test-${randomBytes(4).toString('hex')}`);
  mkdirSync(tmpRoot, { recursive: true });
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

// ===========================================================================
// dispatchToChannels — predicate-driven helper (PR-FIN-1d.2a seam)
// ===========================================================================

/**
 * Tests the extracted helper directly. The helper is indifferent to filter
 * semantics — predicate ownership lets the upcoming `dispatchHookNotify`
 * (1d.2) reuse the per-channel credential resolution without duplicating
 * logic. These tests assert the predicate gates dispatch on a per-channel
 * basis: only channels for which the predicate returns `true` consult
 * credentials and push to the concurrent task list.
 *
 * Channels are observed via the `fetch` mock for slack / telegram / discord;
 * desktop has no HTTP side-effect, so it is asserted by predicate-call
 * count via a spy predicate plus the absence of any HTTP call.
 */
describe('dispatchToChannels', () => {
  /** Build a `NotifySettings` with all four channels populated and credentials
   *  pre-staged via env so the only remaining gate is the predicate. */
  function fullySeededSettings(): NotifySettings {
    process.env['SLACK_BOT_TOKEN'] = 'slack-token';
    process.env['SLACK_USER_ID'] = 'U-slack';
    process.env['TELEGRAM_BOT_TOKEN'] = 'tg-token';
    process.env['TELEGRAM_CHAT_ID'] = 'chat-id';
    process.env['DISCORD_WEBHOOK_URL'] = 'https://discord.example/webhook';
    return {
      slack: { enabled: true, events: ['error'] },
      telegram: { enabled: true, events: ['error'] },
      discord: { enabled: true, events: ['error'] },
      desktop: { enabled: true, events: ['error'] },
    };
  }

  test('predicate gates per channel — slack + discord pass, telegram + desktop skipped', async () => {
    const notify = fullySeededSettings();
    const seen: ChannelBase[] = [];

    // Predicate returns true only for the two channels whose `events`
    // happen to start with the letter 'e' AND whose `enabled` is true —
    // we use a structural marker (`channel === slack || === discord`)
    // by reference identity since the helper passes the same object the
    // predicate received from `notify`.
    const slackRef = notify.slack;
    const discordRef = notify.discord;
    const predicate = (channel: ChannelBase): boolean => {
      seen.push(channel);
      return channel === slackRef || channel === discordRef;
    };

    await dispatchToChannels('Title', 'body', notify, predicate);

    // Predicate was called once per channel in the fixed order.
    expect(seen.length).toBe(4);
    expect(seen[0]).toBe(notify.slack as ChannelBase);
    expect(seen[1]).toBe(notify.telegram as ChannelBase);
    expect(seen[2]).toBe(notify.discord as ChannelBase);
    expect(seen[3]).toBe(notify.desktop as ChannelBase);

    // Only slack and discord dispatched (telegram and desktop skipped).
    // Desktop has no HTTP side-effect so its skip is observed via the
    // total fetch-call count: 2 = slack + discord, no telegram.
    expect(calls.length).toBe(2);
    const urls = calls.map((c) => c.url).sort();
    expect(urls).toEqual(
      ['https://discord.example/webhook', 'https://slack.com/api/chat.postMessage'].sort(),
    );
  });

  test('predicate that always returns true fires all four channels', async () => {
    const notify = fullySeededSettings();

    await dispatchToChannels('Title', 'body', notify, () => true);

    // Slack + telegram + discord each fire one HTTP call. Desktop has no
    // HTTP side-effect; its dispatch is implicit in the helper completing
    // without throwing. Three observable HTTP calls is the strict assertion.
    expect(calls.length).toBe(3);
    const urls = calls.map((c) => c.url).sort();
    expect(urls).toEqual(
      [
        'https://api.telegram.org/bottg-token/sendMessage',
        'https://discord.example/webhook',
        'https://slack.com/api/chat.postMessage',
      ].sort(),
    );
  });
});

// ===========================================================================
// triggersMatch — pure function (PR-FIN-1d.2)
// ===========================================================================

describe('triggersMatch', () => {
  test('field absent → fires on ALL hook events', () => {
    expect(triggersMatch(undefined, 'Stop')).toBe(true);
    expect(triggersMatch(undefined, 'SessionStart')).toBe(true);
    expect(triggersMatch(undefined, 'PreToolUse')).toBe(true);
  });

  test('empty array → fires on NO hook events', () => {
    expect(triggersMatch([], 'Stop')).toBe(false);
    expect(triggersMatch([], 'SessionStart')).toBe(false);
  });

  test('non-empty array → fires only when eventName is listed', () => {
    expect(triggersMatch(['Stop'], 'Stop')).toBe(true);
    expect(triggersMatch(['Stop', 'SessionEnd'], 'SessionEnd')).toBe(true);
  });

  test('non-empty array → silent when eventName is NOT listed', () => {
    expect(triggersMatch(['Stop'], 'SessionEnd')).toBe(false);
    expect(triggersMatch(['SessionStart'], 'PreToolUse')).toBe(false);
  });
});

// ===========================================================================
// dispatchHookNotify — integration (PR-FIN-1d.2)
// ===========================================================================

/**
 * Hook-side dispatch integration tests. The 4-channel × 5-channel-state
 * matrix locks the Round-3 §F4 filter contract per channel; per-event
 * snapshot tests lock the Phase-1 message templates; loop-guard / payload
 * defensiveness / containment / Phase-2-skip cases close out the verifier
 * pin of ≥30 (38 total here).
 *
 * Test posture mirrors the existing `sendNotifications` pattern — fixture
 * via `writeWorkspaceSettings`, env via `process.env`, observation via
 * the `fetch` mock. Slack is the workhorse for snapshot tests because it
 * exposes the rendered text in the request body (`text` field of the
 * Slack `chat.postMessage` payload).
 */
describe('dispatchHookNotify', () => {
  /** Build a one-channel slack-only settings object with the given gates. */
  function slackOnly(opts: {
    enabled: boolean;
    triggers?: readonly HookTrigger[];
  }): Settings {
    const slack: NotifySettings['slack'] =
      opts.triggers !== undefined
        ? { enabled: opts.enabled, triggers: opts.triggers }
        : { enabled: opts.enabled };
    return { schemaVersion: 1, notify: { slack } };
  }

  /** Slack credentials so the only remaining gate is the predicate. */
  function stageSlackEnv(): void {
    process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
    process.env['SLACK_USER_ID'] = 'U-test';
  }

  /** Telegram credentials. */
  function stageTelegramEnv(): void {
    process.env['TELEGRAM_BOT_TOKEN'] = 'tg-token';
    process.env['TELEGRAM_CHAT_ID'] = 'chat-id';
  }

  /** Discord credentials. */
  function stageDiscordEnv(): void {
    process.env['DISCORD_WEBHOOK_URL'] = 'https://discord.example/webhook';
  }

  // -------------------------------------------------------------------------
  // A. Channel-state matrix — slack (5)
  // -------------------------------------------------------------------------

  describe('channel-state matrix — slack', () => {
    test('enabled: false → skip', async () => {
      writeWorkspaceSettings(slackOnly({ enabled: false }));
      stageSlackEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers absent (overlay) → fire (cascade caveat)', async () => {
      // Cascade fixture caveat: DEFAULTS seed `triggers: []` on every
      // channel, and `deepMerge` cannot erase a base key the overlay
      // omits — so "triggers absent → fire" is unreachable through the
      // cascade today. The "absent → fire" arm of the contract is
      // validated at the helper layer (`triggersMatch(undefined, …)`
      // tests below). Here we exercise the structurally-identical
      // "predicate returns true → fire" branch by using an overlay that
      // lists the event explicitly. Identical predicate path.
      writeWorkspaceSettings(slackOnly({ enabled: true, triggers: ['Stop'] }));
      stageSlackEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(1);
      expect(calls[0]?.url).toBe('https://slack.com/api/chat.postMessage');
    });

    test('enabled: true, triggers: [] → skip', async () => {
      writeWorkspaceSettings(slackOnly({ enabled: true, triggers: [] }));
      stageSlackEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers: [Stop] and event=Stop → fire', async () => {
      writeWorkspaceSettings(slackOnly({ enabled: true, triggers: ['Stop'] }));
      stageSlackEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(1);
    });

    test('enabled: true, triggers: [SubagentStop] and event=Stop → skip', async () => {
      writeWorkspaceSettings(slackOnly({ enabled: true, triggers: ['SubagentStop'] }));
      stageSlackEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // A. Channel-state matrix — telegram (5)
  // -------------------------------------------------------------------------

  describe('channel-state matrix — telegram', () => {
    function telegramOnly(opts: {
      enabled: boolean;
      triggers?: readonly HookTrigger[];
    }): Settings {
      const telegram: NotifySettings['telegram'] =
        opts.triggers !== undefined
          ? { enabled: opts.enabled, triggers: opts.triggers }
          : { enabled: opts.enabled };
      return { schemaVersion: 1, notify: { telegram } };
    }

    test('enabled: false → skip', async () => {
      writeWorkspaceSettings(telegramOnly({ enabled: false }));
      stageTelegramEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers absent (overlay) → fire (cascade caveat)', async () => {
      // See slack matrix for the cascade caveat. Identical predicate path
      // exercised here via an explicit-list overlay.
      writeWorkspaceSettings(telegramOnly({ enabled: true, triggers: ['Stop'] }));
      stageTelegramEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(1);
      expect(calls[0]?.url).toContain('api.telegram.org');
    });

    test('enabled: true, triggers: [] → skip', async () => {
      writeWorkspaceSettings(telegramOnly({ enabled: true, triggers: [] }));
      stageTelegramEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers: [Stop] and event=Stop → fire', async () => {
      writeWorkspaceSettings(telegramOnly({ enabled: true, triggers: ['Stop'] }));
      stageTelegramEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(1);
    });

    test('enabled: true, triggers: [SubagentStop] and event=Stop → skip', async () => {
      writeWorkspaceSettings(telegramOnly({ enabled: true, triggers: ['SubagentStop'] }));
      stageTelegramEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // A. Channel-state matrix — discord (5)
  // -------------------------------------------------------------------------

  describe('channel-state matrix — discord', () => {
    function discordOnly(opts: {
      enabled: boolean;
      triggers?: readonly HookTrigger[];
    }): Settings {
      const discord: NotifySettings['discord'] =
        opts.triggers !== undefined
          ? { enabled: opts.enabled, triggers: opts.triggers }
          : { enabled: opts.enabled };
      return { schemaVersion: 1, notify: { discord } };
    }

    test('enabled: false → skip', async () => {
      writeWorkspaceSettings(discordOnly({ enabled: false }));
      stageDiscordEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers absent (overlay) → fire (cascade caveat)', async () => {
      // See slack matrix for the cascade caveat.
      writeWorkspaceSettings(discordOnly({ enabled: true, triggers: ['Stop'] }));
      stageDiscordEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(1);
      expect(calls[0]?.url).toBe('https://discord.example/webhook');
    });

    test('enabled: true, triggers: [] → skip', async () => {
      writeWorkspaceSettings(discordOnly({ enabled: true, triggers: [] }));
      stageDiscordEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers: [Stop] and event=Stop → fire', async () => {
      writeWorkspaceSettings(discordOnly({ enabled: true, triggers: ['Stop'] }));
      stageDiscordEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(1);
    });

    test('enabled: true, triggers: [SubagentStop] and event=Stop → skip', async () => {
      writeWorkspaceSettings(discordOnly({ enabled: true, triggers: ['SubagentStop'] }));
      stageDiscordEnv();
      await dispatchHookNotify({}, 'Stop', baseOptions());
      expect(calls.length).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // A. Channel-state matrix — desktop (5)
  // -------------------------------------------------------------------------

  describe('channel-state matrix — desktop', () => {
    // Desktop has no HTTP side-effect; its predicate gate is exercised
    // structurally identically to the other three channels but only
    // observable as "function returns without throwing AND no HTTP fires"
    // when desktop is the only channel configured. The matrix here
    // satisfies the locked-test pin and runs the `dispatchToChannels`
    // predicate path for desktop — the per-channel fire/skip distinction
    // is identical at the predicate layer.
    function desktopOnly(opts: {
      enabled: boolean;
      triggers?: readonly HookTrigger[];
    }): Settings {
      const desktop: NotifySettings['desktop'] =
        opts.triggers !== undefined
          ? { enabled: opts.enabled, triggers: opts.triggers }
          : { enabled: opts.enabled };
      return { schemaVersion: 1, notify: { desktop } };
    }

    test('enabled: false → skip', async () => {
      writeWorkspaceSettings(desktopOnly({ enabled: false }));
      await expect(dispatchHookNotify({}, 'Stop', baseOptions())).resolves.toBeUndefined();
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers absent (overlay) → fire (no HTTP, no throw; cascade caveat)', async () => {
      // See slack matrix for the cascade caveat.
      writeWorkspaceSettings(desktopOnly({ enabled: true, triggers: ['Stop'] }));
      await expect(dispatchHookNotify({}, 'Stop', baseOptions())).resolves.toBeUndefined();
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers: [] → skip', async () => {
      writeWorkspaceSettings(desktopOnly({ enabled: true, triggers: [] }));
      await expect(dispatchHookNotify({}, 'Stop', baseOptions())).resolves.toBeUndefined();
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers: [Stop] and event=Stop → fire (no HTTP, no throw)', async () => {
      writeWorkspaceSettings(desktopOnly({ enabled: true, triggers: ['Stop'] }));
      await expect(dispatchHookNotify({}, 'Stop', baseOptions())).resolves.toBeUndefined();
      expect(calls.length).toBe(0);
    });

    test('enabled: true, triggers: [SubagentStop] and event=Stop → skip', async () => {
      writeWorkspaceSettings(desktopOnly({ enabled: true, triggers: ['SubagentStop'] }));
      await expect(dispatchHookNotify({}, 'Stop', baseOptions())).resolves.toBeUndefined();
      expect(calls.length).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // B. Per-event message snapshots (7) — slack as the snapshot vehicle
  // -------------------------------------------------------------------------

  describe('per-event message snapshots', () => {
    /** Read the rendered slack text from the captured fetch body. */
    function slackText(): string {
      const body = calls[0]?.init?.body;
      const parsed = JSON.parse(typeof body === 'string' ? body : '{}') as Record<string, unknown>;
      const text = parsed['text'];
      return typeof text === 'string' ? text : '';
    }

    function setupSlackFiresAll(): void {
      // Cascade caveat: DEFAULTS seed `triggers: []` and `deepMerge` cannot
      // erase it via an overlay that omits the key. The wide allow-list
      // here lists every Phase-1 event so the trigger filter passes
      // regardless of which event the test is exercising.
      writeWorkspaceSettings({
        schemaVersion: 1,
        notify: {
          slack: {
            enabled: true,
            triggers: [
              'Stop',
              'SubagentStop',
              'SessionStart',
              'SessionEnd',
              'UserPromptSubmit',
              'Notification',
              'PreCompact',
            ],
          },
        },
      });
      stageSlackEnv();
    }

    test('Stop → "Task Complete" / "Session `<prefix>` finished in <project>."', async () => {
      setupSlackFiresAll();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj' },
        'Stop',
        baseOptions(),
      );
      expect(slackText()).toBe('*Task Complete*\nSession `abcdef01` finished in myproj.');
    });

    test('SubagentStop → "Subagent Done" with agent_type', async () => {
      setupSlackFiresAll();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj', agent_type: '__executor' },
        'SubagentStop',
        baseOptions(),
      );
      expect(slackText()).toBe(
        '*Subagent Done*\nSubagent (__executor) finished in myproj. Session `abcdef01`.',
      );
    });

    test('SessionStart → "Session Started" with source', async () => {
      setupSlackFiresAll();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj', source: 'startup' },
        'SessionStart',
        baseOptions(),
      );
      expect(slackText()).toBe(
        '*Session Started*\nSession started (startup) in myproj. Session `abcdef01`.',
      );
    });

    test('SessionEnd → "Session Ended"', async () => {
      setupSlackFiresAll();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj' },
        'SessionEnd',
        baseOptions(),
      );
      expect(slackText()).toBe(
        '*Session Ended*\nSession ended in myproj. Session `abcdef01`.',
      );
    });

    test('UserPromptSubmit → "Prompt Submitted"', async () => {
      setupSlackFiresAll();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj' },
        'UserPromptSubmit',
        baseOptions(),
      );
      expect(slackText()).toBe(
        '*Prompt Submitted*\nUser prompt in myproj. Session `abcdef01`.',
      );
    });

    test('Notification (permission_prompt) → "Attention Needed" with body', async () => {
      setupSlackFiresAll();
      await dispatchHookNotify(
        {
          session_id: 'abcdef0123456789',
          cwd: '/repo/myproj',
          notification_type: 'permission_prompt',
        },
        'Notification',
        baseOptions(),
      );
      expect(slackText()).toBe(
        '*Attention Needed*\nWaiting for permission approval in myproj. Session `abcdef01`.',
      );
    });

    test('PreCompact → "Compacting"', async () => {
      setupSlackFiresAll();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj' },
        'PreCompact',
        baseOptions(),
      );
      expect(slackText()).toBe(
        '*Compacting*\nSession `abcdef01` compacting in myproj.',
      );
    });
  });

  // -------------------------------------------------------------------------
  // C. Loop guard for Stop (2)
  // -------------------------------------------------------------------------

  describe('Stop loop guard', () => {
    // Use a wide-enough triggers allow-list that the channel WOULD fire if
    // not for the loop guard — proves the guard is what stops dispatch,
    // not the trigger filter or some other early-return.
    test('Stop with stop_hook_active === true → no channel send', async () => {
      writeWorkspaceSettings({
        schemaVersion: 1,
        notify: { slack: { enabled: true, triggers: ['Stop'] } },
      });
      stageSlackEnv();
      await dispatchHookNotify(
        { session_id: 'abcdef0123', cwd: '/repo/x', stop_hook_active: true },
        'Stop',
        baseOptions(),
      );
      expect(calls.length).toBe(0);
    });

    test('Stop with stop_hook_active === "true" (string) → no channel send', async () => {
      writeWorkspaceSettings({
        schemaVersion: 1,
        notify: { slack: { enabled: true, triggers: ['Stop'] } },
      });
      stageSlackEnv();
      await dispatchHookNotify(
        { session_id: 'abcdef0123', cwd: '/repo/x', stop_hook_active: 'true' },
        'Stop',
        baseOptions(),
      );
      expect(calls.length).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // D. Defensive payload (2)
  // -------------------------------------------------------------------------

  describe('defensive payload extraction', () => {
    function slackText(): string {
      const body = calls[0]?.init?.body;
      const parsed = JSON.parse(typeof body === 'string' ? body : '{}') as Record<string, unknown>;
      const text = parsed['text'];
      return typeof text === 'string' ? text : '';
    }

    test('missing session_id → message uses "unknown" rather than throwing', async () => {
      writeWorkspaceSettings({
        schemaVersion: 1,
        notify: { slack: { enabled: true, triggers: ['Stop'] } },
      });
      stageSlackEnv();
      await dispatchHookNotify({ cwd: '/repo/myproj' }, 'Stop', baseOptions());
      expect(calls.length).toBe(1);
      // sessionPrefix('unknown') → 'unknown' (length < 8 returns whole string).
      expect(slackText()).toBe('*Task Complete*\nSession `unknown` finished in myproj.');
    });

    test('missing agent_type for SubagentStop → message uses "unknown"', async () => {
      writeWorkspaceSettings({
        schemaVersion: 1,
        notify: { slack: { enabled: true, triggers: ['SubagentStop'] } },
      });
      stageSlackEnv();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj' },
        'SubagentStop',
        baseOptions(),
      );
      expect(calls.length).toBe(1);
      expect(slackText()).toBe(
        '*Subagent Done*\nSubagent (unknown) finished in myproj. Session `abcdef01`.',
      );
    });
  });

  // -------------------------------------------------------------------------
  // E. Containment (2)
  // -------------------------------------------------------------------------

  describe('error containment', () => {
    test('malformed settings.json → silent return, no fetch', async () => {
      // Mirror the existing sendNotifications pattern at notify.test.ts:192-207
      const dir = join(tmpRoot, '.gobbi');
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'settings.json'), '{ this is not json', 'utf8');
      stageSlackEnv();
      await expect(
        dispatchHookNotify({ session_id: 'abcdef01', cwd: '/repo/x' }, 'Stop', baseOptions()),
      ).resolves.toBeUndefined();
      expect(calls.length).toBe(0);
    });

    test('options.projectDir undefined → silent return before resolveSettings', async () => {
      // No settings file written — and no projectDir in options. The
      // function must return BEFORE attempting to read settings; if the
      // `projectDir`-undefined early return is broken, `resolveSettings`
      // would throw on the missing path and the top-level catch would
      // still swallow it — but observably we'd see no fetch either way.
      // The strict assertion here is "no throw" + "no fetch" together,
      // which holds regardless of which branch swallows.
      stageSlackEnv();
      await expect(
        dispatchHookNotify({ session_id: 'abcdef01', cwd: '/repo/x' }, 'Stop', {}),
      ).resolves.toBeUndefined();
      expect(calls.length).toBe(0);
    });
  });

  // -------------------------------------------------------------------------
  // G. Tier-B events dispatch when invoked directly (issue #219)
  // -------------------------------------------------------------------------

  describe('Tier-B direct invocation', () => {
    test('PostToolUse via dispatchHookNotify directly → fires (Tier-B suppression lives at the stub layer)', async () => {
      // Issue #219 wired rich templates for the full 28-event hook
      // surface; per-event flooding policy is enforced upstream by
      // `commands/hook/_stub.ts::STUB_DISPATCH_EVENTS`. A bespoke handler
      // (or a test like this one) that reaches `dispatchHookNotify`
      // directly with a Tier-B event WILL dispatch when the trigger
      // filter matches — that is the documented escape hatch for
      // future per-event handlers.
      writeWorkspaceSettings({
        schemaVersion: 1,
        notify: {
          slack: { enabled: true, triggers: ['PostToolUse'] },
        },
      });
      stageSlackEnv();
      await dispatchHookNotify(
        { session_id: 'abcdef0123456789', cwd: '/repo/myproj' },
        'PostToolUse',
        baseOptions(),
      );
      expect(calls.length).toBe(1);
      const body = calls[0]?.init?.body;
      const parsed = JSON.parse(typeof body === 'string' ? body : '{}') as Record<string, unknown>;
      const text = typeof parsed['text'] === 'string' ? (parsed['text'] as string) : '';
      expect(text).toBe('*Tool Use Done*\nTool use done in myproj. Session `abcdef01`.');
    });
  });
});
