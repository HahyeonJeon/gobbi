# Codex Evaluator — T1 chat-mode.md — Execution iter2

## Identity

You are the **Codex-side evaluator** for Execution Task T1 iter2, second system in a dual-system
evaluation pair. You evaluate `chat-mode.md` independently from the Claude-side evaluator. Your
job: find problems the executor missed. A PASS without findings must be defensible.

---

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
- All session writes MUST use the session path INSIDE the worktree:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/`
  DO NOT use relative paths or pwd-derived paths. The worktree CWD is NOT the session-write root.

---

## Load directives

1. Read `/playinganalytics/git/gobbi/.claude/skills/principles/SKILL.md` — 13 behavioral principles.
2. Read all files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/` — project rules.
3. Read `/playinganalytics/git/gobbi/.claude/skills/mistake/SKILL.md` — mistake model.
4. Read `/playinganalytics/git/gobbi/.claude/skills/evaluation/SKILL.md` — evaluation procedure
   (4-stage: Stage 0 Target Understanding → Stage 1 Scenario-Checklist Frame Build →
   Stage 2 Per-Perspective Sequential Evaluation → Stage 3 Overall). Follow it exactly.
5. Read `/playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/execution.md` — execution
   workflow context and phase child doc for seed scenarios.

---

## Target artifact

File:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`

This is a **documentation artifact** (text-only), Execution-phase output. Phase tag: `execution`.
It is a skill sub-document for Chat Mode orchestration, replacing a prior placeholder.

---

## Stage 1 inheritance (MANDATORY — iter2 reads iter1 Codex findings)

This is iter **2**. You MUST read all iter1 Codex per-perspective files before Stage 1:

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/project.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/structure.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/performance.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/aesthetics.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/usage.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/consistency.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/risk.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter1/codex/overall.md
```

For each iter1 finding, you MUST judge its current `disposition:` against the iter2 artifact:
- `addressed` — finding is resolved; cite the resolution evidence (exact line/quote).
- `open` — finding is still present unchanged.
- `disputed` — creator pushed back with rationale; record both positions.
- `deferred` — moved to backlog with pointer.
- `superseded` — replaced by a more general/specific finding; cite the new finding ID.

Only `open`, `disputed`, and newly-surfaced findings contribute to the per-perspective verdict.

### Inheritance check: two iter1 Codex findings expected to be addressed in iter2

The iter2 surgical patch was intended to address:

1. **U1/C1** (Usage + Consistency, High/100): `§8.1` "of 4" counter inconsistency.
   - iter1 finding: `chat-mode.md` line 348 defined `{step-in-slice} of 4`; lines 351-352 listed
     five items for that "4"; the worked example rendered `Step 5 of 4`.
   - Expected iter2 fix: The "of 4" counter is replaced with `{step-name}` form in the header.
     Verify: `grep -n "of 4" <file>` should yield **zero matches**.
     Also verify: `grep -n "{step-name}\|step-name" <file>` — confirm the header now uses step
     names rather than a numeric progress counter.

2. **O2/C2** (Overall + Consistency, Medium/100): §6 opener "manager writes" ownership mismatch.
   - iter1 finding: Lines 212-213 attributed task-record writing to the manager; §6.4 and Idea
     line 254 assigned writing to the MEMORIZATION assistant.
   - Expected iter2 fix: The §6 opener now says "MEMORIZATION assistant writes".
     Verify: `grep -n "MEMORIZATION assistant\|manager writes" <file>` — should show
     "MEMORIZATION assistant" at/near line 212 and no "manager writes" in that context.

### Regression check

Verify that the iter2 patch did NOT introduce new problems:
- Does the status display header now use `{step-name}` form consistently with all its usages
  throughout the document? No new counter/name mismatch should be introduced.
- Does changing the §6 opener from "manager writes" to "MEMORIZATION assistant writes" create
  any new inconsistency with §6.4 writer details or other sections that reference the task-record
  author?

---

## Task T1 success criteria (10 criteria — verify each with grep evidence)

1. **Line count**: file has ≥ 200 lines.
   Verify: `wc -l <file>` → must be ≥ 200.

2. **Exactly ONE canonical "Chat MEMORIZATION" four-bullet statement.**
   The four bullets are: "Steps preserved", "Steps skipped", "Moment-of-capture preserved",
   and "`memorization/SKILL.md` is unmodified".
   Verify: `grep -cE 'Steps preserved|Steps skipped|[Mm]oment-of-capture|memorization/SKILL.md is unmodified' <file>` → must yield ≥ 4 matches.
   Also verify: the statement appears in exactly one section (not duplicated).

3. **All §3.2 diagram steps present.**
   The Idea §3.2 diagram includes: "Step 2 — Full Ideation Loop", "Step 3 — Preparation Loop",
   "Step 4 — mini Planning Loop", "Step 5 — mini Execution Loop", "task-record", and
   "USER REVIEW GATE". Verify all are present in the artifact's workflow diagram.

