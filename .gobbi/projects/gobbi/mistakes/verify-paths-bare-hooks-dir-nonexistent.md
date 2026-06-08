---
name: verify-paths-bare-hooks-dir-nonexistent
description: Planning verify commands used bare `hooks/...` paths that do not exist at the worktree root — verify paths must be repo-root-runnable (canonical `.gobbi/.../` path) or state their cwd
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-08
session: c7673705-2d69-4be8-9bd4-436c3eb91be2
tags: [process, hooks, verification, planning, paths]
priority: high
domain: process
supersedes: null
superseded_by: null
---

# Planning verify commands must use repo-root-runnable paths for hook/script files

## What happened

Planning iter1 for the session-memory redesign wrote verify commands in tasks 02, 04, and 05
using bare paths:

- `bash -n hooks/post-tool-use-agents.sh`
- `bash -n hooks/session-end.sh`
- `jq -e '.hooks.SessionEnd' hooks/hooks.json`

From the worktree root (or the repo root) **none of these paths exist**. The real files live at
`.gobbi/projects/gobbi/hooks/...`, with `.claude/hooks/` as the symlinked mirror — there is no
bare top-level `hooks/` directory. An executor running the verify as written gets
"No such file or directory" — a false failure that has nothing to do with the code under test.
Codex USAGE-001 confirmed this empirically; Claude flagged it as STR-2/USAGE-1.

## User feedback

Surfaced by the dual-system Planning evaluation. Promoted because it is a recurring
planning trap: verify commands authored from a conceptual "hooks directory" mental model
rather than from the verified file tree.

## Why it happens

Planning authors write verify commands from memory of where files "conceptually" live (a
"hooks directory") rather than from the actual file map. The worktree is not the main repo
root, and neither root has a bare `hooks/` directory — hooks live at
`.gobbi/projects/gobbi/hooks/` with `.claude/hooks/` symlinking to them. The plan's own file
map already uses the canonical paths; the verify commands drifted from the file map.

## Correct approach

Every verify command that touches a hook or script must use the canonical repo-root-relative
path, OR the plan must state the assumed cwd. Before writing the verify:

1. Confirm the file exists at the claimed path: `test -f .gobbi/projects/gobbi/hooks/post-tool-use-agents.sh`.
2. Use the full canonical path in the verify: `bash -n .gobbi/projects/gobbi/hooks/post-tool-use-agents.sh`.
3. State the assumed cwd at the top of the plan's Scope Reference section, e.g.
   "All verifies run from repo root `/playinganalytics/git/gobbi`."
4. Keep verify paths consistent with the plan's own file map — they must match.

## How to detect

Before finalizing a planning doc, scan every `verifies` field for bare directory paths
(`hooks/`, `skills/`, `features/`) NOT prefixed with `.gobbi/projects/...` or `.claude/`.
Each bare path is a candidate false failure. Cross-check each against the file map in the
same plan; a path that is not in the file map is suspect.

## Related

- [[weak-verify-gate-nonzero-passes-wrong-source]] — sibling planning-verify trap (gate strength)
- [[planning-leader-asserted-file-type-without-verifying]] — asserting file facts without checking the tree
- [[false-missing-file-grep-scoped-to-wrong-dir]] — wrong-scope path failures
