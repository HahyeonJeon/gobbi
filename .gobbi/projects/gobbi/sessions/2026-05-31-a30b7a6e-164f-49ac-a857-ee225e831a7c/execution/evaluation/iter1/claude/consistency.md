# Execution Evaluation — Consistency (Claude, iter1)

**Verdict:** PASS (canonical 3-file invariant holds; pre-existing plugin-mirror staleness flagged as Medium)

## What / Why / How
- **What:** SKILL.md merged each principle name + Iron Law into one `## Principle N — <Name>: <LAW>` heading; both summary tables use header `| # | Principle |` and rows `| N | <Name>: <LAW> |`.
- **Why:** single-line title removing the two-line split (user request, session a30b7a6e).
- **How:** heading edit + table-row rewrite (commit `eb09158`).

## Memory reads
`skills/evaluation/SKILL.md`; `mistakes/{evaluator-false-pass-without-diffing, claude-evaluator-step4-only-vs-codex-whole-file-grep}.md`; `rules/stub-redirect-format.md`; develop+HEAD baselines via `git show` / `git ls-files` / `git check-ignore`.

## CORE consistency check — heading payloads vs BOTH tables (DIFFED, not asserted)
Extracted the 14 heading payloads from canonical SKILL.md and the 14 principle-column cells from each table, `diff`'d all three pairings:
- SKILL payload vs CLAUDE.md cells → **IDENTICAL** (14, empty diff)
- SKILL payload vs AGENTS.md cells → **IDENTICAL** (14, empty diff)
- CLAUDE.md cells vs AGENTS.md cells → **IDENTICAL**

Byte-identical for all 14 principles; each payload has exactly one `: ` Name/LAW boundary; no row dropped its law. The mandated canonical alignment is correct. `grep -c "^\*\*Iron Law:\*\*"` on canonical SKILL.md = **0**. Intro = "Fourteen principles" (already correct on develop). The `.agents/skills/principles` and `.claude/skills` consumers are SYMLINKS to canonical (verified `readlink`) and therefore reflect the merge automatically — 14 merged headings, 0 Iron Law lines.

## Finding C1 (MEDIUM) — pre-existing tracked plugin-snapshot mirror is stale (old shape + "Thirteen")
- **Type:** general | **Domain:** docs-sync | **Disposition:** open | **Confidence:** 100 | **Severity:** Medium
- **Evidence:** `plugins/gobbi/skills/principles/SKILL.md` is a git-tracked physical copy (not a symlink; `git check-ignore` exit 1 → not ignored) still in the OLD two-line shape (13 `**Iron Law:**` lines, 0 merged headings, intro "Thirteen principles"). **Crucially it is byte-identical between develop and HEAD** — this branch did NOT regress it. A full sweep shows **3 of 18 plugin mirrors already drift** from canonical (`interview, orchestration, principles`), confirming the `plugins/` tree is a one-time snapshot from commit `9cc3c2a` (#274) with broad pre-existing drift, not a per-change-maintained mirror.
- **FP-check:** **Pre-existing** (FP category) — the staleness predates this branch; AND `plugins/` is outside the brief's literal scope list (`.claude/.codex/.agents/skills/agents/rules/`). Both factors cap severity at Medium and keep it off this branch's REVISE ledger. It is still a real live stale reference that matches the brief's "no remaining old two-line shape" spirit, so it is surfaced rather than dropped.
- **Why it matters:** plugin-distributed consumers loading this snapshot get the un-merged form + wrong count. But the divergence is a property of the #274 snapshot, not of this commit.
- **Suggested direction:** user/manager decides whether the `plugins/` snapshot is regenerated wholesale (it is already stale for 6 skills) or whether `principles` (and the other 5) should be co-updated now. Out of scope to fix inside this branch unless the user expands scope.

## Finding C2 (LOW) — "Iron Law table"/"Iron Law summary" prose label not updated to match retitled tables
- **Type:** general | **Domain:** docs-sync | **Disposition:** open | **Confidence:** 100 | **Severity:** Low
- **Evidence:** tables now headed `| # | Principle |`, but CLAUDE.md:31 / AGENTS.md:63 still say "The **Iron Law table** is the always-visible summary" and SKILL.md:378 "more than the **Iron Law summary** in CLAUDE.md". The brief claimed a commit renamed these; `git show eb09158` shows the lines unchanged — never shipped (risk.md R2).
- **Why it matters:** mild label/content mismatch; rows still contain Iron Law text, so not strictly false. Low nit.
- **Suggested direction:** user decides whether to rename the prose label.

## Verdict: PASS
Canonical 3-file invariant byte-identical 14/14; symlinked consumers reflect it. C1 is pre-existing + out-of-scope (Medium, flagged); C2 is Low. No in-scope finding crosses REVISE.
