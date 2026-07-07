---
name: git-gate-blind-to-gitignored-writes
description: A git-based confinement gate cannot see writes inside a gitignored path; diff --stat also misses untracked files.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-07
session: 122609f7-3c4c-44ea-af90-efe1531a5cbf-p3
tags: [verification, git]
keywords: [gitignore, git-status-porcelain, git-diff-stat, confinement-gate, untracked-files, source-read-only-gate]
author: claude
priority: high
domain: verification
related: [gitignore-aware-residual-gate]
---

# Git-based confinement gates cannot see writes inside a gitignored path

## What happened

While designing the Codex proposer source-read-only gate (C-HIGH-4, `workflow/production.md`), the first draft used `git status --porcelain` OR `git diff --stat` to verify "changes confined to `working/proposals/codex/`." Two dual-system evaluation rounds caught the same defect from different angles: (a) the session tree is gitignored (`.gitignore` excludes `.gobbi/projects/*/sessions/`), so `git status` cannot see any write inside it — the claimed "confined to `working/proposals/codex/`" state can never appear, because git never reports paths under a gitignored tree at all, pass or fail; (b) `git diff --stat` also misses untracked new files entirely, so it is not a safe substitute for `git status --porcelain` even on the tracked surface.

## Why it happens

The gate was designed to prove a confinement property ("only the proposals directory changed") by reading git's output, without first checking what git can actually observe given `.gitignore` plus tracked-vs-untracked semantics. `git status --porcelain` reports only the tracked-plus-untracked paths that git's index and working-tree comparison can see; a path matched by `.gitignore` never surfaces there, in either direction. Treating "git shows nothing under the session tree" as "confined to the session tree" inverts the actual guarantee — it means "git cannot look there," not "git looked and found nothing there." Separately, `git diff --stat` only reports changes to files git already tracks, so a newly created untracked file passes it silently — a different blind spot from the gitignore one, but often reached for as if it were interchangeable with `status --porcelain`.

## Correct approach

Point a git-based gate only at the surface git can actually observe: the tracked, non-ignored tree. Phrase and verify a "no stray writes outside the intended target" gate as "no tracked/skill/source file changed" via `git status --porcelain` — which does include newly created untracked files, as long as they are not gitignored. Never phrase the gate as "confined to `<subpath>`" when `<subpath>` is itself gitignored; an empty (or source-clean) `status --porcelain` there is the expected pass, not proof that writes stayed inside that subpath. Never substitute `git diff --stat` for `git status --porcelain` — `diff --stat` misses untracked new files, so a stray new file would pass the gate silently. If a genuine filesystem-level confinement check is needed (e.g., proving nothing outside `working/proposals/codex/` changed even inside the gitignored session tree), use a filesystem check instead of git — for example `find <session-tree> -newer <pre-run-marker> -not -path '*/proposals/codex/*'` — and document it as a distinct, non-git-based check with its own limitations.

## How to detect

A gate description that claims a git-based check will show "changes confined to `<gitignored-subpath>`" — check whether that subpath (or an ancestor of it) is listed in `.gitignore`; if so, the claimed positive-confinement observation can never occur. Also flag any gate that offers `git diff --stat` as interchangeable with `git status --porcelain` — the two diverge on untracked files, and a gate built on the wrong one fails open.

## Related

- [[gitignore-aware-residual-gate]] — companion trap, same root cause from the opposite direction: a residual-reference grep gate over a worktree session must use `git grep`, because plain `grep` recurses into gitignored session content that a git-aware tool would correctly exclude
