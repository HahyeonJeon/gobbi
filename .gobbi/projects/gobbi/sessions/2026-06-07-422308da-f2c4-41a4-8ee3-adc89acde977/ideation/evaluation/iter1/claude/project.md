# Project — Ideation Idea: Harden Auto-mode evaluation discipline

## Artifact Summary + Memory reads

**What.** A docs-only Idea that hardens + restructures Auto-mode evaluation discipline across three files (`auto-mode.md`, `workflow/evaluation.md`, `.claude/CLAUDE.md`) to remove three manager misbehaviors: (1) inventing an evaluate-mode question, (2) self-evaluating, (3) idling after asking "defer or not."

**Why.** Three reported Auto-mode manager failures, each traced to a root cause: a silence the manager fills (no prohibition), a prohibition in the wrong doc, and a direct CLAUDE.md ↔ auto-mode.md conflict.

**How.** Positive prohibitions + a scannable "manager never" guard table in a new auto-mode.md evaluation section; sharpened wording in evaluation.md; a mode-split reconcile of the CLAUDE.md Evaluation blockquote.

**Scope Contract source.** Self-declared in the Idea (lines 15-26) + the user-locked resolutions in the delegation brief.

**Memory reads.**
- `.claude/skills/evaluation/SKILL.md` (finding schema, perspectives, thresholds)
- `.claude/skills/principles/SKILL.md` (P5 scope, P9 CRUD-5W1H, P10 finish-in-scope)
- `.claude/skills/ideation/evaluation.md` (phase child doc — seed scenarios)
- target files: `auto-mode.md`, `workflow/evaluation.md`, both `.claude/CLAUDE.md` + worktree CLAUDE.md
- consistency refs: `chat-mode.md`, `orchestration/SKILL.md`, `discussion/SKILL.md`
- mistakes: manager-skipped-dual-system-eval, design-literal-retire-instruction-without-replacement, section-order-is-part-of-the-contract, skills-mirror-symlinks-not-copies, principle-text-lead-with-imperative
- rules: `rules/stub-redirect-format.md`

**W/W/H verdict.** What/Why/How all present and clear. No Stage-0 gate finding.

## Locked Frame (Stage 1)

**S1 — The root cause the Idea claims is the actual root cause, not a symptom**
- [ ] Each of the 3 "Why" answers terminates at a cause that, if absent, obviates the work
- [ ] Root-cause claims are verified against file contents, not asserted
- [ ] No scope drift between framed problem and design

**S2 — The Idea stays inside the locked 3-file scope contract**
- [ ] Design edits only `auto-mode.md`, `workflow/evaluation.md`, `.claude/CLAUDE.md`
- [ ] No design step forces editing an out-of-scope file (esp. `orchestration/SKILL.md`)
- [ ] Out-of-scope files are flagged, not edited

**S3 — The Idea honors the four user-locked resolutions (P1/P2/P3 + both-harden-and-restructure)**
- [ ] P1: Auto eval mandatory dual-system; manager never asks whether/how
- [ ] P2: emphatic "manager MUST NOT evaluate; spawns exactly 2"
- [ ] P3: Auto auto-iterates on REVISE; CLAUDE.md conflict reconciled
- [ ] Approach: BOTH harden wording AND restructure section

**S4 (adversarial) — The Idea's primary design decision violates the LOCKED section-placement decision**
- [ ] The Idea's chosen placement matches the user's lock (trailing-append), not the rejected option
- [ ] No "Always-Ask" decision is re-opened that the user already closed

**S5 (adversarial) — An adjacent locked decision is silently re-litigated**
- [ ] The Idea does not re-surface a user-closed question as an open choice

## Per-scenario per-check results

