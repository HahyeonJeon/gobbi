/**
 * `validateProjectName` + `assertValidProjectNameOrExit` — central
 * project-name validator lifted out of `commands/project/create.ts` so
 * every `--project`-bearing entry point shares one rule set and one
 * error template.
 *
 * # Consumers
 *
 *   1. `commands/install.ts` (PR-CFM-D T3) — argv-shell guard before
 *      template seed; uses {@link assertValidProjectNameOrExit}.
 *   2. `commands/workflow/init.ts` (PR-CFM-D T2) — single B.0 guard at
 *      the resolved-name site; covers both `--project` flag and
 *      `basename(repoRoot)` fallback in one call.
 *   3. `commands/config.ts` `runInit` only (PR-CFM-D T4) — argv-shell
 *      guard at the resolved-name site; non-init branches (`runGet`,
 *      `runSet`, `runExplain`, `runList`, `runEnv`) deferred per L12.
 *   4. `commands/project/create.ts` — the original home; retains its
 *      pre-existing exit-1 callsite (see L15 below).
 *
 * # L9 — exit code 2 at the 3 new entry-point sites
 *
 * The new sites at install/workflow-init/config-init exit with code 2
 * via {@link assertValidProjectNameOrExit}. Two reasons: (a) POSIX
 * "incorrect command-line usage" maps cleanly to a malformed
 * `--project` argument; (b) parity with the sibling `parseArgs`
 * failure paths in those commands, which already exit 2 on argv shape
 * errors. Treating an invalid `--project` value as another argv-shape
 * error keeps the operator's mental model uniform.
 *
 * # L13 — stderr template
 *
 * `<command-label>: invalid --project name '<input>': <reason>\n`
 *
 * The raw input is single-quoted so traversal payloads (`../tmp`,
 * `..\\evil`) render verbatim without shell-mangling, mirroring the
 * surrounding diagnostic style in those commands.
 *
 * # L15 — `commands/project/create.ts` callsite UNCHANGED
 *
 * `create.ts:294-298` has a pre-existing `process.exit(1)` callsite
 * (the `if (!validation.ok)` branch). That callsite is INTENTIONALLY
 * preserved as-is — it imports {@link validateProjectName} (NOT the
 * `OrExit` helper) and continues to exit 1 because `project create`'s
 * exit-code charter (see file JSDoc on `create.ts`) reserves exit 1
 * for "name validation failed OR project already exists" and exit 2
 * for "argv parse error". The exit-code-vs-exit-code split between
 * `create` (exit 1) and `install/workflow-init/config-init` (exit 2)
 * is deliberate, not a bug — `create`'s argv shape is `<positional>`
 * not `--project <flag>`, so the "argv-shape error" framing of L9
 * does not apply.
 *
 * # Lib-level `process.exit` precedent
 *
 * {@link assertValidProjectNameOrExit} calls `process.exit(2)`. This
 * is NOT the only `process.exit` in `lib/` — see
 * `lib/version-check.ts:345,347,362,370` for the established
 * precedent (the `runIsLatest` helper exits 0/2 depending on JSON
 * mode and verdict). Lib-level exits are acceptable for thin
 * argv-shell sugar — the helper is one line of decision logic plus a
 * uniform stderr template, and inlining the same 6 lines at every
 * caller is worse for the L13 template-drift risk than centralising
 * the exit here. The `OrExit` suffix on the export name marks the
 * deliberate divergence from PR-CFM-B's exit-free
 * `lib/workspace-read-store.ts` pattern.
 */

// ---------------------------------------------------------------------------
// Validation rules (private — verbatim lift from create.ts:206,216)
// ---------------------------------------------------------------------------

/**
 * Lowercase letters, digits, and hyphens only. The body-start and
 * body-end characters exclude hyphens so names like `-foo` or `foo-`
 * are rejected upstream of any directory create. One-character names
 * pass (e.g. `a`).
 */
const NAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

/**
 * Reserved filesystem names that must never be accepted as a project
 * name even though they pass the {@link NAME_PATTERN}. Kept small —
 * the pattern already excludes `/`, `\`, `.`, `_`, and whitespace, so
 * only the two dot-only sentinels make it this far (but the pattern
 * also excludes `.` entirely via its character class; this array is a
 * defense-in-depth belt against future pattern loosening).
 */
const RESERVED_NAMES: ReadonlySet<string> = new Set(['', '.', '..']);

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export type NameValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly reason: string };

/**
 * Validate a candidate project name against the rules documented on
 * `commands/project/create.ts` JSDoc. Pure function — no I/O, no
 * existence check (that belongs to the caller, who already has the
 * `repoRoot`).
 *
 * The 64-char length cap (PR-CFM-D L10) runs as the FIRST conditional
 * so over-long names short-circuit before the reserved-name and
 * pattern checks. The cap defends against pathological inputs (e.g.
 * embedded path-traversal payloads padded out to defeat NAME_PATTERN
 * fuzzers) and aligns with conservative filesystem-component limits
 * across platforms.
 */
export function validateProjectName(name: string): NameValidationResult {
  if (name.length > 64) {
    return { ok: false, reason: 'name must be ≤64 characters' };
  }
  if (RESERVED_NAMES.has(name)) {
    return { ok: false, reason: `name cannot be "${name}"` };
  }
  if (!NAME_PATTERN.test(name)) {
    return {
      ok: false,
      reason:
        'name must be lowercase letters, digits, and hyphens only ' +
        '(no leading/trailing hyphen, no path separators)',
    };
  }
  return { ok: true };
}

/**
 * Convenience helper for argv-shell sites that want uniform exit-2 +
 * stderr template (L9/L13). Call immediately after resolving the
 * effective project name (whether from `--project` flag or
 * `basename(repoRoot)` fallback) and before any FS write keyed on
 * that name.
 *
 * The `OrExit` suffix marks the deliberate `process.exit` divergence
 * from PR-CFM-B's exit-free `lib/workspace-read-store.ts` pattern;
 * precedent for lib-level `process.exit` is `lib/version-check.ts`
 * (lines 345, 347, 362, 370 — `runIsLatest`).
 *
 * @param name         — the resolved project name to validate.
 * @param commandLabel — the command identity for the stderr prefix,
 *                       e.g. `'gobbi install'`, `'gobbi workflow init'`,
 *                       `'gobbi config init'`. Passed in rather than
 *                       inferred so the helper is decoupled from any
 *                       command-name convention.
 */
export function assertValidProjectNameOrExit(
  name: string,
  commandLabel: string,
): void {
  const v = validateProjectName(name);
  if (v.ok) return;
  process.stderr.write(
    `${commandLabel}: invalid --project name '${name}': ${v.reason}\n`,
  );
  process.exit(2);
}
