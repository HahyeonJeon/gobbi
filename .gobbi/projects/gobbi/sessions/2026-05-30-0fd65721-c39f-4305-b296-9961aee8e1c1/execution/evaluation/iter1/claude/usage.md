# Usage Perspective — claude iter1

VERDICT: PASS

## Frame
Will the operator/user be able to materialize, validate, install, and verify the plugin using the shipped artifacts and procedures, with no fabricated/auto-claimed install results?

## Checks
- `sync-plugin-package.sh` (no args) materializes; `--check` gates. Both run cleanly; unknown-arg path dies with a clear message. PASS.
- Operator procedures (T5, T6) are step-by-step (PHASE 0-6 / STEP 1-5), name exact CLI commands, env vars, isolation (temp CLAUDE_CONFIG_DIR), and cleanup/uninstall. A competent operator can execute them. PASS.
- T6 conditional edit is gated on `--apply-false` AND AUTOGRANT_RESULT=FALSE, is idempotent (checks existing entries), backs up settings.json, validates JSON before write. The auto-grant TRUE path leaves settings.json untouched. PASS — does not fabricate a pass.
- The two skills under test (gobbi:codex, gobbi:gobbi-hook-authoring) are genuinely the two OMITTED from settings.json allow-list — verified by grep (NOT present). The script's premise is accurate. PASS.
- Live install/fire-once/invocability results correctly NOT produced (deferred to operator). The scripts ERROR-exit (exit 2) if run without the required env vars — they cannot fabricate a pass. PASS.

## Findings

### USAGE-1 — fire-once marker instrumentation is operator-applied to the installed cache, not shipped in the packaged hook
- Type: assumption_risk · Domain: process · Disposition: open · Confidence: 75 · Severity: Low
- Evidence: validate-plugin-hooks-fire-once.sh PHASE 3 instructs the operator to sed/patch the INSTALLED-CACHE hook copies to emit markers; the packaged hook scripts emit no markers by default. The procedure provides two patch heredocs with line-anchored context (`@@ -45,6` / `@@ -36,6`).
- Why it matters: the patch line-anchors (`@@ -45` for session-start, `@@ -36` for post-tool-use) are hardcoded to current hook script line numbers; if the canonical hook bodies shift, the patch hunks may fail to apply and the operator must hand-edit. This is a maintainability fragility in the operator procedure, not a correctness defect — the refined inline-block fallback is also provided.
- Suggested direction: prefer the env-gated marker-append-after-`payload=$(cat)` block (already described) over the line-anchored patch, or note the patch is best-effort.

## Must-preserve
- env-var guards (exit 2) that prevent a no-evidence pass.
- The --apply-false double-gate and settings.json backup.
