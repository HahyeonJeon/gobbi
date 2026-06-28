---
name: invalid-execution-tag
description: The staged plans/main.md carried execution in tags; that tag is not in the plans type's controlled vocabulary and would fail validate-frontmatter.sh
type: decisions
scope: feature
feature: review
status: accepted
created: 2026-06-28
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: [process]
keywords: [frontmatter, tags-vocabulary, plans-type, execution-tag, validate-frontmatter, F-CONSIST-2]
author: claude
supersedes: null
---

## Context

The staged plan `3-planning/staging/plans/main.md` carried `tags: [planning, execution]` in its frontmatter. The `plans` memory type's controlled tag vocabulary (declared in `memory-vocabulary.json` under `.types.plans.tags`) does not include `execution`. Per `memory/rules.md §2.5`, a tag outside its type's pool is a validation failure. The `validate-frontmatter.sh` gate run at Wrap-up would FAIL the file.

Claude evaluator flagged this as F-CONSIST-2 (consistency.md, Low/100, general/docs-sync).

## Decision

Move `execution` from `tags:` to `keywords:` in `staging/plans/main.md`. The `keywords` field is the freeform escape-hatch for terms outside the controlled vocabulary (rules.md §2.1). No extension of the `plans` tag pool is needed for this session.

This fix was applied during RECORD before Wrap-up, so the staged file is clean when promoted.

## Rationale

`planning` is a valid `plans` tag and resolves the area to `workflow` via the tagAreaMap. `execution` as a keyword communicates the same intent (this plan briefs Execution) without violating the controlled vocabulary. The fix is one-line, non-controversial, and avoids avoidable Wrap-up rework.

## Alternatives considered

- Extend the `plans` tag pool to include `execution`. Rejected: `execution` as a tag would make every planning plan appear to touch the execution subsystem, which is inaccurate. The right place for this semantic is `keywords`.
- Leave as-is and let Wrap-up handle it. Rejected: a known validation failure is a Principle 10 breach — fix it in scope rather than deferring it.

## Consequences

The `staging/plans/main.md` frontmatter now has `tags: [planning]` and `keywords: [code-review, coding-skill, child-doc, language-agnostic, execution]`. The validate-frontmatter.sh gate will pass.
