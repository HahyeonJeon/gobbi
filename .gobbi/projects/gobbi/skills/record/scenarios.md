# Record Scenarios

This source exercises [SKILL.md](SKILL.md). It adds no session schema, command, routing, or durable-memory policy. Evaluators extend the filled frame for the current step, task, and artifact types.

## Coverage register

| Category | Disposition | Seed |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | RECORD-SC-01 |
| 2 Actors / stakeholders / use-context | selected | RECORD-SC-02 |
| 3 Behavior / state / data | selected | RECORD-SC-03 |
| 4 Interfaces / dependencies / structure | selected | RECORD-SC-04 |
| 5 Quality attributes / resource economics | selected | RECORD-SC-05 |
| 6 Failure / recovery / operations | selected | RECORD-SC-06 |
| 7 Trust / harm / governance | selected | RECORD-SC-07 |
| 8 Inclusion / locale | selected | RECORD-SC-08 |
| 9 Change / compatibility / reversibility | selected | RECORD-SC-09 |
| 10 Evidence / traceability / clarity | selected | RECORD-SC-10 |

Scale threshold: split above 12 families or 40 selected category-by-type cells.

## RECORD-SC-01 — RECORD seals the exact verdict-specific result and nothing else

- Primary category: 1. Primary type: Positive. Secondary: Adversarial.
- Coverage role: accepted result; prohibited judgment.
- Source: R-1, R-2, R-6, R-9, Procedure 1–2 and 5–10.
- Given: current cursor, complete WORK package, reports or waiver, aggregate verdict, dispositions, and expected artifact.
- When: record paths, output placement, content digest, and manager handoff are reconciled.
- Then: iteration evidence is immutable; PASS alone has the exact canonical output; REVISE and FAIL have no output.
- Failure oracle: changed verdict, missing evidence, pre-PASS output, materially altered subject, or RECORD-owned route.
- Evidence: state/manifest read, artifact hashes, output tree, and verifier result.
- Adversarial face: a polished output hides one material wording change made after evaluation.
- Obligation: RECORD must preserve and place the evaluated result without judging it.
- Checklist: RECORD-CK-01.

## RECORD-SC-02 — The manager and next session can route from the sealed evidence

- Primary category: 2. Primary type: Alternative-valid. Secondary: Failure/recovery.
- Coverage role: manager consumer; resumed-session consumer.
- Source: R-1, R-9, Procedure 1, 9–10.
- Given: completion proof, canonical output or absent-output evidence, staging inventory, and persisted cursor.
- When: a manager rereads the promised paths and reproduces the verifier.
- Then: identity, verdict, artifact, candidates, concerns, and next legal route are explicit without private context.
- Failure oracle: report-only completion, ambiguous path, omitted empty-staging statement, or unverifiable next route.
- Evidence: cold read, exact command, state, and artifacts.
- Adversarial face: runtime task status says complete while the canonical path is absent.
- Obligation: record evidence must be sufficient for independent manager routing.
- Checklist: RECORD-CK-02.

## RECORD-SC-03 — Manifest and router changes stay separate and atomic

- Primary category: 3. Primary type: Boundary. Secondary: Negative.
- Coverage role: valid patch; cross-boundary field; invalid candidate.
- Source: R-7, R-8, Procedure 8–9.
- Given: version 5 manifest, version 3 router, valid and invalid patch files, and exact pre-operation bytes.
- When: lifecycle and routing operations target allowed, unknown, cross-boundary, and malformed fields.
- Then: each valid operation changes only its owner fields; every invalid operation preserves both prior files byte-for-byte.
- Failure oracle: settings changed through transition, cursor changed through checkpoint, partial write, or accepted old version.
- Evidence: schemas, before/after bytes, command diagnostics, and reread JSON.
- Adversarial face: a syntactically valid lifecycle patch embeds one router field.
- Obligation: lifecycle and routing state must never leak across atomic command boundaries.
- Checklist: RECORD-CK-03.

## RECORD-SC-04 — Tree shape, task coverage, and artifact placement match their owners

- Primary category: 4. Primary type: Positive. Secondary: Boundary.
- Coverage role: valid eager skeleton; missing/extra/misplaced artifact.
- Source: R-2, R-3, R-6, R-9, Procedure 2–9.
- Given: configured iteration caps, locked task list, session root, typed staging, working evidence, evaluation reports, and outputs.
- When: root entries, iteration directories, task interiors, symlinks, filenames, and verdict placement are inspected.
- Then: predictable directories exist, every task is scaffolded, artifacts stay in owned slots, and output files remain PASS-only.
- Failure oracle: unknown root entry, unscaffolded task, symbolic link, stale iteration, wrong-system file, or pre-PASS output.
- Evidence: tree inventory, schemas, locked tasks, state, and verifier output.
- Adversarial face: a correct output exists under the wrong task and passes a simple filename check.
- Obligation: the record tree must encode ownership and acceptance exactly.
- Checklist: RECORD-CK-04.

## RECORD-SC-05 — Record operations are deterministic and bounded

- Primary category: 5. Primary type: Boundary. Secondary: Failure/recovery.
- Coverage role: small/large skeleton; repeated initialization; large artifact.
- Source: R-8, R-9, Procedure 7–9.
- Given: configured iteration caps, many plan tasks, repeated init, and peer artifacts near allowed size limits.
- When: scaffolding, validation, rendering, hashing, and verification run repeatedly.
- Then: ordering and bytes are stable, repeated init is idempotent, and work is proportional to declared files and tasks.
- Failure oracle: duplicate tree, nondeterministic Markdown, unbounded scan, or repeated rewrite of unchanged files.
- Evidence: tree and artifact hashes, timing or operation counts where material, and rerun output.
- Adversarial face: renderer output changes solely because object-key input order changes.
- Obligation: the command seam must remain deterministic and proportionate.
- Checklist: RECORD-CK-05.

