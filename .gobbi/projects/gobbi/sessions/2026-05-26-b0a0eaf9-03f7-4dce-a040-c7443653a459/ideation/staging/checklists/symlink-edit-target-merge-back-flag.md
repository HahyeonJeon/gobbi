---
name: symlink-edit-target-merge-back-flag
description: Checklist ensuring the canonical symlink edit target and #272 merge-back are correctly handled.
type: checklists
scope: feature
feature: project-memory
status: active
created: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
tags: [symlink, merge-back, rules-md, execution-note]
scenario: symlink-edit-target-merge-back-flag
finding-iter: 1
finding-id: codex-f5-claude-o2-r1
disposition: addressed
addressed-in: iter2
---

# Symlink edit target + #272 merge-back — implementation checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | Edit the CANONICAL file, not the symlink: `.gobbi/projects/gobbi/skills/memorization/rules.md` | edit-tool-refuses-symlink-paths | pending | `ls -la .claude/skills/memorization/rules.md` confirms it is a symlink; Edit/Write tool uses the canonical path |
| 2 | Verify `.claude/skills/memorization/rules.md` auto-reflects the edit via the symlink | skills-mirror-symlinks-not-copies | pending | After edit: `diff .gobbi/projects/gobbi/skills/memorization/rules.md .claude/skills/memorization/rules.md` returns no diff |
| 3 | Keep the `rules.md` edit additive (new section only) to minimize merge-conflict surface | merge-back-risk | pending | The new section is appended; no existing sections reordered or modified |
| 4 | Flag #272-merge-back reconciliation as a Planning/handoff item for develop | merge-back-risk | pending | Handoff artifact or Planning plan includes a note: "After #272 merges to develop, reconcile rules.md/AGENTS.md edits" |

## Item details

### 1. Edit the canonical file, not the symlink

**Anchor reasoning:** two active project mistakes document this exact pattern:
`mistakes/edit-tool-refuses-symlink-paths.md` + `mistakes/skills-mirror-symlinks-not-copies.md`.
The Edit tool refuses symlink paths. Using the `.claude/skills/...` path would fail at Execution.

**Verification approach:** before editing, run
`ls -la .gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.claude/skills/memorization/rules.md`
to confirm symlink destination; then edit `.gobbi/projects/gobbi/skills/memorization/rules.md`
(worktree-absolute path).

### 4. Merge-back note

P13 + 13-type taxonomy + the 7-capability re-home exist ONLY on branch
`chore/session-2026-05-25-a10c82d6` until PR #272 merges to develop. The develop main tree is
still at 12 principles. An additive edit minimizes conflicts; the reconciliation is a
Planning/handoff deliverable, not an Execution gate.
