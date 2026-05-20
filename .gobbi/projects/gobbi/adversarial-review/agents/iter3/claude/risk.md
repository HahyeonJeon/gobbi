# Risk Perspective — 5-Role Agent Taxonomy (iter3, claude)

## Artifact Summary + W/W/H

See `project.md`. Risk = blast radius if the taxonomy is wrong, reversibility, security surface, two-week smell test.

## Memory reads

- `iter2/claude/risk.md` (inheritance — 8 findings, F-R-06 High/75 stuck)
- `agents/*.md`
- `skills/delegation/SKILL.md` § Model Selection
- `skills/git/SKILL.md` (iter3 Fix 4 — drift disclosure)
- `.claude/CLAUDE.md` (user-locked, deferred-disposition only)

## Locked Frame (Stage 1)

### S-R-1 (inherited): Rollback path
### S-R-2 (inherited, open): Blast radius (F-R-01)
### S-R-3 (inherited, open): Min-privilege tool surfaces (F-R-02 + F-S-02)
### S-R-4 (adversarial inherited, open): Scope drift (F-R-03)
### S-R-5 (inherited): Concurrency / race surface
### S-R-9 (inherited): Two-week smell (F-R-04)
### S-R-10 (adversarial inherited, open High): Manager misroute recovery (F-R-06)
### S-R-12 (inherited, open partial): Missing-skill failure mode (F-R-07)
### S-R-13 (iter2 NEW): Sole-writer single-point-of-failure (F-R-NEW-01)
### S-R-14 (iter2 NEW): mistake skill staging→promotion path
### S-R-15 (NEW iter3): Fix 2 incomplete sweep — risk that leader/executor frontmatter AskUserQuestion grant can be exercised at runtime
### S-R-16 (NEW iter3): Fix 4 — drift disclosure mitigates the iter1 Critical F-S-04 risk?
### S-R-17 (NEW iter3): Fix 3 — Write+Edit granted to assistant — security surface delta?

## Per-scenario per-check results (Stage 2)

### S-R-1 / S-R-2 / S-R-3 / S-R-4 / S-R-5 — carry-forward (unchanged in iter3)
- F-R-01, F-R-02, F-R-03 all open Medium; no change
- F-S-02 (leader Write policy-only): unchanged
- Parallel-spawn safety: unchanged

### S-R-9 (F-R-04 — two-week smell)
- iter2 sub-findings F-U-NEW-01 + F-C-06 are addressed in iter3 (Fix 2 + Fix 3). Net first-run failure surface: improved
- BUT iter3 introduces F-P-iter3-NEW-01 + F-C-iter3-NEW-02 + F-C-iter3-NEW-03 — new first-run failure shape:
  - Leader / executor subagent at runtime has AskUserQuestion granted in frontmatter; if it calls AskUserQuestion directly, the manager has no way to intercept (the tool just fires)
  - Assistant in Wrap-up mode loads wrap-up/SKILL.md which says "MUST run AskUserQuestion" — assistant tools list excludes AskUserQuestion (post-Fix 3); the runtime call would fail with "tool not granted"
- → **F-R-04 disposition: partially addressed; new failure modes from incomplete iter3 sweep**

### S-R-10 (F-R-06)
- Manager misroute recovery: still none. Unchanged. → **open (carry, High/75 stuck across iter1+iter2+iter3)**

### S-R-12 (F-R-07)
- Missing-skill: iter1 acute symptom (mistake skill) closed iter2; underlying contract still absent
- iter3 Fix 1 closed the F-EXEC-DANGLING symptom by removing the 7 dangling skill references. Each Fix 1-style "defer to issue #258" is a constructive precedent for the broader contract.
- → **F-R-07 disposition: open partial (Medium, carry)**

### S-R-13 (F-R-NEW-01 — sole-writer)
- iter3 Fix 2 routed Wrap-up step 4 user-facing decision via NEEDS_CONTEXT to manager → assistant no longer carries user-facing judgment
- Sole-writer concentration remains, but the highest-impact risk surface (user-facing judgment under sonnet) is mitigated
- → **F-R-NEW-01 disposition: partially addressed (Medium → Low/25)**

### S-R-14 (mistake skill)
- Unchanged from iter2. → no finding

