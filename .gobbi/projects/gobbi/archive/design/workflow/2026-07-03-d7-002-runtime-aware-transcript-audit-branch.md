---
name: d7-002-runtime-aware-transcript-audit-branch
description: Branch RECORD's transcript-copy Critical rule on the existing session.json.system field so a Codex-permitted null transcriptPath degrades instead of false-failing
type: design
scope: feature
feature: workflow
status: superseded
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [process, evaluation, codex]
keywords: [transcript-copy, record, audit-coverage, exit-checklist]
author: claude
superseded_by: d7-002-runtime-aware-transcript-audit-branch-shipped
archived_at: 2026-07-03
archive_reason: superseded
---

# GEN-D7-002 — Codex null transcriptPath: Critical + contract false-failure

## Problem

`codex/SKILL.md:59,457` + `gobbi/SKILL.md:62` permit `transcriptPath=null` when Codex rollout lookup
fails ("do not block"). But `record/SKILL.md:191` raises a Critical `general`/`unevaluable` finding
for ANY absent transcriptPath, and the copy is asserted required at `record/SKILL.md:198` (Step 9
VERIFY), `:253` (base exit checklist), `orchestration/SKILL.md:177` (RECORD row),
`record/record-map.md:158-162`, AND word-identically in every per-loop RECORD exit checklist
(`ideation/SKILL.md:457`, `planning/SKILL.md:453`, `preparation/SKILL.md:386`,
`execution/SKILL.md:241`). Claude Code cannot hit this (gate 2 blocks at `gobbi/SKILL.md:67`
guaranteeing a transcript). A Codex-null session both raises a false Critical and false-fails its own
transcript-copy contract at every loop, every iter.

## Scope

In-scope: a runtime-aware branch in RECORD on the existing `session.json.system` field; acknowledging
the Codex-null degraded case at every unconditional transcript-copy contract surface, including the
per-loop exit-checklist restatements. Out-of-scope: any new schema field (unless the alternative below
is chosen instead).

## Approach

**Recommended — runtime-aware RECORD branch on the existing `session.json.system` (no schema
change)**: `claude-code` + absent transcriptPath → Critical `general`/`unevaluable` (unchanged; Claude
Code guarantees transcripts, gate 2 blocks). `codex` + null transcriptPath → skip raw transcript copy;
write a LOWER-severity `general` finding (domain `process`) / audit-coverage-degraded note; continue.
Uses `system` (`session.template.json:8`) — no template/field add.

**Alternative (documented either/or, genuine user gate)**: explicit
`audit.transcript.{status,reason}` field in `session.json` — stamp `available` /
`degraded-codex-rollout-missing` / `missing-critical` at Configuration row 5; RECORD branches on the
stamped status. Distinguishes a deliberately-null Codex path from a broken one; makes audit coverage a
first-class queryable property; larger blast radius (adds `session.template.json` + a row-5 stamp +
field-reference).

**Rationale**: recommended is minimal (root-cause + minimal blast radius) and correct for the contract
— Codex never guarantees transcripts, so any Codex null is "expected"; `system` cleanly partitions the
finding's required two-way classification. The alternative is stronger IF the project wants explicit
audit-coverage telemetry, at a larger blast radius. Genuine minimal-vs-explicit either/or → user
decides; deciding factor: whether a broken-vs-expected Codex null must be distinguishable (only the
alternative does).

**Affected canonical files (recommended)** — the Critical-raising site + the transcript-copy contract
surfaces, with the per-loop exit-checklist restatements COVERED BY DEFERRAL:

- **Primary**: `record/SKILL.md:191` (the `system`-keyed branch — the only Critical-raising site).
- **Contract surfaces (edit)**: `orchestration/SKILL.md:177` (RECORD row — note the copy is
  skipped/degraded under Codex-null); `record/SKILL.md:198` (Step 9 VERIFY — treat Codex-null as
  degraded-pass, not a reported failure); `record/SKILL.md:253` (base exit checklist — same);
  `record/record-map.md:158-162` (transcript rules — add the Codex-null degraded-audit case).
- **Per-loop exit-checklist transcript gates — DEFERRAL, no independent edit, MUST be validated**: the
  "Each agent transcript copied" gate is restated word-identically as each loop's RECORD exit
  checklist — `ideation/SKILL.md:457`, `planning/SKILL.md:453`, `preparation/SKILL.md:386`,
  `execution/SKILL.md:241` — and DESCRIBED (not gated) in `orchestration/workflow/record.md:63` +
  `:328`. **Determination — ALL SIX DEFER**: each loop's RECORD section carries an explicit "Canonical
  procedure: `record/SKILL.md` ... do not re-derive the shared procedure here" note
  (`ideation:408`/`planning:418`/`preparation:351`/`execution:205`) that names transcript copy as
  `record/SKILL.md`-owned; `workflow/record.md` defers the full procedure and its two lines are
  descriptive, not pass/fail gates. **Deferral mechanism**: one clarifying line in `record/SKILL.md`'s
  Step-9 VERIFY / exit-checklist stating the "transcript copied" exit gate is runtime-aware
  (Codex-null = degraded-pass) and that per-loop restatements inherit it — so the 4 loop docs +
  `workflow/record.md` need NO independent edit.

