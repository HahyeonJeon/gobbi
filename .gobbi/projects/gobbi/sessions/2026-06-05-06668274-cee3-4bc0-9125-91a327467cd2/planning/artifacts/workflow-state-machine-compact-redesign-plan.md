---
artifact_type: plan
title: Workflow State Machine section — compact redesign plan
session: 2026-06-05-06668274-cee3-4bc0-9125-91a327467cd2
status: ready
created: 2026-06-06
target_file: .gobbi/projects/gobbi/skills/orchestration/SKILL.md
target_lines: 193-295
---

# Plan — compact-redesign `## Workflow State Machine` (orchestration/SKILL.md)

## Scope reference

- **Target (drop-in replacement):** `orchestration/SKILL.md` lines **193-295** — from `## Workflow State Machine` to (but **not including**) the `---` rule preceding `## Workflow Metadata` at line 296.
- **Canonical file:** `.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (the `.claude/skills/orchestration/SKILL.md` path is a **symlink** to it — edit the canonical `.gobbi/...` path; the Edit tool refuses symlink paths, see mistake `edit-tool-refuses-symlink-paths`).
- **Style references (compacted this session):** `## Workflow Session Memory` (134-192) and `## Workflow Metadata` (297-345). Match their conventions: content-named table columns (`When|What`, `Item|Value`, `Key|Shape`), `<ul><li>` inside dense cells, label-style lists, no meta-filler.
- **User-locked decisions:** D1 (remove mode-gates subsection → pointer, after verifying coverage), D2 (keep loop↔agent map, light touch), D3 (trim chat.tasks[] schema to cross-ref; redesign state.json table to content columns + `<ul><li>`), General (keep in-boundary CORE intact, compact prose, keep H2 heading text + all anchor-bearing H3 headings).

---

## §A — Complete verbatim new `## Workflow State Machine` section (drop-in for lines 193-295)

> Replace the entire current 193-295 block with the block below. Preserve the existing `---` at line 296 (it is OUTSIDE the replacement range — do not duplicate or remove it). The block below starts at `## Workflow State Machine` and ends at the last line of `### Loop ↔ agent type mapping`'s trailing note (no trailing `---`).

