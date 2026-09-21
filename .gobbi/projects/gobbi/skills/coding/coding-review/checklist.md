# Coding Review Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Code artifacts and code changes<br>
> **Applicability:** General Coding Review, Execution self-review, and independent review; the applying operation binds the exact artifact, revision, behavior, and affected surfaces under review<br>
> **Purpose:** Provide one language-independent baseline for category-by-category code review across the project, design and development, and conditional product lifecycles<br>
> **Scope:** Project Fit, Affected Surfaces, Project Structure, Architecture, Design Pattern, Abstraction, Data Model, Public API, Parameters, Modularization, Reusability, Performance, Optimization, Unintended Overengineering, Code Complexity, Readability, Vocabulary, Naming Convention, Docstring, Correctness, Testing, Verification, Delivery, Usability, Operations, and Compatibility<br>
> **Exclusions:** Language-, framework-, platform-, domain-, and specialist-specific expectations unless the applying operation activates their owning source; Security, Privacy, Concurrency, Accessibility, Localization, Dependencies, Build, Packaging, Release, Deployment, Configuration, Observability, Migration, Deprecation, and Retirement remain overlays<br>
> **Governing sources:** [Coding Review](SKILL.md), [Checklist](../../checklist/SKILL.md), [Principles](../../principles/SKILL.md), [Coding Execution](../coding-execution/SKILL.md), the accepted work contract, and applicable project, language, platform, domain, or specialist sources<br>
> **Context:** Apply the governing sources and target behavior current at the bound review state. Apply Product Lifecycle items only when the code participates in an operating app, service, library, or comparable product.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### Project Fit

#### The code work lacks accepted project direction or control

- [ ] The code work has no current purpose or intended result.
- [ ] The accepted scope of the code work is unclear.
- [ ] The code work has no observable completion condition.
- [ ] The implemented behavior conflicts with the accepted project purpose.
- [ ] The implemented behavior satisfies the form of an accepted decision while missing its intended result.
- [ ] The code conflicts with an applicable project rule, decision, or governance constraint.
- [ ] An accepted project baseline changes without a traceable change-control decision.
- [ ] A project result remains presented as current after it becomes temporary, superseded, or archived.

### Affected Surfaces

#### The change leaves affected work unknown or inconsistent

- [ ] A material affected surface cannot be identified from the change and its governing sources.
- [ ] Code and one of its callers express different versions of the same contract.
- [ ] A material consistency-bound surface remains stale after the change.
- [ ] Two implementations of the same project rule remain inconsistent after the change.

#### Affected work cannot be coordinated

- [ ] Coordination ownership or handoff is unclear for a material affected surface.
- [ ] Affected owners have conflicting coordination expectations.

## Design and Development Lifecycle

### Project Structure

#### Project layout is incoherent or misleading

- [ ] Code placement conflicts with the project's accepted structural convention.
- [ ] One file combines code with independent ownership or change reasons.
- [ ] A coherent unit is fragmented across files without a project reason.
- [ ] Code ordering inside a file conflicts with the project's accepted structure.
- [ ] Code visibility does not match its structural owner.
- [ ] The source, generator, inputs, output location, or regeneration owner is unclear for generated or derived code.

#### Refactoring leaves the project structure worse

- [ ] A refactoring leaves duplicated or obsolete code locations.
- [ ] A refactoring fragments one structural owner across misleading locations.
- [ ] A refactoring leaves the declared structure inconsistent with the actual ownership boundary.

### Architecture

#### Responsibilities, dependencies, or ownership sit in the wrong boundaries

- [ ] A system unit owns materially unrelated responsibilities.
- [ ] One responsibility is divided across units without a clear owner.
- [ ] A dependency points against the accepted responsibility direction.
- [ ] State or data ownership is unclear across system boundaries.
- [ ] Resource lifetime ownership is unclear across system boundaries.
- [ ] Failure ownership is unclear across system boundaries.
- [ ] A failure in one concern spreads into an unrelated concern because their boundaries are coupled.
- [ ] Responsibilities that must succeed or fail as one consistency unit are split across boundaries without one transaction or recovery owner.

### Design Pattern

