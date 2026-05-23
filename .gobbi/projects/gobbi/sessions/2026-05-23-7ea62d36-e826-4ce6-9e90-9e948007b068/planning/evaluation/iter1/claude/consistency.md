---
loop: planning
iter: 1
system: claude
perspective: consistency
---

# Consistency Perspective — Planning Iter 1

## Locked Frame (Stage 1)

### Scenarios with attached checklists

**S1 — Every `inputs:` field name-matches an upstream task `outputs:`**
- C1.1 Inter-task handoff field names identical, not paraphrased
- C1.2 No silent renames

**S2 — Every `traces-to:` references a real Ideation checklist item verbatim**
- C2.1 Each trace cites checklist item number + checklist item text
- C2.2 No dangling traces

**S3 — Task field schema uniform across tasks**
- C3.1 All tasks have `id`, `what`, `traces-to`, `requires`, `files`, `inputs`, `outputs`, `verifies`
- C3.2 Field casing + punctuation consistent

**S4 — Tooling commitments consistent across tasks**
- C4.1 Verify tools: grep/awk/sed/jq/test/git — used uniformly
- C4.2 Path conventions (repo-relative for skills, absolute for sessions) — see F-CONS-01

**S5 — No task contradicts a sibling task's assumption**
- C5.1 Task orderings preserve invariants (gobbi/SKILL.md edited by Task 01 before Task 06; memorization edited by Task 02 before Task 05)
- C5.2 Conflict flags section at 376-380 documents both overlaps

**S6 (adversarial) — Forward dependencies (later task influences earlier)**
- C6.1 No "we'll add X in task N" hidden assumptions

**S7 (Coverage Matrix: Risk + Consistency — licensing/IP)**
- C7.1 → `not-applicable: docs-only Bundle A, no license-impacting changes`

**S8 (Iron Law 7 carry-forward)**
- C8.1 Iron Law 7 brief discipline encoded as P8 in Decisions Log (line 584)
- C8.2 Required mistakes field per task includes `manager-iter2-brief-failed-iron-law-7` for tasks with verbatim-spec dependency (Tasks 02-06)
- C8.3 Task 04 + Task 06 explicitly flagged "EXTREME-DISCIPLINE BRIEF REQUIRED" / "highest-risk task for vocabulary-from-memory regression"
- C8.4 Task 06 brief sketch (lines 461-467) enumerates 6 brief requirements including verbatim inlining of 8 H2 sections + Read-required-before-write directives

## Per-scenario per-check results

