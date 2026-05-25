# Perspective: Project — Planning iter1 Evaluation (claude system)

## Artifact Summary + Memory reads

**What:** A 26-task, 6-wave plan (draft-iter1.md) decomposing the memory-system-redesign design into an ordered, executor-runnable sequence. Waves: W0 (standards authoring, 10 tasks), W1 (frontmatter fixes, 3), W2 (slug renames, 3), W3 (feature re-homing, 6), W4 (session cleanup, 1), W5 (follow-ups + final verify, 3).

**Why:** The locked design (ideation/artifacts/memory-system-redesign-design.md, iter2 PASS) mandates propagating the new memory-rules standard into 13 skill/template targets (§7) and migrating 136 md files across 4 sprint-features into 7 value-feature dirs (§8). Planning decomposes that into committable waves.

**How:** Standards-first ordering (W0 before any migration). W0-T10 is the hard gate before W1-W5. W3 sub-waved by source sprint; W3-T3 (Bundle B, 101 files) split into 6 per-subdir sub-commits for resumability.

**Scope Contract source:** `planning/rawdata/draft-iter1.md` § Scope reference — decompose §7 + §8 of the locked design. Out of scope: `skills/`+`agents/` relocation (L8), `claude` skill creation (FLAG-2), retro-sweep of closed sessions (RATIFY-7), re-opening any lock.

**Downstream consumers:** Executor agents (one task at a time); W3 may run in a dedicated follow-on session.

