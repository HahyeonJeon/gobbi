# Perspective 1 — Project
**Evaluator**: claude (iter3)
**Phase**: ideation
**Artifact**: draft-iter3.md — Bundle C foundation follow-ups (iter3)

## Artifact Summary + Memory reads

**What**: Consolidated Ideation Idea for `session-foundations-bundle-c` — 6 deliverables: CL-1 (close f-struct-01 inline), CL-2 (stage + promote gobbi-hook-authoring skill M2-compliant from creation), CL-3 (mistake/SKILL.md consolidated edits + watchlist backlog clarifier), CL-4 (Theme β design doc), CL-5 (f-risk-01 M2 docs sweep across 11 skills), CL-6 (orchestration row-5/5.5/6 path-resolution fix). DL-7 locked Option B post-iter3-draft.

**Why**: iter2 REVISE findings (4 High + 14 Medium + 8 Low) addressed by iter3. DL-7 added post-draft (user locked CL-6 = Option B). This is the final iteration (maxIterations: 3).

**How**: Per-finding disposition table claims all 4 High findings addressed. Scope Contract updated for 6 CLs. Per-Deliverable table updated with backlog may-touch entries. SC-5 rewritten with per-file bounded checks. D-7 revised routes mistake/SKILL.md exclusively to CL-3.

**Scope Contract source**: draft-iter3.md § Scope Contract.

**Downstream consumers**: Planning (task decomposition, DL-7 Option B locked), Preparation (CL-2 skill template, M2 wording), Execution (11-file sweep + CL-6), Wrap-up (backlog delta promotions, mistake-candidate promotion).

## Memory reads

- `.claude/skills/principles/SKILL.md` — loaded
- `.claude/skills/evaluation/SKILL.md` — loaded
- `.claude/skills/ideation/evaluation.md` — loaded (phase child doc)
- `.gobbi/projects/gobbi/backlogs/f-risk-01-subagent-ccsi-semantics.md` — read in full (M2 canonical wording verification)
- `ideation/evaluation/iter2/claude/p1-project.md` — read
- `ideation/evaluation/iter2/claude/p3-scope.md` — read
- `ideation/evaluation/iter2/codex/p2-consistency.md` — read
- `ideation/evaluation/iter2/codex/p3-scope.md` — read
- `ideation/evaluation/iter2/codex/p4-specificity.md` — read
- `ideation/staging/decisions/session-dir-placed-outside-worktree.md` — read in full
- `.gobbi/projects/gobbi/rules/stub-redirect-format.md` — read (not applicable)

---

## Locked Frame (Stage 1)

**Scenario A — The 6 deliverables bound the scope correctly; DL-1..DL-7 all locked**
- Does TL;DR enumerate 6 CLs? YES — lines 16-21.
- Does In-Scope enumerate 6 CLs? YES — lines 55-99.
- Does Sequencing/DAG enumerate 6 CLs? YES — lines 203-208.
- Does Per-Deliverable table have 6 CL rows? YES — lines 185-190.
- Is DL-7 (Option B lock) recorded in Open Questions? YES (line 549); per disposition table it was a post-draft lock.

**Scenario B — Status header and CL-6 TL;DR entry are consistent with DL-7 lock (adversarial)**
- Does Status header say resolved (all decisions locked)? PARTIAL FAIL — line 6 says "1 open question (CL-6 design option A/B/C)"; DL-7 section (line 547) says "RESOLVED — no open questions remain." Internal contradiction.
- Does CL-6 TL;DR entry reflect DL-7 lock? FAIL — line 21 still says "One open question for the user: pick fix Option A / B / C"; DL-7 is locked at line 549.

**Scenario C — Root cause is concrete; each CL maps to a fired trigger**
- CL-1..CL-5: witnesses verified in prior iters. Unchanged.
- CL-6: witness is the session-dir-placed-outside-worktree mistake-candidate (read in full; confirmed substantive and real).
- Counterfactual for CL-6 (lines 243-244): steel-man presented and counter-evidenced. Concrete.

