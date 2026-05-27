---
name: triplicate-backlog-remediated
description: "Decision: do not promote a third backlog entry for the dangling claude-skill link; two committed backlog files already track the same issue, preserving one-record-one-concept atomicity."
tags: [backlog, deduplication, atomicity, claude-skill]
date: 2026-05-26
session: b0a0eaf9-03f7-4dce-a040-c7443653a459
status: accepted
scope: feature
feature: project-memory
supersedes: null
superseded_by: null
type: general
domain: docs-sync
finding_ids: [F1, F4, F6]
---

# Do Not Promote Third Backlog — Triplicate Dangling-claude-skill-link Entries (F1/F4/F6 cluster)

## Context

During Preparation readiness scanning (iter 1), the draft described the dangling `[claude skill](skills/claude/SKILL.md)` link at `.claude/CLAUDE.md:60` as "1 new gap found this loop" and staged a third backlog record at `preparation/staging/backlogs/project/dangling-claude-doc-skill-link.md` (priority LOW, disposition deferred).

Dual-system evaluation (Claude: Project/Risk/Usage perspectives; Overall) confirmed that two committed backlog files already track this exact issue at HEAD `d2b5b37`:
- `.gobbi/projects/gobbi/backlogs/claude-doc-standard-skill-missing.md` (FLAG-2, priority HIGH, disposition open, created 2026-05-25)
- `.gobbi/projects/gobbi/backlogs/stub-redirect-dangling-claude-skill-ref.md` (FLAG-3, priority MEDIUM, disposition open)

Both confirmed present via `git cat-file -e HEAD:...` and counted inside the 208-doc P_live_all population. The staged third record was a semantic duplicate with a different slug and conflicting priority (LOW) that would have created three active records for one concept at Wrap-up — violating one-record-one-concept atomicity (rules.md §3).

The Claude evaluator also noted (F4/Risk) that this is a near-recurrence of the "did-not-check-existing-tracked-files" failure mode — the loop scanned the 208-doc population but did not check whether the gap was already recorded as a committed backlog.

## Decision

Do NOT promote the third staged backlog. The redundant file `preparation/staging/backlogs/project/dangling-claude-doc-skill-link.md` was DELETED during MEMORIZATION (session staging, pre-promotion — the never-delete rule does not apply to session scratch). The existing FLAG-2 (HIGH, open) and FLAG-3 (MEDIUM, open) backlog files are untouched and remain authoritative.

## Rationale

- Promoting a third record with conflicting priority (LOW vs existing HIGH/MEDIUM) would defeat backlog triage and violate one-record-one-concept atomicity per rules.md §3.
- The existing FLAG-2 HIGH classification is the maintainer's original calibration and remains the standing priority.
- The Wrap-up literal-slug check alone is insufficient to prevent semantic duplicates — this decision captures the gap explicitly so Wrap-up knows not to promote.
- This is also a mistake-candidate for the project: the Preparation loop scanned the population count (208) but did not cross-check whether the surfaced gap was already present as a committed backlog entry. See note below.

## Alternatives considered

1. **Supersede FLAG-2/FLAG-3 into one canonical record** — not pursued; that is a separate dedicated cleanup, not in scope for this retrofit session.
2. **Update the draft to cross-link FLAG-2/FLAG-3** — partial; the decision record here serves that purpose without mutating the rawdata draft post-evaluation.

## Consequences

- Wrap-up MUST NOT promote `dangling-claude-doc-skill-link.md` (it no longer exists in staging).
- Wrap-up reads this decision record to confirm the item was already tracked.
- FLAG-2/FLAG-3 remain the live records; no priority reconciliation performed in this session.
- A mistake-candidate for "population-scan-without-committed-backlog-cross-check" may be warranted at Wrap-up.

## Related

- `preparation/evaluation/iter1/claude/project.md` — F1 finding
- `preparation/evaluation/iter1/claude/risk.md` — F4 finding
- `preparation/evaluation/iter1/claude/usage.md` — F6 finding
- `preparation/evaluation/iter1/claude/overall.md` — cross-perspective confirmation
- `.gobbi/projects/gobbi/backlogs/claude-doc-standard-skill-missing.md` (FLAG-2, HIGH/open)
- `.gobbi/projects/gobbi/backlogs/stub-redirect-dangling-claude-skill-ref.md` (FLAG-3, MEDIUM/open)
