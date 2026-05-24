## Stage 0 — Artifact Summary + Memory reads
Artifact: Ideation iter3 draft for `session-foundations-bundle-b`.
Structure lens: organization, decomposition, dependencies, implementability, and testability.
What: keep T1 and T3 structure from iter2 while correcting three support defects.
Why: iter2's structural flow was blocked mainly by the invalid branch prefix and unflagged resolver precondition.
How: use an allowed git type, preserve the hook/reconstructor decomposition, and document the active resolver fallback.
W/W/H gate: PASS.
Memory reads:
- shared Stage 0 reads from `project.md`
- `draft-iter3.md` lines 213-294 for scenarios/checklists
- `draft-iter3.md` lines 306-439 for design decisions and validation table
- `git/conventions.md` full file
- staged reference and backlog files named in the prompt
- all prior Structure files: iter1/claude, iter1/codex, iter2/claude, iter2/codex
- all adjacent prior Project/Risk files needed for inherited branch and resolver findings.

## Locked Frame (Stage 1)
Scenario S1: T1 row 5.5 flow is structurally executable.
- Check S1.1: Configuration row 5.5 has a valid branch name before invoking git P2.
- Check S1.2: row 5.5 still precedes session.json row 6 stamping.
- Check S1.3: direct mode remains a structural escape hatch.
Scenario S2 (adversarial): T3 resolver can find session.json from hook inputs even when preferred project.json is absent.
- Check S2.1: the absent file is explicitly handled.
- Check S2.2: single-project fallback is the active current path.
- Check S2.3: negative cases remain specified.
Scenario S3: Hook/reconstructor decomposition remains unchanged and testable.
- Check S3.1: hook owns realtime upsert.
- Check S3.2: reconstructor owns repair/replay.
- Check S3.3: both share `flock -x` and correlation-key contracts from iter2.
Scenario S4: Inherited structural residuals have dispositions.
- Check S4.1: COD-STRUCT-001 resolver underspec is still addressed after Fix C.
- Check S4.2: COD-STRUCT-002 lost-update race remains addressed by D-3-5.
- Check S4.3: COD-STRUCT-003 correlation key remains addressed by D-3-6.
- Check S4.4: Claude sidecar-lock refinement remains non-blocking.

## Per-scenario per-check results
S1.1: YES. The branch form passes the two-step validator; evidence from shell test and `git/conventions.md:22,27-29`.
S1.2: YES. `draft-iter3.md:308-310` preserves row 5.5 between state.json init and row 6 stamp.
S1.3: YES. `draft-iter3.md:336-340` preserves direct mode as opt-out.
S2.1: YES. `draft-iter3.md:375-378` explicitly says `.gobbi/project.json` does not exist and step (i) is dormant.
S2.2: YES. `draft-iter3.md:378` says step (ii) is the fallback and currently the only working path.
S2.3: YES. `draft-iter3.md:378-381` retains zero/multiple project and zero/multiple session-dir nonzero exits.
S3.1: YES. `draft-iter3.md:287` scopes `post-tool-use-agents.sh` to realtime upsert.
S3.2: YES. `draft-iter3.md:288` scopes `reconstruct-agents.sh` to verify-and-fix replay.
S3.3: YES. `draft-iter3.md:401-418` preserves D-3-5 and D-3-6.
S4.1: ADDRESSED. Fix C improves resolver honesty without removing the working fallback.
S4.2: ADDRESSED. D-3-5 still serializes hook and reconstructor before read-modify-write.
S4.3: ADDRESSED. D-3-6 still names the two exact jq lookup paths.
S4.4: OPEN / NON-BLOCKING. Iter2 Claude's sidecar-lock refinement remains a reasonable Execution-level hardening idea, but it was not part of the three authorized iter3 fixes and is Medium at most.

## Typed findings
### COD-STRUCT-001 — Hook session-dir resolver remains resolved with clearer precondition
- type: design_flaw
- domain: process
- disposition: addressed
- confidence: 100
- severity: High
- surfaced-by: codex
- inherited-from: iter1/codex/structure.md COD-STRUCT-001; iter2/codex/structure.md COD-STRUCT-001
- evidence: `draft-iter3.md:371-386` specifies project lookup, dormant preferred path, active fallback, date lookup, resolved path, and validation fixtures.

### COD-STRUCT-004 — Invalid branch prefix structural blocker addressed
- type: design_flaw
- domain: regression
- disposition: addressed
- confidence: 100
- severity: High
- surfaced-by: codex
- inherited-from: iter2/codex/structure.md COD-STRUCT-004
- evidence: `draft-iter3.md:308`, `:274`, and `:424` all use `chore/session-...`; local validator evidence shows the concrete branch passes.

### CLAUDE-STRUCT-S1 — Sidecar lock refinement remains outside iter3 scope
- type: design_flaw
- domain: process
- disposition: open
- confidence: 50
- severity: Medium
- surfaced-by: codex
- inherited-from: iter2/claude/structure.md S1 and iter2/claude/risk.md R4
- evidence: `draft-iter3.md:401-406` still locks `session.json` itself, not `session.json.lock`. Iter2 Claude marked this as a refinement because the primary lost-update race is closed; no Fix A/B/C work reopened D-3-5.

## Low-confidence appendix
Low-confidence note: `flock(1)` host availability is assumed by the design. This remains an Execution verification item rather than an Ideation blocker.
No additional structural issues exceeded 25 confidence.

Verdict: PASS
