---
name: agent-teams
description: "MUST load when a caller needs persistent teammates instead of fresh subagents. Agent Teams is an operation skill for preflighting the capability, spawning and assigning teammates, and continuing, replacing, or closing them against a caller-supplied adapter."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
user-invocable: false
---

# Agent Teams

Use this skill when a caller needs agents that keep their loaded context across several assignments instead of a
fresh subagent for each one. A **teammate** is one such persistent agent: it is spawned under a stable name,
addressed again by that name, and briefed once per assignment. This capability exists only in Claude Code.
Native Codex has no teammate mechanism and uses its repository custom-agent roles instead.

The **manager** is the caller, and it is the only agent that spawns, briefs, dispatches, continues, replaces,
and closes a teammate. Persistence changes when work is scheduled and nothing else: authority, assignment
shape, the evidence that decides acceptance, and the single ordered writer chain are the same whether the work
runs on teammates or on fresh subagents. The operation ends with a recorded close state for every teammate it
spawned.

The caller also supplies an **adapter**: five inputs this operation consumes and never invents — the acceptance
signal, the recovery evidence set, the mutation-surface list, the assignment-field set, and the per-role reuse
boundaries. Each belongs to the caller's own model of acceptance and evidence, and each is consumed at a named
step. Everything else this operation needs is a precondition the Procedure checks and records, never an
assumption it starts from: Phase 1 proves the runtime, the enabling setting, the role permissions, and the
caller's own standing before any teammate is spawned.

## Principles

### Persistence changes scheduling, never authority

A teammate keeps its loaded context between assignments, so the next assignment starts sooner and repeats less
of what the teammate already knows. It gains nothing else by persisting: the manager still owns every dispatch,
every acceptance, and every user decision, exactly as it would with fresh subagents.

### Runtime status is scheduling information, not completion evidence

An idle notice, a task status, and a teammate's own summary all report where the runtime believes the work is,
not whether the work is right. Only the caller's acceptance signal decides completion, because a teammate that
finished correctly and a teammate that stopped reporting look the same from outside.

### Check the capability before relying on it

Teammates depend on a runtime, an environment setting, a per-role permission, and the caller's own standing,
and any one of them can be absent in a session that otherwise looks normal. Proving all four before the first
spawn turns a silent mid-work failure into a named prerequisite and a working fallback.

### Keep one writer regardless of teammate count

Several teammates can hold context at once, but only one may write to a given surface at a time and the rest
read. A larger team raises the chance of a second writer, so the number of teammates available never relaxes
the ordered writer chain.

## Rules

- **MUST record a checked result for the runtime, the enabling environment variable, the per-role permission,
  and the caller's non-teammate standing before spawning anything.** A spawn before all four are recorded fails
  this rule, and so does a shortfall report that does not name the exact setting or condition behind each gap.

- **MUST take the acceptance signal, the recovery evidence set, the mutation-surface list, the assignment-field
  set, and the per-role reuse boundaries from the caller.** Supplying, defaulting, or inferring any of the five
  inside this operation fails the rule; a missing input stops the operation and returns the question to the
  caller.

- **MUST hold every write-capable assignment in one ordered writer chain, whatever the teammate count.** Two
  live assignments that may write to the same surface in the caller's mutation-surface list fail this rule even
  when both teammates are idle, and parallel work is permitted only when it writes to no listed surface.

- **MUST replace every in-process teammate after `/resume` or `/rewind`, and carry one across compaction only
  after its identity, assignment, addressability, and idle state each pass.** Continuing a name that survived a
  boundary without that proof fails this rule, and one failed check replaces that teammate.

- **NEVER treat an idle notice, a runtime task status, or a teammate's own summary as evidence that the work is
  done or correct.** A teammate's claim that an artifact is complete, frozen, or verified is a claim and not a
  check, and silence is not even a claim; only the caller's acceptance signal closes an assignment.

- **NEVER let a teammate change scope, decide for the user, accept or reassign work, or authorize destructive
  or external action.** The prohibition holds whoever asks, including the manager and another teammate, and it
  covers spawning, briefing, or becoming a teammate.

## Procedure

### Phase 1 — Preflight the Teammate Capability

#### 1.1 Confirm the preconditions and take the caller's adapter

- Enter with the active runtime named, the caller's five adapter inputs, and the caller's own identity. The
  caller is the manager of its own work; this operation invents none of those values.
- Take the five adapter inputs first. Each is supplied by the caller's own model of acceptance and evidence,
  and each is consumed by a named later step. This operation owns none of them.

| Adapter input | What the caller supplies | Consumed at |
|---|---|---|
| Assignment-field set | Every field a brief must carry, including identity, scope, worktree, branch, allowed and protected paths, verification, and expected artifact | Step 2.1 |
| Per-role reuse boundaries | What one continuous chain of work means for each role in the caller's model | Steps 2.1 and 3.3 |
| Mutation-surface list | Every surface a write-capable assignment can change | Step 2.2 |
| Acceptance signal | The one thing that decides whether a returned report is accepted | Step 3.2 |
| Recovery evidence set | The evidence that rebuilds assignment state after a context boundary | Step 4.2 |

