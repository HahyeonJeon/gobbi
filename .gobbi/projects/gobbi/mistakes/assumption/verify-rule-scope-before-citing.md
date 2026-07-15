---
name: verify-rule-scope-before-citing
description: A rule's name is not its scope — read its declared applicability before citing it as governing authority in a brief.
type: mistakes
scope: project
feature: null
status: active
created: 2026-07-12
session: f87055a2-08b2-4605-b33b-c01c47416830
tags: [assumption, process]
keywords: [rule-scope, rule-citation, delegation-brief, evaluation-brief, python-skill]
author: claude
priority: medium
domain: process
---

# Verify a rule's declared scope before citing it in a brief

## What happened

During this session's dual-system evaluation of the `python` skill's `design.md` and
`convention.md` child docs, the manager's delegation and evaluation briefs cited
`rules/docs/point-dont-restate-workflow-docs.md` as the governing rule for the
deepen-not-restate check. That rule is explicitly scoped to `orchestration/workflow/*.md`
and does not govern skill child docs such as the `python` skill's. Both the Claude and
Codex evaluators flagged the mis-citation.

## Why it happens

The rule's name — "point-dont-restate-workflow-docs" — reads like a general
restatement rule, so it was assumed to apply without reading its own declared scope
line. A rule's filename names its subject, not the set of documents it governs; treating
the name as the scope skips the one check that would have caught the mismatch.

## Correct approach

Before citing a project rule as the governing authority in a Load-Directives block or an
evaluation brief, read the rule's own scope / applicability statement first. If it does
not govern the document in question, cite the actual governing standard instead — here,
the child-doc house style plus the `skill-writing` one-owner-per-fact discipline already
covered the deepen-not-restate check, so the underlying discipline held even though the
citation was wrong.

## How to detect

An evaluation or delegation brief names a specific project rule as "the governing rule"
for a document that lies outside that rule's own stated scope (e.g., a rule scoped to
`orchestration/workflow/*.md` cited for a `skills/{skill}/*.md` file). Cross-check the
rule's scope line against the target document's path before trusting the citation. An
evaluator flagging a scope mismatch on a cited rule is the downstream signal this mistake
produces — a mis-cited authority is benign only when the underlying discipline is also
independently covered elsewhere; do not assume that is always the case.
