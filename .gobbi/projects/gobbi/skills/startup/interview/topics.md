# Interview Topics

Interview owns these 24 core topic ids. Project Design cites these ids. This file is the only interview
bank; it is not a questionnaire that must be asked in full. Do not add overlays, aliases, or lineage.

## Recursion

1. Walk parents before children. Branch 1, then for each product Branch 2, then Branch 3.
2. For a product topic, default to inherit the project answer. Ask only where the product differs.
3. First pass: at most one question per core topic per subject node.
4. A follow-up is allowed only when an answer names a product, external dependency, datastore, or
   human-facing surface that has its own lifecycle. Cap follow-ups at two levels below the core topic.
5. Ask only when the answer would change a statement in the draft. Otherwise inherit, record a named
   assumption, or mark the topic `open`.
6. If a missing answer blocks safe downstream design, stop and name it. Do not invent it.
7. If Branch 3 contradicts a provisional Branch 2 answer, revise the draft in place. Do not re-accept
   earlier topics as if they were durable documents.

## Stop

Interview is complete when every core topic for the project and each product is answered, inherited,
assumed, or open, and the user accepts the draft.

Interview does not run overlay selection, alias splits, or per-section acceptance stamps.

## Branch 1 — Project

Asked once per project.

| Id | Core question |
|---|---|
| `purpose` | What result must this project produce, and for whom? |
| `problem-evidence` | What concretely happened the last time this problem occurred, and what did it cost? |
| `durable-outcome` | What must stay true even if every product is rebuilt differently? |
| `products` | Which independently useful products does the project own? |
| `boundary` | What will the project deliberately not do, and what stays manual? |
| `success-and-stop` | What observable change proves success, and what evidence would end the project? |
| `constraints` | Which time, money, people, legal, license, or platform limits bound every later choice? |
| `authority-continuity` | Who decides, who maintains, and what happens when they are unavailable? |

`products` creates the subject nodes later branches walk. If the project has one product, still name it.

## Branch 2 — Design / Development

Asked per product. Default is inherit the project answer.

| Id | Core question |
|---|---|
| `shape` | What are the major parts, and where are the seams between them? |
| `stack` | Which languages, frameworks, runtimes, and datastores are chosen or forced, and why? |
| `data` | What data exists, where does it live, and which source is authoritative? |
| `interfaces` | Which boundaries exist between the parts and to the outside world? |
| `experience-direction` | For each human-facing surface, who is the audience and what is the coarse visual and interaction direction? |
| `environments` | Which environments exist, and what differs between them? |
| `change-path` | How does one change travel from idea to released? |
| `verification` | What evidence proves a change is safe to release? |
| `build-risk` | Which part of the build is most likely to be wrong, and what would show it early? |

`stack` must record local-first versus later cloud.

`experience-direction` may be `not applicable` for a library or automation-only CLI.

Branch 2 answers are provisional until Branch 3 is recorded for that product.

## Branch 3 — Product

Asked per product.

| Id | Core question |
|---|---|
| `first-use` | How does a consumer reach a first useful outcome? |
| `core-tasks` | Which small set of tasks must the product complete? |
| `failure-recovery` | What does a consumer see when it breaks, and how do they recover? |
| `data-promise` | Which personal or valuable data is held, and what is promised about it? |
| `access` | Which identity, permission, or entitlement rules apply, if any? |
| `support-update` | How does a consumer get help and updates? |
| `end-of-life` | What is promised about export, deprecation, and retirement? |

`core-tasks` becomes the feature index. Each named task is a later `design/feature/<feature>.md` slug
candidate.
