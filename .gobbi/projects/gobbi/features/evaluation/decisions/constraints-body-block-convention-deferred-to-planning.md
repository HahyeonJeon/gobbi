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

The codex skill stub (item A) places `**Constraints**` as a bolded body block after H2 #8 (`## Anti-patterns`), explicitly annotated as "NOT an H2 section; keeps the H2 count at exactly 8." This preserves the validation contract `grep -c "^## " .gobbi/projects/gobbi/skills/codex/SKILL.md` returning exactly `8`.

Codex iter3 evaluator (finding OVERALL-ITER3-CONSTRAINTS-BODY-BLOCK) noted that sampled existing project skills (`execution/SKILL.md`, `wrap-up/SKILL.md`, `research/SKILL.md`) use `## Constraints` as an H2 section, not a body block.

## Decision

**Deferred to Planning DISCUSSION.** The body-block approach is intentional in Preparation — it respects the locked Idea Design A which explicitly enumerates 8 H2 sections excluding `Constraints`. Changing `Constraints` to H2 #9 would violate the locked spec.

Planning DISCUSSION resolution (Concern 5): maintained as body block per locked spec. The user did not override the 8-H2 contract at Planning DISCUSSION. Decision stands — `**Constraints**` body block is the codex-skill-specific pattern, and future normalization across sibling skills is a separate session scope.

## Source

Session 2026-05-23-7ea62d36. The locked 8-H2 spec and the Codex evaluator finding (OVERALL-ITER3-CONSTRAINTS-BODY-BLOCK) that surfaced this question are in the session's Ideation and Preparation evaluation artifacts. The Planning DISCUSSION resolution is recorded in session staging decisions.
