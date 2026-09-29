# Design Execution Ontology

This document applies [Ontology](../../ontology/SKILL.md) to the visual work that
[Design Execution](SKILL.md) builds, and the skill's placeholder line links it. The design terms for facets and
kinds are in [Design Ideation ontology](../design-ideation/ontology.md), and the test questions are in
[Ontology Facets](../../ontology/SKILL.md#facets).

## Before Building

- Read the facets the accepted design gives each component, user-facing object, and named visual-language term
  you will build. Components and user-facing objects are under Components, and named terms are under Visual
  Language.
- Read the session area file: the session's working model of one domain area, at the path
  [Ontology Storage](../../ontology/SKILL.md#storage) gives. Look up each domain unit the design names by id,
  such as `flight`, the Object type that `FlightCard` presents.
- When no Ideation ran, state the facets of each component and named term you create in the
  [execution handoff](handoff.md), in the
  [design terms](../design-ideation/ontology.md#facets-in-design-terms). Write each new user-facing object to the
  session area file as an Object type, and give any other new domain concept one
  [kind](../design-ideation/ontology.md#kinds-in-visual-design), seeding the file first as Ontology Storage
  states.
- The execution handoff's fields are not written yet. Put any facets you state there in their own section, and
  the unit ids that [Handoff](#handoff) asks for in another section.

## While Building

- Build each component to its facets, and name its labels with the preferred names from the session area file.
  `FlightCard` takes its props from Properties, nests `StateBadge` as Relationship states, and has the role
  `article` that Boundary gives. A cancelled flight is a `state` value, not a new component.
- Add no state visual that the Process lacks. `StateBadge` has one visual for each Flight lifecycle state. A
  delayed flight shows its new estimated times, not a "Delayed" badge, because Delay flight changes no state.
- Wire each control to one Action type, in the design form that
  [Kinds in Visual Design](../design-ideation/ontology.md#kinds-in-visual-design) gives. The Delay control on
  `FlightCard` opens the Delay flight dialog, which runs Delay flight and nothing else, and the dialog names the
  failed criterion when Delay flight fails.

## Handoff

- Stop and return to the caller when the build needs a state, control, or unit that contradicts the accepted
  design. Do not add it. If a source asks `StateBadge` to show a `diverted` state, which the Flight lifecycle
  lacks, return it, naming `flightLifecycle` and `flight.state`, and keep four state visuals.
- For any other change that a component you build makes to a domain unit, update the session area file in the
  same step. If the accepted design shows a departure gate on `FlightCard` and `flight` has no gate Property,
  add the Property to `flight`.
- List in the handoff each unit id you added, changed, or removed, or write that none changed. At closure, the
  file reaches Memory only when an accepted handoff names each changed id. Never write Memory `ontology/`
  yourself.
