---
name: delegation
description: "Delegation is guidance for writing a brief that hands work to another agent, and for the handoff that agent returns."
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

The agent has not seen your conversation, so the brief must carry every fact it needs. The handoff must carry
the evidence you need to accept the result.

## Rules

- **MUST write Goal, Constraints, Taste and Preference, and Return in every brief, in the template order.**
  Leave out Role, Context, or Materials only when it would be empty.
- **MUST state the Goal concretely and definitely.** Say what must be true when the work is done and how
  someone who did not do the work can tell, in whatever form fits the work.
- **MUST keep Constraints to rules that must hold, each with a short reason, and NEVER write the method
  there.** End the section with `Choose the approach within these boundaries.`
- **NEVER invent a taste or preference.** Take each one from the user, project records, or an exemplar, and
  label any you inferred.
- **MUST add every field, table, or status word the caller requires.** The caller is the skill, process, or
  project rule that asked for the brief, and its requirement wins over this template.
- **NEVER accept a run status or activity summary as the handoff.** Read the named result and rerun the checks
  you rely on before you accept it.

## Preferences

### Brief Construction

#### Start from the template

- Copy this template and replace every placeholder with facts about the task:

  ```markdown
  ## Role
  <The expert this work needs: their experience, abilities, and character, shown through the habits they work by.>

  ## Goal
  <What must be true when the work is done, who uses the result and for what, how to tell it is done,
  and what a strong result looks like.>

  ## Context
  <Why the work exists, its current state, and decisions already made.>

  ## Constraints
  - <a rule that must hold>: <short reason>

  Choose the approach within these boundaries.

  ## Taste and Preference
  - <a leaning, with its source or exemplar>

  ## Materials
  | Name | Path | Description |
  |---|---|---|
  | <name> | <absolute path or URL> | <what it gives the agent> |

  ## Return
  <Where the result goes, then the handoff items the agent must return.>
  ```

- Put in Context only what the agent cannot find for itself. The agent treats anything missing from the brief
  and its Materials as unknown.
- Add `###` subsections only when one section holds clearly separate subjects.

#### Write Role through an expert's traits

- Describe the expert this work needs: their experience and knowledge, their abilities, and their character,
  shown through the habits they work by, so the agent works like that person.
- Name real habits instead of praise: "you check every claim against its source before you report it", not
  "you are meticulous".

#### Write a concrete Goal

- Write the Goal as an end state, not an activity, and say who uses the result and for what. Use prose, a
  list, or both, whatever states it most clearly.
- Make done checkable: say how someone who did not do the work can tell the Goal is met.
- Say what separates a strong result from one that only meets the minimum. This raises the bar and never adds
  scope.

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

- Write one line per constraint: the rule, a colon, then a short reason. The reason lets the agent judge cases
  the rule did not foresee.
- Check these areas for real constraints: what the agent may change or run, what is protected, the scope of the
  result (extras go in the handoff, not the work), actions that need approval, what the agent must not read or
  reuse, a fixed format or location, and a time or cost limit. Leave out anything the Goal, tools, or
  permissions already enforce.
- When nothing must hold beyond the Goal, write `No constraints beyond the Goal.` Then end with
  `Choose the approach within these boundaries.`

#### Write Taste and Preference from known sources

- Write each leaning as `Prefer <choice> over <alternative>; match <exemplar>.` and name its source: the user's
  words, a project record such as a style guide or accepted decision, or an exemplar. Mark a leaning you
  inferred with `(inferred from <source>)`.
- A named exemplar beats an adjective. Write only leanings that change which acceptable result the agent
  picks.
- When none is known, write this one line instead of leaving the section out: `No known taste or preference.
  Match the nearest existing work; where there is none, choose what best serves the Goal and list your choices
  in the handoff.`

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
- List each check that was run and its result, and each check that was not run and why.
- List the choices and assumptions made, including any departure from Taste and Preference, then the concerns
  and any extras noticed but not done.

#### Say what is needed to resume

- When blocked, give the cause and its evidence, what was finished, the state left behind, and what is needed
  to resume.
