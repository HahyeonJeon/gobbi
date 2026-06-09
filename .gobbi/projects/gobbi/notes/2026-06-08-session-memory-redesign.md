---
name: session-memory-redesign
description: Designed, planned, and shipped the session-memory directory structure redesign — spec doc + scaffold script + 45-file doc sweep — in one session.
type: notes
scope: project
feature: null
status: active
created: 2026-06-08
session: 1abeb43f-6389-4abf-b098-b2b3e68d79b2
tags: [session-memory, workflow, doc-sweep, scaffold]
features_touched: [workflow]
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [features/workflow/design/session-memory-tree.md, features/workflow/decisions/2026-06-08-flat-granular-loop-interior.md, features/workflow/decisions/2026-06-08-single-root-transcripts.md, features/workflow/decisions/2026-06-08-number-prefixed-loop-dirs.md, features/workflow/decisions/2026-06-08-scaffold-script-mechanism.md, features/workflow/decisions/2026-06-08-session-tree-spec-doc.md, features/workflow/decisions/2026-06-08-interview-bootstrap-exception.md, features/workflow/decisions/2026-06-08-gap1-verify-session-tree-check.md, features/workflow/decisions/2026-06-08-script-hook-layer-verify-no-change.md, features/workflow/plans/2026-06-08-session-memory-redesign.md, mistakes/sweep-grep-literal-loop-name-blindspot.md]
---

# Session-memory directory redesign

## What happened

The session started from the user's goal: "deterministic session memory operation with intuitive and dev-vibe file and directory structure that users can debug session with the memories." Project memory had been wiped in commit #298, so this session built all feature memory from scratch.

**Ideation (2 iters):** The leader investigated three structure options (grouped parent, flat granular, unchanged quartet) and the transcript subsystem. Iter1 REVISE triggered on Codex finding COD-USAGE-1 (continued-agent transcript scoping ambiguity with per-loop transcript dirs). The user's three final-gate rounds locked: flat 4-slot loop interior (`working/ evaluation/ staging/ outputs/`), number-prefixed loop dirs (`1-ideation/` … `5-wrap-up/`), single session-root `transcripts/{role}-{agentId}.jsonl`, interview/ as a bootstrap exception, and a dedicated spec doc. Value-feature confirmed as `workflow`.

**Preparation (2 iters):** The leader produced a 49-file inventory (46 edits + 3 creates): 46 markdown files, 3 shell scripts. The widened grep confirmed all 7 script/hook files are VERIFY-NO-CHANGE. GAP-1 resolved via Option A (`verify-session-tree.sh --check`) instead of bats or prose-only. Iter1 REVISE on Codex finding COD2-CONSISTENCY-2 (session-end.sh comment line flagged as a false-positive changing-path reference; adjudicated and confirmed false positive in iter2).

**Planning (2 iters):** 10-task plan: 3 creates (spec doc, scaffold script, verify script) + D7 cadence correction + 5 doc-sweep clusters + integration gate. Iter1 REVISE on one prose issue: a fictional task-04↔task-06 overlap on `orchestration/workflow/memorization.md` (in fact `memorization.md` has zero commit-cadence content and belongs solely to task-06). Iter2 fixed the fiction and added R-1 (scratch-repo mandate for the D7 git check) and U-1 (sweep-brief inputs must include design + inventory for F-P2 nuance).

**Execution (3 iters):** 12 commits shipped: task-01 (spec doc), task-02 (scaffold script), task-03 (verify script), task-04 (D7 cadence correction), task-05 (memorization cluster), task-06 (orchestration core), task-07 (loop skills), task-08 (cross-cutting skills), task-09 (agents+delegation), task-10 (full sweep verification + evidence commit). Iter1 REVISE: Codex found ~12 surviving stale refs (literal sibling-loop names in cross-loop references — the variable-token grep had missed them). A `task-fix` remediation pass was added. Iter2 REVISE: Codex found brace-set and prose forms of the same stale vocabulary (`{rawdata,staging,evaluation,artifacts}/`, "rawdata draft", etc.) — a second remediation pass fixed these. The recurrence pattern (three forms surviving three form-specific grep passes) was staged as a mistake-candidate. Iter3 PASS with both systems.

