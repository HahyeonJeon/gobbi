---
name: guard-revises-twice-means-scope-model-wrong
description: When a run-to-zero guard REVISEs more than once patching the same facets, the guard's scope model is wrong — not its count.
type: mistakes
scope: project
feature: null
status: active
created: 2026-06-24
session: 1cd48095-d745-4868-a5ac-f48326eb447f
tags: [verification]
keywords: [check-residual-vocab, run-to-zero, guard-scope-model, vocab-family, allowlist-derivation, false-pass]
author: claude
priority: high
domain: verification
supersedes: null
superseded_by: null
related: [guard-cited-as-runtozero-without-matching-vocab]
---

# When a guard REVISEs twice, its scope model is wrong — not its count

## What happened

The memory-migration-curation-campaign Ideation cited `check-residual-vocab.sh` as a run-to-zero completion gate for the migration (retiring `_shared`, `.effective`, `.tagAreaMap.spine|mistakes`). The guard REVISE'd THREE consecutive iterations (iter1, iter2, iter3) — each fixing a different facet of the SAME underlying root: iter1 patched the VOCAB pattern; iter2 patched the scan-surface roots; iter3 would have patched the allowlist count again. Each fix guessed a residual count the next evaluator refuted by running the actual command. No single-facet patch ever closed the gate; the next evaluator always found the gap had relocated one layer deeper. iter4 stopped patching and fixed the root instead.

## Why it happens

The guard conflated two independent vocabularies with different scopes: the prior `memorization` rename, scoped to `skills/`; and this migration's retired forms (`_shared`, `.effective`, `.tagAreaMap.spine|mistakes`), living in the memory tree. Both were forced through a SINGLE `(vocab, scan-surface, allowlist)` triple. Each facet-patch guessed a residual count against the wrong surface. The counts the draft committed to were never measured against the actual command run — they were inferred from the prior state. A count derived by inference rather than measurement is always refutable by the evaluator running the real command.

## Correct approach

SEGMENT the guard by vocab family — each family gets its own independent `(vocab, scan-surface, allowlist)` triple. DERIVE each allowlist from a FRESH RUN over the actual surface so the allowlist equals the command's measured output (never a guessed or carried-forward count). Then the gate is reachable by construction and a re-run reproduces the same zero.

Applied in iter4: Family A (`memorization|session[- ]memory|project[- ]memory`, scan-surface = `skills/`, existing allowlist) and Family B (`_shared|\.effective|\.tagAreaMap\.(spine|mistakes)`, scan-surface = the memory tree, allowlist = the 19 measured legitimate carriers from a fresh `grep -rlE` run). Family B allowlist derivation: `grep -rlE '_shared|\.effective|tagAreaMap\.(spine|mistakes)' --include='*.md' mistakes notes features backlogs reports | grep -v /archive/` → 19 files. Post-allowlist result: 0 non-allowlisted residual by construction; a re-run yields the same 19 carriers and the same zero.

Two alternatives were rejected. Continuing to patch the single-vocab guard (extend VOCAB / scan-surface / allowlist count) was rejected after 3 REVISEs: any single-vocab extension either floods the memory tree with 243 legitimate prior-rename `memorization` concept-mentions (un-actionable noise) or relocates the gap to the next facet. Re-deriving the allowlist for the combined vocab on the combined surface was rejected too: the two vocabularies have structurally different scopes, so a combined allowlist is wider, harder to reason about, and harder to re-derive than two independently verifiable triples.

## How to detect

When a guard or check cited as a run-to-zero gate REVISEs MORE THAN ONCE, and each fix is "extend the pattern / add to the allowlist / adjust the count" while the next iteration finds the gap relocated one layer deeper — the guard's SCOPE MODEL is wrong, not its count. The signal: consecutive REVISE rounds converge on the SAME mistake type (`guard-cited-as-runtozero-without-matching-vocab`) with distinct facets each time (vocab → scan-surface → allowlist). Stop patching; segment.

## Related

- [[guard-cited-as-runtozero-without-matching-vocab]] — the existing mistake this sharpens with the root-fix + constructive resolution
