/**
 * Styled CLI output helpers for gobbi commands.
 *
 * Respects NO_COLOR, FORCE_COLOR, and TTY detection:
 * - FORCE_COLOR set (any non-empty value) — colors always on
 * - NO_COLOR set (any non-empty value) — colors off, structural text (banner) still shown in plain
 * - stdout not a TTY (piped) — both colors and banner disabled
 */

// ---------------------------------------------------------------------------
// Color / TTY detection
// ---------------------------------------------------------------------------

/** Whether ANSI color output is enabled. */
const colorsEnabled: boolean = (() => {
  const forceColor: string | undefined = process.env['FORCE_COLOR'];
  if (forceColor !== undefined) return true;

  const noColor: string | undefined = process.env['NO_COLOR'];
  if (noColor !== undefined) return false;

  return process.stdout.isTTY === true;
})();

/** Whether stdout is a TTY (controls banner display). */
const isTTY: boolean = process.stdout.isTTY === true;

// ---------------------------------------------------------------------------
// ANSI escape helpers
// ---------------------------------------------------------------------------

const ESC = '\x1b[';
const RESET = `${ESC}0m`;

function wrap(code: string, text: string): string {
  if (!colorsEnabled) return text;
  return `${ESC}${code}m${text}${RESET}`;
}

/** Wrap text in green. */
export function green(text: string): string {
  return wrap('32', text);
}

/** Wrap text in yellow. */
export function yellow(text: string): string {
  return wrap('33', text);
}

/** Wrap text in red. */
export function red(text: string): string {
  return wrap('31', text);
}

/** Wrap text in bold. */
export function bold(text: string): string {
  return wrap('1', text);
}

/** Wrap text in dim. */
export function dim(text: string): string {
  return wrap('2', text);
}

// ---------------------------------------------------------------------------
// Status line helpers
// ---------------------------------------------------------------------------

/**
 * Format a success status line.
 * Returns `  ✓ msg` in green when colors are enabled, `  [ok] msg` otherwise.
 */
export function ok(msg: string): string {
  if (colorsEnabled) {
    return green(`  ✓ ${msg}`);
  }
  return `  [ok] ${msg}`;
}

/**
 * Format a skipped status line.
 * Returns `  - msg` in yellow when colors are enabled, `  [--] msg` otherwise.
 */
export function skip(msg: string): string {
  if (colorsEnabled) {
    return yellow(`  - ${msg}`);
  }
  return `  [--] ${msg}`;
}

/**
 * Format an error status line.
 * Returns `  ✗ msg` in red when colors are enabled, `  [error] msg` otherwise.
 */
export function error(msg: string): string {
  if (colorsEnabled) {
    return red(`  ✗ ${msg}`);
  }
  return `  [error] ${msg}`;
}

// ---------------------------------------------------------------------------
// Section header
// ---------------------------------------------------------------------------

/**
 * Format a section header — bold green text for phase labels.
 */
export function header(text: string): string {
  return bold(green(text));
}

// ---------------------------------------------------------------------------
// Banner
// ---------------------------------------------------------------------------

const BANNER_ART = `  ██████╗  ██████╗ ██████╗ ██████╗ ██╗
 ██╔════╝ ██╔═══██╗██╔══██╗██╔══██╗██║
 ██║  ███╗██║   ██║██████╔╝██████╔╝██║
 ██║   ██║██║   ██║██╔══██╗██╔══██╗██║
 ╚██████╔╝╚██████╔╝██████╔╝██████╔╝██║
  ╚═════╝  ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝`;

/** Banner art width (columns needed to display it). */
const BANNER_WIDTH = 38;

/** Minimum terminal width required to show the full banner art. */
const MIN_TERMINAL_WIDTH = 55;

/**
 * Print the gobbi banner to stdout.
 *
 * - When not a TTY: skips the banner entirely.
 * - When terminal is too narrow (< 55 columns): prints a compact fallback.
 * - When NO_COLOR is set: prints the art and version without ANSI colors.
 */
export function printBanner(version: string): void {
  if (!isTTY) return;

  const cols: number | undefined = process.stdout.columns;

  if (cols === undefined || cols < MIN_TERMINAL_WIDTH) {
    // Compact fallback
    console.log('');
    console.log(bold(green(`gobbi v${version}`)));
    console.log('');
    return;
  }

  // Full banner
  console.log('');
  console.log(green(BANNER_ART));

  // Version text — right-aligned within the banner width
  const versionText = `v${version}`;
  const padding = BANNER_WIDTH - versionText.length;
  const paddedVersion = padding > 0 ? ' '.repeat(padding) + versionText : versionText;
  console.log(dim(paddedVersion));
  console.log('');
}

// ---------------------------------------------------------------------------
// Summary helpers
// ---------------------------------------------------------------------------

/**
 * Print the styled success message for init with next steps.
 */
export function printInitSuccess(): void {
  console.log('');
  console.log(bold(green('Gobbi installed successfully!')));
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Start a Claude Code session and type ${bold('/gobbi')} to begin.`);
  console.log(`  Run ${bold('/gobbi-notification')} in Claude Code to configure notification credentials.`);
}

/**
 * Print the styled success message for update with preserved items.
 */
export function printUpdateSuccess(): void {
  console.log('');
  console.log(bold(green('Gobbi updated successfully!')));
  console.log('');
  console.log('Preserved:');
  console.log(`  ${dim('-')} .claude/skills/gobbi-hack/ (user customizations)`);
  console.log(`  ${dim('-')} .claude/project/ (project state)`);
}
