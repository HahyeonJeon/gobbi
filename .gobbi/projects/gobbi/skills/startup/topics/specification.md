# Specification Topics

Use this direct phase bank to prepare evidence-backed Specification questions for the current subject. Keep
the accepted content at design-contract level and exclude implementation tasks.

## Project

- Which Project asset would cause the most harm if compromised?

- Which person, group, or external system could realistically try to harm or misuse the Project?

- Which security failure would cause the greatest Project-wide harm?

- What consumer-visible measurement shows whether the running Project is delivering its intended result?

- Which behavior visible across the Project needs a measurable reliability target?

- Which high-risk Project operating task needs written, tested instructions?

- For the Project's highest-priority quality, what operating situation shows what that quality must achieve?
  - **Example:** For example, a dependency fails and affected work recovers safely.

- What measurable result marks the minimum acceptable level for that Project quality?

- Which evidence or authoritative source justifies the chosen quality threshold?

- When Project resources are limited, which quality may be reduced first?

- Which quality must remain at its required level even when a Product is overloaded or failing?

- For each important Project claim, what level of testing, review, observation, or rehearsal supports it?

- Who has final authority over Product direction across the Project?

- Who has final authority over technical direction across the Project?

- Who may approve a data-contract change that current consumers cannot use without changing?

- Who decides whether Project data meets the requirements for its intended use?

- Which license governs the Project's software?

- How may the Project's Products be distributed?

- What process resolves disputed Project decisions?

- Which law or contractual obligation limits the Project?

- Which industry regulation or regulatory rule limits the Project?

- Which spending limit constrains Project scope or choices?

- Which required date constrains Project scope or delivery?

- How much time can each confirmed contributor spend on the Project, and during what period?

- Which required systems are currently unavailable or inaccessible?

- Who owns routine operation of the Project service?

- Who coordinates response to a cross-Product incident?

- Who is accountable for monitoring and responding to the highest-consequence Project risk?

- Which open Project decision currently has no authorized decision-maker?

- Who owns ongoing maintenance of the Project?

- Who can continue maintenance when the primary maintainer is unavailable?

- Which essential Project task or decision depends on knowledge held by only one person?

- What evidence would justify ending active maintenance of the Project?

- Which document must another maintainer be able to follow to continue the Project?

- What risk or recurring decision makes each binding Project policy necessary?

- Which people, artifacts, environments, and actions does each policy govern?

- Who may establish, interpret, change, and retire each policy?

- What observable evidence proves that each policy was followed?

- Who may approve a policy exception, under which conditions, and how is it recorded?

- Which event or interval triggers policy review, and how does an approved change reach affected subjects?

- What evidence makes each policy unnecessary or unsafe to retain?

## Product

- What must the first useful version of this Product be able to do?

- Which attempted Product uses must be rejected?

- Which named features must this Product provide?

- What is the smallest complete Product capability that lets a consumer finish a useful task?
  - **Example:** For example, a consumer creates and later recovers one saved result.

- What must already exist or be true before this feature can work?

- Which consumer action, system event, or schedule starts this feature?

- What can a consumer observe to know this feature finished successfully?

- At what point does this feature pass responsibility to another person, Product, or external system?

- Which failure during this feature would have the greatest consequence?

- What should the Product interface show or return first to confirm success?

- What information must a consumer see before an important Product-supported decision?

- Which consequential Product result needs an explanation of how it was reached?

- After a Product error, what must the affected consumer be able to do next?

- What safeguard must protect people or state from a hard-to-reverse Product action?

- Which needs of consumers with disabilities must shape the first useful Product version?

- For each important Product data category, how long must it remain available?

- Which exported formats, fields, meanings, or behaviors must remain compatible for Product consumers?

- What Product behavior, input, output, or interface must remain stable because consumers rely on it?

- Which current Product behavior must continue working after the Product changes?

- How must the Product respond to invalid input?

- How must the Product respond when only part of an operation succeeds?

- How must the Product respond safely to an explicitly unsupported use?

- Which public Product interface or data format must carry a version?

- When someone opens a saved or shared Product URL directly, which page and state must appear?

- When a consumer uses browser Back or Forward, which Product state must remain correct?

- Which entered data or in-progress Product task must survive a refresh?

- How long may browser-stored Product data be reused before refresh or removal?

- Which browsers and versions must this Product support?

- Which Product task must work without a network connection?

- Which operating-system feature must a desktop Product support?

- Which in-progress Product task must continue across device size, orientation, or form changes?

- Which desktop operating systems and versions must this Product support, and for how long?

- Which mobile operating systems and versions must this Product support, and for how long?

- Which command names, arguments, options, and input behaviors must remain compatible?

- Which command output formats are consumed by scripts or automation?