```markdown
## Workflow State Machine

In Auto Mode the state machine runs linearly across the six steps. In Chat Mode it dispatches a per-task slice meta-loop between Configuration and Wrap-up; see [`chat-mode.md §3 — Workflow`](chat-mode.md) for the Chat per-slice procedure and [`chat-mode.md §8.2 — Per-task state-transition table`](chat-mode.md) for the per-task state-transition table. This section specifies the loop-internal phase mechanics (DISCUSSION → WORK → EVALUATION → MEMORIZATION → ITER/EXIT) shared by both modes for steps 2-6. The manager moves between states only when each state's postcondition is met.

> **Loop-entry Skipped resolution.** A step resolves to `state: Skipped` at loop entry when **either** `skip: true` **OR** `maxIterations: 0` is set — two independent signals, either alone sufficient. A Skipped step runs no phase rows, emits no `FAIL` / `Aborted` verdict, and stamps `{state: "Skipped", iterations: []}`. `skip: true` is the preferred explicit signal; `maxIterations: 0` (the original "R1 lock") stays valid for back-compatibility. This is distinct from `evaluate.mode: "skip"`, which skips only the EVALUATION phase — the loop still runs WORK → MEMORIZATION.

### State persistence

The manager maintains state in a per-session `state.json` file.

| Item | Value |
|---|---|
| Location | `.gobbi/projects/{project-name}/sessions/{date}-{session-id}/state.json` |
| Initial template | [`templates/state.template.json`](templates/state.template.json) |
| Writer / Reader | manager — writer on every transition; reader to recover position after `/clear` / `/compact` / resume, and as the projection source for the [Workflow Status Display](#workflow-status-display) |
| Update points | every state transition: `DISCUSSION`→`WORK`, `WORK`→`EVALUATION`, `EVALUATION`→`MEMORIZATION`, `MEMORIZATION`→`ITER/EXIT`, plus inter-step transitions at loop exits |
| Status semantics | <ul><li>`state` ∈ `Pending` / `Active` / `Revising` / `Done` / `Skipped` / `Aborted`.</li><li>When `Active`, `phase` names the current state (`DISCUSSION`, `WORK`'s loop verb, `EVALUATION`, `MEMORIZATION`, `ITER/EXIT`).</li></ul> |
| Schema shape | <ul><li>`workflow` is keyed by step name — `configuration` / `ideation` / `preparation` / `planning` / `execution` / `wrap-up` — matching the `workflow.{step}` keys in `settings.json`; each entry carries `state`, `verdict`, `iter`, `maxIterations`, `phase`.</li><li>The active step is **derived** (the entry whose `state` is `Active` or `Revising`) — there is no `active` key.</li><li>Display order (Configuration → Ideation → Preparation → Planning → Execution → Wrap-up) is fixed by convention regardless of object iteration.</li><li>`skip` is a `settings.json`-only key; the state-machine entry derives `Skipped` from it at loop entry per the resolution above — `state.json` itself gains **no** `skip` key.</li><li>Chat sessions additionally carry `workflow.chat.tasks[]` — see below.</li></ul> |
| `workflow.chat.tasks[]` | Chat-only additive array (empty for Auto), present in both `state.json` and `session.json`. Owned by [`chat-mode.md`](chat-mode.md); full field reference in [§ Workflow Metadata → Field reference](#workflow-metadata). The `state.json` variant is the live state-machine projection (R3). |

### Loop states

| State | Precondition | Owner | Action | Postcondition (artifact) |
|---|---|---|---|---|
| `DISCUSSION` | Loop entered with input from the prior step, OR re-entered from `ITER/EXIT` after `REVISE` / `FAIL` | manager | Construct the delegation prompt for the owning specialist; in Chat Mode, confirm with the user; spawn the specialist via the Agent tool (the prompt is captured in the parent transcript's tool_use entry — no separate file) | Specialist spawned; prompt persisted in the parent transcript |
| `WORK` | Specialist spawned in `DISCUSSION` | owning specialist (`leader` / `executor` / `assistant`) | Execute the loop's work per the delegation prompt | Loop's work artifact |
| `EVALUATION` | Work artifact exists; `workflow.{step}.evaluate.mode != 'skip'` | evaluator subagents (independent of the work owner) | Multi-perspective review per the evaluation policy | Aggregated verdict: `PASS` / `REVISE` / `FAIL` |
| `MEMORIZATION` | `EVALUATION` complete OR skipped per policy | `assistant` subagent | Write session staging for this iteration; project-memory promotion only in Wrap-up | Memory writes complete |
| `ITER / EXIT` | `MEMORIZATION` complete | manager | Decide on verdict + budget: continue (transition to `DISCUSSION`, `iter += 1`) or exit (loop closed; surface output to next step) | Loop continues OR loop closed |

`iter` starts at `0` on loop entry. `maxIterations` is read from `workflow.{step}.maxIterations` (default `5`). If `evaluate.mode == 'skip'`, the loop bypasses `EVALUATION` and runs `WORK` → `MEMORIZATION` → `ITER/EXIT` on the first pass; the absent verdict is treated as `Skipped` at `ITER/EXIT`.

### Verdict aggregation

| Evaluator verdicts | Aggregated verdict |
|---|---|
| All `PASS` | `PASS` |
| Any `REVISE`, no `FAIL` | `REVISE` |
| Any `FAIL` | `FAIL` |

### Iteration rule

After `EVALUATION` (or its skip path), the loop always proceeds to `MEMORIZATION`. The iteration decision happens at `ITER/EXIT`:

- **`PASS`** → exit the loop; surface the work artifact as input to the next step.
- **`Skipped`** (no verdict — `evaluate.mode == 'skip'`) → exit the loop; surface the work artifact.
- **`REVISE` / `FAIL` and `iter < maxIterations`** → increment `iter`, attach the eval findings to the next delegation prompt, re-enter `DISCUSSION`. Re-entry is always at `DISCUSSION` — never directly at `WORK`.
- **`REVISE` / `FAIL` and `iter == maxIterations`** → exit with abort. The failure is captured in this iteration's `MEMORIZATION`; the next loop's input notes the abort.

### Mode-specific gates within a loop

The per-loop user-interaction gates are mode-specific and owned by the mode docs:

- **Chat Mode** — the three in-loop gates (after DISCUSSION, after EVALUATION, at ITER/EXIT) plus the fourth task-boundary review gate, and the `discuss.mode` shadowing rule: [`chat-mode.md §5 — Per-loop discipline`](chat-mode.md) (gates + shadowing), [`chat-mode.md` Slice Boundary + §8](chat-mode.md) (task-boundary gate).
- **Auto Mode** — silent auto-advance, the Always-Ask interrupts, and the no-interrupt-on-`maxIterations` rule: [`auto-mode.md §3 — Always-Ask codification`](auto-mode.md) and [`auto-mode.md §6 — maxIterations exhaustion`](auto-mode.md).

### Loop ↔ agent type mapping

| Step | Owning agent type |
|---|---|
| 1 — Configuration | manager (direct) |
| 2 — Ideation | `leader` |
| 3 — Preparation | `leader` |
| 4 — Planning | `leader` |
| 5 — Execution | `executor` |
| 6 — Wrap-up | `assistant` |
| `EVALUATION` (every loop) | `evaluator` (independent of the work owner) |
| `MEMORIZATION` (every loop) | `assistant` |

The manager owns no loop directly except Configuration; the manager coordinates.

*Memorization detail (what files, scope of project-memory updates) lives in [`workflow/memorization.md`](workflow/memorization.md).*
```

