---
name: d3-002-structural-split-locked-plus-design-approvals
description: User locked D3-002's two-column structural split (Option S) over the advisory legend, and approved D3-001/D1-002 as recommended
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-07-05
session: 1fecddb4-255e-4829-9912-42deb9c36fc8
tags: [ideation, design]
keywords: [option-s, option-l, gen-d3-002, gen-d3-001, gen-d1-002, design-lock]
author: claude
outcome: User locked DES-D3-002 = Option S (two-column structural split) and approved DES-D3-001 = Option A and DES-D1-002 = Option A as recommended.
---

# Design lock — D3-002 fork resolution + D3-001/D1-002 approval

## Context

Ideation Sub-step D produced three directional design decisions. Two systems (the Claude leader and the
frozen Codex proposal) independently reached different primary recommendations for D3-002: Claude's original
recommendation was a Refs-audience legend (Option L, advisory-only); Codex's was the two-column structural
split (Option S). The leader flipped its own recommendation to S after weighing the root-cause argument, and
the manager surfaced the genuine fork to the user rather than self-deciding, per Design being an Always-Ask
decision class.

## Question

D3-002 fix — advisory legend (Option L) vs structural two-column split (Option S)? Separately: approve
DES-D3-001 and DES-D1-002 as recommended?

## Options considered

- **Option L (legend)** — add a short note per mode doc explaining the `Refs` column is manager-facing.
  Minimal diff, but advisory only — a future row can still put a bare `workflow/*.md` link beside a
  specialist `Agent`.
- **Option S (structural split)** — replace the single `Refs` column with `Manager refs` +
  `Specialist phase loads`. Larger diff (~9 loop tables across 2 docs), but makes the D3-002 regression class
  structurally non-recurrable.
- **DES-D3-001** — route both Step 6 bullets (fresh + resume) through the mode-doc dispatch; the resume
  rephrase folded in as an in-scope Principle-9 co-touch.
- **DES-D1-002** — replace the drifted routing table with a pointer to canonical
  (`evaluation/SKILL.md` + `record/SKILL.md`) plus two inline constraints; keep the
  `## Routing Findings to RECORD` heading unchanged (verified live inbound anchor from `auto-mode.md:81`).

## User decision

**Option S — two-column structural split**, locked. Rationale recorded: the finding is High and the root
cause is a structural column-overload; a structural fix is proportionate. **DES-D3-001 and DES-D1-002
approved as recommended** (both Option A in their respective decisions).

## Implication

All three Design decisions are LOCKED (DES-D3-001 = A, DES-D3-002 = S, DES-D1-002 = A) as of 2026-07-05.
iter2 refined wording/precision on the D3-002 guardrail and the D1-002 scope-accuracy claim only — it did not
reopen any of the three locked decisions. The unified iter2 guardrail wording (companions INCLUDED, full
Load block NOT restated) is recorded in `working/discussion-log.md:20`.

## Related

- [[d3-002-manager-refs-specialist-phase-loads-column-split]] — the design this lock produced
- [[d3-001-route-both-step6-bullets-through-mode-dispatch]] — the design this lock produced
- [[d1-002-canonical-pointer-replaces-drifted-routing-table]] — the design this lock produced
