---
name: recurring-guard-root-closure-criterion
description: Record why iter4 PASSed after 3 REVISE rounds so future RECORD and Wrap-up consumers know the closure was earned.
type: decisions
scope: project
feature: null
status: accepted
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification, process]
keywords: [guard-segmentation, recurring-revise, root-closure, iter4-pass, eval-anti-groupthink]
author: claude
supersedes: null
superseded_by: null
related: [guard-revises-twice-means-scope-model-wrong, guard-cited-as-runtozero-without-matching-vocab]
---

# Recurring guard-root closure criterion at iter4

## Context

The recurring guard root (`guard-cited-as-runtozero-without-matching-vocab`) drove three consecutive REVISE rounds during the memory-migration-curation-campaign Ideation. The Codex iter4 evaluator (`codex-iter4-overall-frame-1`, general/process, Low@100) requested that the RECORD phase document the closure criterion so future consumers understand why iter4 PASSed after three REVISEs.

## Decision

Iter4 closed the recurring guard root by STRUCTURAL FIX rather than count-patching. The closure criterion is:

1. **Segmentation:** the conflated single-vocabulary guard was split into two independent `(vocab, scan-surface, allowlist)` triples. Family A (`memorization` vocabulary) stays on its existing `skills/` surface. Family B (the migration's retired forms) targets the memory tree.

2. **Derivation from fresh run:** each family's allowlist was MEASURED, not guessed. Family B: `grep -rlE '_shared|\.effective|tagAreaMap\.(spine|mistakes)' --include='*.md' mistakes notes features backlogs reports | grep -v /archive/` → 19 files. The allowlist equals the measured output; a re-run yields the same 19.

3. **Reachable by construction:** post-allowlist Family-B residual = 0 by construction. The gate does not rely on a guessed count that the next evaluator could refute by running the command.

4. **Fresh-verified by both systems:** Claude ran `check-residual-vocab.sh mistakes notes features backlogs reports` → 243 residual / 49 files / exit 1 (ALL Family-A `memorization`-family, ZERO Family-B — proves the conflation). Codex ran `rg -l "_shared|\.effective|tagAreaMap\.(spine|mistakes)" ...` → 19 live files + 1 archive. Both verified the same 19-file set and the same zero-by-construction property.

## Rationale

Three consecutive REVISEs (iter1 VOCAB, iter2 scan-surface, iter3 allowlist-count) all shared one root: the guard's scope model was wrong — two vocabularies with different scopes forced through one triple. Each count-patch guessed a residual the next evaluator refuted. The structural fix (segment) eliminates the guessing by making the gate a function of a measured, reproducible run. A future agent can reproduce the same 19 carriers and the same zero — that is the closure criterion, not a specific count.

## Alternatives considered

Continuing to count-patch the single-vocab guard was the path the prior three iterations took; it was rejected at iter4 because each patch guessed a residual the next evaluator refuted by running the actual command. The structural segmentation replaces the guessing with measurement.

## Consequences

- Planning and Execution consumers can rely on the Ideation output as a solved scope-model problem, not a deferred count question.
- The Execution Task 1 deliverable is: enumerate both families' allowlists from fresh runs (Family A also has 4 current exit-1 carriers — see the `family-a-allowlist-completeness` checklist), embed them in the extended guard source with per-entry reasons, verify each family → 0.

## Related

- [[guard-revises-twice-means-scope-model-wrong]] — the mistake this decision's closure criterion operationalizes
- [[guard-cited-as-runtozero-without-matching-vocab]] — the recurring root this criterion closes
