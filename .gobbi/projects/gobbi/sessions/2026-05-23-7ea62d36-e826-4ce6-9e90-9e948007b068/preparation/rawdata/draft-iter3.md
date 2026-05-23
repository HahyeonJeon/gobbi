# Preparation Loop — Readiness Report (iter3)

> Session: `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`
> Feature: `gobbi-orchestration-workflow-improvements`
> Phase: Preparation, iter 3 (FINAL budget iter; REVISE re-entry from iter2)
> Locked Idea: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`

---

## Iter3 changelog (surgical fixes — verified against source)

This iter is a SURGICAL re-stamp. Iter2 verdict was REVISE — **root cause traced to a manager-side brief error**: iter2 brief miscited the locked Idea Design A's 8 H2 sections (named "Constraints" as H2 #8 and folded "Cost + sandbox budget awareness" into "Use cases"). The leader followed the brief verbatim per Iron Law contract. Iter3 brief now cites the source-of-truth verbatim (lines 15-23 of `ideation/staging/design/item-a-codex-skill-structure.md`), verified pre-write. The manager-side process failure is staged as a mistake-candidate at `staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`.

All non-section-structure findings from iter1/iter2 carry forward unchanged. Only the three fixes below were applied this iter.

| Fix | Source finding | Action | Verification |
|---|---|---|---|
| 1 | Manager-iter3-brief re-derivation from locked Design A lines 15-23 | Corrected the staged stub's 8 H2 sections to the verified spec order: When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / **Cost + sandbox budget awareness** / Anti-patterns. "Cost + sandbox budget awareness" promoted from sub-bullet (iter2) back to H2 #7 per locked spec. "Constraints" demoted from H2 #8 (iter2) to body block per `_claude/SKILL.md` standard. | `grep "^## " staging/skills/codex/SKILL.md` returns the 8 names verbatim. |
| 2 | Empirical 16-of-16 project-skill audit on `allowed-tools:` convention | Frontmatter: REMOVED `when-to-load:` field (non-canonical; 0 of 16 project skills use it); ADDED `allowed-tools: Read, Grep, Glob, Bash, Write, Edit` (16 of 16 project skills use it). Kept `name:` and `description:`. | `grep -E "^name:\|^description:\|^allowed-tools:\|^when-to-load:" staging/skills/codex/SKILL.md` returns exactly 3 lines (name + description + allowed-tools); when-to-load absent. |
| 3 | Iron Law 7 audit-trail discipline | Preserved iter2 stub at `rawdata/skill-stub-iter2.md` BEFORE overwriting the staged target. Iter1 stub already at `rawdata/skill-stub-iter1.md` from iter2 pass. Both audit copies present. | `head -3 rawdata/skill-stub-iter2.md` shows iter2's `when-to-load:` frontmatter (proves the pre-fix snapshot). |

---

## Scope reference

Unchanged from iter1/iter2. Bundle A — 7 items (A–G), 15 checklist items, LOCKED at Ideation iter3 PASS (Claude PASS + Codex PASS; 0 Critical/High/Medium between them).

- Idea scope contract: `ideation/artifacts/idea.md:33-93`
- Idea checklist (15 items): `ideation/artifacts/idea.md:243-262`
- Cross-Link Manifest (10 links): `ideation/artifacts/idea.md:311-326`
- Ideation staging fully populated: 5 decisions, 7 designs, 3 discussions, 0 references.

Wrap-up promotes Ideation staging to project memory at session close. Preparation does NOT pre-promote those — they are read-only inputs here.

---

## Readiness summary

**Status: READY (1 gap closed inline; 0 deferred; 0 skipped; 0 RE-IDEATE).**

Iter3 leaves the readiness verdict unchanged from iter1/iter2 — the only changes are surgical fixes to the staged stub's section order/naming + frontmatter field set, plus an iter2 audit-copy preservation. The 7-item scope still decomposes into 14 edits + 1 new skill creation + 2 symlinks. All 6 edit-target skill files exist at canonical paths. All 4 delegation/template files exist. All cited anchor lines are empirically verified.

**One gap identified and closed (unchanged)**: the codex skill target file does not yet exist at the locked source-of-truth path. Resolution: `generate-now` STUB at the locked 8-section shape (frontmatter with `name`/`description`/`allowed-tools` + the 8 locked H2 sections per the verified-against-source Design A lines 15-23 + Execution-fill placeholders, with `Constraints` as a body block per `_claude/SKILL.md` standard). Content writing remains Execution's deliverable per Idea Decision #2.

No `re-ideate` triggers. No contradictions in Ideation output. Planning can decompose against the 15 checklist items as-locked.

---

## Design + memory readiness

### Inputs scanned

Unchanged from iter1/iter2. See `draft-iter1.md § Inputs scanned`.

### Edit-target verification

Unchanged from iter2. The iter2 citation correction (`memorization/SKILL.md § Path conventions` at line 224, lowercase 'c') carries forward.

### Cross-Link Manifest readiness (10 links — all targets confirmed)

Unchanged from iter1/iter2.

### Coverage Ownership Matrix vocabulary verification

Unchanged from iter1/iter2.

### Gaps identified (Design + Memory)

**None.** Unchanged.

---

## Execution skills readiness

### Required skills per item

Unchanged. All 7 items' required skills exist.

### Project-specific skills inventory

Unchanged. `.gobbi/projects/gobbi/skills/` contains 16 skills; codex is the only NEW addition.

### Frontmatter convention audit (NEW this iter — empirical verification)

Pre-write gate 2 ran `grep -c "^allowed-tools:" /playinganalytics/git/gobbi/.gobbi/projects/gobbi/skills/*/SKILL.md | grep -v ":0$" | wc -l` → returned **16**. Confirms 16 of 16 project skills carry `allowed-tools:` frontmatter; `when-to-load:` is non-canonical (0 of 16). The iter3 fix-2 frontmatter (`name` + `description` + `allowed-tools`) aligns the codex stub with the empirically-locked convention.

### Gaps identified (Execution Skills)

**One gap — closed inline this loop. Stub structure now matches verified-against-source spec.**

| Gap | Severity | Proposed resolution | Action taken |
|---|---|---|---|
| `codex` skill target file does not exist at `.gobbi/projects/gobbi/skills/codex/SKILL.md` (Bundle A item A creates it) | **medium** | `generate-now` STUB — frontmatter (`name`/`description`/`allowed-tools`) + EXACTLY the 8 locked H2 sections per Design A lines 15-23 verbatim (When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / Cost + sandbox budget awareness / Anti-patterns) + Constraints body block. Execution fills content; structure is locked. | Staged at `sessions/.../preparation/staging/skills/codex/SKILL.md`. **Iter3 reordered/renamed the 8 H2 sections to match Design A verbatim** (Cost+sandbox awareness restored as H2 #7; Constraints demoted to body block). Frontmatter switched from `when-to-load` (iter2) to `allowed-tools` (iter3) per 16/16 empirical convention. Manager promotes the staged file to `.gobbi/projects/gobbi/skills/codex/SKILL.md` at Preparation EXIT → Planning transition per `preparation/SKILL.md:60-62`. |

After promotion, the stub at the source-of-truth path lets:
- Planning reference an existing file with the locked 8-section shape (Item A becomes "fill content of file X" rather than "create file X and decide structure").
- Execution open the file with Read + Edit rather than Write-from-zero — preserves the locked H2 ordering and removes the "did Execution forget a section?" failure mode.

---

## Generated this loop

| Path | Type | Description |
|---|---|---|
| `sessions/.../preparation/staging/skills/codex/SKILL.md` | Skill stub (iter3 overwrite) | Frontmatter (`name` + `description` + `allowed-tools: Read, Grep, Glob, Bash, Write, Edit`; NO `when-to-load`) + **EXACTLY 8 H2 sections** per locked Idea Design A lines 15-23 verbatim order: When to load / Invocation patterns / Why subagents must use `codex exec` / Sandbox + CWD discipline / Hang + timeout discipline / Use cases / Cost + sandbox budget awareness / Anti-patterns. Constraints as body block after section 8, per `_claude/SKILL.md` standard. Each section has Execution-fill comments anchoring the witnesses from `idea.md` (I1–I14, E1–E5). |
| `sessions/.../preparation/rawdata/skill-stub-iter2.md` | Audit copy | Pre-overwrite snapshot of iter2's 8-section stub (with the iter2 wrong section names and `when-to-load:` frontmatter). Preserved for audit trail of the manager-iter2-brief failure. |
| `sessions/.../preparation/rawdata/draft-iter3.md` | Draft (this file) | iter3 draft of the preparation readiness report with the iter3 changelog + open concerns #4 resolution + cross-reference to the manager-iter2-brief mistake candidate. |
| `sessions/.../preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` | Mistake candidate (assistant writes in parallel) | Records the manager-side process failure: iter2 brief was constructed from leader's iter1 output paraphrase rather than re-derived verbatim from `ideation/staging/design/item-a-codex-skill-structure.md` lines 15-23. Iron Law 7 (verification before completion claim) applies to brief construction, not just to artifact verification. |

No other staging fixes. No project-memory writes.

---

## Out of scope gaps

Unchanged from iter1/iter2. None this loop.

---

## Open concerns for Planning DISCUSSION

Iter2 had 4 concerns (after resolving iter1's #4 as Preparation-phase). Iter3 confirms #4 STAYS RESOLVED (now empirically — the staged stub matches Design A verbatim per `grep "^## "` post-write gate). 4 concerns remain for Planning, renumbered for clarity below to preserve iter2 numbering.

1. **Wrap-up "Step 2.5" placement anchor (Item D).** Unchanged from iter2. Recommendation: option (b) — new `### Step 2.5` H3 between the WORK Phase table and the WORK discipline subsection (line 176).

2. **Memorization Path conventions anchor casing (Item E cross-link 7).** Unchanged from iter2. Recommendation: option (b) — promote the `**Path conventions**` bold paragraph to `### Path conventions` H3 at `memorization/SKILL.md:224` for a stable cross-link anchor.

3. **Coverage Ownership Matrix exact cell text (Item E).** Unchanged from iter2. Idea Design E (lines 295-296) explicitly defers exact cell text to Planning DISCUSSION confirmation with user.

4. ~~**STUB delivery contract (Item A).**~~ **RESOLVED (Preparation iter3).** The staged stub now matches Design A lines 15-23 verbatim per post-write gate 4 (`grep "^## "` returns 8 section names in spec order). Frontmatter matches 16/16 project-skill convention per post-write gate 5. Execution-phase task A-content writes content INTO the existing locked sections and does not re-decide structure.

5. **Symlink semantics across Claude/Codex (Item A check 2).** Unchanged from iter2. Two symlinks mandatory (file symlink at `.claude/skills/codex/SKILL.md`; directory symlink at `.agents/skills/codex`); validation `ls .agents/skills/ | wc -l` returns 17 post-ship.

---

## Decisions log

Iter3 is a surgical re-stamp following manager-iter3-brief verbatim-against-source. No new user-facing decisions this iter; the manager surfaces only Sub-step D's existing gap-resolution table when this leader returns.

### Proposed gap-resolution table (unchanged from iter2)

| # | Gap | Category | Severity | Proposed resolution | Rationale |
|---|---|---|---|---|---|
| 1 | `codex` skill source-of-truth file does not exist at `.gobbi/projects/gobbi/skills/codex/SKILL.md` | execution-skill | medium | `generate-now` STUB at the locked 8-section shape (now verified-against-source compliant after iter3 fix-1; frontmatter convention-compliant after iter3 fix-2); manager promotes to source-of-truth path at Preparation EXIT → Planning transition per `preparation/SKILL.md:60-62` | Provides a known 8-section target file for Planning to decompose against and for Execution to Edit-in-place; preserves locked structure and convention-aligned frontmatter. Content remains Execution's deliverable per Idea Decision #2. |

### Other findings (no user decision needed)

Unchanged from iter2. See `draft-iter2.md § Other findings`.

### Cross-system divergence notes (deferred to EVALUATION)

Iter2 EVALUATION: Claude REVISE + Codex REVISE → REVISE. Root cause: manager-iter2-brief miscited the 8 H2 sections (per the iter3 brief's own self-correction). Iter3 fixes the section names/order to match source-verified spec. Iter3 EVALUATION re-verifies against the 6 post-write gates.

### Open concerns (deferred to Planning DISCUSSION)

4 concerns (iter2's #4 stays resolved). See `## Open concerns for Planning DISCUSSION` above.

### RE-IDEATE triggers

**None.** Unchanged.

### Mistake-candidate cross-reference

`sessions/.../preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` — staged in parallel by the assistant. Records the manager-side process failure pattern (paraphrase vs. verbatim source re-derivation when constructing iter-N briefs). Promotion to `.gobbi/projects/gobbi/mistakes/` happens at Wrap-up per `gobbi mistake promote`.

---

## Verification gates (iter3 stamp)

All 6 gates from the iter3 brief PASS — see `STATUS` block in the leader's return message for verbatim outputs. The staged stub is at the locked 8-section shape with correct frontmatter; iter1 + iter2 stubs preserved at `rawdata/skill-stub-iter{1,2}.md`; pre-write gates confirmed source spec (Design A lines 15-23) and convention audit (16/16 `allowed-tools`); post-write gates confirmed structural and frontmatter compliance.

This is the FINAL preparation budget iter. If iter3 EVALUATION reaches PASS, Preparation EXITS to Planning. If REVISE, the loop aborts per the brief's terminal-budget contract.
