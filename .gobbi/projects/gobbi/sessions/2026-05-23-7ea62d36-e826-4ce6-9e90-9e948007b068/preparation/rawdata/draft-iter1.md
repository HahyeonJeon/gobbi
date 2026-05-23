# Preparation Loop — Readiness Report (iter1)

> Session: `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`
> Feature: `gobbi-orchestration-workflow-improvements`
> Phase: Preparation, iter 1
> Locked Idea: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`

---

## Scope reference

Bundle A — 7 items (A–G), 15 checklist items, all LOCKED at Ideation iter3 PASS (Claude PASS + Codex PASS; 0 Critical/High/Medium between them).

- Idea scope contract: `ideation/artifacts/idea.md:33-93`
- Idea checklist (15 items): `ideation/artifacts/idea.md:243-262`
- Cross-Link Manifest (10 links): `ideation/artifacts/idea.md:311-326`
- Ideation staging fully populated: 5 decisions, 7 designs, 3 discussions, 0 references (see `ideation/staging/`)

Wrap-up promotes Ideation staging to project memory at session close. Preparation does NOT pre-promote those — they are read-only inputs here.

---

## Readiness summary

**Status: READY (1 gap closed inline; 0 deferred; 0 skipped; 0 RE-IDEATE).**

The 7-item scope decomposes into 14 edits + 1 new skill creation + 2 symlinks. All 6 edit-target skill files exist at canonical paths. All 4 delegation/template files exist. All cited anchor lines (gobbi Glossary, Skill Map § Cross-cutting, Step 4; evaluation Coverage Ownership Matrix; mistake P2; memorization Core Principles + Output paths "Path conventions"; wrap-up WORK Phase Steps 2/3) are empirically verified.

**One gap identified and closed**: the codex skill target file does not yet exist at the locked source-of-truth path. Resolution: `generate-now` STUB (frontmatter + 8 locked H2 outline + Execution-fill placeholders). Content writing remains Execution's deliverable per Idea's "content-complete" lock.

No `re-ideate` triggers found. No contradictions in Ideation output. Planning can decompose against the 15 checklist items as-locked.

---

## Design + memory readiness

### Inputs scanned

| Source | Path | Result |
|---|---|---|
| Ideation artifacts | `ideation/artifacts/idea.md` | 386-line locked PASS artifact, frontmatter `phase: ideation` `verdict: pass` (line 19-20) |
| Ideation staging — decisions | `ideation/staging/decisions/` | 5 files, including 3 mistake-candidates (`codex-rescue-agent-fire-and-forget...`, `leader-iter2-verification-claim...`, `memorization-delegation-prompts-must-load-memorization-skill`) and the iter1 user-redirects record |
| Ideation staging — design | `ideation/staging/design/` | 7 files, one per item A–G; all topics covered |
| Ideation staging — discussions | `ideation/staging/discussions/` | 3 files: codex-invocation-priority-redirect, scope-bundle-selection, wrap-up-step-2-5-escalation-shape |
| Ideation staging — references | `ideation/staging/references/` | empty — no external references staged (Idea references mistakes and `git/SKILL.md` via cross-link manifest, not external URLs) |
| Project mistakes | `.gobbi/projects/gobbi/mistakes/` | 2 active mistakes + README; both witnesses for Bundle A (codex-eval-session-write-path + manager-rm-rf-tracked-files) |
| Project memory baseline | `.gobbi/projects/gobbi/{features,design,rules,decisions,notes,backlogs,reviews,skills}/` | Mature project memory; `rules/` has `stub-redirect-format.md` (not relevant to Bundle A) |

### Edit-target verification (all PASS)

Every file the Idea's 15-item checklist edits is confirmed present at canonical path:

| Item | Target file | Empirical check |
|---|---|---|
| A | `.gobbi/projects/gobbi/skills/codex/SKILL.md` (NEW) | DOES NOT EXIST → gap addressed below |
| A | `.claude/skills/codex/SKILL.md` (NEW file symlink) | DOES NOT EXIST → Execution creates |
| A | `.agents/skills/codex` (NEW directory symlink) | `.agents/skills/` has 16 entries (`ls .agents/skills/ \| wc -l = 16`); count 16→17 post-ship confirmed |
| B | `.gobbi/projects/gobbi/skills/memorization/SKILL.md` | EXISTS, 303 lines. `## Core Principles` at line 54. Output paths § "Path conventions" subheading at line 226 (lowercase 'c') — Idea checklist item 10's anchor "Path Conventions" is a tolerable casing match; Planning should standardize on the file's actual heading text. |
| B | `.gobbi/projects/gobbi/skills/mistake/SKILL.md` | EXISTS, 133 lines. `### P2 — Detect a correction during work` at line 68 — confirmed insertion site for reciprocal link. |
| C | `.gobbi/projects/gobbi/skills/delegation/SKILL.md` | EXISTS, 301 lines. `## Load Directives (in order — load top to bottom before any other action)` at line 84; `## Core Principles` at line 15; `## The Load Directives Block` at line 79 — multiple candidate insertion sites. |
| C | `.gobbi/projects/gobbi/skills/delegation/templates/{assistant,leader,executor,evaluator}.md` | ALL 4 exist. Each has `## Load Directives (...)` H2 (assistant:34, leader:25, executor:26, evaluator:53). |
| D | `.gobbi/projects/gobbi/skills/wrap-up/SKILL.md` | EXISTS, 363 lines. **Step structure caveat**: `wrap-up/SKILL.md` has NO `### Step N` headers; "Steps" are numbered rows inside a WORK-Phase table (lines 138+). Idea's "Step 2.5 between Step 2 and Step 3" anchors to the WORK Phase table's row 2 (staging-inventory) → row 3 (feature destination). Planning must call this out so Execution does not search for a missing `### Step 2.5` heading. |
| E | `.gobbi/projects/gobbi/skills/evaluation/SKILL.md` | EXISTS, 589 lines. `### Coverage Ownership Matrix` at line 98. Confirmed insertion site for new row. |
| F | `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | EXISTS, 254 lines. `## Glossary` at line 15; `## Session Bootstrap Order` at line 32. Item F moves Glossary to after Session Bootstrap Order. |
| G | `.gobbi/projects/gobbi/skills/gobbi/SKILL.md § Step 4` | Lines 99-114 — confirmed: 2 questions (eval mode + git mode) + discussion-modes note. Re-write target. |
| (item 3) | `.gobbi/projects/gobbi/skills/gobbi/SKILL.md § Skill Map § Cross-cutting` | `## Skill Map` at line 161; `### Cross-cutting skills` at line 173. Confirmed insertion site for new `codex` row. |
| (item 13 verify-only) | `.gobbi/projects/gobbi/skills/orchestration/templates/settings.default.json` | VERIFIED: `mode: "auto"` (line 3); `workflow.ideation.evaluate.mode: "always"` (line 7-9 region); `git.pr: {open: false, draft: false}` (line ~55). No edit — verify-only. |

