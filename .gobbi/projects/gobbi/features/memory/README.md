---
name: README
description: The gobbi memory subsystem — naming, frontmatter, structure, area-namespace schema, validator, and templates that govern every memory file.
type: features
scope: feature
feature: memory
status: active
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, schema, validation]
keywords: [area-namespace, frontmatter, rules, templates, validator]
author: claude
value_proposition: A stable, scannable, refactorable memory store every session reads and writes without grep guesswork.
subsystems: [skills/memory, skills/memory/templates, skills/memory/scripts/validate-frontmatter.sh]
---

# Memory subsystem

## Overview

The memory subsystem is gobbi's cross-session durable store under `.gobbi/projects/{project-name}/`. It defines how every memory file is named, what frontmatter it carries, where it lives, and how it is validated. Its canonical docs are `skills/memory/rules.md` (the standard), `skills/memory/memory-map.md` (the path inventory), the 17 type templates under `skills/memory/templates/`, and the `validate-frontmatter.sh` conformance gate.

## Status

The area-namespace schema shipped 2026-06-21 (9 commits on top of develop@7ef21bf5): the `{type}/{area}/{slug}.md` convention, per-type area allowlists, the TOTAL deterministic area-selection rule, the validator's required-area + off-allowlist-area checks, the Wrap-up routing area-resolution, the active-mistake-move carve-out, and the consumer read-glob recursion. File MIGRATION of the existing flat stacks is DEFERRED — tracked by the `memory-namespace-migration` backlog. Until the migration runs, the validator is red on the pre-existing flat files (expected debt).

## Subdirectories

- `design/` — feature-scope design topics (the area-namespace schema)
- `decisions/` — feature-scope decisions (the `area:` keep-or-strip question)
- `references/` — external prior-art references (DDD, git branches, Johnny.Decimal, PARA, tags-vs-folders)

## Recent activity

| Date | Session | What |
|---|---|---|
| 2026-06-21 | c3ac1c53-6741-49cf-8856-cdb3fcd6bec0 | Area-namespace schema designed + shipped; migration deferred |

## Open items

- [[memory-namespace-migration]] — move flat files into area namespaces + repoint references
- [[memory-renamespace-helper]] — atomic move + reference-repoint tool
- [[legacy-frontmatter-migration-mistakes-domain]] — two mistakes missing required `domain:`

## Related

- [[memory-namespace-schema]] — the schema design shipped this session
