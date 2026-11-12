# Design skill family

## Intent

The [Design root](../../../skills/design/SKILL.md) is a navigation-only domain skill for visual design,
planning, implementation, and the review bar. It routes every applicable direct child and owns no
lifecycle procedure, sequence, state, gate, recovery policy, or child judgment.

The family has three direct operation children (Ideation, Planning, Execution) and one preference child (Review).
Top-level Ideation, Planning, Study, Execution, and Evaluation skills are gone without an alias. Canonical skills
own live procedures.

## Family and ownership

| Skill | Type | Current owner | Authority boundary |
|---|---|---|---|
| [Design](../../../skills/design/SKILL.md) | Domain | Discovers every direct child whose applicability contract matches the current bounded unit. | Owns navigation only. |
| [Design Ideation](../../../skills/design/design-ideation/SKILL.md) | Operation | Owns study, discussion, structure and direction shown as images, and one indexed ideation result. | Listed PNGs illustrate. Written Design headings govern. Stops before realization. |
| [Design Planning](../../../skills/design/design-planning/SKILL.md) | Operation | Splits settled visual work into goal-based tasks, one `plan-NN-slug.md` per major goal with a Task Graph; each task has a Goal, Context, Constraints, and Taste and Preference, written as Delegation defines them. | Stops before implementation steps. |
| [Design Execution](../../../skills/design/design-execution/SKILL.md) | Operation | Owns production, verification, and handoff of one settled visual task: it records a baseline before the first edit and verifies the final tree against it (resolved tokens, token lint, routes and links, accessibility tree, screenshots in one capture environment). | Gains no Review or acceptance authority. |
| [Design Review](../../../skills/design/design-review/SKILL.md) | Preference | The domain bar of nine to twelve checks, including structure, commonality and variability, and vocabulary, that the shared [Review](../../../skills/review/SKILL.md) skill applies to UI, images, video, slides, reports, and other visual work. | Owns no procedure, report, or verdict. |

Composition matches the [Coding skill family](coding-skill-family.md): callers select matching children
directly; the root never stores lifecycle state.

## Design Ideation images

The user decides structure and direction from images, not prose alone. When layout and style are both open, layout
options are shown apart from style options so each choice is judged on its own. The written Design headings govern,
and the image quotas are gone. Listed illustration PNGs are subordinate evidence. Written Design headings stay
authoritative.

## Ideation templates

Design Ideation uses Coding Ideation's four flat templates: `discussion-index.md`, `discussion-NN.md`,
`ideation-index.md`, and `ideation-NN.md`. The Design headings stay, and the templates are free form. The ideation
template asks the accessibility target as a user decision (recommended `WCAG 2.2 AA`) and owns the token categories
and naming scheme. Requirements stay in the ideation part, and each decision stays in its Design heading. There is
no Ideation `ontology.md`.

## Ontology

Design Ideation gives each screen, region, or component the design creates or changes its unit definition
from the shared [Ontology](../../../skills/ontology/SKILL.md) skill, and the Design Review Structure checks
link that skill as their bar. Execution and Review have no `ontology.md` child, and designs give no kinds, facets, or unit ids.

## Related designs

- [Coding skill family](coding-skill-family.md)
- [Authoring skill family](authoring-skill-family.md)
- [Identity-and-load role contracts](../process/identity-and-load-role-contracts.md)
- [Ontology skill](ontology-skill.md)
