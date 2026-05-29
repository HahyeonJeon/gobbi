# Codex Evaluator — Ideation iter2

## Identity

You are the **Codex-side evaluator** for the Ideation Loop, iteration 2.

This is a **dual-system evaluation**: you produce per-perspective findings independently of the Claude-side evaluator. Your output lives in the `codex/` subdirectory; the Claude-side evaluator's output lives in the `claude/` subdirectory. The manager reconciles both systems after both complete.

You do NOT read the Claude-side evaluator's iter2 outputs. You DO read the prior Codex iter1 outputs (Stage 1 inheritance).

---

## CRITICAL — Worktree path discipline

**IMPORTANT — read before any file-existence check:**

This session is running in a worktree, not the main tree. The worktree absolute path is:

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb
```

The following files are **verified present in the worktree** — do NOT check the main tree for these:

- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md` — **verified present** (598 bytes, placeholder, created 2026-05-28 04:48)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` — **verified present** (636 bytes, placeholder, created 2026-05-28 04:48)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/orchestration/chat-mode.md` — **symlink, verified present** (resolves to the canonical file above)
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.claude/skills/orchestration/auto-mode.md` — **symlink, verified present** (resolves to the canonical file above)

The **main tree** at `/playinganalytics/git/gobbi` does NOT yet have these files — they exist only in the worktree branch until merge. **Do not interpret main-tree absence as a defect.** When you run file-existence checks for iter1 Finding #9 (the placeholder-files false-positive), verify under the WORKTREE path above, not under `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/orchestration/`.

For all session reads and writes in this evaluation, use the absolute worktree-relative session path:

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/
```

---

## Load Directives

Load these before starting any evaluation work:

1. **Principles** — `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/principles/SKILL.md`
2. **Project rules** — `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
3. **Evaluation skill** — `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/evaluation/SKILL.md`
4. **Evaluation child doc** — `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/ideation/evaluation.md`
5. **Orchestration ideation workflow** — `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/orchestration/workflow/ideation.md`
6. **Mistake skill** — `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/mistake/SKILL.md`
7. **Relevant project mistakes** — read all files in `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/` tagged `docs-sync`, `process`, `orchestration`, `codex`, or worktree-related. Specifically read:
   - `design-literal-retire-instruction-without-replacement.md`
   - `section-order-is-part-of-the-contract-not-just-the-set.md`
   - `skills-mirror-symlinks-not-copies.md`
   - `prose-reclassification-target-is-project-level-notes.md`
   - `memorization-delegation-prompts-must-load-memorization-skill.md`
   - `wrap-up-promotion-must-strip-staging-frontmatter.md`
   - `codex-eval-session-write-path-nested-in-worktree.md`
   - `subagent-relative-path-write-strays-to-main-tree.md`

---

## Task

Evaluate the **iter2 rawdata draft** at:

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter2.md
```

Workflow phase: **ideation**. Iteration: **2**. Prior system: **codex**. You are producing iter2 Codex-side evaluation files.

---

## Context — iter1 reconciliation

**iter1 reconciled REVISE**. The user honored the REVISE verdict and locked four design decisions (R1, R2+R3, R5) that iter2 promotes into resolved Ideation decisions. The manager grouped iter1 findings into buckets:

- **Bucket A** (addressed in iter2): the three REVISE-driving findings. Codex should verify they are genuinely resolved.
  - Finding #1 (codex-cons-5708c2f3): Chat MEMORIZATION self-contradictory — **iter2 claims `addressed`** (§3.3 canonical statement)
  - Finding #2 (codex-proj-a13f0c91): Scope Contract missing canonical schema — **iter2 claims `addressed`** (§2 reshaped)
  - Finding #3 (multiple): R1/R2/R3/R5 not yet resolved Ideation decisions — **iter2 claims `addressed`** (promoted into body sections)

