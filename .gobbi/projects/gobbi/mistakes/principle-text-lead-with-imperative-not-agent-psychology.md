---
name: principle-text-lead-with-imperative-not-agent-psychology
description: Principle/rule text was drafted leading with agent-psychology framing and padded with unrequested cross-references and carve-outs; lead with the imperative and include only what the user asked for.
type: mistakes
scope: project
feature: guardrails
status: active
created: 2026-06-07
session: b02c3111-68be-4558-a19f-fabf9627602f
tags: [docs-sync, writing, principles, design]
priority: medium
domain: docs-sync
supersedes: null
superseded_by: null
---

# Principle text should lead with the imperative, not agent-psychology — and not add unrequested cross-refs

## What went wrong

When drafting Principle 10 ("Finish In-Scope Work"), the text led with agent psychology — "Agents tend to mark a task done while **quietly** leaving part of its agreed scope as 'future work'" — and spent a Why sentence + a Practice bullet on the out-of-scope-deferral carve-out ("Defer only what is out of scope, and never silently"). The user corrected: the point of P10 is not that agents *quietly* defer; it is that agents must **not defer in-scope work** — full stop. The "defer only what is out of scope" framing was unwanted.

Separately, Principle 9 was given two forward cross-references to Principle 6 (a Why sentence and a "Defer to Principle 6 for docs" practice bullet) that the user had not asked for; the user told us to remove them.

## Why it happened

Two over-additions: (1) leading a principle with a description of the failure *behavior/psychology* ("agents tend to quietly…") instead of the positive *imperative* the principle commands; (2) adding "helpful" cross-references and defensive carve-outs beyond the user's stated intent, on the theory that more reconciliation = more rigor. Both add words the user did not want and bury the point.

## How to recognize it before repeating

- The first sentence of a principle/rule describes what agents *tend to do wrong* (psychology) rather than stating the rule.
- You are adding a cross-reference to another principle/doc that the user did not ask for ("for completeness").
- You are adding a carve-out/caveat ("X is allowed, but only when…") that the user's intent does not require.

## Corrected approach

- Lead principle text with the **positive imperative** — the actual point — then explain the failure it prevents in one line if needed.
- Include only the cross-references and carve-outs the user asked for. When in doubt, leave them out and ask.
- Apply Principle 7 (plain, brief, literal): cut the framing and the defensive caveats; say the rule.
