---
name: constraints-body-block-convention-deferred-to-planning
description: Constraints body block vs H2 convention in the codex skill — deferred from Ideation to Planning DISCUSSION.
type: decisions
scope: feature
feature: evaluation
status: deferred
created: 2026-05-23
session: 2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [codex, constraints, h2-count, codex-skill]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Deferred: `Constraints` body block vs `## Constraints` H2 convention in codex skill stub

## Context

The codex skill stub places `**Constraints**` as a bolded body block after the eighth H2 (`## Anti-patterns`), explicitly annotated as "NOT an H2 section; keeps the H2 count at exactly 8." This preserves the validation contract that `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returns exactly `8`.

A Codex evaluator noted that sampled existing project skills (`execution/SKILL.md`, `wrap-up/SKILL.md`, `research/SKILL.md`) use `## Constraints` as an H2 section, not a body block — raising the question of whether the codex skill should match the sibling-skill convention.

## Decision

Keep `**Constraints**` as a body block. The question was deferred from Ideation to the Planning DISCUSSION; at that DISCUSSION the user did not override the locked 8-H2 contract, so the decision stands: the body-block form is the codex-skill-specific pattern, and normalizing `Constraints` across sibling skills is a separate, future session's scope.

## Rationale

The codex skill's locked design enumerates exactly 8 H2 sections and explicitly excludes `Constraints` from them. Promoting `Constraints` to a ninth H2 would break the `grep -c "^## "` returns-8 validation contract that the locked design depends on. Matching the sibling-skill convention is a cosmetic consistency gain that is not worth violating a locked, machine-checked spec mid-stream.

## Alternatives considered

- **Promote `Constraints` to a ninth `## Constraints` H2 to match sibling skills** — rejected: violates the locked 8-H2 contract and its grep validation.
- **Re-open the 8-H2 lock at Planning DISCUSSION** — offered to the user, who declined to override; the lock was kept.

## Consequences

The codex skill keeps the body-block `**Constraints**` form, divergent from sibling skills. A future session may normalize the convention across all skills; until then the divergence is intentional and documented here so it is not mistaken for an oversight.

## Related

- [`decisions/constraints-body-block-kept-per-h2-lock.md`](constraints-body-block-kept-per-h2-lock.md) — the parallel decision recording the same 8-H2-lock outcome with the supporting skill-sampling evidence.
- [`design/codex-skill-structure.md`](../design/codex-skill-structure.md) — the locked design that fixes the 8-H2 contract.

## Source

Session `2026-05-23-7ea62d36`. The locked 8-H2 spec and the Codex evaluator finding that surfaced this question live in the session's Ideation and Preparation evaluation artifacts; the Planning DISCUSSION resolution is recorded in that session's staging decisions.
