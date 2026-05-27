# T7c Executor Draft — S-set extension + residue sweep

## Summary

Two-part task. Part A amended the canonical `memorization/rules.md` to extend the illegitimate-key-set S with session-routing residue keys (`task`, `loop`, `scenario`, `iter`, `slug`, `finding-source`/`finding_source`) and updated the §4.5 gate regex. Part B stripped those keys from 31 already-conformed docs across 4 features.

## Files changed

- `rules.md`: 1 file amended (canonical worktree copy, NOT the .claude symlink)
- 31 residue docs: agents (5), git-workflow (5), guardrails (1), install-runtime (20)

Total: 32 files changed.

## Keys stripped per file

| File | Keys stripped |
|---|---|
| agents/changelogs/2026-05-26-bundle-a-rehome.md | task |
| agents/checklists/d-ref-codes-missing-inline-expansion.md | scenario, loop |
| agents/design/memorization-delegation-hard-gate.md | loop |
| agents/discussions/2026-05-24-shared-executor-context-continuity.md | loop |
| agents/scenarios/hook-silence-no-agents-mutation-diagnostic.md | scenario |
| git-workflow/decisions/2026-05-24-rollback-semantics-drift-from-ideation.md | loop |
| git-workflow/decisions/plan-diff-scope-gate-semantics-under-bundled-pr.md | loop |
| git-workflow/discussions/2026-05-24-direct-mode-opt-out-doc-home.md | loop |
| git-workflow/discussions/2026-05-24-promote-now-rollback-doc-home.md | loop |
| git-workflow/discussions/gap-resolutions-9-batch.md | loop |
| guardrails/discussions/2026-05-24-mistake-bundle-extension-to-t3.md | loop |
| install-runtime/changelogs/2026-05-25-gobbi-hook-authoring-skill-shipped.md | task |
| install-runtime/changelogs/2026-05-26-env-var-audit-shipped.md | task |
| install-runtime/decisions/env-file-load-semantics-decisions.md | loop |
| install-runtime/decisions/pre-planning-readiness-decisions.md | loop |
| install-runtime/decisions/session-start-hook-script-decisions.md | loop, task |
| install-runtime/decisions/task-decomposition-decisions.md | loop |
| install-runtime/design/dual-hook-registration-resolver.md | slug, iter |
| install-runtime/design/flock-serialization-on-session-json.md | slug, iter |
| install-runtime/design/hook-bash-jq-stack.md | slug, iter |
| install-runtime/design/metadata-extraction-input-vs-result.md | slug, iter |
| install-runtime/design/reconstructor-verify-and-fix.md | slug, iter |
| install-runtime/design/tool-use-id-correlation-key.md | slug, iter |
| install-runtime/discussions/dual-hook-registration-confirm.md | slug |
| install-runtime/discussions/edit-contract-addition.md | loop |
| install-runtime/discussions/env-var-audit-scope-discussion.md | loop |
| install-runtime/discussions/hook-contract-verification-gate.md | slug |
| install-runtime/discussions/hook-plus-reconstructor-mechanism.md | slug |
| install-runtime/discussions/mirror-policy-mirror-canonical-relock.md | loop |
| install-runtime/discussions/mirror-policy-workspace-canonical-superseded.md | loop |
| install-runtime/discussions/scope-contract-lock.md | slug |

Total keys stripped: 39 (task=4, loop=18, scenario=2, slug=9, iter=6, finding-source=0)

## Commit

SHA: 5630aa4
Subject: chore(memory): extend S-set + strip session-routing residue from 31 docs

## Verification evidence

1. Extended §4.5 gate = 0 (xargs exit 123 = no matches found)
2. Residue grep = empty (exit 1 = grep found nothing)
3. Base-schema spot-check: 3 files sampled, all show exactly 9 base keys
4. Cross-refs/content-tags: before=63 files, after=63 files (unchanged)
5. §4.4 + §4.5 amended: new S-set table + KEEP note + gate regex extended
6. git diff --name-only: exactly 32 files (rules.md + 31 residue docs)

## Preserved keys (not stripped)

`design-id`, `discussion-id`, `phase`, `sub-step`, `loop-iter`, `topic`,
`outcome`, `category`, `verdict`, `session-id`, `shipped_in`, `plan`,
`supersedes`, `superseded_by`, `domain`, `priority`, `related`, `source`,
`ref_type` — all preserved intact across all 31 files.
