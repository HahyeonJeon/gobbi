---
name: startup-review-proportionality
description: Consolidated decision — single-system Ideation evaluation + full dual-system Execution evaluation was the right proportionality choice; the Execution dual-system gate caught 5 real semantic defects the cheaper path would have missed.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-14
session: 97d3ef5a-1b8a-4dab-b884-9f686e185b22
tags: [process, evaluation, execution, verification, design]
keywords: [proportionality, dual-system, mandatory-evaluation, anti-groupthink, codex]
author: claude
related: [acceptance-gate-and-conjunct-escape-hatch]
---

# Evaluation proportionality: single-system Ideation, full dual-system Execution — and it paid off

## Context

Gobbi's default dual-system model pairs an independent Claude run with an independent Codex run at
both creation (PRODUCTION) and review (EVALUATION). This session ran that model with deliberate
proportionality across two loops:

- **Ideation** ran dual-system PRODUCTION (a Claude producer + a Codex proposer generated
  independently; `working/reconciliation-iter1.md` records 28 integration deltas — 16 SELECT-codex,
  3 KEEP-mine, ~9 MERGE-structure, no unresolved large-gap) but single-system (Claude-only)
  EVALUATION. Only `evaluation/iter1/claude/` exists on disk for this loop — no
  `evaluation/iter1/codex/` directory was created.
- **Execution** ran the mandatory full dual-system model at EVALUATION (independent Claude + Codex
  evaluators, both covering all 7 perspectives + Overall, across two iterations) — the gobbi
  workflow's standing default for this loop, non-optional.

The question this session's outcome answers: did the extra cost of full dual-system evaluation at
Execution actually buy anything a cheaper path would have missed — and was skipping the second
Ideation evaluator a real gap or a sound proportionality call?

## Decision

Keep both halves of this session's configuration as the standing pattern: Ideation/Planning
evaluation may run single-system when the dual-system signal was already delivered at PRODUCTION;
Execution evaluation keeps the mandatory full dual-system gate. The session's own evidence answers
both questions — the proportionality call at Ideation was sound, and the mandatory gate at Execution
bought something Critical-adjacent that a single-system path would have missed.

## Rationale

**Ideation — single-system evaluation was proportional, not a gap.** The dual-system model's core
purpose is to prevent one system's blind spots from silently passing review. At Ideation, that check
already happened in PRODUCTION: the Codex proposal exposed structural and substance gaps (the
acceptance-invariants layer, the per-axis perspective mapping, the 1:1 axis↔branch topology) the
Claude producer's own draft lacked, and the reconciliation log shows genuine adjudication, not
rubber-stamping. Running a second independent Codex EVALUATION pass on top of that would re-check
largely the same ground the PRODUCTION integration already surfaced and resolved. The single Claude
evaluator that did run still caught two real High findings (an ungraded principle, a 44→46 count
propagation gap) — proof the lighter path was not simply skipped scrutiny.

**Execution — the mandatory dual-system gate caught something a single system missed entirely.** At
Execution iter1, the Claude evaluator returned Overall **PASS** with only 2 Low findings, having run
all 4 mechanical guard scripts green and stress-tested the design's own canonical adversarial. The
independent Codex evaluator, working from the same frozen artifact with no visibility into the
Claude evaluator's read, returned Overall **REVISE** with **5 independent High-confidence/
High-severity `design_flaw` findings** — including a genuine acceptance-logic contradiction
(`COD-EXE-CONS-001`, see [[acceptance-gate-and-conjunct-escape-hatch]]) that let a hollow,
unevidenced baseline pass the shipped teeth check, directly undermining the rewrite's core stated
purpose. None of the 5 High findings were mechanical (parity, count, link, or vocabulary defects the
guards would have caught) — every one was a semantic gap between the artifact's local check wording
and either the locked design contract or the document's own separately-stated invariant. A
single-system evaluation path, however careful, produced zero of these 5 findings; the
anti-groupthink signal from a second, independent reader is what surfaced them. A regression pass at
iter2 (8 probes, all PASS) additionally caught that one of the 5 fixes was only partially applied — a
gap a producer self-check would plausibly have missed.

## Alternatives considered

- **Run full dual-system evaluation at Ideation too** (the standing default per `CLAUDE.md`) — not
  run here; judged disproportionate given the dual signal already delivered at PRODUCTION for this
  iteration.
- **Skip Ideation evaluation entirely** — rejected; Ideation evaluation is optional but valuable, and
  the single evaluator caught two real High findings against the dual-produced draft.
- **Single-system evaluation at Execution too** (matching the cheaper Ideation configuration) — would
  have shipped the `startup` rewrite with the Family-5 acceptance-logic contradiction live, silently
  defeating the rewrite's whole purpose — the single point of failure this session's evidence argues
  most strongly against.
- **Dual-system Execution evaluation but skip the fresh Codex re-check at iter2** — would have
  accepted the iter2 fix on the producer's own word alone, missing the partial-coverage gap the
  iter2 re-evaluation caught.

## Consequences

- No change to the standing evaluation configuration — this decision is a confirmation, not a
  proposal to alter policy. It obligates future sessions with a similarly "mechanically clean,
  high design-fidelity" artifact to still expect Execution's dual-system gate to run in full, even
  when the Claude producer's own PASS looks solid.
- Ideation/Planning evaluation may continue to run single-system, PROVIDED the dual-system signal was
  genuinely delivered at PRODUCTION for that iteration (a real Codex proposal with a documented
  integration log) — this is a per-iteration proportionality call, not a blanket exemption.
- This session's Execution/Planning WORK ran in **degraded** production mode (Codex proposal absent
  for every task) — a separate, independent signal from the evaluation-value finding above. Evaluation
  value and production value are independent: this session shows dual evaluation delivering strong
  value even while dual production was unavailable.

## Related

- [[acceptance-gate-and-conjunct-escape-hatch]] — the specific High finding this decision cites as
  the clearest evidence of dual-system evaluation value
- [[scope-narrowed-to-design-craft]] — the sibling decision from this session's Ideation loop
