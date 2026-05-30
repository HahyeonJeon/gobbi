## Artifact Summary

`chat-mode.md` is an Execution-phase documentation artifact replacing the Chat Mode placeholder with the canonical Chat-mode orchestration sub-document. It defines the per-task slice posture, workflow diagram, local Chat MEMORIZATION override, task-record contract, explicit Wrap-up trigger, status display, state-transition table, settings defaults, and cross-references. The work implements Planning T1 (`01-chat-mode-canonical-spec`) against Idea Section 3 plus the Status Display and F-S2 requirements. The scoped target is `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`; `.claude/skills/orchestration/chat-mode.md` is a mirror symlink and `memorization/SKILL.md` stays unmodified. Downstream consumers are the manager, future planners, execution agents, evaluators, and Wrap-up.

Memory reads: target `chat-mode.md`; Plan T1 lines 107-175; Idea lines 136-271, 374-385, 245-256, and 520-700; `principles`, `mistake`, `evaluation`, `execution/evaluation`, and `delegation` skills; project rule `stub-redirect-format.md`; listed project mistakes for section-order, retire-without-replacement, notes placement, symlink mirrors, dual-system template gaps, and prose-template checks.

## Locked Frame (Stage 1)

Scenario 1: A future manager can operate Chat Mode from this document without reading the implementation.
- Checklist: the per-task slice shape, gate timing, skipped Preparation behavior, task-record write point, and explicit Wrap-up trigger are actionable.

Scenario 2: The Workflow Status Display gives an unambiguous user-facing progress model.
- Checklist: the header uses a valid current-step/total-step relationship; the current task and completed task rows are understandable; the example is executable as a rendering reference.

Scenario 3 (adversarial): The worked example does not satisfy the "prior plus active task" criterion while teaching an invalid display.
- Checklist: progress counters are not impossible; skipped rows and task-record boundaries are counted consistently; explanatory notes match the table.

## Stage 2 Findings

### Finding U1: Status Display teaches an impossible progress counter

Type: `design_flaw`  
Domain: `docs-sync`  
Disposition: `open`  
Confidence: `100`  
Severity: `High`  
Evidence: `chat-mode.md` line 348 defines `Active: Task {NN} - {step-in-slice} of 4`. Lines 351-352 say the "4" includes Step 2, Step 3, Step 4, Step 5, and the task-record boundary, which is five items. The worked example then renders `Step 5 of 4` at line 413 and explains at lines 439-440 that "Step 5 of 4" denotes the slice length. The source Idea line 380 defined "4" as Step 2 + Step 4 + Step 5 + task-record, excluding default-skipped Step 3; the target doc includes Step 3 in the count and still keeps `of 4`.  
FP-check: Not speculative and not style preference. This is the canonical user-visible rendering spec and the example a future manager will copy.  
Impact: A manager following this doc will show users an impossible progress state, undermining the Status Display's job as a reliable workflow projection.

## Per-perspective Verdict

VERDICT: REVISE

## Low-confidence appendix

None.
