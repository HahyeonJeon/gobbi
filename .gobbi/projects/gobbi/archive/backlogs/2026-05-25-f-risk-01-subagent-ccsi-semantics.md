---
archived_at: 2026-05-25
archived_session: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
archive_reason: shipped
original_path: backlogs/f-risk-01-subagent-ccsi-semantics.md
shipped_in: PR #270 (merged 925f641 on develop)
superseded_by: null
related: []
---

# Archive entry — f-risk-01-subagent-ccsi-semantics

## Original
Path: `backlogs/f-risk-01-subagent-ccsi-semantics.md`
Original creation date: `2026-05-22`

## Reason
The backlog tracked the risk that skill docs described `$CLAUDE_CODE_SESSION_ID` as the session-id source, which would produce wrong paths when followed literally by Task-spawned subagents. Bundle C's T06 resolved this with Mitigation M2: a tree-wide documentation sweep across 10 skill files codifying that agents must read `{session-id}` from the delegation prompt's `session-id:` field, NOT from `$CLAUDE_CODE_SESSION_ID`. M1 (session.json read) and M3 (separate subagent sessions) were explicitly rejected and locked at DL-5. The M2 wording is now locked verbatim in DL-4 and DL-5 of the session `2026-05-24-45388fa9` idea.md.

## Cross-references
- Commit `a8968f8` — M2 sweep across 10 skill files (T06)
- PR #270 (merged `925f641` on develop)
- DL-4, DL-5 in session `2026-05-24-45388fa9` idea.md (M2 wording locked)
