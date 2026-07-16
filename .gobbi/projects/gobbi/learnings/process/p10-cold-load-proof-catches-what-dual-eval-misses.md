---
name: p10-cold-load-proof-catches-what-dual-eval-misses
description: A fresh-agent P10 cold-load proof caught interpretive divergence points that a PASSing dual-system adversarial eval missed on both skills.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-16
session: 59694f66-422a-4fd5-b93b-625c2f354fc3
tags: [process, verification]
keywords: [cold-load-proof, p10, dual-system-evaluation, fresh-agent-test, skill-authoring]
author: claude
related: [single-evaluator-pass-is-provisional]
---

# Run a fresh-agent cold-load proof even after dual-eval PASSes

## Insight

The dual-system adversarial evaluation (Claude + Codex) PASSed both the `scenario` and `checklist`
skills, but a separate fresh-agent P10 cold-load proof — spawning an agent that loads ONLY the skill
doc and produces a real artifact from it — found interpretive divergence points neither evaluator had
flagged. The two checks ask different questions and are complementary, not redundant.

## Context

After both skills reached dual-system PASS, a cold-load proof step had a fresh agent load each skill in
isolation (no other project context) and actually author a scenario set / checklist from it. That agent
hit three divergence points: (1) in `scenario`, the `n/a` vs `covered-elsewhere` disposition had no
decision test to tell an agent which to pick; (2) in `checklist`, P2's instruction to "import the
category hierarchy" read as in tension with a separate one-way "don't reproduce the taxonomy" rule,
with no worked example resolving the apparent contradiction; (3) neither skill had a gate-vs-required
test distinguishing which eval-register entries block completion versus which are merely informational.
None of these were structural defects an adversarial evaluator's checklist would catch — they were
consistency/interpretation gaps that only surfaced when an agent actually tried to follow the doc cold.

## Reason

Without the cold-load proof, both gaps would have shipped invisibly: dual-eval had already returned
PASS, so nothing in the existing gate would have caught them, and the first real failure would have been
a future agent silently resolving the ambiguity a different way than intended — a drift with no error
message, discovered only much later when two agents' outputs disagreed.

## How

Treat the P10 fresh-agent cold-load proof as a required step for any skill meant to be loaded cold
(no accompanying human explanation) — run it AFTER dual-eval PASSes, not instead of it. Have the fresh
agent load ONLY the skill doc (not the design history, not the authoring session) and produce a real
artifact end-to-end. Read the artifact for silent judgment calls the agent had to make on its own; each
one is a candidate ambiguity the skill doc should resolve explicitly (a decision test, a worked example,
or an explicit gate/required distinction).

## Counter-cases

Does not apply to a skill whose doc always ships alongside a human collaborator who can answer questions
in real time (the ambiguity gets resolved conversationally, so a cold-load proof adds less value). Also
does not replace dual-eval: the cold-load proof is weak at catching correctness/completeness defects
against a spec (that is what the adversarial eval is for) — it is strong at catching interpretive
ambiguity, and the two checks should both run, not substitute for each other.

## Related

- [[single-evaluator-pass-is-provisional]] — the sibling lesson that a PASS from one evaluation
  mechanism is not evidence of the absence of what a DIFFERENT mechanism checks for
