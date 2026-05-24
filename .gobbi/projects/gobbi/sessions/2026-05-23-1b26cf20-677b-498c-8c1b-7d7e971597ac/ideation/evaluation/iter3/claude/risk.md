# Risk — iter3 Claude

## Stage 0 — Target read

Risk lens: do the iter3 fixes introduce new failure modes? Are the iter1+iter2 risk findings now closed? Karpathy mode-3 adversarial check (orthogonal-edit regressions like iter2's).

## Stage 1 — Inheritance

| Finding | Source | iter3 disposition |
|---|---|---|
| iter1 R1 (lost-update race) | claude | addressed iter2 D-3-5 flock |
| iter1 R2 (partial-promotion rollback) | claude | addressed iter2 T1-I-T1.j |
| iter1 R3 (Goodhart factor-when-demanded) | claude | not addressed iter2; not in iter3 scope |
| iter1 R4 (abort-mid-commit) | claude | not addressed iter2; not in iter3 scope |
| iter1 COD-RISK-002 (resolver underspec) | codex | addressed iter2 D-3-3-resolver |
| iter1 COD-RISK-003 (privacy) | codex | deferred iter2 F-9 |
| iter1 COD-RISK-004 (cross-layer drift) | codex | partially addressed iter2 |
| iter2 R5 (F-4 regex defeat) | iter2 claude+codex | **addressed iter3 Fix A** |
| iter2 R4 (flock+mv inode replacement) | iter2 claude | open Medium 50; not in iter3 scope |

## Stage 2 — Risk walk

### R-A — Fix A risk closure

iter2 R5 (Risk-perspective mirror of P1/C1): F-4 branch name violates regex → row 5.5 git P2 worktree creation fails → T1 first success criterion fails → bootstrap loop blocked.

iter3 Fix A user-locks `chore/session-{date}-{ssid-short}`. This evaluator independently smoke-tested:
- `chore/session-2026-05-23-1b26cf20` against `git/conventions.md:22` regex → **MATCH**.
- Against T1-I-T1.h smoke-test regex `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` → **MATCH**.
- Slug length 27 chars (within 3-50 budget).

R5 risk closed.

### R-B — Adversarial mode-3 check (Karpathy orthogonal-edit)

iter2 was a mode-3 failure (F-4 fix introduced regex violation). iter3 must avoid the same pattern.

**Sub-check 1 — Did Fix A break any other invariant?**

Re-read of the diff around D-1, T1-I-T1.a, T1-I-T1.h, G-1, E-2, F-4, validation table — the only change is the branch-prefix token. Other claims about row 5.5 (idempotency, direct-mode opt-out, AskUserQuestion on failure) untouched. **No mode-3 in Fix A.**

**Sub-check 2 — Did Fix B's verbatim quote contradict any other design decision?**

The verbatim quote says `PostToolUseFailure | No | Shows stderr to Claude (tool already failed)`. The "No" is in the "Can block?" column — meaning PostToolUseFailure is non-blocking. iter2 D-3-3 had implicit assumption of non-blocking behavior ("hook does not block Task return"). The verbatim quote CONFIRMS this — no contradiction.

Sub-check: does "single script handles both" in T3-I-T3.c contradict anything in the official doc? The doc describes per-event registration; nothing forbids using the same script as the command target for two different event matchers. The hook script reads `hook_event_name` from stdin and branches. **No contradiction. No mode-3.**

**Sub-check 3 — Did Fix C's backlog file introduce new Execution dependencies?**

Backlog file (line 26-37) explicitly says: "Either path is valid; the resolver remains correct in both cases." Path 1 (in-Execution write) is optional ("the executor may fold this into T3-I-T3.c bootstrap"). Path 2 (defer) is also explicitly valid.

But subtler check: does the dormant-precondition note force the executor to add an `if file exists` branch in the hook script? Re-read D-3-3-resolver: step (i) reads the file IF it exists; step (ii) is the fallback when the file does not exist (or is unparseable). The resolver algorithm ALREADY had the "if file exists" branch in iter2; iter3 only annotates that step (i) is currently dormant. **No new Execution requirement. No mode-3.**

### R-C — F-4 scenario (partial promotion failure) under new branch prefix

F-4 scenario (line 235) now references the `chore/session-{date}-{ssid-short}` branch. The rollback semantics (`git -C "$worktreePath" rm` + AskUserQuestion) are preserved. The failure modes (gitignore conflict, no staged changes, signing failure) are independent of branch-name choice. **F-4 scenario integrity preserved.**

### R-D — E-3 abort-mid-session risk

Inherited iter1 R4 (abort-mid-commit): not addressed iter2 or iter3. Per-iteration commit cadence (D-4) survives mid-session abort because each iteration's MEMORIZATION step commits before exit; partial-iteration aborts lose only the current iteration's deltas. iter3 did not change D-4. Inherited risk remains at iter2 disposition.

### R-E — Concurrency risk (R1)

D-3-5 flock-x serialization preserved in iter3 (no diff in D-3-5). The lost-update window closure remains valid. iter2 sub-finding R4 (inode-replacement-with-rename) — preserved as open Medium 50, not in iter3 scope. **Risk profile preserved.**

### R-F — Fix B WebFetch unverified (adversarial)

The Fix B verbatim quote was not independently re-verified by this evaluator (no WebFetch in sandbox). If the leader's WebFetch retrieval was hallucinated, the consequences are:
- D-3-3 dual-event registration lacks official grounding (downgrades to community-attested + iter2-claim).
- T3-I-T3.c reference to "officially supported" becomes a load-bearing untruth.

Counterweight: the leader preserved the verbatim quote in the staged reference file. If the executor authoring `.claude/settings.json` finds at runtime that `PostToolUseFailure` is NOT a valid event name, the failure is loud and immediate (the hook registration silently no-ops or Claude Code errors at startup). The reconstructor still works as the recovery mechanism — failed-spawn telemetry would degrade to "missed in agents[] until reconstructor runs" rather than total data loss.

**Risk profile: assumption_risk Medium 50** — acknowledged per brief escape-hatch; not a blocker.

### R-G — Fix C dormant-precondition adversarial

What if a future repo has TWO subdirectories under `.gobbi/projects/`? D-3-3-resolver step (ii) requires exactly one — if zero or multiple, "exit non-zero with stderr `'session-dir resolver: cannot disambiguate project name (n=<count>)'` (reconstructor recovers)." The dormant-precondition note (Fix C) explicitly warns: "At a future session when the project gains a second project under `.gobbi/projects/` (which would break step (ii)'s 'exactly one directory' guard and force step (i) to be created)" — line 41 of backlog file.

**Risk surfaced and documented. No mitigation gap.**

## Stage 3 — Findings

### F-RISK-iter3-1 — Fix A closes iter2 Critical R5 (POSITIVE)
- type: `general`
- domain: `process`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational — addresses prior Critical)
- inherited-from: `iter2/claude/risk-R5`, `iter2/codex/risk-COD-OVERALL-001` (mirror)
- evidence: Branch-prefix regex compliance independently smoke-tested by this evaluator.
- why it matters: row 5.5 git P2 worktree creation no longer fails on first invocation.

