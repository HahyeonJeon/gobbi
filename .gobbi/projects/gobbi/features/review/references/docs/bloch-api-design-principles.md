---
name: bloch-api-design-principles
description: Bloch's API design rules — as small as possible, hard to misuse, least astonishment, names matter
type: references
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [api-design, least-astonishment, naming, hard-to-misuse, minimal-surface]
author: claude
title: "How to Design a Good API and Why it Matters (Joshua Bloch)"
source: https://research.google.com/pubs/archive/32713.pdf
accessed: 2026-06-27
ref_type: paper
---

# How to Design a Good API and Why it Matters (Joshua Bloch)

## Insight
Every API facet should be as small as possible but no smaller ("when in doubt, leave it out"). An API should be easy to use and hard to misuse, obey the principle of least astonishment, and names matter — strive for intelligibility, consistency, and symmetry. Document every exported element.

## Reason
The primary external anchor for seed 3 (public-API ergonomics) and reinforces seeds 1–2 (naming): a reviewer checks a public method/parameter against minimal-surface, hard-to-misuse, least-astonishment, and consistent-naming criteria.

## Source
- https://research.google.com/pubs/archive/32713.pdf
- Joshua Bloch, OOPSLA 2006 companion talk/paper

## Excerpt
"When in doubt, leave it out." "Every method should do the least surprising thing it could, given its name." "Names matter — strive for intelligibility, consistency, and symmetry."
