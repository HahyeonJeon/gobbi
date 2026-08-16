# Interview Topics

Interview owns these 42 core topic ids and 19 named child triggers. Project Design cites these ids. This
file is the only interview bank; it is not a questionnaire that must be asked in full. Do not add
overlays, aliases, or lineage.

## Recursion

1. Walk parents before children. Branch 1, then for each product Branch 2, then Branch 3.
2. For a product topic, default to inherit the project answer. Ask only where the product differs.
3. First pass: at most one question per core topic per subject node.
4. Subject nodes are the project; each product named by `products`; and, for `task-actors`,
   `task-scope`, and `task-behavior` only, each task named by `core-tasks`.
5. A follow-up child is allowed only when an answer names a product, external dependency, datastore,
   or human-facing surface that has its own lifecycle. Use the child table. Cap follow-ups at two
   levels below the core topic.
6. Ask only when the answer would change a statement in the draft. Otherwise inherit, record a named
   assumption, or mark the topic `open`.
7. If a missing answer blocks safe downstream design, stop and name it. Do not invent it. Blocking
   ids are `products`, `core-tasks`, `stack`, and `first-check`, and when `core-tasks` is not none:
   `task-actors`, `task-scope`, and `task-behavior`.
8. If Branch 3 contradicts a provisional Branch 2 answer, revise the draft in place. Do not re-accept
   earlier topics as if they were durable documents.
9. Triggered children must be answered, inherited, assumed, or open. Untriggered children are
   omitted. They are not `open`.
10. Interview is complete when every core for the project and each product is answered, inherited,
    assumed, `not applicable`, or open; every triggered child is answered, inherited, assumed, or
    open; and the user accepts the draft.

Activate at most three children at project level, six per product, and two per named task. Over
budget, mark the extra child `open`.

If an answer names something no listed child covers, write one `Detail:` line under the parent. Do
not invent an id.

## Stop

Interview does not run overlay selection, alias splits, or per-section acceptance stamps.

`experience-direction` and `accessibility-needs` may be `not applicable` when there is no
human-facing surface.

Imagine ordinary failure and end-of-life before asking in Branches 2 and 3. Then ask only if the
answer would change the draft.

## Branch 1 — Project

Asked once per project.

| Id | Core question | Destination design heading |
|---|---|---|
| `purpose` | What result must this project produce, and for whom? | Overview: Purpose |
| `why-now` | What changed to make this the right time to act? | Overview: Purpose |
| `problem-evidence` | What happened the last time this problem occurred, what did it cost, how often does it happen, and what evidence names the cause? | Overview: Problem |
| `durable-outcome` | What must stay true even if every product is rebuilt differently? | Overview: Outcome |
| `affected-people` | Who is affected, who should benefit first, and who is deliberately excluded? | Overview: Purpose; Feature: Actors |
| `products` | Which independently useful products does the project own? | Overview: Product inventory; Product: Products; System: Products |
| `boundary` | What will the project deliberately not do, and what stays manual? | Overview: Scope and non-goals; Product: Refused uses |
| `success-and-stop` | What observable change proves success, what technical result could mislead, and what evidence would end the project? | Overview: Outcome; Roadmap: Replan and stop |
| `current-baseline` | What can be observed now as the starting point? | Overview: Outcome; Roadmap: Current position |
| `riskiest-assumption` | Which assumption is most important and least evidenced, what harm does it carry, and what cheapest test would falsify it? | Overview: Open questions; Roadmap: Replan and stop |
| `constraints` | Which time, money, people, legal, license, or environment limits bound every later choice? | Overview: Constraints; Feature: Constraints and qualities |
| `quality-priority` | When qualities conflict, which one wins, and what may degrade first? | Overview: Constraints; Feature: Constraints and qualities |
| `authority-continuity` | Who decides, who maintains, what happens when they are unavailable, and which essential knowledge exists in only one head? | Overview: Authority and maintenance |
| `horizon-direction` | What outcome order must later planning respect, including local first then cloud when cloud is in scope? | Roadmap: Direction; Roadmap: Horizons |

