# Workflow — Ideation (Orchestration)

How the **manager** orchestrates the Ideation Loop. The `leader`, `evaluator`, and `assistant` specialists that participate load [`ideation/SKILL.md`](../../ideation/SKILL.md) for the loop contract, [`research/SKILL.md`](../../research/SKILL.md) when doing Sub-step C research, [`evaluation/SKILL.md`](../../evaluation/SKILL.md) for the per-perspective procedure, and [`record/SKILL.md`](../../record/SKILL.md) for template-stamping conventions.

**Ideation focuses on What / Why / How.** Planning concentrates on Who / When / Where; the Ideation Loop's job is to lock the **idea**, not the execution plan.

The Ideation Loop runs the four-phase iteration shape — `DISCUSSION` → `WORK` → `EVALUATION` → `MEMORIZATION` → `ITER / EXIT`. Phase semantics for Ideation:

| Phase | Content semantics for Ideation |
|---|---|
| `DISCUSSION` | Manager + user + leader (research-backed opinion) work through four sub-steps (A Frame What/Why / B Lock Scope / C Research / D Design). Every decision is settled through the active runtime's user-decision primitive before WORK begins. |
| `WORK` | Leader documents the DISCUSSION outcome into the canonical working draft and stages reference + backlog artifacts under `sessions/{date}-{session-id}/1-ideation/staging/`. Documentation + session-memory staging — no new content. |
| `EVALUATION` | Dual-system evaluators (Claude Code + Codex) run the four-stage procedure across all seven perspectives + Overall. Manager reconciles into a `PASS` / `REVISE` verdict. |
| `MEMORIZATION` | Assistant runs **after every EVALUATION** (PASS or REVISE) to preserve the iteration's transcript and update `session.json`. On `PASS` it additionally emits the loop's `outputs/` files and stages typed-finding artifacts under `staging/`. **No writes to project memory** — Wrap-up handles session → project promotion. |

---

## DISCUSSION Phase (manager + user + leader)

**Manager's job**: orchestrate the What / Why / How discussion with the user, spawning the `leader` for research-backed opinion at the right moments. The detailed sub-step content (forcing questions, Scope Contract template, research procedure, design decisions, evaluation criteria) lives in [`ideation/SKILL.md`](../../ideation/SKILL.md); this section covers the **orchestration choreography**.

### Leader spawn pattern

The leader does **not** observe the entire user dialogue. The manager spawns the leader **as needed** to retrieve research-backed input on the next decision point, then continues the user discussion with that input:

```
manager → opens DISCUSSION with user (states framed problem at high level)
manager → spawns leader for Sub-step A: "research root cause / impact / prior attempts; build steel-man counterfactual; apply re-framing check"
leader → researches + returns to manager
manager → presents leader's findings as draft proposals → active runtime's user-decision primitive → user decides
manager → spawns leader again for Sub-step B (Lock Scope), then Sub-step C (Research, loads research skill), etc.
...
```

Multiple leader spawns are normal. MEMORIZATION preserves the leader's record as the audit trail for "what research informed each decision". Under **fresh spawns**, that record is the full set of per-spawn leader transcripts. Under **Claude Code leader continuation** (one teammate carried across sub-steps — see below), it is the single continued-leader transcript that spans those turns; one transcript across turns still preserves the whole research chain, so continuation does not lose audit coverage. Native Codex uses fresh leader spawns with full Load Directives.

### Leader continuation across sub-steps (Claude Code Agent Teams)

The leader spawn pattern above describes the **fresh-spawn fallback** — the manager re-spawns the leader for each sub-step. Where Claude Code Agent Teams is enabled, the manager instead **continues** the same leader teammate across Sub-steps A→B→C→D→WORK, which is the strongest in-loop token saver: the teammate keeps the framed problem, scope, and insights in-context, so it does not re-derive root-cause or re-read `features/`/`mistakes/` each sub-step. Native Codex does not use this continuation path.

