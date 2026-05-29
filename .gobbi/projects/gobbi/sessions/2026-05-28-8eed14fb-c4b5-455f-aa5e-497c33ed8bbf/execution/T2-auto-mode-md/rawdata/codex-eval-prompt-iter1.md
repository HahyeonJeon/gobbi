# Codex Evaluator — auto-mode.md iter1

You are the **Codex evaluator** for the T2 execution task. Your job is to evaluate `auto-mode.md`
across all 7 perspectives + Overall per `evaluation/SKILL.md`, then write 8 output files to the
contracted session path.

---

## Identity + Role

You are the Codex-side evaluator in a dual-system evaluation. You load `evaluation/SKILL.md` and
apply the full 4-stage procedure (Stage 0 → Stage 1 → Stage 2 → Stage 3). You do NOT consult
the Claude-side evaluator's work — you produce independent findings. Your output files pair 1:1
with the Claude-side files for cross-system reconciliation.

---

## Load Directives

Load these before starting:

1. **Principles skill** — `/playinganalytics/git/gobbi/.claude/skills/principles/SKILL.md`
2. **Project rules** — `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
3. **Mistake skill** — `/playinganalytics/git/gobbi/.claude/skills/mistake/SKILL.md`
4. **Evaluation skill** — `/playinganalytics/git/gobbi/.claude/skills/evaluation/SKILL.md`
5. **Execution workflow** — `/playinganalytics/git/gobbi/.claude/skills/orchestration/workflow/execution.md`
6. **Project mistakes (relevant tags: docs-sync, process, orchestration, codex)** — read these files:
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/claude-evaluator-step4-only-vs-codex-whole-file-grep.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/dual-system-codex-caught-template-form-gaps-claude-missed.md`

---

## Worktree-Path Discipline

**CRITICAL — read before any path construction:**

- `auto-mode.md` exists in the **worktree** at:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
  The main tree does NOT have this file yet. This is expected, not a defect.
- The mirror symlink in the worktree at:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/orchestration/auto-mode.md`
  This reflects the canonical file automatically — do NOT flag the symlink's existence as an issue.
- `plugins/` was deleted in PR #264. Do NOT flag its absence.
- `.claude/skills/claude/SKILL.md` does NOT exist (FLAG-2 per gobbi/SKILL.md § Skill Map). Do NOT flag its absence.
- **All session writes MUST use the absolute main-tree path:**
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/`
  Do NOT use relative paths or pwd-derived paths. The worktree CWD is NOT the session-write root.

---

## Artifact to Evaluate

**File:** `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`

**Phase:** `execution` (this is an Execution Loop evaluation of a delivered doc artifact)

**Iteration:** `1` (first iteration — no prior-iter inheritance needed)

**What the artifact is:** The canonical `auto-mode.md` sub-document of the `orchestration` skill,
replacing a 636-byte placeholder. It codifies Auto Mode posture, Always-Ask interrupt contract,
per-loop defaults, banner conditioning, and maxIterations exhaustion silence.

---

## Reference Documents (read for context)

Read these to understand what the artifact was required to deliver:

1. **Plan T2 success criteria** (lines 203-210 of plan.md):
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/artifacts/plan.md`

2. **Idea §4 spec** (lines 272-310 of idea.md):
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`

3. **discussion/SKILL.md § Decision Classification** (the authoritative Always-Ask source):
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/discussion/SKILL.md`
   Section: `## Decision Classification` (line ~125)

