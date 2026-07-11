---
name: ssot-wording-borderline-lines
description: Codex eval flagged borderline class-B SSOT wording (kept conservatively), a near-duplicate, and a narrow anti-pattern in AGENTS.md and the codex skill — a follow-up to fully canonicalize the wording.
type: backlogs
scope: project
feature: null
status: open
created: 2026-07-08
session: 14fbc122-d84c-4a16-af52-3a6dc3b1894b
tags: [codex, docs-sync]
keywords: [ssot, class-b, agents-md, codex-skill]
author: claude
priority: medium
project-scope: true
shipped_in: null
supersedes: null
superseded_by: null
related: []
---

# Tighten SSOT Wording — Borderline Class-B Lines And A Near-Duplicate

## Context

Codex's dual-system evaluation of this session's `.gobbi` skill-load-path SSOT reconciliation
(finding F-MED-002) surfaced four wording spots that were kept AS-IS out of caution rather than fully
canonicalized: `.codex/AGENTS.md:5` and `codex/SKILL.md:11` carry borderline class-B lines (content that
reads close to a class-A load-path citation but was judged acceptable); `codex/SKILL.md:43` and
`codex/SKILL.md:246` are near-duplicate phrasing that could be merged; and `codex/SKILL.md:245`'s
anti-pattern example is narrower than the class of mistakes it should cover.

## Why deferred

The session's in-scope work was the SSOT decision itself (`.gobbi/projects/gobbi/skills/` as the single
skill-load path for both runtimes) plus the mechanical repoint of load-path citations. Fully rewording
every borderline / near-duplicate / narrow-example line was judged a separate wording-polish pass, not
required to ship the SSOT decision correctly, and was deferred rather than expanding this session's scope.

## When to pick up

No hard prerequisite — this can run any time after the SSOT decision has landed (this session's PR).
Best picked up alongside a `codex` skill wording review, since all four spots live in the same two files.

## Suggested approach

Re-read each of the four cited lines against the now-canonical SSOT wording and either (a) tighten the
borderline class-B line to unambiguous class-B phrasing, (b) merge the near-duplicate pair into one
statement with a cross-reference from the other location, or (c) broaden the anti-pattern example to
cover the class of mistakes it is meant to illustrate, not just the one instance found.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-07-08-14fbc122-d84c-4a16-af52-3a6dc3b1894b/`

## Related

(none)
