---
name: commitlint-scope-enum
description: A project config declares the allowed controlled vocabulary of commit scopes — the closest analog to project-declared memory areas.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [memory, design, validation]
keywords: [commitlint, scope-enum, controlled-vocabulary, project-config, closed-set]
author: claude
title: commitlint scope-enum — project-declared allowed commit scopes
source: https://github.com/conventional-changelog/commitlint/issues/395
accessed: 2026-06-23
ref_type: docs
---

# commitlint scope-enum — project-declared allowed commit scopes

## Insight
commitlint's `scope-enum` rule takes `[level, "always", [allowed values]]` and projects declare their own scope vocabulary — `api, web, mobile, auth, payments, notifications, db, infra, deps`. The vocabulary is project-owned config; a generic linter enforces it as a closed set.

## Reason
This is structurally identical to "the project declares its memory areas, the harness validator enforces them as a closed allowlist". Invoke when deciding WHERE the area vocabulary lives (Q1): it is the direct prior art for project-owned config-as-data enforced by a generic checker.

## Source
- https://github.com/conventional-changelog/commitlint/issues/395
- https://commitlint.js.org/reference/configuration.html

## Excerpt
`"scope-enum": [2, "always", ["api", "auth", "payments", "db", ...]]` — error level + applicability + the project's allowed-scope array.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-23 | 2026-06-23-d0185dba | Q1 config-as-data design decision |

## Related

- [[github-label-sync-config-as-data]] — the same config-as-data pattern with rename-safe aliases