### Cross-Link Manifest readiness (10 links — all targets confirmed)

Idea § Cross-Link Manifest (lines 312-326). Each "From → To" target verified to exist:

| Link | Target empirically confirmed |
|---|---|
| 1, 2 | `memorization/SKILL.md` ↔ `mistake/SKILL.md` P2 — both files present, P2 at line 68 |
| 3 | `memorization/SKILL.md § Procedure` — `## MEMORIZATION Phase` at line 136 (procedure section) |
| 4, 5, 6 | `evaluation/SKILL.md § Type (5 values)` at line 344-352 + `Slug + collision policy` at lines 385-393 + Domain routing at line 356+ — all verified by direct grep |
| 7 | `evaluation/SKILL.md § Coverage Ownership Matrix § Memorization staging shape + naming` — Matrix section at line 98; the new row is item E's deliverable |
| 8 | `mistakes/codex-eval-session-write-path-nested-in-worktree.md` — EXISTS |
| 9 | `git/SKILL.md` background-mode guidance — `git/SKILL.md` exists at `.gobbi/projects/gobbi/skills/git/SKILL.md` (loop skill in Skill Map) |
| 10 | `gobbi/SKILL.md § Skill Map § Cross-cutting` → `codex/SKILL.md` — Skill Map § Cross-cutting at line 173, codex skill stub staged below |

### Coverage Ownership Matrix vocabulary verification (5 Types — re-confirmed iter3)

