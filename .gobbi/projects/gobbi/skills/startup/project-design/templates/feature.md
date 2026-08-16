# {Feature} — Feature

Derive every heading from accepted interview topic ids. Never invent a lifecycle
answer. Fill each heading, write `Not applicable — {reason}`, or write
`Open — {what would resolve it}`. A refused use is not a feature file.

Open Actors, Scope, or Behavior on a feature that can sit in the first horizon
is blocking. Ask before leaving those Open.

## Purpose

- Statement: {why this feature exists}
- Source: `core-tasks`

## Actors

- Actor: {who}
- Role: {what they do}
- Source: `task-actors`

## Scope

- In scope: {this feature covers}
- Out of scope: {this feature does not cover}
- Source: `task-scope`, `refused-use`

## Behavior

### Normal

- {ordinary path}
- Source: `task-behavior`

### Alternate

- {valid other path}
- Source: `task-behavior`

### Invalid

- {rejected input or use}
- Source: `task-behavior`

## Failure / Recovery

### Failure

- {what the consumer sees when it breaks}
- Source: `failure-recovery`

### Recovery

- {how the consumer recovers}
- Source: `failure-recovery`

## Structure

### Parts

- Statement: {which parts implement this feature}
- Source: `shape`

### Data

- Statement: {what data this feature holds, and which source is authoritative}
- Source: `data`

### Interfaces

- Statement: {which boundary this feature exposes}
- Source: `interfaces`

## Constraints and qualities

- Statement: {limits and qualities}
- Source: `constraints`, `quality-priority`

## Open questions

| Id | Question | Blocking | What would resolve it |
|---|---|---|---|
| {topic-id} | {question} | {yes \| no} | {evidence or decision} |

- Source: open ids used above

## Interview sources

- {topic-id}
- Source: the topic ids actually cited

## Acceptance

- User accepted this draft: {yes | no}
- Accepted by: {user}
- Date: {date}
- Session-only: this file is not Memory.
- Source: session record; not a topic