### §A — fact-preservation ledger (every in-boundary fact, mapped old→new)

| In-boundary fact (old line) | Where preserved in new section |
|---|---|
| Auto = linear; Chat = per-task slice meta-loop; both share DISCUSSION→WORK→EVALUATION→MEMORIZATION→ITER/EXIT (195, 207) | Intro paragraph |
| Cross-refs to `chat-mode.md §3` and `§8.2` (195) | Intro (kept; "Chat-specific" filler trimmed) |
| Skipped resolution: `skip:true` OR `maxIterations:0`, independent, either sufficient (197-201) | Skipped-resolution callout (tightened) |
| Skipped step runs no phase rows, no FAIL/Aborted, stamps `{state:"Skipped",iterations:[]}` (200-202) | Skipped-resolution callout |
| `maxIterations:0` = original "R1 lock", coexists, `skip:true` preferred (202-204) | Skipped-resolution callout |
| Distinct from `evaluate.mode:"skip"` (skips only EVALUATION) (204-205) | Skipped-resolution callout |
| state.json location / template / writer / reader / update points (215-219) | State persistence table (merged Writer+Reader into one row) |
| Status semantics: state enum + phase-when-Active (220) | State persistence `Status semantics` cell (`<ul><li>`) |
| Schema shape: workflow keyed by step; derived active; fixed display order; `skip` is settings-only, state.json gains no skip key; chat.tasks pointer (221) | State persistence `Schema shape` cell (`<ul><li>`) |
| chat.tasks[] presence/owner (Chat-only, both files) (222) | `workflow.chat.tasks[]` row — **trimmed to cross-ref** per D3; full schema → § Workflow Metadata |
| Loop states 5-row table verbatim semantics (226-232) | Loop states table (column header set unchanged — already content-named) |
| `iter` starts 0; `maxIterations` default 5 (234) | prose after Loop states table |
| `evaluate.mode=='skip'` bypass behavior (236) | prose after Loop states table |
| Verdict aggregation 3-row table (240-244) | Verdict aggregation table (verbatim) |
| Iteration rule: PASS / Skipped / REVISE-FAIL<max / REVISE-FAIL==max (248-253) | Iteration rule list (verbatim semantics) |
| 4 Chat gates + discuss.mode shadowing (255-268) | **Removed inline** → pointer to chat-mode.md (D1; see §B) |
| Auto advance + 3 interrupt triggers + maxIterations-no-interrupt (270-276) | **Removed inline** → pointer to auto-mode.md (D1; see §B) |
| Loop↔agent map 8-row table (280-289) | Loop↔agent mapping table (verbatim — D2 light touch) |
| "manager owns no loop except Configuration" (291) | kept verbatim |
| Memorization-detail pointer note (293) | kept verbatim |

No in-boundary fact is dropped. The only removed *content* is the out-of-boundary mode-gate detail (verified covered — §B).

---

## §B — D1 verification (coverage of removed mode-gates content)

