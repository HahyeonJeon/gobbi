---
type: artifact
artifact_type: idea
loop: ideation
iter: 3
session: 422308da-f2c4-41a4-8ee3-adc89acde977
project: gobbi
feature: workflow
status: final
created_at: 2026-06-07
---

# Idea — Harden Auto-mode evaluation discipline in the orchestration docs

## Scope Contract

- **Project:** gobbi
- **Feature:** workflow (orchestration / Auto-mode discipline)
- **Task:** Docs-only change that removes three manager misbehaviors in Auto mode at their root, by hardening + restructuring evaluation discipline across three files.
- **In scope (only files the edit may touch):**
  - `.gobbi/projects/gobbi/skills/orchestration/auto-mode.md` (canonical; `.claude/...` is a mirror symlink)
  - `.gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md` (canonical; `.claude/...` is a mirror symlink)
  - `.claude/CLAUDE.md` (canonical — see § Canonical-home verification; it is a real file, not a symlink)
- **Out of scope (flag, never edit):** `chat-mode.md`, `discussion/SKILL.md`, `principles/SKILL.md`, `orchestration/SKILL.md` state machine, templates, settings files.
- **No behavior change** beyond the three fixes. Auto-mode runtime shape is unchanged (`auto-mode.md §1` structural invariant).
- **Pre-resolved (do not re-open):** the four user-locked resolutions (Problem 1/2/3 + both-harden-and-restructure); the iter2-locked placement decision (new auto-mode.md section is a trailing append; see D5); the iter3-locked routine-triage-vs-safety-gate classification for Auto interrupts (see D8).

---

## Framed Problem

### The three failures (manager misbehavior in Auto mode)

1. **Invents an evaluation-policy question.** The manager asks "evaluate dual-system / claude-only / skip?" before EVALUATION. Not in the spec.
2. **Self-evaluates.** The manager performs the evaluation itself instead of spawning the two evaluator subagents.
3. **Asks "defer or not" and idles.** After/instead of evaluation, the manager asks the user whether to defer findings, then halts.

### Why (root cause per failure — verified against file contents)

**Problem 1 — root cause: a silence the manager fills.**
- `auto-mode.md §4` (line 208) locks `evaluate.mode = "always"` for **all loops**: *"Evaluation runs every loop, no mode-driven skip."*
- The per-loop tables already say row 3 EVALUATION = *"Run per `workflow.ideation.evaluate.mode` (default `always`)"* (e.g. line 78).
- "claude-only" is a **post-failure degraded fallback only** — `workflow/evaluation.md § Degraded-mode policy` (lines 188-199): it is reached only **after** a system fails + the one retry fails, and is itself gated by a stop-the-line AskUserQuestion. It is never a pre-evaluation choice.
- **Root cause:** nowhere does `auto-mode.md` state *"the manager never asks whether or how to evaluate."* The lock exists as a setting value, but no imperative forbids the question. The manager treats "always" as a default it may override by asking, and invents the dual-system/claude-only/skip menu. The fix is a positive prohibition, not a new setting.

**Problem 2 — root cause: the prohibition lives in the wrong doc.**
- `workflow/evaluation.md` line 4 already says the manager's job is *"not to do the evaluation itself"* and line 42 says *"spawns exactly two evaluator agents in parallel — one per system."*
- `mistakes/manager-skipped-dual-system-eval.md` records this exact breach (manager substituted self-verification for dual-system eval — a producer/evaluator-separation violation).
- But `auto-mode.md` — the doc the Auto manager reads to run a session — has **no emphatic, scannable "manager MUST NOT evaluate"** guard. The contract is buried in evaluation.md prose and in a mistake file, neither of which is where the Auto manager looks while orchestrating.
- **Root cause:** the producer/evaluator-separation rule is not surfaced as a guard in the Auto-mode SOP. The fix is to restate it emphatically in `auto-mode.md` and sharpen it in `evaluation.md`.

**Problem 3 — root cause: mode-agnostic ROUTINE-TRIAGE escalations, present in FOUR places. CONFIRMED.**

Problem 3 is one root cause with multiple instances: `workflow/evaluation.md` and `.claude/CLAUDE.md` carry several **mode-agnostic routine-triage escalations** — instructions that tell the manager to stop and ask the user about ordinary findings (defer / triage / accept-as-is / stuck / regression). In Auto mode these all contradict the autonomy contract, and the manager — obeying whichever it reads — asks the user and then idles. The four instances:

- **3a — CLAUDE.md (primary).** `.claude/CLAUDE.md` core-principle block (worktree line 27 / rendered context line 30): *"After evaluation, discuss findings with the user before improving — the user decides what to address, defer, or disagree with. Never auto-apply evaluation findings."* Mode-agnostic.
- **3b — evaluation.md § Iteration Caps (lines 253-258).** At maxIterations exhaustion: **"escalate to the user"** with a 3-option AskUserQuestion (revise once more / accept as-is / abort + reframe). Mode-agnostic.
- **3c — evaluation.md § Stuck detection (lines 242-249).** When a finding is unchanged across two consecutive iters: **"Escalate to user BEFORE reaching the iteration cap"** via AskUserQuestion (revise differently / accept-with-deferral / abort / change scope). Mode-agnostic — found by Codex at iter2.
- **3d — evaluation.md § Regression marking (line 239).** When a REVISE introduces a new finding: *"A regression at any iter triggers user awareness via AskUserQuestion."* Mode-agnostic — same class.

