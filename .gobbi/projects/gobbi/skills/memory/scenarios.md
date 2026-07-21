# Memory Operation Scenarios

Seed scenarios for the [Memory operation](SKILL.md). They exercise the parent rules without redefining them. Each case has an observable failure oracle, one design obligation, and a reserved check in [checklists.md](checklists.md).

## Set contract

- **Target:** the durable-memory candidate lifecycle.
- **Consumers:** Memory actors, Record, Wrap-up, and independent evaluators.
- **Lifecycle:** reusable design and evaluation seed set.
- **Scope:** candidate identification through final durable verification.
- **Non-goals:** session-tree mechanics, destination-apply mechanics, and durable field schemas owned by referenced skills.
- **Stable IDs:** `MEM-FAMILY-{NN}`, `MEM-SCEN-{NN}`, and `MEM-CHECK-{NN}` are never renumbered.
- **Scale threshold:** split under an index above 12 families or 40 category-by-case cells.
- **Coverage gaps:** none in the applicable frame; categories 5 and 8 carry property-based not-applicable decisions.

## Coverage register

| # | Category | Disposition | Covering families or property |
|---|---|---|---|
| 1 | Purpose / outcomes / scope | selected | MEM-FAMILY-01, MEM-FAMILY-02 |
| 2 | Actors / stakeholders / use-context | selected | MEM-FAMILY-02, MEM-FAMILY-03 |
| 3 | Behavior / state / data | selected | MEM-FAMILY-01, MEM-FAMILY-05 |
| 4 | Interfaces / dependencies / structure | selected | MEM-FAMILY-03, MEM-FAMILY-04 |
| 5 | Quality attributes / resource economics | n/a: the operation defines no latency, capacity, cost, or resource target | No family |
| 6 | Failure / recovery / operations | selected | MEM-FAMILY-03, MEM-FAMILY-05 |
| 7 | Trust / harm / governance | selected | MEM-FAMILY-06 |
| 8 | Inclusion / locale | n/a: the operation has no locale-dependent input, format, or interaction surface | No family |
| 9 | Change / compatibility / reversibility | selected | MEM-FAMILY-05 |
| 10 | Evidence / traceability / clarity | selected | All families |

## Coverage matrix

| Family | Positive floor | Alternative-valid | Negative | Exact boundary | Failure / recovery | Adversarial | Change | Counterfactual |
|---|---|---|---|---|---|---|---|---|
| MEM-FAMILY-01 | 01 | n/a: one candidate class | n/a: invalidity is exercised by 03 | 02 | n/a: no external dependency | 03 | n/a: no version event | n/a: no load-bearing premise |
| MEM-FAMILY-02 | 04 | 04 | 05 | n/a: scope is a closed choice, not a numeric edge | n/a: ambiguity halts before mutation | 06 | n/a: no version event | n/a: no load-bearing premise |
| MEM-FAMILY-03 | 07 | n/a: one owner boundary | n/a: malformed input is exercised by 09 | n/a: eligibility is binary | 09 | 08 | n/a: no version event | n/a: no load-bearing premise |
| MEM-FAMILY-04 | 10 | n/a: one handoff identity | n/a: mismatch is exercised by 11 | n/a: equality is binary | n/a: output stays absent until accepted | 11 | n/a: no version event | n/a: no load-bearing premise |
| MEM-FAMILY-05 | 12 | n/a: one-record replacement is the ordinary class | n/a: stale active paths are exercised by 20 | 13 | 17 | 14, 20 | 12, 19, 21 | n/a: disconfirmation becomes supersession |
| MEM-FAMILY-06 | 15 | n/a: one safe evidence route | n/a: unsafe copy is exercised by 18 | n/a: disclosure is binary | n/a: rejection leaves sources unchanged | 18 | n/a: no version event | 16 |

## Source register