**Removed subsection:** `### Mode-specific gates within a loop` (old lines 255-276). Replaced with a 2-bullet pointer. Coverage of each removed fact, with anchor citations, verified by reading `chat-mode.md` and `auto-mode.md` in this session:

| Removed fact (old line) | Covered in | Verified excerpt / location |
|---|---|---|
| Chat gate 1 — after DISCUSSION → confirm delegation prompt (261) | `chat-mode.md §5` (line 296-298) | "Three mode-specific gates within a loop still apply … after DISCUSSION → confirm delegation prompt" |
| Chat gate 2 — after EVALUATION → discuss findings + remediation (262) | `chat-mode.md §5` (line 297-298) | "after EVALUATION → discuss findings and remediation" |
| Chat gate 3 — at ITER/EXIT → confirm exit (263) | `chat-mode.md §5` (line 298) | "at ITER/EXIT → confirm exit" |
| Chat gate 4 — task-boundary review gate (Next/Revise/Wrap up) (264) | `chat-mode.md §3` Slice Boundary (line 204-219) + `§8` | "AskUserQuestion: Next task / Revise this task / Wrap up the session" (line 218); the Next/Revise/Wrap-up semantics are spelled out at line 219 |
| WORK + MEMORIZATION auto-advance (266) | `chat-mode.md §5` (implicit — only the three gates pause) + `§3` step tables | §5 enumerates exactly the gates that pause; WORK/MEMORIZATION rows in §3 carry no user gate. Auto-advance of WORK/MEMORIZATION is the absence-of-gate, stated by omission. **See gap note below.** |
| `discuss.mode` shadowed in Chat (every entry forces user DISCUSSION) (268) | `chat-mode.md §5` (line 291-295) + `§9` (line 552-561) | §5: "DISCUSSION is forced user-driven, regardless of the resolved discuss.mode"; §9 is the binding mode-level contract |
| Auto advances every state without pausing (270) | `auto-mode.md §1` + `§5` (line 231-248) | §5 banner conditioning restates the bias-toward-not-stopping default |
| Auto interrupt trigger — eval findings imply scope change (272) | `auto-mode.md §3.3` Scope row (line 182) | Always-Ask "Scope" category covers extending/narrowing the Scope Contract mid-workflow |
| Auto interrupt trigger — unresolvable phase failure (273) | `auto-mode.md §6` Exception (line 265-268) | "If a Planning or Execution abort makes the remaining steps unsound … the manager MUST surface this via AskUserQuestion" |
| Auto interrupt trigger — user may intervene anytime (274) | `auto-mode.md §3` / general | Always-Ask matrix + user authority; user-interrupt-anytime is a baseline manager property, not Auto-specific |
| `maxIterations` exhaustion does NOT interrupt user; abort captured in MEMORIZATION + surfaces in Wrap-up report (276) | `auto-mode.md §6` (line 252-263) | "this does not interrupt the user mid-session. The manager notes the abort … failure surfaces explicitly in the Wrap-up Loop's MEMORIZATION and the session handoff" |

**All removed facts are covered EXCEPT one soft gap (flagged, not silently dropped):**

- **GAP-1 (low severity): "WORK and MEMORIZATION auto-advance" is covered only by omission in `chat-mode.md`, not by an explicit positive statement.** Old line 266 states it positively: "`WORK` and `MEMORIZATION` auto-advance — the user has already approved the delegation prompt, and `MEMORIZATION` is mechanical capture." `chat-mode.md §5` lists the three pausing gates but never says WORK/MEMORIZATION do NOT pause. **Recommended resolution (executor, optional — surface to user):** either (a) accept the gap (the three-gate enumeration is exhaustive by construction, so non-listed phases auto-advance), or (b) add one clause to `chat-mode.md §5` after the gates bullet: "WORK and MEMORIZATION auto-advance — the delegation prompt is already user-approved and MEMORIZATION is mechanical capture." Option (b) keeps the positive statement at the canonical owner without re-bloating SKILL.md. **This is the only fact at risk; everything else is explicitly covered.**

