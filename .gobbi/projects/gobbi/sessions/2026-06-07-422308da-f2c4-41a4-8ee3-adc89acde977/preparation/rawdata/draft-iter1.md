---
type: artifact
artifact_type: handoff
loop: preparation
iter: 2
session: 422308da-f2c4-41a4-8ee3-adc89acde977
project: gobbi
feature: workflow
status: draft
created_at: 2026-06-07
---

# Preparation readiness — Harden Auto-mode evaluation discipline (docs-only)

## Scope reference

Locked Idea: `sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/artifacts/idea.md` (44361 bytes, PASS Claude+Codex). Scope Contract: docs-only edit to three canonical files — `auto-mode.md`, `workflow/evaluation.md`, `.claude/CLAUDE.md`. No out-of-scope file may be touched.

**Base state (iter2):** worktree rebased onto current develop, now at **c8a8654** (#295 "subagent continuation via Agent Teams"). All anchors below re-verified against the post-rebase files.

## Readiness summary

**Verdict: READY.** All anchors the Idea's CRUD plan cites resolve in the post-rebase canonical files (the manager-job line is line 5, not the Idea's cited line 4 — G2, a one-line correction; the three evaluation.md section headers shifted by a few lines after #295, corrected in the anchors table — content unchanged). Scope is confirmed clean: trailing-append §7 requires no out-of-scope edit; all four Problem-3 mode-splits live inside in-scope files. C1 is CONFIRMED true: chat-mode.md is silent on Stuck/Regression, so Planning must anchor those two Chat branches to evaluation.md's existing behavior. Five required mistakes present + applicable (plus the support-anchor mistake `manager-skipped-dual-system-eval.md` the §7.2 rule cites); the `claude` doc-authoring skill absence does NOT block. #295 rebase is benign — its `auto-mode.md` and `CLAUDE.md` touches are in different regions/paragraphs than our edits, and it did NOT touch `evaluation.md` — so all three edits remain collision-free (informational note I1; Wrap-up should still re-confirm at PR). No `re-ideate` triggers. No `generate-now` skill/rule proposed.

## Design + memory readiness

### Item 1 — ANCHOR STABILITY (re-verified against POST-REBASE canonical files NOW, at c8a8654)

Every anchor the Idea's CRUD plan cites was re-read in the post-rebase worktree. Result: all resolve to the expected content; the manager-job line is line 5 (G2), and three evaluation.md section headers shifted by a few lines after #295 (content unchanged — corrected below and in the anchors table).

**auto-mode.md** (`.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`, 292 lines — unchanged count post-rebase):
- Line 78 = the EVALUATION row-3 cell: `| 3 | EVALUATION | Run per workflow.ideation.evaluate.mode (default always) | …` — MATCHES.
- Line 208 = the `evaluate.mode` defaults lock: `"always" | Evaluation runs every loop, no mode-driven skip…` — MATCHES.
- Section headers: §4 line 196, §6 line 251, `## Cross-references` line 271 — MATCHES. §7 appends after line 270, before line 271.
- **#295 touch:** line 131 — the §2 Step-5 Execution table row-2 (`EXECUTION` cell), now reads "Spawn a fresh executor subagent (default); may continue the same executor teammate per the bounded rule … delegation/SKILL.md § Continue vs Fresh." This is in §2, a DIFFERENT region from our §7 trailing-append (after line 270). **NO collision.**

**workflow/evaluation.md** (`.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md`) — **NOT touched by #295** (confirmed absent from c8a8654's changed-files list):
- Line 5 = manager's-job sentence ("…emit a verdict — not to do the evaluation itself"). The Idea cites line 4; actual is **line 5** (line 4 is blank). G2 — use line 5.
- **Line 42 (SUPPORT ANCHOR)** = "The manager spawns **exactly two evaluator agents in parallel** — one per system." This is the existing sentence the Idea's §7.2 / Problem-2 fix reinforces. Present and exact — see Support anchors.
- § Severity-gated divergence handling header line 112; Major row (`PASS↔FAIL / REVISE↔FAIL` stop-the-line) at line 119. SAFETY GATE — keep.
- § Dual-system failure handling header line 162 (parent of Degraded-mode). SAFETY GATE — keep.
- § Degraded-mode policy header line 188; "one fails → stop-the-line" + "both fail → halt" within 188-199. SAFETY GATE — keep.
- § Regression marking header line 234; the escalation line ("A regression at any iter triggers user awareness via AskUserQuestion") at line 239. ROUTINE-TRIAGE → mode-split.
- § Stuck detection header line 241; the escalation line ("Escalate to user BEFORE reaching the iteration cap via AskUserQuestion … revise differently / accept-with-deferral / abort / change scope") at line 246. ROUTINE-TRIAGE → mode-split.
- § Iteration Caps header line 253; the escalation line ("the manager escalates to the user … three options") at line 258. ROUTINE-TRIAGE → mode-split.

**.claude/CLAUDE.md** (worktree copy, 58 lines):
- Line 27 = the Evaluation blockquote target: "…After evaluation, discuss findings with the user before improving — the user decides what to address, defer, or disagree with. Never auto-apply evaluation findings…" — MATCHES exactly, unchanged by #295.
- **#295 touch:** line 31 — the principles-intro paragraph, which #295 extended with a parenthetical about continued teammates ("(A *continued* teammate retains its own loaded context across turns …)"). This is a DIFFERENT paragraph from our line-27 Evaluation-blockquote edit. **NO collision.**

### Item 1b — #295 rebase: base synced, collisions confirmed benign (informational note I1)

**Correction of the iter1 G1 (it was factually inverted).** The iter1 report claimed "main-tree drifted, worktree clean." That was backwards. The truth, verified post-rebase with git:
- The worktree was **1 commit BEHIND** origin/develop at iter1, not ahead/clean. **#295 (c8a8654) ADDED** the continued-teammate sentence; the then-stale worktree LACKED it.
- The `[claude skill]` nav-table row was **NOT a drift item** — it was already present in both trees. (iter1 overstated it; corrected.)
- The manager has now **rebased the worktree to c8a8654**, so the base is current and no longer behind.

**#295's reach into our scope (verified via `git show --stat c8a8654`):** #295 touched `auto-mode.md` (1 line, line 131, §2 Step-5 Execution row), `.claude/CLAUDE.md` (1 line, line 31, principles-intro paragraph), plus SKILL.md / chat-mode.md / execution.md / ideation.md / planning.md / agent-teams.md / settings.json. It did **NOT** touch `workflow/evaluation.md`.

**Net (post-rebase):**
- auto-mode.md: #295 edit at line 131 (§2) vs our §7 append after line 270 → different regions, **no collision**.
- CLAUDE.md: #295 edit at line 31 (principles-intro) vs our edit at line 27 (Evaluation blockquote) → different paragraphs, **no collision**.
- evaluation.md: untouched by #295 → **no collision**; only the section-header line numbers shifted by a few lines vs the Idea's citations (corrected in the anchors table).

This is now an **informational note, not an open Wrap-up risk.** The base is current and all three edits are collision-free. Wrap-up should still do the standard pre-PR re-confirm (rebase develop if it has moved again; re-check the line-27 blockquote and the §7 append point), but there is no known merge conflict to carry. Severity: informational.

### Item 4 — SKILL / RULE / MISTAKE coverage

The five mistakes the Idea's CRUD plan applies are present in `.gobbi/projects/gobbi/mistakes/` and applicable:
- `skills-mirror-symlinks-not-copies.md` — edit canonical `.gobbi/...`; symlinks reflect; no double-edit.
- `edit-tool-refuses-symlink-paths.md` — Edit tool refuses `.claude/skills/...` symlink paths; use canonical.
- `section-order-is-part-of-the-contract-not-just-the-set.md` — §7 trailing-append placement; name exact insertion point; §4.2 arrow-order discipline for any mistake-record-shaped content.
- `design-literal-retire-instruction-without-replacement.md` — every File has "D — none"; nothing retired without replacement (conflicts are mode-split, not deleted).
- `principle-text-lead-with-imperative-not-agent-psychology.md` — all new guard text leads with the imperative.

**Support anchor (mistake) — `manager-skipped-dual-system-eval.md`.** The Idea's §7.2 producer/evaluator-separation rule explicitly cites this mistake ("See `mistakes/manager-skipped-dual-system-eval.md`"). Verified present on disk at `.gobbi/projects/gobbi/mistakes/manager-skipped-dual-system-eval.md`. Planning must keep this citation live in the §7.2 text. (Note: this mistake's body cites a stale "Principle 11"; the Idea correctly does NOT carry that number forward — see the Idea's D7.)

**`claude` doc-authoring skill absence — does NOT block.** The Idea notes the `claude` skill is referenced in CLAUDE.md's nav table and `gobbi/SKILL.md`, status FLAG-2 (historically absent/retired). For this docs-only edit, Principle 6 (CRUD plan + keep docs current) + Principle 7 (plain/brief/literal) + the existing doc style of the three target files supply the full authoring standard. No genuinely missing input. No `generate-now` skill/rule proposed.

## Execution skills readiness

No project-specific execution skill is required. This is a markdown-edit task on three existing docs; the executor needs the five mistakes above + the support anchors + Principles 6/7 + the existing doc style. No skill gap. No `generate-now`.

### Item 5 — EDIT-MECHANICS readiness (note for Planning)

- The executor MUST edit the **canonical `.gobbi/...` paths** for the two skill files (`auto-mode.md`, `workflow/evaluation.md`). The `.claude/skills/...` mirrors are symlinks; the Edit tool refuses to write through them (`edit-tool-refuses-symlink-paths`). The symlink reflects the canonical edit automatically — no double-edit (`skills-mirror-symlinks-not-copies`).
- The executor MUST edit `.claude/CLAUDE.md` **directly** — it is a real file in the worktree (regular file, no symlink, no `.gobbi` copy). 58 lines; target is line 27.
- **Edit-tool availability:** I (leader role) found the Edit tool NOT enabled in my context — I applied all Ideation revisions via full-file Write. The **executor role DOES have Edit** — confirmed by `preparation/SKILL.md` frontmatter `allowed-tools: Read, Grep, Glob, Bash, Write, Edit` (line 4); the executor agent grants Edit for surgical in-place edits. This is the right tool for these three small, localized edits (append one section; sharpen ~6 lines; mode-split 3 short sections; reconcile 1 blockquote). **No blocker.** Flag only: Planning should brief the executor to use Edit on canonical paths and fall back to Write only if Edit refuses a path.

## Generated this loop

Nothing generated. No `generate-now` decisions. No staging writes. This is a pure readiness verification.

## Out of scope gaps

- **I1 — #295 rebase (informational, not an open risk).** Worktree rebased to c8a8654; base now current. #295's auto-mode.md (line 131, §2) and CLAUDE.md (line 31, principles-intro) touches are in different regions/paragraphs than our edits; evaluation.md was untouched. All three edits remain collision-free. Wrap-up should still do the standard pre-PR rebase + re-confirm of the line-27 blockquote and §7 append point, but no merge conflict is carried. Severity: informational.
- **G2 — manager-job anchor off-by-one.** The Idea cites evaluation.md line 4 for the manager's-job sentence; the actual line is **line 5** (line 4 blank). One-line correction; Planning uses line 5. Severity: low.

## Decisions log

Item-by-item readiness findings (no AskUserQuestion gaps requiring user resolution; the notes are informational for downstream loops, not gap-resolution decisions):

- **Item 1 (Anchor stability):** PASS post-rebase. All cited anchors resolve at c8a8654. Corrections: manager-job line is **5, not 4** (G2); evaluation.md section headers shifted after #295 — § Severity-gated 112, § Dual-system-failure 162, § Degraded-mode 188, § Regression marking 234 (escalation line 239), § Stuck detection 241 (escalation line 246), § Iteration Caps 253 (escalation line 258). Content unchanged; anchors table updated.
- **Item 2 (Scope readiness):** PASS. `orchestration/SKILL.md:247` references "auto-mode.md §3 — Always-Ask codification" and "§6 — maxIterations exhaustion" (verified verbatim). Appending §7 after §6 (line 251) and before `## Cross-references` (line 271) does NOT renumber §3 or §6 — the pointer stays valid. NO out-of-scope edit required. All four Problem-3 mode-splits live in-scope: 3a in `.claude/CLAUDE.md` (line 27), 3b/3c/3d in `workflow/evaluation.md` (§ Iteration Caps 253 / § Stuck detection 241 / § Regression marking 234). Confirmed.
- **Item 3 (C1 consistency-note truth):** CONFIRMED true. `grep -ni "stuck\|regression"` on `chat-mode.md` returns only one hit (the phrase "silent regression" in unrelated prose about settings-level vs mode-level discuss-first). chat-mode.md is **SILENT on § Stuck detection and § Regression marking**. Therefore the Chat anchor for the 3c (Stuck) and 3d (Regression) mode-splits MUST be **evaluation.md's existing behavior** ("escalate to user" / "user awareness AskUserQuestion"), NOT chat-mode.md. (Contrast: for 3b § Iteration Caps, chat-mode.md DOES have parallel "Budget exhausted → escalate to user" at lines 154 + 237, and the after-EVALUATION discuss gate at line 298 — so the Chat anchor for 3a/3b can cite chat-mode.md; for 3c/3d it cannot.) Planning must encode this split-anchor correctly.
- **Item 4 (Skill/rule/mistake coverage):** PASS. Five mistakes present + applicable; support-anchor mistake `manager-skipped-dual-system-eval.md` present (cited by §7.2); `claude` skill absence non-blocking; no missing input; no generate-now.
- **Item 5 (Edit mechanics):** PASS. Executor edits canonical `.gobbi/...` for skills + `.claude/CLAUDE.md` directly; executor role HAS Edit (preparation/SKILL.md:4 allowed-tools confirms the role grants it); leader lacked Edit (informational).

---

## Anchors table (for Planning — post-rebase, corrected)

| File (canonical) | Section / target | Verified anchor (c8a8654) | Idea cited | Status |
|---|---|---|---|---|
| auto-mode.md | EVALUATION row-3 cell | line 78 | line 78 | exact |
| auto-mode.md | `evaluate.mode` lock | line 208 | line 208 | exact |
| auto-mode.md | §4 header | line 196 | ~196 | exact |
| auto-mode.md | §6 header (append point: after §6, before §271) | line 251 | ~251 | exact |
| auto-mode.md | `## Cross-references` (§7 inserts immediately before) | line 271 | — | confirmed |
| auto-mode.md | total lines | 292 | — | confirmed |
| auto-mode.md | #295 touch (§2 Step-5 row — NOT our region) | line 131 | — | benign, no collision |
| evaluation.md | manager-job "not to do the evaluation itself" (G2) | **line 5** | line 4 | **off-by-one → use line 5** |
| evaluation.md | **support anchor:** "spawns exactly two evaluator agents" | **line 42** | — | exact (Idea §7.2 reinforces) |
| evaluation.md | § Severity-gated divergence — Major (SAFETY, keep) | header 112 / Major row 119 | ~119 | exact |
| evaluation.md | § Dual-system failure handling (SAFETY, keep) | header line 162 | — | confirmed |
| evaluation.md | § Degraded-mode policy (SAFETY, keep) | header 188 / 188-199 | 188-199 | exact |
| evaluation.md | § Regression marking (ROUTINE, mode-split) | header 234 / escalation 239 | ~239 | header shifted; content exact |
| evaluation.md | § Stuck detection (ROUTINE, mode-split) | header 241 / escalation 246 | ~242-249 | header shifted; content exact |
| evaluation.md | § Iteration Caps (ROUTINE, mode-split) | header 253 / escalation 258 | 253-258 | exact |
| .claude/CLAUDE.md | Evaluation blockquote (edit target) | line 27 | line 27 | exact (unchanged by #295) |
| .claude/CLAUDE.md | #295 touch (principles-intro — NOT our paragraph) | line 31 | — | benign, no collision |
| orchestration/SKILL.md | §3/§6 pointer (OUT OF SCOPE — verify-only) | line 247 | line 247 | exact, unaffected by §7 append |
| chat-mode.md | Iteration-caps parallel (Chat anchor for 3b) | lines 154, 237 | — | present |
| chat-mode.md | Stuck / Regression (Chat anchor for 3c/3d) | — | — | **ABSENT — anchor to evaluation.md existing behavior (C1)** |

## Support anchors (existing content the Idea reinforces — for Planning)

- **`workflow/evaluation.md:42`** — "The manager spawns **exactly two evaluator agents in parallel** — one per system." The Idea's §7.2 / Problem-2 fix reinforces this existing sentence; it is the canonical source the new auto-mode.md §7.2 guard points back to. Present and exact.
- **`mistakes/manager-skipped-dual-system-eval.md`** — cited by the Idea's §7.2 guard ("See `mistakes/…`"). Present on disk. Keep the citation live in the executed text.
