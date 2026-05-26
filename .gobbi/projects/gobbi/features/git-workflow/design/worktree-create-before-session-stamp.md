---
date: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
scope: feature
feature: git-workflow
design-id: D-1
slug: worktree-create-before-session-stamp
status: locked
iter: 3
---

# D-1 — Configuration Step 1 row 5.5: create worktree + stamp git.worktreePath

> **Superseded note (2026-05-25, bundle-C T02 / commit 2b537ae):** worktree creation was reordered from row 5.5 to **row 5** (state.json init is now row 5.5). This memorial records the original bundle-B numbering; see `orchestration/SKILL.md` Step 1 for the current rows.

## Decision

Insert new row 5.5 ("Create worktree (P2 wrapper) and stamp `git.worktreePath`") between current row 5 (state.json init) and current row 6 (session.json stamp) in `orchestration/SKILL.md` Step 1 Workflow Configuration table.

**Branch name at creation**: `chore/session-{date}-{ssid-short}` (e.g., `chore/session-2026-05-23-1b26cf20`)
- Type `chore` is in the `git/conventions.md:22` registry (`feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style`)
- Description slug `session-{date}-{ssid-short}` matches the registry regex `[a-z0-9]+(-[a-z0-9]+)*`
- Length: `session-2026-05-23-1b26cf20` = 27 chars (3-50 char limit at `git/conventions.md:64` — PASS)

**Idempotency guard**: skip if `session.json.git.worktreePath` non-null on resume, `/clear`, or `/compact`.

## Rationale

Row 6 needs `git.branch` + `git.worktreePath` non-null; worktree creation must precede row 6. Inserting as row 5.5 (rather than promoting to row 5) preserves existing semantic where `state.json` is initialized first. The `chore` type uses the existing registry; no new type needed.

## Anchored insights

T1-I-2, T1-E-1, T1-DQ-2; iter1 COD-PROJ-001; `git/conventions.md:22` (regex), `:64` (length), `:263` (label color); whole-file scan iter3.

## Trade-offs considered

- `feat/session-{date}-{ssid-short}` — rejected: `feat` implies a new product feature
- `session/{date}-{ssid-short}` (iter2) — rejected: `session/` not in type registry (COD-PROJ-001 regression)
- Promote to row 5 — rejected: changes more than necessary

## Validation

Future-session smoke test: `jq '.git.branch' session.json` matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$`; `jq '.git.worktreePath'` returns non-null.

## Implementation checklist anchor

T1-I-T1.a, T1-I-T1.h (smoke-test gate)

## Source

`rawdata/draft-iter3.md:308-313` (D-1 narrative)
