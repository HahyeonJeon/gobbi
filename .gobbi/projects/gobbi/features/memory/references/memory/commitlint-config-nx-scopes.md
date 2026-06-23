---
name: commitlint-config-nx-scopes
description: config-nx-scopes derives the allowed scope vocabulary from project structure — the prior art for features-seeded areas.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [memory, design, validation]
keywords: [config-nx-scopes, derive-from-structure, project-graph, dynamic-enum]
author: claude
title: commitlint config-nx-scopes — derive scope vocabulary from project structure
source: https://www.npmjs.com/package/@commitlint/config-nx-scopes
accessed: 2026-06-23
ref_type: docs
---

# commitlint config-nx-scopes — derive scope vocabulary from project structure

## Insight
`@commitlint/config-nx-scopes` generates the `scope-enum` vocabulary dynamically from the workspace project graph (filtering by name/projectType) instead of a hardcoded list. Real systems offer derive-from-structure as ONE option alongside explicit config.

## Reason
This is the validated form of "areas derived from `features/` dir names". Invoke when weighing the features-as-areas option (Q1 alt 1B): it proves derivation works AND that mature tools offer it as one mechanism, not the only one — supporting a config that can seed from structure but stay overridable.

## Source
- https://www.npmjs.com/package/@commitlint/config-nx-scopes

## Excerpt
config-nx-scopes builds the allowed scope list from the project graph at lint time, filtering projects by properties such as name and projectType.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-23 | 2026-06-23-d0185dba | Q1 features-as-areas alternative analysis |

## Related

- [[commitlint-scope-enum]] — the explicit-config form of the same scope-vocabulary idea
