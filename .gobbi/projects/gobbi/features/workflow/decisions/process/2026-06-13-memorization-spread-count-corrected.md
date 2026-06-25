---
name: memorization-spread-count-corrected
description: The MEMORIZATION caps-token spread was understated at 12 prose sites; corrected to 49 live files
type: decisions
scope: feature
feature: workflow
status: accepted
created: 2026-06-13
session: 7e00f98e-9ee8-4270-ba76-0d2f58d3f7e4
tags: [vocabulary-sweep, docs-sync]
keywords: [count-correction]
author: claude
supersedes: null
superseded_by: null
---

# MEMORIZATION spread corrected from 12 prose sites to 49 live files

## Context
The iter1 draft's INT-2 claimed "MEMORIZATION in 12 prose sites + 2 hook comments." The actual command-verified count is 49 live files (1 of which is a hook, a comment). The undercount was an instance of the form-blindness mistake (only checked the dominant form).

## Decision
Replace the prose-estimate with the command-derived count: `grep -rlw MEMORIZATION $ROOT --include='*.md' --include='*.sh' --include='*.toml' | grep -v /sessions/ | grep -v /features/workflow/ | grep -v /notes/ | grep -v /backlogs/ | grep -v /mistakes/ | grep -v layer2-` → 49. This is now the authoritative figure driving the D-e manifest.

## Rationale
The form-blindness mistake mandates exhaustive-vocabulary verification; the command-derived manifest is the corrective. Every count must carry its regenerable command so Planning/Execution does not inherit a hand-counted figure.

## Alternatives considered
- Keep the estimate and fix incrementally during Execution (rejected: the wrong count would mislead Planning's task decomposition).

## Consequences
The 71-in-scope headline (B1..B7 sum) now correctly accounts for 49 MEMORIZATION-bearing files. The D-e manifest's B3 bucket absorbs the corrected figure.

## Related
- Design § D-e (command-derived manifest)
- `evaluation/iter1/claude/project.md` (proj-int2-memorization-spread-undercount)
