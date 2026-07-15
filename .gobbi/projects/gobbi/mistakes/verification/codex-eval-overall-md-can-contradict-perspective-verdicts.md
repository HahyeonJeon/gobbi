---
name: codex-eval-overall-md-can-contradict-perspective-verdicts
description: The Codex evaluator's overall.md said PASS while its own perspective files were REVISE; reconcile the verdict from the per-perspective findings.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [verification, codex, evaluation]
keywords: [overall-md, perspective-verdict, reconciliation, finding-id, dual-system-eval, authoritative-source]
author: claude
priority: high
domain: evaluation
supersedes: null
superseded_by: null
related: [verify-state-from-authoritative-source-not-proxy, union-diff-occurrence-vs-distinct-primitive]
---

# The Codex evaluator's overall.md can contradict its own perspective verdicts

## What happened

In a Wrap-up-adjacent Execution evaluation, the Codex evaluator wrote
`overall.md: VERDICT: PASS` while its OWN project / aesthetics / usage perspective files
carried REVISE with two High/100 findings. A manager who read only `overall.md` would have
recorded PASS and shipped a real defect. Separately, a check row referenced a finding-id
(`T4-CONS-001`) that was never defined anywhere in the perspective files — a dangling
reference.

## Why it happens

`overall.md` is a synthesis file the evaluator writes last; it is a PROXY summary, and the
Codex evaluator can mis-synthesize it (or truncate before finishing it) so it disagrees with
the authoritative per-perspective findings it is supposed to summarize. Trusting the summary
over the source is the same proxy-vs-authoritative trap as reading a status field instead of
the underlying state. Referenced finding-ids can likewise be typed into a check row without a
matching definition.

## Correct approach

Reconcile the verdict from the per-perspective typed findings, NOT from `overall.md`. Read
every `evaluation/iter{n}/{system}/{perspective}.md`, take the pessimistic union of their
findings, and derive PASS/REVISE/FAIL from that — treat `overall.md` as a convenience view,
not the source of truth. Verify that every finding-id referenced in a check row is actually
defined; a dangling finding-id is a synthesis gap to flag.

## How to detect

`overall.md` states a verdict that no per-perspective file supports — e.g. `PASS` while a
perspective file holds a High/REVISE finding. Tell: the reconciliation cites only `overall.md`.
And: a check row names a finding-id (`T4-CONS-001`) that grep finds nowhere as a definition.
Cross-read the per-perspective files before recording the verdict.

## Related

- [[verify-state-from-authoritative-source-not-proxy]] — the general proxy-vs-authoritative trap this is a dual-system-eval instance of
- [[union-diff-occurrence-vs-distinct-primitive]] — a sibling evaluation-adjudication discipline from the same session
