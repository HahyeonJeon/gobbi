/**
 * gobbi maintenance — subcommand dispatcher for rarely-run operator tasks
 * that clean up on-disk state.
 *
 * Mirrors the shape of `commands/gotcha.ts` and `commands/workflow.ts`
 * exactly: a `readonly MaintenanceCommand[]` registry, help derived from
 * the registry, and a separate registry-parameterised dispatch exported
 * for tests. Sub-handlers are dynamic-`import()`-ed so unrelated
 * namespaces pay no cold-start cost when the user only runs the guard
 * hook.
 *
 * ## Scope (v0.5.0 Pass-2 W3.3)
 *
 * Ships `wipe-legacy-sessions` only. Future maintenance subcommands
 * (`sweep-stale-worktrees`, `vacuum-event-stores`, ...) can be appended
 * to `MAINTENANCE_COMMANDS` without touching the dispatcher body.
 *
 * ## Exit codes
 *
 *   - `0` on `--help` / no subcommand.
 *   - `1` when the subcommand is unknown.
 *   - Subcommand handlers own their own exit codes.
 *
 * @see `commands/maintenance/wipe-legacy-sessions.ts`
 */

// ---------------------------------------------------------------------------
// Registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the `maintenance` subcommand registry. `run` receives the
 * argv slice AFTER the subcommand name. The handler owns its own flag
 * parsing and is free to exit the process.
 */
export interface MaintenanceCommand {
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
export const MAINTENANCE_COMMANDS: readonly MaintenanceCommand[] = [
  {
    name: 'wipe-legacy-sessions',
    summary:
      'Delete terminal sessions from .gobbi/sessions/ (refuses if any legacy session is active)',
    run: async (args: string[]): Promise<void> => {
      const { runWipeLegacySessions } = await import(
        './maintenance/wipe-legacy-sessions.js'
      );
      await runWipeLegacySessions(args);
    },
  },
];

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

function renderHelp(commands: readonly MaintenanceCommand[]): string {
  const header = `Usage: gobbi maintenance <subcommand> [options]`;
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

export async function runMaintenance(args: string[]): Promise<void> {
  return runMaintenanceWithRegistry(args, MAINTENANCE_COMMANDS);
}

/**
 * Registry-parameterised dispatch — exported for tests that need to
 * exercise the dispatcher against a custom registry (unknown-command
 * handling, `--help` rendering).
 */
export async function runMaintenanceWithRegistry(
  args: string[],
  commands: readonly MaintenanceCommand[],
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
