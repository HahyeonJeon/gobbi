# Aesthetics — Preparation readiness report eval (iter1, claude)

## Frame + findings

### Scenario A1 — Is the report readable and precise in its claims?
The report uses MATCHES / DRIFT / CONFIRMED labels with line citations. Reads cleanly; a Planner can follow each claim to a line. PASS.

### Scenario A2 — Does the language overclaim certainty it did not earn?
The report says "re-verified against worktree canonical files NOW" and presents anchor lines as facts. Most are accurate (I re-verified). But the G1 section (Item 1b) states drift facts that are wrong (see Consistency F-C1) while phrased with high confidence ("has been edited concurrently", "visible in the harness-injected main-tree copy"). The confident phrasing of an incorrect claim is an aesthetics/honesty concern, but the substantive impact is captured under Consistency and Risk. Noted here only as tone.

### Finding A-1 — Overconfident phrasing on an unverified drift claim (Low)
- **Type:** general
- **Domain:** docs
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Low
- **Evidence:** Item 1b line 47: "The **main-tree** `.claude/CLAUDE.md` has been edited concurrently … plus a new '[claude skill]' row in the navigate table." The worktree CLAUDE.md already contains the `[claude skill]` row (line 57), so this is asserted as drift with confidence but is not actually a drift item. The report leans on a "harness-injected main-tree copy" it could not diff with git.
- **Why it matters:** Confident-but-wrong evidence in a readiness report can mislead the Wrap-up step into looking for the wrong collision. Substantive consequence tracked under Consistency/Risk; here it is a calibration/tone issue.
- **Suggested direction:** Drift claims should be backed by a `git diff origin/develop` rather than the injected main-tree snapshot. Manager decides.

No blocking aesthetics finding. The report is clean and readable; the one concern is overconfident phrasing on the (incorrect) G1 evidence.
