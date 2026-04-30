/**
 * JSON-pivot drift detector — fails if `state.json | state.json.backup |
 * metadata.json` (per-session sense) re-appear in author-tracked docs or
 * production code without an explicit file-level allow-list entry.
 *
 * Allow-list precedence (PR-FIN-2a-iii):
 * - File-level allow-list = PRIMARY (auditable, in this test).
 * - Inline marker comments `// [legacy:retired-2a-ii]` = DECORATIVE
 *   documentation only. Not honored as a bypass.
 *
 * `gobbi.db` is NOT banned — it is the live per-session event store
 * (14+ active call sites in `commands/session.ts`, `workflow/resume.ts`,
 * `workflow/store.ts`, etc.).
 *
 * `metadata.json` is a homonym:
 *   - Per-session sense (retired): `.gobbi/projects/<name>/sessions/<id>/metadata.json`
 *   - Note-system sense (surviving): `.claude/project/<name>/note/<task>/metadata.json`
 *
 * The note-system files are allow-listed; the per-session sense should
 * never re-appear except in legacy schema readers / migration code.
 *
 * Why a regex test rather than a structural one: the banned tokens are
 * filenames, and a structural check would have to reproduce too much of
 * the workflow lifecycle. A grep-style test catches the only failure mode
 * we care about — a fresh PR re-introduces a present-tense reference to a
 * retired filename — at zero runtime cost.
 *
 * @see `.gobbi/projects/gobbi/sessions/5cdd4fd9-52de-460b-a8fa-539c5ea533c0/ideation/ideation.md` Tier C.
 */

import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Glob } from 'bun';

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

// `__tests__/integration/jsonpivot-drift.test.ts` -> repo root.
// Walk back: `integration` → `__tests__` → `src` → `cli` → `packages` → repo
// root (5 levels). Mirrors `build-pipeline.test.ts`'s 3-level walk to
// `packages/cli/` plus 2 more levels to the repo root.
const REPO_ROOT = resolve(THIS_DIR, '..', '..', '..', '..', '..');

// ---------------------------------------------------------------------------
// Banned tokens
// ---------------------------------------------------------------------------

/**
 * Word-boundary anchored regex for each retired token. The `\b` boundaries
 * keep the matcher precise — `partial-state.json-thing` would NOT trip
 * `BANNED_STATE_JSON`. The `state.json.backup` matcher subsumes the
 * `state.json` substring inside `state.json.backup`, so `BANNED_STATE_JSON`
 * is intentionally allowed to also match `state.json.backup` lines (they
 * count as both a `state.json` and a `state.json.backup` violation —
 * per-line listing is per-token, so the same line surfaces twice if it
 * names the longer form). Case-sensitive.
 */
const BANNED_TOKENS: ReadonlyArray<{ name: string; pattern: RegExp }> = [
  { name: 'state.json', pattern: /\bstate\.json\b/ },
  { name: 'state.json.backup', pattern: /\bstate\.json\.backup\b/ },
  { name: 'metadata.json', pattern: /\bmetadata\.json\b/ },
];

// ---------------------------------------------------------------------------
// File scope
// ---------------------------------------------------------------------------

/**
 * Repo-relative globs of files the detector scans. Every path is forward-
 * slash anchored — `Bun.Glob` matches against forward-slash paths regardless
 * of platform separator.
 */
const SCAN_GLOBS: readonly string[] = [
  // Tracked author docs
  '.claude/CLAUDE.md',
  '.claude/skills/**/*.md',
  '.gobbi/projects/gobbi/design/**/*.md',
  '.gobbi/projects/gobbi/skills/**/*.md',
  // Production code (test fixtures live under __tests__/, excluded below)
  'packages/cli/src/**/*.ts',
];

/**
 * Path-segment exclusions applied AFTER the include globs. A forward-slash-
 * normalised relative path that contains any of these segments is dropped.
 * Both production-code globs and test fixtures filter through here.
 */