`evaluation/SKILL.md` lines 344-352 enumerate exactly: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`. Item D's mechanical/judgment-required split (`scenario_gap` + `checklist_gap` + `general` mechanical; `design_flaw` + `assumption_risk` judgment-required) aligns with the source. No vocabulary drift detected.

### Gaps identified (Design + Memory)

**None.** Every artifact downstream loops will read is staged or already in project memory. Ideation staging is complete for all 7 items.

---

## Execution skills readiness

### Required skills per item (executor's load directives)

For each Bundle A item, the executor will load these skills at WORK start:

| Item | Skills needed | Coverage |
|---|---|---|
| A (codex skill content + symlinks) | `claude` (workspace doc standard) + `interview/templates/project-skill.md` (project-skill template) + `git/SKILL.md` (symlink discipline) | ALL EXIST |
| B (memorization moment-of-capture) | `memorization/SKILL.md` (target) + `mistake/SKILL.md` (cross-link target) + `claude` doc standard | ALL EXIST |
| C (delegation hard gate) | `delegation/SKILL.md` (target) + 4 delegation templates | ALL EXIST |
| D (wrap-up Step 2.5) | `wrap-up/SKILL.md` (target) + `evaluation/SKILL.md` (Type vocabulary + Slug + collision + Domain routing source) | ALL EXIST |
| E (Coverage Ownership Matrix row) | `evaluation/SKILL.md` (target) + `memorization/SKILL.md` (cross-link target) | ALL EXIST |
| F (Glossary move) | `gobbi/SKILL.md` (target only — single Edit) | EXISTS |
| G (Step 4 rewrite) | `gobbi/SKILL.md` (target) + `orchestration/SKILL.md § Step 1` (reference for customize gate) + `orchestration/templates/settings.default.json` (defaults source) | ALL EXIST |

### Project-specific skills inventory (scanned)

`.gobbi/projects/gobbi/skills/` contains 16 skills: codex is the only NEW addition. No other project-skill gaps.

### Gaps identified (Execution Skills)

**One gap — closed inline this loop.**

| Gap | Severity | Proposed resolution | Action taken |
|---|---|---|---|
| `codex` skill target file does not exist at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (Bundle A item A creates it) | **medium** (blocks Item A; Planning needs a known target path to decompose against; Execution needs an editable file rather than a Write-from-zero pattern) | `generate-now` STUB (frontmatter + 8 locked H2 outline + Execution-fill placeholders). NOT content-complete — content is Execution's deliverable per Idea Decision #2 ("Content-complete codex skill"). | Staged at `sessions/.../preparation/staging/skills/codex/SKILL.md` (12 H2 sections including STUB-metadata block + Constraints; the STUB-metadata + Constraints sections are placeholders Execution will remove/repurpose to land on the locked 8-section count). |

**Per the Preparation skill's narrow promote-now exception** (`preparation/SKILL.md:60-62`): when a `generate-now` decision produces a project-specific skill, that skill is promoted to project memory BEFORE Planning starts. Manager owns the copy step `sessions/.../preparation/staging/skills/codex/SKILL.md` → `.gobbi/projects/gobbi/skills/codex/SKILL.md` at Preparation EXIT → Planning transition.

After promotion, the stub at the source-of-truth path lets:
- Planning reference an existing file in task scopes (Item A becomes "fill content of file X" rather than "create file X").
- Execution open the file with Read + Edit rather than Write-from-zero — preserves the locked H2 ordering and removes the "did Execution forget a section?" failure mode.

---

## Generated this loop

| Path | Type | Description |
|---|---|---|
| `sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md` | Skill stub | Frontmatter + 8 locked H2 sections (Idea Design A) + per-section Execution-fill comments citing the anchored insights from idea.md. STUB metadata block flagged for removal pre-ship. ~110 lines. To be promoted by manager at Preparation PASS exit to `.gobbi/projects/gobbi/skills/codex/SKILL.md`. |

No other staging fixes. No `staging/decisions/` writes this loop (all locked decisions live in `ideation/staging/decisions/` and will be promoted by Wrap-up at session close).

---

## Out of scope gaps

None this loop. The following were considered and explicitly NOT acted on (consistent with Idea § Out-of-Scope):

- Project-wide skill audits beyond Bundle A — defer; not Preparation's job.
- Adding a `codex` row to `.claude/skills/` index files — there is no index file; `.claude/skills/` is a flat directory of subdirs/symlinks. Item A's symlink creation is the only `.claude/skills/` write.
- Backfilling missed memorization from prior sessions — that is exactly what Item D's Wrap-up Step 2.5 will detect at session close; not Preparation's job to backfill historical gaps.

---

## Open concerns for Planning DISCUSSION

These are NOT gaps blocking Preparation — Planning should surface them as DISCUSSION topics before decomposing.

1. **Wrap-up "Step 2.5" placement anchor (Item D).** `wrap-up/SKILL.md` does not use `### Step N` headers; "Steps" are rows in a numbered table inside the `## WORK Phase` section (line 118+). Idea checklist item 8 says "insert Step 2.5 between Steps 2 and 3" — Planning should clarify with Execution whether Step 2.5 is (a) a new numbered row inserted at position 2.5 in the existing table, (b) a new `### Step 2.5` H3 inserted between the table and the existing WORK discipline subsection at line 176, or (c) a new content block right after the table row for Step 2. **Recommendation: option (b)** — adding an H3 makes Step 2.5 grep-able (validation method in Idea checklist row 8 uses `grep "Step 2.5"`) and matches the prose-block weight of the new logic (4-category gap table + classification + auto-backfill + NEEDS_CONTEXT + gap report).

