# Execution Loop — Evaluation Checklist

> **Copy-then-tick — this file is the source; the evaluator copies it.** At Stage 0 the evaluator COPIES this file to `sessions/{date}-{session-id}/3-execution/task-{NN}-{slug}/evaluation/iter{n}/{system}/checklist.md`. The filled copy is a real **9th evaluation-output file**, alongside the seven per-perspective files + `overall.md`. The source here ships with every box UNCHECKED.
>
> **A ticked box = VERIFIED, not "done".** `- [x]` means the evaluator VERIFIED the check against the change-set with the strongest verification the check admits (run a tool / read the diff / `grep` / read the call site) — never that work merely happened.
>
> **Fill procedure.** Stage 0: copy (boxes unchecked). Stage 1: append a `## Stage 1 Additions` section for any scenario or check the Frame added that is not seeded here. Stage 2: tick each box `[x]` and annotate its outcome — `PASS:` (verified satisfied), `FAIL: {finding-id}` (verified violated, cite the finding), or `n/a: {reason}` (not applicable to this change-set). The completeness gate requires every box resolved to exactly one of the three.
>
> **Legend.** `- [ ]` unresolved · `- [x] … PASS:` verified satisfied · `- [x] … FAIL: {finding-id}` verified violated · `- [x] … n/a: {reason}` not applicable. Record per-perspective counts (PASS / FAIL / n/a / total) in the filled copy's compact per-scenario results table.

The scenario families, their lenses, and the adversarial cases these checks discriminate live in the sibling `scenario.md`; the evaluation procedure lives in `evaluation.md`. The heading tree below is 1:1 with `scenario.md`.

---

## Project

### EXE-PROJ-SCENARIO-01 — Task scope fidelity
- [ ] EXE-PROJ-SCENARIO-01-CHECK-01 — Each `outputs:` entry the task promised has a concrete diff artifact in the final change-set.
- [ ] EXE-PROJ-SCENARIO-01-CHECK-02 — `git diff --name-only` touches only files in the task's `files:` set, a subset of it, or files the task spec explicitly allows.
- [ ] EXE-PROJ-SCENARIO-01-CHECK-03 — Every changed file and behavior maps to a task output; unrelated "while I was in there" cleanup is absent, reverted, or filed as a separate task.
- [ ] EXE-PROJ-SCENARIO-01-CHECK-04 — The commit / PR names the task ID or title, and the message matches the actual diff (no understatement or overstatement).

### EXE-PROJ-SCENARIO-02 — Verification actually run
- [ ] EXE-PROJ-SCENARIO-02-CHECK-01 — The exact `verifies:` command from the task was run on the final tree, not an earlier tree or a substituted command.
- [ ] EXE-PROJ-SCENARIO-02-CHECK-02 — The command completed cleanly and the executor captured the command output as fresh evidence.
- [ ] EXE-PROJ-SCENARIO-02-CHECK-03 — The pass did not require uncommitted file modification or post-run cleanup to appear green.
- [ ] EXE-PROJ-SCENARIO-02-CHECK-04 — The `verifies:` command, threshold, fixture, or test assertion was not loosened or deleted in the same change-set unless the task explicitly authorized it.

### EXE-PROJ-SCENARIO-03 — Upstream contracts left intact
- [ ] EXE-PROJ-SCENARIO-03-CHECK-01 — Every `inputs:` interface the task consumes is identified and checked against the task spec.
- [ ] EXE-PROJ-SCENARIO-03-CHECK-02 — Input-side signatures, return shapes, defaults, and documented behavior remain unchanged unless the task explicitly authorizes the change.
- [ ] EXE-PROJ-SCENARIO-03-CHECK-03 — No input-side code was refactored, renamed, or tidied incidentally.
- [ ] EXE-PROJ-SCENARIO-03-CHECK-04 — No caller outside the task's scope sees changed behavior from an undeclared upstream-contract change.

---

## Structure

