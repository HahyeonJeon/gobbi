---
name: planning-iter2-revise-quick-patch-close
description: Both systems converged REVISE on iter2 (one dual-corroborated Medium); user accepted after surgical quick-patch rather than iter3
type: discussions
scope: feature
feature: workflow
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [planning, evaluation, revise-disposition, quick-patch]
outcome: Quick-patch + accepted (loop closed as PASS-accepted; no iter3)
---

# Planning iter2 evaluation REVISE — user disposition decision (D16)

## Context

The planning loop's iter2 evaluation produced a REVISE verdict from both systems. All four iter1 FAIL clusters were tool-verified addressed. One new dual-corroborated Medium was introduced by the iter2 C4 fix: the planning leader added `claude` as a required skill to tasks 03/04/10, but `skills/claude/SKILL.md` does not exist (FLAG-2 dangling reference, documented in `gobbi/SKILL.md:189`). Both Claude (STRUCT-1-iter2/USAGE-1-iter2/OVR-1-iter2) and Codex (CODEX-2i2) independently confirmed via `test -e` that the skill is absent.

Additional iter2 open findings: task-09 `surfaces` false-pass (disputed Medium); task-09 never verifies `evaluation.md` edit (inherited Low); load-broken interruption window (inherited Medium); EXCLUDE-filter over-exclusion (inherited Low).

The REVISE verdict met the chat-mode finding-review step; the manager presented the open findings to the user.

## Question

Given the REVISE verdict (one new dual-corroborated Medium + inherited items): proceed to iter3 (another full evaluator round), or accept the plan with a surgical quick-patch to close the open findings?

## Options considered

- **Iter3**: run a third full evaluation cycle.
- **Quick-patch + accept**: make targeted fixes in-place (drop `claude` from 03/04/10; de-false task-09 surfaces clause + add evaluation.md assertion; correct changelog over-claim), treat as PASS-accepted.

## User decision

Quick-patch + accept. The four patches were surgical (no decomposition, no DAG change, no anchor change): (1) drop `claude` from required-skills in tasks 03/04/10; (2) remove over-broad `surfaces` from task-09 verify, replace with phrase unique to D-d handoff step; (3) add `evaluation.md` content assertion to task-09 verify; (4) correct changelog entry that over-claimed STRUCT-4 was addressed in iter2.

## Implication

The planning loop closes as PASS-accepted (iter2 REVISE + quick-patch). Session.json records iter2 disposition as `accepted-after-quick-patch`. Decomposition/DAG/anchors/handoff names are byte-unchanged from iter1.

## Related

- `3-planning/evaluation/iter2/claude/overall.md` — REVISE verdict
- `3-planning/evaluation/iter2/codex/overall.md` — Codex REVISE corroboration
- `3-planning/working/draft-iter2.md` § Decisions log D16
- `3-planning/staging/decisions/codex-wrapper-file-persistence-failure.md`
- `3-planning/staging/decisions/planning-asserted-skill-without-verifying.md`
