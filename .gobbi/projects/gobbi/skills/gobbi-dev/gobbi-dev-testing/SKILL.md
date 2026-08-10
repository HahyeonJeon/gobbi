---
name: gobbi-dev-testing
description: "MUST load when collecting exact-revision test evidence for Gobbi."
allowed-tools: Read, Grep, Glob, Bash
skill-type: operation
---

# Gobbi Testing

A test operator uses this operation to collect reproducible evidence for one exact Gobbi revision and its
claims. The result records what ran once, what it observed, which effects occurred, what failed first, and
which limits remain.

Testing does not correct the subject, issue an Evaluation verdict, or accept work. It returns evidence to the
caller and routes supported defects to the earliest responsible owner.

## Principles

### Test one exact subject

Evidence for one commit, tree, package, generated view, installed cache, or environment does not prove another.
Changing the subject ends the current evidence collection.

### Classify effects before commands

A command name does not reveal its writes, network use, credentials, caches, or cleanup behavior. Its current
owner and live implementation define the safe execution boundary.

### Keep the first useful failure

The first supported diagnostic often identifies the earliest broken obligation. Repeated runs can add drift,
cost, and misleading later symptoms.

### Report evidence, not acceptance

A passing command proves only its named claim within its environment and limits. Evaluation and the manager or
user make later judgment and acceptance decisions.

## Rules

- **MUST bind every test request to an exact revision or immutable artifact, named claims, applicable owner
  contracts, required checks, environment, authority, and effect boundary.** Stop when identity or required
  inputs are absent, dirty in conflict, or changed.
- **MUST inspect each check's current owner and implementation before execution.** Classify source, temporary,
  cache, runtime-home, network, credential, external, destructive, and cleanup effects explicitly.
- **MUST isolate allowed writes in caller-authorized disposable paths and preserve source and unrelated state.**
  A required unknown, external, credential, network, default-home, or destructive effect needs separate exact
  authority before the check can run.
- **MUST run each selected check once on the frozen subject and capture its command, exit status, bounded
  output, observations, duration when material, and effects.** Do not retry or alter the subject to obtain a
  preferred result.
- **MUST sanitize evidence without hiding the first useful diagnostic or changing its meaning.** Remove secret
  values and unrelated private paths, then state every redaction and evidence limit.
- **NEVER repair, suppress, skip, stage, commit, publish, issue a verdict, or accept through this operation.**
  Return failures to the earliest supported owner and ambiguity to the manager with the exact retained state.

## Procedure

### Phase 1 — Bind the Subject

#### 1.1 Validate identity, claims, and effects

- Take the caller, exact commit and tree or immutable artifact identity, claims, expected outcomes, accepted
  criteria when present, environment, known risks, prior failures, requested checks, and authority.
- Recompute the subject identity and confirm its repository, worktree, package, generated, or installed
  boundaries. Record tracked status and relevant preimages before a command can change observable state.
- Separate source and owner facts from caller claims. Stop when the subject changed, a claim has no owner or
  expected observation, the environment is incomplete, or required access exceeds current authority.
- Define the evidence output, sanitized fields, allowed temporary roots, allowed effects, stop conditions, and
  retained-state policy. Evidence files never become product or source state.

#### 1.2 Select owned checks

- Map each claim to the current script, build, link, package, runtime, inventory, structural, or manual owner
  that can observe it. Read the exact implementation and built-in help needed to understand its current inputs
  and effects.
- Choose the smallest complete set that covers accepted criteria and material risks. Add a check when actual
  subject evidence exposes a meaningful gap; record why every requested check is excluded or unavailable.
- Order checks from narrow and low-effect to broad and higher-effect, with identity and static validation
  before materialization, isolated runtime, or external observations. Define the first-failure stop rule.
- Preflight required tools, versions, paths, permissions, resources, isolation, time limits, and expected output.
  A fixture or static scan cannot replace a required real runtime observation.

### Phase 2 — Collect Safe Evidence

#### 2.1 Execute once and sanitize

- Recheck the frozen identity, environment, allowed effects, and authority immediately before each command.
  Stop when any premise changed.
- Run the selected command once inside its required repository or isolated target. Capture the exact invocation,
  resolved tool and version, exit status, bounded standard output and error, material timing, and observed files
  or external state.
- Compare actual effects with the preflight classification. Stop on the first unexpected write, network,
  credential, cache, default-home, destructive, cleanup, containment, identity, or resource effect.
- Sanitize the captured record, not the diagnostic source. Preserve the first useful message and exact status,
  state each redaction and truncation, and never write secrets into durable evidence.

#### 2.2 Diagnose the first useful failure

- Stop later checks when the contract requires fail-fast behavior or a failed prerequisite would make them
  misleading. Record later checks as not attempted, not passed.
- Reproduce only through a separate caller-authorized run on the unchanged subject when one observation cannot
  identify the affected obligation. Never retry automatically or change inputs between unrecorded attempts.
- Trace the failure from visible symptom to the earliest supported owner: accepted contract, source,
  generated view, package, tool, runtime, environment, or test. Keep alternative causes and confidence explicit.
- Preserve temporary and runtime targets when deletion was not authorized or would erase useful failure state.
  Report their exact paths and recovery owner without treating preservation as a test failure.

### Phase 3 — Return Evidence

#### 3.1 Record limits and earliest-owner handoff

- Recompute the subject identity after collection. Mark every result historical or invalid if the subject or
  required environment changed.
- Produce a receipt containing subject identity, claims, owners, selected and excluded checks, tools and
  versions, environments, commands, statuses, observations, effects, redactions, limits, first failure,
  supported cause, confidence, retained state, and not-attempted work.
- Route a contract defect to its design or planning owner, implementation defect to `gobbi-dev-development` or
  Execution, package defect to the package owner, tool fact to `gobbi-dev-toolchain` or its runtime owner, and
  ambiguity to the manager.
- Return no Evaluation verdict or acceptance claim. Collection completes when the exact-revision receipt is
  reproducible, sanitized, and bound to the caller's next decision.

## References
