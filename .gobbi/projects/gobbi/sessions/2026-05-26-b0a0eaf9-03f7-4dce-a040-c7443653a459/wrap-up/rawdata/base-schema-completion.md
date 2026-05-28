# Base-schema completion — sub-step WORK-remediate-base-schema-completion

## Summary

After the strip-fix commit (2cd3f5f), 17 promoted project-memory files were missing one or more
of the 9 base-schema keys (name / description / type / scope / feature / status / created /
session / tags). This sub-step added the missing keys to all 17 files and committed to the
chore branch.

## Branch

`chore/session-2026-05-25-a10c82d6` — verified at start and before commit.

## Files modified (17)

| File | Keys added |
|---|---|
| `features/project-memory/checklists/disposition-preservation-missing-t1-t5.md` | name, description, tags |
| `features/project-memory/checklists/task-count-prose-inconsistency.md` | name, description, tags |
| `features/project-memory/decisions/archive-glob-scope-leak.md` | name, description, tags |
| `features/project-memory/decisions/codex-path-traceability.md` | name, description, tags |
| `features/project-memory/decisions/context-budget-wave-ordering-carry-forward.md` | name, description, tags |
| `features/project-memory/decisions/coupling-mischaracterization-deferred.md` | name, description, tags |
| `features/project-memory/decisions/fx1-sub-count-cross-foot.md` | name, description, tags |
| `features/project-memory/decisions/prose-tasks-exceed-context-ceiling.md` | name, description, tags |
| `features/project-memory/decisions/t10-symlink-mismodel.md` | name, description, tags |
| `features/project-memory/decisions/triplicate-backlog-remediated.md` | name, description, tags |
| `features/project-memory/decisions/underscore-staging-keys-false-clean.md` | name, description, tags |
| `features/project-memory/references/adr-decision-record-shape.md` | name, description, scope, feature, status, created |
| `features/project-memory/references/diataxis-type-purity.md` | name, description, scope, feature, status, created |
| `features/project-memory/references/docs-as-code-linting.md` | name, description, scope, feature, status, created |
| `features/project-memory/references/frontmatter-as-schema.md` | name, description, scope, feature, status, created |
| `features/project-memory/references/markdown-memory-atomicity.md` | name, description, scope, feature, status, created |
| `backlogs/evaluation-perspective-for-dev-doc-quality.md` | name, description, tags |

Note on reference files: these 5 files were UNTRACKED before this commit (never part of 2cd3f5f).
They use `title` (type-specific reference key) + `type: code|docs|blog` (source type). The base
`type` key is already satisfied by their existing `type:` field. The `scope`, `feature`, `status`,
and `created` keys were absent and added. Tags were already present; `name` and `description` added.

## Verification results

| Gate | Result |
|---|---|
| V1: branch == chore/session-2026-05-25-a10c82d6 | PASS |
| V2: all-9-base-keys=none-missing | 0 files missing (PASS) |
| V3: §4.5 promoted-files S-key leak count | 0 (PASS) |
| V3b: disposition-on-non-backlog | 0 (PASS) |
| V4: body line removals | 0 (PASS) |
| V5: files changed == features/project-memory/ + the backlog | PASS (17 files) |

## Commit

SHA: `35af0c5`
Subject: `chore(wrap-up): add missing base-schema keys to 17 promoted project-memory files`
Files changed: 17 (12 modified, 5 new reference files created)
Insertions: +216; Deletions: 0

## No S-key reintroduction

Checked: none of the added keys (name, description, tags, scope, feature, status, created) are
members of the S-set (finding-id, confidence, severity, loop, iter, scenario, task, promoted-*,
staged-*, finding_id). The gate remains 0.
