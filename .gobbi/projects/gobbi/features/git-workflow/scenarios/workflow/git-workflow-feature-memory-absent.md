---
name: git-workflow-feature-memory-absent
description: Scenario — Preparation must bootstrap features/git-workflow/ before Planning depends on feature-scoped memory
type: scenarios
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [process, preparation]
keywords: [feature-memory, readiness]
author: claude
---

# Scenario — Confirm or bootstrap features/git-workflow/ before Planning uses feature-scoped memory

## Scenario description

The Scope Contract names `feature: git-workflow`. When Preparation begins, `features/git-workflow/`
does NOT yet exist — only `features/workflow/` is present (verified). Planning must not assume
feature-scoped memory (mistakes / decisions / scenarios / checklists) already exists for this
feature.

## Why it matters

Codex evaluator finding P1 (scenario_gap, process, Medium/75): the artifact named a feature whose
memory directory is absent but did not surface this as a readiness scenario. If Planning assumes
feature-scoped memory exists and reads `features/git-workflow/` for prior decisions, it reads
nothing and silently skips the context check.

## Acceptance conditions

- [ ] Preparation confirms `features/git-workflow/` does NOT exist at Preparation start.
- [ ] Preparation bootstraps or confirms the directory before Planning reads from it.
- [ ] If the directory is absent, Planning must NOT assume feature-scoped memory exists; it starts
  from zero for this feature.
- [ ] The feature dir `features/git-workflow/` is named in `gobbi/SKILL.md:209` as a value-feature;
  its slug is correct even if the dir is absent.

## Related

- R5 remediation in `working/draft-iter2.md`
- `working/draft-iter2.md § Deferred` — feature-memory readiness note
- `skills/gobbi/SKILL.md:209` — `git-workflow` listed as a value-feature
