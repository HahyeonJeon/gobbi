# Code Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Code artifacts and code changes<br>
> **Applicability:** General code self-review and evaluation; the applying operation binds the exact artifact, revision, and behavior under review<br>
> **Purpose:** Provide baseline coverage for code quality during Execution self-review and independent Evaluation before target-specific items are added<br>
> **Scope:** Project fit, affected surfaces, architecture, patterns, interfaces, complexity, modularity, reuse, implementation quality, correctness, verification, delivery, consumer use, operation, and evolution<br>
> **Exclusions:** Language-, framework-, platform-, domain-, security-, accessibility-, and performance-specific expectations not activated by the target<br>
> **Governing sources:** [Evaluation](../../evaluation/SKILL.md), [Checklist](../../checklist/SKILL.md), [Principles](../../principles/SKILL.md), [Execution](../SKILL.md), the accepted work contract, and applicable project, language, platform, or domain sources<br>
> **Context:** Apply the governing sources and target behavior current at the bound review state. Apply Product Lifecycle items only when the code participates in an operating app, service, library, or comparable product.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Project Fit

#### The code conflicts with the project's purpose, design, or accepted boundary

- [ ] The implemented behavior does not trace to a current requirement or accepted decision.
- [ ] The code adds behavior outside the accepted scope.
- [ ] The code adds an implementation mechanism outside the accepted scope.
- [ ] A file, module, or package conflicts with the project's accepted ownership boundary.
- [ ] A dependency conflicts with the project's accepted architecture or dependency direction.
- [ ] Names, domain terms, or conventions conflict with their governing project source.

### Affected Surfaces

#### The change leaves consistency-bound project surfaces in conflict

- [ ] Code and its callers express different versions of the same contract.
- [ ] Tests, documentation, configuration, types, schemas, or generated artifacts remain stale after the change.
- [ ] A changed behavior leaves another implementation of the same project rule inconsistent.
- [ ] The affected people, systems, interfaces, or dependencies cannot be identified from the change and its governing sources.

## Design and Development Lifecycle

### Architecture

#### Responsibilities, dependencies, or ownership are placed in the wrong part of the system

- [ ] A unit owns materially unrelated responsibilities.
- [ ] One responsibility is divided across units without a clear owner.
- [ ] State or data ownership is unclear across boundaries.
- [ ] Resource lifetime ownership is unclear across boundaries.
- [ ] Failure ownership is unclear across boundaries.
- [ ] A failure in one concern spreads into unrelated concerns because their boundaries are coupled.

### Patterns

#### A pattern or abstraction does not fit the current problem

- [ ] A design pattern conflicts with the project's accepted design or required behavior.
- [ ] A pattern adds layers, indirection, or lifecycle complexity without solving a current requirement.
- [ ] A pattern hides control flow, data flow, state, or failure behavior that callers need to understand.

### Interfaces

#### The interface makes correct use unnecessarily difficult to learn or perform

- [ ] Interface names obscure ordinary use.
- [ ] Inputs or outputs make ordinary use unclear.
- [ ] Required operation ordering is unclear.
- [ ] Parameter order, defaults, modes, or representations are easy to misread.
- [ ] The interface permits invalid states that it could prevent or represent clearly.
- [ ] Side effects or lifetime obligations are hidden from the caller.
- [ ] Error or recovery expectations are hidden from the caller.
- [ ] Related operations use inconsistent names or interaction patterns for the same concept.

#### The interface exposes unnecessary knowledge or decisions

- [ ] A caller must study private implementation details or unrelated modules to use the interface correctly.
- [ ] Ordinary use requires a decision that the implementation can own without reducing useful control.
- [ ] The interface exposes implementation details that do not belong to its consumer contract.
- [ ] Overlapping entry points leave the intended choice unclear.
- [ ] Public exposure of an internal detail makes compatible change needlessly difficult.

### Complexity

#### The implementation is harder to understand or change than its domain requires

- [ ] Avoidable control flow or state makes behavior difficult to trace.
- [ ] Avoidable coupling, duplication, or indirection makes change difficult to reason about.
- [ ] One behavior is scattered across more layers or files than its current needs require.
- [ ] Mutable state or implicit control flow obscures the result of an operation.
- [ ] Local behavior requires tracing distant, unrelated dependencies.
- [ ] Necessary domain complexity is mixed with accidental implementation complexity instead of being isolated.

#### Speculative complexity expands the system before it is needed

