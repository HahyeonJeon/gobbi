# Consistency — Ideation Idea: Harden Auto-mode evaluation discipline

## Artifact Summary + Memory reads
(See project.md for Stage-0 summary + memory reads.)

## Locked Frame (Stage 1)

**S1 — The reconciled CLAUDE.md wording matches chat-mode.md's existing Chat behavior (no Chat regression)**
- [ ] CLAUDE.md "In Chat mode the manager discusses findings" matches chat-mode.md's existing post-EVAL gate
- [ ] No new Chat semantics invented that chat-mode.md does not already encode

**S2 — The CLAUDE.md edit removes the Auto contradiction without breaking the preserved safeguard**
- [ ] "Never auto-apply" safeguard preserved (not retire-without-replacement)
- [ ] Auto path stated matches auto-mode.md §1/§6

**S3 — Two CLAUDE.md files exist; the design names the right canonical one**
- [ ] The design edits the correct CLAUDE.md (no stale second copy left)

**S4 — Internal consistency of the Idea: design body ↔ decisions log ↔ checklist agree**
- [ ] The placement decision is stated consistently across §design, restructure-summary, consistency-risks, checklist, decisions-log

**S5 (adversarial) — A cited line/anchor in the Idea does not resolve**
- [ ] Every cited file:line in the root-cause + consistency sections actually resolves

## Per-scenario per-check results

**S1** — PASS with note (see F7 Low). I verified chat-mode.md's existing Chat post-EVALUATION behavior: §5 line 296 — "after EVALUATION → discuss findings and remediation" is a binding Chat mode-specific gate. The Idea's proposed CLAUDE.md Chat clause — "In Chat mode the manager discusses findings with the user before improving — the user decides what to address, defer, or disagree with" (line 143) — is consistent with that gate; it does not invent new Chat semantics. The Idea's consistency-risk #1 (line 169) correctly flags that the wording must match chat-mode.md and not add new Chat rules. No Chat regression. (verified against chat-mode.md:296)

**S2** — PASS. The mode-split (line 143) preserves "never auto-applies a finding the user must decide on (Always-Ask ...)" — the safeguard is retained, narrowed to the correct mode, not deleted. This avoids `design-literal-retire-instruction-without-replacement`. The Auto clause ("auto-iterates on REVISE up to maxIterations; user reviews full finding set at Wrap-up; only Always-Ask findings interrupt") matches `auto-mode.md §1` (4 interrupt reasons) + `§6` (Wrap-up review). (verified)

**S3** — REVISE (see F8). The design names "`.claude/CLAUDE.md`" as canonical and verifies it is a real file. I confirmed `find` returns only `./.claude/CLAUDE.md`. HOWEVER, in the worktree there are TWO CLAUDE.md contents rendered (the worktree-local `.claude/CLAUDE.md` and the repo-root `.claude/CLAUDE.md`) — both carry the identical Evaluation blockquote. The Idea's Canonical-home verification (line 73) claims "find . -name CLAUDE.md → only ./.claude/CLAUDE.md. No copy exists." From the worktree cwd that is true (the worktree's own .claude/CLAUDE.md). The repo-root copy is a separate working tree, not a second file in this worktree — so the design's single-edit target is correct for the worktree. This is consistent, but the Idea should note the edit only lands in the worktree branch and the repo-root develop copy syncs at merge. Low-severity nuance, not a breakage.

**S4** — REVISE (see F9). The placement decision is stated INCONSISTENTLY across the Idea:
- §Design line 92: primary = insert-as-§4 (renumber).
- Restructure-summary lines 156-161: uses "§X" placeholder.
- Consistency-risk #3 line 173: "Recommend trailing-append (new §7)."
- Checklist item 1 line 197: open choice, "[Always-Ask]".
- Decisions-log D5 line 214: "RECOMMENDATION, user to confirm."
The design body chooses §4-insert; everything downstream leans trailing-append or leaves it open. The doc contradicts itself on its single most load-bearing structural decision.

**S5** — REVISE (see F4 in structure.md — same evidence). The Idea cites `orchestration/SKILL.md:247` as the pointer that would break; the actual pointer is at line 266. The cited anchor does not resolve to what the Idea claims. (verified by grep)

## Typed findings

### F8 — CLAUDE.md edit-target nuance: worktree vs repo-root copy not noted
- **Type:** assumption_risk
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 50
- **Severity:** Low
- **Evidence:** Idea line 73: "find . -name CLAUDE.md → only ./.claude/CLAUDE.md. No copy exists under .gobbi/projects/gobbi/." True from the worktree cwd. The session also rendered a repo-root `.claude/CLAUDE.md` with the identical blockquote; both are real files in their respective trees.
- **Why it matters:** Low. The worktree edit is correct and will sync to the develop copy at merge. Worth a one-line note that CLAUDE.md is edited directly (no symlink) and lands on the worktree branch, to avoid a future reader thinking a second physical copy needs a parallel edit (the inverse of the symlink mistake).
- **Suggested direction:** Add a one-line note; no design change.

### F9 — The Idea contradicts itself on the placement decision across five locations
- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** Five locations disagree (see S4 above): design body (line 92, §4-insert) vs consistency-risk (line 173, trailing-§7) vs checklist (line 197, open) vs D5 (line 214, recommendation) vs restructure-summary (§X placeholder). Internal contradiction on the load-bearing decision.
- **Why it matters:** Per the Consistency anti-pattern "internal contradictions are not resolved by good readers." A Planner reading the design body executes §4-insert; a Planner reading D5 executes trailing-append. Two readers produce two incompatible plans, one of which breaches scope. This is the same locked-decision problem as F1/F6, manifesting here as cross-section internal inconsistency with its own evidence chain.
- **Suggested direction:** Make all five locations state trailing-append as the resolved placement.

## Low-confidence appendix

### F7 (Low conf) — chat-mode.md Ideation loop table has no post-EVAL gate row; only §5 carries it
- **Type:** general / Domain: docs-sync / Confidence: 25 / Severity: Low
- The Chat Ideation loop table (chat-mode.md:152) row 3 EVALUATION does not list a per-row user gate; the binding "discuss findings and remediation" gate is in §5 line 296. The CLAUDE.md Chat clause is consistent with §5, so no regression — but the producer should cite §5 (not the loop table) as the chat-mode anchor it matches, to avoid a future reader looking for the gate in the loop table.

## Verdict: REVISE
