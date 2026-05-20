# Risk Perspective — 5-Role Agent Taxonomy (iter5, claude)

## Artifact Summary + W/W/H

See `project.md`. Risk = blast radius, reversibility, security surface, two-week smell, Principle 2 enforcement.

## Memory reads

- `iter4/claude/risk.md` (REVISE — F-R-06 stuck High, F-R-iter4-NEW-01 + -02 High/100)
- `agents/*.md`
- `skills/delegation/SKILL.md` § Model Selection + dispatch table
- `skills/git/SKILL.md` Forbidden Operations
- `skills/orchestration/workflow/preparation.md`
- `skills/wrap-up/SKILL.md` + `skills/preparation/SKILL.md` Memory Access Matrices
- `skills/gobbi/SKILL.md`

## Locked Frame (Stage 1)

### S-R-1 (inherited): Rollback path
### S-R-2 (inherited, open): Blast radius (F-R-01)
### S-R-3 (inherited, open): Min-privilege tool surfaces (F-R-02 + F-S-02)
### S-R-4 (adversarial inherited, open): Scope drift (F-R-03)
### S-R-5 (inherited): Concurrency / race
### S-R-9 (inherited): Two-week smell (F-R-04)
### S-R-10 (inherited, stuck → iter5 candidate close): Manager misroute recovery (F-R-06)
### S-R-12 (inherited, open partial → iter5 candidate improvement): Missing-skill failure mode (F-R-07)
### S-R-13 (inherited iter2 NEW): Sole-writer single-point-of-failure (F-R-NEW-01)
### S-R-18 (iter4 carry, candidate close): preparation.md leader-write runtime risk (F-R-iter4-NEW-01)
### S-R-19 (iter4 carry, candidate close): mistake-skill load-order runtime risk (F-R-iter4-NEW-02)
### S-R-21 (NEW iter5 adversarial): Did Fix 5 introduce a wrong-phase-dispatch infinite-loop risk?
### S-R-22 (NEW iter5 adversarial): Did Fix 1's tighter staging language create a new write-blocked failure mode for legitimate leader writes?
### S-R-23 (NEW iter5 adversarial): Did Fix 2 + Fix 3 + Fix 4 introduce any security surface delta?

## Per-scenario per-check results (Stage 2)

### S-R-1 to S-R-5 — carry

### S-R-9 (F-R-04 — two-week smell)
- iter4 introduced 2 first-run failure modes (preparation + mistake-skill); iter5 closed both via Fix 1 + Fix 2
- The 2-week smell test passes for the closed findings: a fresh contributor reading preparation.md in 2 weeks does not get a contradictory mental model; ditto for the mistake skill
- → **F-R-04 disposition: addressed (iter5 closed the iter4 first-run failure modes)**

### S-R-10 (F-R-06 — manager misroute recovery)
- Pre-Fix-5: no subagent self-escalate status; if a leader received an implementation task, it would either attempt the task (out-of-role, degraded output) OR emit plain `BLOCKED` (manager re-contracts with user, costly)
- Post-Fix-5: 4 subagent docs each declare a `BLOCKED` with `reason: wrong-phase-dispatch` sub-bullet that names the redirect target
- delegation/SKILL.md:126 dispatch table row: "**Re-dispatch**, not abort. The subagent identified a role mismatch — re-delegate the task to the correct role without re-contracting with the user (unless the correct role is ambiguous)."
- This **closes the misroute recovery contract** that F-R-06 named missing for 4 iters
- Blast radius coverage: every role boundary (leader / executor / evaluator / assistant) covered by a sub-bullet with a role-specific redirect example
- Rollback path: the contract is reversible — removing the BLOCKED sub-bullet and the dispatch table row reverts to pre-iter5 behavior
- → **F-R-06 disposition: addressed (Fix 5 — stuck-4-iter finding closed)**

### S-R-12 (F-R-07 — missing-skill failure)
- Pre-Fix-2: gobbi/SKILL.md:154 claimed "no separate mistake skill" while executor.md and delegation templates instructed loading it → load-order-dependent runtime risk of skipping the skill
- Post-Fix-2: gobbi/SKILL.md, CLAUDE.md, executor.md, delegation templates, and the filesystem all agree the mistake skill exists at `skills/mistake/SKILL.md`
- The specific missing-skill failure mode that F-R-iter4-NEW-02 named is closed
- Broader F-R-07 (missing-skill contract for skills NOT named in delegation but referenced by name in agent files) still carries — but the iter4 worsening is reversed
- → **F-R-07 disposition: open partial (carry); iter4 worsening reversed**

### S-R-13 (F-R-NEW-01) — partially addressed (carry)

### S-R-18 (F-R-iter4-NEW-01 — preparation.md leader-write runtime risk)
- preparation.md:64 (post-Fix-1): "the leader writes the draft ... AND stages the approved gap fixes at staging/. Wrap-up is the sole promoter of staged artifacts to project memory."
- preparation.md:72 (post-Fix-1): "New skills are staged at staging/skills/{slug}/SKILL.md ... Wrap-up promotes staged skills to project memory at session close per preparation/SKILL.md Memory Access Matrix"
- No prose tells the leader to write to `.gobbi/projects/{project-name}/skills/` directly
- preparation/SKILL.md:30 explicitly says READ-ONLY for project memory
- Leader's frontmatter `tools:` still includes Write — but the prose discipline now uniformly says "stage", not "stamp"
- Runtime risk: a fresh leader subagent following the post-Fix-1 prose stages to `staging/skills/`, NOT to project memory. The Wrap-up audit trail / idempotency / supersession contract is preserved.
- → **F-R-iter4-NEW-01 disposition: addressed (Fix 1)**

