---
name: config-format-json-jq
description: The project area+tag vocabulary config is JSON, read by the bash validator via jq
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [process, design]
keywords: [config-as-data, jq, validator, areas, tags]
author: user
supersedes: null
superseded_by: null
---

# Use JSON + jq for the project-owned area+tag vocabulary config

## Context
Ideation Q1 locked "config-as-data" for the project-defined area + tag vocabulary the bash validator reads, but deferred the FORMAT. The validator (`skills/memory/scripts/validate-frontmatter.sh:57`) carries a self-imposed "no external dependency" comment. The config must hold per-type area lists + the tag list + a nested tag→area priority map.

## Decision
The config is a JSON file, read by the validator using `jq` (the same idiom used across the repo).

## Rationale
Preparation readiness verified on-disk: `jq` is available (`/usr/bin/jq`, jq-1.7) and is already the established pattern for reading JSON in 10+ repo bash scripts (`hooks/session-end.sh:185` reads `session.json` via `jq -r`; same in `session-start.sh`, `reconcile-session-metadata.sh`, `verify-record-map.sh`). So jq is a de-facto repo dependency; the validator's "no dependency" line is self-imposed, not an environment limit. JSON holds the nested tag→area map naturally and is consistent with `session.json`/`hooks.json`/`state.json`. This also resolves the iter1 C3 tension (JSON in a markdown-driven memory layer): a config declaring taxonomy is config, not memory content, and JSON is already the config format under `.gobbi/`.

## Alternatives considered
- **Pure-bash flat file (no jq):** honors the no-dep comment literally, but the nested tag→area map is awkward in a flat KEY=value/newline format and pushes form-specific parsing fragility (the namespace-sweep mistake class). Rejected.
- **JSON + jq with `command -v jq` graceful fallback:** structured + robust to a missing jq, but two code paths to maintain for a binary present in every environment. Rejected as unjustified complexity.

## Consequences
- Planning task A-2/A-3 (validator read-path) reads the JSON config via jq; the validator's line-57 comment is updated to reflect jq as an accepted repo dependency.
- The combined config (areas + tags + tag→area map, per Q6) is one JSON file; filename/placement still deferred to Planning/Execution.

## Related
- [[project-defined-vocab-config-as-data]] — the config-as-data design this formats
- [[tag-area-map-combined-config]] — the Q6 combined-config decision
