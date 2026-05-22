# Ideation iter4 — Risk (claude)

## Stage 0 — Target Understanding

Risk = the false-alarm pattern, the meta-risk of training the operator to bypass gates, and the destructive blast radius of the cleanup itself. iter3's F-R3-01 (High/100) was the false-alarm meta-risk: the body-grep gate would NEEDS_CONTEXT on every happy-path merge. iter4 must close this AND not introduce a new false-alarm.

## Stage 1 Locked Frame (Risk perspective)

- Scenario R1 (adversarial — inheritance of F-R3-01): the new gate fires only on real defects, not on happy paths.
- Scenario R2: NEEDS_CONTEXT discipline preserved on Stage G gate failure.
- Scenario R3: blast radius of `--match-head-commit` if it silently fails (e.g., gh CLI doesn't recognize the flag).
- Scenario R4: Iron Law 11 — does the substitution game the tool?
- Scenario R5: destructive-sweep recovery path (Q-F tag) intact.

## Stage 2 — Walked checklists + inherited disposition

### Inherited from iter3

- **F-R3-01 (High/100, false-alarm meta-risk)** — **addressed by iter4**. The atomic guard's true-positive rate is 1.0 on real defects (force-push or rebase between capture and merge) and the false-positive rate is 0 (the flag is a deterministic server-side comparison; no empirical claim about commit-body shape). The operator-bypass training pattern from `executor-rationalized-failing-verification-gate.md` no longer applies because the gate is a genuine pass/fail signal. Disposition: `addressed-by-iter4`.

### Walked checklists

- **R1 — gate fires only on real defects**: server-side comparison `passed_SHA == current_PR_head_OID` at merge transaction. Mismatch is by definition a real force-push or rebase. Match is by definition a true happy path. No empirical fragility.
- **R2 — NEEDS_CONTEXT preserved**: Stage G line 358 + D11 line 500 + Critical Invariant #7 (line 371) all encode the discipline explicitly with citation to `executor-rationalized-failing-verification-gate.md`.
- **R3 — `gh` flag failure mode**: if the local `gh` somehow lacks the flag (downgraded gh CLI?), the merge command would fail with an unrecognized-flag error → non-zero exit → NEEDS_CONTEXT. Failure mode is identical to a true head-match failure: NEEDS_CONTEXT, no rationalize. This is acceptable. The brief's prerequisite ("`gh pr merge --help | grep match-head-commit` returns the flag" — verified in Memory-reads register line 536) covers this at executor-preflight time.
- **R4 — Iron Law 11**: the substitution does not game any tool — it uses a documented `gh` flag whose semantics are stated in the official help text. D11 line 500 explicitly cites Iron Law 11 in both directions ("do not silence a passing gate; do not interpret a failing gate"). Sound discipline framing.
- **R5 — destructive-sweep recovery**: Q-F tag at `487fc35` is preserved (Stage 0 unchanged). Pre-merge revert path (`git checkout develop`) and post-merge revert path (`git revert <merge-sha>`) preserved in S11.

## New iter4-only findings

None.

## Must-preserve list

- The atomic-guard semantic — true gate, no false-alarm generator.
- NEEDS_CONTEXT-on-non-zero-exit discipline at Stage G, with citation to the executor-rationalized mistake.
- Pre-flight verification of the `gh pr merge --match-head-commit` flag availability (encoded in Memory-reads register).
- Q-F pre-reset tag as the recovery anchor.

## Verdict

**PASS**.
