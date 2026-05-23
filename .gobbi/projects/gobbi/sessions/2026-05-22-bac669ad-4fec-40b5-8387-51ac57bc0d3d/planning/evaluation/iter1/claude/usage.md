# Usage Perspective — Planning Evaluation iter1

## Artifact Summary + Memory reads

Same as project.md. Evaluating whether a fresh executor, given a single task in isolation, can execute it without returning to the user.

**Memory reads:** same as project.md.

---

## Locked Frame (Stage 1)

### Scenario 1: A fresh Executor given task N alone can begin work immediately
Checklist:
- [ ] Each task's inputs field (via Why, How, Dependencies) provides sufficient context
- [ ] No "figure it out" gaps requiring parent-session knowledge

### Scenario 2: Executor knows which files to open, functions to modify, tests to run
Checklist:
- [ ] File paths are explicit in Files in-scope
- [ ] Line numbers are cited for precision edits
- [ ] Verification commands are complete shell commands

### Scenario 3: Failure modes per task are communicated
Checklist:
- [ ] T1: what if `CLAUDE_ENV_FILE` is unset?
- [ ] T4: what if hit count diverges from expected 11?
- [ ] T7: what if a criterion fails?

### Scenario 4: Inter-task handoff is explicit
Checklist:
- [ ] T3's output is the renamed `gobbi/SKILL.md` — T4 consumes it by excluding it explicitly
- [ ] T5's output is the documented `transcriptPath` field — T6 consumes it by citing it

### Scenario 5 (adversarial): Executor needs to ask "what does X mean here"
Checklist:
- [ ] Terms in task specs are defined or linked to definitions
- [ ] "P1 rows 3-13" in T4 title — is the P1 table accessible?

### Scenario 6: Hook script spec is clear enough for implementation without ambiguity
Checklist:
- [ ] T1 How step 2 says "per the canonical pattern in Idea § Hook contract" — executor must load the Idea
- [ ] Is the Idea path cited?

---

## Per-scenario per-check results

### Scenario 1: Fresh executor independence
**Spot-check T4:** T4 Why references "Idea § Decisions Log P1 + FIX 1" and "Idea § File inventory." T4's Files in-scope explicitly lists all 11 files with paths and line numbers. An executor dispatched to T4 can proceed without reading the Idea (the file list is self-contained). PASS.

**Spot-check T5:** T5 Why references "Preparation iter2 § Verified resources row 13." The executor needs to know what that row says. T5's How steps are explicit enough (read template, add field, edit SKILL.md) that the Preparation artifact is not required for execution. The line numbers (103, 371) are cited. PASS with note: if the executor cannot infer the exact wording for the orchestration SKILL.md prose, the Idea § Stamping mechanism disambiguation is a required reference — but T5 cites it via Why.

**Spot-check T1:** T1 How step 2 says "per the canonical pattern in Idea § Hook contract." The executor must find the Idea artifact to read the pattern. The Idea path is not stated explicitly in T1.

**Finding F-USG-01:**
- Type: `checklist_gap`
- Domain: `process`
- Disposition: open
- Confidence: 75
- Severity: Medium
- Evidence: T1 How step 2: "Write the script body per the canonical pattern in Idea § Hook contract" — no path to the Idea artifact is given in T1's task spec. An executor dispatched to T1 in isolation needs to know where the Idea lives.
- Why it matters: Principle 12 requires every delegation prompt to be self-sufficient. The hook script body is the primary deliverable of T1; if the executor cannot find the canonical pattern it must implement, T1 cannot complete correctly.
- Suggested direction: Add `related: sessions/2026-05-22-bac669ad-4fec-40b5-8387-51ac57bc0d3d/ideation/artifacts/idea.md` to T1's task spec, or inline the critical hook contract fields (the export table).

### Scenario 2: Files + verification completeness
All tasks cite explicit file paths. T3, T4, T6 cite specific line numbers. Verification commands are complete shell commands. PASS.

### Scenario 3: Failure mode communication
**T1 failure:** What section covers the `CLAUDE_ENV_FILE` unset failure mode ("Exit non-zero with stderr message"). PASS.
**T4 failure:** How step 1 says "If count diverges, halt and surface to manager." PASS.
**T7 failure:** How step 2 says "If any command fails, halt and report BLOCKED with the failure to manager — do NOT open the PR." PASS.

### Scenario 4: Inter-task handoff
**T3 → T4:** T4 Files out-of-scope explicitly lists `gobbi/SKILL.md (already done in T3)`. Clean handoff. PASS.
**T5 → T6:** T6 Why states "T6 cites `session.json.transcriptPath` as the canonical field; that field is only documented as canonical after T5 lands." Dependencies: T5 is listed. PASS.

### Scenario 5: Unclear terms (adversarial)
**"P1 rows 3-13" in T4 title:** The P1 table is in the Idea artifact. T4's Files in-scope section fully lists all 11 files, so an executor does not need to find P1 in the Idea — the complete file list is inlined. PASS.

**"FIX A disambiguation" in T5:** T5's success criteria says "FIX A disambiguation present" and T5's How step 4 says "the disambiguation that this is a manager-agent procedure (in-scope), not a CLI automation (deferred)." The meaning is clear from the task. PASS.

### Scenario 6: Hook spec accessibility
See F-USG-01. The Idea artifact path is not cited in T1. The hook contract's critical table is inlined in the Idea, not in the plan.

---

## Typed findings

| ID | Type | Domain | Disposition | Confidence | Severity |
|----|------|--------|-------------|------------|----------|
| F-USG-01 | `checklist_gap` | `process` | open | 75 | Medium |

**Accessibility:** not-applicable (no UI, no agent-facing navigation gaps beyond F-USG-01).
**I18n:** not-applicable (no locale-sensitive strings in a documentation plan).

## Low-confidence appendix

(none)

**Usage perspective verdict: PASS** (one Medium finding; executor can work around it with context from the plan's related: frontmatter field)