## RECORD-SC-06 — Parse, schema, path, and rendering failures preserve prior bytes

- Primary category: 6. Primary type: Failure/recovery. Secondary: Boundary.
- Coverage role: malformed input; renderer failure; recovery rerun.
- Source: R-7–R-9, Procedure 7–9.
- Given: invalid JSON, unknown enum, missing required field, traversal target, wrong system label, and failed renderer fixture.
- When: each operation is attempted against a valid existing record or artifact target.
- Then: the exact error is reported, prior files remain byte-for-byte unchanged, no temporary file leaks, and a corrected rerun succeeds.
- Failure oracle: truncated target, partial candidate, stray temporary file, generic error, or mutated sibling state.
- Evidence: before/after hashes, directory inventory, exit status, and corrected rerun.
- Adversarial face: candidate JSON validates but rendered Markdown would escape the authorized root.
- Obligation: every failure path must be non-mutating, precise, and recoverable.
- Checklist: RECORD-CK-06.

## RECORD-SC-07 — Root containment and durable boundaries resist hostile input

- Primary category: 7. Primary type: Adversarial. Secondary: Negative.
- Coverage role: valid root target; traversal/symlink; protected evidence.
- Source: R-3, R-8, R-10, R-11, Procedure 3–4 and 7–9.
- Given: user-controlled path fragments, symlinks, absolute targets, sensitive evidence, and a non-Wrap-up RECORD.
- When: staging, artifact writes, verification, and project-tree access are inspected.
- Then: writes remain under the validated session root, staged content is typed and sanitized, and no durable project path changes before Wrap-up.
- Failure oracle: escape, symlink acceptance, direct durable write, sensitive copy, or operational exhaust stored as durable evidence.
- Evidence: canonical path resolution, worktree diff, content review, and verifier output.
- Adversarial face: a target begins under the session root but resolves through a symlink outside it.
- Obligation: RECORD must not widen write authority, data exposure, or durable-memory authority.
- Checklist: RECORD-CK-07.

## RECORD-SC-08 — Canonical records remain readable across tools and locales

- Primary category: 8. Primary type: Alternative-valid. Secondary: Boundary.
- Coverage role: human reader; machine reader; locale-sensitive value.
- Source: R-3, R-6, R-9, Procedure 4–7 and 10.
- Given: Markdown outputs and staged records with headings, links, timestamps, numbers, paths, and evidence.
- When: schema parsing, rendered reading order, plain language, date format, and link meaning are inspected.
- Then: machine fields remain exact, human structure is navigable, and values are unambiguous without visual-position or locale assumptions.
- Failure oracle: invalid frontmatter, vague link text, ambiguous date, undefined term, or evidence hidden in formatting.
- Evidence: schema/template validation, heading outline, cold read, and link inspection.
- Adversarial face: a timestamp is rendered as a locale-dependent short date and changes meaning.
- Obligation: sealed evidence must be durable for both machine and human consumers.
- Checklist: RECORD-CK-08.

## RECORD-SC-09 — Version and iteration changes preserve explicit compatibility boundaries

- Primary category: 9. Primary type: Change/regression/compat. Secondary: Failure/recovery.
- Coverage role: current version; old version rejection; authorized cap extension.
- Source: R-2, R-7–R-9, Procedure 2 and 8–9.
- Given: current v5/v3 files, old-version fixtures, an authorized new iteration, and existing earlier evidence.
- When: verify, checkpoint, transition, and new-directory scaffolding run.
- Then: old versions are rejected before mutation, current files remain valid, only authorized new iteration directories appear, and earlier directories and bytes remain unchanged.
- Failure oracle: silent migration, dual format, rewritten prior iteration, or unauthorized extra directory.
- Evidence: schema results, before/after tree and hashes, and authorization record.
- Adversarial face: an old file is accepted because its common fields happen to match the new schema.
- Obligation: the new record contract must be explicit, one-version, and non-destructive to prior evidence.
- Checklist: RECORD-CK-09.

## RECORD-SC-10 — Staging and output claims are directly traceable

- Primary category: 10. Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: typed durable candidate; valid empty staging; check gaming.
- Source: R-1, R-2, R-3, R-4, R-5, R-6, R-9, R-10, R-11, Procedure 1–7 and 9–10.
- Given: source evidence, candidate records or an empty result, PASS-only output, reports, dispositions, and verifier output.
- When: every candidate and output claim is traced backward and a plausible filler or stale proof is challenged.
- Then: each candidate has durable value and exact evidence, empty staging passes, output bytes match the evaluated subject, and no forbidden operational exhaust appears.
- Failure oracle: invented candidate, copied creation artifact, uncited claim, stale hash, output without PASS, or filler note.
- Evidence: source links, templates, digests, verdict/disposition artifacts, tree, and verifier result.
- Adversarial face: an evaluator finding is staged automatically despite the user's disputed disposition.
- Obligation: RECORD must seal only supported, accepted, and placement-valid evidence.
- Checklist: RECORD-CK-10.

## Omission sweep

Every R-rule maps to at least one seed and check. Step-specific cases extend the filled frame; they do not modify this source.
