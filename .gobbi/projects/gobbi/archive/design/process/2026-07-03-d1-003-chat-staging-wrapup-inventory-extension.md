---
name: d1-003-chat-staging-wrapup-inventory-extension
description: Chat runs full base RECORD per slice; Wrap-up's promotion inventory is extended to glob the Chat staging subtree
type: design
scope: feature
feature: workflow
status: superseded
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, wrap-up]
keywords: [chat-mode, narrowed-pass-path, promotion-inventory, staging]
author: claude
superseded_by: d1-003-chat-staging-wrapup-inventory-extension-shipped
archived_at: 2026-07-03
archive_reason: superseded
---

# GEN-D1-003 — Chat staging is unpromotable (corrected at iter2)

## Problem

`chat-mode.md:254-257` skips base RECORD Steps 6-7 for a Chat slice and `:271-278`/`:314`/`:427-429`
promise Wrap-up mines transcripts/task-records/evaluation to recover findings. But
`wrap-up/SKILL.md:71-78` + Step 2 `:172` inventory ONLY `1-ideation..4-execution` (+ `interview`)
`staging/` — never `chat/tasks/{NN}-{slug}/{N}-{loop}/staging/` (the actual Chat slice layout,
`chat-mode.md:356-367`). Even running full base RECORD per slice would strand findings under a
subtree Wrap-up cannot see.

**iter1 correction history**: the iter1 draft's recommended (b) claimed "no GEN-D7-004 dependency" and
"`wrap-up/SKILL.md` UNCHANGED" as the decisive reason (b) beat alternative (a). The iter1 Claude
evaluator (Project + Risk perspectives, Critical/75) proved this false: under (b) as originally
written, Chat-slice findings would still land in `chat/tasks/.../staging/`, unpromotable — the exact
defect (b) claimed to fix. The design was corrected at iter2 (see below) without needing to reopen the
user's locked (b) choice.

## Scope

In-scope: (i) `chat-mode.md` §4 stops skipping RECORD Steps 6-7 and stops promising Wrap-up mining;
(ii) `wrap-up/SKILL.md` extends its promotion inventory to glob the Chat staging subtree. Out-of-scope:
GEN-D7-004 (documenting `chat/tasks/` in `record/record-map.md` + the scaffold scripts) — not required
by this direction; a hard dependency only for the rejected alternative (a).

## Approach

**Recommended (b), corrected**: base RECORD per slice + extend the Wrap-up inventory (bounded 2-file
fix). (i) `chat-mode.md` §4 removes the Steps 6-7 skip so Chat runs FULL base RECORD per slice; removes
the "Wrap-up mines transcript/task-records/reconstructs" promise (`:271-278`, `:314`, `:427-429`).
`task-record.md` stays a user-facing review/navigation artifact only. (ii) `wrap-up/SKILL.md` extends
the promotion-inventory rule (`:71-78`) + Step 2 (`:172`) to ALSO enumerate
`chat/tasks/*/{N}-{loop}/staging/` and `chat/tasks/*/4-execution/task-*/staging/`. Preserves the
invariant that non-Chat Wrap-up still promotes from `1-ideation..4-execution` + `interview` `staging/`
only.

**Alternative (a, rejected)**: a Chat-specific Wrap-up reconstruction sub-step that mines transcript +
task-records — fights the load-bearing "inventory `staging/` ONLY" invariant AND hard-depends on
GEN-D7-004 for reliable enumeration; transcript-mining is lossy.

**Rationale**: (b) is a bounded 2-file fix that promotes REAL staging files (no reconstruction, no
transcript-mining). Wrap-up globs an already-existing subtree (RECORD writes it per slice), so (b)
does NOT require the GEN-D7-004 record-map/scaffold work. (b)'s honest cost: it removes Chat's
deliberate lightweight-RECORD optimization — the trade-off the user gate surfaces. Both producers
chose (b).

**Affected canonical files**: `orchestration/chat-mode.md` (excise the narrowed-PASS model from every
phrasing, case-insensitive: §4 R5-lock `:246-281`, the mine/reconstruct block `:271-278`, plus
`:83,:102,:108,:123-124,:153,:183,:201,:225,:234,:236,:314,:427-429,:512,:518,:522,:595-597` →
"Chat RECORD runs the unmodified base `record/SKILL.md` procedure"); `wrap-up/SKILL.md:71-78` + `:172`
(add the two `chat/tasks/*/...staging/` globs). `record/SKILL.md` unchanged (base is the target).

## Scenarios

- **Golden**: Chat slice EVALUATION PASS → slice RECORD runs FULL base Steps 6-7, staging typed
  findings to `chat/tasks/{NN}-{slug}/{N}-{loop}/staging/` → Wrap-up's extended inventory globs
  `chat/tasks/*/{N}-{loop}/staging/` (+ `.../4-execution/task-*/staging/`) and promotes. No mining.
- **Failure (rejected alternative)**: reconstruction from transcripts/task-records needs `chat/tasks/`
  documented + scaffolded (D7-004) to enumerate reliably; transcript-mining is lossy.

## Validation

- `git grep -niE 'narrowed PASS path|steps skipped|mine the session transcript|reconstruct typed findings|task-record.*(promotion|staging)' -- .gobbi/projects/gobbi/skills/orchestration/chat-mode.md .gobbi/projects/gobbi/skills/wrap-up/SKILL.md` → zero (minus any deliberately-marked obsolete note).
- `git grep -n 'chat/tasks/\*' -- .gobbi/projects/gobbi/skills/wrap-up/SKILL.md` → shows the two new inventory globs present.
- `git grep -ni 'Promotion-inventory rule' -- .gobbi/projects/gobbi/skills/wrap-up/SKILL.md` → still names `staging/` as the only source class (now including the Chat staging subtree).
- Dry-run: a Chat slice reaches Ideation PASS → RECORD writes `chat/tasks/NN-slug/1-ideation/{outputs,staging}/…`; Wrap-up Step 2 inventories that staging and promotes it; it does NOT read transcript/task-record/evaluation as promotion sources.

## Trade-offs

Optimizes for: reusing real staging files, no reconstruction/mining, no GEN-D7-004 dependency, small
blast radius (2 files). Sacrifices: Chat's deliberate lightweight-RECORD optimization (the per-slice
narrowed PASS path) — the honest cost surfaced to the user at the gate.

## Open issues

- The `chat/tasks/` slice dirs are not created by the scaffold (GEN-D7-004, deferred). Under corrected
  (b), the per-slice `staging/` is created ad-hoc by RECORD writes; for a slice that PASSes with zero
  staged findings, `staging/` may be absent — harmless to the glob but the FIX phase should confirm
  RECORD's write creates the dir (iter2 Low-confidence note, not blocking).

## Related

- [[d7-002-runtime-aware-transcript-audit-branch]] — the sibling RECORD/audit-group fix, sequenced after this one
- [[d1-003-recommended-b-false-noop-rationale]] — the accepted decision documenting the iter1 Critical finding + iter2 correction
- [[manager-must-verify-scope-dependency-claims-before-user-gate]] — mistake-candidate this loop staged
