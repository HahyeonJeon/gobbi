---
title: Dedicated dev-doc-quality enforcement (eval perspective / Principle-13 quality facet)
status: deferred
project: gobbi
feature: null
task: null
anchor_session: b0a0eaf9-03f7-4dce-a040-c7443653a459
created: 2026-05-26
---

# Dedicated dev-doc-quality enforcement (eval perspective / Principle-13 quality facet)

## Context
The project-memory dev-doc standard (this session) ships a written quality bar + a conformance retrofit + at most a minimal mechanical grep gate. The third scope tier — making the prose-quality / type-purity bar *self-enforce* — would require encoding the standard as a dedicated evaluation perspective (a judgment check on prose quality, type-purity, ADR-section completeness) and/or extending Principle 13 with a dev-doc-quality facet that points at the standard. That is the "judgment check" half of the docs-as-code split (see reference `docs-as-code-linting`), distinct from the cheap mechanical grep gate that IS in scope.

## Why deferred
The user explicitly capped enforcement this session: F3 enforcement-depth decision was "I just said it for avoiding unnecessary change. Don't think deeply." — keep enforcement MINIMAL (mechanical grep gate at most), avoid Principle-13 surgery and a new evaluation perspective unless trivially warranted. A new evaluation perspective and a principle edit are heavier, non-trivial changes that exceed this session's contract.

## When to pick up
- After the standard + conformance wave + prose wave have shipped and stabilized (so the perspective has a concrete, written bar to score against).
- When repeated drift is observed despite the mechanical grep gate (a witness that the cheap check is insufficient and the judgment check is warranted).
- No earlier — encoding enforcement before the standard exists would game the metric (Principle 11).

## Suggested approach
Draw the perspective's checklist directly from the shipped standard's per-type section contract + the self-contained-prose rule + type-purity. Mechanical items (frontmatter base-schema, staging-key leaks, session-coord grep) stay in the grep gate; only the judgment items (does this read as a self-contained dev-doc of its type?) become the perspective. If extending Principle 13 instead, add a quality facet that POINTS at the standard's examples — do not duplicate the standard into the principle (per mistake `naming-standard-needs-positive-guidance-not-just-blocklist`: anchor in a principle that points to examples, don't rely on a mechanical regex alone).

## Originating session
`.gobbi/projects/gobbi/sessions/b0a0eaf9-03f7-4dce-a040-c7443653a459/`
