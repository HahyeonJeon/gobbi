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
handoff must carry the evidence you need to accept the result.

## Rules

- **Write a Goal and a Return in every brief, and other sections only when they have content.** The agent
  cannot start without the Goal or hand back without the Return; an empty section only invites filler.
- **State the Goal as an end state someone who did not do the work can check.** If you cannot name the
  evidence of done, the task is not scoped yet.
- **Give each constraint a short reason, and keep method out of Constraints.** The reason lets the agent judge
  cases the rule did not foresee, and a fixed method removes choices it could make better.
- **Take each taste or preference from a named source.** An invented leaning steers the work toward a guess,
  so label one you inferred.
- **Add every field, table, or status word the caller requires.** The caller is the skill, process, or project
  rule that asked for the brief, and its requirement wins over this template.
- **Accept a handoff only after reading the named result and rerunning the checks you rely on.** A run status
  or activity summary can report success that the work does not show.

## Preferences

### Scope

#### Delegate one self-contained task

- Give each brief one task the agent can finish from the brief and its Materials alone. Point to paths instead
  of pasting conversation history; the agent treats anything missing as unknown.
- Do the work yourself when you can finish it in a few tool calls, because a brief and its handoff cost more.
- Give new work to a fresh agent with one consolidated brief rather than resuming an interrupted agent, whose
  context still holds the old task.

### Brief Construction

#### Start from the template

- Copy this template, replace every placeholder with facts about the task, and drop the sections you have no
  content for:

  ```markdown
  ## Role
  <One line naming the expertise or standard the work needs.>

  ## Goal
  <What must be true when the work is done, who uses the result and for what, how to tell it is done,
  and what a strong result looks like.>

  ## Context
  <Why the work exists, its current state, and decisions already made.>

  ## Constraints
  - <a rule that must hold>: <short reason>

  ## Taste and Preference
  - <a leaning>: <its source or exemplar>

  ## Materials
  | Name | Path | Description |
  |---|---|---|
  | <name> | <absolute path or URL> | <what it gives the agent> |

  ## Return
  <Where the result goes, then the handoff items the agent must return.>
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

#### Write Materials as one table

- List each source in one table with the columns `Name | Path | Description`. Path is an absolute path, URL,
  or other exact location.
- In Description, say what the source gives the agent and whether it rules the work or only shows an example.
  When two sources can disagree, say which one wins.

#### Write the Return

- Say where the result goes: an exact path, or this message when the reply is the result. Then list the
  handoff items below, plus any the caller adds.

### Handoff Content

#### Open with the status

- The handoff opens with `Done` when the Goal is met, or `Blocked` when the work cannot be finished. When the
  caller names its own status words, use those instead.

#### Give the result and its evidence

- Give the result itself, or its exact path or revision. Do not copy a saved result into the handoff.
- List each check that was run with its outcome, **passed**, **failed**, or **inconclusive**, and each check
  that was not run and why.
- List the choices and assumptions made, including any departure from Taste and Preference, then the concerns
  and any extras noticed but not done.

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
- In Sources, list what was read and each search run. In Limits, list searches that found nothing, sources that
  could not be reached, and contradictions.

#### Say what is needed to resume

- When blocked, give the cause and its evidence, what was finished, the state left behind, and what is needed
  to resume.
