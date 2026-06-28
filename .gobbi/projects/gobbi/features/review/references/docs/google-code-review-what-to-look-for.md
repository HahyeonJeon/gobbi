---
name: google-code-review-what-to-look-for
description: Google's ordered review checklist — review broadest-first, every line
type: references
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [code-review, review-order, design-first, every-line, checklist]
author: claude
title: "What to look for in a code review (Google eng-practices)"
source: https://google.github.io/eng-practices/review/reviewer/looking-for.html
accessed: 2026-06-27
ref_type: docs
---

# What to look for in a code review (Google eng-practices)

## Insight
A reviewer checks, broadest-first: design → functionality → complexity → tests → naming → comments → style → consistency → documentation → and looks at every line. Starting from design before details is the key ordering rule.

## Reason
Anchors `review.md`'s procedure "review order" step: lead with design/architecture and narrow to line-level, so the craft points (naming, imports, docstrings) are checked after the structural ones.

## Source
- https://google.github.io/eng-practices/review/reviewer/looking-for.html
- Google Engineering Practices — Code Review Developer Guide

## Excerpt
"Look at every line of code that you have been assigned to review." Review order starts broad (design) before details.
