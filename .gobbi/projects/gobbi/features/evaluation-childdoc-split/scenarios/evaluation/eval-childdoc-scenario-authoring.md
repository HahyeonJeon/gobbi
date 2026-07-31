---
name: eval-childdoc-scenario-authoring
description: Authoring scenario.md across the 4 current loop skills — per-perspective Good/Bad/Adversarial framing, worked examples, stable-ID scheme
type: scenarios
scope: feature
feature: evaluation-childdoc-split
status: active
created: 2026-07-07
session: 39f3dfb0-49df-44d4-a6bd-d2e4743b36e3
tags: [evaluation]
keywords: [scenario-md, good-bad-adversarial, stable-id, worked-example]
author: claude
---

# Author `scenario.md` per loop skill

**Category:** golden-path
**Coverage:** covered (all 4 current loop bundles conform; the initial rollout also covered the former Preparation bundle)

## Situation

The current contract applies the split to 4 loop skills. For each loop skill, the executor extracts every existing bold scenario block out of the current `evaluation.md` into a new `scenario.md`, and authors any missing Good/Bad/Adversarial framing without filler.

## Inputs

- The current `evaluation.md`'s existing scenario prose (where present) — the starting content, not a template to copy verbatim.
- The per-step Good/Bad/Adversarial table (below) — what "good" and "bad/adversarial" mean at each of the 4 productive workflow steps.
- The stable-ID scheme (below) — every scenario gets one.

## Expected behavior

Each `scenario.md` is organized by the 7 perspectives (`project`, `structure`, `performance`, `aesthetics`, `usage`, `consistency`, `risk`), aligned 1:1 with the sibling `checklist.md` by identical `## `/`### ` heading tree. Within a perspective, one family block per distinct post-step contract — not several loosely related scenarios crammed under one heading.

**Family block shape:**

```markdown
### {ID} — {title}
**Category:** golden-path | edge-case | failure-mode | adversarial
**Situation:** {one or two sentences — the concrete situation}
**Good:** {what a correct instance looks like — checkable, not aspirational}
**Bad / failure:** {the failure mode a reader would otherwise miss}
**Adversarial:** {a scenario that LOOKS correct but conceals the failure}
**Checklist IDs:** `{ID}-CHECK-*`
```

**Stable-ID scheme:** `{STEP}-{PERSPECTIVE}-SCENARIO-{NN}` — full words `SCENARIO`, not a terse form like `-C1` or `-01` alone. `STEP ∈ {IDEA, PLAN, EXE, WRAP}`; `PERSPECTIVE ∈ {PROJ, STRUCT, PERF, AESTH, USAGE, CONS, RISK}`. Example: `EXE-PROJ-SCENARIO-01`. The full-word form was a user-locked directive (see [[four-user-decisions]] OQ-3) over Codex's original terse `-C1` proposal — a citable ID a human parses at a glance, per Principle 7 (plain, literal writing). Each scenario's `Checklist IDs:` line cross-references its sibling checks as `{ID}-CHECK-{NN}` (e.g. `EXE-PROJ-SCENARIO-01-CHECK-01`), giving a stable trace that survives the checklist being copied out of its source file into `evaluation/iter{n}/{system}/checklist.md` — a relative link would break at that point; the shared ID does not.

**How GOOD-vs-BAD differs across the 4 productive steps** — each step has a different job, so "good" and "adversarial" mean different things:

| Step | Job | GOOD | BAD / adversarial |
|---|---|---|---|
| Ideation | Get the IDEA right | Root cause; sharp enumerated scope; research-backed | Symptom framing; adv: adjacent feature silently absorbs the idea |
| Planning | DECOMPOSE locked intent | Every task traces; dependencies and writer order are explicit | Orphan task or hidden dependency; adv: unrelated cleanup becomes an unapproved task |
| Execution | IMPLEMENT | Change-set matches task 1:1; `verifies:` run; scoped | Partial-complete; adv: tidy abstraction hides a cycle |
| Wrap-up | CONSOLIDATE | Every shipped artifact referenced; promotions valid; handoff matches `git log` | Phantom completion; adv: a promoted file makes old memory wrong, both stay active |

### Worked example A — `execution/scenario.md`, Project perspective (code)

```markdown
## Project
_Lens (see `evaluation.md`):_ did the executor implement the right task, the whole task, and only the task?

### EXE-PROJ-SCENARIO-01 — Task scope fidelity
**Category:** golden-path
**Situation:** the executor reports the task done and the change-set is on the branch.
**Good:** every `outputs:` entry has a concrete diff artifact; `git diff --name-only` touches only the task's `files:` set (or a subset); the commit/PR names the task and the message matches the diff.
**Bad / failure:** an output is missing but the task is labeled complete, or the message understates/overstates the diff.
**Adversarial:** tests pass, but `git diff --name-only` shows a file outside the task's `files:` list — an unrelated "while I was in there" cleanup rode along.
**Checklist IDs:** `EXE-PROJ-SCENARIO-01-CHECK-*`

### EXE-PROJ-SCENARIO-02 — Verification actually run
**Category:** failure-mode
**Situation:** the task carries a `verifies:` command.
**Good:** the `verifies:` command was run on the final tree and passed clean, unmodified.
**Bad / failure:** verification is asserted ("should pass") but never run.
**Adversarial:** the `verifies:` command itself was edited to make it pass.
**Checklist IDs:** `EXE-PROJ-SCENARIO-02-CHECK-*`
```

### Worked example B — `ideation/scenario.md`, Project perspective (non-code)

```markdown
## Project
_Lens (see `evaluation.md`):_ does the idea solve the right problem, inside the locked Scope Contract?

### IDEA-PROJ-SCENARIO-01 — Root cause, not a symptom
**Category:** golden-path
**Situation:** the draft's Framed Problem states a root cause.
**Good:** the "Why?" chain terminates at a cause that, if absent, would obviate the work; prior attempts (or a confirmed "none") are documented; the Design section solves the SAME problem the Framed Problem states.
**Bad / failure:** a symptom is accepted as the root cause.
**Adversarial:** the Design section quietly solves a different (adjacent) problem than the one framed, while appearing to address the stated one.
**Checklist IDs:** `IDEA-PROJ-SCENARIO-01-CHECK-*`

### IDEA-PROJ-SCENARIO-02 — Scope Contract is enumerated and refusable
**Category:** golden-path
**Situation:** the draft carries a Scope Contract.
**Good:** explicit non-overlapping `Project / Feature / Task`; backlog routing for every non-chosen candidate; no "etc."/"and related".
**Bad / failure:** open-ended phrasing leaves the boundary soft.
**Adversarial:** an existing feature scope silently overlaps the idea and the overlap is never surfaced.
**Checklist IDs:** `IDEA-PROJ-SCENARIO-02-CHECK-*`
```

## Verification

- Every family block carries all 6 fields (Category / Situation / Good / Bad-failure / Adversarial / Checklist IDs) — no truncated block.
- Every `Checklist IDs:` reference resolves to a real check in the sibling `checklist.md` (heading-tree + ID integrity guard).
- No block is filler under `evaluation/SKILL.md:252`'s no-filler bar — each Good/Bad/Adversarial line states a checkable condition, not a restatement of the situation.

## Related

- [[evaluation-childdoc-split]] (design) — the D1/D3 split rule and skeleton this scenario file's shape implements
- [[four-user-decisions]] — the OQ-3 user directive locking the full-word ID scheme
- [[eval-childdoc-checklist-authoring]] — the sibling checklist this scenario's IDs cross-reference
