# Risk — Planning iter1 (Claude)

**Verdict:** PASS

## Artifact Summary

- Risk lens: per-task risk flags vs actual surface area, T3-High vs 8-anchor density, T1-Medium vs R5-skeleton-drift hazard, T4-Medium vs single-block-two-keys gamble.

## Frame (Risk)

- **S-R1 T3 High risk flag matches actual surface area** (8 anchor edits on a 459-line file).
- **S-R2 T1 Medium risk flag matches R5-skeleton-drift hazard** (4-bullet canonical statement that an executor may compress or expand).
- **S-R3 T4 Medium risk flag matches single-block-two-keys vs two-top-level-keys gamble** (resolver-cascade unknown).
- **S-R4 T5 Low risk flag matches additive-JSON-edit** (small surface).
- **S-R5 T6 Low risk flag matches Wrap-up-time archive** (mechanical move).
- **S-R6 T7 Low risk flag matches 5-min backlog create**.
- **S-R7 Cross-task risks captured** — Plan §5 plan-level risks complement per-task risks.

## Per-scenario Findings

- **S-R1 ✓** — T3 is correctly flagged High. Surface: 8 distinct anchor edits on a 459-line file, including a strike-through formatting choice, an ADR-style CORRECTION block, an inter-loop transition table rewrite, a Status Display sub-section addition, a fourth Chat-mode gate, a state-machine description amendment, and a Workflow Metadata schema addition. Risk-rationale at lines 350-352 correctly names anchor-line drift, strike-through format choice (Markdown's `~~...~~` vs `<s>...</s>`), and the "shape-only" boundary risk. Mitigation: Sub-step E spec-coverage check (8 anchors → 8 edits) is the safety net.
- **S-R2 ✓** — T1 is correctly flagged Medium. R5's narrowed PASS path has a specific 4-bullet structure (Steps preserved / Steps skipped / moment-of-capture / base unmodified). A long-form executor authoring a 200+ line document could plausibly merge two bullets, split one, or add a fifth — drifting from the canonical R5 statement. Risk-rationale line 136 explicitly calls this out as "the leading hazard". Mitigation: T1 verification-command line 130 `grep -cE 'Steps preserved|Steps skipped|moment-of-capture|memorization/SKILL.md is unmodified' >= 4` is exactly the right grep.
- **S-R3 ✓** — T4 is correctly flagged Medium. Real surface: choosing between single-block-with-two-keys vs two-top-level-blocks JSON shape (L-S1 tactical). Hazard: resolver code may read only single-block shape; JSON-only fix may be insufficient. Risk-rationale line 243 mentions the escalation path (NEEDS_CONTEXT if resolver breaks). Plan-level risk P-R3 (line 509) and Out-of-Scope F-R1 (line 81) acknowledge this is a Planning-tracked uncertainty.
- **S-R4 ✓** — T5 is correctly flagged Low. Surface: two small JSON additive edits (one new top-level key per file). Risk-rationale line 286 names the only real hazard ("forgetting one of the two templates"). Mitigation: §4 acceptance check #6 verifies both templates.
- **S-R5 ✓** — T6 is correctly flagged Low. Mechanical archive. Risk-rationale line 444 names the inbound-reference scan miss. Mitigation: §4 check + T6 verification `rg -l ...| grep -v archive`.
- **S-R6 ✓** — T7 is correctly flagged Low. 5-min backlog create. Only risk is slug-naming.
- **S-R7 ✓** — Plan §5 P-R1..P-R7 (lines 506-513) names cross-task risks: anchor-line drift (P-R1), R5 skeleton drift (P-R2), JSON shape (P-R3), inbound-reference miss (P-R4), deferred first-Chat-session validation (P-R5), mirror-symlink false-positive (P-R6), worked-example schema drift (P-R7). All are real surface areas the per-task risk-flags don't fully capture. Severities reasonable.

## New typed findings

- **F-RISK-1 (Medium · Confidence 50 · `assumption_risk` · `process`)** — Plan §5 P-R6 (line 512) says "Mirror symlinks for chat-mode.md / auto-mode.md verified ONLY for current worktree." Plan does NOT include a pre-flight in T3 explicitly directing the executor to re-verify the symlinks before editing. T1 verification line 133 `test -L <worktree>/.claude/skills/orchestration/chat-mode.md` runs AFTER the edit; T3 line 348 does the same. **Pre-flight verification is missing as an explicit task step** — Plan §5 P-R6 acknowledges the risk but routes the mitigation to executor judgment ("MUST re-verify the symlink + canonical-file pair as a pre-flight"). Direction (don't prescribe): hoist the pre-flight into each task's verification block as the first check, not the last. Confidence 50 (mitigation is partially-present via post-edit symlink test, but pre-flight is implicit not explicit).
- **F-RISK-2 (Low · Confidence 50 · `assumption_risk` · `process`)** — Plan §5 P-R7 (line 513): T1's worked Status Display example assumes a Chat session shape that doesn't yet exist on disk; risk is the schema (§6.7) and the example drift. Plan says "Mitigation: schema citation in the example caption." This is a soft mitigation — there's no Plan-level check or T1 verification command that asserts the worked example references §6.7. Direction: add a grep check `grep -c '6.7\|workflow.chat.tasks' chat-mode.md  # expect >= 1`. Confidence 50.
- **F-RISK-3 (Low · Confidence 25 · `assumption_risk` · `process`)** — Plan §5 P-R3 (line 509) says "Plan-level acceptance test #3 (JSON valid) catches gross errors but not resolver-compat issues — those surface at first post-merge Chat session." This is a deliberate accepted residual risk. If the chosen JSON shape breaks the resolver cascade, the first Chat session (a future session) is the falsifying gate. Not a Plan defect; flagged for awareness.

## Verdict & Must-preserve

- **Verdict: PASS.** Per-task risk flags align with actual surface area; plan-level §5 captures cross-task risks; mitigations are documented even where post-hoc rather than pre-flight.
- **Must-preserve:**
  - T3 risk-rationale's "use grep-anchors not line numbers" directive (line 350).
  - T1 verification-command line 130 (R5 four-bullet grep).
  - §4 acceptance test check #6 (both templates checked for chat.tasks key).
  - Plan §5 P-R5 (first Chat session as deferred validation gate — honest about the validation horizon).

## Low-confidence appendix

- F-RISK-1's confidence is held at 50 because the post-edit symlink test does provide some protection (catches mid-edit symlink replacement); pre-flight is the stronger discipline but not strictly required if the executor follows the Edit/Write tool which preserves the inode.
