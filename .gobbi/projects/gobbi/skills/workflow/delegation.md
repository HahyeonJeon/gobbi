# Delegation

This document is the sole owner of Gobbi specialist assignment construction. Read it before every dispatch. A
delegation is a bounded contract that gives a capable specialist enough context to act without guessing while
reserving scope and user authority to the manager.

## Shared assignment skeleton

Every first assignment uses these headings in order. Put the task contract inline; links may add evidence but
cannot replace it.

### 1. Workflow context

State:

- Gobbi session UUID;
- active runtime;
- absolute worktree;
- absolute workflow evidence root;
- branch;
- current phase;
- exact current TODO title and status;
- productive step and stage;
- iteration and cap;
- stable task ID when applicable;
- assignment ID;
- prerequisite evidence; and
- why the assignment is ready.

The TODO title is the sole progression field. Do not supply a competing route.

### 2. Role

Name one role and its responsibility:

| Role | Normal ownership |
|---|---|
| manager | User relationship, TODO routing, assignment, acceptance, and verification |
| leader | Ideation and Planning |
| executor | Ordered implementation |
| evaluator | Fresh independent evaluation |
| assistant | Narrow research, record support, promotion, or bounded mechanical help |

State that the manager retains user discussion, scope, routing, acceptance, reassignment, and
destructive-action authority.

### 3. Objective and reason

Give one observable outcome and why the current TODO needs it. Include the locked Phase 1 terms that bind the
work and exact acceptance criteria.

The specialist must be able to decide whether its bounded work is complete without inferring a broader
objective.

### 4. Ordered load directives

List every required file as an exact canonical workspace-relative or absolute path in read order. A fresh
specialist normally loads:

1. `.gobbi/projects/gobbi/skills/principles/SKILL.md`;
2. every applicable project rule, or records `NO_PROJECT_RULES` when the rules directory is absent or empty;
3. its canonical role prompt under `.gobbi/projects/gobbi/agents/`;
4. `.gobbi/projects/gobbi/skills/workflow/SKILL.md`;
5. the current `phase-1.md`, `phase-2.md`, or `phase-3.md`;
6. the productive-step and task-specific skills; and
7. the primary artifacts named under Inputs.

Fresh specialists inherit no loaded skill. Require them to read every directive completely and return a
`SKILLS LOADED` list with exact paths in read order.

When the locked task intentionally overrides a loaded clause, name the clause, replacement rule, reason, and
assignment-only boundary. Silence is not an override.

Every RECORD assignment names [`SKILL.md`](SKILL.md) Step 1.2 as the evidence-only override for conflicting
Record placement, transition, verdict, and command clauses.

### 5. Inputs

Separate immutable and mutable inputs. Include:

- canonical upstream artifacts;
- the neutral contract;
- frozen source identities;
- accepted decisions;
- findings and dispositions;
- repository and worktree preimages;
- exact commands, schemas, formats, and tools;
- trust boundaries; and
- precedence when inputs disagree.

The locked user contract wins over conflicting legacy prose within its authorized scope. Protected user work
wins over assumptions and triggers a stop.

### 6. In scope and out of scope

List allowed outcomes and paths, then explicit exclusions. For write-capable work, state:

- the one absolute write root;
- exact allowlisted and protected paths;
- whether create, update, delete, move, or commit is authorized;
- whether an external side effect is authorized; and
- whether publication, merge, or cleanup is authorized.

### 7. Authority and write roots

State the routine decisions the specialist may make and its exact stop points. It stops for:

- new scope;
- missing safety or user authority;
- destructive action without authority;
- an extremely material design conflict outside the locked contract;
- unsafe recovery;
- publication without authority;
- protected user changes; or
- an unavailable required system without waiver authority.

Every write uses the absolute session worktree. Every Git command targets that worktree explicitly. One ordered
writer chain owns mutations.

A specialist reports progress but never creates, retitles, reorders, or completes a workflow TODO. In Phase 2
and Phase 3 it discusses routine gaps with the manager or assigned agents, never with the user.

### 8. Conditional independence rules

State every applicable rule:

- independent Claude and Codex authors receive the same neutral contract;
- neither author sees the other draft before both freeze;
- freezing is a completed manager-verified round trip;
- reciprocal review begins only in a later operation;
- each reciprocal reviewer receives the opposite frozen draft and original contract;
- evaluators are fresh, share no creator context, and never see the other evaluator report;
- opposite-system command processes are read-only and ephemeral;
- parallel helpers perform only assigned read-only analysis or critique; and
- continuation follows report, idle and addressable confirmation, manager artifact reread, and verification.

Omit a rule only when its trigger cannot apply, and say why.

### 9. Expected artifacts

Name each response, artifact, diff, commit, finding set, or decision record. Give:

- owner;
- exact path when filesystem output is authorized;
- format and active schema or template;
- system label;
- task and iteration identity;
- verification owner; and
- whether the result is evidence, canonical output, or both.

