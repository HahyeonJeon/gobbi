---
name: amend-cold-use-acceptance
description: Record the user's narrow amendment that omits runtime cold-use proof from final acceptance.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-26
session: bae334bf-c3df-4155-bbd0-92d5a36f3feb
tags: [evaluation, process]
keywords: [react-pr-369, cold-use, omitted, static-route]
author: user
supersedes: null
superseded_by: null
---

# Omit runtime cold-use proof from final acceptance

## Context

At `Planning / DISCUSSION / iteration 4 / task null`, the user first asked to skip the cold-use test and then selected the fast compliant path. That path authorizes only this acceptance amendment before implementation.

## Decision

Preserve the intended normal-entry and Principle 7 design. Preserve a static final-source route to the `skill-writing` cold-use owner for future validation.

Remove runtime cold-use proof from acceptance for this session. Do not run a dedicated cold-use runtime test. The final handoff must say that cold-use proof was intentionally omitted by the user and that runtime behavior remains unverified. It must not claim a Principle 7 runtime PASS or a cold-use runtime PASS.

Return to Ideation iteration 3 so this amended What, Why, and How becomes the current scope contract before Planning iteration 4.

## Rationale

This preserves the intended entry design and a verifiable static route while honoring the user's explicit request to omit the runtime test. It also prevents an absent runtime result from being reported as evidence.

## Alternatives considered

- Running the cold-use test was rejected by the user's explicit instruction.
- Treating the missing proof as a PASS was rejected because omission is not technical evidence.
- Dropping the normal-entry design and static route was rejected because the user authorized only an acceptance amendment.

## Consequences

Execution task `07-cold-load-proof` retains its stable identity but changes its accepted output to a static final-source route and an explicit omission record. The final status must record `cold_use_status: omitted_by_user`, `runtime_proof: absent`, and `accepted-final-source-static-route`. This decision grants no merge, publication, branch deletion, or worktree cleanup authority.
