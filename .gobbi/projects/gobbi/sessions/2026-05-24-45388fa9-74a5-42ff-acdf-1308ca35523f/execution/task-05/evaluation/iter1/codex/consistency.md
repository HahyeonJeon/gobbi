# Consistency

## Finding CONS-001

Type: design_flaw
Severity: High
Confidence: 100
Evidence: `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md:45` says row 5.5 creates the worktree and stamps `session.json.git.worktreePath`; `:84`, `:91`, and `:112` repeat row-5.5/P2/stamping claims. The actual Step 1 table has row 5 create the worktree and hold the path in-turn, row 5.5 initialize `state.json`, and row 6 stamp `session.json.git.worktreePath` (`.claude/skills/orchestration/SKILL.md:102`, `:103`, `:104`). The direct-mode and smoke-test prose also name row 5, not row 5.5 (`.claude/skills/orchestration/SKILL.md:109`, `:120`, `:134`). `git/SKILL.md` still contains stale row-5.5 wording at `.claude/skills/git/SKILL.md:155`, which conflicts with orchestration.
Why-it-matters: This doc is intended to be the durable single-reference explanation for the worktree lifecycle. If it teaches future readers that row 5.5 is the P2/worktree row and that `session.json` fields are stamped before row 6, they will inspect or patch the wrong orchestration row and may reintroduce the exact state-before-worktree ordering bug CL-4 is meant to memorialize.
Suggested-direction: Update the design doc to state: row 5 invokes P2 and produces the in-turn worktree path; row 5.5 initializes `state.json` using that in-turn path as write root; row 6 initializes `session.json` and stamps `git.branch`/`git.worktreePath`. Also note, or separately backlog, that `git/SKILL.md` and workflow docs still have stale row-5.5 references outside this task's 2-file scope.

## Finding CONS-002

Type: design_flaw
Severity: Medium
Confidence: 100
Evidence: The doc says `git worktree remove` discards uncommitted state at `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md:66` and repeats that rationale at `:148`. The git skill says `git worktree remove --force` is the forbidden operation that discards uncommitted changes (`.claude/skills/git/SKILL.md:121`), P5 requires no uncommitted changes before merge (`:190`), and P5 says to check clean status before standard `git worktree remove` and never force-remove without explicit approval (`:200`).
Why-it-matters: The doc overstates the behavior of the safe P5 path. A future reader could infer that standard cleanup silently discards dirty state, when the actual contract is that dirty state blocks cleanup unless a forbidden force path is explicitly approved.
Suggested-direction: Replace the claim with the precise P5 rule: per-iter commits protect session memory before cleanup/abort paths; standard P5 removal requires a clean worktree, while only forced removal discards uncommitted work.

## Finding CONS-003

Type: assumption_risk
Severity: Medium
Confidence: 100
Evidence: The Problem section says the `codex-eval-session-write-path-nested-in-worktree.md` failure put "all writes inside the worktree, including transcript paths" at `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md:30`. That mistake record describes session-memory staging files written to a worktree-nested `sessions/...` path, not transcript paths (`.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md:16`, `:21`, `:27`). The current critical rule separately says transcript paths live under `~/.claude/projects/...` and are outside both trees (`.claude/skills/git/SKILL.md:33`).
Why-it-matters: The historical problem statement invents a transcript-path failure not supported by the cited mistake. That blurs the boundary between session-memory writes, which are worktree-rooted when `worktreePath` is set, and transcript paths, which are never redirected.
Suggested-direction: Remove "including transcript paths" from the historical failure claim, or rewrite it as a separate invariant: transcript paths are outside both trees and were added to the rule to prevent future over-redirection.

## Finding CONS-004

Type: design_flaw
Severity: Low
Confidence: 100
Evidence: The doc gives the per-iteration session-memory commit subject as `chore(session): record {loop} iter{n} memory` at `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md:62`. The Execution workflow uses a task-qualified subject: `chore(session): record execution-{task-id} iter{n} memory` (`.gobbi/projects/gobbi/skills/orchestration/workflow/execution.md:68`, `:71`).
Why-it-matters: A future reader copying the generic subject for Execution would lose task identity in session-memory commits. This is lower severity because the Validation section's glob-like cross-check at `.gobbi/projects/gobbi/design/session-lifecycle-worktree-boundaries.md:117` still broadly catches commit presence.
Suggested-direction: Qualify the sentence: non-Execution loops use `record {loop} iter{n}`; Execution uses `record execution-{task-id} iter{n}`.
