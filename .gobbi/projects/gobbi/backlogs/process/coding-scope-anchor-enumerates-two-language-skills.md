---
name: coding-scope-anchor-enumerates-two-language-skills
description: The coding scope anchor and its evaluation child still call python and typescript "future" and omit react, which now points at that anchor.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-25
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [docs-sync, process]
keywords: [coding-scope-anchor, language-agnostic, stale-enumeration, react-skill, pointer-target]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# The `coding` scope anchor enumerates two language skills and calls them future

## Context

`coding/SKILL.md:293`, the paragraph under the `## Scope — Language-Agnostic` heading, reads:
"language-specific *idioms* live in the future `python` / `typescript` skills". `coding/evaluation.md:5`
carries the same claim: "concrete language idioms … defer to the future `python` / `typescript` skills".

Both sentences are now wrong in two ways. Neither skill is future — both shipped. And the enumeration is
incomplete: `react/SKILL.md` References links to `../coding/SKILL.md#scope--language-agnostic` as the owner
of the language-agnostic properties it specializes, so a reader following that pointer lands on text that
does not mention `react` at all.

The pointer itself resolves and names the right owner. The heading exists at `coding/SKILL.md:291` and the
anchor is live. The defect is in the target's prose, not in the reference.

## Why deferred

The user decided during Ideation that all of `coding` stays untouched in this session, taken against the
leader's recommendation to generalize the two enumerations. The decision was reaffirmed at every task
boundary that touched registration, and obligation O-22 made it mechanically checkable: no file under
`coding/` may appear in this session's change set.

Recording the consequence is the alternative to silently absorbing it. This entry exists so the next reader
who notices the stale sentence finds a decision behind it rather than an oversight.

## When to pick up

Any session that already has authority to edit `coding/`. No prerequisite beyond that — the change is
prose in two sentences and depends on nothing that is unshipped.

A third language or library skill pointing at the same anchor raises the value of fixing it, because each
new pointer makes the enumeration more incomplete rather than less.

## Suggested approach

Generalize rather than extend. Replacing "the future `python` / `typescript` skills" with a phrase that
names no specific skill — "the per-language and per-library skills beneath this one" — fixes both
sentences permanently and does not go stale when a fourth skill arrives. `coding/SKILL.md:293`'s following
sentences already speak in that general register ("the language skill says…"), so only the enumeration
needs to change.

Check for a third carrier before editing: `coding/review.md` discusses Python and TypeScript as
illustrations, which is a different and legitimate use, and should not be swept into the same edit.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/`
