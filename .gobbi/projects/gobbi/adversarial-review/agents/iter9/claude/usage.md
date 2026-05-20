# Usage (iter9, claude)

## Artifact Summary + Memory reads (Stage 0)

iter9 closes a previously-undetectable Usage gap: an evaluator delegated to evaluate a Preparation artifact, following the evaluation/SKILL.md Stage 0 contract, would have been told to "Load the matching phase child doc: `preparation/evaluation.md`" but the file did not exist. iter9 creates it AND makes every contract surface that names the phase tag list `preparation` so downstream consumers (evaluators, the manager, the assistant) have unambiguous answers.

**Memory reads**: as project.md; specifically focused on the evaluator's Stage 0 procedure and the manager's MEMORIZATION-side loop-identity contract.

## Locked Frame (Stage 1)

Seeds carried from iter8 (fresh manager + assistant + evaluator have unambiguous contract answers for Preparation). iter9 adds: the **evaluator now has a real phase child doc to load**.

Adversarial scenario (from preparation/evaluation.md Usage line 191): **A consumer reads the Preparation artifact and forms the wrong mental model** — applied recursively: does the new preparation/evaluation.md itself form a clear mental model for the evaluator?

Checklist:
- [x] Evaluator following Stage 0 procedure step 3 can load preparation/evaluation.md (file exists at the contracted path)
- [x] Manager following orchestration/workflow/evaluation.md phase tag contract has `preparation` listed as a valid phase tag — VERIFIED at line 47
- [x] Assistant following memorization/SKILL.md loop identity has `preparation` listed in the 5-loop enum — VERIFIED at line 14, 93, 141, 225
- [x] Delegation prompt template at delegation/templates/evaluator.md lists `preparation-eval` as a valid phase tag — VERIFIED at line 9
- [x] Sole-writer disclosure at memorization/SKILL.md preserves loop ∈ {ideation, planning, execution} write rule for loop MEMORIZATION (iter8 carry)
- [x] Cross-references inside preparation/evaluation.md resolve: `memorization/templates/scenarios.md`, `wrap-up/SKILL.md`, `preparation/SKILL.md` — VERIFIED via grep
- [x] The new file's intent is self-evident from its own first paragraph (a fresh evaluator can understand what it's for without context)

## Per-scenario per-check results

| Scenario | Check | Result | Evidence |
|---|---|---|---|
| Evaluator Stage 0 loadability | File reachable at the contracted path | PASS | path resolves; 329 lines |
| Manager phase-tag contract complete | `preparation` in the enum at orchestration/workflow/evaluation.md:47 | PASS | verified |
| Assistant loop-identity contract complete | `preparation` in memorization/SKILL.md:14 | PASS | verified |
| Delegation template complete | `preparation-eval` at delegation/templates/evaluator.md:9 | PASS | verified |
| Self-evident from new file alone | First paragraph states purpose + artifact location | PASS | lines 7-13 |
| 3am test (adversarial) | A tired evaluator at 3am reading only preparation/evaluation.md can build the Frame | PASS | each perspective has seed scenarios + recommended verifications + anti-patterns; no implicit "see DISCUSSION" references |

## Typed findings

| ID | Type | Domain | Disposition | Confidence | Severity | Evidence |
|---|---|---|---|---|---|---|
| F-U-04 (carry — low-severity nit) | `general` | `docs-sync` | **open (carry, deferred)** | 50 | Low | pre-existing minor usage gap not in iter9 scope |
| F-U-iter9-NEW-01 | `general` | `docs-sync` | **addressed (this iter)** | 100 | n/a | iter9 closes the Usage gap that an evaluator following the Stage 0 contract verbatim would have hit (load non-existent preparation/evaluation.md) |

No NEW open Usage finding.

## Verdict

**PASS — TRULY-FINAL (closing).** No Critical ≥ 75; no High ≥ 50. The Usage gap that previously existed (contract referenced non-existent file) is now closed at all four consumer surfaces: evaluator (Stage 0), manager (orchestration/workflow/evaluation.md), assistant (memorization/SKILL.md), delegation template (delegation/templates/evaluator.md).

## Low-confidence appendix

None.
