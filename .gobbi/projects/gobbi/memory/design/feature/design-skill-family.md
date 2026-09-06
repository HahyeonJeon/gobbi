# Design skill family

## Intent

The [Design root](../../../skills/design/SKILL.md) is a navigation-only domain skill for visual design,
planning, implementation, and non-gating review. It routes every applicable direct child and owns no
lifecycle procedure, sequence, state, gate, recovery policy, or child judgment.

The family has exactly four direct operation children. Top-level Ideation, Planning, Study, Execution, and
Evaluation skills are gone without an alias. Canonical skills own live procedures. Design Execution remains
a placeholder.

## Family and ownership

| Skill | Type | Current owner | Authority boundary |
|---|---|---|---|
| [Design](../../../skills/design/SKILL.md) | Domain | Discovers every direct child whose applicability contract matches the current bounded unit. | Owns navigation only. |
| [Design Ideation](../../../skills/design/design-ideation/SKILL.md) | Operation | Owns study, discussion, two image passes, and one indexed ideation result. | Listed PNGs illustrate. Written Design headings govern. Stops before realization. |
| [Design Planning](../../../skills/design/design-planning/SKILL.md) | Operation | Owns decomposition, grouping, order, and dispatch for defined visual work. | Stops before implementation recipes. |
| [Design Execution](../../../skills/design/design-execution/SKILL.md) | Operation | Placeholder for one settled visual-design task. | Procedure is not written yet. Gains no Review, Evaluation, or acceptance authority. |
| [Design Review](../../../skills/design/design-review/SKILL.md) | Operation | Reviews one exact stable visual subject and returns caller-bound feedback. | Non-gating. |

Composition matches the [Coding skill family](coding-skill-family.md): callers select matching children
directly; the root never stores lifecycle state.

## Design Ideation image passes

Design Ideation runs two unmerged image passes. The user decides structure from greybox wireframe PNGs,
then direction from styled example PNGs on the accepted structure. Discussion topics follow that decision
order. Listed illustration PNGs are subordinate evidence. Written Design headings stay authoritative.

## Related designs

- [Coding skill family](coding-skill-family.md)
- [Authoring skill family](authoring-skill-family.md)
- [Identity-and-load role contracts](../process/identity-and-load-role-contracts.md)
