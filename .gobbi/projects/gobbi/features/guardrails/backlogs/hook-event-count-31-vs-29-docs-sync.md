---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
status: deferred
scope: feature
feature: guardrails
finding-id: COD-OVERALL-ITER3-001
type: general
domain: docs-sync
disposition: open
confidence: 100
severity: Medium
supersedes: null
superseded_by: null
---

# Hook event count claim (31) contradicts captured evidence (29)

## Context

`draft-iter3.md` and the staged reference `claude-code-posttooluse-hook-schema.md` claim the official hooks page lists 31 hook events. The staged reference itself enumerates 29 event names (lines 45-73). The current official page visible lifecycle list also shows 29 events. The Codex evaluator independently fetched the page and confirmed 29.

The `PostToolUseFailure` event itself is verified by both Claude and Codex evaluators — this is a supporting-prose defect, not an operational blocker.

## Decision

Accept the discrepancy as a non-blocking docs-sync finding at Ideation exit. Correct the "31" claim to "29" when editing `draft-iter3.md`'s inline sections (T3-E-5, D-3-3, F-Fix-B) and the staged reference file before or during Execution.

## Rationale

The load-bearing claim — that `PostToolUseFailure` is a supported shell-command hook event — is independently verified. The count is support prose. Correcting it requires a 2-3 word change in multiple locations. Not worth blocking Planning.

## Alternatives considered

Fix in Planning: acceptable. Fix in Execution (alongside hook authoring): also acceptable.

## Consequences

When the executor authors `.claude/settings.json`, update T3-E-5 / D-3-3 / F-Fix-B references from "31" to "29". Also update `staging/references/claude-code-posttooluse-hook-schema.md` header if it repeats the count.

## Related

- `evaluation/iter3/codex/overall.md` COD-OVERALL-ITER3-001
- `evaluation/iter3/codex/consistency.md` COD-CONS-ITER3-001
- `evaluation/iter3/codex/aesthetics.md` COD-AESTH-ITER3-001
- `staging/references/claude-code-posttooluse-hook-schema.md`