- Which command outcomes need distinct process exit codes?

- Which public functions, classes, types, or behaviors must current library or software development kit consumers retain?

- Which published protocol or networking standard must this Product follow?

- Which devices, services, or software must exchange protocol messages successfully with this Product?

- Which official registry controls named or numbered protocol values?

- Which supported features or versions must protocol peers agree on?

- Which rule decides whether a consumer or connected system may perform a Product action?

- Which sensitive Product action must leave a protected audit record?

- Which realistic misuse of this Product could cause serious harm?

- After a serious Product failure, what condition must remain true to avoid harm?

- Which personal or sensitive data does this Product collect, receive, store, or transmit?

- Which collected Product data is unnecessary for its intended result?

- Which Product collection or use of personal data requires consent?

- Which law, policy, or commitment limits Product retention of personal or sensitive data?

- Which request, deadline, or lifecycle event requires the Product to delete personal or sensitive data?

- Under what approved condition may the Product share protected data outside its current trust boundary?

- Which Product capability requires access to sensitive device features or user data?

- What user-visible benefit justifies each sensitive permission request?

- If permission is revoked, which Product capabilities must still work?

- What request or job range and pattern must a service Product handle correctly?
  - **Example:** For example, include steady demand and a short burst.

- Which accessibility standard and conformance level must this Product meet?

- Which complete Product result must be tested from trigger through final outcome?

- What evidence must show that this Product meets its accessibility target?

- Which Product behavior or experience claim must be tested with representative consumers?

- Which supported channel lets each intended consumer or connected system obtain and identify a Product release?

## Implementation

- Which versions of every required stack entry must this Implementation support, and for how long?

- Which development, test, staging, production, or other environment differences change Implementation behavior or risk?

- Which file, service, or system is authoritative for runtime configuration?

- Which network, locality, regional, resource, or other operating restriction changes what this Implementation must support?

- Which Implementation operation must reach the same end state when repeated with the same request?

- When the same data appears in several places, what agreement or update timing must the Implementation preserve?
  - **Example:** For example, a reader may see stale data until the next refresh.

- What compatibility must the Implementation preserve when stored data format or meaning changes?

- What test or evidence proves that Implementation-managed data can be restored after loss?

- For which data must the Implementation trace its source and every transformation?

- Which timestamp must Implementation calculations use when an event time and arrival time differ?

- Which records or events must the Implementation process in order?

- How may an earlier result change when data arrives late?

- Which input records may arrive more than once without making the result incorrect?

- Which earlier result must historical input reproduce when processed again?
  - **Example:** For example, process an earlier event again without duplicating its effect.

- Which previous result may change after missing or corrected historical data is processed?
  - **Example:** For example, populate a new field for existing records.

- What signal tells a consumer that Implementation-produced data is recent enough to use?

- Which configuration or system is authoritative for intended network state?

- Which signal shows that a network runtime unit is running and responding?

- What observable condition proves all affected runtime units reached intended network state?

- How must the Implementation reconcile actual and intended network state?

- How old may observed network state become before the Implementation stops relying on it?

- Which failed Implementation operation may be tried again without an incorrect or unsafe result?

- Which behavior must remain safe when runtime units cannot communicate?

- Which operating systems and command shells must the Implementation support for a command-line Product?

- Where does data or control cross between Implementation runtime units with different trust levels?
  - **Example:** For example, untrusted input crosses into a privileged process.

- Which protocol message must the Implementation reject when an attacker sends it again?

- Which protocol state becomes invalid after unauthorized change?

- Which resource-exhaustion attempt needs a planned defense to keep the Product available?

- Which logs, metrics, traces, or records must the Implementation provide after failure?

- Which Implementation changes require security review before release?

- Which speed, capacity, or resource-use claim requires measurement?

- Which deployment, recovery, or routine-operation claim requires a realistic demonstration?

- Which repository-organization constraint is binding for this Implementation, and what boundary does it protect?

- Which responsibilities must remain separated by a module or package boundary?

- Which naming patterns are mandatory for Implementation files, modules, types, functions, or other elements?

- Which design pattern must Implementation interfaces follow?

- Which pattern must Implementation code follow when reporting, propagating, or recovering from errors?

- Which format and location rules apply to Implementation documentation?

- Which naming, grouping, and location rules apply to Implementation tests?

- Which process must a contributor follow when proposing an Implementation change?

- Which current file or module is the authoritative example for this Implementation?

- Which locally common pattern is misleading and must not be copied?

- Which unusual-looking Implementation pattern is deliberate and must be preserved?

- Which Implementation rule is mandatory rather than preferred?

- Which Implementation-specific mistake do contributors or agents repeatedly make?

- Which approved approach replaces the misleading local pattern?
