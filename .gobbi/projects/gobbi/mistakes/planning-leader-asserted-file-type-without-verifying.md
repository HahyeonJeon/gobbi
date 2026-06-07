---
name: planning-leader-asserted-file-type-without-verifying
description: Planning leader stated agents/*.md are real files (not symlinks) without running test -L or ls -l to verify
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [process, planning, citation-fidelity, symlinks, verification]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Planning Leader Asserted File Type Without Verifying

## What happened

During Planning for the subagent-continuation redesign, the planning leader stated in cross-cutting note #4 and in task-05's file-note that `agents/*.md` are "real files (NOT symlinks)." This assertion was INCORRECT: `.claude/agents/{manager,leader,executor}.md` ARE symlinks → `.gobbi/projects/gobbi/agents/{role}.md`. Only `.claude/CLAUDE.md` is a real file.

The manager caught the error during light Planning EVALUATION (spot-verification). Correction: the right edit target for every skill+agent is the canonical `.gobbi/projects/gobbi/{skills,agents}/...` real file; the Edit tool refuses to follow symlinks, so using `.claude/agents/` paths would cause task failures.

The correction was propagated to all executor briefs before Execution dispatch, preventing downstream failures.

## Why it happens

This is the same citation/verification-fidelity family as `leader-iter2-verification-claim-without-evidence.md` — a file-type claim stated from assumption, not from a live check. The leader's prompt brief mentioned the symlink structure in passing, but the leader produced the plan by reasoning from prior knowledge rather than verifying the claim against the actual file system.

## Correct approach

Before asserting a target file's type, existence, or path in a plan or brief:
1. Run `test -L <path>` or `ls -l <path>` to check symlink status.
2. Run `find . -name <filename>` repo-wide to confirm the canonical location.
3. State the evidence: "verified with `ls -l .claude/agents/manager.md` → symlink → `.gobbi/projects/gobbi/agents/manager.md`".

The planning brief's assertion is the executor's spec; an unverified file-type claim becomes the executor's incorrect starting assumption.

## How to detect

Any "X is/ isn't a symlink / real file / exists" claim in a plan or brief without a cited verification command. If the claim says "NOT symlinks" or "real file" with no supporting `ls -l`/`find` evidence, treat it as unverified.

## Related

- `mistakes/leader-iter2-verification-claim-without-evidence.md` — the broader pattern: "verified" claims stated without fresh evidence.
- `mistakes/false-missing-file-grep-scoped-to-wrong-dir.md` — evaluator made the symmetric error (wrong directory for a grep, not wrong file-type assumption).
- `mistakes/skills-mirror-symlinks-not-copies.md` — the background fact that `.claude/skills/` are symlinks, not copies.
- `mistakes/edit-tool-refuses-symlink-paths.md` — the downstream consequence of using symlink paths with the Edit tool.
