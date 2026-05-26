---
scenario: worktree-first-bootstrap
scope: feature
feature: git-workflow
last_updated: 2026-05-23
finding-id: iter1-P4
type: checklist_gap
domain: process
disposition: addressed
confidence: 100
severity: Medium
---

# Worktree-first bootstrap — post-merge migration smoke test checklist

| # | Item | Anchor | Status | Verification |
|---|---|---|---|---|
| 1 | After PR merge, run `jq '.git.branch' .gobbi/projects/gobbi/sessions/<latest>/session.json` on the first new session | T1-I-T1.h | pending | value matches `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` |
| 2 | After PR merge, run `jq '.git.worktreePath' .gobbi/projects/gobbi/sessions/<latest>/session.json` on the first new session | T1-I-T1.h | pending | value is non-null |
| 3 | On next `generate-now` Preparation, verify PR diff contains skill body AND both symlinks on the worktree branch | T1-I-T1.d + T1-E-1 | pending | git diff shows `+` for both `.claude/skills/{slug}/` and `.agents/skills/{slug}/` |

## Item details

### 1. Branch regex check

**Anchor reasoning**: iter1 P4 finding identified the absence of a migration smoke test gate. T1-I-T1.h added the smoke test regex `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` as a Wrap-up gate row.

**Verification approach**: `jq '.git.branch' session.json | grep -E '^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$'` on the first session after the T1 PR merge.

### 2. worktreePath non-null

**Anchor reasoning**: T1's first success criterion: "After T1 lands, `session.json.git.worktreePath` is non-null immediately after Configuration."

### 3. generate-now PR diff

**Anchor reasoning**: the `1829fa3` witness commit was the motivating failure — symlinks created in main-tree missed the PR diff. This check is the structural regression test.
