# TypeScript Installed Package Command Evaluation Checklist

This reusable unchecked source evaluates commands supplied through one TypeScript package archive. It is
governed by the [`typescript`](../SKILL.md) domain and
[`typescript-packaging`](SKILL.md) operation. The sibling [package checklist](checklists.md) evaluates the
rest of the package definition, consumers, and publication. The source commit that contains this file
identifies the checklist version. Its stable checklist prefix is `TSPKGCMD`.

This file defines coverage only. The parent [Evaluation](../../evaluation/SKILL.md) operation selects and
resolves applicable rows, records evidence and findings, and derives the verdict. Preserve every row as an
unchecked binary condition in this source.

## Project

### TSPKGCMD-SC-PROJECT-01 — Normal case: installed-command requirements are recorded before packing

A package command cannot be verified until its name, built file, runtime, and process behavior are known. The
expected outcome records those requirements before the archive is built. Deriving them from whatever the
archive happens to contain is the failure.

#### Checklist

- [ ] TSPKGCMD-CK-PROJECT-01-01 — Every package command records its `bin` name, built entry file, and named runtime before the archive is built.
- [ ] TSPKGCMD-CK-PROJECT-01-02 — Required arguments, standard streams, exit status, signals, and failure text are recorded before the archive is built.

## Structure

### TSPKGCMD-SC-STRUCTURE-01 — Normal case: each command is executable inside the archive

An archive can contain a command whose `bin` path is missing, whose shebang was removed, or whose executable
permission was lost. The expected outcome proves each structural requirement on the archived file. A source
entry or pre-pack build output cannot stand in for it.

#### Checklist

- [ ] TSPKGCMD-CK-STRUCTURE-01-01 — Every package-defined command name maps through `bin` to an existing built file inside the package archive.
- [ ] TSPKGCMD-CK-STRUCTURE-01-02 — Every archived command file begins with the shebang required by its named runtime.
- [ ] TSPKGCMD-CK-STRUCTURE-01-03 — Every archived command file has executable permission on each supported operating system that requires it.

## Performance

Not applicable: package-command performance requirements come from the supplied command specification. This
source verifies archive wiring and installed process behavior and introduces no separate latency, throughput,
capacity, or recurring-cost requirement.

## Aesthetics

Not applicable: command names, help text, and error language come from the supplied command specification.
This source verifies that the archive installs and invokes that specified interface without defining its
presentation.

## Usage

### TSPKGCMD-SC-USAGE-01 — Normal case: the archive's installed command runs as a consumer invokes it

An archive can install successfully while its command name resolves elsewhere or its process behavior fails.
The expected outcome installs the archive in isolation, proves which executable the name selects, invokes that
consumer entry, and checks the supplied process requirements.

#### Checklist

- [ ] TSPKGCMD-CK-USAGE-01-01 — The package archive is installed in an isolated consumer environment.
- [ ] TSPKGCMD-CK-USAGE-01-02 — Every installed command name resolves to the executable link or file created by that archive installation.
- [ ] TSPKGCMD-CK-USAGE-01-03 — Every package command is invoked through its installed consumer entry.
- [ ] TSPKGCMD-CK-USAGE-01-04 — Required arguments, standard input, standard output, standard error, exit status, signals, and failure text are verified for the applicable success and failure cases.

## Consistency

### TSPKGCMD-SC-CONSISTENCY-01 — Normal case: metadata, archive, and installed link name the same command

The `bin` field, archived built file, and installed executable link are three representations of one command.
The expected outcome traces the same command through all three. A link that reaches another file is the
failure even when that file happens to behave correctly.

#### Checklist

- [ ] TSPKGCMD-CK-CONSISTENCY-01-01 — Each `bin` mapping, archived built file, and installed executable link trace to the same package command.

## Risk

### TSPKGCMD-SC-RISK-01 — Adversarial: an unrelated command on `PATH` produces a false pass

A global, cached, or workspace executable can share the package command's name and satisfy the process checks.
The expected outcome excludes that executable as the process under test. Accepting the same name as executable
identity is the failure.

#### Checklist

- [ ] TSPKGCMD-CK-RISK-01-01 — No global, cached, workspace, or other same-name executable on `PATH` is accepted as the command installed from the archive.

## Overall

### TSPKGCMD-SC-OVERALL-01 — Normal case: every command result belongs to the proposed archive

Command checks can be collected from different installations during a long release run. The expected outcome
binds structural and process results to the exact archive proposed for publication. A result from another
archive or source checkout is the failure.

#### Checklist

- [ ] TSPKGCMD-CK-OVERALL-01-01 — Every command result is bound to the exact package archive digest or contents proposed for publication.
- [ ] TSPKGCMD-CK-OVERALL-01-02 — Every recorded installed-command requirement has a result from that archive installation.
