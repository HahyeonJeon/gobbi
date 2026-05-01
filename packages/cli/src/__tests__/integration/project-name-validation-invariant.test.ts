/**
 * Project-name validation invariant (PR-CFM-D / #187 part 5).
 *
 * Greps every `packages/cli/src/commands/**\/*.ts` (excluding `__tests__/`)
 * for either:
 *
 *   1. A direct `path.join(<…>, '.gobbi', 'projects', <…>)` token sequence, OR
 *   2. A call to a canonical project/session-path helper:
 *      `projectDir(`, `projectSubdir(`, `projectSettingsPath(`,
 *      `sessionSettingsPath(`, `sessionDirForProject(`, `projectJsonPath(`,
 *      `sessionJsonPath(`.
 *
 * For every matching file, the test asserts the source `import`s
 * `validateProjectName` OR `assertValidProjectNameOrExit` from
 * `lib/project-name`. The intent is to keep future entry-point consumers
 * from quietly skipping the validator that PR-CFM-D wired into install /
 * workflow init / config init.
 *
 * Allow-list shape mirrors `__tests__/integration/jsonpivot-drift.test.ts`
 * (auditable file-level entries with a `rationale` field). This list is
 * INTENTIONALLY a SECOND list, distinct from `jsonpivot-drift.test.ts`'s
 * 41-entry allow-list — the two detectors guard different invariants.
 *
 * F-OVR-1 annotation form (locked at planning time): every deferred-scope
 * entry's rationale uses the literal phrase "follow-up filed at merge time
 * per L12". No `#TBD`, no `TODO`, no issue numbers at commit time. The
 * orchestrator may patch the issue # in a follow-up commit AFTER PR merge.
 *
 * Self-validating files NOT in the allow-list (intentional): `config.ts`,
 * `commands/install.ts`, `commands/project/create.ts`,
 * `commands/workflow/init.ts`. Each of these imports `validateProjectName`
 * or `assertValidProjectNameOrExit` from `lib/project-name`, so the
 * invariant assertion passes for them with no allow-list entry. Adding an
 * allow-list entry for a file that already satisfies the invariant would
 * be self-contradictory (mirrors the F-OVR-1 remediation that excluded
 * `commands/project/create.ts`). Note: `config.ts` only validates in
 * `runInit`; the deferred `runGet/runSet/runExplain/runList/runEnv`
 * branches are tracked by the L12 follow-up filed at PR merge time.
 *
 * The grep is INTENTIONALLY token-level (no AST parse) — the invariant we
 * care about is "file imports the validator", not "every individual
 * call-site is gated". The file-level import is the auditable hinge.
 */

import { describe, expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Glob } from 'bun';

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

// `__tests__/integration/project-name-validation-invariant.test.ts` ->
// `packages/cli/`. Walk back: `integration` → `__tests__` → `src` → `cli`
// (3 levels). Mirrors `jsonpivot-drift.test.ts`'s walk to REPO_ROOT but
// stops at the package root because we only scan inside `src/commands/`.
const CLI_PKG_ROOT = resolve(THIS_DIR, '..', '..', '..');

// ---------------------------------------------------------------------------
// Predicate: which files MUST validate?
// ---------------------------------------------------------------------------

/**
 * A file matches the validation-required predicate if it contains either
 * (a) a `path.join(...)` call whose argument list, in textual order,
 * names `.gobbi` adjacent-followed-by `projects`, OR (b) a call to one
 * of the canonical helpers below.
 *
 * The `path.join` regex tolerates whitespace + newlines between tokens
 * (multi-line `path.join` calls are common). It does NOT match calls
 * that wrap the literals in variables — that is a deliberate trade-off:
 * the invariant we enforce is at the textual entry-point, where the
 * raw `--project` payload is most likely to land.
 */
