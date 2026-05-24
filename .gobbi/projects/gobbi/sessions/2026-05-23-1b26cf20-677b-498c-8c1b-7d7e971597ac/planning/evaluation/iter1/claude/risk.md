---
phase: planning
iter: 1
system: claude
perspective: risk
verdict: REVISE
---

# Risk — Planning iter1 evaluation (Claude)

## Artifact Summary + Memory reads

Same as project.md.

## Locked Frame (Stage 1)

From `skills/planning/evaluation.md` § Risk:

S-R1 — Mid-plan task failure has clear rollback boundary
S-R2 — Shared-infrastructure tasks isolated
S-R3 — Public-interface tasks isolated + consumer migration explicit
S-R4 — Plan ordering robust to interruption (pause-after-N is coherent intermediate)
S-R5 — High-blast tasks gated
S-R6 — Plan total file-touch matches Ideation scope size
S-R7 (adversarial) — No silent scope widening via output addition
S-R8 (Coverage Matrix: cost) — paid-API exposure named (N/A here)
S-R9 (Coverage Matrix: privacy) — data-flow continuity
S-R10 (Coverage Matrix: observability) — mid-execution observability
S-R11 (Coverage Matrix: supply-chain) — new deps flagged

## Per-scenario per-check results

| Scenario | Result | Notes |
|---|---|---|
| S-R1 | PARTIAL | Each task is ~1 file edit → atomic commit feasible per task. But LOCK #2 (Tasks 07+08 shared executor, one delegation) blurs the commit boundary: 1 commit covering 2 files OR 2 sequential commits — plan doesn't specify. |
| S-R2 | PASS | `.claude/settings.json` (Task 09) is shared infra but isolated to one task; sequenced after Task 07 produces hook script artifact. |
| S-R3 | PASS-with-note | "Public interface" = the hook stdin contract + AI-Provenance-Record trailer + commit subject. All are documented in tasks that consume them. No silent consumer-migration. |
| S-R4 | PARTIAL | Pause-after-T1-wave (after Task 05 or Task 06) leaves the workspace in a coherent state (T1 docs written, no T3 hooks yet — bootstrap continues to use manual append per existing orchestration row 6 text until Task 10 replaces it). Pause-mid-Task-07+08 (LOCK #2 single delegation) leaves intermediate state ambiguous — see F-RISK-1. |
| S-R5 | PASS | No migrations, no API changes, no dep upgrades. |
| S-R6 | PASS | 18 anchors → 10 tasks → ~13 unique files touched (5 phase docs + 5 SKILL.md + 2 scripts + 1 settings.json). Matches Ideation scope. |
| S-R7 | PASS | All `outputs:` fields are monotonic — no later task widens an earlier task's output. |
| S-R8 | N/A | No paid-API exposure. |
| S-R9 | PASS-with-note | session.json contains `transcriptPath` (tilde-substituted per existing orchestration spec) which is the only sensitive datum. Hook script (Task 07) reads it but doesn't write it elsewhere. |
| S-R10 | PARTIAL | Hook script orphan-reports; no centralized error sink. See F-RISK-2. |
| S-R11 | PASS | No new package deps; `jq` + `flock` + `bash` are existing tooling. |

## Typed findings

### F-RISK-1 — LOCK #2 single-delegation for Tasks 07+08 leaves rollback boundary ambiguous

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 75
- Severity: Medium
- Evidence: Lines 458-462 of draft: Tasks 07+08 share one executor delegation back-to-back. Neither task spells out whether this is 1 commit (both scripts in one chore commit) OR 2 commits (one per task, atomic per task). `planning/SKILL.md:187`: medium-granularity = "one executor spawn, one meaningful commit". 2 Large tasks in 1 spawn = ambiguous on commit cardinality.
- Why it matters: if executor crashes mid-Task-08 with Task 07's hook script committed, the rollback boundary is unclear: is the hook script kept (Task 07 done) and Task 08 retried fresh, OR is the partial work git-resetted? `planning/evaluation.md` § Risk S-R1: *"Each task can be reverted independently (atomic commit per task, or task rollback: field with concrete steps); A failure between tasks leaves the project in a coherent state."*
- Suggested direction: add to LOCK #2's encoding: "commit per task at the end of each task's `verifies:` pass; Task 07 commits first, Task 08 second; if Task 08 fails mid-stream, Task 07 commit stays on the branch and Task 08 retries fresh." Or: re-litigate the lock to consider splitting into 2 delegations.

### F-RISK-2 — Hook script PostToolUseFailure does not document its own failure-budget

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 50
- Severity: Medium
- Evidence: Task 07 brief covers PostToolUse + PostToolUseFailure invocation, two-tier extraction, upsert. But what happens if the hook itself fails (bash crash, jq syntax error, flock deadlock, disk-full)? Per official Claude Code hooks docs (T3-E-5 cited in Ideation), PostToolUseFailure exit-code-behavior is "shows stderr to Claude (tool already failed)". Task 07 doesn't surface this — Claude will print the hook's stderr, which is operator-visible noise but not a session-killer. The Plan doesn't spell out the worst-case noise budget.
- Why it matters: a noisy hook stderr in Claude's transcript may interfere with the next Task delegation prompt. The reconstructor (Task 08) is the recovery mechanism but only runs when invoked manually. There's no "hook self-disabled after N failures" safety. Mid-execution silent telemetry hole.
- Suggested direction: Task 07 brief should say "on internal failure: emit single-line stderr `[gobbi-hook] post-tool-use-agents.sh: <reason>` and `exit 0` (do not propagate hook failure to Claude; rely on reconstructor recovery)." Codifies expected operator experience.

### F-RISK-3 — Session-write path semantics during T1 wave bridge period

- Type: `assumption_risk`
- Domain: `process`
- Disposition: `open`
- Confidence: 50
- Severity: Low
- Evidence: § Sub-step A line 70 + the LOCK #1 prose say "hook script (Task 07) still tolerates pre-T1 `cwd` semantics via D-3-3-resolver step (ii) directory scan, but strict ordering avoids any interleaving ambiguity." Meaning: the Plan acknowledges that BEFORE T1 lands, session writes go to main tree (D-3-3 step ii directory scan resolves to main-tree session dir). AFTER T1 lands, session writes go to worktree path. The Plan doesn't spell out what happens to in-flight session.json being mutated by Task 09 (settings registration → hook starts firing) WHILE the T1 wave's per-iter commits cadence is changing the session-dir resolution rule.
- Why it matters: low confidence because LOCK #1 strict-wave ordering protects against this. But if F-STRUCT-1 / F-CONS-2 (graph doesn't enforce 06 before 07) trigger, the bridge period exposes hook writes to a moving cwd target.
- Suggested direction: noted in F-STRUCT-1 already; ensuring 06 → 07 edge closes this too.

## Low-confidence appendix

- F-RISK-3 (Confidence 50): bridge-period race during T1-wave; subsumed by F-STRUCT-1 fix.

## Verdict

**REVISE** — two Medium-severity items (rollback boundary ambiguity from LOCK #2; hook self-failure budget). Single-edge fix on F-STRUCT-1 closes one Low.
