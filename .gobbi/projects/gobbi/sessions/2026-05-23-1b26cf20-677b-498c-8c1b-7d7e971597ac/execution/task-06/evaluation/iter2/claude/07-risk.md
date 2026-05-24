# Risk Perspective — Task 06 iter2 (Claude)

**Target:** commit `c6a3e46`.

## Stage 0 — Target Understanding

Risk surface: workflow correctness for future sessions reading the LOCK #5 footnote + smoke-test gate. Iter1 surfaced (a) cross-link dead-end (R-01), (b) manual-only smoke-test (R-02), (c) Codex COD-RISK-T06-002 (false-fail/pass due to bare jq).

## Stage 1 — Frame

- R1.a — A future manager reading the footnote can act correctly on direct mode without chasing a dead pointer.
- R1.b — The smoke-test command, run literally, does not false-fail a valid branch nor false-pass an invalid one.
- R1.c — `null` worktreePath on `worktree-pr` is still flagged as a failure signal.
- R1.d — The "gate" claim is not over-promised (i.e., the doc doesn't imply enforcement that doesn't exist).
- R1.e (adversarial) — The 1-word prefix-normalization at line 103 (`git.workflow.mode` → `settings.git.workflow.mode`) does not alter the row 5.5 procedure semantics.

## Stage 2 — Evaluation

- R1.a — **yes**. Inline 3-bullet behavioral table closes COD-RISK-T06's adjacent concern with the dead pointer.
- R1.b — **yes**. Tool-verified: `jq -r '.git.branch'` produces raw string; the documented anchored regex matches a valid branch. COD-USAGE-T06-002 / COD-RISK-T06-002 (shared root cause, both High in iter1 Codex) resolved.
- R1.c — **yes**. Line 134 retained: "A `null` `worktreePath` on a `worktree-pr` session indicates row 5.5 was skipped or P2 failed without surfacing an error."
- R1.d — **partial**. The footnote still says "Smoke-test gate (T1.h — verification for post-merge sessions)" and "Run this check at the first post-merge session's Memorization phase." The word "gate" still implies an enforcement contract that the doc does not wire up — there is no hook, no CI, no companion edit to memorization.md. **Inherited iter1 R-02 / COD-RISK-T06-001 — explicitly deferred to T07/T08 per iter2 commit body.** Not a NEW iter2 risk.
- R1.e — **yes**. Line 103 now says "Read resolved `settings.git.workflow.mode` from settings." Previously: "Read resolved `git.workflow.mode` from settings." The added `settings.` prefix is a key-disambiguation only; the procedure (read resolved value → branch on `direct` vs `worktree-pr`) is unchanged. The disambiguation is in fact a clean improvement: it makes explicit that the key lives under the `settings.` root and matches the footnote at lines 109/116. No introduced risk.

## Findings

### R-02 (carried forward, deferred) — Smoke-test gate manual-prose-only

- Type: `assumption_risk`
- Domain: `process`
- Disposition: **deferred** (T07/T08 territory per iter2 commit body)
- Confidence: 100
- Severity: Medium
- Evidence: no hook, CI, or memorization-step companion edit enforcing the smoke-test gate. Doc says "Run this check at the first post-merge session's Memorization phase" but provides no enrollment mechanism.
- Why it matters: a gate that depends on memory of one line of prose in one footnote will be missed.
- Iter2 disposition rationale: hook wiring + memorization-step companion edit is T07/T08's scope.

## Verdict

**PASS-with-deferral**
