---
name: handoff-verdict-claim-not-matched-to-on-disk-eval
description: "Handoff/summary recorded a PASS verdict for a task iteration where the on-disk evaluator file shows REVISE — claim made from working memory rather than the on-disk artifact."
type: mistakes
scope: project
feature: null
status: active
created: 2026-05-25
session: 45388fa9-74a5-42ff-acdf-1308ca35523f
tags: [process, evaluation, iron-law-7]
domain: process
supersedes: null
superseded_by: null
---

# Handoff Verdict Claim Not Matched to On-Disk Eval

## What happened

The HANDOFF (wrap-up artifacts) recorded "both PASS" for T07 iter2, stating that both the Claude and Codex evaluation systems passed in iteration 2. The on-disk Codex evaluation artifact at `execution/task-07/evaluation/iter2/codex/overall.md` carries `VERDICT: REVISE` (OVERALL-001, High/90 — stale `gobbi/SKILL.md` refs). The Codex REVISE was a real finding that was dispositioned DEFERRED as out-of-contract during the session. The handoff flattened the "PASS on contracted scope with deferred out-of-contract REVISE" decision into a simple "both PASS" — a false summary of the on-disk eval state.

## Why it happens

The verdict carried from working memory: the manager/author held a "T07 accepted PASS on contracted scope" decision in context and wrote "both PASS" to the handoff without re-reading the on-disk evaluation files to verify the exact verdicts. The per-task PASS-on-contracted-scope decision compressed correctly in the manager's understanding, but the compression was applied to the handoff claim without verifying that the on-disk artifact matched. The on-disk Codex verdict was REVISE, not PASS. This is the same Principle 7 violation pattern as `leader-iter2-verification-claim-without-evidence` — appearing at the manager/handoff level rather than the leader/remediation level.

## How to detect

Trigger signal: a handoff, summary, or state file records a verdict (PASS, REVISE, FAIL) for a task iteration, but the claim was not preceded by a `Read` or `grep` of the on-disk `evaluation/iterN/{system}/overall.md` VERDICT line. Any verdict written from working memory is suspect.

Second signal: the session's execution state carries a nuanced disposition ("PASS on contracted scope" + "deferred REVISE out-of-contract") but the handoff records only the simpler half ("both PASS") without preserving the nuance. The deferred REVISE is a distinct fact that next-session needs to know.

Third signal: Wrap-up evaluation (or any reviewer) finds that the handoff claims "PASS" while the on-disk evaluation file is greppable as `VERDICT: REVISE`. The discrepancy is mechanically detectable.

## Correct approach

1. Before writing any verdict into a handoff, journal, or state claim for a task iteration, `grep` the on-disk `evaluation/iterN/{system}/overall.md` VERDICT line and quote it verbatim.
2. If the on-disk verdict is REVISE but the task was accepted as PASS on contracted scope, state it precisely: "Codex iter2 VERDICT: REVISE (OVERALL-001, High/90, out-of-contract) — dispositioned DEFERRED to follow-up backlog; task accepted PASS on contracted scope."
3. Never flatten a nuanced disposition ("PASS on contracted scope / REVISE out-of-contract") to a bare "both PASS" — the distinction is load-bearing for the next session's understanding of open follow-up items.
4. The verification procedure is the same as Principle 7's five-step gate: identify the proof artifact (on-disk overall.md), read it freshly, read the full VERDICT line, verify it matches the claim, only then write the claim.
