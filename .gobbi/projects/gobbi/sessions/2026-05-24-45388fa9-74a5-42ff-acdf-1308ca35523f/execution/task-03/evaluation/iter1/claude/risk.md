# Risk — T03 (commit 0632ad8)

## Artifact Summary + Memory reads
See project.md. Risk lens for a docs change: blast radius of the doc claim, reversibility, and whether a wrong-but-grep-passing rewrite could mislead future agents into a discipline violation.

## Locked Frame (Stage 1)

**S1 — blast radius is bounded and reversible**
- [ ] Only 2 files; fully revertible via `git revert`
- [ ] No code, no migration, no irreversible op

**S2 — the rewrite does not weaken a safety invariant (the staging boundary)**
- [ ] The "working-loop agents never write to project memory" invariant is preserved, not loosened
- [ ] The Wrap-up exception is narrow (promotion only), not a blanket write grant

**S3 — the M2 row removes a real foot-gun, not introduces one**
- [ ] Following the new M2 row yields a correct session-id resolution
- [ ] No new ambiguity that could send a subagent to the wrong session dir

**S4 (adversarial) — a future agent trusts this doc and corrupts project memory or writes to the wrong session dir**
- [ ] No reading of the doc authorizes a working-loop write to `mistakes/`
- [ ] No reading authorizes reading `$CLAUDE_CODE_SESSION_ID` for the path
- [ ] cite mistakes: `leader-iter2-verification-claim-without-evidence` (verify the M2 clauses verbatim, not by plausibility); `codex-subprocess-writes-to-main-tree` (path-resolution foot-guns)

**S5 — no safety-bypass primitive or secret introduced**
- [ ] grep for `--no-verify` / `--force` / secrets in the diff → none (docs only)

## Per-scenario per-check results
- S1.1 YES — `git diff --name-only` = 2 files; revert is trivial.
- S1.2 YES — no code/migration/one-way door.
- S2.1 YES — invariant strengthened, not weakened: "Working-loop agents never write directly to project memory" is now stated MORE explicitly than the pre-edit "agents never write".
- S2.2 YES — exception scoped to "the Wrap-up assistant performing promotion", i.e., one role + one operation. Not a blanket grant.
- S3.1 YES — I verified each of the 3 M2 clauses verbatim against the file (clause1/2/3 each grep-count=1), per the `leader-iter2-verification-claim-without-evidence` discipline (verify exact wording, not plausibility). The new row tells the agent to use the delegation `session-id:` field and explains why the env var is wrong.
- S3.2 YES — no new ambiguity; the row is strictly more informative than the prior one-liner.
- S4.1 YES — no working-loop write to `mistakes/` is authorized anywhere.
- S4.2 YES — the doc now actively forbids reading `$CLAUDE_CODE_SESSION_ID` for the value; this directly reduces the wrong-session-dir risk class that `codex-subprocess-writes-to-main-tree` and related path mistakes warn about.
- S5.1 YES — docs-only diff; no bypass primitive, no secret.

## Typed findings
(none at or above threshold)

## Verdict: PASS
Bounded, reversible, no safety invariant weakened — the staging boundary is reinforced and the M2 row removes a real wrong-session-dir foot-gun. Privacy/licensing/supply-chain N/A for a docs edit (no PII, no deps, no license headers touched).

## Low-confidence appendix
- RK-LC-1 (Confidence 25, Low) — Type: assumption_risk | Domain: process — Assumes the wrap-up/SKILL.md "Wrap-up assistant is sole writer" model is the project's settled design; if a future redesign moves promotion elsewhere, this doc must change with it. No current evidence of such a move. Suppressed.