**S1** — PASS. The three root-cause analyses are sound and I independently confirmed each against file contents:
- Problem 1: `auto-mode.md:208` locks `evaluate.mode = "always"` ("Evaluation runs every loop, no mode-driven skip"); confirmed there is NO imperative forbidding the question. Root cause "a silence the manager fills" is correct. (verified)
- Problem 2: `workflow/evaluation.md:4` says manager's job is "not to do the evaluation itself"; line 42 "spawns exactly two evaluator agents." Confirmed `auto-mode.md` has no emphatic "manager MUST NOT evaluate" guard. Root cause correct. (verified)
- Problem 3: CLAUDE.md Evaluation blockquote (worktree CLAUDE.md line ~30, repo-root `.claude/CLAUDE.md` line ~30) says "After evaluation, discuss findings with the user before improving — the user decides what to address, defer, or disagree with. Never auto-apply." This IS mode-agnostic and DOES conflict with `auto-mode.md §1` (interrupt only for 4 reasons) + `§6` (review at Wrap-up). Conflict CONFIRMED. (verified)

**S2** — REVISE (see F1). The Idea's PRIMARY placement decision (line 92: insert as new §4, renumber §4→§5/§5→§6/§6→§7) forces an out-of-scope edit to `orchestration/SKILL.md` (the Idea itself admits this at line 173 and 197). The Idea does correctly flag this and recommend trailing-append in D5, but the primary design body still specifies the scope-breaching option.

**S3** — PASS on P1/P2/P3/approach content. The §X.1-§X.4 sketches and the CLAUDE.md mode-split do achieve all four locked resolutions as written. (verified against §X sketch text lines 96-113, 143)

**S4** — FAIL (see F1). The user LOCKED trailing-append. The Idea's design body (line 92) chooses the OPPOSITE — insert-as-§4 with renumber — as its stated "Placement decision," demoting trailing-append to "Alternative considered ... rejected." This directly contradicts the locked decision the brief says was already resolved.

**S5** — PASS. No other locked decision is re-opened.

## Typed findings

### F1 — Primary placement decision contradicts the user-locked trailing-append decision
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** Idea line 92: "Placement decision ... insert as a **new §4, shifting current §4/§5/§6 down to §5/§6/§7.** Rationale: ... (Alternative considered: append as a trailing §7 before Cross-references — **rejected** ...)." The brief states placement is "LOCKED to trailing-append (new trailing section), NOT mid-document insert." The Idea's design body specifies the locked-OUT option as its primary decision. Trailing-append survives only as D5 "RECOMMENDATION, user to confirm" (line 214) and checklist item 1 (line 197), both framed as still-open.
- **Why it matters:** The producer was told the placement was already resolved (trailing-append). Carrying the rejected insert-as-§4 as the primary design, and re-framing the locked decision as an open "[Always-Ask: Design/structure decision]" (line 197), means Planning could read the §4-insert as the design of record and execute the renumber — which the Idea itself shows (line 173) forces an out-of-scope `orchestration/SKILL.md` edit. The artifact does not reflect the lock it was built under; it re-opens a closed contract decision (Principle 5 surface, and the `section-order-is-part-of-the-contract` mistake's spirit: the order/placement is contract, not menu).
- **Suggested direction:** Planning/user input — make trailing-append the single stated placement in the design body; demote or delete the §4-insert analysis; remove the "[Always-Ask]" framing on checklist item 1.

### F2 — Renumber-insert path's scope breach is acknowledged but left live in the design body
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Medium
- **Evidence:** Idea line 173 ("Risk: HIGH ... the renumber-insert option forces an out-of-scope edit to `orchestration/SKILL.md:247`") and line 203 (checklist item 7: "if SKILL.md:247 would need updating, STOP and surface"). The design keeps a path whose own consistency analysis says it breaches the 3-file scope. Per the brief: "Any design that forces editing another file is a scope-breach finding."
- **Why it matters:** A Planner executing the primary (§4-insert) decision walks straight into the scope breach. The breach is documented as a "flag for Planning" rather than removed from the design, leaving the contract-violating option selectable.
- **Suggested direction:** Remove the renumber-insert as an executable option, not just annotate it.

## Low-confidence appendix
(none)

## Verdict: REVISE
