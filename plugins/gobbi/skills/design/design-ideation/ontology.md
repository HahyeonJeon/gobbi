# Design Ideation Ontology

This document gives the [Ontology](../../ontology/SKILL.md) facets and kinds their design terms for
[Design Ideation](SKILL.md), which loads it in Step 3.1.

## Units

- Each component, user-facing object, and named visual-language term is a unit. A user-facing object is a thing
  the viewer knows and acts on, such as a flight. Record the facets of each component under Components, and of
  each named term under Visual Language. A variant or state is a Properties value of its component, not a new
  component.
- A user-facing object is a domain unit, so its facets live in the session area file. That file holds the
  session's working model of one area in [Ontology Record](../../ontology/SKILL.md#record) format, at the location
  the caller names. Use the preferred name the file gives. Read the area's Memory copy when the session file
  does not exist yet.
- Write a new user-facing object to the session area file as an Object type, and give any other new domain
  concept one kind, as [Ontology Storage](../../ontology/SKILL.md#storage) states. Under Components, give each
  user-facing object's kind and id instead of its facets, and list every unit id the design adds, changes, or
  removes.

## Facets in Design Terms

State each facet of a component or named visual-language term in these design terms. The Flight column
describes one component, `FlightCard`, throughout; the test questions stay in
[Ontology Facets](../../ontology/SKILL.md#facets).

| Facet | Design term | Flight example |
|---|---|---|
| Definition | The name of the component or named visual-language term, a one-sentence description in the viewer's words, and the names that map to it | `FlightCard`: one flight's number, route, times, and state, as one item in a list. "Flight tile" maps to `FlightCard`. |
| Responsibility | The component's purpose: the one thing the viewer uses it for | It shows one flight's summary so that a controller can find the flight and act on it. |
| Boundary | When not to use it, the parts it does not own, and its ARIA role | Do not use it for a flight's full detail, which `FlightDetail` owns. Seat choice belongs to `SeatMap`. It shows no passenger data. Role: `article`. |
| Relationship | Nesting and composition, aliases between named visual-language terms, the Object type it presents, and the Action type each control triggers | `FlightList` nests `FlightCard`, which nests `StateBadge`. It presents Flight. Its Delay control triggers Delay flight. |
| Properties | Props (variant, boolean, text, or slot) with their allowed values, the states it shows, and, for a named visual-language term, its type | `variant`: compact or detailed. `state`: the four `Flight.state` values, `scheduled`, `departed`, `arrived`, and `cancelled`. `selected`: true or false. A cancelled flight is a `state` value, not a new component. |

A named visual-language term takes the same facets. The token `color-state-cancelled` is the color of a
cancelled state. Its Relationship says that it aliases `color.red.700`, and its Properties give its type, color.

## Kinds in Visual Design

A component or a named visual-language term is an artifact, not a kind. Its Relationship names each kind it
presents or lets the viewer trigger, in the design form below. A view presents one Object type, and each
control triggers one Action type.

| Kind | Design form | What the design shows | Flight example |
|---|---|---|---|
| Object type | A view, card, or list item | One object, named by its title Property, with only the properties the viewer needs | `FlightCard` presents one Flight, titled by its number, the Flight title Property, and shows its departure date. |
| Property | A field, label, or badge | Its allowed values, whether it can change while on screen, and a derived value marked as derived | `StateBadge` shows `Flight.state`. `Flight.bookedSeatCount` appears as "Booked seats", read-only, with a note that it is counted from bookings. |
| Link type | A reference link or a nested list between two views | Both ends, each named from the view the viewer is on, and how many of each | `FlightCard` shows the flight's "aircraft" by its registration, and links to the aircraft view only for a role that reads Aircraft. The aircraft view lists that aircraft's "flights". |
| Interface | One base component shared by the views of the Object types that implement it | The shared fields, designed once | None: the Flight model has no Interface, so no base card. |
| Function | A computed indicator | Its result, marked as computed, with no control that changes data | A connection marker on a booking tells the operations duty manager, who may run the Function, whether Meets minimum connection time holds. It changes nothing. |
| Action type | A control, such as a button or menu item, and the dialog it opens | Inputs from its parameters, a disabled or hidden state from its submission criteria or a Security policy, the result from its operations and side effects, and a message from its failure result | The Delay control and the Delay flight dialog; see the example below. |
| Automation | An alert or notification, not a control | The event that started it, what the viewer can do next, and the alert shown when it fails | An alert from Check connections after change tells the operations controller at the connecting airport that a booking's connection failed. It names the inbound flight and its new estimated arrival. |
| Process | State visuals, such as a badge's color and icon | One visual for each Process state, one to one, and only the controls whose Action types' submission criteria allow the current state | `StateBadge` has one visual for each Flight lifecycle state. A departed flight's card offers the Arrive flight control, but not Delay flight or Cancel flight. |
| Security policy | Hidden controls and hidden data | What each role sees and may trigger, under which condition | Under Ops-control policy, a planner sees flights but no control for Delay flight, Cancel flight, Depart flight, or Arrive flight. A controller sees those controls only for flights that depart from the controller's assigned airport. |

Example: the Delay control on `FlightCard` opens the Delay flight dialog. The dialog asks for the new estimated
departure and a reason. The control is disabled once the flight is no longer scheduled, because the submission
criteria require that state. It is hidden for a planner, because Ops-control policy lets a planner read flights
but run no Action type. On success, the card shows both new estimated times and says that booked passengers were
notified. On failure, the flight is unchanged, and the dialog names the failed criterion.
