---
archived_at: 2026-05-25
archived_session: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
archive_reason: shipped
original_path: backlogs/f-struct-01-jq-sh-env-passthrough.md
shipped_in: PR #270 (merged 925f641 on develop)
superseded_by: null
related: []
---

# Archive entry — f-struct-01-jq-sh-env-passthrough

## Original
Path: `backlogs/f-struct-01-jq-sh-env-passthrough.md`
Original creation date: `2026-05-22`

## Reason
The requested shell-safe passthrough quoting for env-var re-exports in `session-start.sh` was found to already be implemented in lines 73-77 of `.claude/hooks/session-start.sh` (commit `159eb21`, env-var-audit PR #265, merged 2026-05-22). This was discovered during Bundle C ideation (session 45388fa9). The backlog was closed as a doc catch-up (Iron Law 8) — the implementation was already correct; only the backlog record was missing. A doc catch-up commit (`18cd9c9`) was landed in PR #270 to formally close the loop.

## Cross-references
- Commit `159eb21` — original env-passthrough fix shipped in env-var-audit PR #265
- Commit `18cd9c9` — doc catch-up that formally closed this backlog in Bundle C
- PR #270 (merged `925f641` on develop)
