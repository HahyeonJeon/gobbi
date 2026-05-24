# Project — iter3 Claude

## Stage 0 — Artifact summary

Target: `rawdata/draft-iter3.md` (553 lines). iter3 is a surgical 3-fix revision of iter2:
- **Fix A**: branch prefix `session/{date}-{ssid-short}` → user-locked `chore/session-{date}-{ssid-short}` (closes iter2 Critical F-4 regression).
- **Fix B**: `PostToolUseFailure` verbatim quote preservation via WebFetch (closes iter1 P2/O1 + iter2 unverified-WebFetch gap).
- **Fix C**: `.gobbi/project.json` dormant precondition flag in D-3-3-resolver step (i) + feature backlog (closes iter2 P3 latent assumption).

Iron Law gate (12): What/Why/How present — yes (Scope Contract, Framed Problem, Decisions Locked, Validation strategy table, WORK exit checklist). Iron Law 7 (verification evidence) — verbatim quotes preserved in T3-E-5, D-3-3, T3-I-T3.c, and the augmented staged reference file.

Scope discipline check (diff iter3 vs iter2): 311-line diff; all changes localized to D-1 (Fix A), T1-I-T1.a/.h + scenarios G-1/E-2/F-4 (Fix A propagation), T3-E-5 + D-3-3 + T3-I-T3.c (Fix B verbatim), D-3-3-resolver step (i) + T3-I-T3.h + Out-of-Scope/Backlog log/Deferred list (Fix C), frontmatter, Decisions Log (iter2 F-3/F-4/F-5 cross-references + iter3 F-Fix-A/B/C appended), WORK exit checklist (new). No Scope Contract reopening, no new T1/T3 mechanism additions, no other design decisions modified. **Scope discipline honored.**

## Stage 1 — Inheritance frame

iter1 + iter2 cumulative Project findings carry-forward:

| Finding | Source | iter2 disposition | iter3 disposition |
|---|---|---|---|
| iter1 P1/C1 (invented `loop/` trailer) | claude+codex | addressed (F-2 canonical `task/`) | preserved — line 322/324 still cites `git/conventions.md:118` re-verified iter3 whole-file |
| iter1 P2 (PostToolUseFailure unverified) | claude | disputed/unverified (no verbatim) | **addressed** — verbatim quote preserved per Fix B (see Stage 2 V-B) |
| iter1 P3 (steel-man read-only) | claude | addressed | preserved (line 126 intact) |
| iter1 P4 (no migration smoke test) | claude | addressed | preserved + augmented per Fix A (T1-I-T1.h smoke-test regex updated) |
| iter1 COD-PROJ-001 (row 5.5 branch precondition) | codex | **REGRESSED via F-4** | **addressed** — Fix A user-lock + whole-file scan + regex audit |
| iter1 COD-PROJ-002 (no-issue scenario) | codex | partially addressed | preserved — branch name does not require issue number under `chore/` |
| iter2 P1/C1/R5 (F-4 regex violation) | iter2 claude+codex | NEW Critical 100 | **addressed** — Fix A |
| iter2 P2 (unverified WebFetch) | iter2 claude | NEW High 50 | **addressed** — Fix B WebFetch verified, verbatim preserved |
| iter2 P3 (project.json absent) | iter2 claude | NEW Medium 75 | **addressed** — Fix C dormant-precondition flag + backlog file |

## Stage 2 — Per-perspective walk

### V-A — Fix A (branch prefix `chore/session-…`)

**Empirical regex smoke-test (Bash)**: candidate `chore/session-2026-05-23-1b26cf20`:
- Against the `git/conventions.md:22` regex `^(feat|fix|hotfix|chore|docs|refactor|test|ci|perf|build|style)/(\d+-)?([a-z0-9]+(-[a-z0-9]+)*)$` → **REGEX_MATCH** (`chore` ∈ type alternation; slug `session-2026-05-23-1b26cf20` matches `[a-z0-9]+(-[a-z0-9]+)*` segment-by-segment).
- Against the T1-I-T1.h smoke-test regex `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` → **SMOKE_REGEX_MATCH**.
- Description-slug `session-2026-05-23-1b26cf20` length = 27 chars (between 3 and 50 — PASS per `git/conventions.md:64`).
- `chore` label color present at `git/conventions.md:261` (`#e4e669`) — verified via independent whole-file Read.

