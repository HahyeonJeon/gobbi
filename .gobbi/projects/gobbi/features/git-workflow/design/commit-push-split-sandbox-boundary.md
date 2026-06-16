---
name: commit-push-split-sandbox-boundary
description: DD-5 — Tie the manager/subagent commit-vs-push split to each runtime's sandbox boundary; assert commit-on-both and OS-enforced .git/hooks/config write-denial
type: design
scope: feature
feature: git-workflow
status: active
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [git, sandbox-boundary, commit, push, manager-subagent-split]
supersedes: null
superseded_by: null
related: []
---

# DD-5 — Tie the manager/subagent split to each runtime's sandbox boundary

## Problem

The existing manager/subagent split (subagent commits; manager pushes) is a gobbi convention stated
in isolation. On both runtimes it also maps onto a SANDBOX BOUNDARY — commit is in-boundary, push
is out-of-boundary — but the skill never states this alignment. The `.git/config`/`.git/hooks`
write prohibition (`SKILL.md:30`) is framed as a gobbi rule, not as an OS-enforced reality.

## Scope

In-scope: reground the existing split + the `.git` write prohibition in each runtime's actual
sandbox behavior. Out-of-scope: changing the split (it's correct as-is).

## Approach

- Assert: commit-in-worktree works on BOTH runtimes (CC: linked-worktree `.git` write allowance;
  Codex: workspace-write in-boundary).
- Assert: push is out-of-boundary on BOTH runtimes (CC: network gate; Codex: approval escalation).
- Reframe the skill's "never modify `.git/config`" rule (`SKILL.md:30`) as an OS-enforced reality
  (CC sandbox denies `hooks/`+`config` writes), not only a gobbi rule.
- Anchor to EXT-CC-1 and EXT-CODEX-3.

## Scenarios

Resolves C10 (commit-in-worktree + write-denial), C14 (split tied to sandbox boundary).
Anchors S05/S06/S07/S25.

## Validation

Skill states the boundary alignment. The `.git` write-denial note cites EXT-CC-1
(`cc-sandbox-worktree-git` reference). A reader can verify the claim is grounded in OS behavior,
not just convention.

## Trade-offs

None material — this is a reframing and grounding of existing correct behavior, not a design change.
