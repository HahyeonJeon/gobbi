## Artifact Summary + Memory reads

The plan claims a strictly sequential citation graph and a final cross-file consistency check. Consistency review checks whether plan tasks, locked Idea items, readiness anchors, live files, and read-only constraints agree.

Memory reads: plan, locked Idea, readiness report, three target files, `orchestration/SKILL.md`, `chat-mode.md`, planning evaluation frame, and active mistakes on docs-sync, whole-file cross-reference checking, and section order.

## Locked Frame (Stage 1)

Scenario C1: plan anchors match live files and readiness corrections.
- Check: anchors listed in the plan match live files at c8a8654.
- Check: any readiness residual note is either incorporated or deliberately rejected with evidence.

Scenario C2: every cross-reference promised by the Idea is owned by a task and verified.
- Check: auto-mode Cross-references rows are in T2.
- Check: evaluation.md Cross-references row back to auto-mode §7 is in T1.
- Check: T4 checks both directions where the Idea promised mutual linking.

Scenario C3: C1 split-anchor is encoded.
- Check: chat-mode.md remains read-only.
- Check: Stuck/Regression Chat branches anchor to evaluation.md existing behavior, not chat-mode.md.
- Check: only Iteration Caps may cite chat-mode.md as the Chat anchor.

Scenario C4 (adversarial): a stale line anchor survives because an earlier readiness table still contains it even though the same report later corrected it.
- Check: the plan uses the latest readiness note, not the stale table row.

## Per-scenario per-check results

C1: FAIL. The SKILL.md pointer anchor is stale in the plan.

C2: FAIL. The evaluation.md Cross-references update from the Idea is not assigned or verified.

C3: PASS. The plan correctly encodes the split-anchor: chat-mode is silent on Stuck/Regression and those Chat branches must cite evaluation.md existing behavior.

C4: FAIL. The plan copied the stale `line 247` anchor and missed the readiness report's final correction to line 266.

## Typed findings

### COD-CONS-001

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`design_flaw` / `citation-fidelity` / `100` / `High` / Plan says `orchestration/SKILL.md:247` is the §3/§6 pointer (`planning/rawdata/draft-iter1.md:24`, `planning/rawdata/draft-iter1.md:135`, `planning/rawdata/draft-iter1.md:186`, `planning/rawdata/draft-iter1.md:200`). Readiness later corrects that exact anchor: actual pointer is line 266; line 247 is a table separator (`preparation/artifacts/readiness.md:164`-`171`). Live file confirms line 247 is a table separator and line 266 contains the Auto Mode pointer (`.gobbi/projects/gobbi/skills/orchestration/SKILL.md:246`-`266`). / The plan is inconsistent with both its readiness input and the live file. The final consistency task would fail for the wrong reason. / Replace all `line 247` mentions with line 266 or a stable section anchor, and retain the read-only constraint.

### COD-CONS-002

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `docs-sync` / `100` / `High` / The locked Idea says `workflow/evaluation.md` must update its Cross-references block with a row pointing to `auto-mode.md §7` so the two docs are mutually linked (`ideation/artifacts/idea.md:177`). T1 does not include that update in `what` or `verifies` (`planning/rawdata/draft-iter1.md:59`-`75`). T4 does not verify it (`planning/rawdata/draft-iter1.md:133`-`139`). / The plan verifies auto-mode links to evaluation.md, but not the reciprocal evaluation.md link promised by the Idea. This leaves cross-file drift in the exact area T4 is supposed to catch. / Add the evaluation.md Cross-references row to T1 and include a reciprocal-link check in T4.

### COD-CONS-003

Type / Domain / Confidence / Severity / Evidence / Why-it-matters / Suggested-direction

`checklist_gap` / `dependency-order` / `75` / `Medium` / T2 verifies a Cross-references row to the "reconciled CLAUDE.md line" (`planning/rawdata/draft-iter1.md:92`), but the CLAUDE.md line is reconciled by T3 after T2 (`planning/rawdata/draft-iter1.md:98`-`111`). The plan's stated citation graph omits this reverse edge (`planning/rawdata/draft-iter1.md:33`-`39`). / The cross-file consistency story is incomplete: one citer points at a target finalized later. T4 can catch final drift, but T2 is not independently verifiable as written. / Defer that reciprocal row or make T2's check target only a stable generic CLAUDE.md Evaluation block pointer, with T4 owning final resolved-text verification.

## Low-confidence appendix

No low-confidence consistency findings.
