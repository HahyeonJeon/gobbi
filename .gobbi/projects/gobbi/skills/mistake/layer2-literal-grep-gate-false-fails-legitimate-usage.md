---
name: literal-grep-gate-false-fails-legitimate-usage
description: A verification gate built as a body-wide literal grep false-fails when the checked term appears legitimately in a different context — gate on structure or semantics, not a substring
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-26
session: babc6f3b-e845-4ed3-9625-c14ea9237fd8
tags: [verification, process]
keywords: [literal-grep, false-fail, semantic-classification, column-scoped, gate-brittleness]
author: claude
priority: high
domain: verification
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/verification/literal-grep-gate-false-fails-legitimate-usage.md
layer2-rationale: Generalizable across all projects. Any agent that writes a pass/fail gate as a body-wide literal grep for the presence or absence of a string hits this whenever the string has a dual usage — legitimate in one context (a warning, an example, anti-pattern prose) and a violation in another (a specific column, quoted content). Use a structural extract (target the column/field) or a semantic/manual classification instead. Not gobbi-specific.
supersedes: null
superseded_by: null
---

# Literal grep gate false-fails legitimate usage of the checked term

## Layer-2 note

This is a Layer-2 copy of `mistakes/verification/literal-grep-gate-false-fails-legitimate-usage.md`. It
lives in `skills/mistake/` so it persists and loads across all projects and future sessions. The
canonical record is at the project mistakes path above; this copy exists only for cross-project recall.

---

## What happened

A verification gate built as a body-wide literal grep (grep-for-presence or grep-for-absence of a
string) false-fails correct output. Two concrete instances: a synthesis-verb grep
(`grep -nEi 'blend|averag'`) over an Integration Log false-failed on the legitimate anti-synthesis prose
"SELECT, never blend"; and a path-grep (`grep -rl 'working/proposals'`) over an eval prompt false-failed
on a correct off-limits warning "do NOT read `working/proposals/`" (and, being literal, also MISSED the
content embedded without the path string).

## Why it happens

The assumption is that if a term should NEVER appear in the correct output, grep-for-absence is a sound
gate. It breaks when the term has a dual usage: it appears legitimately in one context (a warning,
explanatory prose, an anti-pattern example) while its appearance in another context (a specific column,
quoted body text) is the violation. A body-wide literal grep cannot distinguish the two contexts.

## Correct approach

Gate on STRUCTURE or SEMANTICS, not a body-wide literal grep:

- **Column/field-valued properties:** extract the specific column/field (`awk -F'|' '{print $4}'`, a
  YAML key, a JSON path) and check the extracted values against the enum. Explanatory prose in other
  columns is never reached.
- **Semantic properties:** use a manual/semantic classification — a human/auditor reads the target and
  classifies it against the property's meaning. A literal grep is a non-gating advisory aid at most.

Use the instrument that can distinguish the property you care about from look-alike instances of the
same string.

## How to detect

Before writing a grep-based gate, ask: "can the checked term appear legitimately in the same file for a
different reason?" If yes, a body-wide literal grep will false-fail. The trigger is any gate that checks
ABSENCE of a string that might appear in prose/warnings/examples, or PRESENCE of a string used both
correctly (one context) and incorrectly (another).
