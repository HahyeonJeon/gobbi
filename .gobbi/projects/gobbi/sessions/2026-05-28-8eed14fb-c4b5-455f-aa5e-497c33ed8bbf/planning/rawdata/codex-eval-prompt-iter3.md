# Codex Evaluator — Planning iter3 (2026-05-28-8eed14fb)

## Identity

You are the **Codex-side evaluator** for Planning iteration 3 of session
`2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf`. This is the final iteration
(iter cap = 3). You are a fresh evaluator with no bias toward the creator.

---

## WORKTREE-PATH DISCIPLINE (mandatory — read before any path)

The session worktree lives at:

```
WORKTREE=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb
```

The main repository root (for `--cd` anchoring) is:

```
MAIN=/playinganalytics/git/gobbi
```

ALL session writes MUST use absolute main-tree paths under:

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/
```

Do NOT derive paths from `pwd` or use relative paths. The worktree CWD is NOT
the session-write root.

**Known path facts (do not re-flag as defects):**

1. `chat-mode.md` and `auto-mode.md` placeholder files exist at:
   - `$WORKTREE/.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`
   - `$WORKTREE/.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`
   These are intentional 598-byte and 636-byte placeholders that T1 and T2 will
   replace. They exist in the WORKTREE. The main tree may not have them; that
   is not a defect.

2. `plugins/` tree was deleted in PR #264. No plugin-side mirroring is needed.
   Any reference to `plugins/gobbi/skills/orchestration/` is a stale historical
   note, not a live check. Do NOT re-flag the absence of `plugins/`.

3. `.claude/skills/claude/SKILL.md` does NOT exist (FLAG-2 in
   `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` § Skill Map line 187). This is
   intentional. Plan iter3 handles this via prose NOTE above each affected YAML
   block (G5). Do NOT re-flag FLAG-2 as a new finding.

---

## Task

Evaluate `draft-iter3.md` (664 lines) across all 7 perspectives + Overall using
the 4-stage evaluation procedure from `evaluation/SKILL.md`.

This is **iter 3** — `n ≥ 2` semantics apply. You MUST:
- Read all iter2 codex per-perspective files for Stage 1 inheritance
- Judge every iter2 `open` finding's current `disposition:` in iter3
- Apply the G1-G6 verification block specifically (see below)

**Artifact under evaluation:**

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter3.md
```

**iter2 codex inheritance source (Stage 1 inheritance, all 8 files):**

```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter2/codex/
```

Files: `project.md`, `structure.md`, `performance.md`, `aesthetics.md`,
`usage.md`, `consistency.md`, `risk.md`, `overall.md`

---

## Load Directives

Before evaluating, load these skills (use absolute paths from WORKTREE):

1. **Principles:**
   `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`

2. **Mistake skill:**
   `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`

3. **Evaluation skill:**
   `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`

4. **Planning evaluation child doc:**
   `/playinganalytics/git/gobbi/.agents/skills/planning/evaluation.md`

5. **Planning workflow doc:**
   `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md`

6. **Gobbi skill (for FLAG-2 reference):**
   `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md`

7. **Project rules:**
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`

8. **Project mistakes (all):**
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
   - `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/prose-reclassification-target-is-project-level-notes.md`

9. **Ideation artifact (Scope Contract source):**
   `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`

---

## User-Locked Decisions (do NOT re-litigate)

These decisions are locked by the user and must not be re-opened as findings:

| Lock | Source | Detail |
|---|---|---|
| R1 | Idea iter2 | `preparation.maxIterations: 0` maps to `state: Skipped` at loop-entry guard; no new settings field |
| R2+R3 | Idea iter2 | `workflow.chat.tasks[]` array-of-slices in BOTH `session.json` and `state.json`; per-task sub-record shape matches existing `workflow.{loop}` |
| R5 | Idea iter2 | Chat MEMORIZATION narrowed PASS path declared locally in `chat-mode.md`; `memorization/SKILL.md` stays untouched |
| D-A | User | task-record memory type = session-local only; no promotion to project memory; `memorization/SKILL.md` untouched |
| D-B | User | Chat session layout = `sessions/{date}-{ssid}/chat/tasks/{NN}-{slug}/{ideation,planning,execution}/{rawdata,staging,artifacts,evaluation}/` — symmetric quartet rooted under `chat/` |
| 9 brief locks | Idea iter1 | Chat conversational; full Ideation per task; Prep skipped; mini Plan + Execute; Chat MEMORIZATION local override; explicit-end-of-session Wrap-up; Auto codifies Always-Ask; same `settings.json` schema; mode affects workflow structure |

---

## G1-G6 Verification — Mandatory Grep Check

G1-G6 are the specific iter3 fixes. For each, run the literal grep to confirm
the fix landed. Mark each as **addressed** or **regression** with evidence.

**G1 — mode-key extraction (no recursive jq):**
Verify the recursive `.mode` form (e.g., `.. | .mode?`) is ABSENT from T4
verification commands. Verify the explicit `.chat.mode` / `.auto.mode` form IS
present.

```bash
DRAFT=/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter3.md

