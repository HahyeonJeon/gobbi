# Risk — iter3

**Perspective:** Risk
**Verdict:** PASS

## Stage 1 inheritance

- iter2 codex-risk-004 (G1 recursive jq) — `addressed`. Risk removed: false positives from any nested `.mode` key. Explicit `.chat.mode` / `.auto.mode` extraction; no recursive walk.
- iter2 codex-risk-005 (G4 `/tmp/t[45]-pre`) — `addressed`. Risk removed: cross-session tmpfile collisions on shared `/tmp`; race on concurrent worktree runs. In-session bash variables are process-local.
- iter2 codex-risk-006 (G2 models-block grep) — `addressed`. Risk removed: text-line-grep false-negative on whitespace-only diffs and false-positive on string-literal containing `"models"`. `jq -S` structural comparison closes both.
- iter1 F-RISK-1 (F6 mirror-symlink pre-flight) — `addressed (carried)`. T1/T2/T3 first verification line aborts if mirror symlink broken before any edit.

## Stage 2 — new + residual risks

- **P-R8 (new in iter3).** `PRE_T4_REV` / `PRE_T5_REV` subshell-scope. Severity Low, mitigated by §3 head note + inline guidance. Acceptable residual.
- **L-S1 (T4 JSON-shape).** Unchanged from iter2/iter1 — single-block-two-keys vs two-top-level-keys. Tactical executor pick; NEEDS_CONTEXT escalation path exists.
- **Plan-acceptance test #7 / #8 false-negative.** `git diff --name-only develop..HEAD | grep ...` returns 0 lines when no match, but the `&& exit 1` triggers only when grep returns 0 exit status (a match). The form is correct (match-then-fail). Verified — no risk inversion.
- **T6 `git mv` history-preservation claim.** Success-criteria #1 says "Both old paths no longer present (or present only as a git history entry — git mv preserves history)". Risk: if executor does `cp + rm` instead of `git mv`, history is lost. Verification command uses `test ! -e` which passes for both forms; doesn't catch the history-loss case. Acceptable residual — T6 risk-rationale flags the canonical procedure.

## New findings

- **F-RISK3-1 (Low, Conf 50) — T6 verification does not catch `cp + rm` vs `git mv`.** Out of scope to fix in iter3 surgical patch (not in G1-G6). Acknowledged residual; recommend addressing in a future hardening pass. Not blocking.

## Must-preserve

- §3 head G4 subshell-scope note — load-bearing for executor.
- P-R8 row — visible reminder during Plan-acceptance review.

Verdict: **PASS**.
