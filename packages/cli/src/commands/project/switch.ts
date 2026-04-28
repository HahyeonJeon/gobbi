/**
 * `gobbi project switch <name>` — deprecated no-op (PR-FIN-1c).
 *
 * PR-FIN-1c removed the `Settings.projects` registry. There is no
 * persisted "active project" anymore; the project is resolved per-command
 * from `--project <name>` (or `basename(repoRoot)` when the flag is
 * absent). The symlink-farm rotation that this command used to perform
 * is no longer meaningful — there is nothing to rotate to in the
 * settings tree.
 *
 * The command is preserved as a no-op stub so existing scripts and shell
 * aliases that invoke it do not error out; instead they receive a stderr
 * deprecation note pointing at the `--project` flag and exit 0.
 *
 * Removal candidate for a future cleanup PR.
 */

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi project switch <name>

DEPRECATED (PR-FIN-1c). The 'projects.active' registry was removed; there
is no persisted active project to switch to. Pass '--project <name>' to
each command to address a specific project.

This command is a no-op kept for backward-compatibility with existing
shell aliases / scripts. It prints the deprecation note on stderr and
exits 0.

Options:
  --help, -h    Show this help message`;

// ---------------------------------------------------------------------------
// Overrides (for tests)
// ---------------------------------------------------------------------------

/** Test-time overrides — kept for signature parity with siblings. */
export interface ProjectSwitchOverrides {
  readonly repoRoot?: string;
  readonly tempPidTag?: string;
}

// ---------------------------------------------------------------------------
// Public entry points
// ---------------------------------------------------------------------------

export async function runProjectSwitch(args: string[]): Promise<void> {
  await runProjectSwitchWithOptions(args, {});
}

export async function runProjectSwitchWithOptions(
  args: string[],
  _overrides: ProjectSwitchOverrides,
): Promise<void> {
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }

  // Match historical positional shape so callers passing a name don't
  // see a flag-parse error — but we don't act on the value.
  const positional = args.find((a) => !a.startsWith('-'));
  const target = positional ?? '<name>';

  process.stderr.write(
    `gobbi project switch: deprecated no-op (PR-FIN-1c).\n` +
      `  The 'projects.active' registry was removed; pass '--project ${target}'\n` +
      `  to each command to address a specific project.\n`,
  );
}

// ---------------------------------------------------------------------------
// Exports for tests
// ---------------------------------------------------------------------------

export { USAGE as PROJECT_SWITCH_USAGE };
