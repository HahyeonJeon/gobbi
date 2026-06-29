---
name: google-small-self-contained-changes
description: Small, self-contained changes are reviewed faster and more thoroughly
type: references
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [code-review, small-diffs, self-contained, author-discipline]
author: claude
title: "Small CLs (Google eng-practices)"
source: https://google.github.io/eng-practices/review/developer/small-cls.html
accessed: 2026-06-27
ref_type: docs
---

# Small CLs (Google eng-practices)

## Insight
A change should be one self-contained concern with its tests and enough context to understand it (~100 lines is a reasonable size; ~1000 is usually too large). Small changes are reviewed faster and more thoroughly; a reviewer may reject a change for size alone.

## Reason
Anchors `review.md`'s procedure "author's half" step — keep the diff small and self-contained before review; split it otherwise. This is the precondition that makes the rest of the review effective.

## Source
- https://google.github.io/eng-practices/review/developer/small-cls.html
- Google Engineering Practices — Code Review Developer Guide

## Excerpt
"100 lines is usually a reasonable size for a CL, and 1000 lines is usually too large." Reviewers have discretion to reject a change outright for being too large.