### EXE-STRUCT-SCENARIO-01 — Design-conformant structure
- [ ] EXE-STRUCT-SCENARIO-01-CHECK-01 — New code follows the named library / pattern / API shape from Ideation, or any deviation from the directional design is explicitly justified in the commit / PR.
- [ ] EXE-STRUCT-SCENARIO-01-CHECK-02 — No novel pattern is introduced where an existing project pattern fits; new functions follow project naming and signature conventions.
- [ ] EXE-STRUCT-SCENARIO-01-CHECK-03 — Removed code is deleted (not commented out); no dead code or commented-out blocks remain in the diff.
- [ ] EXE-STRUCT-SCENARIO-01-CHECK-04 — Errors are thrown / returned in the same shape as adjacent code (no new error-handling pattern introduced silently).
- [ ] EXE-STRUCT-SCENARIO-01-CHECK-05 — No `any` / `@ts-ignore` / equivalent escape hatch is inserted without task-scoped justification.
- [ ] EXE-STRUCT-SCENARIO-01-CHECK-06 — Every new export has a caller or is a declared public-API addition, and any newly extracted helper has more than one caller (no premature abstraction).

### EXE-STRUCT-SCENARIO-02 — Coupling stays acyclic
- [ ] EXE-STRUCT-SCENARIO-02-CHECK-01 — A `grep` for circular-import patterns returns no new hits.
- [ ] EXE-STRUCT-SCENARIO-02-CHECK-02 — The module-dependency graph remains a DAG (coupling direction and layer boundaries preserved).
- [ ] EXE-STRUCT-SCENARIO-02-CHECK-03 — No new import edge creates a dependency the project treats as upstream, private, or forbidden.
- [ ] EXE-STRUCT-SCENARIO-02-CHECK-04 — Shared-code extraction introduces no hidden cycle between modules that were previously acyclic.

### EXE-STRUCT-SCENARIO-03 — Tests and type gates hold
- [ ] EXE-STRUCT-SCENARIO-03-CHECK-01 — Tests are added for new behavior and modified for changed behavior; removed behavior has no orphan test.
- [ ] EXE-STRUCT-SCENARIO-03-CHECK-02 — New or modified tests are not `test.skip` / pending / quarantined — they actually run.
- [ ] EXE-STRUCT-SCENARIO-03-CHECK-03 — New tests do not share mutable global state, have explicit setup / teardown, and do not depend on execution order.
- [ ] EXE-STRUCT-SCENARIO-03-CHECK-04 — Time / random / network / database / external-service dependencies are mocked, seeded, or pinned.
- [ ] EXE-STRUCT-SCENARIO-03-CHECK-05 — The type-check / compile gate passes on every modified file with no unresolved type errors.

### EXE-STRUCT-SCENARIO-04 — Dependency and config surface controlled
- [ ] EXE-STRUCT-SCENARIO-04-CHECK-01 — Every new dependency is justified and declared in `package.json` and the lockfile (no implicit install).
- [ ] EXE-STRUCT-SCENARIO-04-CHECK-02 — Each new dep has a license matching project policy, no known critical CVEs, and a recognized publisher / registry source.
- [ ] EXE-STRUCT-SCENARIO-04-CHECK-03 — Dependency names and lockfile changes are checked for typo-squat, fork-of-fork, or unexplained transitive trust-surface expansion.
- [ ] EXE-STRUCT-SCENARIO-04-CHECK-04 — New env vars and config-schema changes are documented, with migration notes for existing config where needed.
- [ ] EXE-STRUCT-SCENARIO-04-CHECK-05 — New config defaults are production-safe (no production-impacting default left implicit), and no secret / credential / local-config path is committed (`.gitignore` covers new local-config files).
- [ ] EXE-STRUCT-SCENARIO-04-CHECK-06 — CI / build config changes (workflow files, lockfile updates) are explicit and explained.

---

## Performance

### EXE-PERF-SCENARIO-01 — Benchmark and hot-path evidence
- [ ] EXE-PERF-SCENARIO-01-CHECK-01 — The relevant benchmark, measurement, or performance test was run on the final tree.
- [ ] EXE-PERF-SCENARIO-01-CHECK-02 — Benchmark results are within expected variance, or the observed delta is explained with evidence.
- [ ] EXE-PERF-SCENARIO-01-CHECK-03 — Ideation-flagged hot paths include actual numbers, not only reasoning about expected speed.
- [ ] EXE-PERF-SCENARIO-01-CHECK-04 — Any claimed variance or "noise" is supported by enough reruns to distinguish it from a consistent slowdown.

