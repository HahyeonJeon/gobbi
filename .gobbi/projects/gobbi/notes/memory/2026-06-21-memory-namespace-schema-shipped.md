---
name: memory-namespace-schema-shipped
description: Designed and shipped the memory area-namespace schema (convention + validator + routing + carve-out); file migration deferred to a next-session arc.
type: notes
scope: project
feature: null
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, schema, docs-sync, validation]
keywords: [area-namespace, schema-first, migration-deferred, write-vs-ref, branch-b]
author: claude
features_touched: [memory]
steps_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [memory-namespace-schema, area-frontmatter-stray-key, cited-process-mistake-not-applied-to-own-artifact, edit-tool-silent-write-failure-on-worktree, namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep, memory-namespace-migration, memory-renamespace-helper]
---

# Memory area-namespace schema shipped

## What happened

The session gave gobbi memory a git-branch-style namespacing convention: a second category axis (`{area}/`) under every by-area memory type, so `{type}/{slug}.md` becomes `{type}/{area}/{slug}.md` (and `{type}/{area}/{YYYY-MM-DD}-{slug}.md` for date-prefixed types). The work ran the full Ideation → Execution → Wrap-up arc on `develop@7ef21bf5`. Ideation anchored the design on five prior-art references (DDD organize-by-area, git branch slash-hierarchy, Johnny.Decimal bounded namespace, PARA fluid folders, tags-vs-folders one-axis-each) and locked Option A: ship the SCHEMA + conventions + enforcement, DEFER the actual file migration. Execution shipped 9 commits (T1–T7 + 2 eval-iter2 fix commits) touching rules.md §1.5, memory-map, the 17 templates, the validator, the Wrap-up routing, the mistake-skill carve-out, and the consumer read-globs. The Execution evaluation REVISE'd the sweep three times before converging — each round a pattern-grep missed a surface (the interview bootstrap write-path, residual flat paths, body-vs-table drift).

## What shipped

- `features/memory/design/memory/memory-namespace-schema.md` — the schema design.
- `features/memory/decisions/memory/2026-06-21-area-frontmatter-stray-key.md` — the `area:` keep-vs-strip decision (chose Branch B: strip on promotion).
- `features/memory/references/memory/*.md` — the 5 prior-art references.
- `mistakes/verification/cited-process-mistake-not-applied-to-own-artifact.md` — apply a cited process-mistake's checklist to the design's OWN artifact, not only to the future work.
- `mistakes/tooling/edit-tool-silent-write-failure-on-worktree.md` — Edit reported success but writes evaporated on the worktree; verify on disk, switch to `perl -i`/`python3`.
- `mistakes/refactor/namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep.md` — a namespace sweep needs write-vs-ref enumeration across all surfaces, not pattern-grep.
- `backlogs/memory/{memory-namespace-migration, memory-renamespace-helper, legacy-frontmatter-migration-mistakes-domain, date-prefix-inconsistency-changelogs-discussions, stale-layer2-source-refs}.md` — the deferred arc + 2 newly-surfaced defects.
- `features/memory/README.md` — feature directory bootstrapped this session.

## What got stuck

The Execution sweep was REVISE'd three times because each remediation pattern-grepped instead of enumerating by the write-destination-vs-reference distinction. The convergence came only after the sweep enumerated every path-form across every surface (including the bootstrap write-paths). This produced the `namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep` mistake. Separately, the Edit tool silently failed to persist on this worktree — caught only via `git status`, producing the `edit-tool-silent-write-failure-on-worktree` mistake.

## What shifted

The first framing leaned toward a big-bang "namespace + migrate" in one session. It was rescoped to schema-first / migration-deferred (Option A) to keep the review uncompressed and to give gobbi's most error-prone operation (file-move + reference-repointing) its own session with the schema already locked. The `area:` field's lifecycle also shifted: from an open keep-or-strip question to a settled Branch B (staging-only, stripped on promotion).

## Decisions to respect

- Schema-first, migration-deferred (Option A) — do not migrate inside the schema session.
- `area:` is staging-only, stripped on promotion (Branch B) — directory is the sole area encoding.
- Active-mistake-move namespace-refactor carve-out (USER-APPROVED 2026-06-21).
- mistakes use the trap-class area allowlist; `process` is dissolved, not a mistakes area.

## Next session

Pick up `memory-namespace-migration` — move the existing flat files into `{type}/{area}/` and repoint references using the write-vs-ref discipline. The validator is RED (685 violations) on the flat files until this runs. Consider building `memory-renamespace-helper` first to make the move+repoint atomic.

## Related

- [[memory-namespace-schema]] — the schema design this session shipped
- [[memory-namespace-migration]] — the deferred migration arc the next session picks up
- [[cited-process-mistake-not-applied-to-own-artifact]] — a process mistake recorded this session
- [[namespace-sweep-needs-write-vs-ref-enumeration-not-pattern-grep]] — the sweep-discipline mistake recorded this session
