/**
 * Contract tests for the `.claude/settings.json` hook wiring.
 *
 * Two live Claude Code hook bugs motivated this file:
 *
 *   1. `gobbi workflow guard` emitted `hookSpecificOutput` without the
 *      required `hookEventName` field, causing Claude Code to reject every
 *      PreToolUse response with a validation error.
 *   2. `.claude/settings.json` registered `gobbi workflow capture-plan`
 *      under `PostToolUse[ExitPlanMode]`, but the CLI command was renamed
 *      to `capture-planning` in Pass 3. The hook silently command-not-
 *      founded on every plan-mode exit.
 *
 * Both bugs share a class — a registered hook command that does not match
 * the CLI's actual surface, or an emitter shape that does not match Claude
 * Code's per-event JSON contract. PR-FIN-1b moved hook registration from
 * `gobbi workflow <subcommand>` to the `gobbi hook <event>` namespace
 * (28 events). This file enumerates every hook in `.claude/settings.json`,
 * asserts each command resolves to a registered subcommand in
 * `HOOK_COMMANDS`, and (for the one hook that emits JSON to stdout —
 * `pre-tool-use`, which chains guard) asserts the emitted payload
 * conforms to Claude Code's per-event shape.
 *
 * Pattern references:
 *   - Hook manifest enumeration / `commandsForHook` shape — adopted from
 *     `__tests__/features/one-command-install.test.ts`.
 *   - `runGuardWithOptions` invocation pattern — adopted from
 *     `commands/workflow/__tests__/guard.test.ts`. The guard is exercised
 *     via the testable entry point with a `payload` override; no stdin,
 *     no real session — the test only needs to inspect the emitted JSON
 *     shape on the fail-open allow path.
 *
 * @see `_gotcha/__system.md` §"Claude Code hookSpecificOutput requires hookEventName"
 * @see `_gotcha/__system.md` §".claude/settings.json hook command names MUST exist in the CLI registry"
 */

import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { runGuardWithOptions } from '../commands/workflow/guard.js';
import { HOOK_COMMANDS } from '../commands/hook.js';

// ---------------------------------------------------------------------------
// Path resolution — this file lives at
// `packages/cli/src/__tests__/hooks-contract.test.ts`; hop four directories
// up to reach the repo root.
// ---------------------------------------------------------------------------

const REPO_ROOT: string = join(import.meta.dir, '..', '..', '..', '..');
const SETTINGS_PATH: string = join(REPO_ROOT, '.claude', 'settings.json');

// ---------------------------------------------------------------------------
// Manifest shape — minimal structural typing for the JSON we parse. Only
// the fields asserted on are declared.
// ---------------------------------------------------------------------------

interface HookCommand {
  readonly type?: string;
  readonly command?: string;
}

interface HookBlock {
  readonly matcher?: string;
  readonly hooks?: readonly HookCommand[];
}

interface HooksManifest {
  readonly hooks?: Record<string, readonly HookBlock[] | undefined>;
}

function readJson<T>(path: string): T {
  const text = readFileSync(path, 'utf8');
  const parsed: unknown = JSON.parse(text);
  if (parsed === null || typeof parsed !== 'object') {
    throw new Error(`${path} did not contain a JSON object`);
  }
  return parsed as T;
}

/**
 * Extract every `(event, matcher, command)` tuple registered under
 * `hooks` in the manifest. Used by the registry-presence test below.
 */
interface HookEntry {
  readonly event: string;
  readonly matcher: string | undefined;
  readonly command: string;
}

function enumerateHooks(manifest: HooksManifest): readonly HookEntry[] {
  const entries: HookEntry[] = [];
  const hooks = manifest.hooks ?? {};
  for (const event of Object.keys(hooks)) {
    const blocks = hooks[event] ?? [];
    for (const block of blocks) {
      for (const hook of block.hooks ?? []) {
        if (hook.type === 'command' && typeof hook.command === 'string') {
          entries.push({
            event,
            matcher: block.matcher,
            command: hook.command,
          });
        }
      }
    }
  }
  return entries;
}

/**
 * Parse `gobbi hook <event> [...]` into the event subcommand token.
 * Returns `null` for any string that does not start with the
 * `gobbi hook ` prefix — such hooks are out of scope for this contract
 * test (the CLI registry it checks is `HOOK_COMMANDS`).
 */
