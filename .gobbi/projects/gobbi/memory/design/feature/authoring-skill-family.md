# Authoring skill family

## Intent

The [Authoring root](../../../skills/authoring/SKILL.md) is a navigation-only domain skill for writing
design, planning, implementation, and the review bar. It routes every applicable direct child and owns
no lifecycle procedure, sequence, state, gate, recovery policy, or child judgment.

The family has three direct operation children (Ideation, Planning, Execution) and one preference child (Review).
Top-level Ideation, Planning, Study, Execution, and Evaluation skills are gone without an alias. Canonical skills
own live procedures.

## Family and ownership

| Skill | Type | Current owner | Authority boundary |
|---|---|---|---|
| [Authoring](../../../skills/authoring/SKILL.md) | Domain | Discovers every direct child whose applicability contract matches the current bounded unit. | Owns navigation only. |
| [Authoring Ideation](../../../skills/authoring/authoring-ideation/SKILL.md) | Operation | Owns study, discussion, the writing design (reader, structure, claims, vocabulary, voice), and one indexed ideation result. | Stops before Planning or realization. |
| [Authoring Planning](../../../skills/authoring/authoring-planning/SKILL.md) | Operation | Splits settled writing work into goal-based tasks, one `plan-NN-slug.md` per major goal with a Task Graph; each task has a Goal, Context, Constraints, and Taste and Preference, written as Delegation defines them. | Stops before implementation steps. |
| [Authoring Execution](../../../skills/authoring/authoring-execution/SKILL.md) | Operation | Owns implementation and verification for one settled writing task, and edits or links a fact in the document that owns it before adding new text. | Gains no Review or acceptance authority. |
| [Authoring Review](../../../skills/authoring/authoring-review/SKILL.md) | Preference | The domain bar of nine to twelve checks, including structure, commonality and variability, and vocabulary, that the shared [Review](../../../skills/review/SKILL.md) skill applies to docs, skills, a changelog, and other durable prose. | Owns no procedure, report, or verdict. |

Composition matches the [Coding skill family](coding-skill-family.md): callers select matching children
directly; the root never stores lifecycle state.

## Ideation templates

Authoring Ideation uses Coding Ideation's four flat templates: `discussion-index.md`, `discussion-NN.md`,
`ideation-index.md`, and `ideation-NN.md`. The templates are free form, and the whole result may sit in
`ideation-index.md`. Requirements stay in the ideation part, and each decision stays in its Design heading. There
is no Ideation `ontology.md`.

## Ontology

Authoring Ideation gives each document or section the design creates or changes its unit definition from the shared
[Ontology](../../../skills/ontology/SKILL.md) skill, and the Authoring Review Structure checks link that skill as
their bar. Execution and Review have no `ontology.md` child, and designs give no kinds, facets, or unit ids.

## Related designs

- [Coding skill family](coding-skill-family.md)
- [Design skill family](design-skill-family.md)
- [Identity-and-load role contracts](../process/identity-and-load-role-contracts.md)
- [Ontology skill](ontology-skill.md)
