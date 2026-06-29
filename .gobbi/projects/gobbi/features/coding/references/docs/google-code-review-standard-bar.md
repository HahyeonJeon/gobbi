---
name: google-code-review-standard-bar
description: The review bar — approve when the change improves overall code health; principle over preference; mark nits
type: references
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [code-review, review-bar, code-health, nit, principle-over-preference]
author: claude
title: "The Standard of Code Review (Google eng-practices)"
source: https://google.github.io/eng-practices/review/reviewer/standard.html
accessed: 2026-06-27
ref_type: docs
---

# The Standard of Code Review (Google eng-practices)

## Insight
Approve a change once it definitely improves the overall code health of the system, even if it is not perfect. Technical facts and engineering principle override personal preference; non-blocking polish is prefixed "Nit:" so the author may ignore it.

## Reason
Anchors `review.md`'s verdict/bar step and the anti-nitpick guard: a reviewer must not block on personal preference or endless nits, and must not delay a healthy change for perfection.

## Source
- https://google.github.io/eng-practices/review/reviewer/standard.html
- Google Engineering Practices — Code Review Developer Guide

## Excerpt
"...favor approving a CL once it is in a state where it definitely improves the overall code health of the system being worked on, even if the CL isn't perfect." There is no perfect code, only better code.
