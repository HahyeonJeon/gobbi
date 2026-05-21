---
date: 2026-05-21
session: 6637e759-84d9-403d-87bd-0a484abec245
status: deferred
feature: repo-reset
supersedes: null
superseded_by: null
disposition: open
severity: Low
confidence: 100
finding_id: F-CL2-PREP-OV-01
---

# F-CL2-PREP-OV-01: "deletion already staged" wording is technically wrong

## Context

iter2 draft line at F-CX-PREP-O-02's empirical confirmation reads: "Both files are already-deleted-in-tree (deletion already staged; no new `rm` needed during the sweep)." Verification shows `git status --short` output: ` D .gobbi/projects/gobbi/project.json` and ` D .claude-plugin/marketplace.json` — position-2 `D` means worktree deletion, not index-staged deletion. The files are not staged; they are deleted in the working tree only. A `git add -u` or `git add -A` step is still required to stage them.

The operational guidance immediately following ("The sweep commit will include both deletions automatically via `git add -A` ...") is correct and is not affected by this wording inaccuracy.

## Decision

Document as open below-threshold finding. The wording is imprecise but does not change Planning's operational outcome — the next sentence already says `git add -A` is required.

## Consequences

If a future draft or Planning task description inherits this language, the wording should be corrected to "worktree-deleted (` D` status, not yet staged)" to avoid confusion. No immediate action required.

## Related

- `preparation/evaluation/iter2/claude/overall.md` § Hallucination findings
- `preparation/evaluation/iter2/claude/consistency.md` § Empirical claim — project.json status
- `preparation/evaluation/iter2/codex/overall.md` § Stage 2 Findings
