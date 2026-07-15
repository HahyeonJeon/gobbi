---
name: handoff-python-compaction-complete
description: Python-skill compaction (T4–T8) + the interface-narrowness principle (coding P17 + python P9) are COMPLETE and dual-system PASS; NEXT = merge PR #349.
type: notes
scope: project
feature: null
status: active
created: 2026-07-15
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [evaluation, docs-sync, process]
keywords: [python-skill, compaction, pr-349, dual-system, band-exception, interface-narrowness, handoff]
author: claude
features_touched: []
loops_completed: [ideation, preparation, planning, execution, wrap-up]
shipped: [python-coding-interface-narrowness-principle, python-compaction-band-exception, stamp-coupling-example-must-show-unused-fields, union-diff-must-reach-named-primitive-granularity, producer-must-write-blind-draft-before-reading-codex-proposal, compaction-brief-must-not-list-example-primitives-absent-from-source, codex-eval-overall-md-can-contradict-perspective-verdicts, union-diff-occurrence-vs-distinct-primitive, codex-lean-density-is-often-union-incomplete-not-a-safe-floor, dual-system-caught-broken-teaching-example]
---

# Python-skill compaction COMPLETE — T4–T8 + interface-narrowness principle shipped (PR #349)

## What happened

This session resumed PR #349 in the SAME worktree and branch
(`claude-2026-07-12-f87055a2-08b2-4605-b33b-c01c47416830`). It added a user-raised design
point — interface narrowness — as coding Principle 17 + a specializing python 9th principle
(both soft, both layers; see [[python-coding-interface-narrowness-principle]]) — then ran the
remaining T4–T8 python-doc compaction. Every compaction task ran full dual-system (Claude +
Codex) evaluation before its commit landed, closing out the 8-task decomposition begun the
prior session ([[handoff-python-compaction]] covered T1–T3). All work is dual-system PASS.
Commits span `a5843581` → `09cad177` (~22 commits) on the same branch.

## What shipped

- **coding Principle 17** (narrow the input surface) + python **9th principle** specializing
  it, plus a sharpened "Signatures and data models" rule and the `final P9` legend wiring —
  commits `a5843581` (coding P17) and `130e7638` (python P9). Both dual-system PASS.
- **T4–T8 compaction** of all 8 python child docs, each dual-system PASS: design.md (`8c771393`,
  iter2), convention.md + typing.md (`697d5fcb`), concurrency.md + performance.md (`e09ccc78`,
  iter2), testing.md + packaging.md + interoperability.md (`f4deaf4b`, iter2), and the T8
  wiring/verification + batch-1 prose tighten (`09cad177`). Final 12-doc aggregate = 27,790
  words.
- **Memory promoted this Wrap-up** (all project tier): 2 decisions
  ([[python-coding-interface-narrowness-principle]], [[python-compaction-band-exception]]); 2
  learnings ([[dual-system-caught-broken-teaching-example]],
  [[codex-lean-density-is-often-union-incomplete-not-a-safe-floor]]); 6 mistakes
  ([[stamp-coupling-example-must-show-unused-fields]],
  [[union-diff-must-reach-named-primitive-granularity]],
  [[compaction-brief-must-not-list-example-primitives-absent-from-source]] under
  `mistakes/docs-sync/`; [[producer-must-write-blind-draft-before-reading-codex-proposal]] under
  `mistakes/codex/`; [[codex-eval-overall-md-can-contradict-perspective-verdicts]],
  [[union-diff-occurrence-vs-distinct-primitive]] under `mistakes/verification/`).

## What got stuck

Nothing is stuck — all in-scope work completed and passed. The only open thread is external:
PR #349 is not yet pushed/merged. The promotion commit lands locally on the branch this
Wrap-up; the manager owns push + merge.

## What shifted

The word band was exceeded on purpose. The compaction was planned to a 23,500–24,500-word
band, but the union GREW this session (new 9th principle + corrected §2 example + restored
durability mechanism + prior-session union restoration), landing the union-complete aggregate
at 27,790. Both dual-system evaluations judged every child doc union-limited; the leaner
Codex-peer counts were union-INCOMPLETE (they had dropped conditions the evaluation caught and
restored). The user approved a band-exception rather than trim union — see
[[python-compaction-band-exception]].

## Decisions to respect

- **The word band is retired for this skill; UNION COMPLETENESS + correctness is the binding
  property, not a word count.** See [[python-compaction-band-exception]] (user-approved
  2026-07-14/15). Do not re-open by trimming to the Codex-peer density — that re-drops caught
  union (see [[codex-lean-density-is-often-union-incomplete-not-a-safe-floor]]).
- **coding P17 + python P9 are standalone, soft, both-layer principles** — do not re-frame as
  an extension or a hard invariant. See [[python-coding-interface-narrowness-principle]].
- **A `final P9` legend row unreferenced by any scenario/check is EXPECTED** for a soft
  principle (precedent: `final P5`) — not a defect to "fix".
- **The develop divergence (local `93d75cd1` vs origin `c23907d7`) stays UNRECONCILED and OUT
  of scope** for this PR — do not fold it into #349.

## Next session

- **Merge PR #349.** The manager pushes the branch (push pending) and lands the PR — ~22
  commits `a5843581` → `09cad177` plus this Wrap-up's memory-promotion commit. Reuse the open
  PR if one exists; do not open a duplicate.
- **Optional future density lever:** a union-safe structural restyle
  (bold-labels → plain bullets) was OFFERED and DECLINED this session. A future session may
  revisit python-doc density ONLY through that union-safe restyle, never by dropping union.
- **Reconcile the develop divergence** as a separate, later task (out of scope here).
- **typescript sibling skill** should reuse the interface-narrowness principle (separate future
  work).

## Related

- [[handoff-python-compaction]] — the prior session's handoff (T1–T3 shipped; T4–T8 remained), whose next-steps this note closes out
- [[python-compaction-band-exception]] — the union-complete band-exception this session locked
- [[python-coding-interface-narrowness-principle]] — the coding P17 + python P9 decision shipped this session
- [[dual-system-caught-broken-teaching-example]] — the session's headline dual-system catch
- [[codex-lean-density-is-often-union-incomplete-not-a-safe-floor]] — why the leaner Codex counts were not a safe density floor
