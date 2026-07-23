---
name: planning
description: "Use when turning an approved approach into a complete, ordered, assignable, and verifiable plan, or when reviewing a plan for those properties."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---

# Planning

Skill for turning an approved approach into a complete, ordered, assignable, and verifiable plan — and for reviewing a plan against those properties. Load it when an agreed outcome must become work packages that are decomposed, ordered by dependency, and handed off for execution.

Planning does not choose the approach or design the solution; it takes an already-approved basis and produces the plan that delivers it. A finished plan lets another actor pick up any package and execute it without reconstructing intent.

---

## Principles

What makes a plan sound, independent of any tool or process.

> **Coverage without gaps or double ownership.**

The decomposition equals the approved scope — nothing omitted, nothing duplicated, nothing added. A tidy work breakdown that quietly drops an outcome, or lets two packages both own one result, delivers the wrong thing while looking complete.

> **Slice by observable outcome, not by layer.**

A useful package produces an end-to-end result a consumer can inspect. Slices drawn along technical layers hide unfinished value — each layer looks done while nothing works end to end.

> **A work package is bounded enough to understand, assign, complete, and verify as one unit.**

The stop rule for decomposition is direct executability plus a complete contract plus objective acceptance — not a fixed depth, duration, or file count. A package sized by convention rather than by readiness is either too big to execute cleanly or too small to be worth a handoff.

> **Dependencies determine order.**

The dependency graph — not list position or intuition — sets what is ready, what is on the critical path, and what is safe to run at the same time. Order read off a flat list contradicts the real prerequisites the moment two items interact.

> **A plan is a forecast that gains precision with evidence.**

Near work is planned precisely; far work stays deliberately coarse until it is close. Every load-bearing assumption carries an observable signpost and a named response, so the plan changes at explicit triggers rather than drifting.

---

## Rules

### Must-Follow

- **MUST bind the plan to ONE approved basis and state its scope boundary** — else a tidy task set can solve a different problem than the one approved.
- **MUST maintain a bidirectional source-to-deliverable coverage ledger** (every approved outcome maps to at least one package; every package maps back to an approved outcome) — the two-way trace exposes both omissions and additions.
- **MUST make each leaf an end-to-end observable outcome** unless a NAMED dependency makes an enabling package unavoidable — outcome slices accept independently; layer slices hide unfinished value.
- **MUST stop decomposition only when every leaf is directly executable, assignable, estimable, completable, and verifiable as ONE unit** — a fixed depth, duration, or file count is not readiness evidence.
- **MUST give every package a complete contract** (stable ID, outcome, boundaries, inputs, outputs, assumptions, dependencies, acceptance condition, evidence method, estimate) — so another actor executes it without reconstructing intent.
- **MUST state each acceptance condition as an observable pass/fail claim and name its deciding evidence BEFORE execution** — pre-anchored verification blocks post-hoc weakening.
- **MUST model must-precede relations as a directed acyclic graph and derive order from it** — a cycle means no valid start order; hand ordering can silently contradict a real prerequisite.
- **MUST prove a parallel lane has neither a dependency path nor a conflicting shared mutation, resource, consumer, or verification gate** — different filenames alone do not establish independence.
- **MUST ground estimates in comparable completed work when it exists, and state the uncertainty when it does not** — the outside view limits systematic underestimation without promising a point value.
- **MUST pair every load-bearing assumption with an observable signpost and a named continue / revise / stop / escalate response** — an unobservable trigger cannot control re-planning.
- **MUST close with a self-review of coverage, contracts, graph validity, verification anchors, estimates, and trigger completeness** — the plan is ready only when each acceptance-bearing property has evidence.

### Must-Not-Follow

- **NEVER add a package that cannot trace to the approved basis** — remove it or get an explicit scope decision; "useful while here" is unauthorized work.
- **NEVER let two packages silently own one outcome, or leave an approved outcome unowned** — repair the coverage ledger to one accountable package per result.
- **NEVER split primarily by architectural layer when no package is independently observable** — re-slice vertically, or name the unavoidable enabler and the outcome it unlocks.
- **NEVER stop decomposition because a conventional depth, duration, story size, or file count was reached** — apply the executable-and-verifiable work-package bar instead.
- **NEVER use vague acceptance ("works", "tests pass", "review complete") without a named condition, method, evidence, and signal** — rewrite it as a binary claim that can fail.
- **NEVER accept a dependency cycle or a list order that conflicts with the graph** — break the boundary or expose the unresolved prerequisite before execution.
- **NEVER call work parallel merely because different actors or files are involved** — check shared state, resources, consumers, and gate ordering, then serialize on any conflict.
- **NEVER estimate only from the inside view when comparable completed work exists** — use the reference class and explain any departure from it.
- **NEVER write "re-plan if needed" or another judgment-only trigger** — name the assumption, the observable signpost, the threshold, and the response.
- **NEVER declare the plan executable while a package lacks a contract field or a review gate lacks evidence** — return to the step that owns the gap.

---

## Procedure

Author a plan in eight ordered steps. P1–P4 build and bound the work; P5–P7 order it, estimate it, and set the re-plan triggers; P8 proves the plan is executable before handoff. On any P8 failure, return to the step that owns the gap.

### P1 — Frame the planning basis

Name the approved outcome, its inputs, the scope boundary, the constraints, the consumers, and the planning horizon. Refuse to invent missing authority — if the basis is not approved, stop and get it rather than plan around the gap.

### P2 — Build the deliverable tree + coverage ledger

Decompose the outcomes top-down into deliverables. Map sources to deliverables to packages and back, and expose every gap, overlap, and extra before writing any package prose. The bidirectional ledger is the coverage proof.

### P3 — Slice to the work-package stop rule

Prefer vertical, observable increments over layer slices. Recurse until each leaf is directly executable, assignable, estimable, completable, and verifiable as one unit — that stop rule decides the depth, not a fixed size.

### P4 — Write each package contract

For each package fill its ID, outcome, boundary, inputs, outputs, assumptions, acceptance claim, evidence method, and estimate. Keep independently-falsifiable claims separate so each can pass or fail on its own.

### P5 — Build + validate the dependency graph

Add the must-precede edges, reject any cycle, and derive the topological order and the critical path. Identify the conflict-free parallel lanes, and place each package's verification gate where its evidence first becomes available.

### P6 — Estimate from reference classes

Compare each package with completed analogous work; record the reference class and its variance. Give an honest bounded estimate, or an explicit low-confidence disposition when no comparable work exists.

### P7 — Set the elaboration horizon + re-plan triggers

Detail the near work precisely and mark the far work coarse. Record each load-bearing assumption with its observable signpost and its named continue / revise / stop / escalate response.

### P8 — Run the executable-plan self-review

Sweep coverage in both directions; validate every contract field and graph edge; challenge false parallelism and cosmetic acceptance; verify the estimates and triggers. Return to the owning step on any failure — the plan is executable only when every acceptance-bearing property has evidence.

---

## References

No borrowed claims — this skill owns its content: the planning principles, the plan-quality rules, and the eight-step procedure. It borrows no external fact, so there is no owner to register.