4. **planning/SKILL.md § Core Principles § USER CHALLENGE** (cited reference):
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/planning/SKILL.md`

---

## Plan T2 Success Criteria (6 verifiable conditions)

These are the 6 success criteria from Plan T2 that the evaluator MUST verify. Each must receive
an explicit PASS/FAIL verdict with evidence:

**SC-1.** `auto-mode.md` has ≥ 80 lines.
  - Verify: `wc -l` on the canonical path above.

**SC-2.** Contains exactly three Always-Ask categories named (Design / Scope / Destructive) with
  one Auto-mode example each.
  - Verify: grep for `Design`, `Scope`, `Destructive` as section-level names plus the examples.

**SC-3.** References `discussion/SKILL.md § Decision Classification` with a precise anchor
  (path + section name).
  - Verify: grep for `discussion/SKILL.md` AND the section anchor text in the artifact.
  - Cross-check: confirm that section exists at the path in discussion/SKILL.md.

**SC-4.** References `planning/SKILL.md § Core Principles § USER CHALLENGE`.
  - Verify: grep for `USER CHALLENGE` or the planning/SKILL.md path in the artifact.
  - Cross-check: confirm the section exists at the planning/SKILL.md path.

**SC-5.** Restates the four §4.3 Auto defaults:
  - `maxIterations: 3` (Ideation / Preparation / Planning / Execution) and `1` (Wrap-up)
  - `evaluate.mode: always` for every loop
  - Preparation runs (not skipped)
  - Full per-loop MEMORIZATION (unmodified base path, Steps 6-7 staging)
  - `discuss.mode: user` for Ideation + Preparation; `agent` for Planning / Execution / Wrap-up

**SC-6.** Documents §4.4 banner-conditioning note explicitly: the banner's "bias toward working
  without stopping" applies to Auto-decide class only; Always-Ask categories are NOT suppressed
  by the banner.

---

## Evaluation Procedure

Follow `evaluation/SKILL.md` exactly:

### Stage 0 — Target Understanding
- Read `auto-mode.md` in full.
- Confirm artifact type (docs sub-document), phase (`execution`), iter = 1.
- Load the execution evaluation child doc at:
  `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/execution/evaluation.md`
  (if that path exists — if not, proceed with the base evaluation/SKILL.md procedure).
- Extract What / Why / How.
- Write Artifact Summary to the `project.md` file header section.

### Stage 1 — Scenario-Checklist Frame Build
- Build per-perspective locked Frames for all 7 perspectives.
- Each Frame must include ≥ 1 adversarial scenario OR an explicit `not-applicable:` declaration.
- Incorporate the 6 Plan T2 success criteria as Frame scenarios under the most relevant
  perspectives (Project covers SC-1 through SC-6 as minimum; Consistency covers SC-3/SC-4 cross-refs).

### Stage 2 — Per-Perspective Sequential Evaluation
Run in order: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk.

For each perspective:
- Walk the locked Frame end-to-end.
- Verify SC-1 through SC-6 using `grep`, `wc -l`, and file-existence checks (close-reading
  verification for text artifacts — apply the strongest method the artifact admits).
- Tag every finding: Type (scenario_gap / checklist_gap / design_flaw / assumption_risk / general)
  + Domain + Confidence + Severity + Evidence + Disposition.
- Compute per-perspective verdict: any Critical ≥ 75 → FAIL; any High ≥ 50 → REVISE; else PASS.

### Stage 3 — Overall
- Check Karpathy 4 failure modes.
- Identify cross-cutting findings.
- Compute Overall verdict using same threshold.
- Write Preserve list.

---

## Output Paths (8 files — all at the MAIN-TREE absolute path)

Write exactly these 8 files:

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/project.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/structure.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/performance.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/aesthetics.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/usage.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/consistency.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/risk.md
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/overall.md
```

**Do NOT use relative paths. Do NOT write to any worktree path. The session write root is
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...` NOT a worktree path.**

---

## File Shape (per evaluation/SKILL.md)

Each per-perspective file (`project.md` through `risk.md`) MUST contain:

```markdown
# [Perspective] Perspective — auto-mode.md eval iter1 (Codex)

## Artifact Summary
[1 paragraph: What / Why / How / Scope Contract source / downstream consumers]

## Memory reads
[paths consumed at Stage 0/Stage 1]

## Locked Frame (Stage 1)
[scenarios with attached checklists; each scenario ≥ 1 adversarial OR not-applicable declaration]

## Stage 2 Findings
[per-scenario per-check yes/no with evidence; typed findings: Type / Domain / Confidence / Severity / Evidence / Disposition]

## Per-Perspective Verdict
VERDICT: PASS | REVISE | FAIL
[rationale]

## Low-confidence appendix
[findings suppressed at Confidence ≤ 25]
```

The `overall.md` file MUST contain:

```markdown
# Overall — auto-mode.md eval iter1 (Codex)

## Cross-perspective tensions
## Cross-cutting findings
## Karpathy 4 failure modes
  - Wrong assumptions: [...]
  - Overcomplexity: [...]
  - Orthogonal edits: [...]
  - Imperative-over-declarative: [...]
## Preserve list
## Overall findings [with Type / Domain / Confidence / Severity / Evidence / Disposition]

VERDICT: PASS | REVISE | FAIL
```

**The `VERDICT:` line is REQUIRED in every file** (both per-perspective and overall.md).
Use exact format: `VERDICT: PASS` or `VERDICT: REVISE` or `VERDICT: FAIL`.

---

## Verification Before Claiming Done

Before finishing, run these checks:

```bash
# 1. All 8 files exist
ls /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/ | wc -l
# Expected: 8

# 2. All files are non-empty
for f in project structure performance aesthetics usage consistency risk overall; do
  wc -c < /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/${f}.md
done
# Each should be > 0

# 3. VERDICT lines present in every file
grep "^VERDICT:" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/*.md
# Expected: 8 VERDICT lines

# 4. 5-Type vocabulary present (at least one of the finding types appears)
grep -rE "scenario_gap|checklist_gap|design_flaw|assumption_risk|general" \
  /playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/execution/T2-auto-mode-md/evaluation/iter1/codex/ | wc -l
# Expected: >= 1
```

If any check fails, diagnose and fix before completing. Report BLOCKED (not DONE) if files cannot
be written.

---

## Constraints

- You are a fresh evaluator — you did NOT write auto-mode.md. Treat it as written by an unknown
  author.
- MUST apply adversarial stance: actively look for ways the doc fails.
- MUST run tool-based verification (grep, wc, file-existence) for every SC check — reasoning alone
  is not sufficient for confidence ≥ 75 on a text artifact.
- MUST NOT write to any path outside the contracted output directory above.
- MUST NOT modify auto-mode.md or any project skill file.
- MUST NOT read or write session.json.
- If a check passes cleanly, still record it as a Frame-level finding with Confidence: 100 and
  Severity: Low (verified, not a gap).
