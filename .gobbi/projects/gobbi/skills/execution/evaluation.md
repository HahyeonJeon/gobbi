# Execution Evaluation Entry

Use this entrypoint with [evaluation/SKILL.md](../evaluation/SKILL.md). It supplies task-specific lenses for the one complete report. Language and framework evaluation companions may add cases and checks but cannot replace this frame or the central schema.

## Required inputs

- locked plan task, canonical upstream artifacts, and approved dispositions;
- both Execution drafts and reciprocal reviews plus resolved decisions;
- actual committed diff, final tree, task result, commit, and fresh verification output;
- applicable rules, mistakes, language and tool standards;
- [scenarios.md](scenarios.md) and [checklists.md](checklists.md); and
- dual-work package validation and exact subject digest.

## Perspective lenses

### Project

Compare task outputs, scope, files, traces, report, diff, and commit. Re-run exact verifies commands on the final tree. Detect partial completion, unrelated work, substituted checks, and a commit message that does not match the change.

### Structure

Inspect project-pattern fit, ownership, interfaces, coupling, callers, tests, types, schemas, validators, manifests, dependencies, config, build wiring, and dead or premature abstractions. Add language-specific checks from loaded skills.

### Performance

Measure applicable hot paths, external-call count, batching, cache, retries, timeouts, memory, storage, logging volume, and recurring cost. Distinguish variance from regression with enough evidence.

### Aesthetics

Inspect names, comments, formatting, placeholders, debug leftovers, generated churn, and whether logic is hidden inside reformatting. Convention defects and misleading names are evidence-bearing issues.

### Usage

Read changed surfaces as caller, user, operator, maintainer, and debugger. Inspect signatures, parameters, side effects, errors, remediation, logs, docs, accessibility, locale, and examples.

### Consistency

Search old names and paths. Compare code, tests, types, docs, examples, schemas, validators, manifests, migrations, runtime references, and commit text. A green suite does not excuse stale documentation.

### Risk

Inspect blast radius, authorization order, untrusted input, shell construction, secrets, sensitive logs, dependency and license risk, destructive work, migration rollback, concurrency, shared state, compatibility, and deployment behavior.

### Overall

Challenge mocked assumptions that differ from reality, unneeded abstraction or configuration, work from another task, verification tied to diff shape instead of behavior, and checks weakened by the same commit. Preserve robust regression tests, simpler structures, and direct verification.

## Recommended verification

Use safe read-only commands against the final tree: git show and diff, exact task checks, targeted tests, type and compile checks, lint/format checks that do not rewrite, caller and stale-name searches, schemas and validators, link checks, dependency metadata, benchmarks, and status. Record any command that would mutate and use a safe equivalent or inspected evidence.

## Rule crosswalk

| Parent rules | Primary report coverage |
|---|---|
| X-1, X-4, X-10 | Project, Consistency |
| X-2, X-7 | Risk |
| X-3, X-5, X-6 | Structure, Usage, Consistency |
| X-8 | All perspectives and checklist evidence |
| X-9 | Project, Risk, Overall |

Every applicable EXEC-CK item appears in the report checklist. Any material correction creates a new subject digest and receives a complete fresh review.
