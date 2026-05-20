# Risk Perspective — 5-Role Agent Taxonomy (iter2, claude)

## Artifact Summary + W/W/H

See `project.md`. Risk = blast radius if the agent taxonomy is wrong, reversibility, security surface, two-week smell test.

## Memory reads

- `iter1/claude/risk.md` (inheritance — 7 findings, 4 High)
- `agents/*.md`
- `skills/delegation/SKILL.md` § Model Selection + tool surfaces
- `skills/mistake/SKILL.md` (new)
- `.claude/CLAUDE.md` (user-locked, deferred-only)

## Locked Frame (Stage 1)

### S-R-1 (inherited): Rollback path identified
- [ ] git revert is the rollback (branch-based refactor)

### S-R-2 (inherited): Blast radius enumerated
- [ ] Bundle warns readers about ripple targets (F-R-01)

### S-R-3 (inherited): Min-privilege tool surfaces
- [ ] Manager `tools: "*"` justified (F-R-02)
- [ ] Leader Write enforceable (F-S-02 carry)

### S-R-4 (adversarial inherited): Scope drift
- [ ] Branch bundles more than the 5 files (F-R-03)

### S-R-5 (inherited): Concurrency / race surface
- [ ] Sequenced memorization

### S-R-9 (inherited): Two-week smell test (F-R-04)
- [ ] Bundle survives first real workflow run

### S-R-10 (adversarial inherited): Manager misroute recovery (F-R-06)
- [ ] Subagent self-escalate on miscategorized phase

### S-R-11 (adversarial): Self-evaluation hole (F-P-07 / F-S-02)
### S-R-12 (adversarial inherited): Missing-skill failure mode (F-R-07)
- [ ] mistake skill (now exists in bundle) — is the missing-skill failure mode now defined? OR is there still no behavior for "skill X not found"?

### S-R-13 (NEW iter2): New write-surface risks introduced by Task F (assistant sole writer to project memory)
- [ ] Sole-writer single-point-of-failure for memory promotion
- [ ] Tool-vs-role mismatch (assistant has no Write tool — see F-C-06)

### S-R-14 (NEW iter2 adversarial): mistake skill itself — risks
- [ ] Staging → promotion path documented and unambiguous
- [ ] No agent can bypass to write directly to project memory

## Per-scenario per-check results (Stage 2)

### S-R-1
- (a) Rollback: branch-based, git revert — **YES** acceptable
- (b) Coordination-free: solo-user — **YES**

### S-R-2 (F-R-01)
- (a) Files affected: **STILL NOT ENUMERATED IN BUNDLE** → **disposition: open**

### S-R-3 (F-R-02)
- (a) Manager `tools: "*"`: **UNCHANGED** — manager.md:4 still `*` → **disposition: open**

### S-R-4 (F-R-03)
- gitStatus shows ongoing modifications in adjacent areas (per system context). Still a scope-drift risk → **disposition: open**

### S-R-5
- Parallel-spawn safety: **YES**, unchanged

### S-R-9 (F-R-04)
- Two-week smell: iter1 listed F-U-01 + F-P-05 + F-C-01 + F-C-05 as the failures-on-first-run. iter1 evidence in detail:
  - F-U-01 → addressed (no more `(or leader)`)
  - F-P-05 → addressed (assistant named for Memorization + Wrap-up)
  - F-C-01 → addressed (evaluator schema loads from evaluation/SKILL.md)
  - F-C-05 → addressed at bundle scope (mistake skill exists)
- New first-run risks introduced in iter2:
  - F-U-NEW-01 (AskUserQuestion exception contradiction) — would cause an assistant doing Wrap-up step 4 to call AskUserQuestion and the manager to interpret that as a Principle 2 violation
  - F-C-06 (worse) — assistant.md says "sole project-memory write surface" but tool list has no Write — runtime call fails with "tool not granted"
- → **F-R-04 disposition: partially addressed; new failure modes introduced**

### S-R-10 (F-R-06)
- Manager misroute recovery: **STILL NONE** — no "wrong-phase" status. F-P-06 (Preparation included) helps but does not solve recovery for any future misroute. → **disposition: open**

