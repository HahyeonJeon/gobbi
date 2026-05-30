VERDICT: PASS

## Artifact Summary + Memory reads
The artifact is the Ideation iter2 rawdata draft for the Chat Mode + Auto Mode redesign. What: specify `orchestration/chat-mode.md`, `orchestration/auto-mode.md`, and the consequential `orchestration/SKILL.md`, settings, state, session, and backlog changes. Why: the existing mode lock treats Chat as the same linear workflow with more user gates, while the locked direction requires Chat to run per-task slices and Auto to codify Always-Ask gates. How: use mode sub-documents, supersede the old global lock with an ADR-style correction, add Chat `workflow.chat.tasks[]`, preserve evaluation/MEMORIZATION rigor, and defer user-approved residuals to Planning. Scope Contract source: `draft-iter2.md` section 2. Downstream consumers: Planning, Execution, Wrap-up, and future managers reading the orchestration skill.

### Memory reads
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/rawdata/draft-iter2.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.gobbi/projects/gobbi/sessions/2026-05-28-8eed14fb-c4b5-455f-aa5e-497c33ed8bbf/ideation/evaluation/iter1/codex/project.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/evaluation/SKILL.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/ideation/evaluation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/chore/session-2026-05-28-8eed14fb/.agents/skills/orchestration/workflow/ideation.md`
- `/playinganalytics/git/gobbi/.gobbi/projects/gobbi/rules/stub-redirect-format.md` - not applicable; no redirect stub is created.
- Project mistakes read: `design-literal-retire-instruction-without-replacement.md`, `section-order-is-part-of-the-contract-not-just-the-set.md`, `skills-mirror-symlinks-not-copies.md`, `prose-reclassification-target-is-project-level-notes.md`, `memorization-delegation-prompts-must-load-memorization-skill.md`, `wrap-up-promotion-must-strip-staging-frontmatter.md`, `codex-eval-session-write-path-nested-in-worktree.md`, `subagent-relative-path-write-strays-to-main-tree.md`.

## Locked Frame (Stage 1)
Scenario 1: The draft solves the right problem inside the locked Scope Contract.
- Check: What, Why, and How are present and specific.
- Check: The Scope Contract uses the canonical frontmatter and five body sections.
- Check: The design stays at specification level and leaves final prose to Execution.

Scenario 2: Bucket A findings are genuinely resolved, not only claimed.
- Check: `codex-proj-a13f0c91` has a canonical Scope Contract replacement.
- Check: success criteria are observable smoke-test gates.
- Check: R1, R2, R3, and R5 are promoted from flags into body-level decisions.

Scenario 3 (adversarial): A Planner treats residual deferred findings as already solved and silently drops them.
- Check: Bucket B/C/D items are explicitly marked `deferred`.
- Check: each deferred item has a Planning route.
- Check: no user-deferred item is reclassified as open without new blocking evidence.

Inherited iter1 seed findings:
- `codex-proj-a13f0c91` - Scope Contract missing canonical schema.
- `codex-proj-b4709e42` - backlog witness status language was misleading.

Applicable mistake/rule coverage:
- `design-literal-retire-instruction-without-replacement.md` becomes a frame check for the ADR-style supersession: preserve the old lock and name the replacement.
- `stub-redirect-format.md`: not applicable because no superseded doc URL is kept as a stub.

## Per-scenario per-check results
Scenario 1:
- W/W/H present: yes. Evidence: `draft-iter2.md:13-45`.
- Canonical Scope Contract present: yes. Evidence: frontmatter block at `draft-iter2.md:53-59`; required body sections at `:61`, `:72`, `:81`, `:108`, and `:120`.
- Specification boundary preserved: yes. Evidence: `draft-iter2.md:22`, `:74-79`, and `:348-360` state that final prose authoring belongs to Execution.

Scenario 2:
- `codex-proj-a13f0c91` resolved: yes. Evidence: `draft-iter2.md:49-131` contains the canonical schema and explicit success criteria.
- Success criteria observable: yes. Evidence: files-exist, grep, first Chat session task-record, `jq` validation, skipped-Preparation state, and archive gates at `draft-iter2.md:112-118`.
- R1/R2/R3/R5 promoted: yes. Evidence: decisions table at `draft-iter2.md:97-104`; R1 details at `:170-175`, `:338-339`, `:366-370`; R2/R3 at `:415-449`; R5 at `:218-231`.

Scenario 3:
- Bucket B/C/D deferred: yes. Evidence: `draft-iter2.md:532-545`.
- Planning routes present: yes. Evidence: each row in `draft-iter2.md:536-545` carries a route-to-Planning rationale or a separate-backlog route.
- No deferred item needs re-opening now: yes. Close reading found no new blocking evidence that invalidates the user's deliberate deferral.

## Typed findings
- finding-id: codex-proj-a13f0c91
- Type: checklist_gap
- Domain: process
- Disposition: addressed
- Confidence: 100
- Severity: High
- Evidence: `draft-iter2.md:49-131` replaces iter1's compact table with canonical frontmatter plus `In-Scope`, `Out-of-Scope`, `Decisions Locked`, `Success Criteria`, and `Deferred`; success criteria at `:112-118` are observable.
  Finding: The prior Scope Contract schema gap is resolved for Ideation.

- finding-id: codex-proj-b4709e42
- Type: general
- Domain: docs-sync
- Disposition: addressed
- Confidence: 100
- Severity: Medium
- Evidence: `draft-iter2.md:28` and `:604-607` state both backlogs are currently `active` / `open` and will close when the redesign ships.
  Finding: The misleading "closed 2026-05-23" witness status language from iter1 is corrected.

## Low-confidence appendix
- No suppressed Project findings above confidence 25.
