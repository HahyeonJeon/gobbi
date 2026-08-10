---
name: gobbi-dev
description: "MUST load before choosing Gobbi development lifecycle names, topology, branch roles, handoff vocabulary, or evidence forms; installing, verifying, or recovering a released Gobbi plugin deployment in caller-named isolated Claude Code and Codex targets; realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs; preparing or recovering a Gobbi release candidate, supplying a frozen Gobbi release candidate to Evaluation before manager or user acceptance, or promoting, publishing, or recovering an accepted Gobbi release; reviewing one Gobbi change or the whole Gobbi project for scoped evidence and findings without an acceptance verdict; collecting exact-revision test evidence for Gobbi; or choosing or diagnosing Gobbi project commands, tools, prerequisites, and effects. Gobbi Development Lifecycle is a domain skill that routes the task to its applicable operation, tool, and preference child skills."
allowed-tools: Read
skill-type: domain
---

# Gobbi Development Lifecycle

Gobbi Development Lifecycle gives repository maintainers and agents selective guidance for accepted change
work and independently triggered lifecycle lookup. Broad pre-acceptance design stays outside this domain unless
one of the exact triggers below also applies.

This root owns navigation only. Load every child whose trigger applies, and load no child whose trigger does
not apply.

## Child Skills

| Child skill | Type | Load when |
|---|---|---|
| [`gobbi-dev-conventions`](gobbi-dev-conventions/SKILL.md) | preference | MUST load when choosing Gobbi development lifecycle names, topology, branch roles, handoff vocabulary, or evidence forms. |
| [`gobbi-dev-deployment`](gobbi-dev-deployment/SKILL.md) | operation | MUST load when installing, verifying, or recovering a released Gobbi plugin deployment in caller-named isolated Claude Code and Codex targets. |
| [`gobbi-dev-development`](gobbi-dev-development/SKILL.md) | operation | MUST load when realizing an accepted Gobbi change contract and coordinating it through a verified local commit and lifecycle handoffs. |
| [`gobbi-dev-release`](gobbi-dev-release/SKILL.md) | operation | MUST load when preparing or recovering a Gobbi release candidate, supplying a frozen Gobbi release candidate to Evaluation before manager or user acceptance, or promoting, publishing, or recovering an accepted Gobbi release. |
| [`gobbi-dev-review`](gobbi-dev-review/SKILL.md) | operation | MUST load when reviewing one Gobbi change or the whole Gobbi project for scoped evidence and findings without an acceptance verdict. |
| [`gobbi-dev-testing`](gobbi-dev-testing/SKILL.md) | operation | MUST load when collecting exact-revision test evidence for Gobbi. |
| [`gobbi-dev-toolchain`](gobbi-dev-toolchain/SKILL.md) | tool | MUST load when choosing or diagnosing Gobbi project commands, tools, prerequisites, and effects. |
