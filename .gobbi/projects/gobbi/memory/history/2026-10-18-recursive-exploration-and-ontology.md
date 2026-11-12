# Recursive exploration and the six-kind ontology

**Completed at:** 2026-10-18T05:01:11Z

## Changes

- Added Recursive Exploration. It asks what the subject is, studies the materials, and writes the ontology
  only in Decomposition and Ontology definition. Review revises that file or asks the next question. There is
  no test-before-decompose phase and no handoff phase.
- Revised Ontology to six kinds: ObjectDefinition, FunctionDefinition, and LinkDefinition, plus
  ObjectInstance, FunctionInstance, and LinkInstance. Shared fields are name, Markdown context, Markdown
  definition, and metadata id, kind, and version. ObjectDefinition has properties. FunctionDefinition has
  inputInterface, action, and outputInterface. LinkDefinition has from, relation, and to. An Instance has
  definedBy. A LinkInstance also has from and to. A file is one `entities` list. The Ontology skill design
  now states that model.
- Removed the templates, the examples, and `ontology.py`. The skill ships no template, no example, and no
  checker. Removed the ontology backlog. Every heading existed only for that checker, those templates, or the
  old wording.
- Added the authoring mistake that the exploration stop "no further question would add an entity" does not
  bound grain. The caller names a last question when the goal is a definition rather than a full catalog.
- No session ontology area was promoted. Review of `9515b9f2` passed for docs and code, Grok and Codex, with
  no in-contract problem. The branch was not pushed.

Work account: [Recursive exploration and the six-kind ontology](../reports/note/2026-10-18-recursive-exploration.md).
