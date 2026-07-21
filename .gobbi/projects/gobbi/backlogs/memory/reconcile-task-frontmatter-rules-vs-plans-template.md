---
name: reconcile-task-frontmatter-rules-vs-plans-template
description: memory/rules.md lists task as forbidden session-routing residue; memory/templates/plans.md:49 sanctions task as a descriptive Scope-Contract field — contradictory
type: backlogs
scope: project
feature: null
status: open
created: 2026-06-14
session: 2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d
tags: [memory, frontmatter]
keywords: [docs, rules, plans]
author: claude
priority: low
project-scope: true
shipped_in: null
---

# Reconcile `task:` frontmatter: rules vs plans template

## Context

Two authoritative memory documents contradict each other on the `task:` frontmatter field:

- `memory/rules.md` §4.4 Session-routing residue — lists `task` (alongside `loop`, `iter`, `slug`,
  `status: staged`, etc.) as a forbidden staging-routing key that MUST be stripped on promotion.
- `memory/templates/plans.md:49` — sanctions `task: {task name from Scope Contract}` as a
  legitimate descriptive field in promoted plan files. The template line reads:
  `task: {task name from Scope Contract}` under the plans base+ext frontmatter block.

The contradiction means the live frontmatter-allowlist compliance gate (which rejects `task:` as
session-routing residue) over-matches plans files that follow the template. A conformant plan
promoted in the 2026-06-14-f2732c8e session carries `task: Improve the git skill to fully cover
git/GitHub operations across Claude Code and Codex runtimes` and was flagged as CONS-1 by the
Codex stage-3 evaluator.

## Why deferred

The promoted plan is template-conformant and was left as-is (the template is the closer-to-intent
source; the over-broad rule is the bug). Resolving the contradiction requires a rules-update
decision, not just a one-liner fix — the rules.md enumeration is used by the conformance gate
and a change has blast-radius across all plan files. Low priority; no functionality is broken.

## When to pick up

No prerequisites. Can run any time as a standalone doc-fix session.

## Suggested approach

Read `memory/rules.md` §4.4 and `memory/templates/plans.md` together. Determine whether `task:`
in a plan is a descriptive Scope-Contract label (distinct from a session task-id code) or a
routing artifact. If descriptive, add a carve-out in rules.md: "Exception: `task:` in a
`type: plans` file is the Scope-Contract task name (see plans template) and is NOT session-routing
residue." Update the conformance gate accordingly. Cross-check any other type templates for
similar carve-outs needed.

## Originating session

`.gobbi/projects/gobbi/sessions/2026-06-14-f2732c8e-c37d-4ebf-8f25-575e8a17d87d/`
Surfaced by the Codex stage-3 evaluator (CONS-1) during Wrap-up of the dual-runtime git skill
session. The affected promoted plan is at
`archive/plans/git/2026-07-20-dual-runtime-git-skill.md`.
