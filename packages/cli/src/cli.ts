/**
 * gobbi — top-level command dispatcher.
 *
 * This file owns the `gobbi <command>` routing layer. Each command is
 * registered in `TOP_LEVEL_COMMANDS` and contributes a `run(args)` handler
 * (dynamic-imported on first dispatch to keep cold-start cheap for latency-
 * critical entrypoints like the guard hook) plus a one-line `summary`
 * consumed by `--help`. Help output is derived from the registry — there
 * are no hand-maintained usage strings in this file.
 *
 * ## Extensibility contract
 *
 * A new command is added by (a) appending its name to `COMMAND_ORDER`
 * and (b) adding a matching entry to `COMMANDS_BY_NAME`. The compiler
 * enforces both halves:
 *
 *   - `CommandName = typeof COMMAND_ORDER[number]` is the single source
 *     of truth for "which commands exist".
 *   - `COMMANDS_BY_NAME` is typed `satisfies Record<CommandName,
 *     CommandDef>` — a missing entry fails at the key-set check, an
 *     extra entry fails at `satisfies Record<…>` excess-key check.
 *
 * `TOP_LEVEL_COMMANDS` (the ordered list consumed by the dispatcher
 * and help renderer) is derived from the two above — `--help` ordering
 * follows `COMMAND_ORDER` so related commands can be grouped by
 * adjacency. `summary` strings are single-line; longer descriptions
 * belong in the individual command's own `--help`.
 *
 * ## Exit codes
 *
 * - `0` on `--help` / `--version`.
 * - `0` when no command is supplied (prints help).
 * - `1` when the command is unknown.
 * - `--is-latest` delegates to `lib/version-check.ts` which exits
 *   `0` (current) / `1` (stale) / `2` (indeterminate); with `--json`
 *   it always exits `0` after printing the JSON report.
 * - Command handlers are free to `process.exit(code)` themselves; the
 *   dispatcher does not normalise their exit codes.
 *
 * ## Pattern reference
 *
 * Mirrors the inner `gobbi workflow` dispatcher in `commands/workflow.ts`
 * (same `{ name, summary, run }` shape, same `satisfies` exhaustiveness
 * gate, same unknown-command behaviour) and the predicate-registry
 * `satisfies Record<PredicateName, Predicate>` pattern in
 * `workflow/predicates.ts`.
 *
 * @see `.claude/project/gobbi/design/v050-cli.md` §Command Structure
 */

import { parseArgs } from 'node:util';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Command registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the top-level command registry. `run` receives the argv
 * slice AFTER the command name (`process.argv.slice(3)`). The handler owns
 * its own flag parsing and is free to exit the process.
 *
 * Mirrors `WorkflowCommand` in `commands/workflow.ts` — deliberately using
 * the same field names so both dispatch layers are visually identical.
 */
export interface CommandDef {
  readonly name: string;
  readonly summary: string;
  readonly run: (args: string[]) => Promise<void>;
}

/**
 * String-literal union of every registered top-level command name.
 * Kept in a separate tuple so that `CommandName` is ground-truth: the
 * compiler enforces (via `satisfies Record<CommandName, CommandDef>`
 * below) that the registry map provides an entry for every name, and
 * the `satisfies readonly CommandName[]` here keeps the tuple honest
 * in the other direction — no stray names, no misspellings.
 *
 * Append new commands here first (controls `--help` ordering) and in
 * `COMMANDS_BY_NAME` below; the compiler flags the asymmetry.
 */
export const COMMAND_ORDER = [
  'config',
  'hook',
  'session',
  'notify',
  'note',
  'validate',
  'workflow',
  'gotcha',
  'maintenance',
  'prompt',
  'install',
  'project',
  'image',
  'video',
  'web',
] as const;

export type CommandName = (typeof COMMAND_ORDER)[number];

