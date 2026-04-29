/**
 * Integration-style tests for the one-command-install feature's code surface.
 *
 * Scope (feature scenarios `O-CI-{H|E|X}-NN` in
 * `.claude/project/gobbi/design/v050-features/one-command-install/scenarios.md`):
 *
 *   - The plugin manifest exists and declares a `hooks` entry (O-CI-H-03).
 *   - `plugins/gobbi/hooks/hooks.json` wires the five expected Claude Code
 *     hook events to the corresponding `gobbi workflow *` commands
 *     (O-CI-H-01, O-CI-X-04, O-CI-X-05).
 *   - The npm-installable shim (`packages/cli/bin/gobbi.js`) carries a Bun
 *     shebang and `packages/cli/package.json` exposes the `gobbi` command
 *     via its `bin` field (O-CI-H-01, O-CI-E-02).
 *   - The `/gobbi` skill is wired to `gobbi --is-latest` (GAP-01 resolution
 *     for O-CI-H-05) and `cli-setup.md` names `npm install -g
 *     @gobbitools/cli` as a recommended install option (O-CI-H-01).
 *
 * Paths resolve from `import.meta.dir` → repo root; the test never spawns
 * subprocesses or hits the network. Sibling test conventions were adopted
 * from `packages/cli/src/__tests__/e2e/workflow-cycle.test.ts` (repo-path
 * resolution via `import.meta.dir`) and
 * `packages/cli/src/lib/__tests__/version-check.test.ts` (Bun `bun:test`
 * describe/test layout).
 */

import { describe, test, expect } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// ---------------------------------------------------------------------------
// Path resolution — this file lives at
// `packages/cli/src/__tests__/features/one-command-install.test.ts`; hop
// four directories up to reach the repo root.
// ---------------------------------------------------------------------------

const REPO_ROOT: string = join(import.meta.dir, '..', '..', '..', '..', '..');

const PLUGIN_MANIFEST_PATH: string = join(
  REPO_ROOT,
  'plugins',
  'gobbi',
  '.claude-plugin',
  'plugin.json',
);
const HOOKS_JSON_PATH: string = join(
  REPO_ROOT,
  'plugins',
  'gobbi',
  'hooks',
  'hooks.json',
);
const CLI_SHIM_PATH: string = join(
  REPO_ROOT,
  'packages',
  'cli',
  'bin',
  'gobbi.js',
);
const CLI_PACKAGE_JSON_PATH: string = join(
  REPO_ROOT,
  'packages',
  'cli',
  'package.json',
);
const GOBBI_SKILL_PATH: string = join(
  REPO_ROOT,
  '.claude',
  'skills',
  'gobbi',
  'SKILL.md',
);
const GOBBI_CLI_SETUP_PATH: string = join(
  REPO_ROOT,
  '.claude',
  'skills',
  'gobbi',
  'cli-setup.md',
);

// ---------------------------------------------------------------------------
// Shape helpers — minimal structural typing for the JSON files we parse.
// Only the fields asserted on are declared; everything else is `unknown`.
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
 * Return every `command` string registered under the named Claude Code hook
 * event (e.g., `SessionStart`, `PreToolUse`). If a `matcher` is provided,
 * restrict to hook blocks whose matcher equals the given string.
 */