**Direction-of-ownership note (important for the executor + evaluator):** the *current* cross-reference direction is INVERTED relative to D1's framing. Today both `chat-mode.md §5` (line 296-297) and `auto-mode.md` Cross-references (line 274-275) point *at* `orchestration/SKILL.md § Mode-specific gates within a loop` as the canonical gate owner. After this edit, SKILL.md points *at* the mode docs. The two inbound pointers therefore become **stale/circular** and MUST be repointed — see §C. Without the §C repoints, the gate detail has NO canonical owner (both sides point at each other / at a removed anchor).

---

## §C — Blast-radius (inbound anchor references)

Sweep run over `.gobbi/projects/gobbi/skills/` (canonical tree; sessions/ + worktrees/ excluded by being outside the skills subtree). Anchors of this section and their inbound refs:

| Anchor | H3/H2 heading kept? | Inbound refs (file:line) | Action |
|---|---|---|---|
| `#workflow-state-machine` | **YES** — H2 text unchanged | `auto-mode.md:50`; `auto-mode.md:153` (via `#iteration-rule`); `chat-mode.md:152` (via `#verdict-aggregation`); `chat-mode.md:237` (via `#iteration-rule`); `SKILL.md:59,85,110,128` (self) | **No edit** — anchor survives |
| `#state-persistence` | **YES** — `### State persistence` text unchanged | `SKILL.md:85,148,157,167` (self, intra-doc) | **No edit** — anchor survives (required-to-survive per brief; confirmed) |
| `#loop-states` | **YES** — `### Loop states` text unchanged | `chat-mode.md:490` ("Parallel to … § Loop states") | **No edit** — anchor survives |
| `#verdict-aggregation` | **YES** — `### Verdict aggregation` text unchanged | `workflow/evaluation.md:307`; `workflow/memorization.md:320`; `chat-mode.md:152` | **No edit** — anchor survives |
| `#iteration-rule` | **YES** — `### Iteration rule` text unchanged | `auto-mode.md:153`; `chat-mode.md:237`; (`workflow/evaluation.md:253` + `workflow/memorization.md:287` are local `## Iteration Caps` headings in OTHER files — not refs to this anchor) | **No edit** — anchor survives. Note: external links use display text "§ Iteration Caps" but href `#iteration-rule`; href is what matters and it is preserved. |
| `#mode-specific-gates-within-a-loop` | **YES (heading kept, content changed to pointer)** | `auto-mode.md:274-276`; `chat-mode.md:296-297` (§5 body); `chat-mode.md:567-569` (Cross-references) | **REPOINT — 3 edits required (see below).** The anchor technically survives (heading text unchanged), but the subsection no longer *owns* the gate list — it now points back. Leaving the inbound refs unedited creates a circular/empty-owner loop. |
| `#loop--agent-type-mapping` | **YES** — `### Loop ↔ agent type mapping` text unchanged | none found (only self-heading `SKILL.md:278`) | **No edit** — anchor survives |

**Anchor survival summary:** all seven H3/H2 headings keep their exact text, so **all seven anchors survive**. `#state-persistence` survives (confirmed per brief requirement). No anchor is deleted; no link 404s on the anchor-existence test. The only semantic breakage is the **ownership inversion** at `#mode-specific-gates-within-a-loop`, fixed by the three repoints below.

### Required repoint edits (executor — in this same task)

These keep the canonical-owner direction coherent after SKILL.md flips to pointing outward. They are small, surgical, and IN SCOPE (they are the necessary co-touch for D1 per Principle 6 — documentation co-update).

