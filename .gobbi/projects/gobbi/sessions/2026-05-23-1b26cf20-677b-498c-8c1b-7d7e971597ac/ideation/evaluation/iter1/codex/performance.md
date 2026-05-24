## Artifact Summary + Memory reads
Artifact: Ideation iter1 draft for feature `session-foundations-bundle-b`.
What: T1 creates a worktree-first session architecture; T3 adds `session.json.agents[]` population through a PostToolUse hook plus reconstructor.
Why: Preparation/Planning writes have missed PR diffs, and prior sessions left `agents[]` effectively unpopulated.
How: T1 moves worktree creation to Configuration row 5.5 and commits session memory per iteration; T3 adds bash+jq scripts, settings hook registration, and structured prompt metadata headers.
Scope source: `ideation/rawdata/draft-iter1.md` lines 19-54.
Memory reads:
- `ideation/rawdata/draft-iter1.md` full file.
- `.claude/skills/ideation/evaluation.md` lines 125-163 for Performance seed scenarios.
- `.claude/skills/git/SKILL.md` lines 153-161 for current P2 worktree creation cost points.
- `.claude/hooks/session-start.sh` lines 27-79 for bash+jq hook precedent.
- `.claude/settings.json` lines 31-39 for current hook registration shape.
- `.claude/skills/orchestration/templates/session.template.json` lines 28-48 for `agents[]` shape.
- Project mistakes: `codex-eval-session-write-path-nested-in-worktree.md`, `codex-rescue-agent-fire-and-forget-without-result-capture.md`, `leader-iter2-verification-claim-without-evidence.md`.
- Project rules: `rules/stub-redirect-format.md`; no performance-specific override found.
Mechanical checks:
- `find .../ideation/staging/references -maxdepth 1 -type f | wc -l` returned `12`.
- `find .../ideation/staging/backlogs -type f | wc -l` returned `8`.
- `rg -n "PostToolUse" .claude/settings.json` returned no matches.

## Locked Frame (Stage 1)
Scenario P1: T3 hook runs after every Task spawn without adding unacceptable latency.
- Check P1.1: Artifact states expected Task spawn rate or order-of-magnitude session size.
- Check P1.2: Artifact names the dominant cost: transcript read, jq parse, JSON write, or file lock.
- Check P1.3: Artifact defines a latency budget or explicitly defers with reason.
- Check P1.4: Artifact names a measurement strategy for the hook path.

Scenario P2: T3 reconstructor can process large transcripts predictably.
- Check P2.1: Artifact states whether reconstructor is full-scan, incremental, or checkpointed.
- Check P2.2: Artifact bounds transcript size or line count assumptions.
- Check P2.3: Artifact defines idempotency verification for repeated runs.
- Check P2.4: Artifact avoids per-line external calls or nested scans.

Scenario P3: T1 worktree-first default has bounded cost for non-feature and multi-iteration sessions.
- Check P3.1: Artifact accounts for branch creation and install cost.
- Check P3.2: Artifact accounts for per-iteration session-memory commit frequency.
- Check P3.3: Artifact accounts for repo growth from committing full session directories.
- Check P3.4: Artifact preserves direct mode for high-cost or read-only cases.

Scenario P4: Cost and budget impact is explicit.
- Check P4.1: No paid API or external service cost is introduced.
- Check P4.2: Local storage growth is bounded or intentionally accepted.
- Check P4.3: The artifact states what signal would show cost is too high.

Scenario P5 (adversarial): A reasonable-looking hook becomes a hot path.
- Check P5.1: Hook work is constant or amortized per Task spawn.
- Check P5.2: Reconstructor recovery prevents the hook from doing expensive retries inline.
- Check P5.3: Missing transcript data does not trigger repeated full scans during Task return.
- Check P5.4: Failure path is non-blocking for the user's Task completion.

## Per-scenario per-check results
P1.1: No. The artifact gives `N Task spawns` and 90% field population, but no expected N, session length, or spawn-rate budget; see draft lines 52 and 120-123.
P1.2: Partial. It names transcript reads, jq extraction, and JSON writes; see draft lines 212-214 and 249.
P1.3: No. There is no latency budget for PostToolUse.
P1.4: Partial. It names a future fixture verifier, not a live per-hook timing check; see draft lines 305 and 337.
P2.1: Yes. Reconstructor walks transcript JSONL and upserts idempotently; see draft lines 213 and 250.
P2.2: No. Transcript size is not bounded.
P2.3: Yes. Idempotency double-run is listed; see draft lines 312 and 338.
P2.4: Yes, by design. The draft describes a local JSONL walk, not external calls.
P3.1: Partial. The counterfactual says root dependency-install cost is currently zero, but only for this repo; see draft line 100 and git P2 lines 157-160.
P3.2: Yes. Per-iteration commit cadence is explicit; see draft lines 285-290.
P3.3: No. The artifact does not estimate session directory growth.
P3.4: Yes. Direct mode is preserved as an opt-out; see draft lines 292-296.
P4.1: Yes. No new paid service is introduced.
P4.2: No. Local storage and git object growth from session commits are not bounded.
P4.3: No. No cost-runaway signal is named.
P5.1: No. The hook's per-spawn work is not bounded because transcript lookup strategy is not specified beyond "reads transcript line by `tool_use_id`".
P5.2: Yes. Reconstructor exists as repair path; see draft lines 133 and 213.
P5.3: No. Missing transcript data behavior defaults to reconstructor, but no inline retry bound is stated.
P5.4: Partial. The T3 failure scenario says strict guards and reconstructor recovery, but not an explicit "hook must not block Task return" implementation gate; see draft line 224.

## Typed findings
COD-PERF-001
- type: checklist_gap
- domain: performance
- confidence: 75
- severity: Medium
- evidence: `draft-iter1.md:212-214` says the hook reads transcript JSONL and upserts `agents[]`; `.claude/skills/ideation/evaluation.md:131-145` requires operation rate, dominant cost, scale limits, and measurement strategy.
- surfaced-by: codex
- disposition: open
- detail: The artifact does not bound PostToolUse hook latency or transcript scan cost. Planning can still proceed, but Execution needs a concrete budget such as "hook path must avoid full transcript scans and complete under X ms on a Y-line transcript".

COD-PERF-002
- type: checklist_gap
- domain: cost
- confidence: 75
- severity: Medium
- evidence: `draft-iter1.md:285-290` requires per-iteration session-memory commits; no section estimates committed session directory growth or a threshold for direct-mode fallback.
- surfaced-by: codex
- disposition: open
- detail: Worktree-first plus per-iteration commits improves survival, but the local storage and git-object cost is not bounded. This matters most for long sessions with large evaluation artifacts.

## Low-confidence appendix
- Low-confidence note: T1 install cost may be acceptable for this repository because the draft says root dependency-install cost is currently zero at `draft-iter1.md:100`. That does not cover future project shapes.
- Low-confidence note: T3 may be fast enough if the implementation indexes by `tool_use_id` from the newest transcript tail, but that algorithm is not stated in the ideation artifact.
- No Critical performance blocker found.
- No external paid-service cost found.
Verdict: REVISE
