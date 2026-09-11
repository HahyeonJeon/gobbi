# Coding skill family

## Intent

The [Coding root](../../../skills/coding/SKILL.md) is a navigation-only domain skill for code design,
planning, implementation, and non-gating review. It routes every applicable direct child and owns no
lifecycle procedure, sequence, state, gate, recovery policy, or child judgment.

The family has exactly four direct operation children: `coding-ideation`, `coding-planning`,
`coding-execution`, and `coding-review`. The canonical skills own their live procedures. Top-level
Ideation, Planning, Study, Execution, and Evaluation skills are gone without an alias. This design
records the current family shape, ownership, routing, and Review meaning without copying skill
procedures.

## Family and ownership

| Skill | Type | Current owner | Authority boundary |
|---|---|---|---|
| [Coding](../../../skills/coding/SKILL.md) | Domain | Discovers every direct child whose applicability contract matches the current bounded unit. | Owns navigation only. It never conducts General, Cowork, or Workflow work. |
| [Coding Ideation](../../../skills/coding/coding-ideation/SKILL.md) | Operation | Owns study, discussion, the code-design ladder, and one indexed ideation result for an unresolved material code-design choice. | Stops before Planning or realization. |
| [Coding Planning](../../../skills/coding/coding-planning/SKILL.md) | Operation | Owns decomposition, grouping, order, and dispatch for defined code work. | Stops before implementation recipes. Coding Execution may order work only inside one accepted task. |
| [Coding Execution](../../../skills/coding/coding-execution/SKILL.md) | Operation | Owns implementation, verification, repair, the applicable checklist pass, and handoff for one settled code task, with code-specialist selection, affected-code reach, one local thinking guide, and the caller's commit-or-retain policy. | Gains no Review or acceptance authority. |
| [Coding Review](../../../skills/coding/coding-review/SKILL.md) | Operation | Reviews one exact stable code subject and returns one caller-bound feedback report. | Non-gating. No target-mutation right, verdict, gate, correction, or acceptance authority. |

Language, framework, platform, tool, and product-domain skills retain their specialist judgments
without becoming lifecycle drivers.

Composition is one-way:

```text
General manager -> coding root --discovery--> matching coding child
Cowork manager  --------------------------------> matching coding child
Workflow manager -------------------------------> matching coding child
direct caller    -------------------------------> matching coding child
```

Removed generic lifecycle skills never dispatch into Coding. The root never stores lifecycle state or
becomes a prerequisite for direct child use.

## Routing and caller conduct

- The root applies exactly when at least one child applies. Load every currently matching child. Do not load a
  future dependent child before its own start contract is current.
- General uses the root for discovery, then sequences matching children as dependencies become current. It uses
  Coding Planning only when several accountable tasks or writer frontiers need decomposition.
- General may enter any child directly from a complete current contract. Code design, Planning, and Execution
  form a dependency path when needed, not a mandatory pipeline. Coding Review is an independent non-gating
  branch.
- Cowork and Workflow keep their existing stages, paths, participant policy, commit policy, `review` call,
  gates, acceptance, and handoffs. They select matching children directly inside those stages.
- Route by the productive subject and owned outcome, not by whether the repository contains code. Keep
  consistency-bound tests, configuration, schemas, generated views, documents, behavior, failures, recovery,
  and consumers in one code-primary unit. Split independently assignable outcomes through Coding Planning.
- There is no Generic Evaluation skill. Cowork still has a user-called `review` phase. That load map is
  stale until Review is redesigned; see [Evaluation](../process/evaluation.md). Do not invent a
  replacement evaluation skill.
- Re-entry starts at the earliest owner whose accepted input changed. The manager or mode tracks result identity
  and freshness; the Coding root does not.

## Review

Coding Review preserves independent review or caller-authorized disclosed self-review, records whether the
reviewer is `author` or `not the author`, and keeps the subject and governing state read-only. It is
feedback only. It has no verdict, approval, acceptance, or gate effect.

Coding Review item results remain `problem found`, `no problem found`, `not applicable`, and `evidence missing`.
One supported root Problem has one primary category. `Unclassified — taxonomy Gap` remains a temporary supported
coverage signal, not a permanent category. Durable Reports Memory requires a separate authorized Memory action.

## Shared code-quality baseline

The [Coding Review checklist](../../../skills/coding/coding-review/checklist.md) is the single reusable code
baseline. It has no Coverage Account. Coding Review owns its substantive meaning and report vocabulary;
Checklist owns reusable-source revision policy and the Coverage Account on the Checklist skill template.

The source has these consumers with separate authority:

- Coding Review applies it after the locked actual-code critique and writes the caller-bound Review report.
- Coding Execution applies it to final code during its one final-identity checklist pass instead of running
  another review or writing a Review report.

## Public ownership and migration

The canonical public home is `skills/coding/`. Runtime discovery exposes one recursive `coding` root and no
top-level child links. The former top-level `code-review`, `ideation`, `planning`, `study`, `execution`, and
`evaluation` skills are retired without an alias.

Current callers and role load maps use the root for domain discovery and load children at their actual stage.
Generated plugin skills and role views derive from canonical sources. Historical Memory, completed reports, and
released changelog entries retain their point-in-time names and facts.

## Related designs

- [Authoring skill family](authoring-skill-family.md) and [Design skill family](design-skill-family.md)
  use the same four-child navigation-only shape.
- [Evaluation](../process/evaluation.md) records that Generic Evaluation is removed and that Cowork
  `review` remains.
- [Identity-and-load role contracts](../process/identity-and-load-role-contracts.md) records domain
  discovery and matching-child loads.
