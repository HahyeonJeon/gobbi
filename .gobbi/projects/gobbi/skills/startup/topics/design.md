# Design Topics

Use this direct phase bank to prepare evidence-backed Design questions for the current subject. Keep Project,
Product, and Implementation decisions at their owning level.

## Project

- [owned-outcome] What complete result is the Project responsible for delivering?

- [responsibility-boundary] Where does the Project's responsibility begin and end?

- [explicit-non-goal] Which plausible capabilities are explicitly outside the Project's current scope?

- [manual-boundary] Which tasks will intentionally remain manual rather than being performed by any Product?

- [scope-change-evidence] What evidence would justify adding work that is currently outside Project scope?

- [irreversible-boundary] Which Project scope or responsibility decision would be most costly to change later?

- [context-actors] Which people, organizations, Products, or external systems exchange information with the Project?

- [information-direction] For each important kind of information, who or what sends it, and who or what receives it?

- [coupling-risk] Which Products or external systems must remain easy to change independently to avoid the greatest future cost?
  - **Example:** For example, changing one Product should not force an unrelated Product release.

- [architecture-change-evidence] What new evidence would justify changing the cross-Product design?

- [state-authority] If Products or external systems disagree about Project status or data, which source is authoritative?
  - **Example:** For example, one source decides status while another only caches it.

- [data-lifecycle] What must happen to Project data from creation or collection through use, storage, retention, and deletion?

- [application-deliverable-inventory] Which independently useful Products does the Project own?
  - **Example:** For example, list two independently useful deliverables separately.

- [quality-priority] When important Project qualities conflict, which one must take priority?

- [build-buy-adopt] Which Project capabilities will be built, bought, or adopted, and why?

- [project-differentiation] Which capability or outcome must remain differentiated rather than delegated to a commodity dependency?

- [strategy-non-goal] Which attractive product or technical direction is deliberately excluded from the Project strategy?

- [strategy-tradeoff] Which quality or capability tradeoff does the strategy accept, and what protects the losing side?

- [strategy-change-evidence] What evidence would require the Project to change its solution strategy?

- [roadmap-horizon] Which outcome defines each Project horizon without prescribing implementation tasks?
  - **Example:** For example, name the next outcome, not its implementation tasks.

- [roadmap-dependency] Which evidence, decision, external system, or earlier outcome must exist before each horizon can start?

- [roadmap-validation-gate] What observable evidence permits the Project to advance from each horizon?

- [roadmap-capacity] Which people, time, money, or operating-capacity assumptions bound each horizon?

- [roadmap-irreversible-decision] Which costly-to-reverse decision must be delayed, tested, or explicitly accepted in each horizon?

- [roadmap-replan-trigger] Which observation requires the Project horizon plan to be revised?

- [roadmap-stop-trigger] Which observation requires a horizon or the Project to stop?

## Product

- [stable-boundary] Which Product connection or consumer-facing behavior must remain stable when its Implementation changes?
  - **Example:** For example, callers depend on a behavior, not its storage.

- [web-runtime-boundary] For a web Product, which work must occur in the consumer's browser?

- [data-processing-model] How should a data Product produce its result—as data arrives, in scheduled batches, or on demand?

- [application-deliverable-type] Which accepted Product-type evidence establishes this Product's type and complete outcome?

- [building-block-inventory] Which registered stable identity names this Product's single complete Implementation?

- [building-block-parent] Which accepted Product identity owns that registered Implementation?

- [interface-type] How will each main consumer interact with this Product?
  - **Example:** For example, distinguish a person’s command from a programmatic call.

- [domain-concepts] Which Product-specific ideas and terms must have the same meaning in every interface?

- [representative-users] Which intended consumers should test the most uncertain Product-use assumption?

- [representative-tasks] Which realistic Product tasks should those consumers attempt?

- [design-reference] Which existing Product or interface demonstrates an approach worth following?

- [reference-rejection] Which apparently relevant Product or interface should not guide this design?

## Implementation

- [runtime-units] Which major runtime units execute independently within this Implementation?
  - **Example:** For example, identify processes that can fail independently.

- [unit-responsibility] What responsibility does each runtime unit own?

- [primary-runtime-path] Which runtime units handle the Product's main result from start to finish?
  - **Example:** For example, trace a request from entry to the returned result.

- [background-path] Which unattended work must succeed for the Product result to be correct?

- [failure-containment] Which runtime unit must prevent one failure from affecting other units or consumers?

- [runtime-recovery] Which Implementation state must be restored before normal runtime work can continue?

- [programming-languages] Which programming languages must this Implementation use or continue to support?

- [frameworks] Which frameworks must this Implementation use or remain compatible with?

- [runtimes] Which execution runtimes must this Implementation run on?

- [data-stores] Which databases or other data stores must this Implementation use or remain compatible with?

- [building-block-responsibility] What responsibility, boundary, interface, owner, deployment need, and quality obligation does this complete Implementation have?

- [technology-category] For each stack entry, is it a framework, runtime, engine, datastore, table format, protocol, platform, infrastructure, external service, library, language, or toolchain?

- [technology-assignment] Which Implementation responsibility uses each technology or language entry?

- [technology-rationale] What evidence, constraint, and tradeoff justify each material stack entry?
