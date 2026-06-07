---
name: principles-9-10-implementation-plan
description: Add Principle 9 + Principle 10 to the principles skill and propagate the 8→10 count across all 5 live doc surfaces in one consistent pass.
type: plans
scope: feature
feature: guardrails
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [principles, docs, count-propagation, guardrails]
supersedes: null
superseded_by: null
task_count: 1
---

# Plan — Add Principles 9 and 10, propagate 8 → 10 (single sequential pass)

## Idea anchor

Locked Ideation design: `sessions/2026-06-07-b02c3111-68be-4558-a19f-fabf9627602f/ideation/artifacts/ideation-design.md`. Final P9/P10 wording (§2, §3), CRUD scope map (§4), summary-table rows (§6), verification grep (§7). All decisions locked with the user — wording, titles, P9↔P6 boundary, tight scope, eval policy are NOT re-opened.

## Scope Contract reference

Locked Scope Contract = the Ideation design artifact above. In scope: add 2 principle sections to `principles/SKILL.md` + propagate 11 count-references (incl. 2 table-row appends) across 5 real files. Out of scope: D7 reciprocal cross-refs, D8 guardrails README "13 Iron Laws" drift, the 8 existing principle bodies, the symlink views, root `AGENTS.md` symlink.

---

## Decomposition decision — ONE executor task (single sequential pass)

**Decision: a single executor task touching all 5 real files in one focused pass.** Justification:

1. **Consistency is the deliverable.** The whole point of this change is Principle 9 itself — think CRUD + project-wide before editing. The change is one logically-atomic edit: the principle bodies and every count-reference must land together. Any split risks an intermediate state where P9/P10 exist but a table still says "8" (or vice versa) — exactly the drift the change exists to prevent. A single task keeps the blast radius in one executor's head and one commit.
2. **The `docs-cleanup-parallelism` discipline.** The Iron Laws / orchestration practice prefers a single sequential dispatch for a related multi-file docs batch over fragmenting it across agents. (The named rule file `docs-cleanup-parallelism.md` is not present in `rules/`; the principle is captured by Principle 6's CRUD-plan discipline and the design's single-pass CRUD map. The `stub-redirect-format` rule is the only file under `rules/` and does not apply here — no supersession/stub.)
3. **Implementation never parallelizes** regardless (planning skill § Note on parallelization). Even if this were 5 tasks they would run sequentially — so splitting buys nothing and costs the cross-file consistency view.
4. **Size fits one spawn.** 5 files, ~2 new sections + 11 reference edits ≈ a medium-granularity unit (planning skill Sub-step B: "typically 2-5 files touched" — this is 5). It is one meaningful commit.

The task has internal ordering the executor must follow (see § Internal edit order), but it is one task, one executor, one commit.

---

## Sub-tasks

| # | Sub-task | Depends on | Verification | Owner type |
|---|---|---|---|---|
| 1 | Append P9 + P10 sections to `principles/SKILL.md` and propagate all 11 count-references (incl. 2 table-row appends) across the 5 canonical real files, then run the 3 verification anchors | — | grep anchors V1+V2+V3 below all pass | executor |

This is a one-task plan. The granularity note in the planning skill (a sub-task that needs "and then" should split) does not apply: this is one atomic consistency edit, deliberately kept whole.

---

## File map — exact scope (canonical REAL paths only)

All paths relative to the worktree root. Edit the canonical real file; the `.claude/` and root symlink views update automatically.

| File (canonical real path) | Op | What changes |
|---|---|---|
| `.gobbi/projects/gobbi/skills/principles/SKILL.md` | modify | CREATE P9 + P10 sections after P8 (`:168` separator) and before the closing note (`:170`). Order: P9 then `---` then P10 then `---`. Use the exact locked wording from design §2 + §3. |
| `.claude/CLAUDE.md` | modify | U2 `:31` "8 principles" → "10 principles"; U3 append table rows 9+10 after `:42`; U4 `:56` "8 behavioral principles" → "10 behavioral principles" |
| `.codex/AGENTS.md` | modify | U5 `:69` "8 principles" → "10 principles"; U6 append table rows 9+10 after `:80`; U7 `:97` "8 behavioral principles" → "10 behavioral principles" |
| `.gobbi/projects/gobbi/skills/gobbi/SKILL.md` | modify | U8 `:23` "8 Iron Laws" → "10 Iron Laws"; U9 `:185` "8 Iron Laws" → "10 Iron Laws"; U10 `:206` "8 Iron Laws" → "10 Iron Laws" |
| `.gobbi/projects/gobbi/agents/manager.md` | modify | U11 `:25` "8 Iron Laws" → "10 Iron Laws" |

