# React Compiler Checklist

Use this unchecked `react-compiler` source with general `evaluation` when the React root activates the compiler
child; `RCMP` is the stable owner prefix.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### RCMP-SC-PROJECT-01 — Normal case: The installed compiler contract is established

Compiler decisions should use the project's installed React, compiler, linter, build tool, framework, and
configuration. A neighboring version, guessed default, or missing command fails the scenario.

#### Checklist

- [ ] RCMP-CK-PROJECT-01-01 — Project files establish the installed React Compiler, installed React line, installed Hooks linter integration, active compiler build-tool integration, and active framework integration.
- [ ] RCMP-CK-PROJECT-01-02 — Every active non-default compiler option is recorded.
- [ ] RCMP-CK-PROJECT-01-03 — Every active compiler option resolves to its owning configuration file.
- [ ] RCMP-CK-PROJECT-01-04 — The applicable compiler, lint, build, test, and measurement command or method is known.

## Structure

### RCMP-SC-STRUCTURE-01 — Normal case: Each affected function's coverage is established

Candidate selection, compilation, and diagnostics decide whether a given component or Hook is optimized. The
work should record that fact per function; a project-level judgment fails the scenario.

#### Checklist

- [ ] RCMP-CK-STRUCTURE-01-01 — The active `compilationMode` is recorded before function-level judgment.
- [ ] RCMP-CK-STRUCTURE-01-02 — Each affected component or Hook is classified as compiled, skipped, failed, or not a candidate.
- [ ] RCMP-CK-STRUCTURE-01-03 — Each diagnostic resolves to its configuration, Rules-of-React, syntax, or library owner.

### RCMP-SC-STRUCTURE-02 — Edge case: Configuration is present but does not deliver coverage

A configured compiler can still leave compiled output unselected at runtime, and a compatibility setting can
target another React line. At that boundary the work should record what the configuration actually delivers.

#### Checklist

- [ ] RCMP-CK-STRUCTURE-02-01 — Runtime gating is distinguished from the existence of compiled output.
- [ ] RCMP-CK-STRUCTURE-02-02 — React compatibility settings match the project's supported React line.

## Performance

### RCMP-SC-PERFORMANCE-01 — Poor quality: Optimization is claimed without behavior and measurement evidence

Compiler output may change update work without improving the measured user path. Removing memoization or
claiming a gain without focused evidence fails the scenario.

#### Checklist

- [ ] RCMP-CK-PERFORMANCE-01-01 — Each performance claim names the measured interaction, its metric, and its environment.
- [ ] RCMP-CK-PERFORMANCE-01-02 — Each performance claim states a before-and-after result.
- [ ] RCMP-CK-PERFORMANCE-01-03 — Existing manual memoization remains unless focused evidence supports changing it.
- [ ] RCMP-CK-PERFORMANCE-01-04 — New manual memoization has a measured-work, required-identity, or documented-escape-hatch reason.
- [ ] RCMP-CK-PERFORMANCE-01-05 — A compiler change preserves the affected behavior and every required identity contract.

## Aesthetics

### RCMP-SC-AESTHETICS-01 — Poor quality: Configuration obscures the active contract

Compiler configuration and exceptions should use documented names and expose why they exist. Unknown options
or unexplained escape hatches fail the scenario.

#### Checklist

- [ ] RCMP-CK-AESTHETICS-01-01 — Every compiler option uses its installed documented name and value shape.
- [ ] RCMP-CK-AESTHETICS-01-02 — Each compiler annotation, directive, gate, or suppression states its bounded reason.

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
- [ ] RCMP-CK-CONSISTENCY-01-02 — Final lint, build, and coverage evidence each report every affected function accurately.
- [ ] RCMP-CK-CONSISTENCY-01-03 — Reported compiler evidence comes from the exact final tree.

### RCMP-SC-CONSISTENCY-02 — Adversarial: A silenced diagnostic manufactures a coverage claim

A compiler or Hooks diagnostic can be suppressed, annotated away, or excluded so a function appears compiled.
Suppression changes the report, not the coverage, so a claim built on it fails the scenario.

#### Checklist

- [ ] RCMP-CK-CONSISTENCY-02-01 — No diagnostic is suppressed, annotated, or excluded in order to present a function as compiled.
- Also applies: RCMP-CK-USAGE-01-02 (every remaining uncovered function stays visible in the handoff).

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
