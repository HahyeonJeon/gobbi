# Ontology skill

## Intent

The [Ontology](../../../skills/ontology/SKILL.md) preference skill gives agents one way to model a domain before
they design, build, or review it. It follows Palantir Foundry's Ontology: an ontology models decisions, with the
data they use, the logic that evaluates them, the actions that carry them out, and the security that governs
them. Coding, Authoring, and Design apply it in Ideation, Execution, and Review.

The skill owns the kinds, facets, rules, record format, templates, examples, and CLI. This design records the
user decisions that shape it. It does not copy the skill's rules.

## Scope

- The skill describes ontology itself. It has no Coding, Authoring, or Design section.
- Each domain keeps its own form. Coding keeps it in [Coding Principles](../../../skills/coding/principles.md)
  Modularization. Authoring and Design Ideation have no `ontology.md`; they use this skill as the facet
  source. Authoring and Design Execution and Review each still have an `ontology.md` child.
- The record and the skill use Palantir kind and field names. A domain doc may give a field its own name. For
  example, coding calls the Function and Action type fields its "caller contract".
- The skill, its children, and the coding example use one Flight example throughout.
- Examples and descriptions are project-agnostic, so other projects can use the skill.

## Kinds and facets

- Nine kinds, with Palantir names, in four groups. Data: Object type, Property, Link type, and Interface. Logic:
  Function. Action: Action type, Automation, and Process. Security: Security policy. There is no Scenario,
  Decision, Strategy, Model, or Agent kind.
- Every unit states five facets: Definition, Responsibility, Boundary, Relationship, and Properties.
  Responsibility and Boundary are separate facets. Actions is a kind, not a facet.
- Every coding unit states all five facets, including directories and files.
- A module, document, or visual component is an artifact, not a kind. Its facets go in the design record, not
  in Memory.
- The record stays at glossary level: a glossary, a CRC card, or an object map. It holds no formal-logic axioms.
- Functions return results, and only Action types commit changes. An agent or automation never holds a grant
  that its person or owner lacks.
- Security is default deny. A `READ` grant on an Object type covers each Link type whose first side starts
  from it. An Automation keeps `runsAs`, and that role needs a `RUN` grant on what the Automation runs.
- Reviewers test the model with two or three real questions from the task. The questions are not stored.

## Record

- The model is YAML, so it stays parsable. Memory keeps one file per bounded area.
- An area file has an `ontology` header, then the eight Palantir groups from `objectTypes` to
  `securityPolicies`.
- Every unit has the same fixed keys, in order: `status`, `deprecation`, and the facet keys `definition`,
  `responsibility`, `boundary`, and `relationship`. A key with no value is `null`. The user allowed more common
  keys when needed.
- One kind block, named after the kind, follows the fixed keys. It holds the Properties facet and the kind's
  Palantir fields in lowerCamelCase. Keys that served only one check were dropped.
- Case follows Palantir. Closed values are UPPER_SNAKE, such as `"ACTIVE"`. Action type ids are kebab-case,
  such as `delay-flight`. Other ids are lowerCamelCase. Code maps an id to its language's case.
- `primaryKey` is one Property id, as in Palantir. When no captured value identifies a member alone, add a
  captured id Property, such as Flight `flightId`.
- An edge that a Palantir field holds stays in that field, and the field is mandatory. Every other edge goes
  once in `relationship`, by reference, with a relation type.
- `relationship` stores only `parent` and `link`. A unit has at most one `parent`. `child` is the reverse of
  `parent`; the CLI derives it, and no file stores it.
- An edge inside a grant, an Automation condition or effect, or a Process transition stays in that entry.
- Each Property that an Action type's `submissionCriteria` read is a `link` in that Action type's
  `relationship`. The inputs of a derived Property are not recorded as edges.

## Templates and examples

- There is no `record.md`. Common rules live in the skill's `SKILL.md` Record section.
- Each kind has one template. Its header states the kind's rules and review checklist above the YAML.
- `SKILL.md` indexes the templates with one description each, so an agent reads only the templates it needs.
- Each kind has one example file. Together with `examples/area.yaml`, they form the Flight area.

## CLI

- `scripts/ontology.py` in the skill is a Python 3 standard-library CLI with `new`, `add`, `validate`, `list`,
  and `show`.
- `validate` stays lean. It checks key shapes read from the templates, quoting and `null`, ids, references, and
  at most one `parent`. Rules across units stay in each template's review checklist.
- The size target is about 400 to 500 code lines.
- `show` prints each edge out of a unit and into it. It labels an edge `parent`, `child`, `link`, or the name of
  the field that holds it.
- The repository script `scripts/prove-ontology-cli.py` proves the CLI against the Flight sample.

## Storage

- Memory `ontology/` holds the project's domain model only. It is the seventh Memory category by user
  decision, because the model must stay parsable.
- Ideation and Execution write the session copy at `{session-root}/ontology/<area>.yaml`. Review only reads it.
- Wrap-up and Cowork wrap-up promote each session area file into Memory at closure. The
  [Memory](../../../skills/memory/SKILL.md) skill owns the promotion rules.

## Related designs

- [Coding skill family](coding-skill-family.md)
- [Authoring skill family](authoring-skill-family.md)
- [Design skill family](design-skill-family.md)
- [Wrap-up memory](../process/wrap-up.md)
- [Ontology skill backlog](../../backlogs/ontology-skill.md)
