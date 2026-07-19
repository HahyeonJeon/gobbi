# Workflow — Ideation (Orchestration)

**Doc kind:** loop-orchestration.
**Purpose:** the manager drives Ideation until the idea (What / Why / How) is concrete
enough to plan against. It runs the four sub-phases — DISCUSSION → WORK → EVALUATION →
RECORD — then the ITER / EXIT decision; it does NOT perform the leader / evaluator /
assistant procedures. Planning owns Who / When / Where.

> **Procedure owner:** [`ideation/SKILL.md`](../../ideation/SKILL.md). This doc keeps only
> manager spawn, inputs, user gates, and exit checks — do not copy the peer procedure.
> **Path owner:** [`record/record-map.md`](../../record/record-map.md). Do not redraw the
> session tree — name only Ideation's dir and loop-specific files.

## Manager Entry

Enter with the user's initial framing (or the prior `REVISE` findings); feature memory +
project `mistakes/` / `rules/` / `design/`; codebase + `git log` for the touched area.
After Sub-step B the manager stamps `project` / `feature` / `task` into `session.json` and
bootstraps `1-ideation/{working,staging,evaluation}/` — NOT `outputs/` (PASS-only). Never
touch `features/{feature-name}/...` (Wrap-up owns it).

## DISCUSSION Orchestration

The manager spawns (or continues) the `leader` as needed for research-backed input on the
next decision, then continues the user dialogue; multiple spawns are normal. The full
sub-step procedure lives in the Procedure owner. The manager runs A→D in order, each gated
by the user-decision primitive — the **User decides** column is the escalation set:

| # | Sub-step | Leader brings | User decides |
|---|---|---|---|
| A | Frame What/Why | root cause / impact / success criteria / prior attempts / steel-man / re-framing | the six forcing questions + re-framing go/no-go |
| B | Lock Scope | candidate `{Project,Feature,Task}` triplets + dependency pick | the Scope Contract + backlog routing of non-picked candidates |
| C | Research | internal + external insights, presented separately | insight accept/reject on each surface |
| D | Design | scenarios + anchored checklist + directional design decisions | scenario completeness + design direction |

Plus any contribution point the leader surfaces. DISCUSSION is done when the Scope Contract
and decision set are user-locked and explicit enough for WORK to document with no new design.

**Leader continuation (Claude Code Agent Teams).** The manager continues ONE leader
teammate across A→B→C→D→WORK via delta-briefs — the strongest in-loop token saver.
Decision rule + evaluator-FORBIDDEN wall:
[`orchestration/delegation.md § Continue vs Fresh`](../delegation.md#continue-vs-fresh).
Fresh-spawn fallback when Agent Teams is off, the runtime is native Codex, or the teammate
died (`/compact` / `/clear` / resume kill it).

## WORK Orchestration

The manager spawns (or continues) the leader to DOCUMENT only what DISCUSSION approved —
no new content. **Completion proof:** `1-ideation/working/draft-iter{n}.md` carries all 7
sections (Scope Contract / Framed Problem / Research Insights / Scenarios / Implementation
Checklist / Design / Decisions Log); one `staging/references/{slug}.md` per confirmed
external insight; `staging/backlogs/{feature,project}/` matches the Sub-step B/C lists; the
Decisions Log cites the user-decision outcomes. No memory writes.

> **Production owner:** [`workflow/production.md`](production.md). This doc names only that
> Ideation WORK may run dual-system production (`propose.mode: dual`, default). Do not
> restate proposer spawn, freeze, selective integration, gap classification, or
> degraded-mode rules.

## EVALUATION Orchestration

> **Evaluation owner:** [`workflow/evaluation.md`](evaluation.md) for manager spawn,
> reconciliation, safety gates, and failure handling; [`evaluation/SKILL.md`](../../evaluation/SKILL.md)
> for the evaluator's four-stage procedure.

Pass the working draft, staged references + backlogs, the Scope Contract, and the
discussion log; all seven perspectives + Overall, no pruning. Done when the per-system
files under `1-ideation/evaluation/iter{n}/{claude,codex}/` + the reconciled verdict exist.
Cross-system divergence is derived at RECORD, not written to a file.

## RECORD Orchestration

> **Record owner:** [`workflow/record.md`](record.md) for manager spawn + the validation
> gates (incl. the session-record commit boundary); [`record/SKILL.md`](../../record/SKILL.md)
> for the assistant procedure.

The manager spawns one `assistant` after every verdict. **Ideation delta:** `outputs/` is
PASS-only — NOT in the loop-entry scaffold. Every iter, the assistant copies the transcript
+ upserts `session.json.workflow.ideation.iterations[]`; on PASS it also writes
`1-ideation/outputs/`, stages typed findings + derivatives, and sets `finishedAt` +
`verdict: PASS`. No memory write during Ideation; Wrap-up promotes.

## ITER / EXIT

| Verdict | Manager action |
|---|---|
| `PASS` | Exit; advance to the **Planning Loop** in either mode. Planning DISCUSSION runs the readiness entry gate before decomposition. `outputs/` + `staging/` are ready for its inventory and later Wrap-up promotion |
| `REVISE` | Re-enter DISCUSSION with evaluator findings as input; increment the iter counter |
| `FAIL` | **Safety-gate escalation to the user** (revise / abort-ideation / accept-with-deferral) — never auto-re-entered as a REVISE |
| `SKIPPED` | Exit if settings skipped Ideation |

Iteration cap: `workflow.ideation.maxIterations` (default 5). At the cap without `PASS`,
the manager escalates to the user.

## Output Pointers

Ideation's loop dir is `1-ideation/`. Loop-specific files: WORK draft
`working/draft-iter{n}.md`; optional Codex proposal `working/proposals/codex/draft-iter{n}.md`
+ Integration Log `working/reconciliation-iter{n}.md`; evaluation
`evaluation/iter{n}/{system}/{perspective}.md` + `overall.md` + `checklist.md`; PASS outputs
`outputs/{free-filename}.md`; staging `staging/{scenarios,checklists,decisions,references,design,discussions,backlogs/{feature,project}}/{slug}.md`.
The full session tree, 4-slot interior, and PASS-only `outputs/` lifecycle are owned by the
Path owner — never redrawn here.

## Cross-references

- Ideation peer procedure → [`ideation/SKILL.md`](../../ideation/SKILL.md)
- Research procedure → [`research/SKILL.md`](../../research/SKILL.md)
- Production orchestration → [`workflow/production.md`](production.md)
- Evaluation orchestration → [`workflow/evaluation.md`](evaluation.md)
- RECORD orchestration + assistant procedure → [`workflow/record.md`](record.md), [`record/SKILL.md`](../../record/SKILL.md)
- Session path owner → [`record/record-map.md`](../../record/record-map.md)
- Delegation patterns → [`orchestration/delegation.md`](../delegation.md)
