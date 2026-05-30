# Performance — iter3

**Perspective:** Performance
**Verdict:** PASS

## Stage 1 inheritance

- iter2 codex-risk-005 (G4 `/tmp/t[45]-pre`) — addressed in iter3 via in-session bash variable capture. Performance impact: zero extra `cat` reads, zero tmpfile I/O, zero cleanup race. `git show "$PRE_T4_REV:..."` is a single git plumbing call per assertion.

## Stage 2 — verification-command runtime cost

- **G1** — Two `jq -r '.chat.mode'` / `jq -r '.auto.mode'` calls vs the iter2 recursive `..` walk. Faster (constant-time path traversal vs whole-document descent) and bounded — no false positives from nested `mode` keys.
- **G2** — Compares pre vs post via `jq -S` semantic sort. Two extra `git show` calls + two `jq` invocations per side; total ~4 process forks per assertion. Within Plan-acceptance budget; runs at most twice (T4 + cross-check). Trade-off (semantic vs text grep) is correct.
- **G6 printf form** — `printf 'always\nalways'` is ~free; faster than the iter2 `jq` embedded-literal form and far more legible.
- **No subshell-hazard hot-path.** P-R8 (new in iter3) flags `PRE_T4_REV` / `PRE_T5_REV` scope risk if executor wraps verification in `bash -c '...'`. Mitigation documented (`export` or re-capture). Acceptable — flagged at Plan time, not deferred.

## §4 acceptance test budget

9 stanzas. Worst case: a small shell loop + a few `jq .` and `grep -cE`. Sub-second on a single Plan-acceptance run. No N² or full-tree-walk patterns.

## Findings

None. No regression vs iter2; the G-pack reduces per-assertion process forks and tmpfile churn.

## Must-preserve

- G2's semantic `jq -S` form (don't downgrade to text-line grep on cost grounds — semantics is the point).
- G4's in-session var (don't reintroduce `/tmp/*.txt` even "for clarity").

Verdict: **PASS**.
