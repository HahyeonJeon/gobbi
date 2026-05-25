# Risk — T06 (commit a8968f8)

## Artifact Summary + Memory reads
See project.md. Risk = blast radius, reversibility, anti-game integrity, security surface.

## Locked Frame (Stage 1)
**S1 — Blast radius matches plan expectation (no unannounced ripple)**
- [ ] Only the 10 docs rows + 1 backlog change; no behavioral/code change; fully reversible (git revert)
**S2 — Anti-game invariant: gobbi/SKILL.md untouched and retains >=3 CCSI mentions**
- [ ] gobbi/SKILL.md not in diff; >=3 CCSI hits remain; none is a Path-conventions {session-id} row
**S3 — No safety-bypass / security surface change**
- [ ] No --no-verify/--force/eval/exec; no auth/input-trust change (docs only)
**S4 — Reversibility / irreversibility**
- [ ] Backlog NOT deleted (M1/M3 rationale survives); status-flip reversible
**S5 (adversarial) — The sweep games SC-5 by editing only enough to pass grep while leaving a row semantically wrong, OR adds a CCSI row to gobbi to inflate the match count**
- [ ] No cosmetic-only satisfaction; gobbi not edited to game the negative-check

## Per-scenario per-check results
- S1: YES. Diff = 10 rows (+1/-1 each) + backlog. No code, no runtime behavior. `git revert a8968f8` is clean (docs-only). Blast radius = agents reading these skills' Path-conventions; M2 codifies existing manager practice (no new behavior). Plan projected exactly this.
- S2: YES (anti-game CONFIRMED). gobbi/SKILL.md absent from the diff. CCSI count = 3 (lines 38 env-var table, 52 Gate-1 health check, 63 env-var table). None is a Path-conventions {session-id} definition row — the {session-id} appearances (lines 72/118/191/214/234) are path-template prose, not a source-definition row. The exclusion is empirically grounded (Planning DR-9), and gobbi was NOT edited to add a fake row to inflate the SC-5 negative-check — preserving Iron Law 11 integrity.
- S3: YES. No bypass primitives; no security-surface change. Pure docs.
- S4: YES. Backlog retained in backlogs/ with M1/M3 alternatives-considered preserved (per SC-6). Status flip open→addressed is trivially reversible.
- S5: YES. Wording matches the locked M2 clauses (not a grep-cosmetic shim); gobbi untouched. No gaming.

## Typed findings
None.

## Verdict: PASS

## Low-confidence appendix
- (conf 25) closed_by SHA deferred to merge — standard for an open PR; the addressed status precedes merge by design (SC-6). Not a risk.
