---
name: 2026-06-01-principles-4field-template
description: "Decision to restructure all 14 principle sections in principles/SKILL.md into a uniform four-field template: Why / What / How / Anti-pattern."
type: decisions
scope: feature
feature: guardrails
status: active
created: 2026-06-01
session: a30b7a6e-164f-49ac-a857-ee225e831a7c
tags: [principles, template, restructure, dual-system-eval]
decision_status: accepted
supersedes: null
superseded_by: null
---

# Principles 4-field template decision

## Decision

Restructure all 14 principle sections in `principles/SKILL.md` into a uniform four-field template:

- `**Why:**` — the rationale for the principle (why it exists, what failure mode it prevents)
- `**What:**` — a terse list naming each required item and its scope (non-duplicating with How)
- `**How:**` — full detail once, folding in all prior Mechanism / Procedure / 3-strike / three-questions / Clarification / Delineation blocks; nothing dropped
- `**Anti-pattern:**` — renamed from Anti-rationalizations; best shape per principle

## Locked sub-decisions

- **Non-duplicating What / How.** What names the items; How provides the detail. What does not re-explain what How already covers.
- **How is the single consolidation point.** Every former Mechanism, Procedure, 3-strike rule, three-questions block, Clarification, and Delineation section is folded into How with nothing dropped.
- **Anti-pattern renamed; no longer fixed-shape.** Each principle adopts the best shape for its Anti-pattern field (bullet list, prose, derived sentence). P5 keeps a single derived one-line anti-pattern.
- **Headings frozen.** Principle headings (e.g., "## Principle 1 — Think Before Acting") are not renumbered or renamed.
- **Frontmatter and closing paragraph out of scope.** The SKILL.md frontmatter block and the closing navigation paragraph remain unchanged.

## Shipped

- Commit: `a629bf8` — all 14 principle bodies restructured in a single commit
- PR: #283 (squash-merged as `9364ca4` on develop)
- Evaluation: dual-system PASS — both Claude and Codex independently diffed develop↔new per principle and confirmed zero normative loss across all 14

## Design artifact

`sessions/2026-05-31-a30b7a6e-164f-49ac-a857-ee225e831a7c/principles-4field-redesign/design-artifact.md`