| Parent rule | Scenario coverage |
|---|---|
| [M-1](SKILL.md#m-1) | 01, 03, 06, 15, 16, 18 |
| [M-2](SKILL.md#m-2) | 02, 03 |
| [M-3](SKILL.md#m-3) | 04, 05 |
| [M-4](SKILL.md#m-4) | 01, 06, 09, 15, 18 |
| [M-5](SKILL.md#m-5) | 07, 09 |
| [M-6](SKILL.md#m-6) | 02, 08, 09 |
| [M-7](SKILL.md#m-7) | 10, 11 |
| [M-8](SKILL.md#m-8) | 12, 14 |
| [M-9](SKILL.md#m-9) | 13, 14, 17, 19, 20, 21 |
| [M-10](SKILL.md#m-10) | 06, 09, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21 |

## MEM-FAMILY-01 — Candidate discrimination

- **Primary category:** 3 Behavior / state / data — the defining concern is whether evidence becomes a kept candidate.
- **Secondary categories:** 1, 10.
- **Actor and outcome:** a Memory actor distinguishes durable material from session-only material.
- **Source and rationale:** M-1 and M-2 require evidence-backed selection and validate an empty result.
- **Applicability:** every memory run.
- **Priority:** critical.
- **Adversarial face:** MEM-SCEN-03.

### MEM-SCEN-01

- **Primary type:** Positive — an accepted decision with future consequence becomes one typed candidate.
- **Coverage role:** positive; categories 1, 3, 10.
- **Actor:** Memory actor.
- **Given:** an accepted decision, exact source path, and a named future consumer.
- **When:** the actor applies the evidence and durable-value filters.
- **Then:** exactly one candidate remains with source, future use, type-choice input, and no unsupported claim.
- **Failure oracle:** zero candidates or a candidate lacking its exact source.
- **Evidence tuple:** inspect the candidate inventory, source artifact, and durable-value reason.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4).
- **Obligation:** the design must keep one evidence-backed row per durable concept.
- **Check:** [MEM-CHECK-01](checklists.md#mem-check-01).

### MEM-SCEN-02

- **Primary type:** Boundary — the exact empty-to-one candidate transition is exercised.
- **Coverage role:** boundary; categories 1, 3, 6.
- **Actor:** Memory actor.
- **Given:** zero evidence-backed durable facts; compare with the same set plus one accepted durable fact.
- **When:** the filter runs on both sets.
- **Then:** the zero set stays empty without a file; the one set yields exactly one candidate.
- **Failure oracle:** filler appears for the zero set, or the accepted fact is lost at one.
- **Evidence tuple:** compare candidate counts and staged paths for the zero and one inputs.
- **Sources:** [M-2](SKILL.md#m-2), [M-6](SKILL.md#m-6).
- **Obligation:** the design must treat empty as valid while discriminating the first justified candidate.
- **Check:** [MEM-CHECK-02](checklists.md#mem-check-02).

### MEM-SCEN-03

- **Primary type:** Adversarial — cosmetic completeness attempts to force unsupported persistence.
- **Coverage role:** adversarial; categories 1, 3, 10.
- **Actor:** Memory actor.
- **Given:** polished text with the expected headings but no accepted source or future use.
- **When:** it is offered as a durable candidate.
- **Then:** it is dropped and no typed staging file is added.
- **Failure oracle:** labels or prose quality alone earn a candidate.
- **Evidence tuple:** inspect the source register, drop reason, and unchanged staging inventory.
- **Sources:** [M-1](SKILL.md#m-1), [M-2](SKILL.md#m-2).
- **Obligation:** the design must reject cosmetically valid filler.
- **Check:** [MEM-CHECK-03](checklists.md#mem-check-03).

## MEM-FAMILY-02 — Type and scope choice

- **Primary category:** 1 Purpose / outcomes / scope — the defining concern is choosing the right durable job and audience.
- **Secondary categories:** 2, 3, 10.
- **Actor and outcome:** the Memory actor assigns one legal type and scope or stops for authority.
- **Source and rationale:** M-3 and M-4 make type, scope, and candidate completeness load-bearing.
- **Applicability:** every kept candidate.
- **Priority:** high.
- **Adversarial face:** MEM-SCEN-06.

### MEM-SCEN-04

- **Primary type:** Alternative-valid — feature and project scope are materially different valid routes.
- **Coverage role:** alternative-valid; categories 1, 2, 3.
- **Actor:** Memory actor.
- **Given:** one feature-local lesson and one verified lesson that binds multiple features.
- **When:** type and scope are selected.
- **Then:** both use the learnings type; the first is feature-scoped and the second project-scoped.
- **Failure oracle:** both are routed to the same scope merely for convenience.
- **Evidence tuple:** inspect source reach, selected scope, and mapped durable homes.
- **Sources:** [M-3](SKILL.md#m-3).
- **Obligation:** the design must derive scope from the future audience, not path convenience.
- **Check:** [MEM-CHECK-04](checklists.md#mem-check-04).

### MEM-SCEN-05

- **Primary type:** Negative — an unresolved legal type or scope is safely rejected.
- **Coverage role:** negative; categories 1, 2, 3.
- **Actor:** Memory actor.
- **Given:** evidence that could be either a decision or learning and does not establish its durable job.
- **When:** the actor attempts classification.
- **Then:** the actor returns `NEEDS_CONTEXT` with the exact ambiguity and writes nothing.
- **Prohibited side effect:** no candidate, staging file, or durable file is created.
- **Failure oracle:** a type or scope is guessed.
- **Evidence tuple:** inspect the stop report, unchanged candidate bytes, and absent staged path.
- **Sources:** [M-3](SKILL.md#m-3).
- **Obligation:** the design must halt instead of inventing classification.
- **Check:** [MEM-CHECK-05](checklists.md#mem-check-05).

### MEM-SCEN-06

- **Primary type:** Adversarial — a correctly named directory attempts to substitute for semantic type validity.
- **Coverage role:** adversarial; categories 1, 3, 10.
- **Actor:** Memory actor.
- **Given:** a candidate placed under an authorized type name but carrying content that performs another type's job.
- **When:** candidate conformance is checked.
- **Then:** the candidate fails until its type or body is corrected from evidence.
- **Failure oracle:** directory placement alone passes the candidate.
- **Evidence tuple:** compare the candidate body with the selected template boundary and source claim.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4), [M-10](SKILL.md#m-10).
- **Obligation:** the design must verify semantic type fit, not only path shape.
- **Check:** [MEM-CHECK-06](checklists.md#mem-check-06).

## MEM-FAMILY-03 — Record and Wrap-up boundary

- **Primary category:** 4 Interfaces / dependencies / structure — the defining concern is the contract between Memory, Record, and Wrap-up.
- **Secondary categories:** 2, 3, 6, 10.
- **Actor and outcome:** Record stages; Wrap-up promotes only eligible typed sources.
- **Source and rationale:** M-5 and M-6 define the single-writer and typed-ingress boundaries.
- **Applicability:** every kept candidate and every Wrap-up inventory.
- **Priority:** critical.
- **Adversarial face:** MEM-SCEN-08.

### MEM-SCEN-07

- **Primary type:** Positive — a valid candidate crosses the owner boundary once.
- **Coverage role:** positive; categories 2, 4, 10.
- **Actor:** Record and Wrap-up at their owned boundaries.
- **Given:** one complete typed candidate and an authorized staging path.
- **When:** Record stages it and Wrap-up later inventories sources.
- **Then:** the staged file is unchanged, inventoried once, and mapped to one durable outcome.
- **Failure oracle:** Memory writes directly to durable memory, or one source receives zero or multiple outcomes.
- **Evidence tuple:** inspect the staged hash, inventory row, and durable mapping.
- **Sources:** [M-5](SKILL.md#m-5), [M-6](SKILL.md#m-6).
- **Obligation:** the design must preserve single-owner writes and one-source accounting.
- **Check:** [MEM-CHECK-07](checklists.md#mem-check-07).

### MEM-SCEN-08

- **Primary type:** Adversarial — an ineligible file attempts to enter the promotion inventory.
- **Coverage role:** adversarial; categories 4, 6, 10.
- **Actor:** Wrap-up inventory actor.
- **Given:** a plausible durable document outside every authorized typed `staging/` directory.
- **When:** Wrap-up inventories promotion inputs.
- **Then:** the document is excluded and the run reports the ineligible path.
- **Failure oracle:** content quality bypasses source eligibility.
- **Evidence tuple:** inspect the Record-owned type set, inventory, and no durable change for the file.
- **Sources:** [M-6](SKILL.md#m-6).
- **Obligation:** the design must make typed staging the only promotion ingress.
- **Check:** [MEM-CHECK-08](checklists.md#mem-check-08).

### MEM-SCEN-09

- **Primary type:** Failure / recovery — a malformed staged candidate halts before durable change and can be retried from preserved evidence.
- **Coverage role:** failure/recovery; categories 4, 6, 10.
- **Actor:** Wrap-up validation actor.
- **Given:** an authorized typed staging file missing a required type field.
- **When:** final candidate validation runs before apply.
- **Then:** durable writes do not start, the source stays unchanged, and the exact defect is reported.
- **Failure oracle:** a partial durable change occurs or the staged source is edited in place.
- **Evidence tuple:** inspect preimages, staged hash, validation result, and actual durable diff.
- **Sources:** [M-4](SKILL.md#m-4), [M-5](SKILL.md#m-5), [M-6](SKILL.md#m-6), [M-10](SKILL.md#m-10).
- **Obligation:** the design must fail closed and retain the evidence needed for a corrected rerun.
- **Check:** [MEM-CHECK-09](checklists.md#mem-check-09).

## MEM-FAMILY-04 — Handoff identity

- **Primary category:** 4 Interfaces / dependencies / structure — the defining concern is one body crossing the session and durable interfaces.
- **Secondary categories:** 1, 10.
- **Actor and outcome:** Wrap-up seals one reviewed handoff body in two homes.
- **Source and rationale:** M-7 and M-10 require one body identity and final evidence.
- **Applicability:** every accepted session close.
- **Priority:** critical.
- **Adversarial face:** MEM-SCEN-11.

### MEM-SCEN-10

- **Primary type:** Positive — both accepted handoff homes contain one reviewed body.
- **Coverage role:** positive; categories 1, 4, 10.
- **Actor:** Wrap-up handoff actor.
- **Given:** a typed notes candidate whose body was reviewed.
- **When:** Wrap-up seals the accepted session result and durable note.
- **Then:** `4-wrap-up/outputs/handoff.md` and `notes/{area}/{YYYY-MM-DD}-{slug}.md` have identical bodies.
- **Failure oracle:** either path is absent or body bytes differ after durable frontmatter is removed.
- **Evidence tuple:** inspect both paths and run a body comparison.
- **Sources:** [M-7](SKILL.md#m-7), [M-10](SKILL.md#m-10).
- **Obligation:** the design must bind both handoff locations to one reviewed body.
- **Check:** [MEM-CHECK-10](checklists.md#mem-check-10).

### MEM-SCEN-11

- **Primary type:** Adversarial — a post-review edit attempts to make the durable body more complete.
- **Coverage role:** adversarial; categories 4, 10.
- **Actor:** Wrap-up verification actor.
- **Given:** matching reviewed handoff candidates and a later material edit to only one copy.
- **When:** handoff verification runs.
- **Then:** acceptance stops and the changed body must return through review.
- **Failure oracle:** the one-sided improvement passes because both files still look complete.
- **Evidence tuple:** compare reviewed digest and both current body hashes.
- **Sources:** [M-7](SKILL.md#m-7), [M-10](SKILL.md#m-10).
- **Obligation:** the design must reject one-sided or post-review handoff drift.
- **Check:** [MEM-CHECK-11](checklists.md#mem-check-11).

## MEM-FAMILY-05 — Supersession and terminal history

- **Primary category:** 9 Change / compatibility / reversibility — the defining concern is replacing knowledge without erasing history.
- **Secondary categories:** 3, 6, 10.
- **Actor and outcome:** Wrap-up distinguishes a true successor from non-successor closure, then moves
  the full terminal record to the sole project-root archive.
- **Source and rationale:** M-8, M-9, and M-10 require reciprocal history, full terminal moves, and final proof.
- **Applicability:** a durable record is replaced or reaches terminal status.
- **Priority:** critical.
- **Adversarial face:** MEM-SCEN-14.

### MEM-SCEN-12

- **Primary type:** Change / regression / compat — new understanding replaces one active record.
- **Coverage role:** change; categories 3, 9, 10.
- **Actor:** Wrap-up lifecycle actor.
- **Given:** one active old record and one authorized new record that truly replaces it.
- **When:** ordinary supersession completes.
- **Then:** the new record names the old, the old uses `status: superseded` plus a non-null successor,
  and the new record is the only active understanding.
- **Failure oracle:** either lifecycle direction is absent or both records remain active.
- **Evidence tuple:** inspect both frontmatter records and active-tree paths.
- **Sources:** [M-8](SKILL.md#m-8), [M-10](SKILL.md#m-10).
- **Obligation:** the design must make one-record replacement reciprocal and unambiguous.
- **Check:** [MEM-CHECK-12](checklists.md#mem-check-12).

### MEM-SCEN-13

- **Primary type:** Boundary — the exact active-to-terminal transition triggers the move.
- **Coverage role:** boundary; categories 3, 6, 9.
- **Actor:** Wrap-up lifecycle actor.
- **Given:** representative design, plan, and checklist records immediately before and after their
  type-defined terminal statuses: design `retired`, plan `completed` or `abandoned`, and checklist
  `retired`, plus an ordinary supersession control.
- **When:** lifecycle handling runs on both states.
- **Then:** each pre-terminal record stays live; each terminal record moves whole to the project-root
  `archive/{type}/{area}/{YYYY-MM-DD}-{slug}.md`, carries the matching date and compatible reason, and
  preserves original scope and feature. Only the superseded control has a non-null successor.
- **Failure oracle:** an active record moves early; a terminal record remains live; a reason mismatches
  status; a feature-local archive appears; or retirement/completion/abandonment invents a successor.
- **Evidence tuple:** compare status, reason, successor field, active path, project-root archive path,
  original type/scope/feature, and body bytes across each transition.
- **Sources:** [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10).
- **Obligation:** the design must move exactly at the terminal boundary and preserve the full record.
- **Check:** [MEM-CHECK-13](checklists.md#mem-check-13).

### MEM-SCEN-14

- **Primary type:** Adversarial — a shortcut attempts one-sided linkage, a pointer-only archive, or deletion.
- **Coverage role:** adversarial; categories 6, 9, 10.
- **Actor:** independent evaluator.
- **Given:** either a replacement whose old record lacks reciprocal linkage, or a non-successor terminal
  record with a fabricated successor, wrong reason, missing archive fields, mismatched filename date,
  wrong path type/area, feature-local destination, incomplete body, or stale inbound reference.
- **When:** lifecycle verification runs.
- **Then:** strict explicit archive validation and lifecycle verification fail until successor semantics,
  exact project-root path, archive fields, full bytes, and inbound paths are correct.
- **Failure oracle:** a plausible terminal label or valid new record hides an illegal pair, invented
  successor, misplaced archive, lost body, or dangling path.
- **Evidence tuple:** inspect lifecycle fields and compatibility, explicit archive-validator output,
  archived bytes, inbound-link search, and changed-path list.
- **Sources:** [M-8](SKILL.md#m-8), [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10).
- **Obligation:** the design must make destructive or one-sided shortcuts fail.
- **Check:** [MEM-CHECK-14](checklists.md#mem-check-14).

### MEM-SCEN-17

- **Primary type:** Failure / recovery — a terminal move conflict halts without losing the active record.
- **Coverage role:** failure/recovery; categories 6, 9, 10.
- **Actor:** Wrap-up lifecycle actor.
- **Given:** an authorized terminal record and a conflicting archive destination or changed preimage.
- **When:** the move is about to apply.
- **Then:** the move does not start, the active record remains whole, and the exact conflict is reported for a fresh run.
- **Failure oracle:** the active record disappears, a partial archive appears, or the conflict is overwritten.
- **Evidence tuple:** inspect active and archive preimages, post-failure paths, body hashes, and stop report.
- **Sources:** [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10).
- **Obligation:** the design must preserve the complete active record when a terminal move cannot safely apply.
- **Check:** [MEM-CHECK-17](checklists.md#mem-check-17).

### MEM-SCEN-19

- **Primary type:** Change / regression / compat — a valid active-body relative link becomes unresolved
  only because the complete terminal body moves into its typed archive directory.
- **Coverage role:** change; categories 3, 9, 10.
- **Actor:** Wrap-up lifecycle actor and independent evaluator.
- **Given:** an active terminal record whose body contains an outbound relative link that resolves from
  the active directory but not from the project-root archive directory.
- **When:** the authorized terminal move freezes and archives the complete body.
- **Then:** the outbound link text remains byte-identical; the archive body is excluded from scoped
  Markdown-link resolution; and body identity, explicit strict archive validation, lifecycle fields,
  and actual-tree review still pass independently.
- **Failure oracle:** the body link is rewritten or normalized, or closure fails solely because the
  expected frozen outbound link no longer resolves from the archive directory.
- **Evidence tuple:** compare active-preimage and archive body digests and link text, inspect the scoped
  link input set, exact strict-validator output, lifecycle fields, and actual tree.
- **Sources:** [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10),
  [Memory rules §2.7](rules.md#27-strict-archive-form).
- **Obligation:** the design must preserve historical archive-body bytes while retaining every separate
  archive proof.
- **Check:** [MEM-CHECK-19](checklists.md#mem-check-19).

### MEM-SCEN-20

- **Primary type:** Adversarial — a stale active inbound carrier attempts to borrow the archive-body
  link exclusion.
- **Coverage role:** adversarial; categories 4, 6, 9, 10.
- **Actor:** Wrap-up lifecycle actor and independent evaluator.
- **Given:** a terminal move completed, but one changed active Markdown carrier still points to the old
  active path.
- **When:** scoped link and actual-tree verification run.
- **Then:** the active carrier remains inside the link-resolution gate and fails until it is repointed to
  the new archive path.
- **Failure oracle:** the stale active inbound path passes because archive bodies are excluded.
- **Evidence tuple:** inspect old-path search, carrier preimage and result, scoped link output, manifest
  row, and actual-tree delta.
- **Sources:** [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10),
  [Memory rules §2.7](rules.md#27-strict-archive-form).
- **Obligation:** the design must keep every active inbound carrier link-gated and manifest-backed.
- **Check:** [MEM-CHECK-20](checklists.md#mem-check-20).

### MEM-SCEN-21

- **Primary type:** Change / regression / compat — a live namespace move breaks a relative link.
- **Coverage role:** change; categories 4, 9, 10.
- **Actor:** namespace-refactor actor and independent evaluator.
- **Given:** a live memory record moves between active area namespaces and one changed Markdown link no
  longer resolves from its new live location.
- **When:** the full changed-Markdown link gate runs.
- **Then:** the live move fails until every changed live record and carrier resolves; the terminal
  archive-body exclusion is inapplicable.
- **Failure oracle:** the broken live link passes by citing frozen-archive history preservation.
- **Evidence tuple:** inspect the namespace move class, changed-Markdown input set, link-validator output,
  old-path/label sweep, and actual active tree.
- **Sources:** [M-9](SKILL.md#m-9), [M-10](SKILL.md#m-10),
  [Memory rules §1.5](rules.md#refactor-procedure--split--merge--rename-an-area),
  [Memory rules §2.7](rules.md#27-strict-archive-form).
- **Obligation:** the design must keep live namespace refactors under the complete changed-Markdown link
  gate.
- **Check:** [MEM-CHECK-21](checklists.md#mem-check-21).

## MEM-FAMILY-06 — Safe evidence and trace closure

- **Primary category:** 7 Trust / harm / governance — the defining concern is retaining proof without disclosing protected source material.
- **Secondary categories:** 2, 10.
- **Actor and outcome:** a Memory actor preserves a resolvable source trace with bounded disclosure.
- **Source and rationale:** M-1, M-4, and M-10 require supported, conforming, safely verifiable candidates.
- **Applicability:** any candidate derived from sensitive or access-controlled evidence.
- **Priority:** critical.
- **Adversarial face:** MEM-SCEN-18.

### MEM-SCEN-15

- **Primary type:** Positive — sensitive evidence is referenced or redacted while the durable claim remains verifiable.
- **Coverage role:** positive; categories 7, 10.
- **Actor:** Memory actor.
- **Given:** an accepted durable fact supported by protected source material.
- **When:** the typed candidate is authored and verified.
- **Then:** it records a safe pointer or redaction, names the governing source, and contains no protected payload.
- **Failure oracle:** proof is lost entirely or protected content is copied into memory.
- **Evidence tuple:** inspect the candidate, source pointer, redaction, and protected-token scan.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4), [M-10](SKILL.md#m-10).
- **Obligation:** the design must preserve verifiability without retaining protected payloads.
- **Check:** [MEM-CHECK-15](checklists.md#mem-check-15).

### MEM-SCEN-16

- **Primary type:** Counterfactual — the premise that copying source content is required for durable proof is inverted.
- **Coverage role:** counterfactual; categories 7, 10.
- **Actor:** independent evaluator.
- **Given:** a candidate author claims the full protected payload must be copied so a future reader can verify it.
- **When:** the claim is challenged with a resolvable safe pointer and bounded summary.
- **Then:** the full copy is rejected; the safe evidence form still supports the durable claim.
- **Failure oracle:** the operation treats disclosure as the only route to traceability.
- **Evidence tuple:** compare verification using the safe pointer with the rejected full-copy candidate.
- **Sources:** [M-1](SKILL.md#m-1), [M-10](SKILL.md#m-10).
- **Obligation:** the design must disconfirm the false choice between evidence and safety.
- **Check:** [MEM-CHECK-16](checklists.md#mem-check-16).

### MEM-SCEN-18

- **Primary type:** Adversarial — a protected payload is embedded behind a valid citation and expected headings.
- **Coverage role:** adversarial; categories 7, 10.
- **Actor:** candidate author and independent evaluator.
- **Given:** a well-shaped candidate that cites its source but also copies protected source bytes into the body.
- **When:** safe-evidence verification runs.
- **Then:** the candidate fails until the payload is removed and a safe pointer or redaction preserves proof.
- **Failure oracle:** correct shape and citation hide protected retention.
- **Evidence tuple:** inspect the candidate, protected-token scan, source pointer, and corrected bounded form.
- **Sources:** [M-1](SKILL.md#m-1), [M-4](SKILL.md#m-4), [M-10](SKILL.md#m-10).
- **Obligation:** the design must reject protected payloads even when all visible document fields look valid.
- **Check:** [MEM-CHECK-18](checklists.md#mem-check-18).

## Omission and trace sweep

- Every selected category has a positive handled case and every triggered stress type has a case.
- Every family has an adversarial face.
- Every case links to a live parent rule, one observable obligation, and one checklist item.
- Every parent rule appears in the source register. Lifecycle coverage includes true supersession,
  design retirement, plan completion/abandonment, checklist retirement, strict root-archive form,
  frozen archive outbound-link text, active inbound-carrier repair, and live namespace link safety.
- No evidence is embedded beyond safe synthetic case data.
