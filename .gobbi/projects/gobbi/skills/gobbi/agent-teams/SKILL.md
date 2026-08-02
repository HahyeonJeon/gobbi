---
name: agent-teams
description: "MUST load when a caller needs persistent teammates instead of fresh subagents. Agent Teams is an operation skill for preflighting the capability, spawning and assigning teammates, and continuing, replacing, or closing them against a caller-supplied adapter."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
user-invocable: false
---

# Agent Teams

{Intro — written by the Principles, Rules, Intro, and References task. Two or three short paragraphs orienting
a cold reader to the actor, trigger, outcome, boundary, and operating model. Names the Claude Code boundary,
since native Codex uses its repository custom-agent roles instead. Names the adapter-driven operating model:
the caller supplies the acceptance signal, the recovery evidence set, the mutation-surface list, the
assignment-field set, and the per-role reuse boundaries, and this operation owns none of them. States every
prerequisite as a precondition the Procedure checks, never as an assumption. Adds no policy the body does not
own.}

## Principles

### Persistence changes scheduling, never authority

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Runtime status is scheduling information, not completion evidence

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Check the capability before relying on it

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

### Keep one writer regardless of teammate count

{One durable mental model — written by the Principles, Rules, Intro, and References task.}

## Rules

- **MUST {complete the preflight before spawning and report the exact missing prerequisite}.**
  {Self-contained pass condition.}

- **MUST {take the acceptance signal, the recovery evidence set, the mutation-surface list, the
  assignment-field set, and the per-role reuse boundaries from the caller's adapter}.** {Self-contained pass
  condition.}

- **MUST {keep every mutation in one ordered writer chain}.** {Self-contained pass condition.}

- **MUST {replace rather than continue a teammate after `/resume` or `/rewind`}.** {Self-contained pass
  condition.}

- **NEVER {treat an idle notice, a runtime task status, or a teammate's own summary as completion
  evidence}.** {Self-contained failure condition.}

- **NEVER {let a teammate change scope, decide for the user, accept or reassign work, or authorize
  destructive or external action}.** {Self-contained failure condition.}

## Procedure

### Phase 1 — Preflight the Teammate Capability

#### 1.1 Confirm the preconditions and take the caller's adapter

- {Input or precondition: the active runtime, the caller's five adapter inputs, and the caller's own identity.}
- {Action and decision rule: confirm the runtime is Claude Code, then check each precondition — the Agent
  Teams environment variable, the role permissions, and that the caller is the session lead rather than a
  teammate, because a teammate cannot spawn a teammate.}
- {Inline lookup: the five caller-supplied adapter inputs — the acceptance signal, the recovery evidence set,
  the mutation-surface list, the assignment-field set, and the per-role reuse boundaries — each with the step
  that consumes it.}
- {Evidence or state change: the confirmed runtime, each precondition's exact result, and the recorded
  adapter.}
- {Next branch: continue to Phase 2 when every precondition holds; go to Step 1.2 on the first absence; stop
  and ask the caller when an adapter input is missing.}

#### 1.2 Report the missing prerequisite and continue with fresh subagents

- {Input or precondition: the first failed precondition from Step 1.1.}
- {Action and decision rule: name the exact missing prerequisite and the setting that supplies it, then
  continue with fresh non-persistent subagents rather than pausing, because the fallback loses only continuity
  and no authority, evidence, or single-writer guarantee depends on persistence.}
- {Evidence or state change: the reported absence and the degraded path the caller now runs on.}
- {Next branch: run the caller's work with fresh subagents and go to Step 5.2; never continue silently and
  never pause for a user decision on this absence.}

### Phase 2 — Spawn and Assign One Teammate

#### 2.1 Spawn and assign a teammate

- {Input or precondition: one bounded unit of work, the adapter's assignment-field set, and its per-role reuse
  boundaries.}
