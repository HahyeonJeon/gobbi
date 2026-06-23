---
name: staged-mistake-candidate-not-in-draft
description: The staged mistake-candidate worktree-empty-dir-sweep-deletes-live-session-scaffold.md is not reconciled in the Decisions Log.
type: decisions
scope: feature
feature: memory
status: accepted
created: 2026-06-23
session: d0185dba-cd9b-45ad-93f6-7814c4f0ef4a
tags: [memory, ideation]
keywords: [mistake-candidate, worktree, live-session-scaffold, process-trace]
author: claude
supersedes: null
superseded_by: null
---

# Staged mistake-candidate not reconciled in draft (F-R2)

## Context

`staging/decisions/worktree-empty-dir-sweep-deletes-live-session-scaffold.md` (mistake-candidate, the live-session-scaffold-wipe near-miss) was staged during WORK but does not appear in draft-iter2.md's Decisions Log or Backlog promotion log. It describes the same underlying git-cleanup footgun as the `git-skill-find-empty-delete-too-broad` backlog — risk of double-promotion at Wrap-up.

## Decision

Accept as a low-priority process-trace gap. The staged mistake-candidate is already on disk and will be visible to Wrap-up. RECORD note: the two staged items describe the same footgun from different angles — `git-skill-find-empty-delete-too-broad` is the backlog (plan to fix the git skill); `worktree-empty-dir-sweep-deletes-live-session-scaffold.md` is the mistake-candidate (the session-specific near-miss pattern). They are NOT duplicates. Wrap-up should promote both: the backlog to `backlogs/project/`, the mistake-candidate to `mistakes/git/`.

## Rationale

Low severity (Risk/Low per evaluation). The staged file exists and will reach Wrap-up through the normal staging→promotion route. The draft doesn't need to reference every staged file explicitly.

## Alternatives considered

- Add a Backlog log entry in the draft: useful but low ROI at this point (iter2 already finalized).
- Merge the two staged items: they capture different things (backlog vs mistake-candidate); keep separate.

## Consequences

Wrap-up assistant: promote `worktree-empty-dir-sweep-deletes-live-session-scaffold.md` as a mistake to `mistakes/git/`; promote `git-skill-find-empty-delete-too-broad` as a backlog to `backlogs/project/git/`. Do not merge.

## Related

- [[git-skill-find-empty-delete-too-broad]] — the backlog staged alongside this mistake-candidate
