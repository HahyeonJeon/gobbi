# Go Debugging Evaluation Checklist

Unchecked evaluation source for Go diagnosis governed by [Go Debugging](SKILL.md). Apply it to the exact work
and returned outcome under evaluation.

[Evaluation](../../evaluation/SKILL.md) owns evidence, filled results, findings, and verdicts. This source owns
only reusable scenarios and unchecked conditions.

A row is defined once beneath its owning scenario. An `Also applies` line points to a row defined elsewhere
in this source that the scenario reuses.

## Project

### GODBG-SC-PROJECT-01 — Normal case: Diagnosis mode and its complete effect contract are bound

The operation must select its sole diagnosis mode and classify every possible effect before execution.
Project source remains read-only, outputs and caches remain approved and bounded, downloads and network access
need separate authority, credentials and external mutation remain absent, and execution stays inside the exact
project reproducer command and named diagnostic tools.

#### Checklist

- [ ] GODBG-CK-PROJECT-01-01 — The operation selects exactly one diagnosis mode and selects no author, review, or change mode.
- [ ] GODBG-CK-PROJECT-01-02 — Every project source path remains read-only throughout diagnosis.
- [ ] GODBG-CK-PROJECT-01-03 — Every disposable diagnostic output has an approved path and a named retention or cleanup boundary.
- [ ] GODBG-CK-PROJECT-01-04 — Every cache write, download, project reproducer command or named-tool execution, and network request matches the bound diagnosis effect contract.
- [ ] GODBG-CK-PROJECT-01-05 — Credential use is recorded as none.
- [ ] GODBG-CK-PROJECT-01-06 — External mutation is recorded as none.

### GODBG-SC-PROJECT-02 — Expected failure: Required authority is unavailable

A download, network request, cache write, diagnostic output, project execution, or protected-data read lacks
the exact authority or safe bound it needs. Diagnosis should pause before the effect and return a recoverable
block; silent substitution or authority inherited from another operation fails.

#### Checklist

- [ ] GODBG-CK-PROJECT-02-01 — Diagnosis pauses before every unsafe or unbounded run, download, network request, source fix, unapproved diagnostic output, protected-data exposure, missing authority, or changed execution bound.
- [ ] GODBG-CK-PROJECT-02-02 — The authority block names the missing prerequisite, affected obligation, current evidence, risk, owner, retained safe project-source condition and approved diagnostic paths, first recovery action, and handoff.

### GODBG-SC-PROJECT-03 — Rule violation: Diagnosis mutates project source

The work edits project source while reproducing the failure or trying a possible repair. Diagnosis has no
project-source write path; even a plausible fix fails this operation boundary.

#### Checklist

- [ ] GODBG-CK-PROJECT-03-01 — The diagnosis performs no project-source create, update, or delete.

## Structure

### GODBG-SC-STRUCTURE-01 — Normal case: The original symptom and reproducer are exact

The result must remain bound to the report that initiated diagnosis. A changed input, consumer, process,
environment, Go version fact, package selector, or expected behavior creates a different claim and cannot
silently replace the original symptom.

#### Checklist

- [ ] GODBG-CK-STRUCTURE-01-01 — One named set records the original symptom; expected and observed behavior; applicable program exit path; environment; minimum supported Go version when relevant; selected Go toolchain version; module's Go language version when relevant; exact project reproducer command; exact package pattern; flags; `GOOS/GOARCH` target; inputs; duration or repetition bound; and affected consumer or process.
- [ ] GODBG-CK-STRUCTURE-01-02 — The first useful diagnostic records its source, collection conditions, authority, integrity limit, retention owner, and evidence limit.
- [ ] GODBG-CK-STRUCTURE-01-03 — The actual owned object names the affected package, project command, goroutine, process, input, consumer, or diagnostic output instead of a generic noun.

### GODBG-SC-STRUCTURE-02 — Normal case: Each sibling-owned concern reaches its owner

Diagnosis owns causal isolation, not every fact or action it consumes. The result should preserve singular
ownership for project commands, evidence strength, concurrency judgment, specialized concerns, and fixes.

#### Checklist

