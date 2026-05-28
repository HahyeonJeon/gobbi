---
name: evaluator-false-pass-without-diffing
description: A Claude evaluator (T7) claimed deleted narrative was "relocated to ## Source" when git showed it was DELETED with no ## Source present; also missed a dropped `related:` key. Gave PASS. Codex caught it; manager git-verified. An evaluator asserting "preserved/relocated/no-loss" without actually diffing the commit can false-PASS.
type: mistakes
scope: project
feature: project-memory
status: active
created: 2026-05-27
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [process, evaluation, diffing, content-loss, false-pass]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Evaluator false-PASS by asserting preservation without diffing the commit

## What happened

During T7 (conform install-runtime discussions/design/decisions/changelogs), the Claude evaluator assessed the conformance changes as PASS, asserting that deleted narrative had been "relocated to ## Source" and that no content loss occurred. Git log showed the opposite: the narrative section was deleted outright and no `## Source` heading was present in the resulting file. The same evaluation also missed a dropped `related:` key that the standard requires preserving. The Codex evaluator caught the content loss and returned REVISE. Manager git-verified: the Claude evaluator's relocation claim was factually wrong.

## Why it happens

The evaluator asserted preservation/relocation from memory (reasoning about what the conformance task *should* have done) rather than actually diffing the commit to see what *did* change. An evaluator who trusts the executor's summary without reading the diff can confidently assert content is preserved when it has been deleted. This is a false-PASS — the metric (content integrity) passes while the underlying property (no content loss) fails.

## How to detect

- An evaluator's finding claims "content preserved / relocated / no loss" but cites no diff evidence — only narrative reasoning.
- Two evaluators (dual-system) diverge on a factual content-loss claim: one says PASS (no loss), the other says REVISE (loss detected).
- The evaluator's language: "the narrative was moved to...", "the key appears in...", "no loss occurred" — without a file read or diff to ground it.

## Correct approach

Evaluators MUST diff the commit (or read the resulting file) to verify any claim that content was preserved, relocated, or not lost:

1. For every claim of "X was relocated to Y," read the destination file and confirm the content is there.
2. For every claim of "no keys were dropped," grep the resulting file for the specific key names that the standard requires preserving.
3. When two evaluators diverge on a factual content-loss claim, the manager must ground-truth-verify (git diff / file read) before accepting either verdict — the dual-system divergence is the signal that at least one evaluator is operating from reasoning, not evidence.

The dual-system evaluation + manager-verify protocol exists precisely to catch this: Codex caught what Claude missed, and the manager's git check confirmed the truth.
