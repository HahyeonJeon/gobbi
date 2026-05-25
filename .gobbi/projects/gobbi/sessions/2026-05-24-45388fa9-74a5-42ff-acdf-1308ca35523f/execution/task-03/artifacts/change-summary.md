---
loop: execution
iter: 1
artifact_type: change-summary
created_at: 2026-05-25
status: final
supersedes: []
related:
  - execution/task-03/rawdata/draft-iter1.md
  - execution/task-03/evaluation/iter1/claude/overall.md
  - execution/task-03/evaluation/iter1/codex/overall.md
---

# T03 (CL-3) Change Summary — iter1 PASS

## What shipped

Commit `0632ad8` (`docs(mistake): add hooks domain tag, M2 {session-id} row, drop gobbi-mistake-promote CLI (T03, CL-3)`)

Two files changed: `.gobbi/projects/gobbi/skills/mistake/SKILL.md` (canonical target of the `.claude/skills/mistake/SKILL.md` symlink) and `.gobbi/projects/gobbi/backlogs/hooks-domain-mistakes-watchlist.md`. +22 lines / -18 lines.

## The 5 contracted edits

### Edit A — `hooks` domain tag added
Added `hooks` to the domain-tag examples at two sites in `mistake/SKILL.md`:
- P1 step 3 (line 63): filter by domain relevance examples
- P3 step 5 (line 90): `domain:` frontmatter tag examples

Verification: `grep -nE '\bhooks\b' .claude/skills/mistake/SKILL.md` = lines 63 + 90.

### Edit B — `{session-id}` Path-conventions row rewritten to locked M2 wording
All three M2 clauses present on line 129:
1. "Claude Code session ID supplied by the delegation prompt's `session-id:` header field"
2. "Do NOT read `$CLAUDE_CODE_SESSION_ID` for this value"
3. "in a spawned-subagent context that env-var holds the subagent's own UUID, not the parent session's"

### Edit C — 5 `gobbi mistake promote` CLI references removed
All 5 occurrences (description frontmatter line 3, intro line 11, Promotion note line 27, P3 lines 84-90 procedure heading, P4 lines 94-96 heading+body) rewritten to describe Wrap-up-phase agent promotion. No CLI mechanism remains.

Verification: `grep -c 'gobbi mistake promote' .claude/skills/mistake/SKILL.md` = 0.

### Edit D — "agents never write to project memory" claim qualified at every site
Every absolute "never write directly to project memory" / "MUST NOT write directly to `mistakes/`" claim qualified with the Wrap-up-assistant sole-writer exception. Sites reconciled: description (line 3), intro (line 11), Memory Access Matrix intro (line 17) + rows 21-22, Core Principle (line 47), Constraints (line 105).

### Edit E — hooks backlog updated
`hooks-domain-mistakes-watchlist.md` flipped from `status: deferred` to `status: in-progress`; added perpetual-capture clarifier; added N≥2 extraction-trigger (normalized from old "N=2").

## Scope compliance
`git diff --name-only 0632ad8~1 0632ad8` = exactly the 2 contracted files. All OOS files (CLAUDE.md, gobbi/SKILL.md, wrap-up/SKILL.md, orchestration/SKILL.md, session.json) untouched.

## Witness
Backlog `gobbi-mistake-promote-command-does-not-exist` (user correction 2026-05-25) + idea.md DL-5 (M2 locked wording) + plan-addendum-2026-05-25 (T03 expansion from CL-3).