/**
 * Canonical name → definition map. Typed `satisfies Record<CommandName,
 * CommandDef>` so:
 *
 *   - Adding a name to `COMMAND_ORDER` without a matching entry here
 *     fails the compile (missing key).
 *   - Adding an entry here without reflecting it in `COMMAND_ORDER`
 *     fails the compile (excess key under `satisfies Record<…>`).
 *
 * Each `run` dynamic-`import()`s its handler so the guard hook
 * (latency-critical) does not pay the load cost of unrelated commands
 * at startup. Mirrors the pattern in `commands/workflow.ts`.
 *
 * Mirrors the `satisfies Record<PredicateName, Predicate>` gate on
 * `defaultPredicates` in `workflow/predicates.ts`.
 */
export const COMMANDS_BY_NAME = {
  config: {
    name: 'config',
    summary: 'Manage per-session workflow configuration',
    run: async (args: string[]): Promise<void> => {
      const { runConfig } = await import('./commands/config.js');
      await runConfig(args);
    },
  },
  hook: {
    name: 'hook',
    summary: 'Claude Code hook event entrypoints (28 events)',
    run: async (args: string[]): Promise<void> => {
      const { runHook } = await import('./commands/hook.js');
      await runHook(args);
    },
  },
  session: {
    name: 'session',
    summary: 'Session environment setup (metadata, env loading)',
    run: async (args: string[]): Promise<void> => {
      const { runSession } = await import('./commands/session.js');
      await runSession(args);
    },
  },
  notify: {
    name: 'notify',
    summary: 'Send notifications (Slack, Telegram, Desktop)',
    run: async (args: string[]): Promise<void> => {
      const { runNotify } = await import('./commands/notify.js');
      await runNotify(args);
    },
  },
  note: {
    name: 'note',
    summary: 'Workflow note management and transcript extraction',
    run: async (args: string[]): Promise<void> => {
      const { runNote } = await import('./commands/note.js');
      await runNote(args);
    },
  },
  validate: {
    name: 'validate',
    summary: 'Validate agent, skill, gotcha, and lint definitions',
    run: async (args: string[]): Promise<void> => {
      const { runValidate } = await import('./commands/validate.js');
      await runValidate(args);
    },
  },
  workflow: {
    name: 'workflow',
    summary: 'v0.5.0 workflow engine commands (validate, …)',
    run: async (args: string[]): Promise<void> => {
      const { runWorkflow } = await import('./commands/workflow.js');
      await runWorkflow(args);
    },
  },
  gotcha: {
    name: 'gotcha',
    summary: 'Manage gobbi gotchas (promote, …)',
    run: async (args: string[]): Promise<void> => {
      const { runGotcha } = await import('./commands/gotcha.js');
      await runGotcha(args);
    },
  },
  maintenance: {
    name: 'maintenance',
    summary: 'Operator-only cleanup tasks (wipe-legacy-sessions, …)',
    run: async (args: string[]): Promise<void> => {
      const { runMaintenance } = await import('./commands/maintenance.js');
      await runMaintenance(args);
    },
  },
  prompt: {
    name: 'prompt',
    summary: 'Render / patch / rebuild per-step spec.json (operator-only)',
    run: async (args: string[]): Promise<void> => {
      const { runPrompt } = await import('./commands/prompt.js');
      await runPrompt(args);
    },
  },
  install: {
    name: 'install',
    summary: 'Install / overwrite the shipped gobbi template bundle',
    run: async (args: string[]): Promise<void> => {
      const { runInstall } = await import('./commands/install.js');
      await runInstall(args);
    },
  },
  project: {
    name: 'project',
    summary: 'Manage gobbi projects (list, create, switch)',
    run: async (args: string[]): Promise<void> => {
      const { runProject } = await import('./commands/project.js');
      await runProject(args);
    },
  },
  image: {
    name: 'image',
    summary: 'Analyze images or create comparison sheets',
    run: async (args: string[]): Promise<void> => {
      const { runImage } = await import('./commands/image.js');
      await runImage(args);
    },
  },
  video: {
    name: 'video',
    summary: 'Analyze video files and extract frames',
    run: async (args: string[]): Promise<void> => {
      const { runVideo } = await import('./commands/video.js');
      await runVideo(args);
    },
  },
  web: {
    name: 'web',
    summary: 'Take screenshots or capture images from web pages',
    run: async (args: string[]): Promise<void> => {
      const { runWeb } = await import('./commands/web.js');
      await runWeb(args);
    },
  },
} as const satisfies Record<CommandName, CommandDef>;

