---
name: eval-childdoc-checklist-authoring
description: Authoring checklist.md across the 5 loop skills — the Point-2 copy-then-tick contract, box=VERIFIED, legend + counts
type: checklists
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation]
keywords: [checklist-md, copy-then-tick, box-verified, completeness-gate]
author: claude
scenario: eval-childdoc-scenario-authoring
---

# Author `checklist.md` per loop skill — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Extract every bullet check item out of the current `evaluation.md` into a new `checklist.md`, one `- [ ] {CHECK-ID} — {condition}` per item, no restated `Scenario:`/`Procedure:` suffix | novel | implemented | heading-tree + ID integrity guard (scenario.md ↔ checklist.md) |
| 2 | Heading tree in `checklist.md` matches `scenario.md` 1:1 (same 7 perspectives, same family order) | eval-childdoc-scenario-authoring | implemented | markdown-link + heading-tree guard |
| 3 | Point-2 Stage 0: evaluator COPIES `checklist.md` to `evaluation/iter{n}/{system}/checklist.md` before Stage 1 begins (not after Stage 2) | eval-childdoc-scenario-authoring | implemented | `codex/SKILL.md` codex-eval validation block + Claude evaluator Stage-0 fail-closed check |
| 4 | Point-2 Stage 0 is fail-closed: any of the 3 child docs (`evaluation.md`, `scenario.md`, `checklist.md`) missing → Critical `general`/`unevaluable` finding, not a silent skip | novel | implemented | Stage-0 seed-file existence check |
| 5 | Point-2 Stage 1: evaluator-created checks append to a `## Stage 1 Additions` section in the copied file (not edited into the original perspective sections) | novel | implemented | manual read of a filled checklist.md |
| 6 | Point-2 Stage 2: box `[x]` = **verified/covered** (coverage, not outcome) — a FAIL still ticks the box but carries an inline `— FAIL: <finding pointer>` tag; `n/a:` for not-applicable items | eval-childdoc-scenario-authoring | implemented | box-semantics legend present + at least one worked FAIL/`n/a:` example in the template |
| 7 | Filled checklist carries a legend (what `[x]` / `FAIL:` / `n/a:` mean) and a PASS/FAIL/N-A/coverage count line | novel | implemented | legend + count line present in the copied file |
| 8 | Completeness gate before DONE: every source item accounted for, all 7 perspective headings present, validated before the evaluator reports DONE | novel | implemented | `check-eval-childdocs.sh` (built task 01) |
| 9 | Per-perspective evaluation files reference the filled checklist by a compact CHECK-ID table (OQ-3, resolved by integration), not a restated full body | novel | implemented | per-perspective file's `## Per-scenario per-check results` section is a table, not prose duplication |
| 10 | The `checklist.md` basename is disambiguated on every mention — "the filled `checklist.md`" (the per-iter output copy) vs "the `checklist.md` child doc" (the source template) — never a bare unqualified mention | novel | implemented | AESTH-01 (iter6 Low finding) — spot-check qualifiers on every new mention added by Planning/Execution |
| 11 | The §B/§E agent-load-line co-touch category (`agents/evaluator.md`, `gobbi/SKILL.md` load-line references to the split child doc) is repointed via hand-listing + the markdown-link guard, since it falls outside the eval-output-shape sweep families | eval-childdoc-scenario-authoring | implemented | markdown-link guard run over §B/§E files (USAGE-02, iter6 Low finding — self-healing via the `evaluation.md` → sibling pointer chain even if a load-line is missed, but should still be swept) |

## Item details

### 3. Copy timing (Stage 0, not post-Stage-2)

**Anchor reasoning**: this is the integrated Codex proposal element from iter1 (`reconciliation-iter1.md` row 4, `took-codex`) — early-copy makes the copied file the run's live register and handles Stage-1 evaluator-created additions, a gap the Claude-only draft left.

**Verification approach**: the `codex/SKILL.md` codex-eval Step-2 verify sequence includes a `test -f .../checklist.md` existence check, folded with the count-9 fix, landed in task 10's atomic flip.

### 6. Box semantics (`[x]` = verified, not passed)

**Anchor reasoning**: user-locked (see [[four-user-decisions]] OQ-2) over Codex's original "box = passed, leave FAILED items unchecked" proposal — that scheme conflates coverage with outcome and makes an unchecked box ambiguous (not-covered vs failed). Box measures coverage; the inline `— FAIL:` tag measures outcome.

### 11. §B/§E agent-load-line co-touch (USAGE-02 note)

**Anchor reasoning**: the eval-output-shape sweep (D6) certifies surfaces that enumerate/validate the eval-output DIRECTORY. Agent-doc and `gobbi/SKILL.md` lines that merely LOAD the (soon-to-be-split) `evaluation.md` are a structurally different category — a load-line reference, not a directory enumeration — so the sweep families do not certify them. This is a soft gap: the split keeps `evaluation.md` in place and it points to its `scenario.md`/`checklist.md` siblings (D2's pointer lines), so a missed load-line still reaches the split content via the pointer chain. Recorded as iter6 Low finding USAGE-02; resolved via hand-listing + the markdown-link guard as task 10 landed, not the eval-output sweep.

## Related

- [[eval-childdoc-scenario-authoring]] — the scenario this checklist implements
- [[evaluation-childdoc-split]] (design) — the D4 checklist design + Point-2 contract this file operationalizes
- [[four-user-decisions]] — OQ-2 (box semantics) and OQ-3 (ID scheme) locks this checklist enforces
