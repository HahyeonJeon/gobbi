---
name: path-conventions-anchor-casing
description: "Promote the Path conventions bold paragraph in memorization/SKILL.md to H3 for a stable cross-link anchor"
type: decisions
scope: feature
feature: project-memory
status: active
created: 2026-05-23
session: 7ea62d36-e826-4ce6-9e90-9e948007b068
tags: [docs, memorization, anchor, cross-link]
title: "Memorization Path conventions → H3 promotion for stable cross-link anchor"
domain: docs-sync
supersedes: null
superseded_by: null
decision_status: accepted
project: gobbi
---

# Promote the memorization "Path conventions" heading to H3 for a stable cross-link anchor

## Context

The `Path conventions` heading in the memorization skill was a bold paragraph (`**Path conventions**`), not a real heading. A bold paragraph produces no GitHub-style heading anchor, so other docs could not link to it with a `#path-conventions` fragment. The memorization skill needed a stable anchor at this point for cross-document linking.

## Decision

Promote `**Path conventions**` to a `### Path conventions` H3 heading in the memorization skill. This is a small cosmetic change with no semantic impact that yields a stable `#path-conventions` anchor for cross-links.

## Rationale

Only the memorization site needed the stable anchor in this session, so only it was promoted. Two other sites use the same bold-paragraph convention (the mistake skill and the planning skill), but normalizing all three is a separate cross-skill cleanup, not required here.

## Alternatives considered

- Promote all three bold-paragraph sites at once — deferred to a follow-up backlog rather than done now, to keep the change scoped to the site that needed the anchor.
- Leave the bold paragraph and link by line number — rejected: line-number links are unstable and break on any edit above the heading.

## Consequences

- The memorization skill now exposes a stable `#path-conventions` anchor.
- The cross-skill normalization of the other two sites is tracked as a follow-up backlog.

## Related

- [`skills/memorization/SKILL.md`](../../../skills/memorization/SKILL.md) — the skill whose `Path conventions` heading was promoted to H3
- [`backlogs/normalize-path-conventions-h3`](../../../backlogs/normalize-path-conventions-h3.md) — the follow-up tracking the cross-skill normalization (mistake + planning skills)
