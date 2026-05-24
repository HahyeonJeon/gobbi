## Artifact Summary + Memory reads
Artifact: Ideation iter1 draft for `session-foundations-bundle-b`.
Consistency target: Scope Contract, Framed Problem, Research Insights, Scenarios, Implementation Checklist, Design, Decisions Log, and repo entry-point docs must tell the same story.
Memory reads:
- `ideation/rawdata/draft-iter1.md` full file.
- `.claude/skills/ideation/evaluation.md` lines 259-292 for Consistency seed scenarios.
- `AGENTS.md` lines 3-13 and 17-23 for official Codex entry points.
- `.codex-plugin/plugin.json` lines 8-9 for plugin skill target.
- `.claude/skills/orchestration/templates/session.template.json` lines 28-48 for `agents[]` schema.
- `.claude/skills/git/SKILL.md` lines 31-33 and 153-161 for current write-path and P2 worktree placement.
- `.claude/settings.json` lines 31-39 for current hook registration shape.
- Project mistake: `claude-evaluator-step4-only-vs-codex-whole-file-grep.md` loaded because consistency requires whole-file cross-reference checks.
- Project mistake: `manager-iter2-brief-failed-iron-law-7-verbatim-spec-recheck.md` loaded because exact path/schema claims must be freshly verified.

## Locked Frame (Stage 1)
Scenario C1: Scope Contract, Framed Problem, and Design solve the same problem.
- Check C1.1: T1 problem maps to T1 design decisions D-1 through D-5.
- Check C1.2: T3 problem maps to T3 design decisions D-3-1 through D-3-4.
- Check C1.3: Deferred T2 stays deferred everywhere.

Scenario C2: Research insight IDs and design anchors resolve.
- Check C2.1: Every T1-I/T1-E/T3-I/T3-E anchor cited in Design exists in Research Insights.
- Check C2.2: Every DQ anchor cited in Design or Scenarios exists or is defined.
- Check C2.3: Citations do not over-claim the cited source.

Scenario C3: Implementation Checklist aligns with canonical repo surfaces.
- Check C3.1: Checklist paths match `AGENTS.md` and plugin manifest source-of-truth paths.
- Check C3.2: If `.claude` is intentionally separate, the checklist states the sync path.
- Check C3.3: Symlink-generation tasks include both `.agents` and plugin-facing roots where required.

Scenario C4: Scenario coverage and success criteria align.
- Check C4.1: Each success criterion has at least one scenario.
- Check C4.2: Each scenario has at least one checklist item or validation strategy.
- Check C4.3: Scenario failure modes map to design mitigations.

Scenario C5: Schema claims remain synchronized.
- Check C5.1: If a field is written, current schema either contains it or the artifact states extra-property compatibility.
- Check C5.2: Deferred schema changes do not contradict success criteria.
- Check C5.3: Template consumers know whether to expect the field.

Scenario C6 (adversarial): Internal and external path models conflict.
- Check C6.1: Claude-facing `.claude` paths and Codex/plugin `.gobbi` paths are reconciled.
- Check C6.2: A future PR touching multiple layers has an explicit drift review gate.
- Check C6.3: Current direct mode and future worktree mode have consistent write roots.

## Per-scenario per-check results
C1.1: Yes. T1 problem lines 73-104 map to D-1 through D-5 at lines 264-296.
C1.2: Yes. T3 problem lines 106-137 map to D-3-1 through D-3-4 at lines 300-326.
C1.3: Yes. T2 is deferred in Scope, Deferred, Research note, and Decisions Log; see lines 26, 58, 181, and 376.
C2.1: Yes for visible I/E anchors. T1-I/T1-E/T3-I/T3-E IDs cited in Design exist in Research Insights.
C2.2: No. T1-DQ-2, T1-DQ-3, and T3-DQ-1 through T3-DQ-4 are cited but not defined in the canonical draft.
C2.3: Partial. The visible I/E citations are coherent; DQ citations cannot be checked.
C3.1: No. Checklist paths target `.claude/skills` while `AGENTS.md` and `.codex-plugin/plugin.json` identify `.gobbi/projects/gobbi/skills` as source of truth for Codex/plugin use.
C3.2: No. There is no `.claude` versus `.gobbi` sync explanation.
C3.3: Partial. T1 mentions `.agents/skills/{slug}` symlinks for generate-now at line 51, but most T1/T3 checklist edits are `.claude`-only.
C4.1: Partial. Main success criteria map to scenarios G/E/F, but branch naming and issue-number details are not covered, matching COD-PROJ-001 from the existing Project file summary.
C4.2: Partial. Scenarios exist, but not all have implementation checks.
C4.3: Partial. F-1/F-2/F-3 map to D-2/D-3/D-4, but T3 concurrency F is missing.
C5.1: Partial. Draft line 32 says `status` is an extra-property and schema bump is deferred.
C5.2: No. Success criterion line 53 requires `status: "failed"` while the template read at lines 28-48 has no `status` field.
C5.3: No. Consumers of `session.template.json` are not told whether `status` is accepted.
C6.1: No. `.claude` and `.gobbi` path models conflict without reconciliation.
C6.2: Partial. `git/SKILL.md:124` says cross-layer drift must be hand-reviewed, but the draft does not add that gate to its validation strategy.
C6.3: Partial. The write-root design is intentional, but current prompt/output-path instructions still require main-tree absolute paths for this evaluation invocation.

## Typed findings
COD-CONS-001
- type: design_flaw
- domain: docs-sync
- confidence: 75
- severity: High
- evidence: `draft-iter1.md:238-253` names `.claude/skills` targets; `AGENTS.md:3-13` says Codex skills live at `.agents/skills` and plugin skills at `.gobbi/projects/gobbi/skills`; `.codex-plugin/plugin.json:8` points to `./.gobbi/projects/gobbi/skills/`.
- surfaced-by: codex
- disposition: open
- detail: The draft is internally consistent from a Claude Code path model, but inconsistent with this repo's Codex/plugin source-of-truth contract. Planning must decide whether to edit canonical `.gobbi` skills, `.claude` mirrors, or both.

COD-CONS-002
- type: checklist_gap
- domain: process
- confidence: 75
- severity: Medium
- evidence: `rg -n "T[13]-DQ-[0-9]" draft-iter1.md` shows DQ anchors used repeatedly, but the only visible `DQ-1` definition is deferred T2 at `draft-iter1.md:376`.
- surfaced-by: codex
- disposition: open
- detail: The artifact over-cites non-resolving design-question IDs. This weakens traceability from Design back to user decisions.

COD-CONS-003
- type: assumption_risk
- domain: observability
- confidence: 75
- severity: Medium
- evidence: `draft-iter1.md:32` defers the `status` field schema extension; `draft-iter1.md:53` and `draft-iter1.md:217` require `status: "failed"` entries; `session.template.json:28-48` has no `status` field.
- surfaced-by: codex
- disposition: open
- detail: The artifact assumes extra-property tolerance for `agents[]` consumers. That may be true, but the assumption needs a compatibility check or a schema-sync task.

## Low-confidence appendix
- Low-confidence note: The `.claude` versus `.gobbi` split might be intentionally cross-runtime, but the draft lacks the bridge text needed for a future executor.
- Low-confidence note: T3-DQ anchors may be defined in raw Sub-step D files; the canonical draft should still carry a local index.
- No contradiction found in T2 deferral; the deferral is consistently repeated.
- No finding here changes the existing Project and Structure verdicts; it reinforces REVISE.
Verdict: REVISE
