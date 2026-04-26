/**
 * Shared path + prompt-id helpers for the `gobbi prompt` subcommands.
 *
 * Wave C.1.5+ (issue #156). Centralises:
 *
 *   - The closed prompt-id set (`PROMPT_ID_VALUES`, `PromptId`,
 *     `isPromptId`).
 *   - The on-disk source `spec.json` location resolver
 *     (`resolveSpecsRoot`).
 *   - The on-disk JSONL evolution log location resolver
 *     (`promptEvolutionPath`).
 *   - The active project name resolver (`resolveProjectName`).
 *
 * Centralising these in one module rather than duplicating across the
 * three subcommands prevents the inevitable drift if the same path
 * convention is restated in three places.
 */

import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { getRepoRoot } from '../../lib/repo.js';

// ---------------------------------------------------------------------------
// PromptId — closed enumeration mirroring `events/prompt.ts::PromptId`
// and the SQLite CHECK constraint at `migrations.ts::SQL_CREATE_PROMPT_PATCHES`.
// ---------------------------------------------------------------------------

export const PROMPT_ID_VALUES = [
  'ideation',
  'planning',
  'execution',
  'evaluation',
  'memorization',
  'handoff',
] as const;

export type PromptId = (typeof PROMPT_ID_VALUES)[number];

export function isPromptId(value: string): value is PromptId {
  return (PROMPT_ID_VALUES as readonly string[]).includes(value);
}

// ---------------------------------------------------------------------------
// Source spec.json location
// ---------------------------------------------------------------------------

/**
 * Return the absolute directory containing the source step specs:
 * `packages/cli/src/specs/` resolved from this module's import.meta.url.
 *
 * Operators on the installed CLI do NOT have a `packages/cli/src/specs/`
 * tree under the install dir — patches against the bundled CLI are out
 * of scope for Wave C.1 (synthesis §11 deferral 5). This resolver
 * assumes the source repo layout; render/patch/rebuild commands
 * surface a clear error if the source spec is missing.
 */
export function resolveSpecsRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  // commands/prompt/<file>.ts → ../../specs
  return resolve(here, '..', '..', 'specs');
}

/** Absolute path to a step's `spec.json`. */
export function specJsonPath(promptId: PromptId): string {
  return join(resolveSpecsRoot(), promptId, 'spec.json');
}

// ---------------------------------------------------------------------------
// Project resolution
// ---------------------------------------------------------------------------

/**
 * Resolve the active project name. v0.5.0 defaults the project to
 * `basename(repoRoot)` when no workspace settings name an active project
 * — matches the bootstrap logic in
 * `__tests__/cross-pass-invariant.test.ts:500`. The full settings cascade
 * is read by other commands, but for `gobbi prompt`'s narrow needs the
 * basename fallback is sufficient and avoids loading the settings layer.
 */
export function resolveProjectName(): string {
  const repoRoot = getRepoRoot();
  const settingsPath = join(repoRoot, '.gobbi', 'settings.json');
  if (existsSync(settingsPath)) {
    try {
      const raw = JSON.parse(readFileSync(settingsPath, 'utf8')) as {
        projects?: { active?: unknown };
      };
      const active = raw.projects?.active;
      if (typeof active === 'string' && active.length > 0) return active;
    } catch {
      // Fall through to basename.
    }
  }
  // basename(repoRoot)
  const parts = repoRoot.split(/[\\/]/).filter((p) => p.length > 0);
  return parts[parts.length - 1] ?? 'gobbi';
}

// ---------------------------------------------------------------------------
// JSONL evolution log location
// ---------------------------------------------------------------------------

/**
 * Absolute path to a prompt's JSONL evolution log:
 *
 *   `<repoRoot>/.gobbi/projects/<project>/prompt-evolution/<prompt-id>.jsonl`
 *
 * Per synthesis §7 the path is project-scoped (one chain per project,
 * per prompt). The directory is created on demand by callers that need
 * to write — see {@link ensurePromptEvolutionDir}.
 */
export function promptEvolutionPath(
  projectName: string,
  promptId: PromptId,
): string {
  return join(
    getRepoRoot(),
    '.gobbi',
    'projects',
    projectName,
    'prompt-evolution',
    `${promptId}.jsonl`,
  );
}

/**
 * Ensure the parent directory of {@link promptEvolutionPath} exists.
 * Idempotent.
 */
export function ensurePromptEvolutionDir(
  projectName: string,
  promptId: PromptId,
): void {
  const dir = dirname(promptEvolutionPath(projectName, promptId));
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}
