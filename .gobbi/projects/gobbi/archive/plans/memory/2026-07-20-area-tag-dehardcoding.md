---
name: area-tag-dehardcoding
description: De-hardcode the area+tag vocabulary into one project-owned JSON config the validator reads via jq, plus the complete 114-file migration manifest.
type: plans
scope: feature
feature: memory
status: completed
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [planning, memory, refactor]
keywords: [config-as-data, areas, tags, jq, dehardcoding, migration-manifest]
author: claude
supersedes: null
superseded_by: null
task: WS-A de-hardcoding (areas+tags) + WS-B 114-file migration manifest
task_count: 7
archived_at: 2026-07-20
archive_reason: completed
---

# Area+tag vocabulary de-hardcoding + 114-file migration manifest

## Idea anchor
`features/memory/design/memory/memory-namespace-schema.md` (the #307 design-of-record) + the locked Ideation design at `1-ideation/outputs/ideation-area-tag-vocabulary.md` (areas + tags → one project-owned JSON config-as-data; universal base; Q5 gobbi areas; Q6 combined config + tag→area map).

## Scope Contract reference
`1-ideation/outputs/ideation-area-tag-vocabulary.md` § Scope Contract. THIS session: WS-A de-hardcoding plumbing (areas+tags) + WS-B the complete 114-file migration MANIFEST. The bulk move is DEFERRED (backlog `execute-area-tag-migration-114-files`).

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 1 | Create `memory-areas.json` — gobbi's per-type AREA lists + TAG list + tag→area map + universal base (`_shared`/`docs`/`tooling`/`tests`; mistakes core `verification`/`refactor`/`tooling`/`assumption`) | — | `jq -e .` valid; `jq` reads gobbi's declared areas/tags incl. universal additions | executor |
| 2 | Validator reads config via jq — replace `AREA_SPINE`/`AREA_MISTAKES` (:211-212) + `TAG_VOCAB` (:106); keep dispatch/parser structure; update line-57 comment | #1 | `bash validate-frontmatter.sh` area+tag checks pass reading the config; line-57 states jq dep | executor |
| 3 | Re-author `rules.md` §1.5 area lists (:101,107) + §2.5 tag list (:292-300) + tag→area map (:122-138) — prose stays, values→config pointer | #1 | no literal gobbi vocab list in §1.5/§2.5; map documented as project-declared; links resolve | executor |
| 4 | Repoint `wrap-up/SKILL.md` restatement (:314) + area-resolution map (:308-312) to config/§1.5 | #1, #3 | :314 no longer restates the literal allowlist; links resolve | executor |
| 5 | Co-touch `features/memory/design/memory/memory-namespace-schema.md:38,42` — repoint to project-declared values | #1 | :38,42 no longer hardcode the harness vocabulary | assistant |
| 6 | De-hardcoding verification — all-form/all-scope residual grep + non-gobbi golden scenario + gobbi validator pass | #2,#3,#4,#5 | residual grep returns only the config + gobbi's instance; throwaway non-gobbi config passes tag+area gates; no NEW gobbi violations vs 685/133 baseline | executor |
| 7 | Produce the 114-file migration manifest — both-tier dry-run of §1.5 → row-level source→dest; ref-class enum incl. `layer2-source`; guard strategy; expected-vs-regression criterion | #1 | manifest covers 114 files (34 project+80 feature); rows resolve to gobbi's locked areas; layer2-source ref-class + 3 flat targets listed; guards + RED criterion stated | executor |

## Dependency graph
01 is the foundation (the vocabulary source). 02/03/05/07 each depend only on 01; 04 depends on 01+03 (shared §1.5 framing); 06 depends on 02+03+04+05 (all edits landed). Sequential execution order: 01 → 02 → 03 → 04 → 05 → 06 → 07. No two sub-tasks share a file — zero file-overlap conflicts.

## Verification strategy summary
The gate: (a) `bash validate-frontmatter.sh` passes on gobbi reading the config with no NEW area/tag violations beyond the pre-existing 685/133 legacy baseline; (b) the all-form/all-scope residual-vocab grep returns zero literal gobbi vocab outside `memory-areas.json` + gobbi's declared instance; (c) a throwaway non-gobbi config (tags `[auth,payments]` + areas) passes BOTH the tag gate and area resolution; (d) the 114-file manifest is both-tiers-complete with the `layer2-source` ref-class and the expected-vs-regression criterion. Plus both link/vocab guards to zero on the doc edits.

## Open issues
- Config FILENAME (`memory-areas.json`) is a leader proposal, not user-locked — Ideation deferred filename to Planning/Execution. Sub-task 1 may finalize; a different name propagates to #2/#3/#7 inputs (one-line change). Surfaced for the manager's Always-Ask edit-scope confirm.
- All 5 edited files are gobbi skills/project docs — Always-Ask edit category; the manager confirms the exact 5-file edit-scope with the user before Execution.

## Related

- [[memory-namespace-schema]] — the #307 design-of-record this plan extends
- [[execute-area-tag-migration-114-files]] — the deferred bulk move this manifest specs