function parseHookSubcommand(command: string): string | null {
  const PREFIX = 'gobbi hook ';
  if (!command.startsWith(PREFIX)) return null;
  const remainder = command.slice(PREFIX.length).trim();
  if (remainder.length === 0) return null;
  const firstToken = remainder.split(/\s+/)[0];
  return firstToken ?? null;
}

// ---------------------------------------------------------------------------
// stdout / process.exit capture — mirrors the harness in
// `commands/workflow/__tests__/guard.test.ts` so the contract test can
// invoke `runGuardWithOptions` and inspect the emitted JSON without
// touching the real terminal.
// ---------------------------------------------------------------------------

interface Captured {
  stdout: string;
  exitCode: number | null;
}

class ExitCalled extends Error {
  constructor(readonly code: number) {
    super(`process.exit(${code})`);
  }
}

let captured: Captured;
let origStdoutWrite: typeof process.stdout.write;
let origExit: typeof process.exit;

beforeEach(() => {
  captured = { stdout: '', exitCode: null };
  origStdoutWrite = process.stdout.write;
  origExit = process.exit;

  process.stdout.write = ((chunk: string | Uint8Array): boolean => {
    captured.stdout +=
      typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as typeof process.stdout.write;
  process.exit = ((code?: number | string | null): never => {
    captured.exitCode = typeof code === 'number' ? code : 0;
    throw new ExitCalled(captured.exitCode);
  }) as typeof process.exit;
});

afterEach(() => {
  process.stdout.write = origStdoutWrite;
  process.exit = origExit;
});

async function captureExit(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    if (err instanceof ExitCalled) return;
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('hooks contract — `.claude/settings.json`', () => {
  describe('every registered hook command exists in HOOK_COMMANDS', () => {
    const manifest = readJson<HooksManifest>(SETTINGS_PATH);
    const entries = enumerateHooks(manifest);
    const registered = new Set(HOOK_COMMANDS.map((c) => c.name));

    // Sanity check: PR-FIN-1b ships all 28 Claude Code hook events. If a
    // future change adds or removes one, this assertion fails loudly so
    // the contract test maintainer is forced to revisit the per-event
    // shape coverage below.
    test('manifest enumerates all 28 Claude Code hook events', () => {
      const eventKeys = new Set(entries.map((e) => e.event));
      expect(eventKeys).toEqual(
        new Set([
          'SessionStart',
          'SessionEnd',
          'Stop',
          'StopFailure',
          'UserPromptSubmit',
          'UserPromptExpansion',
          'PreToolUse',
          'PostToolUse',
          'PostToolUseFailure',
          'PostToolBatch',
          'PermissionRequest',
          'PermissionDenied',
          'Notification',
          'SubagentStart',
          'SubagentStop',
          'TaskCreated',
          'TaskCompleted',
          'TeammateIdle',
          'PreCompact',
          'PostCompact',
          'WorktreeCreate',
          'WorktreeRemove',
          'FileChanged',
          'CwdChanged',
          'InstructionsLoaded',
          'ConfigChange',
          'Elicitation',
          'ElicitationResult',
        ]),
      );
    });

    for (const entry of entries) {
      const label =
        entry.matcher !== undefined
          ? `${entry.event}[${entry.matcher}] → ${entry.command}`
          : `${entry.event} → ${entry.command}`;
      test(`${label} resolves to a registered subcommand`, () => {
        const subcommand = parseHookSubcommand(entry.command);
        expect(subcommand).not.toBeNull();
        // Non-null narrowing for the assertion below — the previous
        // expect would have thrown if subcommand were null.
        if (subcommand === null) return;
        expect(registered.has(subcommand)).toBe(true);
      });
    }
  });

  describe('plugin manifest — PostToolUse Bash matcher (#197 dormant emitter)', () => {
    // PR-CFM-C T5 wires the dormant `step.advancement.observed`
    // emitter via a second PostToolUse matcher in the plugin manifest
    // (Bash) routing to the same `gobbi hook post-tool-use`
    // dispatcher. The hook fires on every Bash tool call but only
    // appends an event when the command starts with
    // `gobbi workflow transition` AND
    // `workflow.observability.advancement.enabled === true`. The
    // dispatcher branch lives in
    // `commands/hook/post-tool-use.ts`; the emitter at
    // `commands/workflow/capture-advancement.ts`.
    test('plugins/gobbi/hooks/hooks.json registers Bash matcher routing to gobbi hook post-tool-use', () => {
      const PLUGIN_MANIFEST_PATH = join(
        REPO_ROOT,
        'plugins',
        'gobbi',
        'hooks',
        'hooks.json',
      );
      const manifest = readJson<HooksManifest>(PLUGIN_MANIFEST_PATH);
      const postToolUse = manifest.hooks?.['PostToolUse'] ?? [];
      const bashBlock = postToolUse.find((b) => b.matcher === 'Bash');
      expect(bashBlock).toBeDefined();
      const commands = (bashBlock?.hooks ?? []).map((h) => h.command);
      expect(commands).toContain('gobbi hook post-tool-use');
    });

    // PR-CFM-B T6 (#241) mirrors the Bash matcher into
    // `.claude/settings.json` so the dormant emitter also fires when
    // a developer runs Claude Code against the gobbi repo itself
    // (project-level config, distinct from the plugin manifest the
    // gobbi users receive). To prevent future drift between the two
    // files, this test enforces symmetric equality on the projected
    // (matcher, command, timeout) triples for every PostToolUse[]
    // entry. Each entry is assumed to have exactly one hook of
    // type 'command' — the PostToolUse contract throughout this repo.
    test('PostToolUse[] triples in .claude/settings.json and plugin manifest are byte-identical', () => {
      const PLUGIN_MANIFEST_PATH = join(
        REPO_ROOT,
        'plugins',
        'gobbi',
        'hooks',
        'hooks.json',
      );
      const settings = readJson<HooksManifest>(SETTINGS_PATH);
      const plugin = readJson<HooksManifest>(PLUGIN_MANIFEST_PATH);

      interface Triple {
        readonly matcher: string | undefined;
        readonly command: string | undefined;
        readonly timeout: number | undefined;
      }

      function toTriples(manifest: HooksManifest): readonly Triple[] {
        const blocks = manifest.hooks?.['PostToolUse'] ?? [];
        return blocks.map((block) => {
          const hook = (block.hooks ?? [])[0];
          return {
            matcher: block.matcher,
            command: hook?.command,
            // `timeout` is not declared on the local HookCommand
            // interface above — read through `unknown` to avoid
            // expanding the structural type beyond what the other
            // tests need.
            timeout:
              hook && typeof (hook as { timeout?: unknown }).timeout === 'number'
                ? ((hook as { timeout: number }).timeout)
                : undefined,
          };
        });
      }

      const sortKey = (t: Triple): string =>
        `${t.matcher ?? ''}|${t.command ?? ''}|${t.timeout ?? ''}`;

      const settingsTriples = [...toTriples(settings)].sort((a, b) =>
        sortKey(a).localeCompare(sortKey(b)),
      );
      const pluginTriples = [...toTriples(plugin)].sort((a, b) =>
        sortKey(a).localeCompare(sortKey(b)),
      );

      expect(settingsTriples).toStrictEqual(pluginTriples);
    });
  });

  describe('per-event emitter shape', () => {
    // Of the five hooks enumerated above, only `guard` (PreToolUse) emits
    // JSON to stdout that Claude Code parses against a `hookSpecificOutput`
    // schema. The other four return exit codes only. If a future hook
    // begins emitting JSON, add its shape assertion here.
    test('PreToolUse: guard emits hookSpecificOutput with hookEventName: "PreToolUse"', async () => {
      // Fail-open path: a payload with no session_id and no env-derived
      // session causes the guard to emit `permissionDecision: 'allow'`.
      // The shape under test is the `hookSpecificOutput` envelope, which
      // is identical on both allow and deny paths — fail-open is the
      // simplest invocation that does not require a scratch session.
      await captureExit(() =>
        runGuardWithOptions([], {
          sessionDir: '/nonexistent/path/that/forces/fail/open',
          payload: { tool_name: 'Read' },
        }),
      );

      const trimmed = captured.stdout.trim();
      expect(trimmed.length).toBeGreaterThan(0);
      const parsed = JSON.parse(trimmed) as {
        readonly hookSpecificOutput?: {
          readonly hookEventName?: string;
          readonly permissionDecision?: string;
        };
      };
      expect(parsed.hookSpecificOutput).toBeDefined();
      // The literal contract: `hookEventName` is required and must equal
      // the registered hook event name. Claude Code rejects payloads that
      // omit it ("hookSpecificOutput is missing required field
      // hookEventName").
      expect(parsed.hookSpecificOutput?.hookEventName).toBe('PreToolUse');
      // Sanity: the response is well-formed beyond just the new field.
      expect(parsed.hookSpecificOutput?.permissionDecision).toBe('allow');
    });
  });
});