**Exact table-row text to append (U3 and U6) — verbatim from design §6:**

```
| 9 | Think CRUD-and-5W1H Before Editing: NO EDIT WITHOUT CHECKING ITS CRUD AND 5W1H ACROSS TARGET AND AFFECTED FILES. |
| 10 | Finish In-Scope Work — Do Not Defer It: COMPLETE EVERYTHING WITHIN THE AGREED SCOPE; DO NOT DEFER IN-SCOPE WORK. |
```

(Update 2026-06-07: the P10 one-liner above was revised post-lock per user revision — `NEVER SILENTLY DEFER IN-SCOPE WORK.` → `DO NOT DEFER IN-SCOPE WORK.` This block now shows the shipped wording.)

**P9 / P10 section bodies:** copy verbatim from the design artifact §2 (P9 full markdown block, lines 38-55) and §3 (P10 full markdown block, lines 75-92). Do not paraphrase, re-word, or re-title.

### Internal edit order (within the one task)

1. `principles/SKILL.md` — append P9 + P10 bodies first (the substance).
2. The 4 reference files — propagate the count + table rows.
3. Run all three verification anchors last; do not report done until V1+V2+V3 pass.

(Order is a within-task discipline, not a task split. It exists so the executor never reports a partial state.)

---

## NOT in scope (explicit out-of-scope list — do NOT touch)

- **D7** — reciprocal back-pointers from P1/P5/P6 to P9/P10. Deferred to backlog `backlogs/reciprocal-principle-cross-refs.md`.
- **D8** — `features/guardrails/README.md` "13 Iron Laws" drift (5 places). Pre-existing; deferred to backlog `backlogs/guardrails-readme-iron-law-count-drift.md`.
- **The 8 existing principle bodies** (`principles/SKILL.md:7-167`) — unchanged. P9 carries the only new cross-ref (forward to P6); P6 is NOT rewritten.
- **The closing note** `principles/SKILL.md:170` — read for consistency, do not edit (no count in it).
- **Symlink views — do NOT edit any of these** (editing the canonical real file updates them):
  - `.claude/skills/principles/SKILL.md` (→ canonical principles SKILL.md)
  - `.claude/skills/gobbi/SKILL.md` (→ canonical gobbi SKILL.md)
  - `.claude/agents/manager.md` (→ canonical manager.md)
  - root `AGENTS.md` (→ `.codex/AGENTS.md`)
- **No new files, no deletions.** (Design §4 CREATE = none new; DELETE = none. The no-retire / no-delete traps apply.)

---

## Edit-path discipline (restate for executor — load-bearing)

Per mistake `edit-tool-refuses-symlink-paths.md`: the Edit tool **refuses to write through symlink paths**. You MUST target the canonical REAL paths listed in the File map. Do NOT also edit the symlink views — editing the canonical real file propagates to every view automatically. Editing both would be a double-edit error (and the symlink edit would be refused anyway).

- `.claude/CLAUDE.md` and `.codex/AGENTS.md` are REAL files → edit directly.
- `principles/SKILL.md`, `gobbi/SKILL.md`, `manager.md` → edit the `.gobbi/projects/gobbi/...` canonical path, never the `.claude/...` mirror.
- Root `AGENTS.md` is a symlink to `.codex/AGENTS.md` → never edit it; edit `.codex/AGENTS.md`.

Per mistake `section-order-is-part-of-the-contract-not-just-the-set.md`: section ORDER is part of the contract. P9 MUST precede P10, and the two new sections MUST come after P8's `---` (`:168`) and before the closing note (`:170`). The 4-part section shape (`## Principle N — title`, `**Why:**`, `**Practice:**`, `**Anti-pattern:**`) is fixed by the locked wording — do not reorder within a section.

---

## Verification strategy summary — the three anchors (run from worktree root)

The executor MUST run all three and report each result. These are also the anchors the Execution dual-system (Claude + Codex) evaluation will re-run.

