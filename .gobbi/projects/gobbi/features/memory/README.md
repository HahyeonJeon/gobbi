---
name: README
description: The gobbi memory subsystem — naming, frontmatter, structure, area-namespace schema, validator, and templates that govern every memory file.
type: features
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, schema, validation]
keywords: [area-namespace, frontmatter, rules, templates, validator]
author: claude
value_proposition: A stable, scannable, refactorable memory store every session reads and writes without grep guesswork.
subsystems: [skills/memory, skills/memory/templates, skills/memory/scripts/validate-frontmatter.sh]
---

# Memory subsystem

## Overview

The memory subsystem is gobbi's cross-session durable store under `.gobbi/projects/{project-name}/`. It defines how every memory file is named, what frontmatter it carries, where it lives, and how it is validated. Its canonical docs are `skills/memory/rules.md` (the standard), `skills/memory/memory-map.md` (the path inventory), the 17 type templates under `skills/memory/templates/`, and the `validate-frontmatter.sh` conformance gate.

## Status

The memory AREA + TAG vocabulary was REDESIGNED to a FLAT per-type model on 2026-06-24 (session 84e9570c; both Execution evaluators PASS): `memory-vocabulary.json` now carries `types.{type}.{areas, tags}` at the top level — one independent area list + one tag pool per by-area type (15 active type keys) — replacing the layered universal/project/`effective` model with its shared `spine`/`mistakes` axes. `_shared` is dropped from every area list; area no-match now surfaces a user-decision (`NEEDS_CONTEXT`), never a silent catch-all. `review_kind`/`report_type` are now REQUIRED and the area resolves from the kind value (no `tagAreaMap` entry for reviews/reports). Merge-ordering A: the SCHEMA ships now; the 114-file MIGRATION is DEFERRED to a next session, so the live tree intentionally FAILS whole-tree validation until then (expected debt, not a defect). This refines the prior config-as-data ship (2026-06-23, commits 4557c78c / ed435550 / 9c171908): the validator still reads closed allowlists via `jq`, project-general by design.

The area-namespace schema shipped 2026-06-21 (9 commits on top of develop@7ef21bf5): the `{type}/{area}/{slug}.md` convention, per-type area allowlists, the TOTAL deterministic area-selection rule, the validator's required-area + off-allowlist-area checks, the Wrap-up routing area-resolution, the active-mistake-move carve-out, and the consumer read-glob recursion. File MIGRATION of the existing flat stacks is DEFERRED — tracked by the `memory-namespace-migration` backlog. Until the migration runs, the validator is red on the pre-existing flat files (expected debt).

## Subdirectories

- `design/` — feature-scope design topics (the area-namespace schema; the project-defined vocab config-as-data; the universal base layer; the combined tag→area config; the mistakes trap-class axis)
- `decisions/` — feature-scope decisions (the `area:` keep-or-strip question; the JSON+jq config format; row-level-manifest-as-Execution-deliverable; the universal-tag-baseline split)
- `discussions/` — user-decision narratives (the vocab source + universal layer + migration split)
- `plans/` — the de-hardcoding plan + the 114-file migration manifest
- `changelogs/` — what shipped (de-hardcode area+tag vocab into config)
- `references/` — external prior-art references (DDD, git branches, Johnny.Decimal, PARA, tags-vs-folders, commitlint scopes, GitHub label-sync, Nx multi-dim tags, controlled-vocab hybrid)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Area-namespace schema designed + shipped; migration deferred |
| 2026-06-23 | d0185dba-cd9b-45ad-93f6-7814c4f0ef4a | Area+tag vocab de-hardcoded into project config (config-as-data, JSON+jq); 114-file migration manifest produced; bulk move deferred |
| 2026-06-24 | 84e9570c-bf2b-42b0-af5c-1c181d182e1b | Vocab REDESIGNED to flat per-type model; `_shared` dropped + no-match→user-decision; `review_kind`/`report_type` REQUIRED (kind=area); migration manifest re-derived (zero `_shared`); 114-file move still deferred (merge-ordering A) |

## Open items

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
