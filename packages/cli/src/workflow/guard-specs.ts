/**
 * Secret-pattern PreToolUse guard allowlist.
 *
 * Paths matching these prefixes are admitted (warn suppressed) by the
 * secret-pattern guard. These prefixes cover session artefacts, worktrees,
 * and project gotchas/notes — all operator-authored content that legitimately
 * contains path/id strings resembling secrets.
 *
 * Secret pattern regexes themselves are added by PR F when the guard is
 * registered with PreToolUse. This wave only widens the allowlist data;
 * `GUARDS` in `./guards.ts` is intentionally left empty here.
 *
 * ## Prefix matching, not glob matching
 *
 * Entries are written with a trailing `/**` for human readability — the
 * convention matches `.gitignore` / glob style and is what plan §4 C.12
 * specifies. The runtime check ({@link isAllowlistedPath}) does NOT pull in
 * a glob library. It strips the trailing `/**`, normalizes the prefix to
 * the platform path separator, and performs a `path === prefix ||
 * path.startsWith(prefix + sep)` containment check — the same shape used
 * by `commands/workflow/validate.ts` for spec-path containment.
 *
 * Containment is sufficient because every allowlist entry is a directory
 * subtree — no entry mid-glob (`.gobbi/(*)/foo`) and no negation (`!`).
 * Adding either would require a real glob library and a corresponding
 * trust-model review (allowlist patterns are PreToolUse-fast-path data).
 *
 * @see `.gobbi/projects/gobbi/design/v050-hooks.md` §Secret Pattern Detection Guard
 * @see `./guards.ts` — Guard spec / matcher (C.5); SECRET_PATTERN entries arrive in PR F
 */

import { sep } from 'node:path';

/**
 * Allowlist entries, sorted alphabetically for diff stability. Each entry is
 * a directory subtree expressed with a `/**` suffix; {@link isAllowlistedPath}
 * strips the suffix before comparison.
 */
export const SECRET_PATTERN_ALLOWLIST: readonly string[] = [
  // Post-W2.1: all project-scoped subtrees live under `.gobbi/projects/<name>/…`
  // (multi-project layout). The prefix-match runtime strips the `/**` suffix,
  // so these entries admit every path below each named subtree across projects.
  // The `*` wildcard is the permanent design under PR-FIN-1c: the `projects`
  // registry was removed and project names are resolved at command time from
  // the `--project` flag (or `basename(repoRoot)` as the default). The
  // allowlist therefore covers every project by name without any registry
  // lookup — a single shared `.gobbi/projects/*/` prefix per branch.
  '.gobbi/projects/*/learnings/**',
  '.gobbi/projects/*/notes/**',
  '.gobbi/projects/*/sessions/**',
  '.gobbi/projects/*/worktrees/**',
];

/**
 * Pre-computed prefix list. Each allowlist entry has its trailing `/**`
 * stripped and its `/` separators rewritten to the platform `sep`. Computed
 * once at module load — the PreToolUse hotpath does not pay the conversion.
 */
const ALLOWLIST_PREFIXES: readonly string[] = SECRET_PATTERN_ALLOWLIST.map(
  (entry) => entry.replace(/\/\*\*$/, '').split('/').join(sep),
);

/**
 * Return true when `path` falls under any allowlist prefix.
 *
 * `path` may be relative (e.g. `.gobbi/projects/<name>/sessions/foo/state.json`) or
 * absolute. Containment is a string-prefix check anchored at the platform
 * separator — exactly the pattern used by `commands/workflow/validate.ts`
 * for spec-path containment. No glob matching beyond `/**`-suffix stripping.
 */
export function isAllowlistedPath(path: string): boolean {
  for (const prefix of ALLOWLIST_PREFIXES) {
    if (path === prefix || path.startsWith(prefix + sep)) {
      return true;
    }
  }
  return false;
}