### V1 — Count-propagation grep (design §7 union pattern): zero surviving "8 / eight" on live surfaces

```bash
grep -rniE "(eight|[0-9]+) (iron laws?|principles|behavioral|laws)" \
  .claude/CLAUDE.md .codex/AGENTS.md \
  .gobbi/projects/gobbi/skills/ .gobbi/projects/gobbi/agents/
```
Expected after the change: every hit reads "10" / "ten"; **zero hits read "8" / "eight"** on these live surfaces. (Baseline run during planning returned 8 hits all reading "8" across the 5 surfaces — after the change all 8 must read "10".)

**Gap note for executor — the table rows are NOT caught by V1.** The `| 8 | Fix the Root Cause...` rows (CLAUDE.md:42, AGENTS.md:80) and the new `| 9 |` / `| 10 |` rows do not match V1's pattern. V1 only proves the prose count-references flipped. The table-row append is verified by V3 below, not V1. Do not treat a clean V1 as proof the tables were updated.

### V2 — Symlink-integrity: the `.claude/` views resolve to the edited canonical files

```bash
# Each view must (a) still be a symlink and (b) contain the new count / sections via the canonical target.
for p in .claude/skills/principles/SKILL.md .claude/skills/gobbi/SKILL.md .claude/agents/manager.md AGENTS.md; do
  [ -L "$p" ] && echo "OK symlink: $p -> $(readlink "$p")" || echo "BROKEN (not a symlink): $p"
done
# Prove propagation through the symlink: these must print the NEW text.
grep -n "Principle 9" .claude/skills/principles/SKILL.md
grep -n "Principle 10" .claude/skills/principles/SKILL.md
grep -n "10 Iron Laws" .claude/skills/gobbi/SKILL.md
grep -n "10 Iron Laws" .claude/agents/manager.md
```
Expected: all 4 views are still symlinks (none converted to real files by a mis-edit); reading P9/P10 and "10 Iron Laws" through the `.claude/` views succeeds — proving the canonical edit propagated and no view was edited directly.

### V3 — Exactly two new `## Principle` sections; P8 unchanged; new table rows present

```bash
# (a) Exactly 10 principle section headings now exist (was 8).
grep -cE "^## Principle [0-9]+ —" .gobbi/projects/gobbi/skills/principles/SKILL.md   # expect 10
grep -nE "^## Principle (9|10) —" .gobbi/projects/gobbi/skills/principles/SKILL.md     # expect P9 then P10, P9 line < P10 line
# (b) P9 precedes P10 and both follow P8 and precede the closing note.
grep -nE "^## Principle 8 —|^## Principle 9 —|^## Principle 10 —|single source of behavioral discipline" \
  .gobbi/projects/gobbi/skills/principles/SKILL.md   # order must be: P8 < P9 < P10 < closing-note
# (c) P8 body unchanged — title line intact.
grep -n "^## Principle 8 — Fix the Root Cause" .gobbi/projects/gobbi/skills/principles/SKILL.md   # expect 1 hit
# (d) The two new summary-table rows landed in BOTH CLAUDE.md and AGENTS.md.
grep -nE "^\| (9|10) \| (Think CRUD-and-5W1H|Finish In-Scope Work)" .claude/CLAUDE.md   # expect 2 hits
grep -nE "^\| (9|10) \| (Think CRUD-and-5W1H|Finish In-Scope Work)" .codex/AGENTS.md    # expect 2 hits
```
Expected: (a) `10`; (b) order P8 < P9 < P10 < closing-note; (c) exactly 1 P8 title hit (body untouched); (d) 2 new rows in each of CLAUDE.md and AGENTS.md.

**Gate:** the task is complete only when V1 (zero "8" on live surfaces), V2 (4 intact symlinks + propagation visible through views), and V3 (10 sections, correct order, P8 intact, 4 new table rows total) all pass.

---

## Dependency graph

Single task, no dependencies. Internal edit order (principles bodies → reference files → verify) is a within-task discipline, documented above.

## Agent assignments

