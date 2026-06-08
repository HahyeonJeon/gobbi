---
type: artifact
artifact_type: task-list
loop: planning
iter: 3
session: 422308da-f2c4-41a4-8ee3-adc89acde977
project: gobbi
feature: workflow
status: draft
created_at: 2026-06-07
---

# Plan — Harden Auto-mode evaluation discipline (docs-only)

## Scope reference

- **Project:** gobbi
- **Feature:** workflow (orchestration / Auto-mode discipline)
- **Task:** Docs-only edit removing three manager misbehaviors in Auto mode at their root, across three canonical files.
- Locked Idea: `sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/ideation/artifacts/idea.md`
- Readiness (anchors table, support anchors, C1 split-anchor, edit-mechanics): `sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/preparation/artifacts/readiness.md`
- Base: worktree at c8a8654 (rebased). Anchors below re-verified at c8a8654.
- **In scope (only files any task may touch):** `auto-mode.md`, `workflow/evaluation.md` (both canonical `.gobbi/...`), `.claude/CLAUDE.md`.
- **Out of scope (read-only references — NO task edits them):** `orchestration/SKILL.md` (the `auto-mode.md §3/§6` Mode-specific-gates pointer is at line **266** post-#295 — verify-only by section name, not line number), `chat-mode.md`, `discussion/SKILL.md`, `principles/SKILL.md`, templates, settings.

## Decomposition decision (recommended: HYBRID — 3 per-file tasks + 1 consistency check)

**Options weighed:**
- **A. Single cohesive task** — all three edits in one executor spawn. Pro: the cross-references are authored together. Con: one large diff across two skills + CLAUDE.md, mixed concerns in one commit, harder to verify each file independently, and a single executor error contaminates all three.
- **B. Per-file tasks (3)** — one task per file. Pro: clean commit per file, independent verification, smaller blast radius. Con: the files cross-reference each other, so a naive ordering could author a forward-pointer before its target section exists.
- **C. Hybrid (RECOMMENDED)** — 3 per-file tasks, **sequenced by cross-reference dependency**, plus a 4th **consistency-verification task** that confirms every cross-reference resolves AFTER all edits land.

**Why C.** The edits are small but form a citation graph: auto-mode.md §7 cites evaluation.md's section names; evaluation.md reciprocally cites auto-mode.md §7; CLAUDE.md and auto-mode.md cite each other (mutual — see DD5). Per-file tasks give clean, independently-verifiable commits (Principle 2 — minimal steps). Sequencing the tasks so each file's cross-reference targets already exist removes the forward-pointer risk; the references that point at a not-yet-written section (evaluation.md→auto-mode §7, and the auto-mode↔CLAUDE.md mutual edge) are worded by stable section NAME so they do not depend on the other file's exact final text, and are validated end-to-end at T4. The dedicated final task catches cross-file drift (a section renamed in one file but cited by the stale name in another) that no single-file verification can catch. This matches the planning skill's "anchor every task" + "the artifact is the program" discipline.

**Sequencing rationale (the citation graph drives order):**
1. **T1 — evaluation.md FIRST.** It is the citation TARGET for auto-mode.md §7 (which cites `evaluation.md § Degraded-mode policy`, `§ Severity-gated divergence`, `§ Iteration Caps`, `§ Stuck detection`, `§ Regression marking`). T1 sharpens line 5 / line 188, mode-splits the three routine-triage sections, labels every safety-gate site, AND adds the reciprocal Cross-references pointer back to auto-mode.md § Evaluation discipline (§7) — by stable section NAME, since §7 does not exist until T2. T1 does NOT rename any section header, so the names auto-mode.md §7 cites stay stable. Doing it first means auto-mode.md's forward citations point at already-final text.
2. **T2 — auto-mode.md SECOND.** Appends §7 (which cites the evaluation.md sections now finalized by T1) and adds the forward pointers + Cross-references rows. §7.3's reference to CLAUDE.md is worded GENERICALLY (not quoting CLAUDE.md's exact final text) so it does not depend on T3.
3. **T3 — CLAUDE.md THIRD.** Reconciles line 27; it cites `auto-mode.md` (whose §7 exists after T2) and `chat-mode.md` (unchanged, out of scope) — both valid at this point.
4. **T4 — consistency check LAST.** Verifies all cross-references resolve in the FINAL post-T3 state — the reciprocal auto-mode §7 ↔ evaluation.md edge (both directions), the mutual auto-mode↔CLAUDE.md edge (both directions), section order preserved, scope held, classification exhaustive, nothing retired-without-replacement.