### S-R-12 (F-R-07)
- Missing-skill failure mode: bundle does not define what happens when a load fails. With mistake skill now existing in the bundle, the immediate iter1 failure path is closed. But the general missing-skill behavior is still undefined — if some future agent file references a skill that does not exist, what happens? No agent file says. → **F-R-07 disposition: open (Critical reduced to Medium)** — the most acute symptom is gone but the underlying gap (no missing-skill contract) remains

### S-R-13 (NEW iter2 — sole-writer risk)
- assistant.md:18 declares "This is the **sole project-memory write surface** in the entire workflow"
- This concentrates ALL project-memory mutation under one role
- Blast radius: a bug in the Wrap-up WORK procedure (or the assistant model misbehaving) corrupts project memory directly — there is no checkpointing layer between staging and project memory other than the assistant itself
- Mitigation: Wrap-up WORK is preceded by EVALUATION (mandatory after Execution per CLAUDE.md), and the user is in the loop via Wrap-up step 4 AskUserQuestion. So it is not fully unchecked.
- But: under sonnet model + sole-writer + user-facing decisions, the quality bar is borderline — see F-Pf-NEW-01
- → **F-R-NEW-01** (Medium/50)

### S-R-14 (NEW iter2 — mistake skill risks)
- Staging → promotion: clean. `gobbi mistake promote` is the only path.
- "Promotion is NOT a context reload" (mistake/SKILL.md:27) — explicit
- "agents NEVER delete mistake files" (line 25) — explicit
- "Wrap-up promotes to the destination based on user-confirmed scope" — user gates promotion at the only critical seam
- Low risk addition. → no finding

### S-R-15 (NEW iter2 — Task A delegation residue)
- evaluator.md no longer defines local schema; loads from evaluation/SKILL.md. Risk: if evaluation/SKILL.md goes missing or changes shape, the evaluator agent file has no fallback. Inverse of iter1's "what if mistake is missing" risk → same class.
- Mitigation: evaluation/SKILL.md is a foundational skill unlikely to vanish; the load directive at evaluator.md:35 cites the exact section
- Low risk. → no finding

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-R-01** | `general` | `process` | open | 50 | Medium | Same as iter1 | Carry-forward |
| **F-R-02** | `assumption_risk` | `security` | open | 75 | Medium | Same as iter1 | Carry-forward |
| **F-R-03** | `general` | `process` | open | 50 | Medium | Same as iter1 | Carry-forward |
| **F-R-04** | `design_flaw` | `process` | partially addressed | 50 | Medium (reduced from High) | iter1 sub-findings (F-U-01, F-P-05, F-C-01, F-C-05) all addressed at bundle scope; new sub-findings (F-U-NEW-01, F-C-06) introduced | Net improvement; first-run still has some failures but fewer & lower-severity |
| **F-R-05** | `assumption_risk` | `docs-sync` | open | 75 | Medium | evaluator.md:41-44 path templates `{target-type}/evaluation/{perspective}.md` — `agents/evaluation/`, `rules/evaluation/`, `project/evaluation/` do not exist | iter1 unchanged |
| **F-R-06** | `design_flaw` | `process` | open | 75 | High | No subagent self-escalate-on-wrong-phase status; F-P-06 helped specific case but contract gap remains | Same as iter1 |
| **F-R-07** | `design_flaw` | `process` | partially addressed | 50 | Medium (reduced from High) | mistake skill now exists in bundle; missing-skill failure-mode contract still absent | Acute symptom closed; underlying gap remains |
| **F-R-NEW-01** | `design_flaw` | `process` | open | 50 | Medium | assistant.md:18 sole-writer + sonnet model + user-facing decisions concentrated in one role | New risk shape introduced by Task C+F; mitigated by EVALUATION gate + user-in-the-loop |

## Per-perspective verdict

**REVISE** — F-R-06 (High/75, unchanged from iter1) is the only High remaining. F-R-04 and F-R-07 reduced from iter1 High to iter2 Medium. No Critical findings. Net Risk profile: better than iter1 (iter1 was FAIL on 3 Highs).

Per the rule: any High with confidence ≥ 50 → REVISE. F-R-06 = High/75. → **REVISE**.

## Low-confidence appendix

(none below threshold)