- [ ] GODBG-CK-STRUCTURE-02-01 — Project command syntax and effects, named-tool behavior, exact package-pattern semantics, selected Go toolchain version, and `GOOS/GOARCH` support route to `go-toolchain`.
- [ ] GODBG-CK-STRUCTURE-02-02 — Evidence design and strength route to `go-testing`, while ownership, lifetime, synchronization, deadlock, goroutine-leak, and race-safety judgment route to `go-concurrency`.
- [ ] GODBG-CK-STRUCTURE-02-03 — Trust or protected-data work routes to `go-security`, diagnostic-signal work routes to `go-observability`, performance diagnosis routes to `go-performance`, and every accepted source fix routes to `go-development` with each applicable specialist.

### GODBG-SC-STRUCTURE-03 — Poor quality: Headings hide a missing terminal branch

The source or returned outcome uses plausible headings but leaves non-reproduction or blocked behavior
undefined. Structural resemblance does not make the operation complete.

#### Checklist

- [ ] GODBG-CK-STRUCTURE-03-01 — Reproduced-root-cause, impossible-reproduction, and exact-block paths each reach an observable terminal record.

## Performance

### GODBG-SC-PERFORMANCE-01 — Normal case: Each diagnostic discriminates between causes

A diagnostic should answer one causal question with the smallest authorized resource and output cost. Broad
collection, repeated inconclusive runs, or a trace or profile without a distinguishing question does not
advance diagnosis.

#### Checklist

- [ ] GODBG-CK-PERFORMANCE-01-01 — Every selected diagnostic names the live causes it separates and the different result expected for each side.
- [ ] GODBG-CK-PERFORMANCE-01-02 — Every selected diagnostic has a prerequisite, owner, exact project command or named tool or observation, execution and output bound, and stop condition.
- [ ] GODBG-CK-PERFORMANCE-01-03 — Collection stops when the diagnostic falsifies its named cause, reaches its bound, or returns an inconclusive result whose evidence limit is recorded.

### GODBG-SC-PERFORMANCE-02 — Rule violation: A diagnostic is unsafe or unbounded

The proposed project reproducer command can consume unbounded time, memory, disk, processes, requests, fuzz
outputs, trace bytes, or profile bytes, or can expose protected data. Convenience does not authorize that
execution.

#### Checklist

- [ ] GODBG-CK-PERFORMANCE-02-01 — Every project reproducer command and named diagnostic-tool execution has explicit time, repetition, process, destination, and output bounds that cover its material risk.
- [ ] GODBG-CK-PERFORMANCE-02-02 — An unsafe or unbounded project reproducer command reaches the exact pause or block before execution.

## Aesthetics

### GODBG-SC-AESTHETICS-01 — Normal case: The causal account uses exact terms

The report should let a cold reader follow what happened and why. It distinguishes observations from causes
and reserves root cause for the earliest cause whose removal ends the failure.

#### Checklist

- [ ] GODBG-CK-AESTHETICS-01-01 — The causal account orders the original symptom, discriminating evidence, contributing condition when applicable, intermediate cause when applicable, and root cause when proven.
- [ ] GODBG-CK-AESTHETICS-01-02 — Every causal link names the observation or controlled comparison that supports it.
- [ ] GODBG-CK-AESTHETICS-01-03 — The named root cause is the earliest supported cause whose removal ends the failure.

### GODBG-SC-AESTHETICS-02 — Poor quality: The diagnosis uses vague substitutes

Vague nouns or action phrases conceal the affected object, owner, selector, command, or proof. The report must
use the accepted Go and operation vocabulary where the claim appears.

#### Checklist

- [ ] GODBG-CK-AESTHETICS-02-01 — Every package identity names the package name, import path, package directory or placement, package boundary, or public API or CLI that the claim means, while every command selector is labeled an exact package pattern.
- [ ] GODBG-CK-AESTHETICS-02-02 — Every owner, project command, `GOOS/GOARCH` target, affected consumer or process, diagnostic, causal classification, terminal state, and recovery action is named literally enough to answer without private context.

### GODBG-SC-AESTHETICS-03 — Adversarial: A polished terminal record lacks causal proof

The outcome has the expected sections and fluent wording but jumps from symptom to asserted root cause. A
cosmetic match must fail when no discriminating evidence proves the causal links.

#### Checklist

