# React Conventions Checklist

Use this unchecked `react-conventions` source with general `evaluation` when the React root activates the
conventions child; `RCON` is the stable owner prefix.

## Project

### RCON-SC-PROJECT-01 — Normal case: Local conventions are known

React-owned requirements should be separated from project choices before source is named or moved. Inventing
a second export, filename, directory, import, or formatting convention fails the scenario.

#### Checklist

- [ ] RCON-CK-PROJECT-01-01 — Inspected neighboring source establishes each applicable source convention.
- [ ] RCON-CK-PROJECT-01-02 — Inspected configured tools establish each applicable tool-owned convention.
- [ ] RCON-CK-PROJECT-01-03 — Every fallback convention is used only where the project has no established choice.

## Structure

### RCON-SC-STRUCTURE-01 — Rule violation: A source name or definition site changes React meaning

React must be able to distinguish components, Hooks, host elements, and stable component identities. Invalid
casing, Hook naming, nested definitions, or mismatched imports and exports fail the scenario.

#### Checklist

- [ ] RCON-CK-STRUCTURE-01-01 — Every component name begins with a capital letter.
- [ ] RCON-CK-STRUCTURE-01-02 — Every custom Hook name begins with `use` followed by a capital letter.
- [ ] RCON-CK-STRUCTURE-01-03 — Every component definition is at module scope.
- [ ] RCON-CK-STRUCTURE-01-04 — Every custom Hook definition is at module scope.
- [ ] RCON-CK-STRUCTURE-01-05 — Each import form matches the corresponding named or default export.
- [ ] RCON-CK-STRUCTURE-01-06 — A unit-specific file remains with its owning unit until broader ownership is established.

## Performance

Not applicable: source naming, export, file placement, JSX, and formatting conventions have no independent
latency, throughput, resource, or measurement contract.

## Aesthetics

### RCON-SC-AESTHETICS-01 — Poor quality: Source organization impedes scanning

Names, files, and mechanical layout should help a reader locate and understand the primary React unit.
Anonymous exports, misleading files, crowding, or hand-format drift fails the scenario.

#### Checklist

- [ ] RCON-CK-AESTHETICS-01-01 — Every component has a meaningful function name.
- [ ] RCON-CK-AESTHETICS-01-02 — Every custom Hook has a meaningful function name.
- [ ] RCON-CK-AESTHETICS-01-03 — Each non-framework-owned file name reveals its primary unit under the project convention.
- [ ] RCON-CK-AESTHETICS-01-04 — Each file remains readable or is split at an established independent boundary.
- [ ] RCON-CK-AESTHETICS-01-05 — Configured formatter output owns mechanical layout.
- [ ] RCON-CK-AESTHETICS-01-06 — Configured tool output owns import order.

## Usage

### RCON-SC-USAGE-01 — Normal case: Runtime diagnostics retain useful identity

Component names should remain visible in stack traces and development tools. An anonymous or misleading
component identity fails the scenario.

#### Checklist

- [ ] RCON-CK-USAGE-01-01 — Runtime diagnostics expose a meaningful component name.
- [ ] RCON-CK-USAGE-01-02 — React development tools expose a meaningful component name.

## Consistency

### RCON-SC-CONSISTENCY-01 — Rule violation: JSX or project style drifts

JSX syntax and project-owned source conventions should remain consistent across the affected files. Invalid
tags, attribute spelling, or a new local style fails the scenario.

#### Checklist

- [ ] RCON-CK-CONSISTENCY-01-01 — Each JSX return has one root element or Fragment.
- [ ] RCON-CK-CONSISTENCY-01-02 — Every JSX tag is explicitly closed.
- [ ] RCON-CK-CONSISTENCY-01-03 — JSX uses React attribute names.
- [ ] RCON-CK-CONSISTENCY-01-04 — JSX preserves dashed `aria-*` attributes.
- [ ] RCON-CK-CONSISTENCY-01-05 — JSX preserves dashed `data-*` attributes.
- [ ] RCON-CK-CONSISTENCY-01-06 — Affected files follow the established export convention.
- [ ] RCON-CK-CONSISTENCY-01-07 — Affected files follow the established filename convention.
- [ ] RCON-CK-CONSISTENCY-01-08 — Affected files follow the established directory convention.
- [ ] RCON-CK-CONSISTENCY-01-09 — Affected files follow the established formatting convention.

## Risk

Not applicable: React convention changes carry structure, identity, and reviewability risks but introduce no
independent trust, privacy, safety, or destructive-action contract.

## Overall

### RCON-SC-OVERALL-01 — Adversarial: Cosmetic compliance changes behavior

A rename or reorganization can look stylistically consistent while resetting state, changing an import, or
moving a unit across its owner boundary. Any such semantic drift fails the scenario.

#### Checklist

- [ ] RCON-CK-OVERALL-01-01 — Naming changes preserve the accepted rendered behavior.
- [ ] RCON-CK-OVERALL-01-02 — Organization changes preserve the accepted rendered behavior.
- [ ] RCON-CK-OVERALL-01-03 — Convention changes preserve the accepted state identity.
- [ ] RCON-CK-OVERALL-01-04 — No convention claim is presented as React-owned when its authority is only the project or a configured tool.
