# React Compiler Checklist

Use this unchecked `react-compiler` source with general `evaluation` when the React root activates the compiler
child; `RCMP` is the stable owner prefix.

## Project

### RCMP-SC-PROJECT-01 — Normal case: The installed compiler contract is established

Compiler decisions should use the project's installed React, compiler, linter, build tool, framework, and
configuration. A neighboring version, guessed default, or missing command fails the scenario.

#### Checklist

- [ ] RCMP-CK-PROJECT-01-01 — Project files establish the installed React Compiler.
- [ ] RCMP-CK-PROJECT-01-02 — Project files establish the installed React line.
- [ ] RCMP-CK-PROJECT-01-03 — Project files establish the installed Hooks linter integration.
- [ ] RCMP-CK-PROJECT-01-04 — Project files establish the active compiler build-tool integration.
- [ ] RCMP-CK-PROJECT-01-05 — Project files establish the active framework integration.
- [ ] RCMP-CK-PROJECT-01-06 — Every active non-default compiler option is recorded.
- [ ] RCMP-CK-PROJECT-01-07 — Every active compiler option resolves to its owning configuration file.
- [ ] RCMP-CK-PROJECT-01-08 — The applicable compiler command is known.
- [ ] RCMP-CK-PROJECT-01-09 — The applicable lint command is known.
- [ ] RCMP-CK-PROJECT-01-10 — The applicable build command is known.
- [ ] RCMP-CK-PROJECT-01-11 — The applicable test command is known.
- [ ] RCMP-CK-PROJECT-01-12 — The applicable measurement command or method is known.

## Structure

### RCMP-SC-STRUCTURE-01 — Edge case: Configuration does not equal coverage

Candidate selection, compilation, and runtime gating are distinct. Treating a plugin or project switch as
proof that every affected function is optimized fails the scenario.

#### Checklist

- [ ] RCMP-CK-STRUCTURE-01-01 — The active `compilationMode` is recorded before function-level judgment.
- [ ] RCMP-CK-STRUCTURE-01-02 — Each affected component or Hook is classified as compiled, skipped, failed, or not a candidate.
- [ ] RCMP-CK-STRUCTURE-01-03 — Runtime gating is distinguished from the existence of compiled output.
- [ ] RCMP-CK-STRUCTURE-01-04 — React compatibility settings match the project's supported React line.
- [ ] RCMP-CK-STRUCTURE-01-05 — Each diagnostic resolves to its configuration, Rules-of-React, syntax, or library owner.

## Performance

### RCMP-SC-PERFORMANCE-01 — Poor quality: Optimization is claimed without behavior and measurement evidence

Compiler output may change update work without improving the measured user path. Removing memoization or
claiming a gain without focused evidence fails the scenario.

#### Checklist

- [ ] RCMP-CK-PERFORMANCE-01-01 — Each performance claim names the measured interaction.
- [ ] RCMP-CK-PERFORMANCE-01-02 — Each performance claim names its metric.
- [ ] RCMP-CK-PERFORMANCE-01-03 — Each performance claim names its environment.
- [ ] RCMP-CK-PERFORMANCE-01-04 — Each performance claim states a before-and-after result.
- [ ] RCMP-CK-PERFORMANCE-01-05 — Existing manual memoization remains unless focused evidence supports changing it.
- [ ] RCMP-CK-PERFORMANCE-01-06 — New manual memoization has a measured-work, required-identity, or documented-escape-hatch reason.
- [ ] RCMP-CK-PERFORMANCE-01-07 — A compiler change preserves the affected behavior.
- [ ] RCMP-CK-PERFORMANCE-01-08 — A compiler change preserves every required identity contract.

## Aesthetics

### RCMP-SC-AESTHETICS-01 — Poor quality: Configuration obscures the active contract

Compiler configuration and exceptions should use documented names and expose why they exist. Unknown options
or unexplained escape hatches fail the scenario.

#### Checklist

- [ ] RCMP-CK-AESTHETICS-01-01 — Every compiler option uses its installed documented name.
- [ ] RCMP-CK-AESTHETICS-01-02 — Every compiler option uses its installed documented value shape.
- [ ] RCMP-CK-AESTHETICS-01-03 — Each compiler annotation, directive, gate, or suppression states its bounded reason.

## Usage

### RCMP-SC-USAGE-01 — Expected failure: A function does not compile

A skipped or failed function should remain behaviorally correct and give the developer a diagnosable recovery
path. Hidden coverage loss or an unusable handoff fails the scenario.

#### Checklist

- [ ] RCMP-CK-USAGE-01-01 — An uncompiled function retains correct unoptimized behavior.
- [ ] RCMP-CK-USAGE-01-02 — The handoff identifies every remaining uncovered function.
- [ ] RCMP-CK-USAGE-01-03 — Every remaining uncovered function has a next diagnostic action.

## Consistency

### RCMP-SC-CONSISTENCY-01 — Rule violation: Configuration, diagnostics, and output disagree

Source configuration, lint diagnostics, build output, coverage evidence, tests, and handoff should describe
the same final compiler state. Stale evidence fails the scenario.

#### Checklist

- [ ] RCMP-CK-CONSISTENCY-01-01 — Compiler configuration and lint configuration describe the same intended adoption mode.
- [ ] RCMP-CK-CONSISTENCY-01-02 — Final lint evidence reports each affected function accurately.
- [ ] RCMP-CK-CONSISTENCY-01-03 — Final build evidence reports each affected function accurately.
- [ ] RCMP-CK-CONSISTENCY-01-04 — Final coverage evidence reports each affected function accurately.
- [ ] RCMP-CK-CONSISTENCY-01-05 — Reported compiler evidence comes from the exact final tree.

## Risk

### RCMP-SC-RISK-01 — Expected failure: Incremental adoption regresses behavior

A bounded compiler rollout should be reversible when correctness, identity, build, or performance evidence
regresses. Expanding despite a failed slice or lacking a recovery boundary fails.

#### Checklist

- [ ] RCMP-CK-RISK-01-01 — Each adoption slice has a known last proven configuration or runtime gate.
- [ ] RCMP-CK-RISK-01-02 — Every failed required gate stops adoption expansion.
- [ ] RCMP-CK-RISK-01-03 — A failed adoption slice restores a recoverable state.

## Overall

### RCMP-SC-OVERALL-01 — Adversarial: Project-level enablement hides a coverage gap

A repository can contain the compiler plugin and still skip the exact function under review. A project-wide
pass claim without function-level evidence fails.

#### Checklist

- [ ] RCMP-CK-OVERALL-01-01 — No project-level enablement fact is used as a proxy for affected-function coverage.
- [ ] RCMP-CK-OVERALL-01-02 — The final result distinguishes configured, compiled, runtime-selected, tested, and measured claims.
