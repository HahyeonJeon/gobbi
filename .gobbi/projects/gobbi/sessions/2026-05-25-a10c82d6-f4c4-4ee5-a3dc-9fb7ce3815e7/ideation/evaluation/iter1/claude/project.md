# Project Perspective — Memory-System Redesign (iter1, claude)

## Artifact Summary + Memory reads

**What:** A complete design for gobbi's memory-system redesign, covering: (1) a 7-feature product-value map with skill-ownership and sprint-remapping, (2) 13 per-type specs with purpose/boundary/scope/naming/frontmatter/CRUD, (3) a session-memory spec, (4) a naming standard + temporal split + anti-pattern blocklist, (5) a frontmatter base+extensions standard, (6) Principle #13 full text, (7) a 12-target propagation plan, and (8) a 5-category migration plan.

**Why:** The existing `features/` directories are sprint records, not durable product capabilities; naming is inconsistent; 17 templates have no authoritative specs; frontmatter has staging-field drift; 3 cross-skill contradictions exist. The redesign fixes all.

**How:** 8 locked decisions (L1-L8) constrain the design. Audit + naming research grounded it. Design follows an investor/product-value lens for features, per-type specs for the 13 types, a temporal split for naming, a shared frontmatter base, and a new Principle #13.

**Scope Contract source:** `locked-decisions.md` (L1-L8 ratified by user).

**Downstream consumers:** Planner (task decomposition), Executor (skill/template/memory edits + migration), Wrap-up (promotion patterns).

