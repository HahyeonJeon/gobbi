# Risk Perspective — claude iter1

VERDICT: PASS

## Frame
Adversarial: what could break, leak, mislead, or fabricate? Focus on the R1 cache-leak guard, the symlink-skip footgun, the no-fabricated-verification discipline, and scope creep.

## Checks
- R1 source-package leak guard: ACTIVELY tested. Injected `plugins/gobbi/STRAY` (dir) → `--check` exit 1 "unexpected entry: STRAY". Injected `plugins/gobbi/STRAYFILE` → exit 1. Both restored; clean state re-verified exit 0. The guard is REAL, not decorative. PASS.
- R1 installed-cache half: validate-plugin-hooks-fire-once.sh Section 2 enumerates installed-cache top level, asserts == allow-set, scans LEAK_PATTERNS (.gobbi/sessions/backlogs/design/mistakes/rules/features/node_modules/dist/src/scripts) and .md-at-root. Logic is correct and would catch a real leak. PASS.
- Symlink-skip footgun (install drops escaping symlinks → empty skill dirs): mitigated by materialized REAL copies (find -type l empty) + sync-time symlink assertion (die if >0). The claude-plugin SKILL.md documents the footgun explicitly. PASS.
- No-fabricated-verification discipline (Iron Law 7, mistakes leader-iter2 / reproducing-a-bugged-command): the operator-assisted scripts exit 2 without required env, never emit a synthetic PASS; the autonomous deliverable is correctly scoped to script+procedure. PASS.
- Scope creep: `git status` shows ONLY plugins/, scripts/, .claude-plugin/, .claude/skills/claude-plugin/, .gobbi/.../skills/claude-plugin/, install-runtime/README.md, session memory. `.claude/settings.json` UNCHANGED (git status --porcelain empty for it). No creep. PASS.
- Conditional settings.json edit (T6) is double-gated and did NOT fire (Option C / DD-9 honored). No autonomous mutation of dev config. PASS.

## Findings

### RISK-1 — set -euo pipefail with grep -c in fire-once script could mis-handle a count-0 edge under pipefail
- Type: design_flaw · Domain: test · Disposition: open · Confidence: 50 · Severity: Low
- Evidence: validate-plugin-hooks-fire-once.sh runs `set -euo pipefail` (line 199) and uses `count=$(grep -c '' "$marker_file" || true)` (line 259). The `|| true` correctly absorbs grep's exit-1-on-zero-match, so the count path is safe. I could not find an unguarded grep-under-pipefail that would abort the script. Low-confidence/precautionary only; no concrete failing path found.
- Why it matters: if any future edit drops a `|| true`, pipefail could abort before the assertion prints. Currently safe.
- Suggested direction: none required now; keep the `|| true` discipline on grep -c.

## Must-preserve
- The injection-tested allow-set guard (the single most important R1 control).
- Materialized-real-copies + sync-time symlink assertion.
- Operator-assisted scripts' exit-2-without-evidence guards.
- settings.json untouched.
