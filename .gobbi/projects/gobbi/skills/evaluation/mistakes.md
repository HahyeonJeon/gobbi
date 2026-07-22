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
**How to detect** — The assigned writer has not returned its structured report, idle/addressability is unconfirmed, a promised artifact has not been reread, the package validator has not passed, or the subject digest can still change.
**Correct approach** — Require the writer's explicit report, confirm idle/addressability, reread the canonical synthesis and complete dual-WORK package, validate the package, resolve every material open decision, and compute the subject digest. Stop sending writer deltas. Dispatch two fresh evaluators only after that freeze. If any subject byte changes later, create a new complete iteration and evaluate again.

### Related

- [[evaluator-dispatch-before-work-handoff-complete]] — the manager-side assignment handshake for the same immutable-subject boundary.

## One Peer Response Becomes One System Report

`priority: high` · `domain: evaluation` · `added: 2026-07-03` · `status: active` · `tags: [evaluation, process]`

**What happened** — An evaluator returned findings in conversation or wrote several perspective files directly, leaving the canonical report incomplete or mixed across attempts.
**Why it happens** — The seven lenses were confused with seven storage artifacts, and peer authorship was confused with Record-owned persistence.
**How to detect** — A system's evaluation is spread across per-perspective files, inline response prose substitutes for the report, or no single `{system}.md` contains all seven perspectives, Overall, ledger, checklist, machine JSON, and verdict.
**Correct approach** — Require one schema-valid JSON response from each fresh evaluator. The active-runtime assistant validates it and passes it to `session-record.sh write-artifact`, which atomically renders one `evaluation/iteration-{n}/{system}.md`. Reread that report and run the evaluation validator before aggregation.

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

## Evaluator Retry Must Preserve The Last Complete Report

`priority: high` · `domain: process` · `added: 2026-07-11` · `status: active` · `tags: [process, evaluation, verification]`

**What happened** — A retry wrote directly over canonical evaluation evidence and failed partway, leaving mixed bytes from separate attempts.
**Why it happens** — The canonical target was used as incremental scratch space rather than an atomic publication boundary.
**How to detect** — A retry targets an existing `evaluation/iteration-{n}/{system}.md`, writes before full schema validation, or can replace only a prefix before timeout or failure.
**Correct approach** — Capture retry JSON outside the canonical target. Validate the complete response, identity, schema, perspectives, Overall, ledger, checklist, fingerprints, and derived verdict first. Then use the Record owner to atomically replace the single system report. A failed retry leaves the prior report byte-for-byte unchanged.

### Related

- [[iteration-artifact-edited-in-place-destroys-snapshot]] — prior iteration evidence is immutable; a material change uses the next full iteration.
- [[evaluator-dispatch-before-work-handoff-complete]] — report publication begins only after WORK handoff is complete.
