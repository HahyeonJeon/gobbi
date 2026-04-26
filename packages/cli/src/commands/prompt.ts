/**
 * gobbi prompt — subcommand dispatcher for prompts-as-data operations.
 *
 * Mirrors `commands/maintenance.ts` exactly: a `readonly PromptCommand[]`
 * registry, help derived from the registry, and a separate
 * registry-parameterised dispatch for tests. Sub-handlers are
 * dynamic-`import()`-ed so unrelated namespaces pay no cold-start cost.
 *
 * ## Scope (Wave C.1)
 *
 *   - `render`  (Wave C.1.5) — render a per-step `spec.json` in
 *                              `markdown` / `composed` / `diff` form.
 *   - `patch`   (Wave C.1.6) — apply an RFC 6902 patch to a per-step
 *                              `spec.json` (operator-only, atomic).
 *   - `rebuild` (Wave C.1.7) — materialize `spec.json` from the JSONL
 *                              evolution chain (recovery path).
 *
 * Per the design synthesis lock 3, the patch flow is operator-only via
 * CLI; the orchestrator never mutates prompts mid-session. This
 * dispatcher and its three subcommands are the only authorised
 * mutation surface for `spec.json` files.
 *
 * ## Source vs. installed CLI
 *
 * `gobbi prompt patch` and `gobbi prompt rebuild` mutate the source
 * `spec.json` files at `packages/cli/src/specs/<step>/spec.json` —
 * NOT the bundled `dist/` build output. Operators running the
 * installed CLI cannot patch installed prompts; they must patch the
 * source repo and rebuild. Each subcommand's `--help` text restates
 * this constraint per Overall F-1's deferral.
 *
 * ## Exit codes
 *
 *   - `0` on `--help` / no subcommand.
 *   - `1` when the subcommand is unknown.
 *   - Subcommand handlers own their own exit codes.
 */

// ---------------------------------------------------------------------------
// Registry shape
// ---------------------------------------------------------------------------

/**
 * One entry in the `prompt` subcommand registry. `run` receives the
 * argv slice AFTER the subcommand name. The handler owns its own flag
 * parsing and is free to exit the process.
 */
export interface PromptCommand {
  readonly name: string;
  readonly summary: string;
  readonly run: (args: string[]) => Promise<void>;
}

/**
 * Canonical list of registered subcommands. Ordering controls `--help`
 * output. Each handler is dynamic-imported to keep cold-starts lean.
 */
export const PROMPT_COMMANDS: readonly PromptCommand[] = [
  {
    name: 'render',
    summary:
      'Render a per-step spec.json (--format=markdown | composed | diff)',
    run: async (args: string[]): Promise<void> => {
      const { runPromptRender } = await import('./prompt/render.js');
      await runPromptRender(args);
    },
  },
  {
    name: 'patch',
    summary: 'Apply an RFC 6902 patch to a per-step spec.json (operator-only)',
    run: async (args: string[]): Promise<void> => {
      const { runPromptPatch } = await import('./prompt/patch.js');
      await runPromptPatch(args);
    },
  },
];

// ---------------------------------------------------------------------------
// Help rendering
// ---------------------------------------------------------------------------

function renderHelp(commands: readonly PromptCommand[]): string {
  const header = `Usage: gobbi prompt <subcommand> [options]`;
  const pad = commands.reduce((w, c) => Math.max(w, c.name.length), 0) + 2;
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

export async function runPrompt(args: string[]): Promise<void> {
  return runPromptWithRegistry(args, PROMPT_COMMANDS);
}

/**
 * Registry-parameterised dispatch — exported for tests that need to
 * exercise the dispatcher against a custom registry (unknown-command
 * handling, `--help` rendering).
 */
export async function runPromptWithRegistry(
  args: string[],
  commands: readonly PromptCommand[],
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
