---
name: pep257-docstring-conventions
description: PEP 257 docstrings — summary-line-first, imperative, no signature restatement, concise
type: references
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [docstrings, pep257, summary-line, imperative, compaction]
author: claude
title: "PEP 257 — docstring conventions"
source: https://peps.python.org/pep-0257/
accessed: 2026-06-27
ref_type: docs
---

# PEP 257 — docstring conventions

## Insight
A docstring leads with a one-line summary phrased imperatively ("Do this", "Return that"), separated from any elaboration by a blank line, and does not restate the signature. One-liners stay one line. The convention is inherently compact.

## Reason
Anchors seed 6 (docstring compaction): a reviewer rewrites an over-long docstring to a one-line imperative summary plus only the non-obvious, and flags signature-restating prose. The TS parallel is a TSDoc block that narrates types already in the signature.

## Source
- https://peps.python.org/pep-0257/

## Excerpt
"It prescribes the function or method's effect as a command ('Do this', 'Return that'), not as a description." Do not restate the signature (`function(a, b) -> list`).