| Check | Verdict | Evidence |
|---|---|---|
| C1.1 | yes | Inter-task handoffs reference upstream task IDs explicitly (e.g., Task 06 `requires: [01-gobbi-polish-fg]` rebases on Task 01's gobbi/SKILL.md changes) |
| C1.2 | yes | No silent renames detected |
| C2.1 | yes | Each `traces-to:` cites checklist item number + paraphrase (e.g., "idea.md checklist 4 — Edit memorization/SKILL.md: add Core Principle 'Moment-of-capture'...") |
| C2.2 | yes | Verified by reading `idea.md:245-261` — checklists 1-15 all present; each trace anchors to a real item |
| C3.1 | partial | Tasks 01-06 use the full field set. Task 07 has `files: - {path: "...{slug}.md", op: create-if-needed}` — different `op:` value than other tasks (modify/verify-only). See F-CONS-01 |
| C3.2 | yes | YAML keys consistent |
| C4.1 | yes | Tools uniform across verifies |
| C4.2 | partial | See F-CONS-02 (mixed absolute/relative paths) |
| C5.1 | yes | Sequencing enforced |
| C5.2 | yes | Conflict flags section explicit |
| C6.1 | yes | No forward dependencies |
| C7.1 | yes | Marked n/a |
| C8.1 | yes | P8 in Decisions Log: "Every executor brief MUST `Read` the Ideation source verbatim before authoring; verbatim text inlined in the brief, not from memory." |
| C8.2 | yes | Tasks 02-06 cite manager-iter2-brief mistake; Task 01 + Task 07 don't (defensible: Task 01 has no verbatim-spec dependency on Ideation prose; Task 07 is verification-only). See F-CONS-03 for nuance on Task 01 |
| C8.3 | yes | Task 04 + Task 06 explicitly flagged |
| C8.4 | yes | Task 06 brief sketch enumerates: (1) Inline 8 H2 section names verbatim; (2) Cite idea.md:269-274 + idea.md:245-261 as Read-required-before-write; (3) Re-state 5 Types vocabulary; (4) Include verifies as mandatory pre-PR self-check; (5) `_claude` writing standard citation; (6) Drop spurious `_claude/SKILL.md` reference per Concern 5 |

## Typed findings

### F-CONS-01 — Task 07 `files:` field uses `op: create-if-needed` not seen elsewhere

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** `draft-iter1.md:338` — `files: - {path: "sessions/2026-05-23-.../planning/staging/decisions/{slug}.md", op: create-if-needed}`. Other tasks use `op: modify` or `op: verify-only`. The `create-if-needed` semantic is novel and not defined anywhere in the Plan.
- **Why it matters:** Field-schema vocabulary divergence; uniform ops set helps mechanical tooling.
- **Suggested direction:** add a one-line definition in the File map section, OR rename to `op: create` with the conditional behavior moved into prose ("only if findings exist").

### F-CONS-02 — Mixed absolute vs repo-relative path style across tasks

- **Type:** `general`
- **Domain:** `docs-sync`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** Task 06 uses `.gobbi/projects/gobbi/skills/codex/SKILL.md` (repo-relative). Task 01-05 use `.agents/skills/...` (repo-relative). Task 05 uses `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/...` (repo-relative). Per the codex-eval-session-write-path mistake, session paths SHOULD be absolute (`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...`). The Plan is internally consistent (all repo-relative) but inconsistent with the mistake's prescribed discipline.
- **Why it matters:** Worktree-CWD safety. The mistake exists exactly because relative paths construct worktree-nested writes.
- **Suggested direction:** convert all `sessions/.../` paths to absolute. Skill-target paths (`.agents/skills/...`) can stay repo-relative since both worktree and main-tree have identical relative structure.

### F-CONS-03 — Task 01 Required mistakes omits `manager-iter2-brief-failed-iron-law-7`

- **Type:** `checklist_gap`
- **Domain:** `process`
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Task 01 Required mistakes (lines 417-418) cite codex-eval-session-write-path + manager-rm-rf-without-investigating-tracked-files. The `manager-iter2-brief-failed-iron-law-7` mistake is NOT cited. Task 01 still has a verbatim-spec requirement: "rewrite from 2 questions to 1 question (mode, default auto)" — the executor must NOT carry over the legacy mode question wording. While Task 01 is a polish + small surface, the same Iron Law 7 discipline applies (do not type from memory; Read the locked Idea Design G + check `settings.default.json` defaults).
- **Why it matters:** Defense-in-depth on Iron Law 7. Even small tasks have specs that can drift from memory.
- **Suggested direction:** add `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck` to Task 01's Required mistakes — the cost is one line of brief; the benefit is consistent vigilance.

### F-CONS-04 — Task 06 verifies row count check for `.agents/skills/`

- **Type:** `general`
- **Domain:** `test`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** `draft-iter1.md:324` — `test "$(ls .agents/skills/ | wc -l)" = '17'  # post-ship symlink count`. The current count is ALREADY 17 (verified via `ls .agents/skills/ | wc -l` → 17), because the codex directory symlink was promoted by Preparation EXIT. The Plan's "Symlink targets" note at line 132 acknowledges this ("symlinks created at Preparation EXIT"). The `= '17'` verify is comparing against a count that's already true before Task 06 runs — it's a no-op check.
- **Why it matters:** The verify gate gives no signal about whether Task 06 actually completed correctly. It only checks the symlink wasn't dropped (negative event), not that content was filled.
- **Suggested direction:** keep the symlink-count check as defense (catches accidental deletion); but add a content check: `grep -c "^[A-Za-z]" .gobbi/projects/gobbi/skills/codex/SKILL.md | awk '$1 >= 150 {exit 0} {exit 1}'` (≥150 non-blank lines) or similar substantive-content gate.

## Verdict

**PASS** — 4 Low findings, all open. Iron Law 7 carry-forward discipline mostly solid (one omission on Task 01).