`products` creates the product subject nodes. If the project has one product, still name it.

## Branch 2 — Design / Development

Asked per product. Answers are provisional until that product's Branch 3 is recorded. Default is
inherit the project answer.

| Id | Core question | Destination design heading |
|---|---|---|
| `shape` | What are the major parts, and where are the seams between them? | System: Composition; System: Parts and responsibilities; Feature: Structure |
| `build-buy-adopt` | Which capabilities will be built, bought, or adopted, and why? | System: Parts and responsibilities |
| `stack` | Which languages, frameworks, runtimes, and datastores are chosen or forced, and why? | System: Stack |
| `local-or-cloud` | Which work must stay local first, and which may become cloud later? | System: Stack; Roadmap: Current position |
| `data` | What data exists, where does it live, and which source is authoritative? | System: Data and flow; Feature: Structure |
| `data-lifecycle` | What happens to that data from creation through use, retention, and deletion? | System: Data and flow |
| `interfaces` | Which boundaries exist between the parts and to the outside world? | System: Interfaces; Feature: Structure |
| `experience-direction` | For each human-facing surface, who is the audience and what is the coarse visual and interaction direction? | Product: Audience and experience direction |
| `environments` | Which environments exist, and what differs between them? | System: Environments |
| `change-path` | How does one change travel from idea to released? | System: Change path |
| `verification` | What evidence proves a change is safe to release? | System: Verification and build risk |
| `first-check` | From a clean machine, what must exist, and which exact command must pass, before the first trusted check succeeds? | System: First check; Roadmap: Current position; Bootstrap input |
| `build-risk` | Which part of the build is most likely to be wrong, and what would show it early? | System: Verification and build risk |
| `failure-containment` | Which part must stop one failure from taking down other parts or consumers? | System: Parts and responsibilities |

`experience-direction` may be `not applicable` when there is no human-facing surface.

`first-check` is blocking for Bootstrap. Do not invent the command.

`stack` no longer carries the local-versus-cloud question. `local-or-cloud` owns it.

## Branch 3 — Product

Asked per product.

| Id | Core question | Destination design heading |
|---|---|---|
| `software-type` | What kind of independently useful product is this (library, CLI, web, desktop, mobile, service, data, or other)? | Product: Products; Overview: Vocabulary |
| `current-alternative` | What does the consumer do today, and why would they switch? | Product: First useful outcome |
| `first-use` | How does a consumer reach a first useful outcome? | Product: First useful outcome |
| `core-tasks` | Which small set of tasks must the product complete? | Product: Feature index; Feature: Purpose |
| `task-actors` | For this task, who acts and what role do they play? | Feature: Actors |
| `task-scope` | For this task, what is in scope and what is out of scope? | Feature: Scope |
| `task-behavior` | For this task, what is the ordinary path, one valid other path, and the rejected input or use? | Feature: Behavior Normal / Alternate / Invalid |
| `refused-use` | Which attempted product uses must be rejected? | Product: Refused uses; Feature: Scope |
| `failure-recovery` | What does a consumer see when it breaks, and how do they recover? | Product: Failure and recovery; Feature: Failure / Recovery |
| `accessibility-needs` | Which accessibility needs must the first useful version meet? | Product: Audience and experience direction; Feature: Constraints and qualities |
| `data-promise` | Which personal or valuable data is held, and what is promised about it? | Product: Access and data promises |
| `access` | Which identity, permission, or entitlement rules apply, if any? | Product: Access and data promises |
| `support-update` | How does a consumer get help and updates? | Product: Support and updates |
| `end-of-life` | What is promised about export, deprecation, and retirement? | Product: End of life |

`core-tasks` becomes the feature index. Each named task is a later `design/feature/<feature>.md` slug
candidate.

`task-actors`, `task-scope`, and `task-behavior` use each named task as the subject node. If
`core-tasks` is explicitly none, record those three as `not applicable` and write no feature files.

