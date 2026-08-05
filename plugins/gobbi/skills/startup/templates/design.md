# {Project} — Design

Describe the accepted responsibility boundaries, structure, interfaces, data direction, and design choices for
the Project, each Product, and each Product's single complete Implementation.

Append the relevant `[alias]` tag or tags to every material evidence-derived or user-decided statement.

## Project

### {Project}

#### Scope and structure

{Describe the Project outcome and boundary, accepted Product inventory, external actors and systems,
cross-Product relationships, authoritative sources, data lifecycle, stable contracts, independent-change
seams, quality tradeoffs, and deliberately excluded directions.}

#### Outcome horizons

| Outcome horizon | Dependencies | Evidence to advance | Capacity or constraint | Costly decision | Replan or stop evidence |
|---|---|---|---|---|---|
| {outcome, not implementation tasks} | {required evidence or decision} | {observable result} | {people, time, money, or operation} | {delay, test, or accept} | {trigger} |

{Cite decisive evidence, risks, and evidence that would change the Project design.}

- Accepted: {yes — user and date}

## Products

Repeat this section for every Product in the accepted order.

### {Product}

- Parent Project: {Project}
- Implementation: {Product Implementation}

{Describe the independently useful outcome, Product type, consumer and external boundaries, interaction forms,
interfaces, stable behavior and terms, data direction, one complete Implementation relationship, reference
Products to follow or avoid, uncertain use assumptions, risks, and change evidence.}

- Accepted: {yes — user and date}

## Implementations

Repeat this section once per Product. Do not create child subjects for stack entries.

### {Product} Implementation

- Parent Product: {Product}
- Relationship: the Product's single complete-stack Implementation

{Describe the complete stack, independent runtime units, responsibilities, main and background paths, failure
containment, restored runtime conditions, interfaces, data flow, deployment obligations, and quality duties.}

#### Categorized entries

| Entry | Category | Responsibility | Version and support | Rationale and evidence | Constraints | Alternative or exit evidence |
|---|---|---|---|---|---|---|
| {entry} | {language, framework, runtime, datastore, protocol, platform, infrastructure, service, library, toolchain, or other} | {owned role} | {policy} | {reason and source} | {dependencies and limits} | {alternative and trigger} |

- Accepted: {yes — user and date}
