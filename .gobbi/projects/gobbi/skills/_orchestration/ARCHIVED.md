# _orchestration — Archived (deprecated in v0.5.0)

> Historical reference for gobbi v0.4.x's skill-based 7-step orchestration.
> The skill remains on disk (per CP6) but is no longer loaded by the v0.5.0
> workflow machinery. Workflow control now lives in the CLI's step specs
> at `packages/cli/src/specs/` and is driven by `gobbi workflow init`.

---

## Why this skill existed

Gobbi v0.4.x needed an orchestration contract — a document that told the agent
how to run a workflow: when to ideate, when to plan, when to execute, when to
review. The `_orchestration` skill was that contract. Agents loaded it at
session start and used its seven named steps as a cognitive checklist.

The seven-step cycle (Ideation → Plan → Research → Execution → Collection →
Memorization → Review) represented the accumulated learning from many gobbi
sessions. Each step earned its place by catching a class of recurring failures:
Research prevented poorly-scoped execution; Collection prevented notes from
disappearing; Memorization prevented session-to-session re-discovery; Review
prevented unreviewed work from shipping.

The skill embedded the contract as prose. Agents read the narrative, internalized
the steps, and followed them — at least in principle. For short sessions on
well-scoped tasks, this worked well. The orchestrator kept pace with the seven
steps and produced consistent results.

Importantly, v0.4.x's workflow knowledge lived in a single file that could be
updated without a code release. A new step, a modified constraint, a renamed
phase: one pull request, no version bump. That flexibility was a real advantage
when the workflow was still evolving.

---

## Why it was replaced in v0.5.0

Prose contracts are unmeasurable. There is no mechanism to verify that an agent
followed Step 3 (Research) before starting Step 4 (Execution), or that Step 5
(Collection) actually ran before Step 6 (Memorization). The contract is
advisory — an agent that skips Collection loses no more than a warning in the
review step.

The gobbi `v050-overview.md` design document describes this as the
guidance-based orchestration failure mode: "The orchestrator skips collection
because the task felt done. It forgets memorization because the conversation was
long. These are not bugs that can be fixed with better instructions — they are
the structural consequence of 'guidance' as the control mechanism."

Three specific drift patterns drove the replacement decision:

First, step-skipping was silent. Agents would jump from Execution to Review
without Collection or Memorization. Notes never landed on disk. The next session
re-discovered context that was already paid for.

Second, Research was expensive and inconsistently applied. For genuinely novel
problems it was essential; for familiar work it added overhead without value.
The prose contract offered no mechanism for the system to apply Research
selectively — only the agent's judgment, which varied.

Third, writing to `.claude/` mid-session triggered Claude Code context reload.
The `_orchestration` skill instructed agents to update gotchas and project docs
during Collection. Writing to a monitored directory caused session stalls.

V0.5.0 moves workflow control into a state machine encoded in JSON specs under
`packages/cli/src/specs/`. The CLI reads state, determines the active step, and
generates a bounded prompt that contains only the instructions relevant to that
step. The orchestrator cannot skip Collection because it never receives the
Execution-step prompt and the Memorization-step prompt simultaneously.

---

## 7-step → v0.5.0 mapping

| v0.4.x step | v0.5.0 equivalent |
|---|---|
| Step 1 Ideation | Ideation step spec (`packages/cli/src/specs/ideation/spec.json`). Discussion with the user and stance-based exploration are internal loops within this step. |
| Step 2 Plan | Plan step spec (`packages/cli/src/specs/plan/spec.json`). Decomposition, delegation assignments, and verification criteria remain the same; the CLI generates the step prompt from state. |
| Step 3 Research | Absorbed into Ideation's internal loop (per `design/v050-overview.md` §The Workflow). Researcher stances (`_innovation`, `_best-practice`) are still loaded — now as sub-agent instructions within the Ideation step spec rather than as a separate workflow gate. |
| Step 4 Execution | Execution step spec (`packages/cli/src/specs/execution/spec.json`). One task at a time, verified before next — same discipline, enforced by the state machine rather than by prose. |
| Step 5 Collection | SubagentStop hook auto-capture via `gobbi workflow capture-subagent`. Notes no longer require a manual `gobbi note collect` call mid-workflow. The hook fires automatically when a subagent completes and writes the transcript extract to `.gobbi/sessions/{id}/`. |
| Step 6 Memorization | Memorization step spec (`packages/cli/src/specs/memorization/spec.json`), which absorbs the former Collection step. Reading the conversation log and extracting decisions into `.gobbi/project/` is now a single bounded step, not two separate ones. |
| Step 7 Review | Evaluation step spec (`packages/cli/src/specs/evaluation/spec.json`). Evaluation is now a first-class step — mandatory after Execution, optional at Ideation and Plan. The v0.5.0 model treats evaluation as a loop-back gate, not a final verdict: the step can return to any prior step, not just the immediately preceding one. |

