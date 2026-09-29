# Authoring Execution Ontology

This document applies [Ontology](../../ontology/SKILL.md) to the writing that
[Authoring Execution](SKILL.md) builds, and the skill's placeholder line links it. The writing terms for facets
and kinds are in [Authoring Ideation ontology](../authoring-ideation/ontology.md), and the test questions are in
[Ontology Facets](../../ontology/SKILL.md#facets).

## Before Writing

- Read the facets the accepted design gives each document, section, and defined term you will write. Documents
  and sections are under Structure and Claims, and defined terms are under Naming and Vocabulary.
- Read the session area file: the session's working model of one domain area, at the path
  [Ontology Storage](../../ontology/SKILL.md#storage) gives. Look up each domain unit the design names by id.
- When no Ideation ran, state the facets of each document, section, and defined term you create in the
  [execution handoff](handoff.md), in the
  [writing terms](../authoring-ideation/ontology.md#facets-in-writing-terms). Give each new domain concept one
  [kind](../authoring-ideation/ontology.md#kinds-in-writing), and write it to the session area file, seeding the
  file first as Ontology Storage states.
- The execution handoff's fields are not written yet. Put any facets you state there in their own section, and
  the unit ids that [Handoff](#handoff) asks for in another section.

## While Writing

- Write each unit's preferred name from the session area file. A non-preferred name appears only where it
  points the reader to the preferred one, as "Leg states" points to "Flight states".
- Describe a state only as its Process lists it, and a change only as its Action type states it. "Flight states"
  lists the four Flight lifecycle states, and "Delay a flight" says a departed flight stays unchanged because
  Delay flight runs only while the flight is scheduled.
- Keep each fact in the one document that owns it, and link to it from other documents instead of restating it.
  "Delay a flight" links to "Operations-control permissions" for who may delay a flight.

## Handoff

- Stop and return to the caller when the writing needs a term or unit that contradicts the accepted design. Do
  not coin it. If a source names a `diverted` state, which the Flight lifecycle lacks, return it, naming
  `flightLifecycle` and `flight.state`, and keep "Flight states" at four states.
- For any other change that a document you build makes to a domain unit, update the session area file in the
  same step. If controllers call a delay a "retime", add `retime` to the `definition.aliases` of `delay-flight`.
- List in the handoff each unit id you added, changed, or removed, or write that none changed. At closure, the
  file reaches Memory only when an accepted handoff names each changed id. Never write Memory `ontology/`
  yourself.
