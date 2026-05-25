# Risk — T07 (commit f2356ca)

## Artifact Summary + Memory reads
(see project.md.) Risk lens for a docs change: blast radius of the reword, reversibility, whether the edit could mislead a future agent into a broken action, regression risk to the T06 guard row. Read mistakes/leader-iter2-verification-claim-without-evidence.md (verification-claim discipline).

## Locked Frame (Stage 1)
- **S1 Reversibility**: pure docs; trivially revertible via git; no migration, no one-way door.
- **S2 Blast radius**: change touches behavioral instructions agents read at session start (CLAUDE.md) — incorrect text would propagate. Verify the new text is factually correct.
- **S3 No new broken affordance introduced**: removing the dead CLI cannot newly break anything; verify the replacement instruction is itself executable-by-an-agent (staging exists, Wrap-up assistant exists).
- **S4 Regression to adjacent committed content (adversarial)**: the T06 `{session-id}` guard row, the routing table, other principles — none silently altered.
- **S5 Verification-claim integrity (mistake-witness)**: the commit/Resolution claims `ls packages/cli` = absent and "no CLI" — confirm these claims are true, not asserted (per leader-iter2 mistake).
- not-applicable: security/auth/PII/concurrency/IaC — none touched by a docs reword (declared).

## Per-scenario per-check results
- S1 YES — 4 markdown files; `git revert f2356ca` fully reverses. No irreversible op.
- S2 YES — the replacement text is factually correct: `orchestration/workflow/` holds 7 sub-docs (ls-verified); `packages/cli` absent (ls-verified); session.json/markdown-tree claims unchanged from prior true text.
- S3 YES — replacement instruction is operable: session staging is the documented agent write surface (mistake/SKILL.md), and the Wrap-up assistant is a real workflow actor (wrap-up/SKILL.md). Removing the dead command removes a guaranteed-to-fail affordance — net risk reduction.
- S4 YES — wrap-up diff is pure insertion (no `-` lines); T06 guard row grep-count = 1 (unchanged); routing table untouched; no adjacent principle modified.
- S5 YES — the Resolution's empirical claims are independently reproduced here: `ls packages/cli` returned `absent`; `grep -c 'gobbi mistake promote'` returned 0 on all three surfaces; `grep -cE 'packages/cli|gobbi workflow init'` on CLAUDE.md returned 0. The commit did not over-claim — claims match fresh evidence (Principle 7 satisfied; the leader-iter2 trap is avoided).

## Typed findings
None at Risk. Net risk-reducing change (removes a dead affordance), fully reversible, no regression to adjacent committed content, verification claims independently confirmed.

## Low-confidence appendix
(none)

**Verdict: PASS**