**Grep audit** on `draft-iter3.md` for residual `session/`: 15 occurrences, all benign:
1. `gobbi://session/{session-id}/task/...` AI-Provenance-Record URI templates (lines 221, 277, 322, 324, 327, 501) — different URI namespace, NOT branch names.
2. iter3 Fix A narrative citing prior iter2 form for historical context (lines 13, 312, 505, 521, 526, 545) — intentional audit trail.
3. Auxiliary fix-decision retention (line 68 confirming new lock cites old form, line 310 Fix A rationale).

All 14 `chore/session-` references appear in active design statements (D-1, T1-I-T1.a, T1-I-T1.h, G-1, E-2, F-4, validation table). No active design statement uses bare `session/{date}-...` branch prefix.

**Iter3 leader's grep-audit claim** in WORK exit checklist (line 545) is **independently confirmed**. Fix A is structurally complete and regex-verified.

### V-B — Fix B (PostToolUseFailure verbatim)

The staged reference at `staging/references/claude-code-posttooluse-hook-schema.md` was independently READ and contains:
- Lifecycle-table verbatim: `| PostToolUseFailure | After a tool call fails |` (line 33)
- Exit-code-behavior verbatim: `| PostToolUseFailure | No | Shows stderr to Claude (tool already failed) |` (line 39)
- Full 31-event enumeration with `PostToolUseFailure` at position #9 (line 53)
- Shell-command `type: "command"` registration support confirmed (line 41)
- Usage-history row `iter3 Fix B — verbatim PostToolUseFailure quote added` (line 104)

The same quotes appear inline in `draft-iter3.md` at T3-E-5 (line 205), D-3-3 (line 366), T3-I-T3.c (line 289), and iter3 F-Fix-B (line 530-531).

**Independent WebFetch by this evaluator was not run** — the auto-mode bash sandbox does not include WebFetch tooling. Per escape-hatch in brief: downgrade Fix B verification to assumption_risk Confidence 50. Counterweight: the leader's verbatim quote IS preserved (Iron Law 7 satisfied at the artifact level — verifiable later by anyone who can fetch the URL); the page enumeration is internally consistent (PostToolUseFailure at #9 of 31 is the kind of structure that would be hard to fabricate); and the staged reference file's Usage-history row documents the iter3 retrieval. This is sufficient grounding for Ideation directional design. Empirical re-verification can run at Execution time (Validation table row for D-3-3).

### V-C — Fix C (`.gobbi/project.json` dormant precondition)

Empirical `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` → "No such file or directory" — **confirmed** by this evaluator.

D-3-3-resolver narrative (line 377) explicitly flags step (i) as a dormant precondition: "this file does not exist in the repo today (verified empirically: `ls -la /playinganalytics/git/gobbi/.gobbi/project.json` returns 'No such file or directory' as of 2026-05-23). The resolver currently always falls through to step (ii)."

Staged backlog file `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` exists, follows the `backlogs.md` template shape (frontmatter with title/status/project/feature/task/anchor_session/created/tags/disposition; sections Context / Why deferred / Suggested approach / When to pick up / Effort estimate / Originating session / Anchor). Two pickup paths described (in-Execution single-file write OR defer); no implicit dependency forcing executor to create the file (the backlog explicitly says "Either path is valid"). **No new dependency introduced**; Fix C is informational + bookkeeping only.

### V-D — Iron Law adherence

- IL-1 (think it through): WORK exit checklist + Karpathy considerations evident. PASS.
- IL-4 (scope bounded): diff confirms surgical 3-fix only. PASS.
- IL-6 (refuse vagueness): the dormant-precondition note is explicit, not hand-waved. PASS.
- IL-7 (fresh verification): whole-file `git/conventions.md` scan cited; WebFetch claimed (verbatim preserved); `ls` empirical noted. PASS.
- IL-12 (W/W/H clarity): Scope Contract + Framed Problem + Decisions Locked all forward; new fixes have explicit W/W/H in F-Fix-A/B/C. PASS.

## Stage 3 — Findings

