# Workflow — Wrap-up (Orchestration)

How the **manager** orchestrates the Wrap-up Loop. The `assistant` specialists that do the actual consolidation load [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md) instead.

The Wrap-up Loop runs once at the end of every workflow session. Its purpose is to close the session cleanly: emit `workflow.finish`, write the handoff summary, clean scratch state.

---

## DISCUSSION Phase (manager + user, direct)

**Manager's job**: confirm with the user that the session is ready to wrap up.

The manager:
1. Surfaces a summary of what the session shipped (artifacts produced, tasks executed, evaluator verdicts).
2. Asks through the active runtime's user-decision primitive: is there anything deferred or open that should be added to the wrap-up before the session closes?
3. If the user adds items, records them as wrap-up inputs.
4. Constructs the assistant delegation prompt per [delegation prompt requirements](../delegation/SKILL.md#what-every-delegation-prompt-contains).

---

## WORK Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent with the wrap-up delegation prompt. The assistant consolidates artifacts, writes the handoff summary, and cleans scratch state per [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md).

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Wrap-up specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract). Wrap-up evaluation is non-skippable per [`wrap-up/evaluation.md`](../../wrap-up/evaluation.md)
- **Output path**: per-iter scoped at `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/{perspective}.md`
- Phase-specific focus: synthesis coverage, explicit open items, mistake extraction, promotion-routing audit (per [`wrap-up/evaluation.md`](../../wrap-up/evaluation.md))

---

## RECORD Phase (delegated to `assistant`)

**Manager's job**: spawn the `assistant` agent for synthesis per [`workflow/record.md`](record.md). For Wrap-up, the canonical artifact is the handoff summary itself plus any final updates to memory.

### What Wrap-up commits — promotion writes, not session record

The whole `sessions/` tree is gitignored (`.gitignore:21`), worktree-local, and removed at worktree cleanup (D7 — see [`orchestration/templates/session-tree.md`](../templates/session-tree.md)). So the iteration's `working/`, `evaluation/iter{n}/`, and `outputs/` (including the handoff summary) capture **nothing** in git: `git add` of a `sessions/` path is refused (`paths are ignored ... Use -f`), and a bare `git commit` reports `nothing to commit, working tree clean` and exits non-zero. There is **no** `chore(session): record ...` commit. Iteration boundaries are recorded in `session.json.workflow.wrap-up.iterations[]`, not in git.

What Wrap-up **does** commit is its **promotion writes**: copying promotable `staging/` content into **tracked** memory — `features/`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc. Those targets are NOT under gitignored `sessions/`, so the commit is real. This is the only durable output of the session; it lands on the worktree branch (per `orchestration/SKILL.md § Configuration Step 1` row 1 (Create Worktree)) and is absorbed into the PR at merge. Use the canonical `AI-Provenance-Record:` trailer per `git/conventions.md:116-119`. Wrap-up usually runs a single iteration (`workflow.wrap-up.maxIterations` default 5), so it typically produces one promotion commit before the manager emits `workflow.finish` and closes the session.

---

## ITER / EXIT Decision

Iteration cap is `workflow.wrap-up.maxIterations` (default 5) — wrap-up rarely benefits from multiple iterations. After `PASS`, the manager emits `workflow.finish` and closes the session.

---

## Output

The canonical tree is [`orchestration/templates/session-tree.md`](../templates/session-tree.md); Wrap-up's loop dir is `5-wrap-up/`.

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/
├── transcripts/                ← single session-root surface; {role}-{agentId}.jsonl per agent, all loops
└── 5-wrap-up/
    ├── outputs/              ← PASS-iter output files (e.g., handoff, shipped-summary)
    ├── working/
    ├── staging/
    └── evaluation/
        └── iter{n}/
            ├── claude/{perspective}.md
            └── codex/{perspective}.md
```

Plus any new mistake entries and memory updates under `.gobbi/projects/{project-name}/`.

---

## Cross-references

- Assistant's wrap-up procedure → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Memory promotion → [`record/SKILL.md`](../../record/SKILL.md)
