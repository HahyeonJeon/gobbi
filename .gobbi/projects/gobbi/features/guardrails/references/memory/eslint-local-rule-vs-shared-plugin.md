---
name: eslint-local-rule-vs-shared-plugin
description: ESLint distinguishes a co-located project-local rule from a published shared plugin — the line is enforceable universal policy vs local guidance
type: references
scope: feature
feature: guardrails
status: active
created: 2026-06-27
session: 659a1b3f-0b70-419a-848b-a02db5dbbded
tags: [memory, design]
keywords: [eslint, local-rules, shared-plugin, graduation, enforceable-policy, project-local]
author: claude
title: ESLint local rule vs shared plugin — the graduation line
source: https://eslint.org/docs/latest/extend/custom-rule-tutorial
accessed: 2026-06-27
ref_type: docs
---

# ESLint local rule vs shared plugin — the graduation line

## Insight
ESLint separates a co-located project-local rule (lives in the repo, project-specific guidance) from a published shared plugin (reusable, enforceable policy). A rule "becomes worth implementing" as a shared, enforced thing only when it is genuine cross-project policy, otherwise it stays local.

## Reason
Frames the graduation test (Q4): a mistake graduates to a `principles`/`coding` RULE — an always-on enforceable law — only when it is a universal proactive imperative; otherwise it stays a co-located, contextual MISTAKE. "Generalizes across projects" alone is not the rule bar.

## Source
- https://eslint.org/docs/latest/extend/custom-rule-tutorial
- https://www.npmjs.com/package/eslint-plugin-local-rules

## Excerpt
Custom rules become worth implementing when you need project-specific policy, nontrivial context, safe autofix or suggestions, or TypeScript-aware semantic checks.

## Usage history

| Date | Session | Used for |
|---|---|---|
| 2026-06-27 | 659a1b3f-0b70-419a-848b-a02db5dbbded | Ideation insight E5 — anchors the mistake-vs-rule graduation test (Q4) |

## Related

- [[adr-storage-hybrid]] — local-vs-central is the same decision in a different surface
