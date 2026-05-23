# Structure Perspective — Planning Evaluation iter1

## Artifact Summary + Memory reads

Same as project.md. Plan: 7 executor tasks (T1-T7) + M1 manager-direct, linear chain. Single worktree.

**Memory reads:** same as project.md.

---

## Locked Frame (Stage 1)

### Scenario 1: Each task is narrow, ≤ 8 files, scope understood in one read
Checklist:
- [ ] T1: 1 file (NEW). Narrow.
- [ ] T2: 1 file. Narrow.
- [ ] T3: 1 file. Narrow, but has 6 sub-edits (a)-(f) — is this mega-task territory?
- [ ] T4: 11 files, same edit shape — bounded per-file. Acceptable bulk.
- [ ] T5: 2 files, 3 sections. Narrow.
- [ ] T6: 6 files, 9 lines. Narrow.
- [ ] T7: 0 files (verification only). Narrow.

### Scenario 2: Dependency chain is a DAG — no cycles, no implicit ordering
Checklist:
- [ ] T1→T2→T3→T4→T5→T6→T7→M1 is a strict linear chain — no cycles possible
- [ ] Every dependency is explicitly stated
- [ ] Topological sort matches documented order

### Scenario 3: Parallelizable tasks are correctly identified (or ruled out)
Checklist:
- [ ] Plan claims no parallel lanes — is this justified?
- [ ] T3 and T4 both touch skill docs; T3 → T4 ordering justified?
- [ ] T4 and T6 both touch 6 shared files — ordering enforced?

### Scenario 4: Verification steps are concrete
Checklist:
- [ ] Each task's verification block is a runnable bash command set
- [ ] No `<placeholder>` values except documented ones

### Scenario 5 (adversarial): Two tasks silently modify same file with conflicting intent
Checklist:
- [ ] T4 and T6 overlap on 6 files — line ranges verified disjoint?
- [ ] T3 and T4 — T4 explicitly excludes gobbi/SKILL.md?
- [ ] T5 and T6 — T5 is orchestration/SKILL.md, T6 is 6 P7 files; no overlap?

### Scenario 6: Agent type per task matches work's nature
Checklist:
- [ ] T1-T7 are executor tasks — appropriate?
- [ ] M1 is manager-direct — appropriate?

### Scenario 7: Worktree creation is explicitly owned (adversarial)
Checklist:
- [ ] Plan states manager creates worktree before T1 dispatch — is this sufficient specification?
- [ ] T1 dependency says "none (first task; cuts the worktree)" — is this accurate or misleading?

---

## Per-scenario per-check results

### Scenario 1: Task narrowness
**T1 (1 file):** PASS.
**T2 (1 file):** PASS.
**T3 (1 file, 6 sub-edits):** PASS with note. The 6 sub-edits are tightly related (all in the same section of the same file). Not a mega-task — the verification block is concrete single-file. Acceptable decomposition.
**T4 (11 files, same edit pattern):** PASS. All files have the same pattern; bulk edit with per-file verification loop. Structure sound.
**T5 (2 files, 3 sections):** PASS. Two distinct files but both part of the same logical change (schema + docs). Reasonable bundle.
**T6 (6 files, 9 lines):** PASS. Each line is a discrete context-aware edit.
**T7 (0 files):** PASS.

### Scenario 2: DAG correctness
T1→T2→T3→T4→T5→T6→T7→M1: PASS. Linear chain, no cycles. All `requires:` are explicit in the Dependencies field of each task.

Dependency rationale spot-check:
- T2→T3: T3 cites the installed hook + settings registration (Principle 8 docs-truth). VALID.
- T4→T5: Ordering keeps rename pass clean before schema extension. VALID.
- T5→T6: T6 cites `session.json.transcriptPath` as canonical; T5 establishes it. VALID.

**Dependency chain: PASS.**

### Scenario 3: Parallelization
Plan claims "no parallel lanes" because "every task touches doc surfaces whose verification depends on prior tasks' artifacts." This is accurate:
- T3 cites the actual hook installed by T1+T2
- T4 depends on T3's gobbi/SKILL.md being done first (canonical anchor)
- T5 depends on T4 so schema extension lands cleanly
- T6 depends on T5 (cites the transcriptPath field)

One mild missed opportunity: T1 (bash script) and T5 (orchestration SKILL.md + template) could conceivably run in parallel (no file overlap), but the plan's sequential ordering is safer and simpler. Principle 3 (bottom-up with user in loop) supports sequential. Not a defect.

**Parallelization: PASS (serial-safe choice, no missed required parallelism).**

