## Findings

### Iter1 F1 / DOC-STRUCT-1 / DOC-PERF-1 - CLOSED
**Type:** design_flaw
**Severity:** High
**Confidence:** 100
**Evidence:** Iter2 splits every over-budget prose task along the matching conformance boundary: P3 -> P3a(20)/P3b(21), P5 -> P5a(24)/P5b(20), and P7 -> P7a(35)/P7b(33) in `planning/rawdata/draft-iter2.md:128-135`. The actual task headings are present at `draft-iter2.md:489`, `draft-iter2.md:508`, `draft-iter2.md:541`, `draft-iter2.md:556`, `draft-iter2.md:592`, and `draft-iter2.md:607`. The dependency rows wire the split outputs to their consumers at `draft-iter2.md:664-671`, and N1 requires all 10 prose tasks at `draft-iter2.md:672`.
**Fix:** No further fix required. Preserve the split prose tasks and their matching conformance dependencies.

### Iter1 archive-glob leak / DOC-PROJECT-1 / DOC-CONS-1 / DOC-RISK-2 - CLOSED
**Type:** design_flaw
**Severity:** High
**Confidence:** 100
**Evidence:** Iter2 adds an archive-safety invariant for both top-level `PM/archive/` and nested `features/*/archive/` at `draft-iter2.md:89-96`. The broad `**` tasks now carry archive exclusions in `files:` and archive-safe verification, including T9a at `draft-iter2.md:383-390`, P6 at `draft-iter2.md:579-589`, and N1 at `draft-iter2.md:632-639`. Re-runs at HEAD `d2b5b37` confirmed the leak boundaries: workflow naive/safe = 27/26, install-runtime naive/safe = 45/44, and README live/archive split = 18 live with 5 archive READMEs excluded. Enumerated subdir tasks avoid archive by construction.
**Fix:** No further fix required. Keep the explicit `exclude: "**/archive/**"` and `-not -path "*/archive/*"` checks on broad globs, and keep enumerated subdir tasks out of archive dirs.

### Iter1 DOC-CONS-2 and Codex F2 - CLOSED
**Type:** checklist_gap
**Severity:** Medium
**Confidence:** 100
**Evidence:** The underscore-key re-run found exactly 5 live install-runtime files with `promoted_from`/`promoted_at` outside archive, matching the iter2 target. Iter2 makes the gate key-set hyphen+underscore in T0 and T11 (`draft-iter2.md:228`, `draft-iter2.md:242`, `draft-iter2.md:445`, `draft-iter2.md:454`), and T6/T7 verifies explicitly catch the install-runtime underscore leaks (`draft-iter2.md:341`, `draft-iter2.md:358`). T1 now verifies `disposition` preservation on the agents backlog file at `draft-iter2.md:258`; T5 verifies all 3 guardrails backlog files at `draft-iter2.md:326`. Repo grep confirmed the relevant backlog files still carry `disposition:`.
**Fix:** No further fix required. Preserve the hyphen+underscore gate and the T1/T5 disposition-preservation assertions.

### Iter1 T10 symlink mismatch / DOC-USAGE-2 / DOC-RISK-1 - CLOSED
**Type:** assumption_risk
**Severity:** Medium
**Confidence:** 100
**Evidence:** `readlink AGENTS.md` returns `.codex/AGENTS.md`, and `ls -l` shows root `AGENTS.md -> .codex/AGENTS.md`. Iter2 T10 edits only `.codex/AGENTS.md` in its `files:` set at `draft-iter2.md:433-436`, states that root `AGENTS.md` is the symlink and must not be edited at `draft-iter2.md:430`, and keeps the worktree-edit guard in the verifier at `draft-iter2.md:439`.
**Fix:** No further fix required. T10 must continue targeting only the worktree copy of `.codex/AGENTS.md`.

### Iter1 count prose / Codex F3 - CLOSED
**Type:** general
**Severity:** Low
**Confidence:** 100
**Evidence:** Iter2 normalizes the executable total to 25 at `draft-iter2.md:217-221`; `rg '^### (T[0-9]|P[0-9]|N[0-9])' draft-iter2.md | wc -l` also returns 25. The T11 dependency note now says 10 direct edges cover all 11 conformance records by transitive closure through T3->T4 and T6->T7 at `draft-iter2.md:674-681`. The stale "18 tasks"/"20 records" text is gone as an active count claim.
**Fix:** No further fix required. Keep the 25-record count and the T11 transitive-closure note.

No new open findings. Fresh pass confirmed the locked scope/decisions are preserved, the corrected counts reproduce at HEAD (222 total, 18 READMEs, 204 content docs, 63 hyphen-form leak files), conformance still precedes prose on shared files, the new P3/P5/P7 split outputs feed downstream inputs, and placeholder grep found only explicitly explained narrative examples (`<typed-dirs>`, `<feature>`), not task-field placeholders.

VERDICT: PASS
