---
name: false-missing-file-grep-scoped-to-wrong-dir
description: Evaluator asserted a skill-referenced file does not exist after grepping only .claude/ instead of the canonical skill tree
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-07
session: a4e3b54d-3182-4193-8a42-69fce489a098
tags: [process, evaluation, verification, citation-fidelity]
priority: medium
domain: process
supersedes: null
superseded_by: null
---

# Evaluator Asserted a Skill-Referenced File Does Not Exist — Grep Scoped to Wrong Directory

## What happened

During iter3 evaluation of the subagent-continuation redesign, the Claude evaluator raised a Medium/100 finding (surfaced under S-1, U-1, A-1, C-1) that the draft citation `reconcile-session-metadata.sh:47-78` names a file that "does not exist." The evaluator recommended renaming the citation to `reconstruct-agents.sh`. This recommendation was INCORRECT: the file `reconcile-session-metadata.sh` DOES exist at:

```
.gobbi/projects/gobbi/skills/orchestration/scripts/reconcile-session-metadata.sh
```

The evaluator's grep was scoped to `.claude/` only. `.claude/scripts/` holds only `reconstruct-agents.sh` (a different script). The canonical source tree for skill-referenced scripts is `.gobbi/projects/<project>/skills/<skill>/scripts/` — this tree is what `.claude/` mirrors, but the physical file is in the canonical tree, not necessarily duplicated under `.claude/`.

The Codex evaluator verified the correct file exists by following `orchestration/SKILL.md`'s pointer and did NOT raise this as a finding. The draft's citation is correct.

## Why it happens

The evaluator assumed that skill-referenced scripts live under `.claude/scripts/` (the `.claude/` mirror directory) rather than in the canonical skill tree under `.gobbi/projects/<project>/skills/<skill>/scripts/`. When the grep scoped to `.claude/` returned no match, the evaluator concluded the file does not exist — without widening the search to the canonical tree.

The root cause is a directory-scoped existence check that does not cover all possible locations for a skill's supporting scripts.

This is a re-instantiation of the pattern recorded in `mistakes/leader-iter2-verification-claim-without-evidence.md` and `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — a "verified" claim that does not resolve against the live file, propagated without freshly verifying the full tree.

## Correct approach

Before asserting that a skill-referenced file is missing:

1. Determine the skill's canonical location in the project tree (`.gobbi/projects/<project>/skills/<skill>/`).
2. Resolve the script's relative `scripts/foo.sh` reference against the skill's canonical directory: `.gobbi/projects/<project>/skills/<skill>/scripts/foo.sh`.
3. Verify with a repo-wide find: `find . -name foo.sh` — do NOT scope to `.claude/` only.
4. Only after the repo-wide find returns no match conclude the file is missing.

For the specific case of gobbi orchestration scripts: `.claude/` holds symlinks to or copies from `.gobbi/projects/gobbi/skills/`. The physical source is always in the canonical skill tree. A grep or find scoped to `.claude/` may miss files that exist only in the canonical tree.

## How to detect

Trigger signal: an evaluator asserts "the file `{slug}.sh` does not exist" with evidence that is a grep or find scoped to `.claude/` or another subdirectory — but the citing skill uses a path like `orchestration/scripts/{slug}.sh` which resolves relative to the skill's canonical dir.

Before accepting a "file not found" claim from an evaluator, verify with `find . -name {slug}.sh` from the repository root. If the repo-wide find returns a result, the evaluator's claim is a false positive caused by a directory-scoped grep.

Second signal: the Codex evaluator did not raise the same concern (or raised a different concern). Cross-system disagreement on a "file missing" claim is a strong signal that one system scoped its search incorrectly.

## Related

- `mistakes/leader-iter2-verification-claim-without-evidence.md` — the broader pattern: a "verified" claim stated without fresh evidence from the actual source.
- `mistakes/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — re-asserting a prior verification claim without re-reading the source.
- `mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md` — related grep-scope failure (wrong phrase coverage instead of wrong directory).
