# Project — Planning iter1 Evaluation (Codex)

## Artifact Summary
The artifact is a Planning iter1 draft for the Chat Mode + Auto Mode redesign. What: it decomposes the locked Ideation iter2 artifact into seven tasks: T1 chat-mode.md, T2 auto-mode.md, T4 settings.default.json, T5 state/session templates, T3 orchestration/SKILL.md, T7 a new backlog, and T6 Wrap-up archive work. Why: it should turn the user-locked Ideation decisions R1, R2+R3, R5, D-A, and D-B into an executable contract without re-litigating them. How: it uses the ordered execution path T1 -> T2 -> T4 -> T5 -> T3 -> T7, with T6 in Wrap-up, plus per-task verification commands and a cross-task acceptance test. Scope Contract source: the Ideation artifact at `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md` sections 2 and 7. Downstream consumers are executor agents for T1-T5/T7, the Wrap-up assistant for T6, and the manager reconciling planning evaluation.

## Memory reads
- `/playinganalytics/git/gobbi/.agents/skills/principles/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/mistake/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.agents/skills/planning/evaluation.md`
- `/playinganalytics/git/gobbi/.agents/skills/orchestration/workflow/planning.md`
- `/playinganalytics/git/gobbi/.agents/skills/gobbi/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/skills-mirror-symlinks-not-copies.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/codex-eval-session-write-path-nested-in-worktree.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/section-order-is-part-of-the-contract-not-just-the-set.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/mistakes/design-literal-retire-instruction-without-replacement.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/planning/rawdata/draft-iter1.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/artifacts/idea.md`

## Locked Frame (Stage 1)
Scenario 1: Every planned task stays inside the Ideation Scope Contract.
- Check: each task maps to Ideation in-scope files or explicitly deferred work.
- Check: no task silently picks up Bucket B/C/D deferred work.
- Check: stale project memories are not treated as current scope.

Scenario 2: The Plan reflects user-locked decisions without re-litigation.
- Check: R1 maps `preparation.maxIterations: 0` to `state: Skipped`.
- Check: R2+R3 add `workflow.chat.tasks[]` in both state and session templates.
- Check: R5 keeps `memorization/SKILL.md` untouched.
- Check: D-A and D-B remain session-local Chat layout decisions.

Scenario 3: The Plan-level acceptance gate covers the deliverables it claims to cover.
- Check: all execution tasks have a cross-task assertion where integration matters.
- Check: any excluded task is explicitly covered by an equivalent phase-specific gate.
- Check: comments such as "expect" do not stand in for pass/fail assertions.

Scenario 4 (adversarial): A stale mirror requirement re-enters scope because an old memory still mentions it.
- Check: the Plan does not require plugin-mirror work when the evaluation brief pre-annotates `plugins/` as deleted and out of scope.
- Check: any mirror checks are limited to the worktree `.claude` symlink layer and canonical `.gobbi` files unless current evidence proves another mirror exists.

Coverage matrix declarations:
- Licensing/IP: not applicable; no new third-party content or dependency is planned.
- Privacy/data retention: applicable only through task-record handling; T1 cites session-local task-record constraints and D-A/D-B.
- Supply chain: not applicable; no dependencies are added.
- Cost/budget: no paid API calls are introduced by the implementation tasks; future Chat-session cost is deferred in the Idea doc and called out by the Plan as P-R5.

## Evaluation (Stage 2)
Scenario 1 result:
- Yes: T1, T2, T3, T4, T5, T6, and T7 all trace to sections in the Idea doc. The Idea headings include sections 3.1-3.6, 4.1-4.4, 5, 6.1-6.7, 7.3, and 9.
- No: the Plan reintroduces `plugins/` mirror work as a "MUST check" unknown even though the evaluation brief pre-annotates `plugins/` as deleted in PR #264 and says no plugin-mirror task should be required.

Scenario 2 result:
- Yes: R1 appears in the Scope Contract and T4/T3 success criteria; R2+R3 appear in T5 and T3; R5 keeps `memorization/SKILL.md` out of scope; D-A and D-B are explicitly named in T1 and the Scope Contract.

Scenario 3 result:
- Partial: the Plan-level gate covers symlinks, JSON parse, selected cross-links, R1 strings, `workflow.chat.tasks[]` presence, no-bleed checks, and T7 file existence. It does not assert T4's two default-set semantics, T4's `models.*` no-change guard, T7 frontmatter/body requirements, or T6 archive outputs inside the cross-task gate.

Scenario 4 result:
- No: draft line 518 states "Executor MUST check `find plugins/gobbi/skills/orchestration -name '*-mode.md'`" and "Surface as NEEDS_CONTEXT if ambiguous." Tool check found both `/playinganalytics/git/gobbi/plugins` and the worktree `plugins` path absent (`main_plugins_dir=1`, `worktree_plugins_dir=1`).

Findings:

### codex-project-001
- Type: design_flaw
- Domain: project
- Confidence: 100
- Severity: High
- Evidence: `draft-iter1.md:518` requires a `plugins/gobbi/skills/orchestration` mirror check and tells the executor to surface NEEDS_CONTEXT if ambiguous. The evaluator prompt pre-annotation says "`plugins/` directory does NOT exist at HEAD (deleted in PR #264)" and "Do NOT require any plugin-mirror task." Local check: `main_plugins_dir=1`, `worktree_plugins_dir=1`.
- Disposition: open

### codex-project-002
- Type: checklist_gap
- Domain: project
- Confidence: 75
- Severity: Medium
- Evidence: `draft-iter1.md:458` scopes the Plan-level acceptance test to "T1-T5 + T7" before T6; `draft-iter1.md:471-487` only checks JSON parse and `workflow.chat.tasks[]` presence; `draft-iter1.md:495-496` checks only T7 file existence. T4 default-set semantics, T4 `models.*` preservation, T7 frontmatter/body, and T6 archive outputs are not covered by this cross-task gate.
- Disposition: open

VERDICT: REVISE

## Low-confidence appendix
None.
