# Wrap-up Scenarios

This source exercises [SKILL.md](SKILL.md). It adds no promotion or Git policy. Evaluators extend the filled frame for the session's actual memory types, changed paths, and publication intent.

## Coverage register

| Category | Disposition | Seed |
|---|---|---|
| 1 Purpose / outcomes / scope | selected | WRAP-SC-01 |
| 2 Actors / stakeholders / use-context | selected | WRAP-SC-02 |
| 3 Behavior / state / data | selected | WRAP-SC-03 |
| 4 Interfaces / dependencies / structure | selected | WRAP-SC-04 |
| 5 Quality attributes / resource economics | selected | WRAP-SC-05 |
| 6 Failure / recovery / operations | selected | WRAP-SC-06 |
| 7 Trust / harm / governance | selected | WRAP-SC-07 |
| 8 Inclusion / locale | selected | WRAP-SC-08 |
| 9 Change / compatibility / reversibility | selected | WRAP-SC-09 |
| 10 Evidence / traceability / clarity | selected | WRAP-SC-10 |

Scale threshold: split above 12 families or 40 selected category-by-type cells.

## WRAP-SC-01 — Closure covers the agreed session and no unrelated material

- Primary category: 1. Primary type: Positive. Secondary: Adversarial.
- Coverage role: positive closure; adversarial scope substitution.
- Source: W-1, W-2, W-9, Procedure 1–2 and 9–12.
- Given: locked scope, canonical step artifacts, task results, staging inventory, and handoff.
- When: the closure contract, manifest, project delta, and handoff claims are reconciled.
- Then: every agreed result and deferral is covered, and no unrelated session or memory edit appears.
- Failure oracle: omitted result, phantom completion, unrelated destination, or wrong-session claim.
- Evidence: scope-to-artifact ledger, staging inventory, manifest, project delta, and handoff.
- Adversarial face: internally consistent paths all refer to an earlier session's artifact.
- Obligation: closure must describe and preserve exactly the agreed session outcome.
- Checklist: WRAP-CK-01.

## WRAP-SC-02 — The next owner can resume without private context

- Primary category: 2. Primary type: Alternative-valid. Secondary: Failure/recovery.
- Coverage role: next-session consumer; operator recovery.
- Source: W-9, W-10, Procedure 9–12.
- Given: the evaluated handoff and actual pre-finalization Git state.
- When: a new manager follows required reads, branch and worktree facts, objective, and first action.
- Then: the next session can start safely and every unresolved item has an owner, reason, and exact action.
- Failure oracle: missing path, stale branch fact, vague next step, or claim that later Git work already happened.
- Evidence: cold-read resume exercise and Git inspection.
- Adversarial face: the handoff is clear only to someone who remembers an unstated user decision.
- Obligation: the handoff must be sufficient for a cold, evidence-based resume.
- Checklist: WRAP-CK-02.

## WRAP-SC-03 — Every typed source has one stable outcome

- Primary category: 3. Primary type: Boundary. Secondary: Negative.
- Coverage role: zero/one/many source accounting; invalid duplicate outcome.
- Source: W-2, W-3, W-4, W-6, Procedure 3–6.
- Given: all expected step and task staging directories, including empty directories.
- When: zero, one, and many files plus duplicate identity and changed source cases are inventoried.
- Then: each source has exactly one promote, defer, drop, or already-promoted outcome, and an empty set remains valid.
- Failure oracle: unaccounted source, double route, invented filler, unstable identity, or partial apply.
- Evidence: sorted inventory, hashes, manifest source rows, and filesystem comparison.
- Adversarial face: two different source paths share one unstable identity and overwrite each other.
- Obligation: staging accounting must be total, unique, stable, and valid at zero files.
- Checklist: WRAP-CK-03.

## WRAP-SC-04 — The manifest owns every structural mutation

- Primary category: 4. Primary type: Positive. Secondary: Adversarial.
- Coverage role: complete dependency mapping; hidden carrier mutation.
- Source: W-4, W-5, W-6, W-7, W-8, Procedure 4–8.
- Given: candidates, destination rules, preimages, lifecycle edits, archive moves, and inbound references.
- When: manifest rows are compared with all changed project paths and ownership rules.
- Then: every changed path has one legal row, every row has a result, and destination shapes follow their owners.
- Failure oracle: unowned path, missing reference carrier, undefined area, one-sided lifecycle link, or row without result.
- Evidence: manifest-to-diff bijection, frontmatter checks, link checks, and memory owner rules.
- Adversarial face: a shared destination changes outside its declared append row.
- Obligation: structure changes must be complete, owned, and exactly manifest-backed.
- Checklist: WRAP-CK-04.

## WRAP-SC-05 — Inventory and apply remain bounded

- Primary category: 5. Primary type: Boundary. Secondary: Failure/recovery.
- Coverage role: normal batch; large batch; bounded retry.
- Source: W-4, W-6, W-8, Procedure 3–8.
- Given: a staging set with shared destinations, reference carriers, and large durable files.
- When: hashing, rendering, validation, apply, and verification run at configured limits.
- Then: work is deterministic, reads each required carrier deliberately, and never retries or rescans without a bound.
- Failure oracle: quadratic rescans, repeated whole-tree writes, unbounded retry, or resource claim without evidence.
- Evidence: operation counts, timing where material, stable ordering, and command results.
- Adversarial face: one shared destination is rewritten once per source instead of once from the frozen batch.
- Obligation: closure mechanics must remain predictable and proportional to the declared source and mutation sets.
- Checklist: WRAP-CK-05.