Note: per the planning skill, Execution runs tasks **sequentially** regardless; the ordering here also makes each task's cross-reference targets valid when it runs, and T4 is a true dependency (needs T1-T3 done).

---

## File map

| File (canonical path) | Responsibility | Task |
|---|---|---|
| `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md` | Sharpen producer/evaluator separation; mode-split 3 routine-triage escalations; label ALL safety-gate escalation sites (exhaustive); degraded-mode clarifier; framing sentence; reciprocal Cross-references row → auto-mode §7 | T1 |
| `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` | Append §7 Evaluation discipline (4 sub-blocks); forward pointers (§2 preamble, §4 line-208 row, §6); Cross-references rows | T2 |
| `.claude/CLAUDE.md` | Reconcile line-27 Evaluation blockquote to mode-split wording | T3 |
| (all three, read-only) | Cross-reference (all directions incl. reciprocal) + scope + section-order + classification-exhaustiveness + retire-nothing verification | T4 |

---

## Tasks

```yaml
id: 01-evaluation-md-sharpen-and-mode-split
what: In workflow/evaluation.md sharpen the producer/evaluator-separation wording, mode-split the three routine-triage escalations, add a routine-vs-safety framing sentence + safety-gate carve-out that NAMES EVERY safety-gate escalation site exhaustively, and add a reciprocal Cross-references pointer back to auto-mode.md § Evaluation discipline (§7) — without renaming any section header.
traces-to: ["Idea § Design File 2 — workflow/evaluation.md", "Idea § Design File 2 — reciprocal Cross-references row (optional→confirmed by Planning)", "Idea Problem 1 fix (degraded-mode clarifier)", "Idea Problem 2 fix (manager MUST NOT evaluate)", "Idea Problem 3 fixes 3b/3c/3d (mode-split)", "Idea D8 (routine-triage vs safety-gate classification)", "iter2 fix 2 (exhaustive classification)", "iter3 fix 1 (reciprocal link)"]
requires: []
files:
  - path: ".gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md"
    op: modify
inputs: []
outputs: ["evaluation.md-final-section-names"]   # the stable section names T2 §7 cites
verifies: >
  (a) line 5 reads as an emphatic "The manager MUST NOT evaluate. It spawns exactly two evaluator subagents (one per system)…" reinforcing the existing line-42 "spawns exactly two evaluator agents";
  (b) § Degraded-mode policy (header line 188) has a new sentence stating "claude-only" is reachable ONLY post-failure / never a pre-evaluation option / never offered as an Auto evaluate-mode choice;
  (c) ROUTINE-TRIAGE mode-split — § Iteration Caps (header 253, escalation line 258), § Stuck detection (header 241, escalation line 246), § Regression marking (header 234, escalation line 239) each now read mode-split: a Chat branch (escalate / user-aware as today) AND an Auto branch (record tag/finding; surface at Wrap-up; no mid-loop interrupt; cite auto-mode.md §6/§7.3);
  (d) SAFETY-GATE carve-out is EXHAUSTIVE — the framing sentence / carve-out NAMES every safety-gate escalation site and labels each as "interrupts in BOTH modes (NOT mode-split)": § Severity-gated divergence — Major @119 (header 112), same-symptom-different-root-cause @109, § Verdict aggregation any-FAIL @137, § Degraded-mode one-system-fails @194 (header 188), both-systems-fail @196, cost-budget-approaching-cap @197. No per-site BEHAVIOR edit is made to these six — they already interrupt correctly; the edit only LABELS them so the classification is complete;
  (e) the routine-triage-vs-safety-gate framing sentence is present near the reconciliation/iteration area and references both lists (3 routine sites + 6 safety sites);
  (f) RECIPROCAL LINK — the evaluation.md Cross-references block gains a row (or equivalent pointer) to "auto-mode.md § Evaluation discipline (§7)", referenced by stable section NAME (§7 does not exist until T2; T4 confirms it resolves in the final state). This is the evaluation.md→auto-mode direction of the bidirectional citation graph;
  (g) NO section HEADER text was renamed (grep the section headers: text unchanged); (h) nothing deleted (D—none).
```

