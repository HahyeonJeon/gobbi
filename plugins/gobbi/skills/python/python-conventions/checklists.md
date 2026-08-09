# Python Conventions Evaluation Checklist

This unchecked source evaluates one Python written-form decision governed by
[`python-conventions`](SKILL.md). It covers names, imports, comments, docstrings, and formatting; runtime/API,
type-model, project-structure, packaging, and tool-selection outcomes remain with their sibling skills.

## Design lifecycle

### Controlling convention

- [ ] The affected project convention, configured form rule, target Python support policy, generated-source contract, and public spelling constraint that apply are identified.
- [ ] A project-specific convention takes precedence over the generic default where they differ.
- [ ] The semantic owner of every material API, runtime, type-model, placement, package, or tool decision is identified before its written form is judged.
- [ ] A compatibility-sensitive or generated public spelling has an identified consumer or contract.

### Reader-facing form

- [ ] Each changed name distinguishes its relevant domain role, state, side effect, failure meaning, or ambiguous unit without encoding a redundant type.
- [ ] Each changed comment or docstring adds behavior, intent, invariant, failure, or lifecycle information not already clear from the code.
- [ ] Each public docstring subject to the project's documentation contract states the current consumer-relevant behavior without a stale signature restatement.

## Development lifecycle

### Source form

- [ ] Imports use the project-selected grouping, ordering, and explicitness rule, or the applicable documented exception.
- [ ] A wildcard import has an identified generated, compatibility, or explicit-public-surface reason.
- [ ] Changed annotation spacing follows the project's written-form rule without claiming a type-model or runtime-validation conclusion.
- [ ] Changed formatting follows the configured formatter or a coherent local form without altering behavior solely to satisfy a generic rule.
- [ ] Changed comments and docstrings agree with the current code, failure path, resource lifetime, and public contract.

## Product lifecycle

### Consumers and change boundaries

- [ ] A public rename, import spelling change, or documentation change identifies the affected consumer and compatibility boundary.
- [ ] A written-form exception remains consistent within its declared project, protocol, generated-source, or compatibility scope.
- [ ] No universal formatter, linter, import sorter, documentation generator, or type checker is represented as a Python-wide requirement.
- [ ] No written-form account represents an annotation as runtime validation or a type-check conclusion.