### F-RISK-iter3-2 — Fix B network-policy unverified WebFetch (ASSUMPTION_RISK)
- type: `assumption_risk`
- domain: `verification`
- disposition: `open`
- confidence: 50
- severity: Medium
- evidence: Bash sandbox does not provide WebFetch; leader's WebFetch claim cannot be re-verified by this evaluator. Verbatim quotes ARE preserved.
- why it matters: if hallucinated, D-3-3 dual-event registration lacks official grounding. Failure mode is loud (registration no-ops at runtime); reconstructor recovers.
- suggested direction: defer empirical re-verification to Execution-time when the executor authors `.claude/settings.json`. NOT a blocker for Ideation exit per escape-hatch.

### F-RISK-iter3-3 — Mode-3 adversarial check clean (POSITIVE)
- type: `general`
- domain: `process`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational)
- evidence: Three sub-checks (Fix A invariants, Fix B contradiction, Fix C Execution dependencies) all pass. iter3 did not orthogonal-edit any neighboring decision.
- why it matters: avoids iter2's failure pattern.

### F-RISK-iter3-4 — Inherited risks deferred (carry-forward)
- type: `general`
- domain: `process`
- disposition: `deferred`
- confidence: 75
- severity: Low/Medium
- inherited-from: iter1 R3 (Goodhart), R4 (abort-mid-commit), COD-RISK-003 (privacy), COD-RISK-004 (cross-layer drift); iter2 R4 (flock+mv inode)
- evidence: iter3 scope excluded these explicitly.
- suggested direction: surface at Planning for risk-budget conversation.

## Preserve list (carry to Planning)

1. The mode-3 adversarial sub-check pattern (token-change locality + neighboring-claim integrity + contradiction check) — model for surgical revisions.
2. The Fix C explicit "future second-project breaks step (ii)" warning in the backlog file — exemplary risk surfacing.
3. D-3-5 flock-x serialization (preserved from iter2) — critical for concurrent evaluator spawns.
4. D-3 partial-promotion rollback semantics — preserved.

## Verdict

**PASS** — iter2 Critical R5 closed; mode-3 adversarial check clean; only Medium 50 assumption_risk for Fix B WebFetch (acknowledged per escape-hatch). No new High risk findings; inherited deferred items remain deferred per scope.
