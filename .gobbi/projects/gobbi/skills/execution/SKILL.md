---
name: execution
description: "MUST load when implementing a task. Execution is an operation skill for studying the task, applying a bounded change, verifying the result, and creating a focused local commit."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Execution

Execution is the implementation operation for one defined task. It produces the required implementation, a
focused local commit, and verification evidence for handoff.

## Principles

### Let evidence determine the implementation

Accepted design, live project behavior, established project patterns, and applicable primary sources reveal
the constraints that implementation must satisfy. Use that evidence to choose the strategy and its algorithms,
interfaces, seams, and supporting mechanisms instead of relying on habit or an assumed starting state.

### Build from foundation to dependent layers

A coherent implementation grows upward from an explicit skeleton or foundation. Establish the whole shape,
then implement its interfaces, main behavior, integrations, and supporting details in dependency order so
higher layers remain consistent with the structure below them.

### Prefer the simplest complete implementation

Use direct structures, ordinary control flow, clear names, and plain prose. Add an abstraction, layer, or
mechanism only when a current requirement or evidence justifies it. Keep code and documents no more
complicated or verbose than the task requires.

### Repair the cause revealed by verification

A failed check or review finding is evidence about the implementation, not merely a symptom to suppress.
Trace it to the earliest incorrect strategy, foundation, interface, behavior, integration, document, or check,
repair that cause, and verify the resulting whole again.

## Rules

- **MUST keep every change within the task's defined outcome, boundaries, and authority.** Preserve unrelated
  work and stop when the task-owned change cannot be isolated safely.
- **MUST keep affected surfaces consistent.** Code, documents, tests, types, schemas, configuration, examples,
  and runtime surfaces that express the same behavior must agree in the verified result.
- **MUST preserve required behavior and meaning while cleansing.** Simplification and compaction must not
  remove required contracts, constraints, safety information, or context needed to use and maintain the
  result.
- **MUST verify the exact tree after the final edit.** Run the required checks, repair failures, and repeat
  affected verification before committing.
- **MUST finish with one focused local commit and a local handoff.** Follow the project commit convention,
  do not push, merge, publish, remove the worktree, or rewrite history, and return the result with its
  verification evidence and remaining concerns.

## Procedure

### Phase 1 — Understand the Context and Study for Implementation

#### 1.1 Understand the implementation context

- Read the task's required outcome, purpose, affected actors, included and excluded work, accepted design,
  constraints, acceptance criteria, verification requirements, authority, and expected handoff.
- Inspect the exact repository, worktree, branch, current status, existing diff, target files, neighboring
  implementation, callers, consumers, tests, documentation, configuration, schemas, build paths, and relevant
  history.

#### 1.2 Study for the implementation

- Load the governing project rules and applicable implementation, language, framework, platform, and tool
  skills before making decisions in those domains.
- Study the closest internal evidence first: accepted design and research, source definitions and call sites,
  tests, documentation, configuration, schemas, build and runtime behavior, project memory, relevant history,
  prior attempts, and established project patterns.
- Study external material when an implementation question depends on an external mechanism, standard, library,
  platform, security practice, or pattern that internal evidence does not settle. Prefer current primary and
  official sources, and verify their version, authority, relevance, applicability, and limits.

### Phase 2 — Decompose and Order the Implementation

#### 2.1 Design the implementation strategy

- Use the task, accepted design, live implementation context, and study evidence to choose the simplest
  implementation strategy that satisfies correctness, testability, compatibility, safety, resource use,
  maintenance, and reversibility.
- Resolve routine implementation details such as algorithms, data structures, internal seams, interfaces,
  naming, error handling, and verification seams.

#### 2.2 Decompose and order the implementation from bottom to top

- Decompose how to implement the task, not what the task contains, from the lowest implementation layer
  upward: skeleton and foundations, contracts and interfaces, core behavior, integration and dependent
  surfaces, then final verification.
- Order the implementation units from bottom to top: skeleton and foundations, contracts and interfaces, core
  behavior, integration and dependent surfaces, then final verification.

### Phase 3 — Implement from Bottom to Top

#### 3.1 Establish the implementation foundation

- Implement the task's skeleton or foundation from the accepted design and project conventions before its
  detailed behavior. Depending on the task, establish a class diagram, layout, wireframe, project or directory
  structure, module, class, function, or type signatures, schema shell, command surface, document hierarchy,
  semantic page structure, component scaffold, or another structure that defines the implementation.

#### 3.2 Implement the ordered units from bottom to top

- For code, implement class and function interfaces, then their main behavior, callers and integrations, and
  finally docstrings, examples, and supporting documentation.
- For a project, implement its directory and module structure, then internal behavior, entry points, and
  integrations.
- For documentation, establish the document hierarchy and headings, then write the core sections and add
  examples, cross-references, and other supporting content.
- Clean the completed implementation before self-verification. Make its code and documents as simple and
  compact as the task allows. Use plain, precise, context-appropriate names, comments, docstrings, and prose.
  Remove duplication, needless indirection, dead code, filler, stale content, and redundant explanation
  without changing required behavior or meaning.

### Phase 4 — Self-Verify, Repair, and Re-verify

#### 4.1 Verify the complete result

- Run the task's required checks on the exact tree after the last edit and add targeted checks for risks found
  during study or implementation. Use tests, builds, type checks, schema or link validation, rendered or
  runtime inspection, accessibility or compatibility checks, benchmarks, security checks, or direct artifact
  review as appropriate.
- Review the complete implementation and diff for task alignment, consistency across dependent surfaces, stale
  or unsafe content, unexpected churn, and undocumented compatibility changes. Directly inspect affected
  observable behavior and confirm that unrelated work is unchanged.

#### 4.2 Repair and repeat verification

- Trace each failed check or self-review finding to the earliest incorrect assumption, strategy, foundation,
  interface, implementation unit, integration point, documentation claim, or verification method. Explain why
  the cause produced the failure.
- Repair the smallest complete in-scope unit at the root and propagate the repair through every dependent
  implementation, test, caller, schema, document, configuration, and example. Refine only what the task's
  acceptance, maintainability, safety, or quality contract requires.
- Run the narrow check that exposed the failure and every affected downstream check, then return to Step 4.1
  and repeat complete verification. Continue until the result passes or reaches a named stop condition. Never
  treat a repair as complete only because the original symptom disappeared.

### Phase 5 — Finalize and Hand Off

#### 5.1 Finalize and hand off

- Confirm that the worktree has not changed since verification. Review the branch, status, changed paths, and
  task ownership, preserve unrelated work, and stop if the task-owned changes cannot be isolated safely.
- Stage only task-owned paths, inspect the staged paths and diff, and create one focused local commit using the
  project's commit convention and required provenance. Confirm that the commit contains the complete verified
  change.
- Do not push, merge, publish, remove the worktree, or rewrite history.
- Return the task identity, status, strategy, changed paths, commit, verification results, evidence, remaining
  concerns, preserved unrelated work, and blocked external actions. Confirm that no in-scope work remains
  uncommitted and no unauthorized side effect occurred, then hand the committed result to the caller for the
  next authorized action.

## References