# Must be 0 — recursive jq form gone
grep -c '\.\. *|' "$DRAFT"

# Must be >= 1 — explicit path extraction present
grep -c '\.chat\.mode' "$DRAFT"
grep -c '\.auto\.mode' "$DRAFT"
```

**G2 — semantic models-block guard (no diff-line grep):**
Verify the diff-line grep for `"models"` string is ABSENT from T4 verification.
Verify the `jq -S` semantic comparison IS present.

```bash
# Must be 0 — diff-line grep form gone (was: grep lines containing "models")
grep -c 'grep.*models.*diff\|diff.*grep.*models' "$DRAFT"

# Must be >= 1 — jq -S semantic comparison present
grep -c 'jq -S' "$DRAFT"
```

**G3 — absolute paths replacing placeholders:**
Verify NO angle-bracket placeholders remain in verification-command lines.

```bash
# Must be 0 — no <chat-mode.md> / <auto-mode.md> / <SKILL.md> / <worktree> etc.
# (angle-bracket placeholders in verification contexts)
grep -nE '<(chat-mode|auto-mode|SKILL|settings|state\.template|session\.template|new-backlog|archived|worktree|pre-T[45]-rev)' "$DRAFT"
```

**G4 — /tmp/* removal + PRE_TX_REV bash vars:**
Verify no `/tmp/t4-pre.txt` or `/tmp/t5-pre.txt` remain.
Verify `PRE_T4_REV` and `PRE_T5_REV` ARE present as in-session variables.

```bash
# Must be 0
grep -c '/tmp/t[45]-pre' "$DRAFT"

# Must be >= 1 each
grep -c 'PRE_T4_REV' "$DRAFT"
grep -c 'PRE_T5_REV' "$DRAFT"
```

**G5 — FLAG-2 NOTE outside YAML blocks:**
Verify each task (T1/T2/T3/T4/T5) has the FLAG-2 note as prose ABOVE the YAML
block, not embedded in `required-skills:`.

```bash
# Must be >= 5 — one per affected task (T1/T2/T3/T4/T5) in prose context
grep -c 'FLAG-2' "$DRAFT"

# Must be 0 — claude skill must NOT appear inside required-skills lists
grep -A 20 'required-skills:' "$DRAFT" | grep -c '^\s*-\s*claude\s*$'
```

**G6 — printf compare instead of triple-escape jq:**
Verify the triple-escaped jq form is gone. Verify `printf` comparison IS present
for evaluate.mode assertion.

```bash
# Must be 0 — no \\\\-type triple-escape sequences in verification commands
grep -c '\\\\\\\\' "$DRAFT"

# Must be >= 1 — printf form present
grep -c "printf 'always" "$DRAFT"
```

Run ALL six grep checks. Report pass/fail for each with the actual count
returned. A count that contradicts the "Must be" expectation = regression.

---

## Output Paths

Write exactly 8 files. ALL paths are absolute main-tree paths.

Session base:
```
/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/evaluation/iter3/codex/
```

Files to write (canonical perspective names — no other names):

1. `project.md`
2. `structure.md`
3. `performance.md`
4. `aesthetics.md`
5. `usage.md`
6. `consistency.md`
7. `risk.md`
8. `overall.md`

Each per-perspective file MUST contain:
- `## Artifact Summary` with W/W/H
- `## Memory reads` register
- `## Locked Frame (Stage 1)` header (exact header name — Stage n+1 reads by
  this exact header)
- `## Evaluation (Stage 2)` with per-scenario/check evidence
- Inherited finding disposition table (all iter2 `open` findings for this
  perspective, with current `disposition:` and evidence)
- Typed findings with: Type / Domain / Confidence / Severity / Evidence /
  Disposition
