# Authoring Ideation Ontology

This document gives the [Ontology](../../ontology/SKILL.md) facets and kinds their writing terms for
[Authoring Ideation](SKILL.md), which loads it in Step 3.1.

## Units

- Each new or changed document, section, and defined term is a unit. Record the facets of each document and
  section under Structure and Claims, and of each defined term that is not a domain concept under Naming and
  Vocabulary.
- A defined term that names a domain concept is a domain unit, so its facets live in the session area file.
  That file holds the session's working model of one area in [Ontology Record](../../ontology/SKILL.md#record)
  format, at the location the caller names. Use the preferred name the file gives. Read the area's Memory copy
  when the session file does not exist yet.
- Give a new domain concept one kind and write it to the session area file as
  [Ontology Storage](../../ontology/SKILL.md#storage) states. Under Naming and Vocabulary, give each term that
  names a domain concept its preferred name, kind, and unit id instead of its facets, and list every unit id
  the design adds, changes, or removes.

## Facets in Writing Terms

State each facet of a document, section, or defined term in these writing terms. The Flight column describes
one reference section, "Flight states", throughout; the test questions stay in
[Ontology Facets](../../ontology/SKILL.md#facets).

| Facet | Writing term | Flight example |
|---|---|---|
| Definition | The title or term, a one-sentence scope note, and the non-preferred names that point to it, as in a glossary entry | Title "Flight states". Scope note: what each state of a flight means. "Leg states" points here. |
| Responsibility | The one reader question the unit answers, which sets its topic type: concept, task, or reference | It answers "What does each flight state mean?", so it is a reference topic. |
| Boundary | The questions the unit leaves to named sibling topics | How to delay a flight belongs to the task "Delay a flight". Who may cancel a flight belongs to "Operations-control permissions". |
| Relationship | Broader, narrower, and related topics, the reason for each cross-reference, and the kinds the unit explains | Narrower than "Flight operations guide". Explains the Flight lifecycle Process and the `Flight.state` Property. Links to "Delay a flight" because a delay moves the times but not the state. |
| Properties | The fields every unit of its type carries, each with its allowed values | Each state entry carries `state` (`scheduled`, `departed`, `arrived`, or `cancelled`) and `last_verified` (a date). |

## Kinds in Writing

A document or section is an artifact, not a kind. Its Relationship names each kind it explains, in the writing
form below.

| Kind | Writing form | What the writing states | Flight example |
|---|---|---|---|
| Object type | Concept topic or glossary entry | What the thing is, how one is told from another, and what it is not | Glossary entry *Flight*: one scheduled trip of one aircraft between two airports on one date. *Leg*: use *flight*. |
| Property | Reference entry | Its allowed values, whether it is required, whether it changes, and its origin: entered by a task, captured from a named system, or derived, and how | "Booked seat count" says the count comes from the flight's bookings. |
| Link type | Cross-reference sentence | Both ends, each named as seen from the other end, and how many of each | "Each flight has one aircraft; an aircraft operates many flights." |
| Interface | One shared topic that each implementing concept topic links to | The shared facts, written once | None: the Flight model has no Interface. |
| Function | Explained rule or formula | Its parameters, output, and method; it changes nothing | "Connection rule" explains Meets minimum connection time: a passenger's next booked flight after an arriving flight is a connection when it departs from that flight's arrival airport. The connection meets the rule when it departs at least that airport's minimum connection time after the arrival. |
| Action type | Task topic | Steps from its parameters, preconditions from its submission criteria, results from its operations and side effects, and troubleshooting from its failure result | "Delay a flight"; see the example below. |
| Automation | Reference entry for an automatic behavior | The condition that starts it, what it runs, whom it alerts, and what happens when it fails | "Automatic connection checks" says that a change to a flight's estimated arrival rechecks its connecting bookings and alerts the operations controller at the connecting airport of each failed connection. |
| Process | State table in a reference topic | Each state, and the task that moves an object out of it | "Flight states" lists the four states and names the tasks "Depart a flight", "Arrive a flight", and "Cancel a flight" that move a flight between them. |
| Security policy | Permissions statement | Who may read, run, or propose what, under which condition | "Operations-control permissions": only operations controllers may delay or cancel a flight, and only when it departs from their assigned airport. |

Example: the task "Delay a flight" explains the Delay flight Action type. Its steps ask for the flight, the new
estimated departure, and a reason. Its precondition says the flight must be scheduled and the new time must be
later than the current estimate. Its result says both estimated times move and booked passengers are notified. Its
troubleshooting says that a flight that has already departed stays unchanged, and the controller sees which
condition failed.
