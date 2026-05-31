# Preparation Evaluation — USAGE perspective (Claude, iter1)

## Artifact Summary + Memory reads
Same as project.md. Usage lens = is the output usable by the next consumers (Planning leader, Execution executor, Wrap-up assistant) without re-asking.

## Locked Frame (Stage 1)
- Scenario: Planning leader can start without clarifying questions.
- Scenario: Executor can apply the inventory without the discussion transcript.
- Scenario: Wrap-up can route every staging file unambiguously.
- Scenario: Consumer does not form a wrong mental model.
- Observability: a missed gap traces back to a Preparation decision.

## Per-scenario per-check results
- **Planning leader can start:** PASS (mostly). The component inventory (skills/agents/hooks/manifest/marketplace) is concrete enough to write a task list. Each resolved item has a recommendation + evidence-to-change. The 2 contribution points are ratified, so Planning inherits final answers, not open questions.
- **Executor can apply inventory:** PASS. The layout design doc gives an exact ASCII tree, the 18-skill list, the 5-agent list, the 3 hook registrations with matchers + `${CLAUDE_PLUGIN_ROOT}` paths, and the manifest field shapes — all verified correct against ground truth + official docs.
- **Wrap-up routing:** PASS for the 5 preparation-staged files. (See structure.md S-1 for the cross-phase reference path ambiguity.)
- **Wrong mental model / no over-claim:** PASS. "Generated this loop: None" is honest — no skeleton claimed as generated.
- **Observability:** PASS. Each decision cites its authorizing source.

## Typed findings

### U-1 — Fire-exactly-once validation is specified as a marker-log assertion but the "trigger each event once post-install" procedure is under-operationalized for PostToolUseFailure
- **Type:** checklist_gap · **Domain:** test · **Disposition:** open · **Confidence:** 50 · **Severity:** Medium
- **Evidence:** Item 3 (line 96) + the staged decision (line 36) say "trigger each event once post-install, assert exactly one marker per event ... key on hook_event_name to avoid a false double-count." But `PostToolUseFailure` fires only when a Task/Agent tool call FAILS. The report does not say HOW the executor deterministically triggers a tool FAILURE to test that registration — the other two events (SessionStart, PostToolUse-success) are trivially triggerable, but a controlled failure is not.
- **Why it matters:** An executor implementing the fire-exactly-once gate will be able to verify 2 of 3 registrations easily and may either skip the PostToolUseFailure assertion (leaving the most error-prone registration unverified) or improvise a failure that does not match the `Task|Agent` matcher. Given the dev-vs-installed double-fire caveat (Option C), the PostToolUseFailure path is precisely where double-fire would be hardest to notice.
- **Suggested direction:** Planning should name a deterministic failure trigger (e.g., spawn an Agent task that exits non-zero) so all 3 registrations are independently falsifiable.

### U-2 — The post-install invocability check (DD-9) names "invoke a gobbi:<skill> + one agent" but does not specify WHICH skill, leaving the codex/gobbi-hook-authoring auto-grant question untested
- **Type:** checklist_gap · **Domain:** test · **Disposition:** open · **Confidence:** 50 · **Severity:** Low
- **Evidence:** Item 5 (line 108) + staged decision say the invocability check invokes "a `gobbi:<skill>` + one of the 5 agents." But the load-bearing uncertainty is specifically whether `codex` and `gobbi-hook-authoring` (the 2 skills NOT in the current allow-list) are auto-granted. Invoking any *already-allowed* skill (e.g., `gobbi:git`) would NOT falsify the auto-grant premise for the 2 omitted skills.
- **Why it matters:** The empirical falsifier could pass while the real question (do the 2 unlisted skills need explicit allow entries?) stays unanswered — the check would be checking the wrong skill.
- **Suggested direction:** Planning should specify the invocability check targets `gobbi:codex` or `gobbi:gobbi-hook-authoring` (the omitted ones) to actually test auto-grant.

## Must-preserve
- The contribution-point ratifications give Planning final answers — preserve.
- The verified-correct manifest/marketplace field shapes save the executor from re-deriving the schema — preserve.

## Verdict: REVISE
U-1 is Medium at confidence 50 (≥50 → REVISE). The fire-exactly-once gate — a named Ideation Success Criterion (#3) — has an under-operationalized failure-trigger that Planning should close.

## Low-confidence appendix
- U-1, U-2 at 50: both are operationalization gaps the executor *might* solve correctly unaided; flagged because they sit on the two ratified contribution points where verification rigor matters most.