4. **task-record cites D-A + D-B + deferred frontmatter type.**
   Verify: `grep -E 'D-A|D-B|[Dd]eferred' <file>` → must show explicit D-A and D-B citations.

5. **Per-task state-transition table present (F-S2).**
   Verify: `grep -E 'state.*InProgress|state.*Done|state.*Skipped|taskRecord' <file>` → must yield ≥ 5 matches.

6. **Worked Status-Display example with prior + active task.**
   Verify: `grep -E 'Completed tasks|Task 0[12].*Done|✓ Done.*task-record' <file>` → must yield ≥ 1 match.

7. **Cross-references: memorization/SKILL.md base + back-link from §3.3 equivalent section.**
   Verify: `grep -E 'memorization/SKILL.md' <file>` → must yield ≥ 2 matches.

8. **Term lock "per-task slice" used consistently.**
   Verify: `grep -c 'per-task slice' <file>` → must yield ≥ 5 occurrences.
   Also check: no synonym drift — `grep -E '"task slice"|"Chat task"|"per-user-typed-task slice"' <file>` → must yield 0 matches.

9. **Principle 1 cited (NOT Principle 4).**
   Verify: `grep -E 'Principle 1|Principle 4' <file>` — must contain "Principle 1" and must NOT
   have "Principle 4" as the primary citation for fresh-subagent context.

10. **`delegation/SKILL.md § Inline-Paste Rule` cited.**
    Verify: `grep -E 'delegation/SKILL.md.*Inline-Paste|Inline-Paste Rule' <file>` → must yield ≥ 1 match.

---

## Plan T1 source references

- Idea source spec (lines 136-271):
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`

- Plan T1 contract (lines 107-175):
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/artifacts/plan.md`

---

## Evaluation procedure

Follow `evaluation/SKILL.md` exactly: Stage 0 → Stage 1 → Stage 2 → Stage 3.

**Phase tag**: `execution`.

**Seven perspectives** (all required, in order): Project → Structure → Performance → Aesthetics →
Usage → Consistency → Risk. Plus Overall (Stage 3).

**Finding types** (5 types): `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`.

**Scoring**: Confidence (0/25/50/75/100) + Severity (Critical/High/Medium/Low). This is a
text-only artifact — the highest verification mode is close-reading + cross-reference +
grep/file-existence. Confidence ≥ 75 requires citing the supporting passage explicitly.

**Adversarial stance mandatory.** Comfort is a warning sign. Find ways this will fail.

**For iter2**: every inherited finding from iter1 MUST carry a current `disposition:` value
(`addressed` / `open` / `disputed` / `deferred` / `superseded`). Do not carry findings forward
silently — judge each against the new artifact.

---

## Memory read instruction

Before Stage 1, read these project mistake files (all relevant to this documentation task):

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/prose-reclassification-target-is-project-level-notes.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/dual-system-codex-caught-template-form-gaps-claude-missed.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/prose-brief-light-pass-undersold-template-section-checks.md`

---

## Output paths (ABSOLUTE — 8 files)

All 8 output files MUST be written to:

Base path:
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T1-chat-mode-md/evaluation/iter2/codex/`

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
- `## Stage 2 Findings` section — for iter2, MUST show disposition for every inherited iter1
  finding (addressed / open / disputed / deferred / superseded) before listing new findings
- `## Per-perspective Verdict` line: `VERDICT: PASS`, `VERDICT: REVISE`, or `VERDICT: FAIL`
- `## Low-confidence appendix` section (even if empty, must be present)

`overall.md` MUST include:
- `## Artifact Summary` (from Stage 0)
- `## Cross-perspective tensions` (Stage 3 step 1)
- `## Cross-cutting findings` (Stage 3 step 2)
- `## Karpathy failure modes` (Stage 3 step 3 — all 4 must be checked explicitly)
- `## Preserve list` (Stage 3 step 4)
- `## Overall Findings` (Stage 3 step 5 — full metadata: Type / Domain / Disposition /
  Confidence / Severity / Evidence)
- `VERDICT: <PASS|REVISE|FAIL>` line

---

## Completion contract

After writing all 8 output files:

1. Verify each file exists and is > 0 bytes.
2. Verify each file contains a `VERDICT:` line.
3. Verify the Overall verdict in `overall.md` is consistent with per-perspective verdicts.
4. Confirm U1/C1 disposition is explicitly stated (addressed or open — not silent).
5. Confirm O2/C2 disposition is explicitly stated (addressed or open — not silent).
6. Report status: if all 8 files exist, > 0 bytes, have VERDICT lines → SUCCESS. Otherwise → FAILURE.

The evaluation is complete only when all 8 files pass validation.