---

## Concept glossary

Terms v0.4.x agents and users will search for, mapped to where their v0.5.0
equivalents live.

**FEEDBACK phase** — the v0.4.x FEEDBACK cycle (lightweight fix loop after
Review) maps to the Evaluation step's loop-back transitions in v0.5.0. When
evaluation directs a return to Execution or Plan, the state machine drives that
transition. For user-facing resume semantics, see `gobbi workflow resume`
(documented in `design/v050-cli.md`).

**Structured routine** — the v0.4.x tier for tasks with a known execution
pattern (skip Ideation, Plan, Research; go directly to Execution). In v0.5.0,
workflow variants (`feedback-`, `error-`, and normal variants per
`design/v050-prompts.md`) serve the same differentiation. A structured routine
becomes a session initialized with the appropriate variant rather than a
skip-tier classification by the orchestrator.

**Collection (Step 5)** — replaced by the SubagentStop hook and
`gobbi workflow capture-subagent`. Collection is now automatic. The note
directory during a session is `.gobbi/sessions/{session-id}/` (runtime). The
retrospective archive for a completed task still lands in
`.claude/project/{project-name}/note/` after the session closes.

**Note directory** — two locations now serve different purposes. During a
session: `.gobbi/sessions/{session-id}/` is the write target (runtime state,
not monitored by Claude Code). After a session: `.claude/project/{project-name}/note/{YYYYMMDD-HHMM}-{slug}-{id}/`
is the retrospective archive (per `design/v050-overview.md` §The Directory
Split).

**PI agent** — the Innovative and Best stance agents from v0.4.x Ideation and
Review steps. Still exist and are still loaded. Now an implementation detail of
the Ideation step spec rather than a top-level workflow concept; users see only
the step output.

**Research stance** — stance skills `_innovation` and `_best-practice` still
exist and are invoked by the Ideation step spec as sub-agent instructions.
The user-facing difference: Research is no longer a gated step with its own
AskUserQuestion checkpoint. It is an internal loop within Ideation.

**Plan agent** — the Plan step spec drives planning in v0.5.0. The
human-driven plan mode (`EnterPlanMode` in Claude Code) remains orthogonal to
the workflow state machine and is still used inside the Plan step.

**Ideation discussion-first** — encoded in the Ideation step spec as a required
predicate. The orchestrator cannot bypass the discussion gate because the
Ideation prompt does not advance until the predicate clears.

**Ask-each-time / always-evaluate / skip-evaluation** — these v0.4.x session
flags map to the `evaluationMode` session config. The evaluation decision is
now captured at `gobbi workflow init` as a `workflow.eval.decide` event stored
in `gobbi.db`. The Evaluation step spec reads `evalConfig` from state and
applies the decision automatically — no per-step AskUserQuestion required.

**`gobbi note collect`** — the v0.4.x command for extracting subagent output
from transcripts. Still available but no longer the primary collection path.
The SubagentStop hook handles transcript extraction automatically via
`gobbi workflow capture-subagent`. Manual `gobbi note collect` calls are
reserved for recovery scenarios where the hook did not fire.

---

## What to read instead

For v0.5.0 workflow guidance:

- `.claude/CLAUDE.md` — project-level workflow principles and the 5-step cycle.
- `.claude/skills/gobbi/SKILL.md` — session-bootstrap entry point for `/gobbi`.
- `.claude/project/gobbi/design/v050-overview.md` — v0.5.0 architecture overview, drift pathology rationale, directory split.
- `.claude/project/gobbi/design/v050-cli.md` — CLI command surface, `gobbi workflow *` command reference.
- `.claude/project/gobbi/design/v050-hooks.md` — hook-to-CLI wiring, SubagentStop capture details.

---

## Migration path

If a prior session loaded `_orchestration` and you are resuming under v0.5.0,
run `gobbi workflow init` to bootstrap a v0.5.0 session and continue there.
The session directory at `.gobbi/sessions/{id}/` is created fresh; prior note
files in `.claude/project/{project-name}/note/` remain intact and readable.

See `MIGRATION.md` at the repo root for user-facing migration guidance,
including restoration paths for notification hooks and upgrade verification
commands.