const EXCLUDED_SEGMENTS: readonly string[] = [
  '__tests__/',
  // `migrations/` is documented as out-of-scope in the test's brief —
  // there is currently no `migrations/` directory under `packages/cli/src/`,
  // but if one is ever introduced for v1 schema fixtures it should be
  // excluded by construction. `migrations.ts` (the file, not a dir) is
  // covered by the file-level allow-list below.
  '/migrations/',
];

// ---------------------------------------------------------------------------
// Allow-list — file-level PRIMARY (auditable)
// ---------------------------------------------------------------------------

/**
 * Allow-list entry. A file matches if its repo-relative forward-slash path
 * matches `path` (a literal path or a glob via `isGlob`). When `lines` is
 * supplied, only the listed line numbers (1-based) bypass the detector;
 * other lines in the file still get checked. `rationale` is documentation
 * only — not consumed by the test.
 *
 * `tokens` defaults to all banned tokens; supply a subset when the file
 * legitimately mentions one specific retired filename only.
 */
interface AllowListEntry {
  readonly path: string;
  readonly isGlob?: boolean;
  readonly lines?: ReadonlySet<number>;
  readonly tokens?: ReadonlySet<string>;
  readonly rationale: string;
}

const ALLOW_LIST: readonly AllowListEntry[] = [
  // ---- Frozen historical session notes -------------------------------------
  {
    path: '.claude/project/gobbi/note/**/*.md',
    isGlob: true,
    rationale:
      'Frozen v0.4.x session notes — historical record, not live docs. May reference retired filenames as part of past-state context.',
  },

  // ---- Note-system metadata.json homonym (surviving file) ------------------
  {
    path: '.gobbi/projects/gobbi/skills/_note/SKILL.md',
    tokens: new Set(['metadata.json']),
    rationale:
      "Note-system metadata.json (`.claude/project/<name>/note/<task>/metadata.json`) — homonym of the retired per-session metadata.json. Surviving file; references must remain.",
  },
  {
    path: '.gobbi/projects/gobbi/skills/_gobbi-cli/gotchas.md',
    tokens: new Set(['metadata.json']),
    rationale:
      'Note-system metadata.json homonym — describes `gobbi note init` behaviour. Surviving file.',
  },
  {
    path: '.gobbi/projects/gobbi/skills/_gobbi-cli/SKILL.md',
    tokens: new Set(['metadata.json']),
    rationale:
      'Note-system metadata.json homonym — `gobbi note init` documentation.',
  },
  {
    path: '.gobbi/projects/gobbi/skills/_gobbi-cli/commands.md',
    tokens: new Set(['metadata.json']),
    rationale:
      'Note-system metadata.json homonym — `gobbi note init` command table entry.',
  },
  {
    path: '.gobbi/projects/gobbi/skills/_gotcha/__system.md',
    tokens: new Set(['state.json']),
    rationale:
      "Hook-state filename example (`/tmp/claude-state.json`) — generic illustrative path, not the retired per-session state.json.",
  },
  {
    path: '.gobbi/projects/gobbi/skills/_typescript/SKILL.md',
    tokens: new Set(['state.json']),
    rationale:
      "Lists `state.json` as an example of external JSON narrowed via `isValidState`. Educational reference describing migration-only narrowing patterns (PR-FIN-2a-iii Tier B.2 retired the orphan exports; the documentation example survives).",
  },

  // ---- _orchestration skill — entire dir is archived in PR-FIN-5 -----------
  {
    path: '.gobbi/projects/gobbi/skills/_orchestration/**/*.md',
    isGlob: true,
    rationale:
      'Whole `_orchestration` skill dir is archival (carries an ARCHIVED.md sentinel; full removal is the next-cycle `gobbi-config-target-state` follow-up #13).',
  },

  // ---- Files that legitimately document the retirement (post-T1 state) -----
  // T1 (Tier A docs sweep) updates these, but the retirement description
  // itself names the retired files. Allow-listed because the legitimate
  // textual content still mentions them.
  {
    path: '.claude/CLAUDE.md',
    rationale:
      'Canonical JSON-pivot paragraph names the retired files in describing what was retired (per ideation Tier A.5). Naming the retired files is necessary to document what was retired.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/gobbi-memory/README.md',
    rationale:
      'Documents the JSON-pivot retirement of session-root metadata.json / state.json / state.json.backup. Naming the retired files is necessary to describe what was retired.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/gobbi-memory/scenarios.md',
    rationale:
      'G-MEM2-31 / G-MEM2-32 (lines 313-326) describe legacy migration semantics; entire file allow-listed because Gherkin scenarios describe legacy migration semantics across multiple sections.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/orchestration/README.md',
    rationale:
      'Documents the per-session retirements at lines 83 / 184 / 221 / 281 — naming the retired files is necessary to describe what was retired.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-overview.md',
    rationale:
      'Architecture-of-record describes the v0.5.0 pivot history; references retired filenames as part of the historical narrative.',
  },

  // ---- Design-corpus follow-up sweep (out of 2a-iii scope per ideation) ----
  // Per ideation §"Out of scope" item 2 — these files have stale present-tense
  // statements that will be addressed in a follow-up issue. The allow-list
  // entries are self-removing once the follow-up lands.
  // TODO(follow-up): file an issue for design-corpus drift sweep and replace
  // these allow-list entries with `// allow-listed until issue #N` markers
  // once the issue number is assigned.
  {
    path: '.gobbi/projects/gobbi/design/structure.md',
    rationale:
      'Design-corpus drift — out-of-scope follow-up per ideation §"Out of scope" item 2 (lines 99/103/163).',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-cli.md',
    rationale:
      'Design-corpus drift — out-of-scope follow-up (lines 57/59/61/72/76/84/86/114).',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-prompts.md',
    rationale:
      'Design-corpus drift — out-of-scope follow-up (lines 21/25/27/34/149).',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-hooks.md',
    rationale:
      'Design-corpus drift — out-of-scope follow-up; describes hook-driven state.json / metadata.json reads in present tense.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-session.md',
    rationale:
      'Session-architecture design doc — describes per-session state.json / metadata.json contracts in present tense. Out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-state-machine.md',
    rationale:
      'Reducer-replay narrative references state.json — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-integration-tests.md',
    rationale:
      'Integration-test design references state.json reducer-replay assertions — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/gobbi-config/checklist.md',
    rationale:
      'Pre-pivot checklist still lists metadata.json existence checks — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/gobbi-config/scenarios.md',
    rationale:
      'Pre-pivot scenarios still assert metadata.json contents — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/gobbi-memory/checklist.md',
    rationale:
      'Pre-pivot checklist references state.json.currentStep — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/gobbi-memory/review.md',
    rationale:
      'Historical Pass-2 review notes mention state.json shim work — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/orchestration/checklist.md',
    rationale:
      'Pre-pivot checklist names metadata.json — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/orchestration/review.md',
    rationale:
      'Historical Pass-4 review GAP-9 references state.json atomicity — out-of-scope follow-up.',
  },
  {
    path: '.gobbi/projects/gobbi/design/v050-features/orchestration/scenarios.md',
    rationale:
      'Pre-pivot scenarios still assert metadata.json contents — out-of-scope follow-up.',
  },

  // ---- Production code: legacy schema readers + retirement docblocks -------
  {
    path: 'packages/cli/src/workflow/state-derivation.ts',
    rationale:
      "Migration-only paths reference `state.json` post-PR-FIN-2a-iii Tier B.2 (orphan exports removed). Surviving references describe the legacy on-disk shape that migration code converts away.",
  },
  {
    path: 'packages/cli/src/workflow/migrations.ts',
    rationale:
      'Migration code — historical schema readers must reference the v1 metadata.json filename to read pre-pivot session directories.',
  },
  {
    path: 'packages/cli/src/workflow/store.ts',
    rationale:
      'Docblocks describe the metadata.json reader retirement (lines 36-37 / 395 / 460 / 470 / 511-512). Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/workflow/engine.ts',
    rationale:
      'Docblocks describe the state.json projection retirement (lines 25-29 / 35 / 112 / 411 / 419 / 439 / 441). Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/workflow/guard-specs.ts',
    tokens: new Set(['state.json']),
    rationale:
      'Docblock example path (line 67) for `isAllowlistedPath` — illustrative, not a live read. Out-of-scope follow-up to update once design-corpus sweep lands.',
  },
  {
    path: 'packages/cli/src/commands/workflow/guard.ts',
    rationale:
      'Docblock describes legacy state.json read path (line 17) — pre-pivot historical comment. Out-of-scope follow-up.',
  },
  {
    path: 'packages/cli/src/commands/workflow/init.ts',
    rationale:
      'Docblock retirement notes describe the metadata.json -> session.json migration path (lines 13 / 200 / multiple). Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/commands/workflow/resume.ts',
    rationale:
      'Docblock retirement notes describe the state.json projection retirement (lines 261 / 302 / 305 / 308). Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/commands/install.ts',
    rationale:
      'Docblock notes describe install-gate retirement alongside per-session state.json (lines 55 / 226). Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/commands/session.ts',
    rationale:
      'Docblock retirement notes describe the metadata.json reader retirement (lines 520 / 550). Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/lib/json-memory.ts',
    rationale:
      'Docblock comment (line 604) references metadata.json in describing JSON-memory pivot.',
  },
  {
    path: 'packages/cli/src/commands/workflow/next.ts',
    tokens: new Set(['metadata.json']),
    rationale:
      'Docblock at the second `resolvePartitionKeys` callsite describes the post-PR-FIN-2a-ii retirement of the per-session metadata.json reader (PR-FIN-2a-iii Tier A.6 docs sweep). Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/commands/workflow/tech-stack.ts',
    tokens: new Set(['metadata.json']),
    rationale:
      'Module + `detectTechStack` docblocks describe the post-PR-FIN-2a-ii retirement of metadata.json.techStack and the still-pending session.json slot decision (PR-FIN-2a-iii Tier A.10). Function is kept live for the underlying signal; deletion vs. wiring is a deferred follow-up. Naming the retired file is necessary to document what was retired.',
  },
  {
    path: 'packages/cli/src/commands/maintenance/wipe-legacy-sessions.ts',
    rationale:
      'Wipe tool — its purpose IS to delete the retired filenames. The hardcoded literal list of retired filenames at lines 111-113 is load-bearing.',
  },
  {
    path: 'packages/cli/src/commands/note.ts',
    tokens: new Set(['metadata.json']),
    rationale:
      'Note-system metadata.json writer (homonym of retired session metadata.json) — surviving file.',
  },

];