#### A design pattern does not fit the current problem

- [ ] A recognizable design pattern conflicts with the accepted design.
- [ ] A design pattern hides control, data, state, or failure flow that its consumers must understand.
- [ ] Participants in one design pattern follow conflicting roles or lifecycle rules.

### Abstraction

#### A concept boundary hides or exposes the wrong details

- [ ] An abstraction leaks a private implementation detail into its consumer contract.
- [ ] One abstraction combines concepts with independent meanings or change reasons.
- [ ] Consumer-specific branching makes one abstraction serve conflicting concepts.
- [ ] An abstraction hides an invariant, effect, state, or failure that consumers must reason about.
- [ ] The abstraction level forces current consumers to work above or below the concept boundary they need.

### Data Model

#### The data model cannot preserve required domain meaning and invariants

- [ ] The data model cannot represent a required domain state or relationship.
- [ ] The data model represents a state or relationship that the domain forbids.
- [ ] Identity is missing, unstable, or ambiguous where behavior or references depend on it.
- [ ] One fact has multiple independently writable representations that can disagree.
- [ ] The data model collapses distinct absence, default, unknown, and invalid states that behavior must distinguish.

### Public API

#### The public entry surface makes correct use hard

- [ ] Public entry points do not make the ordinary use path clear.
- [ ] A public operation does not distinguish completion states that require different consumer responses.
- [ ] Required public operation ordering is unclear.
- [ ] Ownership, mutation, lifetime, cleanup, or retry obligations for public data, resources, and effects are hidden from the consumer.
- [ ] Public failure or recovery behavior is hidden from its consumer.
- [ ] Overlapping public entry points leave the intended choice unclear.
- [ ] A caller must inspect private implementation details to use the public surface correctly.

### Parameters

#### Parameters make valid calls hard to express correctly

- [ ] A parameter makes the caller supply a decision that the implementation already owns.
- [ ] Parameter order makes distinct values easy to exchange accidentally.
- [ ] A parameter name does not identify the decision or value the caller supplies.
- [ ] Related parameter values are grouped in a way that permits contradictory combinations.
- [ ] A parameter type or representation admits states outside the accepted input model.
- [ ] Parameter validation occurs outside the boundary that owns the input contract.
- [ ] A parameter default or omission changes behavior in a way the caller cannot predict.
- [ ] A mode parameter combines behaviors with different contracts in one call surface.
- [ ] A parameter does not identify the unit, encoding, normalization, or reference frame needed to interpret its value.
- [ ] A parameter representation collapses absent, default, unknown, and invalid caller states that the operation must distinguish.

### Modularization

#### Unit boundaries do not match cohesive ownership and change

- [ ] Code that changes together is split across units that require repeated coordinated edits.
- [ ] Independently changing concerns share one unit and force unrelated edits.
- [ ] A unit exposes more surface than its consumers need.
- [ ] A unit cannot be understood or tested without unrelated parts of the system.
- [ ] A dependency cycle makes unit ownership or change order unclear.

### Reusability

#### Shared behavior has no stable, proportionate owner

- [ ] Current consumers duplicate one behavior or domain rule in implementations that must agree but can drift independently.
- [ ] Shared code branches by consumer because it combines different responsibilities.
- [ ] Reuse forces independent consumers to coordinate unrelated changes.

### Performance

#### Observable resource behavior fails a current need

- [ ] Measured latency exceeds a current representative need.
- [ ] Measured processing capacity falls below a current representative need.
- [ ] Measured resource use violates a current budget or supported operating range.
- [ ] A change regresses a representative performance baseline.

### Optimization

#### An attempted optimization is not justified by its observed effect

- [ ] The optimization uses a measurement frame that does not represent the current need.
- [ ] The optimization has no demonstrated benefit on its target workload.
- [ ] The optimization shifts material cost outside its target workload.
- [ ] The optimization's measured benefit is disproportionate to its added non-performance cost.

### Unintended Overengineering

#### A mechanism has no support from current requirements or observed need

