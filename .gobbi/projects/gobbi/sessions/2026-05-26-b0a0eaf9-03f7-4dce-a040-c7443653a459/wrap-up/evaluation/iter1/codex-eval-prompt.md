# Codex Adversarial Eval — Wrap-up (session b0a0eaf9, conformance-wave memorization)

Independent adversarial evaluator of the Wrap-up promotions + handoff. Verify against files; do NOT trust reports. Worktree root = /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6. Session dir = $WT/.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459.

## Verify yourself (worktree root = CWD)
1. **Promotion coverage** — every staging file in `wrap-up/rawdata/staging-inventory.md` has a `wrap-up/rawdata/promotion-manifest.md` entry (promote/backlog/drop+reason). No silent drops. (Execution staging is intentionally empty — LEDGER model — NOT a gap.)
2. **Routing adherence** — spot-check promotions land at routing-table destinations: ideation/planning/prep decisions → features/project-memory/decisions/; references → features/project-memory/references/; design → features/project-memory/design/; planning plans → features/project-memory/plans/; deferred-enforcement backlog → project backlogs/; review → project reviews/. No improvised destinations.
3. **5 process mistakes** in `$WT/.gobbi/projects/gobbi/mistakes/`: reproducing-a-bugged-command-is-not-validation, evaluator-false-pass-without-diffing, conformance-executor-pre-executed-prose-wave-reshape, subagent-relative-path-write-strays-to-main-tree, executor-cwd-reset-commits-task-to-wrong-branch. Each MUST have all 4 elements (what / why / how-to-recognize / corrected) + project-scope frontmatter. Verify quality (actionable, not vague).
4. **Journal** at `$WT/.gobbi/projects/gobbi/notes/2026-05-27-dev-doc-standard-conformance-wave.md` captures the work narrative (what shipped T0-T11, the incidents, next=prose wave).
5. **Handoff** `wrap-up/artifacts/handoff.md`: every claim cites a verifiable path/commit; Deferred section names the PROSE wave (P1-P7b + N1) + points to the locked plan `features/project-memory/plans/2026-05-26-dev-doc-standard-retrofit.md`; Decisions-to-respect lists the §4.4 standard + KEEP list + strip-set. Spot-check 2-3 cited paths actually exist.
6. **No project-memory deletion** — promotions are additive/supersede-not-delete.

## Output (write to ABSOLUTE path)
`/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-25-a10c82d6/.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/wrap-up/evaluation/iter1/codex/overall.md`
`## Findings` (each: **Type:** {scenario_gap,checklist_gap,design_flaw,assumption_risk,general} + Severity + Confidence + evidence + fix). Final line exactly `VERDICT: PASS|REVISE|FAIL`.
PASS = full promotion coverage + routing adherence + 5 mistakes complete(4-element)/project-scope + journal complete + handoff verifiable with deferred-plan pointer + no deletion. If sound, PASS.
