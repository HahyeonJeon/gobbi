# Project Topics

A Project is the top-level service or initiative, including its operation and all Products. For example,
`Analytics Workspace` may own `Web Dashboard`, `CLI`, and `Data Platform` Products; this example explains
the level and does not require those Products.

## Problem Definition

Adapt these questions to the whole initiative, its service, and project-wide evidence. Keep Product-specific
consumer problems in the Product bank and stack-specific needs in the Implementation bank.

- [lifecycle-stage] What stage is the Project in now—for example, idea, prototype, active development, released, or maintenance?
- [authoritative-project-source] When Project sources disagree, which source has final authority over the Project's current purpose and direction?
- [last-problem-event] What happened in the most recent concrete occurrence of the Project-wide problem?
- [problem-cost] What measurable cost, delay, error, or other consequence resulted from that occurrence?
- [problem-frequency] How often does the Project-wide problem occur?
- [root-cause] What evidence supports the current root-cause explanation for the Project-wide problem?
- [deeper-cause-test] What observation would show that the stated cause is itself caused by a deeper problem?
- [why-now] What changed to make this the right time to act on the Project?
- [riskiest-assumption] Which Project assumption is most important to success and currently has the weakest evidence?
- [material-risk] Which risk could cause the greatest harm to the Project's intended result?
- [risk-warning] What is the earliest observable sign that the highest-consequence Project risk is beginning to occur?
- [risk-mitigation] What single action would do the most to prevent or limit that harm?
- [assumption-test] What is the least costly reliable way to test the riskiest Project assumption?
- [durable-outcome] What Project result must remain true even if its Products or Implementations are rebuilt differently?
- [current-baseline] What can be observed or measured now as the Project baseline?
- [success-signal] What measurable real-world change would show that the Project achieved its intended result?
- [misleading-success] What technical result could satisfy the Project contracts but still fail affected people or consumers?
- [stop-evidence] What evidence would show that the Project should stop pursuing its intended result?
- [affected-people] Who could be significantly affected by the Project or its results without using a Product directly?
- [excluded-people] Which people or consumers are intentionally outside the Project's current target group?

## Design

Use these questions for Project scope, Product inventory, cross-Product architecture, solution strategy, and
outcome horizons. Register every accepted Product in stable order and create its single Implementation
identity immediately, even when its stack entries are unknown.

- [owned-outcome] What complete result is the Project responsible for delivering?
- [responsibility-boundary] Where does the Project's responsibility begin and end?
- [explicit-non-goal] Which plausible capabilities are explicitly outside the Project's current scope?
- [manual-boundary] Which tasks will intentionally remain manual rather than being performed by any Product?
- [scope-change-evidence] What evidence would justify adding work that is currently outside Project scope?
- [irreversible-boundary] Which Project scope or responsibility decision would be most costly to change later?
- [context-actors] Which people, organizations, Products, or external systems exchange information with the Project?
- [information-direction] For each important kind of information, who or what sends it, and who or what receives it?
- [coupling-risk] Which Products or external systems must remain easy to change independently to avoid the greatest future cost?
- [architecture-change-evidence] What new evidence would justify changing the cross-Product design?
- [state-authority] If Products or external systems disagree about Project status or data, which source is authoritative?
- [data-lifecycle] What must happen to Project data from creation or collection through use, storage, retention, and deletion?
- [application-deliverable-inventory] Which independently useful Products—such as web, desktop, command-line, mobile, service, library, software development kit, data, or network platforms—does the Project own?
- [quality-priority] When important Project qualities conflict, which one must take priority?
- [build-buy-adopt] Which Project capabilities will be built, bought, or adopted, and why?
- [project-differentiation] Which capability or outcome must remain differentiated rather than delegated to a commodity dependency?
- [strategy-non-goal] Which attractive product or technical direction is deliberately excluded from the Project strategy?
- [strategy-tradeoff] Which quality or capability tradeoff does the strategy accept, and what protects the losing side?
- [strategy-change-evidence] What evidence would require the Project to change its solution strategy?
- [roadmap-horizon] Which outcome defines each Project horizon without prescribing implementation tasks?
- [roadmap-dependency] Which evidence, decision, external system, or earlier outcome must exist before each horizon can start?
- [roadmap-validation-gate] What observable evidence permits the Project to advance from each horizon?
- [roadmap-capacity] Which people, time, money, or operating-capacity assumptions bound each horizon?
- [roadmap-irreversible-decision] Which costly-to-reverse decision must be delayed, tested, or explicitly accepted in each horizon?
- [roadmap-replan-trigger] Which observation requires the Project horizon plan to be revised?
- [roadmap-stop-trigger] Which observation requires a horizon or the Project to stop?