**Scenario D — Scope Contract in-scope + out-of-scope are consistent (adversarial)**
- Out-of-scope line 105: "Re-litigating DL-1 / DL-4 / DL-5 / DL-6 — user-locked." DL-7 is NOT listed here, but DL-7 is also user-locked as of the Open Questions section. Minor gap — not a blocker since evaluators see the DL-7 lock at line 549.
- No unauthorized scope additions found.

---

## Per-scenario per-check results

1. **Scenario B FAIL**: Status header (line 6) says "1 open question (CL-6 design option A/B/C)" — directly contradicted by DL-7 lock at line 549. CL-6 TL;DR (line 21) still says "One open question for the user" — directly contradicted by DL-7. These are pre-lock draft phrases that were not updated when DL-7 landed.

2. **Scenario D minor gap**: Out-of-scope anti-relitigation list names DL-1/DL-4/DL-5/DL-6 but not DL-7. This is cosmetically incomplete but DL-7's lock is clearly recorded in the Open Questions section, so it is not misleading to Planning.

---

## Typed findings

### I3-P1-001 — Status header and CL-6 TL;DR still say "open question" after DL-7 locked Option B

- **id**: I3-P1-001
- **Type**: `design_flaw`
- **Domain**: `docs-sync`
- **Disposition**: open
- **Confidence**: 100
- **Severity**: Medium
- **Evidence**: Line 6: `**Status**: CONSOLIDATED — 1 open question (CL-6 design option A/B/C)`. Line 21 TL;DR: "**One open question for the user** below: pick fix Option A / B / C". DL-7 lock at line 549: "RESOLVED — no open questions remain." Direct internal contradiction. Also: SC-8.2 (line 161) still reads "A/B/C — user picks via the open question; Planning locks". CK-9 (line 329) reads "per the user-locked Option (A/B/C)". D-9 Decisions Log (line 464) reads "RECOMMENDED-by-leader, not yet user-locked".
- **Why it matters**: A Planner reading these stale phrases may believe the option is still open and request an additional user AUQ before proceeding. This creates unnecessary loop friction at the Planning phase boundary. The DL-7 lock is real (recorded at line 549) but the stale references are load-bearing for consumers who skim-read the early sections.
- **Suggested direction**: Update Status header, CL-6 TL;DR entry, SC-8.2, CK-9, and Decisions Log D-9 row to reflect DL-7 locked = Option B; remove or move the "user picks via open question" phrasing to past-tense audit text.

### I3-P1-002 — Out-of-scope anti-relitigation list omits DL-7

- **id**: I3-P1-002
- **Type**: `checklist_gap`
- **Domain**: `process`
- **Disposition**: open
- **Confidence**: 75
- **Severity**: Low
- **Evidence**: Out-of-scope (line 105): "Re-litigating DL-1 / DL-4 / DL-5 / DL-6 — user-locked." DL-7 is user-locked as of line 549 but is not named in the out-of-scope list.
- **Why it matters**: Minor inconsistency. An evaluator seeing this list might challenge DL-7 on Option B as still open. The DL-7 lock at line 549 is authoritative; this is cosmetic. Deferred-eligible.
- **Suggested direction**: Add DL-7 to the anti-relitigation line, or note "per the Open Questions section, DL-7 is also locked."

---

## Per-perspective verdict

**PASS** — No Critical or High findings. Finding I3-P1-001 is Medium severity (internal contradiction around DL-7 lock propagation), confidence 100. Finding I3-P1-002 is Low, deferred-eligible. The root cause is real for all 6 CLs; the Scope Contract is materially sharp; DL-1..DL-7 are all user-locked. The stale "open question" wording is a consistency gap but does not undermine the substance of the idea.

---

## Low-confidence appendix

None.
