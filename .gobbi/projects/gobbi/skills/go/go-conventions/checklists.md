# Go Conventions Evaluation Checklist

Unchecked evaluation source for Go work governed by [Go Conventions](SKILL.md). Apply it to the exact work and
returned outcomes under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
that this scenario reuses.

## Project

### GOCNV-SC-PROJECT-01 — Normal case: Project conventions govern the change

The repository already defines written names, source file layout, formatting, or generated source practices.
The work should follow that local contract and use Go defaults only where the project is silent; a mismatch
fails this scenario.

#### Checklist

- [ ] GOCNV-CK-PROJECT-01-01 — Every applicable repository convention is preserved.
- [ ] GOCNV-CK-PROJECT-01-02 — Each Go default fills a genuine gap in the repository convention.

### GOCNV-SC-PROJECT-02 — Rule violation: A local edit invents a project-wide convention

One change introduces a new written name, source file layout, or formatting policy without project authority.
The work should retain the accepted convention or expose the broader decision; silently establishing a new
pattern fails.

#### Checklist

- [ ] GOCNV-CK-PROJECT-02-01 — No task-local choice silently establishes a repository-wide convention.
- [ ] GOCNV-CK-PROJECT-02-02 — Every material convention departure has the required project authority.

## Structure

### GOCNV-SC-STRUCTURE-01 — Poor quality: A source file hides responsibility

The code functions, but unrelated declarations in one source file obscure its responsibility. The file should
group declarations that change for the same reason; a merely compiling layout fails.

#### Checklist

- [ ] GOCNV-CK-STRUCTURE-01-02 — Every file groups declarations that change for the same reason.

### GOCNV-SC-STRUCTURE-02 — Edge case: Written names collide or fail on a supported target

A written package clause, import name, identifier, or source file name collides in context or is invalid under
the applicable language or file system contract. The accepted spelling should remain valid and unambiguous on
every project target; hidden target failure fails.

#### Checklist

- [ ] GOCNV-CK-STRUCTURE-02-02 — Every in-scope name collision is resolved explicitly.
- [ ] GOCNV-CK-STRUCTURE-02-03 — Every Go identifier, written package clause, and import name is valid under the module's Go language version.
- [ ] GOCNV-CK-STRUCTURE-02-04 — Every source file name is valid on each project target file system.

### GOCNV-SC-STRUCTURE-03 — Rule violation: Written form crosses a design, construction, or tool boundary

A conventions review chooses a package design identity, directs general construction, interprets an exact
package pattern, or defines an exact formatter command, its effects, or its returned diagnostic. Written form
work should preserve the accepted package design, leave general construction with `go-development`, and leave
package pattern semantics plus exact formatter command behavior, effects, and returned diagnostics with
`go-toolchain`; owner drift or an ambiguous identity fails.

#### Checklist

- [ ] GOCNV-CK-STRUCTURE-03-01 — Every package name, import path, package directory or placement, package boundary, public API or CLI, type, and error contract affected by written form work matches the accepted design decision.
- [ ] GOCNV-CK-STRUCTURE-03-02 — Every exact package pattern named alongside written form work appears only in project command selection or evidence.
- [ ] GOCNV-CK-STRUCTURE-03-03 — No written form claim defines exact package pattern semantics.
- [ ] GOCNV-CK-STRUCTURE-03-04 — Every general Go construction decision named alongside written form work remains governed by `go-development`.
- [ ] GOCNV-CK-STRUCTURE-03-05 — Every exact formatter command named alongside written form work, together with its effects and returned diagnostic, remains governed by `go-toolchain`.

## Performance

Not applicable: this checklist governs written Go form rather than runtime or build efficiency. Runtime and
build performance belong to `go-performance` and other applicable sibling checklists.

## Aesthetics

### GOCNV-SC-AESTHETICS-01 — Normal case: Canonical formatting is the mechanical authority

Valid Go source is ready for review. Its layout should match the project formatter without hand alignment or a
private line-length scheme; formatter drift fails this scenario.

#### Checklist

- [ ] GOCNV-CK-AESTHETICS-01-01 — Every in-scope Go source file is in canonical project format with no retained hand alignment the formatter removes.

### GOCNV-SC-AESTHETICS-02 — Poor quality: Names make readers recover intent from implementation

The code works, but generic, redundant, or type-encoded names force readers to inspect bodies or callers.
Names should reveal their role at their scope; technically valid but opaque naming fails.

#### Checklist

