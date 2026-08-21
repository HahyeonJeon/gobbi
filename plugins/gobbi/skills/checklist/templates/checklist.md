# {Subject} Checklist

> **Document role:** Reusable unchecked evaluation source<br>
> **Subject:** {Stable subject class or exact target}<br>
> **Applicability:** {Conditions for reuse, or exact artifact state, version, or content hash}<br>
> **Purpose:** {Intended evaluation use}<br>
> **Scope:** {Included subject boundary}<br>
> **Exclusions:** {Material subject matter outside the boundary}<br>
> **Governing sources:** {Sources that define the expected results}<br>
> **Context:** {Shared context needed to understand the checklist}<br>
> **Checkbox meaning:** Check an item when evidence shows the problem is present.

## Coverage Account

> Metadata only. No row is a checklist item, and no row is ever checked.

### Scenario spectrum

| Prompt | Account | Where or reason |
|---|---|---|
| Positive / Good / normal | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Alternative-valid | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Negative / Bad / expected rejection | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Boundary / edge / transition | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Failure / recovery | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Poor quality | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Rule violation | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Adversarial / abuse / gaming / cosmetic compliance | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Change / regression / compatibility | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |
| Counterfactual / assumption | {Covered / Not applicable / Evidence gap} | {Category > Scenario, subject reason, or missing evidence} |

### Lifecycle stages

| Lifecycle | Stages | Account | Where or reason |
|---|---|---|---|
| Project | {one or more of: initiation, planning, governance, coordination, change control, closure or archival} | {Covered / Not applicable / Evidence gap} | {Category, subject reason, or missing evidence} |
| Design and Development | {one or more of: conceive, design, implement, verify, handoff, use in the work, deliver, maintain, change} | {Covered / Not applicable / Evidence gap} | {Category, subject reason, or missing evidence} |
| Product | {one or more of: use, operate, configure, support, migrate, replace, retire} | {Covered / Not applicable / Evidence gap} | {Category, subject reason, or missing evidence} |

{When Product Lifecycle has no supported coverage, add one line stating whether later-use, change, replacement, and retirement are not applicable, or are absorbed by named Design and Development or Project categories.}

## Project Lifecycle

{Cover the project as a unit of work from initiation through closure.}

{If no project coverage is supported, write `No supported coverage for this lifecycle.` and add nothing else
to this section.}

### {Category}

#### {Expected scenario: broad mistake, omission, failure, or poor-result family to avoid}

- [ ] {State one broadly reusable observable sign that the problem is present.}
- [ ] {Add another sign only when it can have a different answer or require different evidence.}

{Repeat category headings and expected-scenario subheadings as needed.}

## Design and Development Lifecycle

{Cover how a project or product result is conceived, designed, implemented, verified, handed off, used within
the work, delivered, maintained, and changed. Keep documents, designs, plans, source files, and other work
artifacts here when later project work uses or revises them.}

{If no design and development coverage is supported, write `No supported coverage for this lifecycle.` and
add nothing else to this section.}

### {Category}

#### {Expected scenario: broad mistake, omission, failure, or poor-result family to avoid}

- [ ] {State one broadly reusable observable sign that the problem is present.}
- [ ] {Add another sign only when it can have a different answer or require different evidence.}

{Repeat category headings and expected-scenario subheadings as needed.}

## Product Lifecycle

{Use this lifecycle only for an operating app, service, library, or comparable product. Cover applicable
consumer use, operation, support, compatibility, migration, replacement, retirement, and exit concerns.}

{If no product coverage is supported, write `No supported coverage for this lifecycle.` and add nothing else
to this section.}

### {Category}

#### {Expected scenario: broad mistake, omission, failure, or poor-result family to avoid}

- [ ] {State one broadly reusable observable sign that the problem is present.}
- [ ] {Add another sign only when it can have a different answer or require different evidence.}

{Repeat category headings and expected-scenario subheadings as needed.}

{Keep all three lifecycles separate. Name an unresolved gap instead of inventing a category, scenario, or
checklist item. Assign no IDs, and keep every item unchecked.}
