---
name: planning-asserted-skill-without-verifying
description: Planning leader added required-skill assignments without verifying each skill path exists, injecting a dead load-path into the Execution briefing
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [process, planning, verification]
keywords: [required-skills]
author: claude
priority: high
domain: process
---

# Planning leader asserted required-skill assignments without verifying skill paths exist

## What happened

During the iter2 REVISE, the planning leader performed a "full re-audit" of required skills (CLUSTER-4) to fix the CODEX-2 finding (a task missing a required skill). The audit added `claude` to tasks 03/04/10 on the assumption that a `skills/claude/SKILL.md` authoring-standard skill existed. In fact, `skills/claude/SKILL.md` does not exist — it is a known FLAG-2 dangling reference documented in `gobbi/SKILL.md:189`. The leader asserted the skill assignment without running `test -e` or `test -f` on each referenced path.

This finding was dual-corroborated by both evaluators: Claude raised it as STRUCT-1-iter2/USAGE-1-iter2/OVR-1-iter2; Codex independently ran `test -e` on three possible paths for `claude` skill and confirmed all absent (CODEX-2i2).

## Why it happens

The planning leader treated the required-skills audit as a cross-reference exercise (does the skill conceptually fit the task?) rather than a verification exercise (does the skill file exist at the declared path?). The `layer2-planning-leader-asserted-file-type-without-verifying` mistake was a required-mistake input to this very planning loop — yet the same class of error (asserting existence without verifying) recurred during the fix for a different cluster.

The irony noted by the Claude evaluator: the mistake was loaded and still repeated in the fix for a different cluster. This is the highest-value MEMORIZATION signal because it demonstrates that loading the mistake doc is insufficient — the verification discipline must be explicitly invoked at the point of making an existence claim.

## Correct approach

Before finalizing any required-skill list in a planning draft, run `test -f <skill-path>` (or `test -e`) on each skill path from the worktree root. For Claude Code, the skill path is `$SK/{skill-name}/SKILL.md`. For Codex, the path is `$WT/.agents/skills/{skill-name}/SKILL.md`. A required skill that fails the existence test must be either removed or substituted with a skill that exists. "Full re-audit" without file-existence verification is not a re-audit.

## How to detect

- A planning artifact lists a required skill that is referenced by name but not verified to exist on disk
- The planning loop's required-mistakes include `layer2-planning-leader-asserted-file-type-without-verifying` but the leader did not run `test -f` on skill paths during the required-skills section
- The Execution manager attempts to inject a Load Directives block with a path that resolves to nothing

## Layer-2 candidate

This mistake generalizes: whenever any agent makes an existence claim about a path (skill, file, directory) during planning or agent-assignment work, it must verify the path exists before asserting it. The specific failure mode (asserting skill assignment without `test -e`) is not gobbi-specific.

## Related

- `3-planning/evaluation/iter2/claude/structure.md` § STRUCT-1-iter2
- `3-planning/evaluation/iter2/claude/usage.md` § USAGE-1-iter2
- `3-planning/evaluation/iter2/claude/overall.md` § OVR-1-iter2
- `3-planning/evaluation/iter2/codex/overall.md` § CODEX-2i2
- `3-planning/working/discussion-log.md` § "Process mistake-candidate #2"
- `.gobbi/projects/gobbi/skills/mistake/layer2-planning-leader-asserted-file-type-without-verifying.md`
