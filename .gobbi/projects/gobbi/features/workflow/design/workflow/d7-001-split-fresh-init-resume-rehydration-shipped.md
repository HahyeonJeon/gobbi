---
name: d7-001-split-fresh-init-resume-rehydration-shipped
description: Configuration's fresh-init vs resume-rehydration split, as shipped after the iter2 resume-signal correction
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-03
session: bf4dc336-65bd-4a52-9055-d79fc82b7e2e
tags: [design, process]
keywords: [GEN-D7-001, resume-detection, fresh-init, row-4, row-4R, continue-target]
author: claude
supersedes: d7-001-split-fresh-init-resume-rehydration
superseded_by: null
related: [resume-detection-must-read-only-pre-branch-persisted-facts, resume-continue-target-must-include-ideation]
---
# Configuration and resume identity contract

## Problem

Fresh initialization and resume must not conflate Gobbi session identity, runtime context identity, settings, or workflow routing.

## Scope

This record covers fresh Configuration, current-worktree resume discovery, context-boundary runtime attachment, and the version 5 manifest/version 3 router split.

## Approach

A fresh session performs read-only preflight, displays defaults once, and asks whether to use or customize them. After that decision, Gobbi generates its own UUID before creating the session branch and worktree.

Resolved settings live only in `session.json.settings`. The manifest carries the stable Gobbi UUID plus `runtime.system` and an ordered, unique `runtime.ids` list. A clear, resume, rewind, compaction, or other context boundary appends a newly observed runtime ID without changing the Gobbi UUID.

Resume searches only the current worktree and continues automatically only when it contains exactly one unfinished Gobbi session. Zero or multiple candidates require an explicit session path or a new-session decision. There is no global active-session pointer and no automatic scan of other worktrees.

`state.json` version 3 is the only active router. It records step, stage, iteration, task, verdict, completions, and active dispatches. It does not carry settings, mode, telemetry, transcript data, or manifest identity.

## Validation

Fresh and resumed fixtures verify UUID timing, defaults gating, exactly-one discovery, ordered runtime-ID attachment, manifest write boundaries, every state cursor, and failure without mutation for ambiguous or invalid state.

## Trade-offs

Local discovery deliberately requires an explicit choice when identity is ambiguous. That small pause prevents one runtime context from silently taking ownership of another session.
