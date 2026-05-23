---
loop: planning
iter: 1
system: claude
perspective: structure
---

# Structure Perspective — Planning Iter 1

## Artifact Summary
(see project.md)

## Locked Frame (Stage 1)

### Scenarios with attached checklists

**S1 — Tasks are narrow enough for a fresh Executor**
- C1.1 No task touches > 8 files (gstack smell)
- C1.2 No task title violates imperative-form / short / specific
- C1.3 No task secretly bundles unrelated concerns

**S2 — Task dependencies form a DAG**
- C2.1 `requires:` field present per task
- C2.2 Topological sort over `requires:` produces documented order
- C2.3 No cycles

**S3 — Each task verifies is concrete**
- C3.1 Verifies are runnable commands (grep/awk/sed/jq/test/git)
- C3.2 Verifies produce binary pass/fail

**S4 — Files-touched per task bounded; conflicts flagged**
- C4.1 Each task enumerates `files:`
- C4.2 Conflicting tasks (same file across two tasks) are sequenced — not parallel
- C4.3 Conflict-flag section explicitly identifies the two known overlaps (gobbi + memorization)

**S5 — Agent type per task matches work nature**
- C5.1 Tasks 01-06 use `executor` (code/doc edits)
- C5.2 Task 07 uses `assistant` (verification-only) — justification cites delegation Agent Roster
- C5.3 No tasks assigned to mismatched agent type

**S6 — Effort sizing realistic**
- C6.1 Task 06 (codex content fill, ~350-450 lines, 8 H2 sections + Constraints body + anti-patterns × 8) is sized as the largest task
- C6.2 Task 04 (wrap-up Step 2.5, 4-category gap table + 5-Type classification + auto-backfill) is sized appropriately
- C6.3 Smaller tasks (01-03, 05) are correctly sized as multi-file but bounded

**S7 (adversarial) — Two tasks silently modify the same file**
- C7.1 File-touch overlap check (Conflict flags section at lines 376-380)
- C7.2 Sequential ordering enforced where overlap exists

**S8 (adversarial) — Effort estimate hidden**
- C8.1 No task verifies block is multi-step + files > 3 without sizing acknowledgement
- C8.2 Task 06 in particular: 19 verify lines + 2 files touched + 8 H2 sections — sized correctly as the biggest

## Per-scenario per-check results

| Check | Verdict | Evidence |
|---|---|---|
| C1.1 | yes | Max files per task is Task 03 at 4 files (delegation/SKILL.md + 3 templates); Task 06 at 2 files |
| C1.2 | yes | Task titles are imperative + specific (e.g., "Bundle D (wrap-up Step 2.5)") |
| C1.3 | yes | Each task scoped to a single Idea item or tight pair |
| C2.1 | yes | `requires:` present per task |
| C2.2 | yes | Topological sort produces 01 → 02 → (03, 04, 05) → 06 → 07. Documented effective order is `01 → 02 → 03 → 04 → 05 → 06 → 07` which is a valid topological linearization (any sequential interleaving of {03, 04, 05} after 02 + before 06 is valid; 04 has no deps on 02 so could even run earlier — see F-STRUCT-01) |
| C2.3 | yes | No cycles (DAG validated) |
| C3.1 | yes | Verifies use grep/awk/sed/jq/test/git — all runnable |
| C3.2 | yes | Each verifies command exits 0/1 via `awk` exit logic |
| C4.1 | yes | `files:` present per task |
| C4.2 | yes | Conflict-flag section at lines 376-380 enumerates the two overlaps; sequential ordering enforced |
| C4.3 | yes | Both known overlaps (memorization + gobbi) flagged with explicit sequencing |
| C5.1 | yes | Tasks 01-06 use executor |
| C5.2 | yes | Task 07 uses `assistant` with explicit P9 decision rationale citing `delegation/SKILL.md § Agent Roster` |
| C5.3 | yes | No mismatches |
| C6.1 | yes | Task 06 explicitly the largest; "EXTREME-DISCIPLINE BRIEF REQUIRED" annotation at line 461 |
| C6.2 | yes | Task 04 sized as multi-element insert with 7 verify lines + COD-CONS-003 micro-fix |
| C6.3 | yes | Tasks 01-03 + 05 sized correctly |
| C7.1 | yes | Conflict flags at 376-380 catch both overlaps |
| C7.2 | yes | Sequential ordering enforced via `requires:` |
| C8.1 | yes | Task 06's size acknowledged explicitly |
| C8.2 | yes | Task 06 sized correctly |

