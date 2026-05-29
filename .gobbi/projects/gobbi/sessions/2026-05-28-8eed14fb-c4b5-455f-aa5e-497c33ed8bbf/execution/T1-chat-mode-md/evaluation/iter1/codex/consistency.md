## Artifact Summary

`chat-mode.md` is an Execution-phase documentation artifact replacing the Chat Mode placeholder with the canonical Chat-mode orchestration sub-document. It defines the per-task slice posture, workflow diagram, local Chat MEMORIZATION override, task-record contract, explicit Wrap-up trigger, status display, state-transition table, settings defaults, and cross-references. The work implements Planning T1 (`01-chat-mode-canonical-spec`) against Idea Section 3 plus the Status Display and F-S2 requirements. The scoped target is `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`; `.claude/skills/orchestration/chat-mode.md` is a mirror symlink and `memorization/SKILL.md` stays unmodified. Downstream consumers are the manager, future planners, execution agents, evaluators, and Wrap-up.

Memory reads: target `chat-mode.md`; Plan T1 lines 107-175; Idea lines 136-271, 374-385, 245-256, and 520-700; `principles`, `mistake`, `evaluation`, `execution/evaluation`, and `delegation` skills; project rule `stub-redirect-format.md`; listed project mistakes for section-order, retire-without-replacement, notes placement, symlink mirrors, dual-system template gaps, and prose-template checks.

## Locked Frame (Stage 1)

Scenario 1: The target stays synchronized with the Planning T1 contract and Idea source.
- Checklist: T1 success criteria are traceable; D-A/D-B/deferred frontmatter match the Plan; Principle 1 and Inline-Paste references replace Principle 4; `memorization/SKILL.md` remains the base procedure.

Scenario 2: Internal statements in `chat-mode.md` do not contradict each other.
- Checklist: status-display counts match the rows they display; task-record writer ownership is stated once or consistently; short-form references do not restate the Chat MEMORIZATION contract differently.

Scenario 3 (adversarial): A copied worked example does not drift from the shape it claims to instantiate.
- Checklist: the example's header, table rows, and explanatory notes agree with each other and with the Idea spec.

## Stage 2 Findings

### Finding C1: Status Display cardinality contradicts the source and itself

Type: `design_flaw`  
Domain: `docs-sync`  
Disposition: `open`  
Confidence: `100`  
Severity: `High`  
Evidence: Idea line 380 says the Chat header's total of 4 represents Step 2 + Step 4 + Step 5 + task-record, with Step 3 rendered as skipped. In `chat-mode.md`, lines 351-352 redefine that "4" as Step 2 + Step 3 + Step 4 + Step 5 + task-record, which is five items. Lines 413 and 439-440 then normalize `Step 5 of 4`.  
FP-check: Not pre-existing in the target artifact; the target introduced a stronger contradiction than the source by adding Step 3 into the "of 4" explanation.  
Impact: The canonical rendering spec is internally inconsistent and will force implementers to guess whether the header uses global workflow step IDs, per-slice ordinal positions, or table-row cardinality.

### Finding C2: task-record writer ownership is internally ambiguous

Type: `design_flaw`  
Domain: `process`  
Disposition: `open`  
Confidence: `100`  
Severity: `Medium`  
Evidence: `chat-mode.md` lines 212-213 state that "the manager writes one `task-record.md`" at the boundary. Lines 291-297 state the record is written by the mini Execution or mini Planning MEMORIZATION assistant, and "Either way it is the assistant role"; the manager only verifies presence. The Idea source line 254 also assigns writing to the assistant role.  
FP-check: Not a style preference. This is an ownership boundary in the workflow contract.  
Impact: The conflict is recoverable because Section 6.4 is explicit, but a future manager reading Section 6's opening sentence can pick the wrong owner before reaching the later correction.

## Per-perspective Verdict

VERDICT: REVISE

## Low-confidence appendix

None.
