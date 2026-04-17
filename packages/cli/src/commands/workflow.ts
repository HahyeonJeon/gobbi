/**
 * gobbi workflow — subcommand dispatcher for v0.5.0 workflow engine commands.
 *
 * This file owns the `workflow <subcommand>` routing layer. Each subcommand is
 * registered in `WORKFLOW_COMMANDS` and contributes a `run(args)` handler plus
 * a one-line `summary` consumed by `--help`. Help output is derived from the
 * registry — there are no hand-maintained usage strings in this file.
 *
 * ## Scope (PR B / B.4)
 *
 * Only `validate` is wired today. PR C adds `init`, `status`, `events`,
 * `next`, `transition`, `resume`, `guard`, `capture-subagent`, `capture-plan`,
 * and `stop` via new entries in `WORKFLOW_COMMANDS` — the dispatcher does not
 * need to change when those land.
 *
 * ## Extensibility contract
 *
 * A new subcommand is added by importing its module and appending one entry to
 * `WORKFLOW_COMMANDS`. Entry shape:
 *
 *   { name: 'foo', summary: '…', run: (args) => Promise<void> }
 *
 * Registry ordering is preserved in `--help` output so related commands can be
 * grouped by adjacency. `summary` strings are single-line; longer descriptions
 * belong in the subcommand's own `--help`.
 *
 * ## Exit codes
 *
 * - `0` on `--help` / no subcommand.
 * - `1` when the subcommand is unknown.
 * - Subcommand handlers are free to `process.exit(code)` themselves; the
 *   dispatcher does not normalise their exit codes.
 *
 * @see `.claude/project/gobbi/design/v050-cli.md` §Command Structure
 * @see `.claude/project/gobbi/design/v050-cli.md` §Argument Parsing
 */

import { runValidate } from './workflow/validate.js';

// ---------------------------------------------------------------------------
// Command registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the subcommand registry. `run` receives the argv slice AFTER
 * the subcommand name (`process.argv.slice(4)` from the top-level CLI). The
 * handler owns its own flag parsing and is free to exit the process.
 */
export interface WorkflowCommand {
  readonly name: string;
  readonly summary: string;
  readonly run: (args: string[]) => Promise<void>;
}

/**
 * Canonical list of registered subcommands. Ordering controls `--help` output.
 * Add new subcommands by appending to this array; the dispatcher and help
 * printer pick them up automatically.
 *
 * `init` / `status` / `events` use dynamic `import()` so the guard-hook hot
 * path does not pay their load cost at startup. `validate` retains its
 * direct import for the existing test surface.
 */
export const WORKFLOW_COMMANDS: readonly WorkflowCommand[] = [
  {
    name: 'validate',
    summary:
      'Validate the step-spec library, overlays, predicate references, and workflow graph',
    run: runValidate,
  },
  {
    name: 'init',
    summary:
      'Initialise the session directory (metadata.json, gobbi.db, opening events)',
    run: async (args: string[]): Promise<void> => {
      const { runInit } = await import('./workflow/init.js');
      await runInit(args);
    },
  },
  {
    name: 'status',
    summary: 'Read-only projection of the current workflow state',
    run: async (args: string[]): Promise<void> => {
      const { runStatus } = await import('./workflow/status.js');
      await runStatus(args);
    },
  },
  {
    name: 'events',
    summary:
      'Replay events from the active session store (alias for `gobbi session events`)',
    run: async (args: string[]): Promise<void> => {
      const { runEvents } = await import('./workflow/events.js');
      await runEvents(args);
    },
  },
  {
    name: 'next',
    summary: 'Compile and emit the prompt for the current workflow step',
    run: async (args: string[]): Promise<void> => {
      const { runNext } = await import('./workflow/next.js');
      await runNext(args);
    },
  },
  {
    name: 'transition',
    summary:
      'Append a workflow-progression event (COMPLETE, PASS/REVISE/ESCALATE, SKIP, TIMEOUT, FINISH, ABORT, RESUME)',
    run: async (args: string[]): Promise<void> => {
      const { runTransition } = await import('./workflow/transition.js');
      await runTransition(args);
    },
  },
  {
    name: 'resume',
    summary:
      'Resume a workflow from the error state (PR C skeleton — body populated by PR D)',
    run: async (args: string[]): Promise<void> => {
      const { runResume } = await import('./workflow/resume.js');
      await runResume(args);
    },
  },
  {
    name: 'guard',
    summary:
      'PreToolUse hook handler — evaluates guards and emits a permissionDecision JSON response',
    run: async (args: string[]): Promise<void> => {
      const { runGuard } = await import('./workflow/guard.js');
      await runGuard(args);
    },
  },
];

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

function renderHelp(commands: readonly WorkflowCommand[]): string {
  const header = `Usage: gobbi workflow <subcommand> [options]`;
  const commandsSection =
    commands.length === 0
      ? '  (no subcommands registered)'
      : commands
          .map((cmd) => `  ${cmd.name.padEnd(14)}${cmd.summary}`)
          .join('\n');
  const optionsSection = `Options:\n  --help    Show this help message`;
  return `${header}\n\nSubcommands:\n${commandsSection}\n\n${optionsSection}`;
}

// ---------------------------------------------------------------------------
// Top-level handler
// ---------------------------------------------------------------------------

/**
 * Dispatch for `gobbi workflow`. Called from `cli.ts` with
 * `process.argv.slice(3)` — i.e., everything AFTER the `workflow` token.
 *
 * Delegates to the handler registered in `WORKFLOW_COMMANDS` for the
 * requested subcommand. Unknown subcommands produce a non-zero exit with a
 * clear diagnostic line on stderr.
 */
export async function runWorkflow(args: string[]): Promise<void> {
  return runWorkflowWithRegistry(args, WORKFLOW_COMMANDS);
}

/**
 * Registry-parameterised dispatch. Exported for tests that need to exercise
 * the dispatcher against a custom registry (unknown-command handling,
 * `--help` rendering, extensibility smoke test).
 */
export async function runWorkflowWithRegistry(
  args: string[],
  commands: readonly WorkflowCommand[],
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
