# Preparation Loop — Readiness Report (iter2)

> Session: `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`
> Feature: `gobbi-orchestration-workflow-improvements`
> Phase: Preparation, iter 2 (REVISE re-entry from iter1)
> Locked Idea: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`

---

## Iter2 changelog (surgical fixes — no new design)

This iter is a SURGICAL re-stamp. Iter1 verdict was REVISE (Claude PASS + Codex REVISE → REVISE). All iter1 readiness findings (scope-reference, edit-target verification, cross-link manifest readiness, vocabulary verification, execution-skill inventory, out-of-scope) carry forward unchanged. Only the four fixes below were applied.

| Fix | Source finding | Action | Verification |
|---|---|---|---|
| 1 | COD-PREP-OVERALL-001, COD-PREP-STRUCT-001/002, Claude F-S-01 | Reduced codex stub from 10 H2 sections to exactly 8 (the locked Idea Design A set). Removed: `## Cost + sandbox budget awareness` (folded as sub-bullets inside `## Use cases`); removed `## STUB metadata` (was a self-removing artifact in iter1). | `grep -c "^## " staging/skills/codex/SKILL.md` = 8 |
| 2 | COD-PREP-OVERALL-001, Claude F-R-01 | Frontmatter: ADDED `when-to-load:` field; REMOVED `allowed-tools:` field (non-canonical; no other gobbi skill uses it); kept `name:` and `description:`. | `grep -E "^name:\|^description:\|^when-to-load:"` returns 3 lines; `grep "^allowed-tools:"` returns 0 lines. |
| 3 | COD-PREP-OVERALL-002 (line citation drift) | Corrected this draft's reference to `memorization/SKILL.md` "Path conventions" subheading: was `line 226` in iter1, now `line 224` (verified via `grep -n "Path conventions"`). Also lowercased the heading text to match the file (`Path conventions`, not `Path Conventions`) per Claude F-S-02. | grep verification recorded in `## Verification gates` below. |
| 4 | COD-PREP-OVERALL (Karpathy reclassification) | Iter1 Open Concern #4 (STUB delivery contract — 12 sections vs. 8) was misclassified as a Planning-DISCUSSION concern; Codex correctly identified it as a Preparation-phase fix. Fix-1 above closes it. Open Concern #4 is now marked RESOLVED in `## Open concerns for Planning DISCUSSION` below. Remaining concerns for Planning: 1, 2, 3, 5. | Section rewrite below. |

---

## Scope reference

Unchanged from iter1. Bundle A — 7 items (A–G), 15 checklist items, LOCKED at Ideation iter3 PASS (Claude PASS + Codex PASS; 0 Critical/High/Medium between them).

- Idea scope contract: `ideation/artifacts/idea.md:33-93`
- Idea checklist (15 items): `ideation/artifacts/idea.md:243-262`
- Cross-Link Manifest (10 links): `ideation/artifacts/idea.md:311-326`
- Ideation staging fully populated: 5 decisions, 7 designs, 3 discussions, 0 references.

Wrap-up promotes Ideation staging to project memory at session close. Preparation does NOT pre-promote those — they are read-only inputs here.

---

## Readiness summary

**Status: READY (1 gap closed inline; 0 deferred; 0 skipped; 0 RE-IDEATE).**

Iter2 leaves the readiness verdict unchanged from iter1 — the only changes are surgical fixes to the staged stub's section count + frontmatter and to this draft's line citations. The 7-item scope still decomposes into 14 edits + 1 new skill creation + 2 symlinks. All 6 edit-target skill files exist at canonical paths. All 4 delegation/template files exist. All cited anchor lines are empirically verified (now with the corrected `line 224` for `memorization/SKILL.md § Path conventions`).

**One gap identified and closed (unchanged)**: the codex skill target file does not yet exist at the locked source-of-truth path. Resolution: `generate-now` STUB at the locked 8-section shape (frontmatter with `name`/`description`/`when-to-load` + the 8 locked H2 sections + Execution-fill placeholders). Content writing remains Execution's deliverable per Idea Decision #2.

No `re-ideate` triggers. No contradictions in Ideation output. Planning can decompose against the 15 checklist items as-locked.

---

## Design + memory readiness

### Inputs scanned

Unchanged from iter1. See `draft-iter1.md § Inputs scanned`.

### Edit-target verification (all PASS — one citation corrected)

