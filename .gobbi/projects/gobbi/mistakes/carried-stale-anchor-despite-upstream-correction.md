---
name: carried-stale-anchor-despite-upstream-correction
description: Planning leader copied a stale line anchor into the Plan even though the readiness report had already corrected it to the live value
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-07
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [process, docs-sync, planning, anchor-fidelity]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Carried Stale Anchor Despite Upstream Correction in Readiness Report

## What happened

The Planning leader produced `draft-iter1.md` citing `orchestration/SKILL.md:247` as the location of the `auto-mode.md §3/§6` mode-specific-gates pointer — in five places across the Plan's scope section, T4 verification criteria, and edit-mechanics block. The readiness report (`preparation/artifacts/readiness.md`) had already explicitly corrected this anchor to line **266** after verifying the live file at worktree c8a8654. Live, line 247 is a Verdict-aggregation table separator; the actual pointer is at line 266. Both evaluators found this at iter1 as a High finding (Claude S-1, confidence 100; Codex COD-OVERALL-002, confidence 100). T4 as written was un-runnable against the live file.

## Why it happens

The leader did not re-read the readiness report's corrected anchor table when authoring the Plan. The stale anchor came from the Idea, which had carried an approximate line reference from early ideation. The readiness report's job was precisely to verify and correct such anchors before Planning — but the Planning leader copied the Idea's stale citation instead of the readiness report's corrected value. When an upstream artifact corrects a reference, the downstream artifact must use the corrected value, not the one from earlier-iteration artifacts.

## Correct approach

Before authoring any plan task's `verifies:` block that references a line number or anchor in a file, re-read the readiness report's anchors table for that file and use the values it confirms at the locked worktree commit. Never copy line anchors from Idea artifacts directly — those are written before the readiness check and may be approximate. The readiness report's verified anchors are authoritative over the Idea's approximate citations.

Also: wherever the plan itself or its self-review section makes a "no X remains" or "no survivor" claim about a literal string, that claim must be verified by a fresh scan of the draft itself (not from memory), not by restating what the intent was.

## How to detect

Red flag: a plan's T-n verification block cites a file line number that the leader did not re-verify against the readiness report for that task. Escalating signal: both evaluators independently flag the same line anchor as wrong in the first review iteration — this means the mistake is mechanical, not subtle.

Related patterns:
- `mistakes/planning-leader-asserted-file-type-without-verifying.md` — asserting a file property without a fresh read.
- `mistakes/leader-iter2-verification-claim-without-evidence.md` — making a no-survivor claim without a fresh grep.

## Related

- `mistakes/planning-leader-asserted-file-type-without-verifying.md`
- `mistakes/leader-iter2-verification-claim-without-evidence.md`