## What shipped

12 commits on `develop` branch in worktree `claude-2026-06-08-1abeb43f`. Concrete artifacts in project memory:

- `features/workflow/` bootstrapped (first session for this feature).
- `features/workflow/design/session-memory-tree.md` — canonical design.
- 8 decision files under `features/workflow/decisions/`.
- 3 reference files under `features/workflow/references/`.
- 1 discussion file under `features/workflow/discussions/`.
- 1 plan file at `features/workflow/plans/2026-06-08-session-memory-redesign.md`.
- `backlogs/persist-session-memory-past-cleanup.md` (project-level deferred item).
- `mistakes/sweep-grep-literal-loop-name-blindspot.md` (Layer-1 mistake).
- `skills/mistake/layer2-sweep-grep-form-specific-blindspot.md` (Layer-2 promotion).

Skill docs changed: `orchestration/templates/session-tree.md` (created), `orchestration/scripts/scaffold-session-dir.sh` (created), `orchestration/scripts/verify-session-tree.sh` (created), and 46 edited markdown files across orchestration, memorization, loop skills, cross-cutting skills, agents, and delegation.

## What got stuck

Three deferred items that did not block the session:

- `[FLAG-1]` — project `skills/` classification as memory vs non-memory. Left unresolved; the scope boundary in `memorization/rules.md` §Scope boundary covers it implicitly for now.
- `[FLAG-2]` — authoring a `claude` doc-authoring skill. Out of scope; executors followed existing-file conventions instead.
- Post-cleanup session retention (backlog) — retaining `sessions/` content across worktree removal. Requires a new design for sensitivity handling of raw transcripts.

## What shifted

The verification approach shifted mid-Execution when the first form-specific grep missed the literal-sibling-loop-name form, and then a second form-specific grep missed the brace-set + prose form. Root cause of the recurrence: each pass verified with a grep shaped like the form it had just fixed. The corrected approach (vocabulary-based exhaustive grep + manual classification) was recorded as a mistake-candidate and is now a project + Layer-2 mistake.

D7 git-verb verified in a scratch repo (task-04): `git commit` on a gitignored-only worktree produces "nothing to commit, working tree clean" (no error, no commit). The cadence docs now state the gitignored/ephemeral reality accurately.

## Decisions to respect

1. Sessions tree shape is the new 4-slot interior (`working/ evaluation/ staging/ outputs/`) with number-prefixed loop dirs. All loop/orchestration docs point at `orchestration/templates/session-tree.md` for shape. Do not re-inline the tree.
2. Single session-root `transcripts/{role}-{agentId}.jsonl`. No per-loop transcript dirs.
3. `interview/` is a bootstrap exception — NOT a workflow loop, NOT swept.
4. `workflow.{loop}` JSON keys stay BARE (`ideation`, not `1-ideation`). Only the on-disk dir carries the prefix (SEAM-3).
5. `verify-session-tree.sh --check` is the manual gate for spec-to-script sync. Run it before claiming the spec is current.
6. Sweep verification must use vocabulary-based exhaustive grep + manual classification — not form-specific greps.

## Next session

The session-memory redesign is complete and shipped. Candidate follow-ups:

- Pick up `[FLAG-1]` (project skills-is-memory classification) as a separate scoped session.
- Pick up `[FLAG-2]` (claude doc-authoring skill) as a separate session.
- Pick up the `persist-session-memory-past-cleanup` backlog when the lifecycle and sensitivity design are ready.
- Run `verify-session-tree.sh --check` after the PR merges to confirm the spec-to-script sync holds in the post-merge state.
