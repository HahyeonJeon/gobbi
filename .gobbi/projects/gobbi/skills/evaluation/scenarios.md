# Evaluation Scenarios

This source exercises [SKILL.md](SKILL.md). It tests whether one evaluator produced a fresh, independent, complete, evidence-derived report. It does not add perspective, finding, verdict, or workflow policy.

## Coverage register

| Category | Disposition | Seed |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | EVAL-SC-01 |
| 2 Actors / stakeholders / use-context | selected | EVAL-SC-02 |
| 3 Behavior / state / data | selected | EVAL-SC-03 |
| 4 Interfaces / dependencies / structure | selected | EVAL-SC-04 |
| 5 Quality attributes / resource economics | selected | EVAL-SC-05 |
| 6 Failure / recovery / operations | selected | EVAL-SC-06 |
| 7 Trust / harm / governance | selected | EVAL-SC-07 |
| 8 Inclusion / locale | selected | EVAL-SC-08 |
| 9 Change / compatibility / reversibility | selected | EVAL-SC-09 |
| 10 Evidence / traceability / clarity | selected | EVAL-SC-10 |

Scale threshold: split above 12 families or 40 selected category-by-type cells.

## EVAL-SC-01 — The report evaluates the whole accepted subject and only that subject

- Primary category: 1. Primary type: Positive. Secondary: Adversarial.
- Coverage role: complete outcome review; subject substitution.
- Source: E-2–E-5, E-8, Procedure 2–3 and 14–15.
- Given: a frozen subject digest, complete creation package, scope, scenarios, checks, and verification.
- When: report inputs, sections, checklist, findings, and verdict are traced to the subject.
- Then: every material claim is reviewable and no stale or unrelated artifact supplies proof.
- Failure oracle: missing input, dropped obligation, stale digest, or evidence from another subject.
- Evidence: input ledger, digests, report JSON, and artifact paths.
- Adversarial face: all paths are valid but one draft belongs to a prior iteration.
- Obligation: evaluation must bind completely and exclusively to one frozen subject.
- Checklist: EVAL-CK-01.

## EVAL-SC-02 — The evaluator is independent from every creator and peer

- Primary category: 2. Primary type: Negative. Secondary: Adversarial.
- Coverage role: valid fresh identity; creator/peer contamination.
- Source: E-1, E-7, E-11, Procedure 1 and 16.
- Given: creator identities, evaluator system and runtime identity, assignment, and access boundaries.
- When: role history, persistent-team membership, earlier review identity, and peer-report access are checked.
- Then: the evaluator is fresh, created no subject artifact, saw no peer report, and writes only its own provenance.
- Failure oracle: reused evaluator, creator self-review, peer report read, or foreign provenance.
- Evidence: dispatch identity, role/assignment records, and report provenance.
- Adversarial face: a fresh process is primed with another evaluator's conclusions.
- Obligation: each report must expose an independent reasoning path.
- Checklist: EVAL-CK-02.

## EVAL-SC-03 — Finding and checklist state obey closed transitions

- Primary category: 3. Primary type: Boundary. Secondary: Negative.
- Coverage role: valid disposition state; invalid checklist result.
- Source: E-6–E-10, Procedure 12–14.
- Given: findings at every severity/confidence threshold and checklist PASS, FAIL, and N/A rows.
- When: dispositions, finding links, threshold boundaries, and section/report verdicts are derived.
- Then: only open or disputed findings contribute; checklist links are exact; thresholds and severe aggregation produce the required result.
- Failure oracle: invalid enum, PASS linked to a finding, FAIL without one, hidden low-confidence issue, or intuitive verdict.
- Evidence: schema validation and independent derivation.
- Adversarial face: a Critical finding at confidence 75 is marked PASS because the recommendation is easy.
- Obligation: machine state and verdict must follow the closed schema and scoring rules.
- Checklist: EVAL-CK-03.

## EVAL-SC-04 — The report has one complete, ordered review structure

- Primary category: 4. Primary type: Positive. Secondary: Adversarial.
- Coverage role: complete section interface; duplicate/hidden section.
- Source: E-3, E-5, E-6, E-9, E-13, Procedure 3–15.
- Given: report JSON and rendered Markdown.
- When: perspective order, Overall, finding fields, scenario coverage, checklist rows, and render parity are inspected.
- Then: each required section occurs once, every selected case is covered, and machine and human forms agree.
- Failure oracle: missing or duplicate section, malformed finding, omitted check, or renderer drift.
- Evidence: schema and report validator output plus heading and ID inspection.
- Adversarial face: a misspelled second Risk heading bypasses a simple presence check.
- Obligation: report structure must be complete, unique, and executable.
- Checklist: EVAL-CK-04.

## EVAL-SC-05 — Rigor is preserved when review cost grows

