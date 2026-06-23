---
name: dehardcode-area-tag-vocab
description: Memory area+tag vocabulary de-hardcoded into a project-owned JSON config the validator reads via jq
type: changelogs
scope: feature
feature: memory
status: active
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [process, design]
keywords: [areas, tags, config-as-data, jq, harness-generality, validator]
author: claude
shipped_in: "commits 4557c78c, ed435550, 9c171908 (branch claude-2026-06-23-d0185dba…)"
---

# De-hardcode the memory area + tag vocabulary into a project-owned config

## What shipped
The memory AREA and TAG vocabularies (previously hardcoded as `AREA_SPINE`/`AREA_MISTAKES`/`TAG_VOCAB` in `validate-frontmatter.sh` + literal lists in `rules.md`) are now declared in a project-owned `.gobbi/projects/{name}/memory-vocabulary.json`, which the bash validator reads via `jq`. `rules.md`/`wrap-up/SKILL.md`/the #307 design doc were repointed at the config. A ratified universal base (`_shared` + `docs`/`tooling`/`tests`; mistakes trap-class `assumption`) was added. gobbi declares its own areas+tags preserving current on-disk subdirs. A complete 114-file migration manifest was produced (the bulk move is a deferred backlog).

## Why
gobbi is a general ClaudeX harness; hardcoding one project's subsystem vocabulary made the harness non-reusable (a non-gobbi project's areas/tags failed validation). Now the vocabulary is project-defined; the harness enforces it generically.

## Verification
gobbi behavior preserved: validator output byte-identical (685 violations / 133 files before and after). Config drives the gate (foreign-config golden: a non-gobbi `auth` record validates under its own config; gobbi values fail under it — no hardcoded fallback). Dual-system Execution eval PASS (Claude + genuine Codex).
