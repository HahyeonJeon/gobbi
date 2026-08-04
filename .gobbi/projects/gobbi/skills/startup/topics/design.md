# Design Topics

Use this direct phase bank to prepare evidence-backed Design questions for the current subject. Keep Project,
Product, and Implementation decisions at their owning level.

## Project

- [owned-outcome] What complete result is the Project responsible for delivering?
  - **Owner:** Project sponsor
  - **Purpose:** Fix the complete Project result
  - **Oracle:** Accepted scope names one complete result and accountable sponsor
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** owned-outcome

- [responsibility-boundary] Where does the Project's responsibility begin and end?
  - **Owner:** Project governance authority
  - **Purpose:** Set Project responsibility handoffs
  - **Oracle:** Each boundary names included duty, excluded duty, and receiving owner
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** responsibility-boundary

- [explicit-non-goal] Which plausible capabilities are explicitly outside the Project's current scope?
  - **Owner:** Project sponsor
  - **Purpose:** Exclude plausible capabilities from current scope
  - **Oracle:** Each non-goal is explicit and absent from accepted Product obligations
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** explicit-non-goal

- [manual-boundary] Which tasks will intentionally remain manual rather than being performed by any Product?
  - **Owner:** Project operations owner
  - **Purpose:** Decide which tasks remain manual
  - **Oracle:** Named tasks retain a human owner and no Product automation promise
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** manual-boundary

- [scope-change-evidence] What evidence would justify adding work that is currently outside Project scope?
  - **Owner:** Project sponsor
  - **Purpose:** Define evidence for scope expansion
  - **Oracle:** A stated observation triggers reconsideration under named authority
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** scope-change-evidence

- [irreversible-boundary] Which Project scope or responsibility decision would be most costly to change later?
  - **Owner:** Project sponsor
  - **Purpose:** Identify the costliest scope commitment
  - **Oracle:** Compared decisions identify one with highest reversal cost and basis
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** irreversible-boundary

- [context-actors] Which people, organizations, Products, or external systems exchange information with the Project?
  - **Owner:** Project architect
  - **Purpose:** Enumerate external actors and systems
  - **Oracle:** Every material information exchange has a named endpoint
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** context-actors

- [information-direction] For each important kind of information, who or what sends it, and who or what receives it?
  - **Owner:** Project data architect
  - **Purpose:** Define Project information flows
  - **Oracle:** Each important information kind has sender and receiver
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** information-direction

- [coupling-risk] Which Products or external systems must remain easy to change independently to avoid the greatest future cost?
  - **Owner:** Project architect
  - **Purpose:** Select independence seams that limit future cost
  - **Oracle:** Named Products/systems can change independently in an accepted scenario
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** coupling-risk
  - **Example:** For example, changing one Product should not force an unrelated Product release.

- [architecture-change-evidence] What new evidence would justify changing the cross-Product design?
  - **Owner:** Project architect
  - **Purpose:** Define evidence for cross-Product redesign
  - **Oracle:** One observable condition reopens the accepted architecture
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** architecture-change-evidence

- [state-authority] If Products or external systems disagree about Project status or data, which source is authoritative?
  - **Owner:** Project data authority
  - **Purpose:** Resolve conflicting Project state or data
  - **Oracle:** One authoritative source and conflict rule are named per state kind
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** state-authority
  - **Example:** For example, one source decides status while another only caches it.

- [data-lifecycle] What must happen to Project data from creation or collection through use, storage, retention, and deletion?
  - **Owner:** Project data steward
  - **Purpose:** Set Project-wide data handling stages
  - **Oracle:** Each data class has creation, use, retention, and deletion disposition
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** data-lifecycle

- [application-deliverable-inventory] Which independently useful Products does the Project own?
  - **Owner:** Project sponsor
  - **Purpose:** Fix the independently useful Product inventory
  - **Oracle:** Every accepted Product has distinct useful outcome and stable identity
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** application-deliverable-inventory
  - **Example:** For example, list two independently useful deliverables separately.

