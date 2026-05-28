## Findings

**Type:** general
**Severity:** High
**Confidence:** 100
**Evidence:** The project-tier scope/feature gate fails on 6 of the 35 maxdepth-1 docs. Fresh check over `.gobbi/projects/gobbi/{decisions,design,learnings,notes,backlogs}/*.md` reported `base_schema_errors=0` but `project_scope_feature_errors=6`: `.gobbi/projects/gobbi/design/memory-system-redesign.md` has `feature: project-memory`; notes `2026-05-22-env-var-audit-sessionstart-hook.md`, `2026-05-23-orch-workflow-improvements.md`, `2026-05-24-session-foundations-bundle-b.md`, `2026-05-25-session-foundations-bundle-c-complete.md`, and `2026-05-26-memory-redesign-waves-complete.md` carry non-null feature values. The prompt requires project-tier docs to have `scope: project` and `feature: null` or absent feature value.
**Fix:** Set `feature: null` on every project-tier doc that remains in the root project memory dirs, or move genuinely feature-scoped docs under the appropriate `features/{feature}/` memory tier.

**Type:** general
**Severity:** High
**Confidence:** 100
**Evidence:** The cryptic-title gate fails. Fresh scan found 5 H1 headings and 5 frontmatter `title` values beginning with `Item`: `.gobbi/projects/gobbi/backlogs/auto-mode-silence-vs-always-ask.md`, `broader-delegation-contract-verifier.md`, `skill-loading-discipline.md`, `symlink-into-worktree-alternative.md`, and `two-surface-collapsing-strategy.md`. The prompt requires `0 cryptic-led titles`, broadened to include `Task` and related session-coordinate prefixes; these `Item 1-2`, `Item 1-3`, and `Item 2-1` titles still require the originating session context.
**Fix:** Rewrite the H1 and `title` fields to subject-first titles such as "Auto Mode Always-Ask Categories", "Delegation Contract Verifier", "Skill-Loading Matrix and Validator", "Worktree Symlink Alternative", and "Two-Surface Collapsing Strategy"; keep the original item coordinates only in body provenance where useful.

**Type:** general
**Severity:** Medium
**Confidence:** 90
**Evidence:** Backlog disposition conformance is incomplete. Fresh scan of `.gobbi/projects/gobbi/backlogs/*.md` found `backlog_files_without_disposition=1`: `.gobbi/projects/gobbi/backlogs/README.md`. The prompt requires backlog files to preserve/carry `disposition`; §4.4 also treats `disposition` as legitimate on `backlogs/`.
**Fix:** Add the appropriate `disposition:` value to `backlogs/README.md`, or explicitly document and encode an index-file exemption if README indexes are not intended to follow the backlog extension contract.

Checked clean: §4.5 S-key residue gate over the five project-tier dirs returned 0; conditional non-backlog `disposition:` leak check returned 0; all 35 docs carry the 9 base keys; `git diff-tree --name-only -r 2e24dfe` shows 20 changed files and 0 out-of-scope paths; semantic before/after comparison found 0 non-S frontmatter keys stripped; changed non-index note bodies are intact.

VERDICT: REVISE
