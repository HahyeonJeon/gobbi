# Perspective: Usage — Planning iter1 Evaluation (claude system)

## Artifact Summary + Memory reads
(Same artifact as Project perspective — see project.md § Artifact Summary.)

---

## Locked Frame (Stage 1)

### Scenario 1: A fresh Executor given one task alone can begin work
**Attached checklist:**
- [ ] Each task's `how` gives an unambiguous first step
- [ ] `files-in` lists the specific paths to open
- [ ] Verification commands are runnable as-is (no placeholders)

### Scenario 2: Executor knows which canonical path to edit
**Attached checklist:**
- [ ] Operational Fact 1 and the file map establish the canonical worktree-absolute path
- [ ] Every `files-in` entry can be resolved from Operational Fact 1
- [ ] No ambiguity between `.claude/skills/X` (symlink) vs `.gobbi/.../skills/X` (canonical)

### Scenario 3: The Executor knows what "done" looks like for each task
**Attached checklist:**
- [ ] Each `verifies:` is a concrete runnable command or existence check
- [ ] Verify commands match the task's intended output (not a proxy check)

### Scenario 4: Inter-task handoff is explicit
**Attached checklist:**
- [ ] W0-T2 produces rules.md → W0-T3 reads rules.md (cross-ref) — handoff explicit?
- [ ] W2-T3 split-out files → W3-T2 routes them — handoff explicit?
- [ ] W1-T3 frontmatter fix → W2-T2 rename — handoff explicit?

### Scenario 5 (adversarial): Executor needs to ask "what does X mean here"
**Attached checklist:**
- [ ] "going-forward + opportunistic only" (W4-T1) — is scope clear enough?
- [ ] "any swept file" (W1-T3) — is the Executor expected to decide what else to sweep?
- [ ] W3-T3's "default → git-workflow" routing rule — can the Executor apply it without the design doc?

---

## Per-scenario per-check results (Stage 2)

### Scenario 1: Fresh executor usability
Most tasks have a clear first step in `how`. W0-T1: "Read principles/SKILL.md; insert '## Principle 13' after Principle 12" — clear. BUT W0-T1 is already done (90c46fd) — executor starting here would produce a duplicate insertion. This is the PJ-03 gap manifesting at the usage level. **FAIL for W0-T1/T2/T9 — referenced from PJ-03.**

W3-T3's `how` provides the 6 cluster processing order — clear. W3-T1's `how` says "For each of the 7 files, read its content; git mv into <destination-feature>/<subdir>/" without specifying the destination subdir mapping. The routing heuristic is in the design doc (§8 LOW-16), not in the task itself. **See US-01.**

### Scenario 2: Canonical path clarity
Operational Fact 1 is explicit: `<worktree>/.gobbi/projects/gobbi/skills/X`. File map uses `<worktree>/.gobbi/projects/gobbi/` as prefix consistently. Good.

BUT: The verify commands in W0-T3 say `grep -q "session.json.lock" memory-map.md` — a relative path. An executor following Operational Fact 1 would need to be at the worktree root AND in the right subdirectory for this to resolve. Same as ST-01 but from the usage perspective. The CWD ambiguity makes every verify unreliable without additional context.

### Scenario 3: "Done" clarity
W0-T10 defers to "W0 grep gate suite all green" which requires the executor to scroll to the gate section. Acceptable cross-reference within the document. PASS.

W5-T3 similarly defers to "Final Gate Suite all green." PASS.

### Scenario 4: Inter-task handoffs
W0-T2 → W0-T3: W0-T3 requires W0-T2 in `requires`, and its `how` says "add the rules.md cross-reference link" — implies the file exists at that point. Explicit enough. PASS.

W2-T3 → W3-T2: W3-T2's `what` says "INCLUDING the W2-T3 split-out decision files." Handoff named. PASS.

W1-T3 → W2-T2: W2-T2 requires W1-T3 in `requires`, and W2-T2's `why` says "Its frontmatter ad-hoc-key fix already done in W1-T3." Explicit. PASS.

