## Artifact Summary + Memory reads

Artifact: the three-commit docs diff `HEAD~3..HEAD`.

What / Why / How: same as `project.md`; this perspective focuses on section order, decomposition, and cross-reference topology.

Memory reads: Plan, Idea, execution evaluation child doc, project mistakes and rules, full changed files with line numbers, and the requested grep outputs.

## Locked Frame (Stage 1)

Scenario: section structure stays stable.
- Check: `auto-mode.md` appends section 7 after section 6 and before Cross-references.
- Check: `workflow/evaluation.md` headers are not renamed.
- Check: `.claude/CLAUDE.md` changes only the evaluation paragraph.

Scenario: cross-reference graph is coherent.
- Check: `auto-mode.md` points to the actual `workflow/evaluation.md` section names.
- Check: `workflow/evaluation.md` points back to `auto-mode.md` section 7 by stable section name.
- Check: `.claude/CLAUDE.md` points to `auto-mode.md` and `chat-mode.md`, and those files exist.

Adversarial scenario: a reference is added before its target exists in final state.
- Check: every final target resolves by name or path.

## Per-scenario per-check results

Section structure: PASS. `grep -n "^## §"` for `auto-mode.md` showed sections 1-7 in order with no gaps or duplicates. `workflow/evaluation.md` still has the original major headers, including `Same symptom, different root cause`, `Severity-gated divergence handling`, `Degraded-mode policy`, `Regression marking`, `Stuck detection`, and `Iteration Caps`.

Cross-reference graph: PASS. `auto-mode.md:287,308-310,318-320,365-370` cites real `workflow/evaluation.md` headers at lines 114, 192, 240, 247, and 259. `workflow/evaluation.md:314` cites `auto-mode.md` section 7, which exists at `auto-mode.md:275`. `.claude/CLAUDE.md:27` cites `orchestration/auto-mode.md` and `orchestration/chat-mode.md`; both exist.

Forward target risk: PASS. The reciprocal evaluation-to-auto pointer resolves in the final state. No section was retired without replacement.

## Typed findings

No Structure findings.

## Low-confidence appendix

None.

Verdict: PASS