### S-R-15 (NEW iter3 — Fix 2 incomplete sweep risk)
- (a) leader.md:4 + executor.md:4 still grant AskUserQuestion
- (b) Runtime risk: the leader / executor subagent literally has the AskUserQuestion tool callable; the prose discipline ("Do NOT call AskUserQuestion directly") is a soft norm
- (c) At runtime, if the leader / executor model decides to call AskUserQuestion (e.g., during ambiguity resolution), the call SUCCEEDS — the manager has no way to block it
- (d) This is a Principle 2 violation: subagent talking to user without manager arbitration
- (e) Blast radius: each subagent that bypasses NEEDS_CONTEXT loses the manager's framing layer (manager can resolve from project memory, auto-decide per discussion/SKILL.md classifier, or call AskUserQuestion with better framing). Direct-call from subagent skips all that.
- → **F-R-iter3-NEW-01** (High/100 regression — Fix 2 incomplete sweep creates a Principle 2 enforcement gap at runtime)

### S-R-16 (NEW iter3 — Fix 4 drift disclosure)
- (a) iter3 contract requires F-S-04 = disputed; the drift validator is tracked at issue #258
- (b) git/SKILL.md:123 disclosure: "every PR that touches multiple layers ... must be hand-reviewed for drift via adversarial review per `evaluation/SKILL.md`"
- (c) This is **the present session's compensating control** — adversarial review (this very evaluation pass) is how cross-layer drift is detected absent a validator. The risk surface is: if cross-layer drift exists post-merge, it will be discovered only at next session's adversarial review
- (d) For solo-user, the compensating control is acceptable. The disputed disposition is defensible.
- → no NEW finding (Fix 4 disclosure mitigates the F-S-04 risk surface for the bundle)

### S-R-17 (NEW iter3 — Fix 3 security surface delta)
- (a) Pre-Fix 3: assistant.md tools were read-only-ish (no Write/Edit)
- (b) Post-Fix 3: assistant.md tools include Write + Edit
- (c) Security surface delta: the assistant can now write project memory directly. Mitigation per assistant.md:18: write surface is bounded by `wrap-up/SKILL.md` routing table; unrouted writes escalate via the NEEDS_CONTEXT pattern (per Fix 2)
- (d) However: wrap-up/SKILL.md says "MUST run user-confirm via AskUserQuestion" (direct-call) → if the assistant tried this without AskUserQuestion granted, it would fail. The combined finding (F-C-iter3-NEW-03) is the actual risk.
- (e) Net security surface: bounded, but with a contradiction-induced failure path. Mitigated by NEEDS_CONTEXT escalation in agent file.
- → no Fix-3-specific finding; the contradiction is owned by F-C-iter3-NEW-03

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-R-01** | `general` | `process` | open (carry) | 50 | Medium | Same as iter2 | Carry |
| **F-R-02** | `assumption_risk` | `security` | open (carry) | 75 | Medium | Same as iter2 | Carry |
| **F-R-03** | `general` | `process` | open (carry) | 50 | Medium | Same as iter2 | Carry |
| **F-R-04** | `design_flaw` | `process` | partially addressed | 50 | Medium | iter1 sub-findings closed; iter3 introduces new first-run failure modes | Net improvement; new failure modes recorded under F-R-iter3-NEW-01 |
| **F-R-05** | `assumption_risk` | `docs-sync` | open (carry) | 75 | Medium | evaluator.md:41-44 paths still don't exist | iter1 unchanged; iter3 did not address |
| **F-R-06** | `design_flaw` | `process` | **open (stuck iter1+iter2+iter3)** | 75 | **High** | No subagent self-escalate-on-wrong-phase status | Same as iter2 |
| **F-R-07** | `design_flaw` | `process` | open partial (carry) | 50 | Medium | mistake skill exists; missing-skill contract still absent | Carry |
| **F-R-NEW-01** | `design_flaw` | `process` | partially addressed (Fix 2) | 25 | Low | iter3 routed Wrap-up step 4 user-facing decision via NEEDS_CONTEXT; sole-writer concentration remains | Mitigated |
| **F-R-iter3-NEW-01** | `design_flaw` | `process` | **open (NEW iter3 regression)** | 100 | **High** | leader.md:4 + executor.md:4 frontmatter grant `AskUserQuestion`; at runtime the prose discipline is unenforceable | Principle 2 enforcement gap — subagent direct-calls bypass manager arbitration |

## Per-perspective verdict

**REVISE** — F-R-06 (High/75, stuck) + F-R-iter3-NEW-01 (High/100, regression class). Two Highs.

Per the rule: no Critical ≥ 75; any High ≥ 50 → REVISE. → **REVISE**.

Same trajectory as Usage and Consistency perspectives: progress on iter2 regressions (Fix 2 + Fix 3 close real gaps) but introduces a parallel regression of the same shape (incomplete sweep — agent prose patched without aligned frontmatter grant + downstream skill update).

The stuck High (F-R-06, manager misroute recovery) survives across 3 iters. The regression class (incomplete sweep) recurs across 2 iters.

## Low-confidence appendix

- F-R-NEW-01 (Low/25 post-Fix 2) — mitigated