| Field | Value |
|---|---|
| Agent type | `executor` — this is implementation (doc edits with a consistency contract), not sub-planning or trivial mechanical work. The cross-file CRUD consistency check is exactly the judgment the executor owns. |
| Model override | none (executor → opus default) |
| Required skills | `principles` (always — and this task edits the principles skill itself, so the executor must understand the floor it is extending); `mistake` (always); `execution` (implementation workflow); the phase doc `orchestration/workflow/execution.md`; `claude` skill (`.claude/` doc authoring standard — bears on CLAUDE.md / AGENTS.md table + prose edits) |
| Required mistakes | `edit-tool-refuses-symlink-paths.md` (load-bearing — canonical-path edits); `section-order-is-part-of-the-contract-not-just-the-set.md` (P9-before-P10 ordering); `executor-main-tree-edit-near-miss.md` + `subagent-relative-path-write-strays-to-main-tree.md` (edit in the WORKTREE copy, not the main tree); `skills-mirror-symlinks-not-copies.md` (why editing canonical propagates to views) |

Justification for non-obvious skills: `claude` skill is included because U2-U7 edit `.claude/CLAUDE.md` and `.codex/AGENTS.md` — the project's `.claude/` authoring doc-standard surfaces. `principles` is doubly required: always-load AND it is the file under edit.

## Self-review report (Sub-step E)

- **Spec coverage:** every design CRUD item mapped to the one task — U1 (CREATE P9+P10), U2-U11 (11 count refs incl. U3/U6 table rows). No design item unassigned; no task content beyond the design. PASS.
- **Placeholder scan:** no `TBD` / `TODO` / `<...>` / `XXX` / `FIXME` in this plan. PASS.
- **Type/name consistency:** principle titles and table-row text quoted verbatim from design §2/§3/§6 — no drift. File paths match the verified worktree topology (symlink vs real confirmed by `readlink`). PASS.
- **Planning-time freshness:** all CRUD-map line numbers (`:31/:42/:56` CLAUDE.md, `:69/:80/:97` AGENTS.md, `:23/:185/:206` gobbi SKILL.md, `:25` manager.md, `:168/:170` principles boundary) re-verified against the live worktree files this session. **No drift found.** One verification-coverage observation surfaced (V1 does not catch the table rows → V3 covers them) — not a line-number drift, an anchor-completeness note already folded into the verification section.

## Verification strategy summary (whole-plan gate)

The plan is complete when the executor's one task passes V1 + V2 + V3. The Execution dual-system evaluation re-runs the same three anchors plus a diff-against-scope check (no file outside the File map touched; no symlink view edited; D7/D8 untouched).

## Definition of done (acceptance criteria for the Execution dual-system eval)

1. `principles/SKILL.md` has exactly 10 `## Principle N —` sections; P9 and P10 use the locked wording verbatim (design §2, §3); P9 precedes P10; both sit after P8's `---` and before the closing note; the 8 existing bodies are byte-unchanged.
2. P9's Why paragraph contains the locked glosses ("CRUD (Create / Read / Update / Delete)", "5W1H (Who / What / When / Where / Why / How)"), the P1 boundary line, and the one-line forward cross-ref to P6. P10's Why contains the P5 floor/ceiling pairing line.
3. All 11 count-references read "10" / "ten": V1 grep returns zero "8" / "eight" on the 5 live surfaces; the two summary-table rows (9 and 10) are present in BOTH CLAUDE.md and AGENTS.md (V3d).
4. Only the 5 canonical real files were edited. No symlink view was edited; all 4 symlink views remain symlinks and resolve to the edited canonical files (V2).
5. No new files; no deletions. D7 and D8 untouched. `features/guardrails/README.md` "13 Iron Laws" left as-is (deferred).
6. Edits landed in the WORKTREE copy, not the main tree.

## Open issues

- **Anchor-coverage note (not a blocker):** V1's union pattern does not match the `| 8 |` / `| 9 |` / `| 10 |` table rows. V3d covers the table-row append explicitly. The executor and the Execution evaluators must run BOTH V1 and V3 — a clean V1 alone does not prove the tables were updated. Folded into the verification anchors above; recorded here so the evaluator does not mistake it for a gap.

## Decisions log

No new AskUserQuestion decisions this Planning loop — all design decisions were locked in Ideation (titles, wording, P9↔P6 forward-only cross-ref, P10↔P5 pairing, tight scope, D7/D8 deferral, eval=skip at planning / dual-system at execution). The only Planning-loop decision is the decomposition: ONE executor task (rationale above). No USER CHALLENGE — the leader does not disagree with the locked design.
