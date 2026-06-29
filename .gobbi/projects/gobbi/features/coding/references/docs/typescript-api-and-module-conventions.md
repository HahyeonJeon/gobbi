---
name: typescript-api-and-module-conventions
description: TS API/module conventions — options-bag params, named exports, index.ts barrel, type-only imports
type: references
scope: feature
feature: coding
status: active
created: 2026-06-27
session: d45128ad-6a6c-4bb7-9925-343cd3b826c8
tags: []
keywords: [typescript, api-design, options-object, named-exports, barrel, imports]
author: claude
title: "TypeScript API & module conventions (Azure SDK guidelines + ES-module practice)"
source: https://azure.github.io/azure-sdk/typescript_design.html
accessed: 2026-06-27
ref_type: docs
---

# TypeScript API & module conventions

## Insight
TS public APIs prefer an options bag (`XOptions`, unit-suffixed params like `timeoutInMs`) over long positional lists; prefer named exports over default; reserve `index.ts` as the barrel entry point; separate type-only imports for tree-shaking; avoid wildcard exports.

## Reason
The TypeScript-side grounding the locked language stance requires: seeds 3 (API ergonomics), 5 (imports/module surface), and 8 (file/dir structure) all need a TS illustration so `review.md`'s general points cover Python AND TS without a TS-specific section.

## Source
- https://azure.github.io/azure-sdk/typescript_design.html (API design guidelines)
- https://arrangeactassert.com/posts/building-typescript-libraries/ (explicit exports, tree-shaking, barrel files)

## Excerpt
Name an options bag `<class name>Options` / `<method name>Options`; durations suffixed `In<Unit>` (`timeoutInMs`). `index.ts` is the barrel entry point; explicitly named re-exports prevent circular dependencies and enable tree-shaking.
