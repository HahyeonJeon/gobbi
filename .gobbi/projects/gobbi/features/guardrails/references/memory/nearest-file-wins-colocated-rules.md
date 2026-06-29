---
name: nearest-file-wins-colocated-rules
description: Cursor / AGENTS.md co-locate guidance — a root file is the global default, nested files are specific, the closest applies
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [memory, design]
keywords: [agents-md, cursor-rules, nearest-file-wins, root-default, nested-scope, co-located]
author: claude
title: Nearest-file-wins — root default plus co-located specific guidance
source: https://cursor.com/docs/rules
accessed: 2026-06-27
ref_type: docs
---

# Nearest-file-wins — root default plus co-located specific guidance

## Insight
Cursor / AGENTS.md place a guidance file at the root for global defaults and additional files in subdirectories for specific scope; the closest file to the work applies, with more specific instructions taking precedence.

## Reason
Validates the two-tier mistakes shape: cross-cutting traps in the central project `mistakes/` tier act as the always-on global default; skill-specific traps in `skills/{skill}/mistakes.md` are the closer, more-specific layer that loads with the skill. Widely adopted, no schema knowledge required.

## Source
- https://cursor.com/docs/rules
- https://codersera.com/blog/agents-md-vs-claude-md-vs-cursor-rules-comparison-2026/

## Excerpt
AGENTS.md follows a nearest-file-wins model — place one at the root for global defaults, then drop additional AGENTS.md files in subdirectories; when the agent edits a file it walks up the tree and uses the closest one.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-27 | 659a1b3f-0b70-419a-848b-a02db5dbbded | Ideation insight E4 — anchors the global-default + specific-layer split (Q2) |

## Related

- [[adr-storage-hybrid]] — the same central-plus-local hybrid in ADR practice