## Typed findings

### F-STRUCT-01 — Task 04 has no real dependency on Tasks 01-03; sequential ordering is conservative, not required

- **Type:** `general`
- **Domain:** `process`
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** Task 04 `requires: []` (line 232) — empty. Yet the "Effective Execution order" sequential dispatch (line 396) places Task 04 between Task 03 and Task 05. The rationale at line 398 says "Task 04 (wrap-up Step 2.5) is the largest single-file edit besides codex — runs before codex to keep the largest task last" — this is sizing aesthetic, not a real dependency. Task 04 could legitimately run after Task 01 (or even first) in parallel with Tasks 02/03/05 without conflict.
- **Why it matters:** A future Execution dispatch that respects sequential order will block on Task 04 unnecessarily; the parallel lanes table at lines 386-392 already identifies L4 as solo and parallel-safe. The "sequential dispatch" decision is consistent within the plan but the dependency table at line 364 is the source of truth and could justify L4 running in parallel.
- **Suggested direction:** clarify whether "sequential 01 → 02 → 03 → 04 → 05 → 06 → 07" is (a) a hard requirement, or (b) merely the documented happy-path order. If (b), the leader's intent should be explicit so the manager can dispatch L4 in parallel if PR review bandwidth allows.

### F-STRUCT-02 — Task 06 verify block: `.agents/skills/codex` directory symlink test uses `test -L && test -d`

- **Type:** `checklist_gap`
- **Domain:** `test`
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** `draft-iter1.md:323` — `test -L .agents/skills/codex && test -d .agents/skills/codex  # directory symlink + resolves`. `test -L` returns true if the path is a symlink; `test -d` returns true if it resolves to a directory. Both conditions together correctly assert a working directory symlink. However, the `.claude/skills/codex/SKILL.md` (file symlink, line 322) uses only `test -L .claude/skills/codex/SKILL.md` — no `test -f`. If the file symlink resolves to a non-existent target, `test -L` would still pass. Asymmetric rigor.
- **Why it matters:** Defense-in-depth on symlink verification. Currently `.claude/skills/codex/SKILL.md → ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` resolves, but the verify gate doesn't actually check resolution.
- **Suggested direction:** add `&& test -f .claude/skills/codex/SKILL.md` to verify the file symlink resolves to a real file. Same defense the directory symlink already has.

### F-STRUCT-03 — Task 06 input list omits gobbi/SKILL.md current state

- **Type:** `checklist_gap`
- **Domain:** `process`
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Task 06 inputs (lines 297-301) cite Idea Design A, insights, mistake file, and "Current stub state at .gobbi/projects/gobbi/skills/codex/SKILL.md" — but Task 06 ALSO modifies `.agents/skills/gobbi/SKILL.md` for the Skill Map row (line 296). The inputs list does not name `gobbi/SKILL.md` current state as required reading. The executor needs to know where in § Skill Map § Cross-cutting skills the new row goes (verified empirically: line 173 starts `### Cross-cutting skills`).
- **Why it matters:** Without explicit input pointer, executor relies on brief or memory.
- **Suggested direction:** add ".agents/skills/gobbi/SKILL.md § Skill Map § Cross-cutting skills (verified line 173)" to Task 06 inputs.

## Verdict

**PASS** — 3 Low findings, all open. DAG is clean. Conflict-flag discipline solid. Agent assignments correct.