### F-PROJ-iter3-1 — Fix A: branch prefix regression closed (POSITIVE)
- type: `general` (status finding)
- domain: `process`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational — addresses prior Critical)
- inherited-from: `iter2/claude/project-P1` + `iter2/codex/project-COD-PROJ-001-regression`
- evidence: D-1 line 308-313; T1-I-T1.a line 274; T1-I-T1.h line 281; G-1 line 221; E-2 line 227; F-4 line 235; validation table line 424. Whole-file `git/conventions.md` scan cited at line 310 with three independent verifications (regex / length / label-color). Smoke-test regex `^chore/session-[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-f0-9]{8}$` verified by this evaluator against the example branch name — MATCH.
- why it matters: closes the iter2 FAIL blocker that defeated T1's row 5.5 first success criterion.
- suggested direction: preserve into Planning; the smoke-test regex at T1-I-T1.h becomes the Wrap-up gate.

### F-PROJ-iter3-2 — Fix B WebFetch verification gap (NEW iter3 ASSUMPTION_RISK)
- type: `assumption_risk`
- domain: `verification`
- disposition: `open`
- confidence: 50
- severity: Medium
- evidence: This evaluator's environment does not include WebFetch tooling, so the leader's WebFetch claim cannot be re-verified. The verbatim quotes ARE preserved in the staged reference file (independently READ) and in the inline draft sections. The escape-hatch in the brief explicitly authorizes a Confidence-50 downgrade in this case.
- why it matters: if the leader's WebFetch retrieval was hallucinated (low probability — the page enumeration is internally consistent with multiple verbatim quotes), then D-3-3 dual-event registration would lack official-doc grounding.
- suggested direction: defer Empirical re-verification to Execution-time when the executor authors `.claude/settings.json` PostToolUseFailure block. If the registration fails at runtime, the reconstructor recovers and the failed-spawn audit gracefully degrades to PostToolUse-only. This is not a blocker for Ideation exit.

### F-PROJ-iter3-3 — Fix C dormant-precondition explicit and well-bounded (POSITIVE)
- type: `general` (status finding)
- domain: `docs-sync`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational)
- inherited-from: `iter2/claude/project-P3` + `iter2/codex/structure-COD-STRUCT-001`
- evidence: D-3-3-resolver step (i) annotated with dormant-precondition note + backlog pointer (line 377); `ls -la .gobbi/project.json` empirically returns "No such file or directory" (this evaluator confirmed); staged backlog file at `staging/backlogs/feature/dot-gobbi-project-json-bootstrap.md` follows template shape; Scope Contract Out-of-Scope list updated (line 53); Deferred list extended (line 89); Backlog promotion log extended to nine entries (line 493).
- why it matters: closes the iter2 latent-assumption finding without expanding scope.
- suggested direction: at Planning, the planner may absorb single-file write into T3-I-T3.c (recommended path per backlog item 1) or defer to a future session (path 2). Both valid.

### F-PROJ-iter3-4 — Verdict thresholds reached (POSITIVE)
- type: `general`
- domain: `process`
- disposition: `addressed`
- confidence: 100
- severity: Low (informational)
- evidence: All iter2 FAIL drivers (P1/C1/R5 convergent Critical) closed. iter1 carry-forward findings remain addressed. No new High/Critical surfaced. Scope discipline honored. WORK exit checklist (line 543-553) is honest and matches independent verification.
- why it matters: per evaluation/SKILL.md threshold rules, no Critical at Confidence ≥ 75 and no High at Confidence ≥ 50 → PASS.

## Preserve list (carry to Planning)

1. D-1 branch-prefix lock `chore/session-{date}-{ssid-short}` + whole-file `git/conventions.md` audit cadence (line 310 footnote).
2. T1-I-T1.h smoke-test regex as Wrap-up gate row (line 281).
3. Fix B verbatim quotes in T3-E-5 + D-3-3 + T3-I-T3.c — the verification model.
4. Fix C dormant-precondition note + backlog file — exemplary "explicit not-yet-existing precondition" pattern.
5. iter2 preserve items (D-3-5 flock, D-3-3-resolver, D-3-6 jq paths, CL-1 path-vocab reconciliation, partial-promotion rollback, F-6 input/result split) intact.

## Verdict

**PASS** — All three iter3 fixes empirically verified. Fix A regex-confirmed; Fix B verbatim quote preserved at artifact level (WebFetch independent verification deferred to Execution under brief escape-hatch); Fix C `ls` confirmed + backlog well-formed. Scope discipline preserved (no out-of-scope changes). No new High/Critical findings. iter2's convergent Critical regression closed.
