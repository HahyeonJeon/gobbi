/**
 * Doctor computation library — types and pure functions for the `gobbi doctor`
 * command.
 *
 * Computes project health status, maturity level, completeness inventory,
 * and human-readable summaries from filesystem state and findings. No
 * orchestration, no console output — consumed by the doctor orchestrator
 * and CLI wrapper.
 */

import { existsSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import type { Finding } from './health.js';

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type DoctorStatus = 'clean' | 'attention-needed' | 'degraded';
export type MaturityLevel = 0 | 1 | 2 | 3 | 4;

export interface CompletenessReport {
  score: number;        // 0.0 - 1.0
  missing: string[];    // e.g., "CLAUDE.md", "rules directory"
  present: string[];
}

export interface DoctorReport {
  status: DoctorStatus;
  maturityLevel: MaturityLevel;
  findings: Finding[];
  completeness: CompletenessReport;
  summary: string;
}

// ---------------------------------------------------------------------------
// Maturity level labels
// ---------------------------------------------------------------------------

const MATURITY_LABELS: readonly string[] = [
  'None',
  'Bootstrap',
  'Structured',
  'Active',
  'Self-Sustaining',
];

// ---------------------------------------------------------------------------
// computeStatus
// ---------------------------------------------------------------------------

/**
 * Derive overall status from a set of findings.
 *
 * - `'degraded'` if any finding has severity `'error'`
 * - `'attention-needed'` if any finding has severity `'warning'`
 * - `'clean'` otherwise (info-only or empty)
 */
export function computeStatus(findings: Finding[]): DoctorStatus {
  let hasWarning = false;
  for (const finding of findings) {
    if (finding.severity === 'error') {
      return 'degraded';
    }
    if (finding.severity === 'warning') {
      hasWarning = true;
    }
  }
  return hasWarning ? 'attention-needed' : 'clean';
}

// ---------------------------------------------------------------------------
// computeMaturityLevel
// ---------------------------------------------------------------------------

/**
 * Compute the maturity level of a `.claude/` project setup.
 *
 * - L0: `.claude/` directory does not exist
 * - L1: `CLAUDE.md` exists in repoRoot
 * - L2: L1 + `.claude/project/` exists + at least 1 skill or agent
 * - L3: L2 + rules with content + gotcha file + 3+ total skills/agents + 0 errors
 * - L4: L3 + every doc .md has a .json peer + 0 errors + 0 warnings
 */
export async function computeMaturityLevel(
  claudeDir: string,
  repoRoot: string,
  errorCount: number,
  warningCount: number,
): Promise<MaturityLevel> {
  // L0: .claude/ does not exist
  if (!existsSync(claudeDir)) {
    return 0;
  }

  // L1: CLAUDE.md exists in repoRoot
  if (!existsSync(path.join(repoRoot, 'CLAUDE.md'))) {
    return 0;
  }

  // L2 checks: project/ directory + at least 1 skill or agent
  const projectDir = path.join(claudeDir, 'project');
  if (!existsSync(projectDir)) {
    return 1;
  }

  const skillCount = countSkills(claudeDir);
  const agentCount = countAgents(claudeDir);
  const totalSkillsAgents = skillCount + agentCount;

  if (totalSkillsAgents < 1) {
    return 1;
  }

  // L3 checks: rules + gotchas + 3+ skills/agents + 0 errors
  const rulesDir = path.join(claudeDir, 'rules');
  const hasRules = existsSync(rulesDir) && countFilesWithExtensions(rulesDir, ['.md', '.json']) >= 1;
  const hasGotcha = hasGotchaFile(claudeDir);

  if (!hasRules || !hasGotcha || totalSkillsAgents < 3 || errorCount > 0) {
    return 2;
  }

  // L4 checks: all docs have JSON peers + 0 errors + 0 warnings
  if (errorCount > 0 || warningCount > 0) {
    return 3;
  }

  if (!allDocsHaveJsonPeers(claudeDir)) {
    return 3;
  }

  return 4;
}

// ---------------------------------------------------------------------------
// computeCompleteness
// ---------------------------------------------------------------------------

/**
 * Compute a baseline completeness inventory of `.claude/` artifacts.
 *
 * Checks for:
 * - CLAUDE.md in repoRoot
 * - `.claude/` directory
 * - `skills/` with at least 1 skill
 * - `agents/` with at least 1 agent
 * - `rules/` with at least 1 rule
 * - `project/` directory
 * - `settings.json` in `.claude/`
 * - At least 1 gotcha file
 */
export async function computeCompleteness(
  claudeDir: string,
  repoRoot: string,
): Promise<CompletenessReport> {
  const present: string[] = [];
  const missing: string[] = [];

  function check(label: string, condition: boolean): void {
    if (condition) {
      present.push(label);
    } else {
      missing.push(label);
    }
  }

  check('CLAUDE.md', existsSync(path.join(repoRoot, 'CLAUDE.md')));
  check('.claude/ directory', existsSync(claudeDir));
  check('skills/ with content', countSkills(claudeDir) >= 1);
  check('agents/ with content', countAgents(claudeDir) >= 1);
  check(
    'rules/ with content',
    existsSync(path.join(claudeDir, 'rules'))
      && countFilesWithExtensions(path.join(claudeDir, 'rules'), ['.md', '.json']) >= 1,
  );
  check('project/ directory', existsSync(path.join(claudeDir, 'project')));
  check('settings.json', existsSync(path.join(claudeDir, 'settings.json')));
  check('gotcha file', hasGotchaFile(claudeDir));

  const total = present.length + missing.length;
  const score = total > 0 ? present.length / total : 0;

  return { score, missing, present };
}

// ---------------------------------------------------------------------------
// generateSummary
// ---------------------------------------------------------------------------

/**
 * Produce a 2-3 line human-readable summary for the doctor report.
 */
export function generateSummary(
  status: DoctorStatus,
  maturityLevel: MaturityLevel,
  errorCount: number,
  warningCount: number,
  completeness: CompletenessReport,
): string {
  const label = MATURITY_LABELS[maturityLevel] ?? 'Unknown';
  const statusDisplay = formatStatus(status);
  const lines: string[] = [];

  // Line 1: status + maturity
  lines.push(`${statusDisplay} — Maturity Level ${maturityLevel} (${label})`);

  // Line 2: finding counts (only if non-zero)
  if (errorCount > 0 || warningCount > 0) {
    const parts: string[] = [];
    if (errorCount > 0) {
      parts.push(`${errorCount} error${errorCount === 1 ? '' : 's'}`);
    }
    if (warningCount > 0) {
      parts.push(`${warningCount} warning${warningCount === 1 ? '' : 's'}`);
    }
    lines.push(parts.join(', '));
  }

  // Line 3: next step for maturity progression
  const nextStep = getNextStep(maturityLevel, completeness);
  if (nextStep !== undefined) {
    lines.push(nextStep);
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Format the status label for display. */
function formatStatus(status: DoctorStatus): string {
  switch (status) {
    case 'clean':
      return 'Clean';
    case 'attention-needed':
      return 'Attention Needed';
    case 'degraded':
      return 'Degraded';
  }
}

/**
 * Count skill directories — a directory under `skills/` that contains
 * `SKILL.md` or `SKILL.json`.
 */
function countSkills(claudeDir: string): number {
  const skillsDir = path.join(claudeDir, 'skills');
  if (!existsSync(skillsDir)) {
    return 0;
  }

  let count = 0;
  let entries: string[];
  try {
    entries = readdirSync(skillsDir, { encoding: 'utf8' });
  } catch {
    return 0;
  }

  for (const name of entries) {
    const fullPath = path.join(skillsDir, name);
    try {
      if (!statSync(fullPath).isDirectory()) continue;
    } catch {
      continue;
    }
    if (
      existsSync(path.join(fullPath, 'SKILL.md'))
      || existsSync(path.join(fullPath, 'SKILL.json'))
    ) {
      count += 1;
    }
  }
  return count;
}

/**
 * Count agent files — `.md` or `.json` files directly in `agents/`.
 * Excludes `gotchas.md`, `gotchas.json`, and `README.md`.
 */
function countAgents(claudeDir: string): number {
  const agentsDir = path.join(claudeDir, 'agents');
  if (!existsSync(agentsDir)) {
    return 0;
  }

  const EXCLUDED_NAMES: ReadonlySet<string> = new Set([
    'gotchas.md',
    'gotchas.json',
    'README.md',
  ]);

  let count = 0;
  let entries: string[];
  try {
    entries = readdirSync(agentsDir, { encoding: 'utf8' });
  } catch {
    return 0;
  }

  for (const name of entries) {
    if (EXCLUDED_NAMES.has(name)) continue;
    if (!name.endsWith('.md') && !name.endsWith('.json')) continue;
    const fullPath = path.join(agentsDir, name);
    try {
      if (statSync(fullPath).isFile()) {
        count += 1;
      }
    } catch {
      continue;
    }
  }
  return count;
}

/**
 * Count files with given extensions directly in a directory (non-recursive).
 */
function countFilesWithExtensions(dir: string, extensions: readonly string[]): number {
  if (!existsSync(dir)) {
    return 0;
  }

  let count = 0;
  let entries: string[];
  try {
    entries = readdirSync(dir, { encoding: 'utf8' });
  } catch {
    return 0;
  }

  for (const name of entries) {
    if (extensions.some((ext) => name.endsWith(ext))) {
      const fullPath = path.join(dir, name);
      try {
        if (statSync(fullPath).isFile()) {
          count += 1;
        }
      } catch {
        continue;
      }
    }
  }
  return count;
}

/**
 * Check if any `gotchas.md` or `gotchas.json` file exists anywhere under
 * the `.claude/` tree. Returns true on first hit.
 */
function hasGotchaFile(claudeDir: string): boolean {
  if (!existsSync(claudeDir)) {
    return false;
  }
  return findGotchaRecursive(claudeDir);
}

function findGotchaRecursive(dir: string): boolean {
  let entries: string[];
  try {
    entries = readdirSync(dir, { encoding: 'utf8' });
  } catch {
    return false;
  }

  for (const name of entries) {
    if (name === 'gotchas.md' || name === 'gotchas.json') {
      const fullPath = path.join(dir, name);
      try {
        if (statSync(fullPath).isFile()) {
          return true;
        }
      } catch {
        continue;
      }
    }

    const fullPath = path.join(dir, name);
    try {
      if (statSync(fullPath).isDirectory()) {
        if (findGotchaRecursive(fullPath)) {
          return true;
        }
      }
    } catch {
      continue;
    }
  }
  return false;
}

/**
 * Check that every `.md` file in `skills/`, `agents/`, and `rules/` has a
 * corresponding `.json` peer. Excludes `CLAUDE.md`, `README.md`, settings
 * files, and anything under `project/` or `note/`.
 */
function allDocsHaveJsonPeers(claudeDir: string): boolean {
  const EXCLUDED_FILENAMES: ReadonlySet<string> = new Set([
    'CLAUDE.md',
    'README.md',
  ]);

  const dirsToCheck = ['skills', 'agents', 'rules'] as const;

  for (const dirName of dirsToCheck) {
    const dir = path.join(claudeDir, dirName);
    if (!existsSync(dir)) continue;

    if (!checkJsonPeersRecursive(dir, EXCLUDED_FILENAMES)) {
      return false;
    }
  }

  return true;
}

function checkJsonPeersRecursive(
  dir: string,
  excludedNames: ReadonlySet<string>,
): boolean {
  let entries: string[];
  try {
    entries = readdirSync(dir, { encoding: 'utf8' });
  } catch {
    return true;
  }

  for (const name of entries) {
    const fullPath = path.join(dir, name);

    try {
      const st = statSync(fullPath);

      if (st.isDirectory()) {
        if (!checkJsonPeersRecursive(fullPath, excludedNames)) {
          return false;
        }
      } else if (st.isFile() && name.endsWith('.md')) {
        if (excludedNames.has(name)) continue;

        const jsonPeer = fullPath.replace(/\.md$/, '.json');
        if (!existsSync(jsonPeer)) {
          return false;
        }
      }
    } catch {
      continue;
    }
  }

  return true;
}

/**
 * Suggest the next action to reach the next maturity level.
 */
function getNextStep(
  maturityLevel: MaturityLevel,
  completeness: CompletenessReport,
): string | undefined {
  switch (maturityLevel) {
    case 0:
      return 'Create a CLAUDE.md and .claude/ directory to reach Level 1\nRun `gobbi docs genome` for tailored project suggestions';
    case 1:
      return 'Add a project/ directory and at least one skill or agent to reach Level 2\nRun `gobbi docs genome` for tailored project suggestions';
    case 2: {
      const hints: string[] = [];
      if (completeness.missing.includes('rules/ with content')) {
        hints.push('Add rules');
      }
      if (completeness.missing.includes('gotcha file')) {
        hints.push('add a gotcha file');
      }
      hints.push('have 3+ skills/agents');
      hints.push('resolve all errors to reach Level 3');
      return `${hints.join(', ')}\nRun \`gobbi docs genome\` for tailored project suggestions`;
    }
    case 3:
      return 'Add JSON sources for all docs to reach Level 4';
    case 4:
      return undefined;
  }
}