- **C-EDIT-1 — `auto-mode.md` Cross-references (line 274-276).** Current text points to SKILL.md "§ Mode-specific gates within a loop for the three per-loop user gates". After the flip, auto-mode.md is itself a canonical owner. Change the bullet to describe SKILL.md as the *shared mechanics* doc that *points back here* for the gates — e.g.: "`§ Workflow State Machine` for the shared loop mechanics (it points back to this doc's §3/§6 for the Auto gate behavior)". Keep the `§ Workflow Status Display` and maxIterations-line clauses. **Note (out of scope, flag only):** the same bullet cites "line 405 for the maxIterations exhaustion silence contract" and `auto-mode.md:260` cites "orchestration/SKILL.md line 405" — SKILL.md is only ~345 lines, so this is a pre-existing stale line-number reference. Do NOT fix it in this task (out of boundary); record as backlog candidate.
- **C-EDIT-2 — `chat-mode.md §5` (line 296-298).** Current: "Three mode-specific gates within a loop still apply (per `orchestration/SKILL.md § Mode-specific gates within a loop`): after DISCUSSION → … after EVALUATION → … at ITER/EXIT → confirm exit." Since §5 now BECOMES the canonical gate owner, drop the back-pointer parenthetical (or invert it). Recommended: keep the three-gate enumeration here (it is the canonical statement) and change the parenthetical from "per `orchestration/SKILL.md § Mode-specific gates within a loop`" to "(the shared mechanics in `orchestration/SKILL.md § Workflow State Machine` point here)". If GAP-1 option (b) is accepted, append the WORK/MEMORIZATION auto-advance clause here.
- **C-EDIT-3 — `chat-mode.md` Cross-references (line 567-569).** Current: "`§ Mode-specific gates within a loop` for the three per-loop user gates + fourth per-task user review gate". Change to reference the shared-mechanics section that points back: "`§ Workflow State Machine` for the shared loop mechanics (it points here for the Chat gates)". The fourth-gate detail already lives in §3/§8 of chat-mode.md.

> If the user prefers to keep SKILL.md as the canonical gate owner (i.e., NOT do D1 as a flip-to-pointer), that contradicts the locked D1 — flag to user rather than silently choosing. D1 as written = remove the inline gate detail and point out; the three repoints are the cost of honoring it coherently.

---

## §D — Implementation sequence + verification greps

**Agent:** `executor`. **Model:** default (opus). **Files:** `orchestration/SKILL.md` (modify), `orchestration/auto-mode.md` (modify), `orchestration/chat-mode.md` (modify) — all under `.gobbi/projects/gobbi/skills/`.
**Required skills:** `principles`, `mistake`, `claude` (`.claude/` doc authoring standard).
**Required mistakes:** `section-order-is-part-of-the-contract-not-just-the-set`, `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck` (verbatim re-read before editing), `edit-tool-refuses-symlink-paths` (edit canonical `.gobbi/...` path, not the `.claude/` symlink), `naming-standard-needs-positive-guidance-not-just-blocklist`.

**Sequence (single executor task; edits are interdependent — same files, must land together):**

1. Re-read `orchestration/SKILL.md` lines 193-295 verbatim into context (Iron Law 7 — do not edit from this plan's quoted copy alone; ground-truth against the live file first; this plan's §A was copied from the live file but the executor must re-confirm).
2. Replace lines 193-295 with the §A block. Preserve the `---` at line 296 (outside range). Keep all seven H3/H2 heading texts exactly.
3. Apply C-EDIT-1 (auto-mode.md Cross-references), C-EDIT-2 (chat-mode.md §5), C-EDIT-3 (chat-mode.md Cross-references) per §C.
4. Run the verification greps below.

**Verification greps (run from `.gobbi/projects/gobbi/skills/`):**

```
# 1. All seven anchor-bearing headings still present, in order (order is part of the contract):
grep -n "^## Workflow State Machine$\|^### State persistence$\|^### Loop states$\|^### Verdict aggregation$\|^### Iteration rule$\|^### Mode-specific gates within a loop$\|^### Loop ↔ agent type mapping$" orchestration/SKILL.md
#   → expect 7 lines, in this exact top-to-bottom order:
#     Workflow State Machine → State persistence → Loop states → Verdict aggregation
#     → Iteration rule → Mode-specific gates within a loop → Loop ↔ agent type mapping

# 2. No inbound ref points at a now-missing anchor (every #anchor in links must exist as a heading):
grep -rn "SKILL.md#state-persistence\|SKILL.md#loop-states\|SKILL.md#verdict-aggregation\|SKILL.md#iteration-rule\|SKILL.md#workflow-state-machine" orchestration/
#   → every hit's anchor must correspond to a surviving heading (it does — all 7 kept).

# 3. The chat.tasks[] full schema is GONE from State persistence (now a cross-ref only):
grep -n "taskRecord\|zero-padded ordinal\|per-loop sub-records" orchestration/SKILL.md
#   → expect 0 hits inside the Workflow State Machine section (lines ~193-285);
#     hits remain only in § Workflow Metadata Field reference (line ~324) — that is correct.

# 4. The mode-gate detail is GONE from SKILL.md and lives in the mode docs:
grep -n "After .DISCUSSION. .*AskUserQuestion\|maxIterations. exhaustion in Auto Mode does NOT" orchestration/SKILL.md
#   → expect 0 hits (detail moved to chat-mode.md §5 + auto-mode.md §6).

# 5. Repoints landed — no inbound ref still claims SKILL.md OWNS the gate list:
grep -n "§ Mode-specific gates within a loop. for the three per-loop user gates" orchestration/auto-mode.md orchestration/chat-mode.md
#   → expect 0 hits after C-EDIT-1 / C-EDIT-3.

# 6. Section is actually shorter (compaction goal):
awk '/^## Workflow State Machine$/{s=NR} /^## Workflow Metadata$/{print "lines:", NR-s; exit}' orchestration/SKILL.md
#   → expect roughly 75-85 lines (was 103: 193-295). See §A before/after estimate.
```

