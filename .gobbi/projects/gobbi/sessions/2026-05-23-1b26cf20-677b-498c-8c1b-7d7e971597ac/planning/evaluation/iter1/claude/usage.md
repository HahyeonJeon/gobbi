---
phase: planning
iter: 1
system: claude
perspective: usage
verdict: REVISE
---

# Usage — Planning iter1 evaluation (Claude)

## Artifact Summary + Memory reads

Same as project.md.

## Locked Frame (Stage 1)

From `skills/planning/evaluation.md` § Usage:

S-U1 — Fresh Executor given task N alone can read inputs/outputs/verifies and start
S-U2 — Executor knows which file/function/test to modify
S-U3 — Failure modes communicated per task
S-U4 — Inter-task handoff explicit (outputs:↔inputs: name identical)
S-U5 (adversarial) — Executor never has to ask "what does X mean here"

## Per-scenario per-check results

| Scenario | Result | Notes |
|---|---|---|
| S-U1 | PARTIAL | Each task readable in isolation; Tier-4 mistake bundle requires manager to inject correct mistake set at brief construction. See F-USAGE-1 (missing mistake file `stub-redirect-format.md`). |
| S-U2 | PASS-with-note | Files+anchors specified; structured-header parsing in Task 07 has clear regex `## Phase / ## Iter / ## Step` per D-3-4. |
| S-U3 | PARTIAL | Hook flock contention timeout unstated (see performance F-PERF-1). Symlink-broken restore command in § Execution intake notes has WRONG `../` prefix (see F-USAGE-2). |
| S-U4 | PASS | All inputs/outputs names match across tasks (row-5-5-narrative; worktree-path-qualifier-rule; generate-now-promote-commit-pattern; hook-script-artifact; reconstructor-artifact; delegation-main-tree-audit-result). |
| S-U5 | PARTIAL | D-3-3-resolver step (ii), D-5 skip rationale, D-9 skip rationale all referenced without inline expansion (Executor must hold the Preparation iter3 doc context) — see F-USAGE-3. |

## Typed findings

### F-USAGE-1 — Cited mistake `stub-redirect-format.md` does NOT exist

- Type: `general`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Task 09 brief notes column (line 459) cites `stub-redirect-format.md` as a tier-4 mistake. Empirical: `ls .gobbi/projects/gobbi/mistakes/stub-redirect-format.md` returns "file not found". Search across all mistakes directory: no file matching `stub*` or `*redirect*` exists.
- Why it matters: when the Execution loop manager constructs the Task 09 brief and tries to inject the cited mistake into Load Directives, the file load fails. This is exactly the failure mode `leader-iter2-verification-claim-without-evidence.md` warns about — leader asserted a mistake path without verifying its existence.
- Suggested direction: either (a) find the actual mistake file that was intended (perhaps `stub-redirect-format` was renamed during prior memorization promotion), or (b) drop the citation and rationale-only "must validate via jq before declaring complete" as a brief note. The user should resolve.

### F-USAGE-2 — Symlink-restore command in § Execution intake notes has WRONG `../` prefix

- Type: `design_flaw`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 100
- Severity: High
- Evidence: Draft line 513 (§ Execution intake notes / Edit tool default block) gives the literal restore command: `rm -f .claude/skills/<path> && ln -sfn ../../.gobbi/projects/gobbi/skills/<path> .claude/skills/<path> (canonical relative-link form)`. Empirical check via `readlink`:
  - `.claude/skills/orchestration/SKILL.md` → `../../../.gobbi/projects/gobbi/skills/orchestration/SKILL.md` (3 `../`, not 2)
  - `.claude/skills/orchestration/workflow/ideation.md` → `../../../../.gobbi/projects/gobbi/skills/orchestration/workflow/ideation.md` (4 `../`)
  The Preparation decision file (`mirror-propagation-policy-mirror-canonical-symlinks.md:93`) gets it right: uses `../../../` AND explicitly notes "The exact `../../../` prefix depends on the file's depth — verify against an adjacent untouched symlink with `ls -la`."
- Why it matters: an Executor copy-pasting the Planning draft's recipe creates a BROKEN symlink (relative path resolves wrong). This is a load-bearing safety net for the symlink-preservation edit contract — if the recipe is wrong, the safety net fails open. Per `claude-evaluator-step4-only-vs-codex-whole-file-grep.md`: when the Plan paraphrases a Preparation decision, the paraphrase must be verified against the source — here, the paraphrase is wrong.
- Suggested direction: replace the recipe with the verified Preparation version (3 `../` + depth-disclaimer), OR generalize as: `rm -f .claude/skills/<path> && ln -sfn $(realpath --relative-to=$(dirname .claude/skills/<path>) .gobbi/projects/gobbi/skills/<path>) .claude/skills/<path>` (depth-agnostic).

### F-USAGE-3 — Heavy reliance on D-3-3-resolver / D-4 / D-5 / D-9 reference codes without inline expansion

- Type: `assumption_risk`
- Domain: `docs-sync`
- Disposition: `open`
- Confidence: 75
- Severity: Medium
- Evidence: Task 07 brief (line 271): "resolves session dir via D-3-3-resolver step (ii) directory scan fallback (step (i) project.json dormant — Fix C)" + "Header comments codify the bash strict-mode + flock + jq conventions (per Preparation D-9 skip rationale — codify in script header until N≥2)". Task 08 line 296: "mkdir -p .claude/scripts/ at task start (per D-5 skip rationale)". Task 05 line 223: "per D-4 design file Approach section".
- Why it matters: a fresh Executor reading the plan must hold the Preparation D-codes in working memory or open both files side-by-side. `planning/evaluation.md` adversarial check S-U5: *"Any term not in the project glossary is defined inline in the task spec; Acronyms expand on first use within each task."* The D-codes don't expand within the task spec. Worse, the codes are inconsistent — D-3-3 is an Ideation code (per § Sub-step A line 55), D-4/D-5/D-9 are Preparation codes. Mixing namespaces invites confusion.
- Suggested direction: expand each D-code at first use (e.g., `D-3-3-resolver step (ii) directory scan fallback [Ideation Fix C — session-dir resolver: scan .gobbi/projects/<name>/sessions/ for the active session.json]`). Or attach Preparation+Ideation references as `inputs:` artifacts the executor consumes.

## Low-confidence appendix

(none)

## Verdict

**REVISE** — F-USAGE-1 (missing mistake citation) and F-USAGE-2 (wrong symlink restore command) are High-severity and load-bearing for Execution. F-USAGE-3 is Medium nuisance.
