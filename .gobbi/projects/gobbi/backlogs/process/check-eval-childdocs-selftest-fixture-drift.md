---
name: check-eval-childdocs-selftest-fixture-drift
description: check-eval-childdocs.sh --self-test fails 1/10 because its [mirrored-skills-wcl] fixture expects a `ls .claude/skills | wc -l` line in skill-writing/SKILL.md that no longer exists — pre-existing drift, predates this session.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-24
session: 847bafc9-9659-46b4-b23e-653e25f0e9f5
tags: [validation, docs-sync]
keywords: [check-eval-childdocs, self-test, fixture-drift, skill-writing, mirrored-skills-wcl]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Fix check-eval-childdocs.sh --self-test fixture drift on skill-writing/SKILL.md

## Context

`check-eval-childdocs.sh --self-test` fails 1 of 10 fixtures: the `[mirrored-skills-wcl]` fixture
expects a line `ls .claude/skills | wc -l` in `skills/skill-writing/SKILL.md` that no longer exists in
the current source. The guard's live (non-self-test) mode is green; only its bundled self-test fixture
is stale.

## Why deferred

Confirmed independent of this session: `git log 68b1c66a..HEAD -- skills/skill-writing/SKILL.md` is
EMPTY — `skill-writing/SKILL.md` has zero commits on this branch. The drift predates the planning-skill
split and is out of scope for every task in it. Surfaced as an out-of-scope observation in task 05's
evaluation (`4-execution/task-05-rewrite-planning-bundle/evaluation/iter1/claude/overall.md`).

## When to pick up

Any session that next edits `check-eval-childdocs.sh` or `skills/skill-writing/SKILL.md`, or a
guard-fixture maintenance sweep. No hard prerequisite.

## Suggested approach

Decide whether the `[mirrored-skills-wcl]` fixture's expectation is still the intended contract. Either
(a) update the fixture to match the current `skill-writing/SKILL.md` content, or (b) restore the
`ls .claude/skills | wc -l` line to `skill-writing/SKILL.md` if it is still meant to be there. Verify
with `check-eval-childdocs.sh --self-test` → 10/10.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-16-847bafc9-9659-46b4-b23e-653e25f0e9f5/`

## Related

- `4-execution/task-05-rewrite-planning-bundle/evaluation/iter1/claude/overall.md` — where this
  pre-existing drift was observed and confirmed out-of-scope
