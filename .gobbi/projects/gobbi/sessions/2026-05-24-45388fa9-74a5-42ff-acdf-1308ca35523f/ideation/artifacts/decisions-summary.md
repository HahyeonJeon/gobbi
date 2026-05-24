---
artifact_type: decisions-summary
phase: ideation
session-id: 45388fa9-74a5-42ff-acdf-1308ca35523f
feature: session-foundations-bundle-c
created-at: 2026-05-24
---

# Ideation Decisions Summary — session-foundations-bundle-c

7 user-locked decisions (DL-1 through DL-7) shape Bundle C. All locked via manager-run AskUserQuestion.

## Locked decisions

| DL | Question | Locked answer | Notes |
|---|---|---|---|
| DL-1 | Theme β timing | **β-1: Ship Theme β this session; self-count as N=2** | User diverged from leader's β-2 recommendation; accepted shallow-lessons trade-off |
| DL-2 | Feature name | **`session-foundations-bundle-c`** | Matches leader recommendation |
| DL-3 | f-struct-01 disposition | **Close inline in Bundle C PR** | Empirical resolution at `session-start.sh:73-77` (commit `159eb21`) |
| DL-4 | f-risk-01 disposition | **Absorb into Bundle C** | User diverged from leader's defer recommendation (USER CHALLENGE confirmed) |
| DL-5 | f-risk-01 mitigation | **M2 — Codify delegation-prompt passing across 11 skills** | M1 + M3 explicitly NOT chosen |
| DL-6 | Iter3 scope expansion | **Add CL-6 = orchestration row 5/5.5/6 path-resolution fix** | Surfaced by today's session-dir-placement bug |
| DL-7 | CL-6 row-order option | **Option B — promote row 5.5 before row 5** | User accepted leader recommendation; A/C considered and rejected |

## Bundle C deliverables (6 CLs)

| CL | Deliverable | Approx size |
|---|---|---|
| CL-1 | Close `f-struct-01-jq-sh-env-passthrough.md` backlog inline | 3 lines |
| CL-2 | Stage + promote `gobbi-hook-authoring` project skill (M2-compliant from day 1) | ~150-200 LOC |
| CL-3 | `mistake/SKILL.md` hooks domain-tag + watchlist backlog status (sole owner of `mistake/SKILL.md` per D-7) | small skill edit + frontmatter |
| CL-4 | Author `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md` (Theme β, shallow-lessons-by-design per DL-1) | ~200-300 LOC |
| CL-5 | f-risk-01 M2 docs sweep across **11 skills** (not 12 — `mistake/SKILL.md` moved to CL-3) + backlog disposition update | ~180 LOC (11 × ~15 lines) |
| CL-6 | `orchestration/SKILL.md` Step 1 rows 5/5.5/6 path-resolution fix per DL-7 = Option B + inline-cite qualified absolute-root rule + LOCK #5 footnote rewording | ~40-80 LOC |

Total estimated PR diff: ~800-1000 LOC (CL-6 = 40-80 LOC per DL-7 = Option B).
Total estimated task units after Preparation decomposes: ~14-17.

## Mistake-candidate staged

`<sessionDir>/ideation/staging/decisions/session-dir-placed-outside-worktree.md` (manager's session-dir-placement bug; severity: medium; will promote via Wrap-up → `.gobbi/projects/gobbi/mistakes/` and via `gobbi mistake promote` to workspace-level post-session).

## Ideation iteration audit

| Iter | Outcome | Notes |
|---|---|---|
| iter1 | DONE_WITH_CONCERNS | Leader found 5-item cluster doesn't fully cohere; surfaced 4 user-questions |
| iter2 | DONE (drafted), then EVAL → REVISE | 5 deliverables locked via DL-1..DL-5; eval found 4 High structural issues |
| iter3 | DONE_WITH_CONCERNS (drafted), then EVAL → REVISE | All 4 iter2 High addressed; DL-7 lock missed back-propagation to 6 controlling sections (manager-introduced) |
| iter4 | REVISE | Cap raised 3→4; iter4 evaluators verified 5 of 6 controlling sections closed; SC-8.2 dead-branch + 6 audit-trail sections still stale |
| iter5 | PASS-effective | Cap raised 4→5; Claude PASS / Codex REVISE on 5 non-controlling residuals; user picked exit-on-Claude-PASS + patch the 5 residuals; all patched post-eval |

## Risks and deferred items

- **DL-1 trade-off**: `session-lifecycle-worktree-boundaries.md` lessons section will be shallow-by-design — pre-recorded as Bundle C policy; not a defect.
- **R-2 coordination**: CL-3 + CL-5 both touched `mistake/SKILL.md` in early iters; D-7 resolved by routing `mistake/SKILL.md` solely to CL-3 (CL-5 is now an 11-file sweep, not 12).
- **R-8 (resolved by DL-7)**: CL-6 option choice irreversibility — Option B locked.
- **R-9 (narrowed by DL-7)**: "row 5.5" cross-doc anchor drift — bounded to `orchestration/SKILL.md` (in CL-6 may-touch); bundle-B design doc filenames are locked historical memorials.
- **Deferred**: M1/M3 alternatives for f-risk-01 (NOT chosen); hooks-domain skill-extraction trigger (N≥2 not yet met); Bundle B HANDOFF staleness (Wrap-up note); iter1 evaluation-files audit-trail gap (session-process note).

## Ideation handoff

The canonical Idea is at `<sessionDir>/ideation/artifacts/idea.md`. Preparation Loop consumes this directly. The Decisions Locked section (DL-1..DL-7) + the Per-Deliverable Scope-Bound Table are the authoritative inputs for Preparation's readiness check.
