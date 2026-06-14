---
name: leader-md-git-discipline-claim-wrong
description: The artifact claimed leader.md lacked git -C discipline; it already carries that block at line 112; scope target (d) was also imprecise
type: decisions
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [process, research, verification, role-prompts]
supersedes: null
superseded_by: null
decision_status: accepted
---

# Verify role-prompt content before asserting it lacks a given discipline block

## What went wrong

The ideation iter1 artifact stated that `agents/leader.md` had "no git command discipline" and
that scope target (d) should edit existing git content in `agents/manager.md`. Both claims were
false:
- `agents/leader.md:112` carries exactly the same `git -C <worktree-abs>` block as `executor.md:99-101`.
- `agents/manager.md` has NO git-lifecycle content (zero `git -C` / push / `gh pr` / commit /
  worktree hits) — so there was no existing git content to edit; target (d) should be to ADD a
  remediation-vs-defer pointer, not edit existing content.

Claude evaluator USAGE-1 (Medium/100) and USAGE-2 (Medium/100) both flagged these.

## Why it happens

The leader read the scope target list from an initial brief, not from the files. Content claims
about specific files require reading those files; they cannot be inferred from a brief or from
memory of "what role prompts typically contain."

## Correct approach

Before asserting that file X lacks capability Y: read file X, search for Y, cite the result. If
the file has Y, acknowledge it and revise the scope claim accordingly. If the file lacks Y,
cite the exact search that confirmed absence (per the `grep-absence-claim-needs-exact-pattern`
mistake — verified absence requires an exact, discriminating pattern).

## How to detect

- A scope document says "role prompt X lacks Y — add Y" without a cited file:line confirming
  absence.
- A scope document says "edit existing Y in file X" without a cited file:line confirming Y exists.

## Related

- R4 remediation in `working/draft-iter2.md`
- `staging/decisions/grep-absence-claim-needs-exact-pattern.md` — the related absence-claim discipline
- `agents/executor.md:99-101`, `agents/leader.md:112` — both confirmed to carry the discipline
