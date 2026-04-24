/**
 * gobbi project — subcommand dispatcher for multi-project management.
 *
 * Mirrors the shape of `commands/maintenance.ts` exactly: a
 * `readonly ProjectCommand[]` registry, help derived from the registry,
 * and a separate registry-parameterised dispatch exported for tests.
 * Sub-handlers are dynamic-`import()`-ed so the CLI pays no cold-start
 * cost when the operator is only running an unrelated command.
 *
 * ## Scope (v0.5.0 Pass-2 W5.4)
 *
 * Ships three subcommands:
 *
 *   - `list`   — enumerate projects, mark the active one.
 *   - `create` — scaffold a new project directory tree + register in
 *     `settings.json`'s `projects.known`.
 *   - `switch` — rotate the `.claude/{skills,agents,rules}/` symlink farm
 *     to point at a different project, with an active-session gate.
 *
 * Out-of-scope for W5.4: `delete` and `rename` — deferred to a later
 * pass per the plan's §W5.4 scope boundary.
 *
 * ## Exit codes
 *
 *   - `0` on `--help` / no subcommand.
 *   - `1` when the subcommand is unknown.
 *   - Subcommand handlers own their own exit codes.
 *
 * @see `commands/project/list.ts`
 * @see `commands/project/create.ts`
 * @see `commands/project/switch.ts`
 */

// ---------------------------------------------------------------------------
// Registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the `project` subcommand registry. `run` receives the
 * argv slice AFTER the subcommand name. The handler owns its own flag
 * parsing and is free to exit the process.
 *
 * Mirrors `MaintenanceCommand` in `commands/maintenance.ts` — same
 * `{ name, summary, run }` shape, same dispatch semantics.
 */
export interface ProjectCommand {
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
export const PROJECT_COMMANDS: readonly ProjectCommand[] = [
  {
    name: 'list',
    summary: 'List every project under .gobbi/projects/ and mark the active one',
    run: async (args: string[]): Promise<void> => {
      const { runProjectList } = await import('./project/list.js');
      await runProjectList(args);
    },
  },
  {
    name: 'create',
    summary: 'Create a new project directory tree and register it in settings.json',
    run: async (args: string[]): Promise<void> => {
      const { runProjectCreate } = await import('./project/create.js');
      await runProjectCreate(args);
    },
  },
  {
    name: 'switch',
    summary: 'Rotate the .claude/ symlink farm to a different project (active-session-gated)',
    run: async (args: string[]): Promise<void> => {
      const { runProjectSwitch } = await import('./project/switch.js');
      await runProjectSwitch(args);
    },
  },
];

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

function renderHelp(commands: readonly ProjectCommand[]): string {
  const header = `Usage: gobbi project <subcommand> [options]`;
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

export async function runProject(args: string[]): Promise<void> {
  return runProjectWithRegistry(args, PROJECT_COMMANDS);
}

/**
 * Registry-parameterised dispatch — exported for tests that need to
 * exercise the dispatcher against a custom registry (unknown-command
 * handling, `--help` rendering).
 */
export async function runProjectWithRegistry(
  args: string[],
  commands: readonly ProjectCommand[],
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
