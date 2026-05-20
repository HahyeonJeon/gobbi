# Usage Perspective — 5-Role Agent Taxonomy (iter3, claude)

## Artifact Summary + W/W/H

See `project.md`. Usage = next-consumer POV (operator, manager subagent, evaluator subagent, future-self).

## Memory reads

- `iter2/claude/usage.md` (inheritance — 5 findings, including F-U-NEW-01 High/100 regression closed by Fix 2)
- `agents/*.md` (full)
- `skills/evaluation/SKILL.md` § Perspectives + Output paths
- `skills/delegation/SKILL.md` § Agent Roster
- `skills/wrap-up/SKILL.md` (for the assistant's Wrap-up consumer-path)
- `skills/memorization/SKILL.md`

## Locked Frame (Stage 1)

### S-U-1 (inherited): A new operator at 3am reads one file and knows the role
### S-U-2 (inherited, addressed): Manager subagent can decide which role (F-U-01 closed iter2)
### S-U-3 (inherited, open partial): Evaluator can find its child doc (F-U-03)
### S-U-4 (adversarial inherited): Wrong mental model — terms consistent
### S-U-5 (inherited, open): Status enum co-occurrence (F-U-04)
### S-U-6 (Accessibility / I18n): not-applicable — agent-facing markdown specs; no UI
### S-U-7 (Observability): status output parseable
### S-U-8 (iter2 NEW, addressed by Fix 2): AskUserQuestion manager-owned (F-U-NEW-01)
### S-U-9 (NEW iter3 adversarial): Did Fix 2 leave usage gaps in the SKILL files the assistant loads at runtime?
### S-U-10 (NEW iter3): Operator can find Fix 4 issue #258 disclosure
### S-U-11 (NEW iter3): Operator reads assistant.md and understands the new tool surface

## Per-scenario per-check results (Stage 2)

### S-U-1
- (a) First paragraph self-describes for each of 5 roles: **YES** all 5
- (b) Status enum: 4-state DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED clear → **YES**

### S-U-2 (F-U-01)
- (a) `(or X)` ambiguity: still **0 hits** in grep. → **addressed (carry)**

### S-U-3 (F-U-03)
- (a) Path templates `agents/evaluation/{perspective}.md` at evaluator.md:42: directory **STILL DOES NOT EXIST**
- (b) iter3 did NOT touch this path template
- (c) The Fix-1-style "defer to issue #258" pattern at executor.md:35 is the right precedent — evaluator.md:41-44 could apply the same pattern. It does not.
- → **F-U-03 disposition: open (stuck across iter1+iter2+iter3 in part — iter3 specifically did not address)**

### S-U-4 (adversarial — terms consistent)
- "leader" old-meaning carry (F-A-01 Low)

### S-U-5 (F-U-04)
- (a) Co-occurrence rule still absent. → **open (Medium, carry)**

### S-U-7
- (a) Status output parseable: yes

### S-U-8 (Fix 2 verification)
- (a) manager.md:12 reads: "AskUserQuestion is manager-owned ... The Interview skill is the only named exception"
- (b) assistant.md:27 reads: "AskUserQuestion is manager-owned. When you need user input — including during Wrap-up WORK step 4 ... — return status `NEEDS_CONTEXT` ... Do NOT call AskUserQuestion directly."
- (c) **NO CONTRADICTION between manager.md and assistant.md** — single canonical exception (Interview). Wrap-up step 4 is routed through NEEDS_CONTEXT, not as a new exception.
- → **F-U-NEW-01 disposition: addressed**

### S-U-9 (NEW iter3 — downstream skill files sweep)
- (a) **wrap-up/SKILL.md** was NOT touched in iter3.
  - Line 4 frontmatter: `allowed-tools: ... AskUserQuestion` — direct grant
  - Line 137 procedure: "AskUserQuestion via manager" — escalation language
  - Line 351 constraint: "unrouted files escalate to user via AskUserQuestion" — ambiguous
  - Line 357 constraint: "**MUST run user-confirm via AskUserQuestion** for: rules promotion, project-wide design promotion, mistake scope (feature vs project), unrouted staging files" — **DIRECT-CALL wording**
- (b) The assistant in Wrap-up mode loads `wrap-up/SKILL.md` per assistant.md:18. The skill instructs direct AskUserQuestion calls (lines 39, 351, 357); the agent file (assistant.md:27) requires NEEDS_CONTEXT escalation. **The operator sees contradictory contracts.**
- (c) Mixed messaging in skill itself: line 137 says "via manager" (correct), but lines 351 + 357 say "run ... AskUserQuestion" (wrong post-iter3). The skill has internal inconsistency that predates iter3 but is now exposed by the Fix 2 patch.
- → **F-U-iter3-NEW-01** (High/100 — downstream skill files contradict the fix; same finding shape as the iter2 F-U-NEW-01 contradiction Fix 2 closed)

### S-U-10 (NEW iter3 — Fix 4 discoverability)
- (a) Operator looking for "is there a drift validator?" question: where would they look?
  - First-line search: `evaluation/SKILL.md` (the bundle's drift detection should live there) — no mention of issue #258
  - Second-line search: `git/SKILL.md` § Forbidden Operations — Fix 4 placed it here at line 123
- (b) The placement is reasonable but **not the first place an operator would search**. A more discoverable location would be `evaluation/SKILL.md` (which already has the "if you're checking for drift" mental hook in Stage 2 Consistency perspective).
- (c) However: git/SKILL.md:123 placement is defensible — Forbidden Operations is the right tonal context (the disclosure says "this is hand-reviewed because no automated detector exists, so PR review must catch the drift").
- → **no finding** (placement reasonable, even if not optimal)

### S-U-11 (NEW iter3 — assistant.md tool surface)
- (a) Operator reading assistant.md: description text at line 3 says Write/Edit during MEMORIZATION + Wrap-up; read-only in lookup mode. Tool surface (line 4) lists Write + Edit.
- (b) The expanded role is operator-readable.
- (c) Aesthetics owns the incorrect skill citation at line 3 (`evaluation/SKILL.md memory access matrix` should be `memorization/SKILL.md` or `wrap-up/SKILL.md`) — Usage perspective concurs but defers to Aesthetics for the finding ownership.
- → no Usage-owned finding

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-U-01** | `design_flaw` | `process` | addressed (carry) | 100 | n/a | Closed in iter2, preserved | Carry |
| **F-U-02** | `design_flaw` | `docs-sync` | addressed (carry) | 100 | n/a | Closed in iter2, preserved | Carry |
| **F-U-03** | `scenario_gap` | `docs-sync` | open (stuck partially) | 75 | High | evaluator.md:42 path `agents/evaluation/{perspective}.md` directory does not exist; iter3 did not address | Evaluator loading from a non-existent path will fall back or fail; same pattern as F-EXEC-DANGLING but for evaluator |
| **F-U-04** | `scenario_gap` | `process` | open (carry) | 75 | Medium | No status co-occurrence rule | Same as iter1 + iter2 |
| **F-U-NEW-01** | `design_flaw` | `docs-sync` | **addressed (Fix 2)** | 100 | n/a | manager.md:12 ↔ assistant.md:27 reconciled; no contradiction | iter2 High regression closed cleanly |
| **F-U-iter3-NEW-01** | `design_flaw` | `docs-sync` | **open (NEW iter3 regression)** | 100 | **High** | wrap-up/SKILL.md:357 + lines 351 + 39 say "MUST run user-confirm via AskUserQuestion" (direct-call); assistant.md:27 routes via NEEDS_CONTEXT. The skill file (loaded by assistant at runtime) contradicts the agent file | Same failure shape as iter2 F-U-NEW-01: Fix 2 swept agent files but not skill files. Operator gets contradictory contracts |

## Per-perspective verdict

**REVISE** — F-U-iter3-NEW-01 (High/100, regression class) + F-U-03 (High/75, stuck partial). Two Highs.

Per the rule: any High/50 → REVISE. → **REVISE**.

Note the same-shape failure: iter2 F-U-NEW-01 was an agent-file contradiction; iter3 fixed it inside the agent files but did NOT sweep the skill files those agents load. The third iter introduces a regression in the same shape as iter2.

iter1 was FAIL; iter2 was REVISE; iter3 is also REVISE — net trajectory: progress on closing iter2 regression, but a new regression of the same shape appears.

## Low-confidence appendix

(none below threshold)
