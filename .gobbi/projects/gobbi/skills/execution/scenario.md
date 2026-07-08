# Execution Loop — Evaluation Scenarios

Per-perspective GOOD / BAD / ADVERSARIAL discrimination scenarios for an Execution Loop's change-set. The evaluator loads this file at Stage 1 (Scenario-Checklist Frame Build) as seed scenarios for the seven perspectives.

The evaluation **procedure** — the per-perspective lens definitions, recommended tool verifications, perspective anti-patterns, and Overall (Stage 3) anchors — lives in the sibling `evaluation.md`. The concrete yes/no **checks** each scenario references live 1:1 in the sibling `checklist.md`, whose heading tree mirrors this file exactly.

The artifact under evaluation is **the actual change-set** (committed code, modified files, plus the executor's notes), judged against the plan task it implements. Each family below carries a `### {ID}` heading, a **Category**, the **Situation** it arises in, the **Good** outcome, the **Bad / failure** outcome, one **Adversarial** case a real evaluator would probe, and the **Checklist IDs** whose joint satisfaction proves the scenario handled. Scenario IDs follow `EXE-{PERSPECTIVE}-SCENARIO-{NN}`; each check follows `{scenario-id}-CHECK-{NN}` and lives in `checklist.md`.

---

## Project
_Lens (see `evaluation.md`):_ did the executor implement the right task, the whole task, and only the task?

### EXE-PROJ-SCENARIO-01 — Task scope fidelity
**Category:** golden-path
**Situation:** the executor reports the task done and the change-set is on the branch.
**Good:** every `outputs:` entry has a concrete diff artifact; `git diff --name-only` touches only the task's `files:` set (or a subset); the commit/PR names the task and the message matches the diff.
**Bad / failure:** an output the task promised is missing but the task is labeled complete, or the commit message understates/overstates what the diff actually changed.
**Adversarial:** tests pass, but `git diff --name-only` shows a file outside the task's `files:` list — an unrelated "while I was in there" cleanup rode along under a green build.
**Checklist IDs:** `EXE-PROJ-SCENARIO-01-CHECK-*`

### EXE-PROJ-SCENARIO-02 — Verification actually run
**Category:** failure-mode
**Situation:** the task carries a `verifies:` command and the executor cites verification evidence.
**Good:** the exact `verifies:` command was run on the final tree, completed cleanly, and did not modify files to produce its pass.
**Bad / failure:** verification is asserted in prose, run against an earlier tree, run with a different command, or fails but is reported as "close enough".
**Adversarial:** the `verifies:` command or a test fixture is edited inside the same change-set — a threshold loosened, an assertion deleted — so the check passes while the requested behavior stays unproven.
**Checklist IDs:** `EXE-PROJ-SCENARIO-02-CHECK-*`

### EXE-PROJ-SCENARIO-03 — Upstream contracts left intact
**Category:** golden-path
**Situation:** the task declares `inputs:` — upstream interfaces it consumes but does not own.
**Good:** every consumed interface is unchanged unless the task spec explicitly authorizes modifying it; no input-side code was refactored in passing.
**Bad / failure:** an input-side signature, return shape, or default is changed as an "incidental" tidy-up the task never authorized.
**Adversarial:** the change-set silently alters an upstream contract the task only reads from, so a caller outside this task's scope now sees different behavior with no declaration anywhere in the commit/PR.
**Checklist IDs:** `EXE-PROJ-SCENARIO-03-CHECK-*`

---

## Structure
_Lens (see `evaluation.md`):_ is the code structure of the change-set sound, and does it match project conventions and the Ideation/Planning design direction?

### EXE-STRUCT-SCENARIO-01 — Design-conformant structure
**Category:** golden-path
**Situation:** the change-set adds or reshapes modules, functions, or types.
**Good:** new code follows the named library / pattern / API shape from Ideation; it reuses existing project patterns and naming instead of inventing new ones; removed code is deleted (not commented out); every new export has a caller or is a declared public-API addition; errors follow the adjacent code's shape.
**Bad / failure:** a novel pattern is introduced where an existing one fits, an `any` / `@ts-ignore` escape hatch is inserted without task-scoped justification, or dead code / commented-out blocks / orphan exports are left in the diff.
**Adversarial:** a new "helper" is extracted for "future flexibility" but has exactly one caller — a premature abstraction that adds an indirection the task never needed.
**Checklist IDs:** `EXE-STRUCT-SCENARIO-01-CHECK-*`

### EXE-STRUCT-SCENARIO-02 — Coupling stays acyclic
**Category:** failure-mode
**Situation:** the change-set adds imports or moves code between modules.
**Good:** module dependencies stay a DAG; a `grep` for circular-import patterns returns no new hits; coupling direction is unchanged.
**Bad / failure:** a new import edge creates a dependency the project's layering forbids.
**Adversarial:** a tidy-looking extraction (moving a shared function "up" into a common module) introduces a hidden import cycle between two modules that were previously acyclic, and the diff reads as cleanup.
**Checklist IDs:** `EXE-STRUCT-SCENARIO-02-CHECK-*`

### EXE-STRUCT-SCENARIO-03 — Tests and type gates hold
**Category:** failure-mode
**Situation:** the change-set adds or changes behavior that tests and the type-checker should cover.
**Good:** new behavior has a test, changed behavior has a modified test, removed behavior has no orphan test; tests are isolated (no shared mutable global state, explicit setup/teardown, order-independent, time/random/network mocked or pinned); the type-check / compile passes on every modified file.
**Bad / failure:** new behavior ships with no test, or a test relies on execution order / real wall-clock time / a live external service / a shared mutable global.
**Adversarial:** a test for the new behavior is added but marked `test.skip` / pending, so the suite is green while the behavior is never actually exercised — coverage that only looks real.
**Checklist IDs:** `EXE-STRUCT-SCENARIO-03-CHECK-*`

### EXE-STRUCT-SCENARIO-04 — Dependency and config surface controlled
**Category:** failure-mode
**Situation:** the change-set imports a new dependency, adds config, touches environment variables, or changes build / CI wiring.
**Good:** every new dependency is justified, declared in `package.json` and the lockfile, license-checked, CVE-clean, and sourced from a recognized publisher; new env vars are documented; config-schema changes carry migration notes; new-config defaults are production-safe; no secret or local-config path is committed; CI/build changes are explicit.
**Bad / failure:** a package is imported but undeclared, a new env var lands with no docs, a CI/build default changes without explanation, or a production-impacting default is left implicit.
**Adversarial:** a transitive dependency rides in through an unexplained lockfile bump — or a dependency name differs by one character from the expected package (a typo-squat) — widening the trust surface with no review.
**Checklist IDs:** `EXE-STRUCT-SCENARIO-04-CHECK-*`

---

## Performance
_Lens (see `evaluation.md`):_ does the change-set honor performance, cost, and resource expectations without silent regressions?

### EXE-PERF-SCENARIO-01 — Benchmark and hot-path evidence
**Category:** golden-path
**Situation:** the task touches a path with stated performance expectations or existing benchmark coverage.
**Good:** the relevant benchmark or measurement was run on the final tree; results are within expected variance or the delta is explained; Ideation-flagged hot paths include actual numbers rather than reasoning.
**Bad / failure:** the executor claims the change is faster without measurement, ignores a benchmark threshold, or labels a regression "noise" without rerunning enough to distinguish variance from signal.
**Adversarial:** a single benchmark pass looks acceptable, but repeated runs show a consistent slowdown that was hidden by a loose variance claim.
**Checklist IDs:** `EXE-PERF-SCENARIO-01-CHECK-*`

### EXE-PERF-SCENARIO-02 — IO, batching, and N+1 control
**Category:** failure-mode
**Situation:** the change-set adds or changes network calls, database calls, disk IO, cache behavior, retries, or batching.
**Good:** IO has explicit timeout, retry, and batch-size decisions; cache / memoization behavior matches Planning; loops avoid per-item external calls; call counts are profiled where the code path can scale.
**Bad / failure:** a loop performs a database, network, or disk operation per item without a batch boundary, or a retry / timeout / cache decision is left to an unsafe default.
**Adversarial:** the change passes small test fixtures, but production-sized input multiplies external calls by row count and creates an N+1 latency or cost regression.
**Checklist IDs:** `EXE-PERF-SCENARIO-02-CHECK-*`

### EXE-PERF-SCENARIO-03 — Cost and observability budget
**Category:** failure-mode
**Situation:** the change-set adds paid API use, token consumption, infra resource use, logging, metrics, or alerts.
**Good:** cost delta is estimated; paid or high-volume operations have a ceiling, rate limit, or kill switch; new or changed paths keep diagnostic logs and metrics at project-standard levels; hot paths emit useful timing or counter signals where relevant.
**Bad / failure:** a new paid call ships without a budget ceiling, retries can run unbounded, critical paths lose telemetry, or logs are too sparse for an operator to diagnose failure.
**Adversarial:** an error path retries a paid API without a cap and emits high-cardinality logs, so an outage creates both spend runaway and alert noise.
**Checklist IDs:** `EXE-PERF-SCENARIO-03-CHECK-*`

---

## Aesthetics
_Lens (see `evaluation.md`):_ is the code readable, named accurately, convention-matched, and reviewable?

### EXE-AESTH-SCENARIO-01 — Names and comments preserve meaning
**Category:** golden-path
**Situation:** the change-set changes behavior, extracts code, or updates comments.
**Good:** variable, function, class, and file names match the new behavior; comments explain non-obvious reasons rather than restating code; comments invalidated by the change are updated or removed.
**Bad / failure:** behavior changes but names keep the old meaning, comments narrate obvious code, or stale comments contradict the implementation.
**Adversarial:** a refactor keeps the old function name and comment while changing edge-case semantics, so reviewers and future callers trust a false label.
**Checklist IDs:** `EXE-AESTH-SCENARIO-01-CHECK-*`

### EXE-AESTH-SCENARIO-02 — Mechanical polish and leftover artifacts
**Category:** failure-mode
**Situation:** the change-set is ready for review after implementation.
**Good:** lint and format runners pass on modified files; no debug prints, commented-out code blocks, shorthand "removed" comments, or stray TODO / FIXME markers remain unless the task explicitly requires them.
**Bad / failure:** formatter drift remains, a debug print is committed, or commented-out code is left as a private breadcrumb.
**Adversarial:** a debug print sits only on a rare failure path that the happy-path review never exercises, so it survives review and ships as noise in production logs.
**Checklist IDs:** `EXE-AESTH-SCENARIO-02-CHECK-*`

### EXE-AESTH-SCENARIO-03 — Reviewable diff shape
**Category:** failure-mode
**Situation:** the diff includes formatting, movement, or generated-looking churn.
**Good:** pure formatting is isolated from behavior changes; reviewers can identify which lines changed behavior; generated or mechanical churn is explained.
**Bad / failure:** large whitespace or reflow churn hides a logic change, or behavior and formatting are bundled so the logic cannot be reviewed directly.
**Adversarial:** a conditional branch changes inside a broad reformat, so the diff looks like style cleanup while the runtime behavior changes.
**Checklist IDs:** `EXE-AESTH-SCENARIO-03-CHECK-*`

---

## Usage
_Lens (see `evaluation.md`):_ can the next caller, maintainer, operator, or future debugger use the changed code correctly?

### EXE-USAGE-SCENARIO-01 — Call-site self-explanation
**Category:** golden-path
**Situation:** the change-set adds or changes exported functions, public APIs, CLI flags, config fields, or internal functions with multiple callers.
**Good:** signatures, parameter names, types, and doc-comments are enough for a first-time caller to use the surface correctly without reading the implementation; behavior changes that affect downstream users are documented where those users will look.
**Bad / failure:** a caller must open the implementation to discover parameter meaning, valid value ranges, side effects, or a breaking behavior change.
**Adversarial:** the new API works only when callers know an undocumented sentinel value or ordering precondition, so existing tests pass but a fresh caller predictably misuses it.
**Checklist IDs:** `EXE-USAGE-SCENARIO-01-CHECK-*`

### EXE-USAGE-SCENARIO-02 — Actionable failures and operator diagnosis
**Category:** failure-mode
**Situation:** the change-set adds errors, validation, logs, or failure paths that a user or operator may encounter.
**Good:** error messages name what failed and what to do next; log levels match project convention; failure paths carry enough context for an operator to diagnose the problem without rerunning under a debugger.
**Bad / failure:** errors say only "Error" or "Something went wrong", logs are placed at the wrong level, or operational context is omitted from the one place a tired operator would inspect.
**Adversarial:** a production alert points to a generic error message with no resource ID, command, or remediation path, so the operator at 3am cannot tell whether to retry, roll back, or escalate.
**Checklist IDs:** `EXE-USAGE-SCENARIO-02-CHECK-*`

### EXE-USAGE-SCENARIO-03 — Accessibility, locale, and user-facing behavior
**Category:** coverage-matrix
**Situation:** the change-set affects UI, user-facing strings, sorting, dates, numbers, generated text, or operator-facing documentation.
**Good:** UI changes preserve keyboard navigation, screen-reader paths, and color contrast where applicable; new strings are externalized when the project localizes; locale-sensitive sort / date / number behavior uses locale-aware APIs; non-applicable cases are named with rationale.
**Bad / failure:** user-facing strings are hardcoded, date / number / sort behavior assumes one locale, or a UI path works only with pointer input.
**Adversarial:** the feature passes in English and the developer's locale, but a non-US date or locale sort order changes behavior enough that users follow the wrong path.
**Checklist IDs:** `EXE-USAGE-SCENARIO-03-CHECK-*`

---

## Consistency
_Lens (see `evaluation.md`):_ did every related code, test, type, doc, comment, index, migration, and runtime reference change together?

### EXE-CONS-SCENARIO-01 — Renames and signatures update every consumer
**Category:** golden-path
**Situation:** the change-set renames a function, class, module, command, flag, or type, or changes a callable signature.
**Good:** every caller and test is updated; old names have no production hits after `grep`; type or compile checks confirm call sites; overload compatibility is explicit where old call shapes remain valid.
**Bad / failure:** one caller, test fixture, generated index, or internal doc still uses the old name or call shape.
**Adversarial:** a compatibility shim or overload hides the compile errors, so tests pass while a stale caller keeps using the removed behavior path.
**Checklist IDs:** `EXE-CONS-SCENARIO-01-CHECK-*`

### EXE-CONS-SCENARIO-02 — Code, docs, tests, and comments agree
**Category:** golden-path
**Situation:** the change-set changes behavior that docs, tests, examples, comments, or skill docs describe.
**Good:** tests reflect new and removed behavior; README / CHANGELOG / design docs / skill docs are updated in the same change-set where they are affected; comments that name changed behavior are updated or removed.
**Bad / failure:** docs are deferred to a later task, tests keep asserting old behavior through skipped or stale cases, or comments contradict the code they describe.
**Adversarial:** the code and tests are correct, but a skill doc still teaches the old command or path, so the next agent follows stale instructions while every test stays green.
**Checklist IDs:** `EXE-CONS-SCENARIO-02-CHECK-*`

### EXE-CONS-SCENARIO-03 — Manifests, schemas, migrations, and runtime references sync
**Category:** failure-mode
**Situation:** the change-set affects exports, schemas, migrations, validators, CLI references, skill / agent file paths, or commit / PR metadata.
**Good:** index / barrel / public-API manifests match exports; schema, validator, migration, and dependent types move together; CLI / skill / agent references point to live paths; commit or PR text summarizes the whole diff accurately.
**Bad / failure:** a new export is missing from an index, a schema change lacks a migration or validator update, a moved file leaves a stale skill path, or the commit message describes only a small part of the actual change.
**Adversarial:** a file move updates code imports but leaves an agent load-directive or skill path pointing at the old location, so runtime tooling fails after the source tests pass.
**Checklist IDs:** `EXE-CONS-SCENARIO-03-CHECK-*`

---

## Risk
_Lens (see `evaluation.md`):_ what breaks if this is wrong — backwards compatibility, security surface, concurrency, blast radius, irreversible operations?

### EXE-RISK-SCENARIO-01 — Blast radius and backwards-compat controlled
**Category:** golden-path
**Situation:** the change-set modifies an exported / public interface.
**Good:** the cumulative file-touch count matches the plan's projection; callers of any changed exported function are updated or explicitly tolerated; public-interface breaks carry a migration path or a deliberate-break declaration flagged in the commit / PR / CHANGELOG.
**Bad / failure:** a public signature changes with no migration path, or the file-touch count exceeds the plan's projection with no explanation.
**Adversarial:** a change described as "internal" ripples to callers the plan never projected — an unannounced blast-radius expansion the executor did not `grep` for before declaring the change local.
**Checklist IDs:** `EXE-RISK-SCENARIO-01-CHECK-*`

### EXE-RISK-SCENARIO-02 — Security and trust boundary intact
**Category:** failure-mode
**Situation:** the change-set touches auth, authz, CORS, cookies, tokens, input parsing, `eval`, `exec`, or shell commands.
**Good:** every new untrusted-input path validates / sanitizes input; auth and authz checks remain before privileged actions; no `eval(` / `exec(` runs on untrusted input; no `--no-verify` / `--force` / `--skip-tests` primitive is left in a committed script.
**Bad / failure:** a new input path reaches a sink with no validation, auth ordering changes without being named, or a safety-bypass flag is committed in a helper script.
**Adversarial:** a "small refactor" moves input parsing or command construction ahead of the authorization check, so the diff reads as simplification while the trust boundary quietly moves outward.
**Checklist IDs:** `EXE-RISK-SCENARIO-02-CHECK-*`

### EXE-RISK-SCENARIO-03 — Irreversibility and concurrency gated
**Category:** failure-mode
**Situation:** the change-set adds migrations, destructive file operations, or code touching shared mutable state.
**Good:** migrations / DDL / file writes carry rollback steps or an explicit "this is one-way" gate; shared mutable state has a named synchronization decision (mutex / actor / queue / "not shared") rather than a silent "only one process writes this" assumption.
**Bad / failure:** concurrency safety rests on an unstated single-writer assumption, or a destructive operation has no revert procedure.
**Adversarial:** a migration lands with no rollback path and no one-way gate — an undeclared one-way door that cannot be reversed if the deploy goes wrong.
**Checklist IDs:** `EXE-RISK-SCENARIO-03-CHECK-*`

### EXE-RISK-SCENARIO-04 — Privacy, license, and deployment surface reviewed
**Category:** coverage-matrix
**Situation:** the change-set touches data flow, third-party code, or deployment configuration.
**Good:** no new PII collection without a purpose + retention statement; existing data-flow boundaries are preserved and logs scrub sensitive payloads; added third-party code carries its license + attribution and no license-incompatible code is introduced; IaC / Dockerfile / Kubernetes changes are deliberate with a rollout + revert plan and reviewed resource limits.
**Bad / failure:** vendored third-party code lands with no license header, a deployment-affecting config change has no rollout / revert plan, or a data-flow boundary is widened with no note.
**Adversarial:** a new cache or backup surface retains a user record after the primary delete path reports it removed, so retention silently outlives the stated policy on a path no happy-path test inspects.
**Checklist IDs:** `EXE-RISK-SCENARIO-04-CHECK-*`