- [ ] A structural boundary has no current requirement or current consumer.
- [ ] An optional behavior or configuration surface has no current need.
- [ ] A fallback has no current requirement or observed failure to handle.
- [ ] A compatibility path has no current supported consumer or version.
- [ ] A generic mechanism or future variant is shaped around hypothetical consumers rather than current use.
- [ ] A forwarding layer adds no ownership, policy, transformation, or stable boundary.
- [ ] A mechanism remains after its load-bearing current-need premise is disproved.
- [ ] A mechanism that serves no current execution or supported path remains in the affected surface.

### Code Complexity

#### Required behavior is harder to reason about than its domain requires

- [ ] Avoidable control flow makes behavior difficult to trace.
- [ ] Avoidable mutable state makes an operation's result difficult to predict.
- [ ] Avoidable dependency structure makes a change difficult to reason about.
- [ ] One behavior is scattered across more units than its current domain needs.
- [ ] Local behavior requires tracing distant unrelated dependencies.
- [ ] Necessary domain complexity is mixed with accidental implementation complexity.

### Readability

#### Local code expression obscures behavior

- [ ] Dense or indirect expression makes local behavior difficult to follow.
- [ ] Local flow or ordering hides the sequence of effects.
- [ ] A local expression hides an important invariant or domain rule.
- [ ] Local formatting obscures code grouping or flow.
- [ ] An internal comment conflicts with the code it describes.
- [ ] Internal comments restate syntax while a non-obvious reason or constraint remains hidden.

### Vocabulary

#### Code uses an inaccurate or unstable domain vocabulary

- [ ] The same domain concept uses conflicting terms across nearby code and contracts.
- [ ] One term names different domain concepts in the affected surface.
- [ ] A term describes an accidental mechanism instead of the domain concept it represents.
- [ ] A term misstates the responsibility, state, value, or effect it names.

### Naming Convention

#### Identifiers violate the applicable naming owner

- [ ] An identifier violates the applicable casing or word-form convention.
- [ ] An abbreviation or spelling conflicts with the applicable project or language convention.
- [ ] A visibility or namespace name conflicts with the role of the identified code.
- [ ] Definitions and uses apply inconsistent names to the same program role.

### Docstring

#### Caller-facing contract documentation is missing or wrong

- [ ] A unit that requires a docstring has none.
- [ ] A docstring conflicts with the behavior it describes.
- [ ] A docstring omits a caller-relevant contract detail.
- [ ] A docstring restates the signature without explaining the caller contract.
- [ ] A docstring example no longer represents current behavior.

### Correctness

#### Required behavior or failure handling is incomplete

- [ ] Ordinary valid use produces behavior that conflicts with the governing contract.
- [ ] A materially different valid path is rejected or handled as invalid.
- [ ] Invalid input or state is accepted without the required rejection or containment.
- [ ] A boundary or state transition violates a required invariant.
- [ ] A failure leaves state inconsistent.
- [ ] Failure recovery does not restore the required state.
- [ ] An error is lost or transformed so its consumer cannot respond correctly.
- [ ] A prohibited state or effect can be reached by bypassing the expected path.
- [ ] A retried or repeated operation produces an unintended duplicate or conflicting effect.
- [ ] A multi-step state or data change exposes a partial result where the contract requires atomicity.
- [ ] A resource is acquired, retained, released, or restored outside its required lifetime on a supported terminal path.
- [ ] An operation reports completion before its required effect is complete or durably owned.
- [ ] Required behavior changes with time, ordering, randomness, locale, or environment without a contract for that variation.

#### A change fails to preserve required behavior

- [ ] A refactoring or maintenance change alters required observable behavior.

### Testing

#### Behavior and risk coverage is incomplete

- [ ] A material observable behavior lacks a direct applicable test.
- [ ] A materially different valid path with distinct behavior or risk lacks a direct test.
- [ ] An invalid or adversarial input, state, or operation with material side-effect risk lacks a direct test.
- [ ] A material boundary, state transition, time, ordering, concurrency, cancellation, or timeout behavior lacks a controlled test.
- [ ] A relevant failure or recovery path lacks a test.
- [ ] A regression-prone behavior lacks a test that distinguishes the prior defect.

#### Test code does not provide trustworthy, maintainable checks

