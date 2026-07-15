---
name: python-compaction-band-exception
description: Ship the python skill at the union-complete 12-doc aggregate (~27,790 words), exceeding the 24,500 ceiling, as a user-approved band-exception.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-07-14
session: 6a9e0963-2ca1-4d07-83d3-1889aa16bcf4
tags: [docs-sync, process]
keywords: [python-skill, compaction, word-band, band-exception, union-complete, lock-3]
author: claude
supersedes: null
superseded_by: null
related: [python-coding-interface-narrowness-principle]
---

# Ship the python skill over the word band as a union-complete band-exception (LOCK 3)

## Context

The python-skill compaction planned a 23,500–24,500-word band for the 12-doc bundle. After
the T4–T8 compaction plus the new interface-narrowness principle, the final aggregate landed
at ~27,790 words (target 24,200, ceiling 24,500 → +3,290 over). LOCK 3 (word band) is an
Always-Ask decision, so the overage was surfaced to the user.

## Decision

Ship the python skill at its union-complete 12-doc aggregate of ~27,790 words, exceeding the
planned band, as a user-approved band-exception (LOCK 3). User-approved 2026-07-14/15.

## Rationale

The union GREW this session — a new 9th python principle, a corrected §2 interface-narrowness
example, a restored durability mechanism, and prior-session DONE-doc union restoration. Both
dual-system evaluations judged every child doc union-limited. The docs are at their genuine
union-preserving floor: a full prose-tighten pass recovered only ~91 words of true filler
(design 2,655→2,591, convention 1,965→1,938, both union-preserved, commit `09cad177`). The
lower Codex-peer counts were union-INCOMPLETE — they had dropped the RetryBudget branch, the
AppConfig fields, conditions in typing/convention, six named primitives in
concurrency/performance, and a durability mechanism plus named APIs in interoperability, all
caught and restored by the dual-system evaluation. Even a full leaner re-pass reaches only
~27,400 — still over. Forcing the band would drop union, which is forbidden.

## Alternatives considered

- **Force the docs down to the band** — rejected: the only way to reach 24,500 is to drop
  union conditions, which the union-scope floor forbids.
- **A union-safe leaner trim pass (Codex density)** — attempted as batch 1; recovered only
  ~91 words of genuine filler before hitting the union floor; the user stopped the re-pass
  after batch 1 and approved the exception.

## Consequences

- The 24,200/24,500 band is retired for this skill as originally set; the binding property is
  UNION COMPLETENESS + correctness (dual-system PASS), not the word band.
- A future session MAY revisit density only via a union-safe structural restyle
  (bold-labels → plain bullets) — offered and declined this session.
- Word-band targets for future compaction should be projected from the union-complete floor,
  not from the leaner Codex-peer count.

## Related

- [[python-coding-interface-narrowness-principle]] — the interface-narrowness principle whose addition contributed to the union growth this band-exception accepts
