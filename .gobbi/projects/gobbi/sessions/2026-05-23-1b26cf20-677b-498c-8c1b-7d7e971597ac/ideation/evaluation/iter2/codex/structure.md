## Artifact Summary + Memory reads
Shared Stage 0 summary: see `project.md`. This Structure pass evaluates the organization, decomposition, dependencies, and testability of the iter2 T1/T3 design.

Memory reads:
- primary artifact `ideation/rawdata/draft-iter2.md` in full
- all iter1 Structure files from Codex and Claude
- `.agents/skills/evaluation/SKILL.md`
- `.agents/skills/ideation/evaluation.md`
- project mistakes, especially verification-claim and write-path mistakes
- `.claude/hooks/session-start.sh`
- empirical transcript lines 164-165 from `~/.claude/projects/-playinganalytics-git-gobbi/7ea62d36-e826-4ce6-9e90-9e948007b068.jsonl`

## Locked Frame (Stage 1)
Scenario S1: Hook/reconstructor shared-state decomposition is safe.
- Check S1.1: Hook and reconstructor both acquire the same exclusive lock before read-modify-write.
- Check S1.2: Lock acquisition happens before the read, not only before write.
- Check S1.3: The lock object is the same file for both scripts.
- Check S1.4: Lock release behavior is documented.

Scenario S2: Hook session-dir resolver is implementable from available inputs.
- Check S2.1: Project name derivation is specified.
- Check S2.2: Date-prefixed session directory derivation is specified.
- Check S2.3: Missing `project.json` is handled.

Scenario S3: Transcript correlation key is exact and matches the empirical JSONL shape.
- Check S3.1: `tool_use` line can be found by `.message.content[]?.id == $tool_use_id`.
- Check S3.2: `tool_result` line can be found by top-level `.toolUseResult` and `.message.content[]?.tool_use_id == $tool_use_id`.
- Check S3.3: Result-side telemetry is not confused with input-side metadata.

Scenario S4: Branch-name dependency from Project does not poison Structure.
- Check S4.1: Configuration row 5.5 can call git P2 with valid inputs.
- Check S4.2: Structural sequencing remains sound apart from the branch validator issue.

Coverage:
- Dependency supply chain: no new runtime dependency beyond existing Bash/jq/flock shell stack; `not-applicable` for external package supply chain.
- Observability: transcript correlation and resolver diagnostics are included in this Structure frame.

## Per-scenario per-check results
S1.1: PASS. `draft-iter2.md:276-277` says both hook and reconstructor acquire `flock -x <session.json>`, and D-3-5 at `draft-iter2.md:388` specifies the primitive for every read-modify-write cycle.

S1.2: PASS. `draft-iter2.md:276-277` explicitly says `BEFORE read` for both scripts.

S1.3: PASS. `draft-iter2.md:282` specifies the lock file is `session.json` itself and the script opens it with `exec {fd}>>"$session_json"; flock -x "$fd"`.

S1.4: PASS. `draft-iter2.md:282` states the lock is released automatically when the script process exits.

S2.1: PASS. `draft-iter2.md:359-370` defines project-name lookup precedence: read `$cwd/.gobbi/project.json` when present, else enumerate `$cwd/.gobbi/projects/` and require exactly one directory.

S2.2: PASS. `draft-iter2.md:366-367` scans `$cwd/.gobbi/projects/<project-name>/sessions/` for a directory ending in `-<session_id>`.

S2.3: PASS. Empirical check `ls /playinganalytics/git/gobbi/.gobbi/project.json` failed, while `ls /playinganalytics/git/gobbi/.gobbi/projects/` returned only `gobbi`. The iter2 fallback path covers the current repository.

S3.1: PASS. Empirical `jq` on transcript line 164 matched `{"matched":"tool_use","id":"toolu_0194Ri52Lv1m6JpxT1nXBNbf"}` using the D-3-6 path.

S3.2: PASS. Empirical `jq` on lines 164-165 matched `{"matched":"tool_result","tool_use_id":"toolu_0194Ri52Lv1m6JpxT1nXBNbf","agentId":"a31f9da77d5cf7313"}` using the D-3-6 path. Line 165 has top-level `toolUseResult`.

S3.3: PASS. D-3-4 at `draft-iter2.md:375-384` clearly distinguishes input-side `tool_input.*` metadata from result-side `toolUseResult.*` telemetry.

S4.1: FAIL. This is the cross-perspective blocker from Project: `session/{date}-{ssid-short}` fails the documented branch validator.

S4.2: PASS. Apart from the invalid branch prefix, the structural sequencing is coherent: state initializes before row 5.5, row 5.5 stamps branch/worktree path, row 6 consumes that state, T3 resolver handles worktree-first and direct paths.

## Typed findings
### COD-STRUCT-001 — Hook session-dir resolver resolved
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/codex/structure-COD-STRUCT-001
- evidence: `draft-iter2.md:359-373` specifies project lookup, date-prefix lookup, resolved path, error behavior, and project.json-absent fallback. Empirical checks confirmed `.gobbi/project.json` is absent and `.gobbi/projects/` has exactly one project directory, `gobbi`, so the fallback applies to the current repo.

### COD-STRUCT-002 — Lost-update race resolved by shared exclusive lock
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- inherited-from: iter1/codex/structure-COD-STRUCT-002 and iter1/claude/risk-R1
- evidence: `draft-iter2.md:276-277` requires `flock -x` before read in both hook and reconstructor; `draft-iter2.md:282` says both lock `session.json` itself; `draft-iter2.md:388-393` explains that hook B blocks until hook A completes the read-modify-write. This closes the hook A reads / hook B reads / A writes / B clobbers A race because B cannot read until A releases the exclusive lock.

### COD-STRUCT-003 — Transcript correlation key resolved
- type: checklist_gap
- domain: observability
- disposition: addressed
- confidence: 100
- severity: Medium
- inherited-from: iter1/codex/structure-COD-STRUCT-003
- evidence: D-3-6 at `draft-iter2.md:395-406` gives exact `jq` paths. Empirical transcript checks confirmed `.message.content[]?.id` exists on the `tool_use` line, top-level `.toolUseResult` exists on the `tool_result` line, and `.message.content[]?.tool_use_id` is the correct result correlation path.

### COD-STRUCT-004 — Structural flow still blocked by invalid branch prefix
- type: design_flaw
- domain: regression
- disposition: open
- confidence: 100
- severity: High
- surfaced-by: codex
- evidence: Structure can now describe row 5.5 sequencing, but the input branch name selected by D-1 fails `/playinganalytics/git/gobbi/.claude/skills/git/conventions.md` before `git worktree add -b` can run. See `project.md` COD-PROJ-001 for the validator evidence.
- impact: The design's decomposition is otherwise sound, but the first git call remains non-executable.

### CLAUDE-S1 — Shared inline jq drift risk remains accepted but non-blocking
- type: assumption_risk
- domain: process
- disposition: open
- confidence: 50
- severity: Medium
- inherited-from: iter1/claude/structure-S1
- evidence: Iter2 adds D-3-6 exact jq paths and requires fixture verification, but it does not factor shared extraction into a sourced helper. The risk is lower because exact paths are now specified, but drift prevention still depends on tests rather than a shared helper.

## Low-confidence appendix
Low-confidence note: `flock(1)` availability is assumed by the draft as part of the existing Bash stack. This is plausible for the supported Linux/macOS host model but should be verified during Execution.

Verdict: REVISE
