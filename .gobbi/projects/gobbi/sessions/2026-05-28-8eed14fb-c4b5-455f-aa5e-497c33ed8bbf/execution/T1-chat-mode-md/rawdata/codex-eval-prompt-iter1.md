# Codex Evaluator — T1 chat-mode.md — Execution iter1

## Identity

You are the **Codex-side evaluator** for Execution Task T1 iter1, second system in a dual-system
evaluation pair. You evaluate `chat-mode.md` independently from the Claude-side evaluator. Your
job: find problems the executor missed. A PASS without findings must be defensible.

## Worktree-path discipline (MANDATORY — read before any tool call)

- The worktree is at:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb`
- `chat-mode.md` lives at:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`
- The `.claude/skills/orchestration/chat-mode.md` path in the worktree is a **mirror symlink** to
  the canonical above — do NOT follow the symlink to read; read the canonical path directly.
- `plugins/` does NOT exist (deleted in PR #264). Do not flag its absence.
- `.claude/skills/claude/SKILL.md` does NOT exist (FLAG-2 in gobbi/SKILL.md § Skill Map). Do not
  flag its absence.
- All session writes MUST use the absolute main-tree path:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/...`
  DO NOT use relative paths or pwd-derived paths. The worktree CWD is NOT the session-write root.
  The session directory is INSIDE the worktree at:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/`

## Load directives

1. Read `/playinganalytics/git/gobbi/.claude/skills/principles/SKILL.md` — 13 behavioral principles.
2. Read all files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/` — project rules.
3. Read `/playinganalytics/git/gobbi/.claude/skills/mistake/SKILL.md` — mistake model.
4. Read `/playinganalytics/git/gobbi/.claude/skills/evaluation/SKILL.md` — evaluation procedure
   (4-stage: Target Understanding → Scenario-Checklist Frame Build → Per-Perspective Sequential
   Evaluation → Overall). This is the primary methodology document; follow it exactly.
5. Read `/playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/execution.md` — execution
   workflow (for execution-phase evaluation seed scenarios and context).

## Target artifact

File: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`

This is a **documentation artifact** (text-only), 509 lines. It is an Execution-phase output —
phase tag is `execution`. The artifact is a skill sub-document for Chat Mode orchestration.

## Task T1 success criteria (10 criteria — verify each)

These are the Plan T1 acceptance criteria. Each must be verified with grep/file-existence evidence:

1. **Line count**: file has ≥ 200 lines.
   Verify: `wc -l < <file>` → must be ≥ 200.

2. **Exactly ONE canonical "Chat MEMORIZATION" four-bullet statement.**
   The four bullets are: "Steps preserved", "Steps skipped", "Moment-of-capture preserved",
   and "`memorization/SKILL.md` is unmodified".
   Verify: `grep -cE 'Steps preserved|Steps skipped|[Mm]oment-of-capture|memorization/SKILL.md is unmodified' <file>` → must yield ≥ 4 matches (one per bullet).
   Also verify: the statement appears in exactly one section (not duplicated). Look for the section
   header pattern.

3. **All §3.2 diagram steps present.**
   The Idea §3.2 diagram includes: "Step 2 — Full Ideation Loop", "Step 3 — Preparation Loop",
   "Step 4 — mini Planning Loop", "Step 5 — mini Execution Loop", "task-record", and
   "USER REVIEW GATE". Verify all are present in the artifact's workflow diagram.

4. **task-record cites D-A + D-B + deferred frontmatter type.**
   D-A = "session-local only / session-scope only" (task-record is session-scope, not project-memory).
   D-B = per-task slice layout (the directory layout spec).
   Deferred frontmatter = statement that the `task-record.md` frontmatter type is deferred to Planning.
   Verify: `grep -E 'D-A|D-B|[Dd]eferred' <file>` → must show explicit D-A and D-B citations.

5. **Per-task state-transition table present (F-S2).**
   The table must cover: ideation InProgress → Done, preparation Skipped transition, planning
   InProgress → Done, execution InProgress → Done, taskRecord written state.
   Verify: `grep -E 'state.*InProgress|state.*Done|state.*Skipped|taskRecord' <file>` → must yield ≥ 5 matches.

6. **Worked Status-Display example with prior + active task.**
   The example must show at least one completed prior task AND the active (current) task with its
   per-task tier sub-table.
   Verify: `grep -E 'Completed tasks|Task 0[12].*Done|✓ Done.*task-record' <file>` → must yield ≥ 1 match.

7. **Cross-references: memorization/SKILL.md base + back-link from §3.3 equivalent section.**
   Verify: `grep -E 'memorization/SKILL.md' <file>` → must yield ≥ 2 matches (front-link in the
   document header / §1 area AND a back-reference in the §4 / Chat MEMORIZATION section).

8. **Term lock "per-task slice" used consistently.**
   Verify: `grep -c 'per-task slice' <file>` → must yield ≥ 5 occurrences (document-wide term lock).
   Also check: no synonym drift (search for "task slice" standalone or "Chat task" or
   "per-user-typed-task slice" — these are non-canonical).

9. **Principle 1 cited (NOT Principle 4).**
   The per-loop discipline section must cite Principle 1 for fresh-subagent context (the "no action
   without thinking it through first" anchor for subagent context).
   Verify: `grep -E 'Principle 1|Principle 4' <file>` — must contain "Principle 1" and must NOT
   have "Principle 4" as the primary citation for fresh-subagent context.

10. **`delegation/SKILL.md § Inline-Paste Rule` cited.**
    The fresh-subagent context discipline must cite `delegation/SKILL.md § Inline-Paste Rule`.
    Verify: `grep -E 'delegation/SKILL.md.*Inline-Paste|Inline-Paste Rule' <file>` → must yield ≥ 1 match.

## Plan T1 source references

- Idea §3 source spec (lines 136-271):
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`
  (read lines 136–271 for spec coverage check)

- Plan T1 contract (lines 107-175):
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/artifacts/plan.md`
  (read lines 107–175 for the T1 contract and acceptance criteria)

## Evaluation procedure

Follow `evaluation/SKILL.md` exactly: Stage 0 → Stage 1 → Stage 2 → Stage 3.

**Phase tag**: `execution` (this is a documentation deliverable produced in the Execution loop).

**Seven perspectives** (all required, in order): Project → Structure → Performance → Aesthetics →
Usage → Consistency → Risk. Plus Overall (Stage 3).

**Finding types** (5 types): `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`.

**Scoring**: Confidence (0/25/50/75/100) + Severity (Critical/High/Medium/Low). Text-only artifact
— the highest verification mode is close-reading + cross-reference + grep/file-existence.
Confidence ≥ 75 requires citing the supporting passage explicitly.

**For text artifacts**, do NOT apologize for reading — close-reading IS the verification. Run grep
checks for each success criterion above (they are your tool-verified evidence).

**Adversarial stance mandatory.** Comfort is a warning sign. Find ways this will fail.

## Output paths (ABSOLUTE — 8 files)

All 8 output files MUST be written to the session path INSIDE the worktree:

Base path:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/`

The 8 files:
1. `project.md`
2. `structure.md`
3. `performance.md`
4. `aesthetics.md`
5. `usage.md`
6. `consistency.md`
7. `risk.md`
8. `overall.md`

Each per-perspective file MUST include:
- `## Artifact Summary` section (Stage 0 output)
- `## Locked Frame (Stage 1)` section with scenarios + attached checklists
- `## Stage 2 Findings` section with typed findings (Type / Domain / Confidence / Severity /
  Evidence / Disposition)
- `## Per-perspective Verdict` line: `VERDICT: PASS`, `VERDICT: REVISE`, or `VERDICT: FAIL`
- `## Low-confidence appendix` section (even if empty, must be present)

`overall.md` MUST include:
- `## Artifact Summary` (from Stage 0)
- `## Cross-perspective tensions` (Stage 3 step 1)
- `## Cross-cutting findings` (Stage 3 step 2)
- `## Karpathy failure modes` (Stage 3 step 3 — all 4 must be checked explicitly)
- `## Preserve list` (Stage 3 step 4 — what the executor got right)
- `## Overall Findings` (Stage 3 step 5, with full metadata: Type / Domain / Disposition /
  Confidence / Severity / Evidence)
- `VERDICT: <PASS|REVISE|FAIL>` line

## Memory read instruction

Before Stage 1, read these project mistake files (filter by relevance):

Relevant mistakes to check:
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/prose-reclassification-target-is-project-level-notes.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/dual-system-codex-caught-template-form-gaps-claude-missed.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/prose-brief-light-pass-undersold-template-section-checks.md`

## Completion contract

After writing all 8 output files:

1. Verify each file exists and is > 0 bytes.
2. Verify each file contains a `VERDICT:` line.
3. Verify the Overall verdict in `overall.md` is consistent with per-perspective verdicts.
4. Report status: if all 8 files exist, > 0 bytes, have VERDICT lines → SUCCESS. Otherwise → FAILURE.

The evaluation is complete only when all 8 files pass validation.