- [quality-priority] When important Project qualities conflict, which one must take priority?
  - **Owner:** Project sponsor
  - **Purpose:** Rank conflicting Project qualities
  - **Oracle:** A stated conflict selects one priority with rationale
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** quality-priority

- [build-buy-adopt] Which Project capabilities will be built, bought, or adopted, and why?
  - **Owner:** Project strategy authority
  - **Purpose:** Choose sourcing mode for Project capabilities
  - **Oracle:** Each material capability has one sourcing decision and evidence
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** build-buy-adopt

- [project-differentiation] Which capability or outcome must remain differentiated rather than delegated to a commodity dependency?
  - **Owner:** Project strategy authority
  - **Purpose:** Protect the Project's differentiated value
  - **Oracle:** Accepted strategy names value not delegated to a commodity dependency
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** project-differentiation

- [strategy-non-goal] Which attractive product or technical direction is deliberately excluded from the Project strategy?
  - **Owner:** Project strategy authority
  - **Purpose:** Exclude attractive but conflicting directions
  - **Oracle:** Each excluded direction has a stated strategic reason
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** strategy-non-goal

- [strategy-tradeoff] Which quality or capability tradeoff does the strategy accept, and what protects the losing side?
  - **Owner:** Project strategy authority
  - **Purpose:** Accept and mitigate a strategic tradeoff
  - **Oracle:** Winning quality, losing quality, and protection are explicit
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** strategy-tradeoff

- [strategy-change-evidence] What evidence would require the Project to change its solution strategy?
  - **Owner:** Project strategy authority
  - **Purpose:** Define evidence for strategy change
  - **Oracle:** A stated observation requires reconsidering the selected strategy
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** strategy-change-evidence

- [roadmap-horizon] Which outcome defines each Project horizon without prescribing implementation tasks?
  - **Owner:** Project roadmap authority
  - **Purpose:** Define outcome-based roadmap horizons
  - **Oracle:** Each horizon ends in an observable outcome, not a task list
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** roadmap-horizon
  - **Example:** For example, name the next outcome, not its implementation tasks.

- [roadmap-dependency] Which evidence, decision, external system, or earlier outcome must exist before each horizon can start?
  - **Owner:** Project roadmap authority
  - **Purpose:** Gate horizon start on prerequisites
  - **Oracle:** Every horizon prerequisite is present or explicitly unresolved
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** roadmap-dependency

- [roadmap-validation-gate] What observable evidence permits the Project to advance from each horizon?
  - **Owner:** Project roadmap authority
  - **Purpose:** Gate horizon advancement on evidence
  - **Oracle:** Named evidence satisfies the current horizon exit condition
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** roadmap-validation-gate

- [roadmap-capacity] Which people, time, money, or operating-capacity assumptions bound each horizon?
  - **Owner:** Project resource authority
  - **Purpose:** Bound each horizon by available capacity
  - **Oracle:** People/time/money/operations assumptions are quantified or bounded
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** roadmap-capacity

- [roadmap-irreversible-decision] Which costly-to-reverse decision must be delayed, tested, or explicitly accepted in each horizon?
  - **Owner:** Project roadmap authority
  - **Purpose:** Control costly decisions within horizons
  - **Oracle:** Each costly decision is delayed, tested, or explicitly accepted
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** roadmap-irreversible-decision

- [roadmap-replan-trigger] Which observation requires the Project horizon plan to be revised?
  - **Owner:** Project roadmap authority
  - **Purpose:** Define horizon replanning conditions
  - **Oracle:** A named observation triggers plan revision
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** roadmap-replan-trigger

- [roadmap-stop-trigger] Which observation requires a horizon or the Project to stop?
  - **Owner:** Project sponsor
  - **Purpose:** Define horizon or Project stopping conditions
  - **Oracle:** A named observation triggers stop review under accepted authority
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** roadmap-stop-trigger

## Product

- [stable-boundary] Which Product connection or consumer-facing behavior must remain stable when its Implementation changes?
  - **Owner:** Product contract owner
  - **Purpose:** Preserve Product contracts across stack change
  - **Oracle:** Contract behavior remains unchanged in a replacement-Implementation scenario
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** stable-boundary
  - **Example:** For example, callers depend on a behavior, not its storage.

