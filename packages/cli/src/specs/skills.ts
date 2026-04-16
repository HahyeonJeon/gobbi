/**
 * Skill-content loader — reads `.claude/skills/` content into ordered
 * `StaticSection[]` arrays for inclusion in compiled prompts.
 *
 * A.8 implementation. Replaces the A.1 stub. Consumed by A.4's `compile()`
 * entry point when it assembles the static-prefix region of a step prompt.
 *
 * ## What this module does
 *
 * Given a list of skill names, reads each skill's `SKILL.md` and any child
 * `.md` files listed in that skill's "Navigate deeper from here:" markdown
 * table, then wraps the contents into `StaticSection` instances via the
 * factory in `sections.ts`. The resulting sections live in the prompt's
 * static cache prefix and participate in Anthropic's prefix-hash cache.
 *
 * ## What this module does NOT do
 *
 * - It does NOT decide which skills belong to which step — that decision
 *   lives in `StepSpec.meta.requiredSkills` + `optionalSkills` (A.7+).
 *   This loader serves the skill names it is asked for.
 * - It does NOT interpret skill content. Frontmatter, headings, and tables
 *   are all passed through verbatim.
 * - It does NOT cache. A fresh disk read happens on every call. Caching is
 *   a Phase 3 optimization.
 * - It does NOT compile prompts or apply the budget. Those are A.4 and A.5.
 *
 * ## Boundary with v0.5.0 "skills that survive"
 *
 * The closed `SkillName` union lists only the nine skills that v0.5.0 keeps
 * as domain-knowledge materials per `v050-prompts.md` §Skills That Survive.
 * Workflow-control skills (`_orchestration`, `_plan`, `_ideation`, etc.) do
 * NOT appear in this union — their content is translated into step specs,
 * not loaded as materials.
 *
 * @see `.claude/project/gobbi/design/v050-prompts.md` §Skills Boundary
 * @see `.claude/project/gobbi/design/v050-prompts.md` §How Skills Become Materials
 */

