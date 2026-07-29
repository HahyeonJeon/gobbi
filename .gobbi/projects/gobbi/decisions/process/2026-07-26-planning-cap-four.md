---
name: planning-cap-four
description: Record the user's extension of Planning maxIterations from three to four.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [planning, process]
keywords: [react-pr-369, planning, max-iterations, iteration-4]
author: user
supersedes: null
superseded_by: null
---

# Extend the Planning iteration cap to four

## Context

At source cursor `Planning / RECORD / iteration 3 / task null`, the session manifest still resolves `settings.workflow.planning.maxIterations` to `3`, and the iteration 3 evaluation verdict is `REVISE`. The user supplied this exact authority:

> Approve both findings as open; extend Planning maxIterations to 4; Claude absent Planning iteration . We don't have enough token. Please consider move to execution as soon as possible.

This record applies the cap-extension clause only. The separate finding decision records the approved dispositions.

## Decision

Extend `settings.workflow.planning.maxIterations` from `3` to `4`. This authorizes exactly one additional Planning pass, Planning iteration 4, after the iteration 3 `REVISE` result.

The malformed clause `Claude absent Planning iteration .` contains no iteration number. It is not a valid named waiver, must not be repaired or inferred, and grants no Claude-absence waiver for Planning iteration 4. This decision is not a waiver file.

## Rationale

One bounded additional pass is needed to resolve the two approved open findings. Extending the cap preserves the mandatory Planning acceptance gate while limiting further work to one iteration.

## Alternatives considered

- Moving directly to Execution was rejected because Planning iteration 3 has an evidence-derived `REVISE` verdict and two approved open findings.
- Leaving the cap at `3` was rejected by the user's explicit extension to `4`.
- Extending beyond `4` was rejected because the user authorized only the stated cap.
- Inferring a Planning iteration 4 Claude-absence waiver was rejected because the supplied clause omits the required iteration number.

## Consequences

The manager may checkpoint `settings.workflow.planning.maxIterations: 4` and route to Planning iteration 4. This staging record does not itself mutate `session.json` or `state.json`. Planning iteration 4 still requires the normal dual-system contract unless the user supplies an exact waiver naming that step and iteration. This decision grants no Execution, source-edit, publication, merge, or cleanup authority.

## Related

- Session manifest before checkpoint: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/session.json` at SHA-256 `d5a4663089533503a075ec6a788375328ef8306533154eb5cbf4d8e6ab9a3305`.
- Router before checkpoint: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/state.json` at SHA-256 `dbb22f728463261af8ed67b28e7dffa697e68c3a66f78dd80a79430740e2cb46`.
- Planning iteration 3 evaluation: `.gobbi/projects/gobbi/sessions/2026-07-25-bae334bf-c3df-4155-bbd0-92d5a36f3feb/2-planning/evaluation/iteration-3/codex.md` at SHA-256 `3d01582586e2cfb6ef20f3f0c269a5ead1ad3f4b3d57f5713336b51c907e9f2c`.
