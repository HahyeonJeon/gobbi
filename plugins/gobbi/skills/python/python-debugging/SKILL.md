---
name: python-debugging
description: "MUST load when a Python failure, unexpected result, diagnostic, or runtime symptom must be reproduced, isolated, or explained."
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
skill-type: operation
---

# Python Debugging

Python Debugging reproduces, isolates, and explains one Python failure, unexpected result, diagnostic, or
runtime symptom. It returns a verified causal explanation, a bounded diagnostic plan when reproduction is
not possible, or an exact block; it does not turn an untested guess into a code change.

The operation owns the symptom, its environment, the smallest reproducer, discriminating observations, and
the diagnosis handoff. Project configuration selects concrete commands and tools. `python-development` owns
an implementation change, and `python-testing` owns the design and strength of executable correctness evidence.

## Principles

### Preserve the reported behavior

The original expected and observed behavior, inputs, interpreter, environment, and project configuration are
part of the symptom. A different run is new evidence, not a replacement for the report.

### Prefer evidence that separates causes

Collect the smallest observation that makes leading causes predict different outcomes. A stack trace, log, test
failure, or warning is useful only when its relation to a cause is explicit.

### Diagnose before repairing

The root cause is the earliest cause whose removal would end the symptom. A correlation, contributing condition,
or workaround is not a root cause.

## Rules

- **MUST bind one symptom before reproducing it.** Record expected and observed behavior, inputs, affected
  consumer, interpreter and environment facts, configuration, and the project-selected reproducer or its absence.
- **MUST keep execution and collected output bounded.** Name the command, input, duration or repetition bound,
  allowed output location, protected data handling, and stop condition before running a diagnostic.
- **MUST test leading causes with discriminating evidence.** Change one relevant condition at a time and preserve
  the observation that excludes or supports each cause.
- **MUST hand off a causal diagnosis, bounded plan, or exact block.** Include the smallest reproducer, evidence
  limits, affected obligation, and the owner of any next implementation or test work.
- **NEVER change project source, suppress a symptom, or claim a cause from correlation alone.** Stop instead when
  safe reproduction, required access, or sufficient evidence is unavailable.

## Procedure

### Phase 1 — Bind the Diagnostic Contract

#### 1.1 Preserve the symptom and context

- Record the report separately from later observations: expected behavior, observed behavior, error or diagnostic,
  affected consumer, inputs, relevant time or state, and the first known successful or failing boundary.
- Inspect the project configuration, interpreter selection, dependency and environment facts, relevant source,
  existing evidence, and applicable operational bounds. Redact protected values instead of copying them into a
  diagnostic record.
- Bind the project-selected reproducer command or name why none exists. State its working directory, inputs,
  expected observation, duration or repetition limit, permitted output paths, and conditions that require a stop.

#### 1.2 Choose a safe diagnostic path

- Keep project source read-only. Identify any disposable diagnostic output, its retention owner, and the authority
  needed for an external service, download, credential, or unbounded process; do not infer that authority.
- List the smallest set of plausible leading causes. For each, choose an observation that would distinguish it
  from at least one other cause, such as a controlled input, configuration fact, traceback, structured log, or
  existing test result.
- If a needed condition cannot be safely reproduced, retain the symptom and return a bounded diagnostic plan or
  exact block rather than widening execution or inventing a substitute environment.

### Phase 2 — Reproduce and Isolate

#### 2.1 Run the bounded reproducer

- Recheck the interpreter, configuration, input, execution limit, output boundary, and required authority before
  running the bound project command.
- Record the command identity, environment facts, input identity, observed result, and first useful diagnostic.
  Preserve the smallest reproducer that still reaches the original symptom.
- If the symptom does not recur, record the mismatch without changing the original report. Continue only with a
  listed discriminating observation; otherwise return a bounded non-reproduction plan.

#### 2.2 Test the causal chain

- Use the chosen observations to eliminate or support leading causes. Keep unrelated variables stable, and state
  which observation changed and what each remaining cause predicted.
- Trace from the symptom through the discriminating observations to the earliest cause that explains it. Mark
  contributing conditions and unresolved assumptions separately from the causal chain.
- Stop with an exact block when the chain still depends on missing evidence. Do not broaden logs, inputs, access,
  or execution merely to produce a more persuasive-looking record.

### Phase 3 — Return a Verifiable Handoff

#### 3.1 State the diagnostic result

- Return exactly one result: a reproduced causal explanation, a bounded diagnostic plan, or an exact block.
- Include the original symptom, smallest reproducer, relevant interpreter and configuration facts, discriminating
  observations, causal chain or missing evidence, evidence limits, retained diagnostic outputs, and stop reason.
- Separate a proposed repair from the diagnosis. A repair remains an unverified candidate until its owner studies,
  implements, and verifies it.

#### 3.2 Route the next work

- Hand a verified implementation need to `python-development` and an evidence-design need to `python-testing`.
  Carry only the facts those operations need; do not define their policy or outcomes.
- When configuration or tool behavior is the unresolved cause, request the applicable project-selected facts
  through `python-toolchain` rather than assuming a default interpreter, installer, runner, or debugger.
- Retain the smallest approved diagnostic record and name the first recovery action when the result is blocked.

## References

- [Evaluation checklist](checklists.md) supplies local unchecked evaluation conditions.
- [Python exceptions](https://docs.python.org/3/tutorial/errors.html) describes exception reporting and handling.
