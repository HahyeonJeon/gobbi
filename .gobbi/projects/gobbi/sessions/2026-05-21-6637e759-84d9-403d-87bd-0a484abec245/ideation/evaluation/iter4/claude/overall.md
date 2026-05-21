# Ideation iter4 — Overall (Stage 3) (claude)

## Cross-perspective verdicts

| Perspective | Verdict | Driver |
|---|---|---|
| Project | PASS | surgical scope honored; 19 locks intact; iter1-3 audit-trail untouched |
| Structure | PASS | E.1/E.2 + non-circular gate preserved; invariant #7 rewritten coherently |
| Performance | PASS | net -2 commands at Stage G; D2 collapsed 21→20 |
| Aesthetics | PASS | one Low/25 repetition finding; no operational impact |
| Usage | PASS | F-U3-02 closed by atomic guard; F-U4-01 Low/25 only |
| Consistency | PASS | F-C3-01 + F-C3-02 closed; cross-section coherence intact across 16 mention sites |
| Risk | PASS | F-R3-01 closed; gate is genuine pass/fail; Iron Law 11 framing sound |

All 7 perspectives PASS. iter3's four High/100 findings (F-U3-02, F-C3-01, F-C3-02, F-R3-01) all converged on iter3's D11 body-grep mechanism; iter4's single substitution closes all four simultaneously.

## F-CX-OV-02 — disposition

- **Status**: **addressed**.
- **Evidence**:
  - iter4 deletes the iter3 post-merge body-grep verify. `grep -nE "grep -F|mergeCommit\.oid|mergeCommit -q" draft-iter4.md` returns only one line — the historical "iter3's separate commands are removed" at D2 #20 (line 413). No live body-grep machinery remains.
  - Stage G (lines 348-359) now: capture `HEAD_SHA` → `gh pr merge <num> --squash --delete-branch --match-head-commit "$HEAD_SHA"` → exit 0 ⇒ pass / exit ≠ 0 ⇒ NEEDS_CONTEXT.
  - I11 (line 227-230) rewritten — supersedes iter3 I11; cites `gh pr merge --help` documenting the flag verbatim; explicitly retracts iter3's empirical claim about squash-merge body shape.
  - D11 (lines 490-504) rewritten — historical preamble (Claude REVISE evidence + Codex prescription) + iter4 mechanism block.
  - Success Criterion #14 (line 135) rewritten — atomic-guard exit-code semantics.
  - D2 #20 (lines 411-413) — collapsed iter3's #20+#21 pair into one atomic-guard exit-code check.
  - S6b (line 249) + S13 (line 256) + Critical Invariant #7 (line 371) — all rewritten for the new mechanism.
- **Independent verification**: `gh pr merge --help` on this machine documents `--match-head-commit SHA   Commit SHA that the pull request head must match to allow merge` at the same FLAGS-block level as `--squash`/`--merge`/`--rebase`. The flag's documentation makes no merge-strategy-specific restriction; it is a top-level head-match guard that applies to squash merges. Confirmed.

## F-CX-OV-01 + iter1+iter2+iter3 remediations — confirmed preserved

