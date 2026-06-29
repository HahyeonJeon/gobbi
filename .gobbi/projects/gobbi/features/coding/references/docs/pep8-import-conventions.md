---
name: pep8-import-conventions
description: PEP 8 import rules — top-of-file, grouped, one per line, absolute, no wildcards
type: references
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [imports, pep8, import-grouping, no-wildcard, inline-imports]
author: claude
title: "PEP 8 — imports"
source: https://peps.python.org/pep-0008/
accessed: 2026-06-27
ref_type: docs
---

# PEP 8 — imports

## Insight
Imports belong at the top of the file, grouped standard-library / third-party / local with blank lines between, one import per line, absolute imports preferred, wildcard imports avoided. The structure implies function-local/inline imports are the exception, not the norm.

## Reason
Anchors seed 5 (import consistency): a reviewer checks grouping/order, flags an inline/function-local import that is not deferring a genuine cost, and flags wildcard imports. The TS parallel (named exports, `index.ts` barrel, type-only imports) is captured in the TS-conventions reference.

## Source
- https://peps.python.org/pep-0008/ (Imports section)

## Excerpt
"Imports should usually be on separate lines." Grouped stdlib / third-party / local; "wildcard imports ... should be avoided, as they make it unclear which names are present in the namespace."