**Memory reads:**
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/locked-decisions.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/memory-system-audit.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-25-a10c82d6-f4c4-4ee5-a3dc-9fb7ce3815e7/ideation/rawdata/naming-research-synthesis.md`
- `.claude/skills/memorization/memory-map.md`
- `.claude/skills/wrap-up/SKILL.md`
- `.claude/skills/principles/SKILL.md`
- `.gobbi/projects/gobbi/design/archive-move-on-terminal-model.md`
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `.gobbi/projects/gobbi/mistakes/*.md` (project-level mistakes)

---

## Locked Frame (Stage 1)

**S1: Root cause is correctly identified, not a symptom**
- Does removing the root cause (4 sprint-features misused as value-features + no type specs) make the work unnecessary? YES.
- Audit evidence cites concrete deviations (no skill doc for feature definition, templates allowing `status: shipped`). ✓

**S2: Scope Contract is sharp**
- L1-L8 are clearly bounded. L8 explicitly excludes skills/agents/ relocation. ✓
- Open item [RATIFY-1] is the only remaining gate item. ✓
- §11 FLAGS are properly deferred, not silently absorbed. ✓

**S3: "Why now?" is concrete**
- Trigger: the 4 existing feature dirs are sprint records; the feature model has no definition; templates have drift. All documented in audit. ✓

**S4: Counterfactual (adversarial)**
- Does the design take seriously the "do nothing" argument? The design flags that notes/ + features/ as-is could potentially continue to work. No explicit steel-man of do-nothing is presented.
- The framed problem section (§0) assumes the problem is self-evident without explicit counterfactual engagement. Medium gap.

**S5: No silent overlap with active features**
- Live features are sprint records (env-var-audit, bundle-a/b/c); the redesign explicitly proposes to re-home them. No silent overlap. ✓

**S6: Load-bearing assumptions stated (adversarial)**
- The design assumes: (a) all 18 skills can house under 7 features; (b) gobbi-install is a skill; (c) the migration is executable in one session; (d) the dual-tree mirror pattern holds. Assumptions (b) and (c) are not in an explicit assumption ledger; (b) is factually incorrect (see S7).

**S7: 18-skill housing math — CRITICAL CLAIM TO VERIFY**
- Design claims: `workflow(8) + project-memory(2) + agents(1) + evaluation(2) + guardrails(2) + git-workflow(1) + install-runtime(2) = 18`.
- Actual `.claude/skills/` contains 17 skills: codex, delegation, discussion, evaluation, execution, git, gobbi, ideation, interview, memorization, mistake, orchestration, planning, preparation, principles, research, wrap-up.
- The 18th is `_claude` (workspace-level, not in `.claude/skills/` — confirmed at `gobbi/SKILL.md:187`).
- `gobbi-install` (claimed as one of 2 in install-runtime) does NOT exist in `.claude/skills/`. There is no `gobbi-install/SKILL.md` anywhere in the `.claude/skills/` tree.
- The design maps `_claude` under `project-memory` and then puts a nonexistent `gobbi-install` under `install-runtime`. The math reaches 18 only by including a skill that doesn't exist.
- **This is a factual error** affecting the feature-skill ownership table and the claim "all 18 skills housed."

---

## Per-scenario per-check results

| Scenario | Result | Evidence |
|---|---|---|
| S1: Root cause vs symptom | PASS | Audit doc cites concrete deviations; removing no-spec + no-type-definition obviates the problem |
| S2: Scope Contract sharp | PASS | L1-L8 enumerated; L8 cleanly excludes skills/agents/; FLAGS deferred |
| S3: Why-now concrete | PASS | Audit facts: 4 sprint dirs, templates with sprint fields, 17 mistakes with staging flag retained |
| S4: Counterfactual steel-manned | PARTIAL FAIL | No "do nothing is fine because..." argument presented and rebutted |
| S5: No silent feature overlap | PASS | Sprint features are explicitly proposed for re-homing |
| S6: Load-bearing assumptions ledger | PARTIAL FAIL | Assumption (b) — gobbi-install as skill — is wrong. No explicit assumption ledger |
| S7: 18-skill count accurate | FAIL | gobbi-install does not exist in .claude/skills/; actual count is 17 + _claude workspace = 18 but math in design misidentifies one of the 18 |

---

## Typed findings

### F-PROJ-01 — 18-skill housing math contains a nonexistent skill

- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** Design §1.2 "install-runtime owns gobbi-install + interview (2 skills)." Verification: `ls .claude/skills/` returns 17 dirs with no `gobbi-install`. No `SKILL.md` path `*/gobbi-install/SKILL.md` exists anywhere in the worktree (confirmed `find` result empty). The `gobbi-install` referenced in MEMORY.md is a TypeScript CLI tool on a separate `redesign/v050-ideation` branch, not a `.claude/skills/` skill doc. The actual 18th skill is `_claude` (workspace-level), which the design correctly identifies as the 2nd skill under `project-memory`. Counting `_claude` as #18 there, install-runtime actually owns 1 skill (interview), not 2.
- **Why it matters:** The feature-skill ownership table in §1.2 is the authoritative map Planning and future Ideation agents use to determine which features own which skills. If the table claims install-runtime owns a skill that does not exist, Planning will generate tasks to work on a phantom artifact, and the math "all 18 skills housed" is incorrect. Feature boundaries derived from this table are unreliable until corrected.
- **Suggested direction:** Correct install-runtime to own 1 skill (interview). Either create the `gobbi-install/SKILL.md` file as part of this migration (with explicit scope for what it contains), or fold the install-runtime behavioral know-how into the existing skills (gobbi/SKILL.md or interview). The user decides whether to create a new skill here.

### F-PROJ-02 — No explicit counterfactual / steel-man for "do nothing"

- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** §0 (Orientation) and §8 (migration plan) assert the changes are needed without presenting the strongest "don't do this" argument. The audit supports the diagnosis but does not present: "the current state is workable because X; we reject that because Y."
- **Why it matters:** The ideation evaluation seed requires a steel-manned counterfactual. Without it, the design doesn't demonstrate it considered the cost/benefit tradeoff (notably: ~140 file migration is Large scope; the benefit vs. doing nothing is unstated).
- **Suggested direction:** Add a 2-3 sentence counterfactual ("the current sprint-feature model could continue if…") and explicitly state why it was rejected. Low lift.

---

## Low-confidence appendix

- Low confidence (25): The design's "~140 files" migration scope estimate — actual count is 132-137 non-README md files. Close enough to "~140" that this is not a factual error, just slight imprecision. Not flagged as a finding.

---

## Per-perspective verdict: REVISE

Rationale: F-PROJ-01 is High/100 (a concrete factual error in the feature-skill map that a Planner would build incorrect tasks from). F-PROJ-02 is Medium. High finding at confidence 100 → REVISE.