### Scenario 4: Verification concreteness
**T1:** Concrete. Four `test`/`grep`/`bash` commands + fixture round-trip. PASS.
**T2:** Concrete. Four `jq -e` commands. PASS.
**T3:** Concrete. Six `rg` commands. PASS.
**T4:** Concrete. Loop script with per-file `rg -q` checks + `echo OK_T4`. PASS.
**T5:** Concrete. Four `jq`/`rg` commands. PASS.
**T6:** Concrete. Loop script + `rg -c` count check. PASS.
**T7:** Contains one placeholder: `git -C <worktree-path>` — the worktree path is not yet known at plan time because the worktree does not exist yet. This is a structural issue.

**Finding F-STR-01:**
- Type: `assumption_risk`
- Domain: `process`
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: plan.md line 287: `git -C <worktree-path> log --oneline develop..HEAD`
- Why it matters: The verification block in T7 contains `<worktree-path>` as a literal placeholder. The executor must know the actual path to run this command. The plan says "manager creates the worktree before T1 dispatch" but does not specify the path convention or how T7 will know it. The git skill (`git/SKILL.md:31-33`) likely has the convention, but the plan does not make it explicit.
- Suggested direction: Add a concrete path example or a reference to the git skill's worktree path convention (e.g., `.gobbi/projects/gobbi/worktrees/feat-env-var-audit-sessionstart-hook/`) in T7's How or verification block. The executor should not have to derive the path from context.

### Scenario 5: Cross-task file overlap
**T3 vs T4:** T4 explicitly excludes `gobbi/SKILL.md` in Files out-of-scope. VERIFIED. No conflict.

**T4 vs T6 (6 shared files):** Empirically verified line numbers:
- `preparation/SKILL.md`: T4 edits line 375 (CLAUDE_SESSION_ID), T6 edits line 330 (CLAUDE_TRANSCRIPT_PATH). DISJOINT. ✓
- `planning/SKILL.md`: T4 edits line 462, T6 edits line 417. DISJOINT. ✓
- `execution/SKILL.md`: T4 edits line 255, T6 edits line 208. DISJOINT. ✓
- `ideation/SKILL.md`: T4 edits line 465, T6 edits lines 407+415. DISJOINT. ✓
- `memorization/SKILL.md`: T4 edits line 227, T6 edits lines 20+146+155. DISJOINT. ✓
- `wrap-up/SKILL.md`: T4 edits line 325, T6 edits line 280. DISJOINT. ✓

All 6 shared files have confirmed disjoint line ranges. The plan's self-review claim is verified correct.

**T5 vs T6:** T5 files are `session.template.json` + `orchestration/SKILL.md`. T6 files are 6 P7 skill files. No overlap confirmed.

**File overlap: PASS.**

### Scenario 6: Agent assignment
T1-T7 executor: appropriate — all are file edits and verification commands within execution skill scope.
M1 manager-direct: appropriate — writes to session.json (main-tree session memory), which `git/SKILL.md:31-33` places outside executor's writable surface. PASS.

### Scenario 7: Worktree creation ownership (adversarial)
The plan states in the Agent Roster section: "The single worktree is shared across T1-T7; the manager creates it once before T1 dispatch."

T1's dependency field says "none (first task; cuts the worktree)" — this is slightly misleading. The phrase "cuts the worktree" implies T1 does the worktree creation, but T1's How steps do NOT include `git worktree add`. The worktree creation is a manager pre-dispatch action.

**Finding F-STR-02:**
- Type: `checklist_gap`
- Domain: `process`
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: plan.md line 45 (`Dependencies: none (first task; cuts the worktree)`) vs Agent Roster section (`manager creates it once before T1 dispatch`). T1 How steps (lines 37-42) contain no `git worktree add` command.
- Why it matters: The worktree creation is a prerequisite for all 7 executor tasks but is not a named task or explicit How step anywhere. It is mentioned only in the Agent Roster prose. An executor dispatched to T1 with the plan as context would not know to create the worktree first, because T1's How says `mkdir -p .claude/hooks/` as step 1. The "cuts the worktree" parenthetical is the only hint and it contradicts the Agent Roster.
- Suggested direction: Either (a) add a manager pre-dispatch step (M0) for worktree creation, or (b) explicitly add `git worktree add .gobbi/projects/gobbi/worktrees/feat-env-var-audit-sessionstart-hook feat/env-var-audit-sessionstart-hook` as T1 How step 0 (if the executor should create it).

---

## Typed findings

| ID | Type | Domain | Disposition | Confidence | Severity |
|----|------|--------|-------------|------------|----------|
| F-STR-01 | `assumption_risk` | `process` | open | 75 | Medium |
| F-STR-02 | `checklist_gap` | `process` | open | 75 | Medium |

## Low-confidence appendix

(none — all findings meet threshold)

**Structure perspective verdict: PASS** (two Medium findings, neither blocking)
