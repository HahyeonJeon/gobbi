---
name: typescript-skill-review-handoff
description: "Next-session handoff: 3-round dual-system adversarial review of the typescript skill (PR #353); all findings fixed + verified; merged to develop. 3 process mistakes promoted."
type: notes
scope: project
feature: null
status: active
created: 2026-07-16
session: 054f402b-a9ab-4af6-875d-078233778a0b
tags: [process, verification, docs-sync]
keywords: [handoff, typescript, adversarial-review, dual-system, ts7-ga, pr-353]
author: claude
features_touched: [coding]
steps_completed: [ideation, planning, execution, wrap-up]
shipped: [typescript]
---

# Handoff — typescript skill adversarial review (PR #353)

## What this session did

Ran a user-requested adversarial review + fix of the `typescript` skill (PR #353, branch
`claude-2026-07-16-c8fe196d…`, continued in its existing worktree), on the user's 4 axes (scenario/checklist
coverage, over-strict, best SOP, child-doc structure) plus technical-accuracy, deepen-not-restate, cross-doc
consistency, and python-sibling alignment. Full `/gobbi` Auto workflow, dual-system throughout.

Three review rounds, findings shrinking each time — all fixed and independently verified:

- **iter1 review** (Claude PASS + Codex REVISE → REVISE): 26 findings fixed. Headline: `TypedBus extends
  EventTarget` was UNSOUND (inherited `dispatchEvent` bypassed the typed gate — compile-proven); fixed by
  COMPOSING a private `#target` (which also models the skill's own compose-not-inherit rule). Plus false
  `passwordHash`-leak claim, bare-`void` residuals, Deno/Bun strip-vs-transpile, etc.
- **iter2 re-eval** (both REVISE): Claude caught A2 was half-propagated; Codex caught 5 more incl. TS 7.0 had
  GA'd (reversing an over-cautious hedge), an unsound readonly check, and a Deno `lib` conflict — all fixed.
- **iter3 confirm** (Codex REVISE): readonly still shallow (one-level `Readonly<T>` + spread copy leak nested
  state — compile-proven), API/binary attribution, and MORE strip residuals — all swept comprehensively.

Every round: 84/84 examples compile, links 13/13, plugin mirror intact, crosswalk 25/25 live. Two soundness
bugs compile-proven; two external facts (TS 7.0 GA 2026-07-08, Deno `deno.window` vs `dom` conflict)
web-verified against primary sources.

## Shipped

- `typescript` skill review complete + merged to develop via PR #353. 8 fix commits
  (`12d86451`…`307a0a0c`) on top of the original branch; see the PR.
- The skill's final state: sound composed `TypedBus`; promise-handling consistent across rule/child/scenario/
  checklist; Node-strips/Bun-Deno-transpile distinction uniform; Deno `lib` correct (`deno.ns`+`dom` for DOM);
  TS 7.0 named as shipped; mutable-aliasing coverage added (TS-SCENARIO-11/TS-CHECK-20) framed as a property.

## Process mistakes promoted (the durable lessons)

- `mistakes/verification/verify-time-sensitive-facts-not-hedge-from-stale-cutoff.md` — a release/version claim
  past the cutoff must be web-verified, not hedged; "pending GA" is itself a false-able claim (the TS 7.0 saga:
  original naming was right, the hedge was wrong).
- `mistakes/docs-sync/sweep-every-occurrence-when-fixing-a-multi-surface-claim.md` — a claim fix must grep-sweep
  every surface (rule/child/scenario/checklist/crosswalk); a spot-fix leaves residuals that re-fail next round
  (A2, A4 each half-applied).
- `archive/mistakes/verification/2026-07-26-adversarially-test-a-newly-authored-acceptance-predicate.md` — a new check/scenario is
  an executable claim; compile the counterexample it must reject before shipping; frame acceptance as a
  property, not a list of "sufficient" constructs (the readonly check was unsound twice).

## Decisions to respect

- Locked defaults stand (maximal-strict, ESM-only, ban-`any`, erasable-only) — the review added a one-line
  greenfield-vs-existing-code scope clarifier (not a migration mandate), not exceptions.
- Over-strict Axis-2 resolution was "add a scope clarifier", not "weaken defaults".

## Pointers / next session

- The review campaign for the typescript skill is DONE + merged. No follow-up review owed.
- Sibling reminder: the `python` skill review handoff (auto-memory `project_python_docs_review_handoff`) is
  still open — a similar adversarial pass on the 10 python docs.
- **Meta (strongly reinforced this session):** Codex caught the highest-value defects Claude's PASS missed in
  EVERY round (TypedBus soundness, readonly depth ×2, the residuals, the TS 7.0 GA date). See
  `mistakes/codex/weight-codex-evaluator-on-technical-accuracy.md` and
  `learnings/evaluation/compile-harness-is-blind-to-prose-claims.md` — the harness is blind not only to prose
  truth but to abstraction soundness and check-acceptance soundness.
- Process note: the executor subagent died on a Claude session usage limit mid-fix; the manager applied all
  fixes directly, committing incrementally (the documented delegation-blocked fallback).
