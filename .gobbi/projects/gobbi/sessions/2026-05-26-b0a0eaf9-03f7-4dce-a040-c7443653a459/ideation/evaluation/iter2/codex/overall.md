# Codex Overall Evaluation - Ideation iter2

## Findings

### F1 - CLOSED: type-aware strip is now grounded and safe

**Type:** design_flaw
**Severity:** High (closed)
**Confidence:** 98

Evidence: `draft-iter2.md:31-33` rewrites the conformance wave as type-aware, `draft-iter2.md:48` explicitly forbids stripping legitimate `disposition` from `backlogs/`, and `draft-iter2.md:167-185` defines the predicate, key set, and safety invariant. This is grounded in `rules.md:110` (`disposition` legitimate for `backlogs/`) and `rules.md:122` (`disposition` stripped only when used as eval routing). The witness file `.gobbi/projects/gobbi/features/git-workflow/backlogs/anchor-slug-4-hyphen-vs-2-hyphen.md:9-14` carries both illegitimate eval-routing keys and legitimate `disposition`, and the predicate preserves the latter.

Fix status: no blocking fix remains. Preserve the D6/FIX-1 predicate and do not regress to a blanket staging-key grep.

### F2 - CLOSED with one Low sub-count note: reproducible counts are Planner-ready

**Type:** general
**Severity:** Medium (closed)
**Confidence:** 95

Evidence: `draft-iter2.md:21-27` defines `P_live`, and `draft-iter2.md:226-236` pastes the reproduction commands and outputs. I reran the checks at HEAD `d2b5b37`: `P_live_all=208`, `P_live_content=191`, `README=17`, full base-schema conformance `50/208`, all nine base-key counts match, all listed legacy/staging/spelling-drift counts match, true-leak files under the FIX-1 predicate are `59`, and backlog files with non-`disposition` illegitimate keys are `13`. The stale iter1 estimates are gone.

Fix status: closed. Low note N1 below covers a non-blocking cross-foot in the `disposition` sub-count narrative.

### F3 - CLOSED: tiers 2 and 3 are explicitly scoped

**Type:** scenario_gap
**Severity:** Medium (closed)
**Confidence:** 95

Evidence: `draft-iter2.md:31-41` splits In-Scope into Tier 1, Tier 2, and Tier 3. Tier 2 is capped to the minimal mechanical grep gate, with heavier enforcement deferred at `draft-iter2.md:37-38` and `draft-iter2.md:67`. Tier 3 is now a light final navigation wave at `draft-iter2.md:40-41`, and the checklist adds that wave at `draft-iter2.md:144`.

Fix status: closed. The prior "folded into waves" ambiguity is removed.

### F4 - CLOSED: 12-vs-13 principle drift is verified and routed

**Type:** checklist_gap
**Severity:** Medium (closed)
**Confidence:** 100

Evidence: the drift is real: `AGENTS.md:63` and `.codex/AGENTS.md:63` say "The 12 principles below" and stop at Principle 12, while `.claude/CLAUDE.md:31` says 13 and `.claude/CLAUDE.md:47` lists Principle 13. `draft-iter2.md:147` adds a checklist item to reconcile `AGENTS.md` and `.codex/AGENTS.md` to 13 principles, and `draft-iter2.md:243-250` records the verification command.

Fix status: closed as an Ideation finding. Low note N2 below covers the Planning-time user-confirmation risk for touching two entrypoint files.

### F5 - CLOSED: symlink edit target and #272 merge-back are named

**Type:** checklist_gap
**Severity:** Low (closed)
**Confidence:** 100

Evidence: `.claude/skills/memorization/rules.md` is a symlink to `../../../.gobbi/projects/gobbi/skills/memorization/rules.md`, and the canonical file exists. `draft-iter2.md:138` names the canonical edit target and explains the mirror behavior. `draft-iter2.md:148` flags #272 merge-back reconciliation as a Planning/handoff item.

Fix status: closed. Planning should keep the `rules.md` edit additive as the artifact says.

### N1 - FIX-1 `disposition` sub-counts use mixed filters

**Type:** general
**Severity:** Low
**Confidence:** 100

Evidence: `draft-iter2.md:187` says 62 files carry `disposition`, with 28 legitimate backlog files and 35 non-backlog leak candidates. The stated loose backlog command returns 28, but the canonical `P_live` filter from `draft-iter2.md:23` returns 27 backlog `disposition` files because `.gobbi/projects/gobbi/features/agents/backlogs/privacy-retention-agents-metadata-deferred.md` is under the excluded `agents/` surface. The non-backlog count is 35, so the canonical cross-foot is 27 + 35 = 62; the written 28 + 35 = 63.

Fix: in Planning or Execution, normalize this sub-count to the single canonical `P_live` filter, or state explicitly that the 28 count uses the looser backlog-only filter. This is cosmetic: the 59 true-leak file set and the D6 predicate both reproduce.

### N2 - AGENTS.md reconciliation should be confirmed at Planning

**Type:** assumption_risk
**Severity:** Low
**Confidence:** 60

Evidence: `draft-iter2.md:147` adds edits to `AGENTS.md` and `.codex/AGENTS.md`; this was introduced by iter1 evaluation, not directly by a user scope answer. The drift is real and relevant to the standard, but Q8 in `discussion-log.md:42-45` says to avoid unnecessary Principle-13 work. The artifact frames the edit as a narrow count-row consistency fix, not Principle-13 surgery, which is defensible.

Fix: at Planning, surface a confirm/defer decision for the two entrypoint edits, or make them an explicit task with the F4 finding as its anchor.

### Fresh pass - no new blocker found

**Type:** general
**Severity:** Low
**Confidence:** 80

Evidence: the 8 locked decisions remain traceable to `discussion-log.md:5-50`; iter2 changes are remediation-specific relative to `draft-iter1.md`; success criteria are measurable at `draft-iter2.md:60-64`; and the staged references/backlog files named at `draft-iter2.md:262-273` are present on disk. Scope is large (`208` live docs, `191` content docs), but the artifact keeps it wave-based (`draft-iter2.md:51`, `draft-iter2.md:142-144`) and tier-3 explicitly non-blocking. Planning should still budget task count against the existing `manager-context-overflow-with-large-bundle` mistake, but that is a Planning decomposition gate rather than an Ideation blocker.

Fix: carry the context-budget check into Planning and split later waves if task count exceeds the manager budget.

VERDICT: PASS
