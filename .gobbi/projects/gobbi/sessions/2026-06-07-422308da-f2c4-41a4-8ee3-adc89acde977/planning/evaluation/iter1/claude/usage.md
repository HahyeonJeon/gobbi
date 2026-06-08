# Planning Eval — Usage perspective (claude, iter1)

## Artifact Summary + Memory reads
- Lens: can a fresh Executor use this plan without returning to the user or leader?

## Locked Frame (Stage 1)
- S1 Fresh executor given task N alone can read inputs/outputs/verifies and begin.
- S2 Executor knows which file/section/anchor to edit and what to verify.
- S3 Failure modes / preconditions match what the executor encounters.
- S4 Inter-task handoff explicit; names match.
- S5 (adversarial) executor must ask "what does X mean here."

## Per-scenario per-check results
- S1 PASS. Each task names exact canonical path + op + concrete verifies clauses. Edit-mechanics section binds every edit task (canonical .gobbi paths for skills; .claude/CLAUDE.md direct; Edit tool with Write fallback).
- S2 PASS with one defect. Anchors are specific: T1 names line 5, headers 112/188/234/241/253; T2 names §6 (251), Cross-references (271), §7 inserts between 270-271, §4 evaluate.mode row (208); T3 names line 27, preserve line 31. DEFECT: T4 verifies(b) sends the executor to "orchestration/SKILL.md:247" which is a table separator, not the §3/§6 pointer (live: line 266) — see Structure S-1. An executor following T4 literally hits a wrong anchor.
- S3 PASS. Edit-mechanics names the known failure mode (Edit tool refuses symlink paths → use canonical .gobbi path; fall back to Write). Agent-assignment carries the five governing mistakes per task.
- S4 PASS. Handoff chain is explicit and name-matched: T1 outputs `evaluation.md-final-section-names` → T2/T4 inputs; T2 outputs `auto-mode-section-7` → T3/T4 inputs; T3 outputs `claude-md-eval-blockquote-reconciled` → T4 inputs. Self-review confirms the chain; I verified the names match across producing/consuming tasks verbatim.
- S5 PASS (adversarial). Terms are defined or anchored: "routine-triage vs safety-gate" classification is spelled out with the named sections; §7.1-§7.4 content enumerated; C1 split-anchor explained (Stuck/Regression → evaluation.md behavior, only Iteration-Caps → chat-mode.md). The executor does not need to invent the classification.

## Typed findings
- The only usage defect is the line-247 mis-anchor in T4, already recorded as Structure S-1 (High). Not duplicated here to avoid double-counting; from the Usage lens it means an executor running T4 verbatim will mis-navigate.

## Low-confidence appendix
- None.
