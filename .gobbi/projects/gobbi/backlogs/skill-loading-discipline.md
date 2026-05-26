---
title: "Item 1-2 — Skill-loading-discipline matrix + Load-Directives validator"
status: deferred
project: gobbi
feature: null
task: null
anchor_session: 2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac
created: 2026-05-23
tags: [process, delegation, skill-loading, matrix, validator, deferred]
disposition: open
---

# Item 1-2 — Skill-loading-discipline matrix + Load-Directives validator

## Context

Three of the seven promoted mistakes from prior session 7ea62d36 are direct empirical witnesses to a "load/read discipline failure" pattern (`memorization-delegation-prompts-must-load-memorization-skill`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck`, `leader-iter2-verification-claim-without-evidence`). The structural fix is a canonical role × phase × required-skills matrix at a single discoverable path + a mechanical pre-dispatch validator that checks delegation-prompt Load Directives against the matrix.

This session (`session-foundations-bundle-b`) framed Item 1-2 in Sub-step A and completed Sub-step C research (4 internal + 4 external insights at `staging/references/{rbac-matrix-single-source-of-truth,commitlint-required-fields-validator,langgraph-skill-catalog-pattern,autogen-pydantic-tool-schema-validation}.md`). The current implicit role × phase matrix was reconstructed in Sub-step C findings § "Current implicit role × phase matrix" with three identified gaps. Sub-step D design was started but the matrix-location decision question (T2-DQ-2 validator-location) surfaced user ambiguity and was deferred entirely.

## Why deferred

User explicitly deferred at Sub-step D round 1 ("looks ambiguous"). The (D+L) composite root-cause analysis from CP-1.2-α was preserved and is the basis on which a future session can resume. The Sub-step C research (12 staged references include 4 directly for this item) is durable — when picked up, the next session inherits the analysis and references.

The literal-ask scope (matrix + validator) was locked in CP-1.2-β; the broader "delegation contract verifier" re-framing was deferred separately (see `broader-delegation-contract-verifier.md`).

## When to pick up

- After T1 + T3 (this session's `session-foundations-bundle-b`) ship — `agents[]` telemetry from T3 may inform validator design (e.g., per-spawn audit of which skills loaded).
- Whenever a recurrence of a "missing skill in Load Directives" mistake surfaces in a new session (witness signal).
- No hard blocking dependency on other items.

## Suggested approach

1. Pick up the (D+L) composite framing and Sub-step C insights directly from this session.
2. Resolve T2-DQ-1 (matrix location): the 4 candidates were (a) `gobbi/SKILL.md`, (b) `delegation/SKILL.md`, (c) standalone `delegation/required-skills-matrix.md`, (d) machine-readable JSON. The leader's recommendation skew was (a) — but the user found this ambiguous; surface the trade-offs explicitly in a future Sub-step A or D.
3. Resolve T2-DQ-2 (validator location + action): 3 candidates — (a) manager-side pre-dispatch script, (b) textual rule in `delegation/SKILL.md`, (c) auto-amend mode. Leader skew: (a) — empirically-validated middle ground per commitlint precedent.
4. Resolve T2-DQ-3 (scope): tier-3 Skills only, or also tier-2 rules + tier-4 mistakes? Leader recommends tier-3 only.
5. Mechanical-over-textual is the hard constraint (T2-I-5) — no `delegation/SKILL.md` § "self-check" sections; ship as a script.

## Effort estimate

Medium — one workflow loop. T2 was bundled with T1 + T3 in this session as a 3-task bundle; once isolated, T2 alone is similar in scope to T3 (one new shell script + one matrix file + ~3 doc edits).

## Originating session

`.gobbi/projects/gobbi/sessions/2026-05-23-1b26cf20-677b-498c-8c1b-7d7e971597ac/`

## Anchor

- Sub-step A CP-1.2-α (root-cause hypothesis locked: D+L composite)
- Sub-step A CP-1.2-β (literal-ask scope locked: matrix + validator)
- Sub-step D round 1 deferral (Decisions Log entry 13)
- Sub-step C T2 internal + external insights (preserved at `staging/references/`)
