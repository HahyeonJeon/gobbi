# Perspective: Structure — Planning iter1 Evaluation (claude system)

## Artifact Summary + Memory reads
(Same artifact as Project perspective — see project.md § Artifact Summary.)

**Memory reads:** Same as project.md. Additionally scanned dependency table and parallel lanes section for cycle detection.

---

## Locked Frame (Stage 1)

### Scenario 1: Dependency graph is acyclic (DAG)
**Attached checklist:**
- [ ] No circular dependency exists in the `requires:` fields
- [ ] A topological sort of all tasks produces the documented wave ordering

### Scenario 2: Every task is narrow enough for a fresh Executor
**Attached checklist:**
- [ ] No task spans more than ~8 files (per planning/evaluation.md heuristic)
- [ ] Task titles are imperative-form and specific
- [ ] Each task's `how` gives the first step unambiguously

### Scenario 3: File-touch sets are bounded and non-conflicting
**Attached checklist:**
- [ ] File overlap between tasks is encoded as sequential dependency
- [ ] No two tasks silently modify the same file with conflicting intent

### Scenario 4: Each task's verification step is concrete
**Attached checklist:**
- [ ] Each `verifies:` field has runnable grep or file-existence commands
- [ ] No `verifies:` is empty or says "see Ideation"
- [ ] Verification commands resolve from a well-defined working directory

### Scenario 5: Agent type per task matches the work
**Attached checklist:**
- [ ] Opus assigned to judgment-heavy tasks (principle prose, template consolidation, bundle routing)
- [ ] Sonnet assigned to mechanical tasks with clear specs
- [ ] No task assigned to a non-executor agent type without justification

