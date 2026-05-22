---
date: 2026-05-22
session: 6637e759-84d9-403d-87bd-0a484abec245
status: accepted
feature: null
supersedes: null
superseded_by: null
---

# Land project.json Deletion as Separate Post-merge Commit (F-CX-PREP-O-02)

## Context

The executor brief for Task 02 (`02-cleanup-sweep`) instructed deletion of v0.5 code, plugins, root manifests, and project memory subdirs. The brief listed the Stage B deletions explicitly but did not include `.gobbi/projects/gobbi/project.json` (a v0.4-era per-project metadata file). Codex Preparation iter1 surfaced this omission as finding F-CX-PREP-O-02 (Medium/75, confidence 75%).

After PR #264 merged (squash `e083fad`), `project.json` was still present in develop. The manager had two options: open a second PR (overhead for a 1-file deletion with no review concern) or commit directly to develop as a post-merge fixup.

## Decision

Commit `project.json` deletion directly to develop as a follow-up commit (`42db8be`), not via a new PR. This is the F-CX-PREP-O-02 fixup.

## Rationale

- The file has no code references post-reset (superseded by v0.5 session-scoped `settings.json` + `session.json` + `state.json`).
- The deletion is unambiguous — no review concern, no design question, no test impact.
- A second PR for a 1-file deletion adds process overhead disproportionate to the change.
- The commit carries an explicit AI-Provenance-Record referencing the post-merge cleanup scope so the audit trail is clear.

## Alternatives considered

- **Second PR**: rejected — disproportionate overhead for a trivial 1-file deletion.
- **Leave it**: rejected — project.json is dead code post-reset; leaving it in place would be misleading to future readers and the rebuild phase.

## Consequences

- Develop tip after fixup: `42db8be`.
- Future executor briefs for cleanup tasks must include an explicit inventory of all files to delete, including metadata files like `project.json`, not just directory trees.

## Related

- Commit `42db8be` — the fixup
- Codex Preparation iter1 finding F-CX-PREP-O-02
- `artifacts/manager-bookkeeping-log.md` §12
