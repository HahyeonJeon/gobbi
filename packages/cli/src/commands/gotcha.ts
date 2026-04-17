/**
 * gobbi gotcha — subcommand dispatcher for the top-level `gotcha` namespace.
 *
 * Mirrors the shape of `commands/workflow.ts` exactly: a
 * `readonly GotchaCommand[]` registry, `renderHelp` derived from it, and
 * `runGotchaWithRegistry` exported for tests to exercise the dispatcher
 * against a custom registry. Sub-handlers are dynamic-`import()`-ed so the
 * top-level command dispatcher pays no load cost at startup for unused
 * namespaces.
 *
 * ## Scope (PR C / Wave 9)
 *
 * Ships `promote` only. Future sub-commands (`list`, `install`, ...) can
 * be appended to `GOTCHA_COMMANDS` without touching the dispatcher body.
 *
 * ## Exit codes
 *
 *   - `0` on `--help` / no subcommand.
 *   - `1` when the subcommand is unknown.
 *   - Subcommand handlers own their own exit codes.
 *
 * @see `.claude/project/gobbi/design/v050-cli.md` §`gobbi gotcha` commands
 */

// ---------------------------------------------------------------------------
// Registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the `gotcha` subcommand registry. `run` receives the argv
 * slice AFTER the subcommand name. The handler owns its own flag parsing
 * and is free to exit the process.
 *
 * Mirrors `WorkflowCommand` in `commands/workflow.ts` deliberately so both
 * dispatch layers are visually identical.
 */
export interface GotchaCommand {
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
export const GOTCHA_COMMANDS: readonly GotchaCommand[] = [
  {
    name: 'promote',
    summary:
      'Move gotcha drafts from .gobbi/project/gotchas/ into .claude/ (refuses during active sessions)',
    run: async (args: string[]): Promise<void> => {
      const { runPromote } = await import('./gotcha/promote.js');
      await runPromote(args);
    },
  },
];

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

function renderHelp(commands: readonly GotchaCommand[]): string {
  const header = `Usage: gobbi gotcha <subcommand> [options]`;
  const commandsSection =
    commands.length === 0
      ? '  (no subcommands registered)'
      : commands
          .map((cmd) => `  ${cmd.name.padEnd(12)}${cmd.summary}`)
          .join('\n');
  const optionsSection = `Options:\n  --help    Show this help message`;
  return `${header}\n\nSubcommands:\n${commandsSection}\n\n${optionsSection}`;
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

/**
 * Dispatch for `gobbi gotcha`. Called from `cli.ts` with the argv slice
 * AFTER the `gotcha` token — i.e., everything the user typed after
 * `gobbi gotcha`. Delegates to the handler registered in
 * `GOTCHA_COMMANDS`. Unknown subcommands produce a non-zero exit with a
 * diagnostic line on stderr.
 */
export async function runGotcha(args: string[]): Promise<void> {
  return runGotchaWithRegistry(args, GOTCHA_COMMANDS);
}

/**
 * Registry-parameterised dispatch — exported for tests that need to
 * exercise the dispatcher against a custom registry (unknown-command
 * handling, `--help` rendering, extensibility smoke test).
 */
export async function runGotchaWithRegistry(
  args: string[],
  commands: readonly GotchaCommand[],
): Promise<void> {
  const subcommand = args[0];

  if (subcommand === undefined || subcommand === '--help' || subcommand === '-h') {
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
