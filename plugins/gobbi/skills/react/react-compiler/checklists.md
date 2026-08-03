# React Compiler Checklist

Use this unchecked `react-compiler` source with general `evaluation` when the React root activates the compiler
child; `RCMP` is the stable checklist prefix.

A row is defined once beneath its defining scenario. An `Also applies` entry points to a row defined elsewhere
that this scenario reuses.

## Project

### RCMP-SC-PROJECT-01 — Normal case: The installed compiler configuration is established

Compiler decisions should use the project's installed React, compiler, linter, build tool, framework, and
configuration. A neighboring version, guessed default, or missing command fails the scenario.

#### Checklist

- [ ] RCMP-CK-PROJECT-01-01 — Project files establish the installed React Compiler, exact installed React version, installed Hooks linter integration, active compiler build-tool integration, and active framework integration.
- [ ] RCMP-CK-PROJECT-01-02 — Every active non-default compiler option is recorded.
- [ ] RCMP-CK-PROJECT-01-03 — Every active compiler option resolves to the configuration file that contains it.
- [ ] RCMP-CK-PROJECT-01-04 — The applicable compiler, lint, build, test, and measurement command or method is known.
- [ ] RCMP-CK-PROJECT-01-05 — The installed compiler record states exact versions for React Compiler, React, Hooks linter, build tool, and framework integration, plus configuration files, plugins, commands, and supported version ranges.
- [ ] RCMP-CK-PROJECT-01-06 — Installed configuration is classified as no compiler, partial or gated adoption, annotation-driven adoption, or broad adoption.

### RCMP-SC-PROJECT-02 — Expected failure: The build-tool integration is unsupported

The installed integration must be supported by current compiler guidance before it carries compiler claims.
Treating an unsupported integration as valid configuration fails the scenario.

#### Checklist

- [ ] RCMP-CK-PROJECT-02-01 — The installed build-tool integration is supported by current compiler guidance.

## Structure

### RCMP-SC-STRUCTURE-01 — Normal case: Each affected function's coverage is established

Candidate selection, compilation, and diagnostics decide whether a given component or Hook is optimized. The
work should record the coverage result per function; a project-level judgment fails the scenario.

#### Checklist

- [ ] RCMP-CK-STRUCTURE-01-01 — The active `compilationMode` is recorded before function-level judgment.
- [ ] RCMP-CK-STRUCTURE-01-02 — Each affected component or Hook is classified as compiled, skipped, failed, or not a candidate.
- [ ] RCMP-CK-STRUCTURE-01-03 — Each diagnostic resolves to its configuration source, Rules-of-React rule, syntax, or library.
- [ ] RCMP-CK-STRUCTURE-01-04 — The active `compilationMode` record states candidate-selection behavior, not only enabled or disabled.
- [ ] RCMP-CK-STRUCTURE-01-05 — Actual affected-function coverage is rechecked after an in-scope diagnostic cause is repaired.

### RCMP-SC-STRUCTURE-02 — Edge case: Configuration is present but does not deliver coverage

A configured compiler can still leave compiled output unselected at runtime, and a compatibility setting can
target another React version. At that boundary the work should record what the configuration actually delivers.

#### Checklist

- [ ] RCMP-CK-STRUCTURE-02-01 — Runtime gating is distinguished from the existence of compiled output.
- [ ] RCMP-CK-STRUCTURE-02-02 — React compatibility settings match the project's supported React version range.

## Performance

### RCMP-SC-PERFORMANCE-01 — Poor quality: Optimization is claimed without behavior and measurement evidence

Compiler output may change update work without improving the measured user interaction. Removing memoization or
claiming a gain without focused evidence fails the scenario.

#### Checklist

- [ ] RCMP-CK-PERFORMANCE-01-01 — Each performance claim names the measured interaction, its metric, and its environment.
- [ ] RCMP-CK-PERFORMANCE-01-02 — Each performance claim states a before-and-after result.
- [ ] RCMP-CK-PERFORMANCE-01-03 — Existing manual memoization remains unless focused evidence supports changing it.
- [ ] RCMP-CK-PERFORMANCE-01-04 — New manual memoization has a measured-work, required-identity, or documented-escape-hatch reason.
- [ ] RCMP-CK-PERFORMANCE-01-05 — A compiler change preserves the affected behavior and every required identity relationship.
- [ ] RCMP-CK-PERFORMANCE-01-06 — Existing manual memoization is removed only after focused correctness tests support the change.