### EXE-PERF-SCENARIO-02 — IO, batching, and N+1 control
- [ ] EXE-PERF-SCENARIO-02-CHECK-01 — New or changed network / database / disk IO / retry / batching paths have explicit timeout, retry, and batch-size decisions (or a documented justification for defaults).
- [ ] EXE-PERF-SCENARIO-02-CHECK-02 — Cache / memoization behavior matches the Planning commitment and does not rely on unsafe implicit defaults.
- [ ] EXE-PERF-SCENARIO-02-CHECK-03 — Loops over scalable input perform no per-item external (DB / network / disk) call without a batch boundary.
- [ ] EXE-PERF-SCENARIO-02-CHECK-04 — DB / network / disk call counts are profiled or otherwise checked where production-sized input can scale the path.

### EXE-PERF-SCENARIO-03 — Cost and observability budget
- [ ] EXE-PERF-SCENARIO-03-CHECK-01 — The token / API / paid-service / infra cost delta vs prior is estimated.
- [ ] EXE-PERF-SCENARIO-03-CHECK-02 — Paid or high-volume operations have a cost ceiling, rate-limit guard, or kill switch for runaway cases.
- [ ] EXE-PERF-SCENARIO-03-CHECK-03 — New / changed code paths keep logs, metrics, and alerts at the project's standard diagnostic level.
- [ ] EXE-PERF-SCENARIO-03-CHECK-04 — Error paths include diagnostic log context, and hot paths emit relevant timing or counter signals where applicable.
- [ ] EXE-PERF-SCENARIO-03-CHECK-05 — Retry and logging behavior cannot create unbounded spend, high-cardinality alert noise, or telemetry loss during an outage.

---

## Aesthetics

### EXE-AESTH-SCENARIO-01 — Names and comments preserve meaning
- [ ] EXE-AESTH-SCENARIO-01-CHECK-01 — Variable / function / class / file names follow project casing and naming conventions.
- [ ] EXE-AESTH-SCENARIO-01-CHECK-02 — Names still describe the current behavior after the change; no old semantic label remains after a behavior shift.
- [ ] EXE-AESTH-SCENARIO-01-CHECK-03 — Comments explain non-obvious reasons or constraints instead of narrating obvious code.
- [ ] EXE-AESTH-SCENARIO-01-CHECK-04 — Comments made stale or false by the change are updated or removed.

### EXE-AESTH-SCENARIO-02 — Mechanical polish and leftover artifacts
- [ ] EXE-AESTH-SCENARIO-02-CHECK-01 — Lint and format runners pass on every modified file.
- [ ] EXE-AESTH-SCENARIO-02-CHECK-02 — Formatter drift or mechanical style disagreement is absent from the final diff.
- [ ] EXE-AESTH-SCENARIO-02-CHECK-03 — Debug prints, tracing leftovers, and temporary logging are absent from non-test code, including rare failure paths.
- [ ] EXE-AESTH-SCENARIO-02-CHECK-04 — Commented-out code blocks, shorthand "removed" comments, and stray TODO / FIXME markers are absent unless the task explicitly requires them.

### EXE-AESTH-SCENARIO-03 — Reviewable diff shape
- [ ] EXE-AESTH-SCENARIO-03-CHECK-01 — Pure-formatting or reflow churn is isolated from behavior changes.
- [ ] EXE-AESTH-SCENARIO-03-CHECK-02 — Reviewers can identify which changed lines alter runtime behavior.
- [ ] EXE-AESTH-SCENARIO-03-CHECK-03 — Generated or mechanical churn is named and explained.
- [ ] EXE-AESTH-SCENARIO-03-CHECK-04 — No conditional, branch, or logic change is hidden inside a broad formatting diff.

---

## Usage