### Scenario 6 (adversarial): A task is secretly multi-step or mega-scale
**Attached checklist:**
- [ ] W0-T5 (17 templates) — is one task too large for one context?
- [ ] W3-T3 (101 files, 6 sub-commits) — resumability within a single task delegation?
- [ ] W0-T7 (SKILL.md + 7 workflow/* files) — scope bounded?

### Scenario 7: W0 internal sequencing is sound
**Attached checklist:**
- [ ] W0-T2 (rules.md) before W0-T3 (memory-map cross-ref) — correctly sequenced
- [ ] W0-T3 before W0-T4 (SKILL.md staging-subdir) — correctly sequenced
- [ ] W0-T4 before W0-T5 (templates) — correctly sequenced
- [ ] W0-T5 before W0-T6 (wrap-up promotion allowlist) — correctly sequenced
- [ ] W0-T6 before W0-T7 (orchestration) — correctly sequenced

---

## Per-scenario per-check results (Stage 2)

### Scenario 1: DAG check
Topological sort from the dependency table:
- W0-T1 → W0-T2 → W0-T3 → W0-T4 → W0-T5 → W0-T6 → W0-T7 → W0-T8 → W0-T9 → W0-T10 → (all W1-W5)
- W1-T1, W1-T2, W1-T3 all require W0-T10 — correct
- W2-T1 requires W0-T10 — correct
- W2-T2 requires W1-T3 — correct (frontmatter fixed before rename)
- W2-T3 requires W0-T10 — correct
- W3-T0 requires W0-T10 — correct
- W3-T1 → W3-T2 (requires W2-T3) → W3-T3 → W3-T4 → W3-T5 — correct
- W4-T1 requires W0-T10 — correct
- W5-T1 requires W3-T5 — correct
- W5-T2 requires W1-T1 — correct
- W5-T3 requires all impl tasks — correct
No cycles detected. PASS.

**BUT: W3-T1 does NOT require W2-T3 or any "split-before-route" task for env-var-audit.** This is consistent with the plan's scope gap (PJ-01) — env-var-audit bundle decisions are not split before re-homing. From a structure standpoint, the missing dependency is the design_flaw's structural manifestation. FAIL (linked to PJ-01).

### Scenario 2: Task narrowness
- W0-T1: principles/SKILL.md + .claude/CLAUDE.md = 2 files, both targeted edits. PASS.
- W0-T2: 1 new file + 1 new symlink. PASS.
- W0-T5: 17 template files. Over the 8-file heuristic. However, each template edit is mechanical-with-spec; opus assigned. Flagged for awareness but not a blocker.
- W0-T7: SKILL.md + 7 workflow/*.md = 8 files, right at the limit. PASS (borderline).
- W0-T8: 3 skill files (gobbi/evaluation/mistake SKILL.md). Each is a small targeted edit. PASS for narrowness.
- W3-T3: 101 files — structurally huge, mitigated by 6 sub-commit clusters. PASS with caveat (see ST-01).

### Scenario 3: File-touch conflicts
W1-T3 and W2-T2 both touch `learnings/f-aes-01` — sequential (W2-T2 requires W1-T3). PASS.
W2-T3 and W3-T2 both touch `orch-feature/decisions/` — sequential (W3-T2 requires W2-T3). PASS.
W1-T1 and W5-T2 both touch `mistakes/` — sequential (W5-T2 requires W1-T1). PASS.

### Scenario 4: Verification realism
**Problem identified:** Multiple `verifies:` fields use relative paths like `skills/principles/SKILL.md`, `skills/memorization/memory-map.md`, `.claude/skills/memorization/...`. The plan's operational facts say the canonical path is `<worktree>/.gobbi/projects/gobbi/skills/X`, but the verification commands use bare `skills/...` relative paths. Without establishing a CWD, the executor cannot run these commands. **See Finding ST-01.**

**W0-T10 loop issue:** `for f in $(ls .claude/skills/memorization/); do readlink -e ".claude/skills/memorization/$f"` — `ls` on this directory returns `templates` (a real directory, not a symlink), which `readlink -e` on a directory handles silently. The loop does NOT distinguish symlinks from real directories. This means a broken symlink that has a real file replacement would pass this check. See Finding ST-02.

**W5-T3 archive check:** `ls .gobbi/projects/gobbi/archive/features/ | wc -l # 4` — `archive/features/` does not yet exist (verified: only `archive/backlogs/` and `archive/notes/` exist). If W3-T5 doesn't run (or partially runs), this gate errors (not returns 0). PASS because W5-T3 requires W3-T5 which creates it. Conditional pass.

All other `verifies:` fields have concrete grep/test commands. PASS overall minus the CWD issue.

### Scenario 5: Agent type assignment
Opus: W0-T1 (principle prose), W0-T2 (3-rule-set consolidation), W0-T5 (17 type specs), W2-T3 (atomic-concept splitting), W3-T0..T5 (judgment-heavy routing). Sonnet: mechanical tasks. All reasonable. PASS.

### Scenario 6: Mega-task identification
W3-T3 at 101 files is genuinely large. The plan says "may need its own context window" but the task is still a single delegation without a mandatory split point. If the executor hits context limits at cluster (d), there is no saved-state resume mechanism beyond "restart at the next cluster." PASS for design (clusters are committable checkpoints); flagged as assumption risk ST-03.

### Scenario 7: W0 sequencing
All 7 checks pass — the chain W0-T2→T3→T4→T5→T6→T7 is logically sound: rules.md authored before cross-ref, templates standardized before wrap-up promotion uses them, orchestration updated last in the chain. PASS.

---

## Typed findings

### ST-01
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 100
- **Severity:** High
- **Evidence:** The W0 Grep Gate Suite (plan §"Verification gate suites") uses paths like `skills/principles/SKILL.md`, `.claude/CLAUDE.md`, `.claude/skills/memorization/...` — all relative. The W4-T1 `verifies:` says `find sessions -type d -name tmp` where `sessions` is relative. The correct canonical path from the plan's own Operational Fact 1 is `<worktree>/.gobbi/projects/gobbi/skills/...`. Without a declared CWD for the executor, relative paths either fail (wrong directory) or silently succeed (if executor happens to cd correctly). The plan does not establish a CWD anchor anywhere.
- **Why it matters:** Executor runs grep gates from the wrong directory → all verification gates silently pass or silently fail. P7 violation.
- **Suggested direction:** Add a CWD preamble to each verify block, or convert all verify paths to the canonical worktree-absolute form matching Operational Fact 1.

### ST-02
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W0-T10 verify: `for f in $(ls .claude/skills/memorization/); do readlink -e ".claude/skills/memorization/$f" || echo "BROKEN $f"; done`. Running `ls .claude/skills/memorization/` in the worktree returns: `memory-map.md rules.md SKILL.md templates`. `templates` is a real directory; `readlink -e` on a directory succeeds (returns the path). The gate passes even if the `templates/` dir replaced a broken symlink.
- **Why it matters:** Broken symlinks under templates/ would be silently undetected by this verify.
- **Suggested direction:** Use `readlink -f` on specific known symlinks only, or use `test -L` to confirm each expected symlink is actually a symlink.

### ST-03
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W3-T3 (101 files, 6 sub-commit clusters) says "may need its own context window" but has no mandatory pause mechanism. If the executor runs out of context at cluster (d) and the session is abandoned mid-task, the next session inherits a partial state where some source files are moved and some are not. There is no mid-task checkpoint status document.
- **Why it matters:** Recovery from interrupted W3-T3 requires the executor to diff what moved vs. what remains — no plan spec for this recovery path.
- **Suggested direction:** Consider a pre-task progress manifest or note that the W3 session recommendation is mandatory (not just a "recommendation").

---

## Low-confidence appendix
None.

---

**Per-perspective verdict: REVISE**
Rationale: One High finding (ST-01: verification CWD not established). Two Medium/75 findings (ST-02, ST-03).
