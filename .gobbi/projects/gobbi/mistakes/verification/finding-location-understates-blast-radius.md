---
name: finding-location-understates-blast-radius
description: A validated finding's Location names where the defect was found, not every surface carrying the same defect wording — grep the exact phrase across all doc surfaces and mirror trees before scoping the fix.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-06
session: fe6cbcd3-5e63-46fb-a62e-93308b687d1f
tags: [verification, docs-sync]
keywords: [blast-radius, finding-scope, mirror-sync, grep-enumeration]
author: claude
priority: medium
domain: docs-sync
supersedes: null
superseded_by: null
---

# A finding's Location understates the defect's true blast radius

## What happened
GEN-D4-003 named its Location as three delegation templates
(`skills/delegation/templates/{leader,executor,assistant}.md`). While ideating the fix,
a grep of the exact offending phrase ("You are the Claude producer") across the whole
tree showed the SAME defect wording also lives in three ROLE agent docs
(`agents/{leader,executor,assistant}.md`) — the native-Codex role contract — plus
physical mirror copies under `.agents/` and `plugins/gobbi/`. Scoping the fix to the
finding's three named files alone would have left native-Codex leaders/executors/
assistants still mislabeled via their role contract — an incomplete root-cause fix.

## Why it happens
A finding's `Location` field records the ONE site the reviewer inspected, not the full
set of surfaces that share the defect. In gobbi the same behavioral text is duplicated
across delegation templates, role docs, and three physical mirror trees (`.claude`
symlinks to canonical; `.agents` + `plugins/gobbi` are physical copies). Treating the
finding's file list as the complete blast radius silently under-scopes the fix and
leaves the defect live on unlisted surfaces.

## Correct approach
Before scoping any fix from a validated finding, grep the EXACT offending phrase across
ALL doc surfaces and ALL physical mirror trees, and enumerate every hit as the real
blast radius. Distinguish canonical from symlink from physical copy (inode / `readlink` /
`ls -la`), so co-touch covers the physical copies a `.claude`-only edit would miss.
Surface the wider scope to the user as a scope-contract decision rather than silently
expanding OR silently under-fixing.

## How to detect
The task is "fix finding X in files A/B/C", the defect is a repeated WORDING (not a
one-off logic bug), and the repo mirrors the same text across templates + role docs +
`.agents`/`plugins` trees. Red flag: accepting the finding's file list without a
tree-wide grep of the literal phrase.

## Related

- [[consumer-spec-cites-process-not-sites]] — sibling enumeration trap (cite sites, not process)
- [[verify-mirror-and-cross-tree-paths-from-live-tree]] — the mirror-tree verification discipline this depends on
- [[mirror-topology-needs-inode-not-md5]] — the paired mirror-fix trap (inode, not md5, decides co-touch)
