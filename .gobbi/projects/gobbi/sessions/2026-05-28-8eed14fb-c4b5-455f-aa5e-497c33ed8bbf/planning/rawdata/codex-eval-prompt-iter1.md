# Codex Evaluation Prompt — Planning iter1 (Chat Mode + Auto Mode Redesign)

You are the **Codex-side evaluator** for Planning iteration 1 of session `2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf`.

Your role is the evaluator. You are a **separate agent from the creator** — do not soften findings because the plan looks reasonable. Find the problems the creator missed.

---

## Load Directives (in order — load before beginning Stage 0)

1. **Principles skill**: `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md` — 13 Iron Laws; Principle 2 (one agent/one perspective/one category) governs Stage 2. Principle 6 (refuse vagueness) means you must cite evidence, not feelings.
2. **Project rules**: all files under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/`
3. **Mistake skill**: `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
4. **Evaluation skill**: `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md` — procedure, 7 perspectives, finding metadata schema, output paths, and constraints. This is your primary operating spec.
5. **Planning evaluation child doc**: `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md` — supplies seed scenarios and checklists for the Planning loop.
6. **Project mistakes** (scan for applicable ones):
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/` — filter for tags: `docs-sync`, `process`, `orchestration`, `codex`, worktree-related
   - Specifically load: `skills-mirror-symlinks-not-copies.md`, `codex-eval-session-write-path-nested-in-worktree.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`, `design-literal-retire-instruction-without-replacement.md`

---

## CRITICAL: Worktree-Path Discipline (False-Positive Prevention)

**Pre-annotation — read before Stage 0, do not skip:**

- **Placeholder files EXIST in the worktree only** (not a defect):
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` — EXISTS (placeholder, ~15 lines)
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` — EXISTS (placeholder, ~17 lines)
- **Mirror symlinks EXIST in the worktree**:
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/orchestration/chat-mode.md` — IS a symlink pointing to the canonical file
  - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/orchestration/auto-mode.md` — IS a symlink pointing to the canonical file
- **Main tree absence is NOT a defect**: `/playinganalytics/git/gobbi` does NOT have these files at HEAD — that is correct and expected, not a gap to flag.
- **`plugins/` directory does NOT exist at HEAD** (deleted in PR #264). Do NOT flag its absence as a defect. Do NOT require any plugin-mirror task. Any finding about `plugins/` being missing is a false positive.
- **Verification commands that use `<worktree>` prefix are correct**: the Plan's verification commands correctly scope to the worktree path — this is intentional worktree-only scope.

---

## Task: Evaluate the Planning iter1 Draft

**Artifact**: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter1.md` (561 lines)

**Phase**: `planning`  
**Iter**: `1`  
**Session-id**: `2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf`  
**Session date**: `2026-05-28`

