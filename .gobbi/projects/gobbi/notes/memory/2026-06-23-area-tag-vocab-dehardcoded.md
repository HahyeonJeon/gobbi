---
name: area-tag-vocab-dehardcoded
description: De-hardcoded the memory area+tag vocabulary into a project-owned JSON config; produced the 114-file migration manifest; deferred the bulk move.
type: notes
scope: project
feature: null
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, refactor, schema]
keywords: [area-namespace, tag-vocabulary, config-as-data, jq, migration-manifest, harness-generality]
author: claude
features_touched: [memory]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [project-defined-vocab-config-as-data, universal-base-layer, tag-area-map-combined-config, mistakes-trap-class-axis, config-format-json-jq, dehardcode-area-tag-vocab, area-tag-dehardcoding, area-tag-migration-manifest, execute-area-tag-migration-114-files, git-skill-find-empty-delete-too-broad, worktree-empty-dir-sweep-deletes-live-session-scaffold]
---

# De-hardcode the memory area + tag vocabulary into a project-owned config

## What happened

PR #307 shipped the area-namespace mechanism (`{type}/{area}/{slug}.md`) but left the
area allowlist and the closed tag vocabulary HARDCODED inside the harness — in
`validate-frontmatter.sh` (`AREA_SPINE` / `AREA_MISTAKES` / `TAG_VOCAB`) and in
`rules.md` §1.5 / §2.5. That made the harness non-reusable: a non-gobbi project's own
areas and tags would fail validation against gobbi's hardcoded lists.

This session de-hardcoded BOTH vocabularies (the tag gate sits upstream of area-routing,
so they had to move together) into a single project-owned `memory-vocabulary.json` at the
project root. The bash validator now reads the closed allowlists from that file via `jq`,
so the harness is project-general — a fresh project ships its own copy of the config.
`rules.md` / `wrap-up/SKILL.md` / the #307 design doc were repointed at the config as the
value source. The work ran the full 5-loop workflow (Ideation → Preparation → Planning →
Execution → Wrap-up) with dual-system evaluation, PASS. Shipped on branch
`claude-2026-06-23-d0185dba` in commits 4557c78c / ed435550 / 9c171908.

## What shipped

Code/config (committed, separate from this Wrap-up promotion):
- `memory-vocabulary.json` — the project-owned area + tag + tag→area-map config (read via `jq`).
- `validate-frontmatter.sh` — reads `.effective.{areas,tags}` from the config instead of literals.
- `rules.md` / `wrap-up/SKILL.md` / `features/memory/design/memory/memory-namespace-schema.md` — repointed at the config.

Memory promoted this Wrap-up (24 staging files → memory):
- 4 design docs at `features/memory/design/memory/` (config-as-data, universal base, combined tag→area config, mistakes trap-class axis).
- 7 decisions at `features/memory/decisions/memory/` (incl. `config-format-json-jq` = JSON+jq).
- 1 discussion at `features/memory/discussions/memory/` (vocab source + universal layer + migration split).
- 6 references at `features/memory/references/memory/` (commitlint scopes, GitHub label-sync, Nx multi-dim tags, controlled-vocab hybrid, PARA, …).
- 2 plans at `features/memory/plans/memory/` (the de-hardcoding plan + the 114-file migration manifest).
- 1 changelog at `features/memory/changelogs/memory/`.
- 2 project backlogs (`backlogs/memory/execute-area-tag-migration-114-files`, `backlogs/git/git-skill-find-empty-delete-too-broad`).
- 1 project mistake (`mistakes/git/worktree-empty-dir-sweep-deletes-live-session-scaffold`).

## What got stuck

Nothing blocked. The bulk file MOVE was deliberately split out, not stuck: the design
locks the final vocabulary first so the move happens exactly once (move/repoint is gobbi's
most error-prone operation — the #307 namespace sweep was REVISE'd three times). The
row-level migration manifest (source flat path → destination) was produced as the
execution spec for that deferred move.

## What shifted

- Codex iter2 raised two altitude findings (FAIL): "no row-level manifest file exists" and
  "universal tag baseline values not enumerated." The user reviewed the cross-system
  divergence (Claude=PASS / Codex=FAIL) and honored PASS, reclassifying both as Execution
  deliverables, not Ideation gaps — an Ideation artifact defines the SPEC, the manifest
  TABLE and the baseline VALUES are produced downstream.
- The mistakes `process` bucket was dissolved into trap-classes; `assumption` was ratified
  as a new universal mistakes trap-class. `docs` / `tooling` / `tests` were ratified as the
  universal spine base (domain-agnostic across any project).

## Decisions to respect

- **Config-as-data, single combined file** ([[project-defined-vocab-config-as-data]], [[tag-area-map-combined-config]]): one project-owned file holds areas + tags + the tag→area priority map + feature-dir normalization. Do not re-hardcode any of them.
- **JSON + jq format** ([[config-format-json-jq]]): the config is JSON read by the validator via `jq`; jq is an accepted repo dependency (precedent: `hooks/session-end.sh`).
- **Universal base layer** ([[universal-base-layer]]): `_shared` + `docs`/`tooling`/`tests` (spine) and `assumption` (mistakes) are universal; every project inherits them, none may remove them.
- **Split migration** ([[area-tag-migration-manifest]], [[execute-area-tag-migration-114-files]]): plumbing de-hardcoding ships now; the bulk 114-file move is a separate deferred session so the vocabulary locks first. Move once.
- **Round-trip guarantee**: gobbi's `.effective.*` lists are a SUPERSET of the pre-de-hardcoding hardcoded values, so no currently-valid file becomes invalid.

## Next session

Pick up [[execute-area-tag-migration-114-files]] — the deferred bulk move of all 114 flat
by-area files (both tiers) into namespaced paths, driven by the row-level manifest at
`features/memory/plans/memory/2026-06-23-area-tag-migration-manifest.md`. Repoint every
inbound reference and run both guards to zero. Separately, fix the git skill P5/P8
empty-parent sweep ([[git-skill-find-empty-delete-too-broad]]) to scope the
`find -type d -empty -delete` to the removed worktree only.

## Related

- [[project-defined-vocab-config-as-data]] — the config-as-data design
- [[config-format-json-jq]] — the JSON+jq format decision
- [[area-tag-migration-manifest]] — the 114-file migration manifest (execution spec)
- [[execute-area-tag-migration-114-files]] — the deferred bulk-move backlog
- [[worktree-empty-dir-sweep-deletes-live-session-scaffold]] — the git-cleanup near-miss recorded this session
- [[2026-06-21-memory-namespace-schema-shipped]] — the prior session that shipped the schema mechanism
