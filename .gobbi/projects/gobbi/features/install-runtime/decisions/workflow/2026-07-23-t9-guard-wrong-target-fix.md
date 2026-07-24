---
name: t9-guard-wrong-target-fix
description: T9 passed startup SKILL.md directly to check-skill-mistakes.sh (a mistakes-companion validator), which is the wrong target type and produced 34 unrelated violations
type: decisions
scope: feature
feature: install-runtime
status: accepted
created: 2026-07-23
session: 1245142c-0a76-4333-b2d3-6892a62eb359
tags: [planning, verification]
keywords: [cod-plan-usage-002, check-skill-mistakes, wrong-guard-target, six-file-lock-assertion]
author: claude
supersedes: null
superseded_by: null
related: [check-skill-mistakes-scope-label]
---

# T9's guard invocation targets the correct validator input

## Context

At iter1, T9 ran `check-skill-mistakes.sh <startup SKILL.md>` — but that script validates a MISTAKES-companion
file, not a `SKILL.md`, so the invocation was structurally wrong-target and produced 34 unrelated violations that
had nothing to do with this plan's edits (`COD-PLAN-USAGE-002`, High/100).

## Decision

Replaced with `check-skill-mistakes.sh --all` (the correct project-wide invocation) plus an explicit
`test ! -e "$S/mistakes.md"` negative-existence assertion proving the six-file lock directly, rather than relying
on the wrong-target invocation to imply it.

## Rationale

Reproduced both halves this session: `check-skill-mistakes.sh <startup SKILL.md>` → exit 1, 34 violations (the
wrong-target defect, confirmed); `check-skill-mistakes.sh --all` → exit 0, 11 files / 91 references (the correct
invocation, confirmed clean on the baseline).

## Alternatives considered

- **Keep the per-file invocation but point it at the right companion file** — rejected: `skills/startup/` has no
  `mistakes.md` companion yet (that is exactly the property the six-file lock protects), so there is no correct
  per-file target; the project-wide `--all` invocation is the right shape.

## Consequences

The `--all` invocation is WIDER than this plan's own six-file scope — see [[check-skill-mistakes-scope-label]]
for the iter3 fix that labels this scope difference explicitly so a future failure is diagnosed correctly.

## Related

- [[check-skill-mistakes-scope-label]] — the iter3 residual fix (honest scope labelling) for this same guard invocation