- [ ] GODBG-CK-AESTHETICS-03-01 — A reproduced-root-cause result contains causal proof rather than only compliant headings, terminology, or project command names.

## Usage

### GODBG-SC-USAGE-01 — Normal case: Reproduction ends in a proven root cause

The original symptom occurs under the exact bound environment, and the work proves the causal boundary without
editing source. The terminal record must preserve enough evidence and limits for the fix owner to resume.

#### Checklist

- [ ] GODBG-CK-USAGE-01-01 — The original symptom is reproduced with the exact project reproducer command, environment, inputs, affected consumer or process, and first useful diagnostic.
- [ ] GODBG-CK-USAGE-01-02 — The causal chain connects the reproduced symptom through discriminating evidence to every named cause.
- [ ] GODBG-CK-USAGE-01-03 — A safe controlled variation, repeated reproduction, contradictory-case comparison, or equally direct observation proves the root-cause boundary.
- [ ] GODBG-CK-USAGE-01-04 — Evidence limits exclude every unexecuted environment, input, exact package pattern, `GOOS/GOARCH` target, exit path, process, and consumer from the completion claim.
- [ ] GODBG-CK-USAGE-01-05 — Recovery and handoff retain the exact reproducer, first useful diagnostic, recovery owner, first recovery action, and fix-owner input without applying the fix.

### GODBG-SC-USAGE-02 — Edge case: Impossible reproduction returns a bounded diagnostic plan

The authorized attempts do not reproduce the original symptom. The operation should return a bounded next
step for every supported leading cause and must not present any leading cause as proven.

#### Checklist

- [ ] GODBG-CK-USAGE-02-01 — The non-reproduction result preserves every exact attempt and its mismatch from the original symptom without naming a root cause.
- [ ] GODBG-CK-USAGE-02-02 — Every listed leading cause is supported by a recorded observation.
- [ ] GODBG-CK-USAGE-02-03 — Exactly one discriminating diagnostic is assigned to each leading cause.
- [ ] GODBG-CK-USAGE-02-04 — Each planned diagnostic names its prerequisite, owner, exact project command or named tool or observation, expected distinguishing result, execution and output bound, and stop condition.
- [ ] GODBG-CK-USAGE-02-05 — The plan names the retained safe project-source condition, approved retained diagnostic paths, reproducer inputs, first useful diagnostic, recovery owner, first recovery action, and handoff.

### GODBG-SC-USAGE-03 — Expected failure: Diagnosis stops at an exact block

A required environment, input, consumer, process, project reproducer command, named tool, permission, safe
bound, output path, protected-data rule, or separate authority is absent. The operation must preserve the
bounded work and identify how its owner can resume.

#### Checklist

- [ ] GODBG-CK-USAGE-03-01 — The block names the missing prerequisite or first useful diagnostic.
- [ ] GODBG-CK-USAGE-03-02 — The block names the affected obligation, current evidence, and risk.
- [ ] GODBG-CK-USAGE-03-03 — The block names the owner, retained safe project-source condition and approved diagnostic paths, first recovery action, and handoff.
- [ ] GODBG-CK-USAGE-03-04 — The blocked path does not substitute another environment, consumer, process, input, project command, output path, or broader authority.

## Consistency

### GODBG-SC-CONSISTENCY-01 — Normal case: Command evidence uses the exact evidence fields

Every executed project command needs one repeatable evidence record. A command name or clean exit alone cannot
show which selection and environment the result supports.

#### Checklist

- [ ] GODBG-CK-CONSISTENCY-01-01 — Every command evidence record names the project command, exact package pattern, selected Go toolchain version, flags, `GOOS/GOARCH` target, inputs, duration, and result.

### GODBG-SC-CONSISTENCY-02 — Normal case: Every terminal branch returns the universal core

The universal fields let the next owner interpret success, interruption, or a block without prior conversation
context. Fields that do not apply need an exact reason rather than silent omission.

#### Checklist

