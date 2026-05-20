# Usage Perspective — 5-Role Agent Taxonomy (iter2, claude)

## Artifact Summary + W/W/H

See `project.md`. Usage = next-consumer POV (operator, manager subagent, evaluator subagent, future-self).

## Memory reads

- `iter1/claude/usage.md` (inheritance — 4 findings)
- `agents/*.md` (full)
- `skills/evaluation/SKILL.md` § Perspectives + Output paths
- `skills/delegation/SKILL.md` § Agent Roster

## Locked Frame (Stage 1)

### S-U-1 (inherited): A new operator at 3am reads one file and knows the role
- [ ] First paragraph self-describes
- [ ] Status enum unambiguous

### S-U-2 (inherited): Manager subagent can decide which role to spawn (F-U-01)
- [ ] No `(or X)` ambiguities
- [ ] Tiebreaker rule for unclear cases

### S-U-3 (inherited): Evaluator can find its child doc (F-U-02 + F-U-03)
- [ ] Perspective vocab matches canon
- [ ] Path templates resolve to existing files

### S-U-4 (adversarial inherited): Wrong mental model
- [ ] Terms consistent across docs

### S-U-5 (inherited): Status enum disambiguation (F-U-04)
- [ ] Co-occurrence semantics defined

### S-U-6 (Accessibility / I18n)
- not-applicable: agent-facing markdown specs; no UI

### S-U-7 (Observability)
- [ ] Status output parseable

### S-U-8 (NEW iter2): Task E verification — AskUserQuestion manager-owned
- [ ] All 4 subagents (leader/executor/evaluator/assistant) say "AskUserQuestion is manager-owned" or equivalent
- [ ] NEEDS_CONTEXT + `user-question:` block escalation path is clear

### S-U-9 (NEW iter2 adversarial): Task E + Task F consistency — what about the Wrap-up step 4 exception?
- [ ] Two named exceptions (Interview, Wrap-up step 4) versus manager.md:12 claim of "Interview is the only named exception"

## Per-scenario per-check results (Stage 2)

### S-U-1
- (a) First paragraph: **YES** all 5 files
- (b) Status enum: still 4-state DONE/DONE_WITH_CONCERNS/NEEDS_CONTEXT/BLOCKED — clear
- (c) Co-occurrence: **STILL UNADDRESSED** — F-U-04 carry-forward

### S-U-2 (F-U-01)
- (a) `(or X)` ambiguity: **GONE** — grep confirms 0 hits → **F-U-01 addressed**
- (b) Tiebreaker rule for novel ambiguities: not added globally, but the specific iter1 ambiguity (Memorization+Wrap-up owner) is closed

### S-U-3 (F-U-02 + F-U-03)
- (a) Vocab match: **YES** (F-A-02 addressed) → **F-U-02 disposition: addressed**
- (b) Path template `agents/evaluation/{perspective}.md` resolves: **STILL NO** — `ls .gobbi/projects/gobbi/agents/evaluation/` → No such file or directory. evaluator.md:42 STILL points to non-existent directory. → **F-U-03 disposition: open (regression class — addressed in spirit by Task A's "use evaluation/SKILL.md as source of truth", but the path on line 42 is still dangling)**
- This is a partial fix: the metadata schema is now sourced from evaluation/SKILL.md; the path template for target-type-specific evaluation docs (lines 41-44) is still hopeful

### S-U-4 (adversarial)
- Terminology: "leader" old-meaning carry-forward (F-A-01 Low)

### S-U-5 (F-U-04)
- (a) Co-occurrence rule: still absent → **disposition: open**

### S-U-7
- (a) Observable: **YES**

### S-U-8 (Task E verification)
- leader.md:17, leader.md:65, leader.md:110: "AskUserQuestion is manager-owned"; NEEDS_CONTEXT + `user-question:` block ✓
- executor.md:19, executor.md:99, executor.md:128: same pattern ✓
- evaluator.md:94, evaluator.md:104: same ✓
- assistant.md:27, assistant.md:103: same — BUT with explicit exception for Wrap-up WORK step 4
- → Task E is consistently applied across 4 subagents

### S-U-9 (NEW iter2 — exception consistency)
- manager.md:12: "subagents (leader / executor / evaluator / assistant) never call AskUserQuestion. … The Interview skill is the only named exception"
- assistant.md:27: "**AskUserQuestion is manager-owned.** … The single exception is Wrap-up WORK step 4 … in those cases the delegation prompt will explicitly grant AskUserQuestion access"
- **DIRECT CONTRADICTION**: manager.md says "Interview is the ONLY named exception"; assistant.md says "Wrap-up step 4 is an exception". Two named exceptions exist; one of the two files is wrong.
- → **F-U-NEW-01** (High/100, **regression** — newly introduced by Task E + Task F interaction)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-U-01** | `design_flaw` | `process` | **addressed** | 100 | High | grep `(or leader)` → 0 hits; manager.md:84-87 unambiguous | iter1 High resolved |
| **F-U-02** | `design_flaw` | `docs-sync` | **addressed** | 100 | High | evaluator.md:12 + delegation/templates/evaluator.md:8 match canon | iter1 High resolved |
| **F-U-03** | `scenario_gap` | `docs-sync` | open | 75 | High | evaluator.md:42 still points to `agents/evaluation/{perspective}.md` which does not exist | Evaluator delegated to evaluate an agent will load a non-existent path; the load step fails or falls back to evaluation/SKILL.md by accident |
| **F-U-04** | `scenario_gap` | `process` | open | 75 | Medium | No status co-occurrence rule documented | Same as iter1 |
| **F-U-NEW-01** | `design_flaw` | `docs-sync` | open | **100** | **High (regression)** | manager.md:12 says "Interview is the only named exception"; assistant.md:27 introduces a second exception "Wrap-up WORK step 4" | Two REVISE tasks (E + F) introduced contradictory exception lists in the same iter. Operator reading manager.md will not learn about Wrap-up step 4 exception; operator reading assistant.md will see two valid escalation paths. Direct lexical contradiction |

## Per-perspective verdict

**FAIL** — F-U-NEW-01 (High/100, regression) is the load-bearing finding. iter1 F-U-01 and F-U-02 are addressed (real progress), but iter2 introduced a new High-severity contradiction between two REVISE tasks. F-U-03 still open (High/75); F-U-04 carry-forward (Medium/75).

Per the rule "any High with confidence ≥ 50 → REVISE; any Critical with confidence ≥ 75 → FAIL" — F-U-NEW-01 + F-U-03 are both High/100 and High/75 respectively, no Criticals; that's REVISE per the rule. **However**, the regression class warrants a hard look: the same iter that fixed 2 High findings introduced 1 High and left 1 High open. The fix-to-introduce ratio is 2:1, not 2:0.

Strict per-perspective rule → **REVISE** (no Critical, two Highs).

## Low-confidence appendix

(none below threshold)
