---
name: delegation
description: "Delegation is guidance for writing concise subagent prompts that define Role, Task, Materials, and handoff expectations, and for delivering skills and docs indexes the subagent reads only when an item is absolutely necessary."
allowed-tools: Read, Grep, Glob, Bash
skill-type: preference
---

# Delegation

Delegation standardizes the Role, Task, and Materials a manager writes into a subagent prompt and the handoff
the subagent returns. Use it when assigning bounded work across runtimes or roles so the subagent can act
without private context and the manager can verify the result.

## Principles

### Grant a Role so the agent thinks how it will act

Role names the persona and expertise for this assignment. The agent works from that specialist's stance, not from a
generic helper voice.

### Command the goal and the quality bar

Task states the goal, a world-best quality bar with a concrete measure, and the minimum result. Method, extra
limits, authority, stops, and prohibited work stay in Instructions.

### Keep the prompt concise

Use brief factual sentences and lists. Remove stories, commentary, and long descriptive paragraphs.

### Make the handoff complete and verifiable

The final handoff connects the subagent's completed work to the manager's acceptance decision. It states what
happened, identifies every result, cites verification, and names concerns or the next action without private
context.

## Rules

- **MUST follow the active contracts in their stated authority order.** Apply the caller-approved task and scope,
  then the owning mode or operation and the role-specific additions; use this base where those owners are silent.
- **MUST give the subagent one bounded assignment with one authoritative result.** Put the goal, world-best
  quality bar, and minimum result in `## Task`; put purpose, authority, constraints, method, verification, stops,
  and prohibited work in `## Instructions`.
- **MUST include `## Role` above `## Context` in every delegation prompt.** Role grants persona and expertise so
  the agent thinks how it will act; Metadata `agent` stays the role name and is not a substitute for Role.
- **MUST include a skills index and a docs index in `## Materials` and keep loads exceptional.** Each table
  lists name, absolute path, and description; the Materials body must tell the subagent not to read other
  skills or documents unless that read is absolutely necessary.
- **MUST include a `## Return` section and make the final handoff verifiable.** The delegating agent defines the
  return contract; the subagent writes the final Handoff with status, summary, exact durable locator or response
  subject, conclusion and consumer, changed paths or findings, verification, concerns, open work, and next action.
- **NEVER accept a runtime task status or activity summary as the final handoff.** The manager rereads named
  results and reproduces required verification before acceptance.

## Preferences

### Prompt Construction

#### Start from one base prompt

- Start from this template and replace every placeholder with task facts:

  ```markdown
  ## Metadata
  **Required**

  - agent: developer|designer|author
  - assignment: <stable assignment identifier>

  **Optional**

  - step: <owning operation step>
  - stage: <work stage>
  - phase: <ideate, plan, implement, or evaluate>
  - iteration: <current iteration>

  ## Role
  <Grant persona and expertise so the agent thinks how it will act.>

  ## Context
  <State working state and accepted decisions.>

  ## Task
  Goal: <one user-visible or assignment-visible outcome>

  Quality: Meet a world-best <specialist> bar, not a generic <weaker-label> pass. <Concrete bar: states, completeness, user outcome, or specialist-equivalent observables. Quality states how well the minimum result must be done. It never authorizes extra result.>

  Minimum result: <one accepted artifact that meets that bar. This is the acceptance floor and the scope ceiling. Extra work is an Instructions exclusion or a Handoff follow-up.>

  ## Instructions
  <State purpose, rules, authority, constraints, independence, method, verification, stops, and prohibited work.>

  ## Materials
  Do not read other skills or documents unless that read is absolutely necessary for this assignment.

  Skills index:

  | Skill | Path | Description |
  |---|---|---|
  | <name> | <absolute-path> | <frontmatter description> |

  Docs index:

  | Doc | Path | Description |
  |---|---|---|
  | <name> | <absolute-path> | <one-line description> |

  <Add remaining sources, purpose, and conflict precedence. Omit a Load-now list unless an item is already known to be absolutely necessary.>

  ## Return
  <Require the subagent to write a final Handoff for every terminal status. Name the owning status format,
  summary, exact durable locator or response subject, conclusion and consumer, changed paths or findings,
  verification commands and results, concerns, remaining work, blocker or missing context, safe retained state,
  and next action when each applies.>
  ```

- Add `###` subsections only when one template section contains distinct task-specific subjects. Keep `agent`
  and `assignment`; omit an optional Metadata field unless the assignment uses it or an owning contract requires
  it.
