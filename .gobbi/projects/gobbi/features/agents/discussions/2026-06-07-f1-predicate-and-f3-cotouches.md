---
name: f1-predicate-and-f3-cotouches
description: REVISE remediation decisions — F1 predicate definition and F3 co-touch site expansion
type: discussions
scope: feature
feature: agents
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [agents, delegation, predicate, docs-sync, f1, f3]
loop: ideation
outcome: F1 predicate defined operationally; three F3 co-touch sites added to scope
---

# F1 Predicate Definition and F3 Co-Touch Site Expansion

## Context

After iter1, both evaluators returned REVISE. The reconciled findings included F1 (executor predicate was a label, not an operational check) and F3 (co-touch list was incomplete — `agents/manager.md:12` and `.claude/CLAUDE.md:31` were not listed as sites that assert "nothing inherited" and would become contradictory after T1 scopes the rule).

## Question

Q-F1: How should "shared subsystem" and "saturation cap" be defined so the continue-vs-fresh rule is fully deterministic?

Q-F3: Which specific files and line-level assertions should be added to the in-scope co-touch list?

## Options considered

**Q-F1:**
- Label only ("shared subsystem," to be refined in Execution): rejected — leaves the rule non-deterministic at Planning.
- Define both now: accepted — the user wanted the rule to be deterministic enough for Planning to decompose T3.

**Q-F3:**
- Leave as-is (only `delegation/SKILL.md` qualifies "nothing inherited"): rejected — would ship doc-doc contradictions.
- Add `agents/manager.md` + `.claude/CLAUDE.md` + `orchestration/workflow/ideation.md` as in-scope co-touches: accepted.
- Add all seven sites from the research note (including `agents/assistant.md` and `orchestration/SKILL.md:217`): deferred for verification; ultimately confirmed those two sites carry no literal "inherit" tenet and were left as-is.

## User decision

Q-F1: **Define both now.** "Shared subsystem" = next task's `files:`/feature scope overlaps current task's touched files OR same feature directory; "saturation cap" = continue at most 3 consecutive tasks then force fresh (break early on context-budget strain).

Q-F3: **Add `agents/manager.md:12`, `.claude/CLAUDE.md:31`, and `orchestration/workflow/ideation.md:35` as in-scope co-touches.** Scope contract expands to include the entry-point "nothing inherited" assertion + the audit-trail reconciliation.

## Implication

The F1 predicate is now fully operational: continue iff (overlap OR same feature dir) AND (consecutive-continued-count < 3) AND (context budget not strained); otherwise fresh. The manager can apply this at dispatch time without inventing the definition.

The F3 co-touch list is bounded at three sites. Two additional sites mentioned in the research note (`agents/assistant.md`, `orchestration/SKILL.md:217`) were grep-verified in iter3 as carrying no "inherit" tenet — explicitly left as-is and removed from co-touch scope.

## Related

- `features/agents/design/subagent-continuation-mechanism.md` — D1 F1 predicate + F3 co-touch expansion
- `features/agents/decisions/2026-06-07-continue-vs-fresh-deterministic-rule.md` — D1 decision record