- **F-CX-OV-01 (iter2 Codex High/100, addressed in iter3)** — preserved verbatim at iter4. E.1/E.2 split, non-circular `git log` + `git ls-tree` gate, "no SHA into any tracked file" Out-of-Scope addition all untouched.
- **iter1 H-1 (CLAUDE.md surgical 2-line excision)** — preserved at iter4 verbatim (Stage B, D10, Success #12, D2 #17).
- **iter1 H-2 (mistake-file deletion trade-off)** — preserved; iter4 expands the lesson-encoding map to cover Stage G's NEEDS_CONTEXT clause.
- **iter1 H-3 (Stage E.1/E.2 split)** — preserved (only the iter3 gate semantics changed in iter3; iter4 untouched).
- **iter1 H-4 (backlog session-scoping)** — preserved.
- **iter1 M-1 + M-2 + M-3** — preserved.
- **iter1 L-1** — preserved.
- **iter3 must-preserves 16–19** — all confirmed (preserve list lines 633-638 of draft-iter4).

## New iter4-only findings

| ID | Perspective | Severity/conf | Disposition |
|---|---|---|---|
| F-A4-01 | Aesthetics | Low/25 | open (below threshold; documented for future) |
| F-U4-01 | Usage | Low/25 | open (below threshold; Codex iter3's optional second-half `mergeCommit.oid` cross-check dropped; orthogonal local-sync concern already handled by M-2 step) |

Neither finding meets the High/50 REVISE threshold.

## Cross-perspective tensions

None. The single mechanism substitution closes 4 High/100 findings simultaneously; no perspective surfaces a residual concern at threshold.

## Karpathy four failure modes

| Mode | Present at iter4? | Evidence |
|---|---|---|
| **Wrong assumptions** | NO | iter3's two-domain pattern (self-referential SHA → false body-grep empirical claim) is broken by iter4. The new mechanism uses a server-side comparison whose semantics are gh-CLI-documented, not inferred. The iter3 evaluator's empirical refutation against 5 squash-merged PRs is preserved in D11 as the iter3-mechanism rationale, ensuring the assumption defect is explicitly named and retired. |
| **Overcomplexity** | NO | The substitution removes machinery (deletes 2 post-merge commands; adds 1 flag). Net reduction. |
| **Orthogonal edits** | PARTIAL (carried) | F-OV-02 from iter1 stays user-locked-disputed (Q3); unchanged. |
| **Imperative-over-declarative** | NO | The new gate is declarative: a single exit code communicates the contract. |

The pattern recognition that iter3 surfaced ("an empirical claim about external tool behavior baked into a gate without independent verification") is the lesson iter4 explicitly applies. The iter4 mechanism's correctness is grounded in (a) `gh pr merge --help` documenting the flag verbatim, (b) the gh CLI's API-level contract that the flag is server-side checked at merge transaction time, and (c) Codex iter3's independent prescription. Three independent witnesses; no remaining empirical fragility.

## False-positive screen (pre-finalization)

Applied:
- **"Should mention prior art"** — iter4 explicitly cites iter3's body-grep mechanism as the superseded prior approach; cites Claude REVISE evidence + Codex prescription as the dual witness.
- **"Test coverage gap"** — n/a, Ideation phase.
- **"Documentation drift"** — only F-A4-01 Low/25 (repetition pattern); not at threshold.
- **"Bikeshedding aesthetics"** — F-A4-01 explicitly flagged as below-threshold and informational.
- **"Author probably meant X"** — explicitly NOT applied. The artifact's literal text is verified at 16 mention sites; no inference required.

The PASS verdict survives the false-positive screen: there is no High-threshold finding to manufacture in the absence of evidence, and the F-CX-OV-02 fix is independently verifiable via `gh pr merge --help`.

## Preserve list (must not be broken)

### From iter1 (9, all preserved through iter4):
1. Q-F pre-reset tag + push BEFORE sweep.
2. Branch ancestry per-branch `-d` vs `-D`.
3. Q-B mitigation: bare-UUID delete is LAST.
4. Critical ordering invariants block (now 7 invariants).
5. Memory reads register + Decisions Log traceability.
6. `git rm` vs `rm -rf` discipline.
7. Out-of-Scope enumeration (with iter3 + iter4 additions).
8. All 19 locked decisions enumerated in two tables.
9. External research skip reason.

### From iter2 (6, all preserved through iter4):
10. iter2 deltas-at-a-glance block (expanded for iter4).
11. Stage E.1/E.2 split.
12. iter2 H-1 surgical 2-line CLAUDE.md excision.
13. iter2 H-4 backlog session-scoping.
14. D4 inline stub template.
15. Three-lesson encoding map (M-3, E.2 NEEDS_CONTEXT clause, D2 grep-c audit).

### From iter3 (4, all preserved at iter4):
16. The Stage E.2 non-circular gate (F-CX-OV-01 fix).
17. The HEAD_SHA capture step (audit-log preserved).
18. The Out-of-Scope "writing sweep SHA into any tracked file" addition.
19. The D9 explicit narrative correction of the iter2 self-reference loop (educational value).

### Newly added at iter4 (must survive any future remediation):
20. The atomic-guard `--match-head-commit "$HEAD_SHA"` flag at Stage G as the merge gate.
21. D11's historical preamble (iter3 mechanism + Claude REVISE evidence + Codex prescription) — load-bearing rationale for WHY the substitution was made (Iron Law 10 witness).
22. The Out-of-Scope addition for "post-merge body-grep verification of `$HEAD_SHA` — removed in iter4".
23. The 19-lock enumeration including Q-iter4-Override.

## Overall verdict

**PASS**.

Drivers:
- 4 iter3 High/100 findings (F-U3-02, F-C3-01, F-C3-02, F-R3-01) — all closed by iter4's single mechanism substitution.
- F-CX-OV-02 — addressed cleanly using Codex iter3's prescribed `--match-head-commit` surgical fix; independently verified against `gh pr merge --help`.
- F-CX-OV-01 — addressed cleanly in iter3, preserved verbatim at iter4.
- All 4 iter1 High findings + 4 iter2 Med/Low surgical fixes — preserved.
- No new High-severity findings introduced by iter4.
- iter4 atomic guard is non-rationalizable: single shell exit code, semantics fully delegated to documented gh-CLI flag.

### Interaction with the user-authorized iter4 override

The user authorized iter4 via Q-iter4-Override (logged in `settings.json` with `maxIterationsOverrideReason`). iter4 honors the override's surgical scope. The mechanism substitution exceeds the iter3 evaluator's recommended threshold: iter3 Claude suggested option (a) "re-spec the D11 verify step to use `gh pr view --json mergeCommit -q .mergeCommit.oid` against `git rev-parse develop`" OR option (b) "drop the verify half entirely". iter4 implements option (c) — Codex iter3's superior prescription: atomic guard at merge time, no post-merge inference at all. This is strictly better than either option Claude suggested because it removes the race window between verify and merge.

The brief explicitly framed iter4 as the last realistic iter; this evaluator concurs. No further iteration is warranted on F-CX-OV-02 — the mechanism is sound, the scope is surgical, the audit-trail is intact, and the verdict is PASS across all 7 perspectives.
