---
name: verify-state-from-authoritative-source-not-proxy
description: Any claim about a codebase artifact's state (git position, anchor, file type, line content) must be verified by the authoritative command or upstream-corrected value — not inferred from a proxy
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-08
session: 422308da-f2c4-41a4-8ee3-adc89acde977
tags: [process, verification, citation-fidelity, git, anchor-fidelity]
priority: high
domain: process
layer: 2
layer2-source: .gobbi/projects/gobbi/mistakes/asserted-git-drift-direction-without-running-git.md + .gobbi/projects/gobbi/mistakes/carried-stale-anchor-despite-upstream-correction.md
layer2-rationale: Generalizable across all projects — any agent that asserts a fact about a codebase artifact (git position, line number, file type, anchor) from a proxy (system-reminder, prior artifact, assumption) instead of the authoritative source will propagate an incorrect claim downstream.
supersedes: null
superseded_by: null
---

# Verify state from the authoritative source, not a proxy

## Layer-2 note

This is a Layer-2 cross-project generalization of two project-level mistakes:
- `mistakes/asserted-git-drift-direction-without-running-git.md`
- `mistakes/carried-stale-anchor-despite-upstream-correction.md`

It lives in `skills/mistake/` so it persists and loads across all projects and future sessions.

---

## What happened

Two distinct instances of the same root failure:

**Instance 1 (git position).** A preparation leader stated a worktree was "clean / current" based on the harness system-reminder (which described the main-tree's git status). The true state was the worktree was 1 commit behind origin/develop. The claim was factually inverted because the leader inferred the worktree's position from a proxy (system-reminder) rather than running `git rev-list --left-right --count HEAD...origin/develop` inside the worktree.

**Instance 2 (line anchor).** A planning leader cited a stale line number (`SKILL.md:247`) in five places across a plan, even though the readiness report produced in the prior loop had explicitly corrected the anchor to line 266. The planning leader copied the stale reference from the Idea artifact (written before verification) instead of reading the upstream-corrected value from the readiness report.

## Why it happens

Agents infer facts about codebase artifacts from available context (system-reminder text, prior artifacts, session memory) rather than re-reading the authoritative source. The inference feels correct because the context is present and plausible. The authoritative source might say something different — and usually does when the world has changed (a new commit, a readiness-report correction, a rebase).

## Correct approach

**For any claim about a codebase artifact's current state, run the authoritative command or read the upstream-corrected value:**

| Claim type | Authoritative source |
|---|---|
| Worktree git position (ahead/behind origin/develop) | `git rev-list --left-right --count HEAD...origin/develop` run inside the worktree |
| File line number / anchor | Re-read the readiness report's verified anchors table (not the Idea's approximate citations) |
| File type (symlink vs real) | `ls -l <path>` or `test -L <path>` |
| Line content / section header | `grep -n "pattern" <file>` against the live file |
| File existence | `find . -name <filename>` from the repo root |

**Never substitute:** system-reminder text, session-memory inferences, prior-loop artifacts (Ideas, earlier drafts), or "I know this is true."

**Upstream corrections are authoritative over earlier artifacts.** When a readiness report, evaluation finding, or manager correction changes a reference, the corrected value supersedes ALL earlier-iteration artifacts that carried the stale reference. Downstream artifacts must use the corrected value.

## How to detect

- The agent states a fact about a codebase artifact without citing a live command output.
- The plan or brief carries a line number that the agent did not verify against the current readiness report.
- The agent says a worktree is "current" or "clean" without citing `git rev-list` output.
- Both evaluators independently flag the same stale value as wrong in iter 1 — this is a mechanical, not subtle, failure.

## Related

- `mistakes/asserted-git-drift-direction-without-running-git.md` — git-position instance
- `mistakes/carried-stale-anchor-despite-upstream-correction.md` — anchor-fidelity instance
- `layer2-planning-leader-asserted-file-type-without-verifying.md` — file-type instance (same family)
- `mistakes/leader-iter2-verification-claim-without-evidence.md` — the broader pattern: claiming verification without fresh evidence
