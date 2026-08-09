# Python Toolchain Evaluation Checklist

This unchecked source evaluates one Python interpreter, isolated-environment, project-tooling, or tool-diagnostic
account governed by [`python-toolchain`](SKILL.md). It covers platform and tool facts only; implementation,
correctness, package-distribution, release, performance, and general path-placement outcomes remain with their
respective sibling skills.

Every condition is independently answerable from the account and its cited configuration or observation. This
source contains no execution procedure, result, score, severity, or remediation.

## Design lifecycle

### Project toolchain contract

- [ ] The project configuration source that selects the required Python interpreter is identified.
- [ ] The project configuration source that selects each required tool responsibility is identified.
- [ ] The selected Python implementation matches the project contract.
- [ ] The selected Python version constraint matches the project contract.
- [ ] The selected Python platform constraint matches the project contract.
- [ ] Each relevant tool pin matches the project contract.
- [ ] Each responsibility for dependency resolution, formatting, linting, test execution, type checking, generation, and package building is assigned to its project-selected tool or recorded as absent.
- [ ] No named third-party installer, resolver, formatter, linter, test runner, type checker, generator, or build tool is selected solely from generic guidance.

### Isolated-environment boundary

- [ ] The selected isolated-environment mechanism and base interpreter are identified.
- [ ] The environment location is identified.
- [ ] The environment recreation input is identified.
- [ ] The environment disposable-state boundary is identified.
- [ ] Project source, distribution artifacts, and durable evidence are outside the disposable environment boundary.
- [ ] An activation prompt or environment variable is not the only evidence of the interpreter that ran.

## Development lifecycle

### Invocation binding

- [ ] The exact Python executable is recorded for each assessed tool invocation.
- [ ] The Python implementation and version are recorded for each assessed tool invocation.
- [ ] The platform and working directory are recorded for each assessed tool invocation.
- [ ] The environment state and relevant environment inputs are recorded for each assessed tool invocation.
- [ ] Every assessed tool invocation is the project-selected command or is explicitly identified as an unexecuted illustrative form.
- [ ] Every required tool pin or configuration file used to interpret an invocation is identified.
- [ ] A conflict between the observed executable or configuration and the project contract remains explicit.

### Effects and diagnostics

- [ ] Each assessed invocation identifies its expected source-write, generated-output, package-installation, cache, download, executed-code, and network effects that apply.
- [ ] Every effect outside read-only inspection has task authority recorded before the invocation.
- [ ] The first useful diagnostic is retained when a required interpreter, environment, dependency, or tool capability is unavailable or mismatched.
- [ ] A diagnostic conclusion distinguishes configuration, pin, environment, path, platform, permission, network, and tool-capability evidence when those causes can differ.
- [ ] No cache reset, upgrade, download, fixer, generator, persistent configuration change, or global-default change is used as an unexplained diagnostic substitute.

### Observation limits

- [ ] Each tool observation identifies its responsibility and invocation binding.
- [ ] Each tool observation identifies its inputs, output, and exit state.
- [ ] Each tool observation identifies its material side effects.
- [ ] A formatter, linter, test, type checker, generator, or build result is not represented as proof of an outcome outside its observed scope.
- [ ] A type-check result is not represented as Python runtime behavior proof.
- [ ] Python annotations are not represented as runtime validation.

## Product lifecycle

### Consumer and sibling boundaries

- [ ] Toolchain guidance does not claim installed-distribution behavior from source-tree or build-tool observations alone.
- [ ] Toolchain guidance does not claim immutable-artifact readiness, external publication state, or release completion.
- [ ] Toolchain guidance routes implementation changes to `python-development`.
- [ ] Toolchain guidance routes symptom diagnosis to `python-debugging`.
- [ ] Toolchain guidance routes correctness evidence to `python-testing`.
- [ ] Toolchain guidance routes package-distribution behavior to `python-packaging`.
- [ ] Toolchain guidance routes performance conclusions to `python-performance`.
- [ ] Toolchain guidance routes general workspace placement to `python-project-structure`.
- [ ] The final account preserves every unavailable prerequisite and the limit it places on the consumer-facing claim.
