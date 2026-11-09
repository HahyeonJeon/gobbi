---
name: socratic-method
description: "Socratic Method decomposes a subject, physical or conceptual, through rounds of study and questioning into one document an agent can fully understand. Use it when the user asks to examine a subject with the Socratic method."
allowed-tools: Read, Grep, Glob, Bash, Write, Agent, AskUserQuestion
disable-model-invocation: true
skill-type: operation
---

# Socratic Method

Socratic Method takes one subject, such as a camera or coding, and builds a complete understanding of it through
two agents. An Analyst studies the subject and decomposes it into defined elements; a Questioner challenges that
understanding until no real gap is left. Only the user starts it.

## Principles

### Understanding grows from question and answer

An explanation is complete only when it survives honest questions. Each challenge exposes a gap, and each answer
fills it with study, a finer decomposition, or a sharper definition.

### A whole is its parts and how they connect

Listing parts does not explain a camera or a practice. The document holds the parts, the actions they perform,
and the relations between them, so a reader can follow how the whole works.

### Stop when questions stop finding gaps

Confidence is not evidence of understanding. The work ends when fresh questions no longer find a gap in what the
document must answer, and what cannot be settled is written down as an open question.

## Rules

- **Ground every claim in a source.** Cite the document, standard, code, or measurement behind each definition,
  property, and action, because study without outside evidence settles on plausible errors.
- **Challenge and concede only with evidence.** A challenge names one element and the reason it falls short; a
  concession names what changed the answer, because agents that agree to agree drift from the truth.
- **Count a challenge as material only when it matters to the document's questions.** It must leave one of those
  questions unanswerable or show a field wrong, missing, or unsupported; anything else would let the work grow
  without end.
- **Keep components and actions apart.** A component is something that exists, and an action is something that
  happens; mixing them hides how the subject works.
- **Define, do not illustrate.** A definition names the kind of thing and what sets it apart from its siblings, so
  it covers every instance, excludes the rest, and is never only an example.
- **Record what stays unresolved.** An open question goes in the document with what is known, instead of another
  round of the same argument.

## Procedure

### Phase 1 — Set the Subject

Agree what is examined and where the result goes. Done when the document exists at the output path with its
subject and its questions.

#### 1.1 Ask the subject and output

- With the runtime's structured question tool, ask the subject when the request does not name it, and the path
  where the document goes. When a file already exists there, ask whether to continue it or use another path.
- Copy the [document template](templates/document.md) to that path and write the subject there.

#### 1.2 Write the document's questions

- Write in Purpose the questions a reader must be able to answer from the document: what the subject is, what it
  is made of, how the parts connect, how it works, and what the subject's field asks of it, such as what makes
  good code. These questions decide what is material and how far to decompose.

### Phase 2 — Study and Decompose

The Analyst builds the first complete draft. Done when every element in the draft has every field filled or
marked open, each with its source.

#### 2.1 Brief the Analyst

- Assign one `leader` as the Analyst through [Delegation](../delegation/SKILL.md). Goal: the document at the
  output path answers its questions completely, following its template.
- Name the sources the user gave or the project holds. The Analyst may study any public source as well.

#### 2.2 Decompose the subject

- The Analyst studies the subject broadly and deeply, then decomposes it recursively into components and actions,
  splitting an element further only while one of the document's questions needs it.
- For each element, the Analyst fills its card from the template, each field with its source, adds each relation
  to the relation table, and returns the IDs of the elements it wrote or changed.

### Phase 3 — Question and Answer

The two agents refine the document in rounds. Done when a round on the changed elements and a final pass over the
whole document both raise no material challenge.

#### 3.1 Question the understanding

- Assign a fresh `leader` as the Questioner. Give it the document's questions, the elements the Analyst changed,
  and the elements related to them, and ask for at most ten challenges from the
  [question kinds](#question-kinds), most useful first, each naming one element or relation.
- The Questioner returns its challenges in its reply and writes nothing; the cap keeps each round small. No
  material challenge is a valid result.

#### 3.2 Answer each challenge

- Brief the Analyst again with the document path and the challenges. It answers each one by studying further,
  splitting an element, sharpening a definition, adding a relation or action, or rejecting it with evidence.
- The Analyst records every challenge and its outcome in the Challenge Log and returns the changed element IDs.
  After four rounds on the same element, it moves what is still unresolved to the open questions.

#### 3.3 Decide whether to stop

- When a round raises no material challenge, give a fresh Questioner the whole document once. Stop if that pass
  also raises none; otherwise its challenges start the next round.
- Each round passes only the changed elements, their related elements, and the new challenges, never the whole
  history.

### Phase 4 — Check and Deliver

Make sure the document holds together, then hand it over. Done when the user has the document.

#### 4.1 Check the document

- Check that every element has a definition, every relation joins two defined elements, every element has one
  parent unless it is marked shared, each element's children cover it with no overlap, every question in Purpose
  is answered or open, and any count the document states matches its lists.
- Send a failed check back to the Analyst as a challenge.

#### 4.2 Deliver

- Report the path, the number of components, actions, and relations, and the open questions, then suggest an
  independent [Review](../review/SKILL.md) when the document will guide other work.

## Question Kinds

| Kind | The Questioner asks |
|---|---|
| Definition | Is this a definition or an example? Does it cover every instance, exclude the rest, and say why? |
| Responsibility | What is this element for? In a real situation, which needed job does no element hold? |
| Boundary | Do the children cover the whole parent with no gap and no overlap? Is this really part of this parent? |
| Relation | Which elements interact without a stated relation? What is each relation's kind and direction? |
| Dependency | If this element fails, changes, or disappears, what else breaks? |
| Properties | What are its attributes, values, and units? Is this a separate element or only a property value? |
| Actions | How does it work, step by step, and which element acts at each step? Does the structure produce the claimed behavior? |
| Depth | Which fields are empty or thin? Does a question need this element split, because it hides more than one responsibility? |
| Evidence | What source supports this, and what is assumed without one? |
| Viewpoint | Would a user, a maintainer, or a designer divide this differently, and does the document say why it chose its view? |

## References

| Name | Description |
|---|---|
| [Document template](templates/document.md) | The one document the Analyst fills and the Questioner challenges. |
| [Delegation](../delegation/SKILL.md) | Briefs for the Analyst and the Questioner. |
| [Review](../review/SKILL.md) | The independent review suggested for a document that will guide other work. |