```yaml
id: 02-auto-mode-md-append-section-7
what: Append a new trailing §7 "Evaluation discipline (Auto Mode)" to auto-mode.md (after §6, before Cross-references) with sub-blocks §7.1–§7.4, plus minimal forward pointers and Cross-references rows — with NO renumbering of §1–§6, and §7.3's CLAUDE.md reference worded generically (not quoting CLAUDE.md's final text).
traces-to: ["Idea § Design File 1 — auto-mode.md", "Idea Problem 1 fix (§7.1)", "Idea Problem 2 fix (§7.2)", "Idea Problem 3 fix + carve-out (§7.3)", "Idea § Restructured section organization (§7.4 table)", "Idea D5 (trailing-append, no renumber)", "iter2 fix 3 (generic CLAUDE.md reference)"]
requires: ["01-evaluation-md-sharpen-and-mode-split"]
files:
  - path: ".gobbi/projects/gobbi/skills/orchestration/auto-mode.md"
    op: modify
inputs: ["evaluation.md-final-section-names"]
outputs: ["auto-mode-section-7"]
verifies: >
  (a) a new "## §7 — Evaluation discipline (Auto Mode)" section exists, inserted AFTER §6 (was line 251) and IMMEDIATELY BEFORE "## Cross-references" (was line 271);
  (b) §1–§6 headers are unchanged in number and text (grep "^## §" — exactly §1..§7 in order, no gaps/dupes);
  (c) §7 contains four sub-blocks: §7.1 (evaluation mandatory; manager MUST NOT ask whether/how to evaluate; "claude-only" is post-failure-only, links evaluation.md § Degraded-mode policy), §7.2 (manager MUST NOT evaluate; spawns exactly 2; cites evaluation/SKILL.md + the CLAUDE.md "Evaluation is a mandatory sub-phase" block — NO principle number; cites mistakes/manager-skipped-dual-system-eval.md), §7.3 (auto-iterate on REVISE; no routine-triage mid-loop covering Iteration Caps + Stuck detection + Regression marking; safety-gate carve-out naming the safety sites as interrupts; cites §3 and §6; its reference to CLAUDE.md is GENERIC — e.g. "the Auto-mode counterpart to the Chat-scoped finding-discussion rule in CLAUDE.md" — NOT a quote of CLAUDE.md's final text), §7.4 ("manager never" scannable table incl. a "silences a safety gate" NEVER-row);
  (d) forward pointers added: §2 preamble one-liner to §7; §4 evaluate.mode row (line 208) Notes-cell pointer to §7; §6 one-line pointer to §7.3;
  (e) Cross-references block gains rows to the reconciled CLAUDE.md line + evaluation.md § Degraded-mode policy + § Iteration Caps + § Stuck detection + § Regression marking (this is the auto-mode→evaluation direction; the reciprocal evaluation.md→auto-mode §7 row is added in T1);
  (f) every evaluation.md section name §7 cites matches an actual header in evaluation.md (cross-check against T1 output);
  (g) nothing deleted; new rule text leads with the imperative.
```

```yaml
id: 03-claude-md-reconcile-eval-blockquote
what: Reconcile the line-27 Evaluation blockquote in .claude/CLAUDE.md into the mode-split wording (Chat → discuss findings with user before improving; Auto → auto-iterate on REVISE, review full finding set at Wrap-up, only Always-Ask findings + named safety gates interrupt), preserving the "never auto-apply" safeguard — editing ONLY the line-27 paragraph.
traces-to: ["Idea § Design File 3 — .claude/CLAUDE.md", "Idea Problem 3a fix (primary CLAUDE.md reconcile)", "Idea D4 (mode-split, not delete)"]
requires: ["02-auto-mode-md-append-section-7"]
files:
  - path: ".claude/CLAUDE.md"
    op: modify
inputs: ["auto-mode-section-7"]
outputs: ["claude-md-eval-blockquote-reconciled"]
verifies: >
  (a) line-27 Evaluation block now reads mode-split: a Chat branch (discuss findings with user before improving — user decides address/defer/disagree) AND an Auto branch (auto-iterate on REVISE up to maxIterations; user reviews full finding set at Wrap-up; only Always-Ask findings + dual-system safety gates interrupt mid-loop); ends "See orchestration/auto-mode.md and orchestration/chat-mode.md";
  (b) the "never auto-apply" safeguard is preserved (not deleted);
  (c) line 31 (the #295 continued-teammate principles-intro sentence) is UNCHANGED — diff touches only the Evaluation blockquote paragraph;
  (d) the cited targets resolve: auto-mode.md now has §7 (from T2); chat-mode.md exists (out of scope, unchanged);
  (e) edit made directly to .claude/CLAUDE.md (real file, not symlink).
```