All entries unchanged from iter1 except the memorization-skill row:

| Item | Target file | Empirical check |
|---|---|---|
| B | `.gobbi/projects/gobbi/skills/memorization/SKILL.md` | EXISTS, 303 lines. `## Core Principles` at line 54. Output paths § **`Path conventions`** subheading at **line 224** (lowercase 'c') — iter2 corrects iter1's stale `line 226` and standardizes on the file's actual lowercase heading text per Claude F-S-02. Idea checklist item 10's anchor "Path Conventions" should normalize to "Path conventions" at Planning time, OR Planning may upgrade the in-file heading to `### Path conventions` H3 for a stable anchor. |

All other rows unchanged. See `draft-iter1.md § Edit-target verification`.

### Cross-Link Manifest readiness (10 links — all targets confirmed)

Unchanged from iter1.

### Coverage Ownership Matrix vocabulary verification

Unchanged from iter1. 5 Types verified at `evaluation/SKILL.md:344-352`: `scenario_gap`, `checklist_gap`, `design_flaw`, `assumption_risk`, `general`.

### Gaps identified (Design + Memory)

**None.** Unchanged from iter1.

---

## Execution skills readiness

### Required skills per item

Unchanged from iter1. All 7 items' required skills exist.

### Project-specific skills inventory

Unchanged from iter1. `.gobbi/projects/gobbi/skills/` contains 16 skills; codex is the only NEW addition.

### Gaps identified (Execution Skills)

**One gap — closed inline this loop. Stub shape corrected this iter.**

| Gap | Severity | Proposed resolution | Action taken |
|---|---|---|---|
| `codex` skill target file does not exist at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (Bundle A item A creates it) | **medium** | `generate-now` STUB — frontmatter (`name`/`description`/`when-to-load`; NO `allowed-tools:`) + EXACTLY the 8 locked H2 sections (When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / Anti-patterns / Constraints). Execution fills content; structure is locked. | Staged at `sessions/.../preparation/staging/skills/codex/SKILL.md`. **Iter2 corrected the stub from 10 sections to 8** by folding "Cost + sandbox budget awareness" into the `## Use cases` body (sub-bullets) and removing the self-referential STUB-metadata block. Manager promotes the staged file to `.gobbi/projects/gobbi/skills/codex/SKILL.md` at Preparation EXIT → Planning transition per `preparation/SKILL.md:60-62`. |

After promotion, the stub at the source-of-truth path lets:
- Planning reference an existing file with the locked 8-section shape (Item A becomes "fill content of file X" rather than "create file X and decide structure").
- Execution open the file with Read + Edit rather than Write-from-zero — preserves the locked H2 ordering and removes the "did Execution forget a section?" failure mode.

---

## Generated this loop

| Path | Type | Description |
|---|---|---|
| `sessions/.../preparation/staging/skills/codex/SKILL.md` | Skill stub (iter2 overwrite) | Frontmatter (`name` + `description` + `when-to-load`; NO `allowed-tools`) + **EXACTLY 8 H2 sections** per Idea Design A locked order: When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD discipline / Hang + timeout discipline / Use cases (Cost + sandbox budget awareness folded in as sub-bullets) / Anti-patterns / Constraints. Each section has Execution-fill comments anchoring the witnesses from `idea.md` (I1–I14, E1–E5). |
| `sessions/.../preparation/rawdata/skill-stub-iter1.md` | Audit copy | Pre-overwrite snapshot of iter1's 10-section stub. Preserved for audit trail. |
| `sessions/.../preparation/rawdata/draft-iter2.md` | Draft (this file) | iter2 draft of the preparation readiness report with corrected citations + iter2 changelog + Open Concern #4 reclassification. |

No other staging fixes. No `staging/decisions/` writes this loop.

---

## Out of scope gaps

Unchanged from iter1. None this loop.

---

## Open concerns for Planning DISCUSSION

Iter1 had 5 concerns. Iter2 reclassifies Concern #4 as Preparation-phase (resolved this iter); 4 remain for Planning.

1. **Wrap-up "Step 2.5" placement anchor (Item D).** `wrap-up/SKILL.md` does not use `### Step N` headers; "Steps" are rows in a numbered table inside `## WORK Phase` (line 118+). Idea checklist item 8 says "insert Step 2.5 between Steps 2 and 3". Planning options: (a) new numbered row at position 2.5 in the existing table; (b) new `### Step 2.5` H3 between the table and the existing WORK discipline subsection at line 176; (c) new content block after the table row for Step 2. **Recommendation: option (b)** — H3 makes Step 2.5 grep-able (Idea checklist validation uses `grep "Step 2.5"`) and matches the prose-block weight of the new logic.

