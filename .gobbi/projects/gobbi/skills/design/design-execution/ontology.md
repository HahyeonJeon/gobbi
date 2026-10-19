# Design Execution Ontology

This document applies [Ontology](../../ontology/SKILL.md) to the visual work that
[Design Execution](SKILL.md) builds, and the skill's placeholder line links it. Facets and kinds are in
[Ontology Facets](../../ontology/SKILL.md#facets) and [Ontology Kinds](../../ontology/SKILL.md#kinds). The test
questions are in Ontology Facets.

## Before Building

- Read the facets the accepted design gives each component, user-facing object, and named visual-language term
  you will build. Components and user-facing objects are under Components, and named terms are under Visual
  Language.
- Read the domain model in `memory/ontology/`. Look up each domain unit the design names by id, such as
  `flight`, the Object type that `FlightCard` presents. Do not write `sessions/<session>/ontology/`.
- When no Ideation ran, state the facets of each component and named term you create in the
  [execution handoff](handoff.md), as [Ontology Facets](../../ontology/SKILL.md#facets) states. Write each new
  user-facing object as an Object type, and give any other new domain concept one
  [kind](../../ontology/SKILL.md#kinds). Name its unit id in the handoff.
- The execution handoff's fields are not written yet. Put any facets you state there in their own section, and
  the unit ids that [Handoff](#handoff) asks for in another section.

## While Building

- Build each component to its facets, and name its labels with the preferred names from `memory/ontology/`.
  `FlightCard` takes its props from Properties, nests `StateBadge` as Relationship states, and has the role
  `article` that Boundary gives. A cancelled flight is a `state` value, not a new component.
- Add no state visual that the Process lacks. `StateBadge` has one visual for each Flight lifecycle state. A
  delayed flight shows its new estimated times, not a "Delayed" badge, because Delay flight changes no state.
- Wire each control to one Action type, as [Ontology Kinds](../../ontology/SKILL.md#kinds) defines that kind.
  The Delay control on `FlightCard` opens the Delay flight dialog, which runs Delay flight and nothing else, and
  the dialog names the failed criterion when Delay flight fails.

## Handoff

- Stop and return to the caller when the build needs a state, control, or unit that contradicts the accepted
  design. Do not add it. If a source asks `StateBadge` to show a `diverted` state, which the Flight lifecycle
  lacks, return it, naming `flightLifecycle` and `flight.state`, and keep four state visuals.
- For any other change that a component you build makes to a domain unit, name it in the handoff in the same
  step. If the accepted design shows a departure gate on `FlightCard` and `flight` has no gate Property,
  record that Property on `flight`.
- List in the handoff each unit id you added, changed, or removed, or write that none changed. Closure updates
  `memory/ontology/` only when an accepted handoff names each changed id. Do not write that directory yourself.
