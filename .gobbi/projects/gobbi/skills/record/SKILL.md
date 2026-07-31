---
name: record
description: MUST load for RECORD. Seals iteration evidence, stages typed durable candidates, writes PASS-only canonical artifacts, and verifies the v5/v3 session record.
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Record

Use this skill after every productive step's EVALUATION and user-approved finding-disposition batch. The assistant seals the iteration evidence, stages only supported durable candidates, writes canonical outputs only on PASS, and proves the session record is valid before routing.

This skill owns RECORD, typed staging, canonical output placement, and the command seam. It does not own active transitions, evaluation judgments, durable-memory promotion, or Git finalization.

## Principles

### Record facts at their evidentiary strength

A verified decision, finding, research result, or shipped change can justify a typed candidate. A plausible thought or desire to populate staging cannot. Empty staging is valid.

### Session evidence and durable memory are different

Creation artifacts, evaluations, and outputs remain in the session record. Durable memory begins as typed staging and is promoted only during Wrap-up. Before Wrap-up, no RECORD action writes the project memory tree.

### Canonical outputs are earned by PASS

WORK and EVALUATION evidence exists for every verdict. A canonical output asserts acceptance and therefore exists only after PASS. REVISE and FAIL preserve their evidence without publishing a canonical artifact.

### JSON owners change state atomically

session.json version 5 is the lifecycle manifest. state.json version 3 is the only router. Agents never edit them directly; the record command validates complete candidates and replaces atomically.

## Rules

### Must follow

- **R-1 — Enter with complete review evidence.** Require two valid fresh reports or one exact user-approved missing-system waiver, the aggregate verdict, and the approved finding-disposition batch.
- **R-2 — Preserve iteration evidence.** Drafts, cross-reviews, synthesis, decisions, reports, checks, and verification remain at their iteration paths and are never overwritten by a later iteration.
- **R-3 — Stage only typed candidates.** Every staged file uses one authorized staging type, a memory-owned template, exact evidence, and a stable source identity.
- **R-4 — Accept empty staging.** A clean PASS or non-durable result may leave all staging directories empty. Never create filler.
- **R-5 — Keep prior staging immutable.** Append a distinct supported candidate or record an explicit supersession relationship; do not rewrite earlier evidence to match a later conclusion.
- **R-6 — Keep outputs PASS-only and verify them before routing.** A canonical output is legal when its exact step or Execution task is the current `RECORD` cursor and `lastVerdict` is `PASS`, or after that step or task appears in the matching completed list. It is illegal at DISCUSSION, WORK, EVALUATION, non-PASS RECORD, another task, or an unaccepted future step. This lets RECORD verify the sealed output before the subsequent completion transition without weakening PASS-only placement.
- **R-7 — Keep routing and lifecycle separate.** transition changes only state fields. checkpoint changes only authorized manifest lifecycle fields. Neither path may cross the boundary.
- **R-8 — Use patch files and atomic commands.** Never pass shell-interpolated JSON or edit manifest/state bytes in place. A failed operation leaves prior bytes unchanged.
- **R-9 — Verify shape and placement before routing.** Run the record verifier with the locked task list when applicable and reread every promised artifact.
- **R-10 — Promote only during Wrap-up.** Ideation, Planning, and Execution RECORD write only inside the session root. Wrap-up may apply its validated staging-only promotion under its own skill.
- **R-11 — Record no operational exhaust.** Do not store agent turns, runtime history beyond ordered runtime IDs, usage, cache or token counts, integration counters, iteration event logs, or private conversation capture.

### Must not follow

- Do not change a verdict, finding, disposition, scope, setting, or cursor from RECORD judgment.
- Do not invent a finding, decision, note, or learning to make staging non-empty.
- Do not write an output before PASS.
- Do not copy WORK or EVALUATION artifacts into durable memory.
- Do not edit session.json or state.json with a text editor.
- Do not use a runtime task list as record authority.

## Procedure

### 1. Validate RECORD entry

Read state.json, session.json, the complete current-iteration WORK package, both evaluation reports or the exact waiver, the pair-validation result, approved finding dispositions, relevant earlier iteration evidence, and the expected canonical artifact.

Confirm step, task, iteration, assignment, subject digest, and verdict agree across all inputs. If any report, waiver, or disposition is missing or inconsistent, return NEEDS_CONTEXT and leave the record unchanged.

Evidence: an entry register whose identities match the persisted cursor.

### 2. Freeze the iteration evidence set

Enumerate the current drafts, cross-reviews, synthesis, open decisions, research, evaluator reports, checklist results, verification outputs, and approved disposition record. For Execution, include the task diff, commit, and final-tree verification. For Wrap-up, include the promotion inventory, frozen manifest, actual project delta, guards, and handoff candidates.

Hash the evaluated subject and acceptance evidence. Do not rewrite any earlier iteration file. A later iteration receives a new pre-scaffolded directory.

### 3. Derive typed staging candidates

Inspect the evidence for durable value. A candidate must be one of the record-map staging types and must have a direct source:

| Evidence | Candidate type when durable |
|---|---|
| Approved behavior or coverage obligation | scenarios or checklists |
| User decision, approved disposition, or recurring correction | decisions |
| Reusable source or researched fact | references |
| Approved architecture or interface choice | design |
| Durable rationale whose discussion matters | discussions |
| Deferred work with owner and next action | backlogs/feature or backlogs/project |
| Independent assessment or measured result | reviews or reports |
| Shipped user-visible change | changelogs |
| Generalizable verified lesson | learnings |
| Durable session handoff or journal material | notes |
| Accepted ordered implementation plan | plans, in Planning only |

