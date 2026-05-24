## Stage 0 — Artifact Summary + Memory reads
Artifact: Ideation iter3 draft.
Usage lens: whether Planning, Execution, future managers, and tired maintainers can consume the design correctly.
What: finalizes the T1/T3 design enough for Planning.
Why: iter2 blockers would have forced Planning to invent a valid branch name and trust undocumented hook support.
How: explicit branch validation, direct quotes, and resolver fallback/backlog make the consumer path clearer.
W/W/H gate: PASS.
Memory reads:
- shared Stage 0 reads from `project.md`
- `draft-iter3.md:70-77`, `:221-294`, `:371-386`, `:420-439`
- staged reference and backlog files
- all prior Usage files: iter1/claude, iter1/codex, iter2/claude, iter2/codex
- official hooks page current fetch
- branch validator output.

## Locked Frame (Stage 1)
Scenario U1: Planner can decompose T1 without asking for a branch-name decision.
- Check U1.1: branch name is valid and concrete.
- Check U1.2: branch smoke test is concrete.
- Check U1.3: issue/no-issue ambiguity is resolved enough for row 5.5.
Scenario U2: Executor can implement T3 dual hook registration without verifying event existence from scratch.
- Check U2.1: event names are spelled consistently.
- Check U2.2: official support is quoted in the draft.
- Check U2.3: staged reference is followable.
Scenario U3: Executor understands the `.gobbi/project.json` dormant path.
- Check U3.1: active fallback is clear.
- Check U3.2: backlog offers actionable pickup choices.
- Check U3.3: no one is told to write project.json during Ideation.
Scenario U4 (adversarial): supporting citation defects mislead the next agent.
- Check U4.1: wrong line/count claims are non-load-bearing.
- Check U4.2: the real commands needed by the executor remain correct.
Scenario U5: Coverage matrix non-UI concerns are handled.
- Check U5.1: Accessibility/i18n are not applicable to this non-UI design.
- Check U5.2: observability via diagnostics and smoke tests remains available.

## Per-scenario per-check results
U1.1: YES. Branch test returned PASS for type, regex, slug, and length.
U1.2: YES. `draft-iter3.md:281` and `:424` give `jq '.git.branch'` regex and `git.worktreePath` non-null checks.
U1.3: YES. `chore/session-{date}-{ssid-short}` does not require issue/task slug knowledge at Configuration row 5.5.
U2.1: YES. `PostToolUseFailure` is used consistently in T3-E-5, E-1, T3-I-T3.c, D-3-3, and F-Fix-B.
U2.2: YES. Draft lines 205, 289, 366, 530, and 531 carry the quote strings.
U2.3: YES. The staged reference source URL and usage history are present at lines 1-8 and 99-104.
U3.1: YES. `draft-iter3.md:377-378` says fallback is currently the only working path.
U3.2: YES. Backlog lines 31-42 describe in-Execution write, future deferral, and pickup timing.
U3.3: YES. `draft-iter3.md:294` says no `.gobbi/project.json` write this session.
U4.1: YES. `31` count and line 261 citation errors do not alter event existence, branch regex, or resolver fallback.
U4.2: YES. Executor-facing commands/regexes are valid despite minor citation metadata issues.
U5.1: YES. No UI or locale-sensitive user-facing strings are introduced by the design.
U5.2: YES. Validation table includes branch smoke tests, artificial failed spawn, resolver fixtures, and concurrent-fire tests.

## Typed findings
### COD-USAGE-002 — Session-dir resolver usability resolved and clarified
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- surfaced-by: codex
- inherited-from: iter2/codex/usage.md COD-USAGE-002
- evidence: `draft-iter3.md:371-386` makes project lookup, current fallback, and negative-case behavior explicit; Fix C adds the dormant-precondition note.

### COD-USAGE-004 — Structured-header migration behavior remains resolved
- type: checklist_gap
- domain: observability
- disposition: addressed
- confidence: 75
- severity: Medium
- surfaced-by: codex
- inherited-from: iter2/codex/usage.md COD-USAGE-004
- evidence: `draft-iter3.md:291` preserves migration behavior for prompts lacking structured headers.

### CLAUDE-USAGE-U3 — Hook-silence diagnostic remains a follow-up residual
- type: scenario_gap
- domain: observability
- disposition: open
- confidence: 50
- severity: Medium
- surfaced-by: codex
- inherited-from: iter2/claude/usage.md U3
- evidence: iter3 did not add a dedicated hook-silence diagnostic checklist. The reconstructor remains the repair path, but a 3am operator diagnostic could still be stronger.

## Low-confidence appendix
Low-confidence note: a future planner may choose to absorb `.gobbi/project.json` creation into T3, but the backlog explicitly leaves that to Planning/Execution and does not block current usability.
No other Usage concern exceeded 25 confidence.

Verdict: PASS