- [ ] GOCNV-CK-AESTHETICS-02-01 — Every local name carries enough meaning for its scope.
- [ ] GOCNV-CK-AESTHETICS-02-02 — No accessor uses a redundant `Get` prefix without domain meaning.
- Also applies: GOCNV-CK-USAGE-01-01 (exported names read clearly with their package name).

### GOCNV-SC-AESTHETICS-03 — Edge case: Initialisms and proper names need exceptional spelling

An identifier or error begins with an initialism, protocol term, or proper name. The spelling should preserve
the established term without breaking the surrounding convention; inconsistent exceptional casing fails.

#### Checklist

- [ ] GOCNV-CK-AESTHETICS-03-01 — Every established initialism has one consistent spelling in related names.
- [ ] GOCNV-CK-AESTHETICS-03-02 — Every capitalized error text exception is justified by its literal content.

### GOCNV-SC-AESTHETICS-04 — Normal case: Error text composes with caller context

An error string may be wrapped or prefixed by a caller. Ordinary text should start lowercase and omit trailing
punctuation so added context remains readable; an unjustified exception fails.

#### Checklist

- [ ] GOCNV-CK-AESTHETICS-04-01 — Every ordinary error string starts with a lowercase letter.
- [ ] GOCNV-CK-AESTHETICS-04-02 — Every ordinary error string omits trailing punctuation.

### GOCNV-SC-AESTHETICS-05 — Normal case: An accepted package name uses project-appropriate Go form

The package design has selected the package name, and conventions now judge its written form. The Go defaults
should remain concise, lowercase, a single word, and clear, while an accepted project, protocol, established
abbreviation, or generated source exception may justify a different form; an unexplained departure fails.

#### Checklist

- [ ] GOCNV-CK-AESTHETICS-05-01 — Every package name departure from lowercase letters has an explicit project, protocol, established abbreviation, or generated source justification.
- [ ] GOCNV-CK-AESTHETICS-05-02 — Every package name departure from a single word has an explicit project, protocol, established abbreviation, or generated source justification.
- [ ] GOCNV-CK-AESTHETICS-05-03 — Every underscore in a package name has an explicit project, protocol, established abbreviation, or generated source justification.
- [ ] GOCNV-CK-AESTHETICS-05-04 — Every package name word not needed to identify its accepted responsibility has an explicit project, protocol, established abbreviation, or generated source justification.
- [ ] GOCNV-CK-AESTHETICS-05-05 — Every generic package name spelling has an established project or generated source contract, or evidence that no more specific word fits the accepted package responsibility.

## Usage

### GOCNV-SC-USAGE-01 — Normal case: Package-qualified names serve callers

A caller reads or writes the public API through its import name. Package and exported names should form a
concise phrase without repeating the same concept; redundant or misleading qualification fails.

#### Checklist

- [ ] GOCNV-CK-USAGE-01-01 — Every exported name is clear when read with its package name.
- [ ] GOCNV-CK-USAGE-01-02 — No exported name repeats context already supplied by the package.

### GOCNV-SC-USAGE-02 — Poor quality: Documentation does not support the caller

The declaration has a comment, but it omits purpose, errors, ownership, or concurrency that affects use. The
caller should understand the contract without reading the implementation; decorative documentation fails.

#### Checklist

- [ ] GOCNV-CK-USAGE-02-01 — Every package comment and exported declaration comment names its subject.
- [ ] GOCNV-CK-USAGE-02-02 — Every package comment and exported declaration comment states its purpose.
- [ ] GOCNV-CK-USAGE-02-03 — Every caller-relevant behavioral condition appears in public documentation.

### GOCNV-SC-USAGE-03 — Adversarial: A conformant name misleads the caller

A declaration is renamed or written to satisfy a naming rule while the resulting name understates what the
declaration does, such as an accessor-shaped name for work that performs I/O, mutation, or blocking. The name
should describe the observable behavior the caller actually gets; a rule-conformant name that hides an effect
fails.

#### Checklist

- [ ] GOCNV-CK-USAGE-03-01 — No name that satisfies a convention rule understates its I/O, mutation, blocking, or failure behavior.
- [ ] GOCNV-CK-USAGE-03-02 — Every renamed declaration still describes the result the caller receives.

## Consistency

### GOCNV-SC-CONSISTENCY-01 — Rule violation: Generated-source ownership is unclear

A generated file is added or changed. Its marker and ownership path should identify the generator contract;
output that looks hand-authored or cannot be reproduced fails.

#### Checklist

- [ ] GOCNV-CK-CONSISTENCY-01-01 — Every generated Go file carries its required generated source marker.
- [ ] GOCNV-CK-CONSISTENCY-01-03 — Every generated change corresponds to one owned input.
- [ ] GOCNV-CK-CONSISTENCY-01-04 — Every generated change corresponds to the declared generator.

