---
loop: preparation
iter: 3
artifact_type: handoff
created_at: 2026-05-23
status: final
supersedes: []
related:
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter3.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter2.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/rawdata/draft-iter1.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/skills/codex/SKILL.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md
  - sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/preparation/artifacts/memory-reads.md
---

# Preparation Report — Canonical Artifact (Planning Input)

> Session: `2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068`
> Feature: `gobbi-orchestration-workflow-improvements`
> Verdict: PASS (Claude PASS + Codex PASS, iter3)
> Status: Preparation EXIT — Planning may begin.

This is the canonical Preparation report for the Planning Loop. It supersedes iter1 and iter2 drafts. Planning decomposes the 15 checklist items from `ideation/artifacts/idea.md:245-261` into ordered tasks.

---

## Scope Contract

Bundle A — 7 items (A–G), 15 checklist items, LOCKED at Ideation iter3 PASS.

- Locked Idea: `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/sessions/2026-05-23-7ea62d36-e826-4ce6-9e90-9e948007b068/ideation/artifacts/idea.md`
- Scope Contract section: `idea.md:33-93`
- Implementation Checklist (15 items): `idea.md:245-261`
- Cross-Link Manifest (10 links): `idea.md:311-326`

**7 in-scope items (LOCKED):**

| # | Item | Primary deliverable surface |
|---|---|---|
| A | New `codex` skill — content-complete best-practices for Codex in Claude Code | `.gobbi/projects/gobbi/skills/codex/SKILL.md` + 2 symlinks |
| B | Memorization moment-of-capture discipline | `memorization/SKILL.md` Core Principles + `mistake/SKILL.md` P2 |
| C | Memorization delegation hard gate | `delegation/SKILL.md` + 3 per-role templates (assistant/leader/executor) |
| D | Wrap-up Step 2.5 — prior-loop MEMORIZATION compliance check | `wrap-up/SKILL.md` |
| E | Naming-convention enforcement via Consistency+Aesthetics evaluator perspectives | `evaluation/SKILL.md § Coverage Ownership Matrix` + `memorization/SKILL.md § Path Conventions` |
| F | Polish 1-1 — move `## Glossary` in `gobbi/SKILL.md` after Session Bootstrap Order | `gobbi/SKILL.md` |
| G | Polish 1-4 — drop legacy setup questions; ask 1 question (mode, default auto) + customize gate | `gobbi/SKILL.md § Step 4` |

---

## Readiness Assessment (Items A–G)

**Overall status: READY. 1 gap closed inline; 0 deferred; 0 skipped; 0 RE-IDEATE.**

### Item A — Codex skill

