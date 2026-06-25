---
name: planning-asserted-skill-without-verifying
description: Any agent asserts a skill/path exists in a planning artifact without running test -f or test -e to verify; the assertion injects a dead load-path downstream
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [process, planning, required-skills, verification]
priority: high
domain: process
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/verification/planning-asserted-skill-without-verifying.md
layer2-rationale: Generalizable across all projects — whenever any agent makes an existence claim about a path (skill, file, directory) during planning or agent-assignment work, it must verify the path exists before asserting it. Not gobbi-specific.
supersedes: null
superseded_by: null
---

# Any Existence Claim About a Path During Planning Must Be Verified With test -f Before Asserting

## Layer-2 note

This is a Layer-2 copy of `mistakes/verification/planning-asserted-skill-without-verifying.md`. It lives in `skills/mistake/` so it persists and loads across all projects and future sessions. The canonical record is at the project mistakes path above; this copy exists only for cross-project recall.

---

## What happened

During the iter2 REVISE, the planning leader performed a "full re-audit" of required skills to fix an evaluator finding (a task missing a required skill). The audit added `claude` to multiple tasks on the assumption that a `skills/claude/SKILL.md` authoring-standard skill existed. In fact, the skill file does not exist — it is a known dangling reference. The leader asserted the skill assignment without running `test -e` or `test -f` on each referenced path.

The irony: the related mistake (`layer2-planning-leader-asserted-file-type-without-verifying`) was a required-mistake input to this very planning loop — yet the same class of error recurred during the fix for a different cluster.

## Why it happens

The agent treats a required-skills audit as a cross-reference exercise (does the skill conceptually fit the task?) rather than a verification exercise (does the skill file exist at the declared path?). Loading a mistake doc describing this failure mode is insufficient — the verification discipline must be explicitly invoked at the point of making an existence claim.

## Correct approach

Before finalizing any required-skill list in a planning draft, run `test -f <skill-path>` (or `test -e`) on each skill path from the worktree root.
- For Claude Code: `$SK/{skill-name}/SKILL.md`
- For Codex: `$WT/.agents/skills/{skill-name}/SKILL.md`

A required skill that fails the existence test must be either removed or substituted with a skill that exists. "Full re-audit" without file-existence verification is not a re-audit.

This principle extends beyond skills: any existence claim about a file, directory, or path in a planning or briefing artifact must be backed by a `test -f`/`test -e` call, not prior knowledge or assumption.

## How to detect

- A planning artifact lists a required skill that is referenced by name but not verified to exist on disk
- Any "file X exists at path Y" or "skill Z is available" claim in a plan with no cited verification command
- The Execution manager attempts to inject a Load Directives block with a path that resolves to nothing

## Related

- `mistakes/verification/planning-asserted-skill-without-verifying.md` — canonical project-level record
- `layer2-planning-leader-asserted-file-type-without-verifying.md` — adjacent mistake (asserting file TYPE without verifying)
