---
name: dual-system-caught-broken-teaching-example
description: In compaction the Codex evaluator caught a broken teaching example plus named-primitive/durability drops on 3 of 6 tasks that the Claude eval and all mechanical gates passed.
type: learnings
scope: project
feature: null
status: active
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [evaluation, codex, docs-sync]
keywords: [dual-system, codex-evaluator, teaching-example, named-primitive, semantic-fidelity, compaction]
author: claude
supersedes: null
superseded_by: null
related: [dual-system-catches-union-narrowing-in-compaction, on-deepen-not-restate-weight-the-codex-evaluator, dual-system-eval-caught-real-defects-every-gate]
---

# In compaction, weight the Codex evaluator on semantic and named-primitive example fidelity

## Insight

On doc-compaction work the Codex evaluator catches not just dropped conditions but two further
classes of SEMANTIC defect the Claude evaluator and every mechanical gate pass: a BROKEN
teaching example (one that teaches the opposite of its point) and dropped NAMED
PRIMITIVES / durability mechanisms. Across this session's six compaction tasks, Codex forced a
REVISE on three of them for exactly these defects. Weight the Codex evaluator on the semantic
and named-primitive fidelity of examples and mechanisms — not only on structural union
preservation.

## Context

Continuing the python-skill T4–T8 compaction, dual-system evaluation ran on each task. The
Claude evaluator plus all mechanical gates (word-count, AST parse, anchor resolution,
condition-level union-diff) passed cleanly, but the Codex evaluator caught a distinct real
defect on three of the six tasks:

- **T4** — the §2 interface-narrowness bad→good example was semantically WRONG: the "bad"
  aggregate carried only the fields the unit used (a cohesive value, i.e. the GOOD form), and
  only two of three contracted good branches were shown as code. See
  [[stamp-coupling-example-must-show-unused-fields]].
- **T6** — six named operational primitives (`max_workers`, `queue.Queue` thread-safety,
  `ContextVar` copied-context, SQL `IN (...)`, `print_stats(20)`) dropped while their parent
  conditions survived. See [[union-diff-must-reach-named-primitive-granularity]].
- **T7** — the POSIX directory-fsync durability mechanism (`os.open`/`os.fsync`/`os.close`)
  reduced to a bare comment — the crash-durability HOW dropped while the condition survived.

All were restored; each task went iter1 REVISE → iter2 PASS.

## Reason

If this is lost, a future compaction session may lean on the Claude evaluator plus mechanical
gates and ship a doc whose headline example teaches the opposite of its lesson or whose
conditions survive as empty shells with their operative APIs gone. These defects are invisible
to structural checks by construction — a broken example still parses and has an anchor; a
gutted condition still matches a coverage map. The value is the Codex evaluator's independent
semantic close-read, which caught a real defect on half the tasks.

## How

For any doc compaction, run both evaluators and, when they diverge, weight the Codex finding
on: (1) whether each teaching example still demonstrates its stated point (count declared vs
used surface; confirm every contracted branch is shown as code); (2) whether each named
primitive and mechanism in the source survives at named-primitive granularity. Treat "the
Claude evaluator and all mechanical gates passed" as necessary, not sufficient — read the
Codex semantic findings before recording PASS.

## Counter-cases

- **A single-system (Claude-only) run** does not get this cross-system catch; it must run the
  semantic example + named-primitive checks itself, and loses the independent second look.
- **A greenfield doc with no pre-edit source and no worked example** has neither a union to
  drop nor an example to break — this weighting is for compaction/reframe of existing
  example-bearing content.

## Related

- [[dual-system-catches-union-narrowing-in-compaction]] — the prior-session learning this reinforces and extends to broken examples + named primitives
- [[on-deepen-not-restate-weight-the-codex-evaluator]] — the sibling "weight Codex on this axis" learning, for the deepen-not-restate axis
- [[dual-system-eval-caught-real-defects-every-gate]] — the general "a real defect at every gate" pattern
