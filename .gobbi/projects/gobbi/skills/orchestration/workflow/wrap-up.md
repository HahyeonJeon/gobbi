# Workflow — Wrap-up (Orchestration)

How the **manager** orchestrates the Wrap-up Loop. The `assistant` specialists that do the actual consolidation load [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md) instead.

The Wrap-up Loop runs once at the end of every workflow session. Its purpose is to close the session cleanly: emit `workflow.finish`, write the handoff summary, clean scratch state.

---

## DISCUSSION Phase (manager + user, direct)

**Manager's job**: confirm with the user that the session is ready to wrap up.

The manager:
1. Surfaces a summary of what the session shipped (artifacts produced, tasks executed, evaluator verdicts).
2. Asks via AskUserQuestion: is there anything deferred or open that should be added to the wrap-up before the session closes?
3. If the user adds items, records them as wrap-up inputs.
4. Constructs the assistant delegation prompt per [delegation prompt requirements](../delegation/SKILL.md#what-every-delegation-prompt-contains).

---

## WORK Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent with the wrap-up delegation prompt. The assistant consolidates artifacts, writes the handoff summary, and cleans scratch state per [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md).

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Wrap-up specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract). Wrap-up evaluation is non-skippable per [`wrap-up/evaluation.md`](../../wrap-up/evaluation.md)
- **Output path**: per-iter scoped at `sessions/{date}-{session-id}/wrap-up/evaluation/iter{n}/{system}/{perspective}.md`
- Phase-specific focus: synthesis coverage, explicit open items, mistake extraction, promotion-routing audit (per [`wrap-up/evaluation.md`](../../wrap-up/evaluation.md))

---

## MEMORIZATION Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent for synthesis per [`workflow/memorization.md`](memorization.md). For Wrap-up, the canonical artifact is the handoff summary itself plus any final updates to project memory.

---

## ITER / EXIT Decision

Iteration cap is `workflow.wrap-up.maxIterations` (default 1) — wrap-up rarely benefits from multiple iterations. After `PASS`, the manager emits `workflow.finish` and closes the session.

---

## Output

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/wrap-up/
├── artifacts/              ← PASS-iter output files (e.g., handoff, shipped-summary)
├── rawdata/
└── evaluation/
    ├── claude/{perspective}.md
    └── codex/{perspective}.md
```

Plus any new mistake entries and project-memory updates under `.gobbi/projects/{project-name}/`.

---

## Cross-references

- Assistant's wrap-up procedure → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Synthesis orchestration → [`workflow/memorization.md`](memorization.md)
- Memory promotion → [`memorization/SKILL.md`](../../memorization/SKILL.md)
