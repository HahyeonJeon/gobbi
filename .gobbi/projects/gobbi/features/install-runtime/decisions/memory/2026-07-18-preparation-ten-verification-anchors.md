---
name: preparation-ten-verification-anchors
description: Preparation locked ten manual verification anchors (six residual/structural + four affirmative-behavior) that Planning must convert into per-task, self-failing acceptance criteria — no automated guard.
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-18
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [process, design]
keywords: [verification-anchors, manual-verification, self-failing-check, planning-input, sop-conformance, affirmative-behavior]
author: claude
supersedes: null
superseded_by: null
related: [cod-proj-001-iter3-literal-verification-predicates-to-planning, struct-f1-boundary-guard-planning-constraint]
---

# Ten manual verification anchors Planning must turn into per-task acceptance criteria

## Context

Preparation's readiness scan (Sub-step C) found no automated conformance / semantic-union / behavioral guard
exists for the `startup` skill's IP-1/IP-2/IP-3 changes and the `scenario`/`checklist`/`evaluation` whole-bundle
SOP migration. During Preparation DISCUSSION the user decided to **keep verification manual** rather than
build a new automated guard — an in-scope execution-method choice, not an out-of-scope deferral (see
`outputs/preparation.md` § Decisions log, "Gap-resolution decision"). Preparation's WORK then formalized that
manual-verification decision into ten explicit anchors, added and refined across three evaluation iterations
(iter2 added the four affirmative-behavior anchors 7-10 after COD-PROJ-001-ITER2 + Claude's F6 found the
original six residual/structural anchors alone did not prove the locked behavior is actually PRESENT, only
that the files exist in the right shape).

## Decision

Planning inherits these ten anchors as the complete set of manual verification obligations for the six-file
`startup` edit (`SKILL.md`, `topics.md`, `recording.md`, `scenario.md`, `checklist.md`, `evaluation.md`).
Planning MUST copy each anchor into task-level acceptance criteria without narrowing it, and MUST additionally
produce the **two-way lock→destination trace** the readiness record requires: every `IP-1-a…e`, `IP-2-a…d`,
`IP-3-a…d`, and `D1…D11` obligation from the locked Idea maps to ≥1 observable acceptance check drawn from (or
built on top of) these anchors, and every changed destination in the six files maps back to a user lock /
retained source clause / named new obligation. An unmapped lock or an unexplained destination fails the
handoff per the readiness record's own teeth.

The full anchor text lives in `2-preparation/outputs/preparation.md` § "Manual Planning verification anchors"
(the canonical, evidence-cited version — Idea line references move on edit, so re-resolve by owner +
surrounding rule + synonym sweep, not by fixed line number). Summary of what each anchor covers:

**Residual + structural anchors (removal / preservation / migration form) — user-kept-manual SOP conformance:**

1. **Per-file authoring-standard conformance** — `scenario.md` against `scenario/SKILL.md`'s SR-1…SR-14,
   `checklist.md` against `checklist/SKILL.md`'s CR-1…CR-7, `evaluation.md` against the startup adapter +
   nine-file contract + D16 order, `SKILL.md` against the skill-writing entry six-section form, `topics.md`/
   `recording.md` against their specialized owner shapes, and the whole package against one-hop-links +
   one-owner-per-fact + references-not-taxonomy-restatement.
2. **MIG-8 per-clause semantic-union orphan sweep** — every legacy Good/Bad/Adversarial check clause (actor,
   trigger, discrimination, logical relations, ordering/cardinality, outcome/failure-oracle, prohibited
   effect, evidence obligation) must survive with `semantic_diff = none` against the union of its mapped
   destinations; structural ID mapping alone does not pass.
3. **ID + consumer preservation** — all 29 legacy family IDs + 119 legacy check IDs preserved (compound
   splits keep the legacy ID on the core claim); require 30 final families after adding PROJ-08 with zero
   legacy-ID loss.
4. **Mirror-parity** — edit only the six canonical files; every `.claude/skills/startup/*.md` mirror stays
   mode-`120000` and resolves to the canonical inode.
5. **IP-2 residual pacing concept/synonym sweep** — zero live pacing policy (cadence, turn limit, fixed
   question/prompt count) survives in source or grading, while every co-located non-pacing rule is preserved.
6. **IP-3 residual-prohibition semantic sweep** — no live clause categorically forbids a new probe on a
   concrete/evidenced answer without the new-in-scope-evidence-child-question allowance; the separate ≤2-repair
   cap for a vague answer is not weakened.

**Affirmative-behavior anchors — the locked behavior must be demonstrated PRESENT, not just structurally
possible (COD-PROJ-001-ITER2 + Claude F6):**

