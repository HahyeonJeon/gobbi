---
name: python-conventions
description: "Python Conventions provides overridable preferences for names, imports, source form, comments, docstrings, and formatting."
allowed-tools: Read, Grep, Glob
skill-type: preference
---

# Python Conventions

Python Conventions provides overridable written-form guidance for names, imports, source form, comments, docstrings, and formatting.

Use it when authors or reviewers make written-form choices after project rules, supported syntax, and public spellings are known. It does not decide runtime behavior, type semantics, package distribution, or tool selection.

## Principles

### Let local consistency serve readers

Use established project form when it is coherent, because code is read more often than it is written. PEP 8 makes
project-specific style guides the controlling source when they conflict with its generic guidance.

### Name meaning, not syntax

Names should reveal their domain role, state, side effect, unit, or failure meaning without repeating their type or
surrounding module context.

### Make documentation add information

Comments and docstrings should explain behavior, intent, assumptions, or a public contract that code alone cannot
reliably show. A restatement becomes stale without helping a reader.

## Rules

- **MUST apply an explicit project convention, configured formatting or import rule, supported Python grammar, and
  generated-source contract before any generic default.** Record the controlling evidence when it differs from
  the surrounding form.
- **MUST settle runtime behavior, public API, package boundary, and type-model meaning with their owning skills
  before choosing their written form.** `python-design` owns runtime/API semantics, `python-typing` owns type
  meaning, `python-project-structure` owns placement, and `python-toolchain` owns tool selection.
- **MUST keep changed comments and docstrings consistent with the code's current observable behavior, failure,
  lifetime, and public contract.** Remove or revise misleading prose in the same change.
- **MUST preserve an established public, protocol, generated, or compatibility-sensitive spelling unless an
  authorized migration changes its consumers.** A cosmetic preference does not authorize a breaking rename.
- **NEVER mandate a formatter, linter, import sorter, documentation generator, or type checker for all Python
  projects.** Concrete tool choice and invocation belong to `python-toolchain`.
- **NEVER use written-form guidance to choose annotation semantics or claim runtime validation.** Annotation form is
  convention; truthful type modeling belongs to `python-typing`, and runtime acceptance belongs to
  `python-design`.

## Preferences

### Names and public spellings

PREFER names that are short enough to read in local context and specific enough to distinguish domain concepts,
states, side effects, failures, and otherwise ambiguous units. PREFER lowercase module and package names, usually
without separators, and `CapWords` class names where project practice is silent, following PEP 8's naming guidance.
[PEP 8](https://peps.python.org/pep-0008/#naming-conventions) An established API, protocol term, generated name,
or project vocabulary justifies another spelling; changing a public name needs a consumer-aware migration.

### Imports and source form

PREFER explicit imports that make a name's origin clear, with grouping and ordering supplied by the project when
configured. PREFER avoiding wildcard imports because they hide the names a reader and static tools must resolve.
[PEP 8](https://peps.python.org/pep-0008/#imports) A generated re-export, compatibility boundary, or established
project convention may justify an exception when its exported surface remains clear.

### Comments and docstrings

PREFER a docstring for a public module, class, function, or method when a consumer needs behavior, failure, or
lifetime information, and PREFER comments for intent, invariants, or surprising constraints rather than a line's
literal mechanics. PEP 257 defines a docstring as the first statement and recommends triple double quotes.
[PEP 257](https://peps.python.org/pep-0257/#what-is-a-docstring) A private, obvious, stable implementation may not
need prose; generated or compatibility documentation follows its owning contract.

### Formatting

PREFER the project's configured formatter and local style. When no project form applies, PREFER readable PEP 8
baselines such as four-space indentation, normal spacing around annotation arrows, and no semantic change solely
for mechanical form. [PEP 8](https://peps.python.org/pep-0008/#function-annotations) A required generated form,
supported-version constraint, or coherent local style is evidence to depart.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
