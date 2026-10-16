---
name: recursive-exploration
description: "Recursive Exploration is the operation that understands one target by a definition question and writes that answer as an Ontology file."
allowed-tools: Read, Grep, Glob, Bash, Write
skill-type: operation
---

# Recursive Exploration

Recursive Exploration is the operation an agent follows to ask what one subject is and to write that answer
into one Ontology file. Use it when a caller names the target, the ontology-file path, and any question to
exclude or to ask last.

## Principles

### Ask what the subject is

The question asks for a definition. The first subject is the target, and a later subject is a part already
written in the ontology file.

### Study the materials before writing

Study states what the materials show the subject is. A claim the materials do not show is marked, and that
claim is not written.

### Decomposition writes the ontology

The ontology file is written in Decomposition and Ontology definition. Kinds, parts, behavior, and instances
go into that file there, and nowhere else.

### Review revises the file or asks the next question

When the question, the materials, and the file disagree, review returns to the earliest failed step and
revises the file. When they agree, review asks the next definition question or stops.

## Rules

- **MUST ask what the subject is before studying it or writing it.** The first subject is the target, and a later subject is a part already in the ontology file.
- **MUST state what the materials show, and mark a claim those materials do not show.** Keep a marked claim out of the ontology file.
- **MUST write the ontology only in Decomposition and Ontology definition, and only as the six Ontology kinds in the caller-named file.** A kind is an ObjectDefinition linked from the parent, a part named apart from the whole is an ObjectDefinition with a LinkDefinition, any other part is a property, a behavior is a FunctionDefinition, and an Instance is one particular member the materials show.
- **MUST return to the earliest failed step when the question, the materials, and the ontology disagree.** Revise the file in Decomposition and Ontology definition, and do not ask the next question until they agree.
- **NEVER implement, redesign, or score the target, and never stop because the target seems understood.** The only write is the ontology file, and the operation stops when no further definition question would add an Object, Function, or Link the materials support, or when the caller named the last question.
- **NEVER write the ontology in Question, Study, or Review.** Review may send the agent back to Decomposition and Ontology definition to change the file.

## Procedure

### Phase 1 — Accept the assignment

#### 1.1 Confirm the caller inputs

- Confirm that the caller named one target and one ontology-file path. Note an excluded question, and a question the caller named as the last.
- When the target or the path is missing, or the caller asks to implement, redesign, or score the target, stop and name that gap. Do not invent a path, and do not write a file.
- When the assignment stands, keep every later write to that ontology file. The agent owns the questions, the study, and the ontology; the caller owns the target, the path, and any exclusion.

### Phase 2 — Question

#### 2.1 Choose the subject

- On the first pass, the subject is the target. When the caller excluded that question, stop and do not write a file.
- On a later pass, choose the earliest part already written, in the order of the link from its parent to that part, when a further question would add an Object, Function, or Link the materials support. Skip a question the caller excluded.
- When no such subject remains, stop. Do not write the question list to a file.

#### 2.2 Ask what the subject is

- Ask what the subject is. That question asks for a definition, and on the first pass the subject is the target.
- When the subject is a part, ask what it is inside its parent as the same question. Do not study or write before the question is asked.

### Phase 3 — Study and research

#### 3.1 Read the materials

- Read the materials that can answer this question, including the target when the target is a text. Ignore a source that does not answer it.
- Do not implement, redesign, or score the target in this step. Do not write the ontology file in this step.

#### 3.2 State what the materials show

- State, in one or two sentences, what the materials show the subject is. When the subject is a part, include what it is inside its parent.
- Mark each claim the materials do not show, and keep that mark only for this operation. Do not write a marked claim, and do not put the mark in a second file.
- When the materials support no statement, return to Step 2.2. Do not invent a definition to fill the gap.

### Phase 4 — Decomposition and Ontology definition

#### 4.1 Open the ontology file

- Load the Ontology skill and use only its entity list and six kinds. Do not invent a second record format.
- On the first pass that records an entity, create the caller-named file as one `entities` list. Add a new entity, or revise the entity whose `metadata.id` is already there.
- When the materials support no Object, Function, or Link, add nothing. Leave the file uncreated when no earlier pass created it.

#### 4.2 Write the subject

- Write the subject as one ObjectDefinition. Use one lowerCamelCase `id`, and write `definition` as what it represents, what it is responsible for, and what is outside its scope.
- Use the wording from Step 3.2. When the id is already in the file, revise that entity, and do not add a second id for the same subject.
- Leave out a marked claim.

#### 4.3 Write kinds and parts

- Write a kind the materials show as an ObjectDefinition, and add a LinkDefinition from the subject to that kind.
- Write a part as its own ObjectDefinition, with a LinkDefinition from the subject to that part, only when the materials name it apart from the whole.
- Write any other part the materials show as a property of the subject. A property is not a new entity.

#### 4.4 Write behavior and instances

- Write a behavior the materials show as one FunctionDefinition with `inputInterface`, `action`, and `outputInterface`. Write any other relationship the materials show as a LinkDefinition with `from`, `relation`, and `to`.
- Write an Instance only for one particular member the materials show, with `definedBy` set to its Definition. On a LinkInstance, set `from` and `to` to the two entities that one relationship connects.
- Write every required field, and copy no Definition field onto an Instance. Do not add a kind outside the six kinds.

### Phase 5 — Review and revise or reorganize

#### 5.1 Compare the question, the materials, and the ontology

- Check that the file answers the question with what Step 3.2 stated, and that marked claims are absent.
- Check that a kind is an ObjectDefinition linked from its parent, that a part named apart from the whole is an ObjectDefinition with a LinkDefinition, and that any other part is a property. Check that a behavior is a FunctionDefinition and that an Instance is one particular member the materials show.
- When the file exists, read it against the Ontology skill's field order and six kinds, and treat a missing field, a repeated id, or a link to a missing id as disagreement. When no file exists, the pass agrees only if the materials supported no record.

#### 5.2 Return to the failed step

- When they disagree, return to the earliest failed step and continue from there. Use Phase 2 for a wrong question, Phase 3 for a missed or invented claim, and Phase 4 to revise the file.
- Reorganize inside the same entity list, including a move between a property and an Object, and remove an entity the materials do not support.
- Change the failed step, then run Step 5.1 again. Do not ask the next question until the question, the materials, and the ontology agree.

#### 5.3 Ask the next question or stop

- When the caller named this question as the last, stop, even if a part remains unasked. Leave the ontology file at the caller-named path, and do not write a second file.
- Otherwise return to Step 2.1. Stop there when no further definition question would add an Object, Function, or Link the materials support.
- Do not stop because the target seems understood.

## References

| Name | Description |
|---|---|
| [`Ontology`](../ontology/SKILL.md) | The six kinds and the entity-list field order. |