// ---------------------------------------------------------------------------
// Glob expansion + allow-list lookup
// ---------------------------------------------------------------------------

function toForwardSlash(p: string): string {
  return sep === '/' ? p : p.split(sep).join('/');
}

function isExcluded(relPath: string): boolean {
  const fwd = toForwardSlash(relPath);
  for (const segment of EXCLUDED_SEGMENTS) {
    if (fwd.includes(segment)) return true;
  }
  return false;
}

function findAllowEntry(
  relPath: string,
): AllowListEntry | undefined {
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

function expandScanGlobs(): readonly string[] {
  const out = new Set<string>();
  for (const pattern of SCAN_GLOBS) {
    const glob = new Glob(pattern);
    for (const match of glob.scanSync({
      cwd: REPO_ROOT,
      onlyFiles: true,
      // `.claude/` and `.gobbi/` are dot-directories; without `dot: true` the
      // glob matcher would skip them entirely.
      dot: true,
    })) {
      const relPath = toForwardSlash(match);
      if (isExcluded(relPath)) continue;
      out.add(relPath);
    }
  }
  return [...out].sort();
}

// ---------------------------------------------------------------------------
// Match collection
// ---------------------------------------------------------------------------

interface Hit {
  readonly relPath: string;
  readonly lineNumber: number; // 1-based
  readonly lineContent: string;
  readonly token: string;
}

function collectHits(token: string, pattern: RegExp): readonly Hit[] {
  const hits: Hit[] = [];
  for (const relPath of expandScanGlobs()) {
    const allow = findAllowEntry(relPath);
    if (allow !== undefined) {
      // File-level allow-list — does it cover THIS token?
      if (allow.tokens === undefined || allow.tokens.has(token)) {
        if (allow.lines === undefined) continue; // whole file allow-listed
      }
    }
    let content: string;
    try {
      content = readFileSync(join(REPO_ROOT, relPath), 'utf8');
    } catch {
      continue;
    }
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (line === undefined) continue;
      if (!pattern.test(line)) continue;
      const lineNumber = i + 1;
      // Per-line allow-list — when `allow.lines` is set the token is
      // bypassed only on those specific lines.
      if (
        allow !== undefined &&
        allow.lines !== undefined &&
        allow.lines.has(lineNumber) &&
        (allow.tokens === undefined || allow.tokens.has(token))
      ) {
        continue;
      }
      hits.push({
        relPath,
        lineNumber,
        lineContent: line.trim(),
        token,
      });
    }
  }
  return hits;
}

