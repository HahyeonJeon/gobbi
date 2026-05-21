# Ideation iter4 — Usage (claude)

## Stage 0 — Target Understanding

Usage = will the executor be able to run iter4's plan correctly without ambiguity, false-alarm gates, or empirical claims that fail in this repo? iter3's defect (F-U3-02 High/100) was that D11's verify step would fire NEEDS_CONTEXT on every happy-path merge, training the operator to bypass. iter4 must close this hole AND not introduce a new one.

## Stage 1 Locked Frame (Usage perspective)

- Scenario U1: the executor can run Stage G end-to-end without ambiguity.
- Scenario U2 (adversarial — inheritance of F-U3-02): does the iter4 mechanism actually fire only on real defects, not happy paths?
- Scenario U3: NEEDS_CONTEXT discipline preserved on Stage G failure path.
- Scenario U4 (adversarial — Codex iter3's second clause): Codex iter3 prescribed BOTH the `--match-head-commit` flag AND a post-merge `mergeCommit.oid == git rev-parse develop` check. iter4 only adopted the first half. Is the second half load-bearing?

## Stage 2 — Walked checklists + inherited disposition

### Inherited from iter3

- **F-U3-02 (High/100, body-grep verify empirically refuted)** — **addressed by iter4**. The body-grep verify step is fully deleted (verified by `grep -nE "grep -F|mergeCommit\.oid" draft-iter4.md` returning only the "removed" historical mention). Stage G's only verify is `gh pr merge --match-head-commit "$HEAD_SHA"` exit code 0. On happy path (no force-push between capture and merge), this exits 0 server-side. No false-alarm shape. Disposition: `addressed-by-iter4`.
- **F-U3-03 (Low/75)** — carried, below threshold, explicitly documented in Deferred follow-ups.

### Walked checklists

- **U1 — executor end-to-end**: Stage G lists 4 task steps (push, open PR, capture `HEAD_SHA`, atomic-merge with `--match-head-commit`, post-merge local cleanup). Each step has a concrete command. The conditional branching ("if exit ≠ 0: NEEDS_CONTEXT") is explicit. No prose-gap.
- **U2 — happy-path fires correctly**: the atomic flag is server-side at merge-call time. Happy path = PR head unchanged between capture and merge → server confirms head-match → merge proceeds → exit 0. iter4 does NOT depend on any commit-body shape. Refuted-on-this-repo empirical claim from iter3 is fully removed.
- **U3 — NEEDS_CONTEXT discipline preserved**: Stage G line 358 + D11 line 500 both encode "exit ≠ 0 ⇒ NEEDS_CONTEXT, no retry, no rationalization". The `executor-rationalized-failing-verification-gate.md` mistake is explicitly cited.
- **U4 — Codex iter3's second clause (mergeCommit.oid == git rev-parse develop check)**: iter4 dropped this. Defensible because the atomic guard's semantics already encode this: server-side, the merge transaction is "if head matches, perform squash-merge into develop, return mergeCommit.oid". Exit 0 ⇒ the squash was performed and the remote develop tip has been updated. The local `git pull` after merge (M-2 step) syncs local develop. The only failure mode for the dropped second-half check would be a local desync (e.g., M-2's `git pull` was skipped), which is already a separate concern handled by M-2's command sequencing. The atomic guard is the load-bearing F-CX-OV-02 fix; the second-half check was belt-and-suspenders for an orthogonal risk that already has its own mitigation.

## New iter4-only findings

| ID | Type | Domain | Severity | Confidence | Disposition | Evidence | Why-it-matters |
|---|---|---|---|---|---|---|---|
| F-U4-01 | general | docs-sync | Low | 25 | open | iter4 dropped Codex iter3's second-half `mergeCommit.oid == git rev-parse develop` check. The current Stage G has no explicit post-merge "local develop is in sync" assertion beyond the M-2 `git pull` step. | Low because the atomic guard alone closes F-CX-OV-02 (which is the failure mode Codex cited). The local-sync check would catch a different defect (operator skipping M-2's `git pull`) — orthogonal to the head-match contract. Could be added as a Success Criterion in a future iter; not blocking. |

This is below the High/50 REVISE threshold.

## Must-preserve list

- The atomic-guard exit-code as the single source of truth for Stage G's gate.
- The `executor-rationalized-failing-verification-gate.md` citation in both Stage G non-zero exit and Stage E.2 gate failure paths.
- M-2's `git checkout develop && git pull && git branch -d <sweep-branch>` step ordering.
- D11's historical preamble explaining WHY iter3's mechanism was replaced.

## Verdict

**PASS**.
