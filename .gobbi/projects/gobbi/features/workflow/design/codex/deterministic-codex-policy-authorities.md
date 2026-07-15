---
name: deterministic-codex-policy-authorities
description: "Defines the effective native, workflow, bridge, validation, and delivery authorities for Codex defaults."
type: design
scope: feature
feature: workflow
status: active
created: 2026-07-10
session: 019f4a1e-8898-7e51-845b-ec289f1400c7
tags: [codex, design]
keywords: [gpt-5.6-sol, xhigh, authority]
author: codex
related: [claude-to-codex-bridge-contract, validator-and-residual-guard-design, plugin-delivery-and-alias-topology]
---

# Deterministic Codex policy authorities

## Problem
Gobbi's model and effort behavior varies because native config, role wrappers, workflow settings, bridge commands, policy docs, and validators encode different inheritance rules.

## Scope
Update exactly the locked 19 current files. Preserve Claude models, runtime security posture, histories, fallback behavior, and role taxonomy.

## Approach
Set `gpt-5.6-sol` at repository config, all five canonical wrappers, both settings templates, and every live proposer/evaluator bridge command. Set effective `xhigh` at config, wrappers, and each bridge run.

## Scenarios
Native roles, settings bootstrap, Claude-hosted bridge runs, partial updates, plugin distribution, historical isolation, unsupported accounts, cost, pointer drift, and rollback.

## Validation
Use exact TOML and JSON assertions, command-form coverage, compatibility checks, alias checks, and the final 19-modification diff gate.

## Trade-offs
Determinism improves consistency but increases cost and reduces local machine control.

## Open issues
Planning must complete negative-side residual classification and same-task workflow/validator sequencing.

## Related
- [[model-and-effort-defaults]] — the user choice this design implements.
