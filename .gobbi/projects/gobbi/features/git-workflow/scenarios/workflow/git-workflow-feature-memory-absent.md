---
name: git-workflow-feature-memory-absent
description: Scenario — Planning readiness must classify absent features/git-workflow/ memory before decomposition depends on it
type: scenarios
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [process]
keywords: [feature-memory, readiness]
author: claude
---

# Scenario — Confirm or bootstrap features/git-workflow/ before Planning uses feature-scoped memory

## Scenario description

The locked scope names `feature: git-workflow`. When Planning DISCUSSION runs its readiness gate,
`features/git-workflow/` does not yet exist. Planning must not assume feature-scoped mistakes,
decisions, scenarios, or checklists are present, and it must not interpret an empty read as evidence
that the feature has no relevant context.

## Why it matters

This scenario originated from a supported evaluation finding: the plan named a feature whose memory
directory was absent but did not make that absence visible. A missing directory produces no read
output, so an unrecorded empty-state branch silently skips required context checks.

## Acceptance conditions

- [ ] Planning confirms whether `features/git-workflow/` exists before decomposition consumes feature memory.
- [ ] If absent, the readiness evidence records `NO_FEATURE_MEMORY`; empty command output is not treated as proof of no context.
- [ ] A project-owned foundation gap becomes the first ordered Execution task. A missing workspace or domain dependency returns `NEEDS_CONTEXT`.
- [ ] Planning does not create durable memory directly. Any justified candidate is typed, staged through RECORD, and promoted only during Wrap-up.
- [ ] The feature identity remains `git-workflow` in `session.json` version 5. Routing stays in `state.json` version 3 and is not inferred from the feature directory.

## Related

- Historical source: the originating session's second Ideation iteration readiness remediation.
- Current owner: `skills/planning/SKILL.md` for readiness and decomposition.
- Current memory owner: `skills/memory/SKILL.md` for typed candidates and durable promotion.