7. **IP-1 affirmative phase-result + confirmation** — a real startup flow produces all four
   `working/phase-results/{phase}.md` documents with a real, separate confirmation response (not a topic
   checkpoint / premise gate / silence / later approval), a blocked next-phase until agreement, and a
   correction/reopen/regenerate/invalidate/reconfirm loop on disagreement. **See
   `cod-proj-001-iter3-literal-verification-predicates-to-planning` — this anchor's pass predicate is
   INCOMPLETE for D2/D3's phase-document schema/body/provenance fields; Planning must add the missing
   clause-level predicate before treating this anchor as self-failing on those fields.**
8. **IP-1 recap-fold + resume-anchor source check** — the current `topics.md:538-541` synthesis pass is
   replaced by the four phase-close hooks with no residual duplicate synthesis, while all 11 Level-1
   checkpoints remain live resume anchors.
9. **IP-2 affirmative agent-judgment** — question grouping and prompt-bank breadth are evidence-led with no
   replacement cadence/turn-limit/fixed-count proxy; two discussions with equivalent evidence but different
   turn grouping get the same verdict.
10. **IP-3 affirmative probe semantics** — demonstrated productive follow-ups under ≥2 different Level-2
    parents, flat/monotonic/never-reused parent-linked `{branch}.p{n}` IDs, and grading that distinguishes a
    ≤2-repair vague-answer case from unbounded evidence-led depth without a turn/probe-count proxy. **See
    `cod-proj-001-iter3-literal-verification-predicates-to-planning` — this anchor's pass predicate is
    INCOMPLETE for D8's two-source-owner/A4/riskiest-assumption/override probe-wiring; Planning must add the
    missing clause-level predicate before treating this anchor as self-failing on that wiring.**

## Rationale

Ten anchors (not the original six) are necessary because file-existence and SOP-shape conformance
(anchors 1-6) prove the six edited files are STRUCTURALLY correct but do not prove the locked IP-1/IP-2/IP-3
BEHAVIOR is actually present — the Codex iter2 evaluator (COD-PROJ-001-ITER2) and Claude's F6 both
independently found this gap, and the affirmative-behavior anchors (7-10) close it by requiring a real
startup flow (or an equivalent inspection) to demonstrate the behavior, not just the file shape. Keeping
verification manual (rather than building a new automated guard) was the user's explicit choice during
Preparation DISCUSSION; the ten anchors plus the two-way trace are the readiness record's operationalization
of that choice into a complete, self-failing verification burden for Planning.

## Alternatives considered

- **Build an automated conformance/semantic-union/behavioral guard instead of manual anchors.** Rejected by
  the user during Preparation DISCUSSION — out of scope for this six-file fix; `check-residual-vocab.sh` is a
  literal-vocabulary gate, not a semantic/behavioral substitute, and no existing guard covers SR/CR
  conformance or IP-1/IP-2/IP-3 behavior.
- **Ship only the six residual/structural anchors (pre-iter2 state).** Rejected: COD-PROJ-001-ITER2 and
  Claude's F6 both found this insufficient — structural conformance does not prove the locked behavior is
  present. The four affirmative-behavior anchors (7-10) were added specifically to close this gap.

## Consequences

Planning MUST copy all ten anchors into task-level acceptance criteria without narrowing any of them, produce
the two-way lock→destination trace, and — per the deferred COD-PROJ-001-ITER3 finding — author two additional
literal, self-failing pass predicates extending anchors 7 and 10 (D2/D3 phase-document schema/body/provenance;
D8 probe-wiring) before those two anchors are treated as a complete verification burden. Any Planning task
that maps a lock to an anchor without a genuinely self-failing check (one that can actually fail against real
evidence, not just cite the anchor number) does not satisfy this decision.

## Note — PREP-CLAUDE-ITER3-001 (Low/25, non-blocking)

Claude's iter3 evaluation separately found that the two-way lock→destination trace enumerates the IP-1/IP-2/
IP-3 + D1-D11 behavioral locks but not the migration locks (D12 + MIG-1..MIG-8 + X-1) by name — a Planning-
awareness note, not a gap in the ten anchors: migration completeness is independently carried by anchor 2
(per-clause semantic-union + reverse sweep) and anchor 3 (30 final families, zero legacy-ID loss).

## Related

- [[cod-proj-001-iter3-literal-verification-predicates-to-planning]] — the deferred iter3 finding that
  narrows anchors 7 and 10's completeness; read together with this file before Planning task authoring.
- [[struct-f1-boundary-guard-planning-constraint]] — a separate live Planning constraint (not one of the ten
  anchors) carried forward from Ideation's disputed STRUCT-F1 finding.
