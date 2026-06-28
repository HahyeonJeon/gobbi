---
name: sklearn-api-consistency-non-proliferation
description: scikit-learn API principles — consistency, non-proliferation of classes, sensible defaults, small vocabulary
type: references
scope: feature
feature: review
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [api-design, consistency, non-proliferation, sensible-defaults, composition]
author: claude
title: "API design for machine learning software (scikit-learn)"
source: https://arxiv.org/abs/1309.0238
accessed: 2026-06-27
ref_type: paper
---

# API design for machine learning software (scikit-learn)

## Insight
scikit-learn's design rests on consistency (one interface shared by all units), non-proliferation of classes (a small set of objects rather than many specialized ones), sensible defaults, composition (pipelines), and a small consistent method vocabulary (fit/predict/transform). A constrained vocabulary reduces cognitive load.

## Reason
Anchors seed 4 (necessity / non-proliferation — drop unneeded structures) and seed 7 (per-class method-set design): a reviewer flags class/method proliferation and missing sensible defaults, and prefers a small consistent surface.

## Source
- https://arxiv.org/abs/1309.0238
- Buitinck et al., "API design for machine learning software: experiences from the scikit-learn project" (2013)

## Excerpt
A "simple and elegant interface shared by all learning and processing units"; non-proliferation of classes; sensible defaults; composition; a small consistent method vocabulary (fit/predict/transform).
