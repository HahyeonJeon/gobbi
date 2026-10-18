# Ontology skill

## Intent

The [Ontology](../../../skills/ontology/SKILL.md) preference skill gives agents one way to record a domain
before they design, build, or review it. The record is only ObjectDefinition, FunctionDefinition, and
LinkDefinition, plus ObjectInstance, FunctionInstance, and LinkInstance. This design records that model. It
does not copy the skill's rules.

## Model

- The six kinds are the whole model. An Object is a thing, a Function is a behavior, and a Link is a
  relationship. Each has a Definition of what its members share and an Instance for one member.
- Shared fields are `name`, Markdown `context`, Markdown `definition`, and `metadata` with `id`, `kind`, and
  `version`.
- An ObjectDefinition has `properties`. A FunctionDefinition has `inputInterface`, `action`, and
  `outputInterface`. A LinkDefinition has `from`, `relation`, and `to`.
- An Instance has `definedBy`. A LinkInstance also has `from` and `to`.
- A file is one `entities` list.

## Templates, examples, and checker

- The skill ships no template, no example, and no checker.
- There is no `ontology.py`.

## Related designs

- [Coding skill family](coding-skill-family.md)
- [Authoring skill family](authoring-skill-family.md)
- [Design skill family](design-skill-family.md)
- [Wrap-up memory](../process/wrap-up.md)