const PATH_JOIN_PATTERN =
  /path\.join\s*\([^)]*['"]\.gobbi['"][^)]*['"]projects['"][^)]*\)/s;

const HELPER_PATTERNS: readonly RegExp[] = [
  /\bprojectDir\s*\(/,
  /\bprojectSubdir\s*\(/,
  /\bprojectSettingsPath\s*\(/,
  /\bsessionSettingsPath\s*\(/,
  /\bsessionDirForProject\s*\(/,
  /\bprojectJsonPath\s*\(/,
  /\bsessionJsonPath\s*\(/,
];

/**
 * The required-import predicate. A file satisfies the invariant if it
 * imports either `validateProjectName` OR `assertValidProjectNameOrExit`
 * from a path ending in `lib/project-name` (with optional `.js`
 * extension to match the verbatim ESM-style imports the codebase uses).
 */
const VALIDATOR_IMPORT_PATTERN =
  /import\s*\{[^}]*\b(?:validateProjectName|assertValidProjectNameOrExit)\b[^}]*\}\s*from\s*['"][^'"]*lib\/project-name(?:\.js)?['"]/s;

// ---------------------------------------------------------------------------
// Allow-list — file-level, F-OVR-1 form
// ---------------------------------------------------------------------------

interface AllowListEntry {
  readonly path: string;
  readonly isGlob?: boolean;
  readonly rationale: string;
}

const ALLOW_LIST: readonly AllowListEntry[] = [
  {
    path: 'src/commands/maintenance/*.ts',
    isGlob: true,
    rationale:
      'allow-listed: deferred (maintenance scope, follow-up filed at merge time per L12)',
  },
  {
    path: 'src/commands/memory/*.ts',
    isGlob: true,
    rationale:
      'allow-listed: deferred (memory scope, follow-up filed at merge time per L12)',
  },
  {
    path: 'src/commands/gotcha/*.ts',
    isGlob: true,
    rationale:
      'allow-listed: deferred (gotcha scope, follow-up filed at merge time per L12)',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toForwardSlash(p: string): string {
  return sep === '/' ? p : p.split(sep).join('/');
}

function fileMatchesPredicate(content: string): boolean {
  if (PATH_JOIN_PATTERN.test(content)) return true;
  for (const helper of HELPER_PATTERNS) {
    if (helper.test(content)) return true;
  }
  return false;
}

function fileHasValidatorImport(content: string): boolean {
  return VALIDATOR_IMPORT_PATTERN.test(content);
}

function isAllowListed(relPath: string): AllowListEntry | undefined {
  const fwd = toForwardSlash(relPath);
  for (const entry of ALLOW_LIST) {
    if (entry.isGlob === true) {
      const glob = new Glob(entry.path);
      if (glob.match(fwd)) return entry;
    } else if (entry.path === fwd) {
      return entry;
    }
  }
  return undefined;
}

function scanCommandsTree(): readonly string[] {
  // Forward-slash path relative to `packages/cli/`. `Bun.Glob` matches
  // forward-slash regardless of platform sep.
  const out: string[] = [];
  const glob = new Glob('src/commands/**/*.ts');
  for (const match of glob.scanSync({ cwd: CLI_PKG_ROOT, onlyFiles: true })) {
    const rel = toForwardSlash(match);
    if (rel.includes('__tests__/')) continue;
    out.push(rel);
  }
  return out.sort();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Project-name validation invariant (PR-CFM-D / #187)', () => {
  test('every commands/** file that opens .gobbi/projects/ imports the validator', () => {
    const violations: string[] = [];
    for (const relPath of scanCommandsTree()) {
      const content = readFileSync(join(CLI_PKG_ROOT, relPath), 'utf8');
      if (!fileMatchesPredicate(content)) continue;
      if (isAllowListed(relPath) !== undefined) continue;
      if (fileHasValidatorImport(content)) continue;
      violations.push(relPath);
    }
    if (violations.length > 0) {
      const message = [
        `Found ${violations.length} commands/** file(s) that touch \`.gobbi/projects/\``,
        `(directly via path.join or via a canonical helper) but do NOT import`,
        `\`validateProjectName\` or \`assertValidProjectNameOrExit\` from`,
        `\`lib/project-name\`:`,
        '',
        ...violations.map((v) => `  - ${v}`),
        '',
        `Either (a) wire \`assertValidProjectNameOrExit(<name>, '<command-label>')\``,
        `into the entry point, OR (b) add a file-level allow-list entry to this`,
        `test with the F-OVR-1 rationale form:`,
        `  // allow-listed: deferred (<scope>, follow-up filed at merge time per L12)`,
      ].join('\n');
      expect.unreachable(message);
    }
  });

  test('every allow-list entry resolves to at least one on-disk file (no stale paths)', () => {
    const stale: string[] = [];
    const treeFwd = scanCommandsTree();
    for (const entry of ALLOW_LIST) {
      if (entry.isGlob === true) {
        const glob = new Glob(entry.path);
        let matched = false;
        for (const rel of treeFwd) {
          if (glob.match(rel)) {
            matched = true;
            break;
          }
        }
        if (!matched) stale.push(entry.path);
      } else if (!existsSync(join(CLI_PKG_ROOT, entry.path))) {
        stale.push(entry.path);
      }
    }
    if (stale.length > 0) {
      expect.unreachable(
        [
          `Found ${stale.length} stale allow-list entr(y/ies) — the path(s)`,
          `match no file under \`packages/cli/src/commands/\`:`,
          ...stale.map((p) => `  - ${p}`),
          '',
          `Remove the entry, or update the path to match the live tree.`,
        ].join('\n'),
      );
    }
  });
});
