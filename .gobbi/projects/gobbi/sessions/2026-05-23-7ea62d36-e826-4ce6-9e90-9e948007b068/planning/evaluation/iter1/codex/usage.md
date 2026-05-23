---
loop: planning
iter: 1
system: codex
perspective: usage
verdict: revise
---

# Usage Perspective - Planning Evaluation Iter 1

## Artifact Summary + Memory reads

The consumer is a future manager or fresh executor/assistant receiving one task brief. Usage review checks whether a task can be executed without asking the leader what was meant and without relying on parent-session memory.

Memory reads: target plan, locked Idea, concern staging records, planning evaluation child doc.

W/W/H gate: clear. Phase match: planning.

## Locked Frame (Stage 1)

Scenario 1: A fresh executor can start from a single task.
- Check: each task names files, inputs, outputs, and verifiers.
- Check: brief sketches name required skills and mistakes.

Scenario 2: User decisions are already resolved before dispatch.
- Check: Task 05 inlines Draft A cell text after the user's decision.
- Check: no AskUserQuestion is required for Concern 3 after the user locks Draft A.

Scenario 3: Failure modes are clear.
- Check: known path-discipline and verbatim-spec mistakes are named.
- Check: task verification failures point to actionable fixes.

Scenario 4 (adversarial): The executor gets a command that cannot possibly pass.
- Check: path checks point to the actual session write root.
- Check: dynamic staging paths are represented as directory/manifest contracts, not fake concrete files.

Coverage matrix seeds: operator accessibility is applicable as scannable task structure; i18n is not applicable. Observability is applicable to task status and is satisfied by per-task PR strategy plus final sweep.

## Per-scenario per-check results

Scenario 1: PASS. Every task has `files`, `inputs`, `outputs`, and `verifies` blocks. Agent assignments at `draft-iter1.md:402-475` include required skills and mistakes.

Scenario 2: FAIL. The current user instruction locks Draft A, but Task 05 still treats the row as an unresolved user decision. Evidence: proposed drafts remain at `draft-iter1.md:79-89`, Task 05 inputs ask for "User-confirmed cell text" at `draft-iter1.md:268`, and the justification says the manager resolves it before dispatch at `draft-iter1.md:451`.

Scenario 3: PASS with caveat. The plan carries the key prior mistake into Task 04 and Task 06 at `draft-iter1.md:441-443` and `draft-iter1.md:458-465`. Task 04 should be revised to say the manager brief must inline the verbatim 5-Type spec from `idea.md` as well as re-read `evaluation/SKILL.md`.

Scenario 4: FAIL. Task 05's `test -f sessions/...` verifier at `draft-iter1.md:278` and Task 07's ellipsis path at `draft-iter1.md:338` are not runnable contracts for a fresh executor.

## Typed findings

### COD-USAGE-001 - Fresh executor would re-ask a locked Concern 3 decision

- Type: `design_flaw`
- Domain: `process`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: user has selected Draft A; plan still says AskUserQuestion/default at `draft-iter1.md:79-89` and `concern-3-coverage-ownership-cell-text.md:48-50`.
- Why it matters: the manager/executor handoff can reopen a decision the user already made.
- FP check: not speculative; direct mismatch between current user context and artifact text.

### COD-USAGE-002 - Task 04 brief discipline is weaker than the user-requested carry-forward

- Type: `checklist_gap`
- Domain: `process`
- Disposition: `open`
- Confidence: 75
- Severity: Medium
- Evidence: Task 06 explicitly says "Inline the 8 H2 section names verbatim from `idea.md`" at `draft-iter1.md:462`; Task 04 says to include the verbatim 5-Type list and re-read `evaluation/SKILL.md:344-393` at `draft-iter1.md:441-443`, but it does not include the parallel "inline verbatim spec from idea.md" directive requested for Task 04. The Idea carries the locked vocabulary at `idea.md:337-341`.
- Why it matters: this is the exact mistake class from `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md`.
- FP check: not High because Task 04 does include the 5-Type list and canonical `evaluation/SKILL.md` read requirement.

Usage verdict: REVISE due COD-USAGE-001. COD-USAGE-002 is a Medium carry-forward gap.

## Low-confidence appendix

None.