- Primary category: 5. Primary type: Boundary. Secondary: Adversarial.
- Coverage role: large subject; cost pressure.
- Source: E-3–E-5, E-12, E-14, Procedure 2–15.
- Given: a large creation package or materially revised subject.
- When: evidence volume, checks, systems, perspectives, and repeat-review work increase.
- Then: the evaluator narrows search intelligently without dropping required artifacts, sections, selected checks, or fresh review.
- Failure oracle: skipped draft, sampled required perspective, reused prior report, or removed system for cost.
- Evidence: input ledger, section/check coverage, identity, and subject digest.
- Adversarial face: a “low-risk” label is used to omit Performance or the second system.
- Obligation: resource pressure may change technique, never required rigor.
- Checklist: EVAL-CK-05.

## EVAL-SC-06 — Missing or invalid evidence stops safely and precisely

- Primary category: 6. Primary type: Failure/recovery. Secondary: Boundary.
- Coverage role: malformed input; unavailable proof; repair route.
- Source: E-2, E-4, E-13, Procedure 1–3 and 15–16.
- Given: a missing draft, malformed report field, stale identity, failed check, or unevaluable claim.
- When: the evaluator or validator encounters the defect.
- Then: it names the exact invariant and affected evidence, produces no nominal valid report, and returns a bounded recovery path.
- Failure oracle: assumed PASS, partial report accepted, vague failure, or subject repair by evaluator.
- Evidence: status, validator diagnostic, and unchanged subject.
- Adversarial face: a green proxy is accepted after the direct verify command fails.
- Obligation: evaluation failure must block aggregation without mutating the subject.
- Checklist: EVAL-CK-06.

## EVAL-SC-07 — The evaluator cannot use review authority to change the subject

- Primary category: 7. Primary type: Adversarial. Secondary: Negative.
- Coverage role: permitted recommendation; prohibited edit or decision.
- Source: E-1, E-7, E-11, Procedure 1 and 16.
- Given: a high-confidence defect with an obvious correction and a material user choice.
- When: report and filesystem activity are inspected.
- Then: the evaluator records evidence and recommendation only, preserves its provenance, and leaves subject and disposition authority untouched.
- Failure oracle: artifact edit, finding application, user choice, negotiated finding, or foreign provenance.
- Evidence: worktree diff, report, dispatch tools, and disposition record.
- Adversarial face: the evaluator “fixes a typo” that materially changes scope before reporting.
- Obligation: review authority must never become creation or user-decision authority.
- Checklist: EVAL-CK-07.

## EVAL-SC-08 — Evaluation evidence is readable by varied consumers

- Primary category: 8. Primary type: Alternative-valid. Secondary: Boundary.
- Coverage role: manager, creator, auditor, assistive reader, locale edge.
- Source: E-3, E-4, E-6, E-9, Procedure 4–15.
- Given: rendered sections, findings, checklist, paths, commands, dates, and values.
- When: the report is read without private context or visual-position assumptions.
- Then: terms, evidence, consequences, recommendations, and applicability results are plain, navigable, and unambiguous.
- Failure oracle: vague “issue,” visual-only reference, ambiguous date/number, cryptic ID, or recommendation without cause.
- Evidence: cold read, heading outline, link/path inspection, and field completeness.
- Adversarial face: evidence says “see above” and becomes unusable after machine rendering changes order.
- Obligation: the report must support action and audit across readers and environments.
- Checklist: EVAL-CK-08.

## EVAL-SC-09 — Material revision receives a fully new review

- Primary category: 9. Primary type: Change/regression/compat. Secondary: Adversarial.
- Coverage role: unchanged subject; material change; stale carryover.
- Source: E-1, E-2, E-12–E-14, Procedure 1–3 and 15–16.
- Given: a revised canonical artifact with earlier reports and approved finding dispositions.
- When: digest, evaluator identity, complete input frame, sections, findings, and checklist are compared.
- Then: a material change has a new digest, two fresh evaluator contexts, complete sections, and current evidence; earlier reports remain read-only history.
- Failure oracle: reused section, prior checklist carried forward, addressed finding without current proof, or same evaluator runtime.
- Evidence: digests, identities, reports, and current verification.
- Adversarial face: only the previously failing section is rerun after a change that affects another lens.
- Obligation: revision must not inherit acceptance evidence from an older subject.
- Checklist: EVAL-CK-09.

## EVAL-SC-10 — Every verdict and finding is reproducible from direct evidence

- Primary category: 10. Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: reproducible proof; false-positive challenge; check gaming.
- Source: E-4, E-6, E-8–E-10, E-13, Procedure 4–15.
- Given: complete report, subject, commands, findings, false-positive checks, checklist, and derived verdict.
- When: an independent reader reruns safe checks and recomputes fingerprints and verdicts.
- Then: evidence supports every symptom and cause, alternate explanations were tested, checklist results agree, and the same verdict follows.
- Failure oracle: non-reproducible command, wrong fingerprint, missing false-positive check, unsupported cause, or softened score.
- Evidence: exact paths and commands, schema validation, fingerprint recomputation, and scoring.
- Adversarial face: a finding quotes convincing evidence from a file outside the frozen subject.
- Obligation: evaluation conclusions must be traceable, discriminating, and mechanically consistent.
- Checklist: EVAL-CK-10.

## Omission sweep

Every E-rule maps to at least one seed and check. Target-specific cases extend the filled frame; they do not modify this source.
