---
type: mistakes
skill: preparation
description: "Recorded traps for preparation — load before doing preparation work"
updated: 2026-06-27
---

# Preparation — Mistakes

> Load before any preparation work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Readiness Scan Must Disposition Out of Worktree Writes

`priority: high` · `domain: process` · `added: 2026-06-24` · `status: active` · `tags: [process]`

**What happened** — Preparation for the memory-migration campaign issued a "0 blocking gaps" readiness claim at iter1. The 8-task plan included a task that trimmed a home-directory `MEMORY.md` outside the worktree and outside the PR. The readiness scan covered only repo-local signals and gave that task no owner, access confirmation, or reversibility statement. Codex (running in a `--cd <worktree>` sandbox) tested the home file as not-writable and flagged an assumption_risk High finding. The "0 blocking gaps" claim was factually wrong as a statement about the whole campaign.
**Why it happens** — A readiness assessment scoped only to repo-local / worktree signals misses in-scope writes to surfaces outside the worktree — home directories, external services — which have their own owner, access constraints, and reversibility. A second issue compounds it: a worktree-sandboxed evaluator (Codex with `--cd <worktree>`) tested the home file as not-writable, a false negative — the file is writable to the actual process owner. The sandbox `test -w` result reflects the sandbox scope, not the real write surface.
**How to detect** — The scope contract includes a task that writes outside the worktree or PR, AND the readiness summary's "0 blocking gaps" / "workspace ready" claim does not name that task's write-surface owner, write-path confirmation, and reversibility. When both are true, the readiness claim is incomplete regardless of the repo-local scan quality.
**Correct approach** — Every in-scope task that writes outside the worktree gets an explicit external-write disposition stating: Owner (which agent or role performs the write), Write path (the concrete path, confirmed writable by testing against the ACTUAL writer's access, not a sandboxed proxy), and Reversibility (how to undo it). Scope the "0 blocking gaps" claim to the in-worktree set plus the dispositioned external writes, and name the out-of-band write surface explicitly in the tally. When a sandboxed evaluator reports a path as not-writable, confirm access from the actual writer's context before treating it as a blocker.