**Memory reads:**
- `ideation/artifacts/memory-system-redesign-design.md` (full read, §7/#8 propagation targets + migration categories)
- `ideation/rawdata/locked-decisions.md` (L1-L8)
- `.gobbi/projects/gobbi/mistakes/` (all 21 .md files, scanned for process/docs-sync domains)
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- Live tree verification: features/ counts, decisions/ contents, memorization/templates/ count, mistakes/ count, git log for 90c46fd

---

## Locked Frame (Stage 1)

### Scenario 1: Every Ideation deliverable is covered by at least one plan task
**Attached checklist:**
- [ ] All 13 §7 propagation targets have a plan task
- [ ] §8 cat A (136 md feature re-homing) has a plan task
- [ ] §8 cat B (slug renames, ~12-17) has a plan task
- [ ] §8 cat C (frontmatter fixes, ~25-30) has a plan task
- [ ] §8 cat D (session cleanup, going-forward only) has a plan task
- [ ] §8 cat E (standards authoring = §7 targets) is covered by W0

### Scenario 2: No task implements something outside the Ideation Scope Contract
**Attached checklist:**
- [ ] No task relocates `skills/` or `agents/` dirs (L8)
- [ ] No task creates the `claude` doc-standard skill (FLAG-2)
- [ ] No task performs a retro-sweep of closed sessions (RATIFY-7)
- [ ] No task re-opens any locked decision (L1-L8)

### Scenario 3: Plan terminal state matches Ideation success criteria (adversarial)
**Attached checklist:**
- [ ] After W5-T3, all 13 §7 targets are edited (standards propagated)
- [ ] After W5-T3, all 136 sprint-feature md files re-homed
- [ ] After W5-T3, all blocklist-pattern filenames eliminated from project memory
- [ ] After W5-T3, all `mistake-candidate` flags stripped from mistakes/
- [ ] After W5-T3, all 7 capability feature dirs exist with READMEs
- [ ] Final Gate Suite (W5-T3) catches all violations

### Scenario 4 (adversarial): A "while we're here" task slips into the plan
**Attached checklist:**
- [ ] W0-T8 groups 3 independent skill-doc edits (gobbi/evaluation/mistake) — is this bundled scope?
- [ ] W1-T3's "any other memory file missing base frontmatter (sweep)" — is the scope bounded?
- [ ] W4-T1's "opportunistic" tmp/ removal — is scope bounded to "going-forward only" per RATIFY-7?

### Scenario 5 (adversarial): Already-executed tasks remain marked as outstanding
**Attached checklist:**
- [ ] W0-T1 (Principle 13 + CLAUDE.md) — already committed in 90c46fd; marked as done?
- [ ] W0-T2 (rules.md + symlink) — already committed in 90c46fd; marked as done?
- [ ] W0-T9 (delegation wiring) — already committed in 90c46fd; marked as done?
- [ ] Operational Fact 5 ("rules.md symlink CREATED") — stale (already exists); updated?

---

## Per-scenario per-check results (Stage 2)

### Scenario 1: Coverage of Ideation deliverables

**§7 propagation targets (13) coverage:**
- #1 principles/SKILL.md → W0-T1 ✓
- #2 .claude/CLAUDE.md → W0-T1 ✓
- #3 memory-map.md → W0-T3 ✓
- #4 memorization/rules.md (NEW) → W0-T2 ✓
- #5 memorization/SKILL.md → W0-T4 ✓
- #6 wrap-up/SKILL.md → W0-T6 ✓
- #7 orchestration/SKILL.md + workflow/*.md → W0-T7 ✓
- #8 memorization/templates/*.md (17 files) → W0-T5 ✓
- #9 rules/stub-redirect-format.md → W1-T2 ✓
- #10 gobbi/SKILL.md → W0-T8 ✓
- #11 evaluation/SKILL.md → W0-T8 ✓
- #12 mistake/SKILL.md → W0-T8 ✓
- #13 delegation/SKILL.md + 4 templates → W0-T9 ✓

All 13 targets covered. PASS.

**§8 cat A (136 md re-homing):** W3-T0 through W3-T5 — covered. PASS.

**§8 cat B (slug renames):** W2-T1 (5 backlogs), W2-T2 (1 learning), W2-T3 (orch decisions) — partially covered. **FAIL — see Finding PJ-01.**

**§8 cat C (frontmatter fixes):** W1-T1 (17 mistakes), W1-T2 (rules stub-redirect), W1-T3 (design+learnings sweep) — covered. PASS.

**§8 cat D (session cleanup):** W4-T1 — covered. PASS.

### Scenario 2: No out-of-scope tasks
All tasks stay within the locked scope. PASS.

### Scenario 3: Terminal state vs success criteria
After W5-T3, all standards tasks run (assuming W0-T10 gate passes) and all re-homing done. The Final Gate Suite (W5-T3) would check for `ideation-decisions.md` in features/ — but env-var-audit's decisions contain `ideation-decisions.md` and similar violations that W3-T1 re-homes AS-IS without splitting. **FAIL — see Finding PJ-01.**

### Scenario 4: "While we're here" scope bundling
- W0-T8 groups gobbi/evaluation/mistake — these are three distinct skill domains but the edits are small and reciprocal to the overall standard. The bundling has a reason (one category: skill-doc alignment) and each file touch is design-mandated. This is on the boundary but the plan justifies it. MARGINAL PASS.
- W1-T3 "any other memory file missing base frontmatter (sweep)" — the scope is unbounded. An executor could sweep any number of files. **MEDIUM concern — see Finding PJ-02.**
- W4-T1 stays within RATIFY-7 scope. PASS.

### Scenario 5: Already-executed tasks
W0-T1, W0-T2, W0-T9 are all committed in 90c46fd (verified). The plan does NOT mark them as done or skippable. **FAIL — see Finding PJ-03.**

Operational Fact 5 says symlink "CREATED" but it already exists. Same problem. **FAIL — see Finding PJ-03.**

---

## Typed findings (Stage 2)

### PJ-01
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** `env-var-audit/decisions/` contains 4 blocklist-violating files: `ideation-decisions.md`, `planning-decisions.md`, `preparation-decisions.md`, `t1-decisions.md` (verified by `ls` on live tree). W2-T3 only handles `features/gobbi-orchestration-workflow-improvements/decisions/` and has no dependency from W3-T1 (env-var-audit re-homing). W3-T1 would re-home all 7 env-var-audit files as-is. W5-T3's Final Gate `find .gobbi/projects/gobbi/features -name 'ideation-decisions.md'` would catch this failure *after* the fact.
- **Why it matters:** Env-var-audit's blocklist-violating decision files are re-homed without splitting, landing in install-runtime/decisions/ with non-compliant slugs. The Final Gate fails, requiring a recovery pass that was not planned.
- **Suggested direction:** Either add a W2-T3b task to split env-var-audit bundle decisions before W3-T1 runs (adding W3-T1 dependency on it), or expand W3-T1's "how" to include splitting the 4 bundle files as first step before re-homing.

### PJ-02
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W1-T3 `what`: "any other memory file missing base frontmatter (sweep)" with `files-in: [.gobbi/projects/gobbi/design/*.md, .gobbi/projects/gobbi/learnings/*.md (modify), any swept file]`. The "any swept file" has no upper bound. Executor could sweep backlogs/, references/, decisions/ etc., expanding scope beyond §8 cat C's "~25-30 files" estimate.
- **Why it matters:** Scope creep mid-task with no clear stopping condition, or executor conservatively under-sweeping and missing files that fail the Final Gate.
- **Suggested direction:** Bound W1-T3 to explicit directory list: design/, learnings/, rules/ (the three dirs the design identifies as having ad-hoc frontmatter). Separate backlogs/references sweep to W5-T3 or accept that those pass inspection.

### PJ-03
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** Commit 90c46fd (verified by `git log`) shipped: principles/SKILL.md (Principle 13 added), .claude/CLAUDE.md (13 principles), memorization/rules.md (created), .claude/skills/memorization/rules.md symlink (created), delegation/SKILL.md + 4 templates (rules.md wired). The plan's W0-T1, W0-T2, W0-T9 are listed as tasks to execute with no "done", "skip", or "already shipped" marker. Operational Fact 5 says the symlink "CREATED" (imperative future) but it already exists.
- **Why it matters:** An executor running W0-T1 would attempt to re-insert Principle 13 into an already-updated file, likely producing duplicate content or a confusing diff. W0-T2 would attempt to re-create rules.md (which exists) and re-create the symlink. W0-T9 would attempt to re-wire delegation templates already containing the rules.md line.
- **Suggested direction:** Mark W0-T1, W0-T2, W0-T9 as "DONE — committed in 90c46fd, skip" in the task YAML (or remove them from the task list and note in the header). Update Operational Fact 5 to reflect the symlink already exists.

---

## Low-confidence appendix

None surfaced below threshold.

---

**Per-perspective verdict: REVISE**
Rationale: Two High findings (PJ-01 env-var-audit split gap; PJ-03 already-completed tasks not marked done) at Confidence 100. PJ-02 is Medium/75.
