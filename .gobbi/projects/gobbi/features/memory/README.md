---
name: README
description: Typed durable memory, staging-only promotion, ordinary supersession, archive moves, and current validation ownership.
type: features
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: []
keywords: [area-namespace, frontmatter, rules, templates, validator, memory, schema, validation]
author: claude
value_proposition: Evidence-backed durable memory promoted only from typed staging and verified against the actual worktree tree.
subsystems: [skills/memory, skills/memory/templates, skills/memory/scripts/validate-frontmatter.sh]
---

# Memory subsystem

## Overview

The memory subsystem is Gobbi's cross-session durable store under `.gobbi/projects/{project-name}/`. It defines how each memory file is named, typed, scoped, promoted, superseded, archived, and validated. Its owners are `skills/memory/SKILL.md`, `skills/memory/rules.md`, `skills/memory/memory-map.md`, the type templates, and the Memory-owned frontmatter validator.

## Current contract (2026-07-20)

- Working steps never write durable memory directly. RECORD stages evidence under an authorized typed `staging/` directory. Empty staging is valid and must not be padded.
- Wrap-up WORK freezes a complete source-to-destination promotion manifest and destination preimages, applies it idempotently only inside the session worktree, and verifies each changed path against the actual tree.
- Promotion accepts regular files only from typed staging. There are no direct journal, rule-candidate, transcript, or other non-staging exceptions.
- The evaluated handoff has one body in `4-wrap-up/outputs/handoff.md` and `notes/{area}/{YYYY-MM-DD}-{slug}.md`; only durable frontmatter may differ.
- Ordinary one-record supersession remains reciprocal. A terminal record moves whole to its typed archive home; it is not deleted. Active mistakes and learnings remain live.
- The memory-compaction subsystem, thresholds, merge manifests, and merge-reference guard are retired. Memory volume never triggers automatic or manual merge compaction.
- `session.json` version 5 stores only durable lifecycle summaries. `state.json` version 3 remains the router; neither durable memory nor the Memory validator becomes a routing or telemetry store.
- `skills/memory/scripts/validate-frontmatter.sh` is the Memory-owned command in the ten-command set. Wrap-up EVALUATION uses two fresh system reports over the post-promotion tree.

## Historical status

The dated implementation account below is retained as evidence. Earlier compaction and guard details are not current behavior.

The memory AREA + TAG vocabulary was REDESIGNED to a FLAT per-type model on 2026-06-24 (session 84e9570c; both Execution evaluators PASS): `memory-vocabulary.json` now carries `types.{type}.{areas, tags}` at the top level — one independent area list + one tag pool per by-area type (15 active type keys) — replacing the layered universal/project/`effective` model with its shared `spine`/`mistakes` axes. `_shared` is dropped from every area list; area no-match now surfaces a user-decision (`NEEDS_CONTEXT`), never a silent catch-all. `review_kind`/`report_type` are now REQUIRED and the area resolves from the kind value (no `tagAreaMap` entry for reviews/reports). Merge-ordering A: the SCHEMA ships now; the 114-file MIGRATION is DEFERRED to a next session, so the live tree intentionally FAILS whole-tree validation until then (expected debt, not a defect). This refines the prior config-as-data ship (2026-06-23, commits 4557c78c / ed435550 / 9c171908): the validator still reads closed allowlists via `jq`, project-general by design.

The area-namespace schema shipped 2026-06-21 (9 commits on top of develop@7ef21bf5): the `{type}/{area}/{slug}.md` convention, per-type area allowlists, the TOTAL deterministic area-selection rule, the validator's required-area + off-allowlist-area checks, the Wrap-up routing area-resolution, the active-mistake-move carve-out, and the consumer read-glob recursion.

The deferred file MIGRATION was EXECUTED 2026-06-24 (session 1cd48095) as a single-session 8-task campaign: the residual-vocab guard was segmented into two vocab-family triples, the 114 flat by-area files were frontmatter-normalized + area-recomputed + `git mv`-relocated, all reference classes were repointed, spent journals were archived (not deleted), and the whole-tree validator was driven from 689 violations to 0 with both guard families exiting 0. The interim RED debt is now closed.