## Specification

Use these questions for Project-wide contracts, governance, binding policy, quality, operating ownership, and
continuity. Product behavior and Implementation support details remain with their owning subjects.

- [protected-assets] Which Project asset would cause the most harm if compromised?
- [threat-actor] Which person, group, or external system could realistically try to harm or misuse the Project?
- [security-failure] Which security failure would cause the greatest Project-wide harm?
- [consumer-indicator] What consumer-visible measurement shows whether the running Project is delivering its intended result?
- [service-objective] Which behavior visible across the Project needs a measurable reliability target?
- [operational-runbook] Which high-risk Project operating task needs written, tested instructions?
- [quality-scenario] For the Project's highest-priority quality, what operating situation shows what that quality must achieve?
- [quality-threshold] What measurable result marks the minimum acceptable level for that Project quality?
- [threshold-basis] Which evidence or authoritative source justifies the chosen quality threshold?
- [allowed-degradation] When Project resources are limited, which quality may be reduced first?
- [protected-quality] Which quality must remain at its required level even when a Product is overloaded or failing?
- [verification-strategy] For each important Project claim, what level of testing, review, observation, or rehearsal supports it?
- [product-authority] Who has final authority over Product direction across the Project?
- [technical-authority] Who has final authority over technical direction across the Project?
- [data-contract-owner] Who may approve a data-contract change that current consumers cannot use without changing?
- [data-quality-owner] Who decides whether Project data meets the requirements for its intended use?
- [license-model] Which license governs the Project's software?
- [distribution-model] How may the Project's Products be distributed?
- [governance-model] What process resolves disputed Project decisions?
- [legal-constraint] Which law or contractual obligation limits the Project?
- [regulatory-constraint] Which industry regulation or regulatory rule limits the Project?
- [budget-constraint] Which spending limit constrains Project scope or choices?
- [schedule-constraint] Which required date constrains Project scope or delivery?
- [available-time] How much time can each confirmed contributor spend on the Project, and during what period?
- [available-systems] Which required systems are currently unavailable or inaccessible?
- [operational-owner] Who owns routine operation of the Project service?
- [incident-owner] Who coordinates response to a cross-Product incident?
- [risk-owner] Who is accountable for monitoring and responding to the highest-consequence Project risk?
- [missing-authority] Which open Project decision currently has no authorized decision-maker?
- [primary-maintainer] Who owns ongoing maintenance of the Project?
- [backup-maintainer] Who can continue maintenance when the primary maintainer is unavailable?
- [hidden-knowledge] Which essential Project task or decision depends on knowledge held by only one person?
- [maintenance-end-evidence] What evidence would justify ending active maintenance of the Project?
- [continuity-documentation] Which document must another maintainer be able to follow to continue the Project?
- [policy-purpose] What risk or recurring decision makes each binding Project policy necessary?
- [policy-scope] Which people, artifacts, environments, and actions does each policy govern?
- [policy-authority] Who may establish, interpret, change, and retire each policy?
- [policy-enforcement-evidence] What observable evidence proves that each policy was followed?
- [policy-exception] Who may approve a policy exception, under which conditions, and how is it recorded?
- [policy-review-change] Which event or interval triggers policy review, and how does an approved change reach affected subjects?
- [policy-retirement] What evidence makes each policy unnecessary or unsafe to retain?

## Lifecycle and Use Cases

First derive Project-wide service and use scenarios from accepted decisions. Ask only when a concrete scenario
or observable oracle cannot be derived. For example, test how `Analytics Workspace` operates during a `Data
Platform` outage without prescribing a particular recovery implementation.

- [scenario-inventory] Which Project-wide normal, alternate, invalid, failure/recovery, abuse, migration, upgrade, rollback, maintenance, deprecation, and end scenarios follow from accepted decisions?
- [scenario-class] Which lifecycle or use-case class does each Project scenario cover?
- [scenario-purpose] What Project result, risk, or contract does each scenario make concrete?
- [scenario-linked-decision] Which accepted Project, Product, or Implementation decisions does each scenario exercise?
- [scenario-coverage-gap] Which accepted Project decision has no scenario capable of guiding development and review?
- [scenario-owned-deferral] If a nonblocking Project scenario detail remains open, who owns it, what is the consequence, and when does it reopen the design?
- [recovery-priority] During a Project-wide disruption, which consumer or Product capability must be restored first?
- [roadmap-deprecation-path] How will obsolete Project capabilities or Products be retired as the outcome horizons advance?
