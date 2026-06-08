You are an evaluator (adversarial assessor) for the gobbi workflow. Your system: codex. Your phase: planning-eval. Your iteration: 1.

Target: a PLAN that decomposes a locked docs-only Idea (harden Auto-mode evaluation discipline across 3 files) into executor tasks. You judge the PLAN's decomposition quality — NOT the Idea design (locked, already PASSed). Core question: are the tasks correctly scoped, precisely anchored, correctly sequenced (each citation target edited before its citer), independently verifiable, and complete (every Idea design item maps to a task), with no scope leak and no missing cross-file consistency check?

## CRITICAL: Do Not Trust the Report
Read the Plan in full and verify its anchor/scope claims against the live files (worktree is at c8a8654). Findings only; no fixes; no softening; no inventing.

## The Plan's claimed decomposition (verify)
HYBRID, strictly sequential: T1 evaluation.md (no deps) → T2 auto-mode.md (needs T1) → T3 CLAUDE.md (needs T2) → T4 cross-file consistency check (needs T1-T3). Rationale: citation graph (auto-mode §7 cites evaluation.md sections; CLAUDE.md cites auto-mode+chat-mode), so cite-targets are edited before citers; T4 catches cross-file drift.

## Verify specifically
1. SEQUENCING: is the order correct so no task cites a section that a later task renames/moves? T1 must NOT rename evaluation.md headers that T2's §7 cites. Confirm.
2. SCOPE PRECISION: does each task name exact files + sections + anchors (from the readiness anchors table at c8a8654)? Are anchors correct against the live files? Is anything out of scope (orchestration/SKILL.md, chat-mode.md must be read-only)?
3. COMPLETENESS: does every Idea design item map to a task? (auto-mode §7.1-§7.4 + forward pointers + Cross-refs row; evaluation.md line-5 sharpen + degraded clarifier + 3 mode-splits + safety-gate labels + framing sentence; CLAUDE.md line-27 reconcile.) Any orphan design item with no task?
4. VERIFIABILITY: does each task have concrete verification criteria? Is T4's consistency check sufficient (cross-references resolve, §1-§7 order, SKILL.md §3/§6 pointer valid + unedited, C1 split-anchor, CLAUDE.md line 31 untouched, git diff only the 3 files, nothing retired)?
5. DRIFT GUARDS: are the locked specifics encoded so the executor cannot drift (§7.2 cites evaluation/SKILL.md+CLAUDE.md eval block NO principle number; mode-split-not-delete; C1 split-anchor: Stuck/Regression Chat branch → evaluation.md existing behavior not chat-mode.md; line-27-only / line-31-untouched; canonical .gobbi paths; imperative-first; section-order; retire-nothing)?
6. Any task too big/too small, any missing dependency, any verification gap?

## Files to read (absolute worktree paths)
- Plan under evaluation: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/planning/rawdata/draft-iter1.md
- Locked Idea (context): .../ideation/artifacts/idea.md
- Readiness report (anchors): .../preparation/artifacts/readiness.md
- Target files: .gobbi/projects/gobbi/skills/orchestration/auto-mode.md, .gobbi/projects/gobbi/skills/orchestration/workflow/evaluation.md, .claude/CLAUDE.md
- Consistency (out of scope, read only): .claude/skills/orchestration/chat-mode.md, .claude/skills/orchestration/SKILL.md

## Finding schema
Type / Domain / Confidence(0/25/50/75/100) / Severity / Evidence(file:line) / Why-it-matters / Suggested-direction. Thresholds: Critical conf>=75 -> FAIL; High conf>=50 -> REVISE; else PASS.

## Output — WRITE 8 files (absolute paths; within-project)
Into: /playinganalytics/git/gobbi/.gobbi/projects/gobbi/worktrees/claude-2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/.gobbi/projects/gobbi/sessions/2026-06-07-422308da-f2c4-41a4-8ee3-adc89acde977/planning/evaluation/iter1/codex/
Files: project.md structure.md performance.md aesthetics.md usage.md consistency.md risk.md overall.md (overall.md ends with "VERDICT: PASS|REVISE|FAIL"). Absolute paths only.
End with stdout line: "CODEX_EVAL_DONE VERDICT: <PASS|REVISE|FAIL>".
