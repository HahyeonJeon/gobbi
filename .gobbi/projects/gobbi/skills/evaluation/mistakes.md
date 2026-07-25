---
type: mistakes
skill: evaluation
description: "Recorded traps for evaluation — load before doing evaluation work"
updated: 2026-07-21
---

# Evaluation — Mistakes

> Load before any evaluation work. Each `## ` section is one active trap; `## Archived` holds superseded ones.

## Freeze Canonical Candidate Before Evaluating

`priority: high` · `domain: verification` · `added: 2026-06-24` · `status: active` · `tags: [verification, evaluation]`

**What happened** — Evaluators were dispatched while the WORK writer could still change the canonical candidate, so the reports reviewed different bytes from the later declared subject.
**Why it happens** — An idle notification or partial handoff was mistaken for completed, frozen creation evidence.
**How to detect** — A promised artifact has not been reread, a required creation check is incomplete, the subject version can still change, or a calling workflow's writer has not completed its handoff.
**Correct approach** — Freeze one stable subject and its required supporting evidence before independent evaluation. Stop writer changes during the review. If the subject changes, bind a new complete evaluation to the new version. In Gobbi, its workflow adapter additionally proves the writer handoff, validates the dual-WORK package, resolves material decisions, computes the digest, and dispatches both fresh evaluators.

### Related

- [[evaluator-dispatch-before-work-handoff-complete]] — the manager-side assignment handshake for the same immutable-subject boundary.

## A Gobbi Peer Response Becomes One System Report

`priority: high` · `domain: evaluation` · `added: 2026-07-03` · `status: active` · `tags: [evaluation, process]`

**What happened** — In a Gobbi run, an evaluator returned findings in conversation or wrote several perspective files directly, leaving the workflow's canonical report incomplete or mixed across attempts.
**Why it happens** — The seven lenses were confused with seven storage artifacts, and evaluator authorship was confused with Record-owned persistence.
**How to detect** — A Gobbi system evaluation is spread across per-perspective files, inline response prose substitutes for the adapter-required report, or no single system artifact contains its required perspectives, Overall, ledger, checklist, machine JSON, and verdict.
**Correct approach** — The general Evaluation method produces one self-contained semantic result without prescribing storage. In Gobbi, require one schema-valid JSON response from each fresh evaluator. The active-runtime assistant validates it and passes it to `session-record.sh write-artifact`, which atomically renders one `evaluation/iteration-{n}/{system}.md`. Reread that report and run the workflow's evaluation validator before aggregation.

## Skill Surface Wording Must Pass Its Own Guard

`priority: medium` · `domain: verification` · `added: 2026-07-05` · `status: active` · `tags: [evaluation, verification, tooling]`

**What happened** — Proposed wording for a guard-governed skill companion violated that companion's own path and structure rules.
**Why it happens** — Review confirmed that a guard was listed but never ran it against the actual proposed text.
**How to detect** — A change targets `skills/{skill}/mistakes.md` or another guarded surface, but evaluation cites the guard without executing it on the candidate rendering.
**Correct approach** — Run the governing validator on the real candidate text and inspect its output. A named guard is not evidence until it has accepted the bytes that will be stored.

## User Approved Removal Must Be Checked Against Locked Evidence

`priority: medium` · `domain: verification` · `added: 2026-07-08` · `status: active` · `tags: [verification, process]`

**What happened** — A no-loss review flagged a deliberate user-approved removal as an accidental omission.
**Why it happens** — A before-and-after diff cannot distinguish silent loss from a resolved scope or design decision.
**How to detect** — A finding says removed content must return, while locked scope or resolved `open-decisions.md` evidence explicitly authorizes the removal.
**Correct approach** — Compare every alleged normative loss with locked scope, resolved open decisions, and user-approved authority evidence in the frozen bundle. When that evidence contradicts the finding, recommend `disputed` with the exact source. Do not restore the content or use a retired `won't-fix` disposition.

### Related

- [[freeze-canonical-candidate-before-evaluating]] — the evaluated bundle must include the exact decision evidence that explains deliberate removals.

## Execution Evaluator Union Check Must Cover Softened Items

`priority: high` · `domain: process` · `added: 2026-07-14` · `status: active` · `tags: [evaluation, verification]`

**What happened** — An evaluator checked preserved hard rules but skipped softened guidance and missed a narrowed condition.
**Why it happens** — Softer language was treated as lower-risk even though it can still carry load-bearing scope.
**How to detect** — A rewrite keeps some rules hard and softens others, but the semantic-union review enumerates only the hard set.
**Correct approach** — Diff both hard and softened items against the preimage. Confirm every source condition, exception, boundary, and recovery path survives at its intended force. Creator or author wording does not lower this evidence requirement.

## Shell Dependent Claims Need Executable Evidence

`priority: medium` · `domain: process` · `added: 2026-07-11` · `status: active` · `tags: [process, evaluation, verification]`

**What happened** — An evaluator marked Git scope, parsed values, identity, or file-mode claims PASS without a runtime capable of executing the proving command.
**Why it happens** — Close reading was treated as direct proof of live repository or parser behavior.
**How to detect** — A report passes a command-dependent claim but cites only an author report, prose, or static file reading.
**Correct approach** — Keep the capability limit visible and use fixed-target read-only executable evidence from an independent capable system. Attribute the proof to the system that ran it, not to the shellless evaluator.

## A Gobbi Evaluator Retry Must Preserve The Last Complete Report

`priority: high` · `domain: process` · `added: 2026-07-11` · `status: active` · `tags: [process, evaluation, verification]`

**What happened** — A Gobbi retry wrote directly over canonical evaluation evidence and failed partway, leaving mixed bytes from separate attempts.
**Why it happens** — The workflow's canonical target was used as incremental scratch space rather than an atomic publication boundary.
**How to detect** — A Gobbi retry targets an existing `evaluation/iteration-{n}/{system}.md`, writes before full adapter validation, or can replace only a prefix before timeout or failure.
**Correct approach** — Keep the general evaluation result self-contained. In Gobbi, capture retry JSON outside the canonical target. Validate the complete response, identity, schema, perspectives, Overall, ledger, checklist, fingerprints, and derived verdict first. Then use the Record owner to atomically replace the single system report. A failed retry leaves the prior report byte-for-byte unchanged.

### Related

- [[iteration-artifact-edited-in-place-destroys-snapshot]] — prior iteration evidence is immutable; a material change uses the next full iteration.
- [[evaluator-dispatch-before-work-handoff-complete]] — report publication begins only after WORK handoff is complete.