**Before/after line estimate:** current section = **103 lines** (193-295). New §A block ≈ **80 lines** (intro 2 + Skipped callout 1 + State persistence table 9 + Loop states table 7 + prose 1 + Verdict table 5 + Iteration rule list 5 + Mode-gates pointer 3 + Loop↔agent table 11 + notes 2, plus blank lines and headings). Net ≈ **−23 lines** in SKILL.md, with the mode-gate detail relocated (net-neutral) to the mode docs. Compaction target met without fact loss.

---

## §E — Open questions / risks

1. **GAP-1 (WORK/MEMORIZATION auto-advance positive statement).** Low severity. Recommend the user pick: accept omission-coverage, or add one clause to `chat-mode.md §5` (§B option b). Default recommendation: option (b) — cheap, keeps the positive statement at the canonical owner.
2. **Ownership-inversion repoints (C-EDIT-1/2/3).** These are required co-edits to honor D1 coherently. They touch two extra files beyond SKILL.md. Confirm the user accepts the 3-file blast radius (it is the minimum to avoid a circular/empty-owner reference). If the user wants SKILL.md to stay the gate owner, that conflicts with D1 — surface, do not silently choose.
3. **Pre-existing stale "line 405" reference** in `auto-mode.md:260` + `auto-mode.md:276` (SKILL.md is ~345 lines). Out of this task's boundary. Flagged as a backlog candidate, not fixed here.
4. **`#iteration-rule` display-text mismatch.** Inbound links render as "§ Iteration Caps" but href `#iteration-rule`. The heading text stays `### Iteration rule`, so the anchor resolves. The display-text/heading mismatch is pre-existing and out of scope — do not rename the heading (renaming would break the anchor). Noted so the evaluator does not flag it as drift introduced here.
5. **Verbatim-copy discipline.** §A was copied from the live file (lines 193-295) read this session, but the executor MUST re-read the live file immediately before editing (Iron Law 7 / mistake `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck`) — the file was last modified 2026-06-06 09:16 during this same session's sibling compactions; a concurrent edit could shift line numbers. Anchor the Edit on heading text, not raw line numbers.

---

## Self-review (against planning checklist)

- **Verbatim-preserved-parts rule** (mistake `verbatim-section-replacement…`): §A's preserved facts were copied from the live file read this session; §D step 1 mandates a fresh re-read before edit. No reconstruction-from-memory. PASS.
- **Section-order contract** (mistake `section-order-is-part-of-the-contract`): §A keeps the exact heading sequence (State persistence → Loop states → Verdict aggregation → Iteration rule → Mode-specific gates → Loop↔agent map); verification grep #1 checks ORDER by line position, not just presence. PASS.
- **Every in-boundary fact preserved:** §A fact-preservation ledger maps all 20 old facts to their new home; only out-of-boundary mode-gate detail removed (verified covered in §B). PASS.
- **D1 coverage verified with anchors:** §B cites chat-mode.md §3/§5/§9 + auto-mode.md §3/§5/§6 line ranges; one gap (GAP-1) flagged, not dropped. PASS.
- **Blast-radius complete:** §C lists every inbound ref for all seven anchors; confirms `#state-persistence` survives; identifies the 3 required repoints. PASS.
- **No placeholders / TODO / TBD:** none. PASS.
- **Scope:** plan + the one artifact only; no target-file edits made. C-EDIT-1/2/3 are flagged for user-accept of the 3-file blast radius (risk 2). PASS.
