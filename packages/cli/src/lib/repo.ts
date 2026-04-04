/**
 * Shared repository root utilities.
 *
 * Memoized git repo detection used by audit, docs, and other commands.
 */

import { execSync } from 'node:child_process';
import path from 'node:path';

let cachedRoot: string | undefined;

/** Detect git repo root via git rev-parse. Falls back to cwd on failure. Memoized. */
export function getRepoRoot(): string {
  if (cachedRoot !== undefined) return cachedRoot;
  try {
    cachedRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    cachedRoot = process.cwd();
  }
  return cachedRoot;
}

/** Return the `.claude` directory path within the repo root. */
export function getClaudeDir(): string {
  return path.join(getRepoRoot(), '.claude');
}
