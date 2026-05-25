# Perspective: Consistency — Planning iter1 Evaluation (claude system)

## Artifact Summary + Memory reads
(Same artifact as Project perspective — see project.md § Artifact Summary.)

---

## Locked Frame (Stage 1)

### Scenario 1: Plan's task list traces coherently to design's deliverables
**Attached checklist:**
- [ ] Every §7 propagation target maps to exactly one plan task
- [ ] Every §8 migration category is covered in the plan
- [ ] No "traces-to" dangling references

### Scenario 2: Plan counts agree with design counts
**Attached checklist:**
- [ ] 136-file count in plan matches design (7+22+101+6=136 including READMEs)
- [ ] 17-mistake count matches live tree
- [ ] 17-template count matches live tree
- [ ] 5 item-N-M backlogs in plan matches live tree
- [ ] 7 decision files needing split in W2-T3 matches live tree

### Scenario 3: Scope contract matches between plan header and task-level declarations
**Attached checklist:**
- [ ] Plan header Out-of-scope list matches individual task files-out exclusions
- [ ] No task contradicts the binding out-of-scope items

### Scenario 4: W0-core already-shipped status is consistent throughout the plan
**Attached checklist:**
- [ ] The "Locked operational facts" header consistency with the committed state
- [ ] W0-T1/T2/T9 task specs consistency with already-committed content

### Scenario 5 (adversarial): A task implicitly relies on a state introduced by a later task
**Attached checklist:**
- [ ] W0-T3 uses rules.md (requires W0-T2 which creates it) — correctly sequenced
- [ ] W3-T2 uses split files from W2-T3 (requires W2-T3) — correctly sequenced
- [ ] W5-T3 archive check depends on archive/features/ being created by W3-T5 — correctly sequenced

---

## Per-scenario per-check results (Stage 2)

### Scenario 1: Tracing to design
All 13 §7 propagation targets covered (verified task-by-task in project.md). §8 cat A-E all covered. PASS.

### Scenario 2: Count verification
- **136-file count:** Design says 7+22+101+6=136. Live tree: env-var-audit 7 (with README), Bundle A 22 (with README), Bundle B 101 (with README), Bundle C 6 (with README) = 136 total. Plan says 136. PASS.

- **17-template count:** Live tree: `ls .../memorization/templates/ | grep .md = 17`. Plan W0-T5 says "all 17 templates". PASS.

- **17-mistake files:** Live tree has 17 files with `mistake-candidate:true` (verified by grep). W1-T1 says "17 mistakes". PASS.

- **5 item-N-M backlogs:** Live tree has exactly 5 (verified). W2-T1 says "5 backlogs/item-N-M-*.md". PASS.

- **Bundle A decisions split (W2-T3):** Plan says "~9 bundle/positional files" in orch-improvements/decisions/. Live tree has exactly 9 files in that directory. PASS on raw count. However, only 5-6 of the 9 are actually blocklist violations (concern-1/2/3/5, iter1-user-redirects) — the others (codex-skill-assistant-wrapper, constraints-body-block, plan-diff-scope-gate, step-2-5-example) appear compliant. W2-T3 says to split ALL of them, which over-scopes the task. **See CN-01.**

- **W3-T3 "101 total renames":** The plan says "101 total renames across cluster commits." Actual cluster sum = 14+16+15+15+12+28 = 100. The 101st is the README, handled in W3-T5. Minor discrepancy; the W3-T3 verifies clause says "101 total renames across cluster commits" but should say "100." **See CN-02.**

### Scenario 3: Scope contract consistency
Plan header Out-of-scope matches task-level files-out exclusions. W4-T1 explicitly excludes state.json. W5-T1 files-out says "any skills/ or agents/ relocation (L8 — forbidden this session)." Consistent throughout. PASS.

### Scenario 4: W0-core consistency
Critical inconsistency: W0-T1/T2/T9 are listed as tasks to execute but are already committed in 90c46fd. Operational Fact 5 says "The memorization/rules.md NEW sibling needs its .claude/skills/memorization/rules.md symlink CREATED" — but it is already created. This was also flagged as PJ-03. From a consistency standpoint, the plan's Scope reference says "Locked Idea: iter2 PASS, manager-verified" but doesn't acknowledge that W0-core was already executed. **FAIL — same root cause as PJ-03.**

### Scenario 5: Forward dependency
All checked. W0-T3 correctly requires W0-T2. W3-T2 correctly requires W2-T3. W5-T3 correctly requires W3-T5 (plus all other implementation tasks). PASS.

---

## Typed findings

### CN-01
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W2-T3 what says "split + rename the bundle/positional decision files (ideation-decisions.md, iter1-user-redirects.md, concern-1..5-*.md)." The live directory has 9 files; the listed files account for 6 (ideation-decisions is not in orch-feature! — it's in env-var-audit — see PJ-01). The 3 unlisted files in orch-feature/decisions/ (`codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`, `constraints-body-block-convention-deferred-to-planning.md`, `plan-diff-scope-gate-semantics-under-bundled-pr.md`) are clean concept-slug files — no blocklist violation. W2-T3 says "~9 bundle/positional files" suggesting all 9 need splitting, but only ~5-6 do.
- **Why it matters:** Executor attempting to "split" already-compliant files (`codex-skill-assistant-wrapper-pattern-for-dual-system-eval.md`) would be doing unnecessary work and creating scope confusion. Or executor confused about which of the 9 to process.
- **Suggested direction:** W2-T3 should enumerate the exact blocklist-violating files by name (removing the ~9 approximation) and explicitly exclude the non-violating files.

### CN-02
- **Type:** design_flaw
- **Domain:** docs-sync
- **Disposition:** open
- **Confidence:** 100
- **Severity:** Low
- **Evidence:** W3-T3 `verifies`: "101 total renames across cluster commits." But the 6 sub-clusters (decisions 6 + scenarios 6 + plans 1 + changelogs 1 = 14; design 16; checklists 15; backlogs 15; references 12; discussions 28) sum to 100, not 101. The 101st file is the README.md, handled in W3-T5. Verified by `wc -l` on each subdir.
- **Why it matters:** Executor checking "101 total renames" would see 100 and re-check or flag a discrepancy, wasting time. The verify gate should match reality.
- **Suggested direction:** Change "101 total renames across cluster commits" to "100 total renames across cluster commits (README handled in W3-T5)."

---

## Low-confidence appendix
None.

---

**Per-perspective verdict: REVISE**
Rationale: One Medium/75 (CN-01: W2-T3 enumerates wrong files). One Low/100 (CN-02: W3-T3 rename count off by 1). W0-core inconsistency (linked to PJ-03, High/100) drives REVISE regardless.
