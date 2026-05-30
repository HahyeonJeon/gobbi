# Perspective: Project

**Target:** T8 Workflow-section refactor across `orchestration/{SKILL.md, chat-mode.md, auto-mode.md}`
**Iter:** 1
**System:** claude

## Stage 0 — Target Understanding

**What.** Refactor the Workflow section across 3 orchestration docs: (a) rename chat-mode.md §3 from "Per-task slice workflow shape" to "Workflow" and add per-step subsections matching SKILL.md's procedure-table pattern; (b) insert a new auto-mode.md §2 "Workflow" with full 6-step restatement and re-number §2→§3 through §6→§7; (c) shrink SKILL.md `## Workflow` body to a pointer paragraph + Step 1 only (mode-agnostic), deleting Steps 2-6 + Inter-loop transition.

**Why.** Decouple mode-specific Workflow procedure from SKILL.md and put each mode's full SOP in its own mode-doc (Q1 + Q2 locks). Eliminate the prior duplication / ambiguity about who owns the canonical Workflow procedure.

**How.** Surgical Markdown edits with verbatim re-use of the SKILL.md pattern (Definition / Inputs / Output / Loop iteration / 5-row procedure table). No code paths touched.

**Scope Contract.** Three files in `.gobbi/projects/gobbi/skills/orchestration/`. Mirror symlinks at `.claude/skills/orchestration/` are read-only consequences of those edits.

## Stage 1 — Frame

Scenarios (project-perspective):

1. SKILL.md is no longer the canonical home for Steps 2-6 — does the pointer paragraph correctly route both modes to the right mode-doc anchor? *Checklist:* [a] pointer to `auto-mode.md § §2 — Workflow` exists; [b] pointer to `chat-mode.md § §3 — Workflow` exists; [c] Step 1 retained; [d] Steps 2-6 deleted.
2. Auto-mode now owns its full Workflow procedure end-to-end. *Checklist:* [a] all 6 steps present with Def/Inputs/Output/Loop iteration/Procedure; [b] re-numbering consistent; [c] internal §2→§3 references propagated.
3. Chat-mode §3 is renamed and per-step subsections added without losing the ASCII diagram or task-record term-lock. *Checklist:* [a] `## §3 — Workflow` header; [b] per-slice steps with Def/Inputs/Output/Loop iteration; [c] ASCII diagram preserved; [d] "Per-task slice" term-lock preserved.
4. Surviving SKILL.md sections (Workflow State Machine / Workflow Status Display / Workflow Metadata) keep all their cross-references intact. *Checklist:* anchors still resolve; no dangling links.

## Stage 2 — Per-perspective Sequential Evaluation

### Scenario 1 — pointer & Step 1 preserved
- [x] `## §3 — Workflow` exists at chat-mode.md L59; pointer at SKILL.md L91 (`chat-mode.md § §3 — Workflow`).
- [x] `## §2 — Workflow` exists at auto-mode.md L45; pointer at SKILL.md L88.
- [x] Step 1 retained at SKILL.md L99 (`### Step 1 — Workflow Configuration`).
- [x] Steps 2-6 deleted from SKILL.md (`grep -cE '^### Step [2-6] —' SKILL.md` = 0).

Verdict: Scope contract honored.

### Scenario 2 — auto-mode owns its full procedure
- [x] All 6 steps present at auto-mode L55, L65, L83, L101, L119, L137.
- [x] Re-numbering consistent: §3 Always-Ask (was §2), §4 Auto-Mode defaults (was §3), §5 Banner (was §4), §6 maxIterations (was §5), §7 Settings defaults (was §6). 5 internal "see §3" references (line 34, 113, 212, 213, 214, 236, 304) correctly point to the new §3 — Always-Ask. §3.4 cross-ref (L307) also resolves to L185.
- [x] Definition/Inputs/Output/Loop iteration counts: 6/6/6/5 (Step 1 has no "Loop iteration" because it is a single pass — consistent with SKILL.md).

### Scenario 3 — chat-mode §3 renamed + per-slice steps + diagram
- [x] Per-slice steps at L131 / L135 / L153 / L165 / L183 / L201 / L218 = Configuration / Step 2 / Step 3 / Step 4 / Step 5 / Slice Boundary / Step 6 (7 Definition blocks total — 6 steps + boundary).
- [x] ASCII diagram preserved at L70-118 ("Per-task slice" term-lock present once, in the box header).
- [x] Slice Boundary uses "Procedure. Sequential — not a loop." instead of "Loop iteration." — correct for a non-looping boundary.
- [x] Step 3 has no procedure table because no rows execute (Skipped at loop entry) — handled as a narrative "Loop iteration." paragraph + Opt-in note. Pattern-consistent.