The D7-002 edit set = {`record/SKILL.md` (`:191` branch + `:198` VERIFY + `:253` exit-checklist + the
runtime-aware clarifier), `orchestration/SKILL.md:177`, `record/record-map.md:158-162`}. Keep
Claude-null = Critical + VERIFY-fail everywhere. Optional cross-links `codex/SKILL.md:59` +
`gobbi/SKILL.md:62`. No template edit. (Alternative adds `session.template.json` +
`orchestration/SKILL.md:108` row-5 stamp + Workflow-Metadata field-reference; `state.template.json`
unchanged.)

## Scenarios

- **Golden**: Codex session, `CODEX_THREAD_ID` set, rollout lookup fails, transcriptPath=null →
  RECORD skips raw copy, writes a lower-severity `general`/`process` audit-degraded note, PASSES Step 9
  VERIFY + the base AND every per-loop exit checklist, continues. Claude Code missing transcript →
  still Critical + VERIFY-fail + gate-2 block.
- **Edge (mechanism choice)**: a Codex transcript that SHOULD have existed but is broken → the
  `system`-branch treats it "expected degraded" (Codex never guarantees transcripts); the
  explicit-field alternative could stamp a distinct reason. Deciding factor for the gate.
- **Edge (per-loop restatement, iter3)**: a per-loop exit checklist restates "transcript copied" but
  its RECORD section is MISSING the "Canonical procedure ... do not re-derive" deferral note → the
  restatement would be an independent gate; the validation grep must catch this. All 4 loop docs
  currently HAVE the note (verified) — all defer.

## Validation

- `git grep -n 'Critical' -- .gobbi/projects/gobbi/skills/record/SKILL.md` → the unevaluable-transcript Critical is gated to `claude-code` / guaranteed-transcript loss, not native-Codex null.
- `git grep -ni 'codex' -- .gobbi/projects/gobbi/skills/record/SKILL.md .gobbi/projects/gobbi/skills/record/record-map.md` → Step 2, Step 9 VERIFY, exit checklist, and the record-map rules each acknowledge the Codex-null degraded case.
- **Per-loop exit-checklist coverage (iter3)**: `git grep -niE 'each agent transcript copied|transcript copied' -- .gobbi/projects/gobbi/skills/ideation/SKILL.md .gobbi/projects/gobbi/skills/planning/SKILL.md .gobbi/projects/gobbi/skills/preparation/SKILL.md .gobbi/projects/gobbi/skills/execution/SKILL.md .gobbi/projects/gobbi/skills/wrap-up/SKILL.md .gobbi/projects/gobbi/skills/orchestration/workflow/record.md` → for each hit, confirm its RECORD section carries the "Canonical procedure: `record/SKILL.md` ... do not re-derive" deferral note OR is a descriptive (non-gate) line; none may be an independent "FAIL if absent" assertion. Complement: `git grep -n 'Canonical procedure' -- .gobbi/projects/gobbi/skills/ideation/SKILL.md .gobbi/projects/gobbi/skills/planning/SKILL.md .gobbi/projects/gobbi/skills/preparation/SKILL.md .gobbi/projects/gobbi/skills/execution/SKILL.md` → confirms the deferral note is present in all four loop RECORD sections.
- Dry-run 1: `system=codex`, transcriptPath=null → no Critical `unevaluable`; degraded-audit note; Step 9 VERIFY + base AND per-loop exit checklists PASS (via the inherited runtime-aware base).
- Dry-run 2: `system=claude-code`, transcriptPath=null → Critical `general`/`unevaluable`; VERIFY fails loudly.
- Dry-run 3: `system=codex`, valid rollout → normal copy, coverage not degraded.

## Trade-offs

Recommended optimizes for: minimal blast radius, root-cause fix on the existing field, no schema
migration. Sacrifices: cannot distinguish a deliberately-null Codex path from a broken one (the
alternative's explicit field would). This is the genuine either/or the user gate decides.

## Open issues

**F-STRUCT-D7-002-MAP-INCOMPLETE-2 (resolved at iter3)** — the affected-file map initially (iter1
Codex catch, then iter2 partial fix) omitted the per-loop exit-checklist restatements of the
transcript-copy contract. iter3 resolved this via the per-location DEFER determination + the one-line
clarifier documented above. See `staging/checklists/d7-002-per-loop-exit-checklist-transcript-gates.md`.

## Related

- [[d1-003-chat-staging-wrapup-inventory-extension]] — the sibling RECORD/audit-group fix, sequenced before this one
- [[d7-001-split-fresh-init-resume-rehydration]] — shares `gobbi/SKILL.md` + `orchestration/SKILL.md` (disjoint sections; sequence serially)
- [[d7-002-per-loop-exit-checklist-transcript-gates]] — the checklist_gap finding this design resolves at iter3
- [[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] — mistake-candidate this loop staged