| Check | Status | Evidence |
|---|---|---|
| Source-of-truth path `.gobbi/projects/gobbi/skills/codex/SKILL.md` exists | READY — stub promoted by manager at Preparation EXIT | `staging/skills/codex/SKILL.md` staged; manager promotes before Planning starts (`preparation/SKILL.md:60-62`) |
| 8 H2 sections match locked Design A lines 15-23 verbatim | PASS | Post-write gate: `grep "^## " SKILL.md` returns 8 names in spec order (verified in eval) |
| Frontmatter: `name` + `description` + `allowed-tools`; no `when-to-load` | PASS | 16/16 project-skill convention empirically confirmed pre-write |
| Execution-fill comments present anchoring I1–I14 / E1–E5 witnesses | PASS | Each section has an HTML comment with anchor citations |
| `Constraints` as body block (not H2 #9) | PASS | Annotated "NOT an H2 section; keeps the H2 count at exactly 8" |
| Symlink discipline documented in stub header | PASS | Lines 9-15 of stub enumerate both required symlinks |

**Gap closed this loop:** The codex skill source-of-truth file did not exist. Resolution: `generate-now` stub (8 locked H2 sections + frontmatter). Manager promotes `staging/skills/codex/SKILL.md` → `.gobbi/projects/gobbi/skills/codex/SKILL.md` at Preparation EXIT → Planning transition. Content writing remains Execution's deliverable per Idea Decision #2.

### Items B, C, D, E, F, G

All 6 edit-target skill files confirmed existing at canonical paths (verified in iter1). No gaps. Planning decomposes each into a single task against the locked checklist item + Design section in `idea.md`.

| Item | Edit target file | Path confirmed |
|---|---|---|
| B | `memorization/SKILL.md` | `/playinganalytics/git/gobbi/.agents/skills/memorization/SKILL.md` |
| B | `mistake/SKILL.md` | `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md` |
| C | `delegation/SKILL.md` | `/playinganalytics/git/gobbi/.agents/skills/delegation/SKILL.md` |
| C | `delegation/templates/assistant.md` | Confirmed per iter1 scan |
| C | `delegation/templates/leader.md` | Confirmed per iter1 scan |
| C | `delegation/templates/executor.md` | Confirmed per iter1 scan |
| D | `wrap-up/SKILL.md` | `/playinganalytics/git/gobbi/.agents/skills/wrap-up/SKILL.md` |
| E | `evaluation/SKILL.md` | `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md` |
| E | `memorization/SKILL.md` | (same as B above) |
| F | `gobbi/SKILL.md` | `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md` |
| G | `gobbi/SKILL.md` | (same as F above) |

Cross-Link Manifest: 10 links enumerated in `idea.md:311-326`. All source and target files confirmed present. Execution must wire all 10 links.

`memorization/SKILL.md § Path conventions` citation: line 224, lowercase 'c'. Confirmed per iter2 correction (iter1 miscited 'C').

---

## Generated Artifacts

One artifact generated this loop:

| Path | Type | Promoted by |
|---|---|---|
| `sessions/.../preparation/staging/skills/codex/SKILL.md` | Skill stub — frontmatter + 8 locked H2 sections + `Constraints` body block + Execution-fill comments | Manager (at Preparation EXIT → Planning transition, per `preparation/SKILL.md:60-62`). Promoted to `.gobbi/projects/gobbi/skills/codex/SKILL.md`. Symlinks (`.claude/skills/codex/SKILL.md` file-level + `.agents/skills/codex` directory-level) created at same time. |

**Why promoted before Planning:** Planning must decompose task A as "fill content of existing file with 8-section skeleton" rather than "create file and decide structure." If promotion waits until Wrap-up, in-session consumers have no stable target file for Planning to reference.

**Audit trail:** `rawdata/skill-stub-iter1.md` and `rawdata/skill-stub-iter2.md` preserve pre-overwrite snapshots. Iter2 snapshot confirms the `when-to-load:` frontmatter that was corrected in iter3.

---

## Resolved Concerns

All iter1 and iter2 findings were addressed or deferred. Summary:

| Finding | Source | Status |
|---|---|---|
| COD-PREP-AESTH-001, COD-PREP-CONS-001/002, COD-PREP-PROJ-001/002, COD-PREP-RISK-001, COD-PREP-STRUCT-001/002, COD-PREP-USAGE-001, COD-PREP-OVERALL-001/002 (11 Codex High — all converging on wrong section names + wrong frontmatter) | iter1 Codex REVISE | Addressed in iter3. H2 section names/order now match Design A lines 15-23 verbatim. Frontmatter switched from `when-to-load` to `allowed-tools`. |
| Claude iter2 Critical × 4 — STRUCT vocabulary propagation (wrong 5-Type vocabulary); CONS vocabulary inconsistency; RISK propagation risk | iter2 Claude REVISE→FAIL | Addressed in iter3 (upstream fix was to Ideation's vocabulary, which iter3 Preparation inherits). The Preparation stub does not contain vocabulary; no direct impact on stub, but the underlying Ideation-level correction carries through. |
| Claude iter2 H2 mismatch (H2 #7/#8 wrong names) | iter2 Claude REVISE | Addressed in iter3. `Cost + sandbox budget awareness` restored as H2 #7; `Anti-patterns` confirmed as H2 #8. |
| Codex iter2 COD-STRUCT-001 (H2 count off, `when-to-load` non-canonical) | iter2 Codex REVISE | Addressed in iter3. `grep -c "^## "` returns 8; `allowed-tools` present; `when-to-load` absent. |
| Manager-iter2-brief-failed-Iron-Law-7 (manager read spec from memory, not source) | Meta-finding, iter2 REVISE root cause | Addressed: mistake-candidate staged at `staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`. Iter3 brief was re-derived by `Read`-ing Design A lines 15-23 directly. |

---

## Open Concerns for Planning DISCUSSION

4 concerns carry forward from Preparation to Planning DISCUSSION. None are blocking — Planning's DISCUSSION should surface them to the user before decomposing tasks:

### Concern 1 — Wrap-up Step 2.5 anchor placement (Item D)

**Context:** `wrap-up/SKILL.md` must receive a new "Step 2.5" between the WORK Phase table row for Step 2 and Step 3. The exact insertion point (after Step 2's table row, before Step 3's prose, or as a `### Step 2.5` subsection within the WORK section) is not pinned to a line number.

**Recommendation:** Option (b) — new `### Step 2.5` H3 inserted between the WORK Phase table and the WORK discipline subsection (approximately line 176 of `wrap-up/SKILL.md`). Avoids table-row inflation; keeps the procedure self-contained.

**Action for Planning:** confirm preferred insertion style with user before decomposing task D.

### Concern 2 — `memorization/SKILL.md § Path conventions` anchor casing (Item E, Cross-Link 7)

**Context:** Cross-Link 7 requires `memorization/SKILL.md § Path Conventions` to receive a cross-link to `evaluation/SKILL.md § Coverage Ownership Matrix`. The current `**Path conventions**` is a bold paragraph (line 224), not an H3 header — so there is no GitHub-anchor `#path-conventions` for a stable cross-link.

**Recommendation:** Option (b) — promote `**Path conventions**` to `### Path conventions` H3 at line 224 for a stable markdown anchor. Small cosmetic change, no semantic impact.

**Action for Planning:** confirm anchor-promotion approach with user.

### Concern 3 — Coverage Ownership Matrix exact cell text (Item E)

**Context:** `idea.md:295-296` explicitly defers the exact wording of the new row's "Owner perspectives" and "Seed scenario / coverage hint" cell text to Planning DISCUSSION. The Design E direction says "Consistency + Aesthetics evaluator check" but the exact row wording is open.

**Action for Planning:** present user with a draft row and confirm exact cell text before tasking Execution.

### Concern 4 — Symlink mechanics across Claude/Codex (Item A, check 2)

**Context:** Two symlinks are mandatory: file symlink at `.claude/skills/codex/SKILL.md` pointing to `../../../.gobbi/projects/gobbi/skills/codex/SKILL.md`; directory symlink at `.agents/skills/codex` pointing to `../../.gobbi/projects/gobbi/skills/codex`. Validation: `ls .agents/skills/ | wc -l` returns 17 post-ship.

**Action for Planning:** confirm symlink creation is part of item A task scope (not a separate task). The manager creates both symlinks as part of Preparation EXIT before Planning starts — task A in Execution only fills content; symlinks are already in place.

### Concern 5 — `Constraints` body-block vs `## Constraints` convention (Low, informational)

**Context:** Codex iter3 noted (Low, deferred) that sampled existing project skills (`execution/SKILL.md`, `wrap-up/SKILL.md`, `research/SKILL.md`) use `## Constraints` as an H2 section. The codex stub uses `**Constraints**` as a body block after H2 #8 to preserve the locked 8-H2 validation contract. This is intentional per Design A (which explicitly excludes `Constraints` from the 8 H2 sections).

**Action for Planning:** if user wants to normalize `Constraints` to H2 convention across all skills in a future session, that is a separate out-of-scope item. For this session, `Constraints` stays as a body block per the locked spec.

---

## Evaluation Summary (3-iter dual-system)

| Iter | Claude | Codex | Aggregate | Key cause |
|---|---|---|---|---|
| 1 | PASS (0C/0H, 2M, 10L) | REVISE (0C, 11H, 0M, 0L) | REVISE | Codex: stub section names wrong (10 H2 vs 8); `when-to-load` frontmatter non-canonical. Claude missed both. |
| 2 | REVISE→FAIL (4C, 7H, 4M, 7L) | REVISE (0C, 16H, 0M, 0L) | REVISE (FAIL) | Root cause: manager-side brief error — brief cited wrong 8 sections (named "Constraints" as H2 #8; omitted "Cost + sandbox budget awareness"; prescribed `when-to-load`). Leader followed brief faithfully. |
| 3 | PASS (0C/0H/0M, 2L informational) | PASS (0C/0H/0M, 1L: `Domain=\`testing\`` vs `\`test\``) | PASS | Iter3 brief re-derived from locked Design A lines 15-23 verbatim. All High findings resolved. 1 Low (Codex: illustrative example wording) deferred to Execution item D micro-fix (COD-CONS-003). |

**Cross-system divergence:** iter1 saw Claude PASS / Codex REVISE — Codex was more sensitive to structural schema compliance. Iter2 saw Claude FAIL / Codex REVISE — Claude escalated on Critical vocabulary regression; Codex identified same root cause at High. Iter3: both independently PASS. Cross-system PASS is the strongest signal.

**Manager-brief mistake-candidate:** staged at `staging/decisions/manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`. Records the pattern: constructing a "paste-inline-verbatim" brief from memory rather than `Read`-ing the locked spec into context immediately before writing. Iron Law 7 applies to brief-construction, not just to artifact verification. Wrap-up promotes this to `.gobbi/projects/gobbi/mistakes/` via `gobbi mistake promote`.

**COD-CONS-003 (deferred):** Codex Low finding — the `Domain=\`testing\`` illustrative example in the draft should read `Domain=\`test\`` per the canonical domain vocabulary. Deferred to Execution item D as a micro-fix. Does not block Planning.

---

## Planning Entry Criteria

Planning may begin immediately. All entry criteria are met:

- [x] Ideation PASS artifact exists at `ideation/artifacts/idea.md` (iter3 PASS, Claude PASS + Codex PASS)
- [x] 15 checklist items defined and machine-checkable (`idea.md:245-261`)
- [x] 10 Cross-Link Manifest entries defined (`idea.md:311-326`)
- [x] Codex skill stub at `staging/skills/codex/SKILL.md` — manager promotes to source-of-truth path before Planning starts
- [x] All 7 edit-target files confirmed present at canonical paths
- [x] Mistake-candidate staged for Wrap-up promotion
- [x] 4 open concerns documented above for Planning DISCUSSION
- [x] No RE-IDEATE triggers
- [x] No deferred gaps blocking Planning

**Planning's first act:** resolve Concerns 1–3 via AskUserQuestion before decomposing tasks.
