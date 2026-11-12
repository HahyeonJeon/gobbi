# Socratic Method skill

## Intent

[Socratic Method](../../../skills/socratic-method/SKILL.md) is a user-only operation skill that examines one
subject, physical or conceptual, and builds one document an agent can fully understand. Two `leader` agents do
the work: an Analyst who studies the subject, decomposes it recursively, and defines each component and action,
and a Questioner who challenges that understanding by question kind.

## Shape

- The manager writes the questions the document must answer, and those questions decide what counts as a
  material challenge and how far to decompose. The result is one document from `templates/document.md`.
- A component and an action are kept apart. Each element carries a definition, responsibility, boundary,
  relations, dependencies, properties, actions, and sources (see [Ontology](ontology-skill.md)).
- The same Analyst and Questioner take turns through the rounds, each starting only after the other has
  returned. The Questioner first judges whether each answer holds and follows up on it.
- The Challenge Log carries the exchange. The Questioner adds at most ten challenges per round as rows; the
  Analyst writes each answer, its evidence, and the outcome, then lists each fact it changed and searches the
  document for every copy. The manager passes only the round number and the changed elements.
- A challenge is material only when it changes an answer to one of the document's questions. Every challenge,
  acceptance, and rejection needs evidence. Unresolved points become open questions after four rounds on one
  element, counted across Questioners.
- A clean round is followed by one fresh Questioner's pass over the whole document; when that pass finds gaps,
  the user decides whether to continue or to record them as open questions.
- The `leader` role may question another agent's work; it only does not write the formal review or accept its
  own result.

## Related designs

- [Cleansing skill](cleansing-skill.md) (its domain designs came from this method)
- [Ontology skill](ontology-skill.md)
