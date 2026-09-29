---
name: ontology
description: "Ontology defines the kinds, facets, and rules for modeling a domain's data, logic, actions, and security as one model."
allowed-tools: Read
skill-type: preference
---

# Ontology

An ontology models the decisions in a domain: the data they use, the logic that evaluates them, the actions that
carry them out, and the security that governs them
([Palantir, Why create an Ontology?](https://www.palantir.com/docs/foundry/ontology/why-ontology/)). Use this
skill's kinds, facets, and rules when you design, build, or review a unit: anything that other work must find,
use, or change.

## Principles

### Model decisions, not only data

A model of things alone cannot say how a thing may change, who may change it, or which rule decides. Record the
logic, actions, and security that act on the data in the same model
([Palantir, Why create an Ontology?](https://www.palantir.com/docs/foundry/ontology/why-ontology/);
[Palantir, The Ontology system](https://www.palantir.com/docs/foundry/architecture-center/ontology-system/)).

### Model the domain, not the source

Name and shape each unit after the concept its users hold, not after a table, payload, file layout, or widget.
Still record where each fact comes from and who may change it.

### Protect names and meaning first

Names, definitions, and boundaries are hard to change once others depend on them, and implementation details
are not. Spend design and review effort on the facets before the details.

### Stop when a cold reader can navigate

The record is complete when a cold reader or agent can answer each facet's test questions, and two or three real
questions from the task, by following unit ids and Link type names in the record alone
([Noy and McGuinness, Ontology Development 101](https://protege.stanford.edu/publications/ontology_development/ontology101.pdf)).
Formal logic adds cost and reads a missing fact as unknown
([W3C, OWL 2 Primer](https://www.w3.org/TR/owl2-primer/)), while a reviewer reads it as absent.

---

## Rules

- **MUST give each domain concept one kind and each unit one concept, and state the unit's five facets before it
  is built.** Split a unit whose Definition needs "and", or one that holds a thing and an event about that thing.
- **MUST let Functions return results and only Action types commit changes.** Every change to an object or a
  link goes through one Action type that checks it, applies it, and states its effects
  ([Palantir, Ontology edits](https://www.palantir.com/docs/foundry/functions/edits-overview/)).
- **NEVER give an agent or automation a grant that the person or owner it acts for lacks.** Give each agent or
  automation its own role, and give it `propose` instead of `run` when a person must accept each change
  ([Palantir, AI FDE security](https://www.palantir.com/docs/foundry/ai-fde/security-and-governance/);
  [Palantir, Action effects](https://www.palantir.com/docs/foundry/automate/effect-actions/)).
- **MUST state each fact once, give it one writer, and store as data each rule or decision that people must
  review, query, or audit.** Keep a reviewable value, such as an airport's minimum connection time, in a
  Property or an Object type, not only in code or prose
  ([Palantir, Ontology design: Structural guidance](https://www.palantir.com/docs/foundry/ontology/ontology-structural-guidance);
  [Palantir, Foundry Rules: Object model](https://www.palantir.com/docs/foundry/foundry-rules/object-model/)).
- **MUST give each concept one preferred name, each name one meaning in its scope, and each Link type a name
  from both ends.** Qualify a name that could mean two things, and map each synonym to the preferred name;
  naming a Link type from its far end adds no dependency in that direction.
- **MUST follow the accepted design, project conventions, and the domain skill's own form before this skill's
  defaults.** Report a conflict to the caller instead of resolving it silently.

---

## Preferences

### Kinds

#### Classify each domain concept by one kind

- Give each domain concept the one kind whose row fits it. The kind names are Palantir Foundry's names, and each
  name links to its Palantir page.

  | Kind | Group | What it is | Owns | Relates to | Flight example |
  |---|---|---|---|---|---|
  | [Object type](https://www.palantir.com/docs/foundry/ontology/core-concepts/) | data | A real-world thing or event with its own identity | A primary key and its Properties | Link types; Interfaces it implements | Flight: one scheduled trip of one aircraft between two airports on one date |
  | [Property](https://www.palantir.com/docs/foundry/ontology/core-concepts/) | data | One fact about one Object type, stored or derived | Data type, allowed values or constraints, whether it is required, stable or changing, and origin | Its one owner | `Flight.estimatedDeparture` (changing); `Flight.bookedSeatCount` (derived from linked Bookings); `Airport.minimumConnectionTime` (a rule kept as data) |
  | [Link type](https://www.palantir.com/docs/foundry/ontology/core-concepts/) | data | A named connection between two Object types | Two sides, each with a name, a far end, and one or many | Two Object types | Flight aircraft: the side "aircraft" (one) from Flight, and the side "flights" (many) from Aircraft |
  | [Interface](https://www.palantir.com/docs/foundry/interfaces/interface-overview/) | data | A shape that several Object types share | Shared Properties | The Object types that implement it | None; see [Interfaces](#interfaces) |
  | [Function](https://www.palantir.com/docs/foundry/ontology/core-concepts/) | logic | A computation that reads and returns but changes nothing | Parameters, output, method (rule, formula, model, or language model) | The units it reads | `meetsMinimumConnectionTime(inbound, outbound)`: the outbound Booking is the same passenger's next booked flight, from the inbound flight's arrival airport; true when it departs at least that airport's minimum connection time after the inbound flight arrives |
  | [Action type](https://www.palantir.com/docs/foundry/action-types/overview/) | action | One named change that runs as one unit | Parameters, submission criteria, operations, and side effects | The Object types and Link types its operations change | Delay flight: takes a flight, a new time, and a reason; allowed only while the flight is scheduled; moves the estimated times; notifies booked passengers |
  | [Automation](https://www.palantir.com/docs/foundry/automate/overview/) | action | A condition that starts work without a person | Watched data, effects, the role it runs as, notifications, and fallback | The units it watches; the Action types or Functions it runs | When a flight's estimated arrival changes, run `meetsMinimumConnectionTime` for its connecting Bookings and alert the operations controller at the connecting airport of each failure |
  | [Process](https://www.palantir.com/docs/foundry/machinery/core-concepts/) | action | The states of one Object type and the Action types that move it between them | An initial state and transitions; a final state has no transition out | The state Property of its Object type; Action types | Flight lifecycle: scheduled → departed → arrived, or scheduled → cancelled; Delay flight changes no state |
  | [Security policy](https://www.palantir.com/docs/foundry/security/overview/) | security | Who may read, run, or propose what, under which condition | Grants: role, permission, targets, condition | The units it guards | Ops-control policy: only operations controllers run Delay flight and Cancel flight, and only for flights that depart from their assigned airport; an operations assistant agent may only propose Delay flight |

- Make a connection that carries its own data an Object type, not a Link type: Booking joins Passenger and
  Flight and carries a seat and a fare class. Split an Object type when a Property's meaning depends on another
  Property's value, or when most members leave a Property empty.
- Record a concept that fits no kind as a Property value, a field of a kind, or an artifact, not as a new kind.
  A value type or a derived value is a Property field, and submission criteria and side effects are Action type
  fields; keep history and decision logs as a linked Object type, not as versions of a member (Rule 4).

#### Link each artifact to the kinds it realizes

- A module, document, or visual component is an artifact, not a kind. State its five facets, and name in its
  Relationship the kinds it realizes, explains, or presents.
- Record an artifact's facets in the design record: the design written before building, or the build handoff
  when no design step ran. A domain unit's facets go in the session area file (see [Storage](#storage)).

#### Place logic by who starts the change

- Use an Action type for a person's decision, an Automation for an event-driven reaction, and a Function for a
  computation ([Palantir, Ontology design: Anti-patterns](https://www.palantir.com/docs/foundry/ontology/ontology-anti-patterns/)).
  An Action type that an Automation runs must be safe to run twice, including its side effects, which run after
  its operations and are not undone with them.
- Name an Action type after one business operation, such as Delay flight, not after a field update such as "set
  estimated departure".
- Model behavior over time as a Process on one state Property. Only Action types move a state
  ([Palantir, Machinery: Core concepts](https://www.palantir.com/docs/foundry/machinery/core-concepts/)).

#### Model decisions, models, and agents with the existing kinds

- Model a decision as a path: a Function checks or ranks the options, an Action type commits one, and an Object
  type logs it when people must review it.
- Model a model, or an LLM agent that returns a result, as a Function, or as an Automation when it starts on an
  event. An agent that runs or proposes Action types for a person is a role in a Security policy grant.
- Add no Decision, Strategy, Scenario, Model, or Agent kind.

### Facets

#### State five facets for every unit

- State each facet as this table says. The Flight column describes the Flight Object type throughout.

  | Facet | What it states | Test question 1 | Test question 2 | Flight example |
  |---|---|---|---|---|
  | Definition | One preferred name, one sentence of meaning in domain words, and the synonyms that map to it | Can a reader tell a member from a non-member from this sentence alone? | In this scope, does the unit have one name, and does that name mean one thing? | One scheduled trip of one aircraft between two airports on one date. "Leg" maps to Flight. "Flight number" names a repeating route, so it is a different term. |
  | Responsibility | What only this unit owns: one decision, or the facts about one concept | Can a reader name what only this unit owns, so that a change to it goes to this unit alone? | Does any other unit own the same decision or the same facts? | A flight owns its schedule and its lifecycle state. |
  | Boundary | What is inside and outside the unit, and the neighbours it never touches | Can a reader tell, for any given data, part, or content, whether it is inside or outside the unit? | Is each neighbour the unit never touches named, and does nothing inside the unit touch it, as the [Ontology record](record.md#unit-keys) defines touch? | Seats and fare classes are outside (Booking). Personal data is outside (Passenger). A flight never reads a Passenger. |
  | Relationship | Each connection and its direction; each Link type also named from both ends | Is each connection stated with its direction, and does each Link type have a name from each end? | Can a reader draw the map of units from the record alone? | Flight links to Aircraft ("aircraft" / "flights"). Flight links to Airport twice, as departure and arrival. Booking links to Flight ("flight" / "bookings"). |
  | Properties | The facts the unit carries, each with a data type or allowed values, whether it is required, whether it is stable or changing, and its origin | Does each property have a data type or allowed values, a required flag, and an origin, and is it marked stable or changing? | Is each distinction a property value rather than a new unit? | `number`: string, required, stable, captured. `state`: scheduled, departed, arrived, or cancelled; required, changing, entered. A cancelled flight is a `state` value, not a new Object type. |

- Write each facet's required key, and leave out an optional key that has no value. The
  [Ontology record](record.md) names the facets a kind never has, such as Properties for a Link type.
- A reviewer answers the test questions, and two or three real questions from the task, from the record alone.
  The reviewer records each unanswerable question as a problem.

#### Keep the record at glossary level

- Write names, one-sentence definitions, named boundaries, directed relationships, typed properties, and each
  kind's own fields. This is the level of a glossary, a CRC (class-responsibility-collaborator) card, or an
  object map.
- Leave out formal-logic axioms, reasoner input, global identifiers (IRIs), type trees deeper than the domain
  needs, and datasets, pipelines, builds, indexes, branches, and screens. Keep the domain facts they serve: each
  fact's origin, whether it is required, and the rules across a member's facts.
- Add a unit or a Property only when a reader must name, see, search, filter, or decide by it.

### Vocabulary

#### Take each term from its owner

- Take a term from the user's request, spec, or data first, then the project's existing term, then the standard
  domain term. Coin a term only when none exists.
- Define a new term in one sentence where the reader first meets it.

#### Give shared terms a status

- Record a status where each shared term is defined: `experimental` when new, then `active` or `deprecated`
  ([Palantir, Statuses](https://www.palantir.com/docs/foundry/object-link-types/metadata-statuses)). A shared
  term is a name that other work, users, or agents depend on; a new Flight Property `gate` starts as
  `experimental`.
- The term's owner moves it to `active`; rename or remove an `active` term only after you deprecate it with a
  reason, a replacement, and a removal point. Treat these as a rename of an `active` term: a change to an Object
  type's `primaryKey`, to a Property's `dataType` or `origin`, removing an allowed value, or changing an id.
- Do not use a `deprecated` unit in new work; follow its `replacedBy`. Prefer the project's own status
  mechanism, such as a changelog `Deprecated` entry or a language deprecation marker.

### Interfaces

#### Add an interface only for two current users

- Add an Interface, base type, base component, or section template only when two or more current units share the
  same shape.
- No two of Flight, Aircraft, Airport, Passenger, and Booking share a shape, so the Flight model has no
  Interface.

### Security

#### A grant filters reads only

- A Function result, a notification, or an export that carries guarded data keeps the guard only when the unit
  that makes it says so in its `boundary`.

### Storage

#### Record the model in the session, then promote it at closure

- Keep the session's working model at `{session-root}/ontology/<area>.yaml`, where `{session-root}` is the
  current session's directory, in the [Ontology record](record.md) format. Before the first write to an area,
  seed the file from Memory `ontology/<area>.yaml` when it exists, otherwise from the templates, as the
  [Ontology record](record.md#templates-and-examples) assembles them, and reuse its names and ids.
- Ideation writes the domain units it designs, Execution updates a unit when a built artifact changes it, and
  Review only reads the file. When a design is rejected or revised, its writer updates the file in the same step,
  and each handoff names the unit ids it added, changed, or removed.
- At closure, the end of the session, the Memory writer promotes each session area file into Memory `ontology/`
  after the file passes the record's validation checklist ([Memory](../memory/SKILL.md) Closure).

---

## References

| Name | Description |
|---|---|
| [Ontology record](record.md) | YAML format, safety rules, and validation for Memory `ontology/` files, with one template and one Flight example file per kind. |
| [Memory](../memory/SKILL.md) | Placement, naming, index, and closure rules for `ontology/`. |
| [Coding Principles](../coding/principles.md) | Modularization: the code form of the facets and kinds. |
| [Authoring Ideation ontology](../authoring/authoring-ideation/ontology.md) | The writing form of the facets and kinds. |
| [Design Ideation ontology](../design/design-ideation/ontology.md) | The visual-design form of the facets and kinds. |
