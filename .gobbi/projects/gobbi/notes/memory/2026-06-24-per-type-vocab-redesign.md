---
name: per-type-vocab-redesign
description: Per-session journal — the per-type flat memory-vocabulary redesign (drop layering + _shared; no-match user-decision; kind-required reviews/reports). Schema ships; 114-file migration deferred (merge-ordering A).
type: notes
scope: project
feature: null
status: active
created: 2026-06-24
session: 84e9570c-bf2b-42b0-af5c-1c181d182e1b
tags: [memory, schema, rename-sweep]
keywords: [per-type-vocab, flat-model, no-match-user-decision, kind-required, deferred-migration]
author: claude
features_touched: [memory]
---

# Session journal — per-type memory-vocabulary redesign (2026-06-24)

## What shipped

The memory vocabulary moved from a LAYERED model (universal base + project overlay + `effective`
computed layer; two shared area axes `spine` + `mistakes`; one global tag pool) to a FLAT per-type
model: `memory-vocabulary.json` now carries `types.{type}.{areas, tags}` at the top level — one
independent area list + one independent tag pool per by-area type (15 active type keys; `archive` has
no key, mirroring its source type's area). Three locked decisions drove the redesign:

- **Flat per-type model (L1–L12).** Per-type areas + per-type tag pools; no composition layers.
- **`_shared` dropped + no-match → user-decision (L13/L14).** No catch-all area anywhere. On area
  no-match, the write/move agent emits `NEEDS_CONTEXT`; the manager asks the user to pick an existing
  area or create one (an Always-Ask edit to `memory-vocabulary.json`). This is the ONE
  mechanism-touching change; the rest is pure vocabulary-layer.
- **`review_kind` / `report_type` REQUIRED; area resolves from the kind value (L5/L6/L16).** No
  `tagAreaMap` entry for reviews/reports; their kind value IS the area. `other` added as the reports
  kind catch-all (parity with reviews).

## How it was built

8 planned tasks. Tasks 01–06 + a docs-sync fix shipped as 7 commits on the branch during Execution
(vocab JSON, validator, rules.md, wrap-up/SKILL.md, 17 templates, memory-map, plus the docs-sync
correction `5e57c575`). Tasks 07 (supersession) + 08 (re-derived manifest) were COMPUTED and STAGED
during Execution but their DURABLE writes were deferred to Wrap-up (the sole memory writer) and
performed this Wrap-up:

- Task 07: created `decisions/.../no-match-user-decision-supersedes-shared-resolution`; flipped the
  contradicting `2026-06-23-shared-resolution-expected-in-manifest` to `status: superseded` +
  `superseded_by:`; `git mv`'d it to `archive/decisions/memory/` (move-on-terminal). Round-trip OK.
- Task 08: overwrote the durable migration manifest with the re-derived (per-type, ZERO-`_shared`)
  resolution model. SPEC-only; no file moves.

Both Execution evaluators PASSed.

## Decisions that constrain future sessions

- **Merge-ordering A.** The redesign ships now; the 114-file MIGRATION is deferred to a next session.
  The live tree intentionally FAILS whole-tree validation until the migration runs — this is EXPECTED,
  not a defect (residual `_shared/` paths fail the fail-closed area check by design).
- **No `_shared` fallback.** Any record that matches no area is a user-decision, never a silent
  catch-all. 6 of the 17 formerly-`_shared` records are flagged-for-user-decision in the re-derived
  manifest; 11 re-route to a real area via L12 generic-tag routing.
- **F-C1 note.** The scope contract's Success-Criterion-8 was superseded by OF-1's explicit per-form
  greps (the guard `check-residual-vocab.sh` false-PASSes on the redesign's retired forms).

## Mistakes promoted

- `mistakes/refactor/consumer-spec-cites-process-not-sites` — a consumer-change spec cited the sweep
  discipline in prose but under-enumerated sites + mis-cited a line.
- `mistakes/verification/guard-cited-as-runtozero-without-matching-vocab` — a verification guard cited
  as run-to-zero proof, but its pattern matched only a prior rename's vocabulary (false-PASS). This is
  a Layer-2 candidate (a universal sweep-verification lesson).

## Next job

Execute the deferred 114-file migration (`[[area-tag-migration-manifest]]` /
`[[memory-namespace-migration]]`): move files to per-type areas, handle the 6 flagged no-match files,
repoint refs, run the guards to zero — extending `check-residual-vocab.sh` first per
`[[extend-residual-vocab-guard-for-per-type-sweep]]`.

## Related

- [[per-type-flat-vocab-model]] — the flat-model decision
- [[no-match-user-decision-supersedes-shared-resolution]] — the `_shared`-drop / no-match decision
- [[reviews-reports-kind-required]] — the kind-required decision
- [[area-tag-migration-manifest]] — the deferred migration spec re-derived this session
- [[extend-residual-vocab-guard-for-per-type-sweep]] — the OF-1 guard-extension backlog
