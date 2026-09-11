# Authoring skill family

## Intent

The [Authoring root](../../../skills/authoring/SKILL.md) is a navigation-only domain skill for writing
design, planning, implementation, and non-gating review. It routes every applicable direct child and owns
no lifecycle procedure, sequence, state, gate, recovery policy, or child judgment.

The family has exactly four direct operation children. Top-level Ideation, Planning, Study, Execution, and
Evaluation skills are gone without an alias. Canonical skills own live procedures.

## Family and ownership

| Skill | Type | Current owner | Authority boundary |
|---|---|---|---|
| [Authoring](../../../skills/authoring/SKILL.md) | Domain | Discovers every direct child whose applicability contract matches the current bounded unit. | Owns navigation only. |
| [Authoring Ideation](../../../skills/authoring/authoring-ideation/SKILL.md) | Operation | Owns study, discussion, the writing-design ladder, and one indexed ideation result. | Stops before Planning or realization. |
| [Authoring Planning](../../../skills/authoring/authoring-planning/SKILL.md) | Operation | Owns decomposition, grouping, order, and dispatch for defined writing work. | Stops before implementation recipes. |
| [Authoring Execution](../../../skills/authoring/authoring-execution/SKILL.md) | Operation | Owns implementation and verification for one settled writing task. | Gains no Review or acceptance authority. |
| [Authoring Review](../../../skills/authoring/authoring-review/SKILL.md) | Operation | Reviews one exact stable writing subject and returns caller-bound feedback. | Non-gating. |

Composition matches the [Coding skill family](coding-skill-family.md): callers select matching children
directly; the root never stores lifecycle state.

## Related designs

- [Coding skill family](coding-skill-family.md)
- [Design skill family](design-skill-family.md)
- [Identity-and-load role contracts](../process/identity-and-load-role-contracts.md)