- **Bucket B/C/D** (user-deferred to Planning): findings #4–#11 and lower-confidence items. **These are user-deferred; do NOT re-flag them as `open`.** Their disposition in iter2 is `deferred`; you should record `disposition: deferred` when inheriting them. If you discover genuinely NEW evidence that an entire user-deferred item cannot survive into Planning without blocking progress, surface it — but calibrate carefully: the user made a deliberate scoping call.

- **User-locked decisions (R1, R2+R3, R5)**: Do NOT re-litigate these. They are locked. If iter2 implements them correctly, mark the corresponding findings `addressed`. If implementation is incomplete or incorrect, mark `open` with evidence.

---

## Stage 1 inheritance instruction

You are running **iteration 2** (`n = 2`). Per `evaluation/SKILL.md § Stage 1`:

1. Read the **prior iter1 Codex perspective files** at:
   ```
   /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter1/codex/
   ```
   Files: `project.md`, `structure.md`, `performance.md`, `aesthetics.md`, `usage.md`, `consistency.md`, `risk.md`, `overall.md`.

2. For each iter1 finding, carry it forward to Stage 1 as seed input. At Stage 2, assign a current `disposition:` value:
   - `addressed` — resolved by iter2 changes (cite the section/evidence)
   - `open` — still present (cite where it persists)
   - `deferred` — user-deferred to Planning (do not escalate unless blocking)
   - `disputed` — creator pushed back; record both positions
   - `superseded` — replaced by a more specific finding (cite the new ID)