- [ ] An unused abstraction enlarges the implementation.
- [ ] An unused configuration option enlarges the implementation.
- [ ] A fallback has no current requirement.
- [ ] A compatibility path has no current requirement.
- [ ] A generic mechanism has too little current use to justify its concepts and constraints.
- [ ] A forwarding layer adds no ownership, policy, transformation, or stable boundary.
- [ ] A hypothetical future variant drives the current design without present evidence.

### Modularity and Reuse

#### Module boundaries do not match ownership and change

- [ ] Code that changes together is split across units that require repeated coordinated edits.
- [ ] Concerns that can change independently share one boundary and force unrelated edits.
- [ ] A module exposes more surface than its consumers need.
- [ ] A unit cannot be understood or verified without bringing in unrelated parts of the system.
- [ ] A dependency cycle makes ownership or change order unclear.

#### Reuse creates either duplication or forced generality

- [ ] Multiple current consumers duplicate the same behavior or domain rule without one clear owner.
- [ ] Copied implementations are expected to stay consistent but can drift independently.
- [ ] A shared abstraction branches by consumer because it combines different responsibilities.
- [ ] Reuse forces unrelated consumers to coordinate changes that should remain independent.
- [ ] An abstraction is generalized for possible consumers rather than current shared behavior.

### Implementation Quality

#### The code obscures its intent or governing model

- [ ] A name hides or misstates the responsibility, value, state, or effect it represents.
- [ ] The same concept uses conflicting vocabulary across nearby code and interfaces.
- [ ] A comment or docstring conflicts with the behavior it describes.
- [ ] Comments restate syntax while a non-obvious reason, constraint, or trade-off remains unexplained.
- [ ] Dead, obsolete, unreachable, or unused code remains in the affected surface.
- [ ] A literal, condition, or special case hides an important invariant or domain rule.

### Correctness

#### Required behavior or failure handling is incomplete

- [ ] Ordinary valid use produces a result that conflicts with the governing contract.
- [ ] An alternative valid path is rejected or handled as though it were invalid.
- [ ] Invalid input or state is accepted without required rejection or containment.
- [ ] A boundary or state transition violates an invariant.
- [ ] A failure or partial failure leaves state or resources inconsistent or unrecoverable.
- [ ] An error is lost or transformed so that callers cannot respond correctly.

### Verification

#### Verification does not establish the delivered behavior

- [ ] A changed observable behavior lacks a direct applicable check.
- [ ] A relevant boundary, transition, failure, or recovery path lacks verification evidence.
- [ ] A check asserts an incidental implementation detail instead of the governing behavior.
- [ ] Verification ran against a different tree, artifact, configuration, or state than the evaluated target.
- [ ] A skipped, disabled, suppressed, or missing check hides a relevant result.
- [ ] Important behavior is inseparable from side effects that prevent proportionate focused verification.

### Delivery

#### The delivered result does not preserve the verified implementation

- [ ] A generated, built, packaged, installed, or deployed artifact changes verified behavior.
- [ ] The delivered result cannot be reproduced from its recorded configuration and dependencies.
- [ ] The handoff does not identify the exact delivered result.
- [ ] The handoff omits an operating condition needed to use the delivered result.
- [ ] The handoff omits information needed to recover the delivered result.
- [ ] A delivery failure leaves neither the previous result nor the new result safely usable.

## Product Lifecycle

### Consumer Use

#### Consumers face avoidable learning or use burden

- [ ] A consumer cannot complete an ordinary task from the public interface and its immediate guidance.
- [ ] Similar tasks require conflicting mental models or interaction patterns.
- [ ] A common task requires unnecessary steps, options, or implementation knowledge.
- [ ] Feedback does not make the result or current state clear.
- [ ] Failure information does not support a safe next action or recovery.

### Operations

#### Runtime behavior is difficult to observe, support, or recover

- [ ] A material failure cannot be distinguished from ordinary behavior using available diagnostics.
- [ ] Different failures that require different responses appear indistinguishable.
- [ ] Partial failure is invisible while the system remains in a degraded state.
- [ ] Cleanup, retry, resume, rollback, or recovery behavior leaves state uncertain.
- [ ] Diagnostic output omits context needed for support.

### Evolution

#### Change breaks a supported consumer or product lifecycle

- [ ] Established public behavior changes without an explicit compatibility decision.
- [ ] A deprecated, replaced, or removed capability leaves consumers without a supported transition.
- [ ] Persisted or exchanged data changes without required migration or compatibility handling.
- [ ] Public behavior conflicts with current documentation, examples, configuration, or version promises.
- [ ] Product retirement leaves consumers without a supported exit.
- [ ] Product retirement leaves retained state without a defined disposition.
