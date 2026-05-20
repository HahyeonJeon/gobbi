# Risk Perspective — 5-Role Agent Taxonomy (iter4, claude)

## Artifact Summary + W/W/H

See `project.md`. Risk = blast radius, reversibility, security surface, two-week smell, Principle 2 enforcement.

## Memory reads

- `iter3/claude/risk.md` (inheritance — F-R-06 stuck High; F-R-iter3-NEW-01 High/100 regression closed by Sweep 1)
- `agents/*.md`
- `skills/delegation/SKILL.md` § Model Selection
- `skills/git/SKILL.md` Forbidden Operations
- `skills/orchestration/workflow/preparation.md`
- `skills/wrap-up/SKILL.md` + `skills/preparation/SKILL.md` Memory Access Matrices

## Locked Frame (Stage 1)

### S-R-1 (inherited): Rollback path

### S-R-2 (inherited, open): Blast radius (F-R-01)

### S-R-3 (inherited, open): Min-privilege tool surfaces (F-R-02 + F-S-02)

### S-R-4 (adversarial inherited, open): Scope drift (F-R-03)

### S-R-5 (inherited): Concurrency / race

### S-R-9 (inherited): Two-week smell (F-R-04)

### S-R-10 (inherited, stuck): Manager misroute recovery (F-R-06)

### S-R-12 (inherited, open partial): Missing-skill failure mode (F-R-07)

### S-R-13 (inherited iter2 NEW): Sole-writer single-point-of-failure (F-R-NEW-01)

### S-R-15 (iter3 NEW): Fix 2 / Sweep 1 incomplete sweep — runtime Principle 2 enforcement risk

### S-R-18 (NEW iter4 adversarial): Sweep 4 introduces a runtime risk — leader executing project-memory writes per preparation.md:64+72 violates the sole-writer contract

### S-R-19 (NEW iter4 adversarial): Sweep 2 stale mistake-skill claim — runtime risk?

### S-R-20 (NEW iter4 adversarial): Sweep 1 removed AskUserQuestion from subagent tools — did it remove a needed escape hatch?

## Per-scenario per-check results (Stage 2)

### S-R-1 to S-R-5 — carry from iter3

### S-R-9 (F-R-04 — two-week smell)
- iter3 sub-findings F-U-iter3-NEW-01 + F-C-iter3-NEW-02/03 + F-R-iter3-NEW-01 closed by Sweep 1 ✓
- iter4 introduces F-P-iter4-NEW-01 + F-S-iter4-NEW-01 + F-U-iter4-NEW-02 (preparation contradiction; same finding viewed from 3 perspectives) — new first-run failure mode
- iter4 also introduces F-P-iter4-NEW-02 + F-U-iter4-NEW-01 (mistake skill contradiction)
- Net first-run failure surface: shifted but not improved
- → **F-R-04 disposition: partially addressed; new failure modes from incomplete iter4 sweep**

### S-R-10 (F-R-06 — manager misroute recovery)
- No change. Still no subagent self-escalate-on-wrong-phase status.
- → **open (stuck across iter1-4, High/75)**

### S-R-12 (F-R-07) — open partial (carry)

### S-R-13 (F-R-NEW-01) — partially addressed (carry from iter3 Fix 2)

### S-R-15 (iter3 Sweep 1 verification — Principle 2 runtime enforcement)
- leader.md:4 + executor.md:4 + evaluator.md:4 + assistant.md:4 — NONE grant AskUserQuestion ✓
- Subagent at runtime literally CANNOT call AskUserQuestion — the tool is not granted at the harness level
- Prose discipline ("Do NOT call AskUserQuestion directly") is now backed by frontmatter contract
- → **F-R-iter3-NEW-01 disposition: addressed (Sweep 1)**

### S-R-18 (NEW iter4 adversarial — Sweep 4 runtime risk)
- preparation.md:64+72 imperative-prose says leader "stamps missing skills" + "applies missed memory promotions" + "New skills are actually stamped in this phase"
- A fresh leader subagent loading this doc gets instruction to write to `.gobbi/projects/{project-name}/skills/` (project memory) — VIOLATING the Wrap-up-sole-writer contract
- The leader's frontmatter `tools:` includes `Write` (per leader.md:4) — so the write would succeed at the harness level
- Blast radius: a leader writing to project memory during Preparation bypasses Wrap-up's audit trail (promotion-manifest.md), idempotency, supersession contract, and routing-table discipline
- Compensating control: leader.md:15 policy "your `Write` access is for ideation / preparation / research / planning **artifacts only**" — should catch this IF the leader reads its own role file AND prioritizes role file over orchestration file
- Mitigation precedence: leader reads preparation.md (per Load Directives) BEFORE preparation/SKILL.md (role) — but the manager-supplied delegation prompt typically lists role skill explicitly. The exact precedence depends on what the manager puts in the Load Directives block.
- Runtime risk: a leader operating on the orchestration/workflow/preparation.md mental model writes directly to project memory; project memory loses Wrap-up's audit trail
- → **F-R-iter4-NEW-01** (High/100 — Principle 2 + sole-writer-contract enforcement gap at runtime)