**Idea doc (for Ideation → Planning trace checks)**: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`

Run the full four-stage evaluation procedure from `evaluation/SKILL.md`:

- **Stage 0** — Target Understanding: read artifact in full, confirm phase = planning, extract W/W/H, apply W/W/H gate, load planning child doc, read idea.md for Ideation → Planning trace, write Artifact Summary
- **Stage 1** — Scenario-Checklist Frame Build: 7 perspectives in order, each with seed scenarios from planning child doc + adversarial scenarios + coverage ownership matrix items + applicable project mistakes → locked Frame per perspective
- **Stage 2** — Per-Perspective Sequential Evaluation: walk each Frame end-to-end, checklist items yes/no with evidence, surface new typed findings, compute per-perspective verdicts
- **Stage 3** — Overall: holistic cross-perspective pass, Karpathy 4 failure modes, Preserve list, Overall verdict

---

## User-Locked Decisions (do NOT re-litigate — verify only that the Plan reflects them)

These decisions are already locked by the user. You MUST NOT recommend reversing them. Your job is to verify the Plan correctly reflects each lock — flag only if the Plan is inconsistent with a lock or silently omits a requirement:

| Source | Lock |
|---|---|
| Idea iter2 lock R1 | `preparation.maxIterations: 0 → state: Skipped` mapped at loop-entry guard; no new settings field; no FAIL/Aborted noise |
| Idea iter2 lock R2+R3 | `workflow.chat.tasks[]` array-of-slices in BOTH `session.json` and `state.json`; per-task entries hold `{ideation, preparation, planning, execution}` sub-records |
| Idea iter2 lock R5 | Chat MEMORIZATION narrowed PASS path declared locally in `chat-mode.md`; `memorization/SKILL.md` stays untouched |
| User D-A | task-record memory type = session-local only at `sessions/.../chat/tasks/{NN}-{slug}/task-record.md`; no promotion to project memory; `memorization/SKILL.md` untouched |
| User D-B | Chat session layout = `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/` — symmetric quartet rooted under `chat/` |

---

## Special Evaluation Checks

Apply these during Stage 2 in the appropriate perspectives (supplement seed scenarios, do not replace):

### Consistency perspective — Idea-doc anchor verification
For each task (T1–T7), verify:
- Every `traces-to:` entry cites a real section in the Idea doc
- Read the Idea doc `ideation/artifacts/idea.md` and confirm the cited sections exist
- Flag as `design_flaw` (Consistency) if a `traces-to:` entry names a section that does not appear in the Idea doc

### Structure perspective — DAG integrity check
The Plan states task execution order: **T1 → T2 → T4 → T5 → T3 → T7** (T6 in Wrap-up).
- T3 `requires: [01-chat-mode-canonical-spec, 02-auto-mode-canonical-spec]` — verify this is consistent with the stated order
- T6 `requires: [01-chat-mode-canonical-spec, 02-auto-mode-canonical-spec, 03-skill-md-amendment]` — verify this dependency is satisfied before T6 runs (Wrap-up phase)
- T1, T2, T4, T5, T7 `requires: []` — verify these truly have no cross-task file overlaps that would create hidden ordering constraints
- Flag any cycle, hidden dependency, or overlap as `design_flaw` (Structure)

### Risk perspective — Verification command concreteness
For each task's `verification-commands:` list:
- Check whether commands use `<worktree>` / `<file>` placeholders that must be resolved by the executor
- Verify commands that use shell operators (pipes, `&&`, variable substitution) are syntactically correct
- Flag commands that are ambiguous or contain unresolvable placeholders as `assumption_risk` (Risk)

### Project perspective — Scope contract compliance
- The Plan's Out-of-Scope section lists explicit deferred items (Bucket B/C/D Idea findings)
- Verify each task stays within the Plan's In-Scope definition
- Verify no task silently picks up deferred work (e.g., T4 touches `models.*` block which is explicitly deferred)
- Flag scope bleed as `design_flaw` (Project)

---

## Output Paths

Write 8 files total. All paths use the **main-tree worktree absolute path** — NOT a path relative to CWD:

**Per-perspective files (7):**
```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/project.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/structure.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/performance.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/aesthetics.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/usage.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/consistency.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/risk.md
```

**Overall file (1):**
```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter1/codex/overall.md
```

**Session-write discipline**: ALL writes MUST use the absolute worktree path above. Do NOT use relative paths or `pwd`-derived paths. The CWD may be the main-tree root; the output directory is inside the worktree path. Use the full absolute path above verbatim.

---

## File Shape (per `evaluation/SKILL.md`)

Each of the 7 perspective files must contain:

```markdown
# {Perspective} — Planning iter1 Evaluation (Codex)

## Artifact Summary
[One paragraph: What / Why / How + Scope Contract source + downstream consumers]

## Memory reads
[All Stage 0/1 paths consumed]

## Locked Frame (Stage 1)
[Scenarios with attached checklists; adversarial scenario(s) or explicit not-applicable: <rationale>; Coverage Ownership Matrix items with not-applicable where N/A]

## Evaluation (Stage 2)
[Per-scenario per-check yes/no with evidence; new typed findings with Type/Domain/Confidence/Severity/Evidence/Disposition]

VERDICT: <PASS|REVISE|FAIL>

## Low-confidence appendix
[Findings suppressed at Confidence ≤ 25, if any]
```

The `overall.md` file must contain:

```markdown
# Overall — Planning iter1 Evaluation (Codex)

## Artifact Summary
[As above]

## Cross-perspective tensions
[Where per-perspective verdicts diverge]

## Cross-cutting findings
[Issues no single perspective owns]

## Karpathy failure mode checks
- Wrong assumptions: ...
- Overcomplexity: ...
- Orthogonal edits: ...
- Imperative-over-declarative: ...

## Strengths — Preserve list
[What the creator got right; do NOT touch on REVISE]

## Overall findings
[Stage 3 findings with Type/Domain/Confidence/Severity/Evidence/Disposition]

VERDICT: <PASS|REVISE|FAIL>
```

Every finding carries: `Type` (scenario_gap/checklist_gap/design_flaw/assumption_risk/general) + `Domain` + `Confidence` (0/25/50/75/100) + `Severity` (Critical/High/Medium/Low) + `Evidence` (exact quote or tool output) + `Disposition` (open/addressed/deferred/superseded/disputed).

---

## Constraints

- Do NOT modify the Plan artifact or any other file — read only, except writing the 8 output files.
- Do NOT skip any of the 7 perspectives.
- Do NOT re-litigate user-locked decisions (D-A, D-B, R1, R2+R3, R5).
- Do NOT flag `plugins/` absence as a defect.
- Do NOT flag that `chat-mode.md` / `auto-mode.md` are placeholders (pre-annotation above confirms this is known and expected).
- DO flag if the Plan's verification commands are ambiguous or unrunnable.
- DO flag if a `traces-to:` anchor in any task does not exist in the Idea doc.
- DO flag if hidden file-overlap dependencies exist between "parallel" tasks.
- DO verify that T4's `success-criteria` explicitly prevents touching `models.*` (scope bleed guard).
- DO verify that the Plan-level acceptance test §4 covers all 7 tasks' outputs.
- A `PASS` verdict without findings must be defensible — "looks fine" is not a finding; cite evidence.