### EXE-USAGE-SCENARIO-01 — Call-site self-explanation
- [ ] EXE-USAGE-SCENARIO-01-CHECK-01 — New or changed exported functions, public APIs, CLI flags, config fields, or multi-caller internals have signatures, types, and doc-comments sufficient for first-time use.
- [ ] EXE-USAGE-SCENARIO-01-CHECK-02 — Parameter names communicate intent, valid values, and ordering expectations at the call site.
- [ ] EXE-USAGE-SCENARIO-01-CHECK-03 — Side effects, sentinel values, and required preconditions are documented at the caller-visible surface.
- [ ] EXE-USAGE-SCENARIO-01-CHECK-04 — Behavior changes affecting downstream users are documented where those users will look.

### EXE-USAGE-SCENARIO-02 — Actionable failures and operator diagnosis
- [ ] EXE-USAGE-SCENARIO-02-CHECK-01 — Error messages name the failed operation, resource, input, or command.
- [ ] EXE-USAGE-SCENARIO-02-CHECK-02 — Error messages or adjacent documentation tell the user or operator what to do next.
- [ ] EXE-USAGE-SCENARIO-02-CHECK-03 — New logs use the project's log-level conventions.
- [ ] EXE-USAGE-SCENARIO-02-CHECK-04 — Failure paths include enough operational context for diagnosis without rerunning under a debugger.

### EXE-USAGE-SCENARIO-03 — Accessibility, locale, and user-facing behavior
- [ ] EXE-USAGE-SCENARIO-03-CHECK-01 — UI changes preserve keyboard navigation where UI is in scope, or the non-applicability is explicit.
- [ ] EXE-USAGE-SCENARIO-03-CHECK-02 — UI changes preserve screen-reader paths and color contrast where UI is in scope, or the non-applicability is explicit.
- [ ] EXE-USAGE-SCENARIO-03-CHECK-03 — New user-facing strings are externalized when the project localizes, or the non-applicability is explicit.
- [ ] EXE-USAGE-SCENARIO-03-CHECK-04 — Locale-sensitive sorting, date, number, and generated-text behavior uses locale-aware APIs where relevant, or the non-applicability is explicit.

---

## Consistency

### EXE-CONS-SCENARIO-01 — Renames and signatures update every consumer
- [ ] EXE-CONS-SCENARIO-01-CHECK-01 — A `grep` for old names, signatures, or call shapes returns no production hits except explicit compatibility shims.
- [ ] EXE-CONS-SCENARIO-01-CHECK-02 — Every caller and test referencing the old name or call shape is updated, or is explicitly overload-compatible.
- [ ] EXE-CONS-SCENARIO-01-CHECK-03 — Type-check / compile output confirms call sites carry no stale call-shape errors.
- [ ] EXE-CONS-SCENARIO-01-CHECK-04 — Any compatibility shim or overload is explicit and does not hide a stale caller still using removed behavior.

### EXE-CONS-SCENARIO-02 — Code, docs, tests, and comments agree
- [ ] EXE-CONS-SCENARIO-02-CHECK-01 — Tests reflect new, changed, and removed behavior; no skipped or stale behavior test remains.
- [ ] EXE-CONS-SCENARIO-02-CHECK-02 — README / CHANGELOG / design docs / examples / skill docs affected by the change are updated in the same change-set.
- [ ] EXE-CONS-SCENARIO-02-CHECK-03 — In-code comments that name changed behavior are updated or removed; no comment contradicts the code it sits above.
- [ ] EXE-CONS-SCENARIO-02-CHECK-04 — Documentation-build, example, and link checks pass where the project provides them.
- [ ] EXE-CONS-SCENARIO-02-CHECK-05 — No doc or skill still teaches an old command or path the change-set superseded, and no required doc update is deferred to a later task.

### EXE-CONS-SCENARIO-03 — Manifests, schemas, migrations, and runtime references sync
- [ ] EXE-CONS-SCENARIO-03-CHECK-01 — Index / barrel / public-API manifests reflect added and removed exports.
- [ ] EXE-CONS-SCENARIO-03-CHECK-02 — Schema, validator, migration, and dependent-type changes move together (no "we'll update the validator later").
- [ ] EXE-CONS-SCENARIO-03-CHECK-03 — CLI command / flag / skill / agent / load-directive references point to live paths and current names.
- [ ] EXE-CONS-SCENARIO-03-CHECK-04 — The commit / PR text summarizes the whole diff accurately, not just a small part of it.
- [ ] EXE-CONS-SCENARIO-03-CHECK-05 — File moves or renames leave no stale runtime, tooling, manifest, or documentation reference behind.

