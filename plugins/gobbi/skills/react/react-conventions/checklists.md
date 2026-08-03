# React Conventions Checklist

Use this unchecked `react-conventions` source with general `evaluation` when the React root activates the
conventions child; `RCON` is the stable checklist prefix.

## Project

### RCON-SC-PROJECT-01 — Normal case: Local conventions are known

React requirements should be separated from project choices before source is named or moved. Inventing
a second export, filename, directory, import, or formatting convention fails the scenario.

#### Checklist

- [ ] RCON-CK-PROJECT-01-01 — Inspected neighboring source and configured tools establish every applicable project source convention and configured-tool rule.
- [ ] RCON-CK-PROJECT-01-02 — A file that intentionally groups related units may use the project-supported group filename instead of a primary-export filename.

### RCON-SC-PROJECT-02 — Expected failure: The project has no established convention

Inspection finds no local answer for an export, filename, directory, import, or formatting choice. The work
should fall back to the React convention for that one choice; turning the fallback into a new project-wide
rule fails the scenario.

#### Checklist

- [ ] RCON-CK-PROJECT-02-01 — Every fallback convention is used only where the project has no established choice.
- [ ] RCON-CK-PROJECT-02-02 — A fallback introduces no second project-wide convention.

## Structure

### RCON-SC-STRUCTURE-01 — Rule violation: A source name or definition site changes React meaning

React must be able to distinguish components, Hooks, host elements, and stable component identities. Invalid
casing, Hook naming, nested definitions, or mismatched imports and exports fail the scenario.

#### Checklist

- [ ] RCON-CK-STRUCTURE-01-01 — Every component name begins with a capital letter.
- [ ] RCON-CK-STRUCTURE-01-02 — Every custom Hook name begins with `use` followed by a capital letter.
- [ ] RCON-CK-STRUCTURE-01-03 — Every component and custom Hook definition is at module scope.
- [ ] RCON-CK-STRUCTURE-01-04 — Each import form matches the corresponding named or default export.

### RCON-SC-STRUCTURE-02 — Normal case: Related source remains together until a boundary justifies a split

Private support and small, tightly related components should stay with their owning unit while project
conventions permit it. Moving them early fails. Keeping them together once scanning cost or an independent
reuse or change boundary justifies a split also fails.

#### Checklist

- [ ] RCON-CK-STRUCTURE-02-01 — A unit’s private test, style, and narrow helper remain colocated with that unit while the project permits it.
- [ ] RCON-CK-STRUCTURE-02-02 — Small, tightly related components remain together until scanning cost or an independent reuse or change boundary justifies a split.

## Performance

Not applicable: source naming, export, file placement, JSX, and formatting conventions have no independent
latency, throughput, resource, or measurement requirement.

## Aesthetics

### RCON-SC-AESTHETICS-01 — Poor quality: Source organization impedes scanning

Names, files, and mechanical layout should help a reader locate and understand the primary React unit.
Anonymous exports, misleading file names, or hand-format drift fails the scenario.

#### Checklist

- [ ] RCON-CK-AESTHETICS-01-01 — Every component and custom Hook has a meaningful function name.
- [ ] RCON-CK-AESTHETICS-01-02 — Each file name not fixed by a framework reveals its primary unit under the project convention.
- [ ] RCON-CK-AESTHETICS-01-03 — Configured formatter and lint output determine mechanical layout and import order.
- [ ] RCON-CK-AESTHETICS-01-04 — Every component file has a meaningful name for its project or framework role, including a framework-fixed file.

### RCON-SC-AESTHETICS-02 — Edge case: A unit reaches its file boundary

A file grows, or a private unit gains a second consumer. The split or promotion should happen at an
established independent reuse or scanning boundary; moving earlier or later fails the scenario.

#### Checklist

- [ ] RCON-CK-AESTHETICS-02-01 — Each file remains readable or is split at an established independent boundary.
- [ ] RCON-CK-AESTHETICS-02-02 — A unit-specific file remains with its related unit until another consumer or project rule requires broader placement.

## Usage

### RCON-SC-USAGE-01 — Normal case: Runtime diagnostics retain useful identity

Component names should remain visible in stack traces and development tools. An anonymous or misleading
component identity fails the scenario.

#### Checklist

- [ ] RCON-CK-USAGE-01-01 — Runtime diagnostics and React development tools expose a meaningful component name.

## Consistency

### RCON-SC-CONSISTENCY-01 — Rule violation: JSX syntax is invalid

JSX has a fixed syntax and attribute vocabulary. An unclosed tag, multiple roots, a DOM attribute spelling, or
a lost dashed attribute fails the scenario.

#### Checklist

- [ ] RCON-CK-CONSISTENCY-01-01 — Each JSX return has one root element or Fragment.
- [ ] RCON-CK-CONSISTENCY-01-02 — Every JSX tag is explicitly closed.
- [ ] RCON-CK-CONSISTENCY-01-03 — JSX uses React attribute names.
- [ ] RCON-CK-CONSISTENCY-01-04 — JSX preserves dashed `aria-*` and `data-*` attributes.

### RCON-SC-CONSISTENCY-02 — Rule violation: Affected files drift from the project's conventions

The project's established export, filename, directory, and formatting choices govern the affected files. A new
local style beside them fails the scenario.

#### Checklist

- [ ] RCON-CK-CONSISTENCY-02-01 — Affected files follow the established project export, filename, directory, import, and formatting conventions.
- [ ] RCON-CK-CONSISTENCY-02-02 — No hand-maintained prose rule replaces configured formatter or lint output.

## Risk

Not applicable: React convention changes carry structure, identity, and reviewability risks but introduce no
independent trust, privacy, safety, or destructive-action requirement.

## Overall

### RCON-SC-OVERALL-01 — Adversarial: Cosmetic compliance changes behavior

A rename or reorganization can look stylistically consistent while resetting state, changing an import, or
moving a unit across its project-defined module boundary. Any such semantic drift fails the scenario.

#### Checklist

- [ ] RCON-CK-OVERALL-01-01 — Naming, organization, and convention changes preserve the accepted rendered behavior and state identity.
- [ ] RCON-CK-OVERALL-01-02 — No project or configured-tool convention is presented as a React requirement.
