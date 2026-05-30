# Perspective: Usage

**Target:** T8 Workflow refactor across 3 docs
**Consumer:** the manager agent at session-bootstrap time + a future-self reading the SOP.

## Findings

### F-U1 — Broken `#iteration-caps` anchor in BOTH mode docs at the same row
- Type: `general` | Domain: `docs-sync` | Disposition: open | Confidence: 100 | Severity: Medium
- chat-mode:234 + auto-mode:153 — `[Workflow State Machine § Iteration Caps](SKILL.md#iteration-caps)`. The anchor does NOT exist in SKILL.md; the actual section is `### Iteration rule` (anchor `#iteration-rule`) at SKILL.md:297.
- Impact on consumer: A manager hitting `maxIterations` exhaustion in Wrap-up is told to "escalate to user per [Workflow State Machine § Iteration Caps]" — clicking the link drops them at the top of SKILL.md, not at the iteration semantics.
- Severity Medium because both mode docs are affected — the bug fires on every escalation path. Confidence 100 (literal grep).
- Pre-existing in 6c72793 (chat/auto mode docs first created) but T8 touched the same neighborhood (delete-from-SKILL.md, patch related cross-ref). Not strictly in scope but well within striking distance.

### F-U2 — A reader looking for "where Steps 2-6 live" lands on SKILL.md and has to follow a pointer
- Type: `general` | Domain: `docs-sync` | Disposition: open | Confidence: 100 | Severity: (none — design)
- SKILL.md L30 ("After bootstrap, the manager enters `### Step 1 — Workflow Configuration` below and proceeds through the six-step state machine.") suggests the six steps live below — but Steps 2-6 are now elsewhere.
- L80-91 (pointer paragraph) correctly routes the reader. So the structure is sound for someone who reads top-to-bottom. The risk is a reader landing mid-doc via a search for "Step 4" or "Ideation Loop" — they'll find Step 1 only, then have to scan for the pointer. Mitigation: the table at L17-22 already routes them. Acceptable cost of the refactor.

### F-U3 — chat-mode Step 3 is procedure-table-less but legible
- Step 3 (L153) has Definition / Inputs / Output / "Loop iteration." narrative + "Opt-in." note. No 5-row procedure table because no rows execute. A reader who pattern-matches on "every step has a table" will pause briefly, but the narrative answers the question ("Why no table? Because it's Skipped at loop entry"). Acceptable.

### F-U4 — Slice Boundary at chat-mode L201 reads cleanly
- Definition / Inputs / Output / "Procedure. Sequential — not a loop." + 4-row table. The phrase "not a loop" is reader-facing and clear. Strength.

### F-U5 — Mode-doc Step labeling vs. SKILL.md state-machine wording
- chat-mode L135 says "Step 2 — Slice Full Ideation Loop" but the SKILL.md state-persistence schema (L272) lists workflow keys as `ideation` / `preparation` / `planning` / `execution` / `wrap-up`. The runtime key + display name are consistent. No usage cost.

## Verdict
**REVISE.** F-U1 is the load-bearing find: both mode docs ship with a broken downstream anchor that fires on the escalation path. Whether T8 must fix it or whether a separate task picks it up is for the user to decide.

## Must-Preserve
- The procedure-table pattern conformance — manager agents pattern-match on these labels to construct delegation prompts.
- The Step 1 single-source-of-truth in SKILL.md (do NOT duplicate into mode docs).