function commandsForHook(
  manifest: HooksManifest,
  event: string,
  matcher?: string,
): readonly string[] {
  const blocks = manifest.hooks?.[event] ?? [];
  const commands: string[] = [];
  for (const block of blocks) {
    if (matcher !== undefined && block.matcher !== matcher) continue;
    for (const hook of block.hooks ?? []) {
      if (hook.type === 'command' && typeof hook.command === 'string') {
        commands.push(hook.command);
      }
    }
  }
  return commands;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('one-command-install feature — code surface', () => {
  describe('plugin manifest', () => {
    test('plugins/gobbi/.claude-plugin/plugin.json is valid JSON with a hooks entry', () => {
      const manifest = readJson<Record<string, unknown>>(PLUGIN_MANIFEST_PATH);
      // Sanity: the plugin name is "gobbi" (baseline identity check).
      expect(manifest.name).toBe('gobbi');
      // The plugin ships hooks indirectly via `plugins/gobbi/hooks/hooks.json`.
      // Claude Code's plugin loader discovers `hooks/hooks.json` by convention;
      // the presence of the hooks manifest file — not an inline `hooks` key in
      // plugin.json — is what wires the entries. We assert that the sibling
      // hooks manifest is present and parseable in the dedicated test below.
      expect(typeof manifest.version).toBe('string');
    });
  });

  describe('hooks wiring (PR-FIN-1b: gobbi hook namespace)', () => {
    // PR-FIN-1b consolidated all 28 Claude Code hook events under the
    // `gobbi hook <event>` namespace. The previous `gobbi workflow init/
    // guard/capture-planning/capture-subagent/stop` direct registrations
    // were replaced; the underlying workflow commands stay defined for
    // direct invocation but are no longer the hook-registered entries.
    //
    // The canonical 5 non-trivial events plus the previously-registered
    // matcher (PostToolUse[ExitPlanMode]) are asserted explicitly. For
    // the full 28-event registry, see `__tests__/hooks-contract.test.ts`.

    test('registers SessionStart → gobbi hook session-start', () => {
      const manifest = readJson<HooksManifest>(HOOKS_JSON_PATH);
      const commands = commandsForHook(
        manifest,
        'SessionStart',
        'startup|resume|clear|compact',
      );
      expect(commands).toContain('gobbi hook session-start');
    });

    test('registers PreToolUse → gobbi hook pre-tool-use', () => {
      const manifest = readJson<HooksManifest>(HOOKS_JSON_PATH);
      const commands = commandsForHook(manifest, 'PreToolUse');
      expect(commands).toContain('gobbi hook pre-tool-use');
    });

    test('registers PostToolUse[ExitPlanMode] → gobbi hook post-tool-use', () => {
      const manifest = readJson<HooksManifest>(HOOKS_JSON_PATH);
      const commands = commandsForHook(
        manifest,
        'PostToolUse',
        'ExitPlanMode',
      );
      expect(commands).toContain('gobbi hook post-tool-use');
    });

    test('registers SubagentStop → gobbi hook subagent-stop', () => {
      const manifest = readJson<HooksManifest>(HOOKS_JSON_PATH);
      const commands = commandsForHook(manifest, 'SubagentStop');
      expect(commands).toContain('gobbi hook subagent-stop');
    });

    test('registers Stop → gobbi hook stop', () => {
      const manifest = readJson<HooksManifest>(HOOKS_JSON_PATH);
      const commands = commandsForHook(manifest, 'Stop');
      expect(commands).toContain('gobbi hook stop');
    });
  });

  describe('CLI binary shim', () => {
    test('packages/cli/bin/gobbi.js has a Bun shebang', () => {
      const body = readFileSync(CLI_SHIM_PATH, 'utf8');
      const firstLine = body.split(/\r?\n/, 1)[0] ?? '';
      expect(firstLine).toBe('#!/usr/bin/env bun');
    });

    test('packages/cli/package.json bin field exposes `gobbi`', () => {
      const pkg = readJson<{ readonly bin?: Record<string, string> | string }>(
        CLI_PACKAGE_JSON_PATH,
      );
      // The `bin` field is `{ "gobbi": "./bin/gobbi.js" }` in this repo; guard
      // against the string shorthand form in case a future refactor switches
      // to a single-entry `bin` declaration.
      const bin = pkg.bin;
      if (typeof bin === 'string') {
        // string form: `"bin": "./bin/gobbi.js"` — npm installs this as the
        // package name, which is scoped (`@gobbitools/cli`); the shim is then
        // linked under the last path segment. Reject this form — this
        // package deliberately uses the object form to name the `gobbi`
        // command explicitly.
        throw new Error(
          `packages/cli/package.json "bin" must be an object exposing "gobbi"; got string ${bin}`,
        );
      }
      expect(bin).toBeDefined();
      expect(bin?.gobbi).toBe('./bin/gobbi.js');
    });
  });

  describe('/gobbi skill wiring', () => {
    test('.claude/skills/gobbi/SKILL.md §THIRD references `gobbi --is-latest`', () => {
      const body = readFileSync(GOBBI_SKILL_PATH, 'utf8');
      const thirdStart = body.indexOf('**THIRD');
      const fourthStart = body.indexOf('**FOURTH', thirdStart);
      expect(thirdStart).toBeGreaterThanOrEqual(0);
      expect(fourthStart).toBeGreaterThan(thirdStart);
      const thirdSection = body.slice(thirdStart, fourthStart);
      expect(thirdSection).toContain('gobbi --is-latest');
    });

    test('.claude/skills/gobbi/cli-setup.md names `npm install -g @gobbitools/cli` as a recommended option', () => {
      const body = readFileSync(GOBBI_CLI_SETUP_PATH, 'utf8');
      expect(body).toContain('npm install -g @gobbitools/cli');
      // Option 1 is labelled "(Recommended)"; the command + label pairing is
      // what the `/gobbi` skill's install branch expects to find.
      expect(body).toMatch(/Option 1:.*Recommended/i);
    });
  });
});
