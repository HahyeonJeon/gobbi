---
name: operation-skill
description: "Operation Skill guides writing repeatable work as goal-led phases with evidence of done. Use it after Gobbi Skill classifies a target as `operation`."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Operation Skill

Operation Skill defines how to author or substantively revise a skill for repeatable end-to-end work. Use it
after Gobbi Skill classifies the target as `operation`.

## Principles

### Make stages and their evidence the core

An operation skill tells the reader which stages the work passes through, what each stage must produce, and how
to tell it is done. The agent chooses how to do each stage, because a capable agent finds better methods than
an author can script in advance.

### Order only what must be ordered

A Step exists for an action whose order, authority, or interface matters: a gate, an approval, an irreversible
or external action, a state change, or a handoff another agent reads. Everything else stays inside the Phase
goal.

### Write instructions, not narrative

Tell the reader what must be true, under which condition, and what confirms it. Keep one short reason beside
each constraint so the agent can judge cases the author did not foresee, and cut background stories and
transitions.

## Rules

- **Use the operation shape.** Frontmatter → Intro → Principles → Rules → Procedure → optional reference tables
  that Steps point to → References, with numbered Phases and decimal Steps, so every operation reads the same way.
- **Give each Phase a goal and the evidence that it is done.** A reviewer judges the work against that
  evidence, so a Phase without it cannot be reviewed.
- **State authority boundaries, stop conditions, and handoffs where the reader meets them.** These are the
  points where a wrong guess cannot be undone or another agent depends on the result.
- **Keep each Step to at most three bullets of one or two sentences.** When a Step needs more, first remove
  method the agent can choose; split it only when what remains is still too long.

## Procedure

### Phase 1 — Design the Operation

Find the operation's boundary and stages. Done when the boundary is recorded and each stage has a distinct
goal and a done-check, with only order-bound actions marked as Steps.

#### 1.1 Define the boundary

- From the approved design, state the actor, the trigger, the starting state, and the evidence that the whole
  operation is done.
- Record the authority, inputs, outputs and side effects, non-goals, and handoffs.
- Return to the parent Phase 1 when the target has no repeatable stages or combines separate operations.

#### 1.2 Find the stages

- Group the work into the fewest stages that each have a distinct goal, owner, or state change, and give each
  a done-check a reviewer can apply.
- Mark the actions whose order, authority, or interface matters. Only those become Steps.

### Phase 2 — Write the Operation Skill

Write the operation shape. Done when the Procedure follows the pattern and Principles, Rules, Intro, and
References are complete, with no new policy in the Intro.

#### 2.1 Write the Procedure

- Write Procedure first with this pattern, repeating Phases and Steps only as the work requires:

```markdown
## Procedure

### Phase 1 — {Stage}

{The stage's goal.} Done when {the evidence a reviewer can check}.

#### 1.1 {Action or decision whose order matters}

- {What must be true or happen, with its condition.}
- {The stop, approval, or handoff the reader meets here.}
- {The evidence that confirms the result.}
```

- Present the normal path first. Add failure, retry, recovery, and stop paths only where they occur.
- Keep compact tool facts beside the Step that uses them, and route larger material to a tool skill.

#### 2.2 Complete the remaining sections

- Write Principles for the durable operating model and Rules for distinct binding boundaries, each with its
  source and reason.
- Write the Intro from the completed body without adding new policy, and use the parent's References table.

### Phase 3 — Review and Improve the Operation Skill

Leave only stages and their evidence. Done when every Phase has a goal and a done-check, every Step has a
reason its order matters, and every fact matches its owner.

#### 3.1 Remove method and check the stages

- Apply parent Phase 3. Delete Steps and bullets that only choose a method, and merge Phases that share one
  goal.
- Confirm every Phase has a goal and a done-check, and every Step has a reason its order matters.
- Verify the conditions, authority, recovery, handoffs, commands, paths, and permissions against their owners.

## References

| Name | Description |
|---|---|
| [`Gobbi Skill`](../SKILL.md) | Parent guidance for classifying the target and applying shared skill-writing rules. |