- Check every precondition below and record its exact result. Check all four before reporting, so one report
  names every gap instead of exposing them one at a time.

| Precondition | How to check it | What supplies it |
|---|---|---|
| The active runtime is Claude Code | The runtime the caller named | Nothing. Native Codex has no teammate mechanism and uses its repository custom-agent roles instead |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is set in the live session environment | `printenv CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | The `env` block of `.claude/settings.json` |
| An `Agent(<role>)` permission exists for every role the caller may spawn | Read `permissions.allow` in the settings sources that apply, local before project before user | The `permissions.allow` list of `.claude/settings.json` |
| The caller is the session lead and not itself a teammate | The caller's own identity | Nothing. A teammate cannot spawn a teammate, so a teammate caller has no path to this capability |

- Read the environment variable from the live session environment, not from a settings file. A settings file
  is one source of that value and an exported shell variable is another, so only the live environment answers
  whether it is set.
- Evidence is the confirmed runtime, each precondition's exact recorded result, and the recorded adapter.
- Continue to Phase 2 when every precondition holds. Go to Step 1.2 when any precondition fails. Stop and ask
  the caller when an adapter input is missing, because this operation supplies none of the five itself.

#### 1.2 Report the missing prerequisite and continue with fresh subagents

- Enter with every precondition Step 1.1 recorded as failed.
- Name each missing prerequisite individually, with the exact setting or condition that supplies it, and state
  what the caller loses: continuity across assignments, and nothing else.
- Continue the caller's work with fresh non-persistent subagents. Persistence changes scheduling only, so
  authority, assignment shape, the acceptance signal, the caller's evidence, and the single ordered writer
  chain all survive the fallback unchanged.
- Never continue silently and never pause for a user decision on this absence. Silence reproduces the failure
  this preflight exists to catch, and a pause stops the caller's work over a loss of continuity alone.
- Evidence is each named absence and the degraded path the caller now runs on.
- This is a terminal state of the operation. A degraded run spawns no teammate, so it creates no teammate
  lifecycle for Phase 5 to close. Return the report to the caller and run the remaining work with fresh
  subagents.

### Phase 2 — Spawn and Assign One Teammate

#### 2.1 Spawn and assign a teammate

- Enter with one bounded unit of work, the adapter's assignment-field set, and its per-role reuse boundaries.
- Select the role from the Roster below. Start each role lazily: spawn it at the first assignment that needs
  it, never in advance. There is no team-creation action to perform; the team exists from the first spawn.

| Role | Reuse boundary |
|---|---|
| leader | One coherent shaping chain, as the caller's per-role reuse boundary defines it |
| executor | Related ordered tasks in one subsystem, as the caller's per-role reuse boundary defines it |
| assistant | One coherent narrow support chain, as the caller's per-role reuse boundary defines it |

- Evaluators are always fresh and never join a persistent team. An evaluation that must stay independent
  cannot come from an agent already holding the work's context, so no evaluator appears in the Roster and no
  teammate is converted into one.
- Spawn the selected role under a stable name and give its work a stable assignment identifier. When Step 4.1
  has already decided to continue an existing teammate, address that teammate instead of spawning; every
  remaining bullet in this step applies unchanged.
- Deliver one brief built through the [Delegation](../../delegation/SKILL.md) skill, carrying every field in
  the caller's assignment-field set. State the resolved skill and agent roots and name every skill the role
  must load, because a subagent definition's preload fields are not applied to a teammate. An unnamed skill is
  an unloaded skill.
- Re-anchor the write boundary in every brief, fresh or continued: the exact worktree, branch, allowed paths,
  and protected paths the assignment-field set carries. A continued teammate's earlier boundary is not its
  current one.
- The manager alone dispatches. A teammate can neither spawn nor assign another teammate, so no assignment
  reaches a teammate except from the manager.
- Evidence is the named teammate, its stable assignment identifier, and the delivered brief.
- Continue to Step 2.2.

#### 2.2 Take the acknowledgement and hold the single writer chain

- Enter with the delivered brief and the adapter's mutation-surface list.
- Take the teammate's acknowledgement of the assignment identifier, the scope, and the expected artifact
  before it starts working. A reply that does not restate all three is not an acknowledgement.
- Permit one write-capable assignment at a time across every surface in the caller's mutation-surface list.
  Reject a dispatch that would put a second writer on any listed surface.
- Allow parallel work only for independent read-only work: study, factual investigation, competing hypotheses,
  test interpretation, and critique. A read-only helper writes to no listed surface.
- Verify before dispatch that the branch and worktree named in the brief still match the assignment and that
  no other writer holds them.
- Evidence is the acknowledged assignment and the one ordered writer chain.
- Continue to Phase 3. Go to Step 4.1 when the acknowledgement does not arrive, because an unaddressable
  teammate is a replacement decision rather than a longer wait.

### Phase 3 — Monitor, Accept, and Reuse One Assignment

#### 3.1 Monitor the working teammate

- Enter with the acknowledged assignment.
- Monitor the working teammate actively rather than waiting on it. Send the next bounded assignment as soon as
  the writer chain allows it.
- Hold direct messages between teammates to assigned facts, results, and critique. Return material
  disagreement to the manager, who resolves routine in-contract disagreement from evidence and stops only at
  the caller's blocker boundary.
- A teammate may never do any of the following, whoever asks it to:

  - change scope;
  - decide for the user;
  - accept or reassign work;
  - change the caller's route;
  - authorize destructive or external action; or
  - spawn, brief, or become another teammate.

- Evidence is the teammate's returned status and artifact.
- Continue to Step 3.2 on a returned report. Go to Step 4.1 on failed, malformed, or unreachable work.

#### 3.2 Hand the report to the caller's acceptance signal

- Enter with the returned report and the adapter's acceptance signal.
- Hand the report to the acceptance signal. It alone decides acceptance. This operation schedules work and
  never accepts it.
- Read completion from that signal only. An idle notice, a runtime task status, and the teammate's own summary
  are scheduling information: they report where the runtime believes the work is, not whether the work is
  right. A lagging or idle status proves neither success nor failure.
- Evidence is the acceptance or rejection recorded against the assignment identifier.
- Continue to Step 3.3 on acceptance. Go to Step 4.1 on rejection.

#### 3.3 Verify reuse readiness

- Enter with the accepted report and the adapter's per-role reuse boundaries.
- Confirm all four conditions before another assignment goes to the same teammate: the prior assignment is
  closed by the acceptance signal; the teammate is idle and addressable, proved by a direct exchange rather
  than by an absence of activity; the next assignment carries a new identifier; and the next assignment
  overlaps no other writer.
- Confirm the next unit of work falls inside this role's reuse boundary as the caller defines it.
- Evidence is the reuse-eligible teammate, or the exact condition that failed.
- Go to Step 4.1 with that result, whether every condition held or one failed, because Step 4.1 owns the
  decision either way. Go to Phase 5 when no further assignment exists.

### Phase 4 — Replace and Recover Teammates

#### 4.1 Decide continuation or replacement

- Enter with a candidate teammate and the next assignment it would take.
- Continue the teammate only when every one of these remains coherent between the two assignments:

  - role;
  - scope;
  - subsystem;
  - dependency chain;
  - authority;
  - loaded context;
  - write boundary; and
  - addressability.

- Replace the teammate after any of these triggers:

  - a role or subsystem change;
  - context drift;
  - failed or malformed work;
  - lost addressability;
  - a protected-work conflict; or
  - a requirement for fresh independence.

- There is no task-count limit. Evidence of coherent context decides reuse, not how many assignments the
  teammate has already taken.
- A replacement is a new teammate, spawned under a new name and briefed from nothing. Do not repair a drifted
  teammate by sending it corrections, because the drifted context stays loaded.
- Evidence is the continuation or replacement decision and the coherence or trigger evidence behind it.
- Return to Step 2.1 to assign the continued teammate or to spawn its replacement.

#### 4.2 Recover after a context boundary

- Enter with the boundary that occurred and the adapter's recovery evidence set. The trigger decides the
  branch, so establish which boundary occurred before checking anything.
- After `/resume` or `/rewind`, replace every in-process teammate unconditionally. They do not survive those
  boundaries, so no check can find one; a surviving name is a name, not a teammate.
- After compaction, verify each teammate's identity, assignment, addressability, and idle state, and continue
  it only when all four checks pass. One failed check replaces that teammate.
- Rebuild assignment state only from the caller's recovery evidence set. Never infer a teammate's survival
  from a name, and never rebuild an assignment from a recollection of it.
- Evidence is the verified or replaced teammates and the rebuilt assignment state.
- Return to Step 2.1 for every replacement. Stop and report to the caller when the recovery evidence is
  incomplete or contradictory, because a wrong rebuild dispatches a writer against the wrong boundary.

### Phase 5 — Close the Teammate Lifecycle

#### 5.1 Shut down or retain each teammate

- Enter with a teammate that has no further assignment.
- Decide deliberately and record which decision was taken: shut the teammate down, or retain it against a
  named later assignment. A retained teammate keeps its loaded context and can be addressed again; a shut-down
  one cannot.
- Evidence is the recorded close state for every teammate the session spawned.
- Continue to Step 5.2 once every teammate has a recorded close state.

#### 5.2 Confirm what the runtime closes automatically

- Enter with the recorded close states from Step 5.1.
- The runtime removes the team itself when the session ends. There is no team-deletion action and no teardown
  command, so invent neither; a step that claims to tear down a team describes something the platform does not
  provide.
- Everything outside the runtime remains the caller's: its branch, worktree, commits, and its own evidence.
  This operation closes teammates and nothing else.
- Evidence is the closed lifecycle and the state the caller still owns.
- The lifecycle is complete.

## References
