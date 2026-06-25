---
name: verification-gate-must-be-runnable-not-placeholder
description: A Planning task's verifies: gate contained fill-in placeholders; a verification gate must run as-is, zero fill-in.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification, process]
keywords: [planning-gate, placeholder, runnable, executor-fill, whole-tree-property]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [guard-cited-as-runtozero-without-matching-vocab, guard-revises-twice-means-scope-model-wrong]
---

# Verification gate must be runnable as-is — no fill-in placeholders

## What happened

A Planning task plan's `verifies:` gates contained `<...>` fill-in placeholder tokens — e.g. `<run family-b>`, `<flat-by-area-filter>`, `<area>/<a-sample-moved-file>` — framed as deliberate "tell-what-not-how" executor-fill points. The planning leader judged these as acceptable "WHAT-not-HOW" design choices for iter2 and PASS'd. The Codex evaluator REVISE'd (COD-OVERALL-1, High/100): a verification GATE with a placeholder is not runnable as-is — the checker must be invented by whoever runs it, reintroducing false-PASS risk. An earlier iter (iter1) had also REVISE'd because gates were prose or asserted exit-0 on a Family-A guard that currently exits 1 with 4 residuals — counts/exit-codes not re-baselined against a fresh live run. Two REVISE rounds were required: iter1 for baseline accuracy, iter2 for placeholder removal.

## Why it happens

A verification GATE is distinct from an implementation step. The executor legitimately decides HOW to implement (so implementation prose in `what:` can be high-level). But a GATE is what the MANAGER/EVALUATOR runs to confirm the task is complete — it must run verbatim. When a gate holds a `<...>` fill-in, the checker is invented or guessed at run time by whoever holds the plan. That is the executor-invents-the-check / false-PASS risk the whole campaign exists to prevent — the same root as `guard-cited-as-runtozero-without-matching-vocab`. The mistaken assumption is that "executor-fill" style is acceptable in a `verifies:` block because it is acceptable in a `what:` block. Additionally, counts and exit-codes in gates must be re-derived from a fresh live run at plan time, not guessed from the campaign scope model. An asserted "exit 0" on a guard that currently exits 1 means the gate already fails before Execution starts.

## Correct approach

Every gate in a `verifies:` block must be a command runnable AS-IS with zero fill-in. Two rules:

1. **No `<...>` tokens in runnable lines.** The only angle-bracket tokens permitted in a gate are documented path constants (`<WT>`, `<PM>`, etc.). Any per-file run-time value that would otherwise need filling must be expressed as a WHOLE-TREE PROPERTY CHECK instead (e.g. "the validator reports 0 `area` violations", expressed as `validate-frontmatter.sh | grep -c '\.md:area:'` → 0) rather than a per-file placeholder.

2. **Re-baseline every count and exit-code from a fresh live run.** Before declaring the plan ready for evaluation, run every gate command against the current tree and confirm the expected value matches the live result. Do not assert an exit-code or count from memory or the scope model.

A forward-reference to a command a task BUILDS is acceptable only if stated as its exact intended invocation (e.g. `bash <PM>/scripts/check-layer2-source.sh <WT>` — the deliverable's exact run form), never a vague placeholder like `<run new-script>`.

## How to detect

- A `verifies:` / acceptance-criterion block contains any `<...>` token that is NOT one of the plan's defined path constants (e.g. `<WT>`, `<PM>`).
- A gate cites a count (e.g. "expect 34", "exit 0") that was not produced by a fresh run of the actual command against the current tree.
- A gate says "run X" without giving X's full invocation.
- On receiving a plan, ask: "Can I copy this gate command into a shell right now and run it?" If the answer is no, it is a placeholder.

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — the original guard-baseline false-pass scar; this mistake extends it to all verifies: gates
- [[guard-revises-twice-means-scope-model-wrong]] — companion rule on guard scope-mismatch signaling
