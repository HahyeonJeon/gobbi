---
name: out-of-scope-wording-ambiguity
description: The scope contract's "editing any existing gobbi skill" wording could be read as covering the new review.md; proposed clarification names the specific existing docs excluded
type: decisions
scope: feature
feature: review
status: proposed
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process, design]
keywords: [scope-contract, wording-ambiguity, existing-docs, out-of-scope-clause]
author: claude
supersedes: null
---

# Decision: clarify out-of-scope wording for "editing existing skill docs" (codex-project-002)

## Context

iter2 Codex finding `codex-project-002` (assumption_risk/process, Med/75, open): the scope contract says "Editing any existing gobbi skill, agent, or rule doc" is out of scope. The wording can be read more broadly than intended — specifically, it might be read as "the new child doc `skills/coding/review.md` must not edit anything" when the actual intent is "do not edit the EXISTING skill/agent/rule docs outside the new child doc."

The wording ambiguity: "editing any existing gobbi skill" could include the `skills/coding/` directory (since `skills/coding/SKILL.md` is an existing skill doc). The new `review.md` IS a new doc in that directory — it is not an edit to an existing one — but the sentence doesn't make that clear.

## Decision

**Status: proposed** — the existing scope sentence is recoverable from context (Codex confirmed "context makes the intended scope recoverable, so this is not a blocker"). The fix is low-urgency but would improve precision.

**Proposed clarification**: the out-of-scope clause should read: "Editing any **existing** gobbi skill, agent, or rule doc — authoring the **new** child doc `skills/coding/review.md` is in scope; editing existing docs such as `coding/evaluation.md` or `coding/SKILL.md` is out of scope (those edits are deferred wiring)."

This makes explicit: (a) creating a new doc is in scope, (b) the specific existing docs that must not be edited in this session are named.

## Rationale

The sentence as written is parseable from surrounding context (the scope contract names `skills/coding/review.md` as the target artifact). However, a fresh agent reading only the out-of-scope clause could misread it. Precision here protects against Execution scope creep without user awareness.

## Alternatives considered

- **Leave as-is (context sufficient)**: The Codex evaluator accepted this as non-blocking because context is sufficient. Acceptable risk if planning and execution agents read the full scope contract.
- **Add parenthetical to the existing sentence**: Lighter-weight fix. "(e.g., `coding/evaluation.md`, `coding/SKILL.md`)" appended to the out-of-scope clause.

## Consequences

- If accepted: the Planning loop briefing (which uses the Ideation design as input) gets a slightly clearer scope contract.
- If deferred: risk is low (Codex found it non-blocking at Med/75) but the ambiguity persists into Planning.
