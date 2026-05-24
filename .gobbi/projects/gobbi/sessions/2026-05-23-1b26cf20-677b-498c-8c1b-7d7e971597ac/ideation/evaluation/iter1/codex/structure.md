## Artifact Summary + Memory reads
Artifact type: ideation draft with scope contract, framed problem, research insights, scenarios, implementation checklist, and directional design.
What: T1 changes the session work surface from main-tree-first to worktree-first; T3 creates automatic subagent telemetry capture in `session.json.agents[]`.
Why: the existing path rule solved one session-memory failure but caused PR-reviewable artifacts to miss the worktree branch; manual `agents[]` append discipline failed empirically.
How: row 5.5 worktree creation, qualified write-path rule, per-iteration session-memory commits, bash+jq hook, bash+jq reconstructor, and structured prompt headers.
Scope source: draft-iter1.md frontmatter and Scope Contract.
Downstream consumers: Planning and Execution will turn the directional design into file edits and shell scripts.
Memory reads: primary draft plus Sub-step A/C/D rawdata.
Memory reads: evaluation skill and ideation child doc for scenario seeds.
Memory reads: git skill, git conventions, orchestration skill, delegation skill, preparation skill.
Memory reads: settings.json, session-start.sh, session.template.json.
Memory reads: all listed project mistake files.
Memory reads: staged T3 reference files for hook schema and transcript shape.
Stage 0 W/W/H gate: pass.
Stage 0 phase gate: pass.

## Locked Frame (Stage 1)
Scenario S1 - Proposed components have clear ownership.
Checklist S1.1 - Configuration row 5.5 owns worktree creation only.
Checklist S1.2 - Git skill owns worktree primitives and branch convention.
Checklist S1.3 - Hook owns realtime telemetry; reconstructor owns repair.
Scenario S2 - Data flow is acyclic and testable.
Checklist S2.1 - Hook can deterministically locate the correct `session.json`.
Checklist S2.2 - Hook can correlate `tool_use_id` to transcript telemetry.
Checklist S2.3 - Reconstructor can run without knowing parent manager state.
Scenario S3 - No hidden shared-state hub. (adversarial)
Checklist S3.1 - Multiple hook invocations do not corrupt shared `session.json`.
Checklist S3.2 - Atomic writes are distinguished from mutual exclusion.
Checklist S3.3 - Recovery path covers partial realtime writes.
Scenario S4 - Boring-by-default holds.
Checklist S4.1 - Bash+jq follows existing `session-start.sh` precedent.
Checklist S4.2 - New abstractions are minimal and named.
Checklist S4.3 - No CLI restoration is smuggled into the design.
Scenario S5 - Worktree-first does not create an untestable bootstrap sequence.
Checklist S5.1 - Existing git P2 can be invoked from Configuration without missing required inputs.
Checklist S5.2 - The design names which file owns the new row 5.5 procedure.
Stage 1 additions: S2 and S3 were expanded beyond the draft because the design depends on path resolution and concurrent writes, not just field extraction.

## Per-scenario per-check results
S1.1 - Yes. Draft lines 238 and 264 identify orchestration row 5.5 as the Configuration edit.
S1.2 - Yes. Draft lines 239-240 keep git P2 and write-path rule in `git/SKILL.md`.
S1.3 - Yes. Draft lines 249-253 split hook, reconstructor, settings, orchestration, and delegation edits.
S2.1 - No. Draft line 314 defines `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid-from-session_id}/session.json`, but hook stdin from `session-start.sh` precedent includes session id, transcript path, and cwd, not project name or date.
S2.2 - Partial. The empirical reference says `toolUseResult` has rich telemetry, but the shape shown does not include a top-level `tool_use_id`; correlation must be specified precisely.
S2.3 - Yes. Reconstructor takes a session-dir path arg in draft line 250, so it avoids hook resolver ambiguity.
S3.1 - No. Delegation skill lines 51 and 220 say evaluators run two in parallel; the hook design read-modify-writes one shared `session.json` per Task completion.
S3.2 - No. Sub-step D line 180 says temp file plus `mv`; that is atomic replacement, not a lock around read/merge/write.
S3.3 - Partial. Reconstructor repairs at Wrap-up, but the artifact promises robust partial sessions and realtime population before Wrap-up.
S4.1 - Yes. `session-start.sh` uses bash+jq strict mode; draft line 302 follows that precedent.
S4.2 - Yes. Hook and reconstructor are simple files, no new dependency stack.
S4.3 - Yes. Root `package.json` and `packages/` are absent in the current tree; the draft adapts CLI to shell script.
S5.1 - No. Covered by Project finding COD-PROJ-001.
S5.2 - Partial. The artifact names `orchestration/SKILL.md`, but not a reusable P2 wrapper contract.

## Typed findings
### COD-STRUCT-001 - Hook session-dir resolver is underspecified
- type: design_flaw
- domain: process
- confidence: 75
- severity: High
- evidence: `draft-iter1.md:314` says the hook resolves `$cwd/.gobbi/projects/<name>/sessions/{date}-{ssid-from-session_id}/session.json`; `.claude/hooks/session-start.sh:15-17` documents only `session_id`, `transcript_path`, and `cwd`; `session.template.json` stores `project` inside the session file the hook is trying to find.
- surfaced-by: codex
- disposition: open
Impact: the hook can have all Task telemetry and still fail before writing because it cannot deterministically construct the target session path.
False-positive check: not linter-catchable; this is a design-level missing input.

### COD-STRUCT-002 - Atomic writes do not prevent lost updates from parallel hooks
- type: design_flaw
- domain: process
- confidence: 75
- severity: High
- evidence: `.claude/skills/delegation/SKILL.md:51` and `:220` require two evaluator agents in parallel; `sub-step-d-design-iter1.md:165` upserts into shared `session.json.agents[]`; `sub-step-d-design-iter1.md:180` only says temp file plus `mv`, with no `flock` or retry-on-version-conflict step.
- surfaced-by: codex
- disposition: open
Impact: two Task completions can read the same old `agents[]`, each append a different row, and the last `mv` can erase the first row. The reconstructor helps only if it runs before interruption.
False-positive check: not speculative; the workflow explicitly parallelizes evaluation and assistant lookup work.

### COD-STRUCT-003 - Transcript correlation key needs an exact structural contract
- type: checklist_gap
- domain: observability
- confidence: 75
- severity: Medium
- evidence: `sub-step-d-design-iter1.md:238` says read transcript line by `tool_use_id`; `claude-code-transcript-tooluseresult-empirical.md` lists `toolUseResult` fields without a top-level `tool_use_id` and says correlation may require the preceding `tool_use` line.
- surfaced-by: codex
- disposition: open
Impact: Execution can write brittle jq that works on one transcript shape and misses entries on another.
False-positive check: not a demand for final jq in Ideation; it is a required implementation checklist item for a load-bearing correlation.

## Low-confidence appendix
Potential low-confidence issue: using bash+jq for complex JSON merging may become hard to maintain, but it follows local precedent and is not scored above 25.
Verdict: REVISE
