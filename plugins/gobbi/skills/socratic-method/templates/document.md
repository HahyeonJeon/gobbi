# {Subject}

## Purpose

{What the subject is in one sentence.}

**Questions this document answers:**

1. {What is it?}
2. {What is it made of, and how do the parts connect?}
3. {How does it work?}
4. {What does its field ask of it, such as what makes it good, and how is that judged?}

## Context

{What surrounds the subject: what it serves, what it depends on outside itself, and where its boundary lies.}

## Decomposition

```text
{ID} {Subject}
├── {ID} {Component or Action}
│   └── {ID} {Component or Action}
└── {ID} {Component or Action}
```

{Mark a shared element with `(shared)` under each parent that uses it.}

## Components

{Each component is a unit definition. Its first six fields are the ones the Ontology skill defines; Actions,
Sources, and Status are this document's own.}

### {ID} — {Name}

- **Definition:** {The kind of thing it is, and what sets it apart from its siblings.}
- **Responsibility:** {What it is for, as active verbs.}
- **Boundary:** {What it includes, and what it leaves to other elements.}
- **Relations:** {Relation IDs it takes part in.}
- **Dependencies:** {What it needs, and what breaks if it fails, changes, or disappears.}
- **Properties:** {Attributes with values and units.}
- **Actions:** {Action IDs it performs or takes part in.}
- **Sources:** {Where each claim above comes from.}
- **Status:** {Settled, or open with the open question's ID.}

{Repeat for each component, in decomposition order.}

## Actions

{Each action is a unit definition with the six fields the Ontology skill defines; Steps, Triggers and results,
Sources, and Status are this document's own.}

### {ID} — {Name}

- **Definition:** {What happens, and what sets it apart from similar actions.}
- **Responsibility:** {What it achieves, as active verbs.}
- **Boundary:** {Where it starts and ends, and what it leaves to other actions.}
- **Steps:** {Each step and the component that acts in it.}
- **Triggers and results:** {What starts it, and what it changes.}
- **Relations:** {Relation IDs it takes part in.}
- **Dependencies:** {What it needs, and what breaks if it fails or changes.}
- **Properties:** {Measurable traits such as duration, rate, or order, with values and units.}
- **Sources:** {Where each claim comes from.}
- **Status:** {Settled, or open with the open question's ID.}

{Repeat for each action.}

## Relations

| ID | From | Kind | To | Direction and properties | Source |
|---|---|---|---|---|---|
| {R1} | {element ID} | {part of, connects to, controls, feeds, depends on, …} | {element ID} | {one way or both; values} | {source} |

## How It Works

{One walkthrough per main use or situation: what happens from start to end, naming each component and action ID.}

## Variations

{The kinds, models, or schools of the subject and how their elements differ, or `None`.}

## Assumptions

{What the document takes for granted and why, or `None`.}

## Glossary

| Term | Meaning |
|---|---|
| {term} | {meaning, consistent with its definition above} |

## Open Questions

| ID | Question | What is known | Element |
|---|---|---|---|
| {Q1} | {question} | {current evidence} | {element ID} |

## Challenge Log

| Round | Challenge | Element | Kind | Answer and evidence | Outcome |
|---|---|---|---|---|---|
| {1} | {the Questioner's challenge or follow-up} | {element ID} | {question kind} | {the Analyst's answer and its source} | {changed, rejected, or the open question ID} |

{The Questioner adds the first four cells of each row; the Analyst fills the last two.}