### GOCNV-SC-CONSISTENCY-02 — Rule violation: Documentation contradicts current behavior

A declaration, error contract, or compatibility promise changed while its prose remained. Documentation must
describe the exact current behavior; stale or partially updated prose fails.

#### Checklist

- [ ] GOCNV-CK-CONSISTENCY-02-01 — Every changed public declaration, documented error condition, and retained comment describes the current implementation contract.

### GOCNV-SC-CONSISTENCY-03 — Poor quality: Imports use decorative aliases or unstable groups

Imports resolve, but arbitrary aliases or grouping make the file differ from its formatter and neighbors.
Import form should reflect real collisions or clarification needs; decorative variation fails.

#### Checklist

- [ ] GOCNV-CK-CONSISTENCY-03-01 — Every import alias resolves a collision or a misleading package name.
- [ ] GOCNV-CK-CONSISTENCY-03-02 — Import grouping matches the project import tool or formatter.

### GOCNV-SC-CONSISTENCY-04 — Normal case: Related names follow one convention

Methods and related declarations use receivers, initialisms, and local vocabulary repeatedly. Their spelling
should remain stable across the affected set; unexplained variation fails.

#### Checklist

- [ ] GOCNV-CK-CONSISTENCY-04-02 — One receiver name is used throughout the affected method set.
- [ ] GOCNV-CK-CONSISTENCY-04-03 — One term for each concept is used throughout the affected declarations.

## Risk

### GOCNV-SC-RISK-01 — Adversarial: Imports conceal executable side effects

A blank or dot import makes code appear simpler while hiding registration, initialization, or symbol origin.
The package-level reason should be deliberate and reviewable; concealed behavior fails.

#### Checklist

- [ ] GOCNV-CK-RISK-01-01 — Every blank import has a deliberate package-level side-effect contract.
- [ ] GOCNV-CK-RISK-01-02 — Every dot import has a narrow clarity benefit that preserves symbol provenance.

### GOCNV-SC-RISK-02 — Adversarial: Generated output is edited to fake a fix

A direct edit makes generated code appear correct without changing its owner. The durable source and
regenerated result should carry the fix; an unreproducible cosmetic repair fails.

#### Checklist

- [ ] GOCNV-CK-RISK-02-01 — No generated output substitutes for a required owned source change.
- [ ] GOCNV-CK-RISK-02-02 — Regeneration would preserve every accepted generated source correction.

### GOCNV-SC-RISK-03 — Expected failure: Invalid source cannot be canonically formatted

Incomplete or invalid Go prevents the canonical formatter from accepting a file. The work should expose the
failure instead of claiming formatted output; a false formatting claim fails.

#### Checklist

- [ ] GOCNV-CK-RISK-03-01 — Invalid Go source is not represented as canonically formatted.
- [ ] GOCNV-CK-RISK-03-02 — The formatting blocker for invalid Go source remains visible in the returned outcome.

### GOCNV-SC-RISK-04 — Normal case: A convention change leaves behavior alone

An ordinary naming, formatting, comment, or import change touches many files at once. Its success path should
leave observable behavior unchanged so reviewers can trust the size of the diff; a behavioral edit carried
inside a form-only change fails.

#### Checklist

- [ ] GOCNV-CK-RISK-04-01 — Every convention-only change leaves observable behavior unchanged.
- [ ] GOCNV-CK-RISK-04-02 — Every behavioral change made alongside a convention change is separately identified.

## Overall

### GOCNV-SC-OVERALL-01 — Normal case: Written form belongs in the project

The complete change should look authored under one project convention while remaining idiomatic Go. A cold
reader should find clear names, current documentation, canonical layout, and explicit generated ownership.

#### Checklist

- [ ] GOCNV-CK-OVERALL-01-01 — The complete written form is coherent with the repository.
- [ ] GOCNV-CK-OVERALL-01-02 — The complete written form is understandable without private author context.

### GOCNV-SC-OVERALL-02 — Adversarial: Cosmetic formatting masks semantic convention defects

The source passes `gofmt`, but names, docs, imports, or generated ownership still mislead consumers. Mechanical
conformance must not be mistaken for complete convention quality; a formatter-only pass fails.

#### Checklist

- [ ] GOCNV-CK-OVERALL-02-01 — Canonical formatting is not the sole basis for accepting convention quality.
- [ ] GOCNV-CK-OVERALL-02-02 — Every non-mechanical convention obligation remains satisfied after formatting.