Do not stage every finding automatically. Stage only what remains useful across sessions and is supported by an approved decision or verified result.

### 4. Write candidates through memory-owned templates

For each candidate, choose one stable kebab-case slug, write it under the exact typed staging directory, and use the corresponding memory template. Include source paths, step, iteration, decision authority, current disposition, and durable content. Keep staging-only routing fields distinguishable from durable fields.

Inspect sensitive data before writing. Reference or redact protected evidence; never copy a secret or private payload into a candidate. If two candidates represent the same durable fact, keep one source record and link the secondary evidence.

If no candidate is justified, write none and explicitly report empty staging as valid.

### 5. Resolve the verdict-specific record

For PASS, prepare the canonical output from the exact evaluated subject while state still names the matching step or task in RECORD with `lastVerdict: PASS`. The manager completes the step or task only after this output verifies. For REVISE or FAIL, preserve the full creation, evaluation, checklist, and disposition evidence but create no output file.

Canonical output placement is:

| Accepted subject | PASS-only output |
|---|---|
| Ideation | 1-ideation/outputs/ideation.md |
| Planning | 2-planning/outputs/plan.md |
| Execution task | 3-execution/task-{NN}-{slug}/outputs/result.md |
| Execution step after the final task | 3-execution/outputs/execution.md |
| Wrap-up handoff | 4-wrap-up/outputs/handoff.md |
| Wrap-up promotion evidence | 4-wrap-up/outputs/promotion-manifest.md |

An output states its source synthesis or actual-tree digest, evaluation report digests, aggregate verdict, approved disposition artifact, verification evidence, and canonical content. Execution's step output indexes every accepted task result and focused commit; it does not replace task outputs.

### 6. Seal a PASS output without changing its subject

Copy or render the canonical artifact from the exact evaluated subject. Do not improve prose, adjust scope, add a claim, or refresh a path after evaluation. Any material change returns to WORK and requires complete fresh EVALUATION.

For Wrap-up, compare the handoff body with the evaluated durable note body before sealing. Only durable frontmatter may differ. The evaluated handoff does not gain post-evaluation Git facts.

### 7. Validate staging and output placement

Confirm every staging file matches an authorized type and template, cites real evidence, and stays under the current step or task staging root. Confirm each output belongs either to the matching current RECORD/PASS cursor or to a step or task already listed as completed. Confirm no output exists at another stage, under a non-PASS verdict, for another task, or for an unaccepted future step. Confirm a PASS output exists at the one canonical path and hashes to the evaluated subject where required.

Run [scenarios.md](scenarios.md) and a fresh copy of [checklists.md](checklists.md). A cosmetic file or empty directory cannot satisfy an artifact check.

### 8. Use the record command seam

Use [session-record.sh](scripts/session-record.sh) only through these operations:

| Need | Operation |
|---|---|
| Fresh v5/v3 record and eager skeleton | init |
| Plan-locked Execution task interiors | scaffold-tasks |
| Router update | transition with a patch file |
| Manifest lifecycle update | checkpoint with a patch file |
| Peer JSON validation and Markdown rendering | write-artifact |
| Schema, containment, shape, task, and placement proof | verify |

RECORD normally uses verify and prepares evidence for the manager's later transition. It does not invoke a transition on its own. When an explicit manifest checkpoint is part of Wrap-up, the manager supplies the authorized patch and owns the visible routing action.

### 9. Verify the complete session record

Run session-record.sh verify with the absolute session root. Supply the complete locked task file after Planning. Reread session.json, state.json, all promised artifacts, the current output placement, and staging inventory.

Confirm there is no separate settings file, lock file, retired capture directory, unknown root entry, symbolic link, unscaffolded task, unauthorized iteration, pre-PASS or wrong-cursor output, or artifact outside its owner-defined path. Exercise placement at the matching RECORD/PASS cursor before the manager applies the completion transition, then verify again after that legal transition. Confirm empty staging passes.

On failure, report the exact path and invariant. Do not work around the command with ad hoc writes.

### 10. Return completion proof to the manager

Return the status contract, aggregate verdict, canonical output path on PASS, exact staged candidates or explicit empty result, verifier command and result, and any concern. The manager rereads these artifacts and applies the state-machine transition.

RECORD is complete only when the evidence is sealed, placement matches the verdict, the verifier passes, and the manager can reproduce the next legal route. A reported status or empty directory alone is not proof.

## References

- [RECORD manager adapter](../workflow/steps/record.md) owns dispatch, manager gates, and verdict routing.
- [Record map](record-map.md) owns the v5/v3 tree, eager scaffolding, typed staging vocabulary, command contract, containment, and atomic semantics.
- [Session manifest schema](schemas/session.schema.json) and [state schema](schemas/state.schema.json) own executable JSON shapes.
- [Draft schema](schemas/draft.schema.json), [cross-review schema](schemas/cross-review.schema.json), and [evaluation report schema](schemas/evaluation-report.schema.json) own peer artifact JSON.
- [Session record command](scripts/session-record.sh) owns rendering, schema validation, atomic replacement, and record verification.
- [Evaluation](../evaluation/SKILL.md) owns findings, checklist completion, and verdicts.
- [Memory rules](../memory/rules.md) and templates own durable record types and frontmatter.
- [Wrap-up](../wrap-up/SKILL.md) owns staging-only promotion and matching handoff bodies.
