---
name: conventional-comments-review-labels
description: Conventional Comments — label every review comment + a blocking/non-blocking decoration
type: references
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [code-review, review-comments, labels, blocking, conventional-comments]
author: claude
title: "Conventional Comments"
source: https://conventionalcomments.org/
accessed: 2026-06-27
ref_type: docs
---

# Conventional Comments

## Insight
Every review comment carries a label (praise / nitpick / suggestion / issue / question / thought / todo / chore) plus an optional decoration (blocking / non-blocking / if-minor): `<label> [decoration]: <subject>`. Labeling clarifies reviewer intent and makes feedback actionable and parseable.

## Reason
Anchors `review.md`'s comment-etiquette step and its mapping to the gobbi finding schema: `issue`+blocking → Critical/High `design_flaw`; `suggestion`+non-blocking → Medium/Low; `nitpick` → Low (Google "Nit:"); `praise` → the Preserve-list.

## Source
- https://conventionalcomments.org/

## Excerpt
"Labeling comments encourages collaboration and saves hours of undercommunication and misunderstandings." Format: `<label> [decorations]: <subject>`.
