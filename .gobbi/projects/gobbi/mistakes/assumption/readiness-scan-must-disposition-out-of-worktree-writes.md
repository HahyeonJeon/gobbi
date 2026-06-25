---
name: readiness-scan-must-disposition-out-of-worktree-writes
description: Readiness scans must give an explicit external-write disposition for every in-scope task that writes outside the worktree
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [process]
keywords: [readiness, preparation, external-write, worktree-sandbox, disposition]
author: claude
priority: high
domain: process
supersedes: null
superseded_by: null
related: []
---

# Readiness Scans Must Disposition Every Out-of-Worktree Write

## What happened

Preparation for the `feature: memory` migration campaign issued a "0 blocking gaps" readiness claim at iter1. The campaign's 8-task plan included Task 7b — trimming the home `MEMORY.md` at `~/.claude/projects/.../MEMORY.md`. That file is outside the worktree and outside the PR. The readiness scan covered only repo-local signals and did not give Task 7b an owner, access confirmation, or reversibility statement. Codex (running in a `--cd <worktree>` sandbox) tested the home file as not-writable and flagged an assumption_risk High finding (PREP-COD-OVERALL-1). The iter1 "0 blocking gaps" claim was factually wrong as a statement about the whole campaign.

## Why it happens

A readiness assessment scoped only to repo-local / worktree signals misses in-scope writes to surfaces outside the worktree — home directories, external services — which have their own owner, access constraints, and reversibility requirements. The "0 blocking gaps" label applies only to the scanned surface, not to the full campaign, but the label was written as if it applied to the whole campaign.

A second compounding issue: a worktree-sandboxed evaluator (Codex with `--cd <worktree>`) tested the home file as not-writable. That is a false negative — the file is writable to the actual process owner. The Codex `writable: no` signal reflects the sandbox scope, not the real write surface. Evaluators and producers must not conflate a sandbox's `test -w` result with the actual writer's access.

## Correct approach

Every in-scope task that writes outside the worktree gets an explicit **external-write disposition** in the Preparation readiness output. The disposition must state:
- **Owner:** which agent or role performs the write (manager vs sandboxed executor).
- **Write path:** the concrete path; confirmed writable by testing against the ACTUAL writer's access context, not a sandboxed proxy's.
- **Reversibility:** how to undo the write if needed.

Scope the "0 blocking gaps" claim to the in-worktree set + the dispositioned external writes. The summary tally line must name the out-of-band write surface explicitly: "0 blocking gaps for the in-worktree campaign; 1 out-of-band write surface (Task 7b, owner-attributed)."

When a sandboxed evaluator reports a write path as not-writable, confirm the access from the actual writer's context before treating it as a blocker. A `--cd <worktree>` sandbox that cannot reach a home file does not mean the home file is unwritable to the process that owns it.

## How to detect

The situation has two signals:
1. The scope contract includes a task that writes outside the worktree or PR.
2. The readiness summary's "0 blocking gaps" or "workspace ready" claim does not name that task's write-surface owner, write-path confirmation, and reversibility.

When both are true, the readiness claim is incomplete regardless of the repo-local scan quality.

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — sibling mistake: both are gap-in-scope traps where a "0 X" claim is applied to the whole campaign without matching the scanned surface.
