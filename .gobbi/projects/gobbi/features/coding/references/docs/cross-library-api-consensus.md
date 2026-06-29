---
name: cross-library-api-consensus
description: NumPy/PyTorch/Array-API show a domain converging on one consensus API shape to benchmark against
type: references
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [api-design, numpy, pytorch, array-api, broadcasting, benchmarking]
author: claude
title: "Cross-library API consensus (NumPy / PyTorch / Array API)"
source: https://numpy.org/neps/nep-0056-array-api-main-namespace.html
accessed: 2026-06-27
ref_type: docs
---

# Cross-library API consensus (NumPy / PyTorch / Array API)

## Insight
Broadcasting semantics popularized by NumPy were adopted wholesale by PyTorch and JAX; argument naming is kept consistent across a library's surface (e.g. a shared `data_path`); the Python Array API standard codifies one cross-library shape. A domain converges on a consensus API, and new APIs are best benchmarked against it.

## Reason
The concrete mechanism for seed 3: rather than designing a public API from scratch, a reviewer benchmarks the method/parameter shape against how the dominant libraries in the same domain already do it, and converges on that consensus unless there is a stated reason to deviate.

## Source
- https://numpy.org/neps/nep-0056-array-api-main-namespace.html (Array API standard support)
- https://docs.pytorch.org/docs/stable/notes/broadcasting.html (PyTorch adopts NumPy broadcasting)

## Excerpt
PyTorch broadcasting semantics "are the same as those popularized by NumPy"; the Array API standard defines a common namespace across array libraries.
