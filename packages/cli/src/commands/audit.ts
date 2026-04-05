/**
 * gobbi audit — Documentation drift detection (CLI wrapper).
 *
 * Thin command layer that delegates to the audit library in
 * `lib/docs/audit.ts` and formats output for backward compatibility.
 *
 * Subcommands:
 *   references [directory]   Check markdown links and backtick paths resolve
 *   conventions [directory]  Validate SKILL.md names and navigation links
 *   commands [directory]     Verify shell commands in code blocks exist
 */

import path from 'node:path';
import { getRepoRoot } from '../lib/repo.js';
import {
  auditReferences,
  auditConventions,
  auditCommands,
} from '../lib/docs/audit.js';
import type { Finding } from '../lib/docs/health.js';

// ---------------------------------------------------------------------------
// Usage strings
// ---------------------------------------------------------------------------

const USAGE = `Usage: gobbi audit <subcommand> [directory]

Subcommands:
  references [directory]   Check markdown links and backtick paths resolve
  conventions [directory]  Validate SKILL.md names and navigation links
  commands [directory]     Verify shell commands in code blocks exist

Options:
  --help    Show this help message`;

// ---------------------------------------------------------------------------
// Output formatting helpers
// ---------------------------------------------------------------------------

/**
 * Map a finding category to the correct CLI output prefix.
 * Categories from references/commands use `STALE:`, conventions use `MISMATCH:`.
 */
function getOutputPrefix(category: string): string {
  switch (category) {
    case 'stale-reference':
    case 'stale-command':
      return 'STALE:';
    case 'naming-mismatch':
    case 'broken-nav-link':
    case 'stale-directory-claim':
      return 'MISMATCH:';
    default:
      return 'FINDING:';
  }
}

/**
 * Format a finding into the original CLI output line.
 *
 * Reconstructs the `STALE:` / `MISMATCH:` line format from structured
 * Finding data. Uses path.join so the output preserves the caller's path
 * style (relative in → relative out, absolute in → absolute out).
 */
function formatFindingLine(finding: Finding, scanDir: string): string {
  const prefix = getOutputPrefix(finding.category);
  // Use path.join (not path.resolve) so the output preserves the caller's
  // path style: relative scanDir → relative output, absolute → absolute.
  const filePath = path.join(scanDir, finding.path);

  // Parse "line N: description" from the message
  const lineMatch = /^line (\d+): (.+)$/.exec(finding.message);
  if (lineMatch !== null) {
    const lineNum = lineMatch[1] ?? '0';
    const desc = lineMatch[2] ?? '';

    // Reconstruct the original format based on category
    switch (finding.category) {
      case 'stale-reference': {
        // desc is "broken markdown link -> ref" or "broken backtick path -> ref"
        if (desc.startsWith('broken markdown link')) {
          const ref = desc.replace('broken markdown link -> ', '');
          return `${prefix} ${filePath}:${lineNum}  link -> ${ref}`;
        }
        if (desc.startsWith('broken backtick path')) {
          const ref = desc.replace('broken backtick path -> ', '');
          return `${prefix} ${filePath}:${lineNum}  backtick -> ${ref}`;
        }
        return `${prefix} ${filePath}:${lineNum}  ${desc}`;
      }
      case 'naming-mismatch':
        // desc is "frontmatter name 'X' != directory name 'Y'"
        return `${prefix} ${filePath}:${lineNum}  ${desc}`;
      case 'broken-nav-link':
        // desc is "navigation link -> ref (not found)"
        // Original format: "table link -> ref (not found)"
        return `${prefix} ${filePath}:${lineNum}  ${desc.replace('navigation link', 'table link')}`;
      case 'stale-directory-claim':
        // desc is "directory claim -> ref (not found)"
        return `${prefix} ${filePath}:${lineNum}  ${desc}`;
      case 'stale-command': {
        // desc is "command -> cleanToken not found on PATH"
        const cmdMatch = /^command -> (.+) not found on PATH$/.exec(desc);
        if (cmdMatch !== null) {
          const cleanToken = cmdMatch[1] ?? '';
          return `${prefix} ${filePath}:${lineNum}  command -> ${cleanToken}`;
        }
        return `${prefix} ${filePath}:${lineNum}  ${desc}`;
      }
      default:
        return `${prefix} ${filePath}:${lineNum}  ${desc}`;
    }
  }

  // Fallback for messages that don't match the pattern
  return `${prefix} ${filePath}  ${finding.message}`;
}

// ---------------------------------------------------------------------------
// Top-level router
// ---------------------------------------------------------------------------

/**
 * Top-level handler for `gobbi audit`. Dispatches to subcommands.
 * Called from cli.ts with process.argv.slice(3).
 */
export async function runAudit(args: string[]): Promise<void> {
  const subcommand = args[0];

  switch (subcommand) {
    case 'references':
      await runAuditReferencesCmd(args.slice(1));
      break;
    case 'conventions':
      await runAuditConventionsCmd(args.slice(1));
      break;
    case 'commands':
      await runAuditCommandsCmd(args.slice(1));
      break;
    case '--help':
      console.error('Warning: `gobbi audit` is deprecated. Use `gobbi doctor` instead.');
      console.log(USAGE);
      break;
    case undefined: {
      console.error('Warning: `gobbi audit` is deprecated. Use `gobbi doctor` instead.');
      const { runDoctor } = await import('./doctor.js');
      await runDoctor(args);
      return;
    }
    default:
      console.error(`Unknown subcommand: ${subcommand}`);
      console.log(USAGE);
      process.exit(1);
  }
}

// ---------------------------------------------------------------------------
// Subcommand wrappers
// ---------------------------------------------------------------------------

async function runAuditReferencesCmd(args: string[]): Promise<void> {
  const repoRoot = getRepoRoot();
  const scanDir = args[0] ?? path.join(repoRoot, '.claude/skills/');

  let findings: Finding[];
  try {
    findings = await auditReferences({ directory: scanDir, repoRoot });
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }

  for (const finding of findings) {
    console.log(formatFindingLine(finding, scanDir));
  }

  if (findings.length > 0) {
    console.log('');
    console.log(`Found ${findings.length} stale reference(s).`);
    process.exit(1);
  } else {
    console.log('All references valid.');
  }
}

async function runAuditConventionsCmd(args: string[]): Promise<void> {
  const repoRoot = getRepoRoot();
  const scanDir = args[0] ?? path.join(repoRoot, '.claude/skills/');

  let findings: Finding[];
  try {
    findings = await auditConventions({ directory: scanDir, repoRoot });
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }

  for (const finding of findings) {
    console.log(formatFindingLine(finding, scanDir));
  }

  if (findings.length > 0) {
    console.log('');
    console.log(`Found ${findings.length} structural mismatch(es).`);
    process.exit(1);
  } else {
    console.log('All structural claims consistent.');
  }
}

async function runAuditCommandsCmd(args: string[]): Promise<void> {
  const repoRoot = getRepoRoot();
  const scanDir = args[0] ?? path.join(repoRoot, '.claude/skills/');

  let findings: Finding[];
  try {
    findings = await auditCommands({ directory: scanDir, repoRoot });
  } catch (err) {
    console.error(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }

  for (const finding of findings) {
    console.log(formatFindingLine(finding, scanDir));
  }

  if (findings.length > 0) {
    console.log('');
    console.log(`Found ${findings.length} stale command(s).`);
    process.exit(1);
  } else {
    console.log('All commands verified.');
  }
}
