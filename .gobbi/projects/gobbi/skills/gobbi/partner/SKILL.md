---
name: partner
description: "MUST load when a caller needs an independent result from the partner system. Partner is an operation skill for preparing, launching, validating, and returning the frozen content of one partner round."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
user-invocable: false
---

# Partner

{Intro — written by the Principles, Rules, Intro, and References task. Two or three short paragraphs orienting
a cold reader to the actor, trigger, outcome, boundary, and operating model. Defines both senses at first use:
"partner" names the system that runs in the runtime the active one is not, and "partner run" names one bounded
invocation of it. Adds no policy the body does not own.}

## Principles

### Keep every partner run independent

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Keep the partner read-only and the caller accountable

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Freeze before comparing

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Treat failure as a visible pause

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

## Rules

- **MUST {bind each partner run to a fresh read-only process with new runtime and invocation identity}.**
  {Self-contained pass condition.}

- **MUST {supply the complete neutral contract and every input inline}.** {Self-contained pass condition.}

- **MUST {freeze both drafts before any cross-review and isolate every evaluator}.** {Self-contained pass
  condition.}

- **MUST {return labeled frozen content and write no file}.** {Self-contained pass condition.}

- **NEVER {transform a response}.** {Self-contained failure condition.}

- **NEVER {infer a waiver, gate, disposition, or route}.** {Self-contained failure condition.}

## Procedure

### Phase 1 — Prepare the Run

#### 1.1 Determine the direction, confirm availability, and take the caller's context

- {Input or precondition: the active runtime, and the caller's stage, assignment, and iteration.}
- {Action and decision rule: derive the launch direction from the active runtime, then confirm the partner
  binary and its required local dependencies exist before anything else runs.}
- {Evidence or state change: the resolved direction, the availability result, and the caller's context.}
- {Next branch: continue on availability; go to Step 2.3 when the binary is missing; stop and ask the caller
  when the stage, assignment, or iteration is missing.}

#### 1.2 Freeze the subject and compose the neutral envelope

- {Input or precondition: the subject the caller wants an independent result over, and the resolved direction.}
- {Action and decision rule: freeze the subject, compose the neutral prompt envelope with its complete inline
  inputs, and place the prompt, response, and stderr captures in a temporary directory outside the session
  tree.}
- {Evidence or state change: the frozen subject and the composed envelope with its invocation identity fields.}
- {Next branch: continue to Phase 2; stop and report when the subject cannot be frozen or an input is missing.}

### Phase 2 — Run and Validate One Partner Run

#### 2.1 Launch one partner run

- {Input or precondition: the composed envelope, the resolved direction, and the confirmed binary.}
- {Action and decision rule: launch once with a bounded timeout, using the command form for the resolved
  direction.}
- {Inline lookup: the version-verified surface table with one row per launch direction and its command form,
  and the instruction to re-run each binary's `--help` before relying on any flag, because installed help wins
  over the recorded table.}
- {Evidence or state change: the exit status, the response capture, and the stderr capture.}
- {Next branch: continue to Step 2.2 on any completed launch; go to Step 2.3 when the launch cannot start.}

#### 2.2 Validate the response

- {Input or precondition: the exit status and the captures from Step 2.1.}
- {Action and decision rule: the six-step check order, run in order, where no later check compensates for a
  failed earlier one.}
- {Evidence or state change: the validated response, or the exact check that failed and what it observed.}
- {Next branch: continue to Phase 3 when every check passes; go to Step 2.3 on the first failure.}

#### 2.3 Pause and report an exact failure

- {Input or precondition: the failed availability check, launch, or response check.}
- {Action and decision rule: classify the failure, surface its required evidence, and apply the mutation rule
  its row fixes.}
- {Inline lookup: the failure matrix, one row per failure, each carrying its evidence to surface and its
  mutation rule.}
- {Evidence or state change: the paused round, the classification, and the surfaced evidence.}
- {Next branch: return the pause to the caller, who owns every recovery choice; the operation neither retries
  nor substitutes content.}

### Phase 3 — Compose the Round and Return It

#### 3.1 Compose an independent-draft round

- {Input or precondition: the caller's contract and the frozen subject.}
- {Action and decision rule: run Phase 2 once per draft so neither draft sees the other, then freeze both.}
- {Evidence or state change: two frozen independent drafts.}
- {Next branch: continue to Step 3.4, or to Step 3.2 when the caller asked for cross-review.}

#### 3.2 Compose a cross-review round

- {Input or precondition: two frozen drafts from Step 3.1.}
- {Action and decision rule: run Phase 2 once per direction, giving each reviewer the neutral contract and the
  frozen draft it did not write, and excluding its own draft as a comparison input.}
- {Evidence or state change: the reciprocal frozen cross-reviews.}
- {Next branch: continue to Step 3.4; stop when either draft is not yet frozen.}

#### 3.3 Compose an evaluation round

- {Input or precondition: the caller's complete frozen evaluation bundle.}
- {Action and decision rule: run Phase 2 once per evaluator, giving each the complete bundle and no other
  evaluator's report or prior session.}
- {Evidence or state change: the isolated frozen evaluation reports.}
- {Next branch: continue to Step 3.4; stop when isolation cannot be proved.}

#### 3.4 Return the labeled frozen content

- {Input or precondition: the frozen content this round produced.}
- {Action and decision rule: return it labeled, state the caller's obligation to place it in its own evidence
  model, and state the non-goals — the operation writes no file, defines no package layout, and decides no
  mode, gate, disposition, or route.}
- {Evidence or state change: the returned labeled content and the removed temporary captures.}
- {Next branch: the round is complete; a paused round returns the Step 2.3 report instead.}

## References
