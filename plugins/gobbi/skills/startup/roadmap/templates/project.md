# {Project} — Roadmap

Record project-level direction and local-then-cloud horizons. Do not write
dates, estimates, assignees, sprints, or tasks. Fill each heading, write
`Not applicable — {reason}`, or write `Open — {what would resolve it}`.

## Direction

{Two to four sentences. Default order: local single-user or local first check
before cloud or multi-user, unless Interview recorded a different rule.}

- Source: `horizon-direction`, `success-and-stop`

## Current position

- Now: {what is true now}
- Local or cloud: {local, cloud, or mixed}
- Bootstrap: {already run, not run, or unknown}
- Source: `local-or-cloud`, `first-check`

## Horizons

Three to six blocks in order. First included horizon is local when cloud is in
scope later. Do not place a feature with Blocking-open Actors, Scope, or
Behavior in the first included horizon.

### {Name}

- Name and outcome: {outcome this horizon delivers, not tasks}
- Included feature ids: {kebab ids from feature files and the Feature index, or none}
- Entry condition: {evidence, decision, or earlier outcome that must exist first}
- Exit evidence: {observable result that ends this horizon}
- Deliberately deferred: {what this horizon does not take}
- Costly decision: {costly-to-reverse decision, or none}
- Source: `horizon-direction`

## Feature order

Every feature file appears in exactly one horizon or in Not scheduled.

| Id | Horizon or not scheduled |
|---|---|
| {kebab} | {horizon name or not scheduled} |

- Source: Feature index and `feature/<feature>.md`

## Replan and stop

- Replan: {observation that requires the horizon order to be revised}
- Stop: {observation that requires a horizon or the project to stop}
- Source: `success-and-stop`

## Not scheduled

| Id | Why not scheduled |
|---|---|
| {kebab} | {reason} |

- Source: Feature index rows not placed in a horizon

## Open questions

| Id | Question | What would resolve it |
|---|---|---|
| {id} | {question} | {evidence or decision} |

- Source: open placement or rule items

## Acceptance

- User accepted this draft: {yes | no}
- Accepted by: {user}
- Date: {date}
- Session-only: this file is not Memory.
- Source: session record; not a topic
