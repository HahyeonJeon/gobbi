---
name: johnny-decimal-bounded-namespace
description: A capped bucket set forces findability but is rigid for new concerns and lacks an archive path — the refactorability gap gobbi must close.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, design]
keywords: [johnny-decimal, namespace-cap, findability, refactorable]
author: claude
title: Johnny.Decimal — bounded namespace forces simplicity but resists new areas
source: https://johnnydecimal.com/
accessed: 2026-06-21
ref_type: docs
---

# Johnny.Decimal — bounded namespace forces simplicity but resists new areas

## Insight

Johnny.Decimal caps the tree at 10 areas x 10 categories. The cap is the feature: a hard ceiling keeps buckets few and findable, and a stable address (`12.04`) makes a record's location memorable. The documented cost: it is rigid for users who "regularly start new projects" — a concern that did not fit the original layout adds mental burden, and there is no clean archive path.

## Reason

Informs the per-type namespace scheme. A small, curated bucket set (the controlled area vocabulary) is more findable than free-form tags, but the redesign MUST pair it with an explicit refactor path (split/merge/rename a namespace) so gobbi does not inherit Johnny.Decimal's "new concern doesn't fit" rigidity. The user's third core point (refactorable) is exactly the mitigation J.D lacks. Invoke when defending the controlled-namespace-vocabulary + the N=10 scannability guidance.

## Source

- https://johnnydecimal.com/
- https://lucaf.eu/2023/02/23/luca-decimal.html

## Excerpt

"Johnny Decimal struggled for users who regularly start new projects because having to fit these projects in a structure which didn't conceive their existence was adding unnecessary mental burden."

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Anchored the controlled-namespace-vocabulary + N=10 scannability guidance + the refactor-path requirement |

## Related

- [[para-fluid-folder-refactor]] — the "movement is normal" stance that mitigates J.D rigidity
