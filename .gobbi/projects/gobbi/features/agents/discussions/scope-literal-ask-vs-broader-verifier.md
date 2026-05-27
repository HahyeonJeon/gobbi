---
name: scope-literal-ask-vs-broader-verifier
description: User decision to scope the skill-loading matrix + Load-Directives validator to the literal ask rather than a broader delegation contract verifier; broader framing deferred to backlog.
type: discussions
scope: feature
feature: agents
status: active
created: 2026-05-23
session: 1b26cf20-677b-498c-8c1b-7d7e971597ac
tags: [t2, scope, validator, delegation-contract]
---

# Validator scope: literal-ask (skill-loading matrix + validator) vs broader delegation contract verifier

## Context

The proposed structural fix was a canonical role × phase × required-skills matrix plus a validator that checks each delegation prompt's Load Directives against it. The question was how wide to draw the scope: keep it to that literal ask, or broaden it into a generic verifier of the whole delegation contract.

## Question

Should the validator be scoped to the literal ask (the skill-loading matrix + a Load-Directives validator), or broadened into a generic "delegation contract verifier"?

## Options considered

1. **Literal-ask scope** — build only the skill-loading matrix and the Load-Directives validator that reads from it. Bounded, directly addresses the observed skill-omission failure.
2. **Broader delegation-contract verifier** — a generic verifier checking the full delegation contract (not just Load Directives). Larger scope, more design surface, ambiguous boundaries.

## User decision

The user locked the **literal-ask scope**: the matrix plus the Load-Directives validator. The broader "delegation contract verifier" reframing was deferred to a backlog entry (`features/agents/backlogs/broader-delegation-contract-verifier.md`, if/when promoted) for a future session to pick up.

## Implication

The matrix-plus-validator task was itself subsequently deferred for the session (judged too ambiguous to specify during the design round), so no implementation shipped this session. The locked literal-ask scope framing is preserved so that whenever the task is picked up, it starts from the bounded scope rather than re-litigating literal-ask vs broader-verifier.

## Related

- Backlog (if promoted): `features/agents/backlogs/broader-delegation-contract-verifier.md`