- [web-runtime-boundary] For a web Product, which work must occur in the consumer's browser?
  - **Owner:** Product architect
  - **Purpose:** Allocate web work to browser or non-browser runtime
  - **Oracle:** Each material responsibility has one runtime side and evidence
  - **Activation evidence:** Accepted evidence classifies a Web Product or browser runtime and shows this Web contract applies.
  - **Source aliases:** web-runtime-boundary

- [data-processing-model] How should a data Product produce its result—as data arrives, in scheduled batches, or on demand?
  - **Owner:** Product architect
  - **Purpose:** Choose event, batch, or on-demand result production
  - **Oracle:** Accepted workload evidence selects a processing model
  - **Activation evidence:** Accepted evidence shows the Product produces data over time or on demand.
  - **Source aliases:** data-processing-model

- [application-deliverable-type] Which accepted Product-type evidence establishes this Product's type and complete outcome?
  - **Owner:** Product authority
  - **Purpose:** Confirm Product form and complete outcome
  - **Oracle:** Accepted type evidence matches Product identity and useful outcome
  - **Activation evidence:** Accepted software-type evidence determines the Product form and complete outcome; do not repeat the interview.
  - **Source aliases:** application-deliverable-type

- [building-block-inventory] Which registered stable identity names this Product's single complete Implementation?
  - **Owner:** Product registry authority
  - **Purpose:** Resolve the Product's single Implementation identity
  - **Oracle:** Exactly one registered Implementation key references the Product
  - **Activation evidence:** Accepted Product and Implementation registry evidence always determines the single Implementation identity.
  - **Source aliases:** building-block-inventory

- [building-block-parent] Which accepted Product identity owns that registered Implementation?
  - **Owner:** Product registry authority
  - **Purpose:** Confirm Implementation parentage
  - **Oracle:** Registered Implementation points to exactly this Product key
  - **Activation evidence:** Accepted Product and Implementation registry evidence always determines parentage.
  - **Source aliases:** building-block-parent

- [interface-type] How will each main consumer interact with this Product?
  - **Owner:** Product designer
  - **Purpose:** Choose consumer interaction modes
  - **Oracle:** Each main consumer has an accessible interface mode
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** interface-type
  - **Example:** For example, distinguish a person’s command from a programmatic call.

- [domain-concepts] Which Product-specific ideas and terms must have the same meaning in every interface?
  - **Owner:** Product domain authority
  - **Purpose:** Standardize concepts across interfaces
  - **Oracle:** Each shared term has one accepted definition in all interfaces
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** domain-concepts

- [representative-users] Which intended consumers should test the most uncertain Product-use assumption?
  - **Owner:** Product research owner
  - **Purpose:** Select consumers for assumption testing
  - **Oracle:** Selected participants match intended consumers and uncertain assumption
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** representative-users

- [representative-tasks] Which realistic Product tasks should those consumers attempt?
  - **Owner:** Product research owner
  - **Purpose:** Select realistic usability test tasks
  - **Oracle:** Each task exercises the uncertain Product-use claim end to end
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** representative-tasks

- [design-reference] Which existing Product or interface demonstrates an approach worth following?
  - **Owner:** Product designer
  - **Purpose:** Select evidence-backed interface prior art
  - **Oracle:** Reference demonstrates an applicable behavior or structure
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** design-reference

- [reference-rejection] Which apparently relevant Product or interface should not guide this design?
  - **Owner:** Product designer
  - **Purpose:** Exclude misleading interface prior art
  - **Oracle:** Rejected reference has a stated mismatch with Product needs
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** reference-rejection

## Implementation

- [runtime-units] Which major runtime units execute independently within this Implementation?
  - **Owner:** Implementation architect
  - **Purpose:** Define independently executing stack units
  - **Oracle:** Runtime evidence enumerates each independently executing unit
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** runtime-units
  - **Example:** For example, identify processes that can fail independently.

