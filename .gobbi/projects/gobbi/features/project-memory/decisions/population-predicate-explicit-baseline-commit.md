---
name: population-predicate-explicit-baseline-commit
description: Population counts for the conformance wave must use an explicitly defined predicate and a named baseline commit.
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [conformance, population, reproducibility, baseline]
decision_status: accepted
finding-iter: 1
---

# Population predicate and baseline commit must be explicit and reproducible

## Context

An early draft claimed "~147 feature+project content docs" and base-frontmatter presence on
"~14-25 files." These numbers were not reproducible against the current tree and did not name
the commit or scope-predicate used. The true population at the named baseline commit is 208 files
(P_live_all) with 50 fully conformant — nearly double the claimed denominator.

## Decision

Population counts for the conformance wave use the explicitly defined predicate **P_live**:

> All `*.md` under `.gobbi/projects/gobbi/` EXCLUDING `sessions/`, `skills/`, `agents/`, `tmp/`,
> and the frozen `archive/`.

- **P_live_all = 208 files** (includes 17 README.md index files) — measured at HEAD d2b5b37.
- **P_live_content = 191 files** (P_live_all minus 17 READMEs).
- **Fully conformant today: 50 / 208** (~24%).
- Commands to reproduce the counts are recorded in the originating session's Ideation rawdata (see `## Source`).

## Rationale

A Planner sizing wave-1 from an undercounted population will under-scope the effort by ~50%.
The baseline commit must be named (d2b5b37) because HEAD d2b5b37 already shipped 28 renames +
frontmatter work; any pre-work baseline is now stale.

## Consequences

- The conformance wave's effort is sized against 208 files (P_live_all for base-schema check)
  and 191 files (P_live_content for prose-quality wave).
- Success Criterion 2 is stated against P_live_all (208): 100% carry full base schema; 0
  illegitimate staging-key leaks outside `archive/`.
- The stale "~147 / ~14-25 / 64 leaks / ~15% realized" numbers are fully superseded.

## Alternatives considered

Keep the original approximate figures ("~147 content docs") without naming a baseline commit — rejected: approximate, commit-less figures are not reproducible and under-counted the true population by roughly half, which would have under-scoped the conformance wave.

## Related

- [type-aware-strip-disposition-not-blanket-leak](type-aware-strip-disposition-not-blanket-leak.md) — the FIX-1 predicate counted against this population
- [`plans/2026-05-26-dev-doc-standard-retrofit`](../plans/2026-05-26-dev-doc-standard-retrofit.md) — the plan that sizes its waves against this population (later count-corrected to 222/204)

## Source

Originating session `b0a0eaf9-03f7-4dce-a040-c7443653a459` (see the `session` frontmatter field) — Ideation review; reproduction commands are in that session's Ideation rawdata decisions log.
