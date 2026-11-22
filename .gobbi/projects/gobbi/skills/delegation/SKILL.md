---
name: delegation
description: "Delegation sets the shape of a brief that hands work to another agent and of the handoff it returns. Use it whenever you hand work to another agent."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Delegation

Delegation sets the shape of a brief that hands work to another agent and of the handoff that agent returns.
Use it whenever you hand bounded work to another agent, in any project or field.

## Principles

### Say where to arrive, not how to get there

A sharp Goal lets a capable agent choose its own method and still deliver what you need. Leave the method to
the agent.

### Constrain only what must hold

Each constraint takes away freedom the agent could use to do better work. Keep a constraint only when breaking
it would make the result unacceptable.

### Make taste visible

Taste you do not write down is lost, and the result drifts toward a generic default. A stated leaning with an
example steers the work without binding it.

### Write for an agent that knows nothing

The agent has not seen your conversation, so the brief must carry every fact it needs or the path to it. The
handoff gives the next consumer a usable result and the evidence behind it.

## Rules

- **Write a Goal and a Return in every brief, and other sections only when they have content.** The agent
  cannot start without the Goal or hand back without the Return; an empty section only invites filler.
- **State the Goal as an end state someone who did not do the work can check.** If you cannot name the
  evidence of done, the task is not scoped yet.
- **Give each constraint a short reason, and keep method out of Constraints.** The reason lets the agent judge
  cases the rule did not foresee, and a fixed method removes choices it could make better.
- **Take each taste or preference from a named source.** An invented leaning steers the work toward a guess,
  so label one you inferred.
- **Include the authority, recovery details, and return format the caller needs.** These let the agent act
  within scope and let the recipient use the result.
- **Rely on the assigned agent's result and reported checks for the named revision.** Missing evidence,
  conflicting reports, or a required independent check goes to the agent responsible for resolving it.

## Preferences

### Scope

#### Delegate one self-contained task

- Give each brief one task the agent can finish from the brief and its Materials alone. Point to paths instead
  of pasting conversation history; the agent treats anything missing as unknown.
- Group related support questions for one consumer or shared source when separate assignments would repeat
  the same preparation and handoff.
- Give new work to a fresh agent with one consolidated brief rather than resuming an interrupted agent, whose
  context still holds the old task.

#### Use tool results to reach the next decision

- Use confirmed inputs that apply to your revision and environment. Open the cited source for interpretation,
  conflicting evidence, or required independent verification.
- Group independent reads or searches for the same decision in one turn. Keep dependent calls and approvals
  separate.
- Have an edit or check report the measurement its caller needs. For a long-running job, use the host’s
  completion notification or a blocking wait with a timeout. Return to the model when there is a result,
  failure, or timeout to act on.

### Brief Construction

#### Start from the template

- Open with the intended outcome, who needs it, and what would demonstrate success. Give the expected
  Return and any binding conditions. Add context, sources, or preferences when they change the work.
- Share a known entry point, reproducer, or active job ID when it saves rediscovery. Leave tool choice,
  implementation order, and grouping of calls to the recipient.
- Use the relevant parts of this template for a longer assignment:

  ```markdown
  ## Role
  <One line naming the expertise or standard the work needs.>

  ## Goal
  <What must be true when the work is done, who uses the result and for what, how to tell it is done,
  and what a strong result looks like.>

  ## Context
  <Why the work exists, confirmed inputs with their sources and applicable revision or run,
  and the question the recipient still owns.>

  ## Constraints
  - <a rule that must hold>: <short reason>

  ## Taste and Preference
  - <a leaning>: <its source or exemplar>

  ## Materials
  | Name | Path | Description |
  |---|---|---|
  | <name> | <absolute path or URL> | <what it gives the agent> |

  ## Return
  <Who uses the result next and for what, where they can access it, and what the caller needs to know.>
  ```

- Write Role only when naming the expertise or standard changes how the work is done, for example "a release
  engineer who keeps every published tag reproducible".

