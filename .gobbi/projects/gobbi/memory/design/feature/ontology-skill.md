# Ontology skill

## Intent

The [Ontology](../../../skills/ontology/SKILL.md) preference skill says what a unit definition holds and how to
test it, so Principle 8, Build from clear definitions, has one source in every domain: code, visual work, and
docs. It replaced the data-model Ontology of Object, Function, and Link records, and it is not a data-model
schema. This design records the model. It does not copy the skill's rules.

## Model

- A unit definition has six fields, each with one test: Definition, Responsibility, Boundary, Relations,
  Dependencies, and Properties.
- A domain adds its own fields in its own skill, such as code's secret and caller contract in Coding Principles
  Modularization. Actions, with their steps, triggers, and results, belong to the Socratic Method skill.
- Commonality and variability: merge units that hold the same knowledge and change for the same reason, and add
  a variation only for a difference that exists now.
- Standardization and normalization: one term per concept, one shape per kind, and one home per fact.
- A review tests these properties and does not demand a written definition for every unit. A unit used only
  inside its parent, such as a private helper, needs only a clear name.

## Consumers

- Coding, Authoring, and Design Ideation give each unit the design creates or changes its unit definition.
  The review Structure checks link the skill as their bar, and the Cleansing maps open with the six fields.
- There is no Memory `ontology/` home, and the skill ships no template, example, or checker.

## Related designs

- [Coding skill family](coding-skill-family.md)
- [Authoring skill family](authoring-skill-family.md)
- [Design skill family](design-skill-family.md)
- [Wrap-up memory](../process/wrap-up.md)