```yaml
id: 04-cross-file-consistency-check
what: After T1–T3 land, verify every cross-file reference resolves in the final state (the reciprocal auto-mode §7 ↔ evaluation.md edge both directions, and the mutual auto-mode↔CLAUDE.md edge both directions), the safety/routine classification is exhaustive, section order is preserved, scope is held to the three files, and nothing was retired without replacement.
traces-to: ["Idea § Cross-file consistency risks (1–7)", "Idea § Implementation checklist items 6–8", "Readiness Item 2 (scope) + C1 split-anchor + anchors table", "iter2 fix 1 (SKILL.md by section name) + fix 2 (exhaustive classification) + fix 3 (mutual-citation both directions)", "iter3 fix 1 (reciprocal link both directions)"]
requires: ["01-evaluation-md-sharpen-and-mode-split", "02-auto-mode-md-append-section-7", "03-claude-md-reconcile-eval-blockquote"]
files:
  - path: ".gobbi/projects/gobbi/skills/orchestration/auto-mode.md"
    op: read
  - path: ".gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md"
    op: read
  - path: ".claude/CLAUDE.md"
    op: read
  - path: ".gobbi/projects/gobbi/skills/orchestration/SKILL.md"
    op: read   # verify-only; MUST NOT be edited
  - path: ".gobbi/projects/gobbi/skills/orchestration/chat-mode.md"
    op: read   # verify-only; MUST NOT be edited
inputs: ["evaluation.md-final-section-names", "auto-mode-section-7", "claude-md-eval-blockquote-reconciled"]
outputs: ["consistency-verified"]
verifies: >
  (a) every evaluation.md section name cited in auto-mode.md §7 resolves to a real header in evaluation.md (grep each cited name);
  (b) RECIPROCAL LINK both directions resolve in the final post-T2 state — auto-mode.md §7 → evaluation.md sections (a, above) AND evaluation.md Cross-references → "auto-mode.md § Evaluation discipline (§7)" resolves to the actual §7 header that T2 created; no dangling pointer either way;
  (c) MUTUAL CITATION auto-mode↔CLAUDE.md both directions resolve in the final post-T3 state — auto-mode.md §7 → CLAUDE.md (generic reference resolves), CLAUDE.md line-27 → auto-mode.md (its §7 exists) and → chat-mode.md (exists); no dangling pointer either way;
  (d) the orchestration/SKILL.md "auto-mode.md §3 / §6" Mode-specific-gates pointer (currently line 266 post-#295) still references §3 and §6 BY SECTION NAME and BOTH still resolve in auto-mode.md (no renumber from the §7 append) — verify by STABLE CONTENT (grep "auto-mode.md §3" and "auto-mode.md §6" in SKILL.md), NOT by line number; and SKILL.md was NOT edited (git status clean for it);
  (e) CLASSIFICATION EXHAUSTIVE (cotouch-enumeration discipline, mistakes/cotouch-enumeration-must-cover-semantic-equivalents.md) — grep evaluation.md for EVERY escalation site ("AskUserQuestion", "escalate to", "Escalate to", "Surface to user", "Flag for user") and confirm each is classified: routine→mode-split (Iteration Caps @258 / Stuck @246 / Regression @239) OR safety→named in the carve-out (Severity-gated-Major @119, same-symptom-diff-root-cause @109, any-FAIL @137, degraded one-fails @194, both-fail @196, cost-budget @197). No escalation site left unclassified (no survivors);
  (f) chat-mode.md was NOT edited (git status clean) AND the C1 split-anchor holds: chat-mode.md is silent on Stuck/Regression (grep), so T1's Chat branch for those two cites evaluation.md's own behavior, not chat-mode.md; only the Iteration-Caps Chat branch may reference chat-mode.md;
  (g) CLAUDE.md line 31 unchanged; only line-27 paragraph changed;
  (h) git diff touches ONLY the three in-scope files (no out-of-scope path in the diff);
  (i) no section deleted in any file (retire-nothing); section order preserved in all three.
```

