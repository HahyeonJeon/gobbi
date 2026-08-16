---
name: operation-skill
description: "Operation Skill is guidance for writing a straightforward standard operating procedure with structured phases and steps."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Operation Skill

Operation Skill defines how to author or substantively revise a skill whose core is a standard operating
procedure (SOP). Use it after Gobbi Skill classifies the target as `operation` and the reader needs direct,
ordered instructions arranged as simple phases and steps.

## Principles

### Make the SOP the core

An operation skill exists to tell a reader how to perform repeatable work. Put the SOP in Procedure, and keep
Principles, Rules, tool facts, and references subordinate to the instructions the reader follows.

### Use phases for stages and steps for actions

A Phase groups one necessary stage of the SOP, while a Step gives one direct action or decision in execution
order. Keep this hierarchy stable so the reader always knows where they are and what comes next.

### Keep the path straightforward

The SOP should give the reader the shortest correct path through the work. Present the normal path first, add
only necessary branches beside their conditions, and remove needless nesting, detours, and repeated context.

### Write instructions, not narrative

A Procedure should tell the reader what to do, under which condition, and what confirms the Step. Use direct
action bullets and short supporting sentences instead of background stories, long transitions, or essay-style
explanation.

## Rules

- **MUST produce the exact operation target shape.** Use Frontmatter → Intro → Principles → Rules → Procedure
  → References; inside Procedure, use numbered Phase headings, decimal Step headings, and bulleted step
  bodies; keep Procedure dominant and add no top-level Manual.
- **MUST make the target Procedure own the complete SOP.** State actor, trigger, preconditions, authority,
  inputs, ordered actions and decisions, conditions and branches, failures, recovery, completion evidence,
  non-goals, and handoff boundaries when they apply.
- **MUST keep every Phase and Step direct and necessary.** Give each Phase one stage and each Step one primary
  action or decision; present the normal path first, place branches beside their conditions, and remove
  narrative, needless nesting, and repeated context.
- **MUST keep each Step to at most three substeps.** Treat each bullet directly under a Step as one substep
  and split the Step when it needs more.
- **MUST keep every substep to one or two sentences.** Put the direct instruction first, and use a second
  sentence only for a condition, branch, or confirmation needed to perform it.

## Procedure

### Phase 1 — Design the SOP

#### 1.1 Define the SOP boundary

- Use the approved design to state the reader or actor, trigger, starting state, and evidence that shows the
  SOP is complete.
- Record the preconditions, authority, inputs and trust boundaries, outputs and side effects, non-goals, and
  handoff boundaries.
- Return to parent Phase 1 when the target does not need a repeatable ordered procedure or combines separate
  procedures that should be classified independently.

#### 1.2 Structure the direct path

- List the required actions and decisions in the shortest correct order, then group them into Phases and Steps.
- Create a new Phase only when a group of Steps has a distinct prerequisite, responsibility, or state
  transition; otherwise keep those Steps in one Phase.
- Give each Step one primary action or decision and arrange the Steps in execution order within their Phase.

### Phase 2 — Write the Operation Skill

#### 2.1 Start with the Procedure structure

- Use the parent skill to write the frontmatter and top-level sections, then write Procedure first. Use this
  minimal pattern for the SOP:

```markdown
## Procedure

### Phase 1 — {Stage}

#### 1.1 {Direct action or decision}

- {State one direct instruction.}
- {Take the required branch when its condition applies.}
- {Confirm the result, then continue or stop as required.}
```

- Repeat Phases and Steps only as the SOP requires. Use no more than three substeps under each Step.

#### 2.2 Write direct Phases and Steps

- Arrange Phases in execution order and name each for its stage. Arrange Steps within each Phase in the order
  the reader performs them.
- Start each Step with a direct action or decision, then give it no more than three substeps.
- Keep each substep to one or two sentences. Put its instruction first and add only a needed condition, branch,
  or confirmation.

#### 2.3 Add conditions and boundaries

- Present the normal path first. Add alternatives, failure, retry, rollback, recovery, and stop paths only
  where their conditions occur.
- State authority boundaries, irreversible or externally visible actions, side effects, completion evidence,
  and handoffs where the reader encounters them.
- Include access boundaries and output paths when the operation writes session or durable state.

#### 2.4 Remove narrative and extra detail

- Remove narrative setup, chronological retelling, conversational transitions, repeated rationale, and
  explanation that does not change an action or decision.
- Keep compact tool facts beside the consuming Step. Route larger setup, syntax, capability, or troubleshooting
  material to an owned internal document or tool skill.

#### 2.5 Complete the remaining sections

- Write Principles for the durable operating model and Rules for distinct binding invariants; keep ordered
  work in Procedure and apply the parent limits and normative expressions.
- Write the Intro from the completed body, orienting the reader to the actor, trigger, SOP, and boundary
  without adding new policy.
- Use the parent's fixed `Name | Description` table in References. Include only relevant internal parent,
  type, or supporting documents; cite external owners beside their claims.

### Phase 3 — Review and Improve the Operation Skill

#### 3.1 Improve structure, sentences, and vocabulary

- Apply parent Phase 3, then reshape the SOP instead of only marking problems. Remove, merge, split, or reorder
  Phases and Steps until Procedure is the core, each Phase owns one necessary stage, and each Step owns one
  primary action or decision in execution order.
- Split every Step with more than three substeps, and rewrite each substep as one or two direct sentences.
  Remove narrative, needless nesting, detours, repeated rationale, long transitions, and details that do not
  change an action or decision.
- Replace vague, inflated, uncommon, or inconsistent words with plain, precise, stable terms. Verify required
  conditions, authority, recovery, completion, handoffs, commands, paths, schemas, permissions, and
  version-sensitive claims, then apply the parent stopping condition.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../SKILL.md) | Parent guidance for classifying the target and applying shared skill-writing rules. |
| [Operation Skill checklist](checklist.md) | Reusable source for evaluating SOP boundaries, structure, execution paths, operational coverage, and supporting guidance. |