- [ ] GODBG-CK-CONSISTENCY-02-01 — The record names the operation and mode, accepted result, decision basis, and actual owned object.
- [ ] GODBG-CK-CONSISTENCY-02-02 — The terminal state is exactly one of `success`, `error`, `cancellation`, `timeout`, `blocked`, or `user-decision pause`, and panic appears only as diagnosed program behavior.
- [ ] GODBG-CK-CONSISTENCY-02-03 — The record names changed or reviewed paths, external reads or effects, evidence limits, and a compatibility decision selected from `compatible`, `migration supplied`, `authorized break`, or `unsupported` when applicable.
- [ ] GODBG-CK-CONSISTENCY-02-04 — The record names block, recovery, and handoff fields, or gives an evidence-based not-applicable reason for each omitted field.

### GODBG-SC-CONSISTENCY-03 — Normal case: Recovery and handoff preserve the diagnosis

A downstream owner should receive the same failure identity and earliest useful evidence, not a paraphrased
request to repeat the work. The handoff also preserves every authority that is still absent.

#### Checklist

- [ ] GODBG-CK-CONSISTENCY-03-01 — The handoff preserves the original symptom, exact reproducer, environment, first useful diagnostic, evidence limits, retained safe project-source condition and approved diagnostic paths, recovery owner and action, next owner, and authority still required.

## Risk

### GODBG-SC-RISK-01 — Adversarial: A misleading diagnostic is rejected

The last log line, top stack frame, loudest metric, or most recent code change points at a plausible cause, but
a discriminating result contradicts it. Familiarity or prominence must not outweigh the contradiction.

#### Checklist

- [ ] GODBG-CK-RISK-01-01 — A compiler or vet diagnostic, error or panic value, stack trace, goroutine dump, race-detector report, execution trace, CPU profile, heap profile, block profile, mutex profile, core dump, log record, metric, or failing test or fuzz input is accepted only for the causal question its collection conditions and result support.

### GODBG-SC-RISK-02 — Adversarial: Correlation is presented as causation

The failure follows a timing shift, scheduling event, deployment, log record, metric movement, or retry, but no
controlled comparison proves the link. Sequence or co-occurrence alone must remain a correlation.

#### Checklist

- [ ] GODBG-CK-RISK-02-01 — Every correlation, contributing condition, intermediate cause, and root cause keeps its distinct causal classification.

### GODBG-SC-RISK-03 — Adversarial: A symptom patch is recommended as the cause

The proposed response catches the panic, retries, increases a timeout, adds buffering, suppresses a log, or
ignores an error while the proven cause remains. Hiding or reducing the symptom cannot close diagnosis.

#### Checklist

- [ ] GODBG-CK-RISK-03-01 — No symptom-level guard, retry, timeout increase, buffer increase, suppression, or ignored error is presented as root-cause proof or diagnostic completion.

### GODBG-SC-RISK-04 — Edge case: Deadlock and race symptoms route to their exact owners

A goroutine dump or race-detector report can reproduce a failure while leaving ownership and synchronization
judgment unresolved. Diagnosis should keep command execution, evidence strength, and concurrency design with
their separate owners.

#### Checklist

- [ ] GODBG-CK-RISK-04-01 — Deadlock, goroutine-leak, lifetime, ownership, synchronization, cancellation, shutdown, and race-safety judgment route to `go-concurrency`.
- [ ] GODBG-CK-RISK-04-02 — Race-detector or goroutine-dump project command behavior routes to `go-toolchain`, and its evidence-strength claim routes to `go-testing`.

## Overall

### GODBG-SC-OVERALL-01 — Normal case: The accepted diagnostic result is complete

The complete work must be recognizable as one of the operation's three result boundaries and preserve its
debugging-specific fields. Sibling checklists still apply for every sibling concern that entered the work.

#### Checklist

- [ ] GODBG-CK-OVERALL-01-01 — The terminal record contains the original symptom, exact reproducer, environment, first useful diagnostic, causal chain, root cause or leading causes, distinguishing diagnostic plan when applicable, and exactly one reproduced-root-cause, bounded-plan, or exact-block result.

### GODBG-SC-OVERALL-02 — Expected failure: A non-result is called success

The work returns a clean unrelated project command, successful retry, unproven candidate, partial terminal
record, or request for later work as a completed diagnosis. No amount of otherwise correct detail can convert
missing causal proof, a missing bounded plan, or a missing exact block into success.

#### Checklist

- [ ] GODBG-CK-OVERALL-02-01 — No clean unrelated project command, successful retry, unsupported inference, partial terminal record, missing branch, or deferred causal question is reported as completion.