## Subdirectories

- `design/` — feature-scope design topics (the area-namespace schema; the project-defined vocab config-as-data; the universal base layer; the combined tag→area config; the mistakes trap-class axis; the single-session migration+curation campaign)
- `decisions/` — feature-scope decisions (the `area:` keep-or-strip question; the JSON+jq config format; row-level-manifest-as-Execution-deliverable; the universal-tag-baseline split)
- `discussions/` — user-decision narratives (the vocab source + universal layer + migration split)
- `plans/` — the de-hardcoding plan + the 114-file migration manifest + the 8-task migration execution plan
- `checklists/` — implementation checklists (the Family-A guard allowlist completeness check)
- `changelogs/` — what shipped (de-hardcode area+tag vocab into config)
- `references/` — external prior-art references (DDD, git branches, Johnny.Decimal, PARA, tags-vs-folders, commitlint scopes, GitHub label-sync, Nx multi-dim tags, controlled-vocab hybrid, agent-memory consolidation, LSM threshold-merge compaction, sleep-consolidation push/pull, Zettelkasten Map-of-Content)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Area-namespace schema designed + shipped; migration deferred |
| 2026-06-23 | d0185dba-cd9b-45ad-93f6-7814c4f0ef4a | Area+tag vocab de-hardcoded into project config (config-as-data, JSON+jq); 114-file migration manifest produced; bulk move deferred |
| 2026-06-24 | 84e9570c-bf2b-42b0-af5c-1c181d182e1b | Vocab REDESIGNED to flat per-type model; `_shared` dropped + no-match→user-decision; `review_kind`/`report_type` REQUIRED (kind=area); migration manifest re-derived (zero `_shared`); 114-file move still deferred (merge-ordering A) |
| 2026-06-24 | 1cd48095-d745-4868-a5ac-f48326eb447f | 114-file area+tag MIGRATION EXECUTED (single-session 8-task campaign): two-family residual-vocab guard, frontmatter/tag/status normalization, per-file area recompute, `git mv` relocation, reference repoint, archive-only curation; validator 689→0; both guards exit 0 |
| 2026-06-25 | 463a1c96-f75c-4a14-80b4-f4d6815679cd | Memory-COMPACTION mechanism added (Wrap-up Stage-2c, ships DORMANT `enabled: false`): per-`{type}/{area}/` cap (softCap 12 / hardCap 15), uniform lossless merge→Map-of-Content + `git mv` to `archive/` (`archive_reason: merged`), new `check-merge-ref-integrity.sh` two-family gate, `validate-frontmatter` accepts `supersedes` list form; runs inside the non-skippable Stage-3 gate. Added 4 compaction prior-art references. Cap-tuning deferred (`backlogs/memory/compaction-cap-tuning.md`) |

## Current open work

- Keep the full live-tree frontmatter validator green, including the corrected `scenarios` tag vocabulary.
- Complete the final promotion, actual-tree, matching-handoff, link, and exact-scope fixtures from the locked redesign plan.

## Historical backlog references

The entries below describe older migration work and are not the current queue.

- [[memory-namespace-migration]] — move flat files into area namespaces + repoint references
- [[memory-renamespace-helper]] — atomic move + reference-repoint tool
- [[legacy-frontmatter-migration-mistakes-domain]] — two mistakes missing required `domain:`
- [[execute-area-tag-migration-114-files]] — the deferred bulk move of all 114 flat by-area files into namespaced paths
- [[extend-residual-vocab-guard-for-per-type-sweep]] — extend `check-residual-vocab.sh` to detect the redesign's retired forms before the migration sweep relies on it

## Related

- [[memory-namespace-schema]] — the area-namespace schema design (2026-06-21)
- [[project-defined-vocab-config-as-data]] — the config-as-data design shipped 2026-06-23
- [[config-format-json-jq]] — the JSON+jq config format decision
- [[area-tag-migration-manifest]] — the 114-file migration manifest
