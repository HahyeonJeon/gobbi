---
perspective: risk
iter: 2
system: claude
verdict: PASS
---

# P7 — Risk (iter2)

## Artifact Summary

Risk perspective covers: verify-command blast radius (false-negative silencing), awk terminator edge cases, shell portability under zsh, and irreversible file-touch risks.

## Iter1 Finding Inheritance

No P7 High+ findings from iter1 (P7 was PASS). No inherited findings to re-judge.

## H2 Risk Verification — zsh portability

The core concern behind iter1 H2 was that the old `for F in $FILES; do` pattern fails under zsh when `$FILES` contains paths with spaces or newlines, and the variable could be unset if declared in a prior entry.

The `set --` form does not depend on IFS-splitting. `"$@"` expansion under zsh expands each positional argument as a separate word regardless of IFS. Tool-verified: 10-element `set --` under zsh (`zsh -c '...'`) iterates all 10 entries, counts 10. Confidence: 100.

## H3 Risk Verification — silent false negatives in verifies

The risk behind iter1 H3 was that a verify entry with English prose or comment-only thresholds would silently pass without asserting anything.

Every verify entry sampled exits non-zero on assertion failure via `|| { echo FAIL; exit 1; }` or equivalent. The T06 loop uses `fail=0` counter + `test "$fail" -eq 0 || exit 1` at end — this means even if the loop's inner `echo FAIL; fail=1` runs, the outer `test` fires correctly. No silent swallowing. Confidence: 100.

One edge case checked: T04 SC-2.2 (if/else block) — both branches have explicit `|| exit 1` guards; the else branch's final `test "$n" -eq 0 || exit 1` correctly exits 1 if CCSI appears when no Path conventions block exists. No false-negative path. Confidence: 100.

## awk Terminator Risk

The terminator `/^\*\*[^P]|^## |^### [^P]/` includes the terminator line in the output range (standard awk range behavior). For files where the Path conventions block is followed by `## Templates` or another `## ` heading, that line appears in `/tmp/sc5-pcblock.txt`. This cannot produce a false positive for M2 clause checks (the terminator lines are headings, not M2 wording). Cannot produce a false negative either (M2 clauses appear before the terminator line in the block). Risk is zero. Confidence: 100.

## Verdict

PASS — no High+ risk findings. zsh portability verified empirically; no silent false-negative paths in verify blocks.