import { readFile } from 'node:fs/promises';
import { dirname, join, isAbsolute, posix, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { makeStatic, type StaticSection } from './sections.js';

// ---------------------------------------------------------------------------
// Default path convention (M4 reconciliation — PR B B.3)
//
// `loadGraph()` resolves its default `index.json` path via `import.meta.url`
// → a module-relative, cwd-independent location. `loadSkills()` originally
// used a cwd-relative fallback (`.claude/skills`) which broke when the CLI
// ran from a worktree, from an absolute path, or from outside
// `packages/cli/`.
//
// Both loaders now resolve their defaults module-relatively. The project
// root sits four levels up from this file:
//
//   packages/cli/src/specs/skills.ts
//     → packages/cli/src/specs/      (dirname of this file)
//       → packages/cli/src/          (..)
//         → packages/cli/            (..)
//           → packages/              (..)
//             → <repo-root>/         (..)               ← where `.claude/skills/` lives
//
// Tests override this via `options.skillsRoot`. Keeping the convention
// identical across both loaders eliminates the class of failures where
// `loadGraph()` works and `loadSkills()` silently reads from the wrong
// directory.
// ---------------------------------------------------------------------------

const THIS_DIR = dirname(fileURLToPath(import.meta.url));

/**
 * Repository root — four directories above `packages/cli/src/specs/`.
 * Kept module-relative for cwd independence (matches `loadGraph`'s
 * `DEFAULT_GRAPH_PATH` convention).
 */
const REPO_ROOT = resolve(THIS_DIR, '..', '..', '..', '..');

// ---------------------------------------------------------------------------
// SkillName — closed union of the nine v0.5.0 surviving skills
//
// Per `v050-prompts.md` §Skills That Survive. The union is closed to give
// callers (step specs, compile()) compile-time guarantees that they are not
// requesting a skill that v0.5.0 does not carry forward. Expanding the list
// requires a deliberate edit here rather than a stringly-typed runtime
// surprise.
//
// Ordering in the type is alphabetical for readability only; at runtime the
// loader emits sections in alphabetical order too (see `SKILL_NAMES`).
// ---------------------------------------------------------------------------

export type SkillName =
  | '_agents'
  | '_claude'
  | '_git'
  | '_gobbi-cli'
  | '_gotcha'
  | '_notification'
  | '_project'
  | '_rules'
  | '_skills';

/**
 * The canonical list of v0.5.0 surviving skill names. The loader uses this
 * to validate inputs and as the deterministic iteration order. Kept in
 * lockstep with the `SkillName` union above.
 */
export const SKILL_NAMES: readonly SkillName[] = [
  '_agents',
  '_claude',
  '_git',
  '_gobbi-cli',
  '_gotcha',
  '_notification',
  '_project',
  '_rules',
  '_skills',
] as const;

// ---------------------------------------------------------------------------
// Options and defaults
// ---------------------------------------------------------------------------

/**
 * Default location of the skills tree. Resolved module-relatively so the
 * loader works regardless of the process's cwd — see the M4 reconciliation
 * note at the top of this file. Tests override via `options.skillsRoot` to
 * point at a fixture directory.
 *
 * Absolute path under the repository root: `<repo-root>/.claude/skills`.
 */
export const DEFAULT_SKILLS_ROOT: string = join(REPO_ROOT, '.claude', 'skills');

export interface LoadSkillsOptions {
  /**
   * Ordered list of skill names to load. Duplicates are allowed but only
   * one set of sections per name is emitted — the first occurrence wins
   * for ordering purposes; the final ordering is alphabetical regardless.
   *
   * An empty array is valid and yields an empty result.
   */
  readonly skillNames: readonly SkillName[];

  /**
   * Filesystem root containing per-skill directories. Defaults to
   * `DEFAULT_SKILLS_ROOT` (relative to cwd). Tests pass an absolute path
   * to a fixture tree or to the repository's real skills directory.
   */
  readonly skillsRoot?: string;
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

/**
 * Load a set of skills from disk and turn each one into a sequence of
 * `StaticSection` instances. Main `SKILL.md` content becomes `skills.<name>`;
 * each child doc listed in the skill's "Navigate deeper from here:" table
 * becomes `skills.<name>.<child-slug>`.
 *
 * Missing files (including a completely missing skill directory) are
 * skipped with a warning — the loader NEVER throws for filesystem errors.
 * This tolerates mid-flight changes to the skill tree and matches the
 * "partial results are better than no prompt" contract the compiler needs.
 *
 * The returned array is stably ordered:
 *
 *   1. Skills sorted alphabetically by name.
 *   2. Within each skill, the main `SKILL.md` section comes first.
 *   3. Children are sorted alphabetically by the discovered child slug.
 *
 * Determinism matters because `StaticSection.contentHash` feeds the cache
 * prefix — reordering sections between calls would invalidate the cache
 * on each run.
 *
 * @param options - skill names to load plus an optional skills root override
 * @returns readonly array of sections, one per loaded `.md` file
 */
export async function loadSkills(
  options: LoadSkillsOptions,
): Promise<readonly StaticSection[]> {
  const skillsRoot = options.skillsRoot ?? DEFAULT_SKILLS_ROOT;

  // Deduplicate while preserving the provided input as a set. The final
  // order is alphabetical, not input-order.
  const uniqueNames = Array.from(new Set(options.skillNames)).sort();

  const sections: StaticSection[] = [];

  for (const skillName of uniqueNames) {
    const skillSections = await loadOneSkill(skillName, skillsRoot);
    sections.push(...skillSections);
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Per-skill loader
//
// Reads `SKILL.md` plus any Navigate-deeper child docs that live inside the
// skill directory. Emits sections in the order SKILL.md → alphabetised
// children.
// ---------------------------------------------------------------------------

async function loadOneSkill(
  skillName: SkillName,
  skillsRoot: string,
): Promise<readonly StaticSection[]> {
  const skillDir = join(skillsRoot, skillName);
  const mainPath = join(skillDir, 'SKILL.md');

  const mainContent = await readFileOrWarn(mainPath);
  if (mainContent === null) {
    // If SKILL.md is missing the whole skill is effectively absent — skip.
    return [];
  }

  const sections: StaticSection[] = [
    makeStatic({ id: `skills.${skillName}`, content: mainContent }),
  ];

  const childFilenames = extractChildDocFilenames(mainContent);

  // Alphabetical ordering for deterministic cache keys.
  const orderedChildren = Array.from(new Set(childFilenames)).sort();

  for (const childFilename of orderedChildren) {
    const childPath = join(skillDir, childFilename);
    const childContent = await readFileOrWarn(childPath);
    if (childContent === null) {
      continue;
    }
    const childSlug = childFilename.replace(/\.md$/i, '');
    sections.push(
      makeStatic({
        id: `skills.${skillName}.${childSlug}`,
        content: childContent,
      }),
    );
  }

  return sections;
}

// ---------------------------------------------------------------------------
// Navigate-deeper child-doc discovery
//
// Each skill's `SKILL.md` declares its child docs in a markdown table that
// follows the "Navigate deeper from here:" heading. The table uses the
// conventional two-column layout:
//
//   | Document | Covers |
//   |----------|--------|
//   | [gotchas.md](gotchas.md) | Known mistakes and corrections for _git |
//
// Some tables also point at sibling skills (`[../../_rules](...)`) or at
// subdirectories (`[evaluation/](evaluation/README.md)`). The discovery
// function filters those out — only top-level `.md` files inside the skill
// dir qualify as children of this loader.
//
// Discovery rules (in order of rejection priority):
//
//   1. The link target must be a relative path — reject absolute paths.
//   2. The target must not escape the skill dir — reject `../` anywhere.
//   3. The target must end in `.md` (case-insensitive).
//   4. The target must have no directory component — reject `foo/bar.md`.
//      (README.md inside a subdirectory like `evaluation/README.md` does
//      not qualify because it belongs to a nested skill or doc tree, not
//      to the parent skill's top level.)
//   5. The target must not be `SKILL.md` itself — SKILL.md is the main
//      section and is loaded unconditionally.
// ---------------------------------------------------------------------------

/**
 * Extract the filenames of child `.md` docs from a SKILL.md's
 * "Navigate deeper from here:" table. Returns an unordered list; the caller
 * sorts and deduplicates.
 *
 * Exported for tests so the parser can be exercised without a filesystem.
 */
export function extractChildDocFilenames(skillMdContent: string): readonly string[] {
  const headingIndex = skillMdContent.indexOf('Navigate deeper from here:');
  if (headingIndex === -1) {
    return [];
  }

  // The table runs from the heading until the next horizontal rule (`---`)
  // or the end of the file. Sections below the table (e.g. Core Principle)
  // always start with `---` per the project's `_claude` writing standard.
  const afterHeading = skillMdContent.slice(headingIndex);
  const tableEnd = findTableEnd(afterHeading);
  const tableText = afterHeading.slice(0, tableEnd);

  const childFilenames: string[] = [];
  // Match every markdown link `[label](target)` in the table region. The
  // label is non-greedy so nested brackets do not over-consume.
  const linkRegex = /\[[^\]]*?\]\(([^)]+)\)/g;

  for (const match of tableText.matchAll(linkRegex)) {
    const rawTarget = match[1];
    if (rawTarget === undefined) continue;
    const target = rawTarget.trim();
    if (isChildMarkdownFile(target)) {
      childFilenames.push(target);
    }
  }

  return childFilenames;
}

/**
 * Return the length of the "Navigate deeper" table in the given string.
 * The table ends at the first standalone `---` horizontal rule AFTER the
 * table body. The heading itself contains no `---`; the closing rule marks
 * the transition to the next doc section.
 */
function findTableEnd(fromHeading: string): number {
  const lines = fromHeading.split('\n');
  let charOffset = 0;
  // Skip the heading line itself.
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? '';
    // A line that is exactly `---` (possibly with surrounding whitespace)
    // AND appears after we have seen at least one table row terminates
    // the table region. We also terminate on the first non-table, non-
    // blank line — this covers SKILL.md files that lack a trailing `---`.
    if (i > 0 && /^\s*---\s*$/.test(line)) {
      return charOffset;
    }
    charOffset += line.length + 1; // +1 for the newline
  }
  return fromHeading.length;
}

/**
 * True when the link target is a same-directory child `.md` file.
 *
 * Rejects: absolute paths, parent escapes (`..`), non-`.md` targets,
 * nested paths (`foo/bar.md`), and `SKILL.md` itself.
 */
function isChildMarkdownFile(target: string): boolean {
  if (target === '' || isAbsolute(target)) return false;

  // Normalize using posix semantics — markdown links always use `/`.
  const normalized = posix.normalize(target);

  // Reject parent escapes. `normalize` preserves leading `..` segments.
  if (normalized.startsWith('..')) return false;

  // Reject nested paths — any internal slash means the target sits in a
  // subdirectory.
  if (normalized.includes('/')) return false;

  // Must end in `.md` (case-insensitive). Some skills have files like
  // `__system.md` and `project-gotcha.md`; the suffix check is the gate.
  if (!/\.md$/i.test(normalized)) return false;

  // SKILL.md is the main entry point and is loaded unconditionally.
  if (normalized.toLowerCase() === 'skill.md') return false;

  return true;
}

// ---------------------------------------------------------------------------
// Resilient file read
//
// A missing file emits a console.warn and resolves to `null`. The loader's
// contract is "partial results over throw" — a prompt compile where one
// skill is missing must still proceed with the remaining skills.
//
// Non-ENOENT errors also warn-and-skip rather than throw: permission errors
// or transient I/O faults should not take down the whole prompt compile.
// The warning names the skill file so operators can investigate.
// ---------------------------------------------------------------------------

async function readFileOrWarn(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, 'utf8');
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      console.warn(`[skills] missing file, skipping: ${filePath}`);
    } else {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[skills] could not read ${filePath}: ${message}`);
    }
    return null;
  }
}
