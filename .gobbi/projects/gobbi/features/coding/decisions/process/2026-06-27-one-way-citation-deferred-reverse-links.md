---
name: one-way-citation-deferred-reverse-links
description: review.md cites existing coding docs one-way; reverse back-links from those docs to review.md are deferred wiring, not in this session's acceptance gate
type: decisions
scope: feature
feature: coding
status: accepted
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process, docs-sync]
keywords: [one-way-citation, reverse-links, deferred-wiring, acceptance-gate, scope-boundary]
author: claude
supersedes: null
---

# Decision: `review.md` cites existing coding docs one-way; reverse back-links are deferred wiring

## Context

The iter1 EVALUATION produced a High/100 design_flaw blocker across all four Codex perspectives: the acceptance gate required `review.md` to include bidirectional cross-links to `coding/evaluation.md` and `coding/SKILL.md` (each doc pointing to the other). However, the scope contract explicitly deferred editing existing skill docs. The acceptance gate was contradicting the scope.

Affected iter1 findings: `codex-project-001` (design_flaw/process, High/100), `codex-consistency-001` (design_flaw/docs-sync, High/100), `codex-structure-001` (design_flaw/docs-sync, High/100), `codex-ideation-overall-001` (design_flaw/process, High/100). Also: `R-1` (assumption_risk/docs-sync, Med/50) on the claim that `review.md` is already wired into the EVALUATION sub-phase via `evaluation.md`.

## Decision

`review.md` **cites** `coding/SKILL.md` and `coding/evaluation.md` **one-way**. This is legitimate authoring — a new child doc including references to sibling/parent docs is within its own authoring scope.

**Reverse back-links** (editing `coding/evaluation.md` and `coding/SKILL.md` to point back to `review.md`) are **deferred wiring** tracked in the `wire-review-doc-into-workflow` backlog. They are NOT part of this session's acceptance gate.

The acceptance gate requires:
- `review.md` includes a relationship/boundary section citing `SKILL.md`, `evaluation.md`, `evaluation/SKILL.md`, and the `/code-review` built-in.
- No edits to existing docs are required for acceptance.
- No claim that those docs already cite `review.md` (they don't, yet).

## Rationale

Scope is a contract with the user (P5). The deferred-wiring boundary was locked. The blocker arose because the validation method conflated authoring a new doc (in-scope) with editing existing ones (deferred). Resolving the contradiction required clarifying: citing from `review.md` is authoring; being cited by others is wiring.

## Alternatives considered

- **Scope-widen to add reverse links in this session**: Rejected. Editing existing skill docs was out of scope per user decision. Adding it without user decision is a scope breach.
- **Remove all one-way citations from `review.md`**: Rejected. A doc with no relationship section would fail usability and navigability; one-way citation is normal doc authoring, not wiring.

## Consequences

- `review.md` Execution can proceed without touching `coding/evaluation.md` or `coding/SKILL.md`.
- The reverse back-links (and all other wiring: Load Directives, runtime mirrors, evaluation-phase integration, RECORD integration) are owned by `wire-review-doc-into-workflow` and will ship separately.
- The boundary section in `review.md` must NOT claim that `evaluation.md` or `SKILL.md` currently point to it.
