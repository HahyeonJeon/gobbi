---
name: memory-namespace-migration
description: Migrate all existing flat memory files into the new area namespaces and repoint every reference-class occurrence.
type: backlogs
scope: project
feature: null
status: deferred
created: 2026-06-21
session: c3ac1c53-6741-49cf-8856-cdb3fcd6bec0
tags: [memory, refactor, rename-sweep, docs-sync]
keywords: [namespace-migration, file-move, ref-repoint, deferred-arc]
author: claude
priority: medium
project-scope: true
shipped_in: null
---

# Memory namespace migration — move flat files into area namespaces

## Context

The 2026-06-21 redesign (DP-1 Option A) locks the area-namespace SCHEMA + conventions + enforcement but defers the actual file migration. Once the schema ships, the existing flat stacks must move into `{type}/{area}/{slug}.md`: project-tier `mistakes/` (16), `backlogs/` (11), `notes/` (6), `reports/` (1), plus feature-tier flat stacks — notably `features/workflow/decisions/` (19), `features/workflow/discussions/` (8), `features/git-workflow/references/` (9), `features/git-workflow/design/` (7), `features/workflow/design/` (7). Every moved file's reference-class occurrences must be repointed.

**Blast-radius sizing (verified 2026-06-21).** The `mistakes/` path string alone occurs **139 times across 37 files** under `skills/` (`grep -rno 'mistakes/' skills/ | wc -l` = 139; `grep -rl` = 37 files). The earlier "37 path refs" figure was a FILE count mislabeled as occurrences (the `manager-mispec-grep-c` trap). The true repoint surface is occurrence-count, NOT file-count, and the `mistakes/` string is only one type — every namespaced type adds its own occurrence set. Size this migration by occurrences across all types, not files.

## Why deferred

DP-1 chose Option A (schema-first) to avoid moving 60+ files before the schema settled, and to keep this session's review uncompressed (the "one phase per session" preference). File-move + reference-repointing is gobbi's most error-prone operation (see the three cited rename mistakes), so it gets its own session with the schema already locked.

## When to pick up

Prerequisites: (1) the area-namespace schema + the refactor procedure + the validator namespace-check + the consumer read-glob conversion have shipped and merged; (2) the controlled area-allowlist + the TOTAL deterministic area-selection rule per type are final (they are — finalized 2026-06-21). Then this arc can run as its own Ideation→Execution session. Best paired with the `memory-renamespace-helper` tool if that ships first (it makes the move+repoint atomic).

## Suggested approach

Run the documented refactor procedure once per type: apply the TOTAL deterministic area-selection rule to classify each file into its area, `git mv` into `{type}/{area}/`, then repoint **all six reference classes** (path refs, prose, skill-name, inventory/list, wrapper-description, pipeline-label) PLUS the in-fence-example + cross-doc label classes, and run both guards (`check-markdown-links.sh` + `check-residual-vocab.sh`) to zero.

**Two distinct repoint facts (keep them separate):** (a) each moved file's OWN slug-identity links — body `[[slug]]` links and the frontmatter `supersedes`/`superseded_by`/`related` fields — are plain slugs (§2.4), rename-robust, so they survive untouched; BUT (b) **inbound `required-mistakes:` references are PATH refs** (`skills/mistake/SKILL.md:25,51` + `skills/memory/templates/archive.md:62`), NOT plain slugs, so every inbound `required-mistakes:` path pointing at a moved mistake MUST be repointed in the path-ref sweep. The migration MAY move active mistake files (the sanctioned namespace-refactor carve-out, USER-APPROVED 2026-06-21), precisely BECAUSE the procedure repoints those inbound `required-mistakes:` PATH refs so no citation is left dangling.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-21-c3ac1c53-6741-49cf-8856-cdb3fcd6bec0/`

## Related

- [[memory-renamespace-helper]] — the atomic move+repoint tool that de-risks this migration
- [[file-move-needs-link-resolution-check]] — the link-resolution check this migration must run
- [[plan-rename-must-enumerate-all-ref-classes]] — enumerate all six reference classes (+ inbound `required-mistakes:` path refs) before moving
