---
name: github-label-sync-config-as-data
description: A repo owns a declarative labels file the tool syncs/validates against, with aliases so a rename does not orphan data — the config-as-data + rename-safety precedent.
type: references
scope: feature
feature: memory
status: active
created: 2026-06-23
session: 2026-06-23-d0185dba
tags: [memory, design, validation]
keywords: [github-label-sync, labels-yml, config-as-data, aliases, rename-safety]
author: claude
title: GitHub label-sync — config-as-data with rename-safe aliases
source: https://github.com/marketplace/actions/label-sync
accessed: 2026-06-23
ref_type: docs
---

# GitHub label-sync — config-as-data with rename-safe aliases

## Insight
github-label-sync reads a project-owned declarative file (`.github/labels.yml`) listing the allowed labels; a generic tool reconciles reality to the declaration and supports `aliases` so renaming a label keeps previously-labeled issues/PRs. Labels not in the config are reported.

## Reason
Two precedents for this work: (a) a project-owned declarative vocabulary file enforced by a generic tool (Q1), and (b) an alias/rename-safety affordance worth considering for the WS-B migration so a renamed area does not orphan existing records.

## Source
- https://github.com/marketplace/actions/label-sync
- Financial-Times/github-label-sync

## Excerpt
The config file (JSON/YAML, e.g. .github/labels.yml) declares each label; if an existing label's name matches an alias, that label is edited to match the config, preventing loss of previously-labeled items.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-23 | 2026-06-23-d0185dba | Q1 config-as-data + WS-B migration rename-safety |

## Related

- [[commitlint-scope-enum]] — the same project-owned controlled-vocabulary pattern
