# Planning Eval iter2 — Consistency perspective (Claude)

**Frame:** Internal contradiction, count/name coherence, gate-key completeness, draft↔staged-plan sync.

## iter1 findings under this lens
- **DOC-CONS-1 (archive-glob count vs glob asymmetry, High/100): CLOSED.** Edit-glob now equals count predicate. Re-verified: workflow naive **=27, archive-safe=26 (T9a); install-runtime naive **=45, archive-safe=44 (T6+T7); READMEs archive-safe=18. The asymmetry (count excludes archive but edit-glob didn't) is gone.
- **DOC-CONS-2 (underscore staging keys → false "0 leaks", Medium/100 — my own iter1 finding): CLOSED.** Re-ran `grep -rlE '^(promoted_from|promoted_at):' install-runtime | grep -v /archive/ | wc -l` = 5. Confirmed all 5 carry ONLY underscore keys, NO hyphen variant — so the iter1 hyphen-only gate WOULD have falsely certified them clean (Iron Law 11 / Goodhart). iter2: key-set S extended to underscore spellings in T0 (predicate authoring), T6/T7 verifies (name all 5 files), T11 cumulative gate. SC2 leak target restated as union {63 hyphen ∪ 5 underscore} → 0. The +5 is correctly framed as a key-set-completeness fix, NOT a population recount (222/204 untouched).

## Fresh pass
- **Count prose normalized:** every "25 executable records" mention is consistent (draft line 217; staged main.md task_count: 25 + 25-row table). Residual "22" tokens are all historical "iter1 total of 22 → 25" references — correct. "222/18/204/63" are population counts, not task counts. Closes Codex F3.
- **Codex F2 (T1/T5 disposition preservation): CLOSED.** T1 verifies asserts disposition preserved on agents backlog (carries `disposition: deferred`); T5 names all 3 guardrails backlog files (carry legitimate disposition). Spec-coverage row updated to include T1/T5.
- inputs/outputs names coherent; FIX-1 key-set referenced by name with explicit underscore extension.

**Verdict: PASS** — all consistency findings closed; gate-key completeness genuinely fixed (re-run confirms the 5 underscore files are caught only by the extension).
