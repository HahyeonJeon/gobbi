# Dual-System WORK

This document owns the manager mechanics shared by every WORK stage. Step adapters supply the specialist, scope, and step-specific evidence; the record command owns artifact schemas, targets, rendering, and validation.

## Entry contract

Enter only after DISCUSSION has resolved the iteration's scope, inputs, acceptance criteria, authority, and material choices. Assign one stable WORK contract containing:

- the same neutral objective and evidence for both systems;
- the step, iteration, task when applicable, and stable assignment IDs;
- exact in-scope and out-of-scope boundaries;
- required reads and frozen input identities;
- expected structured artifact kind and verification;
- the user-authority and failure escape paths.

Neither contributor receives the other system's draft before both drafts are complete and frozen.

## Independent drafts

Dispatch one Claude contributor and one Codex contributor from the same contract. Each authors only its system-labeled draft.

The active-runtime contributor follows the applicable specialist and delegation skills. Every opposite-system operation is a new read-only, ephemeral command-line process supplied with complete inputs and an artifact-specific JSON Schema:

- From Claude Code, invoke Codex with `codex exec --ephemeral --sandbox read-only --output-schema <schema> -`.
- From native Codex, invoke Claude with `claude -p --permission-mode plan --no-session-persistence --json-schema <schema>`.

The peer process cannot write into the session tree. An active-runtime assistant passes its structured response to [`record/scripts/session-record.sh`](../../record/scripts/session-record.sh) `write-artifact`, supplying expected system, step, iteration, assignment, kind, and canonical target.

Freeze both rendered drafts. Validate their identities, non-emptiness, iteration, assignment, source digests, and system labels before exposing either draft to the other system.

## Reciprocal review

After both drafts freeze:

1. Give the frozen Codex draft and complete original contract to a fresh Claude review operation.
2. Give the frozen Claude draft and complete original contract to a fresh Codex review operation.
3. Keep both review operations read-only and independent.
4. Store each validated response through the record command.
5. Freeze and validate both cross-reviews before synthesis.

Each cross-review checks correctness, omissions, evidence, scope, compatibility with the neutral contract, and material disagreements. It does not edit either draft or decide for the user.

## Synthesis and open decisions

The active runtime's step specialist synthesizes the canonical candidate from both frozen drafts and both frozen cross-reviews:

- Claude owns synthesis when Claude Code is active.
- Codex owns synthesis when native Codex is active.

The specialist must preserve useful differences, explain every material selection, and avoid introducing unreviewed scope. Record each unresolved material conflict in the iteration's open-decisions artifact with its evidence, consequences, and available choices.

Pause for the user on any scope, design, destructive, publication, authority, or otherwise material conflict. Apply only the user's decision. Update the synthesis and mark every decision resolved before EVALUATION.

For Execution, the active-runtime executor is the sole worktree writer: it applies the resolved synthesis in the ordered writer chain and records verification evidence. The peer operations remain read-only.

## Package validation

Run [`../scripts/validate-dual-system-work.sh`](../scripts/validate-dual-system-work.sh) on the complete iteration package. It must prove the required draft and cross-review identities, frozen-input digests, ephemeral peer identities, synthesis, resolved decisions, and contract consistency. Missing, extra, mislabeled, stale-iteration, empty, or same-author evidence blocks the transition.

The package is complete only when the validator passes, the manager rereads the synthesis and decisions, and any step-specific verification succeeds. Then transition to EVALUATION.

## Failure and waiver

On an unavailable system, timeout, malformed structured response, renderer error, identity mismatch, or validator failure:

1. pause the WORK stage;
2. preserve the last valid files unchanged;
3. report the exact system, operation, assignment, and error;
4. offer retry, repair of the bounded input, explicit waiver, return to DISCUSSION, or abort as applicable.

A waiver requires an explicit user decision naming the unavailable system, one step, and one iteration. Store it as a material decision and link it from the final manifest outcome. A waiver cannot carry forward. No silent single-system continuation is valid.

## Completion proof

WORK is complete when both independent drafts and both reciprocal reviews are frozen and valid, the active-runtime specialist's synthesis is complete, every material decision is resolved, the package validator passes, and any Execution write has independent verification in the isolated worktree.
