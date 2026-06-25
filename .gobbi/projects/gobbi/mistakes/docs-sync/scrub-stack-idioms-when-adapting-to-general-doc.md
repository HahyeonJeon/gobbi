---
name: scrub-stack-idioms-when-adapting-to-general-doc
description: Mirroring a project-internal doc to author a general one drags in stack-specific idioms and present-tense wiring claims
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: e351aa58-de50-41b4-a147-a6ac33356c08
tags: [docs-sync, verification]
keywords: [language-agnostic, shape-reference, stack-idioms, wiring-claims, internal-vs-general]
author: claude
priority: high
domain: docs-sync
supersedes: null
superseded_by: null
related: []
---

# Scrub stack-specific idioms and present-tense wiring claims when adapting an internal doc to a general one

## What happened

Authoring the language-agnostic `coding/evaluation.md` by mirroring gobbi's own `execution/evaluation.md` (used as the child-doc shape reference) dragged in two kinds of contamination from the source: (1) a JS/TS test idiom — `` `test.skip` `` — leaked into a skill whose entire reason to exist is language-neutrality (Claude exec-eval CON-1, High); (2) a present-tense runtime claim — "Loaded alongside execution/evaluation.md" — that asserts a load-both wiring deferred per the scope contract (Claude USG-1). Both share one root: copying a project-internal doc for its shape inherits its stack-specific tokens and its as-wired-today claims.

## User feedback

The dual-system evaluators (Claude CON-1 + USG-1) surfaced the contamination. The manager recognized the root as shape-reference overreach — the executor used an internal doc for structure AND for phrasing.

## Why it happens

The executor used the internal doc as a shape template and carried prose across without scrubbing it against the new doc's different contract (language-agnostic; wiring-deferred). A shape reference is for STRUCTURE, not for verbatim phrasing.

## Correct approach

When a shape reference is a project-internal doc and the target is general: take the STRUCTURE only, and scrub every carried sentence for (a) language, tool, or framework-specific idioms such as `test.skip`, naming conventions, named libraries — restate as the language-agnostic property; (b) present-tense wiring or role claims that the target's scope defers — restate as intent ("intended to complement…", "wiring deferred"). Grep the finished general doc for the source's stack tokens before declaring done.

## How to detect

You are authoring a general, reusable, or cross-project doc by mirroring a project-internal one. The source legitimately names a specific language, tool, or framework, or describes the system as it is wired today. Any of those tokens copied across is a leak.

## Related

- [[label-rename-missed-in-fence-and-cross-doc]] — related docs-sync trap: changes in one doc must propagate to every mirror and fence