- {Action and decision rule: select the role, start it lazily, spawn it under a stable name, and deliver one
  brief built through the Delegation skill that carries the resolved skill and agent roots and every skill the
  role must load, because a subagent definition's preload fields are not applied to a teammate.}
- {Inline lookup: the Roster — one row per role with its reuse boundary parameterized by the caller's adapter,
  plus the statement that evaluators are always fresh and never join a persistent team.}
- {Evidence or state change: the named teammate, its stable assignment identifier, and the delivered brief.}
- {Next branch: continue to Step 2.2; decide any reuse candidate at Step 4.1 before delivering the brief; the
  manager alone dispatches, because a teammate cannot assign another teammate.}

#### 2.2 Take the acknowledgement and hold the single writer chain

- {Input or precondition: the delivered brief and the adapter's mutation-surface list.}
- {Action and decision rule: take the teammate's acknowledgement of the assignment identifier, scope, and
  expected artifact; permit one write-capable assignment at a time across every listed mutation surface;
  allow parallel work only for independent read-only study, factual investigation, competing hypotheses, test
  interpretation, and critique; reject a dispatch that overlaps another writer.}
- {Evidence or state change: the acknowledged assignment and the one ordered writer chain.}
- {Next branch: continue to Phase 3; go to Step 4.1 when the acknowledgement does not arrive.}

### Phase 3 — Monitor, Accept, and Reuse One Assignment

#### 3.1 Monitor the working teammate

- {Input or precondition: the acknowledged assignment.}
- {Action and decision rule: monitor the working teammate, hold direct messages to assigned facts, results,
  and critique, and return material disagreement to the manager.}
- {Inline lookup: what a teammate may never do — change scope, decide for the user, accept or reassign work,
  change the caller's route, or authorize destructive or external action.}
- {Evidence or state change: the teammate's returned status and artifact.}
- {Next branch: continue to Step 3.2 on a returned report; go to Step 4.1 on failed, malformed, or unreachable
  work.}

#### 3.2 Hand the report to the caller's acceptance signal

- {Input or precondition: the returned report and the adapter's acceptance signal.}
- {Action and decision rule: hand the report to the caller's acceptance signal, which alone decides
  acceptance; read completion from that signal only, never from an idle notice, a runtime task status, or the
  teammate's own summary.}
- {Evidence or state change: the caller's acceptance or rejection, recorded against the assignment
  identifier.}
- {Next branch: continue to Step 3.3 on acceptance; go to Step 4.1 on rejection.}

#### 3.3 Verify reuse readiness

- {Input or precondition: the accepted report and the adapter's per-role reuse boundaries.}
- {Action and decision rule: confirm the teammate is idle and addressable, that its prior assignment closed,
  and that the next assignment carries a new identifier and overlaps no other writer.}
- {Evidence or state change: the reuse-eligible teammate, or the exact condition that failed.}
- {Next branch: go to Step 4.1 for the continuation decision; go to Phase 5 when no further assignment
  exists.}

### Phase 4 — Replace and Recover Teammates

#### 4.1 Decide continuation or replacement

- {Input or precondition: a candidate teammate and the next assignment it would take.}
- {Inline lookup: the coherence list every continuation requires — role, scope, subsystem, dependency chain,
  authority, loaded context, write boundary, and addressability — and the replacement triggers.}
- {Action and decision rule: continue the teammate only when every coherence item holds, and replace it
  otherwise; there is no task-count limit, so evidence of coherent context decides.}
- {Evidence or state change: the continuation or replacement decision and the evidence behind it.}
- {Next branch: return to Step 2.1 to assign the continued teammate or spawn its replacement.}

#### 4.2 Recover after a context boundary

- {Input or precondition: the boundary that occurred and the adapter's recovery evidence set.}
- {Action and decision rule: split by trigger — after `/resume` or `/rewind`, replace every in-process
  teammate unconditionally, because they do not survive; after compaction, verify identity, assignment,
  addressability, and idle state and continue only when every check passes. Rebuild assignment state only from
  the caller's recovery evidence set, and never infer survival from a name.}
- {Evidence or state change: the verified or replaced teammates and the rebuilt assignment state.}
- {Next branch: return to Step 2.1 for every replacement; stop and report when the recovery evidence is
  incomplete or contradictory.}

### Phase 5 — Close the Teammate Lifecycle

#### 5.1 Shut down or retain each teammate

- {Input or precondition: a teammate with no further assignment.}
- {Action and decision rule: shut the teammate down or retain it deliberately, and record which, because a
  retained teammate holds its loaded context and a shut-down one does not.}
- {Evidence or state change: the recorded close state for each teammate.}
- {Next branch: continue to Step 5.2 once every teammate has a recorded close state.}

#### 5.2 Confirm what the runtime closes automatically

- {Input or precondition: the recorded close states from Step 5.1, or the degraded path from Step 1.2.}
- {Action and decision rule: state what the runtime removes on its own when the session ends and what the
  caller still owns, so no step invents a teardown action the platform does not provide.}
- {Evidence or state change: the closed lifecycle and the state the caller still owns.}
- {Next branch: the lifecycle is complete; a degraded run has no teammate state to close.}

## References