All four are **routine-triage** escalations. They are distinct from the **safety-gate** interrupts that Auto SHOULD keep (see the carve-out below).

- `auto-mode.md §1` (lines 32-41): the manager interrupts ONLY for (1) Always-Ask category, (2) eval finding implying an unresolvable scope change, (3) a `BLOCKED` step the manager cannot resolve, (4) explicit user intervention. *"The manager does NOT pause for any other reason."*
- `auto-mode.md §6` (lines 251-262): the autonomy contract — *"the user reviews outcomes at session end (Wrap-up), not mid-step."*
- **Root cause CONFIRMED.** Routine-triage escalations are written mode-agnostically across CLAUDE.md + three evaluation.md sections. Each must be **mode-split**: Chat keeps the user escalation; Auto auto-iterates within budget, records the tag/finding, and surfaces it at Wrap-up — never interrupting mid-loop. These are the load-bearing edits; hardening §7 alone leaves the contradictions live in four places.

**The routine-triage vs safety-gate distinction (iter3 user decision — see D8).** Not every evaluation.md AskUserQuestion is routine triage. The genuine **dual-system safety/divergence gates** are legitimate Auto interrupts and MUST NOT be mode-split or silenced:

| Gate | evaluation.md location | Auto behavior | Class |
|---|---|---|---|
| Iteration Caps exhaustion | § Iteration Caps (~253-258) | auto-iterate within budget; record; surface at Wrap-up | **routine-triage → mode-split** |
| Stuck finding (2 consecutive open) | § Stuck detection (~242-249) | tag `stuck`; respect budget; surface at Wrap-up | **routine-triage → mode-split** |
| Regression introduced | § Regression marking (~239) | tag regression; surface at Wrap-up | **routine-triage → mode-split** |
| Minor divergence `PASS`↔`REVISE` | § Severity-gated divergence handling (~117) | auto-proceed with pessimistic union (already does) | keep — no interrupt |
| **Major divergence** `PASS`↔`FAIL` / `REVISE`↔`FAIL` | § Severity-gated divergence handling (~119) | **interrupt** (stop-the-line AskUserQuestion) | **safety-gate → KEEP** |
| Single-system / degraded-mode fallback | § Degraded-mode policy (~188-199) | **interrupt** (one fails → stop-the-line) | **safety-gate → KEEP** |
| Both systems fail | § Degraded-mode policy (~196) | **interrupt** (halt the loop, ask) | **safety-gate → KEEP** |

The safety gates fall under `auto-mode.md §1`'s "a step fails in a way the manager cannot resolve" / Always-Ask exceptions — they are the dual-system guarantee, not routine triage. The edit must NAME this carve-out so a reader does not over-apply the no-interrupt rule and silence a real divergence.

### Success criteria (measurable)

After the edit, an Auto-mode manager reading these three docs:
1. Never emits an evaluate-mode/skip/claude-only question before EVALUATION. (No such question can be derived from the docs; an explicit prohibition forbids it.)
2. Never self-evaluates; always spawns exactly 2 evaluator subagents. (An emphatic guard in `auto-mode.md` states this.)
3. On REVISE, auto-iterates without pausing to triage findings; on maxIterations exhaustion / a stuck finding / a regression does NOT escalate mid-session but records the tag/finding and surfaces it at Wrap-up; interrupts ONLY for Always-Ask findings and the named dual-system safety gates (major divergence, degraded-mode / single-system fallback, both-systems-fail); reviews the full finding set at Wrap-up. (All four routine-triage conflicts are reconciled; the safety gates are preserved.)

No other Auto-mode or Chat-mode behavior changes.

---

## Canonical-home verification (CLAUDE.md)

**`.claude/CLAUDE.md` IS canonical.** Verified in the worktree:
- `ls -la .claude/CLAUDE.md` → `-rw-rw-r--` regular file (NOT a symlink); `readlink` returns nothing.
- `find . -name CLAUDE.md` → only `./.claude/CLAUDE.md`. No copy exists under `.gobbi/projects/gobbi/`.
- Contrast: the two skill files ARE mirror symlinks — `.claude/skills/orchestration/auto-mode.md → ../../../.gobbi/projects/gobbi/skills/orchestration/auto-mode.md`; `.claude/skills/orchestration/workflow/evaluation.md → ../../../../.gobbi/.../workflow/evaluation.md`.

**Consequence for the edit (per `mistakes/skills-mirror-symlinks-not-copies.md` + `edit-tool-refuses-symlink-paths.md`):**
- Edit the two skill files at their **canonical `.gobbi/...` paths** — the `.claude/` symlinks reflect automatically; do NOT double-edit; the Edit tool will refuse the symlink path anyway.
- Edit `.claude/CLAUDE.md` **directly** — it is the canonical real file, no mirror, no symlink concern.

---

## Design — section-level CRUD plan per in-scope file

Notation: **C**reate / **U**pdate / **D**elete. All wording below is a proposed sketch for Planning/Execution to refine, not final copy. Rule text leads with the imperative (per `mistakes/principle-text-lead-with-imperative-not-agent-psychology.md`), not agent-psychology.

### File 1 — `auto-mode.md` (the load-bearing restructure + hardening)