## WRAP-SC-06 — Drift and interruption stop safely and resume deterministically

- Primary category: 6. Primary type: Failure/recovery. Secondary: Boundary.
- Coverage role: preimage drift; interrupted row; rerun.
- Source: W-4, W-6, W-8, Procedure 5–8.
- Given: a frozen batch whose target changes before apply or whose write is interrupted.
- When: preimages are rechecked and the same stable sources are rerun.
- Then: pre-apply drift makes zero writes; a recorded row identifies any interruption; equal completed bytes are no-ops on rerun.
- Failure oracle: partial valid prefix after known drift, suffix allocation for the same source, or silent overwrite.
- Evidence: before/after hashes, row receipts, rerun result, and unchanged unrelated paths.
- Adversarial face: destination bytes match but a reference carrier drifted and would be overwritten.
- Obligation: failures must preserve recoverability and never conceal a stale preimage.
- Checklist: WRAP-CK-06.

## WRAP-SC-07 — Promotion cannot escape authority or expose protected data

- Primary category: 7. Primary type: Adversarial. Secondary: Negative.
- Coverage role: authorized worktree path; malicious path; sensitive source.
- Source: W-2, W-4, W-5, W-6, W-10, Procedure 3–6 and 12.
- Given: staged paths, symlinks, user-controlled slugs, sensitive evidence, and configured Git intent.
- When: containment, canonical paths, destination data, and authority boundaries are inspected.
- Then: writes stay in the validated session worktree, protected data is referenced or redacted, and the assistant performs no publication or cleanup.
- Failure oracle: traversal, symlink escape, main-checkout write, secret copy, push, merge, branch deletion, or worktree removal.
- Evidence: resolved paths, repository topology, content review, and Git status.
- Adversarial face: a lexically contained target resolves through a symlink into another worktree.
- Obligation: Wrap-up must not widen write or Git authority.
- Checklist: WRAP-CK-07.

## WRAP-SC-08 — Handoff language is accessible across readers and locales

- Primary category: 8. Primary type: Alternative-valid. Secondary: Boundary.
- Coverage role: cold reader; assistive reading; locale-sensitive facts.
- Source: W-9, Procedure 9–10.
- Given: the nine-section handoff with dates, commands, paths, status, and next actions.
- When: hierarchy, link text, plain language, date clarity, and non-default locale assumptions are inspected.
- Then: headings are navigable, terms are defined, dates are unambiguous, and instructions do not depend on visual position or locale guesswork.
- Failure oracle: color-only status, “above/below” instruction, ambiguous date, undefined abbreviation, or path hidden behind vague link text.
- Evidence: heading outline, cold read, link inspection, and locale review.
- Adversarial face: a numeric date changes meaning between common locales.
- Obligation: the durable handoff must remain usable beyond the author's display and locale.
- Checklist: WRAP-CK-08.

## WRAP-SC-09 — Supersession, archive, and Git boundaries remain reversible

- Primary category: 9. Primary type: Change/regression/compat. Secondary: Failure/recovery.
- Coverage role: reciprocal supersession; archive move; deferred publication.
- Source: W-7, W-10, Procedure 7 and 12.
- Given: an ordinary supersession, terminal archive move, or local-only finalization plan.
- When: lifecycle links, inbound references, old body, branch, worktree, and authorized actions are verified.
- Then: the old complete record remains recoverable, references resolve, and unmerged work stays at its exact branch and worktree path.
- Failure oracle: deleted old record, broken inbound path, one-sided link, or cleanup before confirmed merge.
- Evidence: old/new records, archive path, link validation, branch/worktree list, and finalization plan.
- Adversarial face: the new record links back correctly while one hidden inbound path still names the moved source.
- Obligation: memory evolution and deferred Git work must remain traceable and recoverable.
- Checklist: WRAP-CK-09.

## WRAP-SC-10 — Actual-tree review and matching handoff prove closure

- Primary category: 10. Primary type: Positive. Secondary: Counterfactual, adversarial.
- Coverage role: complete proof; intended-versus-actual mismatch; check gaming.
- Source: W-8, W-9, W-11, Procedure 8–12.
- Given: frozen subject digest, actual project tree, guard results, two fresh reports, session handoff, and durable note.
- When: exact checks rerun and one plausible unintended path or stale claim is challenged.
- Then: evaluators inspected the actual tree, both bodies match, every claim has evidence, and any material change received a new full iteration.
- Failure oracle: manifest-only review, mismatched body, stale digest, reused report, weakened guard, or uncited completion.
- Evidence: tree hashes, validator output, report identities, body comparison, and disposition record.
- Adversarial face: the manifest is perfect but the applied bytes differ at one shared destination.
- Obligation: Wrap-up acceptance must bind to the actual durable result and complete handoff.
- Checklist: WRAP-CK-10.

## Omission sweep

Every W-rule maps to at least one seed and check. Session-specific cases extend the filled frame; they do not modify this source.
