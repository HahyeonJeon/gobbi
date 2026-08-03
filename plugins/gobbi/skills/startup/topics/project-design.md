# Project Design Topics

Adapt these questions to the project context. Use `Project -> Application/Deliverable -> Building Block` for
structure and the separate matrix questions for technology and language assignments. Do not place frameworks,
engines, table formats, protocols, and languages at one hierarchy level.

## Scope, Context, Architecture, Runtime, and Deployment

- [owned-outcome] What complete result for a user or consumer is this project responsible for delivering?
- [responsibility-boundary] Where does the project's responsibility begin and end?
- [explicit-non-goal] Which plausible capabilities, if any, are explicitly outside the project's current scope?
- [manual-boundary] Which tasks, if any, will intentionally remain manual rather than being performed by the software?
- [scope-change-evidence] What evidence would justify adding work that is currently outside the project's scope?
- [irreversible-boundary] Which decision about the project's scope or responsibilities would be most costly to change later?
- [context-actors] Which people, organizations, or external systems send information to or receive information from the software?
- [information-direction] For each important kind of information, who or what sends it, and who or what receives it?
- [stable-boundary] Which connection between system parts, users, or external systems must keep the same behavior when the internal implementation changes?
- [coupling-risk] Which parts of the project or connected systems must remain easy to change independently to avoid the greatest future cost?
- [architecture-change-evidence] What new evidence would justify changing the current high-level system design?
- [state-authority] If systems disagree about data or status that determines the project's result, which system's value should be treated as correct?
- [data-lifecycle] What must happen to the project's data from creation or collection through use, storage, retention, and deletion?
- [web-runtime-boundary] For a web project, which work must run in the user's browser rather than on a server or another system?
- [data-processing-model] How should the project process data to produce its intended result—for example, as data arrives, in scheduled batches, or on demand?
- [runtime-units] Which major parts of the system run independently—for example, an application, service, background worker, or scheduled job?
- [unit-responsibility] For each independently running part of the system, what responsibility does it own?
- [primary-runtime-path] When the system produces its main result, which running components handle the work from start to finish?
- [background-path] Which work that runs without a user waiting for it must succeed for the final result to be correct?
- [failure-containment] Which part of the system must prevent one failure from affecting other parts or users?
- [runtime-recovery] After a runtime failure, which system state must be restored before normal work can continue?
- [programming-languages] Which programming languages must future work use or continue to support?
- [frameworks] Which software frameworks must future work use or remain compatible with?
- [runtimes] Which execution runtimes must future software continue to run on?
- [data-stores] Which databases or other data stores must future work keep using or remain compatible with?
- [supported-versions] For each required technology, which versions must the project support, and for how long?
- [hard-stack-constraint] Which technology choice is mandatory rather than a preference?
- [stack-change-evidence] What evidence would show that the project's chosen programming languages, frameworks, runtimes, or data stores no longer fit the project?
- [critical-dependency] Which external dependency, if any, is essential to the project's intended result?
- [dependency-failure] If a critical external dependency fails, which project capability or result is lost or reduced?
- [dependency-change] What must the project do if a critical external dependency changes in a way that the current integration cannot use?
- [dependency-exit] How can the project continue if a critical external dependency becomes permanently unavailable?
- [stack-license] Which software-license requirement limits the technologies that the project may choose?
- [stack-portability] What ability to run or move the software across different operating environments must the chosen technologies preserve?
- [environment-model] Which differences among the project's operating environments—for example, development, test, staging, or production—can change the software's behavior or risk?
- [configuration-source] Which file, service, or system has final authority over the configuration used while the software is running?
- [runtime-restriction] Which operating restriction, such as limited network access, local deployment, or regional limits, changes what the software must support?
- [release-channel] How do the intended users or connected systems receive a release?
- [deployment-method] How is a released version installed or deployed into the environment where it will run?
- [rollout-signal] During a gradual release, which observed result shows that it is safe to continue releasing to more users or systems?
- [rollback-trigger] Which observed failure requires the release to stop and the previous version to be restored?
- [rollback-state] If a release is rolled back, which user, system, or operational state must remain intact?
- [recovery-priority] Which user or system capability must disaster recovery restore first?

## Structural Model and Technology Matrix

- [application-deliverable-inventory] Which independently useful applications or deliverables—such as web, desktop, command-line, mobile, service, library, software development kit, data product, or network service—does the project own?
- [application-deliverable-type] What type is each application or deliverable, and what complete outcome does it own?
- [building-block-inventory] Which building blocks make up each application or deliverable?
- [building-block-parent] Which application or deliverable owns each building block?
- [building-block-responsibility] What responsibility, boundary, interface, owner, deployment need, and quality obligation does each building block have?
- [technology-category] For each selected technology, is it a framework, runtime, engine, datastore, table format, protocol, platform, infrastructure, external service, library, or toolchain?
- [technology-assignment] Which building blocks use each technology and language, and for what responsibility?
- [technology-rationale] What evidence, constraint, and tradeoff justify each material technology or language choice?
- [technology-exit-trigger] What alternative, exit path, and evidence would cause the project to replace each material technology choice?

## Strategy and Outcome-Horizon Roadmap

- [build-buy-adopt] Which capabilities will the project build, buy, or adopt, and why?
- [project-differentiation] Which capability or outcome must remain differentiated rather than delegated to a commodity dependency?
- [strategy-non-goal] Which attractive technical or product direction is deliberately excluded from the solution strategy?
- [strategy-tradeoff] Which quality or capability tradeoff does the strategy accept, and what protects the losing side?
- [strategy-change-evidence] What evidence would require the project to change its solution strategy?
- [roadmap-horizon] Which outcome defines each roadmap horizon without prescribing implementation tasks?
- [roadmap-dependency] Which evidence, decision, external system, or earlier outcome must exist before each horizon can start?
- [roadmap-validation-gate] What observable evidence permits the project to advance from each horizon?
- [roadmap-capacity] Which people, time, money, or operating capacity assumptions bound each horizon?
- [roadmap-irreversible-decision] Which costly-to-reverse decision must be delayed, tested, or explicitly accepted in each horizon?
- [roadmap-replan-trigger] Which observation requires the roadmap to be replanned?
- [roadmap-stop-trigger] Which observation requires a horizon or the project to stop?
- [roadmap-deprecation-path] How will obsolete capabilities, technologies, or deliverables be deprecated as the roadmap advances?