### Scenario 5: Ambiguous scope
W4-T1 "going-forward + opportunistic only": clarified in the why and in the files-out. Executor instructed to NOT touch the 5 state.json + 2 HANDOFF.md. Scope clear enough. PASS.

W1-T3 "any swept file": the `how` says "sweep with a frontmatter-presence grep across project-memory dirs." The executor must decide which dirs qualify as "project-memory dirs." Not all are obvious (backlogs/? references/? features/? all have subdirs). The "sweep" scope relies on executor judgment. **See US-02.**

W3-T3 "default → git-workflow" routing: W3-T3's `how` says "Per-file content-routing (heuristic rule 1); git mv; default ambiguous → workflow (rule 2)." The heuristic rules are numbered by reference but not listed in the task — executor needs the design doc (§8 LOW-16) loaded alongside the task. The agent assignment says "required skills: memorization/SKILL.md, memorization/rules.md, memory-map.md" but NOT the design doc itself. **See US-03.**

---

## Typed findings

### US-01
- **Type:** design_flaw
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W3-T1 `how`: "For each of the 7 files, read its content; git mv into <destination-feature>/<subdir>/; write changelogs/..." The `<destination-feature>/<subdir>/` is a template, not a specific mapping. The plan's §1.3 has the sprint→value-feature mapping table, but it does not enumerate which of the 7 env-var-audit files go to which specific destination. The routing heuristic is in the design doc (§8 LOW-16), not reproduced in W3-T1.
- **Why it matters:** A fresh executor running W3-T1 in isolation must either have the full design doc loaded or make routing guesses. The task is marked "required skills: memorization/SKILL.md, memorization/rules.md, memory-map.md" — the design doc is NOT in the required skills list.
- **Suggested direction:** Either add the design doc to W3-T1 required skills, or enumerate the specific routing in the W3-T1 `how` for all 7 env-var-audit files.

### US-02
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W1-T3 `how`: "sweep with a frontmatter-presence grep across project-memory dirs" — the dirs are not specified. Project memory has: features/, notes/, decisions/, design/, mistakes/, rules/, learnings/, backlogs/, references/, plans/, reviews/, reports/, archive/. Some (archive/) have date-prefixed files already compliant; others may have ad-hoc keys. The Final Gate checks only `design/` and `learnings/` for frontmatter compliance.
- **Why it matters:** Executor may sweep incompletely (misses a dir) or excessively (edits files outside §8 cat C's ~25-30 estimate). No stopping criterion other than "grep returns 0."
- **Suggested direction:** Explicitly list the directories W1-T3 sweeps, and cap the expected file count to "no more than ~30 total."

### US-03
- **Type:** assumption_risk
- **Domain:** process
- **Disposition:** open
- **Confidence:** 75
- **Severity:** Medium
- **Evidence:** W3-T2, W3-T3, W3-T4 required skills lists do NOT include the design doc `ideation/artifacts/memory-system-redesign-design.md`. The routing decisions (per-file content destination) require reading §1.3 mapping + §8 LOW-16 heuristic. Without the design doc loaded, the executor makes routing judgments without the locked design's specification.
- **Why it matters:** Wrong routing of a file (e.g., routing `archive-move-on-terminal-model.md` to `git-workflow` instead of `project-memory`) cannot be caught by the W3-Tx verify gates (which only check "count == 0" in source dir). An incorrectly routed file would pass the final gate but contradict the design.
- **Suggested direction:** Add `ideation/artifacts/memory-system-redesign-design.md` (at minimum §1.3 + §8) to W3-T0 through W3-T5 required skills/inputs.

---

## Low-confidence appendix
None.

---

**Per-perspective verdict: REVISE**
Rationale: Three Medium/75 findings (US-01, US-02, US-03) — routing context not provided in re-homing tasks; sweep scope unbounded in W1-T3; W3-Tx missing design doc reference.
