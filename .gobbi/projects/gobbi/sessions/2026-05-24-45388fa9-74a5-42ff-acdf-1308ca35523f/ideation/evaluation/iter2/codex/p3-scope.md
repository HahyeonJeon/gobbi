---
perspective: scope
evaluator: codex
model: gpt-5.4
iter: 2
captured-at: 2026-05-24T15:20:33Z
verbatim: true
---

## Perspective 3: Scope

**Findings:**

**ID**: P3-F1
**Severity**: High
**Confidence**: 95
**Summary**: Backlog Deltas add write expectations for CL-2 and CL-4 backlog files that are not authorized in the Per-Deliverable Scope-Bound Table.
**Evidence**: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md:123, CL-2 may-touch: only staging skill and promoted skill; /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md:125, CL-4 may-touch: only design doc; /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md:297-299, Backlog Deltas: `gobbi-hook-authoring-skill.md` and `session-lifecycle-worktree-boundaries-design-doc.md` flip status.
**Recommendation**: Add those two backlog files to CL-2 and CL-4 `files-may-touch`, or remove the status flips from Bundle C and defer them to Wrap-up.

**ID**: P3-F2
**Severity**: Medium
**Confidence**: 87
**Summary**: The Backlog Deltas note uses an overbroad "agents never directly write to backlogs" rule that conflicts with this bundle's executor-scoped backlog edits.
**Evidence**: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md:56, CL-1 action: "edit ... f-struct-01"; /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md:126, CL-5 may-touch includes `f-risk-01`; /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-24-45388fa9-74a5-42ff-acdf-1308ca35523f/ideation/rawdata/draft-iter2.md:302, Note: "agents never directly write to ... backlogs".
**Recommendation**: State the actual rule: authorized backlog edits may be committed inside the worktree branch; project-memory promotion rules for mistakes do not by themselves ban backlog file edits.
