---
name: git-workflow-feature-memory-absent
description: Scenario — absent feature memory does not create a Planning gate or a false context claim
type: scenarios
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [process]
keywords: [feature-memory, planning-inputs]
author: claude
---

# Scenario — Do not turn absent feature memory into a Planning gate

## Scenario description

The locked scope names `feature: git-workflow`, but `features/git-workflow/` does not yet exist. Planning
starts decomposition from the supplied Ideation contract. It does not scan feature memory as an entry
condition, create an absence status, or treat empty command output as evidence that no relevant context
exists.

## Why it matters

This scenario originated from a supported evaluation finding about an absent feature-memory directory.
The former correction turned the absence into a Planning readiness result. Planning no longer owns that
assessment. The supplied contract and the Memory owner determine which durable context is available.

## Acceptance conditions

- [ ] Planning does not inspect `features/git-workflow/` as an entry or exit condition.
- [ ] Planning emits no absence status or evidence record for missing feature memory.
- [ ] The plan does not cite empty command output as proof that the feature has no context.
- [ ] Planning does not create durable memory directly. Any justified candidate is typed, staged through RECORD, and promoted only during Wrap-up.
- [ ] The feature identity remains `git-workflow` in `session.json` version 5. Routing stays in `state.json` version 3 and is not inferred from the feature directory.

## Related

- Historical source: the originating session's second Ideation iteration remediation.
- Current owner: `skills/planning/SKILL.md` for decomposition.
- Current memory owner: `skills/memory/SKILL.md` for typed candidates and durable promotion.