For EVALUATION and RECORD, name both independent report paths, `gate.md`, `record/iteration-N.md`, their mode,
and their required hashes. A declared evaluator verdict is report evidence; only the workflow gate decision
updates the TODO.

Do not ask a read-only opposite-system process to write into the worktree. The manager-side writer stores a
validated response only after it freezes.

### 10. Verification

List mechanical and semantic checks, including:

- exact artifact rereads;
- active schemas, formats, and validators;
- tests;
- acceptance evidence;
- scope and protected-path checks;
- branch and worktree checks;
- commit checks; and
- loaded-path comparison.

Define what proves completion and what only reports progress. For dual-system WORK, include
[`scripts/validate-dual-system-work.sh`](scripts/validate-dual-system-work.sh) with the canonical productive
step, iteration, assignment, active `--runtime-system`, and `task-NN-slug` when Execution applies.

### 11. Escape paths

Give exact responses for:

- missing context;
- blocked dependency;
- malformed output;
- validation failure;
- protected user work;
- unavailable system;
- unexpected scope;
- unsafe action; and
- missing authority.

Require exact evidence. Never authorize silent degradation, scope expansion, a second writer, or an
unapproved external effect.

In Phase 2 and Phase 3, distinguish routine gaps, which agents resolve within the locked contract, from
critical blockers, which return to the manager for the only permitted user escalation.

### 12. Status contract

Require the response to start with:

```text
STATUS: DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED
VERDICT: PASS | REVISE | FAIL
ARTIFACT: <path or response-only>
SKILLS LOADED:
  - <exact path, in read order>
```

`VERDICT` is evaluator-only, reports that evaluator's independent judgment, and is omitted for other roles.
It is never a substitute for `gate.md`. `ARTIFACT` is omitted only when the assignment requires no artifact.

After the prefix, require a concise outcome, evidence, changed paths or findings, verification results, and
concerns:

- `DONE` means the bounded work and verification are complete.
- `DONE_WITH_CONCERNS` means the work is complete with a named nonblocking concern.
- `NEEDS_CONTEXT` means a specific required input or authority is missing.
- `BLOCKED` means an attempted in-scope path cannot safely continue.

## Dispatch and acceptance

### First assignment

Use the complete skeleton. Assign a stable assignment ID and predictable role identity.

A persistent specialist acknowledges the assignment ID, scope, and expected artifact before work begins.

### Continued assignment

Continue a leader, executor, or assistant only while role, scope, subsystem, dependency chain, authority, and
context remain coherent.

A continuation brief includes:

- the new assignment ID;
- exact current TODO;
- changed objective and inputs;
- mandatory rereads;
- complete current scope;
- independence changes;
- expected artifact;
- verification;
- escape paths; and
- unchanged status contract.

Use a fresh specialist after subsystem change, context drift, failure, lost addressability, or an independence
requirement.

### Report handling

After every report, the manager:

1. validates the status prefix;
2. matches the assignment ID and role;
3. compares `SKILLS LOADED` with the required canonical paths;
4. confirms idle and addressable state when continuation is planned;
5. rereads every promised artifact or commit;
6. runs the named checks in the exact worktree;
7. checks scope and protected paths;
8. updates the native TODO only after evidence passes; and
9. sends a follow-up only after the prior assignment closes.

An idle notification, runtime task status, plausible summary, or clean-looking diff is not completion
evidence.

## Role overlays

### Leader

Name Ideation or Planning, the relevant specialist method, and each user-owned decision. A leader may study,
draft, and critique but cannot implement an Execution task or lock user scope.

### Executor

Give one plan task, current preimage, exact write boundary, verification, commit authority, and protected paths.
An executor cannot push, merge, broaden scope, or accept its own work.

### Evaluator

Require a fresh isolated context, the complete evidence bundle, all seven perspectives plus Overall, the
active finding and report formats, verdict criteria, validators, and reproduction steps. Every finding states
severity and `blocking: yes|no`; creator discussion and the other evaluator report remain unavailable until
the independent report freezes.

### Assistant

Keep the objective narrow and state whether it is read-only analysis, record support, promotion, or bounded
mechanical work. An assistant cannot infer scope, invent missing evidence, or promote unsupported material.

## Template integrity

When policy adds, removes, or renames a required assignment field, update this skeleton and every
workflow-owned example in the same change.

The manager checks the actual loaded paths, not only a specialist's claim that skills were loaded. A path
mismatch or missing explicit override blocks acceptance.

## References

- [`SKILL.md`](SKILL.md) owns routing and phase policy.
- [`agent-teams.md`](agent-teams.md) owns persistent-specialist scheduling.
- [`phase-1.md`](phase-1.md), [`phase-2.md`](phase-2.md), and [`phase-3.md`](phase-3.md) own phase-specific
  dispatch inputs.
- Canonical role prompts live under [`.gobbi/projects/gobbi/agents/`](../../agents/).