- `## Low-confidence appendix` section (may be empty)
- `VERDICT: <PASS|REVISE|FAIL>` line (bare, last line of the file or very near
  last)

`overall.md` MUST contain:
- `## Artifact Summary` (from Stage 0)
- `## Memory reads`
- `## Locked Frame (Stage 1)` (scenarios used at Overall)
- `## Stage 3 Overall Evaluation` with Karpathy checks + cross-perspective
  tensions + strengths preserve list
- Inherited overall finding disposition table
- Overall findings with full metadata
- `## Low-confidence appendix`
- `VERDICT: <PASS|REVISE|FAIL>` line

---

## Verdict Computation Rules (from evaluation/SKILL.md)

- Any `Critical` finding with confidence >= 75 → `FAIL`
- Any `High` finding with confidence >= 50 → `REVISE`
- Otherwise → `PASS`
- Only `open` / `disputed` / newly-surfaced findings count; `addressed` /
  `deferred` / `superseded` do NOT contribute to the verdict

---

## Stage 1 Inheritance Protocol (iter3, n=3)

For each perspective, read the iter2 codex file at:
```
.../planning/evaluation/iter2/codex/{perspective}.md
```

- Carry forward all findings with `disposition: open`
- Carry forward all Locked Frame scenarios (scenarios still apply to iter3
  unless explicitly resolved)
- For each carried finding, judge its current `disposition:` against draft-iter3
- Use `addressed` only when the specific fix is verified by the G1-G6 grep
  checks or by close-reading evidence

Key iter2 open findings to evaluate for address/regression in iter3:

| iter2 Finding | Perspective | What iter3 claims to fix |
|---|---|---|
| codex-risk-004 | Risk | G1: explicit `.chat.mode`/`.auto.mode` extraction replaces recursive `.. | .mode?` |
| codex-risk-005 | Risk | G4: `/tmp/t4-pre.txt`/`/tmp/t5-pre.txt` replaced with in-session `PRE_T4_REV`/`PRE_T5_REV` bash vars |
| codex-risk-006 | Risk | G2: diff-line grep replaced with `jq -S` semantic comparison |
| codex-overall-iter2-001 | Overall | G1 fix |
| codex-overall-iter2-002 | Overall | G2 fix |
| codex-overall-iter2-003 | Overall | G4 fix |

---

## Evaluation Procedure

Follow the 4-stage procedure from `evaluation/SKILL.md`:

**Stage 0:** Read `draft-iter3.md` in full. Extract W/W/H. Read prior-loop
artifacts. Record memory reads.

**Stage 1:** For each of the 7 perspectives in order (Project → Structure →
Performance → Aesthetics → Usage → Consistency → Risk): build/inherit the
Locked Frame. Carry forward iter2 open findings. CRUD scenarios. Write
`## Locked Frame (Stage 1)` to each output file.

**Stage 2:** Walk each perspective's Frame. Judge each check yes/no with
evidence. Run the G1-G6 grep checks (see above) for Risk and appropriate
perspectives. Compute per-perspective verdicts.

**Stage 3 (Overall):** Cross-perspective tensions, Karpathy checks, strengths
preserve list. Compute overall verdict. Write `overall.md`.

---

## Anti-Patterns to Avoid

- Do NOT re-flag the absence of `.claude/skills/claude/SKILL.md` (FLAG-2 —
  known and handled by G5 in iter3)
- Do NOT re-flag the `plugins/` tree absence (PR #264 deletion — correct)
- Do NOT re-flag `chat-mode.md` / `auto-mode.md` as "missing" — they exist as
  placeholders in the worktree
- Do NOT mark a finding `addressed` without grep or close-reading evidence
- Do NOT skip perspectives or merge multiple perspectives into one file
- Do NOT suppress findings because iter3 is the final iteration — adversarial
  stance is mandatory regardless of iter position
- Do NOT omit the inherited finding disposition table

---

## Final Reminder

This is a READ-ONLY evaluation of `draft-iter3.md`. Your ONLY writes are the
8 output files at the paths specified above. You do not modify the artifact.
You do not write to `session.json`. You do not write to project memory.

After writing all 8 files, verify:
1. All 8 files exist at the output paths
2. All 8 files are > 0 bytes
3. Each file contains `VERDICT:` line
4. `overall.md` contains `VERDICT:` line

Report any missing/empty files as an error — do not silently succeed.