The user locked **both**: (a) harden wording with explicit prohibitions + a scannable "manager never" guard block, AND (b) restructure the Auto-mode evaluation discipline into a dedicated home. Today `auto-mode.md` has **no dedicated evaluation section** — eval rules are scattered across the §2 per-loop tables (row 3) and the §4 defaults table (the `evaluate.mode` row). That scattering is itself the structural cause of Problems 1 and 2: there is no single place that states the Auto eval contract, so prohibitions have nowhere to live.

**C — Create a new section `## §7 — Evaluation discipline (Auto Mode)`.**

**Placement is LOCKED (iter2, user decision): trailing append.** The new section is appended as a **new trailing section, immediately after the current §6 (maxIterations exhaustion) and immediately before the `## Cross-references` block** — it becomes §7. No mid-document insert. No renumbering of existing sections (§1-§6 keep their numbers and all their internal §-anchors). This keeps the entire edit inside the three in-scope files: it does NOT touch the `orchestration/SKILL.md:247` pointer (which references "auto-mode.md §3 / §6" — both unchanged) and does NOT disturb any internal `(§3)` cross-reference in §2/§5/§6. Section-order-as-contract discipline (`mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`) is satisfied by naming the exact insertion point: after §6, before `## Cross-references`.

Proposed content of the new §7, four labeled guard sub-blocks:

> **§7.1 — Evaluation is mandatory and never a question.**
> In Auto Mode the manager runs dual-system EVALUATION on every loop. `evaluate.mode = "always"` is locked (§4 defaults). **The manager MUST NOT ask the user whether to evaluate, which systems to use, or whether to skip.** There is no "dual-system / claude-only / skip" choice in Auto Mode. "claude-only" is NOT a pre-evaluation option; it exists only as the documented post-failure degraded-mode fallback in [`workflow/evaluation.md § Degraded-mode policy`](workflow/evaluation.md#degraded-mode-policy-single-system-fallback), reached only after a system fails and its one retry fails, and only via that section's own stop-the-line AskUserQuestion. (fixes Problem 1)

> **§7.2 — The manager MUST NOT evaluate; it spawns exactly two evaluators.**
> The manager is the producer/orchestrator, never the evaluator — producer/evaluator separation per [`evaluation/SKILL.md`](../evaluation/SKILL.md) and the "Evaluation is a mandatory sub-phase" block in `.claude/CLAUDE.md`. For every EVALUATION phase the manager **spawns exactly two evaluator subagents — one per system (Claude + Codex)** — per [`workflow/evaluation.md`](workflow/evaluation.md). The manager **MUST NOT** write evaluation findings itself, stamp a verdict without two evaluator outputs, or substitute "manager-verification" for the evaluators. The manager aggregates the two systems' verdicts; it does not produce them. See `mistakes/manager-skipped-dual-system-eval.md`. (fixes Problem 2)

> **§7.3 — On REVISE, auto-iterate; do not run routine triage mid-loop; keep the safety gates.**
> When EVALUATION returns `REVISE`, the manager re-enters `DISCUSSION` with the findings appended and re-delegates the fix, up to `maxIterations` (default 5) — automatically, without pausing the user. **The manager MUST NOT run any routine-triage escalation mid-loop and MUST NOT idle after EVALUATION.** Routine-triage escalations are the mode-agnostic "ask the user" paths in `workflow/evaluation.md` — **maxIterations exhaustion (§ Iteration Caps), a stuck finding (§ Stuck detection), and a regression (§ Regression marking)**. In Auto mode the manager handles each by auto-iterating within budget, recording the tag/finding, and surfacing it in the Wrap-up finding set — never interrupting. The user reviews the **full finding set at Wrap-up**, not mid-loop.
>
> **Safety-gate carve-out (these still interrupt in Auto — do NOT silence them).** The manager DOES interrupt for the genuine dual-system safety gates, which are not routine triage: a **major dual-system divergence** (`PASS`↔`FAIL` / `REVISE`↔`FAIL`, `evaluation.md § Severity-gated divergence handling`), the **degraded-mode / single-system fallback** (`evaluation.md § Degraded-mode policy`), and **both systems failing**. These fall under §1's "a step fails in a way the manager cannot resolve." Always-Ask findings (Design / Scope / Destructive per §3) and findings implying an unresolvable scope change (§1 interrupt #2) also still interrupt. A minor divergence (`PASS`↔`REVISE`) auto-proceeds, as today.
>
> This is the Auto-mode counterpart to the Chat-scoped routine-triage escalations in `.claude/CLAUDE.md` ("discuss findings with the user") and `evaluation.md` (§ Iteration Caps / § Stuck detection / § Regression marking). (fixes Problem 3, all instances; preserves the safety gates)

> **§7.4 — "manager never" quick-guard (scannable).**
> A table the manager can scan at any EVALUATION boundary:
>
> | The manager NEVER… | Instead… |
> |---|---|
> | asks whether/how to evaluate, or offers skip/claude-only | runs dual-system EVALUATION every loop (`evaluate.mode: always`) |
> | performs the evaluation itself | spawns exactly 2 evaluator subagents (one per system) |
> | runs routine triage mid-loop — defer/accept, **Iteration Caps**, **Stuck detection**, **Regression marking** | auto-iterates within budget; records the tag/finding; surfaces it at Wrap-up |
> | idles after EVALUATION | proceeds: PASS → next step; REVISE → re-enter DISCUSSION |
> | **silences a dual-system safety gate** (major divergence, degraded-mode/single-system fallback, both-systems-fail) | **interrupts** — these are §1 "cannot resolve" gates, not routine triage |

**U — Update §2 per-loop tables.** No row content change, but add a one-line pointer under §2 (or in each table's preamble) to §7 so a reader scanning a step table reaches the discipline. Minimal: a single sentence "EVALUATION (row 3) in every step follows §7 — Evaluation discipline (Auto Mode)." Do NOT edit the row-3 cell text (avoids drift across six tables).

**U — Update the §4 defaults `evaluate.mode` row** to add a forward pointer to §7: append to the Notes cell "The manager never asks whether/how to evaluate — see §7." (keeps the lock value, adds the prohibition pointer).

**U — Update §6 (maxIterations exhaustion)** — add a one-line forward pointer to §7.3, since §7.3 cites §6 as the single source for "review at Wrap-up, not mid-step." Keep §6's existing text intact (it already states the autonomy contract); §7.3 cross-links to it rather than duplicating.

**U — Update the Cross-references block** to add rows pointing at the reconciled CLAUDE.md line and at `evaluation.md § Degraded-mode policy` (the claude-only fallback home + a named safety gate), `evaluation.md § Iteration Caps`, `evaluation.md § Stuck detection`, and `evaluation.md § Regression marking` (the reconciled Auto/Chat routine-triage splits).

**D — none.** No section is removed (per `mistakes/design-literal-retire-instruction-without-replacement.md`: nothing here is being retired; only added/sharpened).

### File 2 — `workflow/evaluation.md` (sharpen producer/evaluator separation + degraded-mode wording + mode-split the routine-triage escalations)

This doc already carries most of the correct contract; the edit **sharpens** it so the Auto manager cannot rationalize past it, **mode-splits its three routine-triage escalations** (§ Iteration Caps, § Stuck detection, § Regression marking) to be mode-aware, **preserves the dual-system safety gates** as legitimate Auto interrupts, and reads consistently with the new `auto-mode.md §7` guards.

**U — § header / line 4 (manager's job).** Sharpen the existing "not to do the evaluation itself" to an emphatic imperative: *"The manager MUST NOT evaluate. It spawns exactly two evaluator subagents (one per system), collects their outputs, reconciles, and emits a verdict. Writing findings or stamping a verdict without two evaluator outputs is a workflow breach (see `mistakes/manager-skipped-dual-system-eval.md`)."* (reinforces Problem 2 fix; consistent with `auto-mode.md §7.2`)

**U — Add a short routine-triage-vs-safety-gate framing sentence** at the head of the reconciliation/iteration area (e.g., near the top of § Cross-System Reconciliation or as a one-line note introducing the escalation sections). Proposed: *"Escalations in this document fall into two classes. **Routine-triage** escalations (Iteration Caps, Stuck detection, Regression marking) are mode-split: Chat escalates to the user; Auto auto-iterates within budget, records the tag/finding, and surfaces it at Wrap-up (per `auto-mode.md §6/§7.3`) — Auto never interrupts mid-loop for these. **Safety-gate** escalations (major dual-system divergence, degraded-mode / single-system fallback, both-systems-fail) interrupt in BOTH modes — they are the dual-system guarantee, not routine triage."* This makes the policy explicit and consistent so neither a reader nor the manager over-applies the no-interrupt rule. (mirrors auto-mode.md §7.3/§7.4)

**U — § Degraded-mode policy (lines 188-199) — SAFETY GATE, keep interrupting; add the claude-only clarifier only.** Add one clarifying sentence at the top of the section: *"Degraded mode (single-system / 'claude-only') is reachable ONLY here — after a system fails and its one retry fails. It is never a pre-evaluation choice and is never offered in Auto Mode as an evaluate-mode option. This section's AskUserQuestion gates are dual-system SAFETY gates — they interrupt in Auto mode too (not routine triage)."* Do NOT mode-split the stop-the-line gates here; they stay as legitimate Auto interrupts. (reinforces Problem 1 fix + names the safety-gate carve-out)

**U — § Severity-gated divergence handling (~117-122) — SAFETY GATE, no mode-split; one clarifying note.** The minor (`PASS`↔`REVISE`) row already auto-proceeds — keep it. The major (`PASS`↔`FAIL` / `REVISE`↔`FAIL`) stop-the-line row interrupts in BOTH modes. Add a half-line note: *"Major divergence is a dual-system safety gate; it interrupts in Auto mode too (not routine triage — contrast § Iteration Caps / § Stuck detection / § Regression marking)."* No behavior change here; this only labels it so Planning/Execution does not accidentally mode-split it.

**U — § Iteration Caps (lines 253-258) — ROUTINE TRIAGE, mode-split.** Today unconditional: *"When the cap is reached without `PASS`, the manager **escalates to the user** … three options: revise once more / accept as-is / abort + reframe."* Mode-split it (lead with the rule, name the split, preserve the §6 exception):
>
> *"When the cap is reached without `PASS`, the manager's response is mode-specific. **In Chat mode** the manager escalates to the user with a stop-the-line AskUserQuestion offering three options: revise one more time, accept the artifact as-is despite findings, or abort the loop and reframe. **In Auto mode** the manager does NOT interrupt the user mid-session: it records the abort, continues to the next step if continuing is safe, and surfaces the failure at Wrap-up — per [`auto-mode.md §6`](../auto-mode.md). The one exception is `auto-mode.md §6`'s 'unsound to proceed' case (e.g., Planning aborted with no deliverable plan), where the Auto manager MUST surface via AskUserQuestion before proceeding."*

**U — § Stuck detection (lines 242-249) — ROUTINE TRIAGE, mode-split.** Today: *"Escalate to user BEFORE reaching the iteration cap via AskUserQuestion: '… options: revise differently / accept-with-deferral / abort / change scope.'"* Mode-split it (mirror § Iteration Caps wording):
>
> *"When the same finding appears `open` in two consecutive iters, the manager tags both records `stuck`. The response is mode-specific. **In Chat mode** the manager escalates to the user BEFORE reaching the iteration cap via AskUserQuestion (revise differently / accept-with-deferral / abort / change scope). **In Auto mode** the manager does NOT interrupt mid-loop: it keeps the `stuck` tag, continues to iterate within the `maxIterations` budget (and aborts at the cap per § Iteration Caps), and surfaces the stuck finding in the Wrap-up finding set — per [`auto-mode.md §6/§7.3`](../auto-mode.md)."*

**U — § Regression marking (line 239) — ROUTINE TRIAGE, mode-split.** Today: *"A regression at any iter triggers user awareness via AskUserQuestion."* Mode-split it:
>
> *"When iter n introduces a finding absent in iter (n-1), the manager tags it `domain: regression`. The response is mode-specific. **In Chat mode** this triggers user awareness via AskUserQuestion ('iter n REVISE introduced regressions; the previous fix may have been wrong'). **In Auto mode** the manager does NOT interrupt: it keeps the regression tag and surfaces it in the Wrap-up finding set — per [`auto-mode.md §6/§7.3`](../auto-mode.md)."*

**U — Cross-references block** — add a row pointing to `auto-mode.md §7 — Evaluation discipline` so the two docs are mutually linked.

**C / D — none.** No new section, no removal — the structure here is already correct; only wording is sharpened and the three routine-triage sections are mode-split (the safety gates kept intact).

### File 3 — `.claude/CLAUDE.md` (reconcile the conflicting sentence — load-bearing fix, primary instance of Problem 3)

**U — the core-principle Evaluation block (worktree line 27).** Today: *"After evaluation, discuss findings with the user before improving — the user decides what to address, defer, or disagree with. Never auto-apply evaluation findings."* This is mode-agnostic and is the primary cause of Problem 3.

Reconcile it so the user-triage instruction is **scoped to Chat mode** and Auto's auto-iterate behavior is stated, WITHOUT editing chat-mode.md / auto-mode.md from CLAUDE.md's side (those are pointed to, not edited). Proposed replacement (sketch — Principle 7 plain/brief; leads with the rule, names the mode split):

> *"After evaluation, the manager reconciles the two systems' verdicts and never auto-applies a finding the user must decide on (Always-Ask categories: Design / Scope / Destructive). **In Chat mode** the manager discusses findings with the user before improving — the user decides what to address, defer, or disagree with. **In Auto mode** the manager auto-iterates on REVISE up to maxIterations and the user reviews the full finding set at Wrap-up; only Always-Ask findings and dual-system safety gates (major divergence / single-system fallback) interrupt mid-loop. See `orchestration/auto-mode.md` and `orchestration/chat-mode.md`."*

Key properties of this wording:
- Preserves the original intent ("never auto-apply" the decisions that are the user's) — it does NOT delete the safeguard, so the change is not a "retire without replacement" (`mistakes/design-literal-retire-instruction-without-replacement.md`). It narrows the *mechanism* (mid-loop user triage) to the mode where it is correct (Chat) and states the Auto path explicitly.
- Removes the contradiction: Auto no longer reads a mode-agnostic "discuss with the user before improving" that fights `auto-mode.md §1/§6`.
- Names the safety-gate exception so the Auto branch does not read as "never interrupt for anything."
- Stays minimal: one paragraph edited in place; no new CLAUDE.md section.

**C / D — none.** No new CLAUDE.md section; nothing deleted.

---

## Restructured Auto-mode evaluation section — organization summary

The new `auto-mode.md §7` is appended after §6 and before `## Cross-references`. It is organized as four labeled guard sub-blocks in fix-order, each tied to one root cause, ending with a scannable table:

1. **§7.1 Mandatory, never a question** → Problem 1
2. **§7.2 Manager never evaluates; spawns 2** → Problem 2
3. **§7.3 Auto-iterate on REVISE; no routine triage mid-loop (Iteration Caps + Stuck detection + Regression marking); keep the safety gates; review at Wrap-up** → Problem 3 (all instances + safety-gate carve-out)
4. **§7.4 "manager never" quick-guard table** → scannable reinforcement of all three, including the silence-no-safety-gate row

This gives evaluation discipline a single dedicated home in the doc the Auto manager actually reads while orchestrating, replacing today's scattering across the §2 tables and §4 defaults row.

---

## Cross-file consistency risks (FLAG for Planning — do NOT edit these files)

1. **`chat-mode.md` parallel.** CLAUDE.md's reconciled sentence and evaluation.md's three mode-split sections now say Chat = user-triage / user-escalation of findings. `chat-mode.md §5` already encodes "after EVALUATION → discuss findings and remediation" as a Chat gate (line ~297) and §4 narrowed MEMORIZATION; `chat-mode.md` Step tables already say "Budget exhausted → escalate to user via AskUserQuestion." The CLAUDE.md and evaluation.md edits must be phrased to **match** chat-mode.md's existing behavior, not invent a new Chat rule. **Risk:** if Planning re-words to imply a Chat behavior not in chat-mode.md, the two drift. **Mitigation:** quote chat-mode.md's existing "discuss findings" / "escalate to user" language; do not add new Chat semantics. (consistency-only; chat-mode.md stays unedited)

2. **`discussion/SKILL.md` Always-Ask matrix.** §7.1/§7.3 say "only Always-Ask findings and named safety gates interrupt." The authoritative Always-Ask categories (Design / Scope / Destructive) live in `discussion/SKILL.md § Decision Classification` (lines 140-150) and are restated in `auto-mode.md §3`. **Risk:** the new section must reference §3 / discussion's matrix, not redefine the categories. **Mitigation:** §7.3 cites §3; no new category invented. The safety gates are framed as §1 "cannot resolve" cases, not a new Always-Ask category.

3. **`orchestration/SKILL.md` state machine + Mode-specific gates (line 247) — NO LONGER AT RISK.** SKILL.md line 247 points at "auto-mode.md §3 — Always-Ask codification" and "§6 — maxIterations exhaustion." Because placement is locked to **trailing append as §7 with no renumbering**, §3 and §6 keep their numbers and this pointer stays valid. **No out-of-scope edit to `orchestration/SKILL.md` is required.** (Was the iter1 high-risk item; the locked placement eliminates it.)

4. **`principles/SKILL.md` phrasing.** The CLAUDE.md core-principle block summarizes principles; the Evaluation block being edited is NOT one of the 10 numbered principles (it is the "Evaluation is a mandatory sub-phase" blockquote). **Risk:** confusing the Evaluation blockquote with a principle row. **Mitigation:** the edit touches only the Evaluation blockquote prose, not the principle table; principles/SKILL.md needs no change. Confirmed: no numbered principle restates the conflicting line, and producer/evaluator separation is NOT a numbered principle (Principle 3 is "Design With the User, Based on References" — verified against `principles/SKILL.md:47`).

5. **Internal §-anchor self-consistency within auto-mode.md — satisfied by design.** Trailing-append as §7 with no renumbering means every internal "§3"/"§4"/"§6" reference inside auto-mode.md (e.g., §2.x "Always-Ask categories still fire (§3)", §5 banner "Always-Ask matrix (§3)", §6 references) stays correct unchanged. The only new internal anchors are §7's own forward/back pointers (§7 cites §3, §4, §6; §2/§4/§6 gain pointers to §7). **Mitigation:** Planning verifies the new §7 anchors resolve; no existing anchor moves.

6. **Stale authority citations — swept.** `mistakes/manager-skipped-dual-system-eval.md` cites a 14-principle-era "Principle 11" and the iter1 §X.2 sketch wrongly cited "Principle 3, producer≠evaluator." Producer/evaluator separation is NOT a numbered principle in the current 10-principle list. **Corrected in this draft:** §7.2 now cites `evaluation/SKILL.md` (producer/evaluator separation) + CLAUDE.md's "Evaluation is a mandatory sub-phase" block, with NO principle number attached. **Do not edit the mistake file** (out of scope); just cite correctly in the in-scope docs. Whole-draft sweep: the only remaining principle-number citations are Principle 7 (plain/brief — File 3 wording note) and the Principle references in the mistakes-applied notes — both verified correct against `principles/SKILL.md` (P7 = "Say/Write Plainly, Briefly, and Literally"). No bare/placeholder "§X" tokens remain — all are now explicit "§7.x" guards or labeled retrospective references to the iter1 sketch.

7. **evaluation.md routine-triage vs safety-gate boundary (NEW iter3 — internal-consistency).** The edit mode-splits three sections (Iteration Caps / Stuck detection / Regression marking) but deliberately KEEPS three others interrupting (major divergence / degraded-mode / both-fail). **Risk:** Planning/Execution over-applies the mode-split and silences a safety gate, or under-applies and leaves a routine-triage path mode-agnostic. **Mitigation:** the framing sentence (File-2 edit #2) + the §7.3 carve-out + the §7.4 "silences a safety gate" NEVER-row make the boundary explicit in both docs; the Problem-3 classification table above is the single reference for which section is which class. This is an in-scope, in-evaluation.md concern — no out-of-scope file involved.

---

## Scenarios (golden / edge / failure / adversarial)

- **Golden:** Auto-mode Execution loop, EVALUATION returns REVISE. Manager re-enters DISCUSSION, re-delegates the fix, no user pause. PASS on iter2 → next task. (validates §7.3)
- **Golden:** Auto-mode Ideation EVALUATION. Manager spawns 2 evaluators, never asks "which systems / skip." (validates §7.1 + §7.2)
- **Edge:** Codex evaluator fails + retry fails. Manager hits `evaluation.md § Degraded-mode policy` stop-the-line AskUserQuestion (the ONE legitimate place "claude-only" surfaces; a SAFETY gate — interrupts in Auto too). This must still work — the new prohibition forbids the *pre-evaluation* question, not this post-failure fallback. (validates the §7.1 / degraded-mode boundary + safety-gate carve-out)
- **Edge:** A REVISE finding is a Scope change (Always-Ask). Manager interrupts via AskUserQuestion per §3 — correct, NOT forbidden by §7.3. (validates the §7.3 Always-Ask carve-out)
- **Failure:** maxIterations exhausted without PASS in Auto mode. Manager does NOT escalate mid-session (reconciled § Iteration Caps + §6); abort surfaces at Wrap-up. (validates routine-triage 3b)
- **Failure (unsound-to-proceed exception):** Planning aborts in Auto mode with no deliverable plan. Manager surfaces via AskUserQuestion before proceeding — the §6 exception, preserved in the reconciled § Iteration Caps. (validates the exception is not lost)
- **Failure (stuck finding):** A finding stays `open` across two consecutive Auto iters. Manager tags it `stuck`, keeps iterating within budget, does NOT interrupt mid-loop, surfaces the stuck finding at Wrap-up. (validates routine-triage 3c — reconciled § Stuck detection)
- **Failure (regression):** An Auto iter introduces a finding absent the prior iter. Manager tags it regression, does NOT interrupt, surfaces it at Wrap-up. (validates routine-triage 3d — reconciled § Regression marking)
- **Safety-gate (must still interrupt):** Auto-mode EVALUATION yields a MAJOR divergence (`PASS`↔`FAIL`). Manager STOPS-the-line via AskUserQuestion before any further loop progress — preserved, NOT mode-split. (validates the safety-gate carve-out; guards against over-applying the no-interrupt rule)
- **Adversarial:** Manager reads the banner "bias toward working without stopping" and the old CLAUDE.md "discuss findings with the user" together. After the edit, CLAUDE.md no longer issues a mode-agnostic "discuss findings," so the contradiction that caused idling is gone. (validates Problem 3a root fix)
- **Adversarial (over-silencing check):** An Auto manager, having internalized "no mid-loop triage," meets a major divergence and is tempted to auto-proceed. §7.3 carve-out + §7.4 "silences a safety gate" NEVER-row + the evaluation.md framing sentence stop it — it interrupts. (validates the boundary is robust both ways)
- **Adversarial (Chat regression check):** A Chat-mode session must still pause to discuss findings after EVALUATION, escalate at cap exhaustion, escalate on stuck, and raise regression awareness. The reconciled CLAUDE.md sentence and the Chat branch of all three mode-split sections preserve every Chat path. (validates no Chat regression)

---

## Implementation checklist (for Planning to decompose; not for the leader to execute)

1. Append the new evaluation-discipline section to `auto-mode.md` as a **trailing §7, after §6 and before `## Cross-references`** (placement locked — no decision needed). No renumbering of §1-§6.
2. Author §7.1-§7.4 content (mandatory-never-a-question / manager-never-evaluates-spawns-2 / auto-iterate-no-routine-triage-keep-safety-gates / "manager never" table incl. the silence-no-safety-gate row).
3. Add minimal forward pointers from the §2 preamble, the §4 `evaluate.mode` defaults row, and §6 to §7; expand the Cross-references block to the four reconciled evaluation.md sections.
4. In `workflow/evaluation.md`: sharpen line-4 manager's-job wording (MUST NOT evaluate); add Degraded-mode policy clarifier; add the routine-triage-vs-safety-gate framing sentence; **mode-split § Iteration Caps, § Stuck detection, § Regression marking**; add the half-line safety-gate label to § Severity-gated divergence handling; KEEP § Degraded-mode + § Severity-gated-major + both-fail interrupting.
5. Reconcile the `.claude/CLAUDE.md` Evaluation blockquote (mode-split wording + named safety-gate exception).
6. Verify all internal §-anchors in auto-mode.md remain consistent (trivially true under trailing-append) and the new §7 anchors resolve.
7. Verify no edit touches an out-of-scope file. (Under locked trailing-append, `orchestration/SKILL.md:247` is NOT touched — its §3/§6 references remain valid.)
8. Edit canonical paths only; do not double-edit mirror symlinks; CLAUDE.md edited directly.

---

## Decisions Log

- **D1:** `.claude/CLAUDE.md` is canonical (regular file, no `.gobbi` copy, not a symlink). Edit it directly. (verified)
- **D2:** The two skill files are mirror symlinks → edit canonical `.gobbi/...` paths only; Edit tool refuses symlink paths. (verified)
- **D3:** Problem-3 root cause CONFIRMED — it is ONE root cause (mode-agnostic routine-triage escalation) with FOUR in-scope instances: CLAUDE.md "discuss findings" (3a) + evaluation.md § Iteration Caps (3b) + § Stuck detection (3c, Codex iter2) + § Regression marking (3d). All four must be mode-split.
- **D4:** Reconcile (mode-split) the conflicting routine-triage sentences rather than delete them — preserves the "never auto-apply user-decision findings" safeguard and every Chat-mode escalation behavior (avoids retire-without-replacement).
- **D5 (LOCKED iter2 — user decision):** The new auto-mode.md section is appended as a **trailing §7** (after §6, before `## Cross-references`), with NO renumbering of §1-§6. This keeps the entire edit inside the three in-scope files and leaves `orchestration/SKILL.md:247` untouched. The iter1 mid-document §4-insert option is rejected and removed.
- **D6:** All new rule text leads with the imperative, not agent-psychology; adds no unrequested cross-refs/carve-outs (per `mistakes/principle-text-lead-with-imperative-not-agent-psychology.md`).
- **D7:** Producer/evaluator separation is NOT a numbered principle. §7.2 cites `evaluation/SKILL.md` + CLAUDE.md's "Evaluation is a mandatory sub-phase" block, with no principle number. Principle 3 (verified) = "Design With the User, Based on References." All draft principle-number citations swept and verified against the current 10-principle list; no bare "§X" placeholder tokens remain.
- **D8 (LOCKED iter3 — user decision, Always-Ask Design):** Auto-mode evaluation escalations are split into two classes. **Routine-triage** (Iteration Caps, Stuck detection, Regression marking) is mode-split: Chat escalates to the user; Auto auto-iterates within budget, records the tag/finding, and surfaces it at Wrap-up — never interrupting mid-loop. **Safety-gate** (major dual-system divergence, degraded-mode / single-system fallback, both-systems-fail) is PRESERVED as a legitimate Auto interrupt — these are the dual-system guarantee under §1's "cannot resolve," not routine triage. The minor divergence (`PASS`↔`REVISE`) keeps auto-proceeding. The policy is stated explicitly in evaluation.md (framing sentence) and auto-mode.md (§7.3 carve-out + §7.4 NEVER-row) so it cannot be over- or under-applied.

---

## Evaluation summary

### 3-iter cross-system reconciliation (verified against on-disk eval files)

**iter1 — reconciled verdict: REVISE (both systems REVISE)**

Claude (iter1/claude/overall.md): REVISE. Three findings — two High (F1: placement committed to rejected §4-insert; F6: locked decision handed to Planner as open), one High from Consistency (F9: internal contradiction across 5 locations), plus medium/low findings. Primary root defect: the Idea's body committed to the rejected mid-document §4-insert placement instead of the user-locked trailing-append.

Codex (iter1/codex/overall.md): REVISE. Three findings — COD-OVERALL-001 (High, conf 100): design does not honor the locked trailing-append placement (the primary shared High finding); COD-OVERALL-002 (High, conf 75): cap-exhaustion conflict still live in evaluation.md — this is a **2nd Problem-3 instance** (§ Iteration Caps) that Claude's iter1 did not call out as a separate problem; COD-OVERALL-003 (Medium, conf 100): stale "Principle 3 = producer≠evaluator" citation.

Cross-system divergence at iter1: both REVISE — reconciled REVISE. The primary High finding (wrong placement) is shared. Codex additionally caught COD-OVERALL-002 (the § Iteration Caps cap-exhaustion escalation as a 2nd Problem-3 instance) and COD-OVERALL-003 (the stale Principle 3 citation) — both absent from Claude's iter1 per-perspective breakdown as discrete callouts.

**iter2 — reconciled verdict: REVISE (Claude PASS, Codex REVISE — minor divergence, pessimistic union)**

Claude (iter2/claude/overall.md): PASS. All three briefed iter1 findings addressed (placement locked trailing-append; § Iteration Caps mode-split added; stale principle citation corrected). No High or Critical finding surviving. Residual Low: §X retrospective tokens (cosmetic).

Codex (iter2/codex/overall.md): REVISE. All three iter1 findings confirmed addressed (COD-OVERALL-001/002/003 all disposition: addressed). New cross-cutting finding: COD-OVERALL-001 (new, High, conf 75) — § Stuck detection remains a mode-agnostic mid-loop user-triage path. This is a **3rd Problem-3 instance** (evaluation.md § Stuck detection, lines 241-247) that Claude's PASS verdict missed — the anti-groupthink signal. One High ≥ conf 50 → REVISE.

Cross-system divergence at iter2: Claude PASS vs Codex REVISE — minor divergence. Reconciled REVISE (pessimistic union per evaluation rules). Codex caught the 3rd Problem-3 instance (§ Stuck detection) that Claude missed. This is the canonical cross-system anti-groupthink signal: Codex surfaced a finding that would have been silently dropped under Claude-only evaluation.

**iter3 — reconciled verdict: PASS (both systems PASS)**

Claude (iter3/claude/overall.md): PASS. iter2 open finding (§ Stuck detection) confirmed addressed across six placements in the draft. All iter1 findings still addressed. Broadening (§ Stuck detection + § Regression marking mode-split + safety-gate carve-out + classification table) verified additive, no regression. One residual Low (C1): consistency-risk note #1 cites "chat-mode.md's existing language" as the Chat anchor for all three mode-splits, but chat-mode.md is silent on Stuck/Regression — the splits are correct, but the cited anchor doc is imprecise for two of three. Cosmetic; does not gate.

Codex (iter3/codex/overall.md): PASS. iter2 Codex open finding (COD-ITER2-001, § Stuck detection) confirmed addressed at draft lines 58/72/169-171/126/238. All iter1 findings re-confirmed addressed (COD-ITER1-001/002/003). Required iter3 checks all passed: Regression marking mode-split present; major divergence preserved; degraded/both-fail preserved; minor PASS/REVISE auto-proceeds; routine-triage vs safety-gate policy explicit in three locations (§7.3 carve-out + §7.4 NEVER-row + File-2 framing sentence). No new open findings.

Cross-system divergence at iter3: both PASS — reconciled PASS. No divergence.

**Residual open finding carried to Planning (non-gating)**

C1 (Low, consistency, Claude iter3): The consistency-risk note #1 in § Cross-file consistency risks says to quote "chat-mode.md's existing language" as the Chat anchor for the Stuck/Regression mode-splits, but chat-mode.md is silent on those two cases — those splits preserve evaluation.md's current behavior (no chat-mode.md anchor needed). The splits themselves are correct; only the Planning note's cited anchor is imprecise. This is a FLAG-for-Planning precision improvement: the note should say "Chat branch preserves evaluation.md's existing behavior" for Stuck/Regression, and only cite chat-mode.md for the § Iteration Caps split (where chat-mode.md does say "Budget exhausted → escalate to user via AskUserQuestion"). Non-gating; addressed in Planning.
