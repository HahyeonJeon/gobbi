/**
 * Per-event snapshot coverage for `lib/notify.ts::renderHookMessage` —
 * issue #219 (Phase 2 of PR-FIN-1d) wired rich-message templates for all
 * 28 {@link HookTrigger} values. This file locks the rendered text for
 * each of the 21 newly-wired events:
 *
 *   - Tier A (11) — events that the generic stub dispatches by default
 *     via `commands/hook/_stub.ts::STUB_DISPATCH_EVENTS`.
 *   - Tier B (10) — events with templates but excluded from default
 *     stub dispatch (high-frequency flooding risk). A bespoke handler
 *     can call `dispatchHookNotify` directly to opt them in; this file
 *     proves the templates exist and render correctly.
 *
 * The 7 Phase-1 events (`Stop`, `SubagentStop`, `SessionStart`,
 * `SessionEnd`, `UserPromptSubmit`, `Notification`, `PreCompact`) are
 * snapshotted in `notify.test.ts::dispatchHookNotify > per-event message
 * snapshots`. This file adds the remaining 21.
 *
 * Test posture mirrors the existing `notify.test.ts` snapshots: write a
 * minimal slack-only fixture, stage Slack credentials, dispatch via
 * `dispatchHookNotify`, and observe the rendered text in the Slack
 * `chat.postMessage` request body. Slack is the snapshot vehicle because
 * the Slack body exposes the rendered `*Title*\nBody` string verbatim.
 *
 * Coverage assertion: a final test loops over every {@link HookTrigger}
 * value and asserts that `dispatchHookNotify` either dispatches (renderer
 * returned non-null) OR returns a documented null (the `Stop` loop guard).
 * This pins the exhaustiveness of `renderHookMessage` against future
 * additions to the {@link HookTrigger} union.
 */

import { afterEach, beforeEach, describe, expect, mock, test } from 'bun:test';
import { randomBytes } from 'node:crypto';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { dispatchHookNotify, type NotifyOptions } from '../notify.js';
import type { HookTrigger, Settings } from '../settings.js';

// ---------------------------------------------------------------------------
// Fixture plumbing — mirrors `notify.test.ts`
// ---------------------------------------------------------------------------

const MANAGED_ENV_KEYS = [
  'SLACK_BOT_TOKEN',
  'SLACK_USER_ID',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'DISCORD_WEBHOOK_URL',
] as const;

interface FetchCall {
  readonly url: string;
  readonly init: RequestInit | undefined;
}

let tmpRoot: string;
let calls: FetchCall[];
let savedFetch: typeof globalThis.fetch;
const savedEnv: Partial<Record<(typeof MANAGED_ENV_KEYS)[number], string>> = {};

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

function writeWorkspaceSettings(settings: Settings): void {
  const dir = join(tmpRoot, '.gobbi');
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'settings.json'), `${JSON.stringify(settings, null, 2)}\n`, 'utf8');
}

function baseOptions(): NotifyOptions {
  return { projectDir: tmpRoot };
}

