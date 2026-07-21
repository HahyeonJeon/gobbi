---
name: eval-childdocs-selftest-fixture-drift
description: check-eval-childdocs.sh --self-test fails on a stale fixture that no longer matches skill-writing/SKILL.md's current content — pre-existing, unrelated to this session.
type: backlogs
scope: project
feature: null
status: closed
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [process, verification]
keywords: [check-eval-childdocs, self-test, fixture-drift, skill-writing]
author: claude
priority: low
project-scope: true
shipped_in: null
archived_at: 2026-07-20
archive_reason: dropped
---

# `check-eval-childdocs.sh --self-test` fixture is stale

## Context

`check-eval-childdocs.sh --self-test` fails on the `[mirrored-skills-wcl]` fixture — it expects a line
matching `ls .claude/skills | wc -l` inside `skills/skill-writing/SKILL.md`, but that skill's current
content no longer contains that line. `--classify-only` and all of the guard's real (non-self-test)
checks pass; this is confined to the self-test's own fixture expectations.

## Why deferred

Discovered opportunistically during this session's Wrap-up while verifying guard scripts; unrelated to
the scenario/checklist work this session shipped. Fixing a test-fixture drift is out of scope for a
Wrap-up promotion pass.

## When to pick up

No hard prerequisite. Low priority — the guard's real checks are unaffected; only its self-test fixture
is stale. Pick up whenever `skills/skill-writing/SKILL.md` is next touched, or as routine tooling
upkeep.

## Suggested approach

Update the `[mirrored-skills-wcl]` self-test fixture in `check-eval-childdocs.sh` to match
`skills/skill-writing/SKILL.md`'s current content, or remove the fixture if the assertion it encodes no
longer applies to the skill's current shape.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-16-59694f66-422a-4fd5-b93b-625c2f354fc3/`
