# Cleansing skill

## Intent

[Cleansing](../../../skills/cleansing/SKILL.md) is the user's entry (`/gobbi:cleansing`) for reorganizing,
renaming, and removing Ontology units of a subject so it stays simple and clearly defined, behavior kept. Only the
user starts it (`disable-model-invocation`, plus the generated Codex user-only policy). It is a domain skill that
loads the one child for the subject's main result, and that child runs the whole subject.

## Children

| Child | Subject | Depths | First action |
|---|---|---|---|
| [`cleansing-code`](../../../skills/cleansing/cleansing-code/SKILL.md) | Code | Module, Class, Function | Refactoring |
| [`cleansing-design`](../../../skills/cleansing/cleansing-design/SKILL.md) | Visual work, including HTML and web UI | System, Component, Element | Restructuring |
| [`cleansing-docs`](../../../skills/cleansing/cleansing-docs/SKILL.md) | Docs, prose reports, in-repo API reference pages, skills, the changelog | Set, Document, Passage | Restructuring |

The children live under the entry because Claude Code registers only top-level plugin skills as commands.

## Shape

- Each child asks the depth and intensity (aggressive, moderate, conservative) of its structural action,
  renaming, and removing, and who may checkpoint each step. A checkpoint is a commit or, for design files outside
  git, a saved version or a file copy.
- The manager talks to the user, a `leader` writes the map and plan as the run's Ideation result from the child's
  `templates/map.md`, and the role of each Ontology unit (developer, designer, author) applies the approved plan.
- Behavior is kept, and every removal carries its evidence. The Ontology unit records open with
  [Ontology](ontology-skill.md)'s six fields plus the domain's own: role, exposure, render states, and flags for
  visual work; reader, job, and Diataxis kind for docs.
- Design treats only same-role, same-value Ontology units as exact duplicates and views the work rendered. Docs
  pins what readers get before a change and has a fresh agent do each document's job before and after.
- The designs come from a study and a Socratic analysis of each domain (see
  [Socratic Method](socratic-method-skill.md)).

## Related designs

- [Ontology skill](ontology-skill.md)
- [Coding skill family](coding-skill-family.md), [Authoring skill family](authoring-skill-family.md), and
  [Design skill family](design-skill-family.md)