- [unit-responsibility] What responsibility does each runtime unit own?
  - **Owner:** Implementation architect
  - **Purpose:** Assign one responsibility to each runtime unit
  - **Oracle:** Every required runtime responsibility has one accountable unit
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** unit-responsibility

- [primary-runtime-path] Which runtime units handle the Product's main result from start to finish?
  - **Owner:** Implementation architect
  - **Purpose:** Trace the main Product result through runtime units
  - **Oracle:** A representative trigger traces to the observable Product result
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** primary-runtime-path
  - **Example:** For example, trace a request from entry to the returned result.

- [background-path] Which unattended work must succeed for the Product result to be correct?
  - **Owner:** Implementation architect
  - **Purpose:** Identify unattended work required for correctness
  - **Oracle:** Failure of named background work demonstrably changes Product correctness
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** background-path

- [failure-containment] Which runtime unit must prevent one failure from affecting other units or consumers?
  - **Owner:** Implementation reliability owner
  - **Purpose:** Set runtime fault-containment boundaries
  - **Oracle:** Injected or observed unit failure stays within accepted impact boundary
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** failure-containment

- [runtime-recovery] Which Implementation state must be restored before normal runtime work can continue?
  - **Owner:** Implementation reliability owner
  - **Purpose:** Define state required before runtime resumes
  - **Oracle:** Recovery evidence shows required state restored before normal processing
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** runtime-recovery

- [programming-languages] Which programming languages must this Implementation use or continue to support?
  - **Owner:** Implementation technical authority
  - **Purpose:** Select supported implementation languages
  - **Oracle:** Each language entry has responsibility, support need, and evidence
  - **Activation evidence:** Accepted evidence shows this stack category is materially present or under decision.
  - **Source aliases:** programming-languages

- [frameworks] Which frameworks must this Implementation use or remain compatible with?
  - **Owner:** Implementation technical authority
  - **Purpose:** Select required or compatible frameworks
  - **Oracle:** Each framework entry has responsibility, compatibility need, and evidence
  - **Activation evidence:** Accepted evidence shows this stack category is materially present or under decision.
  - **Source aliases:** frameworks

- [runtimes] Which execution runtimes must this Implementation run on?
  - **Owner:** Implementation technical authority
  - **Purpose:** Select execution runtimes
  - **Oracle:** Each runtime entry has workload responsibility and supported environment
  - **Activation evidence:** Accepted evidence shows this stack category is materially present or under decision.
  - **Source aliases:** runtimes

- [data-stores] Which databases or other data stores must this Implementation use or remain compatible with?
  - **Owner:** Implementation data architect
  - **Purpose:** Select required or compatible stores
  - **Oracle:** Each store has owned data responsibility and compatibility evidence
  - **Activation evidence:** Accepted evidence shows this stack category is materially present or under decision.
  - **Source aliases:** data-stores

- [building-block-responsibility] What responsibility, boundary, interface, owner, deployment need, and quality obligation does this complete Implementation have?
  - **Owner:** Implementation architect
  - **Purpose:** Define complete-stack responsibility and obligations
  - **Oracle:** Accepted design covers boundary, interface, owner, deployment, and quality
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** building-block-responsibility

- [technology-category] For each stack entry, is it a framework, runtime, engine, datastore, table format, protocol, platform, infrastructure, external service, library, language, or toolchain?
  - **Owner:** Implementation technical authority
  - **Purpose:** Classify each stack entry
  - **Oracle:** Every material entry maps to exactly one accepted category
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** technology-category

- [technology-assignment] Which Implementation responsibility uses each technology or language entry?
  - **Owner:** Implementation architect
  - **Purpose:** Assign each entry to a stack responsibility
  - **Oracle:** Every entry references at least one owned Implementation responsibility
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** technology-assignment

- [technology-rationale] What evidence, constraint, and tradeoff justify each material stack entry?
  - **Owner:** Implementation technical authority
  - **Purpose:** Justify each material stack entry
  - **Oracle:** Each entry has evidence, constraint, tradeoff, and reopen trigger
  - **Activation evidence:** Generally prepared; use accepted evidence when it already resolves this decision and ask only when unresolved.
  - **Source aliases:** technology-rationale
