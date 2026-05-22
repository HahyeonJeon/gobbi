# Planning iter3 — Risk perspective (Claude)

## Stage 0 — Artifact summary

Risk was iter2's #1 REVISE caller (F-CL2-R-03 Medium/95 tag-form drift = sonnet hang on $EDITOR; F-CL2-R-01 Medium/85 §5a precheck gap). iter3 must fully close both EXECUTION-blocking risks.

## Stage 1 — Locked frame

- R-S1 Can a sonnet executor running headless hang on the tag command?
- R-S2 Can the manager auto-`--force` worktree remove on dirty state?
- R-S3 Is the rollback story (pre-reset-2026-05-21 tag covers develop tip only) still documented?
- R-S4 Are recovery paths (NEEDS_CONTEXT for E.2 + CI timeout + §5a + §9) chained correctly?
- R-S5 Any NEW risk introduced by iter3's 4 edits?

## Stage 2

### R-S1 — Headless tag hang risk
- Line 462 imperative is `git tag pre-reset-2026-05-21 487fc35` — lightweight, no `-a`, no `-m`. Lightweight tag creates without $EDITOR. Per `git-tag(1)`: only `-a/-s/-u` triggers $EDITOR if `-m` is absent.
- The risk is fully closed.
- Verdict: addressed (Conf 100).

### R-S2 — Auto-force on dirty worktree
- §5a precheck: `git status --porcelain` → empty required. Non-empty → NEEDS_CONTEXT, no auto-`--force`.
- Forbidden Operations explicit citation (line 350-351).
- Verdict: addressed (Conf 95).

### R-S3 — Rollback documentation
- § Not in scope item 15 line 635 preserved verbatim: "pre-reset-2026-05-21 tag at 487fc35 preserves develop tip ONLY; 4 deleted branches recoverable via reflog (~30-90 days)".
- Verdict: addressed (Conf 95).

### R-S4 — Recovery path chain
- Stage E.2: line 280 → NEEDS_CONTEXT on gate failure.
- §5a: line 348+353 → NEEDS_CONTEXT on non-empty porcelain.
- §8 CI: line 387 → NEEDS_CONTEXT on timeout.
- §9 merge: line 394 → no retry, manager re-contracts on non-zero exit.
- All paths chain to user; no silent retry.
- Verdict: addressed (Conf 95).

### R-S5 — New risks from iter3
- The iter3 precheck block uses `cd <worktree-path> && git status --porcelain` in two consecutive lines inside ONE fenced code block. The Bash tool's shell-isolation means each tool call resets cwd, so the manager will execute each `cd` line separately at runtime (or both in one call — both valid). Risk: the script as written assumes shell-isolation; if a future automation runs the whole block as one subshell, the second cd is relative to the new cwd from the first cd — and the path `.gobbi/projects/gobbi/worktrees/refactor/257-skills-agents-rules` is relative. **Low-severity ambiguity** — both worktree paths share the SAME relative prefix from project root, so when the second cd runs from inside the first worktree, it would fail with `chdir: no such file` (a hard error, not a silent miss). Net risk: minimal (hard-fail is loud, manager re-contracts). Logging Low/35.
- Sweep worktree at §11 still lacks precheck (mirrors iter2). Out-of-iter3-scope per leader brief.
- Verdict: clean modulo Low/35 cosmetic (Conf 80).

## Findings

### F-CL3-R-01
- Type: `design_flaw`
- Domain: process
- Severity: Low
- Confidence: 35
- Disposition: deferred (cosmetic; hard-failure mode is loud)
- Evidence: `draft-iter3.md:347, 352` — back-to-back `cd <worktree> && git status --porcelain` in one fenced block. If executed in a single subshell, the second cd is relative to the first worktree's cwd. Hard-failure would produce a clear chdir error.
- Why it matters: minor ambiguity for a future automation runner; no impact on manager execution via Bash tool (shell isolation per call).
- Suggested direction: change to absolute `cd /playinganalytics/git/gobbi/.gobbi/...` OR prepend `cd /playinganalytics/git/gobbi &&` to both. Not a blocker for iter3.

## Must-preserve list

- Lightweight tag form at all sites (closes R-S1).
- §5a precheck → NEEDS_CONTEXT chain (closes R-S2).
- Rollback-coverage explainer (R-S3).
- 4-point NEEDS_CONTEXT chain (R-S4).

## Verdict

**PASS.** No new High/Critical risk. F-CL3-R-01 Low/35 cosmetic; defer.