### S-R-19 (NEW iter4 adversarial — Sweep 2 mistake skill runtime)
- A fresh subagent in any role reads gobbi/SKILL.md (entry-point skill MUST load at session start per CLAUDE.md)
- Reads line 154: "There is no separate `mistake` skill."
- Then reads its delegation prompt Load Directives: "mistake skill (mandatory)"
- The subagent now has conflicting information; the most-likely failure mode is the subagent tries to load the skill, succeeds (file exists), and proceeds — but with cognitive dissonance noted in its working context
- Alternative failure mode: the subagent decides gobbi/SKILL.md is authoritative (it loaded first and is the entry-point), skips loading skills/mistake/, and operates without the past-pitfall context
- The blast radius of skipping the mistake skill: the subagent commits a known-pitfall mistake that the mistake skill would have caught
- Mitigation: the file exists; the manager-supplied Load Directives can override; CLAUDE.md mandates loading
- Net runtime risk: Medium (depends on subagent's resolution heuristic) — but the impact-if-realized is High (committing a known-mistake)
- → **F-R-iter4-NEW-02** (High/75 — load-order-dependent runtime risk of skipping the mistake skill)

### S-R-20 (NEW iter4 adversarial — AskUserQuestion removed; escape hatch?)
- Before Sweep 1: subagents could call AskUserQuestion directly (violating prose discipline) but had a tool-grant escape hatch for emergencies
- After Sweep 1: subagents have NEEDS_CONTEXT-only path; no harness-level fallback
- Failure mode: if the manager is stuck and the subagent needs urgent user input, the subagent's only path is NEEDS_CONTEXT → manager re-spawn → AskUserQuestion. Adds 1 hop of latency.
- Compensating control: NEEDS_CONTEXT escalation is the documented contract; the manager's job is to handle it promptly. The 1-hop latency is the discipline cost.
- For solo-user, the latency is acceptable; the Principle 2 enforcement gain is worth more than the harness-level fallback
- → no NEW finding (Sweep 1 made the discipline contract harder, which is intended)

## Typed findings (Stage 2)

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence | Why it matters |
|---|---|---|---|---|---|---|---|
| **F-R-01** | `general` | `process` | open (carry) | 50 | Medium | Carry | Carry |
| **F-R-02** | `assumption_risk` | `security` | open (carry) | 75 | Medium | Carry | Carry |
| **F-R-03** | `general` | `process` | open (carry) | 50 | Medium | Carry | Carry |
| **F-R-04** | `design_flaw` | `process` | partially addressed | 50 | Medium | iter3 sub-findings closed; iter4 introduces new ones | Same shape as iter2/iter3 |
| **F-R-05** | `assumption_risk` | `docs-sync` | **addressed (Sweep 3)** | 100 | n/a | evaluator.md paths rewritten with negative ratchet | iter3 stuck-3-iter finding closed |
| **F-R-06** | `design_flaw` | `process` | **open (stuck iter1-4)** | 75 | High | No subagent self-escalate status; no manager misroute recovery | Stuck 4 iters |
| **F-R-07** | `design_flaw` | `process` | open partial (carry) | 50 | Medium | Missing-skill contract still absent (and iter4 makes it WORSE per F-R-iter4-NEW-02) | Worsened by gobbi/SKILL.md mistake-skill contradiction |
| **F-R-NEW-01** | `design_flaw` | `process` | partially addressed (carry) | 25 | Low | Mitigated by Sweep 1 + Sweep 2 routing | Mitigated |
| **F-R-iter3-NEW-01** | `design_flaw` | `process` | **addressed (Sweep 1)** | 100 | n/a | leader.md + executor.md frontmatter cleansed; Principle 2 backed by frontmatter contract | iter3 regression closed |
| **F-R-iter4-NEW-01** | `design_flaw` | `process` | **open (NEW iter4)** | 100 | **High** | preparation.md:64+72 prose instructs leader to write project memory directly; bypasses Wrap-up sole-writer contract; leader.md:4 grants Write tool so the write succeeds at harness level | Sole-writer contract violation at runtime |
| **F-R-iter4-NEW-02** | `design_flaw` | `process` | **open (NEW iter4)** | 75 | **High** | gobbi/SKILL.md:154 "no separate `mistake` skill" + skills/mistake/ exists. Load-order resolution can result in subagent skipping the mistake skill | Blast radius: committing a known-mistake the mistake skill would have caught |

## Per-perspective verdict

**REVISE** — F-R-06 stuck High/75 + F-R-iter4-NEW-01 High/100 + F-R-iter4-NEW-02 High/75 (3 Highs). Plus F-R-07 worsened by F-R-iter4-NEW-02.

Per the rule: no Critical ≥ 75; three Highs → **REVISE**.

iter3 verdict was REVISE; iter4 closes F-R-iter3-NEW-01 + F-R-05 (good) but introduces 2 new High-severity runtime-risk findings of the same partial-sweep shape. The stuck F-R-06 survives a 4th iter.

The bundle is structurally close to passing on Risk — the iter3 frontmatter contradiction is gone — but the Preparation orchestration doc and the gobbi/SKILL.md mistake-claim each create new runtime risks. Each is a one-line fix.

## Low-confidence appendix

(none)