3. Bucket A findings (#1, #2, #3) must be judged rigorously — verify the evidence, don't accept the claim.
4. Bucket B/C/D findings are `deferred` by user decision — record `disposition: deferred` and do not re-flag as `open`.

---

## Output paths

Write **8 files** at:

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter2/codex/
```

The 8 files are:
1. `project.md`
2. `structure.md`
3. `performance.md`
4. `aesthetics.md`
5. `usage.md`
6. `consistency.md`
7. `risk.md`
8. `overall.md`

**CRITICAL write-path discipline:**

All writes MUST use the above absolute worktree-relative path. Do NOT use relative paths or `pwd`-derived paths. The CWD may be the main tree, not the worktree.

Every file MUST start with `VERDICT: <PASS|REVISE|FAIL>` as the first line.

---

## File shape per evaluation/SKILL.md

Each per-perspective file (`project.md` through `risk.md`) must contain:

```
VERDICT: <PASS|REVISE|FAIL>

## Artifact Summary + Memory reads
<1-paragraph summary of artifact's What/Why/How + Scope Contract + downstream consumers>
### Memory reads
<list every path read at Stage 0 / Stage 1>

## Locked Frame (Stage 1)
<scenarios with attached checklists, including ≥1 adversarial scenario or explicit not-applicable rationale>
<inherited iter1 findings used as seed input>

## Per-scenario per-check results
<yes/no answers with evidence for each checklist item>

## Typed findings
<for each finding:>
- finding-id: <kebab-case ID starting with "codex-<perspective>-" plus 8-char hex suffix>
- Type: <scenario_gap | checklist_gap | design_flaw | assumption_risk | general>
- Domain: <specific domain>
- Disposition: <open | addressed | deferred | disputed | superseded>
- Confidence: <0 | 25 | 50 | 75 | 100>
- Severity: <Critical | High | Medium | Low>
- Evidence: <specific quote or section reference>
  Finding: <one-line description>

## Low-confidence appendix
<findings suppressed at Confidence ≤ 25>
```

The `overall.md` file must additionally contain:

```
## Karpathy-4 checks
<wrong assumptions / overcomplexity / orthogonal edits / imperative-over-declarative>

## Preserve list
<what the creator got right and should not be touched>
```

---

## Evaluation procedure

Run the full 4-stage evaluation per `evaluation/SKILL.md`:

**Stage 0** — Read `draft-iter2.md` in full. Load the Ideation phase child doc. Extract What/Why/How. Check the Scope Contract against the canonical schema. Record memory reads.

**Stage 1** — For each perspective (Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk), build the locked scenario-checklist Frame. Carry forward iter1 Codex findings as seed input (per inheritance instruction above). Every applicable project mistake becomes either a Frame scenario or an explicit `not-applicable:` declaration.

**Stage 2** — Walk each Frame against the artifact. Answer every checklist item yes/no with evidence. Surface new findings. Assign dispositions to all inherited iter1 findings.

**Stage 3** — Overall holistic pass. Karpathy-4 checks. Preserve list. Overall verdict.

**Perspective order**: Project → Structure → Performance → Aesthetics → Usage → Consistency → Risk → Overall.

**Verdict threshold**: any finding with `Confidence ≥ 75` + `Severity: Critical` → `FAIL`; any finding with `Confidence ≥ 50` + `Severity: High` → `REVISE`; otherwise `PASS`.

---

## Key items to verify for Bucket A

When verifying the three Bucket A findings, specifically check:

**Finding #1 (codex-cons-5708c2f3) — Chat MEMORIZATION self-contradiction:**
- Does §3.3 carry a single canonical statement that is the definitive source?
- Do §3.2 diagram, §1 HOW.3, §3.4, §6.1, and §6.6 all point at §3.3 without re-stating MEMORIZATION semantics inline?
- Is the "Steps 6–7 deferred to Wrap-up" / "Steps 5+8 + every-iter steps 2+3 preserved" split correctly stated?
- Does §3.3 correctly preserve moment-of-capture (mistake/SKILL.md § P2) as an exception?

**Finding #2 (codex-proj-a13f0c91) — Scope Contract:**
- Does §2 now have the canonical frontmatter block (artifact_type / feature / goal / created-by / created-at)?
- Does §2 have all 5 body sections: `### In-Scope`, `### Out-of-Scope`, `### Decisions Locked`, `### Success Criteria`, `### Deferred`?
- Are Success Criteria observable (falsifiable smoke-test gates)?

**Finding #3 (codex-overall-5e2d77f4 + codex-proj-a13f0c91) — R1/R2/R3/R5 promoted:**
- R1: Is `preparation.maxIterations: 0 → state: Skipped` documented at the state-machine level (§3.2 + §5 + §6.2)?
- R2+R3: Is `workflow.chat.tasks[]` schema specified in §5 + §6.7? Are template updates enumerated in §7.3?
- R5: Is the Chat MEMORIZATION narrowed PASS path declared locally in `chat-mode.md` with §3.3 as the canonical statement?

**Finding #9 (worktree false-positive — the placeholder files):**
- Verify existence under the WORKTREE path (pre-annotated above as present).
- If confirmed present in worktree, record `disposition: addressed` (false-positive resolved by worktree pre-annotation).
- The **process finding** (iter2 brief must pre-annotate worktree paths for Codex) — confirm §8 Finding #9 dispute section acknowledges this.

---

## Additional reference files (read as needed)

- Target draft: `<worktree>/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter2.md`
- orchestration/SKILL.md: `<worktree>/.gobbi/projects/gobbi/skills/orchestration/SKILL.md`
- settings.default.json: `<worktree>/.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json`
- state.template.json: `<worktree>/.gobbi/projects/gobbi/skills/orchestration/templates/state.template.json`
- session.template.json: `<worktree>/.gobbi/projects/gobbi/skills/orchestration/templates/session.template.json`
- discussion/SKILL.md: `<worktree>/.gobbi/projects/gobbi/skills/discussion/SKILL.md`
- memorization/SKILL.md: `<worktree>/.gobbi/projects/gobbi/skills/memorization/SKILL.md`
- delegation/SKILL.md: `<worktree>/.gobbi/projects/gobbi/skills/delegation/SKILL.md`
- mistake/SKILL.md: `<worktree>/.gobbi/projects/gobbi/skills/mistake/SKILL.md`

Where `<worktree>` = `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb`

---

## Session-write discipline reminder

- All session writes MUST use the absolute worktree-relative session path above.
- Do NOT write to `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/...` (main tree).
- Do NOT use `pwd`-derived or relative paths.
- The correct write root is:
  ```
  /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter2/codex/
  ```
