# Workflow — Wrap-up (Orchestration)

**Doc kind:** loop-orchestration.
**Purpose:** the manager orchestrates the Wrap-up Loop — it runs the four sub-phases
DISCUSSION → WORK → EVALUATION → RECORD, then the ITER / EXIT decision; it does NOT perform
the assistant consolidation procedure. Wrap-up runs once at the end of every workflow session
and **closes the session**: it emits `workflow.finish`, writes the handoff summary, and cleans
scratch state.

---

## DISCUSSION Orchestration

**Manager's job**: confirm with the user that the session is ready to wrap up.

The manager:
1. Surfaces a summary of what the session shipped (artifacts produced, tasks executed, evaluator verdicts).
2. Asks through the active runtime's user-decision primitive: is there anything deferred or open that should be added to the wrap-up before the session closes?
3. If the user adds items, records them as wrap-up inputs.
4. Constructs the assistant delegation prompt per [delegation prompt requirements](../../delegation/SKILL.md#what-every-delegation-prompt-contains).

---

## WORK Orchestration

**Manager's job**: spawn the `assistant` agent with the wrap-up delegation prompt. The assistant consolidates artifacts, writes the handoff summary, and cleans scratch state per [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md).

> **Production owner:** [`workflow/production.md`](production.md). This doc names only that
> Wrap-up WORK may run dual-system production (`propose.mode: dual`, default). Do not restate
> proposer spawn, freeze, selective integration, gap classification, or degraded-mode rules.
> **Wrap-up delta:** the proposer does not collide with the non-skippable stage-3 evaluation
> independence — the Codex proposal transcript never enters the Codex evaluator prompt.

---

## EVALUATION Orchestration

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Wrap-up specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract). Wrap-up evaluation is non-skippable per [`wrap-up/evaluation.md`](../../wrap-up/evaluation.md)
- **Output path**: per-iter scoped under `sessions/{date}-{session-id}/5-wrap-up/evaluation/iter{n}/{system}/` — nine files per system: `{perspective}.md` (seven), `overall.md`, and the filled `checklist.md`
- Phase-specific focus: synthesis coverage, explicit open items, mistake extraction, promotion-routing audit (per [`wrap-up/evaluation.md`](../../wrap-up/evaluation.md))

---

## RECORD Orchestration

**Manager's job**: spawn the `assistant` agent for synthesis per [`workflow/record.md`](record.md). For Wrap-up, the canonical artifact is the handoff summary itself plus any final updates to memory.

### What Wrap-up commits — promotion writes, not session record

> **Record owner:** [`workflow/record.md`](record.md) for manager spawn + the validation
> gates (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md)
> for the assistant procedure. Wrap-up keeps only its own promotion commit (below).

What Wrap-up **does** commit is its **promotion writes**: copying promotable `staging/` content into **tracked** memory — `features/`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc. Those targets are NOT under gitignored `sessions/`, so the commit is real. This is the only durable output of the session; it lands on the worktree branch (per `orchestration/SKILL.md § Configuration Step 1` row 1 (Create Worktree)) and is absorbed into the PR at merge. Use the canonical `AI-Provenance-Record:` trailer per [`git/conventions.md` § Commit Trailers](../../git/conventions.md#commit-trailers). Wrap-up usually runs a single iteration (`workflow.wrap-up.maxIterations` — Auto 5; Chat 3), so it typically produces one promotion commit before the manager emits `workflow.finish` and closes the session.

---

## ITER / EXIT

Iteration cap is `workflow.wrap-up.maxIterations` (Auto 5; Chat 3) — wrap-up rarely benefits from multiple iterations. After `PASS`, the manager emits `workflow.finish` and closes the session.

---

## Output Pointers

Wrap-up's loop dir is `5-wrap-up/`. Loop-specific files: WORK draft `working/draft-iter{n}.md`
(the handoff / shipped-summary); optional Codex proposal
`working/proposals/codex/draft-iter{n}.md` + Integration Log `working/reconciliation-iter{n}.md`;
evaluation `evaluation/iter{n}/{system}/{perspective}.md` + `overall.md` + `checklist.md`; PASS outputs
`outputs/{free-filename}.md`; staging `staging/{type}/{slug}.md`. Wrap-up's durable output is
its promotion writes into tracked memory under `.gobbi/projects/{project-name}/` (new mistake
entries + memory updates) — the commit boundary for those is in [What Wrap-up commits](#what-wrap-up-commits--promotion-writes-not-session-record).

> **Path owner:** [`record/record-map.md`](../../record/record-map.md). The full session tree,
> 4-slot interior, and PASS-only `outputs/` lifecycle live there — never redrawn here.

---

## Cross-references

- Assistant's wrap-up procedure → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Proposer orchestration → [`workflow/production.md`](production.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Memory promotion → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
