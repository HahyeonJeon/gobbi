---
name: controlled-vocabulary-hybrid
description: A closed designer-defined vocabulary beats a folksonomy for retrieval, but best practice is a hybrid — controlled core plus an uncontrolled escape-hatch — which gobbi already implements.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [memory, design]
keywords: [controlled-vocabulary, folksonomy, hybrid, escape-hatch, information-architecture]
author: claude
title: Controlled vocabulary vs folksonomy — the hybrid best practice
source: http://bokardo.com/archives/change_is_good/
accessed: 2026-06-23
ref_type: blog
---

# Controlled vocabulary vs folksonomy — the hybrid best practice

## Insight
A controlled vocabulary (designer-preselected terms) "supports searching and browsing much better" than folksonomy tags, but pure control "is not extensible to the majority of cases". The resolution is a hybrid: a controlled core plus an uncontrolled escape-hatch.

## Reason
gobbi's §1.5 already IS this hybrid: a closed `area` allowlist (controlled) + a `_shared` no-match terminal + the `keywords` freeform escape-hatch. Invoke to justify keeping the controlled-vocabulary DESIGN unchanged — the only change is moving WHO controls it (harness → project), not abandoning control for a folksonomy.

## Source
- http://bokardo.com/archives/change_is_good/
- https://www.webology.org/2007/v4n2/editorial12.html

## Excerpt
Controlled-vocabulary tags applied by designers support search and browse much better than folksonomy tags; the advantage of folksonomy is extensibility, not quality.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-23 | 2026-06-23-d0185dba | Q2 universal+project layering; keep controlled-vocab design |

## Related

- [[para-areas-of-responsibility]] — the "area" noun within an organizing taxonomy
