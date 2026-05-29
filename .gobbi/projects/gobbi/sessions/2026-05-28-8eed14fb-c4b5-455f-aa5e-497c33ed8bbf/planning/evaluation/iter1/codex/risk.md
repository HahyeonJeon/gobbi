# Risk — Planning iter1 Evaluation (Codex)

## Artifact Summary
The artifact is a Planning iter1 draft for the Chat Mode + Auto Mode redesign. What: it defines seven implementation/archive tasks and a cross-task acceptance gate. Why: it should lower execution risk by making dependencies, out-of-scope files, verification, and rollback concerns explicit. How: it sequences dependent doc work, separates JSON/template edits, and adds per-task verification commands. Scope Contract source: Ideation sections 2, 7, 8, and 9. Downstream consumers are executors, the Wrap-up assistant, and the manager deciding whether Planning can advance to Execution.

## Memory reads
- Required skills and rules listed in `project.md`.
- Planning draft and Ideation artifact listed in `project.md`.
- Mistakes: `codex-eval-session-write-path-nested-in-worktree.md`, `skills-mirror-symlinks-not-copies.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`, `design-literal-retire-instruction-without-replacement.md`.
- Filesystem checks for worktree paths, `plugins/`, and `claude` skill availability.

## Locked Frame (Stage 1)
Scenario 1: Verification commands are concrete and enforce success.
- Check: commands with expected counts exit nonzero when the count is wrong.
- Check: `jq` checks distinguish missing/null from an empty array or required value.
- Check: baseline comparisons name a concrete commit/ref or a command to capture it.

Scenario 2: Rollback and interruption boundaries remain coherent.
- Check: each task has a bounded file set.
- Check: T6 archive work waits until the closing tasks actually ship.
- Check: no task creates a false NEEDS_CONTEXT loop from stale paths.

Scenario 3: High-blast-radius assumptions are not left to future executors.
- Check: absent required skills are resolved before Execution.
- Check: stale mirror systems are removed from the Plan or marked not applicable.

Scenario 4 (adversarial): The Plan-level acceptance test passes while the integration is broken.
- Check: count-printing commands are converted to assertions.
- Check: all three JSON semantics are checked beyond parse.
- Check: no-bleed checks do not mask missing positive checks.

Coverage matrix declarations:
- Privacy/data handling: task-record content privacy is acknowledged in the Idea artifact and T1 should carry it.
- Cost / paid-API exposure: no paid calls in Execution tasks.
- Supply chain: no new dependencies.
- Error budget: documentation/template changes are reversible by task commits, but a false acceptance gate can allow broken docs to ship.

## Evaluation (Stage 2)
Scenario 1 result:
- No: many commands print counts or values with comments instead of asserting pass/fail. `jq '.workflow.chat.tasks'` exits 0 even if the key is missing and prints `null`.
- No: T4/T5 use undefined `<pre-T4-rev>` and `<pre-T5-rev>` placeholders for diff baselines.

Scenario 2 result:
- Partial: file sets are bounded and T6 correctly requires T1/T2/T3. The stale plugin mirror note can still create an unnecessary NEEDS_CONTEXT path.

Scenario 3 result:
- No: the absent `claude` skill and stale `plugins/` mirror instruction are both high-confidence execution blockers or false blockers.

Scenario 4 result:
- No: the Plan says "Plan-level acceptance is binary" after commands that do not enforce their expected values.

Findings:

### codex-risk-001
- Type: assumption_risk
- Domain: verification
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:468-487` uses `find -L ... | wc -l`, `grep -c`, and `jq` with comments such as `# expect 2`, `# >= 1`, and `# []`; `draft-iter1.md:498` then says "Plan-level acceptance is binary." These commands do not fail on incorrect counts or `null` values unless wrapped in assertions.
- Disposition: open

### codex-risk-002
- Type: assumption_risk
- Domain: verification
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:241` uses `git diff <pre-T4-rev> -- <settings.default.json>` and `draft-iter1.md:284` uses `git diff <pre-T5-rev> -- <state.template.json>`. No pre-task step defines `<pre-T4-rev>` or `<pre-T5-rev>`, so the "byte-for-byte unchanged" and additive-only checks depend on executor invention.
- Disposition: open

### codex-risk-003
- Type: design_flaw
- Domain: process
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:518` says a missing or ambiguous plugin mirror should surface as NEEDS_CONTEXT. The evaluator brief explicitly says `plugins/` is deleted and plugin-mirror absence is not a defect; local checks found no `plugins` directory in main or worktree.
- Disposition: open

VERDICT: REVISE

## Low-confidence appendix
None.