---

## Dependency table

| Task | Depends on | Blocks | Files touched |
|---|---|---|---|
| 01-evaluation-md-sharpen-and-mode-split | — | 02, 04 | `workflow/evaluation.md` |
| 02-auto-mode-md-append-section-7 | 01 | 03, 04 | `auto-mode.md` |
| 03-claude-md-reconcile-eval-blockquote | 02 | 04 | `.claude/CLAUDE.md` |
| 04-cross-file-consistency-check | 01, 02, 03 | — | (read-only: all 3 in-scope + 2 out-of-scope verify-only) |

Dependency basis: T1 finalizes the section names T2's §7 cites (citation-target-before-citer). T2 finalizes the `auto-mode.md` §7 that both T1's reciprocal row and T3's CLAUDE.md cite. T4 needs all three edits in place to verify cross-references end-to-end.

**Forward-by-name references — note.** Two reference edges point at a section that does not exist when the writing task runs, so each is written by stable section NAME and validated in the final state at T4 — NOT by reordering:
1. **Reciprocal: evaluation.md → auto-mode.md §7** (iter3 fix 1). T1 writes the evaluation.md Cross-references row by section name ("auto-mode.md § Evaluation discipline (§7)"). §7 does not exist until T2; T4(b) confirms the row resolves to the §7 header T2 created. T1 is NOT reordered after T2 — the section-name reference makes T1 self-contained, and the reciprocal pair (auto-mode→eval added in T2, eval→auto-mode added in T1) is validated together at T4.
2. **Mutual: auto-mode.md §7.3 → CLAUDE.md** (iter2 fix 3). T2 words its CLAUDE.md reference GENERICALLY (not quoting CLAUDE.md's final text), so T2 does not depend on T3's content; T3 needs auto-mode.md's §7 to already exist, which it does after T2. T4(c) validates both directions in the final state.

For docs this is sound — a citation only needs to resolve in the final committed state, not mid-sequence. Order stays T1→T2→T3→T4; do NOT reorder (T3 still wants §7 to exist first; T1's reciprocal row uses a name, not a forward dependency). No false dependencies.

## Parallel lanes

| Lane | Tasks | Order |
|---|---|---|
| L1 (single lane — all tasks share the citation graph) | 01 → 02 → 03 → 04 | strictly sequential |

No parallel-safe lanes exist: T1/T2/T3 each touch a different file but form a citation chain (with a reciprocal edge and a mutual edge), and T4 reads all of them. Execution runs sequentially per the planning skill regardless. **Conflict flags:** none — no two tasks touch the same file (T1=evaluation.md, T2=auto-mode.md, T3=CLAUDE.md; T4 read-only).

## Agent assignments

| Task | Agent type | Model | Required skills | Required mistakes |
|---|---|---|---|---|
| 01 | executor | opus (default) | `principles`, `mistake`, `execution`, `claude` doc-style fallback per Principle 6/7 (claude skill absent — non-blocking per readiness Item 4) | `skills-mirror-symlinks-not-copies`, `edit-tool-refuses-symlink-paths`, `section-order-is-part-of-the-contract-not-just-the-set`, `design-literal-retire-instruction-without-replacement`, `principle-text-lead-with-imperative-not-agent-psychology`, `cotouch-enumeration-must-cover-semantic-equivalents` |
| 02 | executor | opus (default) | same as T1 | `skills-mirror-symlinks-not-copies`, `edit-tool-refuses-symlink-paths`, `section-order-is-part-of-the-contract-not-just-the-set`, `design-literal-retire-instruction-without-replacement`, `principle-text-lead-with-imperative-not-agent-psychology` |
| 03 | executor | opus (default) | `principles`, `mistake`, `execution` (CLAUDE.md is a real file — symlink mistakes still loaded for discipline but the canonical-path rule does not apply to CLAUDE.md) | `section-order-is-part-of-the-contract-not-just-the-set`, `design-literal-retire-instruction-without-replacement`, `principle-text-lead-with-imperative-not-agent-psychology` |
| 04 | executor | opus (default) | `principles`, `mistake`, `execution` | `section-order-is-part-of-the-contract-not-just-the-set`, `design-literal-retire-instruction-without-replacement`, `cotouch-enumeration-must-cover-semantic-equivalents` (consistency + enumeration focus) |

All assignments are default (executor / opus) — no override needed. Rationale: each task is a bounded markdown edit (or, for T4, a verification pass) — squarely executor work; none requires sub-decomposition (would be leader) or is trivial enough for assistant. The edit-mechanics mistakes are carried on T1/T2 (canonical-path edits); T1 + T4 additionally carry `cotouch-enumeration-must-cover-semantic-equivalents` because the exhaustive-classification check is a semantic-equivalent enumeration (do not leave an unclassified escalation survivor).

## Edit-mechanics (binding for every edit task — from readiness Item 5)

- **Edit canonical `.gobbi/...` paths** for the two skill files (`auto-mode.md`, `workflow/evaluation.md`). The `.claude/skills/...` mirrors are symlinks; the Edit tool refuses to write through them (`edit-tool-refuses-symlink-paths`). The symlink reflects the canonical edit automatically — no double-edit (`skills-mirror-symlinks-not-copies`).
- **Edit `.claude/CLAUDE.md` directly** — it is a real file (no symlink, no `.gobbi` copy).
- **Use the Edit tool** for surgical in-place edits (executor role HAS Edit per `preparation/SKILL.md:4` / `planning/SKILL.md:4` allowed-tools). Fall back to Write only if Edit refuses a path.
- **Lead all new rule text with the imperative**, not agent-psychology (`principle-text-lead-with-imperative-not-agent-psychology`).
- **Preserve section order; retire nothing without replacement** (`section-order-is-part-of-the-contract`, `design-literal-retire-instruction-without-replacement`). All Problem-3 conflicts are mode-split, not deleted.
- **Anchors (post-rebase c8a8654, from readiness anchors table):** auto-mode.md — eval.mode row line 208, §6 line 251, Cross-references line 271 (§7 inserts between 270 and 271). evaluation.md — manager-job line 5, "spawns exactly two" line 42, § Severity-gated header 112 (Major @119), same-symptom-diff-root-cause @109, any-FAIL @137, § Degraded-mode header 188 (one-fails @194, both-fail @196, cost-budget @197), § Regression marking header 234 (escalation @239), § Stuck detection header 241 (escalation @246), § Iteration Caps header 253 (escalation @258), Cross-references block (reciprocal row added here). CLAUDE.md — Evaluation blockquote line 27; do NOT touch line 31.

## Cross-file consistency that MUST hold at the end (T4 owns this)

1. Every `evaluation.md` section name cited by `auto-mode.md §7` resolves to a real header (T1 must not rename headers; T2 must cite exact names).
2. **Reciprocal link both directions:** auto-mode.md §7 → evaluation.md sections (item 1) AND evaluation.md Cross-references → "auto-mode.md § Evaluation discipline (§7)" resolves to the §7 header T2 created. Bidirectional citation graph complete.
3. The `orchestration/SKILL.md` Mode-specific-gates pointer to `auto-mode.md §3 / §6` (currently line **266** post-#295) stays valid — §7 trailing-append does not renumber §1–§6. **Verify by section name (grep "auto-mode.md §3" / "auto-mode.md §6" in SKILL.md), not by line number.** SKILL.md is NOT edited.
4. C1 split-anchor: the Chat branch of T1's Stuck + Regression mode-splits cites evaluation.md's own existing behavior (chat-mode.md is silent on those); only the Iteration-Caps Chat branch may cite chat-mode.md. chat-mode.md is NOT edited.
5. Mutual citation auto-mode.md ↔ CLAUDE.md resolves BOTH directions in the final state (auto-mode §7.3 generic reference → CLAUDE.md; CLAUDE.md line-27 → auto-mode.md §7 + chat-mode.md).
6. Classification is EXHAUSTIVE — every evaluation.md escalation site is classified routine (mode-split) or safety (named carve-out); no unclassified survivor (cotouch-enumeration discipline).
7. git diff touches ONLY the three in-scope files.

## Safety / routine classification of evaluation.md escalation sites (EXHAUSTIVE — for T1 + T4)

Manager decision (applying the user's locked routine-vs-safety rule): all escalation sites enumerated by the full grep sweep are classified below. The six safety-gate sites already interrupt correctly in both modes — NO per-site behavior edit; T1 only LABELS them in the carve-out so the classification is complete.

| evaluation.md site | Line | Class | Action in T1 |
|---|---|---|---|
| § Regression marking | 239 (header 234) | ROUTINE-TRIAGE | mode-split (Chat = user-aware; Auto = record + Wrap-up) |
| § Stuck detection | 246 (header 241) | ROUTINE-TRIAGE | mode-split (Chat = escalate; Auto = tag + budget + Wrap-up) |
| § Iteration Caps | 258 (header 253) | ROUTINE-TRIAGE | mode-split (Chat = escalate; Auto = record abort + Wrap-up) |
| § Severity-gated divergence — Major | 119 (header 112) | SAFETY-GATE | name in carve-out (interrupts both modes; no edit) |
| Same-symptom-different-root-cause | 109 | SAFETY-GATE (divergence resolution) | name in carve-out (no edit) |
| § Verdict aggregation — any `FAIL` | 137 | SAFETY-GATE (§1 interrupt #3, unresolvable) | name in carve-out (no edit) |
| § Degraded-mode — one system fails | 194 (header 188) | SAFETY-GATE | name in carve-out (no edit) |
| § Degraded-mode — both systems fail | 196 | SAFETY-GATE | name in carve-out (no edit) |
| § Degraded-mode — cost-budget approaching cap | 197 | SAFETY-GATE (budget gate) | name in carve-out (no edit) |

This is the complete escalation inventory from the grep sweep of evaluation.md at c8a8654. No site is left unclassified.

## Self-review report (Sub-step E)

- **Spec coverage:** every Idea design item + iter2/iter3 fix maps to a task. File 1 (evaluation.md, incl. reciprocal row) → T1. File 2 (auto-mode.md §7 + pointers) → T2. File 3 (CLAUDE.md line 27) → T3. Cross-file risks + checklist + iter2 fixes 1/2/3 + iter3 fix 1 → T4 (and T1 for exhaustive classification + reciprocal row, T2 for generic CLAUDE.md reference). Problem 1 → T1(b) + T2(§7.1). Problem 2 → T1(a) + T2(§7.2). Problem 3a → T3. Problem 3b/c/d → T1(c). Safety-gate carve-out + exhaustive classification (D8 + iter2 fix 2) → T1(d)(e) + the classification table + T2(§7.3/§7.4) + T4(e). Reciprocal link (iter3 fix 1) → T1(f) + T2(e) + T4(b). No design item unmapped; no task without an anchor.
- **Placeholder scan:** zero `TBD`/`TODO`/`<...>`/`XXX`/`FIXME` in any task `what`/`verifies`. (The `# ...` items in YAML are inline clarifying comments, not placeholders.)
- **Type/name consistency:** `outputs`→`inputs` chain consistent: T1 emits `evaluation.md-final-section-names` → consumed by T2 + T4; T2 emits `auto-mode-section-7` → consumed by T3 + T4; T3 emits `claude-md-eval-blockquote-reconciled` → consumed by T4. Section identifiers consistent across tasks: §7.1/§7.2/§7.3/§7.4 named identically in T2 and T4; the reciprocal pointer is spelled "auto-mode.md § Evaluation discipline (§7)" identically in T1(f), T2(e), T4(b), and consistency item 2; evaluation.md section names (§ Iteration Caps / § Stuck detection / § Regression marking / § Severity-gated divergence handling / § Degraded-mode policy) spelled identically in T1, T2, T4, the classification table, and match the actual headers verified at c8a8654. Mistake slug `cotouch-enumeration-must-cover-semantic-equivalents` spelled identically in T1, T4 assignments + T4(e) + consistency item 6. No drift.
- **Anchor-correctness (iter2 fix 1, restated accurately for iter3):** no OPERATIVE `orchestration/SKILL.md:247` anchor remains anywhere in the plan — every operative pointer uses line **266** and T4 verifies it by section name, not line number. The only occurrences of the literal string "247" in this draft are this self-review note and DD6, both of which are decision-log records of the 247→266 correction (historical note, not an operative anchor). Confirmed by scanning the whole draft: zero operative-anchor survivors; the two string occurrences are explicitly meta-commentary.
- **Reciprocal-link coverage (iter3 fix 1):** the evaluation.md→auto-mode §7 row is present in T1(f); the auto-mode→evaluation rows are in T2(e); T4(b) verifies BOTH directions resolve. Bidirectional citation graph is complete and gated.
- **Result:** zero findings. Clean.

## NOT in scope

- `orchestration/SKILL.md` (read-only; the `auto-mode.md §3 / §6` Mode-specific-gates pointer at line **266** must stay valid — the trailing-append §7 design guarantees this; T4 verifies by section name, does not edit).
- `chat-mode.md`, `discussion/SKILL.md`, `principles/SKILL.md`, templates, settings — read-only references.
- Any behavior change beyond the three fixes (Auto runtime shape unchanged). The six safety-gate escalation sites get NO behavior change — they are only labeled in the classification carve-out.
- The stale "Principle 11" citation inside `mistakes/manager-skipped-dual-system-eval.md` — NOT edited; §7.2 simply does not carry the wrong number (Idea D7).
- CLAUDE.md line 31 (#295 continued-teammate sentence) — explicitly preserved, never touched.

## Decisions log

- **DD1 (decomposition):** Hybrid — 3 per-file edit tasks + 1 consistency-check task. Justified above (citation graph → per-file commits + a final cross-file gate). Not single-task (mixed concerns, large diff) and not bare per-file (forward-pointer risk without sequencing + no cross-file gate).
- **DD2 (ordering):** T1 evaluation.md → T2 auto-mode.md → T3 CLAUDE.md → T4 check. Driven by the citation graph (cite-target before citer); T1 deliberately does NOT rename headers so T2's citations stay valid.
- **DD3 (agents):** all executor/opus default — bounded markdown edits + one verification pass; no override.
- **DD4 (USER CHALLENGE):** none. My research-backed judgment AGREES with every locked decision (trailing-append §7, mode-split-not-delete, routine-vs-safety carve-out, edit canonical paths, exhaustive classification, reciprocal link). No substantive disagreement to escalate.
- **DD5 (iter2 — mutual citation):** auto-mode.md ↔ CLAUDE.md cite each other. Resolved without reordering: T2 words its CLAUDE.md reference generically (no dependency on T3's text); T3 needs §7 to exist (true after T2); T4 validates both directions in the final state. Docs only need citations to resolve in the committed final state.
- **DD6 (iter2 — anchor correction):** the stale operative `orchestration/SKILL.md:247` pointer was corrected to line **266** (post-#295 added 73 lines; 247 is now a table separator). T4 verifies the §3/§6 pointer by stable section name, not line number, so it survives future line shifts. NOTE: this DD and the self-review's anchor-correctness bullet are the only places the literal string "247" appears; both are historical records of the correction, not operative anchors — the no-survivor claim is about operative anchors.
- **DD7 (iter2 — exhaustive classification):** the routine-vs-safety classification names all 9 escalation sites (3 routine + 6 safety) from the full grep sweep. The six safety sites already interrupt in both modes (no behavior edit); T1 labels them so no site is ambiguous; T4 greps for any unclassified survivor. Applies the cotouch-enumeration discipline. This is execution of the already-locked routine-vs-safety rule, not a new design direction.
- **DD8 (iter3 — reciprocal Cross-references link):** the Idea (File-2 edits, marked "optional, Planning to confirm") delegated the reciprocal evaluation.md→auto-mode §7 Cross-references row to Planning. MANAGER DECISION: INCLUDE it — a consistent bidirectional citation graph is the right call. Added to T1(f) (written by stable section name since §7 does not exist until T2), with T4(b) verifying both directions resolve in the final state. Stays inside evaluation.md (in scope); no reorder (T1 self-contained via section-name reference). This is execution of an Idea-delegated option, not a new design direction.
