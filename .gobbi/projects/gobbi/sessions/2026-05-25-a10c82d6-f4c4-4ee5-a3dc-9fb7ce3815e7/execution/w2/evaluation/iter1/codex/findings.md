# Codex adversarial findings - memory-redesign Wave 2

Target range: `8cead69..HEAD` (6 commits verified with `git --no-pager log --oneline 8cead69..HEAD`).

## Verification Summary

- PASS: `ls backlogs/ | grep -c '^item-'` returned `0`; the five renamed backlog concept slugs are present.
- PASS: `ls learnings/ | grep -c 'f-aes-01'` returned `0`.
- PASS: `features/gobbi-orchestration-workflow-improvements/decisions/` has no `concern-*`, `iter*`, `item-*`, `ideation-*`, `planning-*`, `preparation-*`, or `tN-*` filenames; `design/` has no `item-*` filenames.
- PASS: The four named compliant decision files are still present: `codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`, `constraints-body-block-convention-deferred-to-planning.md`, `plan-diff-scope-gate-semantics-under-bundled-pr.md`, and `step-2-5-example-non-canonical-domain-value.md`.
- PASS: `iter1-user-redirects.md` was not physically deleted; it was moved to `features/gobbi-orchestration-workflow-improvements/archive/decisions/2026-05-23-iter1-user-redirects.md` with `status: superseded`, and the two extracted decision files are present.
- PASS: `find features/env-var-audit -name '*.md' | grep -Ec '(^|/)(ideation-|planning-|preparation-|t[0-9]-)'` returned `0`.
- PASS: `features/env-var-audit/README.md` exists and `git diff --quiet 8cead69..HEAD -- .../README.md` succeeded.
- PASS: The five env-var-audit closed-sprint logs are `R100` renames with no content change: `ideation-decisions`, `preparation-decisions`, `t1-decisions`, `planning-decisions`, and `ideation-discussion` were de-prefixed but kept intact.
- PASS: `find features/session-foundations-bundle-b -name '*.md' | grep -Ec '(^|/)(iter[0-9]|t[0-9]-)'` returned `0`.
- PASS: User amendment honored: `features/session-foundations-bundle-b/design/five-locked-decisions.md` still exists and was not renamed.
- PASS: `git --no-pager diff --name-status 8cead69..HEAD | grep -c '^D'` returned `0`.
- PASS: No `skills/` or committed `sessions/` paths appear in the range diff.

## Findings

### [HIGH|general|100] Scope contract violated by committed `notes/` edits

Evidence:

- The user scope allowed only `backlogs/`, `learnings/`, and the three named feature directories plus their `archive/` subdirs.
- `git --no-pager diff --name-status 8cead69..HEAD` includes two out-of-scope modifications:
  - `M .gobbi/projects/gobbi/notes/2026-05-24-session-foundations-bundle-b.md`
  - `M .gobbi/projects/gobbi/notes/2026-05-25-session-foundations-bundle-c-complete.md`
- The changes are stale-reference rewrites in notes (`item-1-2-skill-loading-discipline` -> `skill-loading-discipline`, and `f-aes-01-locked-wording...` -> `locked-wording...`), but the path scope gate explicitly excluded `notes/`.

Impact:

The Wave 2 change set fails the stated scope gate even though the edits are logically related to slug renames. The producer expanded scope beyond the allowed path set.

Required revision:

Remove the `notes/` modifications from this Wave 2 range, or get explicit user authorization to include `notes/` as part of the accepted scope.

### [HIGH|design_flaw|100] All four added split files fail the shared-base frontmatter schema

Evidence:

- `git --no-pager diff --name-status 8cead69..HEAD | awk '$1 == "A" {print $2}'` returns four added split files:
  - `.gobbi/projects/gobbi/features/env-var-audit/references/claude-code-changelog-ccsi-version.md`
  - `.gobbi/projects/gobbi/features/env-var-audit/references/claude-code-hooks-stdin-contract.md`
  - `.gobbi/projects/gobbi/features/gobbi-orchestration-workflow-improvements/decisions/codex-exec-universal-invocation-pattern.md`
  - `.gobbi/projects/gobbi/features/gobbi-orchestration-workflow-improvements/decisions/wrap-up-step-2-5-escalation-default.md`
- They all start with `---` and appear atomic, one concept per file.
- Current memory rules require every memory file to carry shared base keys `name`, `description`, `type`, `scope`, `feature`, `status`, `created`, `session`, and `tags` (`skills/memorization/rules.md` lines 63-76), plus only the per-type extension allowlist.
- Frontmatter check against those required keys found:
  - Both new `references/` files are missing `name`, `description`, `scope`, and `status`; they also use `type: docs` instead of base `type: references`, and keep staging/provenance fields `promoted_from` / `promoted_at`.
  - Both new `decisions/` files are missing `name`, `description`, `scope`, and `tags`; they use evaluation/staging fields (`slug`, `domain`, `type: design_flaw`, `disposition`, `mistake-candidate`) instead of promoted decision frontmatter (`type: decisions`, `decision_status`, etc.).

Impact:

This violates the explicit "valid base frontmatter" gate for every new split file. It also leaves promoted project-memory files with staging/evaluation vocabulary that the current memory standard says Wrap-up must strip.

Required revision:

Restamp each added split file with shared base frontmatter plus the correct per-type extensions:

- For `references/`: `type: references`, `scope: feature`, `status: active`, `name`, `description`, `tags`, plus `title`, `source`, `accessed`, and `ref_type: docs`; remove `promoted_from` / `promoted_at`.
- For `decisions/`: `type: decisions`, `scope: feature`, `status: active`, `name`, `description`, `tags`, plus `supersedes`, `superseded_by`, and `decision_status`; remove staging/evaluation-only fields.

VERDICT: REVISE