### Scenario 4 — Surviving SKILL.md cross-refs resolve
- [x] `## Workflow State Machine` → `chat-mode.md § §3 — Workflow` link landed at L256 (the executor's claimed stale-ref patch — confirmed applied).
- [⚠] **Broken `#iteration-caps` anchor** in chat-mode.md L234 + auto-mode.md L153 — links to `SKILL.md#iteration-caps` but no such anchor exists. The closest is `### Iteration rule` at SKILL.md L297 (anchor `#iteration-rule`). Pre-existing from commit 6c72793, but T8 patched an adjacent stale cross-ref in the same domain and missed this one. **F1** below.
- [⚠] **CORRECTION block stale line-number** at SKILL.md L66 cites "line 241" which post-deletion no longer sits at line 241 (current L241 is unrelated canonical-tree text). Quoted text is verbatim so still locatable, but the pointer is misleading. **F2** below.

## Findings

### F1 — Broken `SKILL.md#iteration-caps` anchor in both mode docs
- **Type:** `general` | **Domain:** `docs-sync` | **Disposition:** open | **Confidence:** 100 | **Severity:** Medium
- **Evidence:** chat-mode.md:234 + auto-mode.md:153 — `[Workflow State Machine § Iteration Caps](SKILL.md#iteration-caps)`. The anchor `#iteration-caps` does NOT exist in SKILL.md; `grep -nE '^### ' SKILL.md` lists `### Iteration rule` at L297 as the closest match. Both files appear identical to the version introduced in commit 6c72793; T8 did not surface or fix this even while patching the adjacent stale `Per-task slice workflow shape` anchor in the same file region.
- **Why it matters:** Users escalating per the "iter cap hit immediately (max=1)" path are routed to a non-existent anchor — the link silently falls back to the doc top. The wave-7 task explicitly says "Verify SKILL.md's pointer paragraph is sound (links resolve, no orphaned cross-references inside `## Workflow Status Display` / `## Workflow State Machine` / `## Workflow Metadata`)" — links pointing AT SKILL.md from the mode docs are within the spirit of the same sound-link check.

### F2 — `CORRECTION` block at SKILL.md L66 cites stale "line 241"
- **Type:** `general` | **Domain:** `docs-sync` | **Disposition:** open | **Confidence:** 90 | **Severity:** Low
- **Evidence:** SKILL.md:66 — "The original lock at line 241 ("Mode controls user gates; it does not relax the workflow.") has been superseded ..." — but post-T8 deletion, the cited content no longer lives at line 241 (current L241 belongs to canonical-tree text). The quoted text is verbatim so still grep-able.
- **Why it matters:** Audit-trail readability. The CORRECTION block was added in commit 6c72793 to call out the supersession; T8's deletion of Steps 2-6 shifted line numbers without updating the block.

### F3 — Doubled "§" marker in pointer link text
- **Type:** `general` | **Domain:** `aesthetics` | **Disposition:** open | **Confidence:** 100 | **Severity:** Low
- **Evidence:** SKILL.md:88 and L91 — `[auto-mode.md § §2 — Workflow](auto-mode.md)` and `[chat-mode.md § §3 — Workflow](chat-mode.md)`. The link text has the section marker twice ("§ §2 — Workflow"), which is cosmetic but reads awkwardly.
- **Why it matters:** Pure aesthetics; not a routing or correctness issue. Convention in the rest of the file (e.g., L66, L88) uses "§N" exactly once.

## Verdict

**PASS with low-severity follow-ups.** The Q1+Q2 locks (per-step decomposition, Auto full restatement) are honored verbatim. The scope contract is respected — no out-of-scope file touched. F1 is the most material finding (broken anchor in both downstream docs); F2 and F3 are paper-thin.

## Must-Preserve
- Per-slice step subsections in chat-mode §3 (Def/Inputs/Output/Loop iteration pattern matches SKILL.md exactly).
- Auto-mode full 6-step restatement + re-numbering chain (§3→§7).
- SKILL.md Step 1 preserved verbatim (rows 1-7 + LOCK#5 footnote + 3-tier bootstrap table).
- ASCII diagram in chat-mode §3 with "Per-task slice" term-lock.
- All Step 2-6 deletions in SKILL.md.