The decision rule, the delta-brief shape, and the evaluator-FORBIDDEN wall live in [`delegation/SKILL.md` § Continue vs Fresh](../../delegation/SKILL.md#continue-vs-fresh); this section states only the Ideation-specific choreography.

- **In-loop (A→B→C→D→WORK), Claude Code team + session live → CONTINUE.** The first sub-step spawns the leader with the full Load Directives stack; each later sub-step sends a delta-brief (next sub-step's goal + new inputs + re-stated scope + status), not a full re-paste.
- **Cross-loop (Ideation→Preparation→Planning), Claude Code only → CONTINUE best-effort, live-only.** A single leader teammate may carry the same problem understanding downstream **only while the team + session stay live**. It DEGRADES to a fresh, re-primed teammate at the first `/compact`, `/clear`, or resume — an in-process teammate does not survive any of those. Cross-loop continuation is therefore best-effort, never a promised single persistent leader spanning all loops.
- **Fresh-spawn fallback.** If Agent Teams is off (`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` unset), the runtime is native Codex, or the teammate has died, the manager fresh-spawns with a full brief and re-primes from durable session memory (`working/`, `staging/`, `state.json`). Continuation is preferred-where-safe, never a hard dependency.

### Sub-step orchestration

The manager runs the user through four sub-steps in order. Each is gated by the active runtime's user-decision primitive before advancing.

| # | Sub-step | Manager's role | Leader's contribution |
|---|---|---|---|
| A | Frame What and Why | Run the **six forcing questions** through the active runtime's user-decision primitive: root cause / impact / success criteria / prior attempts / counterfactual (steel-man) / re-framing check | Research root cause / impact / prior attempts; build steel-man counterfactual; apply re-framing check; draft answers for user to refine |
| B | Lock Scope (Project-Feature-Task contract) | Run decomposition discussion; use the active runtime's user-decision primitive to pick the workflow's task and lock the Scope Contract | Enumerate candidate tasks; propose pick based on dependency analysis; provide field values for the Scope Contract template |
| C | Research | Present leader's internal + external insights to user **separately**; let user push back / refine | Load [`research/SKILL.md`](../../research/SKILL.md); run Internal Research and External Research deeply; extract insights using the Insight format. Internal and external insights are managed independently |
| D | Design | Present leader's scenarios + checklist + directional design decisions + validation strategy to user; iterate until satisfied | Propose scenarios (golden / edge / failure / adversarial); anchored implementation checklist; **directional design decisions** (library / framework / design pattern / API shape / etc.) with rationale anchored to insights. Detailed mechanism deferred to Execution |

After Sub-step B, the manager stamps `project`, `feature`, `task` into `session.json` (top-level fields) and bootstraps the **session loop directory** at `sessions/{date}-{session-id}/1-ideation/{working,staging,evaluation,outputs}/` (the 4-slot interior per [`orchestration/templates/session-tree.md`](../templates/session-tree.md)). The manager does **not** touch `features/{feature-name}/...` during Ideation; that path is owned by Wrap-up's project-memory promotion.

### When to escalate to user

The leader brings draft proposals; the user makes final calls. Every decision below requires the active runtime's user-decision primitive:

- Confirmation of the framed problem — all six forcing questions (Sub-step A)
- Re-framing go/no-go (Sub-step A, question 6)
- Scope Contract confirmation (Sub-step B)
- Backlog routing of non-chosen candidates (Sub-step B)
- Insight acceptance / rejection — internal AND external, surfaced separately (Sub-step C)
- Scenario list completeness (Sub-step D)
- Design decision direction when alternatives exist (Sub-step D)
- Contribution points surfaced by leader at any sub-step

---

## WORK Phase (leader documents + stages)

**Manager's job**: spawn the leader for documentation + session-memory staging. The leader's job in WORK is to record what was decided in DISCUSSION into a draft at `sessions/{date}-{session-id}/1-ideation/working/draft-iter{n}.md` and to stage reference + backlog artifacts under `sessions/{date}-{session-id}/1-ideation/staging/`.

Manager-side responsibilities:
- Confirm the leader's working draft contains every required section (Scope Contract / Framed Problem / Research Insights / Scenarios / Implementation Checklist / Design / Decisions Log)
- Stage the draft in `working/` along with prior leader transcripts (research turns from DISCUSSION)
- Verify staged artifacts under `staging/{references,backlogs/feature,backlogs/project}/` match the Sub-step B and Sub-step C decision lists
- On re-entry from a `REVISE` ITER, pass prior evaluator findings as additional input — the leader incorporates the corrections during the next DISCUSSION round, then re-documents

WORK is short by design. The substantive thinking happened in DISCUSSION; WORK formalizes and stages it. **No writes to project memory** — every output lives under `sessions/{date}-{session-id}/1-ideation/`.

---

## EVALUATION Phase (delegated to evaluators)

**Manager's job**: orchestrate the dual-system evaluator spawn per [`workflow/evaluation.md`](evaluation.md). Ideation-specific notes:

- **Perspectives**: all seven + Overall (no pruning per evaluation contract) — Project / Structure / Performance / Aesthetics / Usage / Consistency / Risk
- **Cross-system divergence** is derived by comparing per-system files at MEMORIZATION; no separate divergence file is written

Verdict is `PASS` or `REVISE`. **Both verdicts advance to MEMORIZATION first** (so each iteration's transcript + `session.json` entry is preserved regardless of outcome). The ITER / EXIT decision happens after MEMORIZATION.

---

## MEMORIZATION Phase (delegated to `assistant`, runs every iter)

**Manager's job**: spawn the `assistant` agent after every EVALUATION verdict — `PASS` or `REVISE`. The assistant follows [`ideation/SKILL.md` § MEMORIZATION Phase](../../ideation/SKILL.md#record-phase) and [`record/SKILL.md`](../../record/SKILL.md) for template-stamping.

Every iteration the assistant:
- Copies each agent's transcript into the single session-root `sessions/{date}-{session-id}/transcripts/{role}-{agentId}.jsonl` (one immutable per-agent file accumulating across all loops — see [`orchestration/templates/session-tree.md`](../templates/session-tree.md)); there is no per-loop `transcripts/` dir
- Appends `{iter: n, verdict, finishedAt}` to `session.json.workflow.ideation.iterations[]`

Only on `PASS` the assistant additionally:
- Emits the canonical `sessions/{date}-{session-id}/1-ideation/outputs/`
- Stages typed-finding artifacts under `sessions/{date}-{session-id}/1-ideation/staging/{scenarios,checklists,decisions,references,design,discussions}/`
- Sets `session.json.workflow.ideation.finishedAt` and the loop's final `verdict: PASS`

**No writes to project memory** under any verdict. All session staging waits for Wrap-up to promote to `features/{feature-name}/...` after the workflow completes.

### Per-iteration session memory is NOT committed (gitignored)

There is **no** per-iteration session-memory commit. The whole `sessions/` tree is gitignored (`.gitignore:21`), worktree-local, and removed at worktree cleanup (D7 — see [`orchestration/templates/session-tree.md`](../templates/session-tree.md)). A `git commit` aimed at the iteration's `working/`, `evaluation/iter{n}/`, `staging/`, or `outputs/` content captures **nothing**: `git add` of a `sessions/` path is refused (`paths are ignored ... Use -f`), and a bare `git commit` reports `nothing to commit, working tree clean` and exits non-zero. So the manager does **not** run a `chore(session): record ...` commit after MEMORIZATION.

Iteration boundaries are recorded in `session.json.workflow.ideation.iterations[]`, not in git. Durable cross-session memory exists **only** via Wrap-up promotion: Wrap-up copies promotable `staging/` content into tracked `features/`, `mistakes/`, `rules/`, `design/`, `notes/`, `backlogs/`, etc. Only promoted content survives the session.

---

## ITER / EXIT Decision

After `MEMORIZATION` (which always runs), the manager decides based on the reconciled verdict:

| Verdict | Action |
|---|---|
| `PASS` | Exit the loop; advance to Planning Loop. `outputs/` files + `staging/` artifacts are ready for Wrap-up's project-memory promotion |
| `REVISE` | Re-enter `DISCUSSION` with evaluator findings as additional input. The current iter's draft + evaluation files are preserved under `working/` and `evaluation/`; the transcript is preserved in the session-root `transcripts/` |
| `FAIL` | Escalate through the active runtime's user-decision primitive; user decides revise / abort / reframe |
| `SKIPPED` | Exit the loop (Ideation was skipped per settings) |

Iteration cap: `workflow.ideation.maxIterations` (default 5). When the cap is reached without `PASS`, the manager forces user escalation.

---

## Output

The canonical tree is [`orchestration/templates/session-tree.md`](../templates/session-tree.md); Ideation's loop dir is `1-ideation/`.

```
.gobbi/projects/{project}/sessions/{date}-{session-id}/
├── transcripts/                       ← single session-root surface; {role}-{agentId}.jsonl per agent, all loops (MEMORIZATION copies in)
└── 1-ideation/
    ├── outputs/             ← PASS-iter output files (free filenames + mandatory frontmatter; assistant, MEMORIZATION, PASS only)
    ├── working/
    │   ├── draft-iter{n}.md           ← leader's working draft per iteration (WORK)
    │   ├── discussion-log.md          ← manager-captured user-decision exchanges
    │   └── research/{slug}.md         ← pre-staging external refs (leader)
    ├── evaluation/
    │   └── iter{n}/
    │       ├── claude/{perspective}.md
    │       └── codex/{perspective}.md
    └── staging/                ← session-staged artifacts, promoted to project memory by Wrap-up
        ├── references/{slug}.md
        ├── backlogs/feature/{slug}.md
        ├── backlogs/project/{slug}.md
        ├── scenarios/{slug}.md      ← PASS-only (from scenario_gap findings)
        ├── checklists/{slug}.md     ← PASS-only (from checklist_gap findings)
        ├── decisions/{slug}.md      ← PASS-only (from design_flaw / assumption_risk findings)
        ├── design/{slug}.md         ← PASS-only (from canonical Design section)
        └── discussions/{slug}.md    ← PASS-only (from discussion log)
```

Plus updates to `sessions/{date}-{session-id}/session.json` — `workflow.ideation.iterations[]` appended every iter; `workflow.ideation.finishedAt` + final `verdict` set on PASS.

**No writes to project memory** during Ideation. The `features/{feature-name}/...` tree is created and populated by Wrap-up using `staging/` as the source — see [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md).

---

## Cross-references

- Leader's discussion + documentation procedure → [`ideation/SKILL.md`](../../ideation/SKILL.md)
- Internal + external research procedure → [`research/SKILL.md`](../../research/SKILL.md)
- Evaluator orchestration → [`workflow/evaluation.md`](evaluation.md)
- Assistant's MEMORIZATION procedure (templates + routing) → [`record/SKILL.md`](../../record/SKILL.md)
- Synthesis orchestration → [`workflow/record.md`](record.md)
- Wrap-up's project-memory promotion → [`wrap-up/SKILL.md`](../../wrap-up/SKILL.md)
- Discussion mechanics → [`discussion/SKILL.md`](../../discussion/SKILL.md)
- Delegation patterns → [`delegation/SKILL.md`](../../delegation/SKILL.md)