2. **Memorization Path Conventions anchor casing (Item E cross-link 7).** `memorization/SKILL.md:224` heading is `**Path conventions**` (bold paragraph, lowercase 'c'), not `## Path Conventions` H2. Cross-link 7 in Idea § Cross-Link Manifest uses "Path Conventions" with capital 'C'. Planning should either (a) normalize the link target to match the file ("Path conventions" lowercase), or (b) upgrade the in-file heading to `### Path Conventions` H3 so it has a stable anchor. **Recommendation: option (b)** — bold paragraphs are not stable cross-link anchors; promote to H3.

3. **Coverage Ownership Matrix exact cell text (Item E).** Idea Design E (line 295-296) explicitly flags this as an open concern for Planning to confirm with user: the exact text of the new row "Memorization staging shape + naming → Consistency + Aesthetics". Planning DISCUSSION should propose precise column values and confirm with user.

4. **STUB delivery contract (Item A).** The codex stub staged this loop has 12 H2 sections (8 locked + Constraints + STUB metadata block; the STUB metadata block explicitly tells Execution to remove itself before ship). Validation method in Idea checklist item 1 is `grep -c "^## " ... = 8`. Planning should confirm the Execution task for Item A explicitly removes the STUB metadata block and the Constraints (or merges Constraints into Anti-patterns) so the post-ship file lands exactly on 8 H2 sections. **Recommendation**: Planning task A-content writes the 8 locked sections in place AND deletes the STUB metadata block; Constraints is either (a) merged into Anti-patterns/Sandbox+CWD discipline or (b) retained as a 9th section — Execution decides based on natural section weight.

5. **Symlink semantics across Claude/Codex (Item A check 2).** Two symlinks are mandatory:
   - File symlink: `.claude/skills/codex/SKILL.md → ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` (3-up: `.claude/skills/codex/` → `.claude/skills/` → `.claude/` → repo root → `.gobbi/...`).
   - Directory symlink: `.agents/skills/codex → ../../.gobbi/projects/gobbi/skills/codex` (2-up: `.agents/skills/codex` → `.agents/skills/` → `.agents/` → repo root → `.gobbi/...`). Pattern matches the 16 existing `.agents/skills/` symlinks (all use `../../.gobbi/projects/gobbi/skills/{slug}`).
   - Validation: `ls .agents/skills/ | wc -l` returns 17 post-ship; `readlink .claude/skills/codex/SKILL.md` resolves; `readlink .agents/skills/codex` resolves.

---

## Decisions log

This is the leader's first-pass readiness scan. No user-facing AskUserQuestion exchanges occurred during this leader's WORK — the manager (Auto mode) presents Sub-step D's gap-resolution table to the user via AskUserQuestion when this leader returns.

### Proposed gap-resolution table (for manager to surface via AskUserQuestion)

| # | Gap | Category | Severity | Proposed resolution | Rationale |
|---|---|---|---|---|---|
| 1 | `codex` skill source-of-truth file does not exist at `.gobbi/projects/gobbi/skills/codex/SKILL.md` | execution-skill | medium | `generate-now` (STUB only — staged at `sessions/.../preparation/staging/skills/codex/SKILL.md`; manager promotes to source-of-truth path at Preparation EXIT → Planning transition per `preparation/SKILL.md:60-62`) | Provides a known target file for Planning to decompose against and for Execution to Edit-in-place; preserves locked 8-section structure. Content remains Execution's deliverable per Idea Decision #2. |

### Other findings (no user decision needed)

- All 6 edit-target skill files exist at canonical paths.
- All 4 delegation templates exist.
- All 10 cross-link manifest targets confirmed.
- 5-Type vocabulary (`scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`) verified at `evaluation/SKILL.md:344-352`.
- Settings defaults (`mode: "auto"`, `workflow.ideation.evaluate.mode: "always"`, `git.pr: {open:false, draft:false}`) verified at `orchestration/templates/settings.default.json` — no edit needed (Idea checklist item 13 is verify-only).
- `.agents/skills/` baseline = 16; post-ship = 17 (matches Idea § I14).
- Mistake-discipline observed: 3 mistake-candidates already staged in `ideation/staging/decisions/` (will be promoted by Wrap-up); no Preparation-phase mistakes detected this loop.

### Cross-system divergence notes (deferred to EVALUATION)

Both Claude and Codex Ideation eval iter3 PASSED unanimously (0 Critical/High/Medium between them). Iter2 had a Critical vocabulary regression that was repaired iter3 by reading `evaluation/SKILL.md:344-352` directly. The Preparation EVALUATION sub-phase will surface any new readiness gaps the leader missed.

### Open concerns (deferred to Planning DISCUSSION)

5 concerns listed above (Wrap-up Step 2.5 placement / Path conventions anchor / Coverage Ownership cell text / STUB delivery contract / Symlink semantics). None block Preparation EXIT.

### RE-IDEATE triggers

**None.** Ideation output is sound. Bundle A scope is concrete enough for Planning to decompose against.
