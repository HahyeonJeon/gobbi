# Planning Evaluation — Project (Claude, iter1)

## Artifact Summary + Memory reads
**What:** A 22-task Plan (T0 + 11 conformance + T10 + T11 + 7 prose + N1) for a dev-doc-level project-memory standard: author the standard, then conform 222 P_live docs to the base frontmatter schema (FIX-1 type-aware strip), then prose-rewrite, then nav-verify, plus a grep gate and an AGENTS.md 12→13 reconciliation.
**Why:** Locked Ideation scope-contract — raise gobbi project-memory docs to a scoreable quality bar; PR #272 branch base, merge deferred. Success criteria SC1-SC4.
**How:** Wave-based (conformance → prose → nav), per-feature/tier grouping ≤~35 docs, dual-system eval every task, sequential execution.
**Scope Contract:** `ideation/artifacts/scope-contract.md` (In/Out/Locked/SC/Deferred).
**Downstream:** 22 executor delegations + dual-system eval per task.

**Memory reads:** scope-contract.md; design-options.md (D1-D10/FIX-1); context-budget-wave-ordering-carry-forward.md; planning/evaluation.md; evaluation/SKILL.md; mistakes/{manager-context-overflow,executor-main-tree-edit-near-miss,skills-mirror-symlinks-not-copies,edit-tool-refuses-symlink-paths,executor-mirror-path-vs-worktree-physical-copy,design-literal-retire-instruction-without-replacement,naming-standard-needs-positive-guidance}; .claude/CLAUDE.md (13-principle confirm).

## Locked Frame (Stage 1)
- **S1 Every task traces to an Ideation checklist item** — checklist: each task has `traces-to:` pointing to verbatim scope-contract/idea text; no anchor-less task.
- **S2 Every In-Scope / SC item covered by ≥1 task** — SC1-SC4, conformance wave, prose wave, grep gate, nav wave, AGENTS.md reconciliation, FIX-1 preservation, D9, D10 all map.
- **S3 No task outside the Scope Contract** — scope copied not expanded; count correction is not scope change.
- **S4 (adversarial) A "while we're here" task slips in** — scrutinize T10 (AGENTS.md) for adjacency creep; scrutinize prose tasks for unrelated edits.
- **S5 (adversarial) Out-of-scope archive docs get touched** — D10 excludes frozen archive everywhere; verify no task edits a frozen archive doc.

## Per-scenario per-check results
- **S1:** YES — all 22 tasks carry `traces-to:` (grep: 22). Each anchor is verbatim from scope-contract.md/idea.md (spot-checked T0, T1, T11, N1). No anchor-less task.
- **S2:** YES — self-review spec-coverage table maps SC1→T0, SC2→T1-T9c+T11, SC3→T0(D4), SC4→T0(D3), conformance→T1-T9c, prose→P1-P7, gate→T11, nav→N1, AGENTS.md→T10, FIX-1 preservation→T4/T7/T9a/T9b/T9c/P7, D9→every prose task, D10→every gate. Confirmed against scope-contract In-Scope/Out-of-Scope/SC.
- **S3:** YES — count correction (208→222) is a measurement fix, not a scope change. Verified empirically: features/agents was always in-scope (T1); buggy `*/agents/*` filter hid it. Reproduced 59 (buggy) → 63 (corrected) under literal D6 predicate. No new requirement introduced.
- **S4:** MOSTLY — T10 (AGENTS.md 12→13) is a Low-severity adjacency item but is **user-confirmed IN** (Decision 2, DL-C; PR-1 finding). Not unilateral creep. Real motivator verified: worktree `.codex/AGENTS.md` line 63 says "12 principles" and Iron Law table ends at row 12; CLAUDE.md says 13 / P13 exists. Motivator is real.
- **S5:** **NO** — see DOC-PROJECT-1. Three task `files:` globs (T9a, P5, P6) plus N1 use `**/*.md` / `**/README.md` with no archive exclusion and WOULD touch frozen `archive/` docs that D10 + the NOT-in-scope section explicitly exclude.

## Typed findings

### DOC-PROJECT-1 — `files:` globs would touch frozen archive docs the Scope Contract excludes
- **Type:** design_flaw · **Domain:** process · **Disposition:** open · **Confidence:** 100 · **Severity:** High
- **Evidence:** Plan line 710 (NOT in scope): "Frozen `archive/` docs (anywhere, incl. nested `features/*/archive/`) — excluded from standard, retrofit, prose, and gate (D10)." But task `files:` globs carry NO archive exclusion: T9a (line 310) `features/workflow/**/*.md`; P5 (line 451) `features/install-runtime/**/*.md`; P6 (line 468) `features/workflow/**/*.md`; N1 (line 502) `.gobbi/projects/gobbi/**/README.md`. Empirically these match frozen archive files: `features/workflow/archive/decisions/2026-05-23-iter1-user-redirects.md`, `features/install-runtime/archive/references/2026-05-22-ideation-references.md`, and 5 `archive/**/README.md`. The plan's own counts (workflow 26, install-runtime 44, 18 READMEs) are computed WITH `-not -path "*/archive/*"` while the edit globs are not — a glob/count asymmetry. An executor following the literal `files:` field would retrofit/rewrite a frozen archive doc, violating D10 and the Out-of-Scope contract; or silently deviate from the literal field.
- **Why it matters:** D10 is a locked scope ruling and an Out-of-Scope line. Touching archive docs is a scope violation that propagates to 3 conformance/prose tasks + N1. The per-task `verifies:` ("all 26 docs", "all 18 READMEs") undercounts vs the edit glob (27 / 23), so git-diff verification can pass while an archive doc was edited.
- **Suggested direction:** (manager+user decide) — add explicit `-not -path "*/archive/*"` semantics to the `**` `files:` globs, or enumerate non-archive subdirs as T6/T7 already do.

## Low-confidence appendix
- (none)

## Verdict
Project: **REVISE** — DOC-PROJECT-1 is High/100 (open). Plan solves the right problem and stays in scope EXCEPT the archive-glob leak.
