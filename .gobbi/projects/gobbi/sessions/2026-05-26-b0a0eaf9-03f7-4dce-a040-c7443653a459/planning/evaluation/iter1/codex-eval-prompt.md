# Codex Adversarial Evaluation — Planning Artifact (gobbi memory-doc refactor, 22-task plan)

You are an independent adversarial evaluator. Do NOT trust any claim; verify against the real repo at HEAD with your own grep/find.

## What you are evaluating
The finalized Plan that decomposes the memory-doc refactor into 22 executable tasks the Execution Loop will run sequentially. The plan is the briefing source for every executor — a flaw propagates to 22 tasks.

Primary artifact (READ IN FULL): `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/planning/rawdata/draft-iter1.md`
Staged plan: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/planning/staging/plans/main.md`
Locked Idea + scope: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/ideation/artifacts/` (esp. scope-contract.md, design-options.md D6/FIX-1)
Preparation carry-forward: `./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/preparation/staging/decisions/context-budget-wave-ordering-carry-forward.md`

## What to check (adversarially)
1. **Count integrity** — RE-RUN the corrected find (do NOT exclude `features/agents/`). Confirm 222 total / 18 README / 204 content / 63 leaks. Confirm the per-task doc-counts sum correctly (features 154 + project-tier 68 = 222; T9 split 26+35+33=93; conformance per-task counts). Flag any miscount.
2. **Anchor completeness** — every task `traces-to` a real Ideation checklist item / scenario (exact text, not paraphrase)? Every in-scope checklist item covered by a task? Any anchor-less task?
3. **Ordering soundness** — does the dependency graph actually enforce "all Wave 1 conformance committed before any Wave 2 prose touches a shared file"? Check the `requires` edges: each Pk requires its matching conformance task; T11 requires all conformance; chained T3→T4, T6→T7. Any path where prose could run on a non-conformed file? Any false or missing dependency?
4. **Context-budget bounding** — is each task bounded (≤~35 docs) per the manager-context-overflow mistake? Flag any task too large (P5=44, P7=68, P3=41 prose tasks — are these over-budget and should they be split too?).
5. **Type-aware strip safety** — do the conformance tasks' `verifies` correctly use the D6/FIX-1 type-aware predicate (preserve `disposition` on backlogs/, strip illegitimate keys elsewhere)? Would any task's verify command corrupt legitimate frontmatter?
6. **T10 main-tree hazard** — T10 edits AGENTS.md + .codex/AGENTS.md which exist in BOTH trees; does the task correctly constrain edits to the WORKTREE copies (executor-main-tree-edit mistake)?
7. **Agent assignment + schema** — every task has agent type + required skills + required mistakes? outputs→inputs chain connected, no dangling refs? Zero placeholders?
8. **Anything that would make Execution unsafe or ambiguous.**

## Output (write exactly this file, path relative to CWD)
`./.gobbi/projects/gobbi/sessions/2026-05-26-b0a0eaf9-03f7-4dce-a040-c7443653a459/planning/evaluation/iter1/codex/overall.md`

Shape: `## Findings` (each: `**Type:**` from {scenario_gap, checklist_gap, design_flaw, assumption_risk, general} + Severity + Confidence + file/line evidence + fix). Final line exactly: `VERDICT: PASS` | `VERDICT: REVISE` | `VERDICT: FAIL`.
PASS = plan is a safe, complete briefing for Execution. REVISE = fixable gaps. FAIL = structurally unsound (e.g., ordering allows destructive double-touch, or scope/count wrong enough to redo).
If the plan is sound, PASS — do not manufacture findings. Note: P3/P5/P7 prose tasks exceeding ~35 docs is a legitimate REVISE-worthy bounding finding if you judge it overflow-risky.
