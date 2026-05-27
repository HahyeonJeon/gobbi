# Project — Ideation eval (iter1, claude)

## Artifact Summary + Memory reads
**What:** A dev-doc-level standard for gobbi project-memory docs (new section inside `.claude/skills/memorization/rules.md`) + a conformance-first then prose-quality retrofit of live docs in waves + a minimal grep gate.
**Why:** PR #272 fixed where memory files live and what they are named, but defined no intra-doc prose/section/abstraction-quality standard; ~half the live docs carry legacy frontmatter and cryptic session-internal body coordinates, undercutting the "next session can find them" purpose (CLAUDE.md).
**How:** Write the standard (leads with positive guidance + before/after), then conformance wave 1 (mechanical frontmatter normalization + staging-key strip + body de-crypt, absorbing the existing normalization backlog), then prose wave 2 per type, each verified; exclude `archive/`.
**Scope Contract source:** the artifact itself (Ideation produces it). `artifact_type: scope-contract`, all five required body sections present.
**Downstream consumers:** Planner (decomposes waves into tasks), Executor (retrofits docs), every future agent reading project memory.

### Memory reads
- `.../ideation/rawdata/draft-iter1.md` (artifact)
- `.../ideation/rawdata/discussion-log.md` (9 AskUserQuestion outcomes)
- `.claude/skills/memorization/rules.md` (existing standard being extended) + `memory-map.md` (13-type count)
- `.claude/skills/principles/SKILL.md` (P13 present in worktree)
- `.claude/skills/ideation/evaluation.md` (phase child doc)
- `.claude/skills/evaluation/SKILL.md` (finding schema)
- mistakes: `naming-standard-needs-positive-guidance-not-just-blocklist.md`, `design-literal-retire-instruction-without-replacement.md`
- 5 staged references under `.../staging/references/`; 1 staged backlog under `.../staging/backlogs/project/`
- grep/find verification across `.gobbi/projects/gobbi/{features,decisions,design,...}`

## Locked Frame (Stage 1)

**S1 — Root cause is real, not a symptom.** Checks: (a) Why terminates at a cause that, if absent, obviates the work; (b) prior attempts documented; (c) no scope drift between framed problem and Design.
**S2 — Scope Contract is sharp enough an Executor can refuse OOS work.** Checks: explicit Project/Feature/Task; backlog routing for non-chosen candidates; no "etc."/"and related".
**S3 — Why-now is concrete + success criteria measurable.** Checks: trigger named with reference; criteria pass/fail observable.
**S4 — Counterfactual steel-manned (adversarial).** Checks: strongest do-nothing argument present; rejection evidenced.
**S5 — Re-framing check produced a defensible outcome.** Checks: outcome recorded with reasoning.
**S6 (adversarial) — Idea absorbed quietly by an adjacent feature scope.** Checks: searched `features/`; overlap with `features/project-memory/` made explicit not silent.
**S7 — Faithfulness: the 8 locked decisions are encoded with no drift / no unapproved content** (mistake/rule-derived; anchors discussion-log). Checks: each of the 9 discussion-log outcomes maps to a Scope-Contract/Decision entry; no in-scope item lacks a discussion witness.

## Per-scenario per-check results
- S1a YES — root cause = "no standard governing intra-doc prose quality/section structure/abstraction" (line 53); absent → no retrofit needed. S1b YES — PR #272 + the normalization backlog cited as prior attempts (lines 67-69). S1c YES — Design D1-D10 all trace to the framed gap; no foreign problem solved.
- S2 YES — Project/Feature/Task explicit (lines 15-17); In/Out-of-Scope enumerated; Backlog-promotion log (lines 149-152) routes the deferred enforcement tier and explicitly states no competing task candidate was deferred. Minor: In-Scope uses one "e.g." (line 21) but it is illustrative of an enumerated mechanical operation, not open-ended scope — not a violation.
- S3 YES — trigger = #272 shipped structure but not prose quality; 4 measurable success criteria (lines 42-45), each pass/fail observable (base-schema 100%, 0 leaks, section contract per type, positive-guidance present).
- S4 YES — counterfactual at lines 71-72 presents the genuine "churn on a moving target" argument and rebuts with evergreen-type evidence; not strawmanned.
- S5 YES — re-framing conclusion (lines 74-75) records the 3-tier framing and the user ruling.
- S6 YES — `features/project-memory/` exists and IS the home feature; the artifact sets `feature: project-memory` (no silent overlap; this is the correct owning feature).
- S7 — see Typed findings P-1 (one genuine faithfulness nuance: discussion-log Q4's tier-2 "skills/principles [optional]" and tier-3 "organization & navigation" are folded into in-scope waves / minimal-grep rather than appearing as discrete scope lines; the artifact discloses this at lines 75 + 151, so it is documented, not dropped).

## Typed findings

### P-1 — Tier-2/Tier-3 scope items folded silently into "waves" rather than enumerated
- Type: `general` · Domain: `process` · Disposition: open · Confidence: 50 · Severity: Low
- Evidence: discussion-log Q4 (lines 21-23) ratified a three-tier scope: (1) standard+rewrite [primary], (2) skills/principles [optional], (3) organization & navigation. The artifact's In-Scope (lines 19-24) enumerates only tier-1 mechanics; tiers 2+3 are addressed obliquely ("non-picked scope tiers ... were folded into the in-scope waves", line 151). A Planner reading only the Scope Contract would not see "skills/principles" or "organization & navigation" as in-scope or explicitly deferred.
- Why it matters: Q4 marked tier-2 "optional, not mandatory" and tier-3 third-priority — so omission is defensible, but the fold-in is buried in the Backlog-promotion log rather than stated in Out-of-Scope/Deferred where an Executor refusing OOS work would look.
- Suggested direction: surface the tier-2/tier-3 disposition in Out-of-Scope or Deferred explicitly (one line each), or confirm with the user that they are intentionally absorbed.

## Per-perspective verdict: PASS
Right problem, sharp contract, all 8 locked decisions traceable. Sole finding is Low/50.

## Low-confidence appendix
(none)
