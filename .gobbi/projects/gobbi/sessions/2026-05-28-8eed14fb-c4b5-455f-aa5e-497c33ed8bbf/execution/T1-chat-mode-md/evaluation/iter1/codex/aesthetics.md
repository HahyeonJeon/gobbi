## Artifact Summary

`chat-mode.md` is an Execution-phase documentation artifact replacing the Chat Mode placeholder with the canonical Chat-mode orchestration sub-document. It defines the per-task slice posture, workflow diagram, local Chat MEMORIZATION override, task-record contract, explicit Wrap-up trigger, status display, state-transition table, settings defaults, and cross-references. The work implements Planning T1 (`01-chat-mode-canonical-spec`) against Idea Section 3 plus the Status Display and F-S2 requirements. The scoped target is `.gobbi/projects/gobbi/skills/orchestration/chat-mode.md`; `.claude/skills/orchestration/chat-mode.md` is a mirror symlink and `memorization/SKILL.md` stays unmodified. Downstream consumers are the manager, future planners, execution agents, evaluators, and Wrap-up.

Memory reads: target `chat-mode.md`; Plan T1 lines 107-175; Idea lines 136-271, 374-385, 245-256, and 520-700; `principles`, `mistake`, `evaluation`, `execution/evaluation`, and `delegation` skills; project rule `stub-redirect-format.md`; listed project mistakes for section-order, retire-without-replacement, notes placement, symlink mirrors, dual-system template gaps, and prose-template checks.

## Locked Frame (Stage 1)

Scenario 1: The prose is readable and convention-aligned.
- Checklist: headings are skimmable; tables are used for tabular contracts; the diagram carries the workflow shape; comments explain operational reasons rather than filler.

Scenario 2: Naming follows the term lock.
- Checklist: `per-task slice` is used consistently; non-canonical terms appear only as explicitly banned synonyms; task-record naming points at `memorization/rules.md`.

Scenario 3 (adversarial): The document does not look polished while hiding wording drift.
- Checklist: principle references are exact; cross-references name real sources; repeated short-form statements point back to the canonical section rather than restating divergent semantics.

## Stage 2 Findings

No Aesthetics findings.

Evidence:
- The term lock is explicit at lines 39-41, and `grep -c 'per-task slice'` returned 22 occurrences.
- Non-canonical terms appear in the synonym-ban sentence only, not as live terminology.
- The Chat MEMORIZATION statement is visually isolated in Section 4 and short references elsewhere point back to it.

## Per-perspective Verdict

VERDICT: PASS

## Low-confidence appendix

None.