2. **Memorization Path conventions anchor casing (Item E cross-link 7).** `memorization/SKILL.md:224` heading is `**Path conventions**` (bold paragraph, lowercase 'c'), not `## Path Conventions` H2. Cross-link 7 in Idea § Cross-Link Manifest uses "Path Conventions" with capital 'C'. Planning should either (a) normalize the link target to match the file (lowercase "Path conventions"), or (b) upgrade the in-file heading to `### Path conventions` H3 for a stable anchor. **Recommendation: option (b)** — bold paragraphs are not stable cross-link anchors; promote to H3.

3. **Coverage Ownership Matrix exact cell text (Item E).** Idea Design E (line 295-296) explicitly flags this as an open concern for Planning to confirm with user: the exact text of the new row "Memorization staging shape + naming → Consistency + Aesthetics". Planning DISCUSSION should propose precise column values and confirm with user.

4. ~~**STUB delivery contract (Item A).**~~ **RESOLVED THIS ITER (Preparation-phase fix, not Planning-DISCUSSION).** Per Codex iter1 reclassification, the stub's structural compliance with the locked 8-section shape is a Preparation deliverable, not a Planning concern. Iter2 fix-1 staged the stub at exactly 8 H2 sections; `grep -c "^## "` now returns 8. Execution-phase task A-content writes content INTO the existing locked sections and does not re-decide structure.

5. **Symlink semantics across Claude/Codex (Item A check 2).** Two symlinks are mandatory:
   - File symlink: `.claude/skills/codex/SKILL.md → ../../../.gobbi/projects/gobbi/skills/codex/SKILL.md` (3-up).
   - Directory symlink: `.agents/skills/codex → ../../.gobbi/projects/gobbi/skills/codex` (2-up). Pattern matches the 16 existing `.agents/skills/` symlinks.
   - Validation: `ls .agents/skills/ | wc -l` returns 17 post-ship; both `readlink` calls resolve.

---

## Decisions log

This is iter2 surgical re-stamp. No new user-facing decisions this iter; the manager surfaces only Sub-step D's existing gap-resolution table when this leader returns.

### Proposed gap-resolution table (unchanged from iter1)

| # | Gap | Category | Severity | Proposed resolution | Rationale |
|---|---|---|---|---|---|
| 1 | `codex` skill source-of-truth file does not exist at `.gobbi/projects/gobbi/skills/codex/SKILL.md` | execution-skill | medium | `generate-now` STUB at the locked 8-section shape (now empirically compliant after iter2 fix-1); manager promotes to source-of-truth path at Preparation EXIT → Planning transition per `preparation/SKILL.md:60-62` | Provides a known 8-section target file for Planning to decompose against and for Execution to Edit-in-place; preserves locked structure. Content remains Execution's deliverable per Idea Decision #2. |

### Other findings (no user decision needed)

Unchanged from iter1. See `draft-iter1.md § Other findings`. One citation correction: `memorization/SKILL.md` "Path conventions" is at line 224 (lowercase) — iter1 said line 226.

### Cross-system divergence notes (deferred to EVALUATION)

Iter1 EVALUATION: Claude PASS + Codex REVISE → REVISE. Codex's REVISE root-caused to (a) the stub's section-count regression (10 vs. 8), (b) `allowed-tools:` frontmatter non-canonical, (c) missing `when-to-load:` frontmatter field, (d) line citation drift. Iter2 fixes all four. Iter2 EVALUATION will re-verify.

### Open concerns (deferred to Planning DISCUSSION)

4 concerns (iter2 reclassified iter1's #4 as resolved this iter). See `## Open concerns for Planning DISCUSSION` above.

### RE-IDEATE triggers

**None.** Unchanged from iter1.

---

## Verification gates (iter2 stamp)

All 6 gates from the iter2 brief PASS — see `STATUS` block in the leader's report. Verbatim outputs are recorded in the leader's return message; the staged stub is at the locked 8-section shape with correct frontmatter; iter1 stub preserved at `rawdata/skill-stub-iter1.md`; this draft cites the verified `line 224`.
