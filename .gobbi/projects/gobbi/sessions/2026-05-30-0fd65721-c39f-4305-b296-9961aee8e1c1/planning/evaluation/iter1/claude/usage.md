# Planning Evaluation — Usage — iter1 — claude

## Artifact Summary + Memory reads
(See project.md.) Focus: can a fresh executor use each task without returning to the user/leader?

## Locked Frame (Stage 1)
- **S1 A fresh executor given task N alone can read inputs/outputs/verifies and begin.** checklist: spawnable with inputs as full context; verifies runnable as-is.
- **S2 Executor knows which files to open, which to modify, which to verify.** checklist: file paths + anchors; concrete verify commands.
- **S3 Failure modes communicated per task.** checklist: known failure modes listed; no surprise deps.
- **S4 Inter-task handoff explicit & name-identical.** checklist: outputs[N] == inputs[N+k].
- **S5 (adversarial) Executor must ask "what does X mean here."** checklist: terms defined; acronyms expanded.

## Per-scenario per-check results
- **S1 PARTIAL.** T1-T4, T7, T8 are fully self-contained and runnable by a fresh executor. **T5/T6 are NOT** — see Structure ST-2: their verifies require an out-of-process install + a clean Claude session + (T6) interactive skill/agent invocation that a spawned executor cannot perform autonomously. A fresh executor handed T5 will author the script fine but cannot complete the "run it in a clean installed-only environment" verification without operator help. The plan does not say WHO runs the install. See US-1.
- **S2 YES.** Every task names exact file paths (worktree-absolute prefix mandated, plan line 81 + D-W). T6 names the exact 2 skills to invoke (`gobbi:codex`, `gobbi:gobbi-hook-authoring`) + one agent (e.g. `leader`) — concrete. T7 names the exact symlink and target. T8 names the exact README + the rows to add.
- **S3 GOOD.** Per-task mistake lists (agent-assignment table) surface failure modes: T1/T7 carry the symlink/mirror/worktree-copy mistakes; T4/T5/T6 carry `executor-cwd-reset-commits-task-to-wrong-branch` (the cwd/branch footgun DD-7's commit/push exposes); every task carries `subagent-relative-write-paths-stray-cd-doesnt-persist`. The `claude`-skill dangling-reference is honestly flagged (line 289) so the executor is not surprised. The #256 matcher-too-narrow lesson is in T3. This is strong failure-mode communication.
- **S4 YES.** Handoff names are literal and consistent. Verified: T1 outputs `[sync-script, materialized-skills-tree, materialized-agents-tree, materialized-hook-scripts]`; T2 inputs `[materialized-skills-tree, materialized-agents-tree]` (name-match); T3 inputs `[materialized-hook-scripts]` (match); T4 inputs `[plugin-manifest]` == T2 outputs (match); T5 inputs `[plugin-hooks-json, marketplace-catalog]` == T3+T4 outputs (match); T6 inputs `[marketplace-catalog]` (match); T7 inputs the union of prior outputs (all match); T8 inputs `[claude-plugin-skill, plugin-manifest, plugin-hooks-json, marketplace-catalog]` (match). No paraphrased handoff.
- **S5 YES.** Terms are defined or project-glossary (ADDS-to vs REPLACES, `${CLAUDE_PLUGIN_ROOT}`, dev-vs-installed split, sentinel, auto-grant). The Principle-13 SPEC for T7 spells out the gobbi-section content the executor must write (no "figure it out").

## Typed findings
- **US-1 — T5/T6 do not state WHO performs the install + clean-session run; a fresh executor cannot self-serve the verification.** Type: checklist_gap. Domain: process. Disposition: open. Confidence: 75. Severity: Medium. Evidence: T5 verifies "Install the plugin from the worktree-faithful path... into a clean installed-only environment with NO active in-repo .claude/settings.json dev registrations; run...". T6 verifies "invoke gobbi:codex, gobbi:gobbi-hook-authoring... and one of the 5 agents... records auto-grant TRUE/FALSE." Neither task names an operator-assist step, yet a spawned executor subagent cannot disable the live dev hooks, push the branch into an installable state, start a separate clean Claude session, or interactively invoke skills/agents and observe load success. Why it matters: same risk as ST-2 — the executor either stalls or fabricates a pass. Suggested direction: add an explicit "operator runs the install + clean session; executor authors the script + the assertion harness and the operator pastes the marker log / invocability result back" handoff note to T5 and T6. Flag for user discussion.

## Low-confidence appendix
- (25, Low) T6's conditional Modify ("ONLY IF auto-grant FALSE") is clear, but a fresh executor needs the pre-edit allow-array snapshot to diff against (+2 exactly). The verifies clause names this ("diff the allow array against the pre-edit snapshot"), so it is covered — not a finding.

**Verdict: PASS** (US-1 Medium, not High.)