- Context still holds working state and accepted decisions only. Treat context absent from the prompt or its
  named materials as unknown.

#### Write Role as persona and expertise

- Put `## Role` above `## Context`. Use the locked sentences, not a weaker substitute:

  ```markdown
  ## Role
  You are a world-best UI/UX designer. Think and work the way a world-best UI/UX designer would: start from the user, the current surface, and proven patterns, then raise the result to that bar.
  ```

- For any other specialist, keep that two-sentence frame and change only the persona and stance.

#### Write Task as goal, world-best bar, and minimum result

- Use the locked sentences, not a weaker substitute:

  ```markdown
  ## Task
  Goal: Let a first-time user change notification preferences on the settings screen without help.

  Quality: Meet a world-best UI/UX bar, not a generic application-UI pass. Cover the main path, empty state, error, and recovery.

  Minimum result: One accepted settings-screen design that meets that bar. Do not add extra screens or features.
  ```

- The quality bar states how well the minimum result must be done and never authorizes extra result. Minimum
  result is the acceptance floor and the scope ceiling; extra work is an Instructions exclusion or a Handoff
  follow-up.
- For every specialist and phase, keep Goal, Quality, and Minimum result. Do not move method into Task.

#### Write Materials as skills and docs indexes

- Put two index tables in `## Materials`: skills with columns Skill, Path, and Description, and docs with
  columns Doc, Path, and Description. Use each skill's name, absolute path, and frontmatter description, and
  each document's name, absolute path, and one-line description.
- Start `## Materials` with the locked sentence: `Do not read other skills or documents unless that read is absolutely necessary for this assignment.` Do not instruct the subagent to load either table, and do not rely on conversation history or inherited loads.
- List every skill and document the assignment might need; the subagent reads a row only when the assignment
  cannot proceed without that item. Omit a Load-now list unless an item is already known to be absolutely
  necessary.

#### Specialist substitution table

- Use this table to write `## Role` for the specialist. Do not paste the table into the brief as extra
  sections. Metadata `agent` is `developer`, `designer`, or `author`.

  | Specialist | Role persona | Role stance | Quality contrast |
  |---|---|---|---|
  | Developer | world-best developer of `{subject}` | current software, named callers, and the briefed phase | world-best software bar, not a generic code pass |
  | Designer | world-best designer of `{subject}` | the viewer, the current visual work, and proven patterns | world-best visual-design bar, not a generic layout pass |
  | Author | world-best author of `{subject}` | the reader, the current document, and the briefed phase | world-best writing bar, not a generic documentation pass |

- Role sentence frame for every row: `You are a world-best {persona}. Think and work the way a world-best {persona} would: start from {stance}, then raise the result to that bar.`
- Pick the specialist from the primary subject. Software, including software architecture, is Developer. Visual work — UI, images, video, presentations, reports, and other visual artifacts — is Designer. Durable writing is Author.

#### Phase substitution table

- Use this table to write `## Task` and to choose skills for the indexes. Do not paste the table into the brief.
  Phase is not a role.

  | Phase | Skills to index | Minimum result pattern |
  |---|---|---|
  | Ideate | Coding Ideation, Authoring Ideation, or Design Ideation by subject | One accepted design the next phase can follow. Do not implement. |
  | Plan | Coding Planning, Authoring Planning, or Design Planning by subject | One accepted plan the matching execution skill can follow. Do not implement. |
  | Implement | Coding Execution, Authoring Execution, or Design Execution by writer frontier | One accepted change that meets the bar. Do not add extra files or features. |
  | Evaluate | Coding Review, Authoring Review, or Design Review by subject, plus that skill's report and checklist | One complete `report.md` with a criteria-derived gate verdict or `Not issued` and the working `checklist.md` beside it. Do not implement fixes. |

- Put the phase quality bar and minimum result in `## Task`. Put method in `## Instructions`.
- For Evaluate, assign a fresh agent of the matching specialist. Do not reuse the producer of the target.

### Handoff Content

#### Require the subagent to return one compact final handoff

- Require the subagent to begin with the exact status owned by its role or operation, then state the result and
  concise summary before supporting detail.
- Require the subagent to identify each file by exact path, each commit by exact revision, and each response
  result by its subject, conclusion, and consumer. When the assignment has a durable result, its Handoff
  references that result instead of reproducing or replacing it; otherwise the response is the result.
- Require the subagent to report fresh verification, concerns, remaining work, and the next owner or action. For
  missing context or a blocker, it names the cause, evidence, safe retained state, and resumption condition.
