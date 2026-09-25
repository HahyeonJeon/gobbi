# Coding Ideation Checklist

> **Subject:** Coding Ideation work and complete indexed results<br>
> **Applicability:** General Coding Ideation evaluation with a current indexed result<br>
> **Governing sources:** [Coding Ideation](SKILL.md), [Coding Principles](../principles.md), and [`coding-object-oriented-programming`](../coding-object-oriented-programming/SKILL.md)<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Authority and Scope

#### The result and the user's authorization do not match

- [ ] A required choice is presented as settled with no recorded user or caller decision.
- [ ] The result records a design the user did not confirm.
- [ ] The result commits to an outcome outside the accepted scope.
- [ ] An accepted outcome has no treatment anywhere in the result.
- [ ] Private helpers, ordered tasks, file-level edits, recipes, code, or other realized output appear inside the design result.

## Design and Development Lifecycle

### Problem and Direction

#### The design answers an unsupported problem or an outcome no one can test

- [ ] The stated problem is not supported by the inspected current behavior or evidence.
- [ ] The desired outcome cannot be observed, so no one can tell whether the work succeeded.
- [ ] A required outcome names a solution that its own stated outcome does not require.

#### The direction was selected without a real comparison

- [ ] Only one direction was carried forward; no materially different alternative was compared.
- [ ] The options came from one agent, with no independent suggestion or critique and no stated evidence limit.
- [ ] An existing project pattern or applicable prior art bearing on the choice was not examined.
- [ ] The selected direction contradicts the recorded comparison and states no reason for the difference.

### Design Completeness

#### The consumer must invent design the result was supposed to decide

- [ ] A required choice is left open, so two competent consumers could build materially different results from the same result.
- [ ] Only the successful path is designed; alternative-valid, invalid, failure, and recovery behavior cannot be derived.
- [ ] A new or changed directory, file, public class, or public function lacks its Conceptual definition, Responsibility, Boundary, or Relationship.
- [ ] Behavior or surfaces that must stay unchanged are not identified.
- [ ] A security, performance, concurrency, compatibility, or observability constraint has no design treatment.
- [ ] A design level was decided before the level it depends on.
- [ ] A Design heading is empty, or it starts with none of `Inherited`, `Not applicable`, or `Material change`.
- [ ] The public contract a caller must use is not stated: inputs, outputs, errors, or invariants cannot be derived.
- [ ] A change to an existing contract does not state what breaks or what existing callers must do.

### Overengineering

#### The design adds mechanism that no present need requires

- [ ] A unit, layer, parameter, option, or variant serves no present requirement or current caller.
- [ ] A pattern, interface, or base class has no recorded present force or no recorded simpler form it replaces.
- [ ] A designed unit only forwards calls, wraps one use, or is a class that holds one stateless function when no caller or framework needs it to be a class.
- [ ] The design has more units, layers, or files than its requirements need.
- [ ] A new directory has no single conceptual definition, or holds one file and no project or framework layout requires it.
- [ ] A designed public entry point has a [learning depth](../principles.md#intuitive-public-api) greater than 2.

### Result Integrity

#### The result cannot be read as one current, self-consistent whole

- [ ] Two parts of the result give different answers to the same question, with no rule for which governs.
- [ ] The idea exists only in the discussion record; the authoritative parts do not state it.
- [ ] A decision's text appears in both a Discussion topic and a Design heading, or a topic does not link to the Design heading that holds its decision.
- [ ] An index-listed member is missing or unreadable.
- [ ] A result file sits below the output root's top level, or no index lists it.
- [ ] Current and superseded material cannot be told apart.

### Uncertainty

#### Unresolved uncertainty is presented as settled

- [ ] A load-bearing assumption is presented as established fact.
- [ ] Planned or intended validation is presented as completed evidence.
- [ ] A deferred choice leaves dependent design presented as final, with no condition for resuming it.
- [ ] A material risk, cost, or trade-off of an accepted decision is not stated.

## Product Lifecycle

No supported coverage for this lifecycle. Later use and change are absorbed by Design Completeness and Result Integrity.