`accessibility-needs` may be `not applicable` when there is no human-facing surface.

## Hierarchical additional topics

These are not cores. Do not walk them unless the trigger is true.

A child is a follow-up. The family cap is two levels below the core. Every row below is depth 1.
Depth 2 is allowed only when that child's answer again names a product, external dependency,
datastore, or human-facing surface, and only when the next answer would change the draft.

Do not grow this table into overlay banks. Form rows are one question each.

| Trigger | Parent id | Child id | Question | Depth cap |
|---|---|---|---|---|
| `products` names two or more products | `products` | `coupling-risk` | Which products must stay independently changeable? | 1 of 2 |
| `software-type` or `experience-direction` names a human-facing surface | `experience-direction` | `use-context` | In what situation, device, or attention condition is that surface used? | 1 of 2 |
| `software-type` or `experience-direction` names a human-facing surface | `experience-direction` | `visual-principles` | Which few visual principles must stay recognizable? | 1 of 2 |
| `software-type` or `experience-direction` names a human-facing surface | `experience-direction` | `design-reference` | Which existing interface is worth following, and which must not guide this? | 1 of 2 |
| `stack`, `interfaces`, or `shape` names an external dependency | `stack` | `dependency-failure` | What product result is lost if that dependency fails? | 1 of 2 |
| `stack`, `interfaces`, or `shape` names an external dependency | `stack` | `dependency-exit` | How does the product continue if that dependency is permanently lost? | 1 of 2 |
| `data` or `stack` names a datastore | `data` | `state-authority` | If copies disagree, which store is authoritative? | 1 of 2 |
| `data` or `data-lifecycle` names a datastore | `data-lifecycle` | `retention-deletion` | How long is that data kept, and what deletes it? | 1 of 2 |
| `data-promise` names personal or valuable data held in a datastore | `data-promise` | `consent-deletion` | What collection needs consent, and what event requires deletion? | 1 of 2 |
| `access` names an external identity or entitlement dependency | `access` | `identity-recovery` | How does a supported identity regain access without losing protected work? | 1 of 2 |
| `end-of-life` names a datastore or exportable data | `end-of-life` | `data-portability` | What can the consumer export, in what form, and how is completeness checked? | 1 of 2 |
| A named task's `task-behavior` names a human-facing surface | `task-behavior` | `invalid-input` | How is rejected input or refused use shown on that surface? | 1 of 2 |
| A named task's `task-scope` or `task-behavior` names a datastore | `task-behavior` | `task-data` | What data does this task create, read, change, or delete? | 1 of 2 |
| `failure-recovery` or a named task names an external dependency | `failure-recovery` | `dependency-unavailable` | What does the consumer see while that dependency is down? | 1 of 2 |
| `software-type` names a web human-facing surface | `interfaces` | `web-stable-boundary` | Which URL or browser-visible behavior must stay stable? | 1 of 2 |
| `software-type` names a CLI product | `interfaces` | `invocation-contract` | Which command names, inputs, and outputs must stay compatible? | 1 of 2 |
| `software-type` names a library, SDK, or API product | `interfaces` | `public-contract` | Which public types or functions must current callers keep? | 1 of 2 |
| `software-type` names a desktop or mobile human-facing surface | `environments` | `target-os` | Which operating systems and versions must this product support? | 1 of 2 |
| `software-type` names a data product, or `data` names a datastore | `data` | `processing-model` | Does the result arrive live, in batches, or on demand? | 1 of 2 |

Parent for a child is the core that named the trigger object. If two cores name it, use the earlier
parent in walk order and do not ask the child twice.

Depth-2 examples. Ask at most one, then stop:

- `visual-principles` names a second human-facing surface → which principles differ on that surface.
- `dependency-failure` names a datastore → what happens to stored work when the dependency fails.
- `public-contract` names an external dependency → which callers break if that dependency changes.

Never ask as a child: visual tokens, scenario-template rows, naming-convention catalogs, network
control-plane questions, or policy CRUD.