#### Write a concrete Goal

- Write the Goal as an end state, not an activity, and say who uses the result and for what. Use prose, a
  list, or both, whatever states it most clearly.
- Say what separates a strong result from one that only meets the minimum. This raises the bar and never adds
  scope.
- Pass the user's request as intent, not as fixed wording: mark what the user decided apart from the terms and
  examples they used, and ask the agent to report a better design that conflicts with the request, with its
  evidence, because a quoted word otherwise becomes a constraint no one chose.

#### Sort each line before you write it

- Ask these questions in order, and put the line where the first yes sends it:

  | Question | If yes, put it in |
  |---|---|
  | Must the result do or show this to count as done? | Goal |
  | Would breaking it make an otherwise good result unacceptable, unsafe, or outside what the agent may do? | Constraints |
  | Does it make one acceptable result better than another? | Taste and Preference |
  | Does it only choose how to do the work? | Nowhere; the agent chooses |

- A method belongs in Constraints only when something outside the task requires it, such as a required tool or
  approval step. Give that reason.

#### Write each constraint with its reason

- Write one line per constraint: the rule, a colon, then a short reason.
- Look for real constraints in what the agent may change or run, what is protected, what needs approval, and
  where the result goes. Leave out anything the Goal, tools, or permissions already enforce.

#### Write Taste and Preference from known sources

- Phrase each leaning however reads best, and name its source: the user's words, a project record such as a
  style guide or accepted decision, or an exemplar. Mark one you inferred with `(inferred from <source>)`.
- A named exemplar beats an adjective. Write only leanings that change which acceptable result the agent
  picks.

#### Supply usable Materials

- For a long source, identify the relevant heading, symbol, or log location and what the recipient will
  learn there. For several sources, a table with
  `Name | Path | Description` makes them easy to scan.
- In Description, say what the source gives the agent and whether it rules the work or only shows an example.
  When two sources can disagree, say which one wins.

#### Write the Return

- Name the next consumer and the action the result supports. Choose a direct answer, an existing source
  location, or a shared artifact according to what that consumer needs.
- Give the consumer access to the result once it is ready. When the caller coordinates the work, return its
  location and readiness, plus exceptions or decisions that need the caller's attention.

### Handoff Content

#### Open with the status

- The handoff opens with `Done` when the Goal is met, or `Blocked` when the work cannot be finished. When the
  caller names its own status words, use those instead.

#### Give the result and its evidence

- Give a short answer directly. For a saved result, point the consumer to its exact revision or location and
  the evidence they can use, with the relevant section when the result is long.
- Group **passed** checks. Identify **failed**, **inconclusive**, and required but unrun checks individually,
  with their evidence or the reason it is missing; keep detailed output at its source.
- Surface decisions the caller must make, assumptions or departures that affect acceptance, and unresolved
  concerns. Reference the saved details once instead of copying the report into the reply.

#### Mark what a check could not show

- Call a check inconclusive when it did not exercise what the Goal names, measured a stand-in for it, or could
  not tell success from failure. An inconclusive check shows nothing about the Goal.
- Treat a measured difference, such as a speedup, as inconclusive unless both sides did the same correct work
  under the same settings, repeated alternating runs differ by more than their spread, and the gain is no
  larger than the time the changed part took. Report the number with its run count and spread.

#### Give a study result its sources and limits

- When the result is an answer rather than a change, return it as Finding, Sources, and Limits, so the caller
  can judge how far each claim holds.
- In Finding, mark each claim **stated**, with the source that states it, or **inferred**, with the reasoning.
  What a thing does is not evidence of why it was made.
- In Sources, cite the passages supporting the answer. In Limits, give any unsuccessful search, missing
  source, or contradiction that changes what the caller can conclude.

#### Say what is needed to resume

- When blocked, give the cause and its evidence, what was finished, the state left behind, and what is needed
  to resume.
