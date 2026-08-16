# Operation Skill Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** Operation skills authored or substantively revised through Operation Skill<br>
> **Applicability:** One complete current operation skill and its accepted standard operating procedure design; Evaluation binds the exact files, bytes, actor, trigger, and intended result under review<br>
> **Purpose:** Evaluate whether an operation skill provides one complete, straightforward, and directly executable standard operating procedure (SOP)<br>
> **Scope:** SOP boundary, phases, steps, substeps, execution order, conditions, authority, failures, recovery, completion, handoffs, and supporting guidance<br>
> **Exclusions:** Shared Gobbi Skill requirements; correctness of external tool or domain facts beyond their use in the SOP; execution results; operating product behavior<br>
> **Governing sources:** [Checklist](../../checklist/SKILL.md), [Gobbi Skill](../SKILL.md), [Operation Skill](SKILL.md), the accepted SOP design, and the operation's governing owners<br>
> **Context:** Apply the [Gobbi Skill checklist](../checklist.md) in parallel. Evaluate Procedure as the core and add operation-specific items after study.<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Project Lifecycle

### SOP Boundary

#### The operation begins or ends from an incomplete contract

- [ ] The actor cannot be identified.
- [ ] The trigger cannot be identified.
- [ ] The starting state cannot be identified.
- [ ] Completion evidence cannot be identified.
- [ ] A required precondition is absent.
- [ ] A required input is absent.
- [ ] A required authority boundary is absent.
- [ ] A required trust boundary is absent.
- [ ] A required output is absent.
- [ ] A material side effect is absent.
- [ ] A material non-goal is absent.
- [ ] A required handoff boundary is absent.
- [ ] A material control decision has no owner.

#### The target does not represent one operation

- [ ] Procedure contains separate operations that need independent classification.
- [ ] Procedure contains separate operations that need different policy owners.
- [ ] The target is primarily direct tool lookup rather than ordered work.
- [ ] The target is primarily consistency guidance rather than ordered work.
- [ ] The target is primarily domain navigation rather than ordered work.

## Design and Development Lifecycle

### SOP Structure

#### Procedure does not provide the required phase-to-step-to-substep path

- [ ] Procedure is not the dominant section.
- [ ] A top-level Manual competes with Procedure.
- [ ] A Phase heading does not use the numbered `Phase N — {Stage}` form.
- [ ] A Step heading does not use a decimal `N.N {Action or decision}` form.
- [ ] A Step body uses a structure other than direct substep bullets.
- [ ] A required operating stage has no Phase.
- [ ] One Phase combines stages with different prerequisites.
- [ ] One Phase combines stages with different responsibilities.
- [ ] One Phase combines stages with different state transitions.
- [ ] A Phase appears outside execution order.
- [ ] A Step appears outside execution order within its Phase.
- [ ] A Step combines primary actions that can complete independently.
- [ ] A Step combines primary decisions that can resolve independently.
- [ ] A Step has more than three direct substeps.
- [ ] A substep has more than two sentences.
- [ ] A substep delays its direct instruction behind explanation.
- [ ] A second substep sentence supplies content other than a necessary condition, branch, or confirmation.

### Execution Path

#### The SOP path is indirect, narrative, or needlessly complex

- [ ] A required normal path is absent.
- [ ] An alternative or exception appears before the normal path it modifies.
- [ ] A branch is separated from its triggering condition.
- [ ] A structural unit changes no executable result.
- [ ] Narrative setup interrupts the executable path.
- [ ] Chronological retelling interrupts the executable path.
- [ ] Conversational transitions interrupt the executable path.
- [ ] Repeated rationale interrupts the executable path.
- [ ] Needless nesting makes the reader reconstruct execution order.
- [ ] Repeated context makes the reader reconstruct execution order.

### Operational Coverage

#### The SOP omits a supported condition, failure, recovery, or completion path

- [ ] A required alternative path is absent.
- [ ] A required failure path is absent.
- [ ] A required retry path is absent.
- [ ] A required rollback path is absent.
- [ ] A required recovery path is absent.
- [ ] A required stop path is absent.
- [ ] An irreversible action lacks its required authority at the point of use.
- [ ] An externally visible action lacks its required confirmation at the point of use.
- [ ] A write lacks its applicable access boundary.
- [ ] A write lacks its applicable output path.
- [ ] A Step can appear complete without the evidence needed to continue.
- [ ] A Step can appear complete without the evidence needed to return.
- [ ] A failure path loses state needed for safe recovery.
- [ ] A failure path loses information needed for safe recovery.
- [ ] A handoff omits a required input.
- [ ] A handoff omits a required output.
- [ ] A handoff omits its owner.
- [ ] A handoff omits its stopping boundary.

### Supporting Guidance

#### Supporting sections compete with or weaken the executable SOP

- [ ] A Principle contains ordered work that belongs in Procedure.
- [ ] A Rule contains ordered work that belongs in Procedure.
- [ ] Procedure repeats policy already owned by a Rule.
- [ ] Procedure repeats policy already owned by an internal reference.
- [ ] Large tool setup remains inline without an independent owner.
- [ ] Large named-tool guidance remains inline without an independent owner.
- [ ] Large troubleshooting guidance remains inline without an independent owner.
- [ ] A compact tool fact is separated from the Step that consumes it without improving lookup.
- [ ] The Intro introduces operating content absent from Procedure.
- [ ] A supporting section introduces operating content absent from Procedure.

## Product Lifecycle

No supported coverage for this lifecycle.