- [ ] A test asserts an incidental implementation detail instead of governing behavior.
- [ ] A test fixture or test double does not represent the condition or real boundary contract named by the test.
- [ ] A test oracle cannot distinguish the expected result from a material wrong result.
- [ ] A test result depends on uncontrolled order, shared state, time, randomness, network, process state, or machine state.
- [ ] A skipped, disabled, or suppressed test hides a relevant result.
- [ ] Test setup obscures the behavior under test.
- [ ] A test can pass without executing the behavior it claims to verify.
- [ ] A retry, rerun, quarantine, or broad tolerance hides an unresolved intermittent test result.
- [ ] A test leaves a resource or shared state changed after a success, failure, skip, timeout, or cancellation path.

### Verification

#### Verification evidence cannot support the claimed result

- [ ] Verification ran against a different subject identity than the reviewed subject.
- [ ] The exact verification environment is not recorded.
- [ ] The exact verification tool identity is not recorded.
- [ ] The exact verification command identity is not recorded.
- [ ] The exact verification configuration identity is not recorded.
- [ ] A claimed verification step was not run.
- [ ] Verification output cannot be tied reproducibly to one complete execution.
- [ ] The claim extends beyond the paths, inputs, environments, modes, repetitions, or terminal results actually verified.
- [ ] A later passing run replaces rather than reconciles a conflicting earlier result.
- [ ] A verification result omits a relevant failure, flake, skip, quarantine, unavailable prerequisite, unsupported environment, or evidence limit.
- [ ] A cache, stale generated output, suppression, exclusion, or baseline can hide a material result from the recorded run.
- [ ] An applicable project-owned check for the affected surface is absent from the recorded verification evidence without a subject reason.

### Delivery

#### The handed-off result is not the reviewed and verified implementation

- [ ] A delivered artifact changes the reviewed behavior.
- [ ] The delivered result cannot be reproduced from its recorded dependencies and configuration.
- [ ] The handoff does not identify the exact delivered result.
- [ ] The handoff omits an operating condition needed to use the result.
- [ ] The handoff omits information needed to recover the result.
- [ ] A delivery failure leaves neither the prior result nor the new result safely usable.
- [ ] A required artifact, metadata file, schema, generated output, or runtime asset is absent from the delivered result.
- [ ] The artifact exercised in verification is not the exact artifact handed to its consumers.
- [ ] Build, package, release, deployment, live verification, and observed health are reported as one result.

## Product Lifecycle

Apply these categories only when the code participates in an operating app, service, library, or comparable
product. Detailed specialist mechanics remain in their activated overlay owner.

### Usability

#### Consumers face avoidable learning or use burden

- [ ] A consumer cannot complete an ordinary task from the public surface and its immediate guidance.
- [ ] Similar tasks require conflicting mental models or interaction patterns.
- [ ] A common task requires avoidable interaction or implementation knowledge.
- [ ] Feedback does not make the task result or current state clear.
- [ ] Failure information does not support a safe next action or recovery.

### Operations

#### Runtime behavior is difficult to observe, support, or recover

- [ ] A material failure cannot be distinguished from ordinary behavior with the available diagnostics.
- [ ] Failures that require different responses appear indistinguishable.
- [ ] Partial failure is invisible while the product remains degraded.
- [ ] Operators cannot determine whether recovery restored the required service, state, or data condition.
- [ ] Diagnostic output omits context needed for support.
- [ ] A supported operating configuration has an unclear runtime effect.
- [ ] A retry, fallback, or recovery loop has no attempt, time, or resource bound.
- [ ] A stalled or degraded operation has no bounded detection and safe recovery path.

### Compatibility

#### Change breaks a supported consumer or lifecycle transition

- [ ] A supported runtime, operating system, architecture, environment, or consumer integration stops working after the change.
- [ ] Established public behavior changes without an explicit compatibility decision.
- [ ] Public behavior conflicts with a supported version promise.
- [ ] Supported version combinations cannot operate together as required.
- [ ] A supported transition between versions breaks consumer behavior or prevents required stored or serialized data from remaining readable and valid.
- [ ] A supported replacement leaves consumers without a working transition.
- [ ] A supported exit leaves consumers without continuity or a defined state disposition.
