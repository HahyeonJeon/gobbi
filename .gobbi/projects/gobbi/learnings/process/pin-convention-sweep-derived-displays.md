---
name: pin-convention-sweep-derived-displays
description: Editing a co-touch site for one fix doesn't guarantee a second, coupled fix (a convention pin) also landed there.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf-p1
tags: [process, verification]
keywords: [convention-pinning, iter-counting, co-touch-site, state-transition-table, maxIterations]
author: claude
related: [blast-radius-map-from-named-files-not-exhaustive-grep, cotouch-enumeration-must-cover-semantic-equivalents, enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]
---

# Re-verify an already-known co-touch site against every fix that lands, not only the fix that first listed it

## Insight

When a task bundles two coupled fixes that both touch the same site — a value update and a separate convention/semantics pin over the same underlying token — editing that site for the value fix does not guarantee the convention fix is also reflected there. Re-check every already-listed co-touch site against ALL fixes that land during the task, not only the fix that put the site on the list.

## Context

Point-1 Task 1.1 bundled a cap-value change (Chat's `maxIterations` per loop: planning 5→1, execution 5→3, wrap-up 5→3) with a separate correctness fix, MF-1: pinning the `iter`-counting convention ("`maxIterations` = max WORK passes") in `orchestration/SKILL.md`'s primary iteration rule, because the rule text and the Status Display disagreed on whether `iter` is 0-based or 1-based. The pre-execution review (`reviews/code-review/2026-07-06-point-01-chat-mode-cycles-and-length.md`) already listed `chat-mode.md` §8.2's state-transition table as an edit site — but for the CAP-VALUE reason (`iter == maxIter (5)` → `(1)`) and an `Aborted`→user-gate reword. The table was edited for those two reasons. The dual-system evaluation of the resulting change caught that the same table still left the `iter`/`maxIter` counting convention ambiguous — MF-1's pin, landed in SKILL.md's primary rule, was never cross-checked against this already-listed site.

## Reason

A site earns its place on a co-touch/edit-site list once, for whichever fix noticed it first. Nothing automatically re-triggers a check of that site against a second, later-landed fix that also touches the same underlying token — the site looks "handled" because it was already edited for its original reason. Missing this costs an extra evaluation round and remediation pass to catch a defect the edit-site map technically already knew about.

## How

When a task bundles more than one fix that shares an underlying token or contract (here: `iter` / `maxIterations`), after each fix ships, re-scan the FULL existing edit-site list — not just the sites the new fix's own grep surfaces — and ask, for every already-listed site: "does this line's wording match every fix that has now landed, or only the fix that first listed it?" This is a re-verification pass over a known list, distinct from the initial enumeration (already covered by the blast-radius mistake family) and distinct from a fresh grep for the new fix's wording, which may not fire here: `chat-mode.md` §8.2 shows a computed value like "`(1)`", not the literal phrase "`maxIterations` = max WORK passes" a grep for MF-1's new wording would match.

## Counter-cases

Does not apply when a task's fixes are independent (touch disjoint sites) or when a site is edited for only one fix in the session. It also does not replace the initial exhaustive-grep enumeration ([[blast-radius-map-from-named-files-not-exhaustive-grep]]) — this insight is about re-checking a site the enumeration already found against every fix that lands afterward, not about finding the site in the first place.

## Related

- [[blast-radius-map-from-named-files-not-exhaustive-grep]] — the enumeration-completeness trap this complements
- [[cotouch-enumeration-must-cover-semantic-equivalents]] — semantic-equivalent phrasing across sites
- [[enumerate-all-restatements-and-classify-deferral-before-claiming-map-complete]] — classify every restatement before claiming a map complete
