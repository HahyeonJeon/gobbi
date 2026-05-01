/**
 * gobbi memory — subcommand dispatcher for per-session memory inspection
 * and crash-recovery operations on the JSON memory subsystem
 * (`session.json` + `project.json`).
 *
 * Mirrors the shape of `commands/maintenance.ts` exactly: a
 * `readonly MemoryCommand[]` registry, help derived from the registry,
 * and a separate registry-parameterised dispatch exported for tests.
 * Sub-handlers are dynamic-`import()`-ed so unrelated namespaces pay no
 * cold-start cost when the user only runs the guard hook.
 *
 * ## Scope (v0.5.0 PR-CFM-B — issue #236 part 1)
 *
 * Ships `check` only in this commit (per PR-CFM-B Architecture F2 lock —
 * each registry entry's dynamic-import target must exist when the entry
 * registers, so bisect across this commit alone stays clean). The next
 * commit (#236 part 2) appends the `backfill` entry atomically with its
 * handler module.
 *
 * ## Exit codes
 *
 *   - `0` on `--help` / no subcommand.
 *   - `1` when the subcommand is unknown.
 *   - Subcommand handlers own their own exit codes.
 *
 * @see `commands/maintenance.ts` — sibling dispatcher this file mirrors.
 * @see `commands/memory/check.ts` — first registered subcommand.
 */

// ---------------------------------------------------------------------------
// Registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the `memory` subcommand registry. `run` receives the argv
 * slice AFTER the subcommand name. The handler owns its own flag parsing
 * and is free to exit the process.
 */
export interface MemoryCommand {
  readonly name: string;
  readonly summary: string;
  readonly run: (args: string[]) => Promise<void>;
}

/**
 * Canonical list of registered subcommands. Ordering controls `--help`
 * output. Add new subcommands by appending — the dispatcher and help
 * renderer pick them up automatically. Each handler is dynamic-imported
 * to keep unrelated command cold-starts lean.
 */
export const MEMORY_COMMANDS: readonly MemoryCommand[] = [
  {
    name: 'check',
    summary:
      'Inspect a single session for memory drift (state.db vs session.json projection)',
    run: async (args: string[]): Promise<void> => {
      const { runMemoryCheck } = await import('./memory/check.js');
      await runMemoryCheck(args);
    },
  },
];

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

function renderHelp(commands: readonly MemoryCommand[]): string {
  const header = `Usage: gobbi memory <subcommand> [options]`;
  // Longest subcommand name drives column width so future entries do not
  // break alignment.
  const pad = commands.reduce(
    (w, c) => Math.max(w, c.name.length),
    0,
  ) + 2;
  const commandsSection =
    commands.length === 0
      ? '  (no subcommands registered)'
      : commands
          .map((cmd) => `  ${cmd.name.padEnd(pad)}${cmd.summary}`)
          .join('\n');
  const optionsSection = `Options:\n  --help    Show this help message`;
  return `${header}\n\nSubcommands:\n${commandsSection}\n\n${optionsSection}`;
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

export async function runMemory(args: string[]): Promise<void> {
  return runMemoryWithRegistry(args, MEMORY_COMMANDS);
}

/**
 * Registry-parameterised dispatch — exported for tests that need to
 * exercise the dispatcher against a custom registry (unknown-command
 * handling, `--help` rendering).
 */
export async function runMemoryWithRegistry(
  args: string[],
  commands: readonly MemoryCommand[],
): Promise<void> {
  const subcommand = args[0];

  if (
    subcommand === undefined ||
    subcommand === '--help' ||
    subcommand === '-h'
  ) {
    console.log(renderHelp(commands));
    return;
  }

  const match = commands.find((cmd) => cmd.name === subcommand);
  if (match === undefined) {
    process.stderr.write(`Unknown subcommand: ${subcommand}\n`);
    process.stderr.write(renderHelp(commands));
    process.stderr.write('\n');
    process.exit(1);
  }

  await match.run(args.slice(1));
}