function formatHits(hits: readonly Hit[]): string {
  if (hits.length === 0) return '(none)';
  return hits
    .map(
      (h) =>
        `  ${h.relPath}:${h.lineNumber}: ${h.lineContent.slice(0, 200)}${h.lineContent.length > 200 ? '…' : ''}`,
    )
    .join('\n');
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('JSON-pivot drift detector (PR-FIN-2a-iii Tier C)', () => {
  for (const banned of BANNED_TOKENS) {
    test(`no unallowed references to \`${banned.name}\``, () => {
      const hits = collectHits(banned.name, banned.pattern);
      if (hits.length > 0) {
        // Fail loud — message lists every file:line so the regression's
        // source is obvious. Add the offending file to ALLOW_LIST with a
        // documented rationale, OR remove the reference, to make the test
        // pass again.
        const message = [
          `Found ${hits.length} unallowed reference(s) to \`${banned.name}\`:`,
          formatHits(hits),
          '',
          `If the references are legitimate (e.g., docblocks documenting the`,
          `retirement, migration code reading the v1 schema), add a file-level`,
          `entry to ALLOW_LIST in this test with a clear rationale.`,
          '',
          `If the references are stale present-tense statements, fix them in`,
          `the source file rather than expanding the allow-list.`,
        ].join('\n');
        // Use `expect(hits)` so the error path actually surfaces the message.
        expect.unreachable(message);
      }
    });
  }

  test('cross-token sanity — at least one banned token is scanned', () => {
    // Belt-and-braces: if BANNED_TOKENS is ever emptied by a refactor,
    // the per-token tests above silently no-op. This guard fails loud.
    expect(BANNED_TOKENS.length).toBeGreaterThan(0);
  });

  test('scan reaches the in-scope tree (sanity)', () => {
    // Guards against a path-resolution bug that silently scans nothing.
    // CLAUDE.md is always present in the repo; if the scan misses it,
    // REPO_ROOT or SCAN_GLOBS is wrong.
    const scanned = expandScanGlobs();
    expect(scanned).toContain('.claude/CLAUDE.md');
  });
});

// `relative` is imported to support future per-line allow-list helpers; it
// is currently unused at runtime. Re-export to avoid a TS no-unused-imports
// warning under strict mode without changing import order.
export const _relative = relative;