---

## Risk

### EXE-RISK-SCENARIO-01 — Blast radius and backwards-compat controlled
- [ ] EXE-RISK-SCENARIO-01-CHECK-01 — A caller `grep` confirms callers of each changed exported function are updated or explicitly tolerated.
- [ ] EXE-RISK-SCENARIO-01-CHECK-02 — The cumulative file-touch count matches the plan's projection, or the excess is explained.
- [ ] EXE-RISK-SCENARIO-01-CHECK-03 — Public-interface signature or behavior breaks carry a migration path or a deliberate-break declaration.
- [ ] EXE-RISK-SCENARIO-01-CHECK-04 — Breaking changes are flagged in the commit / PR / CHANGELOG.
- [ ] EXE-RISK-SCENARIO-01-CHECK-05 — Any claim that a change is "internal" is backed by caller and reference checks, not assumption.

### EXE-RISK-SCENARIO-02 — Security and trust boundary intact
- [ ] EXE-RISK-SCENARIO-02-CHECK-01 — New or changed untrusted-input paths validate or sanitize data before any sink.
- [ ] EXE-RISK-SCENARIO-02-CHECK-02 — Auth and authz checks remain before privileged actions, and any trust-boundary movement is named.
- [ ] EXE-RISK-SCENARIO-02-CHECK-03 — The change-set is reviewed for auth / token / cookie / CORS / `eval` / `exec` / shell-command paths.
- [ ] EXE-RISK-SCENARIO-02-CHECK-04 — No `eval` / `exec` / shell command receives untrusted input without a safe construction path.
- [ ] EXE-RISK-SCENARIO-02-CHECK-05 — No `--no-verify` / `--force` / `--skip-tests` or equivalent safety-bypass primitive is left in a committed script.

### EXE-RISK-SCENARIO-03 — Irreversibility and concurrency gated
- [ ] EXE-RISK-SCENARIO-03-CHECK-01 — Migrations / DDL / destructive file writes / destructive operations include rollback or revert steps, or an explicit one-way gate.
- [ ] EXE-RISK-SCENARIO-03-CHECK-02 — Any irreversible operation is named as one-way in task notes / commit / PR / release notes.
- [ ] EXE-RISK-SCENARIO-03-CHECK-03 — Shared mutable state has an explicit synchronization decision (mutex / actor / queue / "not shared").
- [ ] EXE-RISK-SCENARIO-03-CHECK-04 — Concurrency safety does not rely on an unstated single-writer assumption.
- [ ] EXE-RISK-SCENARIO-03-CHECK-05 — Code touching shared mutable state or destructive operations is checked against plausible concurrent-execution or retry paths.

### EXE-RISK-SCENARIO-04 — Privacy, license, and deployment surface reviewed
- [ ] EXE-RISK-SCENARIO-04-CHECK-01 — No new PII collection or data capture is introduced without an explicit purpose + retention statement.
- [ ] EXE-RISK-SCENARIO-04-CHECK-02 — Existing data-flow boundaries are preserved, and new logs scrub user-identifying or sensitive payload content.
- [ ] EXE-RISK-SCENARIO-04-CHECK-03 — Cache / backup / replication / deletion paths respect the relevant data-retention policy.
- [ ] EXE-RISK-SCENARIO-04-CHECK-04 — Modified or added third-party code carries required license headers, attribution, and a project-compatible license.
- [ ] EXE-RISK-SCENARIO-04-CHECK-05 — Infrastructure / Dockerfile / Kubernetes / deployment configuration changes have a rollout plan and a revert plan.
- [ ] EXE-RISK-SCENARIO-04-CHECK-06 — Resource limits for memory / CPU / disk / connections are reviewed for service-level or deployment changes.