/**
 * Canonical ordered list of registered top-level commands, derived from
 * `COMMAND_ORDER` + `COMMANDS_BY_NAME`. Ordering controls `--help`
 * output. Consumed by the dispatcher and help renderer.
 */
export const TOP_LEVEL_COMMANDS: readonly CommandDef[] = COMMAND_ORDER.map(
  (name) => COMMANDS_BY_NAME[name],
);

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

/**
 * Render the top-level help screen from a command registry. Derived
 * entirely from the registry — no hand-maintained strings.
 */
export function renderHelp(commands: readonly CommandDef[]): string {
  const header = `Usage: gobbi <command> [options]`;
  const commandsSection =
    commands.length === 0
      ? '  (no commands registered)'
      : commands
          .map((cmd) => `  ${cmd.name.padEnd(10)} ${cmd.summary}`)
          .join('\n');
  const optionsSection = `Options:\n  --help              Show this help message\n  --version           Show version number\n  --is-latest         Check if installed CLI matches npm @latest (exit 0 current, 1 stale, 2 indeterminate)\n  --json              With --is-latest: emit JSON report and exit 0`;
  return `${header}\n\nCommands:\n${commandsSection}\n\n${optionsSection}`;
}

// ---------------------------------------------------------------------------
// Top-level dispatcher
// ---------------------------------------------------------------------------

/**
 * Registry-parameterised dispatch. Exported for tests that need to
 * exercise the dispatcher against a custom registry (unknown-command
 * handling, `--help` rendering, extensibility smoke test). The real CLI
 * entry point `run()` delegates to this with `TOP_LEVEL_COMMANDS`.
 *
 * `argv` is the raw process.argv slice starting at the command token
 * (i.e., `process.argv.slice(2)`). The handler forwards the remaining
 * tokens (`argv.slice(1)`) to the matched command.
 */
export async function runWithRegistry(
  argv: readonly string[],
  commands: readonly CommandDef[],
): Promise<void> {
  const command = argv[0];

  if (command !== undefined) {
    const match = commands.find((cmd) => cmd.name === command);
    if (match !== undefined) {
      await match.run(argv.slice(1));
      return;
    }
  }

  // Global flags parsed against the FULL argv so `--version` works even
  // when no command precedes it. `parseArgs` tolerates unknown positionals
  // because `allowPositionals: true`.
  const { values } = parseArgs({
    args: [...argv],
    allowPositionals: true,
    options: {
      help: { type: 'boolean', default: false },
      version: { type: 'boolean', default: false },
      'is-latest': { type: 'boolean', default: false },
      json: { type: 'boolean', default: false },
    },
  });

  if (values.version) {
    const pkgPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      'package.json',
    );
    const pkg = JSON.parse(await readFile(pkgPath, 'utf8')) as {
      version: string;
    };
    console.log(pkg.version);
    process.exit(0);
  }

  if (values['is-latest']) {
    // Version-currency check — exits 0/1/2 (or 0 when --json is requested).
    // See `lib/version-check.ts` for the exit-code policy.
    const { runIsLatest } = await import('./lib/version-check.js');
    await runIsLatest({ emitJson: values.json === true });
    return;
  }

  const help = renderHelp(commands);

  if (command === undefined || values.help) {
    // No command OR explicit --help: help to stdout, exit 0.
    console.log(help);
    process.exit(0);
  }

  // Unknown command: error line + help to stderr, exit 1. Matches
  // `runWorkflowWithRegistry`'s unknown-subcommand behaviour.
  process.stderr.write(`Unknown command: ${command}\n`);
  process.stderr.write(help);
  process.stderr.write('\n');
  process.exit(1);
}

/**
 * CLI entry point — delegates to `runWithRegistry` with the canonical
 * `TOP_LEVEL_COMMANDS` registry and `process.argv.slice(2)`.
 */
export async function run(): Promise<void> {
  await runWithRegistry(process.argv.slice(2), TOP_LEVEL_COMMANDS);
}

// Self-invoke when run directly (bun src/cli.ts)
if (import.meta.main) {
  run().catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: ${message}`);
    process.exit(1);
  });
}
