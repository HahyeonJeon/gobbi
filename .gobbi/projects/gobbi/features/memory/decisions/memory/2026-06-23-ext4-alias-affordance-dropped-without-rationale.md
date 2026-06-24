---
name: ext4-alias-affordance-dropped-without-rationale
description: I-EXT-4 cites alias affordance as relevant but Design/Checklist carry no alias mechanism; rationale for dropping not stated.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, ideation]
keywords: [I-EXT-4, alias, rename-safety, github-label-sync]
author: claude
supersedes: null
superseded_by: null
---

# I-EXT-4 alias affordance dropped without rationale (F-C2)

## Context

I-EXT-4 (GitHub label-sync config-as-data) is cited in Research Insights as relevant to "rename-safe aliases." The Design and Implementation Checklist contain no alias mechanism, and no rationale for dropping it is stated. A Planner reading the insights-vs-design gap might wonder if a rename-alias feature was intentionally deferred.

## Decision

Accept as a low-priority consistency gap. The implicit rationale — not stated in the draft — is that the deferred 114-file migration uses slug-identity-preserving `git mv` + in-commit ref-repoints (B-6), which makes an alias layer unnecessary. Executor should add a one-line note in the design or manifest acknowledging this.

## Rationale

Low severity (Consistency/Low per evaluation, Confidence 50). The omission is cosmetic; the migration plan does not need aliases because `git mv` preserves slug identity and all refs are repointed in-commit. The alias mechanism is a valid future extension if live-redirect is needed.

## Alternatives considered

- Add an alias mechanism now: out-of-scope (deferred to Execution); not needed given the `git mv` + repoint approach.
- Remove I-EXT-4 from Research Insights: would lose the prior-art citation for a future reader who wants aliases.

## Consequences

Executor notes in the design/manifest that aliases are not needed for this migration because `git mv` + ref-repoints are used. I-EXT-4 remains in Research Insights as prior-art for a future alias extension.

## Related

- [[project-defined-vocab-config-as-data]] — the config design
- [[tag-area-map-combined-config]] — the combined config
