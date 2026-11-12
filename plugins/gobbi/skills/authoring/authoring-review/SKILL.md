---
name: authoring-review
description: "Authoring Review is the bar a reviewer applies to durable writing. Use it when reviewing docs, skills, a changelog, or other durable prose."
allowed-tools: Read
skill-type: preference
---

# Authoring Review

Authoring Review is the domain bar for writing inside [Review](../../review/SKILL.md), which owns the procedure,
the blocking rule, the report, and the verdict. Use it when reviewing docs, skills, a changelog, or other durable
prose.

## Principles

### Read as the reader, not the author

The author fills gaps from the session without noticing. Judge only what the page gives someone who was not
there.

## Rules

- **Let the project's own bar win.** The project's writing standard, accepted design, and the standard for the
  document's type, such as [Gobbi Skill](../../gobbi-skill/SKILL.md) for a skill, come before these checks.
- **Apply only the checks the stage reaches.** A writing design at Ideation or Planning is judged on reader,
  purpose, and structure, not on the wording it does not contain yet.

## Preferences

### Reader

#### A cold reader can act on it

- Name the reader the Goal names, then read the result as that reader, without the session, transcript, or
  author. Try the task the document exists for: follow its steps or answer its question.
- Record the first place that reader would stop, guess, or need to ask.

#### Each instruction can be followed and checked

- Each instruction names an action and a result someone can observe. A vague word such as `clean`,
  `appropriate`, or `as needed` with no criterion fails this check.

### Text

#### Every line earns its place

- Removing a line loses something the reader needs. Restatement, history, hedging, generic advice or tone,
  stock transitions, formulaic structure, and text another document owns fail this check.
- A record kept as history, such as a released changelog entry or a superseded decision, is judged only on
  accuracy.

#### Claims are true now

- Commands, paths, flags, names, versions, and counts match the project as it is now. Run the command or open
  the file instead of trusting the text.

### Structure, Variation, and Vocabulary

#### Each document and section has one purpose, owner, boundary, and set of links

- For each document, skill, and section the change adds or changes, state what it is for in one sentence, the
  facts or policy it owns, what it leaves to other documents, and what it links to and what links to it.
- Each fact has one owner, and a reader meets a prerequisite before what depends on it. A section that does two
  jobs (such as steps mixed with background), a copy of another document's policy, or a circular chain of "see
  X" fails this check. The fields of a [Ontology unit definition](../../ontology/SKILL.md) are the bar.

#### Shared text lives in one place and variants differ only where they must

- Name what sibling documents share, such as a skill family or mirrored templates, and what really differs
  between them. Shared rules are written once and linked; parallel documents differ only in that real difference.
- Share text only when it is identical now and must stay so; text a consumer must vary stays separate.
- Pasted paragraphs that will drift apart, or siblings that diverge by accident, fail this check.

#### Terms are defined once and used consistently

- One concept keeps one name through the document, its siblings, and the project's vocabulary, and one name never
  means two things. A technical term is defined once, where its owner first uses it.
- A plain common word beats a coined one, and a synonym used for variety fails this check.

### Fit and References

#### It fits the project's design and standards

- The document agrees with the project's design memory, governing decisions, and accepted session design, and
  takes the shape its type's standard sets.

#### Links and references resolve

- Every link, anchor, path, and named file or heading resolves.
- When the change renames or removes a heading, path, or name, search for referrers, including generated
  copies, loaders by name, path, or anchor, and published links, and confirm none still points at the old one.
  A published address keeps a stub or redirect.

## References

| Name | Description |
|---|---|
| [Review](../../review/SKILL.md) | Owns the review procedure, stage bars, blocking rule, report, and verdict. |
| [Gobbi Skill](../../gobbi-skill/SKILL.md) | The standard a skill under review must follow. |
| [Ontology](../../ontology/SKILL.md) | The six fields of an Ontology unit definition that the Structure checks test. |