### S-R-19 (F-R-iter4-NEW-02 — mistake-skill load-order runtime risk)
- gobbi/SKILL.md:154 (post-Fix-2): no longer denies the skill; gives the exact path
- A fresh subagent reading gobbi/SKILL.md at session start gets unambiguous instruction to load `skills/mistake/SKILL.md`
- Load-order resolution: no conflict to resolve; all signals align
- → **F-R-iter4-NEW-02 disposition: addressed (Fix 2)**

### S-R-21 (NEW iter5 adversarial — Fix 5 infinite-loop risk)
- Worst case: leader receives task → emits BLOCKED wrong-phase-dispatch → manager re-dispatches to executor → executor receives task → ALSO emits BLOCKED wrong-phase-dispatch → manager re-dispatches to leader → loop
- Mitigation in delegation/SKILL.md:126 dispatch table: "(unless the correct role is ambiguous)" — implicitly opens the door for the manager to escalate to user if the redirect chain doesn't terminate
- But the contract doesn't explicitly cap the re-dispatch count or define termination conditions
- Risk severity: Low — the mechanism is unlikely to oscillate in practice (manager would notice 2 conflicting BLOCKED responses and escalate), but a hard cap would be more defensive
- → **F-R-iter5-NEW-01** (Low/50 — no explicit cap on wrong-phase-dispatch re-dispatch chain; in practice the manager will notice oscillation and escalate, but the contract should explicitly cap to 1 re-dispatch + force escalate-to-user on second BLOCKED with same reason)

### S-R-22 (NEW iter5 adversarial — Fix 1 over-restriction risk)
- Did the Fix 1 rewrite remove any legitimate leader write path?
- Pre-Fix-1: lines 64+72 said leader stamps + applies promotions (direct project-memory write)
- Post-Fix-1: lines 64+72 say leader stages at `staging/`
- Legitimate leader writes to:
  - rawdata/ (drafts, transcripts) — still allowed per preparation/SKILL.md:25 ✓
  - staging/ (approved gap fixes) — still allowed per preparation/SKILL.md:26 ✓
  - feature memory / project memory — never was supposed to be allowed; correctly disallowed
- No legitimate leader write path was removed
- → no NEW finding

### S-R-23 (NEW iter5 adversarial — Fix 2/3/4 security surface)
- Fix 2: gobbi/SKILL.md prose correction — zero security delta
- Fix 3: manager.md retirement map addition — zero security delta (read-only docs)
- Fix 4: delegation/SKILL.md cross-pollination paragraph — zero security delta (explanatory prose)
- None of these fixes touch tool grants, write surfaces, or authentication boundaries
- → no NEW finding

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-R-01** | `general` | `process` | open (carry) | 50 | Medium | Carry | Carry |
| **F-R-02** | `assumption_risk` | `security` | open (carry) | 75 | Medium | Carry | Carry |
| **F-R-03** | `general` | `process` | open (carry) | 50 | Medium | Carry | Carry |
| **F-R-04** | `design_flaw` | `process` | **addressed (iter5 first-run failure modes closed via Fix 1 + Fix 2)** | 100 | n/a | iter4 first-run regressions reversed | Smell improved |
| **F-R-05** | `assumption_risk` | `docs-sync` | addressed (Sweep 3, carry) | 100 | n/a | evaluator paths | Carry |
| **F-R-06** | `design_flaw` | `process` | **addressed (Fix 5 — stuck-4-iter closed)** | 100 | n/a | wrong-phase-dispatch BLOCKED across 4 subagent docs + dispatch table | Stuck 4 iters; closed in iter5 |
| **F-R-07** | `design_flaw` | `process` | open partial (carry); iter4 worsening reversed | 50 | Medium | Broader missing-skill contract still partial; iter4 mistake-skill worsening closed | Improved |
| **F-R-NEW-01** | `design_flaw` | `process` | partially addressed (carry) | 25 | Low | Mitigated | Carry |
| **F-R-iter3-NEW-01** | `design_flaw` | `process` | addressed (Sweep 1, carry) | 100 | n/a | Principle 2 frontmatter | Carry |
| **F-R-iter4-NEW-01** | `design_flaw` | `process` | **addressed (Fix 1)** | 100 | n/a | preparation.md staging discipline restored across 4 surfaces | iter4 regression closed |
| **F-R-iter4-NEW-02** | `design_flaw` | `process` | **addressed (Fix 2)** | 100 | n/a | gobbi/SKILL.md aligned with filesystem + CLAUDE.md + delegation templates | iter4 regression closed |
| **F-R-iter5-NEW-01** | `assumption_risk` | `process` | open (NEW iter5, minor) | 50 | Low | No explicit cap on wrong-phase-dispatch re-dispatch chain (manager would notice oscillation in practice but contract doesn't enforce a cap) | Defensive cap would harden Fix 5; not blocking |

## Per-perspective verdict

**PASS** — F-R-06 stuck-4-iter finding closed via Fix 5; F-R-iter4-NEW-01 + -02 both closed via Fix 1 + Fix 2; F-R-04 first-run smell reversed; F-R-07 iter4 worsening reversed. One Low/50 finding introduced (no explicit cap on re-dispatch chain).

Per the rule: no Critical ≥ 75; no High ≥ 50 in `open` / newly-surfaced state. F-R-02 Medium and F-R-01/03 Medium are pre-existing carries with no iter5 contribution. → **PASS**.

iter1+2+3+4 all REVISE on Risk. **iter5 is the first PASS on Risk in 5 iters** because the stuck F-R-06 finally closed AND both iter4 regressions closed.

## Low-confidence appendix

(none)