### RCMP-SC-PERFORMANCE-02 — Normal case: Each adoption slice is measured before expansion

A bounded slice should measure affected behavior before broader rollout. Expanding from correctness or
compilation evidence alone fails the scenario.

#### Checklist

- [ ] RCMP-CK-PERFORMANCE-02-01 — Affected behavior is measured before adoption expands.

## Aesthetics

### RCMP-SC-AESTHETICS-01 — Poor quality: Configuration obscures the active settings

Compiler configuration and exceptions should use documented names and expose why they exist. Unknown options
or unexplained escape hatches fail the scenario.

#### Checklist

- [ ] RCMP-CK-AESTHETICS-01-01 — Every compiler option uses its installed documented name and value type or object structure.
- [ ] RCMP-CK-AESTHETICS-01-02 — Each compiler annotation, directive, runtime gating condition, or suppression states its bounded reason.
- [ ] RCMP-CK-AESTHETICS-01-03 — Misspelled, unsupported, or wrong-typed options are checked with the official `config` lint when available.

## Usage

### RCMP-SC-USAGE-01 — Expected failure: A function does not compile

A skipped or failed function should remain behaviorally correct and give the developer a diagnosable recovery
action. Hidden coverage loss or an unusable handoff fails the scenario.

#### Checklist

- [ ] RCMP-CK-USAGE-01-01 — An uncompiled function retains correct unoptimized behavior.
- [ ] RCMP-CK-USAGE-01-02 — The handoff identifies every remaining uncovered function.
- [ ] RCMP-CK-USAGE-01-03 — Every remaining uncovered function has a next diagnostic action.
- [ ] RCMP-CK-USAGE-01-04 — Unrelated diagnostics are not treated as required completion scope.
- [ ] RCMP-CK-USAGE-01-05 — Skipped functions and their resulting limitations remain visible.

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
- [ ] RCMP-CK-CONSISTENCY-02-02 — Each applicable compiler or Hooks diagnostic either has its cause repaired or records intentional skipped coverage.
- Also applies: RCMP-CK-USAGE-01-02 (every remaining uncovered function stays visible in the handoff).

## Risk

### RCMP-SC-RISK-01 — Expected failure: Incremental adoption regresses behavior

A bounded compiler rollout should be reversible when correctness, identity, build, or performance evidence
regresses. Expanding despite a failed slice or lacking a recovery boundary fails.

#### Checklist

- [ ] RCMP-CK-RISK-01-01 — Each adoption slice has a known last proven configuration or runtime gating state.
- [ ] RCMP-CK-RISK-01-02 — Every failed required check stops adoption expansion.
- [ ] RCMP-CK-RISK-01-03 — A failed adoption slice restores a recoverable state.
- [ ] RCMP-CK-RISK-01-04 — Each adoption slice changes one bounded area.
- [ ] RCMP-CK-RISK-01-05 — Correctness, lint, and build checks complete before adoption expands.
- [ ] RCMP-CK-RISK-01-06 — Affected-function coverage is confirmed before adoption expands.

### RCMP-SC-RISK-02 — Expected failure: Expansion or recovery exceeds the last proven boundary

Expansion and recovery must stay within the complete slice gate and last proven boundary. Skipping the gate,
recovery inspection, or smallest corrected retry fails the scenario.

#### Checklist

- [ ] RCMP-CK-RISK-02-01 — Expansion requires the current bounded slice to satisfy its complete correctness, lint and build, coverage, and measurement gate.
- [ ] RCMP-CK-RISK-02-02 — Regression recovery inspects configuration, coverage, and identity assumptions after restoring the last proven boundary.
- [ ] RCMP-CK-RISK-02-03 — Recovery retries only the smallest corrected slice.

## Overall

### RCMP-SC-OVERALL-01 — Adversarial: Project-level enablement hides a coverage gap

A repository can contain the compiler plugin and still skip the exact function under review. A project-wide
pass claim without function-level evidence fails.

#### Checklist

- [ ] RCMP-CK-OVERALL-01-01 — No project-level enablement state is used as a proxy for affected-function coverage.
- [ ] RCMP-CK-OVERALL-01-02 — The final result distinguishes configured, compiled, runtime-selected, tested, and measured claims.
- [ ] RCMP-CK-OVERALL-01-03 — Handoff records compiler state, affected functions, diagnostics, commands, coverage evidence, measurements, and remaining skips.
