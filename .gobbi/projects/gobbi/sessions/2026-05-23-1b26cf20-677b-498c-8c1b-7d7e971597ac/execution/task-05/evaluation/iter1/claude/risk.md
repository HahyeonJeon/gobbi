# Risk — T05 iter1 (commit 9f5229d)

## Verdict: PASS

## Risk inventory

### R1 — Cadence rule prescribes commits that may fail mid-loop

The cadence rule says "the manager creates a session-memory commit." It does not specify rollback semantics if the commit fails (e.g., pre-commit hook rejects, file system error, repo lock). Per the design § Scope, "rollback semantics for commit failure (T1-I-T1.j)" is explicitly out of scope. The design acknowledges this gap and routes it to T1.j. T05 is consistent with this scope. **Risk level: Low** (design-acknowledged out-of-scope; not a flaw in T05's deliverable).

### R2 — Trailer URI schema drift

The 5 inserts introduce a new `gobbi://session/{session-id}/loop/{loop}/iter{n}` trailer URI shape, which is not yet formalized in `git/conventions.md`. Future agents may copy this shape inconsistently. **Risk level: Low**; mitigation suggestion (not a fix prescription): a future Planning task could update conventions.md to enumerate the per-loop variant, or T05 itself could optionally add an entry. Not blocking for this iter; surfaceable as a backlog candidate. Confidence: 75, Severity: Low.

### R3 — Direct-mode users diverge from worktree-pr users on audit trail

By design, direct-mode skips the cadence — direct-mode sessions will have a less granular git audit trail (one big commit at the end, no per-iter memory commits). This is the *intended* trade-off (escape hatch), and the opt-out sentence is explicit. **Risk level: Low**; not a finding.

### R4 — Documentation-only commit; runtime behavior unchanged

This commit only adds prose to phase docs. It does NOT add any code that auto-fires the commit. The manager must read and follow the rule manually. Risk: a future manager session might forget to read the rule. Mitigation belongs to manager-side bootstrap / session-load discipline, not to this artifact. **Risk level: Low**; not a finding on T05.

### R5 — Commit-subject grep is the only enforcement

T1-I-T1.h smoke test (per design § Open issues) is the enforcement gate; T05 does not include the smoke test. Out of scope for T05 per plan. **Risk level: Low**; not a finding.

## Adversarial scenarios

- **A1 — Manager creates 5+ commits per loop iter, polluting `git log`**: bounded by maxIterations (3 per loop, 1 for wrap-up). For a 5-task session: ~25 session-memory commits. Squashed at PR merge → 1 commit. Acceptable.
- **A2 — Pre-commit hook on the worktree branch rejects the commit (e.g., conventional-commit lint complains about subject length)**: the subject `chore(session): record execution-task-05 iter1 memory` is ~56 chars — within most 72-char limits. Subject pattern starts with conventional-commit prefix `chore(session):`. Should pass. No finding.
- **A3 — `worktreePath` is `null` but mode isn't `direct`**: the rule says "skipped when direct"; it doesn't handle the orphaned-worktree case explicitly. Row 5.5 handles orphaned worktree with AskUserQuestion + recover; T05 cadence rule downstream of recovery. Acceptable.
- **A4 — Heredoc EOF delimiter conflict**: single-quoted EOF prevents shell expansion of `$session-id`, `$task-id`, `$n` inside the heredoc body — correct. If a session-id ever contains `EOF` as a substring, the heredoc would break — vanishingly unlikely (session-ids are UUIDs).

## Findings

None blocking.

## Preserve

- Direct-mode opt-out boundary explicit; no silent failure mode for non-worktree-pr sessions.
- Heredoc + verify-after-commit pattern guards against silent trailer drops (the T03 iter2 lesson).

## Verdict: PASS
