---
archived_at: 2026-05-25
archived_session: 2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f
archive_reason: shipped
original_path: backlogs/stale-packages-cli-architecture-refs.md
shipped_in: PR #270 (merged 925f641 on develop)
superseded_by: null
related: []
---

# Archive entry — stale-packages-cli-architecture-refs

## Original
Path: `backlogs/stale-packages-cli-architecture-refs.md`
Original creation date: `2026-05-25`

## Reason
Surfaced by the Codex evaluator during T07 iter2 as finding OVERALL-001 (High/90): three `packages/cli` architecture citations and a "CLI init" label survived the v0.5.0 markdown-driven redesign after `packages/cli/` was wiped (commit `e083fad`). Follow-up FU-2 in PR #270 fixed all three: `gobbi/SKILL.md:74`'s sanitization note was corrected after investigation confirmed no automated seam replaced the v0.4.x validator (note now states no automated seam exists; untrusted slot values must be sanitized at the point of interpolation); `gobbi/SKILL.md:129`'s Workflow Overview table relabeled "CLI init" to "session init" and "workflow init" to "workflow configuration"; and `delegation/templates/assistant.md:14`'s dead `packages/cli/src/` example path replaced with a live `.gobbi/projects/gobbi/skills/` reference.

## Cross-references
- Commit `a0ac5e0` — FU-2 gobbi/SKILL.md + delegation template corrections
- PR #270 (merged `925f641` on develop)
- Codex evaluator finding OVERALL-001 (T07 iter2 confirmation)
