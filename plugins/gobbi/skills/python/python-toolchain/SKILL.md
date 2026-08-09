---
name: python-toolchain
description: "MUST load when Python distribution tools, interpreter behavior, project-pinned tooling, or tool diagnostics are used or assessed."
allowed-tools: Read, Grep, Glob, Bash
skill-type: tool
---

# Python Toolchain

Python Toolchain is the lookup manual for the Python interpreter, isolated environments, and the tools a
project selects to install dependencies, check form or types, run tests, or build a distribution. It records
which executable and configuration produced an observation, then keeps that observation within its actual scope.

Use this skill to establish or diagnose platform facts, not to select a universal third-party tool or complete a
development, testing, packaging, performance, or release outcome. The repository's configuration, support
policy, and documented commands override generic guidance.

## Principles

### The invoked interpreter is the platform fact

A shell name, editor setting, or activation prompt does not identify the Python that produced an observation.
Bind each fact to the exact executable, implementation, version, environment, platform, and project context.

### Project selection outranks generic tooling advice

Projects may use different resolvers, runners, formatters, linters, type checkers, build backends, and support
ranges. Their pinned configuration and command entry points decide what applies.

### Tool output has a narrow meaning

A tool can establish only the behavior it ran with its recorded inputs and configuration. A successful command
does not prove unexercised correctness, installed-distribution behavior, runtime validation, performance, or
release state.

## Rules

- **MUST bind every interpreter or tool fact to the exact executable, implementation, version, platform, working directory, environment state, project configuration source, and relevant pin.** Record an unavailable or conflicting fact as a diagnostic limit rather than substituting a local default.
- **MUST let project configuration select every installer, resolver, formatter, linter, test runner, type checker, generator, and build command.** Generic guidance may identify a responsibility but must not name a universal third-party tool for it.
- **MUST treat isolated environments as disposable project support state.** Recreate an environment from the project contract when its location or base interpreter no longer matches; activation is optional shell convenience, not proof of the interpreter in use.
- **MUST state a tool observation's responsibility, invocation binding, inputs, effects, output, and limit.** Distinguish an executable's check, transformation, installation, generation, or diagnostic result from adjacent operation outcomes.
- **NEVER run an install, upgrade, download, fixer, generator, cache reset, or persistent configuration change solely because generic guidance suggests it.** Bind the project command, expected effects, and required authority before taking such an action.
- **NEVER treat annotations as runtime validation or a type-check result as runtime behavior proof.** Route runtime/API design to `python-design`, executable correctness evidence to `python-testing`, and concrete type-modeling judgment to `python-typing`.

## Manual

### Establish the project toolchain contract

Start with the repository's declared Python support policy, automation configuration, lock or pin source when
one exists, and documented command entry points. Record the exact Python executable that a selected command
uses, its implementation and version, the platform, working directory, relevant environment inputs, and the
environment or container identity when applicable. The Python `sys` module exposes interpreter-maintained
facts, but the project decides which facts its command contract requires. [Python `sys` documentation](https://docs.python.org/3/library/sys.html)

Separate responsibilities before interpreting a result: dependency installation or resolution, formatting,
linting, test execution, static type checking, generation, and package building can be owned by different
project-selected tools. A tool's name or a clean exit status does not transfer the outcome to this manual. If
the configuration is absent, incompatible, or contradicts a local default, report that exact conflict and ask
for the project-owned fact.

### Use isolated environments without confusing them for project source

Use the isolated-environment mechanism selected by the project. Python's standard-library `venv` creates an
environment around a base interpreter and normally isolates installed packages from the base environment; its
documentation treats environments as disposable and not portable. [Python `venv` documentation](https://docs.python.org/3/library/venv.html)

Keep project source, distribution artifacts, and durable evidence outside a disposable environment. An activated
environment changes shell lookup behavior, but activation is not required to invoke its interpreter or installed
scripts; record the executable actually used. Recreate an environment instead of moving or copying it when its
path or base interpreter no longer matches the project contract.

### Select and inspect project-pinned tools

For each needed responsibility, find the project's own configuration, pin, and command entry point before
assessing a tool. Record whether the selected command can write source or generated files, install packages,
use caches, download content, execute project code, or contact a service. Treat these as separate effects that
need the task's authority; a nominally diagnostic command may still execute code or alter disposable state.

When a command is unavailable, a dependency cannot resolve, or a different Python runs than expected, compare
the observed executable and effective project configuration with the bound contract. Preserve the first useful
diagnostic, classify the mismatch as configuration, pin, environment, path, platform, permission, network, or
tool-capability evidence when supported, and stop at the missing fact rather than changing a global default.

### Interpret selected tool observations

A formatter, linter, test, type-check, or build result concerns only its configured input and responsibility; it
cannot establish a neighboring operation outcome. Record the project invocation binding, output, exit state,
material side effects, including caches, downloads, generated output, and environment differences, and unexercised
scope.

### Route outcome work to its owner

Use `python-development` for implementation and implementation review, `python-debugging` for reproducing and
explaining a symptom, and `python-testing` for test strategy and correctness evidence. Use `python-packaging`
for `pyproject.toml` packaging semantics, distribution artifacts, and installed-consumer behavior; use
`python-release` only to coordinate immutable artifact readiness and authorized publication verification.

Use `python-performance` for measured resource conclusions, `python-project-structure` for general workspace
placement, `python-conventions` for written form, `python-design` for runtime/API design, and `python-typing`
for static type-modeling choices. This manual may supply concrete platform facts to those owners, but it does not
complete their outcome or change their authority.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
- [Python `venv` documentation](https://docs.python.org/3/library/venv.html) owns standard-library virtual-environment behavior.
- [Python `sys` documentation](https://docs.python.org/3/library/sys.html) owns interpreter-maintained runtime facts.
