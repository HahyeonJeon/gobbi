---
name: staging-a-mistake-candidate-does-not-fix-the-artifact
description: Staging a mistake about a defect in the artifact does not remove the defect; the artifact must also be corrected in the same pass
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [process, mistake-discipline, artifact-correction]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Staging a mistake-candidate about a defect does not remove the defect from the artifact

## What happened

In iter1, the leader staged `staging/decisions/grep-absence-claim-needs-exact-pattern.md` — a
mistake-candidate correctly identifying that a grep-backed absence claim must use an exact pattern.
However, the leader did NOT also correct the false claim already written in the artifact
(`draft-iter1.md`). The artifact still stated "grep confirms zero hits" with the imprecise pattern.

The dual-system evaluation then caught the same defect in the artifact that the mistake-candidate
described. The mistake-candidate existed and was well-formed, yet the EVALUATION returned REVISE
because the underlying defect in the artifact was still present.

The Claude evaluator noted: "The artifact's own staged mistake predicted its own defect" — this is
the `planning-asserted-skill-without-verifying` irony: the mistake-discipline was applied, yet the
mistake recurred in the same session that recorded it.

## Why it happens

The agent treated staging a mistake-candidate as a complete response to the defect. The mistake-
candidate records what went wrong for future sessions; it does NOT retroactively fix the current
artifact. These are two separate actions: (1) stage the mistake-candidate, AND (2) correct the
artifact.

The mistaken assumption: "I staged the mistake, so the issue is handled."

## Correct approach

When you detect a defect during WORK that warrants a mistake-candidate:
1. Stage the mistake-candidate immediately (per `mistake/SKILL.md § P2`).
2. ALSO correct the artifact in the same WORK pass.

Both steps are required. The mistake-candidate is the memory; the artifact correction is the
deliverable. Omitting step 2 produces a session where the mistake is documented but the evaluation
still fails because the artifact is wrong.

## How to detect

Trigger signal: you have just written a mistake-candidate (e.g.,
`staging/decisions/grep-absence-claim-needs-exact-pattern.md`) and it describes a specific flaw
(e.g., "the grep claim at line X is wrong"). If the flaw you described is in the current iteration's
working draft, stop: the draft still contains the flaw. Staging the mistake-candidate is step 1;
correcting the draft is the required step 2 — do both before WORK is complete.

Secondary signal: you are in the RECORD sub-phase and reviewing the staging directory. If a
mistake-candidate there describes a flaw that will be in the outputs/ artifact, RECORD must flag
this to the manager — it means WORK was incomplete.

## Related

- `mistakes/grep-absence-claim-needs-exact-pattern.md` — the specific mistake staged
  without correcting the artifact in iter1
- `skills/mistake/SKILL.md § P2` — moment-of-capture discipline
- Claude evaluator `1-ideation/evaluation/iter1/claude/overall.md` — "The artifact's own staged
  mistake predicted its own defect"
