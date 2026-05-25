# Risk Perspective — Preparation Readiness Evaluation

**Phase:** preparation | **Iter:** 1 | **System:** claude | **Perspective:** risk

---

## Artifact Summary + Memory reads

(See project.md for full summary. Risk evaluates blast radius, reversibility, and whether missed prerequisites will bite Execution.)

### Memory reads
- `preparation/evaluation.md` § Risk seed scenarios
- `mistakes/skills-mirror-symlinks-not-copies.md` — mirror model
- `mistakes/executor-mirror-path-vs-worktree-physical-copy.md` — worktree isolation
- `mistakes/executor-main-tree-edit-near-miss.md` — main-tree edit risk
- `wrap-up/staging/decisions/manager-substituted-self-verification-for-mandatory-dual-system-eval.md` — process mistake
- `planning/rawdata/draft-iter1.md` — how planning relied on readiness

---

## Locked Frame (Stage 1)

### S1 — No Preparation write went directly to project memory (Wrap-up sole-writer contract)
- Checklist: all generate-now outputs staged under `preparation/staging/`, not written to `.gobbi/projects/.../skills/` or `features/`; Decisions log does not reference a direct project-memory write.

### S2 — RE-IDEATE triggers caught and escalated or explicitly ruled out
- Checklist: each gap assessed for RE-IDEATE vs generate-now; explicit "no RE-IDEATE" statement with evidence.

### S3 — Deferred items not silently lost
- Checklist: each deferred item has a pointer to where it was backlogged; no item described with only "TBD" or "later".

### S4 (adversarial) — Staged skill slugs will not collide with existing project skills on Wrap-up promotion
- Checklist: no slug collision; not applicable here (no skills staged).

### S5 — Privacy / data retention
- not-applicable: preparation artifacts contain no PII.

### S6 — License / IP risk
- not-applicable: no skills were generated; no external patterns codified.

### S7 — Cost / budget impact
- not-applicable: preparation produces local markdown files only.

### S8 (adversarial) — Process: dual-system evaluation mandate applied, not substituted
- Checklist: this evaluation was spawned as a dual-system evaluator subagent (not a manager-verification substitute); the mistake `manager-substituted-self-verification-for-mandatory-dual-system-eval.md` is being avoided.

---

## Per-scenario per-check results

### S1 — Wrap-up sole-writer contract
- PASS: no evidence of direct project-memory writes during Preparation. `preparation/staging/` directory does not exist (no files staged). The readiness note does not reference any project-memory write. Verification: `find preparation/ -type f` = only `rawdata/readiness.md`. 
- NOTE: The sole-writer contract for the Preparation phase is satisfied. The post-preparation Execution commit (90c46fd, `feat(memory): ship memory-system standard core`) wrote DIRECTLY to project memory (`skills/memorization/rules.md`, `skills/delegation/*.md`, `skills/principles/SKILL.md`) — this was the Execution loop's commit, not Preparation. That is the correct path (Execution executor writing to the canonical worktree-branch skill files is how the design is supposed to work).

### S2 — RE-IDEATE triggers evaluated
- PARTIAL PASS: the readiness note says "No generate-now project skills required" implying no RE-IDEATE was needed. However, no explicit "no RE-IDEATE escalation required" statement is present. Given the depth of Ideation (3 iterations, dual-system evaluation with FAIL→REVISE→PASS), RE-IDEATE risk is low.
- CONCERN: `preparation/evaluation.md` § Risk explicitly checks "The artifact explicitly states 'no RE-IDEATE escalation required' or names the escalation that was made." The note is silent.

### S3 — Deferred items not silently lost
- FAIL: FLAG-2 and L8 are noted as "file follow-up backlog at Wrap-up." No staging/decisions files exist for them. The Wrap-up staging for this session contains only one decision file (`manager-substituted-self-verification-for-mandatory-dual-system-eval.md`) — the process mistake about dual-system eval skipping. The FLAG-2 and L8 follow-ups are currently untracked in staging.
- RISK: if the Wrap-up phase runs without catching these, the follow-ups will be lost. The readiness note's promise "file follow-up backlog at Wrap-up" requires Wrap-up to remember this — a human dependency, not a staged artifact.

### S4 — Slug collision
- not-applicable: no skills staged.

### S8 — Dual-system evaluation mandate
- PASS (for this evaluation): this evaluation IS being run as a dual-system evaluator subagent (the stated corrective pass). The wrap-up staging mistake-candidate explicitly documents the prior violation. The corrective pass is happening.
- RISK: The prior Preparation, Planning, and Execution phases all used manager-verification instead of dual-system evaluators. Execution (commit 90c46fd) shipped W0 core before this corrective evaluation was completed. This means Execution ran on a preparation readiness note that was never properly evaluated. The readiness correctness must now be verified post-hoc.

---

## Typed findings

### F-RISK-01: Deferred follow-up items not staged — loss risk at Wrap-up
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** `preparation/rawdata/readiness.md` lines 13-14 promise "file follow-up backlog at Wrap-up" for FLAG-2 and L8. `find sessions/.../preparation -name "*.md"` = only `rawdata/readiness.md`. No staging files exist. If Wrap-up runs without the evaluator forcing attention to these, the follow-ups are lost.
- **Why it matters:** FLAG-2 (missing claude doc-standard skill + dangling CLAUDE.md link) is a real technical debt item. L8 (skills/agents canonical-location contradiction) is a known memory-map inconsistency. "Will file at Wrap-up" is not equivalent to "has been staged for filing at Wrap-up."
- **Suggested direction:** Create `preparation/staging/decisions/flag-2-claude-skill-absent.md` and `preparation/staging/decisions/l8-skills-agents-location-contradiction.md` now.

### F-RISK-02: Execution shipped before preparation evaluation completed
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** `memorization/rules.md` commit timestamp: 2026-05-25 20:34 UTC. `readiness.md` modification timestamp: 16:55 UTC. This evaluation is part of a corrective pass that the manager acknowledged ("wrongly skipped dual-system evaluation for this phase"). Execution's W0-core commit (90c46fd) shipped before preparation was properly evaluated.
- **Why it matters:** If the preparation readiness assessment had flaws that would have caused a REVISE (as this evaluation is finding), those flaws were not caught before Execution ran. The shipped code (rules.md + delegation wiring + Principle 13) went in without the preparation gate functioning as designed.
- **Suggested direction:** This is a process risk, not a correctness risk (the shipped content is correct per live-tree verification). But it must be documented as a mistake-candidate so the pattern doesn't repeat.

### F-RISK-03: No explicit RE-IDEATE ruling
- **Type:** checklist_gap
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** `preparation/evaluation.md` § Risk: "The artifact explicitly states 'no RE-IDEATE escalation required' or names the escalation that was made." The readiness note is silent.
- **Why it matters:** Low severity because RE-IDEATE risk is effectively zero here (3-iteration Ideation with dual-system evaluation).
- **Suggested direction:** Add one line: "RE-IDEATE: not triggered. Design is workable; all gaps are execution-time, not design-time."

---

## Low-confidence appendix

(None)

**Per-perspective verdict: REVISE** (F-RISK-01 = High/100; F-RISK-02 = High/100 — both trigger REVISE threshold)
