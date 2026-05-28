# Wave 3 Codex Evaluation Findings

Target: Wave 3 commits `c4155bb..HEAD` (12 commits), memory-redesign feature re-homing.

Source of record read:
- `sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/artifacts/memory-system-redesign-design.md` sections 1.2, 1.3, and 8.
- `skills/memorization/rules.md` frontmatter schema.

Fresh verification evidence:
- `git --no-pager log --oneline c4155bb..HEAD` returns the expected 12 Wave 3 commits.
- `git --no-pager diff --name-status c4155bb..HEAD | grep -c '^D'` returns `0`.
- Diff status summary is `R 140`, `A 22`, with no non-rename/non-add statuses.
- `features/` contains exactly `README.md` plus `agents`, `evaluation`, `git-workflow`, `guardrails`, `install-runtime`, `project-memory`, `workflow`.
- `archive/features/` contains exactly the four retired sprint dirs: `env-var-audit`, `gobbi-orchestration-workflow-improvements`, `session-foundations-bundle-b`, `session-foundations-bundle-c`.
- `find features/{env-var-audit,gobbi-orchestration-workflow-improvements,session-foundations-bundle-b,session-foundations-bundle-c} -name '*.md' 2>/dev/null | wc -l` returns `0`.
- `find features/{workflow,project-memory,agents,evaluation,guardrails,git-workflow,install-runtime} -name '*.md' | wc -l` returns `156` (`136` renamed files into capability features plus `20` new feature README/changelog files).
- All seven capability READMEs start with frontmatter and include `status: active` plus `value_proposition`.
- Each touched capability feature has a `2026-05-26-*-rehome.md` or `2026-05-26-*-shipped.md` changelog.
- `design/archive-move-on-terminal-model.md` and `design/session-lifecycle-worktree-boundaries.md` exist only under project `design/`, not duplicated under `features/*/design/`.

## Findings

### W3-COD-F1 [HIGH|frontmatter_schema|100]

Moved feature-memory files were not consistently restamped to the required base frontmatter shape. The memory rules require every memory file to carry base fields including `type`, `scope`, `feature`, `status`, `created`, `session`, and `tags`; for feature-scoped records, `scope: feature` and `feature: <destination capability>` are required.

The re-home pass moved 136 files into capability feature dirs, but a scan of rename destinations under `features/*` found:

- `132` of 136 renamed feature destinations do not have `scope: feature`.
- `21` renamed feature destinations are missing the destination `feature:` value entirely.

Concrete env-var-audit misses:

- `features/install-runtime/decisions/pre-planning-readiness-decisions.md` has `type: decisions-log`, `session-id`, and no `scope:` or `feature:`.
- `features/install-runtime/decisions/session-start-hook-script-decisions.md` has `type: decisions-log`, `session-id`, and no `scope:` or `feature:`.
- `features/install-runtime/decisions/task-decomposition-decisions.md` has `type: decisions-log`, `session-id`, and no `scope:` or `feature:`.

Concrete Bundle A misses:

- `features/project-memory/design/memorization-moment-of-capture.md` has `feature: project-memory`, but no `type: design` or `scope: feature`, and still carries staging-only provenance keys (`promoted-from`, `promoted-at`).
- `features/agents/design/memorization-delegation-hard-gate.md` has `feature: agents`, but no `type: design` or `scope: feature`, and still carries staging-only provenance keys.
- `features/evaluation/design/codex-skill-structure.md` has `feature: evaluation`, but no `type: design` or `scope: feature`, and still carries staging-only provenance keys.

Impact: the physical re-home shape is mostly correct, but the new capability tree is not machine-readable under the documented memory schema. This also directly contradicts the Wave 3 frontmatter spot-check requirement to confirm moved files are `scope: feature` and restamped to the destination feature.

### W3-COD-F2 [HIGH|routing|95]

Several hook/runtime records were routed to `guardrails`, but the design's routing heuristic says hook/runtime content belongs under `install-runtime`. These are not merely preference-level placements: their content is about Claude Code hook lifecycle events, PostToolUse/PostToolUseFailure schema, hook event counts, and runtime verification.

Defensibly wrong placements:

- `features/guardrails/references/claude-code-hooks-12-lifecycle-events.md`
- `features/guardrails/references/claude-code-posttooluse-hook-schema.md`
- `features/guardrails/backlogs/hook-event-count-31-vs-29-docs-sync.md`
- `features/guardrails/checklists/hook-event-count-31-vs-29-docs-sync.md`
- `features/guardrails/backlogs/posttooluse-failure-webfetch-verification-gap.md`

Evidence: the files discuss shell-command hook support, PostToolUse/PostToolUseFailure inputs, hook event counts, and execution-time hook registration verification. That matches `install-runtime` per design section 1.2 (`session-runtime contract`, hooks, env vars) and section 8 heuristic (`hook/runtime -> install-runtime`), not `guardrails` (`principles` + `mistake` loop).

### W3-COD-F3 [MEDIUM|frontmatter_schema|90]

The archived sprint READMEs have the required `archived_at: 2026-05-26` and `archive_reason: retired`, but their feature lifecycle status remains `status: shipped`. Under the memory rules, feature README status values are `active` or `retired`; these four directories are explicitly retired sprint features in `archive/features/`.

Affected files:

- `archive/features/env-var-audit/README.md`
- `archive/features/gobbi-orchestration-workflow-improvements/README.md`
- `archive/features/session-foundations-bundle-b/README.md`
- `archive/features/session-foundations-bundle-c/README.md`

Impact: the archive shape is correct and no files were deleted, but the frontmatter lifecycle state is inconsistent with the documented feature status enum and the retirement action.

## Passing Spot Checks

Routing spot checks that are defensible:

- `env-file-load-semantics-decisions.md` -> `install-runtime` (env file/runtime semantics).
- `session-start-hook-script-decisions.md` -> `install-runtime` (SessionStart hook).
- `claude-code-hooks-stdin-contract.md` -> `install-runtime` (hook stdin contract).
- `memorization-delegation-hard-gate.md` -> `agents` (delegation load directives).
- `codex-exec-universal-invocation-pattern.md` -> `evaluation` (Codex dual-system evaluator invocation).
- `coverage-ownership-matrix-row-text.md` -> `evaluation` (evaluation coverage matrix).
- `plan-diff-scope-gate-semantics-under-bundled-pr.md` -> `git-workflow` (PR/git scope gate).
- `path-conventions-anchor-casing.md` -> `project-memory` (memory path convention).
- `memorization-moment-of-capture.md` -> `project-memory` (memory/memorization behavior).
- `step-2-5-example-non-canonical-domain-value.md` -> `workflow` (Wrap-up Step 2.5 workflow mechanism).

VERDICT: REVISE