beforeEach(() => {
  // Lowercase-hex suffix per `mkdtemp-suffix-fails-name-pattern.md` —
  // mirrors the pattern in `notify.test.ts`.
  tmpRoot = join(tmpdir(), `notify-templates-${randomBytes(4).toString('hex')}`);
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
// Helpers — fixed cwd + sessionId give deterministic projectName / sessionPrefix
// ---------------------------------------------------------------------------

const FIXED_SESSION_ID = 'abcdef0123456789';
const FIXED_CWD = '/repo/myproj';
const FIXED_PREFIX = 'abcdef01'; // sessionPrefix(FIXED_SESSION_ID)
const FIXED_PROJECT = 'myproj'; // projectName(FIXED_CWD)

/** Slack-only fixture with the given trigger allow-list, plus credentials. */
function setupSlackForTrigger(trigger: HookTrigger): void {
  writeWorkspaceSettings({
    schemaVersion: 1,
    notify: {
      slack: { enabled: true, triggers: [trigger] },
    },
  });
  process.env['SLACK_BOT_TOKEN'] = 'xoxb-token';
  process.env['SLACK_USER_ID'] = 'U-test';
}

/** Read the rendered slack text from the captured fetch body. */
function slackText(): string {
  const body = calls[0]?.init?.body;
  const parsed = JSON.parse(typeof body === 'string' ? body : '{}') as Record<string, unknown>;
  const text = parsed['text'];
  return typeof text === 'string' ? text : '';
}

interface TemplateCase {
  readonly trigger: HookTrigger;
  /** Optional payload fields beyond `session_id` + `cwd` (e.g. `agent_type`). */
  readonly extraPayload?: Readonly<Record<string, unknown>>;
  /** The expected `*Title*\nBody` Slack-rendered string. */
  readonly expected: string;
}

async function dispatchOne(trigger: HookTrigger, extra?: Readonly<Record<string, unknown>>): Promise<void> {
  setupSlackForTrigger(trigger);
  await dispatchHookNotify(
    { session_id: FIXED_SESSION_ID, cwd: FIXED_CWD, ...extra },
    trigger,
    baseOptions(),
  );
}

// ===========================================================================
// Tier A — 11 events that the generic stub dispatches by default
// ===========================================================================

describe('renderHookMessage — Tier A snapshot', () => {
  const cases: readonly TemplateCase[] = [
    {
      trigger: 'StopFailure',
      expected: `*Task Failed*\nSession \`${FIXED_PREFIX}\` failed in ${FIXED_PROJECT}.`,
    },
    {
      trigger: 'PermissionRequest',
      expected: `*Permission Requested*\nAwaiting permission in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'PermissionDenied',
      expected: `*Permission Denied*\nPermission denied in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'SubagentStart',
      extraPayload: { agent_type: '__executor' },
      expected: `*Subagent Started*\nSubagent (__executor) started in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'TaskCreated',
      expected: `*Task Created*\nTask created in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'TaskCompleted',
      expected: `*Task Completed*\nTask completed in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'TeammateIdle',
      expected: `*Teammate Idle*\nTeammate idle in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'PostCompact',
      expected: `*Compact Done*\nSession \`${FIXED_PREFIX}\` compaction complete in ${FIXED_PROJECT}.`,
    },
    {
      trigger: 'WorktreeCreate',
      expected: `*Worktree Created*\nWorktree created in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'WorktreeRemove',
      expected: `*Worktree Removed*\nWorktree removed in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'ConfigChange',
      expected: `*Config Changed*\nConfig changed in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
  ];

  for (const tc of cases) {
    test(`Tier-A ${tc.trigger} renders expected title + body`, async () => {
      await dispatchOne(tc.trigger, tc.extraPayload);
      expect(calls.length).toBe(1);
      expect(slackText()).toBe(tc.expected);
    });
  }
});

// ===========================================================================
// Tier B — 10 events that have templates but skip the default stub dispatch
// ===========================================================================

describe('renderHookMessage — Tier B snapshot', () => {
  const cases: readonly TemplateCase[] = [
    {
      trigger: 'UserPromptExpansion',
      expected: `*Prompt Expanded*\nUser prompt expanded in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'PreToolUse',
      expected: `*Tool Use Started*\nTool use started in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'PostToolUse',
      expected: `*Tool Use Done*\nTool use done in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'PostToolUseFailure',
      expected: `*Tool Use Failed*\nTool use failed in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'PostToolBatch',
      expected: `*Tool Batch Done*\nTool batch done in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'FileChanged',
      expected: `*File Changed*\nFile changed in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'CwdChanged',
      expected: `*Directory Changed*\nWorking directory changed in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'InstructionsLoaded',
      expected: `*Instructions Loaded*\nInstructions loaded in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'Elicitation',
      expected: `*Input Requested*\nMCP elicitation requested in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
    {
      trigger: 'ElicitationResult',
      expected: `*Input Received*\nMCP elicitation result in ${FIXED_PROJECT}. Session \`${FIXED_PREFIX}\`.`,
    },
  ];

  for (const tc of cases) {
    test(`Tier-B ${tc.trigger} renders expected title + body via direct dispatchHookNotify`, async () => {
      // Tier-B events have templates AND fire when the caller reaches
      // `dispatchHookNotify` directly with a matching trigger filter.
      // The stub-layer suppression is enforced separately in
      // `commands/hook/__tests__/_stub.test.ts`.
      await dispatchOne(tc.trigger, tc.extraPayload);
      expect(calls.length).toBe(1);
      expect(slackText()).toBe(tc.expected);
    });
  }
});

// ===========================================================================
// Exhaustiveness — every HookTrigger has a non-null template (modulo Stop guard)
// ===========================================================================

describe('renderHookMessage — exhaustiveness over HookTrigger union', () => {
  // The 28 {@link HookTrigger} values, hand-listed because TS literal
  // unions cannot be reflected at runtime. Adding a new HookTrigger
  // value MUST add an entry here (and a template in `renderHookMessage`)
  // — failing to do so breaks this assertion at the runtime layer.
  const ALL_HOOK_TRIGGERS: readonly HookTrigger[] = [
    // Session lifecycle
    'SessionStart',
    'SessionEnd',
    'Stop',
    'StopFailure',
    // Prompt lifecycle
    'UserPromptSubmit',
    'UserPromptExpansion',
    // Tool lifecycle
    'PreToolUse',
    'PostToolUse',
    'PostToolUseFailure',
    'PostToolBatch',
    // Permission
    'PermissionRequest',
    'PermissionDenied',
    // Notification
    'Notification',
    // Subagent / task
    'SubagentStart',
    'SubagentStop',
    'TaskCreated',
    'TaskCompleted',
    'TeammateIdle',
    // Compaction
    'PreCompact',
    'PostCompact',
    // Worktree
    'WorktreeCreate',
    'WorktreeRemove',
    // Workspace
    'FileChanged',
    'CwdChanged',
    'InstructionsLoaded',
    // Config
    'ConfigChange',
    // Elicitation
    'Elicitation',
    'ElicitationResult',
  ];

  test('all 28 HookTrigger values render and dispatch (Stop loop-guard exempted)', async () => {
    expect(ALL_HOOK_TRIGGERS.length).toBe(28);

    for (const trigger of ALL_HOOK_TRIGGERS) {
      // Reset captured fetch calls per-iteration so the assertion below
      // measures only this iteration's dispatch.
      calls.length = 0;
      setupSlackForTrigger(trigger);
      // For `Stop` we deliberately omit `stop_hook_active` so the loop
      // guard does NOT short-circuit; the renderer must produce a
      // template. The truthy-`stop_hook_active` branch is exercised
      // separately in `notify.test.ts > Stop loop guard`.
      await dispatchHookNotify(
        { session_id: FIXED_SESSION_ID, cwd: FIXED_CWD },
        trigger,
        baseOptions(),
      );
      expect(calls.length, `expected ${trigger} to dispatch through renderHookMessage`).toBe(1);
    }
  });
});
