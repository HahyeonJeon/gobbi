# Coding skill family

## Intent

The [Coding root](../../../skills/coding/SKILL.md) is a navigation-only domain skill for code design,
implementation, and non-gating review. It routes every applicable direct child and owns no lifecycle procedure,
sequence, state, gate, recovery policy, or child judgment.

The family has exactly three direct operation children: `coding-execution`, `coding-ideation`, and
`coding-review`. The canonical skills own their live procedures. Generic Evaluation remains outside the family
as the independent gate. This design records the current family shape, ownership, routing, Review meaning, and
public migration without copying skill procedures.

## Family and ownership

| Skill | Type | Current owner | Authority boundary |
|---|---|---|---|
| [Coding](../../../skills/coding/SKILL.md) | Domain | Discovers every direct child whose applicability contract matches the current bounded unit. | Owns navigation only. It never conducts General, Cowork, or Workflow work. |
| [Coding Execution](../../../skills/coding/coding-execution/SKILL.md) | Operation | Applies Generic Execution to one settled code task, with code-specialist selection, affected-code reach, one local implementation plan, and the caller's commit-or-retain policy. | Generic Execution retains implementation, verification, repair, its final-identity checklist pass, and handoff. Coding Execution gains no Review, Evaluation, or acceptance authority. |
| [Coding Ideation](../../../skills/coding/coding-ideation/SKILL.md) | Operation | Applies Generic Ideation to an unresolved material code-design choice through the accepted dependency-gated design ladder and comparable views. | Generic Ideation retains evidence, discussion, user decisions, indexed output, freeze, and the stop before Planning or realization. |
| [Coding Review](../../../skills/coding/coding-review/SKILL.md) | Operation | Reviews one exact stable code subject and returns one caller-bound feedback report. | It has no generic Review base, target-mutation right, verdict, gate, correction, or acceptance authority. |

Generic Planning remains the only multi-task decomposition owner. Coding Execution may order work only inside one
accepted task. Language, framework, platform, tool, and product-domain skills retain their specialist judgments
without becoming lifecycle drivers.

Composition is one-way:

```text
General manager -> coding root --discovery--> matching coding child
Cowork manager  --------------------------------> matching coding child
Workflow manager -------------------------------> matching coding child
direct caller    -------------------------------> matching coding child
matching coding child -> generic lifecycle base when one exists + specialists
```

Generic lifecycle skills never dispatch back into Coding. The root never stores lifecycle state or becomes a
prerequisite for direct child use.

## Routing and caller conduct

- The root applies exactly when at least one child applies. Load every currently matching child. Do not load a
  future dependent child before its own start contract is current.
- General uses the root for discovery, then sequences matching children as dependencies become current. It uses
  Generic Planning only when several accountable tasks or writer frontiers need decomposition.
- General may enter any child directly from a complete current contract. Code design, Planning, and Execution
  form a dependency path when needed, not a mandatory pipeline. Coding Review and Generic Evaluation are
  independent branches.
- Cowork and Workflow keep their existing stages, paths, participant policy, commit policy, Evaluation policy,
  gates, acceptance, and handoffs. They select matching children directly inside those stages.
- Route by the productive subject and owned outcome, not by whether the repository contains code. Keep
  consistency-bound tests, configuration, schemas, generated views, documents, behavior, failures, recovery,
  and consumers in one code-primary unit. Split independently assignable outcomes through Planning.
- When evaluation is required, route every target through Generic Evaluation at its owning-stage depth. When an
  implementation slice has an in-contract code judgment, Evaluation applies the Coding Review checklist as its
  code baseline.
- Re-entry starts at the earliest owner whose accepted input changed. The manager or mode tracks result identity
  and freshness; the Coding root does not.

## Review and Evaluation

Coding Review preserves the former standalone Code Review meaning under the family. It permits independent review
or caller-authorized disclosed self-review, records whether the reviewer is `author` or `not the author`, and
keeps the subject and governing state read-only.

| Concern | Coding Review | Generic Evaluation for code |
|---|---|---|
| Subject | One exact stable code subject. | One frozen target or owned implementation slice with an in-contract code judgment. |
| First pass | Actual-code critique locked before the shared checklist or prepared same-subject Review. | Independent unaided critique locked before reusable sources or a same-subject Review report. |
| Output | One nine-section report in `current`, `partial`, `unable`, or `historical` state. | `report.md` plus an Evaluation-owned working `checklist.md`. |
| Prepared Review | Own result. | Optional delayed evidence. Every material claim is independently verified. |
| Decision effect | Feedback only. No verdict, approval, acceptance, or gate effect. | Applies caller criteria and may issue a verdict or `Not issued`. |

Coding Review item results remain `problem found`, `no problem found`, `not applicable`, and `evidence missing`.
One supported root Problem has one primary category. `Unclassified — taxonomy Gap` remains a temporary supported
coverage signal, not a permanent category. Durable Reports Memory requires a separate authorized Memory action.

## Shared code-quality baseline

The [Coding Review checklist](../../../skills/coding/coding-review/checklist.md) is the single reusable code
baseline. Its 26 core categories, 30 expected scenarios, 180 negative signs, source order, Coverage Account, and
15 ordered specialist overlays remain intact. Coding Review owns its substantive meaning and report vocabulary;
Checklist owns reusable-source revision policy.

The source has three consumers with separate authority:

- Coding Review applies it after the locked actual-code critique and writes the caller-bound Review report.
- Generic Execution applies it directly to final code during its one final-identity checklist pass. Coding
  Execution confirms that pass instead of running another review or writing a Review report.
- Generic Evaluation loads it after its unaided critique into an Evaluation-owned working checklist. Evaluation
  retains independent finding, criteria, and verdict authority.

## Public ownership and migration

The canonical public home is `skills/coding/`. Runtime discovery exposes one recursive `coding` root and no
top-level child links. The former top-level `code-review` skill, canonical home, current process design, and
discovery name are retired without an alias; direct consumers use `coding-review`.

Current callers and role load maps use the root for domain discovery and load children at their actual stage.
Generated plugin skills and role views derive from canonical sources. The Unreleased changelog records the
breaking replacement and consumer action. Historical Memory, completed reports, and released changelog entries
retain their point-in-time names and facts.

## Related designs

- [Evaluation](../process/evaluation.md) records code-slice routing, delayed prepared-evidence intake, and
  Evaluation's independent two-file authority.
- [Identity-and-load role contracts](../process/identity-and-load-role-contracts.md) records domain discovery,
  General sequencing, direct mode selection, specialist loads, and executor review-only mode.
